# 2026-02-11 - Mobile Theater Redesign and Swipe Physics

## Summary
Reimagined the mobile reel theater experience in the portfolio section with high-quality interaction and visual polish.

## Changes Made
1. Theater-mode animation and interaction upgrade
- Added smooth open/close theater transitions with layered backdrop treatment.
- Implemented live drag-follow behavior while swiping up/down on mobile.
- Added velocity + distance gesture thresholds so dismiss feels responsive and intentional.
- Added spring-back behavior when swipe does not meet dismiss threshold.
- Added directional dismiss trajectory (upward or downward) for natural exit motion.
- Added `Escape` key support for quick close.

2. Theater card visual redesign
- Reframed the modal with a premium glass-like shell, gradient overlays, and elevated shadows.
- Improved close button styling and overall visual hierarchy.
- Updated video framing to a stronger theater look with cleaner border and bottom gradient fade.

3. Labeling and localization
- Replaced the old preview legend with branded `Gise.UGC` title styling in the modal header.
- Added localized swipe helper text:
  - English: `portfolio.reelPreviewSwipeHint = "Swipe up or down to close"`
  - Spanish: `portfolio.reelPreviewSwipeHint = "Desliza hacia arriba o abajo para cerrar"`

## Files Updated
- `src/components/Portfolio.tsx`
- `public/locales/en/translation.json`
- `public/locales/es/translation.json`
- `changes/2026-02-11-mobile-theater-redesign-and-swipe-physics.md`

## Validation
- Ran `npm run build` successfully after implementing the interaction/UI updates.
