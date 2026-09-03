# Service Page Showroom Redesign

## Summary
This is the current UI note for the dedicated service pages. Historical dated sections below still record the March showroom / Screen Test / August continuation / 2026-09-01 app-mobile chips passes. The live INNER (below the cinematic hero) is the 2026-09-02 ficha argument — same document on desktop and mobile, not an app layout.

## Current runtime touchpoints
- `src/components/ServicePageInner.tsx`
- `src/lib/service-inner-argument.ts`
- `src/components/mobile/MobileAppShell.tsx`
- `src/styles/templates.css`
- `src/components/ServiceLandingPage.tsx` (unchanged cinematic hero; mounts the inner + Pedir creativos slab)
- `src/components/Navbar.tsx` (dark overlay at rest over the cinematic hero; lifts on scroll, same as Home)
- `src/data/service-pages.ts`
- `src/data/service-inner-argument.test.tsx`
- `src/components/PageSeo.tsx`
- `scripts/enrich-service-entrypoints.mjs`
- `scripts/expand-boot-shells.mjs`
- All eight ES service boot shells under `servicios/` (not the `/servicios/` hub)
- All eight EN service boot shells under `en/services/` (not the `/en/services/` hub)

## Current state
1. Live on all eight ES+EN service pages. Inner below the unchanged cinematic hero is one argument: **Ficha → Recibes → Cómo corre → Encaja → Preguntas → Empezar**.
2. Desktop = spine + spec table + ruled formatos + 01–04 process + two-col fit + FAQ + black Empezar in the content column (not under the spine).
3. Mobile = the SAME document: spec rows, hairlines, type kicker (`1 · Ficha`), 01–04 process rules, full-bleed 0-radius slab **Pedir creativos**. No chips, no info pills, no rounded cards.
4. The global 4-icon tab bar is HIDDEN on service inner mobile only (`MobileAppShell` + `body:has(.stm-sticky-bar--slab)`). Home / vertical / hub tab bars are unchanged.
5. Hero, H1, routes, copy, and typeface are unchanged. Public brand is Gisela Saldarriaga / Gisela.UGC — never “GiseUGC”.
6. The 2026-09-01 app-layout chips (sticky pills, stacked cards, cyan pill on the tab bar) are superseded by the 2026-09-02 document-mobile pass. Mock lock: `mockup/gise-design/service-inner/D-document-mobile.html` (and PNGs).
7. Top-of-page navbar on all eight ES+EN service landings uses the Home `title-sequence-nav` overlay (dark tokens over the cinematic hero) and switches to the themed frosted bar after 18px of scroll. See `navbar-and-theater-hotfixes.md` (2026-09-02).

## 2026-09-02 Service navbar matches Home overlay

Service pages keep the cinematic hero. The global navbar now uses the same dark overlay-at-rest / frosted-bar-on-scroll treatment as Home, instead of sitting as a light strip on the video.

### What changed
1. `Navbar.tsx` treats `getServicePageIdFromPath` like Home for the `title-sequence-nav` overlay.
2. Inner layout, copy, routes, and the Pedir creativos slab are unchanged.
3. Regression lock: `Navbar.test.tsx` plus the existing service SSR suite (`title-sequence-nav` in first HTML).

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

## 2026-03-30 service hero title line-measurement upgrade

### Runtime touchpoints
- `src/components/ServiceLandingPage.tsx`
- `src/components/motion/PretextLineReveal.tsx`
- `src/index.css`

### What changed
1. Replaced the direct `page.heroTitle` render in both service-page hero variants with the shared `PretextLineReveal` wrapper.
2. The mobile overlay hero (`.stm-hero-title`) and the desktop split hero (`.st-hero-title`) now animate by actual wrapped lines, which better fits the tight serif metrics (`max-width` in `ch`, aggressive tracking, compressed line-height) used in the current showroom design.
3. This keeps the premium display treatment while reducing awkward line stacking on longer Spanish service titles and preserving cleaner rhythm when titles change across locales.

### Verification
1. `npm run build`

## 2026-08-14 service inner continuation (hero untouched)

### Runtime touchpoints
- `src/components/ServiceLandingPage.tsx`
- `src/styles/templates.css`

