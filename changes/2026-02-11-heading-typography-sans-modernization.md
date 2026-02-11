# 2026-02-11 - Heading Typography Sans Modernization

## Summary
Switched section headings and key typographic elements from serif (`Playfair Display`) to sans-serif (`Inter`) with medium weight and tighter tracking. This gives the site a more modern, clean feel aligned with contemporary content creator aesthetics.

## Changes Made

### Global
1. **`.studio-title`** — Changed from `font-serif font-normal tracking-[-0.04em]` to `font-sans font-medium tracking-tight`. Bumped largest breakpoint size from `2.7rem` to `3.2rem` with tighter line-height (`1.1`).

### Contact.tsx
2. **Contact heading** — `font-serif font-normal tracking-[-0.03em]` → `font-sans font-medium tracking-tight`.

### Portfolio.tsx
3. **Reel section title** — `font-serif font-normal tracking-[-0.03em]` → `font-sans font-medium tracking-tight`.
4. **Collage section title** — `font-serif font-normal tracking-[-0.04em]` → `font-sans font-medium tracking-tight`.

### Services.tsx
5. **Section title** — Removed redundant size overrides, now uses base `.studio-title` class.
6. **Service card titles** — `font-serif font-normal tracking-[-0.02em]` → `font-sans font-medium tracking-tight`.

### SocialProof.tsx
7. **Stat counter numbers** — `font-serif font-normal tracking-[-0.04em]` → `font-sans font-medium tracking-tight`.

### Testimonials.tsx
8. **Blockquote text** — `font-serif italic` → `font-sans font-normal italic tracking-tight`.

## Files Updated
- `src/index.css`
- `src/components/Contact.tsx`
- `src/components/Portfolio.tsx`
- `src/components/Services.tsx`
- `src/components/SocialProof.tsx`
- `src/components/Testimonials.tsx`
- `changes/2026-02-11-heading-typography-sans-modernization.md`
