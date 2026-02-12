# 2026-02-12 - Mobile FCP/LCP Optimization Pass 3

## Summary
Targeted mobile first paint and largest paint latency by reducing above-the-fold runtime work and rendering meaningful hero content immediately from HTML before React boot.

## Changes Made
1. Hero became static-first for faster mobile paint
- Replaced Framer Motion-based hero rendering with static markup plus CSS hover transitions:
  - `src/components/Hero.tsx`
- Removed SplitTextReveal usage in hero intro title for immediate text paint.

2. Removed top-level Framer Motion wrapper
- Dropped `MotionConfig` from app root to reduce initial boot work:
  - `src/App.tsx`

3. Added critical hero HTML shell in `index.html`
- Injected lightweight above-the-fold fallback inside `#root` so browser can paint meaningful content before JS hydration.
- Added inline critical styles for shell.
- Added high-priority preload for hero image candidate.
- Added `theme-color` meta.

4. Deferred below-the-fold chunk activation on first render
- Kept section code-splitting, but delayed mounting of lazy sections by 450ms after initial render:
  - `src/pages/Index.tsx`
- Uses skeleton section placeholders with existing anchor ids to preserve hash navigation.

## Files Updated
- `index.html`
- `src/App.tsx`
- `src/components/Hero.tsx`
- `src/pages/Index.tsx`
- `changes/2026-02-12-mobile-fcp-lcp-optimization-pass-3.md`

## Validation
- `npm run build` completed successfully.
