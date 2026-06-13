# "Cartel de estudio" — the actual visual redesign (hero, cards, services)

**Date:** 2026-06-13

## Context

Sessions 1 rebuilt the *machinery* (3D constellation, pinned scroll, Lenis) but
recycled every visual component into it — same identity block, same card markup,
same headers. The user's verdict: "absolutely awful… you did not redesign
anything… recycled everything and made a soup mess." Correct. This change is the
real redesign: I mocked up a visual direction first (`visualize` widget), got it
approved ("build exactly this"), then implemented the pixels.

The approved language is **"Cartel de estudio"** — an editorial studio-poster
system: oversized uppercase serif name interleaved with a live reel card, an
inset poster frame, corner credits/metadata, a new reel-card anatomy, and an
editorial numbered index for services.

## What changed

### Hero — studio poster (`Hero.tsx`, `dc-*` CSS)
- Name is now the typographic event: `GISELA` in oversized uppercase serif
  (`clamp(2.7rem, 10.2vw, 9.6rem)`) on a CSS grid, with the live focus reel
  card **interleaved between the two name lines**, and `Saldarriaga` in large
  italic warm-sand below. A faded ghost reel tucks behind the italic line.
- Inset poster frame (`dc-poster-frame`), corner metadata ("Gisela Saldarriaga —
  estudio UGC" / "Medellín, CO — 2026"), italic pitch line, uppercase credits
  block, pill primary CTA + underline ghost CTA, bottom-center scroll cue.
- The focus card is a real `AdaptiveVideo` (`playbackPriority="hero"`), so the
  one decoder is scheduler-governed.
- Mobile: same poster type system in flow layout (name, pitch, credits, CTAs)
  over the untouched story stack; no poster frame/corner chrome. CTA row
  clearance bumped to `pr-24` so "Contactar" clears the floating dock.

### Constellation → true backdrop (`ReelConstellation.tsx`)
- Removed the video texture and scheduler registration from the 3D field (the
  DOM poster now owns the foreground + the one hero video). Field is poster-only.
- Pushed all slots deeper (z −3.8…−40.4), camera end −43, fog 0.062, global
  `FIELD_OPACITY 0.72` — it reads as atmospheric depth behind the poster, not
  competing cards in your face.

### Reel-card anatomy (`Portfolio.tsx`, `dc-reel-*` / `dc-track-*` CSS)
- Every card now has: `Nº 04` linen chip (top-left), category chip (top-right),
  centered teal play pill on hover, and a dark title band with the reel title
  (italic serif) + `0:32 · español` meta. Desktop gallery cards also get an
  outlined ghost numeral (`01`…) behind each.
- Gallery header redesigned: `Capítulo 02 — el trabajo` label + "Reels que
  *venden*" + `04 / 26` live counter. Scrub still 1:1 (verified 0→-3000→-7000).

### Services → editorial index (`Services.tsx` rewritten)
- The 8-card icon grid is gone. Now numbered serif rows (`01`…`08`), large
  titles that go italic-teal on hover, a tilted reel preview that scales in on
  hover (desktop), circular arrow that fills teal on hover. Each row links to
  its service page. Mobile: stacked rows, tap-through.

### Manifesto
- Chapter label corrected to `Capítulo 01 — manifiesto`.

## Verified (dev server)

- Desktop 1440: hero poster composition (name+card interleave, frame, credits,
  CTAs, ghost) all present; constellation canvas ready; focus card video live.
- Gallery: 26 track items, ghost numerals 01/02/03, `Nº 04` chip, category
  chip, play pill, title band ("Venta de Lotes…" · "0:32 · español"), 317px
  cards; scrub translates track 1:1 with scroll; counter present.
- Services: 8 index rows, numbers, previews, arrows, chapter label.
- Mobile 375: no canvas, story stack intact, poster type system, 8 rows, no
  horizontal overflow.
- `tsc` + eslint (full regression list) clean; zero console errors.
- Tooling note: the preview screenshot tool intermittently captures the
  window's native small size after reload — DOM metrics
  (`getBoundingClientRect`/computed styles) are authoritative and were used for
  sign-off, per the established pattern.

## Files

`Hero.tsx` (rewritten poster), `Services.tsx` (rewritten index),
`Portfolio.tsx` (card anatomy + header), `ReelConstellation.tsx` (backdrop),
`ManifestoChapter.tsx` (label), `index.css` (`dc-*` poster/card/index system,
removed dead `dc-fc` collage styles).

## Still ahead

Method sticky-split, Proof/FAQ restyles, Finale contact chapter, inner-page
`st-*` propagation (svc-cine-* hero stays untouched).
