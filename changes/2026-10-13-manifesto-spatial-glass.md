# Home Chapter 2 — "Hola, soy Gisela" + proof as spatial glass

**Status:** Live on main
**Implemented:** 2026-10-13
**Scope:** `ManifestoChapter` (the section between the hero and the video
portfolio), all breakpoints, light and dark.

Design canvas with the three options the user compared; they picked
**B · Spatial glass**: <https://claude.ai/artifact/L7DtvF1VoqjmT1hfxe9Qz6>

## What changed

- The four proof figures (28+ marcas, 177 reseñas, 4.7 Fiverr, ES+EN) are
  frosted-glass cards over three slow colour fields in the palette's teal, sand
  and khaki. The statement and paragraph sit beside them on desktop, above
  them on phones.
- Everything is DM Sans, numbers included. The old Cormorant numerals (whose
  old-style "1" read as an "I"), the 11px tracked uppercase labels and the
  gradient divider are gone.
- Styles live in `src/styles/manifesto.css`, a plain stylesheet imported by
  the component (no `@layer`, so Tailwind can't purge it).

## Motion model

Both inputs write registered custom properties (`@property`), so the browser
interpolates them:

| Input | Where | Properties |
| --- | --- | --- |
| Scroll (view timeline on `.mf-stage`) | all devices | `--mf-tilt` leans the cards, `--mf-sweep` moves the light across them |
| Pointer (`hover: hover` and `pointer: fine` only) | desktop | `--mf-nx`/`--mf-ny` on the stage, `--mf-gx`/`--mf-gy` per card |

Phones get only the scroll-driven tilt and light sweep: no JS, and no
device-motion permission prompt. The colour fields drift only on fine
pointers, because a moving backdrop makes every glass card re-blur each frame.
Cards rise in on their own view timelines, staggered. With reduced motion or
no scroll timelines, the cards are static and fully visible.

## Gotchas

- Each card is a `<dl>` group (`dt` label, `dd` figure). The figure is moved
  first visually with `order: -1`, and flex paints in order-modified order, so
  without `z-index: 1` on `.mf-value`/`.mf-label` the card's glint
  (`::before`) paints **over** the figure and washes it out.
- Figures size off the card (`container-type: inline-size`, `34cqi`), not the
  viewport: "ES+EN" is about 2.85em wide and must fit a 320px phone's
  half-width card.
- The title rule is `.mf-chapter .mf-grid .mf-copy h2.mf-title` (0,4,1) to clear
  the global heading rule in `index.css` (0,3,1).

## Verified

- Headless Chrome (puppeteer, device emulation) at 320, 390 and 1440px, light
  and dark: no horizontal overflow, and no figure overflows its card.
- Pointer: the stage receives `--mf-nx`/`--mf-ny`, the cards' transforms
  update, and everything resets on `pointerleave`.
- `npm run typecheck`, `npm test` (296 passed), ESLint on the component.
