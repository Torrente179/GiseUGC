# 2026-03-07 - Motion Smoothing and Buttery Scroll Pass

## Summary
Refined the existing premium motion system without removing animations and without changing fonts. The work focused on making the site feel smoother under real scroll and drag interaction by reducing abrupt spring behavior, lowering expensive blur usage, and interpolating the heaviest scroll-linked animations.

## Constraints Kept
- Kept the current animation system and reveal language intact.
- Kept the current typography unchanged.
- Focused on smoothness, frame stability, and perceived polish instead of a visual redesign.

## Changes Made

### 1. Shared motion tuning
- Softened shared spring presets in `src/components/motion/variants.ts` so hover, tap, and entrance motion settles more naturally.
- Reduced reveal blur intensity and shortened reveal duration slightly to remove the “sticky” feel on lower-power devices.
- Cleared `filter` after blur-based reveals finish to avoid keeping expensive paint work active longer than needed.

### 2. Text reveal polish
- Updated `src/components/motion/SplitTextReveal.tsx` and the CSS-backed lite split text styles in `src/index.css`.
- Switched the motion emphasis toward GPU-friendly transforms and slightly faster easing so headings feel cleaner and less draggy.

### 3. Hero parallax smoothing
- Reworked `src/components/Hero.tsx` parallax updates from direct scroll position writes to interpolated progress.
- The image, floating proof card, and corner tag now ease toward the target position instead of snapping on each RAF tick.

### 4. Navbar glass interpolation
- Updated `src/components/Navbar.tsx` to animate the glass-state progression toward a target scroll value instead of stepping immediately.
- This makes blur, shadow, and shell padding changes feel more continuous while scrolling.

### 5. Smooth-scroll behavior
- Refined `src/hooks/use-hashless-section-navigation.ts` so JS fallback scrolling is interruptible and duration scales better with travel distance.
- Tuned Lenis in `src/lib/smooth-scroll.ts` for slightly calmer wheel response.

### 6. Services marquee smoothing
- Reworked `src/components/ServicesMarquee.tsx` to separate target offset from rendered offset.
- Added controlled interpolation and release velocity decay after drag so the rail feels less mechanical and more inertial.
- Fixed a local naming collision where the marquee’s internal `measure` helper shadowed the imported perf `measure`.

### 7. Testimonial carousel spring tuning
- Lowered spring stiffness in `src/components/Testimonials.tsx` so slide transitions feel more fluid and less abrupt.

### 8. CSS animation cost reduction
- Added selective `backface-visibility` / `will-change` usage to the most animation-heavy elements in `src/index.css`.
- Slowed repetitive shimmer and dock-breathe loops slightly so the ambient motion reads as calm instead of busy.

## Files Modified
- `src/components/Hero.tsx`
- `src/components/Navbar.tsx`
- `src/components/ServicesMarquee.tsx`
- `src/components/Testimonials.tsx`
- `src/components/motion/SectionReveal.tsx`
- `src/components/motion/SplitTextReveal.tsx`
- `src/components/motion/variants.ts`
- `src/hooks/use-hashless-section-navigation.ts`
- `src/index.css`
- `src/lib/smooth-scroll.ts`

## Validation
- `npx eslint src/components/motion/variants.ts src/components/motion/SectionReveal.tsx src/components/motion/SplitTextReveal.tsx src/hooks/use-hashless-section-navigation.ts src/components/Hero.tsx src/components/Navbar.tsx src/components/ServicesMarquee.tsx src/components/Testimonials.tsx src/lib/smooth-scroll.ts`
- `npm run build`

## Mobile Regression Checklist

Generated at: `2026-03-07T02:41:16.802Z`

### Automated checks
- ✅ Targeted lint
- ❌ Production build

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
- Production build failure during `npm run check:mobile-regression` is currently `Could not resolve entry module "en/index.html"`, which appears tied to separate in-flight locale/routing work already present in the branch rather than this motion pass.
