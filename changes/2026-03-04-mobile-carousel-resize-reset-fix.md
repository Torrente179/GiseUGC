# 2026-03-04 - Mobile Carousel Resize Reset Fix

## Summary
Fixed a mobile-only regression where the Services carousel could appear to refresh/reset to the beginning during touch interaction.

## Root Cause
On mobile browsers (notably iOS Safari), viewport/UI chrome changes can trigger resize events while users are interacting. The carousel remeasure path was being executed on these events, which caused the track position to be recomputed in a way that looked like a reset.

## Changes Made
- Updated `ServicesMarquee.tsx` resize handling to preserve logical offset during remeasure.
- Added a viewport-width guard so remeasure/offset correction runs only when width actually changes.
- Ignored height-only resize events (common with mobile browser bars), preventing unwanted carousel position jumps.

## File Updated
- `src/components/ServicesMarquee.tsx`
- `changes/2026-03-04-mobile-carousel-resize-reset-fix.md`

## Validation
- `npx eslint src/components/ServicesMarquee.tsx`
- `npx vite build`