### What changed
1. Left the cinematic hero and demo rail (`svc-cine-hero`, `stm-hero`, `stm-reel`) untouched.
2. Replaced the leftover inner (essay + spec card, watermark process numbers, fit cards, accordion dump on mobile) with one continuation in homepage language: manifesto statement + market strip, catalog offer rows (always visible), call-sheet process, fit columns, FAQ split, dark close that bookends the hero.
3. Mobile no longer hides the sale inside nested accordions; it uses the same inner, stacked.
4. Copy, routes, schema, and heading sources stay on existing service-page fields.

### Verification
1. `npx tsc -p tsconfig.app.json --noEmit`
2. `npx eslint src/components/ServiceLandingPage.tsx`
3. Hydrated visual check at 1440 and 390 on `/servicios/creadora-ugc-bilingue/`

## 2026-08-15 inner rolled out to every service page

### Runtime touchpoints
- `src/components/ServiceLandingPage.tsx`
- `src/styles/templates.css`
- `src/data/service-pages.ts`

### What changed
1. The shared inner is the layout for all 8 service pages in both locales. Copy, H1, FAQ, related services, and verticals stay unique per page from `service-pages.ts`.
2. SEO: deliverables stay in the HTML (no accordion), process is an `ol`, fit column titles are `h3`, FAQ stays in `details` plus existing FAQPage JSON-LD, and every other service is linked from the explore line.
### Verification
1. `npx tsc -p tsconfig.app.json --noEmit`
2. `npx eslint src/components/ServiceLandingPage.tsx`

## 2026-09-01 inner argument (ficha → empezar) + app mobile

**Ships:** PR #9 `884911426c127f87d06daefdffbfe670b9ae102b`.

Juan Pablo locked the inner body below the unchanged hero. The overlapping intro / markets / types / process essays are one argument on every service.

### Runtime touchpoints
- `src/components/ServiceLandingPage.tsx`
- `src/components/ServicePageInner.tsx`
- `src/lib/service-inner-argument.ts`
- `src/styles/templates.css`
- `src/data/service-inner-argument.test.tsx`
- `scripts/expand-boot-shells.mjs`

### What changed
1. Same skeleton on all eight services (ES+EN): **Ficha → Recibes → Cómo corre → Encaja → Preguntas → Empezar**.
2. Ficha remaps existing `sectionIntroText`, deliverable titles, `marketItems`, `bestFitItems`, and `notFitItems`. No new service was invented. GEO fact stays in Ficha after the spec rows on bilingüe.
3. Desktop: left spine, spec table, 2-col formatos, 4-step process row, two-col fit, FAQ accordion, dark close. Existing type/color tokens only. Hero untouched.
4. Mobile is an app layout, not a squashed desktop: sticky chips, stacked ficha cards, full-width formato tiles, vertical stepper, stacked Sí/No panels, large-tap FAQ cards, fixed bottom CTA (48px) offset above the existing tab bar.
5. “Seguir explorando” is no longer its own sitemap section. Those internal links live inside Empezar. CTA label/href use `primaryCtaLabel` / `primaryCtaHref` (`/#contact` and `/en/#contact`).
6. Copy, FAQ answers, and GEO stay in the SSR HTML (`details` keeps answers in the DOM). Heading outline is one hire-intent H1 in the mobile hero; the desktop visual title is the same copy as a `<p>` so the document does not ship a second H1.
7. Language switch in the navbar is a real `<a href>` to the path-owned twin (`/` vs `/en/…`), not a JS-only button.

### Verification
1. `npx vitest run src/data/service-inner-argument.test.tsx src/data/geo-copy.test.tsx src/data/crawl-trust.test.tsx`
2. `npx tsc -p tsconfig.app.json --noEmit`
3. Browser check at desktop and 390 on `/servicios/creadora-ugc-bilingue/` and an EN twin.

## 2026-09-01 Gise SEO lock (first HTML)

Non-negotiable crawl constraints folded into this inner-argument pass:

- Inner copy (Ficha / Recibes / Cómo / Encaja / Preguntas / Empezar) lives in SSR, prerender `#root`, and boot-shell `.boot-expanded` — not comments, not `useEffect`, not behind a click that removes it from the DOM.
- Routes, hubs, and locale paths are unchanged. `hreflang` es + en + x-default stays on the ES URL.
- One H1 per service page (hire-intent, URL language). Inner beats start at H2.
- Per-page title / description / canonical / OG stay. Public brand is Gisela Saldarriaga / Gisela.UGC.
- GEO + 4.8/173 + query-free Fiverr href stay on bilingüe (and the `/servicios/` hub twin), not pasted onto every service. English FAQ keeps script + 65-word cap.
- Visible last-updated follows `CONTENT_DATES.services` (31 ago 2026 / Aug 31, 2026).
- `prebuild` runs `enrich-service-entrypoints` then `expand-boot-shells` so FAQ schema updates cannot strip `.boot-ficha` CSS.
- Navbar language switch is real hrefs. CTA hrefs remain `/#contact` and `/en/#contact`.

