# Forensic Summary

## Core Finding
This is a React 18 and Vite marketing/portfolio site that behaves like a single page app at runtime, but is deployed with many static HTML entry shells for bilingual SEO routes. The runtime does not rely on route files. Instead, `src/App.tsx` resolves the current URL against route tables generated from `src/lib/locale-path.ts`, then renders page factories fed by typed content modules.

## Primary Execution Chain
1. `src/main.tsx` mounts React, installs `BrowserRouter`, `ThemeProvider`, global CSS, and i18n.
2. `src/App.tsx` synchronizes locale, scroll position, route matching, analytics, Speed Insights, and lazy route pages.
3. `src/pages/Index.tsx` composes the homepage and defers expensive sections, especially media-heavy portfolio sections.
4. `src/lib/locale-path.ts` is the bilingual route source of truth for home, service, vertical, resource, and legal routes.
5. Service, vertical, resource, and legal pages are rendered by reusable factories from typed data modules.
6. Video metadata comes from `src/data/portfolio-clips.ts` and the generated `src/data/nuevos-r2-ready.ts`, then flows into hero tiles, portfolio cards, marquees, and theater playback.

## Coupling Hotspots
- `src/lib/locale-path.ts`: High blast radius. It feeds `App.tsx`, navigation, SEO alternates, service cards, resource links, and static build entry assumptions.
- `src/App.tsx`: Owns route matching, scroll restoration, lazy route loading, and mobile home mount policy.
- `src/pages/Index.tsx`: Owns homepage ordering and mobile/desktop render strategy.
- `src/data/portfolio-clips.ts` plus `src/data/nuevos-r2-ready.ts`: Own the clip catalog shape consumed by hero, portfolio, service proof, vertical proof, and marquees.
- `vite.config.ts`: Must stay aligned with route tables because it lists static HTML entrypoints for the multi-page build.

## Architectural Pattern
The site uses a data-driven page factory pattern:
- URL tables define page ids and locales.
- Data modules provide localized content.
- Page factories render repeated editorial/service structures.
- `PageSeo` mutates the document head per route.
- Static HTML entrypoints make deep SEO routes addressable before the SPA hydrates.

## Main Risk Pattern
The highest risk changes are not visual component edits. They are changes that break alignment between:
- route tables in `src/lib/locale-path.ts`
- Vite HTML inputs in `vite.config.ts`
- static route shell files under `en/`, `servicios/`, `verticales/`, `recursos/`, and legal folders
- canonical/hreflang URLs in `PageSeo` consumers
- sitemap and robots surfaces in `public/`
