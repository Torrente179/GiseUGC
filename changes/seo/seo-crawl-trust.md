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
- `177` Fiverr reviews
- `4.7` Fiverr rating
- `ES+EN`

OG images read `getOgProofLine()` from that same file (`OG_PROOF_LINE_MODE`,
default `exact`). A build check fails if the interpolated `exact` line drifts
from `4.7/5 · 177 reseñas en Fiverr` / `4.7/5 · 177 reviews on Fiverr`.

**Authority resync:** any change to `fiverrRating` or `fiverrReviewCount` must
also trigger a resync of the off-site bios (Fiverr, LinkedIn, and the
directories paste pack, owned by the Authority team).

Canonical Fiverr proof is **seller overall** on `https://www.fiverr.com/gisela_sm` (no `?source=`). Ignore gig-level ratings (one gig can still show 4.8).

`ManifestoChapter` emits those values in the first HTML snapshot (no animated zeros for Googlebot). Homepage JSON-LD keeps `AggregateRating` 4.7/177 with `worstRating: "1"` and **does not** invent `Review` / `reviewBody` nodes. The homepage `#testimonials` placeholder now also emits the real Fiverr review quotes in that first HTML (handle, country, rating, text) so lazy-loaded cards do not hide them from crawlers. Still no per-review schema. See `2026-10-16-testimonials-prerender-text.md`.

The same marketplace `AggregateRating` (no `Review` / `reviewBody`) is restored on:

- `/servicios/creadora-ugc-bilingue/` and `/en/services/bilingual-ugc-creator/` — on the Service node, because those pages show 4.7/177 in the GEO fact.
- `/servicios/` and `/en/services/` — on a ProfessionalService node, because the hub shows the same proof line.

Other service pages and the verticals/resources hubs must **not** grow a rating. Homepage Person `alternateName: Gisela.UGC` is unchanged.

Route-data JSON (`#route-data`) must not leak authoring markdown such as `[gisela_sm](https://www.fiverr.com/gisela_sm)`. `serializeRouteDataJson` in `src/lib/inline-copy-links.tsx` rewrites those strings to `{type,label,href}` segments before they hit the first HTML. Authoring in `service-pages.ts` / `hub-pages.ts` stays markdown.

Dates: `src/data/content-dates.ts`. Sitemap lastmod, JSON-LD `dateModified`, visible "last updated" labels, and llms `Last-Updated` read from here. `CONTENT_DATES.home` (and therefore llms `Last-Updated`) is `2026-10-15` after llms dropped "active" from "28+ brand campaigns". Hub family is `2026-10-14`; vertical/service/legal stay `2026-10-13`; resources are `2026-10-14`. See `2026-10-15-llms-brand-campaigns.md`. Do not change Person `sameAs` or IndexNow here.

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
- Fiverr 4.7/177 proof is services-hub only. Those two hub shells (and `HubPage` SSR) include `AggregateRating` 4.7/177; verticals and resources hubs do not.
- Child-page breadcrumbs point at these hubs (Home › hub › page) since 2026-10-16 — see that entry below. The earlier rule that kept bilingüe and cómo-contratar breadcrumbs off the hubs is retired.

Routing trap: `scripts/normalize-client-entrypoints.mjs` must map the **exact** hub `index.html` files to `src/entry-hub.tsx` *before* the `servicios/*` → `entry-service.tsx` prefix match. Otherwise the hub hydrates `ServiceLandingPage` and React 404s.

Hubs are registered in `PAGE_REGISTRY` (`family: 'hub'`) so Vite emits the MPA inputs. `App.tsx` and `src/entry-server.tsx` mount `HubPage`.

Hub shells can be regenerated with `node scripts/sync-hub-entrypoints.mjs`. Copy in that script must match `src/data/hub-pages.ts`. **Do not** add that script to `prebuild`.

## IndexNow

`scripts/indexnow-ping.sh` submits every `<loc>` from `public/sitemap.xml`
(not a second hand-written URL list) to `https://api.indexnow.org/indexnow`
with `host` `www.giselasaldarriaga.com` and `keyLocation`
`https://www.giselasaldarriaga.com/<key>.txt`.

Key file (content = key): `public/bc6e18cf87bf49fcc1ad22e759c161ac.txt`,
served at `/bc6e18cf87bf49fcc1ad22e759c161ac.txt`.

**Manual:** from the repo root, `npm run indexnow` or
`./scripts/indexnow-ping.sh`. Use `--soft` or `INDEXNOW_FAIL_SOFT=1` to
keep a non-zero IndexNow response from failing the shell.

