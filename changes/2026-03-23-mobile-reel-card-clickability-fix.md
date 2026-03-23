# Mobile Reel Card Clickability Fix

**Date:** 2026-03-23

## Problem

On the mobile service pages ("EL TRABAJO" section), reel cards were only clickable when fully snapped into view. Partially visible cards (e.g., the next card peeking from the right edge) could not be tapped to open the video preview. The browser intercepted the tap to perform a forced scroll-snap instead of registering it as a click.

## Root Cause

The `.stm-reel-track` CSS class used `scroll-snap-type: x mandatory`, which forces the browser to always snap cards into alignment. On mobile browsers (especially iOS Safari), tapping a partially visible card in a mandatory-snap container causes the browser to interpret the touch as a scroll gesture (to snap the card into view) rather than a click event.

## Fix

- Changed `scroll-snap-type: x mandatory` to `scroll-snap-type: x proximity` in `src/index.css` for the `.stm-reel-track` container
- With `proximity`, snapping only occurs when a card is already near a snap point, so taps on partially visible cards register as clicks normally
- All cards remain clickable at all times regardless of scroll position

## Files Changed

- `src/index.css` — `.stm-reel-track` scroll-snap-type from `mandatory` to `proximity`
