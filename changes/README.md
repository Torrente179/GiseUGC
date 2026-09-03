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
  - **Current service INNER (below hero):** `ui/service-page-showroom-redesign.md` — read the last two entries (`2026-09-02` "A · Ritmo" beats and `2026-09-02b` Empezar) before touching `.stm-*`. Source of truth for the live ficha argument on all eight ES+EN service pages. The inner is not an app layout: it is the desktop document, given one full-bleed surface per beat, closing on a contained ink card. Three things there are deliberate and easy to re-break: beat modifier class names must be **literal** strings or Tailwind purges the rules silently; headings on the ink card need **(0,4,1)** to clear the global `h2:not(...)` rule; and service inner mobile has **no sticky CTA bar** — the global `.mtabbar` is the navigation on these pages, so do not re-add `body:has(...) .mtabbar { display: none }`.
  - **Current full-screen viewers:** both the video theater (Portfolio, service
    pages) and the testimonial viewer share one stage language — `--theater-*`
    tokens, the `media-theater-*` keyframes, and `.theater-control`. Changing one
    without the other splits them again. See
    `../2026-03-24-testimonials-marquee-redesign.md` (2026-09-01 entry).
- `carousel-functionality/`
  - Services marquee, swipe behavior, loop logic, resize stability, and regression guidance.
- `video-functionality/`
  - Portfolio theater, reel catalog, R2 gating, transcript-driven naming, and the encoding pipeline.
- `seo/`
  - Canonicals, metadata, schema, crawlability, and language-routing behavior.
  - **Current crawl-trust / hub indexes:** `seo/seo-crawl-trust.md` —
    honest homepage proof (28+/173/4.8/ES+EN), CONTENT_DATES, Fiverr canonical
    without `?source=gig_page`, and Person `alternateName`.
    **Current hub index copy:** `seo/2026-09-01-hire-intent-hub-copy.md` —
    hire-intent title/H1/body on the six existing hub routes. Read both
    before touching `/servicios/` `/verticales/` `/recursos/` (and EN twins).
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

For any homepage hero or top-of-page navbar change, read these in order — the
later entries supersede the earlier ones where they overlap:

- [`2026-07-27-editorial-title-sequence-hero.md`](./2026-07-27-editorial-title-sequence-hero.md) — approved Home hero composition, assets, accessibility, and regression guardrails.
- [`2026-09-02-hero-placa-neutral-surfaces-light-default.md`](./2026-09-02-hero-placa-neutral-surfaces-light-default.md) — direction "Placa": the H1 is the offer, not the name; the derived scrim knee (`--hero-copy-edge`) and why the 26rem headline cap keeps her lit. **Still current for desktop and tablet.**
- [`2026-09-03-mobile-hero-reel-deck.md`](./2026-09-03-mobile-hero-reel-deck.md) — **current for mobile (`max-width: 767px`).** The reel deck, the oversized top-anchored crop that gets her head out from behind the navbar, and why the deck is anchored to the bottom rather than to a percentage of the stage.
- [`ui/navbar-and-theater-hotfixes.md`](./ui/navbar-and-theater-hotfixes.md) — live overlay rule: `title-sequence-nav` on Home **and** service landings at rest, themed bar after scroll.

## Current Performance Source of Truth

Before changing route delivery, media playback, posters, video encoding, global
motion, scrolling, fonts, or critical CSS, read:

- [`2026-07-29-performance-motion-media-architecture-overhaul.md`](./2026-07-29-performance-motion-media-architecture-overhaul.md)

It includes the measured baseline, root causes, quality invariants, implemented
architecture, controlled validation results, and explicit follow-up work.
