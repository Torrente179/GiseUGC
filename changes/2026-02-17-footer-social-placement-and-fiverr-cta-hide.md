# 2026-02-17 - Footer Social Placement + Fiverr CTA Hide

## Summary
Updated the footer card/contact area so the Fiverr profile CTA is hidden and social icons are positioned exactly per breakpoint requirements.

## Changes Made
1. Hid Fiverr profile CTA in footer card
- Removed the `View Fiverr profile` link and icon from the Fiverr ratings card section.

2. Desktop social icon placement
- Kept social icons directly below:
  - `Your next campaign starts here.`
  - `Let's talk about a creative strategy focused on results.`

3. Mobile social icon placement
- Kept social icon row directly below the reviews/rating card block.

4. Completed footer social set
- Added `Facebook` icon link to footer social rows (desktop + mobile) so the footer includes all currently used social channels for that row.
- Added `target="_blank"` and `rel="noopener noreferrer"` on mobile social links for consistent external-link behavior.

## Files Updated
- `src/components/Footer.tsx`
- `changes/2026-02-17-footer-social-placement-and-fiverr-cta-hide.md`

## Validation
- `npm run build`
