/**
 * How the site turns a video master into what it serves, shared by
 * scripts/encode-feed.mjs (every reel) and scripts/self-host-fiverr-media.mjs
 * (the delivered videos on the Fiverr reviews), so both follow one quality rule:
 *
 *   • SDR, upright, ≤ 1080 px on the short side: the master's own streams,
 *     repackaged as fast-start MP4 (zero generation loss)
 *   • HDR, rotated, or larger: near-transparent encode (x265 CRF 18 /
 *     x264 CRF 17), 4K delivered at 1440 on the short side
 *
 * See changes/2026-10-14-feed-video-delivery.md for the measurements behind it.
 */
import { spawn } from 'node:child_process';
import { readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

export const CACHE_CONTROL = 'public, max-age=31536000, immutable';

/** Short side kept as-is up to this; larger masters (4K) go to 1440. */
export const PASSTHROUGH_MAX_SHORT_SIDE = 1080;
export const LARGE_SHORT_SIDE = 1440;

// Near-transparent, for the files that have to be encoded. The caps only stop
// a single scene from spiking; they sit above what these masters need.
export const ENCODERS = {
  hevc: (gop, large) => [
    '-c:v', 'libx265', '-preset', 'slow', '-tag:v', 'hvc1', '-profile:v', 'main',
    '-crf', '18', '-maxrate', large ? '24000k' : '20000k', '-bufsize', large ? '36000k' : '30000k',
    '-x265-params', `keyint=${gop}:min-keyint=${gop / 2}:no-open-gop=1:aq-mode=3:log-level=error`,
  ],
  avc: (gop, large) => [
    '-c:v', 'libx264', '-preset', 'slow', '-profile:v', 'high', '-level:v', large ? '5.1' : '4.2',
    '-crf', '17', '-maxrate', large ? '30000k' : '24000k', '-bufsize', large ? '45000k' : '36000k',
    '-x264-params', `keyint=${gop}:min-keyint=${gop / 2}:aq-mode=3`,
  ],
};

export const run = (command, commandArgs, { capture = false, env } = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, { env, stdio: capture ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'ignore', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(`${command} exited ${code}: ${stderr.trim().slice(-600)}`));
    });
  });

export const probe = async (file) => {
  const json = JSON.parse(await run('ffprobe', [
    '-v', 'error', '-print_format', 'json',
    '-show_entries', 'stream=codec_type,codec_name,width,height,r_frame_rate,color_transfer:stream_side_data=rotation:format=duration',
    file,
  ], { capture: true }));
  const stream = json.streams.find((s) => s.codec_type === 'video');
  const audio = json.streams.find((s) => s.codec_type === 'audio');
  const [num, den] = stream.r_frame_rate.split('/').map(Number);
  const rotation = Math.abs(stream.side_data_list?.find((d) => d.rotation !== undefined)?.rotation ?? 0);
  const turned = rotation === 90 || rotation === 270;
  return {
    codec: stream.codec_name === 'hevc' ? 'hevc' : 'avc',
    width: turned ? stream.height : stream.width,
    height: turned ? stream.width : stream.height,
    rotated: rotation !== 0,
    fps: num / (den || 1),
    hdr: ['arib-std-b67', 'smpte2084'].includes(stream.color_transfer),
    duration: Number(json.format?.duration) || 1,
    /** The audio codec, or null for a silent master. */
    audio: audio?.codec_name ?? null,
  };
};

const even = (value) => Math.max(2, Math.round(value / 2) * 2);

/** What gets delivered: the master's own size, or 1440 on the short side for 4K. */
export const sizeFor = ({ width, height }) => {
  const short = Math.min(width, height);
  if (short <= PASSTHROUGH_MAX_SHORT_SIDE) return { w: width, h: height, large: false };
  const scale = LARGE_SHORT_SIDE / short;
  return { w: even(width * scale), h: even(height * scale), large: true };
};

