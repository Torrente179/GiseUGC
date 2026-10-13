import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  assertFiverrProofLine,
  assertOgProofLineConfig,
  FIVERR_PROOF_LINE,
  FIVERR_PROOF_LINE_EXACT,
  getOgProofLine,
  OG_PROOF_LINE_MODE,
  SITE_PROOF,
} from '@/data/site-proof';
import {
  applyOgImageTagsToHtml,
  getAllOgRouteCopy,
  getOgImageMeta,
  getOgRouteCopy,
  htmlFileForLocalePath,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  OG_SITE_ORIGIN,
} from '@/lib/og-image';
import {
  assertRequiredGlyphs,
  getLongestOgCopy,
  hashedOgPublicPath,
  layoutOgTitle,
  renderOgJpeg,
  writeOgImages,
} from '@/lib/og-image-render';
import { createRequire } from 'node:module';
import { PAGE_REGISTRY, SITE_LOCALES } from '@/lib/locale-path';

const require = createRequire(import.meta.url);
const fontkit = require('fontkit');
const root = process.cwd();

// Cursor cloud agents collect screenshots from /opt/cursor/artifacts. Elsewhere
// (local Macs, GitHub CI) that folder doesn't exist, so the copy is skipped
// unless CURSOR_ARTIFACTS_DIR points somewhere writable.
const CURSOR_ARTIFACTS_ROOT = '/opt/cursor/artifacts';
const cursorScreenshotDir =
  process.env.CURSOR_ARTIFACTS_DIR ??
  (existsSync(CURSOR_ARTIFACTS_ROOT) ? resolve(CURSOR_ARTIFACTS_ROOT, 'screenshots') : undefined);

const jpegSize = (buffer: Buffer) => {
  if (buffer[0] !== 0xff || buffer[1] !== 0xd8) throw new Error('not a jpeg');
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) break;
    const marker = buffer[offset + 1];
    const size = buffer.readUInt16BE(offset + 2);
    if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + size;
  }
  throw new Error('no sof marker');
};

describe('shared Fiverr proof line', () => {
  it('matches the locked ES/EN wording and SITE_PROOF numerals', () => {
    assertFiverrProofLine();
    assertOgProofLineConfig();
    expect(OG_PROOF_LINE_MODE).toBe('exact');
    expect(FIVERR_PROOF_LINE.es).toBe('4.7/5 · 177 reseñas en Fiverr');
    expect(FIVERR_PROOF_LINE.en).toBe('4.7/5 · 177 reviews on Fiverr');
    expect(FIVERR_PROOF_LINE).toEqual(FIVERR_PROOF_LINE_EXACT);
    expect(FIVERR_PROOF_LINE.es).toContain(String(SITE_PROOF.fiverrRating));
    expect(FIVERR_PROOF_LINE.es).toContain(String(SITE_PROOF.fiverrReviewCount));
    expect(FIVERR_PROOF_LINE.en).toContain(String(SITE_PROOF.fiverrReviewCount));
  });
});

describe('per-page OG copy', () => {
  it('covers every PAGE_REGISTRY locale path with a unique slug and locale-correct proof', () => {
    const copies = getAllOgRouteCopy();
    expect(copies).toHaveLength(PAGE_REGISTRY.length * SITE_LOCALES.length);
    expect(copies).toHaveLength(46);
    const slugs = copies.map((copy) => copy.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const copy of copies) {
      expect(copy.proof).toBe(getOgProofLine(copy.locale));
      expect(copy.h1.length).toBeGreaterThan(3);
      expect(copy.h1).not.toMatch(/\.\.\.|…/u);
      expect(copy.h1).not.toMatch(/GiseUGC/iu);
    }
    expect(getOgRouteCopy('/servicios/').h1).toContain('Gisela Saldarriaga');
    expect(getOgRouteCopy('/en/services/bilingual-ugc-creator/').locale).toBe('en');
  });
});

describe('OG title layout never truncates', () => {
  const titleFont = fontkit.create(readFileSync(resolve(root, 'public/fonts/og/cormorant-garamond-latin.ttf')));

  it('keeps the full H1, including the services-hub name line, in at most 3 lines', () => {
    for (const copy of getAllOgRouteCopy()) {
      const layout = layoutOgTitle(titleFont, copy.h1);
      expect(layout.truncated, copy.h1).toBe(false);
      expect(layout.lines.join(' ')).toBe(copy.h1);
      expect(layout.lines.length).toBeGreaterThan(0);
      expect(layout.lines.length).toBeLessThanOrEqual(3);
      expect(layout.lines.join(' ')).not.toMatch(/\.\.\.|…/u);
    }
  });

  it('renders ñ á é ¿ · from the local brand fonts', () => {
    assertRequiredGlyphs(root);
    const layout = layoutOgTitle(
      titleFont,
      'Contrata a Gisela Saldarriaga: reseñas bilingüe, ¿qué está? · 4.7/5',
    );
    expect(layout.missingGlyphs).toEqual([]);
    expect(layout.lines.join(' ')).toContain('ñ');
    expect(layout.lines.join(' ')).toContain('á');
    expect(layout.lines.join(' ')).toContain('é');
    expect(layout.lines.join(' ')).toContain('ü');
    expect(layout.lines.join(' ')).toContain('¿');
    expect(layout.lines.join(' ')).toContain('·');
  });

  it('fails the build instead of falling back when an H1 still needs more than 3 lines', async () => {
    const tooLong = Array.from({ length: 80 }, (_, index) => `palabra${index}`).join(' ');
    await expect(
      renderOgJpeg(
        {
          locale: 'es',
          localePath: '/fake/',
          h1: tooLong,
          proof: getOgProofLine('es'),
          slug: 'es-fake',
        },
        root,
      ),
    ).rejects.toThrow(/more than 3 lines/);
  });
});

