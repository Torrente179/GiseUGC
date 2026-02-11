# 2026-02-11 - Carousel Motion Stabilization and Video Popups

## Summary
Adjusted carousel behavior and video interactions to improve UX and match the requested behavior.

## Changes Made
1. Services moving carousel motion
- Removed the vertical drift behavior so the carousel no longer moves up/down.
- Kept horizontal marquee flow only for cleaner and more predictable motion.

2. Video popup previews (small screen modal)
- Added click-to-open video preview modals for service carousel video cards.
- Added click-to-open video preview modals for portfolio reel cards.
- Each modal opens in a compact centered player with controls and close button.

3. Localization updates
- Added English and Spanish translation keys for preview labels and close actions:
  - `services.videoPreviewLabel`
  - `services.videoPreviewClose`
  - `portfolio.reelPreviewLabel`
  - `portfolio.reelPreviewClose`

## Files Updated
- `src/components/Services.tsx`
- `src/components/Portfolio.tsx`
- `public/locales/en/translation.json`
- `public/locales/es/translation.json`
- `changes/2026-02-11-carousel-motion-and-video-popups.md`

## Validation
- Ran `npm run build` successfully.
