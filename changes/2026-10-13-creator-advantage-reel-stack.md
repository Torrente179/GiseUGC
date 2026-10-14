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
- **Phones (< 768px) keep the hero's iPhone** (`ReelPhone`, class `ca-phone`)
  instead of the stack, at the user's request. It plays the same three cuts,
  and its caption is the front cut's phrase. A glass segmented control under it
  (1 Anuncio · 2 Demo · 3 Reseña) picks a cut, because the phone's own screen
  tap is its like gesture. CSS decides which of phone and stack is shown, so the
  prerendered HTML never flashes the wrong one. `useIsMobile` only decides which
  of them mounts a `<video>`. `.creator-reel-phone` in `src/styles/reel-phone.css`
  is now unused.
- The eyebrow ("Un producto, varios videos") is now a tag above the stack
  instead of a label above the heading. The heading is an `h2`.
- The points are glass rows with icons. The button is a dark pill: a full-width
  bar at thumb height on phones, inline from 640px.

## Layout per device

| Width | Order / composition |
| --- | --- |
| < 768 (iPhone) | heading → iPhone (`ReelPhone`) + cut switcher → points → button, one column |
| 768–1023 (iPad portrait) | same order; stack centred at 34rem; the three points side by side |
| ≥ 1024 (iPad landscape, desktop) | text down the left column, vertically centred; the stack spans every row on the right |

The stack's geometry is in `cqi` of `.ca-stage` (a size container). It switches
to the roomy composition at a **400px stage**, not at a viewport width, so a
1024px iPad landscape (418px stage) gets the roomy stack. The tall composition
under 400px only shows if the stack is ever shown on phones again; today phones
get the iPhone instead.

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
- Phones (320, 390, 430px, light and dark): the iPhone shows, its video plays,
  the stack and its video are not mounted, and tapping "Reseña" in the switcher
  updates the phone's caption and video.
- `npm run typecheck`, `npm test` (296 passed), ESLint on the component.
