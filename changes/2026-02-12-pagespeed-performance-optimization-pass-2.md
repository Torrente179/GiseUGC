# 2026-02-12 - PageSpeed Performance Optimization Pass 2

## Summary
Applied a second targeted optimization pass based on the latest Lighthouse report to reduce remaining render-blocking cost, unused CSS/JS, and hero image over-delivery.

## Changes Made
1. Reduced unused CSS generation
- Moved `ThemeToggle` out of `src/components/ui`:
  - `src/components/ui/ThemeToggle.tsx` -> `src/components/ThemeToggle.tsx`
- Updated import path in:
  - `src/components/Navbar.tsx`
- Tightened Tailwind content scanning to exclude unused shadcn UI files:
  - `tailwind.config.ts`

2. Reduced main JS payload on first load
- Removed router runtime from app root (single-page site):
  - `src/App.tsx`
- Lazy-loaded below-hero sections with React Suspense to split non-critical code into async chunks:
  - `src/pages/Index.tsx`

3. Optimized hero image further for reported rendered size
- Added a 585px-wide WebP/JPEG variant targeting Lighthouse-reported display dimensions:
  - `public/uploads/gisela-hero-585.webp`
  - `public/uploads/gisela-hero-585.jpg`
- Added 585w source to hero `srcset` and switched JPEG fallback:
  - `src/components/Hero.tsx`

4. Removed unused preconnect hint
- Removed preconnect/dns-prefetch for `assets.mixkit.co` from head because Lighthouse flagged it as unused on initial load:
  - `index.html`

## Build Output Impact
- CSS bundle reduced from ~114.6 kB to ~70.0 kB (gzip ~18.2 kB -> ~11.5 kB).
- Main entry JS reduced from ~467.4 kB to ~395.3 kB (gzip ~145.4 kB -> ~127.7 kB).
- Non-critical sections are now emitted as separate async chunks.

## Files Updated
- `index.html`
- `tailwind.config.ts`
- `src/App.tsx`
- `src/pages/Index.tsx`
- `src/components/Hero.tsx`
- `src/components/Navbar.tsx`
- `src/components/ThemeToggle.tsx`
- `src/components/ui/ThemeToggle.tsx` (removed)
- `public/uploads/gisela-hero-585.webp`
- `public/uploads/gisela-hero-585.jpg`
- `changes/2026-02-12-pagespeed-performance-optimization-pass-2.md`

## Validation
- `npm run build` completed successfully.
