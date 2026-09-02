# Navbar and Theater Hotfixes

## Summary
This is the living navbar note for language/theater regressions, layering fixes, and the June 2026 control-rail redesign. It covers the production i18n crash fix in `Navbar.tsx`, the March 9 theater-navbar clearance work, and the unified locale/theme rail plus primary CTA polish shipped in commit `9598fa5`.

## Current runtime touchpoints
- `src/components/Navbar.tsx`
- `src/components/NavbarControls.tsx`
- `src/components/ThemeToggle.tsx`
- `src/components/Portfolio.tsx`
- `src/index.css`
- `src/i18n.ts`

## Current state
1. `Navbar.tsx` once again reads language state from a real `i18n` binding, preventing the production runtime crash introduced by the missing reference.
2. Theater-related navbar behavior now keys off the document theater state instead of ad hoc layering assumptions.
3. The March 9 theater-navbar experiment was rolled back, leaving the cleaner non-overlapping mobile clearance and layer behavior in place without keeping the experimental navbar treatment.
4. Desktop and mobile share `NavbarControls`: ES/EN and theme live in one frosted segmented rail with a Framer `layoutId` locale pill; the hire CTA is the only filled primary control and uses `text-primary-foreground` with sentence-case copy (`navbar.hireMeCta`).
5. `title-sequence-nav` is the dark overlay palette over cinematic heroes. It applies at the top of **Home and the eight service landings**, then lifts after 18px of scroll so the themed frosted bar takes over. Resource, vertical, hub, and legal pages stay on the themed bar.

## 2026-09-02 Service-page hero overlay navbar

Service landings open on the same kind of dark cinematic hero as Home (`stm-hero` / `svc-cine-hero`), but the overlay class was gated to `isHomePath`. At the top of a service page the nav stayed on the light theme tokens and read as a cream strip over video.

### What changed
1. `Navbar.tsx` now applies `title-sequence-nav` when `getServicePageIdFromPath` matches and `scrollY` is still under 18px — the same threshold and token remap Home already used.
2. After the first scroll the class lifts, so the service inner (light document) gets the themed frosted bar. Language, theme, hire CTA, back chevron, and mobile menu are unchanged.
3. Vertical, resource, hub, and legal routes were left alone; they do not share this dark-hero overlay.

### Files changed
- `src/components/Navbar.tsx`
- `src/components/Navbar.test.tsx`
- `src/data/service-inner-argument.test.tsx`
- `src/index.css` (comment only: overlay is shared by home + service pages)

### Verification
1. Home `/`: dark overlay at top (`title-sequence-nav`, `rgba(43,43,43,0.75)`), class lifts after scroll.
2. All eight ES+EN service landings: first HTML (SSR) includes `title-sequence-nav`.
3. Resource, vertical, and hub routes: Navbar at rest does not include the overlay class.
4. `npx vitest run src/components/Navbar.test.tsx src/data/service-inner-argument.test.tsx` — 40 passed.

## 2026-06-03 Navbar control rail and CTA polish

**Commit:** `9598fa5` — `style(navbar): unify control rail and refine primary CTA`

### Problem
The right side of the navbar read as three unrelated UI-kit pieces: a bordered ES/EN pill with heavy letter-spacing and teal ring active states, a standalone circular theme toggle, and a primary CTA that rendered **dark foreground text on a teal fill** (`.btn-primary-nordic` used `text-foreground`). Desktop and mobile duplicated the language markup.

### What changed

#### Unified control rail (`NavbarControls.tsx`)
- New component groups **ES | EN | theme** in one `nav-control-rail` container: shared height, `border-border/25`, `bg-background/45`, backdrop blur, inset highlight.
- Active locale uses a **sliding pill** (`layoutId="navbar-locale-pill"`) with neutral `bg-foreground/[0.07]` instead of `bg-primary/22` plus inset teal ring.
- Locale labels: `font-medium`, `tracking-[0.1em]` (down from `0.32em`), segment hit targets aligned to rail height.
- Vertical divider separates language segments from the theme control.

#### Theme toggle (`ThemeToggle.tsx`)
- Added `variant="segment" | "icon"`; navbar uses **`segment`** (no extra circle border, muted `text-foreground/75` icons).
- **`icon`** variant retained for standalone use (bordered circle, `text-primary` icons).
- Touch double-fire guard (`pointerdown` + click debounce) unchanged.

#### Navbar (`Navbar.tsx`)
- Replaced duplicated desktop/mobile language pills + separate `ThemeToggle` with `<NavbarControls />` (optional `compact` on mobile).
- CTA label via `t('navbar.hireMeCta', { defaultValue: 'Contáctame' | 'Hire me' })` with `ArrowRight` icon.
- Softer Framer hover on CTA: `scale: 1.02` (was `1.04` + `y: -1`).

#### CSS (`index.css`)
- `.surface-pill`: shared frosted pill (border, blur, inset + drop shadow) — used by `.nav-control-rail`, `.btn-surface-nordic`, `.btn-icon-pill`.
- `.nav-control-rail`: `@apply surface-pill`.
- `.btn-primary-nordic` (+ `--sm` / `--lg`): filled teal CTA matching navbar “Contáctame” — `text-primary-foreground`, sentence case, inset highlight.
- `.btn-surface-nordic` (+ sizes): ghost/frosted secondary CTAs; `.btn-secondary-nordic` aliases surface variant.
- Legacy aliases mapped: `.st-cta-primary`, `.st-cta-secondary`, `.stm-sticky-btn`, `.ft-cta`.

### Files changed
- `src/components/NavbarControls.tsx` (new)
- `src/components/Navbar.tsx`
- `src/components/ThemeToggle.tsx`
- `src/index.css`

### Verification
1. `npm run build`
2. Visual check: desktop navbar — one neutral rail + one teal CTA; mobile header matches compact rail sizing.
3. Toggle ES/EN: pill animates; route locale updates via existing `changeLanguage` + `getLocalizedPathForCurrentRoute`.
4. Theme toggle inside rail: no layout shift vs former separate circle.

### i18n note
Add `navbar.hireMeCta` to locale JSON when translations are next edited; fallbacks are baked into `Navbar.tsx` until then.

## Legacy notes absorbed
- `2026-03-07-navbar-i18n-runtime-hotfix.md`
- `2026-03-09-revert-theater-navbar-experiment.md`
- `2026-03-09-theater-navbar-layer-fix.md`
- `2026-03-09-theater-navbar-mobile-clearance.md`
