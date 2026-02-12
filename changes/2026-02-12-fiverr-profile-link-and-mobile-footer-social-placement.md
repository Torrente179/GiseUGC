# 2026-02-12 - Fiverr Profile Link Wiring + Mobile Footer Social Placement

## Summary
Connected all Fiverr entry points to the real profile URL and refined footer behavior on mobile by placing social icons below the Fiverr reviews chart as requested.

## Changes Made
1. Fiverr profile URL wiring
- Updated default Fiverr URL fallback to:
  - `https://www.fiverr.com/gisela_sm?source=gig_page`
- Applied in:
  - `src/components/Footer.tsx`
  - `src/components/FloatingContactDock.tsx`
  - `src/components/Navbar.tsx`

2. Footer mobile social icon placement
- Desktop: social icon row remains in the left brand column.
- Mobile: moved social icon row to render below the Fiverr ratings/review chart area.
- Implemented via responsive visibility classes in `Footer.tsx`:
  - desktop row: `hidden md:flex`
  - mobile row: `flex md:hidden`

3. Locale text alignment
- Updated contact Fiverr display text to match the real username:
  - `fiverr.com/gisela_sm`
- Applied in:
  - `public/locales/es/translation.json`
  - `public/locales/en/translation.json`

4. Mobile contact UX continuity
- Retained the new mobile menu contact platform block (WhatsApp/Telegram/Fiverr) in `Navbar.tsx`.
- Kept floating dock desktop-only treatment in `FloatingContactDock.tsx` to avoid duplicated mobile dock controls.

## Files Updated
- `src/components/Footer.tsx`
- `src/components/FloatingContactDock.tsx`
- `src/components/Navbar.tsx`
- `public/locales/es/translation.json`
- `public/locales/en/translation.json`
- `changes/2026-02-12-fiverr-profile-link-and-mobile-footer-social-placement.md`

## Validation
- `npm run build` completed successfully.
