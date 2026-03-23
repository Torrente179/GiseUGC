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

## Verification

1. `npx eslint src/App.tsx src/components/media/TheaterVideo.tsx src/components/Portfolio.tsx src/components/ServiceLandingPage.tsx src/lib/perf-debug.ts`
2. `npx tsc --noEmit -p tsconfig.app.json`
