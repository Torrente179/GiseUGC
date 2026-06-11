# "The Director's Cut" — Session 1: constellation hero, smooth scroll, chapters

**Date:** 2026-06-11
**Plan:** whole-site cinematic reimagining (user-approved, 3 sessions). This
session: the transformation — scroll system + chapters 1–3.

## What shipped

### Smooth-scroll system (site-wide, desktop only)
- `src/lib/motion/smooth-scroll.ts` — Lenis singleton (`lenis@1.3`) bridged to
  ScrollTrigger via `gsap.ticker` (`lagSmoothing(0)`), guarded by
  `shouldEnableRichMotion()`. `scrollToY(y, { immediate })` forces position
  even while stopped (overlay restorations).
- A MutationObserver on `html[data-theater]` pauses/starts Lenis for EVERY
  theater on the site (home portfolio + service + vertical pages) from one
  place. The Testimonials lightbox (no data-theater) stops/starts explicitly.
- Integrations: `use-hashless-section-navigation` routes through
  `lenis.scrollTo`; `App.tsx` scroll restoration uses the facade; init is
  idle-deferred in App.
- `ensureAutoRefresh()` moved into `gsap-core.ts` (debounced body
  ResizeObserver → `ScrollTrigger.refresh()`), shared by every rig.

### Chapter 1 — Reel Constellation (hero rebuilt)
- `src/components/three/ReelConstellation.tsx` (lazy chunk): 14 of her reels
  as 9:16 poster planes in a fogged 3D field (hand-tuned slots, corridor down
  the middle, rounded-corner alpha mask, idle float, pointer-parallax camera).
  Focus card plays ONE video texture negotiated through the playback
  scheduler ('hero' priority). DPR ≤1.5, rAF only in-view, context-loss safe.
- `src/hooks/use-constellation-scroll.ts`: pins the stage `+=160%`, scrubs
  `constellationState.progress` (camera dolly 9 → -38 *through* the field;
  cards part to the sides and dissolve as the camera passes), identity
  overlay drifts out at 10–50%, exit veil fades to ink at 75–100%.
- `Hero.tsx` rebuilt: desktop = DOM poster collage (instant paint +
  no-WebGL/reduced-motion fallback) under the canvas + identity overlay
  (cascade entrance + magnetic CTAs kept); mobile = approved story stack,
  untouched. Curtain pin-zone, HeroReelDeck usage and the intro band are gone
  from Hero.

### Chapter 2 — Manifesto
- `src/components/chapters/ManifestoChapter.tsx` absorbs HeroIntroduction +
  SocialProof: chapter label, giant statement (PretextLineReveal,
  `dc-statement`), 4 oversized animated numerals (`dc-numeral`, counters).
  Replaces both sections on desktop AND mobile.

### Chapter 3 — Gallery (portfolio)
- Desktop: pinned `100svh` stage; vertical scroll scrubs the card track
  horizontally 1:1 (`x: -(scrollWidth - viewport)`, invalidateOnRefresh),
  live `01/26` counter via direct textContent writes, velocity skew on the
  track. Cards enlarged to `clamp(230px, (100svh - 21rem) * 9/16, 340px)`.
- Track viewport is natively swipeable by default (tablets / reduced motion);
  the pin rig sets `overflow hidden` when the scrub owns it.
- ALL existing machinery reused untouched: theater overlay + scroll lock,
  prewarm/preload, scheduler, clip data, mobile rail (restyled card widths
  only — md/lg fixed widths removed from the shared card, mobile keeps
  70vw/55vw).
- `Index.tsx`: chapter order; hero + manifesto + desktop portfolio mount
  eagerly (pin-math stability); testimonials/marquee/mobile-portfolio stay
  deferred. Services/CreatorAdvantage/FAQ unchanged (sessions 2).

### CSS
- New `dc-*` family in index.css: constellation host/canvas/fallback collage,
  hero scrim, gallery stage/viewport/track/card/meta, `dc-numeral`,
  `dc-statement`, `dc-chapter-label`. Reduced-motion hides the canvas and
  keeps everything readable.

## The bug that mattered (and its fix)

ScrollTrigger `pin: true` re-parents the pinned element into a `.pin-spacer`
div. Portfolio renders CONDITIONAL sibling divs (video prewarm stashes) into
the same section — when one mounted, React called `insertBefore` against the
re-parented stage → `NotFoundError` → the entire root unmounted (no error
boundary). **Fix:** every pinned element is wrapped in a static "pin shell"
div that React owns and never reconciles against (Hero + Portfolio). If a
future section pins, it must use the same shell pattern.

## Verified (dev server 1440×900 + 375×812)

- Fly-through progress 0 / 0.5 / 0.97 / 1 at scroll 0/720/1400/2340; identity
  opacity 1→0 mid-flight; exit veil 0→1 in the last quarter.
- Gallery: track x = -2000 at pin+2000, -5000 at +5000 (1:1 scrub); live
  counter; prewarm divs mount WITH pins active (crash fixed, root alive).
- Theater: card click → `data-theater=open`, Lenis stopped, body fixed;
  Escape → closed, scroll restored to exact px, Lenis restarted.
- Anchor: hero CTA → lands at #portfolio ±1px through Lenis.
- Mobile 375: no canvas/Lenis/pins; story stack + manifesto + rail intact; no
  horizontal overflow.
- Theme toggle: manifesto/numerals flip light↔dark correctly.
- `tsc` clean; eslint clean on the full regression list + all new files; zero
  console errors after fresh load.
- Tooling notes: preview viewport emulation drops after navigation (re-run
  resize); screenshots render in a corner but in-page metrics are authoritative.

## Files

New: `src/lib/motion/smooth-scroll.ts`, `src/components/three/ReelConstellation.tsx`,
`src/components/three/constellation-state.ts`, `src/hooks/use-constellation-scroll.ts`,
`src/components/chapters/ManifestoChapter.tsx`.
Modified: `Hero.tsx`, `Portfolio.tsx`, `Index.tsx`, `App.tsx`, `Testimonials.tsx`,
`use-hashless-section-navigation.ts`, `gsap-core.ts`, `ScrollProgressHairline.tsx`,
`index.css`, `package.json` (+lenis).
Dormant (session 2 cleanup): HeroReelDeck, use-hero-motion, SocialProof,
HeroIntroduction, hero-deck CSS.

## Next sessions

2: Services Index rows · Method sticky-split · Proof/FAQ restyles · Finale
chapter (silk + giant CTA, id="contact") · remove dormant components.
3: inner-page st-* design-language pass (svc-cine-* hero untouched) · GSAP
page transitions · navbar polish.
