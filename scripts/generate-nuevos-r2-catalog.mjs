#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const R2_MEDIA_BASE_URL = 'https://media.giselasaldarriaga.com';
const DEFAULT_MANIFEST_PATH = 'public/uploads/videos/nuevos/manifest.csv';
const DEFAULT_OUTPUT_PATH = 'src/data/nuevos-r2-ready.ts';
const DEFAULT_SEO_OVERRIDES_PATH = 'scripts/nuevos-seo-overrides.json';
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
    const category = sanitizeOverrideCategory(value.category);

    const normalizedNfc = filenameKey.normalize('NFC');
    const normalizedNfd = filenameKey.normalize('NFD');
    const override = { title, category };
    overrides.set(normalizedNfc, override);
    overrides.set(normalizedNfd, override);
    loadedCount += 1;
  });

  return { overrides, loadedCount };
}

function escapeSingleQuotes(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function writeFileIfChanged(outputPath, output) {
  const previousOutput = existsSync(outputPath) ? readFileSync(outputPath, 'utf8') : null;
  if (previousOutput === output) {
    return false;
  }

  writeFileSync(outputPath, output, 'utf8');
  return true;
}

function createRequestController(timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
}

async function checkUrl(url, timeoutMs) {
  const { controller, timeoutId } = createRequestController(timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'HEAD',
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

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const manifestPath = path.resolve(process.cwd(), args.manifest);
  const outputPath = path.resolve(process.cwd(), args.output);
  const seoOverridesPath = path.resolve(process.cwd(), args.seoOverrides);
  const { overrides: seoOverrides, loadedCount: seoOverridesCount } = loadSeoOverrides(seoOverridesPath);

  if (!existsSync(manifestPath)) {
    const output = `/**
 * AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
 *
 * Generated by: scripts/generate-nuevos-r2-catalog.mjs
 *
 * Source manifest: ${args.manifest}
 * Source SEO overrides: ${args.seoOverrides}
 * Note: source manifest was not found during generation.
 */

import type { ReelClip } from '@/data/portfolio-clips';

export const NUEVOS_R2_READY_CLIPS: ReelClip[] = [

];

export const NUEVOS_R2_BLOCK_REPORT: {
  totalCandidates: number;
  ready: number;
  blocked: number;
  missingByAsset: {
    main: number;
    mobile: number;
    preview: number;
    poster: number;
  };
} = {
  totalCandidates: 0,
  ready: 0,
  blocked: 0,
  missingByAsset: {
    main: 0,
    mobile: 0,
    preview: 0,
    poster: 0,
  },
};
`;

    const didWrite = writeFileIfChanged(outputPath, output);
    console.warn(
      `Manifest not found (${path.relative(process.cwd(), manifestPath)}). ${didWrite ? 'Generated' : 'Kept'} empty catalog at ${path.relative(
        process.cwd(),
        outputPath,
      )}.`,
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
      const sourceFilename = path.basename(sourcePath);
      if (!sourceFilename) return null;
      const baseName = stripExtension(sourceFilename);
      const override =
        seoOverrides.get(sourceFilename.normalize('NFC')) ?? seoOverrides.get(sourceFilename.normalize('NFD'));

      return {
        originalIndex: index,
        sourceFilename,
        title: override?.title ?? toReadableVideoTitle(sourceFilename),
        category: override?.category ?? inferVideoCategory(sourceFilename),
        durationSeconds: Number.parseFloat(cells[3] ?? ''),
        language: 'es',
        assets: {
          main: toR2VideoUrl('main', sourceFilename),
          mobile: toR2VideoUrl('mobile', `${baseName}-mobile.mp4`),
          preview: toR2VideoUrl('previews', `${baseName}-preview.mp4`),
          poster: toR2VideoUrl('posters', `${baseName}-poster.jpg`),
        },
      };
    })
    .filter(Boolean);

  const statuses = await Promise.all(
    candidates.map(async (candidate) => {
      const [mainStatus, mobileStatus, previewStatus, posterStatus] = await Promise.all([
        checkUrl(candidate.assets.main, args.timeoutMs),
        checkUrl(candidate.assets.mobile, args.timeoutMs),
        checkUrl(candidate.assets.preview, args.timeoutMs),
        checkUrl(candidate.assets.poster, args.timeoutMs),
      ]);

      return {
        candidate,
        statuses: {
          main: mainStatus,
          mobile: mobileStatus,
          preview: previewStatus,
          poster: posterStatus,
        },
      };
    }),
  );

  const readyClips = [];
  const missingByAsset = {
    main: 0,
    mobile: 0,
    preview: 0,
    poster: 0,
  };

  statuses.forEach(({ candidate, statuses: assetStatuses }) => {
    const missing = {
      main: assetStatuses.main !== 200,
      mobile: assetStatuses.mobile !== 200,
      preview: assetStatuses.preview !== 200,
      poster: assetStatuses.poster !== 200,
    };

    if (missing.main) missingByAsset.main += 1;
    if (missing.mobile) missingByAsset.mobile += 1;
    if (missing.preview) missingByAsset.preview += 1;
    if (missing.poster) missingByAsset.poster += 1;

    const isReady = !missing.main && !missing.mobile && !missing.preview && !missing.poster;

    if (isReady) {
      readyClips.push({
        id: 1000 + candidate.originalIndex + 1,
        title: candidate.title,
        category: candidate.category,
        mainSrc: candidate.assets.main,
        mobileSrc: candidate.assets.mobile,
        previewSrc: candidate.assets.preview,
        posterSrc: candidate.assets.poster,
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

  const serializedClips = readyClips
    .map(
      (clip) => `  {
    id: ${clip.id},
    title: '${escapeSingleQuotes(clip.title)}',
    category: '${clip.category}',
    mainSrc: '${escapeSingleQuotes(clip.mainSrc)}',
    mobileSrc: '${escapeSingleQuotes(clip.mobileSrc)}',
    previewSrc: '${escapeSingleQuotes(clip.previewSrc)}',
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
    mobile: number;
    preview: number;
    poster: number;
  };
} = {
  totalCandidates: ${blockReport.totalCandidates},
  ready: ${blockReport.ready},
  blocked: ${blockReport.blocked},
  missingByAsset: {
    main: ${blockReport.missingByAsset.main},
    mobile: ${blockReport.missingByAsset.mobile},
    preview: ${blockReport.missingByAsset.preview},
    poster: ${blockReport.missingByAsset.poster},
  },
};
`;

  const didWrite = writeFileIfChanged(outputPath, output);

  console.log(`${didWrite ? 'Generated' : 'Unchanged'} ${path.relative(process.cwd(), outputPath)}`);
  console.log(`SEO title overrides loaded: ${seoOverridesCount}`);
  console.log(
    `R2 readiness: ${blockReport.ready}/${blockReport.totalCandidates} ready, ${blockReport.blocked} blocked`,
  );
  console.log(
    `Missing by asset: main=${blockReport.missingByAsset.main}, mobile=${blockReport.missingByAsset.mobile}, preview=${blockReport.missingByAsset.preview}, poster=${blockReport.missingByAsset.poster}`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
