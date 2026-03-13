# Carousel and Marquee Evolution

## Summary
This folder isolates the behavior that has historically regressed the most: the services marquee, carousel looping, swipe handling, resize continuity, and related mobile smoothness tuning.

## Current runtime touchpoints
- `src/components/ServicesMarquee.tsx`
- `src/components/Testimonials.tsx`
- `src/pages/Index.tsx`
- `src/index.css`
- `scripts/mobile-regression-check.mjs`

## Current behavior
1. The services marquee is transform-driven rather than relying on native scrolling, which is why offset bookkeeping and resize remeasurement matter.
2. Mobile interaction is tuned to preserve vertical page scroll first and only capture horizontal intent when needed.
3. Looping, autoplay, and logical-offset preservation have all been tuned together so the marquee does not visibly reset when viewport size or card widths change.
4. Some marquee cards now map directly to portfolio video assets, so `ServicesMarquee.tsx` and the video catalog need to stay aligned.
5. Testimonial and other swipeable sections are lighter-weight than the marquee, but the same mobile regression checklist should be used when touch behavior changes.

## Working rules
1. If you touch marquee drag logic, loop timing, resize handling, or touch-axis behavior, run `npm run check:mobile-regression`.
2. When changing card/video mapping, verify both `src/components/ServicesMarquee.tsx` and `src/data/portfolio-clips.ts`.
3. Treat CSS touch-action and JS drag-state changes as one system; changing only one side is how previous regressions happened.

## Historical notes covered
- `2026-02-11-carousel-infinite-right-fix.md`
- `2026-02-11-carousel-transform-based-infinite.md`
- `2026-02-11-collage-and-carousel-refinement.md`
- `2026-02-11-full-bleed-services-carousel.md`
- `2026-02-11-fullwidth-infinite-carousel.md`
- `2026-02-11-infinite-carousel-autoplay-fix.md`
- `2026-02-11-testimonials-mobile-swipe.md`
- `2026-02-17-services-marquee-mobile-swipe-and-speed.md`
- `2026-03-04-mobile-carousel-resize-reset-fix.md`
- `2026-03-04-mobile-marquee-scroll-and-fast-start-hotfix.md`
- `2026-03-04-services-marquee-card-to-video-remap.md`
- `2026-03-04-services-marquee-loop-toggle-and-mobile-smoothness.md`