describe('OG image files', () => {
  it('writes a unique hashed 1200x630 jpg per route and updates entrypoints', async () => {
    const { manifest, layouts } = await writeOgImages(root, { updateEntrypoints: true });
    const urls = Object.values(manifest).map((meta) => meta.url);
    expect(urls).toHaveLength(46);
    expect(new Set(urls).size).toBe(46);

    for (const { copy, layout, meta } of layouts) {
      expect(meta.fallback).toBe(false);
      expect(meta.width).toBe(OG_IMAGE_WIDTH);
      expect(meta.height).toBe(OG_IMAGE_HEIGHT);
      expect(meta.url.startsWith(`${OG_SITE_ORIGIN}/og/`)).toBe(true);
      expect(meta.path).toBe(hashedOgPublicPath(copy));
      expect(meta.path).toMatch(/^\/og\/[a-z0-9-]+\.[a-f0-9]{10}\.jpg$/u);
      expect(layout.truncated).toBe(false);
      expect(copy.proof).toBe(getOgProofLine(copy.locale));
      const buffer = readFileSync(resolve(root, `public${meta.path}`));
      expect(buffer.byteLength).toBeGreaterThan(8);
      expect(buffer.byteLength).toBeLessThanOrEqual(150 * 1024);
      expect(jpegSize(buffer)).toEqual({ width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT });
      const html = readFileSync(resolve(root, htmlFileForLocalePath(copy.localePath)), 'utf8');
      expect(html).toContain(`content="${meta.url}"`);
      expect(html).toContain('property="og:image:type" content="image/jpeg"');
      expect(html).toContain('property="og:image:width"');
      expect(html).toContain('property="og:image:height"');
      expect(html).toContain('property="og:image:alt"');
      expect(html).toContain('name="twitter:card" content="summary_large_image"');
      expect(html).toContain(`name="twitter:image" content="${meta.url}"`);
    }

    expect(manifest['/']?.url).not.toBe(manifest['/servicios/creadora-ugc-bilingue/']?.url);
    expect(manifest['/servicios/creadora-ugc-bilingue/']?.url).not.toBe(
      manifest['/en/services/bilingual-ugc-creator/']?.url,
    );
    expect(getOgImageMeta('/').fallback).toBe(false);
    expect(getOgImageMeta('/').url).toMatch(/^https:\/\/www\.giselasaldarriaga\.com\/og\//u);
  }, 120_000);

  it('writes longest-H1 snapshots for each language', async () => {
    const snapshotDir = resolve(root, 'tmp/og-snapshots');
    mkdirSync(snapshotDir, { recursive: true });
    const { snapshots } = await writeOgImages(root, { updateEntrypoints: false, snapshotDir });
    expect(snapshots.es).toBeTruthy();
    expect(snapshots.en).toBeTruthy();
    expect(getLongestOgCopy('es').h1.length).toBeGreaterThan(40);
    expect(getLongestOgCopy('en').h1.length).toBeGreaterThan(40);
    const es = readFileSync(snapshots.es!);
    const en = readFileSync(snapshots.en!);
    expect(jpegSize(es)).toEqual({ width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT });
    expect(jpegSize(en)).toEqual({ width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT });
    if (cursorScreenshotDir) {
      mkdirSync(cursorScreenshotDir, { recursive: true });
      writeFileSync(resolve(cursorScreenshotDir, 'og-longest-es.jpg'), es);
      writeFileSync(resolve(cursorScreenshotDir, 'og-longest-en.jpg'), en);
    }
  }, 120_000);
});

describe('OG HTML tag helper', () => {
  it('writes absolute https image tags and twitter:card', () => {
    const html = applyOgImageTagsToHtml('<head><meta property="og:image" content="old" /></head>', {
      path: '/og/es-home.abc123abc1.jpg',
      url: 'https://www.giselasaldarriaga.com/og/es-home.abc123abc1.jpg',
      width: 1200,
      height: 630,
      alt: 'UGC bilingüe',
      fallback: false,
    });
    expect(html).toContain('https://www.giselasaldarriaga.com/og/es-home.abc123abc1.jpg');
    expect(html).toContain('og:image:type');
    expect(html).toContain('image/jpeg');
    expect(html).toContain('og:image:width');
    expect(html).toContain('og:image:alt');
    expect(html).toContain('twitter:card');
    expect(html).toContain('summary_large_image');
  });
});

describe('OG render is deterministic', () => {
  it('emits the same JPEG bytes for the same route copy', async () => {
    const copy = getOgRouteCopy('/');
    const first = await renderOgJpeg(copy, root);
    const second = await renderOgJpeg(copy, root);
    expect(first.buffer.equals(second.buffer)).toBe(true);
  }, 30_000);
});
