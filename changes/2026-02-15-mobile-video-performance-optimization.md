# 2026-02-15 - Mobile Video Performance Optimization

## Summary
Fix mobile performance by pausing offscreen videos so they stop competing for bandwidth and decode resources. No video files changed — same quality, same HDR metadata.

## Changes Made

### 1. LazyVideo `pauseOffscreen` Prop
- New optional `pauseOffscreen` prop on `LazyVideo` component
- Creates a persistent IntersectionObserver (separate from the existing one-shot load observer)
- When video leaves viewport: `video.pause()`
- When video re-enters viewport: `video.play()`
- Only activates when both `pauseOffscreen` and `autoPlay` are true — hover-controlled videos unaffected
- Uses `rootMargin: "50px 0px"` for smooth pre-emptive transitions

### 2. Portfolio Reel Carousel
- Added `pauseOffscreen` to all 10 reel carousel LazyVideo instances
- Offscreen cards stop decoding entirely instead of all 10 fighting for CPU simultaneously

### 3. Portfolio Mobile Collage
- Added `pauseOffscreen` to all 3 mobile collage LazyVideo instances
- Autoplay videos pause when scrolled past on mobile

### 4. ServicesMarquee Preload Tightening
- Tightened `rootMargin` from default 240px to `"0px 0px"`
- External Mixkit CDN videos no longer eagerly preload far offscreen

### What Does NOT Change
- All original video files untouched (same quality, same HDR metadata)
- Theater mode full-quality playback
- Desktop collage hover play/pause behavior (no `pauseOffscreen` — hover-controlled)
- All animations, gestures, keyboard navigation

## Files Updated
- `src/components/media/LazyVideo.tsx` — added `pauseOffscreen` prop + IntersectionObserver
- `src/components/Portfolio.tsx` — `pauseOffscreen` on reel carousel + mobile collage
- `src/components/ServicesMarquee.tsx` — tightened `rootMargin`

## Validation
- TypeScript type check passed with no errors.
- No video files modified.
