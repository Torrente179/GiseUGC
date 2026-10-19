#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const R2_MEDIA_BASE_URL = 'https://media.giselasaldarriaga.com';
// The media host refuses video requests that do not come from the site
// (scripts/cloudflare-video-lock.mjs), so the readiness checks say they do.
const SITE_REFERER = 'https://www.giselasaldarriaga.com/';
const DEFAULT_MANIFEST_PATH = 'media-sources/nuevos/manifest.csv';
const DEFAULT_OUTPUT_PATH = 'src/data/nuevos-r2-ready.ts';
const DEFAULT_SEO_OVERRIDES_PATH = 'scripts/nuevos-seo-overrides.json';
const DAY_MS = 86_400_000;
const URL_CHECK_RETRIES = 2;
const VALID_REEL_CATEGORIES = new Set(['fashion', 'beauty', 'tech', 'lifestyle']);

function parseArgs(argv) {
  const args = {
    manifest: DEFAULT_MANIFEST_PATH,
    output: DEFAULT_OUTPUT_PATH,
    seoOverrides: DEFAULT_SEO_OVERRIDES_PATH,
    timeoutMs: 8000,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--manifest') {
      args.manifest = argv[i + 1];
      i += 1;
      continue;
    }
    if (token === '--output') {
      args.output = argv[i + 1];
      i += 1;
      continue;
    }
    if (token === '--seo-overrides') {
      args.seoOverrides = argv[i + 1];
      i += 1;
      continue;
    }
    if (token === '--timeout-ms') {
      const parsed = Number.parseInt(argv[i + 1] ?? '', 10);
      if (Number.isFinite(parsed) && parsed > 0) args.timeoutMs = parsed;
      i += 1;
      continue;
    }
    if (token === '-h' || token === '--help') {
      console.log(
        'Usage: node scripts/generate-nuevos-r2-catalog.mjs [--manifest FILE] [--output FILE] [--seo-overrides FILE] [--timeout-ms N]',
      );
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${token}`);
  }

  return args;
}

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }
    current += ch;
  }

  cells.push(current);
  return cells;
}

function toR2VideoUrl(folder, filename) {
  return `${R2_MEDIA_BASE_URL}/videos/${folder}/${encodeURIComponent(filename)}`;
}

// What the site actually plays: the feed files (scripts/encode-feed.mjs,
// src/lib/feed-media.ts). The old mobile/preview/HLS copies were deleted from
// R2 on 2026-10-16 (changes/2026-10-16-r2-cleanup.md); mobileSrc/previewSrc
// stay in the data only as the keys the feed resolver maps, so readiness is
// judged on the master, the poster and the feed files.
const FEED_VERSION =
  readFileSync(path.resolve(process.cwd(), 'src/data/feed-renditions.ts'), 'utf8').match(
    /FEED_MEDIA_VERSION = '([^']+)'/u,
  )?.[1] ?? 'v1';

/** Same rule as `slugify` in scripts/encode-feed.mjs and `feedSlugFromUrl` in src/lib/feed-media.ts. */
function feedSlug(filename) {
  return stripExtension(filename)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '');
}

function toR2FeedUrl(filename, file) {
  return `${R2_MEDIA_BASE_URL}/videos/feed/${FEED_VERSION}/${feedSlug(filename)}/${file}`;
}

function stripExtension(filename) {
  return filename.replace(/\.[^/.]+$/u, '');
}

function toReadableVideoTitle(filename) {
  const withoutExt = stripExtension(filename);
  const normalized = withoutExt.normalize('NFC');
  const withSpaces = normalized.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  return withSpaces.length > 0 ? withSpaces : filename;
}

function inferVideoCategory(filename) {
  const lower = filename.toLowerCase();
  if (/(croma|marketing|tiktok|usa|whatsapp|reporte|contenido)/.test(lower)) return 'tech';
  if (/(camaras|look|outfit|moda|fashion)/.test(lower)) return 'fashion';
  return 'lifestyle';
}

function sanitizeOverrideTitle(value) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function sanitizeOverrideCategory(value) {
  if (typeof value !== 'string') return undefined;
  return VALID_REEL_CATEGORIES.has(value) ? value : undefined;
}

function loadSeoOverrides(overridesPath) {
  if (!existsSync(overridesPath)) {
    return { overrides: new Map(), loadedCount: 0 };
  }

  const raw = JSON.parse(readFileSync(overridesPath, 'utf8'));
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error(`SEO overrides must be a JSON object: ${overridesPath}`);
  }

  const overrides = new Map();
  let loadedCount = 0;
  Object.entries(raw).forEach(([filenameKey, value]) => {
    if (typeof filenameKey !== 'string' || filenameKey.trim().length === 0) return;
    if (!value || typeof value !== 'object' || Array.isArray(value)) return;

    const title = sanitizeOverrideTitle(value.title);
    const titleEn = sanitizeOverrideTitle(value.titleEn);
    const category = sanitizeOverrideCategory(value.category);

    const normalizedNfc = filenameKey.normalize('NFC');
    const normalizedNfd = filenameKey.normalize('NFD');
    const override = { title, titleEn, category };
    overrides.set(normalizedNfc, override);
    overrides.set(normalizedNfd, override);
    loadedCount += 1;
  });

  return { overrides, loadedCount };
}

function escapeSingleQuotes(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function createRequestController(timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
}

async function checkUrl(url, timeoutMs) {
  for (let attempt = 0; attempt <= URL_CHECK_RETRIES; attempt += 1) {
    const status = await checkUrlOnce(url, timeoutMs);
    if (status === 200 || attempt === URL_CHECK_RETRIES) return status;
    await sleep(300 * (attempt + 1));
  }

  return -1;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function checkUrlOnce(url, timeoutMs) {
  const { controller, timeoutId } = createRequestController(timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: { Referer: SITE_REFERER },
      signal: controller.signal,
      redirect: 'follow',
      cache: 'no-store',
    });
    return response.status;
  } catch {
    return -1;
  } finally {
    clearTimeout(timeoutId);
  }
}

function preserveExistingCatalog(outputPath, reason) {
  if (!existsSync(outputPath)) {
    throw new Error(`${reason} No previous generated catalog exists at ${outputPath}.`);
  }
  console.warn(`${reason} Preserving the last known-good generated catalog.`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifestPath = path.resolve(process.cwd(), args.manifest);
  const outputPath = path.resolve(process.cwd(), args.output);
  const seoOverridesPath = path.resolve(process.cwd(), args.seoOverrides);
  const { overrides: seoOverrides, loadedCount: seoOverridesCount } = loadSeoOverrides(seoOverridesPath);

  if (!existsSync(manifestPath)) {
    preserveExistingCatalog(
      outputPath,
      `Manifest not found (${path.relative(process.cwd(), manifestPath)}).`,
    );
    return;
  }

  const rawCsv = readFileSync(manifestPath, 'utf8');
  const lines = rawCsv
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error(`Manifest has no data rows: ${manifestPath}`);
  }

  const rows = lines.slice(1).map(parseCsvLine);

  const candidates = rows
    .map((cells, index) => {
      const sourcePath = cells[0] ?? '';
      // macOS hands back decomposed (NFD) filenames, but git stores them
      // precomposed and Linux/Vercel match bytes exactly — an NFD URL 404s on
      // the deployed site while resolving fine locally. Normalize once here so
      // every derived URL is precomposed.
      const sourceFilename = path.basename(sourcePath).normalize('NFC');
      if (!sourceFilename) return null;
      const baseName = stripExtension(sourceFilename);
      const override =
        seoOverrides.get(sourceFilename.normalize('NFC')) ?? seoOverrides.get(sourceFilename.normalize('NFD'));

      return {
        originalIndex: index,
        sourceFilename,
        title: override?.title ?? toReadableVideoTitle(sourceFilename),
        titleEn: override?.titleEn,
        category: override?.category ?? inferVideoCategory(sourceFilename),
        durationSeconds: Number.parseFloat(cells[3] ?? ''),
        language: 'es',
        assets: {
          main: toR2VideoUrl('main', sourceFilename),
          mobile: toR2VideoUrl('mobile', `${baseName}-mobile.mp4`),
          preview: toR2VideoUrl('previews', `${baseName}-preview.mp4`),
          poster: toR2VideoUrl('posters', `${baseName}-poster.jpg`),
          highQualityPoster: `/uploads/videos/service-posters/${encodeURIComponent(baseName)}.jpg`,
          feed: toR2FeedUrl(sourceFilename, 'avc.mp4'),
          feedPreview: toR2FeedUrl(sourceFilename, 'preview.avc.mp4'),
        },
      };
    })
    .filter(Boolean);

  const statuses = await Promise.all(
    candidates.map(async (candidate) => {
      const [mainStatus, posterStatus, feedStatus, feedPreviewStatus] = await Promise.all([
        checkUrl(candidate.assets.main, args.timeoutMs),
        checkUrl(candidate.assets.poster, args.timeoutMs),
        checkUrl(candidate.assets.feed, args.timeoutMs),
        checkUrl(candidate.assets.feedPreview, args.timeoutMs),
      ]);

      return {
        candidate,
        statuses: {
          main: mainStatus,
          poster: posterStatus,
          feed: feedStatus,
          feedPreview: feedPreviewStatus,
        },
      };
    }),
  );

  const requiredProbeErrors = statuses.reduce((total, result) => {
    const requiredStatuses = [
      result.statuses.main,
      result.statuses.poster,
      result.statuses.feed,
      result.statuses.feedPreview,
    ];
    return total + requiredStatuses.filter((status) => status === -1).length;
  }, 0);
  if (requiredProbeErrors > 0) {
    preserveExistingCatalog(
      outputPath,
      `R2 readiness checks were inconclusive for ${requiredProbeErrors} required asset request(s).`,
    );
    return;
  }

  const readyClips = [];
  const missingByAsset = {
    main: 0,
    poster: 0,
    feed: 0,
    feedPreview: 0,
  };

  statuses.forEach(({ candidate, statuses: assetStatuses }) => {
    const missing = {
      main: assetStatuses.main !== 200,
      poster: assetStatuses.poster !== 200,
      feed: assetStatuses.feed !== 200,
      feedPreview: assetStatuses.feedPreview !== 200,
    };

    for (const key of Object.keys(missing)) if (missing[key]) missingByAsset[key] += 1;

    const isReady = !missing.main && !missing.poster && !missing.feed && !missing.feedPreview;

    if (isReady) {
      readyClips.push({
        id: 1000 + candidate.originalIndex + 1,
        title: candidate.title,
        titleEn: candidate.titleEn,
        category: candidate.category,
        mainSrc: candidate.assets.main,
        mobileSrc: candidate.assets.mobile,
        previewSrc: candidate.assets.preview,
        posterSrc: candidate.assets.poster,
        highQualityPosterSrc: candidate.assets.highQualityPoster,
        durationSeconds: Number.isFinite(candidate.durationSeconds) ? candidate.durationSeconds : undefined,
        language: candidate.language,
      });
    }
  });

  readyClips.sort((a, b) => a.id - b.id);

  const blockReport = {
    totalCandidates: candidates.length,
    ready: readyClips.length,
    blocked: candidates.length - readyClips.length,
    missingByAsset,
  };

  const generatedAtIso = new Date().toISOString();
  const utcDayBucket = Math.floor(Date.now() / DAY_MS);

  const serializedClips = readyClips
    .map(
      (clip) => `  {
    id: ${clip.id},
    title: '${escapeSingleQuotes(clip.title)}',
${clip.titleEn ? `    localizedTitle: { en: '${escapeSingleQuotes(clip.titleEn)}' },\n` : ''}    category: '${clip.category}',
    mainSrc: '${escapeSingleQuotes(clip.mainSrc)}',
    mobileSrc: '${escapeSingleQuotes(clip.mobileSrc)}',
    previewSrc: '${escapeSingleQuotes(clip.previewSrc)}',
    highQualityPosterSrc: '${escapeSingleQuotes(clip.highQualityPosterSrc)}',
    posterSrc: '${escapeSingleQuotes(clip.posterSrc)}',
    durationSeconds: ${clip.durationSeconds ?? 'undefined'},
    language: '${clip.language}',
  },`,
    )
    .join('\n');

  const output = `/**
 * AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
 *
 * Generated by: scripts/generate-nuevos-r2-catalog.mjs
 * Generated at: ${generatedAtIso}
 * UTC day bucket at generation: ${utcDayBucket}
 *
 * Source manifest: ${args.manifest}
 * Source SEO overrides: ${args.seoOverrides}
 */

import type { ReelClip } from '@/data/portfolio-clips';

export const NUEVOS_R2_READY_CLIPS: ReelClip[] = [
${serializedClips}
];

export const NUEVOS_R2_BLOCK_REPORT: {
  totalCandidates: number;
  ready: number;
  blocked: number;
  missingByAsset: {
    main: number;
    poster: number;
    feed: number;
    feedPreview: number;
  };
} = {
  totalCandidates: ${blockReport.totalCandidates},
  ready: ${blockReport.ready},
  blocked: ${blockReport.blocked},
  missingByAsset: {
    main: ${blockReport.missingByAsset.main},
    poster: ${blockReport.missingByAsset.poster},
    feed: ${blockReport.missingByAsset.feed},
    feedPreview: ${blockReport.missingByAsset.feedPreview},
  },
};
`;

  writeFileSync(outputPath, output, 'utf8');

  console.log(`Generated ${path.relative(process.cwd(), outputPath)}`);
  console.log(`SEO title overrides loaded: ${seoOverridesCount}`);
  console.log(
    `R2 readiness: ${blockReport.ready}/${blockReport.totalCandidates} ready, ${blockReport.blocked} blocked`,
  );
  console.log(
    `Missing by asset: main=${blockReport.missingByAsset.main}, poster=${blockReport.missingByAsset.poster}, feed=${blockReport.missingByAsset.feed}, feedPreview=${blockReport.missingByAsset.feedPreview}`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
