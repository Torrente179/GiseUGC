# Gisela UGC Website Architecture

This folder is a forensic architecture map of the website code in `/Users/juanpabloramirez/Desktop/GiseUGC/GiseUGC`.

Generated from:
- `understand-anything` project scan
- `understand-anything` internal import map
- `understand-anything` structural extraction
- Direct source review of the route, page, media, SEO, and build layers

Generated at: `2026-06-04T10:20:41.624Z`

## Current-status notice

The detailed component and source indexes are a generated pre-overhaul
snapshot. They remain useful for historical intent, but they include files and
dependencies removed by the July 2026 performance work.

For the live architecture, read these first:

- [Performance, Motion, and Media Architecture Overhaul](../changes/2026-07-29-performance-motion-media-architecture-overhaul.md)
- [00 Forensic Summary](00-forensic-summary.md)
- [01 Runtime And Routing](01-runtime-routing.md)
- [04 Media Video Pipeline](04-media-video-pipeline.md)
- [06 State Events Performance](06-state-events-performance.md)
- [07 Styling Motion UI](07-styling-motion-ui.md)
- [08 Build Deployment](08-build-deployment.md)

## Start Here
- [July 2026 Overhaul — current source of truth](../changes/2026-07-29-performance-motion-media-architecture-overhaul.md)
- [00 Forensic Summary](00-forensic-summary.md)
- [01 Runtime And Routing](01-runtime-routing.md)
- [02 Homepage Composition](02-homepage-composition.md)
- [03 Data Content Model](03-data-content-model.md)
- [04 Media Video Pipeline](04-media-video-pipeline.md)
- [05 SEO I18N Static Entrypoints](05-seo-i18n-static-entrypoints.md)
- [06 State Events Performance](06-state-events-performance.md)
- [07 Styling Motion UI](07-styling-motion-ui.md)
- [08 Build Deployment](08-build-deployment.md)
- [09 Understand Graph](09-understand-graph.md)
- [Components Index](components/README.md)
- [Source Index](source/README.md)

## Scan Totals

These totals describe the June 2026 generated snapshot, not the current file
inventory.

- Files analyzed: 220
- Internal import edges: 191
- Graph nodes: 448
- Graph edges: 432
- Layers: 10

## Layers
| Layer | Files | What it owns |
| --- | ---: | --- |
| Bootstrap and Providers | 4 | React mount, top-level providers, route orchestration, runtime theme sync, analytics, speed insights, and global app concerns. |
| Routing and URL Model | 43 | Locale-aware URL tables, React Router pages, path matching, fallback routing, static HTML entry shells, and navigation path helpers. |
| Dynamic Page Factories | 4 | Reusable page templates for service, vertical, resource, and legal pages, including structured data, page sections, breadcrumbs, and related links. |
| Homepage Composition | 20 | The home page sections, social proof, service cards, portfolio entrypoints, FAQ, testimonials, contact CTA, navbar, and footer composition. |
| Content Data Model | 11 | Typed data modules that define service, vertical, resource, legal, translation, portfolio, and generated catalog content consumed by page factories. |
| Media and Video System | 41 | Video playback primitives, R2/CDN URL builders, poster/LQIP data, generated clip catalogs, transcript sources, and video processing scripts. |
| Interaction and Performance Utilities | 8 | Custom hooks, contact dock event bus, hashless section scrolling, mobile detection, deferred mounting, referral attribution, and performance diagnostics. |
| Motion and Design System | 60 | Framer Motion helpers, text reveal components, shadcn/Radix primitives, Tailwind configuration, CSS tokens, and layout utility styles. |
| SEO, Static Assets, and Deployment | 12 | SEO head mutation, robots, sitemaps, LLM text surfaces, Vercel config, Vite build entries, and scripts that enrich static entry pages. |
| Project Config and Documentation | 17 | Package metadata, TypeScript and lint configuration, environment examples, project reports, and supporting documentation. |
