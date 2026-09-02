# Crawl trust: honest proof, dates, Fiverr canonicals, hub 200s

**Status:** Current for crawl-trust / hub indexes
**Implemented:** 2026-08-31
**Scope:** Homepage proof HTML vs schema vs llms, sitemap lastmod, Review JSON-LD removal, Fiverr `sameAs` canonical, Person `alternateName`, hub index 200s

## Why this file exists

Juan Pablo requires documentation in `changes/`. This pass is a crawl-trust slice, not another homepage-schema rewrite. Read this before changing homepage counters, `CONTENT_DATES`, Fiverr profile URLs, or Person schema. Hub index *copy* now lives in `2026-09-01-hire-intent-hub-copy.md`; this file still owns the 200-route, hreflang, sitemap, and hydrator rules for `/servicios/` `/verticales/` `/recursos/` (and EN twins).

Related current schema delivery still lives in `seo-ssr-structured-data-and-metadata-parity.md`. That file's old "Review provenance" open item is resolved here.

## Proof slice (do not rewrite)

Single source: `src/data/site-proof.ts`

- `28+` brand campaigns
- `173` Fiverr reviews
- `4.8` Fiverr rating
- `ES+EN`

`ManifestoChapter` emits those values in the first HTML snapshot (no animated zeros for Googlebot). Homepage JSON-LD keeps `AggregateRating` 4.8/173 with `worstRating: "1"` and **does not** invent `Review` / `reviewBody` nodes.

The same marketplace `AggregateRating` (no `Review` / `reviewBody`) is restored on:

- `/servicios/creadora-ugc-bilingue/` and `/en/services/bilingual-ugc-creator/` — on the Service node, because those pages show 4.8/173 in the GEO fact.
- `/servicios/` and `/en/services/` — on a ProfessionalService node, because the hub shows the same proof line.

Other service pages and the verticals/resources hubs must **not** grow a rating. Homepage Person `alternateName: Gisela.UGC` is unchanged.

Route-data JSON (`#route-data`) must not leak authoring markdown such as `[gisela_sm](https://www.fiverr.com/gisela_sm)`. `serializeRouteDataJson` in `src/lib/inline-copy-links.tsx` rewrites those strings to `{type,label,href}` segments before they hit the first HTML. Authoring in `service-pages.ts` / `hub-pages.ts` stays markdown.

Dates: `src/data/content-dates.ts`. Sitemap lastmod, JSON-LD `dateModified`, visible "last updated" labels, and llms `Last-Updated` read from here. Hub shells use `CONTENT_DATES.hubs` (`2026-09-01` after hire-intent copy). Service and resource families are `2026-08-31` after the GEO-copy pass on bilingüe / how-to-hire.

`public/sitemap.xml` is generated from `PAGE_REGISTRY` + `CONTENT_DATES` (`src/lib/sitemap.ts`). Vite writes that file during `vite build` (the same `/sitemap.xml` static path production serves). Do not invent URLs; do not serve the sitemap through React.

## Fiverr canonical

Profile URL is `https://www.fiverr.com/gisela_sm` with no `?source=gig_page`.

- Fallback lives in `src/lib/contact-channels.ts` (`CONTACT_URLS.fiverr` strips any query).
- Navbar, Footer, and FloatingContactDock read that value.
- Homepage Person + ProfessionalService `sameAs`, noscript hrefs, `public/llms.txt`, and `public/llms-full.txt` use the same URL.

## Person `alternateName`

`"alternateName": "Gisela.UGC"` is on the homepage **Person** node only (`index.html`, `en/index.html`). It is not a keyword, not a second Organization, and not on ProfessionalService.

## Hub index routes

These six URLs must be `text/html` 200, never Vercel `text/plain` 404:

- `/servicios/` ↔ `/en/services/`
- `/verticales/` ↔ `/en/verticals/`
- `/recursos/` ↔ `/en/resources/`

Rules:

- Hreflang es↔en; **x-default is the ES hub**.
- Both URLs in `public/sitemap.xml`, immediately before that family's children.
- Contact CTAs to `/#contact` and `/en/#contact`.
- Child links only to existing money-page routes (`src/data/hub-pages.ts`).
- Hire-intent title, meta, H1, and body now live on these routes — see
  `2026-09-01-hire-intent-hub-copy.md`. Do not invent new URLs.
- Fiverr 4.8/173 proof is services-hub only. Those two hub shells (and `HubPage` SSR) include `AggregateRating` 4.8/173; verticals and resources hubs do not.
- Do not retarget bilingüe (`/servicios/creadora-ugc-bilingue/`) or cómo-contratar (`/recursos/como-contratar-creadora-ugc/`) breadcrumbs onto these hubs.

Routing trap: `scripts/normalize-client-entrypoints.mjs` must map the **exact** hub `index.html` files to `src/entry-hub.tsx` *before* the `servicios/*` → `entry-service.tsx` prefix match. Otherwise the hub hydrates `ServiceLandingPage` and React 404s.

Hubs are registered in `PAGE_REGISTRY` (`family: 'hub'`) so Vite emits the MPA inputs. `App.tsx` and `src/entry-server.tsx` mount `HubPage`.

Hub shells can be regenerated with `node scripts/sync-hub-entrypoints.mjs`. Copy in that script must match `src/data/hub-pages.ts`. **Do not** add that script to `prebuild`.

## IndexNow

`scripts/indexnow-ping.sh` includes the six hub URLs plus the existing money pages.

## 2026-09-02 — bounce page_view leftover (language switch already on main)

The navbar language control on `main` is already real `<a href>` pairs via
`getLocalizedPathForCurrentRoute()` (`/` ↔ `/en/`, matching localized paths
on inner pages). Do not reopen that rewrite.

What was still live-broken: `public/gtm-loader.js` deferred **both** GTM and
gtag until first interaction or `setTimeout(30000)`, so bounce sessions never
fired `page_view`. gtag config + `gtag/js` now run when the deferred loader
runs. Heavy GTM (`GTM-TX2WCCLT`) still waits for first interaction or a short
idle (`requestIdleCallback` timeout ~3.5s). See
`changes/2026-04-20-analytics-defer-lazymotion-variable-fonts.md`.

Tests: `src/lib/gtm-loader.test.ts`. No hub/copy/schema/llms changes.
