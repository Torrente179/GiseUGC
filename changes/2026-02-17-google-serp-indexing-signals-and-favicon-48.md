# 2026-02-17 - Google SERP Indexing Signals + 48x48 Favicon

## Summary
Added Google indexing support files and a 48x48 favicon variant to improve how the site is re-crawled and displayed in search results.

## Changes Made

### 1. Added 48x48 Favicon Variant
- Generated `public/favicon-48x48.png` from the existing face favicon source.
- Added `<link rel="icon" sizes="48x48">` in `index.html`.

### 2. Added robots.txt
- Created `public/robots.txt`:
  - Allows all user agents.
  - Declares sitemap location.

### 3. Added sitemap.xml
- Created `public/sitemap.xml` with the canonical homepage URL:
  - `https://www.giselasaldarriaga.com/`

## Why
- Google Search results can lag if crawl/indexing signals are incomplete.
- A 48x48 favicon is the recommended baseline for Google SERP icon pickup.
- `robots.txt` + `sitemap.xml` improve discovery and refresh behavior.

## Files Updated
- `index.html`
- `public/favicon-48x48.png`
- `public/robots.txt`
- `public/sitemap.xml`

## Validation
- `npm run build` completed successfully.
