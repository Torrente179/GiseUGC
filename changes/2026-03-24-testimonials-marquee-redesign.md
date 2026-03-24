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
