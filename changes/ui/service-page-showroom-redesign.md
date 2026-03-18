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

## 2026-03-17 service FAQ typography enforcement

### What changed
1. Moved the service-page FAQ question typography from a CSS-only hook into explicit component classes so the sans treatment no longer depends on inherited service-page styles.
2. Pinned the FAQ answer copy to the sans stack as well, keeping the full accordion block consistently more readable.
3. Left the FAQ content, schema output, metadata, and localized entrypoint structure unchanged.

## 2026-03-17 service FAQ cross-surface font lock

### What changed
1. Added hard font-family enforcement (`DM Sans`) on service FAQ question and answer nodes inside the React service template to prevent serif fallback from inherited typography.
2. Expanded the shared `.svc-faq-item summary` CSS selector to include descendants so nested FAQ text nodes inherit the same sans rule consistently.
3. Updated and regenerated all six static service entrypoints so no-JS fallback FAQ terms/answers also stay on the sans stack.

## 2026-03-17 service FAQ readability reweight

### What changed
1. Reduced service FAQ question visual heaviness by moving from semibold sizing to a medium-weight, smaller type scale (`text-base` on mobile, `text-lg` on desktop).
2. Relaxed the shared FAQ line-height and tracking so longer Spanish questions read cleaner without the blocky heavy look.
3. Mirrored the tone shift in no-JS fallback FAQ terms by reducing fallback term weight from `700` to `600` in the entrypoint generator.

## 2026-03-18 service proof gallery — editorial numbered showcase

### Runtime touchpoints
- `src/components/ServiceLandingPage.tsx`
- `src/index.css`

### What changed
1. Replaced the flat bento mosaic in the Proof Gallery section (section 3) with an editorial numbered showcase. The new layout uses a cinematic wide lead card (01) with a `16/10` → `21/9` aspect ratio and an always-visible gradient overlay, title, description, and play button, followed by a secondary grid (02, 03) of portrait-on-mobile / landscape-on-desktop cards.
2. Replaced `svc-bento-item` and `svc-bento-overlay` CSS classes with `svc-proof-lead` and `svc-proof-card`, each using `ease-out-expo` transitions for hover lift and box-shadow.
3. Secondary card grid columns are conditionally sized: 1 column for ≤2 total examples, 2 columns for exactly 3, up to 3 columns for 4+.

### SEO impact
- Section heading (h2), section label, and example titles remain crawlable.
- No metadata, schema, canonical routes, or structured data were modified.

## 2026-03-18 service page — featured work numbered text grid after FAQ

### Runtime touchpoints
- `src/components/ServiceLandingPage.tsx`

### What changed
1. Added a new "Trabajo Destacado / Featured Work" section (section 8) after the FAQ and before the CTA closer. The section renders the same numbered text grid style that previously existed on the homepage portfolio: a border-divided column grid where each cell shows a number index (01, 02, 03), a serif clip title, and an arrow.
2. Each cell links directly to the clip's main video URL (`clip.mainSrc`), opening in a new tab.
3. The column count is driven by the number of proof examples: 2 examples → 2 columns, 3 → 3 columns, 4+ → 4 columns.
4. Added `featuredWorkLabel` and `featuredWorkSubtitle` keys to both `es` and `en` entries in `localeLabels` for correct bilingual rendering.
5. The section is gated on `proofExamples.length > 0` so pages without featured examples don't render an empty block.

### SEO impact
- Section label and clip titles are crawlable text in semantic elements.
- No heading structure, schema, canonicals, or metadata were modified.

## 2026-03-18 service hero background — static image swap

### Runtime touchpoints
- `src/components/ServiceLandingPage.tsx`
- `src/index.css`
- `public/uploads/services-hero-background.jpg`

### What changed
1. Replaced the dedicated service hero autoplay video layer with a static background image (`/uploads/services-hero-background.jpg`) sourced from the provided photo.
2. Removed service-hero video dependencies from the runtime template (`LazyVideo` and service-page video LQIP lookup) to keep the hero render path image-only.
3. Renamed the hero media class from `svc-hero-video` to `svc-hero-media` and retained full-bleed cover behavior with centered crop (`object-position: center`) so existing overlay and content contrast still work across breakpoints.
4. Added a losslessly optimized JPEG asset for the hero background (`services-hero-background.jpg`), preserving image quality while reducing metadata and storage overhead.

### Verification
1. `npm run build`

### SEO impact
- Hero copy, H1, metadata wiring, schema output, and service routes are unchanged.

## 2026-03-18 service hero mobile framing — homepage-style de-clutter pass

### Runtime touchpoints
- `src/components/ServiceLandingPage.tsx`
- `src/index.css`

### What changed
1. De-cluttered breadcrumb navigation on mobile with an `sr-only` pattern (`sr-only md:not-sr-only md:flex`) to reclaim top-of-hero visual space without removing semantic link markup from the rendered DOM.
2. Applied homepage-style mobile de-clutter to the service hero body by keeping summary and hero chips in the DOM but removing them from small-screen visual layout (`sr-only` / `md:not-sr-only` patterns).
3. Tightened mobile title measure by capping line width (`max-w-[12ch]`) and reducing mobile title scale/line-height so the overlay copy no longer dominates the image.
4. Updated mobile hero image framing to `object-position: 62% 12%` and restored centered framing from `md` upward, improving subject visibility behind the remaining hero content.

### Verification
1. `npm run build`

### SEO impact
- Hero H1 and summary text remain present in rendered HTML.
- No schema, canonical routes, metadata, or localized service copy were changed.

## 2026-03-18 service hero mobile framing — right/lower subject alignment pass

### Runtime touchpoints
- `src/index.css`

### What changed
1. Shifted mobile service-hero image focus further to the right (`object-position: 70% 20%`).
2. Added a subtle mobile-only framing offset using `transform: scale(1.04) translateY(2%)` so the subject sits lower and avoids top-edge chop against the mobile navbar chrome.
3. Reset transform at `md+` (`transform: none`) so desktop/tablet framing remains unchanged.

### Verification
1. `npm run build`

### SEO impact
- CSS-only visual adjustment.
- No content, metadata, schema, canonical route, or semantic structure changes.
