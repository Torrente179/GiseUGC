# Hero overhaul: desktop polish + mobile app-native story stack

**Date:** 2026-06-10

## Problem

The hero "ramillete" deck underperformed visually:

1. **Background video invisible** — `blur(44px) saturate(0.72) brightness(0.5)` at `opacity: 0.5` over a near-black bg = murk, not atmosphere.
2. **Haze faded the cards** — the frosted haze's radial mask was still 35% strong at its 56% stop and the scrim radial reached `background/0.5` at 58%, both washing over the deck zone (front card spans ~58.5–76.5vw).
3. **Subpar card chrome** — single flat shadow, plain ring, back cards ghosted via opacity fade.
4. **Mobile looked weird** — `fan=1` rendered two awkward floating 3D cards; a shrunken desktop, not an app composition.

## What changed

### Desktop (`HeroReelDeck.tsx`, `index.css`)

- **Ambient backdrop now alive**: `blur(26px) saturate(1.08) brightness(0.58)`, full opacity, slow 36s scale/drift (`hero-bg-drift`). New `.hero-stage-bg::after`: tiled SVG grain (kills banding) + edge gradients pulling toward the dark bg so text zones still win.
- **Haze re-geometry**: horizontal mask, fully transparent by 54vw — the deck zone is razor-sharp. The text-side radial scrim now ends by 56%. Removed the primary-tinted "warm glow" radial (the video is the color now).
- **Card chrome**: 3-layer believable shadow (contact + mid + ambient), `::after` specular hairline (lit top edge) + faint top sheen, radius 1rem.
- **Bouquet fan**: back cards arc gently upward (`y = -50 - r*2.5%`) and tilt clockwise (`rotateZ 2–6.5deg`); focused card `scale(1.02)`.
- **Tonal dimming replaces opacity fade**: back cards get `brightness(0.55–0.78) saturate(0.85)` — depth-of-field, not ghosting.
- **Poster→video crossfade**: video fades in via `onPlaying` → `data-ready` (passes through `AdaptiveVideo`'s `{...props}` spread). No mount pop; poster stays beneath as fallback.

### Mobile (`HeroStoryStack.tsx` — new, `Hero.tsx`, `index.css`)

- **App-native story stack replaces the 3D fan**: centered focused card (44vw), next card peeking from the right edge (dimmed `brightness(0.58) saturate(0.7)`), story-style segmented progress bar on top (fills over the 4.2s cycle, CSS animation keyed per cycle).
- **Gestures**: swipe left/right to advance/rewind, stories tap-zones (left 30% = back), press-and-hold pauses (remaining-time timer model, `animation-play-state: paused` for the fill). `touch-action: pan-y` keeps page scroll working.
- **Decode-light kept**: only the focused card mounts `AutoplayPreviewVideo` (priority `hero`); ambient backdrop is a static filtered `<img>` poster on mobile so the story card always owns the playback budget's decoder slot.
- **Zero `backdrop-filter` ≤767px**: haze is `display: none` on mobile; scrim is pure gradients (transparent above 52%-from-bottom — cards stay crisp, text zone keeps a strong wash).
- **Pointer passthrough**: hero content wrapper gets `max-md:pointer-events-none`, inner container re-enables — CTAs verified tappable, card gestures land on the stage.
- `prev`/`back`/`next`/`focus` positions via `data-pos`; cards jumping from offscreen-left back into the stack snap without transition (no streaking).

### Bug fix (`use-mobile.tsx`) — pre-existing white-screen on breakpoint crossing

`Index.tsx` swaps lazy components on `isMobile` ternaries with no Suspense boundary (e.g. line 115). A live resize across 768px (phone rotation!) made the synchronous update suspend → React unmounted the whole root → white screen. This predates the hero work (noted in 2026-06-04 changes doc as "pre-existing homepage render error at Index.tsx:98"). Fixed by wrapping the matchMedia state update in `React.startTransition` — React keeps the old UI while the lazy chunk loads. Verified both crossing directions.

## Verified

- 1440×900 + 768×1024: ambient clearly visible, front card sharp, bouquet fan with tonal depth, crossfade, hover-pause.
- 390×844: story stack centered + right peek + 4 segments; tap zones advance/rewind; swipe both directions; CTAs tappable; exactly **1** video element in the entire hero.
- Breakpoint crossings both directions — no crash.
- Services pages (`.svc-cine-*`) and light sections below hero unaffected.
- `tsc --noEmit` clean, eslint clean. (Local `vite build` fails copying `public/uploads/videos/nuevos/WhatsApp Video*.mp4` into dist — macOS quarantine xattr EPERM, environmental only; module transform passes and Vercel/Linux is unaffected.)

## Files

- `src/components/HeroStoryStack.tsx` (new)
- `src/components/HeroReelDeck.tsx`
- `src/components/Hero.tsx`
- `src/hooks/use-mobile.tsx`
- `src/index.css` (hero block)
