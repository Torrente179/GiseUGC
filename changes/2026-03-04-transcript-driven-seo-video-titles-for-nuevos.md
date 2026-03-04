# 2026-03-04 - Transcript-Driven SEO Video Titles for Nuevos Catalog

## Summary
Implemented transcript-aligned SEO title cleanup for all `nuevos` portfolio clips so cards and Theater no longer display raw source filenames like `IMG_8435` or `WhatsApp Video ...`.

## Context Reviewed
- `changes/2026-03-04-seo-geo-aeo-complete-audit-and-optimization.md`
- `changes/2026-03-04-video-transcript-extraction-and-seo-renaming-map.md`
- Generated transcript artifacts in `tmp/video-transcripts-nuevos/`

## What Changed

### 1. Added curated SEO overrides for nuevos clips
- New file:
  - `scripts/nuevos-seo-overrides.json`
- Contains 16 per-file overrides with:
  - `title` (human-readable, transcript-aligned, SEO-friendly)
  - `category` (existing `ReelClip` taxonomy)

### 2. Extended catalog generator to consume SEO overrides
- Updated:
  - `scripts/generate-nuevos-r2-catalog.mjs`
- Added generator arg:
  - `--seo-overrides` (default: `scripts/nuevos-seo-overrides.json`)
- Added robust override loading behavior:
  - gracefully handles missing overrides file
  - validates supported categories (`fashion|beauty|tech|lifestyle`)
  - supports Unicode normalization (NFC/NFD) for accent-sensitive filenames
- Generated output header now documents:
  - source manifest path
  - source SEO overrides path

### 3. Regenerated runtime catalog
- Updated generated runtime file:
  - `src/data/nuevos-r2-ready.ts`
- Result:
  - all 16 R2-ready clips keep same media URLs
  - only display metadata changed (title/category)
  - ugly technical names replaced with clean titles (e.g. `Voicebot para Clínica Dental`, `WhatsApp Bot para Ventas 24/7`, `Segunda Cuenta de WhatsApp`)

## Validation
1. `npm run video:catalog`
- `SEO title overrides loaded: 16`
- `R2 readiness: 16/16 ready, 0 blocked`

2. `npm run build`
- Build reaches bundle phase, then fails locally with macOS filesystem ACL (`EPERM copyfile`) on source files under `public/uploads/videos/nuevos`.
- This is a local file-permission condition, not a catalog/title logic failure.

## Notes
- No Theater preload/performance logic was changed.
- No source media filenames/URLs were modified.
- This pass only improves visible title semantics and SEO alignment for existing assets.
