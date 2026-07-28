# Media Video Pipeline

## Runtime Catalog
The runtime clip catalog is the union of:
- `LEGACY_REEL_CLIPS` from `src/data/portfolio-clips.ts`
- `NUEVOS_R2_READY_CLIPS` from generated `src/data/nuevos-r2-ready.ts`

Consumers include `Hero`, `HeroWallTile`, `Portfolio`, `ServicesMarquee`, `ServiceLandingPage`, and `VerticalLandingPage`.

## R2/CDN Convention
`src/data/portfolio-clips.ts` centralizes the media host: `https://media.giselasaldarriaga.com`. It builds:
- main videos under `/videos/main/`
- mobile videos under `/videos/mobile/`
- previews under `/videos/previews/`
- posters under `/videos/posters/`

## Generated Catalog
`scripts/generate-nuevos-r2-catalog.mjs` reads `public/uploads/videos/nuevos/manifest.csv`, optional SEO overrides, HEAD-checks expected R2 assets, and writes `src/data/nuevos-r2-ready.ts`. Builds run this before Vite through the `prebuild` script.

## Playback Primitives
- `LazyVideo`: delays source attachment, supports LQIP posters, can pause or unload offscreen, and cleans source on unmount.
- `AutoplayPreviewVideo`: enforces muted inline looping previews and resumes playback after metadata, visibility, and pageshow events.
- `TheaterVideo`: plays full-screen/theater videos with fallback sources, play/mute controls, startup retry, and cleanup.

## Performance Implication
The media layer is the main reason the app has mobile-specific mount policy. Hidden home content is unmounted off-route on mobile, and portfolio sections are deferred to reduce simultaneous video pressure.
