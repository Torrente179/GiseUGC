# 2026-02-11 - Theater Side Arrows and Background Scroll Lock

## Summary
Improved the reel theater modal UX by adding explicit previous/next controls and preventing the page behind the modal from moving while navigating videos.

## Changes Made
1. Theater side navigation controls
- Added left and right arrow buttons to the sides of the opened reel modal.
- Kept controls subtle on mobile (smaller size) and more visible on larger screens.
- Wired both buttons to existing reel navigation logic.

2. Background scroll lock while theater is open
- Implemented body scroll lock when the reel modal is active.
- Preserved and restored the original page scroll position after closing.
- Prevented accidental background movement when interacting with theater controls.

3. Localization updates
- Added modal arrow accessibility labels:
  - `portfolio.reelPreviewPrev`
  - `portfolio.reelPreviewNext`
- Added keys in both English and Spanish locale files.

## Files Updated
- `src/components/Portfolio.tsx`
- `public/locales/en/translation.json`
- `public/locales/es/translation.json`
- `changes/2026-02-11-theater-side-arrows-scroll-lock.md`

## Validation
- Verified with `npm run build` (successful).
