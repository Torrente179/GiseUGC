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
- (superseded by §11) `scripts/hero-cutout.swift` (Apple Vision subject mask), then
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

## 8. Revision after JP's review (same day)

JP: the image was "weirdly cut on the edges", the bottom shadow and the
background were too dark, use Idea 1's reel backdrop, and the phone "is not an
iPhone 17 Pro Max and it needs to be bigger". He left the brightness call to
judgement.

- **Edges.** The first clean-up solved each edge pixel against an estimated
  background; Vision's interior is not fully opaque, so that tinted the skin and
  left a dark rim, and a contrast curve then hardened it into a visible cut.
  AVIF also compressed the alpha lossily and stepped the outline.
  `scripts/clean-hero-cutout.py` now runs a guided filter along skin and
  clothes only (it shreds hair), makes the interior solid, and gives every
  partly transparent pixel the colour of the nearest solid pixel of her, so an
  edge can only fade. The cut-out ships as **WebP only** (lossless alpha):
  520/760/991 + PNG 640.
- **Backdrop.** The plate is now the clip the reel card is playing, pre-blurred
  by `scripts/generate-hero-plates.mjs` into ~2 KB 180×320 images
  (`public/uploads/hero-plates/reel-<id>.webp`) normalised to the same mean
  brightness (sRGB ≈118), and cross-faded over 1.2 s when the reel advances.
  No CSS blur, so the fade stays on the compositor. The ground is a warm
  `#1d1916`, the foot fade stops at 0.42 instead of solid black, and the
  caption gets a local radial shade instead of a full-width bottom scrim.
- **Phone.** Drawn as the device: silver aluminium rim (1 mm), black glass
  (1.55 mm), concentric radii, Dynamic Island with a lens, Action + volume
  buttons on the left, side button + Camera Control on the right. Width
  `clamp(12rem, 18.5vw, 18rem)` (266 px at 1440, up from 197), seated near the
  foot so it clears the name.

## 9. Desktop nav: Idea 2's floating pill (site-wide)

JP asked for the desktop nav, on every page, to look like Idea 2's. At md+ the
full-width bar is gone; `src/components/Navbar.tsx` renders, inside the same
fixed `nav.site-nav`:

- `.site-nav-pill`, centred: a "g." monogram (Home), Portafolio · Servicios ·
  Testimonios · Preguntas (Home section order), and a white "Escríbeme" CTA to
  `#contact`. On Home the link for the section in view is highlighted via
  `useActiveSection`.
- `.site-nav-tools`, top right: the existing `NavbarControls` (ES/EN and
  theme), re-skinned onto the same dark glass by overriding the palette
  variables locally. It does **not** use `title-sequence-nav`, which
  `Navbar.test.tsx` requires to be absent on resource, vertical and hub routes.
- Dark glass `rgb(16 16 19 / 0.82)` + blur on every route and theme; 0.72
  read as mid-grey over light pages.
- The root nav is transparent and `pointer-events: none` at md+, so it never
  blocks the page; the pills re-enable pointer events.
- View-transition names moved from the root to the pills (`site-nav`,
  `site-nav-tools`) at md+. A named element is a backdrop root, so naming the
  root would cut the pills' blur off from the page behind them.
- Mobile is unchanged: same bar, back button, controls and menu.
- Hub pages (`/servicios/`, `/verticales/`, `/recursos/` and EN twins) render
  no site nav at all, before and after this change.

Verify inner routes against `npm run build` + `npm run preview -- --port 4173`:
the dev server cannot hydrate them ("Missing prerendered route data"). The
build rewrites `src/data/nuevos-r2-ready.ts`; restore it before committing.

## 10. The photo frame (second review, same day)

JP: the picture and blend were "very low quality", arm edges fuzzy, she
looked "like a flying ghost over the frame", and the reel-driven backdrop
changing colour was wrong — "bring back the background of the actual picture
and make it a bit blurry". This supersedes the plate and the waist fade from
sections 1 and 8.

**Root cause.** Any cut-out laid over a *different* background shows every
imperfect edge pixel against colours that were never behind it, and fading
her out at the waist on a light ground reads as a ghost. No amount of edge
filtering fixes that.

