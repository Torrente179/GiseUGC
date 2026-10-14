#!/usr/bin/env node
/**
 * The site's video files: every reel, everywhere it plays (portfolio feed,
 * hero phone, card previews, service pages, the theater).
 *
 * The site used HLS ladders and 480p preview loops, and on phones that meant a
 * soft picture and a slow start: hls.js capped the rung to the player's CSS
 * width (540p on a 3× screen), iOS opened on the 360p rung, and the first frame
 * waited on four sequential requests (master, variant, init, segment), two of
 * them uncached playlists. Every reel now plays one progressive, fast-start MP4:
 * a single request, the full picture from the first frame, cacheable at the
 * edge. One quality for everyone: the audience is on good phones and good
 * connections, so there is no lighter tier.
 *
 * Quality is the original wherever possible. A re-encode cannot beat the
 * master, and a transparent one costs more bits than the master itself: on the
 * grainy "Croma key plano cerrado" (12.6 Mbps iPhone HEVC), x265 needs ~16 Mbps
 * for VMAF 98 and the old 6 Mbps setting scored 92. So, per master:
 *   • SDR, upright, ≤ 1080 px on the short side: the original video and audio
 *     streams, untouched, repackaged as fast-start MP4 (`hevc.mp4` for an HEVC
 *     master, `avc.mp4` for an H.264 one). An HEVC master also gets an H.264
 *     copy for browsers without HEVC (x264 CRF 17, VMAF ≈ 98.5).
 *   • HDR (HLG / PQ), rotated, or larger than 1080 px: encoded near-transparent
 *     (x265 CRF 18 / x264 CRF 17). HDR goes through Apple's own HDR → SDR
 *     conversion first; the 4K master is delivered at 1440 × 2560.
 *   • a 6 s silent loop of the opening for cards and the hero, encoded at the
 *     same settings (a stream-copy cut would glitch at the loop point)
 *   • a WebP poster cut from frame 0, so poster → video is seamless
 * Location metadata and chapters are stripped from every file.
 *
 * Output:
 *   tmp/video-feed/<slug>/{,preview.}{hevc,avc}.mp4   → R2 videos/feed/<version>/<slug>/
 *   public/uploads/videos/feed/<version>/<slug>{,-sm}.webp
 *   src/data/feed-renditions.ts
 *
 * Usage:
 *   node scripts/encode-feed.mjs [--overwrite] [--only <slug,slug>] [--jobs 2] [--upload]
 *   node scripts/encode-feed.mjs --data-only   (rewrite the data file from probes)
 */
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const VERSION = 'v1';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT_DIR = path.join(ROOT, 'tmp/video-feed');
const POSTER_DIR = path.join(ROOT, `public/uploads/videos/feed/${VERSION}`);
const DATA_PATH = path.join(ROOT, 'src/data/feed-renditions.ts');
const SOURCE_DIRS = ['media-sources/legacy', 'media-sources/nuevos', 'tmp/feed-sources'].map((dir) =>
  path.join(ROOT, dir),
);
const CACHE_CONTROL = 'public, max-age=31536000, immutable';

/** Short side kept as-is up to this; larger masters (the 4K one) go to 1440. */
const PASSTHROUGH_MAX_SHORT_SIDE = 1080;
const LARGE_SHORT_SIDE = 1440;
const SM_POSTER_WIDTH = 360;
const PREVIEW_SECONDS = 6;

// Near-transparent, for the files that have to be encoded. The caps only stop
// a single scene from spiking; they sit above what these masters need.
const ENCODERS = {
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

const parseArgs = (argv) => {
  const args = { overwrite: false, upload: false, dataOnly: false, only: null, jobs: 2 };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--overwrite') args.overwrite = true;
    else if (token === '--upload') args.upload = true;
    else if (token === '--data-only') args.dataOnly = true;
    else if (token === '--only') {
      args.only = new Set(argv[i + 1].split(','));
      i += 1;
    } else if (token === '--jobs') {
      args.jobs = Math.max(1, Number.parseInt(argv[i + 1], 10) || 1);
      i += 1;
    } else throw new Error(`Unknown option: ${token}`);
  }
  return args;
};

const run = (command, commandArgs, { capture = false } = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, { stdio: capture ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'ignore', 'pipe'] });
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

