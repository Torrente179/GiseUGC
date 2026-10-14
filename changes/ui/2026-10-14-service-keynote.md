# 2026-10-14 · Service pages below the hero: the "9 · Keynote" design

Everything on the eight service pages (16 routes) below the hero is redrawn in
the approved "9 · Keynote" design, in light and dark, as a desktop layout and as
an app-like phone layout. The hero (desktop `svc-cine-hero` with its "The work"
rail, phone `stm-hero` and `stm-reel`) is untouched. Reference boards, their
CSS and the build brief are in `_mockups/service-keynote/` at the repo's parent.

## Structure

The six beats keep their ids and order (`ficha`, `recibes`, `como-corre`,
`encaja`, `faq`, `empezar`), so the `WebPageElement` schema, the FAQPage and
Service schema, and deep links are unchanged.

0. Local nav: the page name, then Overview / Formats / Process / Fit /
   Questions, the current one marked by the beat spy. On phones the names fold
   into a "current section" menu. Links use `useHashlessSectionNavigation`
   (a bare `#hash` link is a history entry to the app's router, which restores
   the saved scroll, the top).
1. Overview: gradient accent on one phrase of the title, a cut-out of Gisela in a
   spotlight (dark) or sand halo (light), the intro split around her with key
   phrases in full ink, a spec table, and `geoFact` as a quiet line under it.
2. Formats: a CSS iPhone showing the clip for the selected format, with a
   sliding tablist (arrow keys, Home/End). One muted preview plays on top, only
   while the phone is in view and only in the visible shell; reduced motion
   keeps the posters. All four descriptions stay in the HTML.
3. Process: tall image cards with step number and name over the still; a grid
   inside the content width on desktop (see the follow-up below), a snap rail on
   phones.
4. Fit: one wide photo, then the two columns; on phones a two-option toggle
   that keeps both lists in the DOM.
5. Questions: native `<details>`, the first open.
6. Close: headline, CTA, a fan of the page's three featured clips, "Also
   offered" tiles (image = that service's lead clip poster), then the link lists.
   Phones: tiles as a swipe rail, an "Explore" tablist over one list at a time.
   A service shown as a tile is not listed again under "More services".

## Contact: "Escríbeme" for this service

Every service page has a clear way to message Gisela about that service: a
compact pill at the right end of the local nav (an icon-only 44px circle on
phones) and the close's teal CTA. Both open the same two-channel choice the
site's contact pill offers, WhatsApp first, then Telegram, with the service
named at the top of the card.

- `src/components/service-keynote/ContactChoice.tsx`: the panel. Channels,
  URLs, labels and icons come from `src/lib/contact-channels.ts`,
  `ChannelIcon` and the existing `floatingContact.*` / `navbar.messageMe`
  strings, so the number and handles stay in one place (including
  `VITE_WHATSAPP_URL`). It reuses the dock's `cdock-*` rows and the chrome
  tokens from `app-chrome.css`. No channel was added. `Navbar.tsx` is not
  touched.
- WhatsApp opens with a prefilled message in the page's language, built by
  `src/lib/service-contact.ts` from the page's `navLabel`: "Hi Gise, I'm
  interested in: UGC ads for TikTok and Meta" / "Hola Gise, me interesa: UGC
  Ads para TikTok y Meta". Telegram has no prefill for a phone link, so it opens
  as it does everywhere else.
- Desktop: a card anchored to the trigger. Phones: a card above the tab bar with
  a scrim, 44px close button and 56px rows. Escape and outside click close it,
  focus moves into the card and returns to the trigger, Tab stays inside.
- Without scripts the trigger is a link to the page's own `#contact` (the
  footer block). It points at the same path on purpose: `client-runtime.tsx`
  turns any link to another path into a page load before React's click handler
  can run, which is why a link to `/#contact` could not open the panel.

## Per-service tailoring (all 8 services, ES and EN)

- `src/data/service-page-tailoring.ts`: `sectionIntroTitleAccent`,
  `sectionIntroHighlights`, `fitHighlights`, and one `clipId` per deliverable
  (shared by ES and EN, no repeats within a page, the page's own
  `featuredExamples` first). Merged in `getServicePageContent`; the fields are
  optional on the type, and the renderers fall back to plain text when a phrase
  is missing. `service-page-tailoring.test.ts` fails the build if edited copy
  stops matching a phrase.
- `src/data/service-page-imagery.ts`: the cut-out per service (rotated so
  neighbours differ), the Fit photo, and one still per process step, all from
  existing posters and their variants. Alt text is written for both languages.
- `RelatedServiceSummary` now carries `id` and `leadClipId`.
- The three cut-outs live in `public/uploads/service-cutout-*.webp`.

## Code and styles

- `src/components/ServicePageInner.tsx` is now a thin shell over
  `src/components/service-keynote/*` (one file per beat, plus the segmented
  control, CSS phone, rail and proximity hooks).
