# Service pages: duplicate H2s from dual viewport shells

**Status:** Current for this pass  
**Implemented:** 2026-10-19  
**Scope:** All 16 service landings (8 ES `/servicios/<slug>/`, 8 EN `/en/services/<slug>/`)

## Cause

Not a prerender/shell double-injection. `scripts/prerender.mjs` still replaces
`#root.innerHTML` with one React render. Boot-shell H2s (`boot-section-heading`
and the noscript copy) live in the committed entry HTML and disappear when
prerender overwrites `#root`.

The live prerendered body had **14 `<h2>` / 7 unique texts** because
`ServiceLandingPage` mounts both responsive shells at once:

- `src/components/ServiceLandingPage.tsx` ~247–359 — `.viewport-layout--mobile`
  and `.viewport-layout--desktop`, each with `ServicePageInner` plus a
  featured-work heading (`h2.sr-only` in the mobile reel and in
  `ServiceHeroDesktop`)
- CSS (`src/index.css` ~309–327 and `src/styles/template-critical.css` ~6–21)
  shows exactly one layout (`display: none` on the other)

Both shells stay mounted on purpose: hydration must not replace the complete
page at the mobile breakpoint. Homepage, guides, and hubs do not use this
pattern.

The seven titles (example from `/en/services/ugc-testimonials-reviews/`):
Examples of my work; What a video review is for; What you can ask me for;
How it works; Is this for you?; Questions; Does your product need video
reviews?

H1 was already unique: mobile `h1.svm-title`, desktop title is `p.svh-title`.

## Fix

Keep both visual variants. Only the desktop shell emits real `<h2>` tags
(those beat ids are the ones in JSON-LD `WebPageElement` urls). Mobile
section titles render as `<p>` with the same classes, no `aria-hidden` — on
a phone that line is the visible heading and the desktop H2 is `display:
none`. Same approach as the vertical/service H1 demotion
(`2026-10-13-vertical-h1-llms-titles.md`).

No layout or visual class changes. FAQ copy is unchanged, so FAQPage still
matches the visible Q/A word for word. Single H1 preserved.

## Files

- `src/components/service-keynote/BeatHeading.tsx` (new)
- `src/components/service-keynote/{Overview,Formats,Process,Fit,Questions,Close}Beat.tsx`
- `src/components/ServiceLandingPage.tsx` (mobile featured title)
- `src/data/service-inner-argument.test.tsx`
- `architecture/05-seo-i18n-static-entrypoints.md`

## Before / after H2 counts

All 16 service pages, prerendered `#root`:

| | Total H2 | Unique H2 text | H1 |
|---|---|---|---|
| Before (live 2026-10-19) | 14 | 7 | 1 |
| After | 7 | 7 | 1 |
