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
1. Corrected mobile horizontal focal direction by moving to `object-position: 34% 0%`, which places the subject further right on screen (the previous higher X value moved her left).
2. Switched to top-origin scaling and a controlled downward offset (`transform: scale(1.04) translateY(2.5%)`, `transform-origin: top center`) to preserve top headroom while still lowering the subject away from the navbar chrome.
3. Kept the `md+` reset (`transform: none`) so desktop/tablet framing remains unchanged.

### Verification
1. `npm run build`

### SEO impact
- CSS-only visual adjustment.
- No content, metadata, schema, canonical route, or semantic structure changes.

## 2026-03-18 service hero mobile framing — horizontal rebalance

### Runtime touchpoints
- `src/index.css`

### What changed
1. Rebalanced the mobile horizontal focal point from `34%` to `42%` to reduce over-shift and place the subject closer to the intended center-right position.
2. Kept the prior top-headroom fix intact (`transform: scale(1.04) translateY(2.5%)`, `transform-origin: top center`).

### Verification
1. `npm run build`

### SEO impact
- CSS-only positional tweak; no SEO-surface changes.

## 2026-03-18 service hero mobile framing — fine horizontal nudge

### Runtime touchpoints
- `src/index.css`

### What changed
1. Increased mobile hero horizontal focal X from `42%` to `46%` for a small additional rebalance while preserving the current headroom fix.
2. Left vertical/top-headroom settings unchanged (`transform: scale(1.04) translateY(2.5%)`, `transform-origin: top center`).

### Verification
1. `npm run build`

### SEO impact
- CSS-only visual positioning adjustment.
- No metadata, canonical, schema, or content changes.

## 2026-03-18 service hero mobile framing — left-shift follow-up for right-arm visibility

### Runtime touchpoints
- `src/index.css`

### What changed
1. Increased mobile focal X from `46%` to `52%` to shift the subject further left on screen and recover more of the right arm.
2. Kept vertical/headroom framing unchanged to avoid reintroducing top crop issues.

### Verification
1. `npm run build`

### SEO impact
- CSS-only positional update; no SEO-surface changes.

## 2026-03-18 service hero top-gap cleanup + compact mobile nav

### Runtime touchpoints
- `src/components/Navbar.tsx`
- `src/components/ServiceLandingPage.tsx`
- `src/index.css`

### What changed
1. Added a service-page-only compact mobile navbar mode via `Navbar compactMobile` so homepage nav sizing remains unchanged.
2. Reduced mobile navbar vertical footprint on service pages by tightening top padding, shell padding/radius, language switch button size, theme toggle visual size, and hamburger button/icon size.
3. Moved the service-hero image up slightly by reducing vertical offset from `translateY(2.5%)` to `translateY(1.4%)` while keeping current headroom scaling behavior.

### Verification
1. `npm run build`

### SEO impact
- No SEO-copy or schema changes.
- No metadata/canonical route changes.
- Visual/layout-only updates.

## 2026-03-18 service hero top-strip removal + ultra-compact mobile nav pass

### Runtime touchpoints
- `src/components/Navbar.tsx`
- `src/components/ThemeToggle.tsx`
- `src/index.css`

### What changed
1. Removed the remaining service-hero top strip by lifting the mobile image offset from `translateY(1.4%)` to `translateY(0%)` while preserving existing scale/headroom behavior.
2. Tightened service-page mobile navbar again in `compactMobile` mode:
   - zero outer top/bottom nav padding on mobile (`py-0`)
   - smaller shell radius and vertical padding
   - smaller logo text size
   - thinner ES/EN pills
   - smaller theme toggle button/icon (new `compact` prop on `ThemeToggle`)
   - smaller hamburger button/icon
3. Kept desktop navbar sizing and homepage mobile navbar behavior unchanged.

### Verification
1. `npm run build`

### SEO impact
- Layout/CSS + control sizing only.
- No metadata, schema, canonical routing, or content changes.

## 2026-03-18 service hero desktop framing — lower subject for headroom

### Runtime touchpoints
- `src/index.css`

### What changed
1. Adjusted service-hero media focal Y on larger breakpoints so the subject sits slightly lower and avoids top head crop:
   - `md` (`>=768px`): `object-position: center 46%`
   - `lg+` (`>=1024px`): `object-position: center 40%`
2. Kept transform disabled on desktop/tablet (`transform: none`) so only focal alignment changes.

### Verification
1. `npm run build`

### SEO impact
- CSS-only framing update; no SEO-surface changes.

## 2026-03-18 service hero desktop framing — additional downward shift

