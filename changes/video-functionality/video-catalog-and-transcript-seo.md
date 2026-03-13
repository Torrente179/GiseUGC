# Video Catalog and Transcript SEO

## Summary
This is the current runtime video-catalog note. It consolidates strict R2 gating for `nuevos`, transcript-driven title cleanup, full-library reel exposure, services-marquee video remapping, and the canonicalization of the video docs.

## Current runtime touchpoints
- `scripts/generate-nuevos-r2-catalog.mjs`
- `scripts/nuevos-seo-overrides.json`
- `src/data/nuevos-r2-ready.ts`
- `src/data/portfolio-clips.ts`
- `src/components/Portfolio.tsx`
- `src/components/ServicesMarquee.tsx`
- `public/uploads/videos/nuevos/manifest.csv`
- `changes/video-functionality/video-encoding-tracking-setup-guide.md`

## Current state
1. `nuevos` clips only enter runtime when their full R2 asset set is available, and the generator keeps builds deterministic from the checked-in manifest.
2. Theater, reel cards, and related video selectors now share one authoritative clip library instead of drifting across component-local arrays.
3. Reel selection rotates daily on a UTC boundary and refreshes automatically without requiring a page reload.
4. Transcript extraction plus override metadata replaced raw phone-export filenames with usable SEO-facing titles and categories.
5. The video setup guide in `changes/video-functionality/` is the canonical operational reference; this note is the living runtime history for runtime catalog changes.

## Legacy notes absorbed
- `2026-03-04-portfolio-rail-full-library-scroll.md`
- `2026-03-04-r2-gated-video-catalog-and-utc-rotation.md`
- `2026-03-04-services-marquee-card-to-video-remap.md`
- `2026-03-04-transcript-driven-seo-video-titles-for-nuevos.md`
- `2026-03-04-video-docs-canonicalization.md`
- `2026-03-04-video-transcript-extraction-and-seo-renaming-map.md`