const STRIP = ['-map_metadata', '-1', '-map_chapters', '-1', '-movflags', '+faststart'];

/** Audio is copied when MP4 can carry it as is (AAC); anything else becomes AAC 256k. */
const audioArgs = (audio) => (audio && audio !== 'aac' ? ['-c:a', 'aac', '-b:a', '256k'] : ['-c:a', 'copy']);

/** The master's own streams, repackaged: zero generation loss. */
export const remux = (source, output, codec, { audio = 'aac' } = {}) =>
  run('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', source,
    '-map', '0:v:0', '-map', '0:a:0?', '-c:v', 'copy', ...audioArgs(audio),
    ...(codec === 'hevc' ? ['-tag:v', 'hvc1'] : []),
    ...STRIP, output,
  ]);

/**
 * `watermark` ({ file, margin }) burns a transparent PNG into the top-right
 * corner, `margin` px in from both edges, after scaling.
 */
export const encode = (source, output, { codec, size, fps, seconds, audio = 'aac', watermark }) => {
  const filters = [
    `scale=${size.w}:${size.h}:flags=lanczos`,
    `fps=${fps}`,
    'format=yuv420p',
  ].join(',');
  const picture = watermark
    ? [
        '-filter_complex',
        `[0:v:0]${filters}[base];[1:v]format=rgba[mark];` +
          `[base][mark]overlay=main_w-overlay_w-${watermark.margin}:${watermark.margin}:format=auto,format=yuv420p[v]`,
        '-map', '[v]',
      ]
    : ['-map', '0:v:0', '-vf', filters];
  const sound = seconds ? ['-an'] : ['-map', '0:a:0?', ...audioArgs(audio)];
  return run('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', source,
    ...(watermark ? ['-i', watermark.file] : []),
    ...(seconds ? ['-t', String(seconds)] : []),
    ...picture,
    ...ENCODERS[codec](Math.round(fps) * 2, size.large),
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
    ...sound, ...STRIP, output,
  ]);
};

// Homebrew's ffmpeg has no WebP encoder: cut a lossless PNG, then cwebp it.
export const poster = async (video, output, width) => {
  const frame = `${output}.png`;
  await run('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', video, '-frames:v', '1',
    '-vf', `scale=${width}:-2:flags=lanczos`, frame,
  ]);
  await run('cwebp', ['-quiet', '-q', '82', '-m', '6', '-sharp_yuv', frame, '-o', output]);
  rmSync(frame);
};

/** The aws CLI pointed at the R2 bucket, with the R2_* keys from .env. */
export const r2 = (root) => {
  const env = Object.fromEntries(
    readFileSync(path.join(root, '.env'), 'utf8')
      .split('\n')
      .filter((line) => /^R2_[A-Z0-9_]+=/u.test(line))
      .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1)]),
  );
  const awsEnv = {
    ...process.env,
    AWS_ACCESS_KEY_ID: env.R2_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: env.R2_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION: env.R2_REGION ?? 'auto',
    AWS_REQUEST_CHECKSUM_CALCULATION: 'when_required',
    AWS_RESPONSE_CHECKSUM_VALIDATION: 'when_required',
  };
  const aws = (awsArgs) => run('aws', [...awsArgs, '--endpoint-url', env.R2_ENDPOINT], { capture: true, env: awsEnv });
  /** Uploads unless R2 already holds a file of the same size. Returns true when it uploaded. */
  const put = async (file, key, contentType, size) => {
    const remote = await aws(['s3api', 'head-object', '--bucket', env.R2_BUCKET, '--key', key, '--query', 'ContentLength', '--output', 'text'])
      .then((out) => Number(out.trim()))
      .catch(() => -1);
    if (remote === size) return false;
    await aws(['s3', 'cp', file, `s3://${env.R2_BUCKET}/${key}`, '--content-type', contentType, '--cache-control', CACHE_CONTROL, '--no-progress']);
    return true;
  };
  return { aws, put, bucket: env.R2_BUCKET };
};