**Production:** `.github/workflows/indexnow.yml` runs only on push to
`main` (and `workflow_dispatch`). It waits for the Vercel production
deploy (`scripts/wait-for-production.sh`), then pings. Every step is
fail-soft (`continue-on-error`, `--soft`) so IndexNow never blocks
deploy. Vercel still publishes from `main` independently of this
workflow.

Alias 301s (`/contratar`, `/hire`, `/en/hire` and trailing-slash twins)
are Vercel-only. They are **not** in `PAGE_REGISTRY` or the sitemap.

## Hire-intent alias 301s (2026-10-13)

Permanent 301s in `vercel.json`, targeting the live self-canonical
guides (both 200):

- `/contratar` and `/contratar/` → `/recursos/como-contratar-creadora-ugc/`
- `/hire`, `/hire/`, `/en/hire`, `/en/hire/` → `/en/resources/how-to-hire-ugc-creator/`

Do not add these aliases to the sitemap, FAQ schema, or in-page links.

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

## 2026-09-11 — seller-overall proof sync (4.8/173 → 4.7/177)

Live Fiverr seller overall at `https://www.fiverr.com/gisela_sm` is **4.7 / 177**. Production crawlable proof still said 4.8/173. This pass hardens the existing surfaces — no rebuild, no new routes, no invented `Review` / `reviewBody` nodes, no GiseUGC keyword.

Synced:

- `src/data/site-proof.ts`: `fiverrRating` 4.7, `fiverrReviewCount` 177. `FIVERR_RATING_DISTRIBUTION` buckets from the live seller profile (156 / 12 / 4 / 0 / 5) so they sum to 177.
- `AggregateRating` `ratingValue` `"4.7"` / `reviewCount` `"177"` on homepage, `/servicios/` + `/en/services/`, and bilingüe Service nodes. `worstRating`/`bestRating` unchanged.
- Locked Landing Content GEO blocks and short proof lines ES+EN on homepage noscript, bilingüe, `/servicios/` hub twins, and cómo-contratar React copy. Fiverr href stays query-free.
- `public/llms.txt` and `public/llms-full.txt`; `CONTENT_DATES.home` / llms `Last-Updated` → `2026-09-11`. Hub/service/resource family dates stay (this is a figure sync, not a GEO rewrite of those families).
- Tests: crawl-trust, geo-copy, hub-pages, service-inner-argument.

Gig-level 4.8(139) is ignored. Public brand remains Gisela Saldarriaga / Gisela.UGC.

## 2026-10-16 — internal link map: Home › hub › page

A crawl of all 48 prerendered routes showed the hubs were orphans and the
breadcrumbs skipped them:

- Every service, vertical and resource page put its middle crumb
  ("Servicios" / "Industrias" / "Recursos") on the **homepage URL** in
  `BreadcrumbList`, so positions 1 and 2 were the same item. The visible
  service crumb went to `/#services`; vertical and resource crumbs were
  plain text. The resource shells linked "Recursos" to `/#services`.
- Each hub had inbound links from the two sibling hubs only.
- Every prerendered page shipped **two** `BreadcrumbList` nodes under one
  `@id` (boot shell + PageSeo). On vertical pages they disagreed on the hub
  name ("Verticales" vs "Industrias").
- Hubs rendered without the navbar, language pill or page-end strip.

The user chose to point breadcrumbs at the hubs and add a hub rail to the
page-end strip. What shipped:

- **One label source:** `src/data/hub-labels.ts` (`HUB_LABELS`) names the
  hubs for the hub's own breadcrumb, the child-page middle crumb (visible +
  JSON-LD), and the page-end rail.
- **Breadcrumbs:** `ServiceHero` (desktop trail, sr-only trail, mobile back
  chip), `VerticalLandingPage` (both trails), `ResourcePage`, and their
  `BreadcrumbList` position 2 now use `getHubPath(family, locale)`.
- **Boot shells:** `setHubBreadcrumb` / `setBootBreadcrumbHub` in
  `scripts/lib/entry-html.mjs`, called from the service and vertical sync
  scripts; the resource shell breadcrumb links to `getHubPath('resources')`.
- **One BreadcrumbList per page:** `scripts/prerender.mjs` strips
  `BreadcrumbList` from non-PageSeo graphs when PageSeo has one (same as
  FAQPage). The boot `WebPage` → `#breadcrumb` reference still resolves.
  `WebPage` / `Service` duplicates are unchanged (see
  `2026-10-13-vertical-h1-llms-titles.md` §5).