### Runtime touchpoints
- `src/index.css`

### What changed
1. Shifted service-hero desktop/tablet focal Y further down to increase top headroom:
   - `md` (`>=768px`): `center 46%` → `center 40%`
   - `lg+` (`>=1024px`): `center 40%` → `center 32%`
2. Kept all mobile framing and transform behavior unchanged.

### Verification
1. `npm run build`

### SEO impact
- CSS-only positional refinement.
- No metadata, schema, canonical routes, or content changes.

## 2026-03-18 editorial intro — section reorder + premium redesign

### Runtime touchpoints
- `src/components/ServiceLandingPage.tsx`

### What changed

#### Section reorder
1. Moved the Proof Gallery (formerly Section 3) up to Section 2 so video proof appears immediately after the hero before any editorial framing.
2. Moved the Editorial Intro (formerly Section 2) down to Section 3, where it now provides context after the visitor has already seen the work.
3. Updated section-number comments in the component to reflect the new order.

#### Editorial Intro redesign (Direction 3 — clean split with premium market items)
1. Increased section padding from `py-16 md:py-24 lg:py-28` to `py-20 md:py-28 lg:py-32` for more breathing room.
2. Added a top border (`border-t border-border/50`) to visually anchor the section's separation from the gallery above.
3. Increased column gap from `gap-10` to `gap-12 lg:gap-16`.
4. Left column: upgraded intro text from `clamp(1.35rem,2.5vw,2.2rem) leading-[1.5] text-foreground/85` to `clamp(1.5rem,2.8vw,2.4rem) leading-[1.45] text-foreground` — larger, tighter line-height, full opacity for a more confident typographic statement.
5. Right column: removed the `section-label` eyebrow (was creating redundant label duplication). Replaced the bordered numbered row treatment (`border-b border-border/40 py-4 flex gap-4`) with a premium editorial callout stack — each item gets a large serif number (`text-3xl font-serif font-light text-accent/35`) above the item text, items separated by whitespace (`pt-8 md:pt-10`) rather than border lines.
6. The left column eyebrow label (`section-label`) is retained as the single label for the section.

### SEO safety check
- `sectionIntroTitle` eyebrow text: preserved in DOM as a `<p class="section-label">` element — crawlable.
- `sectionIntroText` body copy: preserved unchanged — crawlable.
- `marketItems` array text: all items remain visible in the DOM as `<p>` elements — crawlable.
- `marketTitle` field: no longer rendered as a heading/label (was a duplicate label in the right column). The items themselves remain fully crawlable so the indexed text is unchanged.
- No heading levels modified.
- No metadata, schema, canonical routes, or structured data changed.
- Section reorder does not affect SEO — all text content remains present in the DOM.

### Verification
1. `npm run build` — passed, 2118 modules, no errors.

## 2026-03-18 editorial intro — tighten pass (border-left anchor + inline numbers)

### Runtime touchpoints
- `src/components/ServiceLandingPage.tsx`

### What changed
1. Added a desktop-only left border rule (`lg:border-l lg:border-border/40 lg:pl-12`) to the right column so it reads as a distinct editorial panel without adding background color or box decoration.
2. Restored `marketTitle` label (`section-label mb-8`) above the delivery items — it was removed in the previous pass, but is important visitor context and a crawlable text node.
3. Replaced the floating large-serif number treatment (`text-3xl font-serif`) with a compact inline spec-sheet style: `text-[11px] font-bold uppercase tracking-prestige text-accent/50` sitting inline to the left of the item text via a `flex items-start gap-5` row.
4. Items are now separated by `border-t border-border/30` with symmetric `mt-5 pt-5` spacing — tight, scannable, and premium without competing with the left-column body text.
5. Increased overall column gap to `lg:gap-20` and adjusted left padding to `lg:pl-12` for more compositional air.

### SEO safety check
- `sectionIntroTitle` preserved as `<p class="section-label">` — crawlable.
- `sectionIntroText` preserved unchanged — crawlable.
- `marketTitle` restored to DOM — crawlable.
- All `marketItems` text visible in `<p>` elements — crawlable.
- No heading levels, metadata, schema, routes, or structured data changed.

### Verification
1. `npm run build` — passed, no errors.

## 2026-03-19 "Cinematic Cadence" redesign — unique layout DNA per service page

### Summary
Full architectural rework of the service pages. Decomposed the 1032-line `ServiceLandingPage.tsx` monolith into 11 focused components under `src/components/service/`, each accepting a `variant` prop. Each of the 3 service pages now has unique layout DNA — different hero visuals, different section layouts, and different section ordering — while sharing the same design system (typography, color, motion).

