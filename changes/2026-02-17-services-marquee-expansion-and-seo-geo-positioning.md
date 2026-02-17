# 2026-02-17 - Services Marquee Expansion + SEO/GEO Positioning

## Summary
Expanded the services marquee section from 5 to 12 cards and implemented SEO/GEO updates to position Gisela as a bilingual UGC creator, spokesperson, and brand ambassador with the requested market priority:
1) US Spanish audience first,
2) Canada + Europe Spanish audience (including Spain),
3) English-speaking countries,
4) Spanish-speaking countries.

## Changes Made
1. Services marquee card expansion (5 -> 12)
- Added 7 new service cards in the bottom marquee (`ServicesMarquee`), for a total of 12.
- Added bilingual copy keys for all marquee cards in Spanish and English:
  - UGC ads, spokesperson, brand ambassador, testimonials/reviews, demos/how-to, bilingual voiceover/on-camera, social media verticals, beauty/skincare, SaaS/AI/tech, fashion/lifestyle, b-roll packs, and local/global production from Medellin.
- Mapped cards to additional existing preview/poster assets to keep visual variety.

2. Messaging update aligned to market order
- Updated `services.motionSubtitle` in both languages to reflect the exact market targeting order requested.

3. Technical SEO + GEO + AEO upgrades
- Updated title/meta descriptions and social meta (OG/Twitter) for stronger commercial intent around UGC/spokesperson/brand ambassador services.
- Added bilingual locale alternates in `<head>` (`hreflang` for `es`, `en`, and `x-default`).
- Added geo metadata for Medellin/Antioquia.
- Added JSON-LD structured data (`WebSite`, `Person`, `ProfessionalService`) with:
  - bilingual language signals,
  - social `sameAs` entity corroboration,
  - service catalog,
  - requested audience and `areaServed` priority ordering.

4. LLM discoverability
- Added `public/llms.txt` as a canonical AI-readable source of services, market focus, and profile links.
- Updated `robots.txt` to explicitly allow `/llms.txt`.

## Files Updated
- `src/components/ServicesMarquee.tsx`
- `src/locales/es/translation.json`
- `src/locales/en/translation.json`
- `public/locales/es/translation.json`
- `public/locales/en/translation.json`
- `index.html`
- `public/robots.txt`
- `public/llms.txt`
- `changes/2026-02-17-services-marquee-expansion-and-seo-geo-positioning.md`

## Validation
- `node` JSON parse check for all updated locale files.
- `npx eslint src/components/ServicesMarquee.tsx`
- `npm run build` (successful)
