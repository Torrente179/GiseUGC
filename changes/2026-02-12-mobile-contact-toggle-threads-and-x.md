# 2026-02-12 - Mobile Contact Toggle + Threads + X Rebrand

## Summary
Improved mobile contact bubble UX by replacing the persistent bubble panel with a toggle button that reveals channels vertically, added Threads as a new channel, and updated Twitter presentation to X.

## Changes Made
1. Mobile floating dock behavior redesign
- Replaced persistent mobile bubble box with a single toggle control.
- On toggle open, contact bubbles animate in vertically.
- Added outside-tap and desktop-resize close handling.
- Implemented in `src/components/FloatingContactDock.tsx`.

2. Added Threads channel
- Added Threads to:
  - floating contact dock
  - hamburger menu contact grid
- Implemented in:
  - `src/components/FloatingContactDock.tsx`
  - `src/components/Navbar.tsx`

3. Twitter rebrand to X
- Switched channel display and icon treatment from Twitter to X in both contact UIs.
- Added URL fallback support:
  - `VITE_X_URL` (falls back to `VITE_TWITTER_URL`, then `https://x.com/`)
- Implemented in:
  - `src/components/FloatingContactDock.tsx`
  - `src/components/Navbar.tsx`

4. Localization updates
- Updated i18n labels and ARIA text for:
  - X
  - Threads
  - mobile contact toggle button states
- Applied in:
  - `public/locales/es/translation.json`
  - `public/locales/en/translation.json`

## Files Updated
- `src/components/FloatingContactDock.tsx`
- `src/components/Navbar.tsx`
- `public/locales/es/translation.json`
- `public/locales/en/translation.json`
- `changes/2026-02-12-mobile-contact-toggle-threads-and-x.md`

## Validation
- `npm run build` completed successfully.
