# 2026-02-17 - Floating Dock Bottom Fade + Mobile Footer Icon Sizing

## Summary
Added a desktop-only ghost fade effect for the floating contact dock at the absolute bottom of the page, and reduced mobile footer icon sizing so all contact icons stay on one line.

## Changes Made
1. Desktop floating dock ghost fade at absolute bottom
- Added a scroll/resize-driven state in `FloatingContactDock` to detect when the user reaches the absolute bottom of the document.
- At bottom only (desktop `md+`), the dock transitions to a ghost state with:
  - reduced opacity
  - slight scale down
  - small downward offset
  - subtle blur
- The state reverts immediately and smoothly as soon as scrolling up begins.
- Mobile dock behavior is unchanged.

2. Mobile footer contact icon sizing
- Updated the mobile footer icon row to keep all contact icons in one line:
  - changed row to `flex-nowrap`
  - reduced gap
  - reduced icon button size from `12x12` to `9x9` (`rem`-based Tailwind scale)
- Desktop footer icon sizing/layout is unchanged.

## Files Updated
- `src/components/FloatingContactDock.tsx`
- `src/components/Footer.tsx`
- `changes/2026-02-17-floating-dock-bottom-fade-and-mobile-footer-icon-sizing.md`

## Validation
- `npm run build`
