# 2026-02-17 - Mobile Reel Fast-Path Optimization

## Summary
Further improve mobile portfolio reel smoothness by reducing both decode concurrency and scroll-time CPU work.

## Changes Made

### 1. Single active reel video on mobile
- Updated mobile reel gating so only the active card is allowed to autoplay.
- Non-active cards are force-paused.
- Theater force-pause behavior remains unchanged.

### 2. Lighter active-card tracking during scroll
- Replaced per-scroll DOM card scanning (`querySelectorAll` + `getBoundingClientRect`) with a lightweight index calculation based on:
  - `scrollLeft`
  - measured reel card step (`reelScrollStepRef`)
- This cuts main-thread work during fast swipes.

### 3. Immediate mobile detection on first render
- Updated `useIsMobile()` to initialize from current viewport width immediately instead of waiting for effect setup.
- Mobile-specific optimizations now apply right away on first paint.

## What Does NOT Change
- No video files changed.
- No quality changes.
- Existing UI/animations/gestures remain intact.

## Files Updated
- `src/components/Portfolio.tsx`
- `src/hooks/use-mobile.tsx`

## Validation
- `npm run build` passes.
