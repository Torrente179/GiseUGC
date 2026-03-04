# 2026-03-04 - Mobile Smoothness Stabilization Pass

## Summary
Implemented a pure code-optimization pass focused on carousel smoothness and global page responsiveness without changing visual language, animation style, or media quality.

## Changes Made

### 1. Services Marquee Mobile/Runtime Smoothness
- Restored mobile-specific marquee physics:
  - desktop auto-scroll: `27 px/s`
  - mobile auto-scroll: `49 px/s`
  - mobile drag multiplier: `1.45`
- Kept time-based animation (`px/sec`) with frame delta clamping.
- Improved touch axis handling:
  - drag only starts after axis resolves to horizontal
  - `preventDefault()` only during horizontal drag
  - vertical intent exits drag path early
- Updated container touch hint to `touchAction: 'pan-y'` to preserve native vertical page scroll behavior.
- Added RAF gating using:
  - section visibility (`IntersectionObserver`)
  - document visibility (`visibilitychange`)
  so offscreen marquee loops stop consuming main-thread time.

### 2. Deferred Section Mounting (Staged)
- Replaced all-at-once below-fold mount behavior with staged deferred mounting.
- Added a reusable hook (`useDeferredMount`) that:
  - mounts per section when placeholder approaches viewport
  - uses queue delays to spread heavy mounts across frames
- Applied deferred mounting in `Index.tsx` for both mobile and desktop section flows while preserving existing section order and skeleton UX.

### 3. Scroll-Time Render Pressure Reduction
- Refactored navbar scroll glass updates from React state-driven rerenders to RAF + direct style updates through refs.
- Preserved exact visual progression (padding, blur, border, background, shadow) while reducing per-scroll React work.

### 4. Hero Resize Listener Lifecycle Fix
- Replaced inline resize listener with a stable `handleResize` callback so add/remove targets match correctly.

### 5. Dev-Only Perf Instrumentation
- Added `src/lib/perf-debug.ts` with dev-only:
  - `mark(name)`
  - `measure(start, end, label)`
  - optional long-task observer (`PerformanceObserver`) for runtime profiling.
- Added mount/interaction instrumentation in:
  - `Index.tsx` (deferred mount timing)
  - `ServicesMarquee.tsx` (touch session timing)

## Files Updated
- `src/components/ServicesMarquee.tsx`
- `src/pages/Index.tsx`
- `src/components/Navbar.tsx`
- `src/components/Hero.tsx`
- `src/hooks/use-deferred-mount.tsx` (new)
- `src/lib/perf-debug.ts` (new)
- `changes/2026-03-04-mobile-smoothness-stabilization-pass.md` (new)

## Validation
- `npx eslint src/components/ServicesMarquee.tsx src/pages/Index.tsx src/components/Navbar.tsx src/components/Hero.tsx src/hooks/use-deferred-mount.tsx src/lib/perf-debug.ts`
- `npx vite build`
