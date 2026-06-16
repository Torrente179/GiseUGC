# Home redesign — full arc overview (June 2026)

A single map of the home-page reimagining, in order, with what's **live** vs
**superseded** and where the granular detail lives. The brief: "re-imagine the
site with GSAP + three.js — a branded UGC portfolio clients browse, then contact
Gise — keep the palette, light/dark themes, and the services-page hero."

## Timeline

| # | Commit | Title | Status |
|---|--------|-------|--------|
| 0 | `77835ff` → `d1dc1a6` | spatial reel director (fullscreen, scroll-jacked) | **reverted** before this arc — rejected as a fullscreen-video takeover |
| 1 | `39e8617` | **Atelier in Motion** — GSAP choreography + three.js silk on the existing layouts | **superseded** — "just added animations and backgrounds," not a redesign |
| 2 | `41cae34` | **Director's Cut session 1** — constellation hero, Lenis smooth scroll, Manifesto chapter, pinned horizontal gallery | **partly live**: Lenis + Manifesto + `dc-*` foundation stay; the constellation hero & pinned gallery were replaced |
| 3 | `08db57a` | **Cartel de estudio** — poster type system, reel-card anatomy, services editorial index | **partly live**: services index + card anatomy stay; that hero was replaced |
| 4 | `bc37c57` | **Muro de trabajo** — full-bleed reel-wall hero (desktop) + free-scroll gallery; constellation deleted | **LIVE** |
| 5 | `08db57a`…`bc37c57` | **Hero direction audition** — built C·Cartelera & A·Portada, reverted, kept B | doc only (C/A never committed) |
| 6 | `e04a208` | **Mobile app shell** — persistent bottom tab bar + vaul contact sheet + inner-page back control, site-wide | **LIVE** |
| 7 | `e803d8e` | **Mobile "Muro de trabajo"** — desktop reel-wall hero brought to mobile (3 CSS-drift columns) | **LIVE** |

Per-session detail:
- `2026-06-11-atelier-in-motion-gsap-three-redesign.md`
- `2026-06-11-directors-cut-session-1-constellation-gallery.md`
- `2026-06-13-cartel-de-estudio-visual-language.md`
- `2026-06-13-muro-de-trabajo-hero-free-scroll-gallery.md`
- `2026-06-14-hero-direction-audition-and-decision.md` (C & A specs + source, recoverable)
- `2026-06-14-mobile-app-shell-bottom-nav.md`
- `2026-06-15-mobile-muro-de-trabajo-hero.md`

## Current live home (Index.tsx order)

1. **Hero — "Muro de trabajo"** (`Hero.tsx`, `use-hero-wall.ts`, `.dc-wall*`):
   a full-bleed wall of reel posters on **both** breakpoints. Desktop = 5 columns,
   GSAP drift + pointer parallax + velocity speed-up. Mobile = 3 columns, CSS
   `@keyframes dc-wall-drift` (no GSAP/WebGL), bottom-heavy scrim, 6 tiles/column.
   Name/pitch/credits/CTAs over the scrim; force-dark; reduced-motion stops drift.
2. **Manifesto** (`chapters/ManifestoChapter.tsx`): statement (`PretextLineReveal`)
   + four oversized animated numerals (absorbed HeroIntroduction + SocialProof).
3. **Gallery — free-scroll rail** (`Portfolio.tsx`): desktop native `overflow-x`
   rail (drag / arrows / trackpad), live `NN/26` counter, drag-end click guard;
   cards keep chips + title band + ghost numerals; opens the existing theater.
   No pin, no scroll-jack.
4. **Services — editorial index** (`Services.tsx`, `.dc-index-*`): numbered serif
   rows, hover → italic-teal + tilted reel preview. *(User: keep as-is.)*
5. **Method** (`CreatorAdvantage.tsx`) — not yet restyled.
6. **Proof** (`Testimonials.tsx`) — marquee + lightbox; minor Lenis stop/start.
7. **FAQ** (`FAQ.tsx`) — not yet restyled.
8. **Toolkit marquee** (`ServicesMarquee.tsx`) → **Footer** (`PageEndStrip`).
- Site-wide desktop: `ScrollProgressHairline`, Lenis smooth scroll,
  `FloatingContactDock` (desktop-only now).

## Current mobile app shell (site-wide, `MobileAppShell.tsx`)

A native-app navigation layer mounted once from `App.tsx` (gated `useIsMobile`):

- **Bottom tab bar** (`MobileTabBar.tsx`, `.mtabbar`): persistent frosted bar on
  every route — Inicio · Portafolio · Servicios · Contacto. Scroll-spy
  (`use-active-section.ts`) + route-aware active tab with a framer-motion
  `layoutId` indicator; section tabs route through the existing hash-nav.
- **Contact sheet** (`MobileContactSheet.tsx`, vaul): replaces the floating
  bubble; 8 channels from the shared `contact-channels.ts`; bridged to the
  `contact-dock` event so every "Contactar" CTA opens it; tab bar hides while open.
