# 2026-04-20 — Vendor chunk splits

Follow-up to `2026-04-20-analytics-defer-lazymotion-variable-fonts.md`.
After deferring analytics and shrinking the Framer Motion footprint, the
main bundle was still 642 kB / 189 kB gzip with a Vite
"chunk >500 kB" warning. This pass carves the main bundle into smaller
vendor chunks so the browser can parallel-download them and keep cached
vendor chunks stable across deploys.

## Change

Replaced the static `manualChunks` object in `vite.config.ts` with a
function that groups `node_modules` dependencies into dedicated chunks:

| Chunk          | Contents                                                              |
| -------------- | --------------------------------------------------------------------- |
| `framer-motion`| `framer-motion`                                                       |
| `i18n-core`    | `i18next`, `react-i18next`, `i18next-browser-languagedetector`        |
| `radix`        | every `@radix-ui/*` package                                           |
| `tanstack`     | `@tanstack/*`                                                         |
| `vercel-sdk`   | `@vercel/analytics`, `@vercel/speed-insights`                         |
| `emailjs`      | `@emailjs/*`                                                          |
| `embla`        | `embla-carousel*`                                                     |
| `react-core`   | `react-dom`, `react-router*`, `scheduler`                             |
| `lucide`       | `lucide-react`                                                        |
| `date-fns`     | `date-fns`                                                            |
| `lenis`        | Lenis smooth scroll                                                   |

## Build output comparison

| Chunk               | Before (gzip) | After (gzip) |
| ------------------- | ------------- | ------------ |
| `main-*.js`         | 189.36 kB     | 138.63 kB    |
| `react-core-*.js`   | *(inlined)*   | 47.53 kB     |
| `radix-*.js`        | *(inlined)*   | 12.91 kB     |
| `lucide-*.js`       | *(inlined)*   | 3.25 kB      |
| `vercel-sdk-*.js`   | *(inlined)*   | 1.74 kB      |
| chunk >500 kB warn? | yes           | no           |

The total JS bytes shipped are similar, but now split across ~10
long-cacheable vendor chunks. Repeat visits only refetch `main-*.js` on
product changes; Radix/Lucide/React stay cached across deploys.

## Files changed

- `vite.config.ts` — `manualChunks` now a function
- `changes/2026-04-20-vendor-chunk-splits.md` *(this file)*
