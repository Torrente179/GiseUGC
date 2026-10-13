# Home Hero — Cut-out Portrait, Feed Caption, Scroll Reveal

**Status:** Live on main
**Implemented:** 2026-10-13
**Scope:** Homepage hero (`#home`), all breakpoints. Replaces the portrait hero
(`.portrait-hero*`), whose rules and markup are gone.

| Commit | Subject |
| --- | --- |
| `24663c3` | `feat(hero): cut-out portrait in front of her name, feed caption, scroll reveal` |

Design canvas (base adaptation plus four ideas; the user picked **Idea 2 ·
Feed-native**, with the action rail replaced by the reel card on desktop and all
type in DM Sans after trying the site's Cormorant):
<https://claude.ai/artifact/Sk2cWanVZFEaLbU8nXqSfX>

The reference was a portfolio hero the user shared, and the motion is ported
from their own JP Website (`~/Desktop/JP Website`, `components/hero.tsx`,
`components/hero-depth.tsx`, `app/globals.css` "Home hero" and "Motion").

---

## 1. Layers

Back to front, all inside `.feed-hero__stage` (`isolation: isolate`). Every
z-index is **positive** on purpose: the Browser pane drops negative z-index
layers from screenshots, which reads as a broken hero.

| z | Element | What it is |
| --- | --- | --- |
| 0 | `.feed-hero__plate-track` | her own photo pre-blurred (`gisela-hero-plate-{desktop,mobile}.webp`, ~4 KB) plus a warm radial glow |
| 1 | `.feed-hero__fade` | fade to `#0b0b0d` at the bottom |
| 2 | `.feed-hero__name-track` | "Gisela", DM Sans 700, `aria-hidden` |
| 3 | `.feed-hero__figure-track` | the cut-out, masked out at the waist |
| 4 | `.feed-hero__scrim` | bottom scrim so the caption reads over her |
| 5 | `.feed-hero__layout` / `.feed-hero__rail` | caption + reel card (desktop) / proof rail (phones) |
| 6 | `.feed-hero__progress` | scrubber bar that fills as the hero scrolls away |

Desktop sizes the name and the figure from one unit, `--feed-u =
min(1.25vw, 1.6vh, 20px)` (name 23u, figure 34u wide, figure top = name top +
4.4u), so her head lands on the same letters at every aspect ratio. The figure
is centred on her face: `left: calc(50% - width * 0.527)`.

The H1 is `hero.feed.greeting` + `hero.offerTitle`, with `offerTitle` unchanged,
so the static shells, OG cards and llms files did not need regenerating. It is
styled through `#home .feed-hero__title` because the global heading rule is
(0,3,1) and would otherwise paint it in the page foreground.

## 2. The cut-out and its resolution

- Source: the original iPhone 13 Pro Max photo, 4032×2268
  (`~/Downloads/IMG_8146.JPG` on JP's machine). She spans **980×2070 px** in
  it; that is the ceiling for this photo.
- `scripts/hero-cutout.swift` (Apple Vision subject mask), then
  `scripts/clean-hero-cutout.py`, which decontaminates the soft edge against a
  local background estimate (no glass halo on her hair) and drops strips of
  light background the mask counted as hair. Output: AVIF (q72, visually
  lossless, 40 dB on the face) and WebP (q95) at 520/760/980, PNG fallback 640.
- So the browser never stretches past 980 px: on 2x screens `--feed-u` stops
  at 14.4px, and on 3x phones the figure stops at 327px. On those screens the
  composition gets slightly smaller rather than softer.
- More resolution needs a new photo: a 48 MP capture framed tighter on her
  would give roughly 3–4× the pixels on the figure.

## 3. Reel card (desktop)

An iPhone 17 Pro Max at scale, from Apple's specs: body 78.0 × 163.4 mm, panel
1320 × 2868 px at 460 ppi (72.9 × 158.4 mm), so a ~2.55 mm bezel = 3.27% of
the body width as padding on all sides. The corner radius is not published;
the screen uses the commonly measured 62 pt on 440 pt, and the body radius adds
the bezel so the curves are concentric. No drawn Dynamic Island. Measured at
1440×900: body ratio 0.4774 (78/163.4), screen ratio 0.4605 (panel 0.4603).

The reel logic (session intro, 3.5 s cycle, media-intent gate) is unchanged,
but it does not run below 768px, where the card is not shown; the poster is
`loading="lazy"`, so a hidden card never fetches it.

## 4. Phones

Caption without the lead paragraph, "Sonido original · ES + EN", "Ver mi
trabajo" + "Servicios". The rail shows 4.7 / 177 / 28+ from `SITE_PROOF` and an
Escríbeme button that calls `openContactDock()`, which opens the same sheet as
the tab bar.

## 5. Motion

- Entrance: `.feed-hero-rise` / `-settle` / `-fade` with a per-element
  `--enter-delay` stagger, `var(--ease-premium)` (the same curve as JP's
  `--ease`).
- Scroll: CSS `animation-timeline: scroll(root)` over `0 100svh` — the name
  rises 14vh and fades to 0.25, she drops 9vh and scales to 1.035, the plate
  fades to 0.25, the scrubber fills. Guarded by
  `@supports (animation-timeline: view())`; elsewhere the hero is static.
- Pointer depth (`useHeroDepth`, desktop fine pointers only): `data-depth`
  wrappers drift with the cursor and sleep when settled.
- Entrance (`translate`/`scale`), scroll (on the `*-track` parents) and depth
  (`transform` on the `data-depth` wrappers) each sit on a different element so
  they compose instead of overriding each other. Keep it that way.
- All of it is off under `prefers-reduced-motion`.

## 6. Verification

- Geometry measured in the Browser pane at 1920×1080, 1440×900, 1280×720,
  1024×768, 768×1024, 430×932, 390×844, 375×667, 360×740: no horizontal
  overflow; caption and reel clear the name at every size.
- Scroll timeline values read back at 0/200/422/844 px of scroll.
- Pixels shot with headless Chrome at 1440×900, 1x and 2x.
- `npm run typecheck` clean; `npm test` 295/296 — the one failure is
  pre-existing (`og-image.test.ts` writes to `/opt/cursor/artifacts`, which only
  exists on Cursor's cloud agents).

## 7. Site-wide motion (same day, follow-up commit)

JP asked for the JP Website's smoothness "for everything", not just the hero:

- **Page transitions** (`src/index.css`, top): cross-document view transitions
  now run the JP timings — old page out in 160ms `ease-in`, new page rises
  14px in over 420ms on `--ease-premium` after 80ms. The nav (`.site-nav`),
  mobile tab bar (`.mtabbar`) and desktop contact dock
  (`.floating-contact-dock`) carry `view-transition-name`s with no animation,
  so the chrome holds still while the page changes under it.
- **Nav entrance removed**: `.site-nav-enter` slid the nav down 12px on every
  document load, which read as the nav jumping between pages.
- **Scroll reveals** (`.svc-reveal`, in both `src/index.css` and
  `src/styles/templates.css`): where `animation-timeline: view()` exists, the
  reveal is scrubbed by the scroll — opacity 0→1 and 28px→0 over the first
  260px of each block entering. Other browsers keep the IntersectionObserver
  path. Measured in headless Chrome: 0.35 at 65px, 0.57 at 130px, 0.80 at
  195px, 1 at 260px.
- **Hero buttons** press to 0.97 on `:active`, as JP's `.btn` does.

Testing note: the Browser pane never activates **view** timelines (they need a
rendered frame, and the pane's document never renders one), so it reports
`progress: null` and full opacity. Use headless Chrome through
`puppeteer-core` (in node_modules) for anything scroll-driven.
