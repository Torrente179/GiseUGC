# 2026-02-12 - Contact Bubbles: Swap X for TikTok

## Summary
Replaced the `X` channel with `TikTok` across contact bubbles in both the floating dock and the mobile hamburger contact grid.

## Changes Made
1. Floating contact dock update
- Replaced the X platform entry with TikTok.
- Added TikTok URL env fallback:
  - `VITE_TIKTOK_URL`
  - fallback: `https://www.tiktok.com/`
- Implemented in `src/components/FloatingContactDock.tsx`.

2. Hamburger contact grid update
- Replaced the X platform entry with TikTok.
- Kept visual style and layout consistent with existing bubble aesthetics.
- Implemented in `src/components/Navbar.tsx`.

3. Localization updates
- Replaced X label/aria keys with TikTok label/aria keys in:
  - `public/locales/es/translation.json`
  - `public/locales/en/translation.json`

## Files Updated
- `src/components/FloatingContactDock.tsx`
- `src/components/Navbar.tsx`
- `public/locales/es/translation.json`
- `public/locales/en/translation.json`
- `changes/2026-02-12-contact-bubbles-swap-x-for-tiktok.md`

## Validation
- `npm run build` completed successfully.
