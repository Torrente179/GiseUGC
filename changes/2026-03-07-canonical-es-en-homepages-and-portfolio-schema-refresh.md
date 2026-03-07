# 2026-03-07 - Canonical ES/EN Homepages and Portfolio Schema Refresh

## Summary
Implemented the revised SEO/GEO plan by splitting the homepage into a Spanish canonical root (`/`) and a true English homepage (`/en/`), softening the on-page market positioning so it reads naturally, and replacing the generic single-video schema with featured portfolio video objects backed by visible content.

## What Changed

### 1. Canonical language split
- Kept Spanish at:
  - `https://www.giselasaldarriaga.com/`
- Added English homepage at:
  - `https://www.giselasaldarriaga.com/en/`
- Updated:
  - canonical tags
  - hreflang alternates
  - Open Graph / Twitter URLs
  - localized raw HTML boot shells and no-JS content

### 2. Path-based language routing
- Removed query-string language selection as the source of truth for SEO-facing pages.
- i18n now resolves language from:
  - path
  - HTML `lang`
- Language switch buttons now navigate between canonical ES/EN URLs instead of only changing SPA state.
- Added Vercel redirects for `?lng=` normalization:
  - `/?lng=en` -> `/en/`
  - `/en/?lng=es` -> `/`

### 3. More natural on-page positioning
- Reworked hero copy in both languages to avoid robotic SEO phrasing.
- Added Medellin/global positioning in a softer editorial tone.
- English copy now includes:
  - `from Medellin and around the world`
- Replaced the old “international brands” FAQ answer with a more natural “who I usually work with” answer.

### 4. Homepage metadata cleanup
- Removed low-value/noisy signals from homepage HTML:
  - `meta keywords`
  - legacy geo meta tags
  - `SpeakableSpecification`
- Replaced the old bilingual mixed-language metadata with true per-page metadata:
  - Spanish metadata on `/`
  - English metadata on `/en/`

### 5. Portfolio schema enrichment
- Extended `ReelClip` with SEO-friendly metadata fields:
  - `durationSeconds`
  - `language`
  - optional `schemaDescription`
  - optional `publishedAt`
- Added curated featured reels from the existing portfolio.
- Added a small visible “featured work” treatment near the reel section so the richer schema has an on-page match.
- Replaced the generic homepage `VideoObject` with four featured `VideoObject` entries using:
  - real `contentUrl`
  - real `thumbnailUrl`
  - real `duration`
  - localized descriptions

### 6. Discovery files
- Updated `public/sitemap.xml` with both canonical pages and reciprocal hreflang.
- Updated `public/llms.txt` to point to both canonical homepages and featured work URLs.
- Kept `robots.txt` permissive while correcting the Google-Extended comment so it no longer implies search/citation guarantees.

## Validation
- `npm run video:catalog` completed successfully.
- `npm run build` completed successfully.
- Built outputs now include:
  - `dist/index.html`
  - `dist/en/index.html`
- Raw built HTML confirms:
  - `/` -> `lang="es"` + Spanish canonical/title
  - `/en/` -> `lang="en"` + English canonical/title
  - `FAQPage` present on both
  - 4 `VideoObject` entries present on both
  - no `meta keywords`
  - no `SpeakableSpecification`

## Notes
- Local `vite preview` does not exercise Vercel redirects at the HTTP layer, so `?lng=` normalization still needs deployment verification in the real environment.
- `npm run lint` still reports pre-existing unrelated UI/component lint issues outside this change set.

## Post-Deploy Checklist
- [ ] Verify `https://www.giselasaldarriaga.com/?lng=en` redirects to `https://www.giselasaldarriaga.com/en/`
- [ ] Verify `https://www.giselasaldarriaga.com/en/?lng=es` redirects to `https://www.giselasaldarriaga.com/`
- [ ] Submit updated sitemap in Google Search Console
- [ ] Submit updated sitemap in Bing Webmaster Tools
- [ ] Run IndexNow submission for the homepage changes
- [ ] Re-test Rich Results / Schema Validator on both homepages
- [ ] Spot-check prompts in ChatGPT, Perplexity, Gemini, and Claude after recrawl
