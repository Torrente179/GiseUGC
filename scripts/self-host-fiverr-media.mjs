#!/usr/bin/env node
/**
 * Moves the Testimonios media off Fiverr and onto Gisela's R2
 * (media.giselasaldarriaga.com), then records it in the capture so
 * scripts/build-fiverr-reviews.mjs points the site at R2.
 *
 *   • delivered videos: made from the ORIGINAL upload of each delivery (4K /
 *     1080p; Fiverr's own "HD" rendition is a 720p), with Fiverr's wordmark
 *     burned into the top-right corner (content/fiverr/fiverr-wordmark.svg),
 *     so a copy saved from the site still says where it was delivered. The
 *     site blocks saving videos (src/lib/video-download-guard.ts); this is
 *     for anyone who gets past that. Burning it in means encoding, at the
 *     site's near-transparent settings (scripts/lib/video-encoding.mjs:
 *     x265 CRF 18 + x264 CRF 17 for browsers without HEVC, 4K at 1440 on
 *     the short side). HDR masters go through Apple's tone mapping first.
 *     Poster = frame 0 of the H.264 file, up to 1080 px wide.
 *   • client profile photos: 120 × 120 WebP
 *
 * R2 keys:
 *   videos/reviews/<videoVersion>/<asset>/{hevc,avc}.mp4 · poster.webp
 *   images/reviews/<photoVersion>/<user>.webp
 *
 * Usage: node scripts/self-host-fiverr-media.mjs [content/fiverr/reviews-….json] [--upload] [--work=<dir>] [--jobs=2]
 * Files already in the work folder are reused, so a rerun only fetches and
 * encodes what is new. Needs ffmpeg, cwebp, magick, avconvert (macOS, for HDR
 * masters), and for --upload the aws CLI with the R2_* keys in .env.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { encode, poster, probe, r2, run, sizeFor } from './lib/video-encoding.mjs';

const VIDEO_VERSION = 'v3';
const PHOTO_VERSION = 'v1';
const POSTER_MAX_WIDTH = 1080;
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const WORDMARK = path.join(ROOT, 'content/fiverr/fiverr-wordmark.svg');
/** The mark's width and its inset from the top and right edges, as shares of the frame's short side. */
const MARK_WIDTH = 0.15;
const MARK_INSET = 0.035;
const CDN = 'https://fiverr-res.cloudinary.com';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36';

const args = process.argv.slice(2);
const option = (name) => args.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const upload = args.includes('--upload');
const jobs = Math.max(1, Number(option('jobs')) || 2);
const WORK = path.resolve(option('work') ?? path.join(os.tmpdir(), 'giseugc-fiverr-media'));
const sourceArg = args.find((arg) => !arg.startsWith('--'));
const source = sourceArg
  ? path.resolve(sourceArg)
  : path.join(ROOT, 'content/fiverr', readdirSync(path.join(ROOT, 'content/fiverr')).filter((f) => f.startsWith('reviews-')).sort().pop());
const capture = JSON.parse(readFileSync(source, 'utf8'));

const fetchTo = (url, out, accept) => {
  execFileSync('curl', ['-sfL', '--retry', '3', '-A', UA, ...(accept ? ['-H', `Accept: ${accept}`] : []), '-o', `${out}.part`, url]);
  renameSync(`${out}.part`, out);
};

for (const dir of ['originals', `videos/${VIDEO_VERSION}`, 'avatars', 'marks']) mkdirSync(path.join(WORK, dir), { recursive: true });

/** The white wordmark at 88 % with a soft shadow, sized for a frame's short side (one render per size). */
const marks = new Map();
const markFor = (short) => {
  const width = Math.round(short * MARK_WIDTH);
  if (!marks.has(width)) marks.set(width, renderMark(width).then((file) => ({ file, margin: Math.round(short * MARK_INSET) })));
  return marks.get(width);
};
const renderMark = async (width) => {
  const file = path.join(WORK, 'marks', `fiverr-${width}.png`);
  if (!existsSync(file)) {
    const flat = `${file}.flat.png`;
    await run('magick', ['-background', 'none', '-density', '400', WORDMARK, '-resize', `${width}x`, `png32:${flat}`]);
    await run('magick', [
      flat, '-channel', 'A', '-evaluate', 'multiply', '0.88', '+channel',
      '(', '+clone', '-background', 'black', '-shadow', '40x2+0+2', ')',
      '+swap', '-background', 'none', '-layers', 'merge', '+repage', `png32:${file}`,
    ]);
    rmSync(flat);
  }
  return file;
};

const pool = async (items, limit, worker) => {
  const results = [];
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await worker(items[index]);
    }
  }));
  return results;
};

