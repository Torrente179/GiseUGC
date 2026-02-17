# 2026-02-17 - Sitewide Buttery iOS Performance Pass

## Summary
Applied a sitewide performance pass to make interactions and video playback feel closer to iOS-level smoothness on mobile and desktop, without changing theme colors, fonts, or video quality.

## Changes Made
1. Navbar scroll work reduction
- Replaced direct scroll state updates with `requestAnimationFrame`-throttled updates.
- Switched to passive scroll listener to reduce main-thread contention during touch scroll.

2. Hero parallax CPU gating
- Added viewport-aware gating for hero parallax updates using `IntersectionObserver`.
- Prevented parallax RAF scheduling when hero is outside the active viewport range.

3. Services marquee frame-budget optimization
- Refactored marquee loop into time-based RAF updates.
- Added viewport + tab-visibility gating so animation pauses when offscreen or tab is hidden.
- Scoped global pointer/touch move listeners to active drag only.
- Upgraded transform writes to `translate3d` compositor path.

4. Portfolio mobile reel video continuity
- Expanded near-neighbor prewarm window for mobile reel cards.
- Kept active card on `preload=\"auto\"`, nearby cards on `metadata`, distant cards on `none`.

5. LazyVideo rerender trimming
- Avoided viewport-state React rerenders unless offscreen source unloading is actually enabled.
- Preserved existing playback behavior and quality strategy.

## Files Updated
- `src/components/Navbar.tsx`
- `src/components/Hero.tsx`
- `src/components/ServicesMarquee.tsx`
- `src/components/Portfolio.tsx`
- `src/components/media/LazyVideo.tsx`
- `changes/2026-02-17-sitewide-buttery-ios-performance-pass.md`

## Validation
- `npx eslint src/components/Navbar.tsx src/components/Hero.tsx src/components/ServicesMarquee.tsx src/components/Portfolio.tsx src/components/media/LazyVideo.tsx`
- `npm run build`
