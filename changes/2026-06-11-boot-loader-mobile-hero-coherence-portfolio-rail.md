# Boot loader + mobile hero coherence + portfolio rail redesign

**Date:** 2026-06-11

## Problems

### 1 — Boot shell: white flash before React hydrated

The static `#root` boot shell was styled light (cream background, white card placeholder). On any slow connection or cold cache the user saw a clearly wrong page — light colors on a site whose home hero is always dark — before the JS bundle executed and React took over. This read as broken.

### 2 — Mobile hero: five layout problems in one composition

The mobile hero had multiple incoherent elements competing:

1. **Navbar light strip over dark hero** — the navbar rendered in its light-theme palette (cream background, dark text) while floating over the always-dark hero, creating a visible light bar at the top of the page in any theme.
2. **Story progress bar detached** — the segmented progress lived near the navbar, visually unconnected to the card it described.
3. **Competing card sliver** — the "next" card peeked only from the right at ~72% `translateX`, so it was large enough to read as a second card competing for attention, and it cropped asymmetrically.
4. **Redundant avatar** — a 40×40 headshot circle appeared below the headline on mobile even though Gisela is already visible in the reel card above.
5. **Proof row overflow** — "+28 marcas" text was wrapping or running under the floating contact bubble without enough right clearance.

### 3 — Portfolio mobile: large arrow buttons on a swipe surface

Two heavy `ChevronLeft` / `ChevronRight` circles (mobile-only `md:hidden`) sat on top of the portfolio reel imagery. One overlapped the floating contact bubble. Arrow pagination is a desktop pattern; the rail already affords swipe and a peeking next card.

---

## What changed

### Boot loader (3 commits → `index.html`, `src/main.tsx`)

**Iteration 1** (`a7c4fbf`): Made the boot shell dark to match the hero — same `hsl(222 28% 8%)` background, CSS custom properties (`--boot-gold`, `--boot-track`). Added `boot-home` class logic in the head script so only `/` and `/en` routes get the dark shell; other routes remain neutral.

**Iteration 2** (`f7e4804`): Stripped all visible boot UI (no background, no placeholder elements). The shell becomes truly invisible — `#root` starts empty. Removed unused preload tags (three `<link rel="preload">` for images that were never used by the actual React app) and cleaned up the inline preload to a single correct hero image preload.

**Iteration 3** (`aa64478`): User feedback: a completely invisible surface on slow loads still reads as broken. Added a branded loader — wordmark + animated sweep line — that fades in after 350ms so it never competes with a fast load but gives visual feedback on a slow one:

- `.boot-loader` — `opacity: 0`, `animation: boot-appear 0.6s ease 0.35s forwards` (fades in only after 350ms delay)
- `.boot-mark` — Cormorant Garamond serif wordmark "Gisela.UGC" in `--boot-gold`
- `.boot-line` / `.boot-line-fill` — 8.5rem hairline, gold fill sweeps left→right→left on a 1.5s cubic-bezier loop (`boot-sweep`)
- `html.boot-home` sets `background: hsl(222 28% 8%)` so the shell bg matches the hero before fonts/scripts load
- `src/main.tsx` removes `boot-home` from `<html>` the instant React mounts, handing off without a flash

SEO text (`boot-seo`) with `visually-hidden` pattern preserved throughout for crawlers.

### Navbar dark class over hero (`b750552` → `src/components/Navbar.tsx`)

Added `onHomePage && !isScrolled && !mobileMenuOpen && 'dark'` to the `<m.nav>` className. While the navbar floats over the always-dark hero it uses the dark palette (gold wordmark, frosted dark surface); the instant the user scrolls into a light section the class lifts and the light theme takes over. Works in both light and dark global themes.

### Story progress inside the card (`b750552` → `src/index.css`)

Moved `.hero-story-progress` from `top: 0.25rem` (near the navbar) to `top: 1.15rem` (inside the card frame). Width constrained to `calc(var(--story-card-w) - 1.4rem)` so it aligns with the card edges. Added `filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4))` so the segments read against any poster color.

### Balanced card slivers + snap fix (`b750552` → `src/index.css`, `src/components/HeroStoryStack.tsx`)

- `next` card: `translateX(100%)` (was `72%`) + `brightness(0.5) saturate(0.72)` — a quiet right peek, not a competing card
- `prev` card: `translateX(-200%)` (was `-250%`) — symmetric left sliver
- `back` card: `translateX(102%) translateY(3.5%) scale(0.84)` + `brightness(0.4)` — fully behind `next`
- Card width narrowed: `clamp(10.5rem, 46vw, 13rem)` (was `clamp(11rem, 50vw, 14rem)`)
- Snap teleport fix extended: `const snap = (oldR === n-1 && r === n-2) || (oldR === n-2 && r === n-1)` — previously only caught the wrap in one direction, so the card could streak across the screen when advancing from the last card back to the second-to-last

### Avatar hidden on mobile, spacer height corrected (`b750552` → `src/components/Hero.tsx`)

- `<img>` avatar: added `max-md:hidden` — the headshot circle no longer renders on mobile
- Spacer div height: `calc(clamp(10.5rem,46vw,13rem)*1.7778+1.5rem)` — derived from the actual card height (width × 16/9 aspect ratio) so the text block always clears the reel at every viewport width

### Proof row right clearance (`b750552` → `src/components/Hero.tsx`)

Added `max-md:pr-14` to the footer strip container so the "+28 marcas" row never underlaps the floating contact bubble (the bubble is ~3.5rem wide with margin).

### Portfolio arrow buttons removed, counter added (`b750552` → `src/components/Portfolio.tsx`)

- Removed `scrollReels` function and the two `md:hidden` `ChevronLeft` / `ChevronRight` button elements
- Added a small editorial position counter below the reel rail (mobile only): `01 — 26` in the site's `section-label` class with `text-muted-foreground` — communicates deck depth without visual noise

---

## Verified

- 390×844 mobile: boot loader appears on artificial throttle, disappears cleanly on React mount; no flash of wrong color
- 390×844 mobile: navbar dark over hero, reverts to light on scroll
- 390×844 mobile: progress segments sit inside card top edge; card slivers are symmetric and quiet; no avatar; proof row clears the bubble
- 390×844 mobile: portfolio rail — no arrow buttons; swipe works; position counter shows correctly
- 1280×800 desktop: boot loader correct; navbar dark over hero; reel deck unaffected
- `tsc --noEmit` clean, no console errors

## Files

- `index.html` (boot shell, loader, head script, preloads)
- `src/main.tsx` (boot-home class removal on mount)
- `src/components/Navbar.tsx` (dark class on hero)
- `src/components/Hero.tsx` (spacer height, avatar hidden, proof row clearance)
- `src/components/HeroStoryStack.tsx` (snap teleport fix)
- `src/components/Portfolio.tsx` (arrow buttons removed, counter added)
- `src/index.css` (story progress position, card sliver geometry)
