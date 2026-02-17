# 2026-02-17 - Mobile Reel Instant Playback Restore

## Summary
Restored aggressive mobile reel preloading and immediate source attachment to recover fast startup, buffering, and playback responsiveness on mobile.

## Changes Made
1. Warm-card preloading restored
- Switched near-neighbor mobile reel cards back to `preload="auto"` (instead of `metadata`).
- Kept distant cards on `preload="none"` to avoid fully loading the whole strip.

2. Earlier loading window
- Increased `rootMargin` for mobile reel cards so preloading begins sooner before cards enter center focus.

3. Immediate source attach for warm cards
- Enabled warm cards to bypass visibility gating (`loadWhenVisible=false`) so sources attach immediately on mobile.

4. LazyVideo runtime sync fix
- Added synchronization so `LazyVideo` properly flips to loaded state when `loadWhenVisible` changes from `true` to `false` at runtime.

## Files Updated
- `src/components/Portfolio.tsx`
- `src/components/media/LazyVideo.tsx`
- `changes/2026-02-17-mobile-reel-instant-playback-restore.md`

## Validation
- `npx eslint src/components/Portfolio.tsx src/components/media/LazyVideo.tsx`
- `npm run build`
