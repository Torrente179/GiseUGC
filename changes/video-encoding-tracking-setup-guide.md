# Video Encoding, Tracking, and R2 Setup Guide

## Purpose
Single reference for how videos are prepared, uploaded, wired in code, and tracked in changes.

## Status
Canonical source of truth as of `2026-03-04`.

If an older `changes/*.md` entry conflicts with this file, follow this file and current runtime code:
- `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/src/components/Portfolio.tsx`
- `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/scripts/encode-videos.sh`

Historical notes with superseded details:
- `2026-02-17-r2-video-routing-previews-main-posters.md` (pre-`/videos/` path examples)
- `2026-02-17-mobile-theater-source-priority-switch.md` (interim strategy)
- `2026-02-19-mobile-theater-source-priority-fix.md` (interim strategy)
- Earlier sections inside `2026-02-19-portfolio-prewarm-viewport-gating.md` (iterative same-day tuning)

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

## Code Wiring (Portfolio)
File:
- `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/src/components/Portfolio.tsx`

Key URL builders:
1. `r2MainVideo()`
2. `r2MobileVideo()`
3. `r2PreviewVideo()`
4. `r2Poster()`

Per clip in `REEL_CLIPS`:
1. `mainSrc`
2. `mobileSrc`
3. `previewSrc`
4. `posterSrc`

## Performance/Prewarm Behavior
1. Intent prewarm (hover/touch/focus) injects video preload links.
2. Startup hidden prewarm warms preview/main/mobile sets with configured budgets.
3. Theater-neighbor prewarm warms likely next/adjacent clips.
4. Theater source order is main-first with mobile fallback (`shouldPreferMobileTheaterSource = false`).

## Tracking Process (Required)
After any video/perf changes:
1. Update:
   - `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC/changes/2026-02-19-portfolio-prewarm-viewport-gating.md`
2. Include:
   - what changed
   - why it changed
   - expected impact
   - validation outcome
3. Keep same-topic updates in the same changes file.

## Verification Checklist
1. `npm run build` passes.
2. Reel cards still play previews.
3. Theater opens quickly on mobile and desktop.
4. Audio works normally in theater.
5. Fallback path works if a source is unavailable.
6. URLs resolve from `media.giselasaldarriaga.com`.
