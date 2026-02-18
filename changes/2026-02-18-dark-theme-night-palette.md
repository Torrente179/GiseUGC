# 2026-02-18 - Dark Theme Night Palette Refinement

## Summary
Refined the dark theme colors to a cleaner, more premium night look with deeper base tones, clearer surface layering, and improved readability across text, cards, borders, and interactive accents.

## Changes Made

### 1. Dark Token Palette Rework
- Updated dark mode CSS variables in `src/index.css`:
  - Background/surface tokens shifted to a deeper midnight range for a more intentional night appearance.
  - Foreground and muted text tokens adjusted for stronger low-light readability.
  - Primary/accent/ring tokens tuned to preserve visual identity while reducing glare.
  - Border/input tokens balanced for softer separation between components.

### 2. Dark Browser UI Color
- Updated `index.html` to use dual `theme-color` meta tags:
  - Light mode keeps `#fffefe`.
  - Dark mode now uses `#0f121a` so mobile browser chrome matches the night palette.

## Files Updated
- `src/index.css` — dark theme color token adjustments
- `index.html` — light/dark `theme-color` meta tags

## Validation
- `npm run build` completed successfully.
