# 2026-02-12 - Hero Animation Restoration (Performance-First)

## Summary
Restored hero motion effects without bringing back heavy above-the-fold animation runtime. The implementation keeps mobile performance first while preserving animated feel.

## Changes Made
1. Restored hero motion with lightweight runtime
- Added desktop-only RAF parallax for hero image, floating proof card, and corner tag:
  - `src/components/Hero.tsx`
- Uses passive scroll listeners + resize observer + direct compositor transforms.
- Respects `prefers-reduced-motion`.

2. Added low-cost motion on mobile
- Added subtle CSS keyframe float animations for hero floating elements on mobile only:
  - `src/index.css`
- Triggered when hero marks itself motion-ready (`data-motion='ready'`).
- Disabled under reduced-motion preference.

3. Portfolio animation timing adjusted
- Reduced below-the-fold lazy mount delay from `450ms` to `260ms` so portfolio animations appear sooner while still protecting early paint:
  - `src/pages/Index.tsx`

## Files Updated
- `src/components/Hero.tsx`
- `src/index.css`
- `src/pages/Index.tsx`
- `changes/2026-02-12-hero-animation-restoration-performance-first.md`

## Validation
- `npm run build` completed successfully.
