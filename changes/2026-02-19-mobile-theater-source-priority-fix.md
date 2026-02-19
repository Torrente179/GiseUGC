# 2026-02-19 - Mobile Theater Source Priority Fix

## Summary
Identified and fixed three stacked root causes preventing mobile theater video from loading as fast as desktop.

## Root Causes Fixed

### 1. Wrong theater source priority on mobile (`Portfolio.tsx`)
- `shouldPreferMobileTheaterSource` was `isMobile && connectionProfile.slow`
- On a normal 4G connection, `connectionProfile.slow` is `false` (only true for 3G/2G/saveData)
- Result: mobile on 4G was trying the full main source first — the same heavy file desktop loads — with the 720p mobile source only as fallback
- Mobile screens do not need the main quality source
- **Fix:** `shouldPreferMobileTheaterSource = isMobile` — mobile source is now always primary on any mobile device, regardless of connection speed
- This cascades correctly through `theaterSources`, `interactionPrewarmSources`, `instantPrewarmSources`, and theater neighbor warm preloads — all now prewarm the mobile source first on mobile

### 2. Excessive mobile prewarm delay (`Portfolio.tsx`)
- `STARTUP_PREWARM_DELAY_MOBILE_MS` was `760ms` vs `520ms` for desktop
- Mobile was penalized with a 240ms longer wait before prewarming anything
- **Fix:** Reduced to `400ms` — now starts prewarming sooner than desktop to compensate for slower cellular latency

### 3. Insufficient mobile startup prewarm budget (`Portfolio.tsx`)
- `startupMobilePreloadClips` was prewarming 1 clip on mobile
- **Fix:** Increased to 2 clips, so the first two mobile theater sources are buffered before the user taps

## Intentionally Unchanged
- Desktop source priority and prewarm behavior
- Video quality, resolution, or encoding
- All animations and UI behavior
- Slow/constrained connection handling (saveData, 2G, 3G paths unchanged)

## Files Updated
- `src/components/Portfolio.tsx`
