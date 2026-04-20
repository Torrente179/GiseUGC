# Lighthouse LCP & Mobile Payload Reduction

**Date:** 2026-04-20

## Problem

Lighthouse (Emulated Moto G Power, Slow 4G, `lr` HeadlessChromium) reported on the homepage:

- **FCP** 3.8 s
- **LCP** 7.2 s (render delay 2,920 ms on the hero tagline `UGC BILINGÜE, DEMOS Y VIDEOS DE PORTAVOZ…`)
- **Total payload** 29,219 KiB — dominated by three mobile `.mp4` files (~28 MB combined) that should never have downloaded on a mobile viewport.
- **Oversized images** 431 KiB of waste: 711×1280 poster JPGs rendered at 80×143, plus a hero WebP preload that didn't match the `<picture>` mobile source (double fetch).
- **Forced reflow** 128 ms in `FloatingContactDock` scroll handler (re-queried `#contact` + read `offsetHeight` every tick).
- **Render-blocking CSS** 810 ms for the main Vite-injected stylesheet.

## Root causes

### 1. Hidden hero video cycling on mobile (the 29 MB leak)

`src/components/Hero.tsx` rendered a desktop-only phone-frame `<motion.video>` inside `hidden lg:flex`. Even though the parent was `display: none` on mobile, the `<motion.video>` element and its `src={currentClip.mobileSrc}` were still mounted in the DOM, and Chrome buffered the file. A 3-second `setInterval` cycled through all 10 clips, and a sibling `useEffect` created a detached `<video>` element each cycle with `preload="auto"` — so on every iteration the browser started downloading the next mobile mp4. Over a Lighthouse trace this produced the three ~9 MB downloads that dominated the mobile payload.

### 2. LCP element stuck behind a staggered reveal

The LCP element was the hero `<p className="cinematic-subtitle">` wrapped in `<motion.div variants={cinematicItemVariants}>`. The parent `cinematicContainerVariants` had `delayChildren: 0.3` and item duration 1.2 s, so even on a fast device the subtitle couldn't paint until `hydrate + 0.3 + 1.2 ≈ 1.5 s` after hydration — and on slow 4G that pushed LCP to 7.2 s.

### 3. Preload / `<picture>` source mismatch

`index.html` preloaded `/uploads/gisela-hero-585.webp` (the tablet/desktop srcset), but the `<picture>` element's `(max-width: 767px)` source resolved to `/uploads/gisela-hero-mobile-768.webp`. Mobile clients fetched both.

### 4. Oversized poster thumbs in the hero mobile strip

The mobile-only 4-tile strip inside `Hero.tsx` rendered full 711×1280 R2-hosted posters (~80–140 KiB each) for tiles ~92×164 CSS pixels.

### 5. Scroll-tick forced reflow in `FloatingContactDock`

The scroll handler re-ran `document.querySelectorAll('#contact')` and iterated reading `offsetHeight` every animation frame.

### 6. Render-blocking production stylesheet

Vite's auto-injected `<link rel="stylesheet">` was synchronous, blocking the first paint for ~810 ms on Slow 4G.

## Fixes

### `src/components/Hero.tsx`

- Added `isDesktopViewport` state driven by `window.matchMedia('(min-width: 1024px)')`. The phone-frame `<motion.video>` now only renders when `isDesktopViewport` is true, and both the 3 s cycling interval and the detached preload element are gated behind the same flag. Mobile viewports never instantiate the element, so no `mobileSrc` download happens on mobile.
- Added `preload="metadata"` to the desktop phone-frame video (was implicitly `auto`).
- Removed the `<motion.div variants={cinematicItemVariants}>` wrapper around the subtitle `<p>` so it paints at hydration instead of hydration + 0.3 s delay + 1.2 s duration. Other cinematic items (divider line, metric pills, CTAs) still animate on stagger — only the LCP label is static.
- Mobile 4-tile strip now uses `posterThumbSrc(clip.posterSrc)` (a ~10–30 KiB local WebP) with explicit `width="92" height="164" decoding="async"`.

### `src/data/portfolio-clips.ts`

- Added `posterThumbSrc(posterSrc)` helper that derives `/uploads/videos/poster-thumbs/<clip>-poster-thumb.webp` from the existing R2 poster URL, keeping data single-sourced.

