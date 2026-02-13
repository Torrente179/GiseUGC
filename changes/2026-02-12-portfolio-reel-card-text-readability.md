# 2026-02-12 - Portfolio Reel Card Text Readability

## Summary
Added a frosted-glass background behind the text overlay on portfolio reel cards to improve readability against light video frames.

## Changes Made
- `src/components/Portfolio.tsx` — Wrapped category label and title in a `bg-black/45 backdrop-blur-md` rounded pill. Matched the mute icon background to the same dark frosted style (`bg-black/40`).

## Validation
- `npm run build` completed successfully.
