# 2026-02-17 - R2 Video Routing (Previews / Main / Posters)

## Summary
Updated media URLs so playback assets are served from Cloudflare R2 with explicit routing by use case.

- Cards, collage, and services marquee use `previews/`.
- Theater/modal playback uses `main/`.
- Poster images use `posters/`.

## R2 object structure used
- Base domain: `https://media.giselasaldarriaga.com`
- Folder mapping:
  - `previews/` -> short preview files (`*-preview.mp4`)
  - `main/` -> full main playback files (`*.mp4`)
  - `mobile/` -> mobile-optimized full files (`*-mobile.mp4`) (uploaded but not currently wired in theater)
  - `posters/` -> poster thumbnails (`*-poster.jpg`)

## Specific code actions completed
1. `src/components/Portfolio.tsx` media model refactor
- Changed `ReelClip` from:
  - `videoSrc`, `poster`
- To:
  - `mainSrc`, `previewSrc`, `posterSrc`
- Changed `CollageClip` from:
  - `videoSrc`, `poster`
- To:
  - `previewSrc`, `posterSrc`

2. `src/components/Portfolio.tsx` URL helper layer
- Added:
  - `R2_MEDIA_BASE_URL = 'https://media.giselasaldarriaga.com'`
  - `r2MainVideo(filename)` -> `/main/<filename>`
  - `r2PreviewVideo(filename)` -> `/previews/<filename-with--preview.mp4>`
  - `r2Poster(filename)` -> `/posters/<filename>`
- This guarantees naming consistency and avoids hardcoding full URLs everywhere.

3. `src/components/Portfolio.tsx` runtime wiring
- Reel cards now render:
  - `src={clip.previewSrc}`
  - `poster={clip.posterSrc}`
- Desktop collage now renders:
  - `src={clip.previewSrc}`
  - `poster={clip.posterSrc}`
- Mobile collage now renders:
  - `src={clip.previewSrc}`
  - `poster={clip.posterSrc}`
- Theater preloader (`theaterPreloadClips`) now preloads:
  - `src={clip.mainSrc}`
- Theater player now plays:
  - `src={activeReelPreview.mainSrc}`
  - `poster={activeReelPreview.posterSrc}`

4. `src/components/ServicesMarquee.tsx` migration
- Removed runtime Mixkit URLs.
- Added the same R2 helper approach for:
  - `r2PreviewVideo(...)`
  - `r2Poster(...)`
- Marquee cards now load from:
  - `previews/` for video
  - `posters/` for thumbnails

## Result
- All requested video contexts now load from your R2 bucket layout.
- Poster assets are explicitly routed from `posters/`.

## How the poster behavior works
- Posters are assigned to the native `poster` attribute of each `<video>` / `LazyVideo`.
- Browser shows poster:
  - before first frame is decoded,
  - when video source has not loaded yet,
  - or when playback is paused/reset.
- This prevents blank video blocks and improves perceived speed.

## Replication steps (exact)
1. Upload assets to R2 with this naming:
- `previews/<name>-preview.mp4`
- `main/<name>.mp4`
- `mobile/<name>-mobile.mp4`
- `posters/<name>-poster.jpg`

2. Define one base URL + helper functions in each video-heavy component:
- `r2MainVideo`
- `r2PreviewVideo`
- `r2Poster`

3. Split clip metadata by context:
- `mainSrc` for theater/full playback
- `previewSrc` for cards/collages/marquee
- `posterSrc` for all posters

4. Replace all rendering points:
- any small surface/card/loop -> `previewSrc`
- any modal/theater/full playback -> `mainSrc`
- all `poster` props -> `posterSrc`

5. Build and validate:
- Run `npm run build`
- Confirm there are no remaining external CDN runtime URLs:
  - `rg -n "mixkit|/uploads/videos/.*\\.mp4" src/components`

6. Verify in browser network panel:
- Video requests should resolve to:
  - `https://media.giselasaldarriaga.com/previews/...`
  - `https://media.giselasaldarriaga.com/main/...`
  - `https://media.giselasaldarriaga.com/posters/...`

## Optional switch: theater `main/` -> `mobile/`
- If you want theater to use mobile-optimized full clips instead of originals:
  - Update the `r2MainVideo(...)` helper to point to `/mobile/<name>-mobile.mp4`.
- No component structure change is needed; only helper output changes.

## Local upload-pack folder structure created
To simplify drag/drop upload to R2, a local staging pack was created at:
- `tmp/r2-upload/`

It contains:
- `tmp/r2-upload/main/` -> source full clips (`*.mp4`) for `videos/main/`
- `tmp/r2-upload/mobile/` -> optimized mobile clips (`*-mobile.mp4`) for `videos/mobile/`
- `tmp/r2-upload/previews/` -> preview loops (`*-preview.mp4`) for `videos/previews/`
- `tmp/r2-upload/posters/` -> poster images (`*-poster.jpg`) for `videos/posters/`
- `tmp/r2-upload/manifest.csv` -> latest encode report copy

Counts at creation:
- `main`: 13 files
- `mobile`: 13 files
- `previews`: 13 files
- `posters`: 13 files

Git hygiene:
- Added `tmp/r2-upload/` to `.gitignore` to prevent large media from being committed.
