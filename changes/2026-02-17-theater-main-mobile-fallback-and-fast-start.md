# 2026-02-17 - Theater Main->Mobile Fallback + Fast Start

## Summary
Fixed theater playback reliability for R2-hosted videos and improved startup speed on click.

## Problem observed
- Some theater videos failed to play because certain `main/` URLs returned 404.
- First-play startup felt slow when full-size `main/` files took longer to initialize.

## What was changed
1. Added `mobileSrc` per reel clip
- File: `src/components/Portfolio.tsx`
- Each reel now has:
  - `mainSrc` (`/videos/main/...`)
  - `mobileSrc` (`/videos/mobile/...`)
  - `previewSrc` (`/videos/previews/...`)
  - `posterSrc` (`/videos/posters/...`)

2. Theater playback fallback logic
- File: `src/components/Portfolio.tsx`
- `TheaterVideo` now accepts `sources: string[]` and tries in order:
  1. `mainSrc`
  2. `mobileSrc`
- On video error, it automatically switches to the next source.

3. Fast-start fallback timeout
- File: `src/components/Portfolio.tsx`
- If playback does not start quickly, theater falls back from `main` to `mobile` after a short timeout (`1400ms`) to improve perceived responsiveness.

4. Lighter preload strategy for nearby theater clips
- File: `src/components/Portfolio.tsx`
- Hidden neighboring preloads now use:
  - `src={clip.mobileSrc}`
  - `preload="metadata"`
- This reduces network contention versus preloading heavy `main` files.

5. Media origin connection warmup
- File: `index.html`
- Added:
  - `<link rel="preconnect" href="https://media.giselasaldarriaga.com" crossorigin />`
  - `<link rel="dns-prefetch" href="//media.giselasaldarriaga.com" />`

## Result
- Theater is resilient when a `main` object is missing.
- Click-to-play is faster and more reliable due to automatic fallback and connection warmup.
