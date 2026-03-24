# Homepage UX, Conversion, and Motion

## Summary
This is the current homepage-facing UI note. It consolidates the review-card system, FAQ launch, CTA routing, theme behavior, marquee smoothness, testimonial screenshot integration, and the later motion-polish passes that shaped the current landing page.

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
- `src/components/ThemeToggle.tsx`
- `src/components/ThemeRuntimeSync.tsx`
- `src/components/ui/sonner.tsx`
- `src/components/motion/SplitTextReveal.tsx`
- `src/index.css`
- `src/main.tsx`
- `index.html`

## Current state
1. FAQ content is live in the page and tied to schema-supporting copy rather than staying only in metadata files.
2. Review-card placement, width, palette, dark-mode variants, and star alignment were tuned together so the Fiverr proof block now behaves as one system across desktop and mobile.
3. Mobile CTAs now cooperate with the floating dock instead of fighting it, and the contact button placement lines up with the testimonial and FAQ flow.
4. Services marquee behavior was tuned for smoother mobile interaction, more stable loop toggling, better resize handling, and cleaner supporting copy.
5. Motion polish continued without reworking the brand direction: transition timing, split-text smoothing, scroll interpolation, and desktop collage eager-loading were all optimized in place.
6. Theme handling now follows the device preference by default, still allows manual light/dark override, and keeps browser chrome surfaces synced through `color-scheme` and `theme-color`.

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

Generated at: `2026-03-20T18:38:23.762Z`

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

## 2026-03-13 service-page routing and internal-linking pass

### What changed
1. The homepage service grid now links each card to a dedicated localized landing page instead of trapping all intent on the homepage.
2. Footer link groups now expose the three main service pages in both languages, giving users and crawlers a stable internal-link path to deeper service content.
3. Navbar language switching now preserves the current route when possible, so `/servicios/...` maps to `/en/services/...` instead of dropping the user back on the homepage.
4. The shared 404 screen now returns users to the correct localized homepage instead of always forcing Spanish root.

## 2026-03-13 portfolio autoplay restoration

### What changed
1. Restored desktop reel-card autoplay after the smoothness pass made the portfolio feel visually broken and removed the motion users expected from the section.
2. Restored desktop collage autoplay so the collage returns to ambient motion while onscreen instead of staying paused until hover.
3. Kept the other desktop smoothness changes in place; this rollback only targets the portfolio playback tradeoff that regressed the experience.

## 2026-03-14 hero introduction title rebalance

### What changed
1. Rebalanced the desktop hero-introduction grid so the left headline column gets more width and the supporting paragraph stops dominating the row.
2. Trimmed the desktop intro headline sizing just enough to keep the SEO-updated copy reading like a designed title instead of collapsing into an awkward vertical stack.
3. Tightened the intro paragraph width and top offset so the pair feels intentional again instead of leaving a tall title next to a wide, floating description block.

## 2026-03-15 hero introduction headline rollback

### What changed
1. Replaced the SEO-heavy visible intro headline with the shorter editorial version that fits the intended premium presentation.
2. Scaled the desktop intro headline back down and relaxed the forced line length so the section reads like a designed title instead of a stacked keyword block.
3. Kept the service-intent detail in the supporting paragraph, metadata, FAQ, and service pages instead of forcing the H2 to do every SEO job at once.

## 2026-03-17 homepage FAQ readability correction

### What changed
1. The homepage FAQ question rows now explicitly use the sans stack instead of relying on inherited typography.
2. FAQ answers were also pinned to the same sans stack so the accordion reads consistently once opened.
3. This change stayed scoped to the homepage FAQ component shown on the main landing page; the separate service-page FAQ treatment remains tracked in the service-page UI note.

## 2026-03-17 homepage FAQ typography rebalance

### What changed
1. Restored the homepage FAQ questions to the serif display stack after the full sans override flattened the section too much.
2. Increased the question size and weight and tightened the line-height so the Cormorant treatment stays legible instead of feeling thin.
3. Kept the FAQ answers on the sans stack, preserving cleaner paragraph readability once each accordion item opens.

## 2026-03-17 homepage FAQ mobile-size trim

### What changed
1. Reduced the mobile FAQ question size slightly so longer Cormorant questions stop feeling oversized on narrow screens.
2. Left the desktop FAQ question size unchanged, since the larger serif treatment was already reading correctly there.

