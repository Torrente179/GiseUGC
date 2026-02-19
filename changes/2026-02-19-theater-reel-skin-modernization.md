# 2026-02-19 - Theater Reel Skin Modernization

## Summary
Reimagined the portfolio theater modal to feel clean, modern, and reel-native while preserving all playback, preload, and gesture behavior. The old device-like frame treatment was removed in favor of a near-borderless stage with minimal persistent controls and readable on-video metadata.

## Visual Goals
- Remove the "cellphone frame" look and heavy glass shell.
- Keep the theater classy and trend-forward without cheesy accents.
- Maintain a premium presentation in both light and dark mode.
- Prioritize video dominance and visual calm.

## Changes Made
1. Near-borderless theater stage
- Replaced the layered shell/card-within-card treatment with a single media-first container.
- Reduced decorative borders, gradients, and padding around the player.
- Kept all existing open/close/touch behavior intact.

2. Reel-style metadata overlays
- Moved metadata onto the video surface at the bottom-left corner.
- Kept only category + title visible in theater.
- Added a stronger bottom scrim + text shadow for legibility across bright footage.

3. Theme-adaptive theater tokens
- Added dedicated theater color tokens in `:root` and `.dark` for:
  - backdrop tint and glow
  - control colors
  - media edge color
  - metadata chip/title colors
- Added reusable theater utility classes:
  - `.theater-control`
  - `.theater-meta-chip`
  - `.theater-meta-title`

4. Minimal always-visible controls
- Restyled close and side navigation buttons to low-visual-weight "ghost" controls.
- Preserved all existing bindings, labels, and navigation behavior.

5. Motion restraint pass
- Reduced drag rotation/scale intensity.
- Softened entry and dismiss transform magnitude.
- Kept the same gesture thresholds and logic.

## Files Updated
- `src/components/Portfolio.tsx`
- `src/index.css`
- `changes/2026-02-19-theater-reel-skin-modernization.md`

## Intentionally Unchanged
- Swipe directions and thresholds.
- Keyboard navigation and Escape close behavior.
- Prewarm/fallback preload strategy and source ordering.
- Scroll lock and scroll restore logic.
- Reel card entry flow.

## Validation Checklist
- [ ] Theater opens from reel cards and closes correctly.
- [ ] Swipe navigation and swipe dismiss still behave as before.
- [ ] Left/right arrow navigation works.
- [ ] Escape key closes theater.
- [ ] Controls remain visible and legible in light/dark mode.
- [ ] Overlay title/category remain readable on bright and dark video frames.
- [ ] No background scroll jump on theater close.
- [ ] `npm run build` succeeds.
- [ ] `npm run lint` reviewed for regressions.
