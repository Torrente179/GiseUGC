# 2026-02-17 - Mobile Theater Vertical Navigation

## Summary
Switch mobile fullscreen theater navigation gesture from left/right to up/down swiping.

## Changes Made
- Added dedicated vertical-navigation swipe thresholds for mobile theater mode.
- Mobile gesture behavior now maps as:
  - Swipe up: next video.
  - Swipe down: previous video.
- Horizontal swipe on mobile now dismisses the theater.
- Desktop gesture behavior remains unchanged.

## What Does NOT Change
- No video files changed.
- No quality changes.
- Existing theater visuals/animations remain intact.

## Files Updated
- `src/components/Portfolio.tsx`

## Validation
- `npm run build` passes.