**Now.** Two layers from the one photo, in identical frames:

- `gisela-scene-{1344,2016}.webp` — the 4032×2268 scene with her filled in
  (a premultiplied push-pull fill over her silhouette + 18 px) and blurred
  (σ 14 at full width). Filling her in matters: blurring the photo with her
  still in it bleeds a dark halo round her hair and a glow round her arms.
- `gisela-cutout-*.webp` — her, placed by `--feed-cut-left/top/width` (printed
  by the script) inside the same frame, so every edge pixel lands on the
  background it was photographed against.
- The frame is the photo at ≥128% of the stage height (≥1100 px), with her face
  at 53% of the width and her head ~90 px down; on phones it is sized from her
  width (≤330 px) and never shorter than 108% of the stage. She runs off the
  foot of the hero — no mask.
- Both frames carry the same scroll animation and the same pointer depth
  (`data-depth="8"`), so she never slides off her background. Verified: their
  boxes are identical at 0/300/600 px of scroll with the pointer moved.
- The scene only fades in once the cut-out has loaded (`.is-ready`), so the
  filled-in silhouette is never seen on its own.
- Hair: strips of glass the mask kept between strands are repainted as hair
  instead of cut out (cut out, the white name showed through as a crack), and
  the hair edge falls off more steeply so the letters do not show through the
  outer strands.
- The stage has an explicit `height`, not `min-height`: it is a size
  container, and Chrome resolves `cqh` against a size container's min-height
  as 0. The phone floor dropped from 40rem to 34rem so a 667 px phone fits the
  buttons above the tab bar.

Known trade-off: on short laptop screens (≤ ~800 px tall) the phone overlaps
the last letter of the name.

## 11. New source photo and BiRefNet matte

JP: "the edge detection tech you are using is faulty", and supplied the
retouched edit of the same shot (`~/Downloads/Photos/E3AF5948-…(2)-EDIT.jpg`,
4032×2268, pixel-aligned with IMG_8146: smoother skin, slightly warmer).

Four mattes were compared on 1:1 crops of hair and both arms over a flat
colour: Apple Vision's subject mask (the one used so far: grey halo round the
hair, smeared arm edges), Vision's person segmentation (.accurate; only
2016×1512, glow round the hair, a dark blob on one arm), and BiRefNet-portrait
on a crop round her, whole and tiled. BiRefNet whole-crop was clearly best:
crisp, clean edges with no halo.

- `scripts/hero-matte.py` (needs a Python 3.12 venv with onnxruntime; see its
  docstring) runs `onnx-community/BiRefNet-portrait-ONNX` (MIT, ~970 MB, cached
  by huggingface_hub) on the whole photo to find her, then on a crop round her.
  It replaces `scripts/hero-cutout.swift`, which is deleted.
- `scripts/clean-hero-cutout.py <photo> <matte> public/uploads` now uses the
  matte as it is. The guided filter, the hair-gap repainting and the steeper
  hair falloff were workarounds for the Vision mask and are gone; the one edge
  treatment left is taking edge colour from the nearest solid pixel of her.
- New geometry: cut-out 980×2072 at (1425, 196) → `--feed-cut-left: 35.342%`,
  `--feed-cut-width: 24.306%`, `--feed-face-x: 0.4767`; the phone frame factor
  is 2.3142.

## 12. Link previews (Open Graph) in the hero's look

The 46 per-page cards (`src/lib/og-image-render.ts`, generated at build and
committed under `public/og/`) were the old navy panel with a serif headline
and a cropped photo. They are now the hero in miniature:

- the hero's own scene and cut-out (`gisela-scene-2016.webp`,
  `gisela-cutout-980.webp`), composited with sharp at the same alignment —
  a 980px frame with her face at x 830 and her head 62px from the top, so her
  head overlaps the edges of the "s" and the "e" as on the site;
- "Gisela" in DM Sans Bold behind her, the page H1 in DM Sans Medium in the
  lower left with "Gisela Saldarriaga · Gisela.UGC" above it and the locked
  Fiverr proof line (with a star) below; a radial shade under the copy;
