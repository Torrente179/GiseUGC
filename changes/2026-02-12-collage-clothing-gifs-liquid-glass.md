# 2026-02-12 - Collage GIF Videos + Liquid Glass Reel Overlay

## Summary
Replaced collage section videos with 3 new UGC clothing showcase clips that loop like GIFs (no audio). Updated the reel card text overlay from a dark frosted box to an iOS-style liquid glass effect.

## Changes Made

### 1. Collage GIF Videos
- Compressed 3 source videos to H.264 480p, CRF 30, no audio (`-an`)
- `ugc-clothing-showcase-1.mp4` (3.1 MB), `ugc-clothing-showcase-2.mp4` (3.8 MB), `ugc-clothing-showcase-3.mp4` (4.4 MB)
- Generated poster thumbnails for each
- Updated COLLAGE_CLIPS in Portfolio.tsx with new paths and dedicated translation keys

### 2. Liquid Glass Reel Card Overlay
- Replaced `bg-black/45 backdrop-blur-md` with `bg-white/18 backdrop-blur-xl border-white/28` + inset highlight + drop shadows
- Matches iOS liquid glass aesthetic: translucent white, strong blur, subtle inner glow
- Applied same style to the mute icon badge

## Files Updated
- `src/components/Portfolio.tsx` — collage video paths + liquid glass overlay
- `src/locales/es/translation.json` — collage clip labels (Spanish)
- `src/locales/en/translation.json` — collage clip labels (English)
- `public/locales/en/translation.json` — runtime EN copy

## Validation
- `npm run build` completed successfully.
