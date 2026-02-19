# 2026-02-19 - Portfolio Prewarm Viewport Gating

## Summary
Improved page-speed behavior by reducing eager R2 video prewarm pressure before the portfolio section is near view, while preserving theater quality and all existing UI/animation behavior.

## What Changed
1. Viewport-gated startup prewarm
- Added an IntersectionObserver gate on the portfolio section.
- Startup prewarm now waits until the section is near the viewport (`rootMargin: 1600px`) before starting delayed prewarm timers.
- This avoids warming theater assets too early during first-load above-the-fold rendering.

2. Lower eager preview prewarm contention
- Startup preview prewarm now uses:
  - first clip: `preload="auto"`
  - remaining clips: `preload="metadata"`
- Keeps the fast-path warm while reducing concurrent network pressure.

3. Instant first-open fast path
- Added a lightweight immediate prewarm layer when portfolio is near viewport:
  - warms only one likely theater clip (desktop: first clip, mobile: current center clip)
  - first source preloaded with `auto`, fallback source with `metadata`
- This restores near-instant theater startup while preserving the deferred broader prewarm budget.

4. Faster staged prewarm delays
- Reduced staged startup prewarm delays to run sooner once viewport-gated conditions are met:
  - desktop: `260ms`
  - mobile: `380ms`

## Intentionally Unchanged
- No changes to:
  - animations
  - fonts
  - UI layout/styling
  - video assets or encoding quality
  - theater gesture/navigation behavior
  - R2 source routing and fallback order

## File Updated
- `src/components/Portfolio.tsx`

## 2026-02-19 Update - Performance Recovery While Keeping New Theater Design

### Goal
- Keep the new near-borderless theater design unchanged while restoring the faster load profile from the previous baseline.

### What was optimized
1. Reduced eager prewarm pressure again (most impactful)
- File: `src/components/Portfolio.tsx`
- Tuned staged prewarm timings back to a safer profile:
  - desktop: `900ms`
  - mobile: `1400ms`
- Tightened viewport gate trigger distance:
  - `PORTFOLIO_PREWARM_ROOT_MARGIN` from `1600px` to `1200px`

2. Smaller startup prewarm budget
- File: `src/components/Portfolio.tsx`
- Startup clip counts were reduced:
  - preview clips: desktop `2`, mobile `1`, slow `1`
  - main clips: desktop `1`, mobile `0`, slow `0`
  - mobile clips: desktop `0`, mobile `1`, slow `0`
- Startup preload policy is lighter:
  - desktop first preview can be `auto`
  - mobile startup warmups use `metadata` only

3. Safer instant prewarm behavior on mobile
- File: `src/components/Portfolio.tsx`
- Instant prewarm now skips on slow connections (`3g` and below logic path).
- On mobile instant prewarm, first source now uses `metadata` instead of `auto` to avoid early large downloads.

4. Theater visual runtime cost trim (design preserved)
- Files: `src/components/Portfolio.tsx`, `src/index.css`
- Kept the same modern theater look and controls, but reduced blur workload on mobile:
  - backdrop blur lowered on mobile (`6px`) and kept richer blur on desktop (`10px`)
  - theater control/chip blur strength reduced on mobile in CSS media query

### Result expectation
- Better mobile and desktop page-speed consistency by lowering early R2 video contention.
- New theater design remains intact (layout, controls, overlay metadata, motion style).
- Theater interactions stay fast through instant + interaction-triggered prewarm, but with less startup overhead.

## 2026-02-19 Update - Fastness Recovery Pass 2

### Goal
- Bring theater open/switch speed back closer to the previous “snappy” baseline while keeping the new theater design.

### What was tuned
1. Source-priority-aware theater warming
- File: `src/components/Portfolio.tsx`
- Theater neighbor prewarm now warms the **actual preferred playback source** first:
  - normal mobile/desktop: `main` first
  - constrained mobile path: `mobile` first
- Fallback source still warms with `metadata` for resilience.

2. Smarter startup fallback timing
- File: `src/components/Portfolio.tsx`
- Theater fallback timeout is now network-aware:
  - slow path: `420ms`
  - default path: `760ms`
- This avoids overly early source switching on healthy networks while keeping fast rescue on weak ones.

3. Balanced prewarm budget for speed + page performance
- File: `src/components/Portfolio.tsx`
- Startup prewarm is moderately re-accelerated:
  - desktop delay: `640ms`
  - mobile delay: `920ms`
- Startup clip budget:
  - previews: desktop `3`, mobile `2`, slow `1`
  - main: `1` on non-slow networks
  - mobile: `1` on mobile non-slow networks

4. Faster intent-based warmup
- File: `src/components/Portfolio.tsx`
- Added reel-card prewarm trigger on `pointerdown` and keyboard `focus` (in addition to hover/touch start).
- This warms likely theater media before modal mount for faster perceived open.

### Result expectation
- Faster theater first-frame behavior than the previous recovery pass.
- Keeps the new modern theater skin unchanged.
- Maintains controlled preload pressure so initial page metrics stay stable.

## 2026-02-19 Update - Instant-Load Recovery Pass 3

### Goal
- Push theater startup closer to “instant” on both desktop and mobile without reverting the new theater design.

### What was tuned
1. Muted-first theater startup path (faster autoplay resolution)
- File: `src/components/Portfolio.tsx`
- `TheaterVideo` now uses a muted-first startup play attempt on source changes.
- This reduces autoplay permission fallback overhead and improves first-frame start consistency.
- User-triggered play toggle still attempts unmuted play as before.

2. Persistent single-clip instant prewarm
- File: `src/components/Portfolio.tsx`
- The lightweight instant prewarm path no longer turns off after staged startup prewarm begins.
- While theater is closed, one likely clip remains warmed continuously, improving open latency during normal browsing.

3. Stronger intent prewarm
- File: `src/components/Portfolio.tsx`
- Interaction prewarm and instant prewarm now include preferred source + fallback source on mobile.
- This improves resilience when the preferred source startup is slower than expected.

4. Faster warmup timing
- File: `src/components/Portfolio.tsx`
- Startup prewarm delay tightened again:
  - desktop: `520ms`
  - mobile: `760ms`
- Default startup fallback timeout tightened to `620ms` (`420ms` on slow path remains).

### Result expectation
- Faster first-frame startup when opening theater from reel cards on both desktop and mobile.
- Less startup jitter from autoplay permission handling.
- New theater visual design remains unchanged.

## 2026-02-19 Update - Audio Restore + Mobile Instant Open Fix

### Goal
- Restore theater audio behavior and remove the mobile startup bottleneck that was still preventing “instant” feel.

### What was tuned
1. Audio restore path
- File: `src/components/Portfolio.tsx`
- Added muted-first startup for fast first frame, then immediate auto-unmute attempt when playback is running.
- Added explicit theater mute/unmute button so users can always enable audio instantly if browser autoplay policy keeps audio muted.

2. Fixed interaction prewarm cancellation on open
- File: `src/components/Portfolio.tsx`
- Interaction prewarm is no longer cleared when opening theater.
- On card click/open, the selected clip is now explicitly re-marked for prewarm instead of being canceled.
- This prevents aborting the exact request needed for fast mobile startup.

### Result expectation
- Theater audio is available again with direct user control.
- Better mobile first-frame response when tapping a reel card.
- Desktop instant behavior remains, with no design rollback.
