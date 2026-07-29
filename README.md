# Gisela Saldarriaga — UGC Studio Site

Bilingual (Spanish / English) marketing and portfolio site for **Gisela Saldarriaga**, a UGC (user-generated content) creator. It showcases reel work and a set of service / vertical / resource landing pages aimed at converting prospective brand clients. It is a prerendered, multi-entry React application with a quality-first adaptive media layer.

## Stack

- **React 18 + TypeScript + Vite 6** (SWC) — route-specific client entrypoints plus build-time SSR/prerendering and hydration.
- **Tailwind CSS** with a deliberately small local UI primitive surface.
- **Path-owned locale provider** for the `es` / `en` split; strings are bundled and no runtime detector/backend is needed.
- **Motion:** native scrolling, CSS compositor animations, IntersectionObserver, and short-lived requestAnimationFrame loops.
- **Video:** exclusive ambient-decoder scheduling, responsive posters, exact-copy startup bridges, and lazy `hls.js/light` with native-HLS/MP4 fallback. Media is served from **Cloudflare R2** (`media.giselasaldarriaga.com`).
- **Hosting:** Vercel. Analytics via `@vercel/analytics` + `@vercel/speed-insights`.

## Getting started

```bash
npm install
npm run dev          # Vite dev server on http://localhost:8080
```

Node 20+ recommended (CI runs on Node 20).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server (port 8080). |
| `npm run build` | Production build. Runs `prebuild` first (see below). |
| `npm run preview` | Serve the built `dist/` locally. |
| `npm run typecheck` | `tsc --noEmit` over the app + tests. |
| `npm run lint` | ESLint (flat config). |
| `npm test` / `npm run test:watch` | Vitest unit/integration suite. |
| `npm run lighthouse:matrix` | Run the controlled mobile and desktop route matrix. |
| `npm run video:catalog` | Regenerate `src/data/nuevos-r2-ready.ts` from the R2 video manifest. |
| `npm run service:entrypoints` | Enrich per-service HTML entry points. |
| `npm run fonts:subsets` | Generate the self-hosted WOFF2 font subsets. |
| `npm run video:responsive-posters` | Generate versioned AVIF/WebP/JPEG poster source sets. |
| `npm run video:startups` | Generate exact-copy fast-start theater bridges. |
| `npm run video:encode` / `video:hls` | Generate progressive fallbacks and the multi-codec CMAF ladder. |

### Build pipeline note

`npm run build` first regenerates the media catalog and normalizes route, font, and client entrypoints. Vite then creates the client build and an SSR bundle; `scripts/prerender.mjs` renders all 40 registered routes, injects route markup, and extracts/inlines only above-the-fold critical CSS. The browser hydrates that markup instead of replacing a loading shell.

## Architecture (quick map)

- `src/client-runtime.tsx` — shared client bootstrap, route-specific hydration, and full-document navigation between registered static entries.
- `src/entry-server.tsx` + `scripts/prerender.mjs` — server render and post-build prerender/critical-CSS pipeline.
- `src/App.tsx` — shared providers, route matching, native scroll restoration, deferred insights, and global media-session ownership.
- `src/pages/Index.tsx` — the home page; composes sections and wraps media-heavy sections in `DeferredSection` (IntersectionObserver-based lazy mount) plus per-section error boundaries.
- `src/components/media/` + `src/lib/media-*` — adaptive playback, typed candidates, responsive posters, exclusive decoder scheduling, and quality-first theater startup.
- `src/components/motion/` + `src/lib/motion/` — lightweight reveals and native/compositor-first motion; there is no site-wide animation ticker.
- `src/data/` — content is **data-driven**: `service-pages.ts`, `vertical-pages.ts`, `resource-pages.ts`, `legal-pages.ts`, and the reel catalog (`portfolio-clips.ts` + generated `nuevos-r2-ready.ts`).
- `src/lib/locale-path.ts` — the single source of truth for routes, `es`/`en` path mapping, and static HTML inputs.
- `src/styles/` — route-template CSS and the small critical template subset.
- `scripts/` — prerendering, fonts, media encoding, HLS, R2 upload, poster/startup generation, catalog generation, and IndexNow.

Localization: Spanish lives at `/…`, English at `/en/…`. Locale is derived from the URL path.

## Testing & CI

- Vitest + React Testing Library. Tests live next to source (`*.test.ts[x]`); config in `vitest.config.ts`, setup in `src/test/setup.ts`.
- Current coverage focuses on the durable core: locale routing (`src/lib/locale-path.test.ts`), content data integrity (`src/data/data-integrity.test.ts`), and the error boundary.
- CI (`.github/workflows/ci.yml`) runs `typecheck` + `test` + `lint` on PRs and pushes to `main`.

## Environment

Copy `.env.example` to `.env`.

- **R2 / Cloudflare** keys (`R2_*`, `CF_*`) are used **only by CLI scripts** (media upload, cache headers) — they are never bundled into the client.
- **Public contact links** use `VITE_*` vars (`VITE_WHATSAPP_URL`, etc.) with sensible fallbacks. The primary contact channels are WhatsApp / Fiverr / Instagram (there is no contact form).

## Deployment

Push to `main` → Vercel builds and deploys production. Security headers (CSP, HSTS, `X-Frame-Options`, etc.) and cache rules live in `vercel.json`.

## Docs

Start with [`changes/2026-07-29-performance-motion-media-architecture-overhaul.md`](changes/2026-07-29-performance-motion-media-architecture-overhaul.md) for the current delivery, motion, and media architecture. The forensic map lives in [`architecture/README.md`](architecture/README.md); its generated component/source indexes are a historical scan unless a page explicitly says otherwise. The current homepage opening is documented in [`changes/2026-07-27-editorial-title-sequence-hero.md`](changes/2026-07-27-editorial-title-sequence-hero.md).
