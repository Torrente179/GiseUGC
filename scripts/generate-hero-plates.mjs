/**
 * Blurred backdrop plates for the home hero, one per reel clip.
 *
 * The hero's background is the clip the reel card is playing, blurred out of
 * focus. Blurring in CSS would re-run a full-viewport filter on every
 * cross-fade, so the blur is baked here: each 360w poster variant becomes a
 * small, already-soft image that the browser can upscale for free.
 *
 * Every plate is normalised to the same mean brightness, so the white name in
 * front of it keeps the same contrast whichever clip is behind it.
 *
 * Usage: node scripts/generate-hero-plates.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { loadTsModule, rootDir } from './lib/load-ts-module.mjs';

const OUT_DIR = path.join(rootDir, 'public/uploads/hero-plates');
const WIDTH = 180;
const HEIGHT = 320;
const BLUR_SIGMA = 26;
// sRGB mean of ~118 keeps the backdrop light while the white name in front of
// it still clears roughly 4.5:1.
const TARGET_MEAN = 118;

const { LEGACY_REEL_CLIPS, getPosterVariantSrc } = await loadTsModule('src/data/portfolio-clips.ts');

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const clip of LEGACY_REEL_CLIPS) {
  const source = path.join(rootDir, 'public', getPosterVariantSrc(clip, 360, 'webp'));
  const soft = sharp(source).resize(WIDTH, HEIGHT, { fit: 'cover' }).blur(BLUR_SIGMA);
  const { channels } = await soft.clone().stats();
  const mean = (channels[0].mean + channels[1].mean + channels[2].mean) / 3;
  const gain = Math.min(1.6, Math.max(0.6, TARGET_MEAN / mean));
  const out = path.join(OUT_DIR, `reel-${clip.id}.webp`);
  await soft.linear(gain, 0).webp({ quality: 72 }).toFile(out);
  console.log(`reel-${clip.id}.webp  mean ${mean.toFixed(0)} → ×${gain.toFixed(2)}`);
}
