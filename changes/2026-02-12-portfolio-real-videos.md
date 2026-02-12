# 2026-02-12 - Portfolio: Real UGC Videos

## Summary
Replaced all placeholder Mixkit videos in the portfolio with Gisela's real UGC content. 10 videos compressed to web-optimized H.264 720p MP4, poster thumbnails generated, and bilingual titles updated.

## Video Processing
- Source: 10 MOV/MP4 files (total ~440 MB)
- Output: 10 compressed MP4 files (total ~32 MB) at 720p, CRF 28, `-movflags +faststart`
- Generated JPG poster thumbnails for each video
- One HEVC 10-bit HDR source required explicit `format=yuv420p` conversion

## Videos Added
| File | Source | Size |
|------|--------|------|
| ugc-lifestyle-review.mp4 | Reseña lifestyle.MOV | 6.5 MB |
| ugc-services-presentation.mp4 | Presentación de servicios.MOV | 5.5 MB |
| ugc-voiceover-bots-review.mp4 | Voiceover reseña bots.MOV | 4.9 MB |
| ugc-voicebot-review.mp4 | Reseña voicebot.mp4 | 3.3 MB |
| ugc-brand-spokesperson.mp4 | Portavoz.MOV | 2.8 MB |
| ugc-creatine-supplement-review.mp4 | Reseña creatina.MOV | 2.6 MB |
| ugc-business-promotion.mp4 | Promotora empresarial.MOV | 2.4 MB |
| ugc-lifestyle-review-2.mp4 | Reseña lifestyle2.MOV | 2.2 MB |
| ugc-ai-services-review.mp4 | Reseña servicios IA.MOV | 1.1 MB |
| ugc-lifestyle-review-3.mp4 | Reseña lifestyle3.MOV | 381 KB |

## Files Updated
- `src/components/Portfolio.tsx` — REEL_CLIPS and COLLAGE_CLIPS now use local video paths
- `src/locales/es/translation.json` — Spanish portfolio item titles
- `src/locales/en/translation.json` — English portfolio item titles
- `public/locales/en/translation.json` — Runtime English translation copy

## Validation
- `npm run build` completed successfully.
