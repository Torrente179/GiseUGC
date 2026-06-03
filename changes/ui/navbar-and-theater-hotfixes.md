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
- `.nav-control-rail`: subtle inset + drop shadow.
- `.btn-primary-nordic`: `text-primary-foreground`, `text-[13px] font-semibold`, `normal-case`, `tracking-[0.02em]`, inset highlight, hover `brightness-[0.97]` on primary (removed jump to accent khaki on hover).

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
