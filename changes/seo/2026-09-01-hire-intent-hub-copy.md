# Hire-intent copy on the six hub indexes

**Status:** Current for hub index copy  
**Shipped:** 2026-09-01  
**Stacked on:** crawl-trust (`seo-crawl-trust.md`) + GEO copy (`2026-08-31-geo-copy-bilingual-and-hire-pages.md`)

## Why this file exists

The six hub URLs were honest 200 shells (child links + contact CTA, title/meta
`Gisela Saldarriaga`, no H1). This pass pastes the Landing Content hire-intent
copy onto those existing routes. No new URLs. Public brand is Gisela Saldarriaga
/ Gisela.UGC — never GiseUGC.

## Routes

- `/servicios/` ↔ `/en/services/`
- `/verticales/` ↔ `/en/verticals/`
- `/recursos/` ↔ `/en/resources/`

## What shipped

Typed copy in `src/data/hub-pages.ts`. `HubPage` renders H1, lead, ordered
child lists with blurbs on all three hubs, contact CTAs, and sibling-hub
links. WebPage JSON-LD `name` is the real title, not the bare entity name.

Follow-up on the same ship (copy review): vertical and resource children
gained blurbs; the `/recursos/` lead is no longer a copy of the meta.
Fiverr stays off those two hubs.

Fiverr 4.8/173 proof, with `gisela_sm` linked to
`https://www.fiverr.com/gisela_sm` (no query string), is **only** on
`/servicios/` and `/en/services/`.

Child display order is hub-specific (`SERVICE_HUB_CHILD_ORDER` etc.) and does
not retarget `PAGE_REGISTRY` / sitemap child order. Hrefs still come from
`getServicePath` / `getVerticalPath` / `getResourcePath`.

Hreflang es↔en and x-default → the ES hub are unchanged. Contact CTAs stay
`/#contact` and `/en/#contact`. Money-page breadcrumbs are still not pointed
at these hubs.

`CONTENT_DATES.hubs` is `2026-09-01`. Sitemap lastmod for the six hub locs
follows that date.

## Files

- `src/data/hub-pages.ts` — titles, meta, H1, lead, children, proof, CTAs
- `src/components/HubPage.tsx` — render the copy
- `src/data/hub-child-links.ts` — re-exports hub child hrefs/labels
- `scripts/sync-hub-entrypoints.mjs` — committed boot shells (title/meta/H1)
- the six `*/index.html` hub entrypoints
- `src/data/content-dates.ts` + `public/sitemap.xml` hub lastmod

## How to verify

1. `npx vitest run src/data/hub-pages.test.tsx src/data/crawl-trust.test.tsx`
   — SSR HubPage (the same tree `scripts/prerender.mjs` injects into `#root`)
   and the committed shells both contain the hire-intent H1/title.
2. After Vercel deploy, a no-JS fetch of each hub URL should show the new
   `<title>` and `<h1>` in the HTML response, not only after client JS.
