# Testimonials Section Redesign — Social Proof Wall

**Date:** 2026-03-24
**Direction:** Social Proof Wall (Linear × Testimonial.to)

## Problem

- Single-image carousel with tiny unreadable thumbnails treated real Fiverr reviews like a photo gallery
- Showing 1 of 14 reviews at a time hid the volume of positive feedback
- Generic prev/next carousel controls felt template-like
- Thumbnail rail with 14 items added visual clutter without navigation value

## Solution

Replaced the single-image carousel with a two-row infinite marquee ("wall of love" pattern):

- **Two rows scrolling in opposite directions** — shows ~6 reviews at a glance, communicates proof volume
- **Hover to pause, click to zoom** — no manual navigation needed
- **5-star proof badge** with review count replaces generic counter
- **Edge fade masks** on both sides for seamless infinite loop
- **Zoom dialog preserved** with arrow-key navigation inside the lightbox

## Files Changed

| File | Change |
|------|--------|
| `src/components/Testimonials.tsx` | Full rewrite: carousel → marquee wall with MarqueeRow sub-component |
| `src/index.css` | Added `@keyframes testimonial-marquee`, `.marquee-paused`, reduced-motion support |
| `src/locales/es/translation.json` | Added `reviewCount`, `hoverHint` keys |
| `src/locales/en/translation.json` | Added `reviewCount`, `hoverHint` keys |

## Safeguards

- **Accessibility:** `prefers-reduced-motion` stops all animation; ARIA labels on all interactive elements; focus-visible rings; keyboard nav in zoom dialog
- **SEO:** Preserved `<section id="testimonials">`, `<h2>` heading hierarchy, semantic HTML
- **Performance:** `will-change: transform` + `backface-visibility: hidden` for GPU-composited animation; lazy-loaded images; CSS-only animation (no JS requestAnimationFrame)
- **Responsive:** Cards use `clamp(260px, 28vw, 380px)` for fluid sizing; works on mobile through desktop
- **Dark/light mode:** Tested in both; card surfaces use token-based colors
- **i18n:** All user-facing strings use translation keys (ES/EN)

---

## Theater Parity for the Zoom Viewer — 2026-09-01

### Problem

Clicking a testimonial dropped it into a flat `bg-black/94` lightbox that read as
the same page dimmed. The neighbouring screenshots stayed on stage at `0.35`
opacity and `scale(0.9)`, at 90% / 74% / 60% slide widths, so at rest you were
looking at three reviews with one slightly brighter. Nothing said *this one*.

The site also had two full-screen viewers with unrelated visual languages: this
one, and the video theater used by Portfolio and the service pages.

### Direction

Three treatments were offered — match the video theater, a spotlit stage keeping
the neighbours visible but pushed further back, or a frosted `backdrop-filter`
stage. **The user chose to match the video theater**, so the site has one viewer
rather than two. The frosted option was flagged against: `backdrop-filter` has
caused rendering trouble in this project before.

### Solution

| Layer | Before | After |
| --- | --- | --- |
| Backdrop | `bg-black/94`, flat | `--theater-backdrop` at `0.94` + the theater's two radial `--theater-backdrop-glow` gradients |
| Slides | `flex-[0_0_90%]` / `74%` / `60%` | `flex-[0_0_100%]`, card capped at `min(620px, 100%)` |
| Inactive card | `opacity: 0.35`, on stage at rest | `opacity: 0.22`, off screen at rest — visible only mid-swipe |
| Card frame | `rounded-2xl`, `border-white/10`, `shadow-2xl` | `rounded-[1.45rem]`, `--theater-edge` at `0.88`, `0 34px 82px -38px` |
| Close / prev / next | Bespoke `bg-black/65` circles | `.theater-control` |
| Counter | Plain `text-white/55` | `.theater-meta-chip` |
| Dots, hint | `bg-white`, `text-white/40` | `--theater-overlay-title` |

Dots and hint ride `--theater-overlay-title` (near-white in both themes) and
**not** `--theater-backdrop-glow`. The glow token is a vignette colour that goes
*dark* in dark mode (`220 18% 16%`), which would have made both invisible against
a stage that is dark in both themes.

### The entrance is CSS, deliberately

The active card plays the video theater's own 18px rise via
`animation: media-theater-card-in` on `.testimonial-theater-sheet`, not a
mounted state flip.

A state flip is the obvious implementation and it is wrong here:
`requestAnimationFrame` never fires in a background tab, so the release would
never run and the card would sit stranded at its entrance pose. This was caught
in testing, not in theory.

`animation-fill-mode: backwards` is load-bearing. `both` would pin the final
transform in the cascade above the sheet's inline `transform`, and
drag-to-dismiss — which drives that inline transform — could never take it back.

### Files Changed

| File | Change |
|------|--------|
| `src/components/Testimonials.tsx` | Viewer restyled to the theater language; `Lightbox` → `Theater`, `LIGHTBOX_*` → `THEATER_*` |
| `src/index.css` | `.testimonial-lightbox*` → `.testimonial-theater*`; dropped `@keyframes testimonial-lightbox-in` in favour of the shared `media-theater-*` keyframes |

### Unchanged on purpose

The scroll lock (position:fixed pattern, immune to `body { overflow-x: hidden }`),
the portal to `<body>` (`.studio-section` carries `content-visibility: auto` and
so is a containing block for fixed descendants), the axis-locked swipe gesture,
the focus trap, and the marquee itself are all untouched.

### Validation

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| `npx eslint` (touched files) | 0 errors |
| `npm test` | 124/124 passed |
| `npm run build` | Passed; 46 routes prerendered |
| Computed styles + geometry, desktop Chrome | Backdrop `rgba(17,21,29,0.94)`; card 620px, centred, radius `23.2px`; inactive cards at `0.22` and off screen (`x: -4566`, `-2856`); 3 `.theater-control`s |

## Mobile Regression Checklist

Generated at: `2026-09-01T14:01:05.496Z`

### Automated checks
- ✅ Targeted lint
- ✅ Production build

### Manual device checks (iPhone Safari)
- [ ] Horizontal drag moves carousel left/right without jumping back to start.
- [ ] Vertical page scroll works naturally when swiping over carousel area.
- [ ] Tapping a card pauses/expands that card without resetting track position.
- [ ] Tapping outside card closes expanded state and auto-scroll resumes smoothly.
- [ ] Offscreen -> back onscreen transition resumes movement without visible snap.

### Notes
- Device/OS: **not yet run** — outstanding
- Browser version:
- Repro video/screenshot path (if any):
- Additional observations: Desktop Chrome verification was DOM/computed-style
  only. The slide width change (90/74/60% → 100%) is the item most worth a real
  swipe: it alters embla's snap geometry, and the vertical-throw dismiss shares
  the same gesture with the tall screenshots' internal scroll box.
