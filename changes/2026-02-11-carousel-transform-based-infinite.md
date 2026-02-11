# 2026-02-11 - Transform-Based Infinite Carousel

## Summary
Replaced native `overflow-x: auto` + `scrollLeft` approach with `overflow: hidden` + `transform: translateX()`. The previous approach relied on browser native scroll which fought our programmatic position changes — browser scroll momentum, elastic bounce (macOS), and smooth scroll animations all undermined the wrap-around logic, making rightward infinite scroll fail.

## Root Cause
Native `overflow-x: auto` gives the browser control over scroll positioning. When we tried to wrap (`scrollLeft -= setWidth`), the browser's ongoing scroll momentum, elastic overscroll, or smooth scroll animation would reassert its target position, overriding our programmatic change. This is why leftward wrapping worked (the browser was "helping" by bouncing at the boundary) but rightward didn't.

## Fix
Complete rewrite of the scroll engine:

1. **`overflow: hidden`** — Container no longer scrolls natively. Zero browser interference.
2. **`transform: translateX(-offset)`** — Track position controlled entirely via CSS transform on the inner div. Updated every frame via `requestAnimationFrame`.
3. **Manual drag handling** — `mousedown`/`mousemove`/`mouseup` and `touchstart`/`touchmove`/`touchend` tracked manually. Drag delta directly modifies the offset.
4. **Click vs drag distinction** — `hasDraggedRef` prevents card click from firing after a drag gesture (threshold: 5px).
5. **Arrow buttons** — Instant offset change (±300px) instead of `scrollBy` with `behavior: 'smooth'`.
6. **Wrap logic unchanged** — `offset >= setWidth * 2 → offset -= setWidth` and `offset <= 0 → offset += setWidth`. But now it runs without any browser interference.
7. **`will-change: transform`** — GPU-accelerated rendering for smooth performance.
8. **`onDragStart` prevented** — Blocks browser's native drag behavior on images/videos.

## Files Updated
- `src/components/ServicesMarquee.tsx`
- `changes/2026-02-11-carousel-transform-based-infinite.md`
