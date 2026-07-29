# Build Deployment

## Scripts

`package.json` defines:

- `prebuild`: catalog generation plus service, font, and client-entrypoint
  normalization
- `build`: client Vite build, SSR Vite build, then 40-route prerender
- `build:dev`: development-mode client build after the prebuild tasks
- `lighthouse:mobile`, `lighthouse:desktop`, `lighthouse:matrix`: controlled
  route matrices and budgets
- `video:catalog`: generate `src/data/nuevos-r2-ready.ts`
- `fonts:subsets`: generate self-hosted WOFF2 subsets
- `video:responsive-posters`: generate AVIF/WebP/JPEG source sets
- `video:startups`: generate exact-copy startup bridges
- `video:encode`, `video:hls`, and media upload/cache scripts

## Vite

`vite.config.ts` sets:

- project root
- dev server on port 8080
- generated multi-entry Rollup inputs from `src/lib/locale-path.ts`
- manual chunks for major vendor groups
- alias `@` to `src`

## Prerender

`src/entry-server.tsx` renders the shared route factories.
`scripts/prerender.mjs`:

1. finds each built `index.html`,
2. renders the matching URL,
3. injects route markup and the prerender marker,
4. adds route-template CSS,
5. extracts only the navigation/first-section critical CSS,
6. preloads the required self-hosted fonts and homepage lead poster,
7. lowers noncritical module priority,
8. and writes the final deployable document.

## Vercel

`vercel.json` controls immutable caching for hashed assets, fonts, poster
variants, and startup bridges; short edge revalidation for HTML; CSP and other
security headers; and legacy language-query redirects.

Review it together with the route registry, static route shells, R2 CORS/cache
policy, robots, sitemap, and public LLM files.

## Generated Files

`src/data/nuevos-r2-ready.ts` is generated. Do not hand edit it; update the manifest, SEO overrides, or generator script instead.

Generated poster/startup runtime assets are versioned under `public/`. Source
masters and local transcodes stay outside `public/` under `media-sources/` and
gitignored `tmp/` directories.

## Release Gates

Run build, typecheck, tests, lint, the Lighthouse matrix, route/asset/hydration
smoke tests, media timing checks, and motion traces before promotion. The exact
budgets and July 2026 reference results are in the
[overhaul record](../changes/2026-07-29-performance-motion-media-architecture-overhaul.md).
