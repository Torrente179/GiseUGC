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
