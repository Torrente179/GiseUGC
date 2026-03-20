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

## 2026-03-20 "Screen Test" redesign — A24 × Apple, video-first, one CTA

### Direction
Design name: "Screen Test". North stars: A24 film pages (work IS the page) × Apple product pages (scale shifts, confident whitespace, zero filler). Core principle: video work is not "a section" — it IS the page. Everything else is annotation.

### Audit of template patterns killed
1. Full-bleed photo hero with gradient overlay → replaced with clean-bg split layout (text left, video poster right)
2. Every section opens with `section-label + studio-title` → varied rhythm, some sections have no heading at all
3. Vertical timeline with numbered dots → horizontal 2×2/4-column grid blocks with teal accent bars
4. Split rounded mega-panel for fit/not-fit → clean two-column plain text with dash prefixes
5. Two hero CTAs → single WhatsApp button (coastal-teal, full color, unmissable)
6. Identical padding on every section → variable spacing (tight brief, generous close, compressed process)
7. Dark CTA closer with cursive signature → clean centered text + single button, no dark bg
8. Numbered editorial deliverable rows → dense spec-sheet style (title–description pairs, hair borders)
9. Numbered badges on proof cards → removed, replaced with concrete data (duration, language)
10. Related services rounded hover-lift cards → minimal text rows with arrow

### Section architecture (7 → 5 visible sections)
1. **COLD OPEN** — No bg image. Asymmetric split: serif title + hook + WhatsApp CTA left, letterbox video poster right. Desktop: 50/50 grid. Mobile: stacked.
2. **THE BRIEF** — Editorial intro text as pull-quote left (58%), deliverables as dense spec-sheet right (42%) with left border rule. Market items as middot-separated inline strip.
3. **THE PROOF** — Full-bleed dark (`deep-ebony` bg). Stacked horizontal cards (poster left, info right on desktop). Duration + language chips. No numbered badges.
4. **THE PROCESS** — 2×2 mobile / 4-column desktop grid. Each block: teal accent bar, step number, title, description. No timeline, no dots.
5. **THE FILTER** — Combined fit/not-fit + FAQ. Two clean columns for fit check (teal dash = yes, muted dash = no). FAQ below with CSS-only `+/−` toggle (no icon component). Everything in one section.
6. **THE CLOSE** — Centered CTA text + WhatsApp button. Related services as text rows with arrow hover animation.

### What was removed entirely
- `services-hero-background.jpg` dependency (hero has no bg image)
- `svc-hero-*` CSS classes (replaced by `st-hero-*`)
- `svc-hero-chip`, `svc-hero-cta-secondary` (no secondary CTA)
- `svc-timeline-line`, `svc-timeline-dot` (no timeline)
- `svc-split-fit`, `svc-split-notfit` (no rounded panel)
- `svc-cta-closer`, `svc-signature` (no dark closer)
- `svc-related-card` (no card treatment)
- `svc-faq-toggle` (CSS-only toggle via `::before`)
- `svc-deliverable-row`, `svc-deliverable-desc` (spec-sheet replaces editorial rows)
- `svc-proof-lead`, `svc-proof-card` (new `st-proof-card` system)

### New CSS class system
All service CSS migrated from `.svc-*` to `.st-*` (Screen Test prefix). Key classes:
- `.st-hero`, `.st-hero-split`, `.st-hero-title`, `.st-hero-hook`
- `.st-letterbox`, `.st-letterbox-img`, `.st-play-btn`
- `.st-brief-grid`, `.st-pullquote`, `.st-spec-sheet`, `.st-spec-row`
- `.st-proof-wall`, `.st-proof-card`, `.st-proof-card-media`
- `.st-process-row`, `.st-process-block`, `.st-process-accent`
- `.st-fit-grid`, `.st-fit-item`, `.st-faq-item`, `.st-faq-question`
- `.st-close`, `.st-related-row`
- `.st-cta-primary` — single conversion button, coastal-teal bg, used everywhere

### Icons reduced
- **Before**: Check, Play, X, Plus, ArrowRight, ChevronLeft, ChevronRight (7 icons)
- **After**: Play, ChevronLeft, ChevronRight, X (4 icons — only Play for proof, nav arrows + close for theater)

