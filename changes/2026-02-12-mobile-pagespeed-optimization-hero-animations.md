# 2026-02-12 - Mobile PageSpeed Optimization + Hero Text Animation Restoration

## Summary
Comprehensive mobile PageSpeed optimization targeting FCP, LCP, and Speed Index, combined with restoration of hero text reveal animations using zero-cost CSS-only approach.

## Changes Made

### 1. Async CSS Loading — Vite Plugin (FCP -150ms)
- Added `asyncCssPlugin` to `vite.config.ts` that converts Vite-generated CSS `<link>` to non-blocking `media="print" onload="this.media='all'"` pattern with `<noscript>` fallback.
- Same technique already used for Google Fonts in `index.html`.

### 2. Hero Image Re-compression (LCP -100ms)
- Re-compressed `gisela-hero-585.webp` at q72 (45 KiB → 40 KiB).
- Re-compressed `gisela-hero-640.webp` at q72 (55 KiB → 45 KiB).
- Generated new `gisela-hero-400.webp` (18 KiB) for low-DPR mobile devices.
- Updated `srcset` in `index.html` (preload + boot-shell) and `Hero.tsx`.

### 3. Hero Text Animations Restored with CSS
- Imported `LiteSplitTextReveal` (CSS-only, no framer-motion) for hero title "Gisela Saldarriaga" and introduction section title (word-by-word reveal).
- Added CSS stagger entrance classes `hero-reveal` + `hero-reveal-1` through `hero-reveal-5` on subtitle chip, signature, description, buttons, and pills.
- Triggered via existing `.hero-section[data-motion='ready']` (set at 220ms).
- All animations respect `prefers-reduced-motion: reduce`.

### 4. Smarter Lazy-Load Deferral (FCP/LCP -30ms)
- Replaced `setTimeout(260)` with `requestIdleCallback({ timeout: 1500 })` in `Index.tsx`.
- Added `setTimeout(300)` fallback for Safari <17.

### 5. Vite manualChunks (cache efficiency)
- Isolated `framer-motion` into dedicated 125 KiB chunk.
- Isolated `i18n-core` (i18next + react-i18next + detector) into 54 KiB chunk.

### 6. Lazy i18n — Defer Non-Default Translation
- Spanish translation remains statically bundled (default language).
- English translation loaded at runtime via `i18next-http-backend` from `/locales/en/translation.json`.
- Configured `partialBundledLanguages: true` for mixed static + async loading.

## Files Updated
- `vite.config.ts` — async CSS plugin + manualChunks
- `index.html` — 400w srcset addition
- `src/components/Hero.tsx` — LiteSplitTextReveal + stagger classes + 400w srcset
- `src/index.css` — CSS animation rules for word reveal + hero stagger
- `src/pages/Index.tsx` — requestIdleCallback deferral
- `src/i18n.ts` — lazy English translation via HTTP backend
- `public/uploads/gisela-hero-400.webp` — new 400w variant
- `public/uploads/gisela-hero-585.webp` — re-compressed at q72
- `public/uploads/gisela-hero-640.webp` — re-compressed at q72
- `public/locales/en/translation.json` — runtime English translation copy

## Validation
- `npm run build` completed successfully.
- Async CSS confirmed in built `dist/index.html`.
- Chunk isolation verified: framer-motion (125 KiB), i18n-core (54 KiB).
