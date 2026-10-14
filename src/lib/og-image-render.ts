/**
 * Build-time OG rasterizer. The card is the home hero in miniature: her own
 * scene, lightly blurred, a large "Gisela" behind her, the cut-out of her in
 * front, and the page's H1 with the Fiverr proof line in the lower left.
 * Scene and cut-out are the hero's own files and are placed with the same
 * geometry, so her edges sit on the background they were photographed on.
 * Type is DM Sans only, drawn as paths from the bundled variable font in
 * public/fonts/og/; nothing is fetched. Render errors fail the build. The
 * shared fallback image is used only for a route with no H1.
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
  getVariation: (settings: Record<string, number>) => FontLike;
  glyphForCodePoint: (codePoint: number) => { id: number };
  layout: (text: string) => {
    glyphs: Array<{ advanceWidth: number; path?: { toSVG?: () => string } }>;
    positions: Array<{ xAdvance: number; yAdvance: number; xOffset: number; yOffset: number }>;
  };
};

const here = dirname(fileURLToPath(import.meta.url));
const defaultRoot = resolve(here, '../..');

const INK = '#0B0B0D';
const WHITE = '#F4F3F1';
const SOFT = 'rgba(244, 243, 241, 0.8)';
const TITLE_MAX = 50;
const TITLE_MIN = 18;
const TITLE_MAX_LINES = 3;
const TITLE_WIDTH = 540;
const TITLE_LINE_HEIGHT = 1.14;
const MARGIN_X = 60;
const MARGIN_BOTTOM = 56;

const UI_FONT_PATH = 'public/fonts/og/dm-sans-latin.ttf';

// The hero's layers and where she sits in the 4032×2268 photo they come
// from (printed by scripts/clean-hero-cutout.py; mirrors --feed-cut-* in
// src/index.css). The card shows that photo as a frame 980px tall with her
// face at FACE_AT_X and the top of her head at HEAD_TOP. At this scale her
// head overlaps the edges of the "s" and the "e", as it does in the hero;
// FACE_AT_X is as far right as the frame can go and still cover the left edge.
const SCENE_PATH = 'public/uploads/gisela-scene-2016.webp';
const CUTOUT_PATH = 'public/uploads/gisela-cutout-980.webp';
const PHOTO = { width: 4032, height: 2268, cutX: 1425, cutY: 196, cutWidth: 980, cutHeight: 2072, faceX: 0.4767 };
const FRAME_HEIGHT = 980;
const FACE_AT_X = 830;
const HEAD_TOP = 62;

const NAME = 'Gisela';
const NAME_SIZE = 252;
const NAME_TRACKING = -0.05;
const NAME_BASELINE = 262;

export type OgTitleLayout = {
  lines: string[];
  fontSize: number;
  truncated: boolean;
  missingGlyphs: string[];
};

const loadFont = (root: string, relative: string, weight?: number): FontLike => {
  const font = fontkit.create(readFileSync(resolve(root, relative)));
  return weight === undefined ? font : font.getVariation({ wght: weight });
};

/** The H1 face, DM Sans Medium, as both the renderer and the tests lay it out. */
export const loadOgTitleFont = (root = defaultRoot): FontLike => loadFont(root, UI_FONT_PATH, 500);

const measureWidth = (font: FontLike, text: string, fontSize: number, tracking = 0): number => {
  const scale = fontSize / font.unitsPerEm;
  const run = font.layout(text);
  let width = 0;
  for (const position of run.positions) width += position.xAdvance;
  return width * scale + tracking * fontSize * Math.max(0, run.positions.length - 1);
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

const lineToSvg = (
  font: FontLike,
  text: string,
  fontSize: number,
  x: number,
  y: number,
  fill: string,
  tracking = 0,
): string => {
  const scale = fontSize / font.unitsPerEm;
  const run = font.layout(text);
  const trackingUnits = (tracking * fontSize) / scale;
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
    cursor += position.xAdvance + trackingUnits;
  }
  return parts.join('');
};

const hashPayload = (copy: OgRouteCopy): string =>
  createHash('sha256')
    .update(`${OG_STYLE_VERSION}\n${copy.locale}\n${copy.h1}\n${copy.proof}\n`)
    .digest('hex')
    .slice(0, 10);

export const hashedOgPublicPath = (copy: OgRouteCopy): string => `/og/${copy.slug}.${hashPayload(copy)}.jpg`;

const frameGeometry = () => {
  const scale = FRAME_HEIGHT / PHOTO.height;
  const frameWidth = PHOTO.width * scale;
  const left = FACE_AT_X - PHOTO.faceX * frameWidth;
  const top = HEAD_TOP - PHOTO.cutY * scale;
  return { scale, frameWidth, left, top };
};

/** The scene, sized as the frame and cut to the card. */
const renderScene = async (root: string): Promise<Buffer> => {
  const { frameWidth, left, top } = frameGeometry();
  return sharp(resolve(root, SCENE_PATH))
    .resize(Math.round(frameWidth), FRAME_HEIGHT, { fit: 'fill' })
    .extract({ left: Math.round(-left), top: Math.round(-top), width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT })
    .png()
    .toBuffer();
};

