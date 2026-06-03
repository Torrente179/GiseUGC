# 2026-06-04 Mobile Hero Video Playback

## Problem
Two mobile hero/video surfaces could read as paused:
1. The homepage hero reel wall rendered only the first tile in each column as a video. Because the columns animate vertically, the visible hero cards quickly became poster-only image tiles.
2. Service and vertical mobile hero/proof cards rendered as poster `<img>` elements with centered play icons, so they looked like paused video cards instead of playing previews.

## What changed
1. `Hero.tsx` now enables video playback for every tile in the two mobile-visible columns, while hidden mobile columns remain poster images to avoid unnecessary media work.
2. `HeroWallTile.tsx` retries muted inline playback on metadata/canplay, pause, page visibility return, and bfcache `pageshow` so mobile browsers resume the decorative hero reels after load or tab restoration.
3. Added `AutoplayPreviewVideo.tsx` for lightweight muted preview loops that resume if mobile browsers pause during load/visibility changes, with explicit `muted`, `playsinline`, and `webkit-playsinline` attributes for iOS autoplay.
4. `ServiceLandingPage.tsx` and `VerticalLandingPage.tsx` now use preview videos for mobile hero/proof cards and remove the centered mobile play overlays from those autoplaying cards.

## Verification
1. `npm run build`
2. Browser mobile viewport `390x844`: `#home .hero-wall video` count is limited to 16, visible hero wall videos report `paused: false`, and `currentTime` advances after reload.
3. Service/vertical mobile code path: `.stm-hero-poster` and `.stm-reel-card` render `AutoplayPreviewVideo` elements instead of poster `<img>` elements, and centered mobile play overlays are removed from those autoplaying cards.