### Bundle impact
- `ServiceLandingPage.tsx`: 1032 lines → ~420 lines
- `main-*.js` chunk: 327.87 kB → 317.82 kB (−10 kB, −3%)
- CSS `main-*.css`: net reduction from removing unused `.svc-*` classes

### SEO impact
- H1 in hero preserved (same text source: `page.heroTitle`)
- H2 preserved for deliverables (sr-only), featured work (sr-only), FAQ (sr-only), process, fit section
- All FAQ content in native `<details>/<summary>` — crawlable
- Schema.org graph identical (WebPage, BreadcrumbList, Service, FAQPage)
- Canonical URLs, alternates, meta title/description all untouched
- Breadcrumb semantic nav preserved

### Verification
1. `npm run build` — passed, ✓ built in 3.70s, 0 errors

## 2026-03-20 "Screen Test" mobile — independent app-like experience

### Direction
The desktop Screen Test layout was a responsive adaptation — the mobile view stacked the same sections. User explicitly requested an **independent app-like mobile design**, not a responsive shrink of the desktop. This pass creates two completely separate render paths: `md:hidden` for mobile, `hidden md:block` for desktop.

### Mobile architecture (5 sections + sticky bar)
1. **APP HERO** (`stm-hero`) — Full-viewport (`100svh`) video poster as background. Gisela's poster fills the screen. Title, eyebrow, and hook overlaid at bottom over a gradient. Play button centered. Tapping opens theater.
2. **SWIPEABLE PROOF REEL** (`stm-reel`) — Horizontal scroll-snap gallery (`scroll-snap-type: x mandatory`). Cards sized at `68vw` with `9/14` aspect ratio. Each card shows poster, gradient overlay, title, duration/language chips, and play button. Native momentum scrolling.
3. **COMPACT INFO ACCORDION** (`stm-info`) — 4 native `<details>/<summary>` blocks: What you get (deliverables), How it works (process steps with numbered circles), Is this for you (fit check with left-border indicators), Questions (nested FAQ with `+/−` toggle). Pull-quote in italic Cormorant below.
4. **RELATED SERVICES PILLS** (`stm-related`) — Horizontal scrolling pill strip. Each related service is a rounded pill link.
5. **CTA** (`stm-cta`) — Centered CTA text + full-width WhatsApp button.
6. **STICKY BAR** (`stm-sticky-bar`) — Fixed to bottom of viewport. Frosted glass background (`backdrop-filter: blur(16px)`). Respects `safe-area-inset-bottom` for notched devices. Persistent WhatsApp CTA.

### CSS class system
All mobile classes use `.stm-*` prefix (Screen Test Mobile). ~35 new classes added to `index.css`:
- Hero: `.stm-hero`, `.stm-hero-poster`, `.stm-hero-poster-img`, `.stm-hero-poster-overlay`, `.stm-hero-bottom`, `.stm-hero-title`, `.stm-hero-hook`
- Reel: `.stm-reel`, `.stm-reel-track`, `.stm-reel-card`, `.stm-reel-card-media`, `.stm-reel-card-img`, `.stm-reel-card-gradient`, `.stm-reel-card-bottom`, `.stm-reel-card-name`, `.stm-reel-card-chips`
- Accordion: `.stm-accordion`, `.stm-accordion-trigger`, `.stm-accordion-icon`, `.stm-accordion-body`
- Content: `.stm-spec-item`, `.stm-spec-name`, `.stm-spec-desc`, `.stm-step`, `.stm-step-num`, `.stm-step-name`
- Fit: `.stm-fit-heading`, `.stm-fit-item`
- FAQ: `.stm-faq-item`, `.stm-faq-q`, `.stm-faq-a`
- Quote: `.stm-quote-block`, `.stm-quote`
- Related: `.stm-related`, `.stm-related-strip`, `.stm-related-pill`
- CTA: `.stm-cta`, `.stm-cta-text`, `.stm-cta-btn`
- Sticky: `.stm-sticky-bar`, `.stm-sticky-btn`

