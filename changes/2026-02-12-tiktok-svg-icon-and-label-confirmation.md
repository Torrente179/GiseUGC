# 2026-02-12 - TikTok SVG Icon Upgrade + Hamburger Label Confirmation

## Summary
Replaced the temporary TikTok glyph with the provided TikTok SVG asset and confirmed the hamburger contact grid label displays `TikTok`.

## Changes Made
1. TikTok icon asset replacement
- Swapped TikTok icon rendering to use:
  - `/uploads/TikTok-Icon-Logo.wine.svg`
- Applied in:
  - `src/components/FloatingContactDock.tsx`
  - `src/components/Navbar.tsx`

2. Hamburger menu label confirmation
- Contact platform key uses `floatingContact.tiktokLabel`, so the label shown in the mobile hamburger grid is `TikTok`.
- No further locale edits required.

## Files Updated
- `src/components/FloatingContactDock.tsx`
- `src/components/Navbar.tsx`
- `public/uploads/TikTok-Icon-Logo.wine.svg`
- `changes/2026-02-12-tiktok-svg-icon-and-label-confirmation.md`

## Validation
- `npm run build` completed successfully after the update.
