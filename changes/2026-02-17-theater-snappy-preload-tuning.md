# 2026-02-17 - Theater Snappy Preload Tuning

## Summary
Tuned theater playback for faster swipe/arrow transitions and faster first-frame startup, targeting reels-like responsiveness.

## Changes
1. Reduced fast-fallback threshold
- File: `src/components/Portfolio.tsx`
- Updated `THEATER_FAST_FALLBACK_MS` from `1400` to `420`.
- If `main` is slow to become playable, theater falls back to `mobile` much faster.

2. Added readiness guard before fallback
- File: `src/components/Portfolio.tsx`
- Fallback timer now checks `video.readyState >= 2` and skips fallback if media is already playable.

3. Trigger load immediately on source change
- File: `src/components/Portfolio.tsx`
- On theater source update, calls `video.load()` before play attempts.

4. Warm preload neighbors for instant next/previous playback
- File: `src/components/Portfolio.tsx`
- Replaced single preload list with two tiers:
  - Warm clips (`-1`, `+1`):
    - preload `mobile` with `preload="auto"`
    - preload `main` with `preload="metadata"`
  - Hint clips (`-2`, `+2`):
    - preload `mobile` with `preload="metadata"`

## Result
- Next/previous theater videos are prewarmed, reducing startup delay during swipe/arrow navigation.
- Active clip reaches first frame faster when `main` is slow or missing, while preserving main-first playback preference.

## 2026-02-18 Update - Deferred Startup Prewarm Budget

### Why this was added
- You requested faster click/swipe startup without hurting overall page performance.
- Preloading every video at boot would compete with first paint / LCP and can hurt mobile score.

### What changed
- File: `src/components/Portfolio.tsx`
- Added a delayed startup prewarm pass that only runs after initial load:
  - Desktop delay: `900ms`
  - Mobile delay: `1400ms`
- Added network-aware budgeting (via `navigator.connection`):
  - Constrained (`saveData`, `2g`, `slow-2g`): skip startup prewarm
  - Slow (`3g`): tiny prewarm budget
  - Normal/Wi-Fi/4g: larger but still capped budget

### Startup prewarm scope
- Preview loops (`/videos/previews`):
  - desktop: first 4 clips
  - mobile: first 2 clips
  - slow: first 1 clip
- Main theater files (`/videos/main`) metadata-only:
  - desktop: first 2 clips
  - mobile: first 1 clip
  - slow: none
- Mobile theater files (`/videos/mobile`):
  - first warmed clip uses `preload="auto"` for faster first open
  - additional warmed clips use `preload="metadata"`

### Expected behavior impact
- Faster first theater open and faster first reel interactions.
- Preserves current animations/UX and avoids “preload everything on boot” network spikes.
- Keeps main-first quality logic on normal mobile/desktop; still prefers mobile source on constrained mobile networks.

## 2026-02-18 Update - Mobile Smoothness Micro-Tuning

### Goal
- Make theater open/switch feel even snappier on mobile while keeping page performance stable.

### What changed
- File: `src/components/Portfolio.tsx`

1. Direction-aware theater prewarm
- Theater now tracks the last navigation direction (`next` or `previous`).
- Prewarm prioritizes that direction first (primary warm clip).
- Secondary direction is still warmed, but with a lighter budget.

2. Lower contention during theater mode
- Mobile no longer preloads `±2` hint clips while theater is open.
- On slow mobile networks (`3g` / constrained), theater warms only one directional neighbor.
- This cuts concurrent media pressure and reduces stutter risk during swipes.

3. Interaction-triggered prewarm before open
- On reel card hover/touch start, the selected clip is prewarmed briefly (~2.8s) in a hidden video element.
- If user drags instead of taps, that prewarm is canceled.
- This improves first-frame startup when user taps a reel card.

### Expected impact
- Faster perceived first-frame response when opening theater from reel cards.
- Smoother next/previous transitions on mobile due to less preload contention.
- No removals of hero/theater animations; behavior remains performance-first with existing visuals intact.