## 2026-03-18 homepage FAQ desktop-size trim

### What changed
1. Reduced the desktop FAQ question size a bit so the accordion feels less oversized on larger screens.
2. Kept the mobile size and overall FAQ structure unchanged, so the tweak stays focused on desktop readability only.

## 2026-03-18 homepage FAQ desktop-size second trim

### What changed
1. Reduced the desktop FAQ question size a little further because the previous pass was still reading too large.
2. Left mobile and accordion structure untouched so the adjustment stays limited to desktop typography.

## 2026-03-17 featured work section redesign — interactive numbered grid

### Runtime touchpoints
- `src/components/Portfolio.tsx`

### What changed
1. Replaced the generic rounded-pill tag list with a 2×2 (mobile) / 4-column (desktop) interactive grid. Each cell shows a numbered index (01–04), the serif video title, and an arrow icon.
2. Each grid cell is a real button wired to `openReelPreview` so tapping any item opens that video directly in the theater. The section now functions as a navigable index for the reel below instead of a decorative keyword list.
3. The grid uses a `gap-px` separator pattern (`bg-border/25` container, `bg-background` cells) for clean, restrained dividers without heavy borders.
4. Hover states: subtle background tint (`hover:bg-foreground/[0.025]`) and title color lift (`group-hover:text-foreground/90`) communicate affordance before interaction.
5. Animation: the grid reveals as a single unit via `revealUp` inheriting from the parent section stagger, replacing the previous nested `motion.span` stagger that conflicted with the parent's `once: true` viewport trigger.

### SEO impact
- All crawlable text content (section label, description, video titles) is preserved in semantic elements.
- No heading structure, schema, metadata, canonicals, or internal links were modified.
- No new dependencies or layout-shifting elements introduced.

## 2026-03-18 featured work grid removed from homepage portfolio

### Runtime touchpoints
- `src/components/Portfolio.tsx`
- `src/data/portfolio-clips.ts`

### What changed
1. Removed the "TRABAJO DESTACADO" 4-column numbered text grid from the homepage Portfolio section. The grid (01–04 cards with clip titles and arrow icons) was triple-gated behind lazy loading and IntersectionObserver, so it had no crawlable SEO value and was not contributing to the homepage conversion flow.
2. Cleaned up the `FEATURED_REEL_CLIPS` constant, `featuredReelClips` useMemo, and the `FEATURED_REEL_CLIP_IDS` import that were only used by that grid. The rest of the Portfolio component (video theater, collage, reel carousel) is untouched.
3. The homepage flow now transitions cleanly from the video collage into the next section without an orphaned text-only index.

### SEO impact
- The removed grid contained no heading tags, schema, canonicals, or internal links.
- No metadata, structured data, or crawlable content was affected.

## 2026-03-18 split headline descender clipping fix

### Runtime touchpoints
- `src/components/motion/SplitTextReveal.tsx`

### What changed
1. Added a small descender-safe bottom allowance to each masked word wrapper in `SplitTextReveal`, with a matching negative offset so the visual rhythm stays the same.
2. Applied the same allowance to the reduced-motion fallback path, so desktop users do not lose the bottoms of letters like `y`, `p`, and `q` when serif headlines render without animation.
3. Kept the fix scoped to the reveal component instead of relaxing headline line-height site-wide, preserving the existing editorial heading proportions while removing the clipping artifact.

## 2026-03-20 homepage services section moved below portfolio

### Runtime touchpoints
- `src/pages/Index.tsx`

### What changed
1. Moved the homepage `ServicesSection` so "Lo Que Ofrezco / Servicios de UGC y portavoz" now renders immediately after the "Historias que convierten" portfolio on both mobile and desktop.
2. Kept the existing deferred-loading strategy intact for the heavier media sections by only changing the section order in the page composition, not the portfolio or marquee internals.
3. Left the later Fiverr rating, testimonials, FAQ, footer, and services marquee sequence unchanged so the request stays scoped to the homepage information hierarchy.

### Verification
1. `npm run build:dev`
2. `npm run check:mobile-regression`

## 2026-03-20 creator advantage section moved below services

### Runtime touchpoints
- `src/components/CreatorAdvantage.tsx`
- `src/components/Portfolio.tsx`
- `src/pages/Index.tsx`

