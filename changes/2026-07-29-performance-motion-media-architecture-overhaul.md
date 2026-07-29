# Performance, Motion, and Media Architecture Overhaul

Date: 2026-07-29  
Shipped commit: `510104c` (`perf: overhaul rendering motion and media architecture`)

## Purpose

This is the source-of-truth record for the July 2026 performance overhaul. It
documents the forensic findings, architectural decisions, shipped changes,
quality invariants, measured results, and remaining release gates.

The objective was not to make the site fast by making it visually simpler. The
objective was to preserve or improve the artwork, motion, transitions, video
quality, bilingual content, accessibility, and SEO while removing unnecessary
work from the critical rendering path.

## Starting Baseline

Controlled local Lighthouse measurements before the overhaul:

| Route family | Mobile performance | Initial transfer | LCP |
| --- | ---: | ---: | ---: |
| Homepage | 68 | 5.2 MiB | 10.5 s |
| Media-heavy service | 86 | 3.9 MiB | Not separately recorded |
| Text/resource page | 97 | 300 KiB | Not separately recorded |

The homepage could mount as many as 31 video elements. Hidden videos, poster
requests, hero motion, full-viewport effects, route JavaScript, and font
requests competed during the same startup window.

## Forensic Findings

### Rendering and delivery

1. Static route files were addressable, but React still replaced a loading
   shell rather than hydrating complete route markup.
2. Mobile/desktop runtime branches could produce different trees before the
   viewport decision stabilized.
3. One large global stylesheet covered unrelated route families and delayed
   complete styling.
4. Google-hosted font behavior and broad face loading added avoidable critical
   path work.
5. Runtime language detection duplicated information already encoded in the
   pathname.
6. Source masters, working encodes, and archive files lived too close to
   deployable public assets, making accidental production copying likely.

### Media

1. Portfolio, hero, service, vertical, collage, and marquee surfaces could each
   create their own video elements and playback policy.
2. Hidden preload and prewarm paths fetched media that the visitor had not
   selected.
3. Poster files were too large for card-sized rendering.
4. Parallel MP4 and HLS arrays could drift when an optional source was missing,
   pairing the wrong stream and fallback.
5. Theater startup waited for the high-quality stream before showing a moving
   frame, producing black-frame or spinner perception.
6. Forcing or eagerly favoring the top adaptive rendition delayed startup and
   ignored the measured player size.
7. Mobile GPUs and decoders were pressured by duplicate ambient playback even
   when most tiles were visually secondary.

### Motion

1. Site-wide smooth-scroll interpolation and a continuous animation ticker
   added work to every scroll frame.
2. Full-viewport blur, permanently promoted layers, and many independent
   moving poster surfaces increased raster and compositing pressure.
3. Motion dependencies were used for effects that the browser can execute more
   cheaply with CSS transforms, opacity, native scrolling, and short-lived
   `requestAnimationFrame` loops.
4. Some animation systems continued while offscreen or while the document was
   hidden.
5. Text-reveal logic was heavier than necessary and could become unstable while
   fonts settled.

### Code and dependency graph

1. Portfolio and theater responsibilities were duplicated across page
   families.
2. Viewport, playback, visibility, reduced-motion, and scroll behavior were
   repeatedly implemented at component level.
3. The repository contained a large unused shadcn/Radix surface and obsolete
   motion/hero modules.
4. Generated route, catalog, and SEO files did not have one clearly documented
   alignment rule.

## Shipped Architecture

### 1. Build-time prerendering and hydration

- `src/entry-server.tsx` renders every registered route on the server build.
- `scripts/prerender.mjs` injects rendered markup into all 40 route documents.
- `src/client-runtime.tsx` calls `hydrateRoot()` when the document is marked
  `data-prerendered="true"` and falls back to `createRoot()` only for a
  non-prerendered development shell.
- Home, service, vertical, resource, and legal templates have dedicated client
  entrypoints:
  - `src/entry-home.tsx`
  - `src/entry-service.tsx`
  - `src/entry-vertical.tsx`
  - `src/entry-resource.tsx`
  - `src/entry-legal.tsx`
- Registered cross-route links use full document navigation. Each destination
  receives its route-specific data, metadata, critical CSS, and hydrator
  without downloading every page factory.
