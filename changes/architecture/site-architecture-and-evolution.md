# Site Architecture and Evolution

## Purpose
This is the best starting point for future work. It explains how the current site is assembled, which files own each major behavior, and which subsystem folders in `changes/` to read before modifying a feature.

## App shell
1. `src/main.tsx` mounts the app inside `ThemeProvider` and sets the default theme to light with manual dark-mode switching.
2. `src/App.tsx` wraps the single-page site with Lenis smooth scrolling plus Vercel Analytics and Speed Insights.
3. `src/pages/Index.tsx` is the real composition root. It decides mobile versus desktop section order, controls deferred mounting, and lazy-loads most of the homepage sections.

## Page structure
Desktop flow in `src/pages/Index.tsx`:
1. `Navbar`
2. `Hero`
3. `SocialProof`
4. `Portfolio`
5. `Services`
6. `DesktopFiverrRatingSection`
7. `Testimonials`
8. `FAQ`
9. `ServicesMarquee`
10. `Footer`
11. `FloatingContactDock`

Mobile flow in `src/pages/Index.tsx`:
1. `Navbar`
2. `Hero`
3. `Portfolio`
4. `HeroIntroduction`
5. `MobileFiverrRatingSection`
6. `Testimonials`
7. `MobileContactCtaSection`
8. `FAQ`
9. `ServicesMarquee`
10. `Footer`
11. `FloatingContactDock`

## Cross-cutting systems
1. Theme:
   - `src/main.tsx`
   - `src/index.css`
   - Light is the default. System theme detection is not the runtime source of truth anymore.
2. Language and canonicals:
   - `src/i18n.ts`
   - `index.html`
   - `en/index.html`
   - `vercel.json`
   - Spanish canonical homepage lives at `/`, English at `/en/`.
3. Performance and deferred loading:
   - `src/pages/Index.tsx`
   - `src/hooks/use-deferred-mount.tsx`
   - `src/components/motion/SectionSkeleton.tsx`
   - Most below-the-fold sections mount lazily with root-margin-based deferral.
4. Video runtime:
   - `src/components/Portfolio.tsx`
   - `src/data/portfolio-clips.ts`
   - `src/data/nuevos-r2-ready.ts`
   - `scripts/generate-nuevos-r2-catalog.mjs`
5. Global motion:
   - `src/components/motion/*`
   - `src/lib/smooth-scroll.ts`

## Subsystem map
1. UI and visual evolution:
   - `changes/ui/`
2. Carousel and marquee behavior:
   - `changes/carousel-functionality/`
3. Portfolio video, R2 catalog, and encoding pipeline:
   - `changes/video-functionality/`
4. Canonicals, metadata, schema, and crawlability:
   - `changes/seo/`
5. Hosting, cache, security, and instrumentation:
   - `changes/deployment/`

## Working invariants
1. `Index.tsx` owns section order. Reordering a section there changes the page narrative on one or both breakpoints.
2. `Navbar`, `Portfolio`, and `ServicesMarquee` are the most regression-prone interactive components. Check their subsystem notes before editing.
3. `Portfolio.tsx` expects one authoritative clip library built from `LEGACY_REEL_CLIPS` plus `NUEVOS_R2_READY_CLIPS`.
4. SEO-facing language behavior is path-based, not query-string-based.
5. Static SEO shells in `index.html` and `en/index.html` matter as much as the React UI because non-JS crawlers rely on them.

## Evolution in one line
The site started as a fast-moving visual rebrand and became a performance-sensitive bilingual landing page with three critical systems: UI composition in `Index.tsx`, video delivery in `Portfolio.tsx`, and SEO/canonical behavior in the HTML shells and i18n setup.
