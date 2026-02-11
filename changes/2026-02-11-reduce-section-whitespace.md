# Reduce Section Whitespace

**Date:** 2026-02-11

## Summary
Reduced the large vertical white spaces between sections across the entire page for a tighter, more cohesive layout.

## Changes

### `src/index.css`
- **`.studio-section`** padding reduced from `py-20 md:py-24 lg:py-28` → `py-14 md:py-16 lg:py-20`
- Affects all sections using this global utility (Testimonials, Contact, etc.)

### `src/components/Services.tsx`
- Top padding reduced from `pt-24 md:pt-32` → `pt-16 md:pt-20`

### `src/components/Portfolio.tsx`
- Section padding reduced from `pt-32 pb-24` → `pt-20 pb-16`
- Header bottom margin reduced from `mb-16 md:mb-24` → `mb-10 md:mb-14`

### `src/components/ServicesMarquee.tsx`
- Wrapper margins reduced from `mt-32 md:mt-44 mb-20 md:mb-28` → `mt-16 md:mt-20 mb-12 md:mb-16`
- Closes the gap before the "Toolkit" section and between it and Contact

## Affected Gaps
- Services → Portfolio (Showcase)
- Portfolio → Testimonials
- Testimonials → Toolkit Carousel
- Toolkit Carousel → Contact