- Stable responsive shells keep server and client markup aligned. CSS selects
  the visible mobile or desktop composition where a template has distinct
  layouts.

### 2. Critical CSS and fonts

- `src/index.css` now owns shared tokens and homepage/runtime styles.
- `src/styles/templates.css` owns service, vertical, resource, and legal
  template styling.
- `src/styles/template-critical.css` contains the small above-the-fold template
  subset that prerendering can inline.
- Beasties extracts selector-matched critical CSS from the fixed navigation and
  first visible route section. The complete rich animation sheet remains
  available with low-priority stylesheet loading.
- Fonts are self-hosted WOFF2 files. Only the required body and hero faces are
  preloaded; editorial variants are loaded after intent or an 8-second fallback.
- `scripts/normalize-entrypoint-fonts.mjs` and
  `scripts/generate-font-subsets.sh` own entrypoint normalization and subset
  generation.

### 3. Path-owned locale runtime

- `src/lib/locale-context.tsx` derives `es` or `en` from
  `src/lib/locale-path.ts`.
- Translation dictionaries remain bundled JSON and use a small path resolver
  plus interpolation function.
- Runtime i18next language detection and its dependencies were removed.
- `src/lib/locale-path.ts` remains the route, locale-pair, and static-entrypoint
  source of truth.

### 4. Typed media model

`src/lib/media-assets.ts` defines:

- `ResponsivePoster`: intrinsic dimensions, fallback, placeholder, and typed
  AVIF/WebP/JPEG sources.
- `PreviewAsset`: compact preview URL and optional codec/byte metadata.
- `PlaybackCandidate`: one atomic MP4/HLS pair with quality intent.

Playback candidates are validated and de-duplicated as whole records. MP4 and
HLS sources are never filtered in separate arrays, eliminating index
misalignment.

### 5. Decoder scheduling and theater ownership

- `src/lib/media-playback-scheduler.ts` grants one ambient playback slot by
  priority: theater, hero, preview, ambient, background.
- `src/hooks/use-media-playback-slot.ts` registers component demand with that
  scheduler.
- `src/components/media/MediaSessionProvider.tsx` publishes theater ownership.
  Opening a theater pauses and unloads every non-theater source.
- Portfolio cards are responsive pictures by default. Only the active mobile
  card or the desktop card with real pointer/focus intent mounts a preview.
- The scheduler also stops playback when the document is hidden and re-evaluates
  on viewport or connection changes.
- There are zero full-length or HLS requests before user intent and no more than
  one granted ambient decoder.

### 6. Quality-first theater startup

- `src/components/media/TheaterVideo.tsx` starts an exact-copy, fast-start bridge
  immediately.
- The bridge is the first 1.6 seconds of the existing mobile master, copied
  without re-encoding. It can retain audio and does not introduce a lower
  visual generation.
- The adaptive master buffers behind the bridge, synchronizes to its current
  time, and crossfades over 260 ms with opacity only.
- The bridge is then paused, detached, and unloaded.
- If HLS is unavailable, playback falls through intact playback candidates to
  the progressive MP4 instead of presenting a black frame.
- `hls.js/light` loads only when an eligible HLS source is attached. Safari and
  iOS continue to use native HLS.
- HLS starts in automatic mode, caps levels to player size, and includes device
  pixel ratio for theater playback so high-density displays can select genuinely
  sharp renditions.

### 7. Quality-preserving media pipeline

- Source masters live under `media-sources/`, outside `public/`.
- Working HLS, encode, and R2 upload directories remain gitignored under `tmp/`.
- Deployable runtime media is limited to versioned poster and startup assets.
- `scripts/generate-responsive-posters.sh` produces widths 180, 360, 720, and
  1080 in AVIF, WebP, and JPEG. Current inventory: 348 files, about 18 MiB total.
- `scripts/generate-startup-videos.mjs` produces 26 versioned exact-copy startup
  bridges. Current inventory: about 15 MiB total.
- `scripts/encode-hls.sh` generates 1-second CMAF/fMP4 segments in AV1, HEVC,
  and H.264 at 360, 540, 720, 1080, 1440, and 2160 where the source resolution
  permits. It never upscales.
- Rotation metadata is accounted for before rendition dimensions and manifest
  `RESOLUTION` values are calculated.
- AV1 and HEVC reduce delivery bytes at comparable perceptual quality; H.264 is
  the universal fallback.
