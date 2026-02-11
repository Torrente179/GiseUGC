# 2026-02-11 - Fixed Reel Cards + Full-Bleed Toolkit Carousel Restoration

## Summary
Restored the two requested visual behaviors in one pass:
- Portfolio short-video cards are now fixed (no horizontal scroll controls).
- The "El toolkit completo para anunciantes modernos" carousel is back to full-width infinite flow (not boxed).

## Changes Made
1. Portfolio reel card layout (fixed, no scroll)
- Removed reel arrow controls and manual horizontal scroll behavior.
- Replaced the old scroll strip with a fixed responsive grid that shows all cards directly.
- Kept click-to-open small preview modal for each reel card.

2. Portfolio collage hover motion
- Increased movement of the lower collage cards when hovered/active so they visibly move inward/upward.
- Kept play/pause behavior tied to pointer/focus enter and leave/blur.

3. UGC-style demo video refresh
- Replaced portfolio reel and collage clips with creator-style demos (selfie, skincare demo, smartphone recording, influencer shots).
- Replaced service motion carousel clips with matching UGC-style creator demos.

4. Services motion carousel full-width restoration
- Removed boxed panel wrapper around the moving carousel section.
- Restored full-bleed viewport-width marquee strip with edge fades and continuous infinite movement.
- Kept click-to-open compact video preview modal for service cards.

## Files Updated
- `src/components/Portfolio.tsx`
- `src/components/Services.tsx`
- `changes/2026-02-11-fixed-reel-and-full-bleed-toolkit-restoration.md`

## Validation
- Ran `npm run build` successfully.
