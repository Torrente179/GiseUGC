/**
 * Build-time OG rasterizer. Uses the bundled TTF/OTF files in public/fonts/og/
 * and the existing shared portrait. Never fetches fonts. Render errors fail
 * the build. The shared fallback image is used only for a route with no H1.
 */
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { assertOgProofLineConfig, getOgProofLine } from '@/data/site-proof';
import {
  applyOgImageTagsToHtml,
  fallbackOgImageMeta,
  getAllOgRouteCopy,
  htmlFileForLocalePath,
  OG_FALLBACK_PATH,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  OG_SITE_ORIGIN,
  OG_STYLE_VERSION,
  type OgImageMeta,
  type OgRouteCopy,
} from '@/lib/og-image';
import type { SiteLocale } from '@/lib/locale-path';

const require = createRequire(import.meta.url);
const fontkit = require('fontkit') as {
  create: (buffer: Buffer) => FontLike;
};

type FontLike = {
  familyName?: string;
  unitsPerEm: number;
  glyphForCodePoint: (codePoint: number) => { id: number };
  layout: (text: string) => {
    glyphs: Array<{ advanceWidth: number; path?: { toSVG?: () => string } }>;
    positions: Array<{ xAdvance: number; yAdvance: number; xOffset: number; yOffset: number }>;
  };
};

const here = dirname(fileURLToPath(import.meta.url));
const defaultRoot = resolve(here, '../..');

const INK = '#0F121A';
const CREAM = '#EBE4D6';
const SAND = '#BFAB88';
const TITLE_MAX = 56;
const TITLE_MIN = 18;
const TITLE_MAX_LINES = 3;
const TITLE_WIDTH = 640;
const TITLE_LINE_HEIGHT = 1.12;
const PHOTO_WIDTH = 520;

export type OgTitleLayout = {
  lines: string[];
  fontSize: number;
  truncated: boolean;
  missingGlyphs: string[];
};

const loadFont = (root: string, relative: string): FontLike => {
  const buffer = readFileSync(resolve(root, relative));
  return fontkit.create(buffer);
};

const measureWidth = (font: FontLike, text: string, fontSize: number): number => {
  const scale = fontSize / font.unitsPerEm;
  const run = font.layout(text);
  let width = 0;
  for (const position of run.positions) width += position.xAdvance;
  return width * scale;
};

const missingGlyphsIn = (font: FontLike, text: string): string[] =>
  [...new Set(text)].filter((char) => char !== ' ' && font.glyphForCodePoint(char.charCodeAt(0)).id === 0);

