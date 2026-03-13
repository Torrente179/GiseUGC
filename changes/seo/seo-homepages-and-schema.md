# SEO Homepages and Schema

## Summary
This is the current SEO note. It consolidates the AEO/GEO audit, FAQ and crawler-visible content work, the final ES/EN homepage split, and the featured-portfolio schema refresh that now matches visible content.

## Current runtime touchpoints
- `index.html`
- `en/index.html`
- `public/robots.txt`
- `public/sitemap.xml`
- `public/llms.txt`
- `src/i18n.ts`
- `src/data/portfolio-clips.ts`
- `src/locales/es/translation.json`
- `src/locales/en/translation.json`
- `vercel.json`

## Current state
1. The homepage now has true path-based language canonicals: Spanish at `/` and English at `/en/`, with matching hreflang and redirect normalization.
2. AI/search-facing boot-shell, FAQ, robots, sitemap, and llms content was expanded so non-JS or answer-engine crawlers can still extract usable site context.
3. Homepage metadata is now page-specific instead of mixed-language, and low-value noise such as legacy keywords and speakable schema was removed.
4. Portfolio schema now uses featured `VideoObject` entries backed by visible work instead of a generic placeholder video block.

## Relationship to earlier notes
- Earlier metadata and host-normalization work now lives in `changes/seo/seo-metadata-and-discovery.md`.
- This file is the current source for homepage SEO behavior after the canonical ES/EN split.

## Legacy notes absorbed
- `2026-03-04-seo-geo-aeo-complete-audit-and-optimization.md`
- `2026-03-07-canonical-es-en-homepages-and-portfolio-schema-refresh.md`

## 2026-03-13 crawlability and service-positioning pass

### Runtime touchpoints in this pass
- `index.html`
- `en/index.html`
- `src/pages/Index.tsx`
- `src/locales/es/translation.json`
- `src/locales/en/translation.json`
- `public/locales/es/translation.json`
- `public/locales/en/translation.json`
- `public/robots.txt`
- `public/llms.txt`

### What changed
1. The crawler-visible shell copy on both homepages was tightened around actual service-intent queries: bilingual UGC, spokesperson videos, TikTok Ads, Meta Ads, demos, reviews, and creator-led paid social work.
2. Text-heavy sections that support extractability now render without deferred mounting so non-JS or partially rendered fetchers can see more than the hero shell.
3. Source locales and public locale mirrors were aligned to the same conversion-focused positioning, and placeholder contact values were removed so the site no longer leaks fake contact data.
4. `robots.txt` was simplified to documented search, answer-engine, user-fetch, and training agents instead of carrying speculative or low-value bot entries.
5. `llms.txt` was kept as a secondary summary surface, but rewritten to mirror the actual service terms and proof points already present on the site instead of acting like a separate source of truth.
