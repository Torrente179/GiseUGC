# Service Poster Quality Upgrade

**Date:** 2026-03-23

## Problem

The mobile performance reset correctly removed video-backed thumbnails from the service pages, but the fallback poster images were not strong enough visually. Some existing posters were lower-quality JPEGs, and at least some hero surfaces were stretching those older assets enough that they looked soft on mobile.

## Fix

- Added `scripts/generate-service-posters.sh` to generate dedicated high-quality static posters from the original source videos
- Generated poster assets into `public/uploads/videos/service-posters/`
- Updated `ServiceLandingPage.tsx` to prefer those generated poster files for:
  - mobile hero
  - mobile reel cards
  - desktop hero poster surface
  - desktop proof gallery cards
  - theater startup poster
- Reordered the bilingual service featured examples so the existing hero logic now picks a vertical reel first instead of the landscape services intro clip
- Kept image surfaces instead of returning to `<video>` thumbnails, so poster quality improves without bringing back the mobile lag

## Output quality

- Vertical source videos are exported as 1080px-wide posters
- Horizontal source videos are exported as 1440px-wide posters
- The result is materially sharper than the previous poster set while still staying lightweight enough for fast mobile rendering
