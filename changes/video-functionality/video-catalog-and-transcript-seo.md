# Video Catalog and Transcript SEO

## Summary
This is the current runtime video-catalog note. It consolidates strict R2 gating for `nuevos`, transcript-driven title cleanup, full-library reel exposure, services-marquee video remapping, and the canonicalization of the video docs.

## Current runtime touchpoints
- `scripts/generate-nuevos-r2-catalog.mjs`
- `scripts/nuevos-seo-overrides.json`
- `src/data/nuevos-r2-ready.ts`
- `src/data/portfolio-clips.ts`
- `src/components/Portfolio.tsx`
- `src/components/ServicesMarquee.tsx`
- `public/uploads/videos/nuevos/manifest.csv`
- `changes/video-functionality/video-encoding-tracking-setup-guide.md`

## Current state
1. `nuevos` clips only enter runtime when their full R2 asset set is available, and the generator keeps builds deterministic from the checked-in manifest.
2. Theater, reel cards, and related video selectors now share one authoritative clip library instead of drifting across component-local arrays.
3. Reel selection rotates daily on a UTC boundary and refreshes automatically without requiring a page reload.
4. Transcript extraction plus override metadata replaced raw phone-export filenames with usable SEO-facing titles and categories.
5. The video setup guide in `changes/video-functionality/` is the canonical operational reference; this note is the living runtime history for runtime catalog changes.

## 2026-06-05 - Adaptive Video Playback, HLS Readiness, and Decoder Budgeting

### Goal

Improve perceived video performance across the homepage hero wall, portfolio, service pages, vertical pages, service demo rails, and theater playback without changing the visual design, removing animations, or reducing video quality. The implementation follows the streaming-platform pattern of separating posters, preview loops, full playback, adaptive renditions, source attachment, and decoder budgeting.

### What changed

- Added `src/components/media/AdaptiveVideo.tsx` as the shared HLS-ready video primitive. It prefers native HLS when available, lazy-loads `hls.js` when needed, and falls back to the existing MP4 source if no HLS manifest exists or playback fails.
- Added `src/lib/media-playback-scheduler.ts` and `src/hooks/use-media-playback-slot.ts` to cap active video playback by viewport, connection profile, hardware concurrency, page visibility, and priority.
- Updated `AutoplayPreviewVideo` and `LazyVideo` so visible posters can render immediately while media `src` attachment is gated behind viewport visibility and playback budget.
- Updated service, vertical, portfolio, creator-advantage, services-marquee, and hero-wall video surfaces to use the adaptive/scheduled lifecycle.
- Removed the desktop-only hidden-home mounting behavior in `src/App.tsx`, so homepage video surfaces unmount when navigating to service and vertical pages.
- Updated `src/data/portfolio-clips.ts` and `scripts/generate-nuevos-r2-catalog.mjs` to support optional `hlsSrc`, `mobileHlsSrc`, `previewHlsSrc`, and high-quality service poster metadata.
- Added `scripts/encode-hls.sh` plus `npm run video:hls` and `npm run video:hls:dry` for 2-second fMP4 HLS outputs.

### HLS/R2 behavior

The runtime is HLS-ready but does not require HLS to be present. Catalog generation checks for:

- `videos/hls/<base>/main/master.m3u8`
- `videos/hls/<base>/mobile/master.m3u8`
- `videos/hls/<base>/preview/master.m3u8`

If those manifests exist, generated clips include the HLS fields. If they do not exist, the current MP4 URLs remain the fallback and the `hls.js` chunk is not loaded.

### Expected impact

- Homepage hero wall still renders the same cards and animations, but source attachment and active decoding are controlled by the playback scheduler.
- Service page first viewport avoids hidden homepage video pressure and avoids loading the below-fold services marquee too early.
- Theater playback now has top priority; opening a proof/modal pauses lower-priority hero preview videos underneath.
- Portfolio cards keep high-quality posters and preview loops while avoiding uncontrolled simultaneous decoders.
- HLS upload can raise playback quality beyond current preview/mobile MP4 limits through adaptive 360p/540p/720p/1080p ladders without forcing every device to fetch the largest file.

### Validation

- `npx tsc -p tsconfig.app.json --noEmit` passed.
- `npm run build` passed.
- `npm run video:hls:dry -- public/uploads/videos/nuevos/IMG_8435.MOV` passed and produced the expected ffmpeg command set.
- Browser verification against production preview:
  - Homepage hero wall reaches the desktop active-video budget after startup and has no stale no-source playback state.
  - Portfolio section runs under the scheduler with no page errors.
  - `/servicios/demo-producto-ugc/` first viewport has exactly two sourced/playing hero videos.
  - Opening a proof modal leaves exactly one sourced video actively playing: the theater video.
  - `hls.js` is not loaded while HLS manifests are absent, confirming MP4 fallback remains lightweight.

