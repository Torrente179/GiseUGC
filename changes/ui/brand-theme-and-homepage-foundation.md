# Brand, Theme, and Homepage Foundation

## Summary
This condenses the February homepage rebuild that established the current visual and motion foundation. The site moved from the early Cafe Quindio-inspired experiment into the premium bilingual landing-page system that later UI work refined: updated typography, refined palette tokens, stronger hero hierarchy, full-bleed services motion, better testimonial behavior, and a more explicit light/dark theme baseline.

## Current runtime touchpoints
- `index.html`
- `src/index.css`
- `src/main.tsx`
- `src/components/Hero.tsx`
- `src/components/HeroIntroduction.tsx`
- `src/components/Navbar.tsx`
- `src/components/Services.tsx`
- `src/components/ServicesMarquee.tsx`
- `src/components/SocialProof.tsx`
- `src/components/Testimonials.tsx`

## Consolidated outcomes
1. Brand direction iterated quickly from a warm Cafe Quindio look into the Nordic/luxe and mauve/charcoal system that current CSS variables, hero treatments, and glass surfaces still build on.
2. The hero area was repeatedly tightened: copy hierarchy, name treatment, chip styling, intro ordering, mobile services-grid support, and section spacing were all normalized so later CTA and SEO work had a stable frame.
3. The services marquee evolved from several carousel experiments into the transform-driven, full-width, autoplaying baseline that later received March smoothness tuning instead of another redesign.
4. Social proof and testimonials gained swipe support and lighter mobile chrome, reducing clutter while keeping the premium presentation.
5. Animation work moved from flicker-prone title reveals into the current split-text and motion baseline, while several PageSpeed passes reduced the cost of above-the-fold media and section reveals.
6. Theme behavior matured into a deliberate light/dark system with improved dark palette tokens and system-theme detection.

## Notes on superseded details
- Several same-day palette and typography notes were intermediate experiments, not separate long-lived systems.
- Detailed reel/theater work from the same period is tracked in the video archive instead of this homepage-focused summary.
- Later motion polish is tracked in `changes/ui/homepage-ux-conversion-and-motion.md`.

## Legacy notes absorbed
- `2026-02-10-cafe-quindio-rebrand.md`
- `2026-02-11.md`
- `2026-02-11-carousel-infinite-right-fix.md`
- `2026-02-11-carousel-transform-based-infinite.md`
- `2026-02-11-collage-and-carousel-refinement.md`
- `2026-02-11-full-bleed-services-carousel.md`
- `2026-02-11-fullwidth-infinite-carousel.md`
- `2026-02-11-glass-navigation-navbar.md`
- `2026-02-11-heading-typography-sans-modernization.md`
- `2026-02-11-hero-chips-design-update.md`
- `2026-02-11-hero-intro-carousel-reorder.md`
- `2026-02-11-hero-luxury-reimagining.md`
- `2026-02-11-hide-testimonial-arrows-mobile.md`
- `2026-02-11-infinite-carousel-autoplay-fix.md`
- `2026-02-11-layout-distribution-nordic-reimagining.md`
- `2026-02-11-mauve-charcoal-prestige-palette.md`
- `2026-02-11-mobile-services-grid-hero-refinement.md`
- `2026-02-11-nordic-femme-luxe-palette.md`
- `2026-02-11-nordic-luxe-color-palette.md`
- `2026-02-11-nordic-prestige-font-system.md`
- `2026-02-11-reduce-section-whitespace.md`
- `2026-02-11-social-proof-luxury-reimagining.md`
- `2026-02-11-testimonials-mobile-swipe.md`
- `2026-02-12-fix-animation-flickering-and-title-reveal.md`
- `2026-02-12-framer-motion-premium-animations.md`
- `2026-02-12-hero-animation-restoration-performance-first.md`
- `2026-02-12-mobile-fcp-lcp-optimization-pass-3.md`
- `2026-02-12-mobile-pagespeed-optimization-hero-animations.md`
- `2026-02-12-pagespeed-performance-optimization.md`
- `2026-02-12-pagespeed-performance-optimization-pass-2.md`
- `2026-02-12-title-reveal-reliability-and-motion-polish.md`
- `2026-02-17-services-marquee-mobile-swipe-and-speed.md`
- `2026-02-18-dark-theme-night-palette.md`
- `2026-02-18-system-theme-detection.md`

## 2026-03-17 creator-economy typography refresh

