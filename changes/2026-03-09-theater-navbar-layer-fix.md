# 2026-03-09 - Theater Navbar Layer Fix

## Summary
Fixed the theater-mode navbar visibility regression that was still present on both desktop and mobile after the earlier theater clearance pass.

## Changes Made

### 1. Deterministic theater navbar layering
- Updated `src/components/Navbar.tsx` to watch `data-theater` on the document root.
- Rendered a dedicated theater navbar through a portal into `document.body` so it no longer depends on the regular page stacking order.
- Kept the base navbar in place for the normal page flow while hiding it during theater mode.

### 2. Mobile menu stacking above theater
- Added a dedicated class to the mobile menu overlay and raised it above the theater layer.
- Kept the theater-specific compact navbar sizing from the previous pass, but scoped those rules to the new theater navbar layer in `src/index.css`.

## Files Modified
- `src/components/Navbar.tsx`
- `src/index.css`

## Validation
- `npx eslint src/components/Navbar.tsx src/components/Portfolio.tsx`
- `npm run build`

## Notes
- The build passed.
- Vite still reported the existing `duration-[250ms]` and `duration-[350ms]` Tailwind warnings, plus the existing CSS minifier warnings during bundling.
