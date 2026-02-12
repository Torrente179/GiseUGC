# 2026-02-12 - Mobile Hamburger Contact Bubbles Relocation

## Summary
Moved the WhatsApp/Telegram/Fiverr contact bubbles into the mobile hamburger menu where the `Contáctame` button was, and removed `Contacto` from the mobile menu links.

## Changes Made
1. Mobile menu link update
- Excluded `navbar.contact` from the mobile navigation list while keeping desktop navigation unchanged.
- Implemented in `src/components/Navbar.tsx`.

2. Mobile contact block redesign
- Replaced the old single `Contáctame` CTA with a premium contact card that includes:
  - WhatsApp
  - Telegram
  - Fiverr
- Added hover/gradient treatment and consistent icon labeling using existing i18n keys.
- Implemented in `src/components/Navbar.tsx`.

3. Floating dock mobile duplication cleanup
- Kept floating dock visible on desktop only, so mobile no longer shows duplicated floating contact controls.
- Implemented in `src/components/FloatingContactDock.tsx`.

## Files Updated
- `src/components/Navbar.tsx`
- `src/components/FloatingContactDock.tsx`
- `changes/2026-02-12-mobile-hamburger-contact-bubbles.md`

## Validation
- `npm run build` completed successfully with no build errors.
