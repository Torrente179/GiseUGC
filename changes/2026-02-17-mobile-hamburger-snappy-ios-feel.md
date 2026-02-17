# 2026-02-17 - Mobile Hamburger Snappy iOS Feel

## Summary
Retuned the mobile hamburger menu motion profile for a snappier iOS-style feel on open, close, and swipe-to-dismiss.

## Changes Made
1. Motion profile retune
- Reduced open/close durations and tightened bezier curves for faster visual response.
- Increased spring stiffness/damping for quicker settle with minimal bounce.

2. Swipe responsiveness
- Lowered swipe close distance and velocity thresholds so flick-to-dismiss feels immediate.
- Reduced swipe dismiss duration to make upward close finish faster.

3. Menu detail timing
- Shortened stagger delay for mobile menu links.
- Reduced hamburger/X icon morph timing for a crisper toggle feedback.

## Files Updated
- `src/components/Navbar.tsx`
- `changes/2026-02-17-mobile-hamburger-snappy-ios-feel.md`

## Validation
- `npx eslint src/components/Navbar.tsx`
- `npm run build`
