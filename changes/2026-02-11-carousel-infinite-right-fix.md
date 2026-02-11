# 2026-02-11 - Fix Carousel Infinite Scroll in Both Directions

## Summary
Fixed the carousel only being infinite when scrolling left but not right. The boundary wrap-around check was inside the auto-scroll condition, so it never ran during manual user scrolling (drag, arrows, trackpad).

## Root Cause
The wrap-around logic (`scrollLeft >= setWidth * 2 → jump back`) was nested inside the `if (!isPaused && !isDragging)` block in the animation loop. When the user manually scrolled right, `isDragging` was true, so the wrap check was skipped entirely. The `scroll` event handler was meant as a backup but couldn't reliably catch the exact threshold during fast scrolling.

## Fix
Moved the boundary check **outside** the auto-scroll condition so it runs **every frame** regardless of pause/drag state. Now the animation loop always checks and wraps in both directions, whether the scroll is from auto-play, user drag, arrow buttons, or trackpad.

## Files Updated
- `src/components/ServicesMarquee.tsx`
- `changes/2026-02-11-carousel-infinite-right-fix.md`
