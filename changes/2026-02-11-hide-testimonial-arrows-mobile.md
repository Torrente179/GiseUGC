# 2026-02-11 - Hide Testimonial Nav Arrows on Mobile

## Description
Hidden the prev/next chevron arrow buttons on mobile screens. Users swipe instead (added in previous change). Arrows remain visible on `md` (768px) and larger screens.

## What Was Changed
- Added `hidden md:flex` to the nav arrows container in `/src/components/Testimonials.tsx` (line 81), replacing `flex`.

## Files Changed
- `/src/components/Testimonials.tsx` — 1 line changed.

## Validation
- Build: `npm run build` passed successfully.
