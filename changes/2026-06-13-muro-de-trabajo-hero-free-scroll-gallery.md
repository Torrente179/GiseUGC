# Hero "Muro de trabajo" + gallery free-scroll (constellation removed)

**Date:** 2026-06-13

## Context

User rejected the constellation hero ("tiny cards zooming in on flat black —
empty, incomplete") and the gallery's pinned scroll-jack ("can't scroll past
without it dragging all the way through every reel"). Services index rows were
explicitly kept. Approved hero direction via mockup + AskUserQuestion:
**B · Muro de trabajo** — a full-bleed wall of her reels. Animation tech via a
second question: **GSAP-powered** (three.js removed from the hero; reserved for
the future Finale).

## 1. Hero → "Muro de trabajo" (desktop) — `Hero.tsx`, `use-hero-wall.ts`, CSS

Full-bleed 100svh warm-ebony hero, forced-dark.

- **The wall:** 5 edge-to-edge columns, each a vertical strip of 9:16 reel
  **posters** (the daily-shuffled catalogue dealt column-by-column, doubled in
  markup for a seamless loop). Posters only — **no video decoders, no WebGL**.
- **GSAP choreography** (`use-hero-wall.ts`, idle-loaded, desktop + fine-pointer +
  no-reduced-motion only): (1) seamless `yPercent` drift per column, alternating
  up/down at different speeds; (2) pointer parallax — `quickTo` shifts each column
  on x/y with a center-out depth factor; (3) a staggered entrance; (4)
  velocity-aware drift — scrolling briefly speeds the loop then eases back.
  Paused offscreen/hidden (IntersectionObserver + visibilitychange), `ctx.revert`
  on unmount. Reduced motion / mobile never reach it → static full wall.
- **Scrim** (`.dc-wall-scrim`): diagonal bottom-left ebony + top/bottom fades so
  the type stays legible over the busy wall.
- **Overlay:** corner meta ("El estudio · Medellín" / proof value), bottom-left
  name lockup (`GISELA` uppercase serif / `Saldarriaga` italic warm-sand), pitch,
  credits, magnetic pill CTA "Ver el trabajo" + ghost "Contactar". Reuses
  `dc-name-a/-b`, `dc-pitch`, `dc-credits`, `dc-cta-*`, the cascade + `useMagnetic`.
- **Mobile:** unchanged — `HeroStoryStack` + the same name/pitch/CTA type stack.

**Deleted** (unused): `three/ReelConstellation.tsx`, `three/constellation-state.ts`,
`hooks/use-constellation-scroll.ts` + the hero pin, exit veil, pin-shell. The
`three` dep + `HeroAtmosphere.tsx` stay for the future Finale.

## 2. Gallery → native free-scroll rail (desktop) — `Portfolio.tsx`, CSS

Kept the card design (chips, title band, ghost numerals); removed the scroll-jack.

- Deleted the desktop gallery pin `useEffect` (ScrollTrigger pin + `x` scrub),
  `galleryStageRef`, the pin-shell, and the velocity-skew on the track.
- Desktop now renders a native `overflow-x:auto` rail (`.dc-gallery-viewport` →
  `.dc-gallery-track`), scroll-snap proximity, scrollbar hidden. Section reverts
  to normal `studio-section` height. New `useEffect` adds: rAF-throttled
  **counter** synced to the leftmost visible card, **pointer drag-to-scroll**
  (mouse; swallows the drag-end click so a card doesn't open the theater), and
  prev/next **arrow** buttons (`scrollGalleryBy`, hidden on touch).
- Vertical page scroll passes straight through (Lenis is vertical-only) — no pin,
  no trap. Theater + Lenis stop/restore unchanged.

## 3. Index — `Index.tsx`

No pin → the desktop portfolio's special eager Suspense is gone; both breakpoints
use the standard `DeferredSection mountId="portfolio"`.

## Verified (dev server, clean restart)

- Desktop 1440: wall renders 5 full-height columns (cols 884px, track ~6000px
  drift room), name/scrim/CTAs present, **no `.dc-constellation-canvas`**;
  screenshot confirms a full edge-to-edge reel wall (no empty black). Console
  clean.
- Gallery (mounted on scroll): 26 cards + ghost numerals + 2 arrows; track
  9106px > viewport 1440px. Arrows scroll (68→750); native scroll updates the
  counter (→"15"); **vertical page scroll moves the page 600px while the track
  transform stays 0 and the rail keeps its position — no horizontal hijack.**
- Mobile 375: story-stack hero (no wall), name + CTA present, no horizontal
  overflow, app alive.
- `tsc -p tsconfig.app.json` clean; eslint clean on the regression list +
  `use-hero-wall.ts`. (The "more hooks" boundary flood seen mid-session was a
  Fast-Refresh artifact from adding a hook during HMR — gone on clean reload;
  `import('Portfolio.tsx')` resolves and the section mounts with 26 cards.)
- Services index rows untouched.

## Files

New: `src/hooks/use-hero-wall.ts`. Rewritten: `src/components/Hero.tsx`. Modified:
`src/components/Portfolio.tsx`, `src/pages/Index.tsx`, `src/index.css`. Deleted:
`src/components/three/ReelConstellation.tsx`, `src/components/three/constellation-state.ts`,
`src/hooks/use-constellation-scroll.ts`.
