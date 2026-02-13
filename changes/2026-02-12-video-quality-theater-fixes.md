# 2026-02-12 - Video Quality Upgrade, Theater Fixes & Reel Card Cleanup

## Summary
Re-encoded all portfolio videos at CRF 18 (visually lossless) for much sharper quality, fixed three theater playback issues, and simplified reel card overlays to clean video-only cards.

## Changes Made

### 1. Video Quality Upgrade (CRF 28 → CRF 18)
- Re-encoded all 10 reel videos and 3 collage GIF clips at CRF 18, 720p
- `ugc-lifestyle-review.mp4` uses CRF 23 due to its 73s length (29 MB vs 62 MB at CRF 18)
- Collage GIF videos encoded at 480p CRF 18, no audio (`-an`)
- All poster thumbnails regenerated
- Total size: ~250 MB (from ~32 MB at CRF 28), all lazy-loaded

### 2. HDR Video Handling
- `ugc-voiceover-bots-review.mp4` (HEVC 10-bit source) initially stripped to SDR — looked washed out
- Restored original BT.2020/HLG HDR metadata for rich colors on HDR displays
- SDR devices fall back gracefully

### 3. Theater Navigation Fix
- Added `key={activeReelPreview.id}` to force React to fully re-mount the video element when switching between clips
- Previously reused the same `<video>` element causing wonky/delayed transitions on swipe

### 4. Theater Play Icon Fix
- Replaced native `<video controls>` with custom `TheaterVideo` component
- Play/pause button hides instantly via `onPlay`/`onPlaying`/`onTimeUpdate` events
- No more lingering pause icon for 5 seconds while video is already playing
- Custom toggle: tap video area to play/pause

### 5. Reel Card Overlay Simplification
- Removed glass box, category label, mute icon, and gradient overlay
- Tried multiple approaches (dark glass, liquid glass, font swaps) — settled on clean video-only cards
- Progression: dark box → iOS liquid glass → font matching → title only → removed entirely

### 6. Collage Section: New GIF Videos
- 3 new UGC clothing showcase clips replace previous collage videos
- Encoded without audio for seamless GIF-like looping
- New translation keys: `portfolio.collageClip1/2/3`

## Files Updated
- `src/components/Portfolio.tsx` — TheaterVideo component, clean reel cards, collage video paths
- `src/locales/es/translation.json` — collage clip labels
- `src/locales/en/translation.json` — collage clip labels
- `public/locales/en/translation.json` — runtime EN copy
- `public/uploads/videos/*.mp4` — all 13 videos re-encoded
- `public/uploads/videos/*-poster.jpg` — all posters regenerated

## Validation
- `npm run build` completed successfully.
- All videos lazy-loaded via IntersectionObserver, no impact on initial page speed.
