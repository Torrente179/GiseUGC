# 2026-02-17 - R2 Video Routing (Previews / Main / Posters)

## Summary
Updated media URLs so playback assets are served from Cloudflare R2 with explicit routing by use case:

- Cards, collage, and services marquee use `previews/`.
- Theater/modal playback uses `main/`.
- Poster images use `posters/`.

## Changes
1. Portfolio media model update
- Updated `src/components/Portfolio.tsx` clip types:
  - `mainSrc` (modal/theater)
  - `previewSrc` (cards/collage)
  - `posterSrc` (placeholder image)
- Added R2 URL helpers using:
  - `https://media.giselasaldarriaga.com/main/...`
  - `https://media.giselasaldarriaga.com/previews/...`
  - `https://media.giselasaldarriaga.com/posters/...`
- Rewired reel cards and collage to previews.
- Rewired theater preload + theater player to main videos.

2. Services marquee moved off Mixkit
- Updated `src/components/ServicesMarquee.tsx`:
  - Removed external Mixkit runtime URLs.
  - Replaced with R2 `previews/` + `posters/` URLs.

## Result
- All requested video contexts now load from your R2 bucket layout.
- Poster assets are explicitly routed from `posters/`.