const processVideo = async (file) => {
  const asset = file.asset.split('/')[0];
  const original = path.join(WORK, 'originals', `${asset}.mov`);
  // fl_attachment serves the file as uploaded; every other URL is a Fiverr rendition.
  if (!existsSync(original)) fetchTo(`${CDN}/video/upload/fl_attachment/v1/video-attachments/delivery/asset/${file.asset}`, original);

  const info = await probe(original);
  const size = sizeFor(info);
  const watermark = await markFor(Math.min(size.w, size.h));
  const hevc = info.codec === 'hevc';
  const fps = Math.min(60, Math.round(info.fps * 1000) / 1000);
  let input = original;
  if (info.hdr) {
    // Apple's export path tone-maps HLG / PQ to SDR the way Photos does.
    input = path.join(WORK, 'originals', `${asset}-sdr.mov`);
    if (!existsSync(input)) await run('avconvert', ['-s', original, '-p', 'PresetHighestQuality', '-o', input, '--replace']);
  }

  const dir = path.join(WORK, 'videos', VIDEO_VERSION, asset);
  mkdirSync(dir, { recursive: true });
  const codecs = hevc ? ['hevc', 'avc'] : ['avc'];
  await Promise.all(codecs.map(async (codec) => {
    const output = path.join(dir, `${codec}.mp4`);
    if (existsSync(output)) return;
    const partial = path.join(dir, `${codec}.part.mp4`);
    await encode(input, partial, { codec, size, fps, audio: info.audio, watermark });
    renameSync(partial, output);
  }));
  const posterFile = path.join(dir, 'poster.webp');
  if (!existsSync(posterFile)) await poster(path.join(dir, 'avc.mp4'), posterFile, Math.min(size.w, POSTER_MAX_WIDTH));

  const mbps = (name) => ((statSync(path.join(dir, name)).size * 8) / 1e6 / info.duration).toFixed(1);
  console.log(
    `✓ ${asset}: ${info.codec} ${info.width}×${info.height}${info.hdr ? ' HDR' : ''}${info.rotated ? ' rotated' : ''}` +
      ` ${Math.round(info.duration)}s → ${size.w}×${size.h} with the mark` +
      ` (${codecs.map((codec) => `${codec} ${mbps(`${codec}.mp4`)} Mbps`).join(', ')})`,
  );
  return [asset, { width: size.w, height: size.h, hevc }];
};

// capture.videosRemoved: deliveries the owner chose not to show (the review stays, without its video).
const removed = new Set(capture.videosRemoved?.assets ?? []);
const playable = capture.files.filter((f) => f.available && f.rating >= 4 && !removed.has(f.asset.split('/')[0]));
const videos = Object.fromEntries(await pool(playable, jobs, processVideo));

const keptUsers = new Set(capture.reviews.map((row) => row[1]));
const avatars = [];
for (const [user, url] of Object.entries(capture.avatars ?? {})) {
  if (!keptUsers.has(user)) continue;
  const raw = path.join(WORK, 'avatars', `${user}.src`);
  const png = path.join(WORK, 'avatars', `${user}.png`);
  const webp = path.join(WORK, 'avatars', `${user}.webp`);
  if (!existsSync(webp)) {
    try {
      fetchTo(url, raw, 'image/jpeg,image/png;q=0.9');
    } catch {
      console.warn(`No photo for ${user} (Fiverr no longer serves it); the card keeps the initial.`);
      continue;
    }
    await run('magick', [`${raw}[0]`, '-resize', '120x120^', '-gravity', 'center', '-extent', '120x120', png]);
    await run('cwebp', ['-quiet', '-q', '85', '-m', '6', png, '-o', webp]);
    rmSync(raw);
    rmSync(png);
  }
  avatars.push(user);
}

if (upload) {
  const { put } = r2(ROOT);
  const send = async (file, key, type) => {
    if (await put(file, key, type, statSync(file).size)) console.log(`↑ ${key}`);
  };
  for (const [asset, { hevc }] of Object.entries(videos)) {
    const dir = path.join(WORK, 'videos', VIDEO_VERSION, asset);
    const prefix = `videos/reviews/${VIDEO_VERSION}/${asset}`;
    for (const codec of hevc ? ['hevc', 'avc'] : ['avc']) await send(path.join(dir, `${codec}.mp4`), `${prefix}/${codec}.mp4`, 'video/mp4');
    await send(path.join(dir, 'poster.webp'), `${prefix}/poster.webp`, 'image/webp');
  }
  for (const user of avatars) {
    await send(path.join(WORK, 'avatars', `${user}.webp`), `images/reviews/${PHOTO_VERSION}/${user}.webp`, 'image/webp');
  }
}

// Appended as text so the rest of the capture keeps its exact formatting.
const selfHosted = JSON.stringify(
  { videoVersion: VIDEO_VERSION, photoVersion: PHOTO_VERSION, videos, avatars: avatars.sort() },
  null,
  1,
).replace(/\n/gu, '\n ');
const text = readFileSync(source, 'utf8').replace(/,\n "selfHosted": [\s\S]*$/u, '\n}\n');
writeFileSync(source, text.replace(/\n\}\s*$/u, `,\n "selfHosted": ${selfHosted}\n}\n`));
console.log(`${Object.keys(videos).length} videos, ${avatars.length} photos${upload ? ' on R2' : ''}; capture updated.`);
