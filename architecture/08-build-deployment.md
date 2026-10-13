# Build Deployment

## Scripts

`package.json` defines:

- `prebuild`: catalog generation plus service, font, and client-entrypoint
  normalization
- `build`: client Vite build (writes `sitemap.xml`, curated `sitemap-video.xml`, and per-page OG JPEGs), SSR Vite build, then prerender
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
security headers; legacy language-query redirects; and hire-intent alias 301s
(`/contratar` → `/recursos/como-contratar-creadora-ugc/`, `/hire` and
`/en/hire` → `/en/resources/how-to-hire-ugc-creator/`).

Review it together with the route registry, static route shells, R2 CORS/cache
policy, robots, both sitemaps, per-page OG images, and public LLM files.

## Per-page OG images

`vite.config.ts` (`gisela-seo-artifacts`) generates one 1200×630 JPEG per
registry route from the page H1 plus `getOgProofLine()` in
`src/data/site-proof.ts`. Fonts are the bundled TTFs in `public/fonts/og/`.
The proof-line mode switch (`exact` | `none`) defaults to `exact`. An H1
that still needs more than three lines at the minimum size, or a JPEG over
150 KB, fails the build. Render errors fail the build. The shared
`/og-image-es-en-20260219.jpg` is the fallback only for a route with no H1.

## Video sitemap

`public/sitemap-video.xml` lists each curated homepage clip once on `/` and
once on `/en/`. Values come from the existing homepage VideoObject nodes.
Each entry has `loc`, a unique-per-page `video:thumbnail_loc` (R2 poster,
never the OG image), title, description, `content_loc`, and duration in
seconds when known. A selected entry missing a required field fails the
build. XML is escaped. Decorative and extra service/vertical proof clips
are excluded; those pages still emit VideoObject JSON-LD (`name`,
`thumbnailUrl`, `uploadDate`). The build HEADs every R2 content and
thumbnail URL as Googlebot (with and without a Google referer) and
rejects a robots or hotlink block. `robots.txt` references the video
sitemap. IndexNow does not.

## IndexNow

After Vercel publishes `main`, `.github/workflows/indexnow.yml` waits for
that production deploy and POSTs sitemap URLs to
`https://api.indexnow.org/indexnow`. Host is `www.giselasaldarriaga.com`.
The key is `public/bc6e18cf87bf49fcc1ad22e759c161ac.txt`, served at
`/<key>.txt`. The job is fail-soft and is not a release gate.

Manual: `npm run indexnow` or `./scripts/indexnow-ping.sh` from the repo
root (add `--soft` to ignore API errors). The waiter is
`./scripts/wait-for-production.sh`.

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
