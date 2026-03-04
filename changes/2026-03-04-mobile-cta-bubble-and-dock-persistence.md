# 2026-03-04 - Mobile CTA Bubble Routing and Dock Persistence

## Summary
Adjusted mobile CTA behavior so contact actions open the floating social bubble menu, styled the mobile Hero contact CTA as primary blue, hid the mobile "Ver Mi Trabajo" button, and restored the floating contact bubble so it remains visible across the page.

## Changes Made
1. Hero mobile CTA behavior and styling
- Hid the `Ver Mi Trabajo` button on mobile (`md` and up only).
- Switched `Contactar` to the same primary blue button style.
- Routed `Contactar` click on mobile to open the floating bubble menu instead of scrolling to footer.

2. Portfolio CTA routing
- Updated `Define tu paquete UGC` so on mobile it opens the floating bubble menu.
- Kept existing desktop behavior (scroll to `#contact`).

3. Floating bubble open API
- Added a small contact dock event utility module to trigger/open the bubble menu from CTA buttons.
- Connected `FloatingContactDock` to listen for the open event and expand on mobile.

4. Dock visibility fix
- Restored `FloatingContactDock` rendering outside below-fold conditional branches so it stays available on all page states.

## Files Updated
- `src/components/Hero.tsx`
- `src/components/Portfolio.tsx`
- `src/components/FloatingContactDock.tsx`
- `src/pages/Index.tsx`
- `src/lib/contact-dock.ts`
- `changes/2026-03-04-mobile-cta-bubble-and-dock-persistence.md`

## Validation
- `npm run build`