## 2026-09-01 Empezar clip + light-theme labels

**Ships:** PR #10 `7d1141aed29cb5135f1bc623ccfeb90a6f5853dd`.

Do not revert the inner argument. Do not change URLs, H1, or hero. Do not restore display serif on inner H2s.

1. Empezar black band stays in the content column to the right of the sticky spine. Copy, TAMBIÉN OFREZCO, and the 3 explore columns share one padded shell (`.svc-inner-close-shell`). The explore row is its own 3-col grid with `align-items: start` — not a third item in a 2-col `align-items: end` grid (that stair-stepped POR INDUSTRIA / RECURSOS / MÁS SERVICIOS and pulled the left column under the spine).
2. Mobile: extra space under the in-page close CTA so it clears the fixed Pedir creativos bar.
3. Light theme: kickers, ficha row labels, and inactive spine links use near-ink opacities (AA on cream). Active spine stays full foreground.
4. SEO follow-up in the same ship: `#route-data` has no `[gisela_sm](` markdown; `AggregateRating` 4.8/173 on bilingüe + `/servicios/` ES+EN only.

## 2026-09-02 service inner mobile = document

**Ships:** PR #12 `0afd07dbded52b117cd0883590881128865de8e0`.

Juan Pablo rejected chips, info pills, and rounded cards on service INNER mobile. Ship the same document as desktop, on the phone. Do not wait.

**Mock lock:** `mockup/gise-design/service-inner/D-document-mobile.html` (and PNGs).

The 2026-09-01 app-layout chips (sticky pills, stacked ficha cards, formato tiles, numbered circles, cyan Pedir creativos stacked on the tab bar) are superseded by this pass.

### Runtime touchpoints
- `src/components/ServicePageInner.tsx`
- `src/components/ServiceLandingPage.tsx`
- `src/components/mobile/MobileAppShell.tsx`
- `src/styles/templates.css`
- `src/data/service-inner-argument.test.tsx`

### What changed
1. Deleted the sticky chip/pill nav. Index is the section kicker in type (`1 · Ficha`), sticky as text.
2. Ficha is spec rows (label then value, hairlines). Recibes is a ruled list. Process is `01`–`04` type with a 2px top rule, not numbered circles. Encaja is two stacked ruled lists. FAQ is hairline `<details>`.
3. No rounded cards, tiles, or 16px radius panels on the inner. Empezar stays the black/ink close band (0-radius).
4. One chrome for Pedir creativos on these pages: full-bleed 0-radius ink slab. The global 4-icon tab bar is hidden on service inner mobile (`:has(.stm-sticky-bar--slab)` + `MobileAppShell`). Vertical/hub/home tab bar is unchanged.
5. Desktop inner (spine + spec table + 4-col process + black Empezar band) is untouched. Hero, H1, routes, copy, FAQ answers, typeface, PAGE_REGISTRY / sitemap / llms.txt unchanged.

### Verification
1. `npx vitest run src/data/service-inner-argument.test.tsx`

## 2026-09-02 service inner mobile in beats ("A · Ritmo") + neutral ink plate

**Status:** Live on main. Supersedes the flat-document pass above *only* in
surface treatment — the document itself (type kickers, spec rows, hairlines, no
cards, ink slab CTA) is kept and extended, not reverted.

**Design lock:** artifact "Servicios móvil · explicación", page `A · Ritmo`
(claro + oscuro artboards). Direction picked by Juan Pablo out of four
(A Ritmo / B Ficha / C Deck / D Cinta).

Juan Pablo's report: after the hero, the explanation section was heavy to read
on mobile. Diagnosis, in the order the problems mattered:

1. **Everything had the same visual weight.** Six beats, one uninterrupted
   column, ~1.400 words, no surface change and no rest between sections.
2. **`buildServiceFicha` turned lists into paragraphs.** It `join()`s
   `deliverables`, `marketItems`, `bestFitItems` and `notFitItems` into one
   string per row, so three of the five ficha rows rendered as text blobs.
