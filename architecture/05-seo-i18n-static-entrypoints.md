# SEO I18N Static Entrypoints

## SEO Runtime
`PageSeo` updates:
- document title
- description and robots
- Open Graph tags
- Twitter tags
- canonical link
- Spanish, English, and x-default hreflang links
- optional route-specific JSON-LD script

The cleanup removes only the dynamic structured data script so route schema does not leak across client-side navigations.

## Page Schema
Service and vertical factories produce WebPage, BreadcrumbList, Service, FAQPage, and VideoObject nodes. Resource pages produce WebPage, BreadcrumbList, Article, and FAQPage. Legal pages produce WebPage and BreadcrumbList.

## i18n
`src/i18n.ts` uses `i18next-browser-languagedetector`, but path detection is constrained by React Router and `locale-path`. The fallback language is Spanish.

## Static Entry Shells
Vite builds multiple HTML inputs for each localized SEO route. This improves direct route addressability and gives crawlers a concrete HTML shell per service, vertical, resource, legal page, and language.

## Alignment Rule
When adding or renaming a route, update all of these together:
- `src/lib/locale-path.ts`
- the matching data module
- `vite.config.ts` Rollup input
- static HTML shell folder/file
- `public/sitemap.xml`
- any enrich/boot-shell script data if the route needs static metadata enrichment
