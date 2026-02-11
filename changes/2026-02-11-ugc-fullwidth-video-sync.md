# 2026-02-11 - UGC Video Source Refresh and Full-Width Reel Sync

## Summary
Aligned the portfolio video reel with the full-width carousel treatment and replaced generic sample clips with UGC-related placeholder videos.

## Changes Made
1. Portfolio reel full-width structure
- Updated the portfolio short-video strip to full-bleed (`w-screen`) so it visually matches the moving carousel style.
- Increased card sizes and kept fixed card widths across breakpoints for a stronger infinite-strip look.
- Kept navigation arrows and updated scroll distance for larger cards.

2. Full-width fixed video cards
- Ensured reel cards render full-width media (`w-full`, `h-full`, `object-cover`) with fixed card dimensions.
- Added edge fade masks on both sides of the full-width strip to reinforce continuity.

3. UGC-related clip replacement
- Replaced all previously generic sample clips in:
  - Portfolio reel clips
  - Portfolio collage clips
  - Services moving carousel clips
- New placeholders are UGC-oriented clips (influencer, selfie, smartphone, makeup, creator-style lifestyle footage).

## Files Updated
- `src/components/Portfolio.tsx`
- `src/components/Services.tsx`
- `changes/2026-02-11-ugc-fullwidth-video-sync.md`

## Validation
- Ran `npm run build` successfully.
