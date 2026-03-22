# 2026-03-22: Service Page Expansion + Copy Polish + Transcript-Based Video Matching

## What changed

### 1. Expanded from 3 to 8 service landing pages
- Added 5 new services: testimonials/reviews, product demo, problem-solution, lifestyle, b-roll footage
- Created 10 new HTML entrypoints (5 ES + 5 EN) with full SEO infrastructure
- Each page includes: meta tags, canonical/hreflang, OG/Twitter cards, JSON-LD (WebPage + BreadcrumbList + Service + FAQPage), noscript fallback
- Updated vite.config.ts with 10 new build inputs
- Updated sitemap.xml with 10 new URLs + hreflang alternates
- Updated llms.txt with new service pages for AI search engines
- Updated enrich-service-entrypoints.mjs with FAQ data for all new pages

### 2. Homepage expanded from 6 to 8 cards
- Added cards 7 (Creadora UGC Bilingue) and 8 (Videos de Portavoz)
- Added Globe and Mic icons
- Updated servicePageByCard to all 8 unique service IDs
- Grid layout: 2-column on mobile, 4-column on desktop

### 3. Copy polish
- **Removed en-dashes (–)** from all content — replaced with regular hyphens (-) across service-pages.ts, HTML entrypoints, enrichment script, and translation files. The en-dash screams "AI-generated."
- **Removed industry list** ("ecommerce, beauty, lifestyle, SaaS y tecnología") from hero description and FAQ answers — replaced with "marcas globales" / "global brands" to avoid limiting appeal to visitors from unlisted industries.
- **Removed geography list** ("Estados Unidos, España y Latinoamérica") from hero description — same reason. The site serves globally.
- **Fixed "duelen"** → "conectan" in problem-solution hero title. "Videos que duelen" doesn't make sense in Spanish.

### 4. Transcript-based video reassignment
Read all 26 video transcripts (10 legacy + 16 nuevos) and reassigned featured examples per service page based on actual video content:

| Service | Old clips | New clips | Rationale |
|---|---|---|---|
| bilingual-ugc-creator | 1,2,7 | 6,1006,1 | 6=Fiverr self-intro, 1006=multi-industry reel, 1=lifestyle versatility |
| spokesperson-videos | 2,6,7 | 2,1010,1005 | 2=brand spokesperson, 1010=news anchor, 1005=financial spokesperson |
| ugc-ads-tiktok-meta | 1,4,7 | 1001,1003,1009 | 1001=marketing ad, 1003=vehicle wrap ad, 1009=WhatsApp bot ad |
| ugc-testimonials-reviews | 1,4,8 | 4,1013,1004 | 4=supplement review, 1013=fitness testimonial, 1004=restaurant review |
| ugc-product-demo | 3,7,9 | 3,1008,1011 | 3=voicebot review-demo (hero), 1008=auto VoiceBot demo, 1011=dental demo |
| ugc-problem-solution | 5,4,2 | 1009,5,1001 | 1009=WhatsApp hook-pain-CTA, 5=real estate hook-solution, 1001=marketing hook-solution |
| ugc-lifestyle | 1,8,10 | 8,1002,1 | 8=perfume lifestyle, 1002=Spain organic content, 1=Temu try-on |
| ugc-broll-footage | 10,8,5 | 10,1002,1007 | 10=short lifestyle, 1002=travel visuals, 1007=news BTS |

To enable nuevos clips (IDs 1001-1016) in service pages, updated `ServiceLandingPage.tsx` to merge both `LEGACY_REEL_CLIPS` and `NUEVOS_R2_READY_CLIPS` into the clip lookup map.

## Files modified
- `src/lib/locale-path.ts` — 5 new ServicePageId values + paths
- `src/data/service-pages.ts` — 5 new service definitions + updated all 16 featuredExamples blocks + copy fixes
- `src/components/Services.tsx` — 8 cards, new icons, updated grid
- `src/components/ServiceLandingPage.tsx` — merged nuevos clips into clipMap
- `src/locales/es/translation.json` — service7, service8, copy fixes
- `src/locales/en/translation.json` — service7, service8, copy fixes
- `scripts/enrich-service-entrypoints.mjs` — 10 new FAQ entries + copy fixes
- `public/sitemap.xml` — 10 new URLs
- `public/llms.txt` — new service pages
- `vite.config.ts` — 10 new build inputs
- `en/index.html` — copy fix
- 10 new HTML entrypoints (servicios/ and en/services/)

## Verification
- `npm run build` passes: all 18 HTML entrypoints compile
- Enrichment script processes all 16 service entrypoints
- All new service pages render correctly in dev mode (ES + EN)
- New video clips load and display with correct titles/durations
- No new console errors
