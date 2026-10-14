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
3. Process: a rail of tall image cards with step number and name over the still;
   arrow buttons on desktop, a snap rail on phones.
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