- **Hub pages:** `HubPage` now renders `Navbar`, a visible breadcrumb,
  `SiteFooter` and `FloatingContactDock`, and lists children as
  `st-related-row` rows with their blurbs (styles under "HUB INDEXES" in
  `src/styles/templates.css`). Copy, titles, schema and the services-hub
  rating are unchanged.
- **Page-end strip:** `PageEndStrip` adds a Servicios · Industrias ·
  Recursos rail beside the legal rail on every page; the current page's
  pill carries `aria-current="page"`.

Guard: `src/data/internal-link-map.test.tsx` — hub in every child
BreadcrumbList and visible trail, hub chrome, hub rail on every page, no
internal href outside `PAGE_REGISTRY`, and the committed shells on the same
trail. It replaces the old "does not retarget … onto hub indexes" test in
`crawl-trust.test.tsx`.

## 2026-10-16 — industry (vertical) pages removed

The user decided to drop all five industry pages and their hub. Removed:
`/verticales/` + `/en/verticals/` and the ten children (beauty, fashion,
tech/SaaS, ecommerce, lifestyle & wellness, ES + EN) — 12 URLs, so the
registry, sitemap and prerender now cover 36 routes.

- **301s** (`vercel.json`, both slash forms) to the closest service, taken from
  each page's own first `relatedServiceIds`: beauty and ecommerce → testimonials
  & reviews; fashion and lifestyle & wellness → lifestyle UGC; tech/SaaS →
  product demos; the hub → the services hub. `/verticales/:path*` /
  `/verticales/:path*/` and `/en/verticals/:path*` / `/en/verticals/:path*/`
  catch anything else (both slash forms). Destinations stay in-locale.
- **Gone from code:** `VerticalPageId` / `VERTICAL_PATHS` / `getVerticalPath`
  and the `vertical` page family; `VerticalLandingPage`, `vertical-pages.ts`,
  `service-vertical-links.ts`, `entry-vertical.tsx`,
  `sync-vertical-entrypoints.mjs` (and its prebuild step), the committed
  shells, their OG JPEGs and manifest entries, `CONTENT_DATES.verticals`.
- **Gone from pages:** the "By industry" column on service pages (desktop
  index and mobile tab), the "By industry" list on guides, the industries hub
  link on the other hubs, and the Industrias pill in the page-end rail.
- **llms:** industry URLs removed. `llms-full.txt` keeps the industry facts
  under "Industries" with no links, and the notes for AI systems point industry
  questions at the matching service. `CONTENT_DATES.home` / llms Last-Updated →
  `2026-10-16`.

Guard: `src/data/internal-link-map.test.tsx` checks every removed URL is out of
`PAGE_REGISTRY` and 301s, in its own locale, to a registered page. Unknown
children (`/verticales/foo`, `/verticales/foo/`, EN twins) 301 in-locale to
the services hub.

## 2026-10-16 — service close index: More services first

The desktop close index on service pages now reads More services (01), Also
offered tiles (02), Resources (03); the mobile explore tabs open on More
services. At the 1100px two-column breakpoint More services spans the row and
splits its list in two (`.knc-col--services`). Test:
`internal-link-map.test.tsx`.

## 2026-10-16 — how-to-hire guides crashed on load (fixed, fd478d9)

Both how-to-hire guides showed the error boundary in production since
2026-10-14: route data ships `[label](href)` strings as segment arrays
(`serializeRouteDataJson`), and the FAQPage schema ran `visibleInlineCopy` on
one. The inline-copy helpers now take strings or segments.
`src/data/route-data-hydration.test.tsx` renders every guide and service page
from the round-tripped route data the browser receives.

## 2026-10-19 — industry catch-all trailing slash + IndexNow ping

The catch-alls previously only matched the no-slash form, so
`/verticales/<unknown>/` and `/en/verticals/<unknown>/` 404'd. Both forms now
301 in-locale to the services hub (`/servicios/` / `/en/services/`). Explicit
per-page 301s are unchanged and still win because they sit above the
catch-alls.

A manual IndexNow ping was sent on 2026-10-19 02:04 (America/Bogota, UTC-5) to
api.indexnow.org with key file `bc6e18cf87bf49fcc1ad22e759c161ac.txt`, 48 URLs
= the 36 sitemap URLs (which include the 301 targets) + the 12 removed
industry URLs, HTTP 200 accepted.

Search Console sitemap resubmission is on hold because the Ryze connector now
requires a paid plan.

