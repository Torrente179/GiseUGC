# 2026-02-19 - Portfolio Prewarm Viewport Gating

## Summary
Improved page-speed behavior by reducing eager R2 video prewarm pressure before the portfolio section is near view, while preserving theater quality and all existing UI/animation behavior.

## What Changed
1. Viewport-gated startup prewarm
- Added an IntersectionObserver gate on the portfolio section.
- Startup prewarm now waits until the section is near the viewport (`rootMargin: 1600px`) before starting delayed prewarm timers.
- This avoids warming theater assets too early during first-load above-the-fold rendering.

2. Lower eager preview prewarm contention
- Startup preview prewarm now uses:
  - first clip: `preload="auto"`
  - remaining clips: `preload="metadata"`
- Keeps the fast-path warm while reducing concurrent network pressure.

3. Instant first-open fast path
- Added a lightweight immediate prewarm layer when portfolio is near viewport:
  - warms only one likely theater clip (desktop: first clip, mobile: current center clip)
  - first source preloaded with `auto`, fallback source with `metadata`
- This restores near-instant theater startup while preserving the deferred broader prewarm budget.

4. Faster staged prewarm delays
- Reduced staged startup prewarm delays to run sooner once viewport-gated conditions are met:
  - desktop: `260ms`
  - mobile: `380ms`

## Intentionally Unchanged
- No changes to:
  - animations
  - fonts
  - UI layout/styling
  - video assets or encoding quality
  - theater gesture/navigation behavior
  - R2 source routing and fallback order

## File Updated
- `src/components/Portfolio.tsx`
