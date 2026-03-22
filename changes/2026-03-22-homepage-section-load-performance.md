# Homepage section load performance

**Date:** 2026-03-22
**Branch:** claude/cranky-nash
**Status:** shipped

## Problem

Three compounding issues made the homepage feel slow and janky, especially on mobile:

1. **Service cards 5–8 visible too late.** The `ServicesSection` grid used `blurRevealUp` (which applies `filter: blur(4px)`) with a `staggerContainer(0.09, 0.03)` stagger across all 8 cards. On mobile, `filter: blur` is one of the most expensive CSS properties — it forces a compositing layer and blocks the GPU. With a 90ms stagger, the last card didn't even *start* animating until 660ms after the trigger, then took another 580ms to finish. Total wait for card 8: ~1.24s.

2. **Deferred sections queuing too slowly.** A shared module-level `nextQueueSlotAt` variable serialises all `DeferredSection` mounts — each section adds its `queueDelayMs` to the queue. With delays of 260–320ms, four deferred sections (Portfolio → Rating → Testimonials → ServicesMarquee) mounted at t=0, t=300, t=600, t=900ms. The last section waited nearly a second just from queueing, before React lazy-loading or rendering even started.

3. **"Freeze" on back-navigation to home.** When pressing browser back to the homepage, the Index wrapper flips from `display: none` to `display: block` (a full layout recalculation for the entire page tree). In the same `useEffect` flush, `jumpToY` was called synchronously via Lenis — scroll restoration and layout reconstruction competed on the main thread, causing a visible freeze on mobile that lasted "some seconds."

## Changes

### `src/components/Services.tsx`
- Replaced `blurRevealUp(18, 0.58)` with `revealUp(18, 0.45)` on service card variants — removes the `filter: blur(4px)` that was causing GPU thrash on mobile, reduces animation duration from 580ms to 450ms.
- Reduced stagger from `staggerContainer(0.09, 0.03)` → `staggerContainer(0.05, 0.02)` — card 8 now starts at 0.38s (vs 0.66s) and finishes at 0.83s (vs 1.24s).
- Lowered `viewport.amount` from `0.25` to `0.15` — grid animation triggers sooner as the user scrolls in, so the second row is already mid-reveal rather than invisible when it enters the viewport.
- Removed `blurRevealUp` import and replaced two remaining `blurRevealUp` calls in the section header (subtitle label and motion subtitle) with `revealUp` equivalents.

### Hotfix: `blurRevealUp` ReferenceError (commit `b230f44`)
- During the rebase conflict resolution, the `blurRevealUp` import was removed but two usages in the section header (outside the conflict zone) were missed. This caused a `ReferenceError` at runtime, crashing the Services component and making the homepage go blank. Fixed by replacing both calls with `revealUp`.

### `src/pages/Index.tsx`
- Reduced all `queueDelayMs` values:
  - Mobile: portfolio 260→80, rating 300→100, testimonials 300→100, contact-cta 300→100, services-marquee 280→120
  - Desktop: portfolio 300→80, rating 300→100, testimonials 320→100, services-marquee 320→120
- With these values, four back-to-back deferred sections mount at t=0, t=100, t=200, t=320ms — total queue wait drops from ~900ms to ~320ms.

### `src/App.tsx`
- Wrapped `jumpToY` for POP navigation in a double `requestAnimationFrame`. This defers scroll restoration by two browser frames, giving the browser time to finish the `display:none → block` layout pass before Lenis attempts to set the scroll position. Eliminates the main-thread contention that caused the mobile freeze.

## Result

- All 8 service cards are fully visible within ~830ms of the grid entering view (down from ~1240ms), with no GPU-heavy blur filter.
- Four deferred sections mount within ~320ms of page load (down from ~900ms).
- Back-navigating to the homepage no longer freezes scroll on mobile — Lenis waits for layout to settle before restoring position.
