# 2026-02-12 - Mobile Contact Toggle Persistence + Contrast Improvement

## Summary
Refined the mobile floating contact interaction so the expanded channel list stays open while users keep scrolling, and improved visual solidity/contrast so icons remain readable over complex backgrounds.

## Changes Made
1. Toggle persistence behavior
- Removed outside-tap auto-close logic for the mobile contact panel.
- Panel now closes only when the toggle button is pressed again.
- Implemented in `src/components/FloatingContactDock.tsx`.

2. Stronger visual contrast
- Reduced transparency across the mobile expanded panel and icon bubbles.
- Switched to more solid card/border tones and stronger icon tone classes to improve legibility.
- Implemented in `src/components/FloatingContactDock.tsx`.

## Files Updated
- `src/components/FloatingContactDock.tsx`
- `changes/2026-02-12-mobile-contact-toggle-persistence-and-contrast.md`

## Validation
- `npm run build` completed successfully.
