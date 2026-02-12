# 2026-02-12 - Move Mobile Footer Social Icons Outside Fiverr Card

## Summary
Adjusted the footer mobile layout so social media icons are rendered outside the Fiverr ratings card, positioned directly below it.

## Changes Made
1. Mobile social icon placement
- Removed the mobile icon row from inside the Fiverr card container.
- Added the same icon row immediately below the card wrapper.
- Desktop behavior remains unchanged (`hidden md:flex` in the left brand block).

## Files Updated
- `src/components/Footer.tsx`
- `changes/2026-02-12-mobile-footer-icons-outside-fiverr-card.md`

## Validation
- `npm run build` completed successfully.
