# SEO Phases 3e–7: Resource Pages, LLMs, Mobile Perf, Internal Linking

## Summary
Completed the remaining SEO/GEO plan phases: added Review schema items, created 4 bilingual authority/resource pages, built `llms-full.txt`, optimized mobile font and video loading, and added cross-linking between service pages, verticals, and resources.

## What changed

### Phase 3e — Review Schema Enhancement
**Files:** `index.html`, `en/index.html`

Added 5 individual `Review` items inside the `ProfessionalService` JSON-LD schema on both homepages. Each review includes:
- `@type: Review` with author, `ratingValue: 5`, `bestRating: 5`
- `reviewBody` text (Spanish homepage has mix of ES/EN reviews; English homepage has all EN translations)
- `datePublished` ranging from 2025-12-18 to 2026-03-10

These reviews enrich the existing `AggregateRating` (4.8/5, 158 reviews) with concrete proof that Google can display in rich results.

### Phase 4 — Authority/Resource Pages (8 new pages)
**New files:**
- `src/data/resource-pages.ts` — content data for 4 resource articles × 2 locales (~1,800–2,000 words each)
- `src/components/ResourcePage.tsx` — page component with Article schema, BreadcrumbList, FAQPage schema, comparison tables
- 8 boot shell HTML files:
  - `recursos/que-es-ugc/index.html` + `en/resources/what-is-ugc/index.html`
  - `recursos/como-contratar-creadora-ugc/index.html` + `en/resources/how-to-hire-ugc-creator/index.html`
  - `recursos/ugc-vs-influencer-marketing/index.html` + `en/resources/ugc-vs-influencer-marketing/index.html`
  - `recursos/formatos-ugc-ads/index.html` + `en/resources/ugc-ad-formats-guide/index.html`

**Modified files:**
- `src/lib/locale-path.ts` — added `ResourcePageId` type, `RESOURCE_PATHS`, `getResourcePageIdFromPath`, `getResourcePageRouteEntries`, updated `getLocalizedPathForCurrentRoute`
- `src/App.tsx` — added resource page routing (import, route entries, memo, render block)
- `vite.config.ts` — added 8 resource page entry points (38 total)

Each resource page includes:
- Hero with eyebrow, title, summary paragraph, bullet points, dual CTAs
- Multiple article sections with full prose
- Optional comparison table (UGC vs Influencer page)
- FAQ accordion with FAQPage schema
- Related services and verticals sections with internal links
- Bottom CTA section
- Full `<head>` SEO (title, description, canonical, hreflang, OG/Twitter, Article schema, BreadcrumbList)

### Phase 5 — GEO Extractability (llms-full.txt)
**New files:**
- `public/llms-full.txt` (~3,000 words) — comprehensive AI-readable service profile covering: about, all 8 services with deliverables/best-fit/FAQ, 5 industry verticals, 4 resource articles, proof points, working process, pricing model, full page index, contact info, AI system notes

**Modified files:**
- `public/llms.txt` — added `Full version:` link to llms-full.txt, added 8 resource page URLs to Canonical Pages section, added resources to Preferred Source Surfaces

### Phase 6 — Mobile Performance
**Files:** `index.html`, `en/index.html`

1. **Video preload**: Added `window.innerWidth < 768` check — mobile devices skip the hero video preload entirely (poster image still preloads)
2. **Font loading split**: Separated DM Sans (primary body font) from decorative fonts:
   - DM Sans loads immediately via `<link rel="stylesheet">` (render-blocking but critical)
   - Alex Brush + Cormorant Garamond load async via `media="print" onload="this.media='all'"` with `display=optional` (won't cause layout shift if they arrive late)

### Phase 7 — Internal Linking on Service Pages
**Files:** `src/components/ServiceLandingPage.tsx`

Added two new sections to every service landing page:

1. **"By Industry" section** — links to relevant vertical pages based on a `SERVICE_TO_VERTICALS` mapping (e.g., bilingual-ugc-creator links to all 5 verticals, spokesperson-videos links to 3)
2. **"Resources" section** — links to all 4 resource articles

Both sections use pill-style links on desktop and row lists on mobile, with arrow indicators. Rendered between the FAQ section and the ServicesMarquee footer.

### Sitemap Update
**File:** `public/sitemap.xml`

Added 8 new `<url>` entries for resource pages (4 ES + 4 EN) with proper `xhtml:link` hreflang alternates. Total URLs: 40 (was 32).

## Files changed (53 total)
- **New files (13):** 8 resource boot shells, `ResourcePage.tsx`, `resource-pages.ts`, `llms-full.txt`, `expand-boot-shells.mjs`, this changelog
- **Modified files (40):** both homepages, all service/vertical/legal boot shells (dateModified), `App.tsx`, `ServiceLandingPage.tsx`, `locale-path.ts`, `vite.config.ts`, `llms.txt`, `sitemap.xml`, `.gitignore`, `nuevos-r2-ready.ts`

## How to verify
1. `npx tsc --noEmit` — zero errors
2. `npm run build` — 38 entry points, all resource pages in `dist/recursos/` and `dist/en/resources/`
3. Dev server: navigate to `/recursos/que-es-ugc/` — full article renders with breadcrumbs, FAQ, schema
4. Dev server: navigate to `/servicios/creadora-ugc-bilingue/` — scroll down to see vertical + resource link sections
5. Check `view-source:` on homepages for `"review"` array inside JSON-LD
6. Fetch `/llms-full.txt` — comprehensive AI-readable profile
