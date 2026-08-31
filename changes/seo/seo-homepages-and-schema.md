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

## 2026-03-13 dedicated service-page discoverability pass

### Runtime touchpoints in this pass
- `servicios/creadora-ugc-bilingue/index.html`
- `servicios/videos-de-portavoz/index.html`
- `servicios/ugc-ads-tiktok-meta/index.html`
- `en/services/bilingual-ugc-creator/index.html`
- `en/services/spokesperson-videos/index.html`
- `en/services/ugc-ads-tiktok-meta/index.html`
- `src/App.tsx`
- `src/main.tsx`
- `src/pages/Index.tsx`
- `src/pages/NotFound.tsx`
- `src/components/PageSeo.tsx`
- `src/components/ServiceLandingPage.tsx`
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/components/Services.tsx`
- `src/lib/locale-path.ts`
- `src/data/service-pages.ts`
- `public/sitemap.xml`
- `public/llms.txt`
- `vercel.json`
- `vite.config.ts`
- `package.json`
- `scripts/enrich-service-entrypoints.mjs`

### What changed
1. Added six crawlable, path-specific landing pages for the three core service intents in Spanish and English: bilingual UGC creator, spokesperson videos, and UGC ads for TikTok/Meta.
2. The React app now routes these URLs directly, keeps locale in sync with the pathname, and resets route-level metadata so client-side navigation does not leave stale service titles, canonicals, or FAQ schema on the homepage.
3. Homepage service cards, footer links, navbar language switching, and 404 recovery now point to the correct localized service URLs instead of forcing all discovery through the homepage.
4. `sitemap.xml` now lists each service page with hreflang alternates, and `llms.txt` now points answer engines toward the most relevant service page before falling back to the homepage.
5. Static service entrypoints were wired into the Vite multi-page build and Vercel cache headers so the new URLs ship as real HTML documents, not only client-side routes.
6. The new `scripts/enrich-service-entrypoints.mjs` step adds FAQPage schema and noscript FAQ content to each service entrypoint so non-JS fetchers and answer-engine audits can extract service-specific answers from raw HTML.

### Verification
1. `npm run build` completed successfully with all six service entrypoints emitted in `dist/`.
2. `seo_audit.py` returned clean baseline results for:
   - `/servicios/creadora-ugc-bilingue/`
   - `/en/services/bilingual-ugc-creator/`
3. The remaining four service URLs returned `200 OK` with the expected title, description, and canonical tags in local preview.

## 2026-08-31 crawl-trust harden

Landing Content owns hub headlines, hub body, and visible Fiverr paragraphs. This pass only makes the crawl graph honest.

### Runtime touchpoints in this pass
- `src/components/chapters/ManifestoChapter.tsx`
- `src/components/NavbarControls.tsx`
- `src/components/Navbar.tsx`
- `src/lib/contact-channels.ts`
- `src/lib/locale-path.ts`
- `src/components/HubIndexPage.tsx`
- `src/entry-hub.tsx`
- `index.html`
- `en/index.html`
- `public/gtm-loader.js`
- `public/sitemap.xml`
- `public/llms.txt`
- `public/llms-full.txt`
- `scripts/prerender.mjs`
- `scripts/generate-hub-entrypoints.ts`
- `scripts/generate-sitemap.ts`

### What changed
1. Homepage manifesto numerals no longer prerender `0+ marcas` / `0M+ vistas` / `0% satisfacción`. The only baked figure is the locked **28+ campañas**. Views and satisfaction were not in the locked proof set, so they are not invented in static HTML.
2. Fiverr canonical URL is `https://www.fiverr.com/gisela_sm` everywhere that was still carrying `?source=gig_page` (schema `sameAs`, hrefs, llms).
3. Person schema now has `alternateName` `Gisela.UGC` on Person only. It is not a second entity, Organization name, or public keyword.
4. Six hub indexes exist as empty-but-valid static entrypoints: `/servicios/`, `/verticales/`, `/recursos/`, `/en/services/`, `/en/verticals/`, `/en/resources/`. Each has canonical, hreflang es↔en with x-default on the ES hub, child links, and a CTA to `/#contact` or `/en/#contact`. No hub marketing titles, H1s, or Fiverr paragraphs.
5. `public/sitemap.xml` is generated from the page registry with git-backed `lastmod` dates and includes the six hubs.
6. The homepage language switcher is a real `<a href>` pair so crawlers can follow `/en/` and `/` from the body.
7. `gtm-loader.js` fires `gtag('config')` (page_view) on load. The GTM container stays deferred until interaction or the idle window, which keeps the July 2026 LCP split.
8. `llms.txt` and `llms-full.txt` Last-Updated values are aligned to 2026-08-31, Fiverr tracking query strings are gone, and hub URLs are listed. Both files open with the locked EN quotable: bilingual UGC from Medellín for US Hispanic / Spain / LatAm, Fiverr gisela_sm 4.8/5 on 173 reviews, 28+ campaigns, content for the brand not her socials.

### What this pass did not write
Landing Content will place visible Fiverr 4.8/173 copy on bilingüe, cómo-contratar, and related surfaces. Homepage and child landings keep existing `AggregateRating` 4.8/173 in schema and do not gain new Fiverr marketing paragraphs here.