### Runtime touchpoints in this pass
- `tailwind.config.ts`
- `src/index.css`
- `src/components/Hero.tsx`
- `src/components/ServiceLandingPage.tsx`
- `index.html`
- `en/index.html`
- `servicios/creadora-ugc-bilingue/index.html`
- `servicios/videos-de-portavoz/index.html`
- `servicios/ugc-ads-tiktok-meta/index.html`
- `en/services/bilingual-ugc-creator/index.html`
- `en/services/spokesperson-videos/index.html`
- `en/services/ugc-ads-tiktok-meta/index.html`
- `scripts/enrich-service-entrypoints.mjs`

### What changed
1. The heading system moved from `DM Serif Display` to `Cormorant Garamond` while body and supporting copy stayed on `DM Sans`, shifting the site toward a more luxurious beauty/editorial direction without redesigning page structure.
2. Shared display metrics were retuned for the new serif rhythm so the homepage hero, service-page hero, footer branding, FAQ headings, and other large editorial moments keep a softer premium cadence instead of the earlier display-grotesk feel.
3. The remaining one-off `Outfit` body exception in the homepage hero was removed so the live UI now uses a tighter, more consistent two-family system while preserving the existing `Alex Brush` accent treatment.
4. Both localized homepage shells and all six static service entrypoints were updated to load the same heading font for first paint and non-JS crawler-visible HTML, keeping the visual system consistent before hydration.
5. The service-entrypoint enrichment script was updated to preserve the new heading font inside regenerated noscript FAQ blocks instead of reintroducing the old serif on future builds.

### SEO guardrail
1. This pass changed font loading and typography declarations only.
2. Metadata, canonicals, hreflang, robots, sitemap, llms, JSON-LD, FAQ content, and route-level SEO wiring were intentionally left unchanged.

## 2026-03-30 line-aware display headline pass

### Runtime touchpoints in this pass
- `package.json`
- `package-lock.json`
- `src/components/motion/PretextLineReveal.tsx`
- `src/components/Hero.tsx`
- `src/components/HeroIntroduction.tsx`
- `src/components/CreatorAdvantage.tsx`
- `src/components/LegalPage.tsx`
- `src/index.css`

### What changed
1. Added `@chenglou/pretext` and introduced a shared `PretextLineReveal` wrapper that derives the active font, line-height, and measured width from the live DOM, then animates real wrapped lines instead of guessing with word-by-word spans.
2. Swapped the homepage intro headline, the secondary intro headline, and the creator-advantage collage title onto the new line-aware renderer so long editorial copy keeps cleaner wraps and more deliberate reveal motion.
3. Applied the same treatment to legal-page H1s, keeping the narrow, high-contrast display typography but reducing awkward line breaks when titles run long in either locale.
4. Kept the existing `LiteSplitTextReveal` for the hero name lockup, since that treatment is effectively single-line branding and does not benefit from the extra line-measurement overhead.

### Safeguards
1. The shared wrapper remeasures on resize and after web-font loading, so line decisions stay synced with the actual `Cormorant Garamond` and `DM Sans` runtime typography instead of freezing on fallback metrics.
2. Reduced-motion users fall back to static visible lines, preserving readability without animation.
3. The change stays scoped to premium display headings only; body copy, cards, buttons, and utility labels still rely on native browser layout.

## 2026-06-03 premium typography split (brand vs marketing)

### Runtime touchpoints in this pass
- `src/index.css`
- `tailwind.config.ts`
- `index.html`, `en/index.html`
- `servicios/*/index.html`, `en/services/*/index.html`
- `src/components/Hero.tsx`
- `src/components/HeroIntroduction.tsx`
- `src/components/Portfolio.tsx`
- `src/components/ServicesMarquee.tsx`
- `src/components/CreatorAdvantage.tsx`
- `src/components/Services.tsx`
- `src/components/FAQ.tsx`
- `src/components/SocialProof.tsx`
- `src/components/LegalPage.tsx`
- `src/components/ResourcePage.tsx`
- `src/components/Contact.tsx`

### What changed
1. Introduced a three-tier font system: `--font-brand` (Cormorant Garamond), `--font-marketing` (DM Sans), and `--font-sans` (DM Sans body/UI).
2. Added `.type-brand-display` and `.type-marketing-display` utilities; global `h1–h6` now default to marketing sans (600 weight, looser line-height) instead of display serif.
3. **Preserved on Cormorant (must keep `font-serif` + original Tailwind sizes):** hero name lockup (`Gisela` / `Saldarriaga`), navbar `.brand-logo` (`Gise.UGC`), portfolio `Historias que` / `Convierten`, toolkit headline *El toolkit completo para anunciantes* with `.luxury-accent` on “modernos”. These must not receive global marketing `h1–h6` font-family or clamped font-size rules.
4. **Moved to marketing sans:** service/vertical `.st-hero-title` / `.stm-hero-title`, collage funnel title, `.studio-title` sections, intro H2s, FAQ/legal/resource headings, and static `.boot-title` SEO shells.
5. Relaxed service hero metrics (`max-width` ~22ch, `line-height` 1.08, weight 600) so long Spanish SEO lines no longer read as tight luxury captions.
6. Removed dead **Alex Brush** from font URLs; boot-shell `Saldarriaga` accent now uses Cormorant italic to match the live hero.