### Follow-up

To actually activate maximum-quality adaptive playback, generate HLS outputs and upload them to R2 under `videos/hls/...`; then run `npm run video:catalog` so the generated catalog emits the HLS URLs.

## 2026-06-05 - Edge Caching, Multi-Codec HLS Activation, and Quality Uplift

### Goal

Resolve the real causes of the "extremely slow" feel and raise picture quality
without any design/animation/quality regression. A live probe found two delivery
problems outside the React code: (1) the CDN was not caching anything
(`cf-cache-status: DYNAMIC`, no `Cache-Control`), and (2) the adaptive HLS built
previously was dormant (every master returned 404), so all playback was
single-bitrate progressive MP4. Source clips were also under-served (480p preview
loops; 720p "main").

### What changed

- **Edge caching (biggest win, config only).** New runbook
  `changes/video-functionality/cdn-cache-runbook.md` with a Cloudflare Cache Rule
  for `media.giselasaldarriaga.com /videos/*` (Eligible for cache, 1y edge +
  browser TTL) plus `scripts/r2-set-cache-control.sh` to set
  `Cache-Control: public, max-age=31536000, immutable` on existing posters/mains.
  New `scripts/r2-upload-media.sh` uploads encodes with correct `Content-Type` +
  `Cache-Control` in one pass. R2 keeps free egress (no new paid service).
- **Multi-codec adaptive HLS.** `scripts/encode-hls.sh` rewritten to emit a single
  `main` CMAF ladder per clip with **AV1 (libsvtav1) + HEVC/hvc1 (libx265) +
  H.264 (libx264)** variants per resolution tier (360–2160, gated by native
  width), each with a valid `CODECS=`-tagged `master.m3u8`. Chrome/Firefox/Edge
  get AV1, Safari/iOS get HEVC, everything else H.264. Measured AV1 ≈ 41% smaller
  than H.264 at equal quality. The old redundant `mobile`/`preview` HLS renditions
  were dropped — adaptive HLS already serves every device from one ladder.
- **Higher-quality MP4 fallbacks.** `scripts/encode-videos.sh` now emits 720p
  CRF 20 preview loops (up from 480p) and 720p CRF 22 / 128k mobile, encoded from
  originals. Previews feed only small/decorative surfaces, so 720p keeps them
  sharp and fast; the showcase quality comes from the HLS main ladder.
- **Showcase wiring (source-URL only, no design change).** The services
  hero/background (`ServiceLandingPage.tsx`, mobile + desktop) now uses the main
  adaptive ladder (`hlsSrc`) instead of the 480p preview; the desktop key-art clip
  already did. Legacy clips in `portfolio-clips.ts` now carry `hlsSrc` via the
  existing `r2HlsMaster()` helper. Small hero-wall/marquee tiles keep the
  (now 720p) preview MP4.
- **Robustness fix.** `AdaptiveVideo` now falls back to MP4 on the **native-HLS
  (Safari) path** if an `.m3u8` errors/404s — previously only the hls.js path
  fell back, so a missing master would have left Safari with a broken video. This
  also makes the upload-before-deploy window safe.

### Sequencing (must hold to avoid a regression window)

1. Run the Cloudflare Cache Rule + `r2-set-cache-control.sh` (instant speed win on
   existing assets).
2. `npm run video:encode -- --overwrite` and `npm run video:hls -- --overwrite`.
3. `bash scripts/r2-upload-media.sh` (uploads previews/mobile/HLS with cache
   headers).
4. `npm run video:catalog` (emits nuevos `hlsSrc` now that masters are live), then
   deploy the code. The native-HLS + hls.js MP4 fallbacks make earlier deploys
   safe regardless.

### Validation

- `npx tsc -p tsconfig.app.json --noEmit` and `npm run build` pass; `hls.js`
  remains a lazy-loaded chunk (not in the main bundle).
- Single-clip multi-codec encode validated end-to-end: valid `master.m3u8`, real
  av1/hevc/h264 fMP4 segments at native resolution, ~93s for a 25s 1080p clip.
- Live `curl` cache verification + browser codec-selection checks per the runbook
  after upload.

## Legacy notes absorbed
- `2026-03-04-portfolio-rail-full-library-scroll.md`
- `2026-03-04-r2-gated-video-catalog-and-utc-rotation.md`
- `2026-03-04-services-marquee-card-to-video-remap.md`
- `2026-03-04-transcript-driven-seo-video-titles-for-nuevos.md`
- `2026-03-04-video-docs-canonicalization.md`
- `2026-03-04-video-transcript-extraction-and-seo-renaming-map.md`
