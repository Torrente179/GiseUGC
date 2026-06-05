# Video Encoding, Tracking, and R2 Setup Guide

## Purpose
Single reference for how videos are prepared, uploaded, wired in code, and tracked in changes.

## Status
Canonical source of truth as of `2026-03-04`, preserved after the `changes/` folder cleanup on `2026-03-09`.

If another note in `changes/` conflicts with this file, follow this file and current runtime code:
- `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/src/components/Portfolio.tsx`
- `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/scripts/encode-videos.sh`
- `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/scripts/generate-nuevos-r2-catalog.mjs`

Historical context now lives in:
- `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/changes/video-functionality/portfolio-video-experience.md`
- `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/changes/video-functionality/video-catalog-and-transcript-seo.md`

## Current Architecture (Production)
1. `main` videos are the primary source for theater playback on desktop and mobile.
2. `mobile` videos are fallback for theater playback.
3. `preview` videos are used for cards/collage/marquee loops.
4. `posters` are static fallback/first-paint visuals.
5. HLS manifests are optional high-quality adaptive sources. When present in R2,
   runtime components prefer HLS and fall back to MP4 automatically.
6. All public delivery is from:
   - `https://media.giselasaldarriaga.com/videos/main/...`
   - `https://media.giselasaldarriaga.com/videos/mobile/...`
   - `https://media.giselasaldarriaga.com/videos/previews/...`
   - `https://media.giselasaldarriaga.com/videos/posters/...`
   - `https://media.giselasaldarriaga.com/videos/hls/<base>/<rendition>/master.m3u8`

## Naming Convention
Given source file: `ugc-example.mp4`

1. Main (uploaded original/main):
   - `videos/main/ugc-example.mp4`
2. Mobile encoded:
   - `videos/mobile/ugc-example-mobile.mp4`
3. Preview encoded:
   - `videos/previews/ugc-example-preview.mp4`
4. Poster image:
   - `videos/posters/ugc-example-poster.jpg`
5. Optional HLS masters:
   - `videos/hls/ugc-example/main/master.m3u8`
   - `videos/hls/ugc-example/mobile/master.m3u8`
   - `videos/hls/ugc-example/preview/master.m3u8`

## Local Source and Output Paths
1. Source input folder:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/public/uploads/videos`
2. Encoded output folder:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/tmp/video-encodes`
3. Encoder script:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/scripts/encode-videos.sh`
4. HLS encoder script:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/scripts/encode-hls.sh`
5. Manifest (tracking):
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/tmp/video-encodes/manifest.csv`
6. HLS output folder:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/tmp/video-hls`
7. Nuevos manifest (candidate clips for strict R2 gating):
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/public/uploads/videos/nuevos/manifest.csv`
8. Generated strict-gating catalog used at runtime:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/src/data/nuevos-r2-ready.ts`
9. `nuevos` manifest must be committed to keep CI builds deterministic:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/public/uploads/videos/nuevos/manifest.csv`
10. Optional SEO title/category overrides for `nuevos` display metadata:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/scripts/nuevos-seo-overrides.json`

## Encoding Workflow
1. Put source `.mp4` files into:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/public/uploads/videos`
2. Dry run:
   ```bash
   npm --prefix /Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC run video:encode:dry
   ```
3. Encode all videos:
   ```bash
   npm --prefix /Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC run video:encode -- --overwrite
   ```
4. Encoder outputs:
   - `*-preview.mp4` (short loop, no audio)
   - `*-mobile.mp4` (mobile-friendly full, AAC audio)
5. Verify manifest:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/tmp/video-encodes/manifest.csv`

## Current Encode Defaults (Script)
From `scripts/encode-videos.sh` (these MP4s are now the fallbacks behind the
adaptive HLS ladder; HLS is the primary playback path):
1. Preview outputs (`*-preview.mp4`):
   - 6 seconds
   - width up to `720` (sharp on small card/tile loops, fast start)
   - `fps=30`
   - no audio (`-an`)
   - `libx264 -preset slow -crf 22 -maxrate 2500k -bufsize 5000k` + `+faststart`
     (the bitrate cap keeps high-motion clips from ballooning a small loop;
     previews land ~2 MB)
   - `x264 keyint=60:min-keyint=60:scenecut=0`
   - source discovery covers both `public/uploads/videos` and `.../nuevos`
   - flags: `--preview-only` / `--mobile-only` to re-encode one output type
2. Mobile outputs (`*-mobile.mp4`):
   - width up to `720`
   - `fps=30`
   - AAC audio `128k` (stereo, 48kHz)
   - `libx264 -preset slow -crf 22 -maxrate 4000k -bufsize 8000k` + `+faststart`
   - `x264 keyint=60:min-keyint=60:scenecut=0`

## HLS Encoding Workflow
1. Dry run one or more source videos:
   ```bash
   npm --prefix /Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC run video:hls:dry -- public/uploads/videos/nuevos/IMG_8435.MOV
   ```
2. Encode HLS outputs:
   ```bash
   npm --prefix /Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC run video:hls -- public/uploads/videos/nuevos/IMG_8435.MOV
   ```
3. HLS output layout (single adaptive `main` ladder per clip; adaptive HLS serves
   every device from one ladder, so the old `mobile`/`preview` HLS renditions were
   dropped):
   - `tmp/video-hls/<base>/main/master.m3u8`
   - `tmp/video-hls/<base>/main/<width>p/<codec>/{index.m3u8,init.mp4,segment_*.m4s}`
