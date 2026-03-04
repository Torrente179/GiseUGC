# 2026-03-04 - Footer Desktop: Hide Review Card and Center Header + Social

## Summary
Updated footer layout to hide the desktop review card and center the footer title/content with centered social media icons.

## Changes Made
1. Removed desktop footer review card
- Removed `FiverrRatingCard` usage from `src/components/Footer.tsx`.
- Footer no longer renders the review/rating card on desktop.

2. Centered footer header and social links
- Switched the footer top area to a single centered block.
- Centered brand title and description text.
- Unified social links into one centered responsive row:
  - mobile: `h-9 w-9`
  - desktop: `md:h-12 md:w-12`

## Files Updated
- `src/components/Footer.tsx`
- `changes/2026-03-04-footer-desktop-hide-review-card-and-center-header-social.md`

## Validation
- `npx eslint src/components/Footer.tsx`
