# 2026-02-17 - Mobile Reel Instant Switch Prebuffer

## Summary
Improve perceived instant playback when switching between mobile portfolio reel cards.

## Changes Made
- Added mobile reel card-state logic:
  - Active card: allowed to autoplay.
  - Neighbor cards (distance <= 1): prebuffered with `preload="auto"` while paused.
  - Far cards: stay `preload="none"`.
- Updated force-pause condition to pause all non-active cards (including warm neighbors).

## Why
Keeping immediate neighbors source-warm improves next/previous switch responsiveness without returning to all-cards decoding.

## What Does NOT Change
- No video files changed.
- No quality changes.
- Existing layout/animations/gestures unchanged.

## Files Updated
- `src/components/Portfolio.tsx`

## Validation
- `npm run build` passes.