### Zero new dependencies
- `scroll-snap-type: x mandatory` for horizontal gallery
- Native `<details>/<summary>` for all accordions (no JS animation lib)
- `position: fixed` for sticky bar
- CSS `+` icon via `::before`/`::after` pseudo-elements on `.stm-accordion-icon`
- `env(safe-area-inset-bottom)` for notch-safe spacing
- Tailwind `scrollbar-hide` utility for clean horizontal scrolling

### SEO preservation
- All sr-only headings (h2) preserved for crawlability
- Breadcrumb nav present (sr-only on mobile)
- Schema.org graph identical across both paths
- All FAQ content in native `<details>` — crawlable
- H1 in hero preserved

### Bundle impact
- `ServiceLandingPage.tsx`: ~420 lines → ~700 lines (added mobile path)
- CSS: +~380 lines of `.stm-*` classes
- `main-*.css`: 105.54 kB gzipped 18.32 kB

### Verification
1. `npm run build` — passed, ✓ built in 4.76s, 0 errors
2. Visual verification at 375×812 (iPhone-class viewport) via Puppeteer
3. All 3 services × 2 locales confirmed rendering correctly

## 2026-03-20 desktop proof section — editorial triptych redesign

### Runtime touchpoints
- `src/components/ServiceLandingPage.tsx`
- `src/index.css`

### What changed
1. Replaced the dark split-card desktop proof block with a lighter editorial triptych that keeps the same example titles and descriptions already defined in `service-pages.ts`.
2. Moved the desktop section from `proofExamples.slice(1)` to the full `proofExamples` list so the section now reads as a complete three-card gallery instead of a hero sample plus two leftovers.
3. Rebuilt the desktop proof markup around tall image-first cards with staggered vertical rhythm, centered play controls, serif italic headlines, and restrained metadata chips below each card.
4. Swapped the heavy cocoa background for layered linen, teal, and sand gradients drawn from the existing homepage palette tokens in `src/index.css`, so the section now feels native to the live brand system.
5. Left the mobile proof gallery and the service-page wording unchanged; this pass is strictly a desktop visual redesign.

### Verification
1. `npm run build`

## 2026-03-20 desktop visual cadence — backgrounds, accents, and dark closer

### Runtime touchpoints
- `src/components/ServiceLandingPage.tsx`
- `src/index.css`

### What changed
1. Added gradient orbs to the hero section via `::before` and `::after` pseudo-elements on `.st-hero`, creating a subtle warm-teal radial glow in the upper corners instead of a flat white background.
2. Introduced `.st-section--warm` — a warm cream background band (`--warm-sand` gradient) applied to the Brief (D2) and Process (D4) sections, breaking the monotonous white page flow.
3. Added a teal left-accent border on `.st-pullquote` (the large serif editorial intro text) for visual anchoring.
4. Gave `.st-spec-sheet` (deliverables panel) a glass-panel treatment: `backdrop-filter: blur(20px)`, rounded corners, subtle shadow, and a faint `pure-linen/0.6` background.
5. Added hover interactions on `.st-process-block`: the teal accent bar grows from 32px to 48px width, and a warm tint background appears on hover.
6. Converted `.st-close` (CTA closer section) into a dark deep-ebony background with a radial coastal-teal glow behind the CTA button, creating a cinematic closing moment.
7. Added a gradient divider on `.st-faq::before` — a thin line transitioning from `--coastal-teal` to accent, giving the FAQ section a subtle top border.
8. Updated `.st-related-*` classes for dark background compatibility since they now sit below the dark closer section.

### CSS classes added/modified
- `.st-hero::before`, `.st-hero::after` — gradient orbs
- `.st-section--warm` — cream background band
- `.st-pullquote` — teal left border accent
- `.st-spec-sheet` — glass panel treatment
- `.st-process-block` — hover accent bar + tint
- `.st-close` — dark background + teal radial glow
- `.st-faq::before` — gradient divider
- `.st-related-card`, `.st-related-label` — dark-bg compatible colors

### SEO guardrail
This pass added no new headings, did not change heading hierarchy, and did not modify metadata, schema, canonicals, or sitemap behavior.

### Verification
1. `npm run build` — passed
2. Visual verification at 1440×900 across all desktop sections (Hero, Brief, Proof, Process, Filter, FAQ, Close, Related, Footer)

## 2026-03-20 structural asymmetry — kill the template grid

