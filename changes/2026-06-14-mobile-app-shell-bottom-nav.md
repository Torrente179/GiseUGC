# Mobile app shell — bottom tab bar + contact sheet, site-wide

**Date:** 2026-06-14

## Context

The whole June redesign reworked desktop; mobile was *kept*, never reimagined —
it still navigated like a website (fixed top bar + full-screen hamburger overlay
+ a floating contact bubble). User wants mobile to feel like a native app,
site-wide, with navigation as the centerpiece, and **smooth on every browser**.

Decided (AskUserQuestion): **bottom tab bar**, **whole-site**. Behaviors were
delegated to expert judgment → applied the cross-browser state-of-the-art set and
explicitly **skipped** the browser-inconsistent ones (see below).

## What shipped

### Persistent bottom tab bar (`src/components/mobile/MobileTabBar.tsx`)
- Fixed, frosted (`backdrop-filter` + `@supports` solid fallback), safe-area
  inset, `z-120`. 4 tabs: **Inicio · Portafolio · Servicios · Contacto**.
- Section tabs route through the existing `use-hashless-section-navigation`
  (smooth-scroll on home; cross-navigate to `/#section` from inner pages via the
  existing `App.tsx` hash handling). Contacto opens the contact sheet.
- Active state: `use-active-section.ts` scroll-spy (rrAF, queries the DOM fresh
  each tick so it works with lazily-mounted sections) on home + route match on
  inner pages; spring-animated indicator via framer-motion `layoutId`
  (reduced-motion → no pill). `role=navigation`, `aria-current`.
- Slides away (`.is-hidden`) while a bottom sheet owns the screen (avoids a
  stacking-context fight with the sheet over the last row).

### Contact bottom sheet (`MobileContactSheet.tsx`, vaul)
- Replaces the mobile floating bubble: 8 channels as a clean icon+label list
  (brand-glyph chips, external arrow). Drag/Escape/overlay dismiss.
- Bridged to the existing `contact-dock.ts` event in `MobileAppShell.tsx`, so
  **every existing "Contactar" CTA** (hero, etc.) opens the sheet on mobile.

### App shell + wiring
- `MobileAppShell.tsx` mounts the tab bar + contact sheet once, site-wide, from
  `App.tsx` (gated `isMobile`, inside the Router so nav hooks work).
- `FloatingContactDock.tsx` → **desktop-only** (`if (isMobile) return null`).
- `Navbar.tsx` → additive app-style **back control** (chevron before the brand)
  on mobile inner pages (`navigate(-1)` w/ home fallback); the OS owns the
  edge-swipe gesture. Desktop navbar untouched.
- `Index.tsx` → dropped the now-redundant `MobileContactCtaSection`.
- Route transition: home wrapped in the existing keyed `.page-enter` (opacity
  cross-fade, keyed by locale); inner pages already had it.
- Shared `src/lib/contact-channels.ts` (data) + `ContactChannelGlyph.tsx`
  (glyph) — one source for the desktop dock and the mobile sheet.

### Expert behavior decisions (delegated)
- ✅ **vaul bottom sheets** — modern standard, already installed.
- ✅ **Cross-browser transitions** — framer-motion / CSS opacity baseline that's
  smooth on every engine incl. Firefox. View Transitions API was **not** made the
  baseline (Firefox lacks it).
- ❌ **Custom swipe-back** — rely on the OS edge gesture + the visible back
  control; a JS reimplementation fights the OS and is inconsistent across engines.
- ❌ **Vibration haptics** — unsupported on iOS Safari; would only fire on
  Android. Polish went into motion/visual feedback instead.

## The bug that mattered

The contact sheet opened (`data-state=open`) but stayed visually closed. Cause:
the global base rule `*:not(:focus-visible){ transition: outline-offset … }`
(index.css) clobbers vaul's `transition: transform` on `[data-vaul-drawer]`, and
vaul finalizes its open animation on `transitionend` — which never fired, so the
drawer stalled. **Fix:** restore vaul's transitions with `!important`:
`[data-vaul-drawer]{transition:transform .5s …!important}` +
`[data-vaul-overlay]{transition:opacity …!important}`. (Also required clearing the
stale Vite dep cache — `rm -rf node_modules/.vite` — since vaul was imported for
the first time and got a mismatched React instance.)

## Cross-browser robustness

`-webkit-backdrop-filter` + `@supports` solid fallback for the bar; `svh`/`env()`
safe-area math; GPU-only `transform`/`opacity`; vaul's transform-based drag (iOS
target); `shouldScaleBackground={false}` (no body transform vs `overflow-x:hidden`);
no single-engine API in the critical path.

## Verified (dev server, mobile 375 — numeric)

- Tab bar fixed at bottom, 4 tabs, safe-area; body padding-bottom clears it.
- Tap Servicios → scrolls to `#services`; scroll-spy: top→Inicio, portfolio→
  Portafolio; active tab updates.
- Contacto → sheet opens (8 channels, WhatsApp URL correct), tab bar slides away,
  last row visible; Escape closes, tab bar returns.
- Theater opens at `z-200` above the bar.
- Inner service page: back chevron visible, `navigate(-1)` returns home (bar
  persists, back control hidden on home); `svc-cine` hero untouched.
- Desktop 1440: **no tab bar**, floating dock present, body padding 0.
- `tsc` + eslint clean (regression list + all new files).

## Known follow-ups (deliberately deferred)

- The navbar's **full-screen hamburger overlay** stays as the secondary "more"
  menu (it's already swipe-dismissable). Converting it to a vaul menu sheet was
  deferred to avoid destabilizing the site-wide navbar's swipe state machine in
  this pass — its `MobileMenuSheet` design is recoverable from this session.
  Minor redundancy: overlay nav overlaps the tab bar's primary items.
- Service-page hero bottom CTA can sit behind the bar on first view (it scrolls);
  `svc-cine` is protected so left as-is.

## Files

New: `src/components/mobile/{MobileAppShell,MobileTabBar,MobileContactSheet,ContactChannelGlyph}.tsx`,
`src/hooks/use-active-section.ts`, `src/lib/contact-channels.ts`.
Modified: `src/App.tsx`, `src/components/Navbar.tsx`, `src/components/FloatingContactDock.tsx`,
`src/components/Hero.tsx` (tab-bar clearance class), `src/pages/Index.tsx`,
`src/components/ui/drawer.tsx` (z-[140]), `src/index.css` (tab bar + sheets +
vaul transition restore + clearances).