- **Inner-page back control** (Navbar, mobile): chevron before the brand,
  `navigate(-1)`; the OS keeps the edge-swipe. The full-screen hamburger overlay
  stays as the secondary "more" menu (sheet conversion deferred — see follow-ups).
- Route transition: home wrapped in the keyed `.page-enter` opacity cross-fade
  (transform-based page slides avoided — the fixed navbar/tab bar live inside the
  routed tree and a transformed ancestor would break their fixed positioning).

## Systems introduced (live, reusable)

- **`src/lib/motion/gsap-core.ts`** — single lazy `loadGsap()` (+ ScrollTrigger),
  `shouldEnableRichMotion()` (≥768px + fine pointer + no reduced motion),
  `whenIdle()`, `ensureAutoRefresh()` (debounced body ResizeObserver →
  `ScrollTrigger.refresh()`). gsap + three are split vendor chunks.
- **`src/lib/motion/smooth-scroll.ts`** — Lenis singleton (desktop only) bridged
  to ScrollTrigger via `gsap.ticker`; `scrollToY({immediate})`,
  `stop/startSmoothScroll()`; a `html[data-theater]` MutationObserver pauses it
  for every theater site-wide; hash-nav + App scroll-restore route through it.
- **`dc-*` design system** in `index.css` — `dc-name-a/-b`, `dc-pitch`,
  `dc-credits`, `dc-cta-primary/-ghost`, `dc-chapter-label`, `dc-numeral`,
  `dc-statement`, `dc-reel-*` (card anatomy), `dc-index-*` (services),
  `dc-gallery-*` (rail), `dc-wall*` (hero). Entrance: `hero-cascade-item` /
  `hero-line` masks.
- **Motion hooks**: `use-hero-wall.ts` (hero), `use-magnetic.ts` (CTAs),
  `use-velocity-skew.ts`, `ScrollProgressHairline.tsx`.
- **Mobile shell** (`src/components/mobile/*`): `MobileAppShell`, `MobileTabBar`,
  `MobileContactSheet`, `ContactChannelGlyph`; `use-active-section.ts` (scroll-spy);
  `contact-channels.ts` (shared channel data for dock + sheet); `.mtabbar` / `.msheet`
  CSS. Behavior decisions: **vaul sheets**, framer-motion/CSS transitions (no
  View-Transitions-API baseline — Firefox lacks it), **no** custom swipe-back
  (fights the OS), **no** Vibration haptics (dead on iOS Safari).

## Hard constraints (still in force)

- Services-page cinematic hero (`svc-cine-*`) **untouched**.
- Palette, fonts (Cormorant Garamond + DM Sans), light/dark themes preserved.
- Hero is force-dark (boot shell assumes it); ES/EN i18n via translation keys.
- Mobile gets no WebGL/Lenis/pins; reduced motion degrades gracefully.
- `three` dep + `HeroAtmosphere.tsx` retained for a future **Finale** chapter
  (not yet built).

## Not yet done

- Desktop chapters: Method sticky-split · Proof/FAQ restyle into `dc-*` · Finale
  contact chapter (reserved three.js silk) · inner-page `st-*` propagation ·
  navbar polish.
- Mobile follow-up: convert the navbar's full-screen hamburger overlay into a vaul
  **menu sheet** (deferred to avoid destabilizing the site-wide navbar swipe state
  machine; its `MobileMenuSheet` design is in the mobile-app-shell doc). Minor
  redundancy: overlay nav overlaps the tab bar's primary items.

## Verification & gotchas (project-specific)

- Verify with `tsc -p tsconfig.app.json` + eslint on the mobile-regression list
  (ServicesMarquee, Portfolio, Testimonials, Navbar, Hero, Index). Local
  `vite build` is known-broken (quarantined WhatsApp videos, EPERM) — skip it.
- Dev-server checks must be **numeric** (`getBoundingClientRect`/computed styles);
  the preview screenshot tool intermittently captures the window's native size
  after navigation, and GSAP scrubs need ~1–2s to settle.
- Pinned ScrollTrigger elements need a static "pin-shell" wrapper (it re-parents
  into `.pin-spacer`, which collides with React inserting conditional siblings) —
  relevant only if pinning returns (the current live home has no pins).
- **vaul** open/close animation finalizes on `transitionend`; the base
  `*:not(:focus-visible){ transition: outline-offset }` rule clobbers it and stalls
  the sheet closed — restore `[data-vaul-drawer]`/`[data-vaul-overlay]` transitions
  with `!important`. Also: importing vaul for the first time needs
  `rm -rf node_modules/.vite` (stale dep-optimize → mismatched React instance).
- The preview screenshot tool mis-renders fixed/sticky layers after a
  **programmatic** `scrollTo`; trust DOM metrics. First screenshot after a fresh
  server start is reliable.
