# 2026-02-19 - Host Normalization to WWW Canonical

## Summary
Normalized social URL tags to match the existing canonical host strategy (`www`) for cleaner indexing and share-card consistency.

## Changes Made

### 1. Canonical Host Consistency
- Updated:
  - `og:url` -> `https://www.giselasaldarriaga.com/`
  - `twitter:url` -> `https://www.giselasaldarriaga.com/`
- These now align with:
  - `rel="canonical"`
  - `hreflang` alternates
  - JSON-LD `url` fields
  - `robots.txt` sitemap reference
  - `sitemap.xml` URL

## Files Updated
- `index.html`

## Validation
- `npm run build` completed successfully.
