# SEO I18N Static Entrypoints

## SEO Build and Runtime

`PageSeo` updates:

- document title
- description and robots
- Open Graph tags
- Twitter tags
- canonical link
- Spanish, English, and x-default hreflang links
- optional route-specific JSON-LD script

The same route content is now present in prerendered HTML. Runtime updates remain
useful for development and same-document state, but crawlers do not need to
execute React to discover the page body or route metadata.

Structured data is moved to the end of `<body>` during prerendering so the
preload scanner reaches visual markup and critical assets earlier without
reducing schema discoverability.

## Page Schema
Service and vertical factories produce WebPage, BreadcrumbList, Service, FAQPage, and VideoObject nodes. Resource pages produce WebPage, BreadcrumbList, Article, and FAQPage. Legal pages produce WebPage and BreadcrumbList. Hub indexes produce WebPage and BreadcrumbList; WebPage `name` is the hire-intent title from `src/data/hub-pages.ts`, not the bare entity name.

## i18n

`src/lib/locale-context.tsx` selects bundled JSON dictionaries from the path.
There is no browser language detector, i18next runtime, or translation request.
Spanish is the default route family; English is under `/en/`.

## Static Entry Shells

Vite builds one input for every localized SEO route. The input list is derived
from `getAllEntrypointPaths()` in `src/lib/locale-path.ts`.
`scripts/prerender.mjs` turns each shell into a complete HTML page and embeds
the typed route data required by its route-family hydrator.

## Alignment Rule

When adding or renaming a route, update all of these together:

- `src/lib/locale-path.ts`
- the matching data module
- static HTML shell folder/file
- `public/sitemap.xml` (generated from `PAGE_REGISTRY` + `CONTENT_DATES` during `vite build`)
- any entrypoint enrichment data used by the route

Do not hand-add the route to `vite.config.ts`; the registry generates the
Rollup inputs.
