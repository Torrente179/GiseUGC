# 2026-02-11 - Full-Bleed Services Carousel Refinement

## Summary
Refined the services motion carousel to feel more immersive and cinematic while keeping the Bodoni/Manrope typography system applied in the previous update.

## Changes Made
1. Full-bleed carousel layout
- Converted the services marquee container to a full-viewport-width strip using a centered breakout pattern.
- Replaced the card panel wrapper with layered background gradients and edge fades to keep focus on the moving cards.

2. Card sizing and spacing
- Increased card widths and video heights across breakpoints for stronger visual impact.
- Increased horizontal card spacing and updated card text block padding for improved readability.

3. Subtitle placement
- Moved `services.motionSubtitle` directly under the motion section title to improve hierarchy and reduce visual clutter in the marquee area.

4. Motion pacing
- Slowed the marquee animation from `44s` to `56s` for a smoother, less aggressive scroll speed.

## Files Updated
- `src/components/Services.tsx`
- `src/index.css`
- `changes/2026-02-11-full-bleed-services-carousel.md`

## Validation
- Ran `npm run build` successfully.
