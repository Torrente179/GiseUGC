# 2026-02-11 - Add Mobile Swipe to Testimonials

## Description
Added touch swipe left/right navigation to the testimonials carousel on mobile devices.

## What Was Added
1. **Touch event refs** — `touchStartX` and `touchEndX` refs to track swipe gesture coordinates.
2. **Touch handlers** — `handleTouchStart`, `handleTouchMove`, `handleTouchEnd` functions that detect horizontal swipe gestures (minimum 50px threshold) and trigger `nextTestimonial` or `prevTestimonial`.
3. **Event bindings** — `onTouchStart`, `onTouchMove`, `onTouchEnd` attached to the carousel overflow container.

## How It Works
- Swipe **left** → next testimonial
- Swipe **right** → previous testimonial
- Minimum swipe distance: **50px** (prevents accidental triggers)
- Touch events are inherently mobile-only, so desktop behavior is unchanged.

## Files Changed
- `/src/components/Testimonials.tsx` — added ~25 lines (refs, handlers, event bindings).

## Validation
- Build: `npm run build` passed successfully.
