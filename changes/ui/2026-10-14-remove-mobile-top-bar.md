# 2026-10-14 · Mobile top bar removed, language and theme pill kept

Below 768px the full-width top bar (the dark strip with the logo, Back button,
ES/EN and theme toggle) is gone on every route. The ES/EN + theme pill stays,
floating in the top-right corner with no strip behind it. At 768px and up
nothing changed: the floating pill nav and the language/theme pill are the same
as before (same size and position at 1280px).

## What changed

- `src/components/Navbar.tsx`: the mobile bar is removed. On phones the `<nav>`
  is a fixed, click-through (`pointer-events-none`) shell that holds only the
  `NavbarControls` pill, 16px from the right and 16px (plus
  `env(safe-area-inset-top)`) from the top. No background, border, gradient or
  reserved height; taps outside the pill reach the page. The pill keeps its own
  glass surface and border (`nav-control-rail`), so it reads on the dark Home
  hero and on light pages in both themes. Still `z-[110]`, under the Contacto
  sheet (`z-[140]`) and above page content. The `compactMobile` prop is gone,
  and `ServiceLandingPage`, `VerticalLandingPage` and `ResourcePage` no longer
  pass it. The `title-sequence-nav` class behaviour is kept
  (`Navbar.test.tsx`).
- Logo and Back button: removed with the bar. Phones use the tab bar's Inicio
  tab and the browser's own back.
- `src/styles/templates.css`: on phones `.rsc-hero` (resource pages) has
  `padding-top: env(safe-area-inset-top) + 4.5rem` instead of 7.5rem, so the
  breadcrumb starts 16px below the pill.
- `src/index.css`: removed the unused `--site-nav-offset` variable and the dead
  `body.mobile-menu-open .floating-contact-dock` rule (nothing sets that class
  since the hamburger menu was removed).
- The Contacto sheet is unchanged. For a few hours the same commit stream put an
  "Idioma y tema" row in it; that row and its `navbar.languageAndTheme` key are
  gone again.

## Checked, no spacing change needed

- Home: the hero fills the screen from the top edge; the pill floats over it.
- Service and vertical pages on phones: full-bleed video hero with the text at
  the bottom. `.st-hero` belongs to the desktop layout, which is hidden below
  768px.
- Legal pages: content starts 56px from the top and the breadcrumb is shorter
  than the space to the left of the pill.
- Hub pages (services, resources): they never had the bar or the pill.

## How it was verified

- `npm run typecheck`, `npm run lint` (0 errors) and `npm test` (296 tests) pass.
- Local dev server at 390px: Home with the pill in light and dark, the pill
  rectangle (126x40, 16px from the top and right), taps outside the pill
  reaching the page, the Contacto sheet open, and the pill over light page
  content.
- The dev server cannot render service, vertical or resource pages (they hydrate
  from prerendered route data). Those were checked on the live site with the old
  bar hidden and a pill at the new position.
- 1280px and 768px: pill nav unchanged, tab bar hidden from 768px up.

## Left as is

- `scroll-margin-top` values (`.stm-beat`, `.rsc-chapter`, `scroll-mt-28` on
  legal sections) are anchor-jump offsets, not bar clearance on phones. They
  leave a little extra space above a section when jumping to it.
