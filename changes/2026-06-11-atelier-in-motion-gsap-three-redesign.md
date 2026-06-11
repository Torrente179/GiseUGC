# "Atelier in Motion" — GSAP + three.js next-gen visual layer

**Date:** 2026-06-11

## Direction

Re-imagine the home page's presentation with GSAP + three.js while keeping the
existing structure, palette, light/dark themes, and the services-page cinematic
hero untouched. Explicitly NOT a fullscreen-video takeover (the reverted
`77835ff` spatial reel director was that — rejected). Motion is atmosphere and
choreography in service of the portfolio, never a replacement for it.

Three directions were considered; "Atelier in Motion" (quiet-luxury editorial,
continuity + depth) won because it respects the approved IA and reads premium
without spectacle.

## What was built

### 1. Living-silk hero atmosphere (three.js) — `src/components/three/HeroAtmosphere.tsx`
- Domain-warped fbm shader in the brand palette (deep ebony base, coastal-teal
  threads, warm-sand ridge highlights, washed-khaki midtones) + grain + vignette.
- **Replaces the blurred ambient video on desktop** — one fewer video decoder;
  the blurred poster paints instantly underneath and remains the fallback.
- Budget: 0.7× resolution, DPR 1, `low-power` GPU hint, rAF only while hero is
  on-screen and tab visible, WebGL-failure/context-loss → hides itself.
- Gated: desktop + fine pointer + no reduced-motion + no save-data, mounted on
  idle via `React.lazy` (own chunk, three split as vendor chunk).
- Subtle pointer drift (lerped uniform). Hero is forced-dark so the palette is
  fixed — no theme tracking needed.

### 2. Curtain handoff (hero → page) — `Hero.tsx` + `use-hero-motion.ts`
- Desktop: dark hero viewport is `sticky top-0` inside a `150svh` pin zone; the
  intro band (`data-hero-curtain`, `-mt-[50svh]`, rounded-t-[2.75rem] + soft top
  shadow) physically slides over the pinned stage. Native scroll — no jacking.
- GSAP scrub grade while covered: stage scale → 0.955 + border-radius 2.25rem +
  black dim → 0.45; identity drifts up (−7%), reel deck counter-drifts (+4%,
  scale 1.02) for depth.
- Mobile: zero change — no pin, no extra scroll, normal flow.
- NOTE: section-level `overflow-hidden` moved to the inner dark viewport
  (sticky dies inside overflow-hidden ancestors); `max-md:overflow-hidden`
  retained on the section.

### 3. Hero entrance cascade (CSS-only, no JS dependency)
- Name lines rise out of per-line overflow masks (`.hero-line-mask` /
  `.hero-line`, transform-only, pretext-style descender padding).
- Byline → subtitle → CTAs → proof strip stagger in via `.hero-cascade-item`
  with `--cascade-i` delays; teal byline hairline draws (`scaleX`).
- Replaces the old single-block `.hero-enter`. Reduced-motion resets all.

### 4. Magnetic CTAs — `use-magnetic.ts`
- Hero primary/secondary lean toward the pointer (per-move `gsap.to`,
  `overwrite: 'auto'`), elastic release on leave.
- `.is-magnetic` class removes `transform` from the buttons' CSS transition
  list — otherwise the CSS transition re-eases GSAP's per-frame writes and the
  magnet appears dead (first implementation with `quickTo` + CSS transition
  fought exactly this way).

### 5. Portfolio rail physics — `use-velocity-skew.ts`
- The showcase reel rail shears up to ~1.3° with scroll velocity and settles
  with `power3` — applied to the inner rail wrapper (NOT an ancestor of the
  fixed-position theater overlay, verified; transforms there would break it).

### 6. Scroll progress hairline — `ScrollProgressHairline.tsx`
- Fixed 2px teal thread at the very top (z-120), `scrub: 0.4` to `end: 'max'`.
- A debounced `ResizeObserver` on `<body>` calls `ScrollTrigger.refresh()` so
  deferred-mounted home sections keep trigger math honest.
- Desktop only; hidden on mobile + reduced-motion.

### Infrastructure
- `src/lib/motion/gsap-core.ts` — single lazy loader (`loadGsap()`), registers
  ScrollTrigger once; guards: `shouldEnableRichMotion()` (≥768px + fine
  pointer + no reduced motion), `whenIdle()`.
- `vite.config.ts` — `gsap` and `three` vendor chunks. Nothing new on the
  critical path: gsap/three only load on idle, desktop.
- deps: `gsap@^3.15`, `three@^0.184` (+ `@types/three`).

## Verified (dev server, 1440×900 + 375×812)

- Silk renders and fades in over the poster; zero console errors (replaced
  deprecated `THREE.Clock` with rAF timestamps).
- Curtain: numerically verified via ScrollTrigger state at scroll 0/320/620/900
  (scale, dim, radius, identity drift all scrub correctly; pristine at rest).
- Magnetic CTA: +17.6px lean on synthetic pointermove, elastic settle to 0.
- Rail skew: live `skewY` matrix during fast scroll, eases back to 0.
- Mobile: no canvas, no hairline, no pin (`pinZone == viewport`), story stack
  + cascade intact, no horizontal overflow.
- Dark mode: curtain surface follows `--background` ✓. Services-page cinematic
  hero (`svc-cine-*`) untouched ✓.
- `tsc -p tsconfig.app.json` clean, eslint clean on all touched files.
- Known tooling quirk (not a site bug): the preview tool's screenshots misplace
  sticky/fixed layers after **programmatic** `scrollTo` — DOM geometry
  (`getBoundingClientRect`) confirmed correct positions in all cases.

## Files

- `src/components/three/HeroAtmosphere.tsx` (new)
- `src/lib/motion/gsap-core.ts` (new)
- `src/hooks/use-hero-motion.ts`, `src/hooks/use-magnetic.ts`,
  `src/hooks/use-velocity-skew.ts` (new)
- `src/components/motion/ScrollProgressHairline.tsx` (new)
- `src/components/Hero.tsx` — curtain structure, cascade markup, silk mount
- `src/components/Portfolio.tsx` — rail skew ref (3 lines)
- `src/pages/Index.tsx` — hairline mount
- `src/index.css` — cascade/silk/hairline/is-magnetic blocks (replaces
  `.hero-enter`)
- `vite.config.ts`, `package.json`
