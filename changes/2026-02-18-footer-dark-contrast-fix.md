# 2026-02-18 - Footer Dark Contrast Fix

## Summary
Fixed low-contrast text and icon visibility in the footer when dark mode is enabled.

## Root Cause
- The footer used a fixed light background (`#F6F3EE`) in all themes.
- After the dark palette update, footer text/icons still used dark-mode foreground tokens, which became too light against the light footer background.

## Changes Made
- Updated footer background classes in `src/components/Footer.tsx`:
  - Kept light mode background: `bg-[#F6F3EE]`
  - Added dark mode background: `dark:bg-background`
  - Added smooth color transition: `transition-colors duration-300`

## Files Updated
- `src/components/Footer.tsx`

## Validation
- `npm run build` completed successfully.