### SEO guardrail
1. Typography and font-loading only — no metadata, schema, or route copy changes.

### Verification
1. `npm run build`

## 2026-06-03 marketing type scale proportion pass

### What changed
1. Added `--type-section`, `--type-hero`, `--type-hero-mobile`, and `--type-lead` tokens so marketing copy scales consistently instead of jumping to 3–5rem.
2. Section titles (`.studio-title`) now cap near **2rem**; service heroes use **~1.75–2.375rem**; mobile service H1 no longer uses `7.5vw` (which blew up on phones).
3. `.st-pullquote` / `.stm-quote` dropped to lead size (~17–19px) with normal weight so intro paragraphs read as supporting copy, not secondary heroes.
4. Removed oversized Tailwind overrides on FAQ, hero intro, legal, and service card headings.

### Verification
1. `npm run build`

## 2026-06-03 toolkit card label regression fix

**Commit:** `e5605a7` (bundled with page end strip)

### Problem
The marketing type pass applied global `h3` font-size clamps to every `h3`, including the marquee service cards that use `h3.section-label` for the small uppercase titles under each video (e.g. “UGC Ads”). Those labels jumped from **10px** uppercase to ~18–22px and read like secondary headlines.

### What changed
1. `src/index.css` — global heading selectors now exclude `.section-label`; `h3.section-label` (and `h1–h6.section-label`) are pinned back to the label system: `font-sans`, `10px`, uppercase, accent color.
2. `ServicesMarquee.tsx` — card titles unchanged in markup (`h3.section-label text-foreground/80`); fix is CSS-only.

### Verification
1. Visual check: toolkit marquee card captions stay small caps under posters; main toolkit headline remains large serif.

## 2026-06-03 preserved brand lockup restore

**Commit:** `2e11812` — `fix(typography): restore preserved brand lockup headlines`

### Problem
After the typography split, four intentional Cormorant lockups were wrong on the live site:
1. Global `h1–h6:not(.section-label)` set `font-family: var(--font-marketing)` with **higher specificity** than `.type-brand-display`, so preserved titles rendered in **DM Sans**.
2. `.type-brand-display` forced `font-weight: 700` on the whole hero `h1`, breaking the **`font-light italic`** line on “Saldarriaga”.
3. Preserved headings without `.type-brand-display` still inherited marketing **font-size tokens** (`--type-hero`, `--type-section`, `h3` clamp), overriding Tailwind scale classes on hero, portfolio, and toolkit headlines.

### What changed
1. **Components** — Restored pre-split class strings:
   - `Hero.tsx`: `font-serif text-foreground` + original `text-[15vw] sm:text-[5.5rem] lg:text-[7rem] xl:text-[8.5rem]`
   - `Portfolio.tsx`: `font-serif text-foreground` + `text-5xl md:text-7xl lg:text-[5.5rem]`
   - `ServicesMarquee.tsx` (mobile + desktop toolkit `h3`): `font-serif text-foreground` + original `text-3xl` / `md:text-5xl` stack
2. **`index.css`** — Marketing font/size rules exclude `.font-serif` and `.type-brand-display`; explicit `h1–h3.font-serif` (and `h*.type-brand-display`) lock `font-family` to `--font-brand`. Removed `font-weight: 700` from `.type-brand-display` so child spans can set weight. **`.brand-logo` left on its own rule** (primary/accent color from navbar classes unchanged).

### Preserved lockup checklist (do not change without explicit approval)
| Surface | Element | Font | Notes |
|--------|---------|------|--------|
| Hero | `h1` Gisela / Saldarriaga | Cormorant (`font-serif`) | Second line stays `font-light italic` |
| Navbar | `.brand-logo` | Cormorant | `Gise.UGC`, accent color via `text-accent` |
| Portfolio | `h2` Historias / Convierten | Cormorant | “Convierten” keeps `.luxury-accent` |
| Toolkit | `h3` El toolkit completo… | Cormorant | “modernos” keeps `.luxury-accent` |
| Toolkit cards | `h3.section-label` | DM Sans 10px | Not a display headline |

### Verification
1. `npm run build`
2. Visual: hero name, portfolio section title, toolkit main headline, and navbar wordmark all in Cormorant at pre-split sizes; card labels under marquee remain small caps.
