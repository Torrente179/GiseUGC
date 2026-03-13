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
5. All public delivery is from:
   - `https://media.giselasaldarriaga.com/videos/main/...`
   - `https://media.giselasaldarriaga.com/videos/mobile/...`
   - `https://media.giselasaldarriaga.com/videos/previews/...`
   - `https://media.giselasaldarriaga.com/videos/posters/...`

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

## Local Source and Output Paths
1. Source input folder:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/public/uploads/videos`
2. Encoded output folder:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/tmp/video-encodes`
3. Encoder script:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/scripts/encode-videos.sh`
4. Manifest (tracking):
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/tmp/video-encodes/manifest.csv`
5. Nuevos manifest (candidate clips for strict R2 gating):
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/public/uploads/videos/nuevos/manifest.csv`
6. Generated strict-gating catalog used at runtime:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/src/data/nuevos-r2-ready.ts`
7. `nuevos` manifest must be committed to keep CI builds deterministic:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/public/uploads/videos/nuevos/manifest.csv`
8. Optional SEO title/category overrides for `nuevos` display metadata:
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
From `scripts/encode-videos.sh`:
1. Preview outputs (`*-preview.mp4`):
   - 4 seconds
   - width up to `480`
   - `fps=24`
   - no audio (`-an`)
   - `libx264` + `-movflags +faststart`
   - `x264 keyint=24:min-keyint=24:scenecut=0`
2. Mobile outputs (`*-mobile.mp4`):
   - width up to `720`
   - `fps=30`
   - AAC audio `96k` (stereo, 48kHz)
   - `libx264` + `-movflags +faststart`
   - `x264 keyint=30:min-keyint=30:scenecut=0`

## Upload Workflow (Cloudflare R2)
Upload by folder:
1. `tmp/video-encodes/*-preview.mp4` -> `videos/previews/`
2. `tmp/video-encodes/*-mobile.mp4` -> `videos/mobile/`
3. Main originals from `public/uploads/videos/*.mp4` -> `videos/main/`
4. Poster images -> `videos/posters/`

If using AWS CLI-compatible R2:
```bash
aws s3 sync /local/path s3://<bucket>/videos/<folder> \
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
6. If manifest is missing, generator fails open by producing an empty catalog (build-safe fallback).

## Code Wiring (Portfolio)
File:
- `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/src/components/Portfolio.tsx`

Related data modules:
1. `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/src/data/portfolio-clips.ts`
   - `LEGACY_REEL_CLIPS`
   - `r2MainVideo()`, `r2MobileVideo()`, `r2PreviewVideo()`, `r2Poster()`
2. `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/src/data/nuevos-r2-ready.ts`
   - `NUEVOS_R2_READY_CLIPS`
   - `NUEVOS_R2_BLOCK_REPORT`

Runtime clip library:
1. `ALL_REEL_CLIPS = [...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS]`
2. Theater navigation uses `ALL_REEL_CLIPS`.
3. Non-theater reel cards use UTC 24h bucket randomization from `ALL_REEL_CLIPS`.

## Performance/Prewarm Behavior
1. Intent prewarm (hover/touch/focus) injects video preload links.
2. Startup hidden prewarm warms preview/main/mobile sets with configured budgets.
3. Theater-neighbor prewarm warms likely next/adjacent clips.
4. Theater source order is main-first with mobile fallback (`shouldPreferMobileTheaterSource = false`).

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
