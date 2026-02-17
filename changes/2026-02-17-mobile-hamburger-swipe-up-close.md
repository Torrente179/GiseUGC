# 2026-02-17 - Mobile Hamburger Swipe-Up Close

## Summary
Added an iPhone-style swipe-up dismiss interaction to the mobile hamburger menu, including drag-follow motion and buttery close/snap-back behavior.

## Changes Made
1. Swipe gesture support
- Added touch tracking for the mobile menu panel with axis lock (`horizontal` vs `vertical`).
- Enabled upward drag detection with distance + release velocity thresholds to trigger close.

2. Interactive menu motion
- Added live drag transform (`translateY`) while swiping up.
- Added progressive scale/opacity reduction for the menu panel and backdrop fade during gesture.
- Added spring-like snap-back if the gesture is too short/slow to close.

3. Safe state handling
- Added timeout cleanup and gesture state reset to prevent stale drag state after close/toggle/unmount.
- Preserved existing close paths (menu button, overlay tap, nav/contact link click).

## Files Updated
- `src/components/Navbar.tsx`
- `changes/2026-02-17-mobile-hamburger-swipe-up-close.md`

## Validation
- `npx eslint src/components/Navbar.tsx`
- `npm run build`
