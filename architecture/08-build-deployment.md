# Build Deployment

## Scripts
`package.json` defines:
- `prebuild`: generate video catalog and enrich service entrypoints
- `build`: Vite production build
- `build:dev`: development-mode Vite build after the same prebuild tasks
- `video:catalog`: generate `src/data/nuevos-r2-ready.ts`
- `video:encode`, `video:service-posters`, and related media scripts

## Vite
`vite.config.ts` sets:
- project root
- dev server on port 8080
- production CSS defer transform for generated stylesheet links
- multi-entry Rollup inputs for every static route shell
- manual chunks for major vendor groups
- alias `@` to `src`

## Vercel
`vercel.json` controls deployment behavior. Review it together with Vite HTML inputs, static route shells, robots, sitemap, and public LLM files.

## Generated Files
`src/data/nuevos-r2-ready.ts` is generated. Do not hand edit it; update the manifest, SEO overrides, or generator script instead.
