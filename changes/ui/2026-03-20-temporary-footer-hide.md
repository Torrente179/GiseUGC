# 2026-03-20 temporary footer hide

## Files
- `src/index.css`

## Summary
1. Temporarily hid the footer from the frontend without modifying the in-progress footer redesign component.
2. Preserved the existing `#contact` anchor in the DOM so homepage and service-page contact links still have a valid scroll target.

## Notes
1. This is an intentionally reversible frontend-only hide. Removing the temporary CSS rule will restore the current footer redesign.
