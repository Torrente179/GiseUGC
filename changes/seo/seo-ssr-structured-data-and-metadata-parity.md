# SSR Structured Data + Resource Metadata Parity

**Status:** Current
**Implemented:** 2026-08-03
**Scope:** `PageSeo` schema delivery, resource entrypoint metadata, homepage JSON-LD validity

## Summary

Route structured data was being created inside a `useEffect`, so it only ever
existed for clients that execute JavaScript. Every non-rendering crawler — the
AI search bots this site explicitly invites in `robots.txt` — received resource
pages with **zero** JSON-LD. The same hook set `document.title`, so the static
resource shells carried an older, accent-stripped title that disagreed with the
rendered one.

This change moves schema into the rendered component tree, makes
`src/data/resource-pages.ts` the single source of truth for resource `<head>`
metadata, and repairs 22 schema validation errors on both homepages.

## Why it mattered

`robots.txt` allows `OAI-SearchBot`, `PerplexityBot`, `Claude-SearchBot`,
`ChatGPT-User`, `Claude-User` and `Perplexity-User`. Those agents largely do not
run JavaScript: the initial HTML response *is* the page to them. Schema built in
`useEffect` is invisible to all of them, and the resource articles — the longest
and most citable content on the site — were the pages affected.

## What changed

### 1. `src/components/PageSeo.tsx` — schema renders server-side

The `#dynamic-route-schema` DOM injection and its cleanup were removed. The
component now returns the graph as JSX:

```tsx
return structuredData ? (
  <script
    type="application/ld+json"
    data-route-schema=""
    dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
  />
) : null;
```

- `serializeJsonLd` escapes `<` as `<`. `JSON.stringify` will otherwise
  emit a literal `</script>` if any content value contains one, closing the tag
  early. Mirrors the existing `serializeRouteData` helper in `ResourcePage.tsx`.
- Placement inside `#root` (and therefore `<body>`) is deliberate and matches
  `scripts/prerender.mjs`, which already relocates head schema to end-of-body.
- The remaining `useEffect` still maintains title/meta/canonical/hreflang for
  client-side route changes. Only schema moved.

Affects every `PageSeo` consumer: `Index`, `ServiceLandingPage`,
`VerticalLandingPage`, `ResourcePage`, `LegalPage`.

**Verified no conflict with existing static shell schema.** Service and vertical
shells already carry a JSON-LD block. After this change those routes serve two
blocks — with identical `@id` values and identical `dateModified`, so they
describe the same entities and merge cleanly. The component graph is a superset
(it adds `VideoObject` nodes).

### 2. `src/components/ResourcePage.tsx` — honest dates

`datePublished` and `dateModified` were both hardcoded `'2026-03-24'`. Extracted
to constants and corrected:

```ts
const RESOURCE_DATE_PUBLISHED = '2026-03-24';
const RESOURCE_DATE_MODIFIED = '2026-07-29';   // last content commit
```

The visible `lastUpdated` label was updated in both locales to match. A schema
date that contradicts the date printed on the page is a trust signal that
cannot be cashed — they are now adjacent in the file so they cannot drift.

### 3. `scripts/sync-resource-entrypoint-meta.mjs` — new, runs in prebuild

Resource shells had hand-written metadata that had fallen out of sync:

```
Que es el UGC y por que funciona para tu marca        ← shell (crawler-visible)
Qué es UGC: guía completa de contenido generado…      ← rendered (user-visible)
```

Every Spanish shell title was accent-stripped. Spanish queries carry accents,
and two different titles for one URL is a muddled entity signal.

The script reads `metaTitle`/`metaDescription` from `src/data/resource-pages.ts`
and writes `<title>`, `description`, `og:title`, `og:description`,
`twitter:title`, `twitter:description` across all 8 resource entrypoints. It is
idempotent — a second run with no data change writes nothing.

Wired into `prebuild` as `resource:entrypoints`, after `service:entrypoints`,
mirroring `enrich-service-entrypoints.mjs`.

### 4. `index.html` + `en/index.html` — 22 validation errors → 0

- **18 errors:** six `Offer` nodes in `hasOfferCatalog` carried only
  `itemOffered` and no `price`/`priceCurrency`/`availability`. Pricing is not
  public, so the `Offer` wrapper was removed and `Service` now sits directly in
  `itemListElement`. `OfferCatalog` is an `ItemList` and accepts this. An
  `Offer` that cannot carry a price should not claim to be one.
- **4 errors:** each `VideoObject` was missing the required `uploadDate`. Set to
  `2026-03-04`, the commit that introduced them to `index.html`.

## Verification

```
npx tsc -p tsconfig.app.json --noEmit     # clean
npx vitest run                            # 61 passed
```

SSR render of both locales of a resource route:

```
route: /recursos/que-es-ugc/        ld+json blocks: 1
  types: WebPage, BreadcrumbList, Article, FAQPage
  Article dates: 2026-03-24 -> 2026-07-29
  FAQ questions: 6
route: /en/resources/what-is-ugc/   ld+json blocks: 1
  types: WebPage, BreadcrumbList, Article, FAQPage
```

`FAQPage` markup was confirmed to match **visible** content — the FAQ questions
appear in the rendered body (`id="faq"` section), not only in `<noscript>`.
Marking up content users cannot see would violate Google's structured data
policy.

