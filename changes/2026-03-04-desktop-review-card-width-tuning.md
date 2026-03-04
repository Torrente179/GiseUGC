# 2026-03-04 - Desktop Review Card Width Tuning

## Summary
Reduced the horizontal stretch of the desktop review-card section only.

## Changes Made
- Updated `src/components/DesktopFiverrRatingSection.tsx`:
  - Added a width constraint to the section container:
    - `max-w-[980px] mx-auto`
- This affects only the desktop in-flow review section (`#desktop-rating-card`), not mobile or footer layout.

## Files Updated
- `src/components/DesktopFiverrRatingSection.tsx`
- `changes/2026-03-04-desktop-review-card-width-tuning.md`

## Validation
- `npx eslint src/components/DesktopFiverrRatingSection.tsx`
