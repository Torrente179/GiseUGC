# Forensic Summary

## Core Finding

This is a React 18 and Vite marketing/portfolio site built as 40 prerendered,
bilingual HTML entries. It keeps a shared React application model, but each
route receives complete server-rendered markup, route-specific data, metadata,
critical CSS, and a route-family client hydrator.

The URL registry in `src/lib/locale-path.ts` is the source of truth for runtime
matching and Vite entry generation. Typed content modules feed shared service,
vertical, resource, and legal page factories.

## Primary Execution Chain

1. Vite builds route-family client entries and `src/entry-server.tsx`.
2. `scripts/prerender.mjs` renders all registered routes, injects markup,
   extracts above-the-fold CSS, and marks each root as prerendered.
3. A route entry calls `src/client-runtime.tsx`, which installs
   `BrowserRouter`, `LocaleProvider`, `ThemeProvider`, and hydrates the markup.
4. `src/App.tsx` owns shared providers, route matching, scroll restoration,
   deferred analytics, the mobile shell, and media-session ownership.
5. `src/pages/Index.tsx` composes the homepage and defers media-heavy sections.
6. Typed page data and clip catalogs feed reusable templates and the shared
   media layer.

## Coupling Hotspots

- `src/lib/locale-path.ts`: route ids, locale pairs, runtime resolution, and
  static HTML inputs.
- `src/client-runtime.tsx` plus route-family entry files: hydration contract and
  full-document navigation.
- `src/entry-server.tsx` and `scripts/prerender.mjs`: server/client markup
  parity, critical CSS, route data, and preload ordering.
- `src/data/portfolio-clips.ts` plus generated
  `src/data/nuevos-r2-ready.ts`: clip identity and media URLs.
- `src/lib/media-assets.ts`, `src/lib/media-playback-scheduler.ts`, and
  `src/components/media/MediaSessionProvider.tsx`: playback-source integrity and
  the one-ambient-decoder invariant.
- `src/pages/Index.tsx`: homepage narrative and deferred-mount thresholds.

## Architectural Pattern

The site combines:

- a route registry,
- typed localized content,
- data-driven page factories,
- route-family client bundles,
- build-time React rendering,
- selector-based critical CSS extraction,
- path-owned locale resolution,
- and a single scheduled adaptive media layer.

## Main Risk Pattern

The highest-risk changes break one of these alignments:

- route registry ↔ static HTML path ↔ route data ↔ hydrator,
- server markup ↔ responsive client markup,
- MP4 ↔ HLS candidate pairing,
- prerendered SEO/head content ↔ runtime `PageSeo`,
- or media intent ↔ decoder/session ownership.

The current architecture and measured results are recorded in
[`changes/2026-07-29-performance-motion-media-architecture-overhaul.md`](../changes/2026-07-29-performance-motion-media-architecture-overhaul.md).
