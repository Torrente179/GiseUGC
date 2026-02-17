# 2026-02-17 - Services Marquee Mobile Swipe Stability + Speed

## Summary
Improved the mobile touch behavior of the services video carousel (below testimonials) so horizontal swipes feel firm and don't pull the page vertically, and increased mobile scrolling responsiveness.

## Changes Made
1. Prevented vertical page drift during horizontal swipe
- Added touch axis locking (`pending` -> `horizontal` / `vertical`) so the carousel only captures movement when the gesture is horizontal.
- Switched touch move listener to non-passive and call `preventDefault()` during horizontal drag to stop native page scroll interference.
- Added `touchAction: 'pan-x'` on the carousel container to hint horizontal-only gesture intent.

2. Increased mobile scroll speed
- Increased mobile auto-scroll speed for the marquee (`0.62` vs desktop `0.45`).
- Added a mobile drag multiplier (`1.28`) so touch swipes move cards farther per gesture.

3. Hardened touch lifecycle handling
- Added `touchcancel` handling and reset for drag/axis state cleanup.
- Kept desktop drag behavior unchanged.

## Files Updated
- `src/components/ServicesMarquee.tsx`
- `changes/2026-02-17-services-marquee-mobile-swipe-and-speed.md`

## Validation
- `npx eslint src/components/ServicesMarquee.tsx`
- `npm run build`
