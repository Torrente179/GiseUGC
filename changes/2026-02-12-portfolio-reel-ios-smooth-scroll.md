# 2026-02-12 - Portfolio Reel iOS-Style Smooth Scrolling

## Summary
Refined the portfolio reel scrolling interactions to feel smoother and more native (especially on touch devices) while keeping protection against accidental video opening during normal page scrolling.

## Changes Made
1. Smoother horizontal reel behavior
- Changed carousel snapping from `snap-mandatory` to `snap-proximity` for less abrupt transitions.
- Added horizontal overscroll containment and smooth scrolling behavior on the reel container.
- Enabled iOS momentum scrolling with `WebkitOverflowScrolling: 'touch'`.

2. Reduced touch-axis interference on cards
- Replaced `touch-pan-y` with `touch-manipulation` on reel cards to avoid fighting horizontal swipe gestures.

3. Preserved accidental-open protection
- Added touch movement threshold detection (tap slop) on reel cards.
- Prevents opening the reel modal when the gesture was a drag/scroll instead of a true tap.

4. More consistent arrow navigation distance
- Updated arrow scroll logic to use actual card width and computed gap from layout rather than a fixed fallback gap.

## Files Updated
- `src/components/Portfolio.tsx`
- `changes/2026-02-12-portfolio-reel-ios-smooth-scroll.md`

## Validation
- Verified with `npm run build` (successful).
