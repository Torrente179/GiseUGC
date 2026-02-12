# 2026-02-12 - Social Bubbles Expansion + Fiverr PNG Integration

## Summary
Expanded contact bubbles with additional social channels and replaced the Fiverr bubble icon with the uploaded PNG asset, styled to match the website bubble system.

## Changes Made
1. Social channels added to contact bubbles
- Added:
  - Instagram
  - Twitter
  - LinkedIn
  - Facebook
- Applied in both:
  - mobile hamburger contact card
  - floating contact dock (mobile + desktop)
- Implemented in:
  - `src/components/Navbar.tsx`
  - `src/components/FloatingContactDock.tsx`

2. Fiverr icon switched to uploaded PNG
- Replaced inline Fiverr SVG icon usage with uploaded asset:
  - `/uploads/fiverr-logo-png_seeklogo-376328.png`
- Applied subtle circle crop, white bubble tone, and shadow treatment to align with existing icon-bubble standards.
- Implemented in:
  - `src/components/Navbar.tsx`
  - `src/components/FloatingContactDock.tsx`

3. Localization updates for new social labels/ARIA
- Added i18n keys for new social entries in:
  - `public/locales/es/translation.json`
  - `public/locales/en/translation.json`

## Files Updated
- `public/locales/es/translation.json`
- `public/locales/en/translation.json`
- `public/uploads/fiverr-logo-png_seeklogo-376328.png`
- `src/components/Navbar.tsx`
- `src/components/FloatingContactDock.tsx`
- `changes/2026-02-12-social-bubbles-expansion-and-fiverr-png.md`

## Validation
- `npm run build` completed successfully.
