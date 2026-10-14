# "Videos para cada paso antes de la compra" — reel stack

**Status:** Live on main
**Implemented:** 2026-10-13
**Scope:** `CreatorAdvantage` (the section after Services), all breakpoints, light
and dark.

Design canvas: the user compared three layouts in the spatial-glass style
(desktop and phone) and picked **1 · Reel stack**:
<https://claude.ai/artifact/L7DtvF1VoqjmT1hfxe9Qz6>

## What changed

- The section shows its own claim: one shoot, three cuts. The clothing shoot's
  three clips are stacked in depth as glass-framed reels, labelled **1 Anuncio ·
  2 Demo · 3 Reseña**. The front one plays its preview rendition, and the other
  two show local poster variants. The stack rotates every 4 s while the section
  is near the viewport, pauses on hover or focus, and a tap or click brings the
  next one forward. A caption under the stack names the front cut, using the
  phrases from the section's own description (`portfolio.collageCuts.*`).
- This replaces the `ReelPhone` (iPhone 17 Pro Max) this section used. That
  component still runs in the hero. `.creator-reel-phone` in
  `src/styles/reel-phone.css` is now unused here.
- The eyebrow ("Un producto, varios videos") is now a tag above the stack
  instead of a label above the heading. The heading is an `h2`.
- The points are glass rows with icons. The button is a dark pill: a full-width
  bar at thumb height on phones, inline from 640px.

## Layout per device

| Width | Order / composition |
| --- | --- |
| < 768 (iPhone) | heading → stack → points → button, one column; tall stack composition |
| 768–1023 (iPad portrait) | same order; stack centred at 34rem; the three points side by side |
| ≥ 1024 (iPad landscape, desktop) | text down the left column, vertically centred; the stack spans every row on the right |

The stack's geometry is in `cqi` of `.ca-stage` (a size container). It switches
to the roomy composition at a **400px stage**, not at a viewport width, so a
1024px iPad landscape (418px stage) gets the roomy stack while a 430px iPhone
(390px stage) keeps the tall one.

## Gotchas

- Two wrappers per card: `.ca-card` carries the slot transform and its 1.1 s
  transition, and `.ca-card-body` carries the pointer/scroll tilt from
  registered properties. Putting both on one element would restart the slot
  transition on every pointer frame.
- The back cards dim `.ca-media`, not the card. A `filter` on `.ca-card`
  makes it a backdrop root, and the bezel's glass would then blur nothing.
- Styles live in `src/styles/creator-advantage.css`, a plain stylesheet
  imported by the component. Nothing was added to `index.css`.

## Verified

- Headless Chrome (puppeteer device emulation) at 320, 390, 430, 820, 1024,
  1180 and 1440px, plus 1440px dark: no horizontal overflow, every card inside
  the stage, and the front reel loaded and playing.
- A tap advances the stack: the slots rotate, the caption updates and the
  video switches to the next cut.
- `npm run typecheck`, `npm test` (296 passed), ESLint on the component.