### Runtime touchpoints (new files)
- `src/components/service/layouts.ts` — config hub mapping each ServicePageId to its variant set + section order
- `src/components/service/ServiceHero.tsx` — 3 hero variants: `split-world`, `stage`, `lab`
- `src/components/service/ServiceEditorialIntro.tsx` — 3 intro variants: `wide`, `centered`, `dark`
- `src/components/service/ServiceDeliverables.tsx` — 3 deliverables variants: `magazine`, `bento`, `dashboard`
- `src/components/service/ServiceProcess.tsx` — 3 process variants: `scroll-track`, `centered-timeline`, `row-blocks`
- `src/components/service/ServiceFitPanel.tsx` — 3 fit panel variants: `split-diagonal`, `stacked`, `tabs`
- `src/components/service/ServiceCtaCloser.tsx` — 3 CTA variants: `default`, `personal`, `teal-gradient`
- `src/components/service/ServiceFaq.tsx` — extracted, single variant
- `src/components/service/ServiceFeaturedWork.tsx` — extracted with `ServiceFeaturedWorkGrid` named export
- `src/components/service/ServiceRelated.tsx` — extracted
- `src/components/service/ServiceProofTheater.tsx` — extracted video overlay modal

### Runtime touchpoints (modified)
- `src/components/ServiceLandingPage.tsx` — rewritten from 1032-line monolith to ~380-line thin orchestrator. Keeps ALL SEO/schema logic. Renders sections via `layout.sectionOrder` from config.
- `src/index.css` — added hero variant CSS (`.svc-hero--split-world`, `.svc-hero--stage`, `.svc-hero--lab`), intro dark variant (`.svc-intro-dark`), floating cinema CSS (Phase 6)

### Unique layout per service

#### bilingual-ugc-creator → "The Flagship"
- **Hero**: Split-world — homepage hero image with split-tint CSS overlays (teal left / khaki right)
- **Section order**: hero → featuredWork → editorialIntro → deliverables → process → fitPanel → faq → featuredWorkGrid → ctaCloser → related
- **Deliverables**: Magazine spread — full-width rows with 72px watermark numerals
- **Process**: Horizontal snap-scroll cards (mobile) / 4-column grid (desktop)
- **Fit Panel**: Split panel with diagonal CSS `clip-path` divider
- **CTA**: Default centered dark sign-off

#### spokesperson-videos → "The Stage"
- **Hero**: Stage — R2 spokesperson poster as background, centered composition, stage spotlight gradient
- **Section order**: hero → editorialIntro → featuredWork → deliverables → process → fitPanel → faq → featuredWorkGrid → ctaCloser → related
- **Intro**: Centered pull-quote with left border, italic Cormorant, max-width 720px
- **Deliverables**: Bento grid — 2×2, first card spans 2 columns
- **Process**: Centered timeline — steps alternate left/right of center line
- **Fit Panel**: Stacked vertically — best-fit light, not-fit dark
- **CTA**: Asymmetric — Gisela's avatar left, CTA text right

#### ugc-ads-tiktok-meta → "The Lab"
- **Hero**: Lab — no background image, solid deep-ebony, split layout with live `<video>` in phone frame
- **Section order**: hero → deliverables → featuredWork → editorialIntro → process → fitPanel → faq → featuredWorkGrid → ctaCloser → related
- **Deliverables**: Dashboard grid — 4 cards with teal dot indicators
- **Intro**: Dark section (deep-ebony bg, linen text), bold numbered market items
- **Process**: Numbered blocks in a single row
- **Fit Panel**: Tab interface with animated underline
- **CTA**: Coastal-teal gradient accent background

### Hero background strategy (no new assets)
- bilingual-ugc-creator: `gisela-hero-desktop-2048.webp` (existing) with split-tint CSS overlays
- spokesperson-videos: R2 poster from clip ID 2 (`ugc-brand-spokesperson-poster.jpg`, already exists)
- ugc-ads-tiktok-meta: No image — solid deep-ebony + inline `<video>` element

### SEO impact
- H1 in hero preserved (same text source)
- H2/H3 hierarchy preserved across all sections
- Schema, meta, canonicals all untouched — `ServiceLandingPage.tsx` orchestrator keeps all SEO logic
- FAQ content and structure unchanged
- No route changes, no metadata-field rewrites

### Verification
1. `npm run build` — passed
2. `npx tsc --noEmit` — zero type errors
3. All 3 service pages × ES locale verified in dev server
4. Homepage unaffected