/** Her cut-out at the frame's scale, trimmed to what falls on the card. */
const renderCutout = async (root: string): Promise<{ input: Buffer; left: number; top: number }> => {
  const { scale, left, top } = frameGeometry();
  const width = Math.round(PHOTO.cutWidth * scale);
  const height = Math.round(PHOTO.cutHeight * scale);
  const x = Math.round(left + PHOTO.cutX * scale);
  const y = Math.round(top + PHOTO.cutY * scale);
  const resized = await sharp(resolve(root, CUTOUT_PATH))
    .resize(width, height, { fit: 'fill', kernel: 'lanczos3' })
    .png()
    .toBuffer();
  const input = await sharp(resized)
    .extract({ left: 0, top: 0, width, height: Math.min(height, OG_IMAGE_HEIGHT - y) })
    .png()
    .toBuffer();
  return { input, left: x, top: y };
};

const svgLayer = (body: string) => Buffer.from(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="${OG_IMAGE_WIDTH}" height="${OG_IMAGE_HEIGHT}" viewBox="0 0 ${OG_IMAGE_WIDTH} ${OG_IMAGE_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
${body}
</svg>`);

const STAR =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

export const renderOgJpeg = async (copy: OgRouteCopy, root = defaultRoot): Promise<{ buffer: Buffer; layout: OgTitleLayout }> => {
  if (copy.proof !== getOgProofLine(copy.locale)) {
    throw new Error(`OG proof line must equal getOgProofLine(${copy.locale})`);
  }
  const titleFont = loadOgTitleFont(root);
  const nameFont = loadFont(root, UI_FONT_PATH, 700);
  const uiFont = loadFont(root, UI_FONT_PATH, 500);
  const layout = layoutOgTitle(titleFont, copy.h1);
  if (layout.truncated || layout.lines.length > TITLE_MAX_LINES) {
    throw new Error(`OG H1 needs more than ${TITLE_MAX_LINES} lines at min ${TITLE_MIN}px: ${copy.h1}`);
  }
  if (layout.missingGlyphs.length > 0) {
    throw new Error(`OG font missing glyphs in "${copy.h1}": ${layout.missingGlyphs.join(' ')}`);
  }

  // Behind her: a little shade under the name, then the name.
  const nameWidth = measureWidth(nameFont, NAME, NAME_SIZE, NAME_TRACKING);
  const nameX = Math.min(FACE_AT_X - nameWidth / 2, OG_IMAGE_WIDTH - 40 - nameWidth);
  const back = svgLayer(`
  <defs>
    <linearGradient id="top" x1="0" y1="0" x2="0" y2="${OG_IMAGE_HEIGHT}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${INK}" stop-opacity="0.34"/>
      <stop offset="0.5" stop-color="${INK}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${OG_IMAGE_WIDTH}" height="${OG_IMAGE_HEIGHT}" fill="url(#top)"/>
  ${lineToSvg(nameFont, NAME, NAME_SIZE, nameX, NAME_BASELINE, WHITE, NAME_TRACKING)}`);

  // In front of her: shade where the copy sits, then the copy, set from the
  // bottom up so every H1 length keeps the same foot.
  const titleStep = layout.fontSize * TITLE_LINE_HEIGHT;
  const proofY = OG_IMAGE_HEIGHT - MARGIN_BOTTOM;
  const lastTitleY = proofY - 46;
  const firstTitleY = lastTitleY - titleStep * (layout.lines.length - 1);
  const brandY = firstTitleY - layout.fontSize - 22;
  const parts: string[] = [];
  parts.push(lineToSvg(uiFont, 'Gisela Saldarriaga · Gisela.UGC', 21, MARGIN_X, brandY, SOFT));
  layout.lines.forEach((line, index) => {
    parts.push(lineToSvg(titleFont, line, layout.fontSize, MARGIN_X, firstTitleY + index * titleStep, WHITE));
  });
  parts.push(`<path fill="${WHITE}" transform="translate(${MARGIN_X},${proofY - 18}) scale(0.82)" d="${STAR}"/>`);
  parts.push(lineToSvg(uiFont, copy.proof, 22, MARGIN_X + 28, proofY, SOFT));
  const front = svgLayer(`
  <defs>
    <radialGradient id="caption" cx="0" cy="${OG_IMAGE_HEIGHT}" r="780" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${INK}" stop-opacity="0.8"/>
      <stop offset="0.5" stop-color="${INK}" stop-opacity="0.48"/>
      <stop offset="1" stop-color="${INK}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${OG_IMAGE_WIDTH}" height="${OG_IMAGE_HEIGHT}" fill="url(#caption)"/>
  ${parts.join('\n  ')}`);

  const [scene, cutout] = await Promise.all([renderScene(root), renderCutout(root)]);
  const buffer = await sharp(scene)
    .composite([
      { input: back, left: 0, top: 0 },
      { input: cutout.input, left: cutout.left, top: cutout.top },
      { input: front, left: 0, top: 0 },
    ])
    .jpeg({ quality: 80, mozjpeg: true, chromaSubsampling: '4:2:0', force: true })
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
  const sample = 'ñáéíóúü¿· Gisela Saldarriaga 4.7/5 reseñas bilingüe';
  for (const font of [loadOgTitleFont(root), loadFont(root, UI_FONT_PATH, 700)]) {
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
