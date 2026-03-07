# 2026-03-07 - Desktop Scroll and Collage Eager Load

## Summary
Fixed two desktop regressions after the motion smoothing pass:
- desktop wheel/trackpad scrolling felt too sluggish
- the portfolio collage videos were not loading until hover

## Changes Made

### 1. Desktop scroll responsiveness
- Tuned Lenis in `src/lib/smooth-scroll.ts` to feel more immediate on desktop.
- Increased interpolation responsiveness and wheel strength so desktop scrolling no longer feels overly damped.

### 2. Desktop collage eager loading
- Updated the desktop collage videos in `src/components/Portfolio.tsx` to load and autoplay once the portfolio section is near the viewport.
- Removed the dependency on hover as the first meaningful load/play trigger.
- Kept the existing hover choreography for layout animation, while preventing mouse leave from resetting collage playback on desktop.
- Left mobile/constrained-network safeguards in place to avoid unnecessary bandwidth usage.

## Files Modified
- `src/lib/smooth-scroll.ts`
- `src/components/Portfolio.tsx`

## Validation
- `npx eslint src/lib/smooth-scroll.ts src/components/Portfolio.tsx`
- `npm run build`

## Mobile Regression Checklist

Generated at: `2026-03-07T02:52:21.961Z`

### Automated checks
- ✅ Targeted lint
- ✅ Production build

### Manual device checks (iPhone Safari)
- [ ] Horizontal drag moves carousel left/right without jumping back to start.
- [ ] Vertical page scroll works naturally when swiping over carousel area.
- [ ] Tapping a card pauses/expands that card without resetting track position.
- [ ] Tapping outside card closes expanded state and auto-scroll resumes smoothly.
- [ ] Offscreen -> back onscreen transition resumes movement without visible snap.

### Notes
- Device/OS:
- Browser version:
- Repro video/screenshot path (if any):
- Additional observations:
