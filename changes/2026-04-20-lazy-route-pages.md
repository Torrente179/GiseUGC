# 2026-04-20 — Lazy route-level pages

Follow-up to `2026-04-20-vendor-chunk-splits.md`. The main bundle was
still 482 kB (138 kB gzip) because `App.tsx` eagerly imported every
landing template — `ServiceLandingPage`, `VerticalLandingPage`,
`ResourcePage`, `LegalPage`, and `NotFound` — even on cold homepage
visits where none of them render.

## Change

Switched `src/App.tsx` to lazy-load route-level pages via `React.lazy`
and wrap their render tree in `<Suspense fallback={null}>`:

```tsx
const NotFound = lazy(() => import('@/pages/NotFound'));
const ServiceLandingPage = lazy(() => import('@/components/ServiceLandingPage'));
const VerticalLandingPage = lazy(() => import('@/components/VerticalLandingPage'));
const ResourcePage = lazy(() => import('@/components/ResourcePage'));
const LegalPage = lazy(() => import('@/components/LegalPage'));
```

The homepage `Index` component stays eagerly imported — it must render
above the fold on the most common entry path. Everything else now
streams in only when the current URL matches.

## Build output

| Chunk                        | Before    | After     |
| ---------------------------- | --------- | --------- |
| `main-*.js`                  | 138.63 kB | 48.34 kB  |
| `ServiceLandingPage-*.js`    | *(inlined)* | 6.72 kB |
| `VerticalLandingPage-*.js`   | *(inlined)* | 6.00 kB |
| `ResourcePage-*.js`          | *(inlined)* | 28.57 kB |
| `LegalPage-*.js`             | *(inlined)* | 13.11 kB |
| `NotFound-*.js`              | *(inlined)* | 0.60 kB |

(gzip sizes). Cold homepage visit drops ~55 kB gzip of JS that never
ran on that route anyway.

## Compatibility

- `Index` remains eager — homepage LCP still has its component tree
  ready synchronously.
- `<Suspense fallback={null}>` matches the existing `page-enter` CSS
  fade so there is no additional flash of skeleton UI.
- Prior perf passes keep working: `LazyMotion`, deferred GTM, the
  vendor splits, and the preload/picture pipeline all compose with this
  change.
