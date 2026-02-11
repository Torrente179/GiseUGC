# 2026-02-11 - Collage Motion and Copy Refinement

## Summary
Refined the interactive portfolio collage and services motion carousel to better match the reference direction.

## Changes Made
1. Collage hover motion improvements
- Increased movement on hover for the two lower collage videos so they slide inward and upward more noticeably.
- Added a slight lift to the center card while active to tighten composition during playback.
- Kept smooth transitions for enter/exit states.

2. Copy updates (benefit-first messaging)
- Replaced instruction-style text with value-oriented UGC messaging in both English and Spanish.
- Removed the previously generic lines about a "slow-moving carousel" and "mobile-first reel experience".
- Updated collage section messaging to focus on conversion benefits, trust-building, and creative testing value.

3. Services moving carousel media
- Added placeholder video previews inside each moving service card.
- Kept title labels per service while adding muted autoplay looped video thumbnails.

## Files Updated
- `src/components/Portfolio.tsx`
- `src/components/Services.tsx`
- `public/locales/en/translation.json`
- `public/locales/es/translation.json`
- `changes/2026-02-11-collage-and-carousel-refinement.md`

## Validation
- Ran `npm run build` successfully.
