# 2026-02-17 - Mobile Video Smoothness Pass

## Summary
Improve portfolio video smoothness on mobile by reducing concurrent decode/network pressure while preserving the same original video files, quality, theater playback quality, and existing animations/interactions.

## Changes Made

### 1. `LazyVideo` source attachment controls
- Added `forcePause` support (hard pause trigger from parent state)
- Added `unloadWhenOffscreen` support (detaches `src` when outside viewport)
- Added `unloadWhenForcedPause` support (detaches `src` while force-paused)
- Kept existing lazy-load and viewport pause behavior intact

### 2. Mobile reel playback budgeting
- Added center-card tracking for the mobile reel using scroll-position + `requestAnimationFrame`
- Only the center card and immediate neighbors remain active on mobile
- Farther cards are force-paused to prevent decoder saturation

### 3. Theater priority on mobile
- When theater is open, background reel and mobile collage previews are force-paused
- On mobile, those force-paused previews also unload their `src` to free bandwidth/memory for theater playback

## What Does NOT Change
- No video files changed (same assets and quality)
- No preview transcodes introduced
- Desktop interactions remain unchanged
- Portfolio layout, animations, gestures, and theater UX remain intact

## Files Updated
- `src/components/media/LazyVideo.tsx`
- `src/components/Portfolio.tsx`

## Validation
- `npm run build` passes.
- `npm run lint` still reports pre-existing unrelated lint errors in UI primitives.