/** Same rule as `feedSlugFromUrl` in src/lib/feed-media.ts. */
const slugify = (file) =>
  file
    .replace(/\.[^.]+$/u, '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '');

/**
 * Every master the site plays: the portfolio reels (legacy list + generated R2
 * catalogue) and every other master in media-sources/legacy (the clothing cuts
 * in "Videos para cada paso" and the services marquee).
 */
const collectMasters = () => {
  const legacy = readFileSync(path.join(ROOT, 'src/data/portfolio-clips.ts'), 'utf8');
  const nuevos = readFileSync(path.join(ROOT, 'src/data/nuevos-r2-ready.ts'), 'utf8');
  const files = [
    ...[...legacy.matchAll(/mainSrc: r2MainVideo\('([^']+)'\)/gu)].map((match) => match[1]),
    ...[...nuevos.matchAll(/mainSrc: '([^']+)'/gu)].map((match) => decodeURIComponent(match[1].split('/').pop())),
    ...readdirSync(path.join(ROOT, 'media-sources/legacy')).filter((file) => /\.(mp4|mov)$/iu.test(file)),
  ];
  const bySlug = new Map();
  files.forEach((file) => {
    if (!bySlug.has(slugify(file))) bySlug.set(slugify(file), { slug: slugify(file), file });
  });
  return [...bySlug.values()];
};

const findSource = (file) => {
  for (const dir of SOURCE_DIRS) {
    for (const name of [file, file.normalize('NFC'), file.normalize('NFD')]) {
      const candidate = path.join(dir, name);
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
};

const probe = async (file) => {
  const json = JSON.parse(await run('ffprobe', [
    '-v', 'error', '-select_streams', 'v:0', '-print_format', 'json',
    '-show_entries', 'stream=codec_name,width,height,r_frame_rate,color_transfer:stream_side_data=rotation:format=duration',
    file,
  ], { capture: true }));
  const stream = json.streams[0];
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
  };
};

const even = (value) => Math.max(2, Math.round(value / 2) * 2);

/** What gets delivered: the master's own size, or 1440 on the short side for 4K. */
const sizeFor = ({ width, height }) => {
  const short = Math.min(width, height);
  if (short <= PASSTHROUGH_MAX_SHORT_SIDE) return { w: width, h: height, large: false };
  const scale = LARGE_SHORT_SIDE / short;
  return { w: even(width * scale), h: even(height * scale), large: true };
};

const STRIP = ['-map_metadata', '-1', '-map_chapters', '-1', '-movflags', '+faststart'];

/** The master's own streams, repackaged: zero generation loss. */
const remux = (source, output, codec) =>
  run('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', source,
    '-map', '0:v:0', '-map', '0:a:0?', '-c', 'copy',
    ...(codec === 'hevc' ? ['-tag:v', 'hvc1'] : []),
    ...STRIP, output,
  ]);

const encode = (source, output, { codec, size, fps, seconds }) => {
  const filters = [
    `scale=${size.w}:${size.h}:flags=lanczos`,
    `fps=${fps}`,
    'format=yuv420p',
  ].join(',');
  const audio = seconds ? ['-an'] : ['-map', '0:a:0?', '-c:a', 'copy'];
  return run('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', source,
    ...(seconds ? ['-t', String(seconds)] : []),
    '-map', '0:v:0', '-vf', filters,
    ...ENCODERS[codec](Math.round(fps) * 2, size.large),
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
    ...audio, ...STRIP, output,
  ]);
};

// Homebrew's ffmpeg has no WebP encoder: cut a lossless PNG, then cwebp it.
const poster = async (video, output, width) => {
  const frame = `${output}.png`;
  await run('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', video, '-frames:v', '1',
    '-vf', `scale=${width}:-2:flags=lanczos`, frame,
  ]);
  await run('cwebp', ['-quiet', '-q', '82', '-m', '6', '-sharp_yuv', frame, '-o', output]);
  rmSync(frame);
};