3. **The ficha repeated Encaja verbatim.** `Sirve si` / `No sirve si` appeared
   in full in beat 1 and again in full in beat 4, a screen apart.

### Runtime touchpoints
- `src/lib/service-inner-argument.ts` — new `buildMobileFicha`
- `src/components/ServicePageInner.tsx`
- `src/styles/templates.css`
- `src/index.css` — new `--ink-plate` token
- `src/data/service-inner-argument.test.tsx`

### What changed

1. **Each beat owns a full-bleed surface**, so the section reads as a sequence
   of slabs. Light: linen → ink `#2B2B2B` → sand → linen → grey → linen (with
   the ink CTA slab inside the last one).
2. **Dark is designed, not derived.** The light rhythm leans on large lightness
   jumps that would blind on a dark page, so `.dark .stm-walk` redeclares the
   whole surface set on the token elevation ladder — `--card #151923` →
   `--background #0F121A` → `--secondary #212531` — and every beat boundary gets
   a 1px `--border` hairline, because those steps are too subtle to read alone.
   Warmth moves from the surfaces (the dark palette is cool, hue 222) to the
   ink: `--accent` on kickers, numerals and bullets, `--muted-foreground` on
   body. No pure white anywhere.
3. **The beat numeral** is set in Cormorant at 4.75rem, low-contrast, in the
   top-right corner. `.stm-beat-title` carries `padding-right: 5rem` so a
   two-line heading cannot run through it.
4. **Ficha values stay lists.** `buildMobileFicha` returns `{ lead, rows }`:
   the intro is a paragraph, `Qué pides` is chips (`.stm-ficha-chip`), and
   `Mercados y formatos` is a bulleted list. The desktop `buildServiceFicha` is
   untouched, so the desktop spec table is unchanged.
5. **The duplication is gone.** The mobile ficha drops the `fits` / `not` rows;
   Encaja owns that copy. Locked by test.
6. **Process is a timeline** — a 1px rail with a filled first dot — replacing
   the stacked 2px top rules. `01`–`04` type is kept.
7. **Encaja marks differ by shape, not tint**: drawn check on the yes list, dash
   on the no list, no filled panels.
8. **`--ink-plate`.** `6c1f129` moved 32 dark surfaces to `--ink-surface`, but
   `.stm-close` and `.stm-sticky-bar--slab` landed on the parallel PR #12 branch
   and stayed on `hsl(var(--foreground))` — still the old brown. They cannot
   point at `--ink-surface` directly, because in dark those plates invert to
   linen. So `--ink-plate` is `var(--ink-surface)` at `:root` and
   `var(--foreground)` in `.dark`; both plates use it and keep
   `color: hsl(var(--background))`.

### Three implementation traps worth remembering

1. **Tailwind purged five of six surface rules.** The beat modifier was built as
   `` `stm-beat--${id}` ``. Component classes live in `@layer components`, so
   Tailwind drops any rule whose class name is not a literal string in the
   content globs. It fails silently — correct DOM, no CSS. Only
   `.stm-beat--recibes` survived, and only because that exact string happened to
   be written in the test file. Fixed with the static `MOBILE_BEAT_CLASS` map.
   **Never build a `@layer components` class name by interpolation.**
2. **Headings on the ink slab measured contrast 1.0 — invisible.** The global
   `h2:not(.section-label):not(.type-brand-display):not(.font-serif)` rule in
   `index.css` is (0,3,1) and paints every heading `--foreground`; the component
   override was (0,2,0) and lost. Paragraphs were unaffected, so the symptom was
   "the body copy inverts but the headings don't". Per that rule's own comment,
   the exception is marked on the component and carried to (0,4,1). The same
   latent bug was fixed on `.stm-close-title`.
3. **The sticky kicker painted a visible band** over the sand and grey slabs:
   it draws `--stm-beat-bg` on top of the slab, so a translucent surface stacked
   with itself. Those two surfaces are now `color-mix(...)`, opaque.

### Verification

Chrome here cannot take its viewport under 768px and the Browser pane keeps the
document `hidden`, so the mobile shell mounts in neither. Verified instead by
compiling `templates.css` with the Tailwind CLI, rendering the section with
`renderToStaticMarkup`, and reading `getComputedStyle` in both themes — not from
screenshots, which misplace sticky layers after a programmatic scroll.

