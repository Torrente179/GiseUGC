# Services Pages — Crunchyroll-style Cinematic Hero + Demo-Card Rail (desktop)

**Date:** 2026-06-04

## Goal

Rework how the service pages present their content on **desktop**, inspired by
Crunchyroll's content-discovery *form* (not its colors): a featured video
highlighted as key-art in the hero, a short service description, and a row of
demo cards of similar work — then all the existing explanation/workflow content.
Keep the site's own theme, palette, typography, and feel. Mobile is out of scope
for now (the `stm-*` branch already implements this pattern; the user will adapt
it later).

All work is scoped to the **desktop branch** of `ServiceLandingPage.tsx` and
**new `svc-cine-*` classes** in `src/index.css`. The shared
`st-hero*/st-letterbox*/st-proof*` classes (reused by the verticals & resources
pages) and the mobile `stm-*` branch were left untouched, so those pages are
unaffected.

## Approach & final layout

Desktop section order is now: **cinematic hero (with the demo-card rail
integrated at its bottom) → brief → process → is-this-for-you/FAQ → explore →
close → marquee**. The old standalone "proof wall" section was replaced by the
in-hero rail (same `featuredExamples` data).

**Cinematic hero (`.svc-cine-hero`)** — a flex column on a near-black stage:
- Featured clip as **key-art on the right half** (~52% width, bleeds to the right
  edge) with its left edge **feathered via `mask-image`** into the background —
  the "blurry blend in the middle". A blurred, desaturated copy of the clip fills
  the stage behind everything as ambient depth.
- A left→right readability **scrim** keeps the wording legible (dark on the left,
  clear on the right over the clip).
- **Wording block** (breadcrumb, eyebrow, title, short `heroSummary`, single CTA)
  on the left; the whole text+cards group is vertically **centered**.
- The blend tone is a **scoped near-black** (`--svc-hero-ink: 0 0% 7%`), not the
  warm `--deep-ebony` brown and not pitch black; the ambient clip is desaturated
  (`saturate(.55) brightness(.5)`) so the blur reads black.

**Demo-card rail (`.svc-cine-hero-rail`)** — pinned to the bottom of the hero so
the hero + cards share one screen. Horizontal scroll-snap strip of portrait
(9:16) poster cards with hover-autoplay previews, title + duration/ES·EN chips,
and `‹ ›` arrows (auto-hidden when the cards already fit). Cards open the existing
shared theater overlay on click — they are the interactive surface.

**Hero showcase clip** is **decorative, not a player**: non-interactive `<div>`
(no play button, no caption, `aria-hidden`), reuses the looping
`AutoplayPreviewVideo` with the **`mobileSrc` (720p mp4)** for quality, and pauses
when scrolled offscreen.

## Notable fixes along the way

- **`.MOV` won't play on the web:** the clip `mainSrc` is a `.MOV`
  (`MEDIA_ERR_SRC_NOT_SUPPORTED` in Chromium). Switched the hero source to
  `mobileSrc` (mp4). The low-res `previewSrc` was the original "very low quality"
  cause.
- **Dark hero title bug:** the global `h1:not(.section-label):not(.type-brand-display):not(.font-serif)`
  rule (specificity `0,3,1`, in Tailwind's compiled CSS where `@layer` is build-time,
  so specificity wins) forced `--foreground` (dark) on the title. Fixed by scoping
  the light color under the hero — `.svc-cine-hero .svc-cine-hero-inner .svc-cine-hero-text .svc-cine-hero-title`
  (`0,4,0`) — beating it without `!important` (the file uses `!important` only once).
- **CSS comment gotcha:** an early `*/` inside a comment (`st-hero*/st-proof*`)
  prematurely closed the comment and broke PostCSS parsing; reworded.

## Files changed

- `src/components/ServiceLandingPage.tsx` — desktop branch: new hero markup + demo
  rail; hero showcase + card hover/scroll state; removed the old proof-wall block.
- `src/index.css` — new `svc-cine-*` block (hero, ambient bg, scrim, key-art media
  + mask, rail, cards, arrows; near-black `--svc-hero-ink`).
- `src/components/media/HeroShowcaseVideo.tsx` — added then removed (the 4s-pause
  showcase was replaced by the looping `AutoplayPreviewVideo`).

## Verification (browser preview, desktop 1440×900)

- No Vite/PostCSS build errors; `tsc -p tsconfig.app.json` clean.
- Section order correct; video key-art spans 48→100% width with the mask applied;
  title computes to `pure-linen`; hero fits the viewport (900=900).
- Hero showcase: `mobileSrc` loads (720×1280, no media error), `loop: true`.
- Demo cards (3) and the hero key-art click both open the theater (scroll-lock +
  prev/next + Esc close).
- Regression: a vertical page still renders `st-hero`/`st-proof-wall`/`st-letterbox`;
  the mobile branch (390px) still renders `stm-hero`/`stm-reel` with the desktop
  `svc-cine-*` classes absent.

Note: the preview environment can't produce a usable screenshot of the right-side
video (it captures the window's small native size), so visual sign-off is done on
the live Vercel build per the deploy workflow.

## Commits (pushed to `main`)

- `ed3a85e` — feat(services): cinematic hero + demo-card row on desktop service pages
- `d8e3f5a` — fix(services): hero key-art on the right + blurry blend, fix dark title
- `a7f43a9` — style(services): make hero blur near-black instead of warm brown
- `fb714bf` — feat(services): integrate demo cards into the hero stage under the CTA
- `e3e1922` — feat(services): non-interactive hero showcase clip (4s play, higher quality)
- `489ac25` — style(services): lower hero wording block to sit just above the cards
- `72b35da` — feat(services): hero clip loops full-length + raise wording block
- (`14619cb`, `cc4c3ad` — Vercel rebuild-trigger bumps when the GitHub→Vercel webhook missed pushes)

## Follow-ups / known issues

- Mobile Crunchyroll pass still to do; the mobile `stm-hero-title` has the same
  latent dark-title specificity issue and can be fixed the same way.
- Pre-existing homepage render error at `Index.tsx:98` (unrelated to this work).
