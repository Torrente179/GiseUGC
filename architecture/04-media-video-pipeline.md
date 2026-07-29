# Media Video Pipeline

## Runtime Catalog

The runtime clip catalog is the union of:

- `LEGACY_REEL_CLIPS` from `src/data/portfolio-clips.ts`
- `NUEVOS_R2_READY_CLIPS` from generated `src/data/nuevos-r2-ready.ts`

Consumers include `Hero`, `Portfolio`, `CreatorAdvantage`, `ServicesMarquee`,
`ServiceLandingPage`, and `VerticalLandingPage`.

## R2/CDN Convention

`src/data/portfolio-clips.ts` centralizes the media host: `https://media.giselasaldarriaga.com`. It builds:

- main videos under `/videos/main/`
- mobile videos under `/videos/mobile/`
- previews under `/videos/previews/`
- posters under `/videos/posters/`
- adaptive manifests and segments under `/videos/hls/`

## Generated Catalog

`scripts/generate-nuevos-r2-catalog.mjs` reads
`media-sources/nuevos/manifest.csv`, optional SEO overrides, verifies expected R2
assets, and writes `src/data/nuevos-r2-ready.ts`. Builds run this generator
before Vite. The output is generated code and must not be hand edited.

Source masters remain in `media-sources/`, never `public/`. Working encode, HLS,
and upload artifacts remain under gitignored `tmp/` folders.

## Asset Model

`src/lib/media-assets.ts` keeps each MP4 and optional HLS URL in one
`PlaybackCandidate`. Filtering a missing source therefore cannot shift two
parallel arrays out of alignment.

`ResponsivePosterImage` emits intrinsic-size AVIF/WebP/JPEG pictures from the
versioned 180/360/720/1080 poster variants.

## Playback Primitives

- `AdaptiveVideo`: attaches sources only when eligible, lazy-loads
  `hls.js/light`, uses native HLS on Apple browsers, falls back to MP4, and
  unloads offscreen media.
- `AutoplayPreviewVideo`: a muted/inline/looping policy wrapper around
  `AdaptiveVideo`.
- `ResponsivePosterImage`: the default gallery/card renderer.
- `TheaterVideo`: immediate exact-copy startup bridge plus synchronized,
  quality-first adaptive handoff.
- `MediaTheater`: shared modal/theater shell for data-driven landing pages.
- `MediaSessionProvider`: pauses and unloads non-theater media while a theater
  owns the session.
- `media-playback-scheduler`: grants at most one ambient decoder based on
  theater/hero/preview/ambient/background priority.

## Encoding and Delivery

- Startup bridges copy the first 1.6 seconds of the mobile master without
  re-encoding and retain optional audio.
- The CMAF HLS pipeline uses 1-second segments, AV1/HEVC/H.264 variants, and
  360–2160 tiers capped at the native source width.
- Theater ABR accounts for player size and device pixel ratio. Ambient playback
  caps to CSS pixel size.
- Versioned poster/startup assets carry immutable cache headers.
- HLS and full-length media are not requested before genuine intent.

The complete quality and validation contract is in the
[July 2026 overhaul record](../changes/2026-07-29-performance-motion-media-architecture-overhaul.md).