const wrapWords = (font: FontLike, text: string, fontSize: number, maxWidth: number): string[] => {
  const words = text.split(/\s+/u).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (measureWidth(font, next, fontSize) <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
};

export const layoutOgTitle = (font: FontLike, title: string, maxWidth = TITLE_WIDTH): OgTitleLayout => {
  const missingGlyphs = missingGlyphsIn(font, title);
  for (let fontSize = TITLE_MAX; fontSize >= TITLE_MIN; fontSize -= 1) {
    const lines = wrapWords(font, title, fontSize, maxWidth);
    const overflowWord = title.split(/\s+/u).some((word) => measureWidth(font, word, fontSize) > maxWidth);
    if (lines.length <= TITLE_MAX_LINES && !overflowWord) {
      return { lines, fontSize, truncated: false, missingGlyphs };
    }
  }
  const lines = wrapWords(font, title, TITLE_MIN, maxWidth);
  const overflowWord = title.split(/\s+/u).some((word) => measureWidth(font, word, TITLE_MIN) > maxWidth);
  return {
    lines,
    fontSize: TITLE_MIN,
    truncated: lines.length > TITLE_MAX_LINES || overflowWord || lines.join(' ') !== title,
    missingGlyphs,
  };
};

const lineToSvg = (font: FontLike, text: string, fontSize: number, x: number, y: number, fill: string): string => {
  const scale = fontSize / font.unitsPerEm;
  const run = font.layout(text);
  let cursor = 0;
  const parts: string[] = [];
  for (let index = 0; index < run.glyphs.length; index += 1) {
    const glyph = run.glyphs[index];
    const position = run.positions[index];
    const d = glyph.path?.toSVG?.() ?? '';
    if (d) {
      const gx = x + (cursor + position.xOffset) * scale;
      const gy = y - position.yOffset * scale;
      parts.push(
        `<path fill="${fill}" transform="translate(${gx.toFixed(2)},${gy.toFixed(2)}) scale(${scale},${-scale})" d="${d}"/>`,
      );
    }
    cursor += position.xAdvance;
  }
  return parts.join('');
};

const hashPayload = (copy: OgRouteCopy): string =>
  createHash('sha256')
    .update(`${OG_STYLE_VERSION}\n${copy.locale}\n${copy.h1}\n${copy.proof}\n`)
    .digest('hex')
    .slice(0, 10);

export const hashedOgPublicPath = (copy: OgRouteCopy): string => `/og/${copy.slug}.${hashPayload(copy)}.jpg`;

const cropPortrait = async (root: string) => {
  const source = sharp(resolve(root, `public${OG_FALLBACK_PATH}`));
  const meta = await source.metadata();
  const srcW = meta.width ?? OG_IMAGE_WIDTH;
  const srcH = meta.height ?? OG_IMAGE_HEIGHT;
  const targetRatio = PHOTO_WIDTH / OG_IMAGE_HEIGHT;
  const srcRatio = srcW / srcH;
  let width = srcW;
  let height = srcH;
  let left = 0;
  let top = 0;
  if (srcRatio > targetRatio) {
    width = Math.round(srcH * targetRatio);
    left = Math.round((srcW - width) / 2);
  } else {
    height = Math.round(srcW / targetRatio);
    top = Math.round((srcH - height) * 0.18);
  }
  return source.extract({ left, top, width, height }).resize(PHOTO_WIDTH, OG_IMAGE_HEIGHT, { fit: 'fill' }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
};

export const renderOgJpeg = async (copy: OgRouteCopy, root = defaultRoot): Promise<{ buffer: Buffer; layout: OgTitleLayout }> => {
  if (copy.proof !== getOgProofLine(copy.locale)) {
    throw new Error(`OG proof line must equal getOgProofLine(${copy.locale})`);
  }
  const titleFont = loadFont(root, 'public/fonts/og/cormorant-garamond-latin.ttf');
  const uiFont = loadFont(root, 'public/fonts/og/dm-sans-latin.ttf');
  const layout = layoutOgTitle(titleFont, copy.h1);
  if (layout.truncated || layout.lines.length > TITLE_MAX_LINES) {
    throw new Error(`OG H1 needs more than ${TITLE_MAX_LINES} lines at min ${TITLE_MIN}px: ${copy.h1}`);
  }
  if (layout.missingGlyphs.length > 0) {
    throw new Error(`OG font missing glyphs in "${copy.h1}": ${layout.missingGlyphs.join(' ')}`);
  }
  const photo = await cropPortrait(root);
  const photoUri = `data:image/jpeg;base64,${photo.toString('base64')}`;
  const brand = copy.locale === 'es' ? 'Gisela Saldarriaga · Gisela.UGC' : 'Gisela Saldarriaga · Gisela.UGC';
  let y = 118;
  const paths: string[] = [];
  paths.push(lineToSvg(uiFont, brand, 20, 64, y, SAND));
  y += 36;
  paths.push(`<rect x="64" y="${y}" width="72" height="2" fill="${SAND}"/>`);
  y += 52;
  for (const line of layout.lines) {
    paths.push(lineToSvg(titleFont, line, layout.fontSize, 64, y + layout.fontSize * 0.78, CREAM));
    y += layout.fontSize * TITLE_LINE_HEIGHT;
  }
  y += 28;
  paths.push(lineToSvg(uiFont, copy.proof, 22, 64, y, SAND));

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${OG_IMAGE_WIDTH}" height="${OG_IMAGE_HEIGHT}" viewBox="0 0 ${OG_IMAGE_WIDTH} ${OG_IMAGE_HEIGHT}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <rect width="${OG_IMAGE_WIDTH}" height="${OG_IMAGE_HEIGHT}" fill="${INK}"/>
  <image xlink:href="${photoUri}" x="${OG_IMAGE_WIDTH - PHOTO_WIDTH}" y="0" width="${PHOTO_WIDTH}" height="${OG_IMAGE_HEIGHT}" preserveAspectRatio="xMidYMid slice"/>
  <defs>
    <linearGradient id="fade" x1="${OG_IMAGE_WIDTH - PHOTO_WIDTH}" y1="0" x2="${OG_IMAGE_WIDTH - PHOTO_WIDTH + 160}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${INK}" stop-opacity="1"/>
      <stop offset="1" stop-color="${INK}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="${OG_IMAGE_WIDTH - PHOTO_WIDTH}" y="0" width="160" height="${OG_IMAGE_HEIGHT}" fill="url(#fade)"/>
  ${paths.join('\n  ')}
</svg>`;

  const buffer = await sharp(Buffer.from(svg))
    .jpeg({ quality: 70, mozjpeg: true, chromaSubsampling: '4:2:0', force: true })
    .toBuffer();
  return { buffer, layout };
};

const writeManifest = (root: string, manifest: Record<string, OgImageMeta>) => {
  writeFileSync(resolve(root, 'src/data/og-image-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
};

const updateEntrypoint = (root: string, copy: OgRouteCopy, meta: OgImageMeta) => {
  const file = resolve(root, htmlFileForLocalePath(copy.localePath));
  const html = readFileSync(file, 'utf8');
  const next = applyOgImageTagsToHtml(html, meta);
  if (next !== html) writeFileSync(file, next);
};

const cleanStaleOgFiles = (root: string, keep: Set<string>) => {
  const dir = resolve(root, 'public/og');
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    if (!name.endsWith('.jpg')) continue;
    if (!keep.has(`/og/${name}`)) rmSync(join(dir, name));
  }
};

export const writeOgImages = async (
  root = defaultRoot,
  options: { updateEntrypoints?: boolean; snapshotDir?: string } = {},
): Promise<{
  manifest: Record<string, OgImageMeta>;
  layouts: Array<{ copy: OgRouteCopy; layout: OgTitleLayout; meta: OgImageMeta }>;
  snapshots: Partial<Record<SiteLocale, string>>;
}> => {
  assertOgProofLineConfig();
  const copies = getAllOgRouteCopy();
  mkdirSync(resolve(root, 'public/og'), { recursive: true });
  const manifest: Record<string, OgImageMeta> = {};
  const layouts: Array<{ copy: OgRouteCopy; layout: OgTitleLayout; meta: OgImageMeta }> = [];
  const keep = new Set<string>();

  for (const copy of copies) {
    if (!copy.h1.trim()) {
      const meta = fallbackOgImageMeta(copy.locale === 'es' ? 'Gisela Saldarriaga' : 'Gisela Saldarriaga');
      manifest[copy.localePath] = meta;
      layouts.push({
        copy,
        layout: { lines: [], fontSize: 0, truncated: false, missingGlyphs: [] },
        meta,
      });
      if (options.updateEntrypoints !== false) updateEntrypoint(root, copy, meta);
      continue;
    }
    const { buffer, layout } = await renderOgJpeg(copy, root);
    if (buffer.byteLength > 150 * 1024) {
      throw new Error(`OG image over 150KB (${buffer.byteLength}) for ${copy.localePath}`);
    }
    const publicPath = hashedOgPublicPath(copy);
    writeFileSync(resolve(root, `public${publicPath}`), buffer);
    keep.add(publicPath);
    const meta: OgImageMeta = {
      path: publicPath,
      url: `${OG_SITE_ORIGIN}${publicPath}`,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      alt: copy.h1,
      fallback: false,
    };
    manifest[copy.localePath] = meta;
    layouts.push({ copy, layout, meta });
    if (options.updateEntrypoints !== false) updateEntrypoint(root, copy, meta);
  }

  cleanStaleOgFiles(root, keep);
  writeManifest(root, manifest);

  const snapshots: Partial<Record<SiteLocale, string>> = {};
  if (options.snapshotDir) {
    mkdirSync(options.snapshotDir, { recursive: true });
    for (const locale of ['es', 'en'] as const) {
      const longest = copies
        .filter((copy) => copy.locale === locale)
        .sort((a, b) => b.h1.length - a.h1.length || b.h1.localeCompare(a.h1))[0];
      if (!longest) continue;
      const { buffer } = await renderOgJpeg(longest, root);
      const snapshotPath = join(options.snapshotDir, `og-longest-${locale}.jpg`);
      writeFileSync(snapshotPath, buffer);
      snapshots[locale] = snapshotPath;
    }
  }

  return { manifest, layouts, snapshots };
};

export const assertRequiredGlyphs = (root = defaultRoot) => {
  const titleFont = loadFont(root, 'public/fonts/og/cormorant-garamond-latin.ttf');
  const uiFont = loadFont(root, 'public/fonts/og/dm-sans-latin.ttf');
  const sample = 'ñáéíóúü¿· Gisela Saldarriaga 4.7/5 reseñas bilingüe';
  for (const font of [titleFont, uiFont]) {
    const missing = missingGlyphsIn(font, sample);
    if (missing.length > 0) {
      throw new Error(`brand font missing required glyphs: ${missing.join(' ')}`);
    }
  }
};

export const getLongestOgCopy = (locale: SiteLocale): OgRouteCopy =>
  getAllOgRouteCopy()
    .filter((copy) => copy.locale === locale)
    .sort((a, b) => b.h1.length - a.h1.length || b.h1.localeCompare(a.h1))[0];
