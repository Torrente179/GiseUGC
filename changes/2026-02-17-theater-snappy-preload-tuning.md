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