- DM Sans only, from the bundled variable font (`getVariation({ wght })`);
  Cormorant is no longer used for OG, and the layout test lays titles out with
  `loadOgTitleFont()` so it measures what the renderer draws.
- `OG_STYLE_VERSION` 20261013b, so every card got a new hashed filename and
  no share cache serves the old one. Cards are 61–67 KB; H1s fit in ≤3 lines
  at 36–50px.

Regenerate without a full build: load `src/lib/og-image-render.ts` through
Vite's `ssrLoadModule` and call `writeOgImages(root, { updateEntrypoints: true })`.

## 13. Reel phone with an action column, and upright tablets

JP picked Idea D from the canvas ("Double-tap, alive"), with one change: only
a click likes the reel. Nothing loops on its own.

- `src/components/media/ReelPhone.tsx` + `src/styles/reel-phone.css`: one
  iPhone 17 Pro Max (78 × 163.4 mm body, 1 mm rim, 1.55 mm glass, concentric
  radii, Pro Max button layout) with a short-video feed's column on the
  screen: avatar with a follow badge (→ #contact), heart with the Fiverr
  rating, comments with the review count (→ #testimonials), bookmark with the
  campaign count (→ #portfolio), share (→ contact), and a spinning sound disc.
  Caption with her name, the clip title and the sound line; a progress bar
  that runs one clip length per clip.
- Clicking the video, or the heart, likes it: a teal heart bursts where the
  click landed and three small hearts float up the column. Keyboard presses
  burst at the centre. A hint pill ("Toca el video para darle me gusta") shows
  until the first like. Reduced motion gets a flash, no float, no spin.
- Everything on the screen is sized in `cqw` of the screen (the glass is a
  size container), with pixel floors so labels stay at 10px or more on the
  smallest phone. The parent sets the width with `--reel-phone-w`.
- Used twice: the desktop hero (`.feed-hero__reel`, 12–18rem wide) and the
  "Mira cómo se ve" phone after Services, on every screen size
  (`.creator-reel-phone`, 16.5–20rem). The old phone frame, notch and chips
  are gone from both.

Upright tablets (iPad mini to iPad Pro 13", portrait) now take the phone
composition, not the landscape one: `COMPACT_HERO_QUERY` in `Hero.tsx` and
the matching media query in `index.css` are
`(max-width: 767px), (orientation: portrait) and (max-width: 1100px)`. At
600px and up in portrait the caption and the rail grow, the lead and the long
labels come back, and the bottom shade is a little stronger for the lead.
Landscape iPads keep the reel phone.

On those screens her head sits lower than the photo's top edge, which left a
band of bare ground under the nav. The scene is now drawn a second time,
mirrored, directly above itself (`.feed-hero__scene--mirror`, same file, one
pixel of overlap), so the blurred background continues upward.

Verified with puppeteer at 375×667, 393×852, 440×956, 744×1133, 820×1180,
834×1194, 1032×1376, 1133×744, 1180×820, 1376×1032 and 1440×900, plus a click
on each phone (liked state, burst and floats present).

## 2026-10-14: the reel phone on iPad Air and Pro held upright

The user asked for the desktop hero on iPad. Held sideways, iPads already got
it. Held upright, the portrait composition was kept and only its proof rail
was swapped for the playing reel phone, as desktop does (the user picked this
over the full desktop layout).
- **iPad Air / Pro upright (portrait, 800–1100 px):** the phone sits beside
  the caption, bottom-aligned, `--reel-phone-w: clamp(14.5rem, 28vw, 18rem)`.
  The caption is capped at 32rem and the rail is hidden.
- **iPad mini upright (744 px):** unchanged. There is no room for the caption
  and the phone side by side.
- **`Hero.tsx`:** `NO_REEL_QUERY` replaces the compact query for everything
  reel-related: the video, the rotation and the intro. The layout itself still
  follows the compact CSS block.

Verified at 744×1133, 820×1180, 834×1194, 1024×1366 and 1180×820. There is no
overlap between the caption and the phone, and no horizontal overflow.
