# 2026-03-04 - Mobile Contact Button Placement Between Testimonials and FAQ

## Summary
Moved the mobile `Contactar` CTA from the hero area to a dedicated section positioned between `Testimonios` and `FAQ`.

## Changes Made
1. Hero mobile CTA removal
- Updated `src/components/Hero.tsx` so the hero CTA row is desktop-only (`hidden md:flex`).
- Desktop hero CTA behavior remains unchanged.

2. New mobile contact CTA section
- Added `src/components/MobileContactCtaSection.tsx`.
- Renders a centered `Contactar` button using the existing `btn-primary-nordic` style.
- Button action triggers `toggleContactDock()` for mobile contact channels.

3. Mobile page flow reorder
- Updated `src/pages/Index.tsx` mobile branch to render the new CTA section:
  - after `TestimonialsSection`
  - before `FAQSection`
- Added matching fallback placeholder (`mobile-contact-cta`) in the same position.

## Files Updated
- `src/components/Hero.tsx`
- `src/components/MobileContactCtaSection.tsx`
- `src/pages/Index.tsx`
- `changes/2026-03-04-mobile-contact-button-placement-between-testimonials-and-faq.md`

## Validation
- `npx eslint src/components/Hero.tsx src/components/MobileContactCtaSection.tsx src/pages/Index.tsx`
- `npm run build`
