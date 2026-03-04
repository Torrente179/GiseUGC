# 2026-03-04 - R2-Gated Video Catalog + UTC Daily Portfolio Rotation

## Summary
Implemented a strict R2-gated video catalog pipeline for `nuevos` clips and refactored portfolio clip loading so Theater and reel cards share one authoritative library. Added UTC 24-hour rotation that refreshes automatically at day boundaries without requiring page reload.

## What Changed

### 1. New strict catalog generator (`scripts/generate-nuevos-r2-catalog.mjs`)
- Reads candidate clips from:
  - `public/uploads/videos/nuevos/manifest.csv`
- Verifies R2 readiness using `HEAD` checks for each required asset:
  - `videos/main/<original-name>`
  - `videos/mobile/<base>-mobile.mp4`
  - `videos/previews/<base>-preview.mp4`
  - `videos/posters/<base>-poster.jpg`
- Generates runtime module:
  - `src/data/nuevos-r2-ready.ts`
- Exposes:
  - `NUEVOS_R2_READY_CLIPS`
  - `NUEVOS_R2_BLOCK_REPORT`

### 2. Clip metadata extracted from Portfolio component
- Added `src/data/portfolio-clips.ts` with:
  - `ReelClip` type
  - R2 helper builders (`r2MainVideo`, `r2MobileVideo`, `r2PreviewVideo`, `r2Poster`)
  - `LEGACY_REEL_CLIPS` (existing 10 production clips)

### 3. Portfolio now uses one authoritative library
- `src/components/Portfolio.tsx` now builds:
  - `ALL_REEL_CLIPS = [...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS]`
- Removed brittle hardcoded local list and local `/uploads/videos/nuevos/*` runtime paths.
- Theater navigation remains full-library (`ALL_REEL_CLIPS`) and unchanged in behavior.
- Collage remains curated (unchanged).

### 4. UTC 24h randomization with automatic refresh
- Reel card selection now uses UTC day bucket:
  - `Math.floor(Date.now() / 86_400_000)`
- Selection is always shuffled before slicing, even when clip count equals display count.
- Added scheduled boundary refresh so open tabs update automatically after UTC day rollover.

### 5. Package scripts
- Added:
  - `npm run video:catalog`
- Added automatic catalog refresh on build:
  - `prebuild: npm run video:catalog`
  - `prebuild:dev: npm run video:catalog`

### 6. Canonical docs updated
- Updated `changes/video-encoding-tracking-setup-guide.md` with:
  - strict `nuevos` R2 gating rules
  - generated catalog workflow
  - updated source-of-truth references

## Validation
1. `npm run video:catalog` (pre-upload baseline)
- Result:
  - `0/16` `nuevos` clips ready (all blocked before R2 upload)

2. `npm run video:encode -- --input-dir public/uploads/videos/nuevos --output-dir tmp/video-encodes-nuevos --overwrite`
- Result:
  - 16/16 nuevos clips encoded with project profile
  - Preview total: `10.07 MB`
  - Mobile total: `76.40 MB`

3. Upload pack staged in `tmp/r2-upload`
- Added nuevos assets into all target folders (`main`, `mobile`, `previews`, `posters`) following existing R2 upload pattern.

4. `npm run build` (post-upload verification)
- Build passes with new catalog/data split and Portfolio refactor.
- Build now auto-runs `video:catalog` via `prebuild`.

5. `npm run video:catalog` (post-upload status)
- Result:
  - `13/16` `nuevos` clips ready
  - `3` clips still blocked due to missing `main` objects:
    - `WhatsApp Video 2026-02-19 at 14.08.01.mp4`
    - `WhatsApp Video 2026-02-19 at 14.09.00.mp4`
    - `WhatsApp Video 2026-02-19 at 16.05.21.mp4`

## Notes
- This change intentionally does not introduce local-file fallback for `nuevos` clips.
- New clips appear only when their full R2 asset set exists; catalog refresh is now automatic on build/deploy.
