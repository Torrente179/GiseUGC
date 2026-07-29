# Site Architecture and Evolution

## Purpose

This is the compact working map for future changes. The full performance,
motion, media, and validation record is
[`../2026-07-29-performance-motion-media-architecture-overhaul.md`](../2026-07-29-performance-motion-media-architecture-overhaul.md).

## App shell

1. `src/entry-server.tsx` renders every registered URL during the build.
2. `scripts/prerender.mjs` injects route markup and critical CSS into all 40
   static entries.
3. Route-family client entries call `src/client-runtime.tsx`, which hydrates the
   existing markup inside `BrowserRouter`, `LocaleProvider`, and `ThemeProvider`.
4. `src/App.tsx` owns shared route matching, native scroll restoration, deferred
   analytics, the mobile shell, and the global media session.
5. `src/pages/Index.tsx` owns homepage composition and deferred mounting.

## Page structure

The homepage uses the same narrative order across breakpoints:

1. `Navbar`
2. `Hero`
3. `ManifestoChapter`
4. Deferred `Portfolio`
5. `Services`
6. `CreatorAdvantage`
7. Deferred `Testimonials`
8. `FAQ`
9. Deferred `ServicesMarquee`
10. `SiteFooter`
11. `FloatingContactDock`

The desktop/mobile differences live inside responsive section shells rather
than reordering the entire document after hydration.

## Cross-cutting systems

1. Theme:
   - `src/client-runtime.tsx`
   - `src/index.css`
   - `next-themes` follows the system by default and preserves manual override.
2. Language and canonicals:
   - `src/lib/locale-context.tsx`
   - `src/lib/locale-path.ts`
   - `src/components/PageSeo.tsx`
   - Spanish canonical homepage lives at `/`, English at `/en/`.
3. Performance and deferred loading:
   - `src/client-runtime.tsx`
   - `scripts/prerender.mjs`
   - `src/pages/Index.tsx`
   - `src/hooks/use-deferred-mount.tsx`
   - `src/components/motion/SectionSkeleton.tsx`
   - Media-heavy below-the-fold sections mount with root-margin-based deferral.
4. Video runtime:
   - `src/components/media/`
   - `src/lib/media-assets.ts`
   - `src/lib/media-playback-scheduler.ts`
   - `src/data/portfolio-clips.ts`
   - `src/data/nuevos-r2-ready.ts`
   - `scripts/generate-responsive-posters.sh`
   - `scripts/generate-startup-videos.mjs`
   - `scripts/encode-hls.sh`
5. Global motion:
   - `src/components/motion/*`
   - `src/lib/motion/*`
   - `src/hooks/use-hero-key-light.ts`
   - Native scrolling; no Lenis, GSAP, Framer Motion, or global ticker.

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
2. `Navbar`, `Portfolio`, and `ServicesMarquee` are the most
   regression-prone interactive components. Check their subsystem notes before
   editing.
3. `Portfolio.tsx` expects one authoritative clip library built from `LEGACY_REEL_CLIPS` plus `NUEVOS_R2_READY_CLIPS`.
4. SEO-facing language behavior is path-based, not query-string-based.
5. Static entries are complete prerendered pages and must stay hydratable.
6. A `PlaybackCandidate` owns its MP4/HLS pair; never recreate parallel source
   arrays.
7. Ambient video must request the shared playback slot. Theater acquisition
   must unload ambient media.
8. Never put source masters or transcode workspaces under `public/`.
9. Motion should use transform/opacity, stop when hidden or settled, and honor
   reduced motion.
10. Performance work must not reduce the native-resolution video ceiling or
    remove approved animation to game a synthetic score.

## Evolution in one line

The site evolved from a client-rendered, multi-decoder visual portfolio into a
prerendered bilingual application with route-family hydration, exclusive media
scheduling, quality-preserving adaptive delivery, and browser-native motion.