- `src/styles/service-keynote.css`: plain CSS with literal class names, theme
  tokens for light (default) and `.dark`, shells `kn--d` and `kn--m`. Headings
  carry `section-label` only as a hook to leave the site-wide h1-h6 rules; the
  rules below it reset that class's small-caps look.
- The old inner styles (`svc-spine`, `svc-ficha`, `stm-beat`, `stm-stepper`,
  `stm-close` and the rest) are no longer referenced, so Tailwind's purge drops
  them from the build (`templates.css` is about 13 KB smaller). They are still in
  the source of `templates.css`; the vertical and resource pages share some
  neighbouring rules, so they were left in place.

## Checked

- typecheck, lint (0 errors), 373 unit tests, production build with prerender.
- Tests: `service-inner-argument.test.tsx` moved from the old markup (spine,
  `stm-*`, `svc-inner-close-shell`) to the new structure and now compares intro
  text with inline wrappers removed, because the intro is split around the
  figure and the title carries an accent span. `geo-copy.test.tsx` checks block
  order the same way. Coverage of what still exists (H1/H2 beats, FAQ answers,
  hrefs, schema, GEO block on the bilingual pages) is kept.
- Both themes at 1440 and 390; keyboard on the tablists, rail arrows, section
  menu, fit toggle and explore tabs.
- Lighthouse (mobile, local preview, same machine, three runs per page; baseline
  = the commit before this one): performance 0.90-0.91 against 0.91-0.92, CLS 0,
  LCP about 0.1-0.2 s later, image bytes at load identical to the baseline.
  Stylesheet transfer is +7 KB (gzip) and script +10 KB. Below-the-fold stills
  wait for `IntersectionObserver` (`useNearViewport`) instead of `loading="lazy"`,
  because lazy alone fetched them next to the hero poster. Accessibility: 14
  fewer color-contrast failures (the old kickers); the one left is the hero's
  "The work" eyebrow. The strict budgets in `lighthouse.shared.cjs` (20 KB CSS,
  150 KB JS, LCP 1.8 s) were already exceeded before this change.

## Follow-up: the phone frame

The CSS phone in Formats and in the close's fan (`.kn-phone`) is the iPhone 17
Pro Max frame of the home page's reel phone (`.reel-phone`, same radii, glass,
island and button positions). Its rim was written as `padding: 1.28%`, and a
percentage padding resolves against the containing block, not the phone: at
1440 px the rim was 18 px instead of 4 px on the Formats phone (8 px instead of
4 px on the fan), which read as a thick silver frame. It is now
`calc(var(--w) * 0.0128)`, the reel phone's formula, so the rim is 1.28% of the
device width in every shell. Measured on the build, every frame proportion
(body, glass and screen radii, island size and position, button offsets) now
matches `.reel-phone` within pixel rounding. Before/after shots of Formats
(light and dark, 1440 and 390) are in `_mockups/service-keynote/shots/phone-fix/`.

## Follow-up: Process as a grid on desktop

On the desktop shell "Cómo trabajamos" no longer scrolls sideways. The prev/next
arrows and the horizontal rail are gone (the fourth card used to sit half cut off
at 1440); the four cards are a grid in the same content width as the title
(`--kn-pad`, 1248 px at most), so the title's left edge is the grid's left edge
and the grid is centred on wide screens.

- 4 columns from 1200 px, 2 x 2 below (768-1199). The breakpoint is where the
  four-up cards stop being comfortable: at 1200 a card is 242 px wide, and the
  longest step name wraps to three lines inside it.
- Cards keep the 380:500 proportion they had, radius 28, the same stills and crop,
  the number and name over the still at the same size, and the sentence below at
  17 px. Only the card width and the gap changed (24 px between columns, 56 px
  between the two rows of the 2 x 2).
- The phone shell is untouched: same snap rail, same cards, still focusable as a
  scroller. The phone shots are pixel-identical before and after. The rail keeps
  its tab stop only on phones; on desktop the list is plain content.
- Removed with the arrows: `.kn-arrows`, `.kn-arr` and the `--kn-arr-*` tokens in
  `service-keynote.css`, the `previousStep` / `nextStep` strings in `labels.ts`,
  and `useRail` in `ProcessBeat` (`CloseBeat` still uses the hook). The `sizes`
  hint of the stills is now `(min-width: 1200px) 294px, 50vw`.
- `service-inner-argument.test.tsx`: the desktop check now expects four cards in a
  list with no arrow buttons; the phone check expects the focusable rail.

Checked: typecheck, lint (0 errors), 373 unit tests, production build with
prerender. On the build, all 16 service routes at 1920, 1440, 1280, 1200, 1199,
1024, 768 and 390: column count, grid centred, title flush with the grid, no step
name overflowing its card, no horizontal page scroll, phone rail still scrolls.
Before/after shots (1440, 1024, 390, light and dark, two pages) are in
`_mockups/service-keynote/shots/process-grid/` at the repo's parent.
