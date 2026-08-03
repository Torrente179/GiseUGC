# Changes

This folder is organized by subsystem instead of by date.

## Structure

- `architecture/`
  - Start here for the current site map, section order, and project-level working rules.
- **Current performance/media/motion architecture:**
  - `2026-07-29-performance-motion-media-architecture-overhaul.md`
  - This is the source of truth for prerendering, hydration, fonts, CSS delivery,
    media scheduling, theater startup, HLS quality, motion budgets, validation,
    and remaining Lighthouse gates.
- `ui/`
  - Hero, navbar, footer, contact flows, FAQ, rating cards, motion polish, and visual evolution.
  - **Current live hero:** `../2026-07-27-editorial-title-sequence-hero.md` — “CHAPTER 00” editorial opening with a solid `GISELA` title, three real film-strip stills, exact Medellín metadata, and a dedicated mobile app-quality composition. Earlier “Muro de trabajo,” wide contact-sheet, pencil-texture, and blue-mark experiments are historical rather than current.
- `carousel-functionality/`
  - Services marquee, swipe behavior, loop logic, resize stability, and regression guidance.
- `video-functionality/`
  - Portfolio theater, reel catalog, R2 gating, transcript-driven naming, and the encoding pipeline.
- `seo/`
  - Canonicals, metadata, schema, crawlability, and language-routing behavior.
  - **Current schema delivery:** `seo/seo-ssr-structured-data-and-metadata-parity.md` —
    route JSON-LD renders server-side via `PageSeo`, resource `<head>` metadata is
    generated from `src/data/resource-pages.ts` in prebuild. Read this before
    touching `PageSeo`, resource shells, or homepage JSON-LD.
- `deployment/`
  - Hosting, caching, security hardening, and runtime instrumentation.

## Logging Rule

1. Find the closest subsystem file and append the update there.
2. Create a new file only when the change introduces a genuinely new subsystem, not a one-off tweak.
3. Keep related iterations together even when they happen on different days.

## Mobile Regression Guardrail

For any change that touches carousel, touch/drag input, smooth scrolling, or section loading behavior:

1. Run:
   ```bash
   npm run check:mobile-regression
   ```
2. Copy the generated block from:
   - `tmp/mobile-regression/latest.md`
3. Paste it into the matching file under `changes/carousel-functionality/` or `changes/ui/` beneath:
   - `## Mobile Regression Checklist`
4. Fill out the manual iPhone Safari checks before merging.

## Why this exists

Recent regressions came from mobile-only interaction differences such as viewport changes, touch axis locking, and carousel offset resets. Grouping notes by subsystem makes it easier to see how a behavior evolved before changing it again.

## Current Homepage Hero Source of Truth

For any homepage hero or top-of-page navbar change, read:

- [`2026-07-27-editorial-title-sequence-hero.md`](./2026-07-27-editorial-title-sequence-hero.md)

It records the approved composition, real source assets, responsive behavior, accessibility requirements, superseded experiments, validation, and regression guardrails.

## Current Performance Source of Truth

Before changing route delivery, media playback, posters, video encoding, global
motion, scrolling, fonts, or critical CSS, read:

- [`2026-07-29-performance-motion-media-architecture-overhaul.md`](./2026-07-29-performance-motion-media-architecture-overhaul.md)

It includes the measured baseline, root causes, quality invariants, implemented
architecture, controlled validation results, and explicit follow-up work.
