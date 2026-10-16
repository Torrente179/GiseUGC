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
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { encode, poster, probe, r2, remux, run, sizeFor } from './lib/video-encoding.mjs';

const VERSION = 'v1';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT_DIR = path.join(ROOT, 'tmp/video-feed');
const POSTER_DIR = path.join(ROOT, `public/uploads/videos/feed/${VERSION}`);
const DATA_PATH = path.join(ROOT, 'src/data/feed-renditions.ts');
const SOURCE_DIRS = ['media-sources/legacy', 'media-sources/nuevos', 'tmp/feed-sources'].map((dir) =>
  path.join(ROOT, dir),
);

// Encoder settings, probe, passthrough / encode and posters: ./lib/video-encoding.mjs
const SM_POSTER_WIDTH = 360;
const PREVIEW_SECONDS = 6;

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
  const { put } = r2(ROOT);
  for (const r of renditions) {
    const files = (r.hevc ? ['hevc', 'avc'] : ['avc']).flatMap((codec) => [`${codec}.mp4`, `preview.${codec}.mp4`]);
    for (const name of files) {
      const file = path.join(OUT_DIR, r.slug, name);
      const key = `videos/feed/${VERSION}/${r.slug}/${name}`;
      if (await put(file, key, 'video/mp4', statSync(file).size)) console.log(`↑ ${key}`);
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
