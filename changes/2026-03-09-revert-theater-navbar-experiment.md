# 2026-03-09 - Revert Theater Navbar Experiment

## Summary
Removed the theater-mode navbar experiment after it failed to behave correctly across devices, and restored the previous theater overlay behavior.

## Changes Made

### 1. Navbar rollback
- Removed the dedicated theater navbar layering logic from `src/components/Navbar.tsx`.
- Removed the portal-based theater navbar render path and the extra theater-only navbar hooks/classes.
- Restored the standard navbar structure and the previous mobile menu overlay class usage.

### 2. Theater overlay rollback
- Restored the original theater overlay geometry in `src/components/Portfolio.tsx`.
- Reverted the mobile top clearance and reduced-width theater card changes that only existed to support the theater navbar experiment.

### 3. CSS rollback
- Removed the theater-specific navbar override block from `src/index.css`.
- Restored the previous desktop-only theater rule that hides the navbar while the preview is open.

## Files Modified
- `src/components/Navbar.tsx`
- `src/components/Portfolio.tsx`
- `src/index.css`

## Validation
- `npx eslint src/components/Navbar.tsx src/components/Portfolio.tsx`
- `npm run build`

## Notes
- The build passed.
- The existing Tailwind warnings for `duration-[250ms]` and `duration-[350ms]` are still present.
