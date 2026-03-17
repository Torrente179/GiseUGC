# Service Page Showroom Redesign

## Summary
This is the current UI note for the dedicated service pages. It tracks the shift away from the generic shared-card template toward a creator-showroom layout that sells through earlier video proof, clearer section rhythm, and a more premium service-page presentation.

## Current runtime touchpoints
- `src/components/ServiceLandingPage.tsx`
- `src/index.css`
- `src/data/service-pages.ts`
- `src/data/portfolio-clips.ts`
- `src/data/video-lqip.ts`
- `src/components/media/LazyVideo.tsx`
- `src/components/PageSeo.tsx`
- `scripts/enrich-service-entrypoints.mjs`
- `servicios/creadora-ugc-bilingue/index.html`
- `servicios/videos-de-portavoz/index.html`
- `servicios/ugc-ads-tiktok-meta/index.html`
- `en/services/bilingual-ugc-creator/index.html`
- `en/services/spokesperson-videos/index.html`
- `en/services/ugc-ads-tiktok-meta/index.html`

## Current state
1. The shared service-page template now behaves like a creator sales portfolio instead of a generic marketing layout with repeated bordered cards.
2. Each service page brings video proof into the hero through a live preview stage with selectable examples, so visitors can evaluate Gisela's on-camera presence and style immediately.
3. The supporting page sections now use differentiated layouts: a tighter service brief, editorial deliverable rows, a split fit-vs-not-fit module, and a process sequence instead of another four-card grid.
4. FAQ, CTA, and related-service sections remain present for trust, conversion, and internal linking, but they carry less visual weight than the proof and service-logic sections above.
5. The redesign kept the SEO contract intact by preserving the same H1-level content source, metadata wiring, FAQ visibility, and internal links without rewriting service copy or schema fields.

## 2026-03-17 creator-showroom redesign pass

### What changed
1. Reworked the hero from `copy + generic aside` into `service thesis + video showroom`, using the existing service-specific featured examples as the first proof surface.
2. Pulled featured work much earlier in the page so the service pages sell through visible samples before asking the visitor to parse too much service explanation.
3. Replaced the repeated card-grid treatment with section-specific compositions:
   - service brief with markets and formats in a tighter band
   - deliverables as editorial rows
   - best fit / not fit as one comparison module
   - process as a numbered sequence
4. Simplified the lower sections so FAQ, CTA, and related services support the sale without visually competing with the proof-heavy upper half of the page.
5. Kept the runtime SEO surfaces stable: no route changes, no metadata-field rewrites, no FAQ-content rewrites, and no service-entrypoint copy sync was required for this pass.

### Verification
1. `npm run build`
2. `npx eslint src/components/ServiceLandingPage.tsx`

## 2026-03-17 service FAQ readability correction

### What changed
1. The service-page FAQ question rows were moved back to the sans stack instead of inheriting the premium serif display treatment.
2. Letter spacing and line height were relaxed for FAQ questions so longer entries read cleanly on desktop and mobile without losing the higher-end visual tone of the rest of the page.
3. The change stayed scoped to service-page FAQ question text only; the broader service-page typography, metadata, and crawlable HTML entrypoints were left untouched.
