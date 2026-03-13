# Navbar and Theater Hotfixes

## Summary
This is the navbar and theater hotfix note for the late regressions around language state and theater layering. It covers the production i18n crash fix in `Navbar.tsx` plus the short series of theater-navbar layering and clearance adjustments on March 9.

## Current runtime touchpoints
- `src/components/Navbar.tsx`
- `src/components/Portfolio.tsx`
- `src/index.css`
- `src/i18n.ts`

## Current state
1. `Navbar.tsx` once again reads language state from a real `i18n` binding, preventing the production runtime crash introduced by the missing reference.
2. Theater-related navbar behavior now keys off the document theater state instead of ad hoc layering assumptions.
3. The March 9 theater-navbar experiment was rolled back, leaving the cleaner non-overlapping mobile clearance and layer behavior in place without keeping the experimental navbar treatment.

## Legacy notes absorbed
- `2026-03-07-navbar-i18n-runtime-hotfix.md`
- `2026-03-09-revert-theater-navbar-experiment.md`
- `2026-03-09-theater-navbar-layer-fix.md`
- `2026-03-09-theater-navbar-mobile-clearance.md`
