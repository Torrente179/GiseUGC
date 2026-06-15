# Gisela Saldarriaga — UGC Studio Site

Bilingual (Spanish / English) marketing and portfolio site for **Gisela Saldarriaga**, a UGC (user-generated content) creator. It showcases reel work and a set of service / vertical / resource landing pages aimed at converting prospective brand clients. Single-page app, statically built, video-heavy.

## Stack

- **React 18 + TypeScript + Vite 6** (SWC) — multi-page build (one HTML entry per route).
- **Tailwind CSS + shadcn/ui** (Radix primitives) for UI.
- **react-i18next** for the `es` / `en` split (strings bundled, no runtime backend).
- **Motion:** framer-motion, GSAP, Lenis (smooth scroll), three.js (hero atmosphere).
- **Video:** `hls.js` with an HLS → MP4 fallback cascade; media served from **Cloudflare R2** (`media.giselasaldarriaga.com`).
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
| `npm run video:catalog` | Regenerate `src/data/nuevos-r2-ready.ts` from the R2 video manifest. |
| `npm run service:entrypoints` | Enrich per-service HTML entry points. |
| `npm run video:encode` / `video:hls` | FFmpeg encode + HLS ladder generation (see `scripts/`). |

### Build pipeline note

`npm run build` triggers a `prebuild` hook: `video:catalog` + `service:entrypoints`. These regenerate data/HTML from the R2 media manifest, so a production build needs those inputs present. Vercel runs the full build on deploy; **CI deliberately skips the build** (it can't reach the media manifest) and runs typecheck + tests + lint instead.

## Architecture (quick map)

- `src/App.tsx` — boots providers and a **custom static router**: it matches the current pathname against precomputed route entries from `src/lib/locale-path.ts` (rather than `<Routes>`/`<Route>`), then lazy-loads the matching page. Wrapped in a top-level `ErrorBoundary`.
- `src/pages/Index.tsx` — the home page; composes sections, most wrapped in `DeferredSection` (IntersectionObserver-based lazy mount) and per-section error boundaries.
- `src/components/` — UI, plus `media/` (video players), `motion/`, `three/`.
- `src/data/` — content is **data-driven**: `service-pages.ts`, `vertical-pages.ts`, `resource-pages.ts`, `legal-pages.ts`, and the reel catalog (`portfolio-clips.ts` + generated `nuevos-r2-ready.ts`).
- `src/lib/locale-path.ts` — the single source of truth for routes and `es`/`en` path mapping.
- `scripts/` — media encoding, HLS, R2 upload, catalog generation, boot-shell expansion for AI crawlers, IndexNow.

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

`ARCHITECTURE.md` is an older deep-dive and may lag the current home layout. Day-to-day design/decision history lives in the `changes/` log directory.
