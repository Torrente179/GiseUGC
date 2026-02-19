# 2026-02-19 - Spanish-First Metadata + OG Image Refresh

## Summary
Updated social and SEO metadata so Spanish appears first (with English second), and refreshed the Open Graph image strategy to improve link preview image pickup across messaging apps and Google recrawls.

## Changes Made

### 1. Spanish-First Metadata Copy
- Updated `<title>` to Spanish-first, then English.
- Updated `<meta name="description">` to Spanish-first, then English.
- Updated Open Graph and Twitter titles/descriptions to Spanish-first, then English.
- Updated JSON-LD `Person` and `ProfessionalService` descriptions/job title to Spanish-first wording.

### 2. OG Image Refresh + Cache Busting
- Generated a new, optimized preview image:
  - `public/og-image-es-en-20260219.jpg` (1200x630, progressive JPEG, ~124 KB)
- Switched OG/Twitter image tags to the new image with a version query:
  - `?v=20260219`
- Added additional compatibility tags:
  - `og:image:url`
  - `twitter:image:src`
  - `link rel="image_src"`
- Kept image dimensions and alt text explicitly declared.

### 3. URL Strategy for Sharing
- Set `og:url` and `twitter:url` to `https://giselasaldarriaga.com/` to align with the URL users commonly paste.
- Kept canonical URL as `https://www.giselasaldarriaga.com/`.

## Files Updated
- `index.html`
- `public/og-image-es-en-20260219.jpg`

## Validation
- `npm run build` completed successfully.