- R2 assets use versioned keys and immutable caching. Range responses, CORS,
  content types, cache headers, and Cloudflare cache status were verified
  during the implementation.

Quality invariant: optimization may change containers, codecs, delivery order,
or responsive selection, but it must not upscale weak sources, transcode a
startup bridge to a visibly weaker generation, or cap a high-resolution source
below the display/player need.

### 8. Motion runtime

- Lenis, GSAP, Framer Motion, Three.js, and their continuous global runtimes
  were removed from the dependency graph.
- Native scrolling owns the scroll pipeline through
  `src/lib/motion/native-scroll.ts`.
- Entrances and reveals use CSS transforms/opacity and lightweight
  intersection-driven wrappers.
- The editorial hero renders optimized poster frames and at most one lead video
  after genuine intent.
- The former Three.js/WebGL atmosphere was intentionally removed. The approved
  title-sequence hero does not need a canvas: its richer effect is achieved
  with already-rasterized layers and compositor transforms at substantially
  lower startup cost.
- The hero key light runs only on fine-pointer desktop devices, loads during
  idle time, interpolates with a time-based exponential lerp for consistent
  60/90/120 Hz behavior, stops when settled, and pauses offscreen or in hidden
  tabs.
- `will-change` is applied only while a layer is actively settling and is reset
  afterward.
- Reduced-motion visitors receive complete visible content without entrance
  delays or ambient playback.
- Deferred sections retain their visual entrances but do not compete with LCP.

### 9. Simplification

- Unused UI primitives and their unused Radix dependencies were removed. Only
  the drawer primitive needed by the mobile shell remains.
- Obsolete hero wall, hero atmosphere, motion variants, smooth-scroll, toast,
  and unused interaction hooks were removed.
- Shared `MediaTheater`, `TheaterVideo`, `AdaptiveVideo`,
  `ResponsivePosterImage`, media intent, and playback scheduling now serve
  multiple page families.
- `Portfolio.tsx` fell from 1,682 to 1,023 lines and now delegates adaptive
  playback, candidate construction, poster rendering, and theater video
  behavior. Its rail/controller interaction still lives in one file and is the
  next reasonable extraction point if future feature work expands it.

## Validation Record

All results below are controlled local/preview results from this overhaul, not
field Core Web Vitals.

| Validation | Result |
| --- | --- |
| Production build | Passed; 40 routes prerendered |
| TypeScript | Passed |
| Vitest | 53/53 passed |
| ESLint | 0 errors; 6 Fast Refresh warnings |
| Static route integrity | 40/40; no missing assets |
| Hydration/console smoke tests | No hydration or console errors |
| Desktop Lighthouse template matrix | 100 Performance, Accessibility, Best Practices, and SEO |
| Mobile Lighthouse non-performance categories | 100 Accessibility, Best Practices, and SEO |
| Default simulated mobile performance | 95–98 depending on route/run |
| Direct measured visual LCP | 117–186 ms in the local measurement harness |
| DevTools-throttled service route | 100/100/100/100; LCP 0.90 s |
| Cold fast-4G tap-to-first-frame | 324 ms |
| Warm tap-to-first-frame | 36 ms |
| Pre-intent full/HLS requests | 0 |
| Active ambient preview decoders | 1 maximum |
| Motion trace | No long tasks over 50 ms; p95 frame interval 9.7 ms |

The universal controlled 100 performance target remains a release gate, not a
claim about every Lighthouse simulation. The remaining 2–5 mobile points came
from Lighthouse's hydration/main-thread model even when directly observed LCP
was already far below the 1.8-second budget. Do not hide this distinction by
removing animation or media quality.

## Lighthouse Matrix and Budgets

Run:

```bash
npm run build
npm run lighthouse:mobile
npm run lighthouse:desktop
# or both
npm run lighthouse:matrix
```

The matrix in `lighthouse.shared.cjs` covers Spanish and English examples of:

- home
- service
- vertical
- resource
- legal

Required assertions:

- all four Lighthouse category scores: 1.00
- FCP: at most 1.2 s
- LCP: at most 1.8 s
- TBT: at most 50 ms
- CLS: at most 0.01
- initial JavaScript: at most 150 KiB
- stylesheet transfer: at most 20 KiB
- homepage transfer: at most 800 KiB
- other route transfer: at most 900 KiB
- initial media transfer: 0 before intent