Homepage schema validated clean via
`seo-geo-ultimate/scripts/schema_validator.py --file`.

## Open items

- **Review provenance — resolved 2026-08-31.** Invented homepage `Review` /
  `reviewBody` nodes were removed. Visible Fiverr proof is 4.8/173 via
  `AggregateRating` only. See `seo-crawl-trust.md`.
- **Accent stripping in homepage schema text.** Values such as
  `"Resena de Estilo de Vida"` and `"Testimoniales y resenas UGC"` are missing
  `ñ`/accents inside `index.html` JSON-LD. Not corrected here — it changes
  displayed strings and was outside this change's scope.
- **No image/alt audit exists.** Service pages now serve 12 images each and
  nothing validates alt coverage.
- **Hub index copy — resolved 2026-09-01.** `/servicios/`, `/verticales/`,
  `/recursos/` and EN twins now carry hire-intent title/H1/body. See
  `2026-09-01-hire-intent-hub-copy.md`.

## 2026-10-13 — one FAQPage, visible Q/A, vertical money-page links

Harden only. No new FAQs, no hub FAQ blocks. Hire-intent 301s, Person
`sameAs` YouTube, and IndexNow landed on main from PR #15 and stay in this
merge.

### One FAQPage per service and vertical page

Boot-shell JSON-LD and `PageSeo` both used to emit `FAQPage` with the same
`@id`. After prerender that was two FAQPage nodes on every ES+EN service and
vertical URL. `page.faqs` in `service-pages.ts` / `vertical-pages.ts` is now
the only source:

- `PageSeo` still renders one `FAQPage` from `page.faqs`.
- `scripts/enrich-service-entrypoints.mjs` no longer writes a boot-shell
  `FAQPage`.
- Committed service and vertical shells drop the extra `FAQPage` node.
- `scripts/prerender.mjs` strips leftover boot-shell `FAQPage` when the
  `data-route-schema` graph already has one.

### tech-saas Q3/Q4 match the visible FAQ

The boot-shell graph had shorter Q3/Q4 than the on-page FAQ. With one
FAQPage from `page.faqs`, ES and EN Q3/Q4 are the visible strings:

- ES: «¿Sirve para campañas de adquisición o solo para retención?» /
  «¿Puedes hacer videos en inglés para mi audiencia estadounidense?»
- EN: “Does this work for acquisition campaigns or only for retention?” /
  “Can you produce videos in English for my US audience?”

### Spanish vertical FAQ orthography

All five ES vertical FAQ sets now open with `¿` and carry accents (`á/é/í/ó/ú`,
`ñ`, `Sí`). Facts are unchanged: 3–5 videos, 5–7 días hábiles, 4.7/177, 28+.
Brand stays Gisela Saldarriaga / Gisela.UGC — never GiseUGC.

### Body links (exact anchors)

16 vertical links plus one cómo-contratar link per services hub, in body copy:

| Source | Anchor → target |
|---|---|
| `/verticales/` | contratar una creadora UGC bilingüe → bilingüe; cómo contratar una creadora UGC → cómo-contratar |
| `/en/verticals/` | hire a bilingual UGC creator; how to hire a UGC creator |
| `/verticales/ugc-moda/` | creadora UGC de moda en español e inglés; guía para contratar una creadora UGC |
| `/en/verticals/fashion-ugc-creator/` | bilingual fashion UGC creator; guide to hiring a UGC creator |
| `/verticales/ugc-tech-saas/` | creadora UGC bilingüe para tech y SaaS; qué pedir al contratar una creadora UGC |
| `/en/verticals/tech-saas-ugc-creator/` | hire a bilingual SaaS UGC creator; what to ask before hiring a UGC creator |
| `/verticales/ugc-lifestyle-bienestar/` | contratar UGC de bienestar bilingüe; pasos para contratar una creadora UGC |
| `/en/verticals/lifestyle-wellness-ugc-creator/` | hire a bilingual wellness UGC creator; steps to hire a UGC creator |
| `/servicios/` | cómo contratar una creadora UGC bilingüe |
| `/en/services/` | how to hire a bilingual UGC creator |

Optional hub FAQs stay on hold. Service-page money links are unchanged.

`CONTENT_DATES.verticals` and `CONTENT_DATES.hubs` are `2026-10-13`.

Verify: `npx vitest run src/data/faq-schema-and-links.test.tsx` — one FAQPage,
schema Q/A equals visible Q/A, exact anchors.

## 2026-10-13 — Person `sameAs` YouTube (no rebuild)

Homepage Person JSON-LD is still authored in the static shells
(`index.html`, `en/index.html`). There is no shared React source for that
graph — `Index.tsx` `PageSeo` does not emit homepage schema.

Appended `"https://www.youtube.com/@GiselaSaldarriaga"` to the **Person**
`sameAs` array on both homepages. Existing entries are unchanged. Fiverr
stays `https://www.fiverr.com/gisela_sm` with no query string.
ProfessionalService `sameAs` is untouched.

FAQ schema and in-page links are recorded above (this merge). Hire-intent
alias 301s and the IndexNow production ping are recorded in
`seo-crawl-trust.md`.
