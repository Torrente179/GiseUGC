# Homepage UX, Conversion, and Motion

## Summary
This is the current homepage-facing UI note. It consolidates the review-card system, FAQ launch, CTA routing, theme defaults, marquee smoothness, testimonial screenshot integration, and the later motion-polish passes that shaped the current landing page.

## Current runtime touchpoints
- `src/App.tsx`
- `src/pages/Index.tsx`
- `src/components/Hero.tsx`
- `src/components/Footer.tsx`
- `src/components/FAQ.tsx`
- `src/components/FiverrRatingCard.tsx`
- `src/components/DesktopFiverrRatingSection.tsx`
- `src/components/MobileFiverrRatingSection.tsx`
- `src/components/ServicesMarquee.tsx`
- `src/components/Testimonials.tsx`
- `src/components/Portfolio.tsx`
- `src/components/motion/SplitTextReveal.tsx`
- `src/index.css`
- `src/main.tsx`

## Current state
1. FAQ content is live in the page and tied to schema-supporting copy rather than staying only in metadata files.
2. Review-card placement, width, palette, dark-mode variants, and star alignment were tuned together so the Fiverr proof block now behaves as one system across desktop and mobile.
3. Mobile CTAs now cooperate with the floating dock instead of fighting it, and the contact button placement lines up with the testimonial and FAQ flow.
4. Services marquee behavior was tuned for smoother mobile interaction, more stable loop toggling, better resize handling, and cleaner supporting copy.
5. Motion polish continued without reworking the brand direction: transition timing, split-text smoothing, scroll interpolation, and desktop collage eager-loading were all optimized in place.
6. Theme handling now defaults to light with manual dark override, while footer copy and the hero-title treatment were restored to the intended presentation.

## Legacy notes absorbed
- `2026-03-04-animation-transition-polish.md`
- `2026-03-04-desktop-review-card-placement-match-mobile.md`
- `2026-03-04-desktop-review-card-width-tuning.md`
- `2026-03-04-desktop-services-position-below-creator-advantage.md`
- `2026-03-04-faq-conversational-rewrite.md`
- `2026-03-04-faq-frontend-section.md`
- `2026-03-04-footer-desktop-hide-review-card-and-center-header-social.md`
- `2026-03-04-footer-es-subtitle-restore.md`
- `2026-03-04-light-theme-default-manual-dark-toggle.md`
- `2026-03-04-mobile-carousel-resize-reset-fix.md`
- `2026-03-04-mobile-contact-button-placement-between-testimonials-and-faq.md`
- `2026-03-04-mobile-cta-bubble-and-dock-persistence.md`
- `2026-03-04-mobile-cta-toggle-and-rating-card-placement.md`
- `2026-03-04-mobile-hamburger-immediate-transparency-transition.md`
- `2026-03-04-mobile-marquee-scroll-and-fast-start-hotfix.md`
- `2026-03-04-mobile-smoothness-stabilization-pass.md`
- `2026-03-04-rating-breakdown-stars-placement-fix.md`
- `2026-03-04-review-card-dark-theme-variants.md`
- `2026-03-04-review-card-palette-color-refresh-and-faq-background.md`
- `2026-03-04-services-marquee-loop-toggle-and-mobile-smoothness.md`
- `2026-03-04-services-motionsubtitle-natural-rewrite.md`
- `2026-03-04-testimonials-real-screenshots-integration.md`
- `2026-03-07-desktop-scroll-and-collage-eager-load.md`
- `2026-03-07-hero-name-title-restore.md`
- `2026-03-07-motion-smoothing-and-buttery-scroll-pass.md`

## 2026-03-13 SEO-driven section-loading adjustment

### What changed
1. The text-heavy supporting sections most useful to crawlers and answer engines now mount immediately instead of waiting behind deferred-loading skeletons.
2. Mobile now renders the hero introduction, services, FAQ, and footer directly; desktop now renders social proof, services, FAQ, and footer directly.
3. Heavier media sections such as portfolio, testimonials, rating cards, and the services marquee remain deferred so the SEO gain does not turn into a full homepage performance regression.

## 2026-03-13 Desktop smoothness pass

### What changed
1. Removed the global Lenis mount so desktop returns to native scrolling instead of layering virtual scroll interpolation on top of an already media-heavy homepage.
2. Simplified the navbar scroll behavior from per-frame glass interpolation to a binary scrolled/unscrolled state, cutting repeated `backdrop-filter`, padding, border, and shadow mutation work during scroll.
3. Reduced desktop playback pressure in the portfolio by stopping always-on reel-card autoplay and making the desktop collage videos play on hover instead of decoding continuously while the section sits onscreen.
4. Re-ran the mobile regression guardrail after the scroll/runtime change and refreshed the checklist below for follow-up manual Safari validation.

## Mobile Regression Checklist

Generated at: `2026-03-13T13:12:09.537Z`

### Automated checks
- ✅ Targeted lint
- ✅ Production build

### Manual device checks (iPhone Safari)
- [ ] Horizontal drag moves carousel left/right without jumping back to start.
- [ ] Vertical page scroll works naturally when swiping over carousel area.
- [ ] Tapping a card pauses/expands that card without resetting track position.
- [ ] Tapping outside card closes expanded state and auto-scroll resumes smoothly.
- [ ] Offscreen -> back onscreen transition resumes movement without visible snap.

### Notes
- Device/OS:
- Browser version:
- Repro video/screenshot path (if any):
- Additional observations:
