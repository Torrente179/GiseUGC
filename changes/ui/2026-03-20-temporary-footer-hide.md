# 2026-03-20 temporary footer hide

## Files
- `src/pages/Index.tsx`
- `src/components/ServiceLandingPage.tsx`

## Summary
1. Temporarily removed footer rendering from the homepage and service landing pages without modifying the in-progress footer redesign component.
2. Preserved the existing `#contact` anchor at the bottom of those pages so navbar and CTA contact links still have a valid scroll target.

## Notes
1. This is an intentionally reversible composition-level hide. Restoring the `Footer` renders will bring the redesign back without touching `src/components/Footer.tsx`.