## Operational Rules

1. Add routes through `src/lib/locale-path.ts`; do not hand-list Vite inputs.
2. Never hand-edit `src/data/nuevos-r2-ready.ts`; regenerate it with
   `npm run video:catalog`.
3. Never place source masters, ZIP archives, local HLS ladders, or upload
   workspaces under `public/`.
4. Keep MP4 and HLS URLs in the same `PlaybackCandidate`.
5. Do not bypass the playback scheduler for ambient autoplay.
6. Opening any theater must acquire the media session and unload ambient media.
7. Do not preload full-length or HLS media without genuine user intent.
8. Preserve native-resolution quality. Performance fixes should improve
   delivery, selection, caching, or scheduling before reducing source quality.
9. Animation work should default to transform and opacity, pause when hidden,
   avoid permanent layer promotion, and honor reduced motion.
10. A new global ticker, virtual-scroll runtime, full-viewport animated blur, or
    multi-decoder card wall requires a recorded trace demonstrating that it fits
    the frame and decoder budgets.

## Post-Deploy Regression Fixes — 2026-07-30

Four defects were reported against the deployed site and reproduced there. All
four came from this overhaul and none of them reproduced in local development,
which is exactly the gap follow-up 4 below was written to cover. Each root cause
and its verification is recorded here.

### 1. Accented asset filenames 404 on Vercel (hero and portfolio posters)

`media-sources/nuevos/manifest.csv` is read on macOS, which hands back
**decomposed (NFD)** filenames — `Detrás de cámaras`, `a` + U+0301.
git stores the **precomposed (NFC)** form, so the Vercel checkout has NFC
filenames while the generated catalog asked for NFD. APFS compares
normalization-insensitively, so every NFD URL resolved locally; Linux and the
Vercel CDN match bytes, so they returned 404.

Clip `1007` (`Detrás de cámaras`) is the only accented clip in the catalog and
is the **fixed hero lead frame**, so the failure landed on the centre frame of
the homepage hero and on that clip's portfolio card and service poster.

Measured on the live deployment before the fix:

| URL form | Result |
| --- | --- |
| `…/poster-variants/v1/Detra%CC%81s%20de%20ca%CC%81maras-720.avif` (NFD, what the build emitted) | `404` |
| `…/poster-variants/v1/Detr%C3%A1s%20de%20c%C3%A1maras-720.avif` (NFC) | `200 image/avif` |

R2 (`media.giselasaldarriaga.com`) serves both forms, so only the
Vercel-hosted `/uploads/…` paths were affected — the video sources were never
broken.

Fixed in two layers:

- `scripts/generate-nuevos-r2-catalog.mjs` normalizes the source filename to
  NFC once, before any URL is derived. The catalog was regenerated; its own R2
  readiness check passed 16/16 against the new URLs.
- `src/data/portfolio-clips.ts` exports `toDeployedAssetName()` and applies it
  wherever a `/uploads/…` path is built, so hand-authored or stale catalog data
  cannot reintroduce the bug. `src/components/ServicesMarquee.tsx` uses the same
  helper.

There is no NFD sequence left anywhere in `src/` or `dist/`.

**Rule:** any locally hosted asset path must be precomposed before it is
percent-encoded. Never trust a filename read from the macOS filesystem.

Note for local verification: `vite preview` serves the accented file with
`Content-Type: text/html`, because its static index is keyed by the NFD name on
disk. That is a dev-server artifact — Vercel serves the same path as
`image/avif`. Do not judge this fix from `npm run preview`.

### 2. Cross-route jumps rendered a blank page first

`client-runtime.tsx` turns registered anchor clicks into document navigations,
because each prerendered document registers exactly one route family in its
hydrator. `Navbar.tsx` and `MobileTabBar.tsx` were still also calling
react-router's `navigate()` for the same destinations. The router push committed
first, against an entry that has no component for the destination family, so
`AppRoutes` rendered nothing until the queued document load landed.

Measured on the live deployment: a client-side route change from home to a
service path dropped `#root` from **455 characters of text to 36** — only the
mobile tab bar survived. On the app-shell tab bar this ran on every
Inicio/Portafolio/Servicios jump, which is what read as the site "struggling"
when moving between pages.

