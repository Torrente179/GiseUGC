#!/usr/bin/env node
/**
 * Moves the Testimonios media off Fiverr's CDN and onto Gisela's R2
 * (media.giselasaldarriaga.com), then records it in the capture so
 * scripts/build-fiverr-reviews.mjs points the site at R2.
 *
 *   • delivered videos: Fiverr's HD rendition (already at its true aspect),
 *     repackaged losslessly as fast-start MP4 (no re-encode: it is already
 *     compressed, so encoding again would only lose detail); poster = frame 0
 *   • client profile photos: 120 × 120 WebP
 *
 * R2 keys:
 *   videos/reviews/<version>/<asset>.mp4 · .webp   images/reviews/<version>/<user>.webp
 *
 * Usage: node scripts/self-host-fiverr-media.mjs [content/fiverr/reviews-….json] [--upload] [--work=<dir>]
 * Files already in the work folder are reused, so a rerun only fetches what is new.
 * Needs ffmpeg, cwebp, magick, and for --upload the aws CLI with the R2_* keys in .env.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const VERSION = 'v1';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CDN = 'https://fiverr-res.cloudinary.com';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36';
const CACHE_CONTROL = 'public, max-age=31536000, immutable';

const args = process.argv.slice(2);
const upload = args.includes('--upload');
const WORK = path.resolve(args.find((arg) => arg.startsWith('--work='))?.slice(7) ?? path.join(os.tmpdir(), 'giseugc-fiverr-media'));
const sourceArg = args.find((arg) => !arg.startsWith('--'));
const source = sourceArg
  ? path.resolve(sourceArg)
  : path.join(ROOT, 'content/fiverr', readdirSync(path.join(ROOT, 'content/fiverr')).filter((f) => f.startsWith('reviews-')).sort().pop());
const capture = JSON.parse(readFileSync(source, 'utf8'));

const run = (cmd, cmdArgs, opts = {}) => execFileSync(cmd, cmdArgs, { stdio: ['ignore', 'pipe', 'pipe'], ...opts }).toString();
const fetchTo = (url, out, accept) =>
  run('curl', ['-sfL', '-A', UA, ...(accept ? ['-H', `Accept: ${accept}`] : []), '-o', out, url]);

for (const dir of ['videos', 'avatars']) mkdirSync(path.join(WORK, dir), { recursive: true });

const keptUsers = new Set(capture.reviews.map((row) => row[1]));
const videos = {};
for (const file of capture.files.filter((f) => f.available && f.rating >= 4)) {
  const asset = file.asset.split('/')[0];
  const raw = path.join(WORK, 'videos', `${asset}.src.mp4`);
  const mp4 = path.join(WORK, 'videos', `${asset}.mp4`);
  const png = path.join(WORK, 'videos', `${asset}.png`);
  const poster = path.join(WORK, 'videos', `${asset}.webp`);
  if (!existsSync(mp4)) {
    fetchTo(`${CDN}/video/upload/t_fiverr_hd/v1/video-attachments/delivery/asset/${file.asset}`, raw);
    run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', raw, '-map', '0:v:0', '-map', '0:a:0?', '-c', 'copy', '-map_metadata', '-1', '-movflags', '+faststart', mp4]);
    rmSync(raw);
  }
  if (!existsSync(poster)) {
    run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', mp4, '-frames:v', '1', png]);
    run('cwebp', ['-quiet', '-q', '82', '-m', '6', '-sharp_yuv', png, '-o', poster]);
    rmSync(png);
  }
  const [width, height] = run('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', mp4]).trim().split(',').map(Number);
  videos[asset] = { width, height };
}

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
    run('magick', [`${raw}[0]`, '-resize', '120x120^', '-gravity', 'center', '-extent', '120x120', png]);
    run('cwebp', ['-quiet', '-q', '85', '-m', '6', png, '-o', webp]);
    rmSync(raw);
    rmSync(png);
  }
  avatars.push(user);
}

if (upload) {
  const env = Object.fromEntries(
    readFileSync(path.join(ROOT, '.env'), 'utf8').split('\n').filter((l) => /^R2_[A-Z0-9_]+=/u.test(l)).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]),
  );
  const awsEnv = {
    ...process.env,
    AWS_ACCESS_KEY_ID: env.R2_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: env.R2_SECRET_ACCESS_KEY,
    AWS_DEFAULT_REGION: env.R2_REGION ?? 'auto',
    AWS_REQUEST_CHECKSUM_CALCULATION: 'when_required',
    AWS_RESPONSE_CHECKSUM_VALIDATION: 'when_required',
  };
  const sync = (from, to, include, type) =>
    run('aws', ['s3', 'sync', from, `s3://${env.R2_BUCKET}/${to}`, '--endpoint-url', env.R2_ENDPOINT, '--exclude', '*', '--include', include, '--content-type', type, '--cache-control', CACHE_CONTROL, '--no-progress'], { env: awsEnv });
  sync(path.join(WORK, 'videos'), `videos/reviews/${VERSION}/`, '*.mp4', 'video/mp4');
  sync(path.join(WORK, 'videos'), `videos/reviews/${VERSION}/`, '*.webp', 'image/webp');
  sync(path.join(WORK, 'avatars'), `images/reviews/${VERSION}/`, '*.webp', 'image/webp');
}

// Appended as text so the rest of the capture keeps its exact formatting.
const selfHosted = JSON.stringify({ version: VERSION, videos, avatars: avatars.sort() }, null, 1).replace(/\n/gu, '\n ');
const text = readFileSync(source, 'utf8').replace(/,\n "selfHosted": [\s\S]*$/u, '\n}\n');
writeFileSync(source, text.replace(/\n\}\s*$/u, `,\n "selfHosted": ${selfHosted}\n}\n`));
console.log(`${Object.keys(videos).length} videos, ${avatars.length} photos${upload ? ' uploaded to R2' : ''}; capture updated.`);