### Direction
The previous pass added decoration (gradient orbs, glass panels, hover tints) to the same symmetric grid layouts. Every section still used equal columns. This pass redesigns the *structure* to create visual tension, hierarchy, and conviction — asymmetric grids, staggered vertical rhythm, oversized watermark typography, and directional CTA layouts.

### Runtime touchpoints
- `src/components/ServiceLandingPage.tsx`
- `src/index.css`

### What changed
1. **Hero split: 80/120 → video dominates.** Changed from `1fr 1fr` to `0.8fr 1.2fr` at ≥1280px. The hero media also bleeds past the container with `margin-right: -4vw`. The video is the product — it gets more space.
2. **Proof gallery: asymmetric triptych.** Card 1 takes `1.15fr`, cards 2+3 take `0.85fr` each. Stagger shifted — card 2 drops 5.5rem, card 3 sits at 1.5rem. Magazine spread, not grid template.
3. **Process: oversized watermark numbers + staggered offsets.** Killed the bordered equal-box grid. Step numbers are now 6.5rem absolutely-positioned watermarks at 4% opacity. Vertical dividers between columns replace the cell borders. Steps 2/3/4 have different `padding-top` values (5rem/2rem/4rem) so they never sit on the same baseline.
4. **Fit section: verdict, not comparison.** "Sí" side takes `1.2fr` (60%) with a teal-tinted card (background, border, padding). "No" side takes `0.8fr` at 65% opacity — visually subordinate. The layout has conviction about who the service is for.
5. **Close section: asymmetric grid.** Desktop uses a `1.3fr 0.7fr` grid — text and CTA left-aligned in column 1, related services in column 2. The teal glow is repositioned to anchor left at 15% instead of centered. No more generic centered-text-on-dark.

### CSS classes modified
- `.st-hero-split` — asymmetric grid columns + new 1280px breakpoint
- `.st-hero-media` — negative right margin bleed
- `.st-proof-gallery` — asymmetric `1.15fr 0.85fr 0.85fr` columns
- `.st-proof-column--1/2/3` — revised stagger offsets
- `.st-process-row` — removed bordered box grid, added vertical dividers
- `.st-process-block` — staggered padding-top per nth-child
- `.st-process-num` — absolutely positioned 6.5rem watermark
- `.st-fit-grid` — asymmetric `1.2fr 0.8fr`
- `.st-fit-yes` — teal-tinted card with border
- `.st-fit-no` — subdued opacity
- `.st-close-inner` — 2-column grid layout on desktop
- `.st-close::before` — glow repositioned left
- `.st-related` — positioned in right grid column

### TSX changes
- Added `className="st-fit-yes"` and `className="st-fit-no"` to the fit grid children

### SEO guardrail
No heading changes, no metadata changes, no schema changes.

### Verification
1. `npm run build` — passed
2. Visual verification at 1440×900 on all 3 service pages (bilingual, spokesperson, ads)
3. Mobile 375×812 confirmed unaffected — separate render path

## 2026-03-20 fit-vs-not-fit "No, si" card design parity

### Problem
The "No, si" column on desktop had `opacity: 0.65` and no card treatment — just bare `padding-top: 2rem`. It looked unfinished compared to the styled "Sí, sí" card on the left.

### Changes (`src/index.css`)
- `.st-fit-no` — replaced `opacity: 0.65` + bare padding with a proper card: subtle neutral background (`foreground/0.03`), `border-radius: 1rem`, `padding: 2rem 2.25rem`, and a light border (`foreground/0.06`). Added dark-mode variant.
- `.st-fit-label--no` — color opacity bumped from `0.35` → `0.55` for readability.
- `.st-fit-item--muted` — color opacity bumped from `0.4` → `0.55`.
- `.st-fit-dash` (neutral dashes) — color opacity bumped from `0.18` → `0.3`.

### Result
Both columns now read as proper cards with distinct personalities — teal-tinted for "yes", warm-neutral for "no" — without the right side looking like an afterthought.

### SEO guardrail
No heading changes, no metadata changes, no schema changes. CSS-only.

### Verification
1. Desktop 1440×900 — both cards visually balanced, inspected computed styles confirmed
2. No console errors related to changes
