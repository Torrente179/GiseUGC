# Crawl trust: honest proof, dates, Fiverr canonicals, hub 200s

**Status:** Current for crawl-trust / hub indexes
**Implemented:** 2026-08-31
**Scope:** Homepage proof HTML vs schema vs llms, sitemap lastmod, Review JSON-LD removal, Fiverr `sameAs` canonical, Person `alternateName`, empty hub index routes

## Why this file exists

Juan Pablo requires documentation in `changes/`. This pass is a crawl-trust slice, not another homepage-schema rewrite. Read this before changing homepage counters, `CONTENT_DATES`, Fiverr profile URLs, Person schema, or `/servicios/` `/verticales/` `/recursos/` (and EN twins).

Related current schema delivery still lives in `seo-ssr-structured-data-and-metadata-parity.md`. That file's old "Review provenance" open item is resolved here.

## Proof slice (do not rewrite)

Single source: `src/data/site-proof.ts`

- `28+` brand campaigns
- `173` Fiverr reviews
- `4.8` Fiverr rating
- `ES+EN`

`ManifestoChapter` emits those values in the first HTML snapshot (no animated zeros for Googlebot). Homepage JSON-LD keeps `AggregateRating` 4.8/173 with `worstRating: "1"` and **does not** invent `Review` / `reviewBody` nodes.

Dates: `src/data/content-dates.ts`. Sitemap lastmod, JSON-LD `dateModified`, and llms `Last-Updated` read from here. Hub shells use `CONTENT_DATES.hubs` (`2026-08-31`).

## Fiverr canonical

Profile URL is `https://www.fiverr.com/gisela_sm` with no `?source=gig_page`.

- Fallback lives in `src/lib/contact-channels.ts` (`CONTACT_URLS.fiverr` strips any query).
- Navbar, Footer, and FloatingContactDock read that value.
- Homepage Person + ProfessionalService `sameAs`, noscript hrefs, `public/llms.txt`, and `public/llms-full.txt` use the same URL.

## Person `alternateName`

`"alternateName": "Gisela.UGC"` is on the homepage **Person** node only (`index.html`, `en/index.html`). It is not a keyword, not a second Organization, and not on ProfessionalService.

## Hub index routes (placeholder 200 HTML)

These six URLs must be `text/html` 200, never Vercel `text/plain` 404:

- `/servicios/` ↔ `/en/services/`
- `/verticales/` ↔ `/en/verticals/`
- `/recursos/` ↔ `/en/resources/`

Rules:

- Hreflang es↔en; **x-default is the ES hub**.
- Both URLs in `public/sitemap.xml`, immediately before that family's children.
- Contact CTAs to `/#contact` and `/en/#contact`.
- Child links only (existing `navLabel`s from `src/data/hub-child-links.ts`).
- No hub titles, no H1, no body copy, no Fiverr 4.8 paragraphs.
- Landing Content pastes copy after the 200 exists. Do not add hub marketing copy here.
- Do not retarget bilingüe (`/servicios/creadora-ugc-bilingue/`) or cómo-contratar (`/recursos/como-contratar-creadora-ugc/`) breadcrumbs onto these empty hubs.

Routing trap: `scripts/normalize-client-entrypoints.mjs` must map the **exact** hub `index.html` files to `src/entry-hub.tsx` *before* the `servicios/*` → `entry-service.tsx` prefix match. Otherwise the hub hydrates `ServiceLandingPage` and React 404s.

Hubs are registered in `PAGE_REGISTRY` (`family: 'hub'`) so Vite emits the MPA inputs. `App.tsx` and `src/entry-server.tsx` mount `HubPage`.

Empty shells can be regenerated with `node scripts/sync-hub-entrypoints.mjs`. **Do not** add that script to `prebuild` — Landing Content will edit the HTML by hand.

## IndexNow

`scripts/indexnow-ping.sh` includes the six hub URLs plus the existing money pages.
