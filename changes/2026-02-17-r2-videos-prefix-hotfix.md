# 2026-02-17 - R2 `/videos/` Prefix Hotfix

## Issue
R2 media URLs in code were pointing to:
- `/main/...`
- `/previews/...`
- `/posters/...`

But the bucket objects are actually under:
- `/videos/main/...`
- `/videos/previews/...`
- `/videos/posters/...`

This mismatch caused videos/posters to fail loading.

## Fix applied
1. Updated Portfolio R2 helpers
- File: `src/components/Portfolio.tsx`
- Changed:
  - `r2MainVideo` -> `https://media.giselasaldarriaga.com/videos/main/...`
  - `r2PreviewVideo` -> `https://media.giselasaldarriaga.com/videos/previews/...`
  - `r2Poster` -> `https://media.giselasaldarriaga.com/videos/posters/...`

2. Updated Services marquee R2 helpers
- File: `src/components/ServicesMarquee.tsx`
- Changed:
  - `r2PreviewVideo` -> `https://media.giselasaldarriaga.com/videos/previews/...`
  - `r2Poster` -> `https://media.giselasaldarriaga.com/videos/posters/...`

## Result
- Cards/collage/marquee resolve to `videos/previews/`.
- Theater/modal resolves to `videos/main/`.
- Poster images resolve to `videos/posters/`.
