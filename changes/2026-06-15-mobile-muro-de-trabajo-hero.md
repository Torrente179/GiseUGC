# Mobile hero → "Muro de trabajo" reel wall

**Date:** 2026-06-15

## Context

The desktop hero is the full-bleed "Muro de trabajo" reel wall; mobile still used
the older `HeroStoryStack`. User wants the wall on mobile too.

## What changed (`Hero.tsx`, `index.css`)

- The wall now renders on **both** breakpoints (dropped the `HeroStoryStack`
  branch + its `storyClips`/`ambientClip`). The name/pitch/credits/CTA overlay and
  the `hero-mobile-foot` tab-bar clearance stay.
- **Responsive columns:** 3 on mobile (5 was too narrow at 375px), 5 on desktop.
- **Drift without GSAP on mobile:** `useHeroWall` (drift + pointer parallax) stays
  desktop-only; mobile gets a CSS `@keyframes dc-wall-drift` (translateY 0→-50%
  over the doubled list) per `.dc-wall-track`, alternating direction/speed by
  column `:nth-child`. `prefers-reduced-motion` → `animation: none`.
- **Mobile scrim override:** the desktop scrim is a left-heavy diagonal (name sits
  bottom-left on a wide frame) which darkened the whole phone; mobile uses a
  bottom-heavy vertical scrim so reels read across the top ~60% and the type stays
  legible over the dark lower half.
- **Lean payload:** capped 6 unique tiles per column (doubled in markup) — still
  taller than a viewport so the loop is seamless, but ~36 posters on mobile
  instead of ~54. Posters only — no video decoders, no WebGL.

## Verified (dev server)

- Mobile 375: 3 columns, posters paint, CSS drift runs (34/26/40s), seamless
  (track ½-height > viewport), name + CTAs legible over the bottom scrim, tab bar
  below, no horizontal overflow, console clean.
- Desktop 1440: still 5 columns, GSAP drift (no CSS animation on the track), no
  tab bar — unchanged.
- `tsc` + eslint clean.

## Files

`src/components/Hero.tsx`, `src/index.css`. `HeroStoryStack.tsx` remains in the
repo, now unused by the hero.