const processMaster = async (master, args) => {
  const source = findSource(master.file);
  if (!source) throw new Error(`No source for ${master.slug} (${master.file})`);
  const { slug } = master;
  const info = await probe(source);
  const size = sizeFor(info);
  const passthrough = !info.hdr && !info.rotated && !size.large;
  // An HEVC master keeps an HEVC file; an H.264 master's own stream already
  // plays everywhere, so there is nothing an HEVC copy of it could add.
  const hevc = info.codec === 'hevc';
  const result = { slug, width: size.w, height: size.h, hevc };
  if (args.dataOnly) return result;

  let input = source;
  if (info.hdr) {
    // Apple's export path tone-maps HLG / PQ to SDR the way Photos does.
    input = path.join(ROOT, 'tmp/feed-sources', `${slug}-sdr.mov`);
    if (args.overwrite || !existsSync(input)) {
      await run('avconvert', ['-s', source, '-p', 'PresetHighestQuality', '-o', input, '--replace']);
    }
  }
  const fps = info.fps >= 50 ? 60 : 30;
  const dir = path.join(OUT_DIR, slug);
  mkdirSync(dir, { recursive: true });

  const jobs = [];
  const want = (file, job) => {
    if (args.overwrite || !existsSync(path.join(dir, file))) jobs.push(() => job(path.join(dir, file)));
  };
  const codecs = hevc ? ['hevc', 'avc'] : ['avc'];
  codecs.forEach((codec) => {
    want(`${codec}.mp4`, (output) =>
      passthrough && codec === info.codec ? remux(input, output, codec) : encode(input, output, { codec, size, fps }),
    );
    want(`preview.${codec}.mp4`, (output) => encode(input, output, { codec, size, fps, seconds: PREVIEW_SECONDS }));
  });
  await Promise.all(jobs.map((job) => job()));

  mkdirSync(POSTER_DIR, { recursive: true });
  const avc = path.join(dir, 'avc.mp4');
  const posterFull = path.join(POSTER_DIR, `${slug}.webp`);
  const posterSmall = path.join(POSTER_DIR, `${slug}-sm.webp`);
  if (args.overwrite || jobs.length || !existsSync(posterFull)) await poster(avc, posterFull, Math.min(size.w, 1080));
  if (args.overwrite || jobs.length || !existsSync(posterSmall)) await poster(avc, posterSmall, Math.min(SM_POSTER_WIDTH, size.w));

  const mbps = (file) => ((statSync(path.join(dir, file)).size * 8) / 1e6 / info.duration).toFixed(1);
  console.log(
    `✓ ${slug}: ${info.codec} ${info.width}×${info.height}${info.hdr ? ' HDR' : ''}${info.rotated ? ' rotated' : ''}` +
      ` → ${size.w}×${size.h} ${passthrough ? 'original' : 'encoded'}` +
      ` (${codecs.map((codec) => `${codec} ${mbps(`${codec}.mp4`)} Mbps`).join(', ')})`,
  );
  return result;
};

const pool = async (items, limit, worker) => {
  const results = [];
  let next = 0;
  const lanes = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index]);
    }
  });
  await Promise.all(lanes);
  return results;
};

const writeData = (renditions) => {
  const body = [...renditions]
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((r) => `  '${r.slug}': { width: ${r.width}, height: ${r.height}, hevc: ${r.hevc} },`)
    .join('\n');
  writeFileSync(DATA_PATH, `/**
 * AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
 *
 * Generated by: scripts/encode-feed.mjs
 */

export type FeedRendition = {
  /** Delivered frame: the master's own size (1440 px on the short side for 4K). */
  width: number;
  height: number;
  /** An HEVC file exists (the master is HEVC); every master has an H.264 one. */
  hevc: boolean;
};

export const FEED_MEDIA_VERSION = '${VERSION}';

/** Every master with feed files, by slug (see feedSlugFromUrl). */
export const FEED_MEDIA: Readonly<Record<string, FeedRendition>> = {
${body}
};
`);
};

const upload = async (renditions) => {
  const env = Object.fromEntries(
    readFileSync(path.join(ROOT, '.env'), 'utf8')
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
  const aws = (awsArgs) =>
    new Promise((resolve, reject) => {
      const child = spawn('aws', [...awsArgs, '--endpoint-url', env.R2_ENDPOINT], { env: awsEnv, stdio: ['ignore', 'pipe', 'pipe'] });
      let out = '';
      let err = '';
      child.stdout.on('data', (c) => { out += c; });
      child.stderr.on('data', (c) => { err += c; });
      child.on('close', (code) => (code === 0 ? resolve(out) : reject(new Error(err.trim()))));
    });

  for (const r of renditions) {
    const files = (r.hevc ? ['hevc', 'avc'] : ['avc']).flatMap((codec) => [`${codec}.mp4`, `preview.${codec}.mp4`]);
    for (const name of files) {
      const file = path.join(OUT_DIR, r.slug, name);
      const key = `videos/feed/${VERSION}/${r.slug}/${name}`;
      const remoteSize = await aws(['s3api', 'head-object', '--bucket', env.R2_BUCKET, '--key', key, '--query', 'ContentLength', '--output', 'text'])
        .then((out) => Number(out.trim()))
        .catch(() => -1);
      if (remoteSize === statSync(file).size) continue;
      await aws(['s3', 'cp', file, `s3://${env.R2_BUCKET}/${key}`, '--content-type', 'video/mp4', '--cache-control', CACHE_CONTROL, '--no-progress']);
      console.log(`↑ ${key}`);
    }
  }
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  const masters = collectMasters().filter((master) => !args.only || args.only.has(master.slug));
  console.log(`Processing ${masters.length} masters (${args.jobs} at a time)…`);
  const renditions = await pool(masters, args.dataOnly ? 8 : args.jobs, (master) => processMaster(master, args));
  if (!args.only) writeData(renditions);
  if (args.upload && !args.dataOnly) await upload(renditions);
  console.log('Done.');
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