### What changed
1. Extracted the "Ventaja del creador / Cobertura UGC de alta conversion para todo tu funnel" collage block out of `Portfolio.tsx` into a dedicated homepage section so it can sit directly below services on both desktop and mobile.
2. Left the portfolio component focused on the video showcase and theater flow, avoiding mixed hierarchy where a creator-advantage sales block appeared inside the video portfolio itself.
3. Kept the existing CTA behavior intact by preserving the hashless desktop contact jump and the mobile contact-dock open behavior in the new component.

## 2026-03-21 system-theme detection restoration

### Runtime touchpoints
- `src/main.tsx`
- `src/App.tsx`
- `src/components/ThemeRuntimeSync.tsx`
- `src/components/ThemeToggle.tsx`
- `src/components/ui/sonner.tsx`
- `index.html`

### What changed
1. Switched the app `ThemeProvider` from forced light mode to `defaultTheme="system"` with `enableSystem`, so first-time visitors inherit the device light/dark preference instead of always starting in light mode.
2. Replaced the early HTML bootstrap logic so the initial `dark` class, `color-scheme`, and `theme-color` meta value are derived from `prefers-color-scheme` unless the visitor has already chosen an explicit light or dark override.
3. Added a small runtime sync component to keep browser chrome metadata aligned after hydration and while the OS theme changes during an open session.
4. Updated the manual theme toggle and toast theme consumer to use the resolved light/dark value, avoiding incorrect `"system"` handling and keeping manual overrides working after the system-aware default returned.

### Verification
1. `npx eslint src/main.tsx src/App.tsx src/components/ThemeRuntimeSync.tsx src/components/ThemeToggle.tsx src/components/ui/sonner.tsx`
2. `npm run build`

### Verification
1. `npm run check:mobile-regression`

## 2026-03-24 creator advantage collage shell redesign

### Runtime touchpoints
- `src/components/CreatorAdvantage.tsx`

### Direction
1. Kept the existing homepage copy, CTA routing, and autoplay collage concept, but rebuilt the surrounding shell so the section reads like a composed proof stage instead of a generic rounded gradient box.
2. Chose a lighter editorial direction that stays inside the current Nordic atelier palette rather than introducing a new component style or a louder effect stack.

### What changed
1. Replaced the old empty gradient frame with a layered collage shell: radial light falloff, softer atmospheric depth, a restrained status chip, and a bottom information rail that gives the videos structure and context.
2. Split the clip positioning data into explicit desktop and mobile layouts so the three portrait videos keep a deliberate stagger on wide screens and a tighter, less wasteful composition on phones.
3. Kept the hover response only on desktop, still honoring reduced-motion, while leaving mobile as a static composed layout with the same passive autoplay behavior.
4. Preserved all existing functional behavior inside the section: same `LazyVideo` sources, same autoplay/loop/inline playback, same visibility-based loading, same contact CTA anchor behavior on desktop, and the same floating contact dock trigger on mobile.

### Safeguards
1. No heading hierarchy, link structure, or localized copy changed.
2. No new dependencies were added.
3. The section remains non-interactive aside from the CTA, so keyboard flow and mobile touch behavior are unchanged.

### Verification
1. `npx eslint src/components/CreatorAdvantage.tsx`
2. `npm run build:dev`

## 2026-03-24 creator advantage chip clearance fix

### Runtime touchpoints
- `src/components/CreatorAdvantage.tsx`

### What changed
1. Increased the shell inset around the collage status chip so it no longer clips against the rounded top edge on either mobile or desktop.
2. Added a bit more reserved top space above the video stage so the chip and the collage composition no longer compete for the same vertical area.
3. Kept the section structure, copy, video sources, autoplay behavior, CTA routing, and desktop hover logic unchanged.

### Verification
1. `npx eslint src/components/CreatorAdvantage.tsx`
2. `npx vite build --mode development`

## 2026-03-24 creator advantage chip flow-layout correction

### Runtime touchpoints
- `src/components/CreatorAdvantage.tsx`

### What changed
1. Replaced the collage chip's absolute overlay positioning with a normal in-flow top row inside the shell, so the label no longer depends on brittle offsets against the rounded frame.
2. Rebalanced the shell padding and the collage stage top margin on both desktop and mobile so the chip always has dedicated clearance above the video composition.
3. Left the rest of the section intact: same collage media, same hover behavior on desktop, same passive autoplay, and same CTA behavior.

### Verification
1. `npx eslint src/components/CreatorAdvantage.tsx`
2. `npx vite build --mode development`
