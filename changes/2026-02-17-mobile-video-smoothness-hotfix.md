# 2026-02-17 - Mobile Video Smoothness Hotfix

## Summary
Fix mobile portfolio videos not loading reliably after the smoothness pass.

## Root Cause
The previous optimization detached video `src` while cards were force-paused/unseen on mobile (`unloadWhenOffscreen` / `unloadWhenForcedPause`).
For large local videos, frequent detach/reattach caused slow restarts and visible loading failures during swipe/navigation.

## Hotfix Applied
- Removed `unloadWhenOffscreen` from mobile reel previews.
- Removed `unloadWhenForcedPause` from mobile reel previews.
- Removed both unload flags from mobile collage previews.
- Kept `forcePause` decode-throttling logic intact.

## Result
- Mobile videos load and start playback reliably again.
- Theater and nearby-card prioritization still reduce concurrent decode pressure.
- No video files changed. Quality, animation, and interactions preserved.

## Files Updated
- `src/components/Portfolio.tsx`

## Validation
- `npm run build` passes.
