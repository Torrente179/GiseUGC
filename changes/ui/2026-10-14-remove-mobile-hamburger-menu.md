# 2026-10-14 · Mobile hamburger menu removed

Follow-up: the mobile header strip (logo, Back) was removed the same day and the
ES/EN + theme pill now floats top-right, see `2026-10-14-remove-mobile-top-bar.md`.

The full-screen hamburger overlay in `Navbar.tsx` is gone. The bottom tab bar
(`MobileAppShell` → `MobileTabBar` + `MobileContactSheet`, added 2026-06-14) had
already replaced everything it did.

## Why

The 2026-06-14 app-shell change kept the overlay as a secondary "more" menu and
left a note to turn it into a sheet. Reading what it actually opened:

- Section links Inicio / Servicios / Portafolio: the same three destinations as
  the bottom tabs (in a different order).
- Testimonios: the only link not in the tab bar. It is a normal scroll on Home
  and was never a primary destination. FAQ was never in the menu.
- "Hire me" grid: a second, hardcoded copy of the eight channels in
  `CONTACT_CHANNELS`, which the Contacto sheet already renders.
- The brand sign-off at the bottom.

ES/EN and theme live in `NavbarControls` in the header, so they were never
inside the menu.

## What changed

- `src/components/Navbar.tsx`: dropped the overlay, the toggle button, the
  swipe-to-dismiss state, the body scroll-lock effect and the duplicate contact
  platform list (about 640 lines down to about 180). The mobile header is now
  logo, Back (off Home), ES/EN and theme. The desktop pill is unchanged.
- `src/components/mobile/MobileTabBar.tsx`: its `aria-label` used to borrow
  `navbar.openMenu`, a key that exists in neither locale file, so it fell back to
  "Navegación" even on EN. It now uses `navbar.mobileNavLabel` ("Navegación" /
  "Navigation").
- `src/locales/{en,es}/translation.json`: added `navbar.mobileNavLabel`; removed
  `navbar.hireMe` and `navbar.studioLabel`, which only the overlay used.
  (`public/locales/` is a stale copy nothing imports; left alone.)
- `MobileAppShell.tsx`: dropped the comment about the "more" menu follow-up.
- `ARCHITECTURE.md`: Navbar bullet updated.

## Left behind on purpose

`src/index.css` still has a `body.mobile-menu-open .floating-contact-dock` rule.
Nothing sets that class any more, so it is dead; it is a one-line delete the next
time someone is already editing `index.css`.

## If Testimonios needs a mobile shortcut again

Add it to the Home sections the bottom bar already spies on (`SPY_IDS` in
`MobileTabBar.tsx`) rather than bringing the overlay back. Four tabs is the
ceiling before the labels get tight at 360px.