Measured contrast, foreground against each beat's composited surface:

| | claro | oscuro |
| --- | --- | --- |
| Ficha (H2 + lead) | 13.9 | 15.2 |
| Recibes (H2 / H3 / body) | 13.8 / 13.8 / 13.8 | 16.2 / 16.2 / 9.5 |
| Cómo corre | 9.1 | 13.2 |
| Preguntas | 12.8 | 16.2 |
| Empezar (título + CTA) | 13.8 / 13.9 | 16.2 / 16.2 |

```bash
npm run typecheck && npm test
```

166 tests pass. `service-inner-argument.test.tsx` gained a `buildMobileFicha`
lock (values stay lists; `bestFitItems` / `notFitItems` absent) and its
presentation lock now asserts the timeline rail, the per-beat surfaces and the
`.dark .stm-walk` block. The stale `border-top: 2px solid hsl(var(--foreground))`
assertion was replaced — that was the stepper rule the timeline supersedes.

### Kept from the pass above, deliberately

- **No sticky chip nav.** It was scaffolding from the pre-PR#12 page, not part
  of direction A. The per-beat sticky kicker does that job.
- Desktop inner untouched: spine, spec table via `buildServiceFicha`, 4-col
  process, black Empezar band.
- Hero, H1, routes, copy, FAQ answers, `CONTENT_DATES`, schema, boot shells and
  the `:has(.stm-sticky-bar--slab)` tab-bar rule are all unchanged.

## 2026-09-02b Empezar rebuilt, sticky CTA replaced by the tab bar

Juan Pablo, on the live build: "until 5 it is great, number 6 is crooked. Lets
redesign this part and lets bring back the navigation menu rather than Pedir
creativos."

Beats 1–5 stay exactly as shipped above. Three things were wrong with beat 6:

1. **A 0-radius full-width CTA inside a full-bleed ink slab** read as a white
   band cutting the section in half — not a button.
2. **Every link list lived inside the ink.** TAMBIÉN OFREZCO + the three explore
   columns turned the close into an endless dark tail.
3. **Two "Pedir creativos" on one screen** — the in-slab CTA and the fixed
   sticky slab bar.

**What changed**

- `.stm-close` is a **contained card** now: `1.15rem` radius, inset by the beat's
  own padding, on `--ink-plate`. It holds only the pitch — kicker, title, text,
  CTA, updated.
- The CTA is a real button inside that card (`0.7rem` radius, full width), so it
  reads as an action rather than a band.
- **All link lists moved out onto the page surface** below the card, as
  `.stm-close-nav` / `.stm-nav-group` / `.stm-nav-label` / `.stm-nav-link`.
  Navigation reads as navigation on light ground, and the ink stops running.
- **The sticky `.stm-sticky-bar--slab` is gone from service inner**, and with it
  the two things that suppressed the global mobile tab bar:
  `body:has(.stm-sticky-bar--slab) .mtabbar { display: none }` in
  `templates.css`, and `hidden={contactOpen || onServiceInner}` in
  `MobileAppShell.tsx`. The tab bar (Inicio / Portafolio / Servicios /
  Contacto) is the navigation on these pages again, exactly as on every other
  mobile route. This reverses point 4 of the 2026-09-02 document pass.
- `.stm-walk` bottom padding drops `6.5rem → 2.5rem`: that clearance existed for
  the sticky CTA, and `body` already reserves `--app-dock-clearance` for the tab
  bar.
- The base `.stm-sticky-bar` / `.stm-sticky-btn` rules **stay** — `VerticalLandingPage`
  still uses them for its WhatsApp bar. Only the `--slab` variant was removed.
- The desktop close branch was de-ternaried: it no longer carries unreachable
  `isMobile ? 'stm-close-*' : ...` strings now that mobile has its own branch.

**Contrast**, card against its own surface: light 13.8 (title) / 13.9 (CTA) /
12.8 (nav links); dark 16.2 / 16.2 / 15.2. In dark the card inverts to linen with
a dark button, which is `--ink-plate` doing its job.

**Locks updated:** `stm-sticky-bar` must now be *absent* from service-page HTML,
`.stm-sticky-bar--slab` and the `:has()` tab-bar rule absent from CSS,
`stm-close-nav` / `stm-nav-link` present, and `.stm-close` must carry
`border-radius: 1.15rem`. 169 tests pass.
