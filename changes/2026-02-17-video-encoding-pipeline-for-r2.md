# 2026-02-17 - Video Encoding Pipeline for R2/CDN

## Summary
Added a repeatable ffmpeg pipeline to generate quality-priority, fast-start video assets for R2/CDN delivery on mobile and desktop.

## What was added
1. Batch encoder script
- New file: `scripts/encode-videos.sh`
- Generates two outputs per source MP4:
  - `*-preview.mp4` (short loop for cards/carousels)
  - `*-mobile.mp4` (full clip optimized for theater/modal playback)
- Applies `-movflags +faststart` to both outputs for quicker startup.
- Supports size-target tuning and selective clip processing via CLI flags.
- Bash 3 compatible (macOS default shell tooling).

2. Updated default encode profile (quality-priority)
- Preview defaults:
  - `--preview-seconds 4`
  - `--preview-target-kb 700`
  - `--preview-width 480`
- Mobile full defaults:
  - `--mobile-target-mb 5`
  - `--mobile-width 720`
  - `--audio-bitrate-k 96`
- Bitrate clamps adjusted to preserve quality on short clips.

3. NPM scripts
- Updated `package.json`:
  - `npm run video:encode`
  - `npm run video:encode:dry`

4. Documentation
- Updated `README.md` with usage instructions and examples.

5. Git hygiene
- Updated `.gitignore` to exclude local transcode outputs:
  - `tmp/video-encodes/`

## Output artifacts
- Encoded files are written to `tmp/video-encodes/`
- Per-run CSV report: `tmp/video-encodes/manifest.csv`

## Full batch run result (13 clips)
- Source total: `246.74 MB`
- Preview total: `7.56 MB`
- Mobile total: `58.34 MB`
