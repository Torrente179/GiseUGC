# Hero Viewport Forced to Dark "Black Theme"

**Date:** 2026-06-04

## Goal

Make the home hero section always render in the dark ("black theme") palette as
its default look, **independent** of the site's global light/dark toggle. The
rest of the page (including the introduction band directly below the hero) must
keep responding to the light/dark theme as before.

## Approach

The theme is fully token-based: `:root` defines the light palette and `.dark`
redefines the same CSS custom properties (`--background`, `--foreground`,
`--primary`, etc.) in `src/index.css`. Every hero element — including the
theme-aware `.hero-wall-haze` and `.hero-wall-scrim` overlays — reads from those
tokens.

So forcing dark only requires scoping a `.dark` class onto the hero viewport
container. All descendants then resolve to dark token values automatically; no
per-element color overrides were needed.

## Fix

`src/components/Hero.tsx` — added the `dark` class (plus explicit
`bg-background text-foreground`) to the hero viewport wrapper div:

```diff
- <div className="relative min-h-[100svh] w-full">
+ {/* Hero viewport is always dark ("black theme"), independent of the global light/dark toggle */}
+ <div className="dark relative min-h-[100svh] w-full bg-background text-foreground">
```

The `.dark` scope wraps only the `min-h-[100svh]` viewport (reel wall, haze,
scrim, headline, CTAs, proof line). The introduction block below is a sibling
**outside** this div, so it still follows the global theme.

## Verification (browser preview, global theme = light)

- Hero viewport rendered dark: background `rgb(15,18,26)`, text `rgb(242,238,227)`.
- Introduction band below stayed light: background `rgb(253,252,251)`.
- Screenshot confirmed the black hero renders correctly with light headline/scrim.

## Files changed

- `src/components/Hero.tsx`

## Commit

`3faa875` — feat(hero): force dark "black theme" for hero viewport regardless of global toggle (pushed to `main`).
