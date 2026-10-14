# Desktop reel gallery — ghost numerals made legible

**Date:** 2026-10-14

## Problem

The outlined numeral over each desktop reel card's top-left corner was a 1.2px
stroke at 50% khaki (~1.6:1 contrast on the linen page), so it nearly vanished.
Cormorant's default old-style figures also made "07" read as "o7".

## Fix

Same position, size and outline design. Only the legibility changed:

- Stroke 1.2px at 50% accent → 1.6px `--muted-foreground`.
- `font-variant-numeric: lining-nums` so "0" and "7" sit on the baseline.
- 1.5px `--background`-colour `drop-shadow` halo so the outline stays readable
  where it crosses a dark poster.

Also, `scroll-snap-type: x proximity` was snapping card 01 flush to the left edge
on load (scrollLeft 68px at 1440), clipping the left side of the "01" numeral.
`.dc-gallery-viewport` now has `scroll-padding-left` equal to the track's
`padding-left`, so every snap rests at the page gutter and card 01 starts at
`scrollLeft: 0`.

## Files Changed

- `src/index.css` — `.dc-ghost-num`, and `scroll-padding-left` on
  `.dc-gallery-viewport`.
