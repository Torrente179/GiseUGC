# 2026-03-04 - Video Transcript Extraction + SEO Renaming Map

## Summary
Reviewed the latest SEO implementation and generated machine transcripts plus SEO-aligned filename proposals for all current portfolio source videos.

## SEO Reference Used
- `changes/2026-03-04-seo-geo-aeo-complete-audit-and-optimization.md`
- `index.html` current metadata and keywords
- `public/llms.txt` current service/entity positioning

## What was done
1. Transcript extraction
- Tooling: `faster-whisper` (`small`, VAD enabled)
- Input: `public/uploads/videos/*.mp4`
- Output transcript files:
  - `tmp/video-transcripts/<video-name>.txt`
- Transcript manifest:
  - `tmp/video-transcripts/manifest.csv`

2. Audio/no-audio classification
- Detected 13 videos total
- 10 with audio (transcribed, language detected as Spanish)
- 3 without audio (`ugc-clothing-showcase-1/2/3.mp4`)

3. SEO naming alignment
- Generated SEO slug proposals aligned with current site focus:
  - Spanish-first naming (`ugc-es-*`)
  - Service terms matching metadata/llms positioning (UGC, spokesperson, brand ambassador, SaaS/AI, fashion/lifestyle, beauty/wellness)
- Output rename map:
  - `tmp/video-transcripts/seo-renaming-map.csv`
  - `tmp/video-transcripts/seo-transcripts-and-renaming.md`

## Notes
- This pass generates a naming plan and transcripts; it does not rename runtime files or modify `src/components/Portfolio.tsx`.
- If applying these names in production, update source files, re-run `scripts/encode-videos.sh`, upload to R2 (`videos/main|mobile|previews|posters`), and update clip paths in code.

## Follow-up Applied
- See `changes/2026-03-04-transcript-driven-seo-video-titles-for-nuevos.md` for the implementation that wired transcript-aligned SEO titles into `scripts/generate-nuevos-r2-catalog.mjs` and `src/data/nuevos-r2-ready.ts`.
