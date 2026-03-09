# 2026-03-09 - Theater Navbar Mobile Clearance

## Summary
Kept the navbar available during portfolio theater mode while preventing the mobile navbar from sitting on top of the reel card.

## Changes Made

### 1. Theater navbar visibility
- Replaced the previous theater-mode navbar hide behavior with an explicit visible, interactive theater state.
- Added theater-targetable navbar hooks for the shell, brand, language switcher, and mobile controls.

### 2. Mobile theater sizing and spacing
- Compressed the mobile theater navbar footprint without changing fonts.
- Tightened the mobile language switch and icon button sizing for theater mode only.
- Added top safe-area clearance for the theater card and slightly reduced the mobile theater card max width so the card clears the navbar cleanly.

## Files Modified
- `src/components/Navbar.tsx`
- `src/components/Portfolio.tsx`
- `src/index.css`

## Validation
- `npx eslint src/components/Navbar.tsx src/components/Portfolio.tsx src/index.css`
- `npm run build`

## Notes
- `src/index.css` is ignored by the current ESLint configuration.
- The production build passed, but Vite still reported the existing `duration-[250ms]` and `duration-[350ms]` Tailwind warnings, plus two CSS minifier warnings during bundling.
