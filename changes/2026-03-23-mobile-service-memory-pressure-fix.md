# Mobile Service Memory Pressure Fix + Runtime Perf Snapshot

**Date:** 2026-03-23

## Problem

On mobile, repeatedly opening service-page videos across multiple services caused cumulative lag and near-crash behavior. The slowdown persisted when navigating back to home.

Two pressure points were identified:

1. **Homepage keep-alive on mobile:** `Index` stayed mounted even when hidden on service routes, so video-heavy sections could continue holding resources in memory.
2. **Theater video cleanup:** service and portfolio theater players paused on close/unmount but did not always forcefully release media buffers (`src` remained attached long enough to retain pressure on constrained mobile devices).

## Fixes

### 1. Mobile-only home unmount when off-route

- `App.tsx` now keeps the homepage mounted only on desktop.
- On mobile (`max-width: 767px`), `Index` unmounts when the user is not on home.
- Desktop behavior is unchanged (instant return to home preserved).

### 2. Aggressive theater media teardown

Applied in both theater implementations:
- `src/components/media/TheaterVideo.tsx`
- `src/components/Portfolio.tsx` (inline theater player)

New cleanup routine on source switch and unmount:
- `pause()`
- `removeAttribute('src')`
- `load()`

This explicitly releases video decode/network buffers on mobile instead of waiting for browser heuristics.

### 3. Reduced eager theater buffering

Both theater players now use:
- `preload="metadata"` (instead of `auto`)

This keeps startup responsive while reducing up-front media memory pressure.

### 4. Service-page render-path isolation on mobile

`ServiceLandingPage.tsx` previously rendered both complete trees at once:
- mobile tree (`md:hidden`)
- desktop tree (`hidden md:block`)

Even though one tree was visually hidden by CSS, both trees were still mounted in the DOM, including media surfaces and interactive components. On mobile this doubled runtime work and memory pressure per service page.

Now the component renders **only one branch** at runtime based on viewport state:
- mobile branch only on mobile
- desktop branch only on desktop

This removes hidden duplicate media/observer/listener work while preserving high-quality theater playback (`mainSrc` first).

### 5. Lightweight service-page marquee on mobile (quality preserved for theater)

`ServicesMarquee.tsx` was still running its full transform-driven carousel engine with autoplaying preview videos on service pages. That engine is optimized for homepage showcase use, but on mobile service-page navigation loops it adds avoidable cumulative pressure (multiple looping videos, drag/RAF loop, touch listeners).

Added a new prop:
- `liteMobile?: boolean`

When `liteMobile` is enabled and viewport is mobile:
- renders poster-only cards (no autoplay video elements)
- skips marquee drag loop/RAF engine and related global listeners
- keeps the section visually present as a horizontal toolkit strip

`ServiceLandingPage.tsx` now mounts `ServicesMarqueeSection` with `liteMobile`, so service pages use the lighter mobile runtime path while desktop and homepage can keep the richer behavior.

Playback quality requirement is preserved:
- theater/video playback still prioritizes `mainSrc` (highest quality)
- this change only affects the non-critical bottom marquee previews on mobile service pages

### 6. Homepage portfolio theater mobile startup and smoothness pass

After the service-page fixes, mobile friction remained in the homepage portfolio theater flow:
- delayed playback after tapping a reel card
- choppy interaction when switching clips repeatedly

Fixes applied in `src/components/Portfolio.tsx` (mobile-only behavior):

- Theater startup fallback was made more aggressive on mobile:
  - slow profile: `250ms -> 180ms`
  - default profile: `400ms -> 260ms`
- Theater videos now start muted by default in the home portfolio theater to avoid autoplay rejection penalties on mobile.
- Theater `<video>` preload changed from `metadata` back to `auto` (single active theater video only) to prioritize first-play responsiveness.
- Disabled heavy background prewarm graph on mobile:
  - no mobile startup prewarm batch
  - no mobile interaction `link rel="preload"` injection
  - no mobile hidden prewarm video mounts
  - no mobile theater-adjacent hidden preload videos

Result: faster first-play latency and less cumulative mobile jank during repeated clip opens/navigations, while desktop behavior remains unchanged.

### 7. Homepage theater mobile vertical navigation reliability

Follow-up usability fix in `src/components/Portfolio.tsx`:
- mobile vertical swipe in theater now triggers clip change as soon as gesture distance is clearly vertical (instead of relying only on touchend threshold handling)
- added explicit mobile up/down theater controls as a fallback navigation affordance

This restores reliable “scroll up/down to next video” behavior in theater mode while keeping desktop left/right navigation unchanged.

## Runtime instrumentation added

Added mobile media pressure snapshot logging in:
- `src/lib/perf-debug.ts`

New API:
- `startMobileMediaPressureObserver()`
- `logMobileMediaPressureSnapshot()`

Behavior:
- Enabled by default in `DEV`.
- In production, can be enabled with either:
  - URL param `?perfdebug=1`
  - `localStorage.setItem('ugc-perf-debug', '1')`
- Logs every 8s (mobile viewport only) with:
  - total video elements
  - active playing videos
  - videos with attached sources
  - total buffered seconds
  - JS heap usage (when available)
  - network profile (`effectiveType`/`saveData`)
  - current path
- Exposes `window.__ugcPerfSnapshot()` for manual snapshots.

Observer startup is wired in `App.tsx`.

## Files changed

- `src/App.tsx`
- `src/components/media/TheaterVideo.tsx`
- `src/components/Portfolio.tsx`
- `src/lib/perf-debug.ts`
- `src/components/ServiceLandingPage.tsx`
- `src/components/ServicesMarquee.tsx`
- `src/components/Portfolio.tsx`

## Verification

1. `npx eslint src/App.tsx src/components/media/TheaterVideo.tsx src/components/Portfolio.tsx src/components/ServiceLandingPage.tsx src/components/ServicesMarquee.tsx src/lib/perf-debug.ts`
2. `npx tsc --noEmit -p tsconfig.app.json`
