# 2026-03-04 - Services Marquee Loop Toggle + Mobile Smoothness

## Summary
Documented the latest Services marquee implementation that introduced always-on loop behavior with click-to-expand descriptions, then stabilized mobile/desktop motion behavior to reduce choppy scrolling and decode pressure.

## Changes Made

### 1. New click interaction model for featured videos
- Replaced hover-only playback flow with default looping previews.
- Clicking a card now toggles the description panel (`expandedCard` state).
- While one card is expanded:
  - selected card keeps playing,
  - other cards are paused.
- Clicking the same card again closes it and restores the default looping behavior.

### 2. Playback control hardening
- Added centralized playback helper to normalize playback at `1x`.
- Added ref assignment logic that immediately applies the correct pause/play policy on mount/re-render.
- Added `forcePause` integration per card so expanded-state behavior is deterministic.

### 3. Smoothness and parity pass (mobile + desktop)
- Switched marquee movement from frame-based speed to time-based speed (`px/sec`) to avoid speed drift under frame drops.
- Added frame delta clamping to prevent large jump steps during main-thread stalls.
- Enabled `pauseOffscreen` on Services marquee videos to reduce offscreen decode load.
- Removed mobile-only speed and drag multiplier divergence so carousel physics match desktop behavior.

## Files Updated
- `src/components/ServicesMarquee.tsx`
- `changes/2026-03-04-services-marquee-loop-toggle-and-mobile-smoothness.md`

## Validation
- `npx eslint src/components/ServicesMarquee.tsx`
- `npx vite build`

## Related Commits
- `388a423` - Update services carousel video loop and click pause behavior
- `a4e8037` - Unify carousel motion behavior across mobile and desktop