4. Current HLS defaults (multi-codec CMAF):
   - 2-second fMP4 segments, 30 fps, 2-second GOP alignment
   - resolution ladder 360/540/720/1080/1440/2160, each gated by native width
   - **three codecs per tier**: AV1 (`libsvtav1`), HEVC (`libx265`, `hvc1` tag),
     H.264 (`libx264` high) — `master.m3u8` carries valid `CODECS=` per variant so
     Chrome/Firefox/Edge pick AV1, Safari/iOS pick HEVC, others fall back to H.264
   - 128k AAC audio muxed into every variant
   - AV1 uses target-bitrate VBR (no `-maxrate`, an SVT-AV1 constraint); HEVC/H.264
     use capped VBR
   - tunable via env: `AV1_PRESET` (7), `HEVC_PRESET` (medium), `H264_PRESET` (slow)

## Upload Workflow (Cloudflare R2)
Preferred: use the helper, which sets the correct `Content-Type` per extension
and a long-lived `Cache-Control` in one pass (needs R2 creds in `.env` — see
`.env.example` and `changes/video-functionality/cdn-cache-runbook.md`):
```bash
bash scripts/r2-upload-media.sh --dry-run   # preview
bash scripts/r2-upload-media.sh             # previews + mobile + HLS ladders
bash scripts/r2-set-cache-control.sh        # backfill posters + mains
```
Folder mapping it performs:
1. `tmp/video-encodes/*-preview.mp4` -> `videos/previews/`
2. `tmp/video-encodes/*-mobile.mp4` -> `videos/mobile/`
3. `tmp/video-hls/<base>/` -> `videos/hls/<base>/` (`.m3u8` →
   `application/vnd.apple.mpegurl`, segments → `video/mp4`)

Main originals and posters are uploaded as before and get their `Cache-Control`
from `scripts/r2-set-cache-control.sh`.

**CDN edge caching is required for performance** — without the Cloudflare Cache
Rule in `cdn-cache-runbook.md`, `/videos/*` is served uncached
(`cf-cache-status: DYNAMIC`) straight from origin on every request.

Raw AWS-CLI form (manual):
```bash
aws s3 sync /local/path s3://<bucket>/videos/<folder> \
  --cache-control "public, max-age=31536000, immutable" \
  --endpoint-url https://<account_id>.r2.cloudflarestorage.com
```

## Strict R2 Gating for `nuevos`
1. `nuevos` clips are included in runtime portfolio only if all four R2 assets return `200`:
   - `videos/main/<original-name>`
   - `videos/mobile/<base>-mobile.mp4`
   - `videos/previews/<base>-preview.mp4`
   - `videos/posters/<base>-poster.jpg`
2. Local `/uploads/videos/nuevos/*` files are not used as runtime fallback.
3. Regenerate the runtime catalog after any upload/update:
   ```bash
   npm --prefix /Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC run video:catalog
   ```
   Note: this is also executed automatically during `npm run build` and `npm run build:dev` via `prebuild` hooks.
4. The generator reads `public/uploads/videos/nuevos/manifest.csv`, applies optional SEO overrides from `scripts/nuevos-seo-overrides.json`, and writes:
   - `src/data/nuevos-r2-ready.ts`
5. The generated report `NUEVOS_R2_BLOCK_REPORT` is the local source of truth for readiness counts.
6. Optional HLS fields are emitted only when the expected HLS manifests return `200`.
7. If HLS manifests are absent, MP4 playback remains the runtime fallback.
8. If manifest is missing, generator fails open by producing an empty catalog (build-safe fallback).

## Code Wiring (Portfolio)
File:
- `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/src/components/Portfolio.tsx`

Related data modules:
1. `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/src/data/portfolio-clips.ts`
   - `LEGACY_REEL_CLIPS`
   - `r2MainVideo()`, `r2MobileVideo()`, `r2PreviewVideo()`, `r2Poster()`
   - optional `hlsSrc`, `mobileHlsSrc`, `previewHlsSrc`
2. `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/src/data/nuevos-r2-ready.ts`
   - `NUEVOS_R2_READY_CLIPS`
   - `NUEVOS_R2_BLOCK_REPORT`

Runtime clip library:
1. `ALL_REEL_CLIPS = [...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS]`
2. Theater navigation uses `ALL_REEL_CLIPS`.
3. Non-theater reel cards use UTC 24h bucket randomization from `ALL_REEL_CLIPS`.

## Performance/Prewarm Behavior
1. Posters render immediately as first-paint visuals.
2. Video `src` attachment is gated by viewport visibility and the media playback scheduler.
3. Active playback is prioritized as theater -> hero -> preview -> ambient -> background.
4. Theater playback has top priority and pauses lower-priority hero/preview videos underneath.
5. Intent prewarm (hover/touch/focus) remains useful for theater and portfolio interactions, but should not bypass the scheduler for background previews.
6. Theater source order is main-first on desktop, with mobile MP4 used ahead of unsupported `.MOV` originals where needed.

## Tracking Process (Required)
After any video/perf changes:
1. Update:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/changes/video-functionality/video-catalog-and-transcript-seo.md`
2. Include:
   - what changed
   - why it changed
   - expected impact
   - validation outcome
3. Keep same-topic updates in the same file rather than creating a new micro-note.

## Verification Checklist
1. `npm run build` passes.
2. Reel cards still play previews.
3. Theater opens quickly on mobile and desktop.
4. Audio works normally in theater.
5. Fallback path works if a source is unavailable.
6. URLs resolve from `media.giselasaldarriaga.com`.
7. `npm run video:catalog` updates `NUEVOS_R2_BLOCK_REPORT` as expected.
