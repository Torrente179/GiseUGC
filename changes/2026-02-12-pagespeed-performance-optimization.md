# 2026-02-12 - PageSpeed Performance Optimization Pass

## Summary
Optimized critical rendering and media loading to target the reported Lighthouse bottlenecks (slow LCP/FCP, oversized media payload, render-blocking font CSS, and forced reflow hotspot) while preserving the existing design and motion system.

## Changes Made
1. Deferred non-critical video loading (major payload reduction)
- Added reusable lazy video component:
  - `src/components/media/LazyVideo.tsx`
- Updated video-heavy sections to load video/poster only when close to viewport:
  - `src/components/Portfolio.tsx`
  - `src/components/ServicesMarquee.tsx`
- Set preview videos to `preload="none"` where appropriate to reduce eager network pressure.

2. Optimized hero/profile image delivery
- Generated responsive compressed hero assets:
  - `/public/uploads/gisela-hero-800.webp`
  - `/public/uploads/gisela-hero-1200.webp`
  - `/public/uploads/gisela-hero-800.jpg` (fallback)
- Switched hero image to `<picture>` + `srcset` + explicit dimensions:
  - `src/components/Hero.tsx`
- Added compact avatar asset for footer:
  - `/public/uploads/gisela-avatar-160.webp`
  - used in `src/components/Footer.tsx`

3. Reduced small-image waste for Fiverr icon
- Generated optimized icon:
  - `/public/uploads/fiverr-logo-56.webp`
- Replaced previous larger PNG usage in:
  - `src/components/Navbar.tsx`
  - `src/components/FloatingContactDock.tsx`

4. Removed render-blocking font stylesheet pattern
- Updated `index.html` to preload Google Fonts stylesheet and apply asynchronously (`media="print"` + `onload`), with `noscript` fallback.
- Added `preconnect`/`dns-prefetch` for `assets.mixkit.co`.

5. Removed i18n network dependency from critical path
- Inlined translation resources into bundle (instead of runtime HTTP fetch):
  - `src/i18n.ts`
  - `src/locales/en/translation.json`
  - `src/locales/es/translation.json`

6. Reduced initial JS/runtime overhead
- Removed unused global providers from app root:
  - `src/App.tsx`
- Cached reel scroll step measurements to avoid layout reads on each arrow click (forced reflow mitigation):
  - `src/components/Portfolio.tsx`

7. LCP text render delay mitigation
- Kept hero typography but removed split-word reveal animation on the H1 name to ensure immediate paint:
  - `src/components/Hero.tsx`

## Files Updated
- `index.html`
- `src/App.tsx`
- `src/i18n.ts`
- `src/components/Hero.tsx`
- `src/components/Footer.tsx`
- `src/components/Navbar.tsx`
- `src/components/FloatingContactDock.tsx`
- `src/components/Portfolio.tsx`
- `src/components/ServicesMarquee.tsx`
- `src/components/media/LazyVideo.tsx`
- `src/locales/en/translation.json`
- `src/locales/es/translation.json`
- `public/uploads/gisela-hero-800.webp`
- `public/uploads/gisela-hero-1200.webp`
- `public/uploads/gisela-hero-800.jpg`
- `public/uploads/gisela-avatar-160.webp`
- `public/uploads/fiverr-logo-56.webp`
- `changes/2026-02-12-pagespeed-performance-optimization.md`

## Validation
- `npm run build` completed successfully.
- `npm run lint` reports pre-existing UI lint issues in `src/components/ui/*` (not introduced by this change).
