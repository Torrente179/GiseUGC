# 2026-02-17 - Video Playback Speed Stability Fix

## Summary
Stabilized video playback speed across mobile and desktop by enforcing normalized playback rate (`1x`) at all autoplay/play entry points, including lazy-loaded videos and manually controlled video interactions.

## Changes Made
1. Added playback rate normalization to lazy video component
- Updated `src/components/media/LazyVideo.tsx`
- Enforces:
  - `video.playbackRate = 1`
  - `video.defaultPlaybackRate = 1`
- Applied on:
  - ref assignment
  - autoplay effect before `play()`
  - `onLoadedMetadata`

2. Stabilized Services marquee hover/click playback
- Updated `src/components/ServicesMarquee.tsx`
- Before each `play()` call, explicitly resets playback rate to `1x`.

3. Stabilized Portfolio playback interactions
- Updated `src/components/Portfolio.tsx`
- Applied playback rate reset in:
  - theater video toggle play/pause path
  - theater startup autoplay effect on source change
  - theater `<video onLoadedMetadata>` handler
  - collage hover autoplay helper

## Files Updated
- `src/components/media/LazyVideo.tsx`
- `src/components/ServicesMarquee.tsx`
- `src/components/Portfolio.tsx`
- `changes/2026-02-17-video-playback-speed-stability-fix.md`

## Validation
- `npm run build` completed successfully.
