# 2026-03-04 - Mobile CTA Toggle and Rating Card Placement

## Summary
Implemented mobile-only contact bubble toggle behavior for CTA buttons, moved the Fiverr rating card to appear directly below the `UGC Creativo` block and above `Testimonios` on mobile, and updated CTA/footer copy per request.

## Changes Made
1. Bubble menu toggle behavior on mobile
- Added contact dock action bus (`open` / `toggle`) in `src/lib/contact-dock.ts`.
- Updated `FloatingContactDock` to react to those actions and support true toggle behavior.
- Updated CTA handlers in:
  - `src/components/Hero.tsx`
  - `src/components/Portfolio.tsx`
- Result: tapping the same CTA again closes the bubble menu on mobile.

2. Mobile-only rating card placement
- Extracted reusable rating card component: `src/components/FiverrRatingCard.tsx`.
- Added mobile placement section: `src/components/MobileFiverrRatingSection.tsx`.
- Inserted this section in mobile flow right after `HeroIntroduction` and before `Testimonials` in `src/pages/Index.tsx`.
- Hid the footer-embedded rating card on mobile (desktop keeps it visible) in `src/components/Footer.tsx`.

3. Copy updates
- `portfolio.collageCta` (ES): `Define tu paquete UGC - Contáctame`
- `portfolio.collageCta` (EN): `Plan your UGC package - Contact me`
- `footer.description` (ES): `Contáctame ahora para empezar tu próxima campaña.`
- `footer.description` (EN): `Contact me now to start your next campaign.`

## Files Updated
- `src/components/FloatingContactDock.tsx`
- `src/components/Footer.tsx`
- `src/components/Hero.tsx`
- `src/components/Portfolio.tsx`
- `src/components/FiverrRatingCard.tsx`
- `src/components/MobileFiverrRatingSection.tsx`
- `src/lib/contact-dock.ts`
- `src/locales/en/translation.json`
- `src/locales/es/translation.json`
- `src/pages/Index.tsx`
- `changes/2026-03-04-mobile-cta-toggle-and-rating-card-placement.md`

## Validation
- `npm run build`