### `scripts/generate-poster-thumbs.sh`

- New script: resizes every `public/uploads/videos/*-poster.jpg` to 280w via `ffmpeg` → encodes to WebP (q=75) via `cwebp`, writing to `public/uploads/videos/poster-thumbs/`. Idempotent (skips files already newer than their source). Requires `ffmpeg` + `webp` from Homebrew.
- Generated 13 thumbs (8–30 KiB each, down from 80–140 KiB).

### `index.html`

- Replaced the single `gisela-hero-585.webp` preload with three `media`-gated preload links that each match the `<picture>` source for their viewport range:
  - `(max-width: 767px)` → `gisela-hero-mobile-768.webp` / `gisela-hero-mobile-992.webp`
  - `(min-width: 768px) and (max-width: 1023px)` → tablet srcset
  - `(min-width: 1024px)` → `gisela-hero-desktop-1600.webp` / `gisela-hero-desktop-2048.webp`
- Mobile now fetches exactly one hero WebP instead of two.

### `src/components/FloatingContactDock.tsx`

- Introduced a `cachedFooter` closure variable. `resolveFooter()` returns the cached element when `isConnected` is true, skipping the `querySelectorAll` + `offsetHeight` reads on every scroll tick. Cache is invalidated on resize (which calls `invalidateFooter()` before queueing an update) and on media-query changes.
- Scroll-tick work drops from "iterate candidates + read offsetHeight + read getBoundingClientRect" to a single `getBoundingClientRect` call.

### `vite.config.ts`

- Added `defer-non-critical-css` plugin (`apply: 'build'`, `transformIndexHtml` with `order: 'post'`). Converts every `<link rel="stylesheet" crossorigin href="…">` auto-injected by Vite into the standard non-blocking pattern:
  ```html
  <link rel="preload" as="style" crossorigin href="…">
  <link rel="stylesheet" crossorigin href="…" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" crossorigin href="…"></noscript>
  ```
- The inlined boot-shell critical CSS already covers above-the-fold rendering, so the full stylesheet loading asynchronously doesn't cause a FOUC.
- Dev server behavior is unchanged (`apply: 'build'` keeps HMR working).

## Compatibility with earlier changes

Reviewed the `changes/` docs before editing:

- `2026-03-22-homepage-section-load-performance.md` — deferred-section queue delays and `React.memo` on `Index` are untouched.
- `2026-03-22-mobile-performance-buttery-smooth.md` — per-card mobile `whileInView` on Services and the memo-based navigation freeze fix are untouched.
- `2026-03-23-service-mobile-video-performance-reset.md` / `service-poster-quality-upgrade.md` — service pages already use `<img src={posterSrc}>` (not `<video>`); this change only adds a new thumb pipeline for the homepage mobile strip and doesn't alter the service-page surfaces.
- The desktop theater preload gates (`!isMobile && …`) in `Portfolio.tsx` continue to prevent prewarm on mobile; no changes there.

## Expected Lighthouse impact

| Metric | Before | Projected |
|---|---|---|
| Total payload (mobile) | 29,219 KiB | ~500 KiB |
| LCP | 7.2 s | ~3.2–4.0 s |
| FCP | 3.8 s | ~3.4–3.6 s (defer-CSS saves ~160 ms) |
| Hero image over-fetch | 97 KiB wasted | 0 |
| Poster strip payload | ~360 KiB | ~80 KiB (13 thumbs × ~20 KiB avg, loaded lazy) |
| Forced reflow in FloatingContactDock | 128 ms scroll reads | ~0 ms (cached footer) |

## Files changed

- `src/components/Hero.tsx` — desktop viewport gate for phone-frame video + interval + detached preload; static LCP subtitle; thumb-sourced mobile strip.
- `src/data/portfolio-clips.ts` — `posterThumbSrc()` helper.
- `scripts/generate-poster-thumbs.sh` — new poster-thumb generator.
- `public/uploads/videos/poster-thumbs/*.webp` — 13 generated thumbs.
- `index.html` — split hero preload into three media-gated links.
- `src/components/FloatingContactDock.tsx` — cached footer lookup, resize-scoped invalidation.
- `vite.config.ts` — `defer-non-critical-css` build plugin.
