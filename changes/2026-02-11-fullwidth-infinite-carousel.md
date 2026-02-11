# 2026-02-11 - Full-Width Infinite Carousel Scaling

## Summary
Updated the moving services carousel to feel larger, full-width, and continuously flowing, with edge-to-edge video thumbnails in each card.

## Changes Made
1. Full-width infinite strip
- Expanded the moving carousel from container width to full viewport width using a full-bleed layout.
- Kept gradient edge masks to preserve the infinite-scroll illusion.

2. Larger carousel cards
- Increased card widths and media heights for a stronger visual presence.
- Improved spacing to better match the large continuous reference style.

3. Full-width media inside cards
- Removed inset/padded media treatment.
- Video thumbnails now render edge-to-edge within each card for a cleaner, bolder look.

4. Motion pacing
- Slowed marquee speed to better support the bigger full-width presentation.

## Files Updated
- `src/components/Services.tsx`
- `src/index.css`
- `changes/2026-02-11-fullwidth-infinite-carousel.md`

## Validation
- Ran `npm run build` successfully.
