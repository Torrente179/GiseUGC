# Pricing guide: one price per spokesperson row, one FAQ block

**Status:** Current
**Implemented:** 2026-10-14
**Scope:** ES/EN Fiverr pricing guide

## Spokesperson cells

`$25 · $25` (and the $40 / $75 twins) repeated the same numeral because each gig was a price link. The cell now shows the amount once, then two labelled gig links from `FIVERR_PRICING`:

- ES: `$25 (gig fondo verde/blanco · gig presentadora)`
- EN: `$25 (green/white backdrop gig · presenter gig)`

Same pattern for $40 and $75. No `?source=`.

## One FAQ

The prerendered page shipped the heading FAQ in `#root` and a second `Preguntas frecuentes` / FAQ `<dl>` in `<noscript>`. Crawlers that read the HTML saw both. The heading FAQ stays (ResourcePage `details`/`summary`, plus h3+p in the static `#root` placeholder). The noscript definition list is gone. FAQPage still copies the visible answers word for word.
