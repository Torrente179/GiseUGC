# 2026-03-04 - Review Card FAQ Background Full Width

## Summary
Aligned the mobile and desktop Fiverr review-card sections with the FAQ section visual treatment by applying the requested background color `#F5F0E9` at the section wrapper level.

## Changes Made
- Updated `src/components/DesktopFiverrRatingSection.tsx`:
  - Changed section background from `bg-background` to `bg-[#F5F0E9]`.
- Updated `src/components/MobileFiverrRatingSection.tsx`:
  - Changed section background from `bg-background` to `bg-[#F5F0E9]`.

Applying the color on the `<section>` wrappers keeps the background full width, matching the FAQ-style section behavior.

## Files Updated
- `src/components/DesktopFiverrRatingSection.tsx`
- `src/components/MobileFiverrRatingSection.tsx`
- `changes/2026-03-04-review-card-faq-background-full-width.md`

## Validation
- Verified with `git diff` that only the section background classes changed in both review-card sections.
