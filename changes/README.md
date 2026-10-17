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
- **Current site copy:** `2026-10-13-site-copy-plain-voice.md`
  - The voice the user chose (plain, first person, neutral LatAm Spanish with
    *tú*), the facts the copy states, and how every static entry shell is now
    generated from `src/data/*.ts`. Read before editing copy or any shell HTML.
- `ui/`
  - Hero, navbar, footer, contact flows, FAQ, rating cards, motion polish, and visual evolution.
  - **Current live hero:** `../2026-10-13-feed-hero-cutout.md` — cut-out portrait in front of a giant “Gisela”, caption laid out like a post, reel card at iPhone 17 Pro Max scale on desktop, proof rail on phones, and a CSS scroll timeline that lifts the name as the hero leaves. Read §2 before replacing the photo and §5 before touching any hero motion. The portrait hero, “CHAPTER 00” title sequence, “Muro de trabajo,” and earlier experiments are historical rather than current.
  - **Current service INNER (below hero):** `ui/service-page-showroom-redesign.md` — read the last two entries (`2026-09-02` "A · Ritmo" beats and `2026-09-02b` Empezar) before touching `.stm-*`. Source of truth for the live ficha argument on all eight ES+EN service pages. The inner is not an app layout: it is the desktop document, given one full-bleed surface per beat, closing on a contained ink card. Three things there are deliberate and easy to re-break: beat modifier class names must be **literal** strings or Tailwind purges the rules silently; headings on the ink card need **(0,4,1)** to clear the global `h2:not(...)` rule; and service inner mobile has **no sticky CTA bar** — the global `.mtabbar` is the navigation on these pages, so do not re-add `body:has(...) .mtabbar { display: none }`.
  - **Current video player:** the home page and the service pages share one
    player, `src/components/media/ReelTheater.tsx` (desktop theater `.rt`, phone
    full-screen feed `.rf-mob--overlay`, styles in `src/styles/reels-feed.css`).
    See `../2026-10-16-service-video-player.md`. The old `MediaTheater` is gone;
    the `media-theater-*` / `.theater-control` CSS in `index.css` is unused.
- `carousel-functionality/`
  - Services marquee, swipe behavior, loop logic, resize stability, and regression guidance.
- `video-functionality/`
  - Portfolio theater, reel catalog, R2 gating, transcript-driven naming, and the encoding pipeline.
  - **Video memory on phones:** `2026-10-17-mobile-video-memory.md`. Every
    player frees its stream when it is done with it (`src/lib/video-lifecycle.ts`).
    Rotating cards play preview loops warmed into memory. The feed pool fully
    buffers one reel at a time. Read it before adding a `<video>` anywhere.
- `seo/`
  - Canonicals, metadata, schema, crawlability, and language-routing behavior.
  - **Current crawl-trust / hub indexes:** `seo/seo-crawl-trust.md` —
    honest homepage proof (28+/177/4.7/ES+EN), CONTENT_DATES, Fiverr canonical
    without `?source=gig_page`, and Person `alternateName`.
    **Internal link map (2026-10-16):** same file, last entry — breadcrumbs
    are Home › hub › page, hubs carry the site chrome, and the page-end strip
    links every page to the three hubs (`src/data/internal-link-map.test.tsx`).
    **Homepage review quotes in the first HTML:**
    `seo/2026-10-16-testimonials-prerender-text.md` — `#testimonials`
    placeholder on `/` and `/en/` carries the Fiverr quotes; videos stay lazy;
    no per-review schema.
    **Current hub index copy:** `seo/2026-09-01-hire-intent-hub-copy.md` —
    hire-intent title/H1/body on the six existing hub routes. Read both
    before touching `/servicios/` `/verticales/` `/recursos/` (and EN twins).
  - **Current schema delivery:** `seo/seo-ssr-structured-data-and-metadata-parity.md` —
    route JSON-LD renders server-side via `PageSeo`, resource `<head>` metadata is
    generated from `src/data/resource-pages.ts` in prebuild. Read this before
    touching `PageSeo`, resource shells, or homepage JSON-LD. Person `sameAs`
    (including YouTube) is authored on the homepage shells.
  - **Current hire aliases / IndexNow:** `seo/seo-crawl-trust.md` — Vercel 301s
    for `/contratar` and `/hire` onto the how-to-hire guides; IndexNow key +
    post-deploy ping on `main`. Do not add those aliases to the sitemap.
  - **Current OG + video sitemap:** `seo/2026-10-13-per-page-og-and-video-sitemap.md`
    — per-page hashed OG JPEGs, `OG_PROOF_LINE_MODE`, curated homepage video
    sitemap. Authority resync note lives at the top of `src/data/site-proof.ts`.
  - **Industry pages removed 2026-10-16** (`seo/seo-crawl-trust.md`, last entries):
    the vertical notes below are historical.
  - **Current vertical H1 / llms YouTube / hire-intent titles:**
    `seo/2026-10-13-vertical-h1-llms-titles.md` — one H1 per vertical (desktop
    `.st-hero-title`), YouTube on `llms.txt` + `llms-full.txt`, beauty
    money-page sentence, six title rewrites and two hub descriptions. OG
    JPEGs were not regenerated (H1s unchanged). Duplicate boot+PageSeo `@id`s
    were left in place; see that file.
  - **Current llms journalism/TV line:**
    `seo/2026-10-14-llms-journalism-tv-line.md` — one homepage-H1 line on
    `llms.txt` and `llms-full.txt` (`9 years of experience as a journalist
    and comes from television.`). Summary blockquote unchanged.
  - **Current llms 28+ wording:**
    `seo/2026-10-15-llms-brand-campaigns.md` — `28+ brand campaigns` (no
    "active") in `llms.txt` and `llms-full.txt`. `Last-Updated` /
    `CONTENT_DATES.home` `2026-10-15`. GEO prompt baseline:
    `2026-10-15-geo-prompt-baseline.md`.
  - **Current Fiverr pricing guide:** `seo/2026-10-14-fiverr-pricing-guide.md`
    — `/recursos/cuanto-cobra-creadora-ugc/` and
    `/en/resources/how-much-does-a-ugc-creator-charge/`. Prices live in
    `FIVERR_PRICING`; any change needs a Fiverr re-check and an Authority ping.
    Spokesperson cells show the amount once plus two labelled gig links:
    `seo/2026-10-14-pricing-guide-table-faq.md`. One FAQ block (no noscript `<dl>`).
  - **Current `/#contact` scroll:** `seo/2026-10-14-contact-hash-scroll.md` —
    hash wins over POP restore; `scrollToSection` retries until the footer Y
    has settled, then jumps immediately.
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
