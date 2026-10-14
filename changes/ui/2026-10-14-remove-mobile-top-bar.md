# 2026-10-14 · Mobile top bar removed

Below 768px the fixed top bar (logo, Back button, ES/EN, theme toggle) is gone on
every route. At 768px and up nothing changed: the floating pill nav and the
language/theme pill are the same as before (same size and position at 1280px).

## What changed

- `src/components/Navbar.tsx`: the mobile block is removed and the `<nav>` is
  `hidden md:block`, so below 768px it draws nothing: no bar, border,
  background, gradient or reserved height. The `compactMobile` prop is gone, and
  `ServiceLandingPage`, `VerticalLandingPage` and `ResourcePage` no longer pass
  it. The `title-sequence-nav` class behaviour is kept (`Navbar.test.tsx`).
- ES/EN and the theme toggle now sit in the Contacto sheet, in a row at the
  bottom labelled "Idioma y tema" / "Language and theme"
  (`src/components/mobile/MobileContactSheet.tsx`). It reuses `NavbarControls`
  and the existing `.msheet-controls` class, which no component was using.
  New key `navbar.languageAndTheme` in both locale files.
- The Back button went with the bar. The tab bar's Inicio tab and the browser's
  own back remain.
- `src/styles/templates.css`: on phones `.rsc-hero` (resource pages) has
  `padding-top: env(safe-area-inset-top) + 3.5rem` instead of 7.5rem, which was
  there to clear the bar.
- `src/index.css`: removed the unused `--site-nav-offset` variable and the dead
  `body.mobile-menu-open .floating-contact-dock` rule (nothing sets that class
  since the hamburger menu was removed).

## Checked, no spacing change needed

- Home: the hero fills the screen from the top edge.
- Service and vertical pages on phones: full-bleed video hero with the text at
  the bottom. `.st-hero` belongs to the desktop layout, which is hidden below
  768px.
- Legal pages: content already started 56px from the top, partly under the bar.
- Hub pages (services, resources): they never had the bar.

## How it was verified

- `npm run typecheck`, `npm run lint` (0 errors) and `npm test` (296 tests) pass.
- Local dev server at 390px: Home with no bar, and the Contacto sheet with the
  new row in light and dark. The theme toggle and ES to EN both work from the
  sheet.
- The dev server cannot render service, vertical or resource pages (they hydrate
  from prerendered route data). Those were checked on the live site with the
  bar hidden and the new CSS injected.
- 1280px and 768px: pill nav unchanged, tab bar hidden from 768px up.

## Left as is

- `scroll-margin-top` values (`.stm-beat`, `.rsc-chapter`, `scroll-mt-28` on
  legal sections) are anchor-jump offsets, not bar clearance on phones. They
  leave a little extra space above a section when jumping to it.
- `body.mobile-menu-open` is no longer referenced anywhere.
