# 2026-02-18 - System Theme Detection

## Summary
Added automatic light/dark theme detection so the website follows the user’s device preference by default.

## Changes Made

### 1. Theme Provider Default
- Updated `ThemeProvider` in `src/main.tsx`:
  - `defaultTheme` changed from `light` to `system`.
  - Kept `enableSystem` enabled.

### 2. Early Theme Application on Page Load
- Added an inline startup script in `index.html` to apply theme before React mounts:
  - Reads saved preference from `localStorage` (`theme` key).
  - Falls back to `prefers-color-scheme` when no explicit preference exists.
  - Applies/removes the `dark` class on `<html>` accordingly.
  - Sets `color-scheme` to match for browser-native controls.

## Files Updated
- `src/main.tsx`
- `index.html`

## Validation
- `npm run build` completed successfully.