The locale toggle was worse than blank: `/servicios/x/` → `/en/services/x/`
matches a route the service entry *does* register, so it would have rendered the
English route against the Spanish document's embedded `route-data`.

- Anchor handlers now only run their on-home behaviour (smooth scroll, closing
  the mobile menu). Off home they do nothing and let the runtime own the
  navigation.
- `src/lib/route-navigation.ts` adds `navigateToRoute()` for the two
  programmatic cases — the locale toggle and the back button's fallback. The
  back button itself now calls `window.history.back()`.
- No `useNavigate`/`navigate()` call remains in `src/components/`.

Verified: the locale toggle on a service page now destroys the JS context and
lands on `/en/services/spokesperson-videos/` with `lang="en"`, the English
title and H1, `data-prerendered="true"` and its own `route-data`.

### 3. Portfolio theater opened invisible

`openReelPreview` set `activeReelPreview` urgently but reset the entrance
bookkeeping — including `setIsTheaterVisible(false)` — inside
`startTransition`. The open effect schedules `setIsTheaterVisible(true)` on a
`requestAnimationFrame` after the urgent commit. Whenever the main thread was
busy enough for React to defer the transition past that frame, the `false` won
and the card stayed at `opacity: 0` behind a fully dimmed backdrop — a modal
that swallows the page and shows nothing. Load-dependent, so it looked
intermittent.

The reset now runs in the same urgent pass that mounts the theater, so there is
no competing writer for `isTheaterVisible`. `queueTheaterDrag(0)` was replaced
with a direct `setTheaterDragY(0)` plus a pending-ref reset, which is
equivalent and immediate.

The video pipeline itself was not at fault. Confirmed on the live deployment
that the theater starts the exact-copy bridge, syncs, and hands off to the full
adaptive master (`duration 23.13 s`, `readyState 4`).

### 4. The mobile app dock covered the bottom of the hero

`nav.mtabbar` is `position: fixed`, 74 px tall, `z-index: 120`. The hero stage
was `min-height: max(35.5rem, 100svh)` and every hero element is positioned
against that stage, so the composition ran underneath the dock. Measured at
375×812 before the fix:

| Element | Position | Dock occupies 738–812 |
| --- | --- | --- |
| Film frames (bottom) | 775 / 745 / 777 | clipped |
| `MEDELLÍN · ES / EN · UGC` | 782–790 | completely hidden |

`--app-dock-clearance` is now a root token — `0px` above the mobile breakpoint
where the dock is `display: none`, and `calc(4.25rem + env(safe-area-inset-bottom, 0px))`
below it. It replaces the two literals that already encoded that value, and the
hero stage subtracts it so the composition lays out in the space the dock
leaves.

After, same viewport: frames end at 707 / 677 / 709 and the metadata sits at
714–722 — all clear of 738. The stage is 744 instead of 812, so the title (at
`top: 38%`) moves up 25 px to 283–359 while the centre frame moves up 68 px to
333. The frames still start below the wordmark rather than obscuring it,
satisfying hero guardrail 6.

**The intentional frame rotations were not touched** (left `-6.5deg`, centre
`1.2deg`, right `6.2deg`). Straightening them was tried twice before and rolled
back — see the hero document's superseded-iterations list.

### Validation

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed |
| `npm run lint` | 0 errors; 6 pre-existing Fast Refresh warnings |
| `npm test` | 53/53 passed |
| `npm run build` | Passed; 40 routes prerendered |
| NFD sequences in `src/` and `dist/` | 0 |
| Catalog R2 readiness | 16/16 |
| Live NFC poster paths | `200` with correct image content types |

Still owed, because it needs the deployed build: re-run the Lighthouse matrix
and re-check tap-to-first-frame on the hero and theater once this is live.

## Remaining Follow-up

1. Make the default LHCI mobile simulation consistently reach 100 without
   weakening animation or media quality.
2. Continue splitting route/component CSS if the 20 KiB transferred stylesheet
   gate regresses; do not move noncritical CSS back into the inline block.
3. Extract the remaining portfolio rail/controller state if new portfolio
   behavior increases file complexity.
4. Run the full deployed-preview matrix after any R2, Vercel, CSP, font, or
   prerender change because local cache behavior cannot prove edge behavior.
5. Monitor real-user Core Web Vitals separately. Lab 100 is a release control,
   not a substitute for production p75 data.

