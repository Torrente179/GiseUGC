# 2026-03-04 - Mobile Hamburger Immediate Transparency Transition

## Summary
Improved mobile hamburger-menu open responsiveness so the transparency/backdrop transition starts immediately on touch, instead of waiting behind below-fold loading work.

## Changes Made
1. High-priority interaction path for menu open
- Added touch `pointerdown` handling on the mobile hamburger button to open the menu immediately on touch start.
- Prevented duplicate toggles by ignoring the follow-up synthetic click generated after touch.
- Implemented in `src/components/Navbar.tsx`.

2. Deprioritized below-fold section mounting
- Wrapped `setShouldLoadBelowFold(true)` in `startTransition(...)` so lazy loading work (including `Portfolio`) runs at lower priority than active user input.
- Implemented in `src/pages/Index.tsx`.

## Files Updated
- `src/components/Navbar.tsx`
- `src/pages/Index.tsx`
- `changes/2026-03-04-mobile-hamburger-immediate-transparency-transition.md`

## Validation
- `npx eslint src/components/Navbar.tsx src/pages/Index.tsx`
- `npm run build`
