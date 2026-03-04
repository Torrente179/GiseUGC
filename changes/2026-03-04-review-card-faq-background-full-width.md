# 2026-03-04 - Review Card FAQ Background Full Width

## Summary
Updated the review-card section background to `#F5F0E9` on both desktop and mobile so it visually matches the FAQ section treatment.

## Changes Made
- `src/components/DesktopFiverrRatingSection.tsx`
  - Changed section wrapper background from `bg-background` to `bg-[#F5F0E9]`.
- `src/components/MobileFiverrRatingSection.tsx`
  - Changed section wrapper background from `bg-background` to `bg-[#F5F0E9]`.

The background is applied at section level, so it spans full width (like FAQ).

## Files Updated
- `src/components/DesktopFiverrRatingSection.tsx`
- `src/components/MobileFiverrRatingSection.tsx`
- `changes/2026-03-04-review-card-faq-background-full-width.md`

## Validation
- `git diff` reviewed for both updated section wrappers.
