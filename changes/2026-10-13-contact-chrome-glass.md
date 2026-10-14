# Contact chrome in glass: desktop pill + panel, phone tab bar + sheet

**Status:** Live on main
**Implemented:** 2026-10-13
**Scope:** `FloatingContactDock` (desktop, ≥ 768px), `MobileTabBar` and
`MobileContactSheet` (phones, < 768px), on every route, light and dark.

Design canvas (the user picked **D1 · Contact pill → panel** and **M1 · Liquid
glass**, tab bar and contact sheet):
<https://claude.ai/artifact/L7DtvF1VoqjmT1hfxe9Qz6>

## What changed

- **Desktop:** the row of eight full-colour logos is gone. One glass
  "Escríbeme" pill (her avatar with a WhatsApp badge) opens a panel ordered by
  intent:
  - WhatsApp as the dark primary row, then Telegram.
  - "Contrátame en Fiverr" with 4.7 ★ · 177 reseñas from `SITE_PROOF`.
  - "Sígueme": Instagram, TikTok, Threads, LinkedIn, Facebook as one-colour
    glyphs.

  The panel closes on Escape (focus returns to the pill), on a click outside,
  and whenever the pill hides. Visibility is unchanged from `703c94c`: the pill
  slides in once the hero starts leaving and steps back over the footer.
- **Phone tab bar:** a frosted capsule with Inicio / Portafolio / Servicios and
  a glass lens that springs to the active tab, plus Contacto as its own dark
  round button. The page fades out under the bar like a native scroll edge.
  `--app-dock-clearance` grows to 5.25rem for the taller floating bar.
- **Phone contact sheet:** a floating glass card inset 8px from the edges,
  with her avatar and "Contáctame / Cuéntame de tu proyecto". The big button is
  "Escríbeme por WhatsApp", then Telegram and Fiverr (with its rating) side by
  side, then the social profiles as labelled glass discs. It is built on vaul's
  primitives directly, so shadcn's Drawer defaults (grabber, full-width,
  `bg-background`) no longer apply.
- Shared pieces: `src/components/contact/ChannelIcon.tsx` (line glyphs in
  `currentColor`) and `src/styles/app-chrome.css`. The links still come from
  `CONTACT_CHANNELS`. `ContactChannelGlyph.tsx` and `CHANNEL_LOGO_SRC` were
  removed because nothing used them.
- New copy keys: `floatingContact.whatsappCta`, `.followMe`, `.close` (ES/EN).

## Gotchas

- **`view-transition-name` makes an element a backdrop root.** With the name on
  the `.cdock` / `.lgbar` wrappers, the glass inside had nothing to blur and
  showed the page through sharply. The names now sit on the glass pieces
  themselves: `site-dock` on the pill, `site-tabs` on the capsule and
  `site-tabs-contact` on the Contacto button, with the same "hold still" rules
  as the rest of the chrome.
- The panel title is a `<p>`. The global `p` colour in `index.css` softens it,
  so `.cdock-title` sets its colour explicitly.
- The old rules in `index.css` (`.mtabbar*`, `.msheet*`,
  `.floating-contact-dock`, `.dock-action`, `dock-breathe`) are no longer
  referenced. They were left in place because that file was being edited in
  parallel.

## Verified

Headless Chrome (puppeteer), light and dark:
- **390px:** the bar sits at the bottom with no overflow, and Contacto opens
  the sheet (8 links) and hides the bar.
- **1440px:** the pill is hidden at the top and shows after scrolling, it
  opens the panel, and Escape closes it and returns focus.
- **Glass:** it blurs once the transition names moved.
- **Checks:** `npm run typecheck`, `npm test` (296 passed), ESLint on every
  changed file.
