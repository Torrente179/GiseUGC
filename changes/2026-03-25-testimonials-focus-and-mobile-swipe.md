# Testimonials Focus + Mobile Swipe Interaction

**Date:** 2026-03-25
**Direction:** Intentional Selection UX (Focus-first, Zoom-second)

## Problem

- Clicking a testimonial card opened zoom immediately, but did not keep a clear in-row focused state.
- Users could not intentionally keep one testimonial highlighted while comparing against others.
- On mobile, the testimonial rows moved as marquee tracks instead of supporting direct left/right swipe browsing for deliberate selection.

## Solution

Implemented a two-step interaction model for both desktop and mobile:

- **First click/tap selects and focuses** a testimonial card in place.
- **Second click/tap on the same card opens zoom** (existing dialog behavior preserved).
- **Desktop marquee pauses when a card is selected**, so focus remains stable and visually clear.
- **Mobile rows switch to horizontal swipe with snap points** (animation disabled on mobile rows), enabling intentional card browsing.
- **Selected card styling** now includes stronger border/ring/elevation and muted non-selected cards for clear hierarchy.

## Files Changed

| File | Change |
|------|--------|
| `src/components/Testimonials.tsx` | Added active selection state, click-to-focus then click-to-zoom flow, mobile swipe mode with snap, and synchronized zoom/selection navigation |
| `src/locales/es/translation.json` | Added `focusHint`, `swipeHint` copy for interaction guidance |
| `src/locales/en/translation.json` | Added `focusHint`, `swipeHint` copy for interaction guidance |

## Safeguards

- **Accessibility:** Preserved keyboard navigation inside zoom dialog; added `aria-pressed` for selected testimonial state; kept focus-visible styles.
- **SEO/Semantics:** Preserved section structure and heading hierarchy (`<section id="testimonials">`, `<h2>`).
- **Performance:** Desktop animation remains CSS-based; mobile disables marquee animation to prioritize touch interaction clarity.
- **Responsive UX:** Mobile now supports intentional horizontal swipe selection; desktop keeps continuous social-proof wall while allowing explicit focus.
- **i18n:** Interaction hints added in both ES and EN locales.
