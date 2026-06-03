# 2026-06-04 Mobile Hero Wall Playback

## Problem
The mobile hero reel wall rendered only the first tile in each column as a video. Because the columns animate vertically, the visible hero cards quickly became poster-only image tiles and read as paused videos.

## What changed
1. `Hero.tsx` now enables video playback for every tile in the two mobile-visible columns, while hidden mobile columns remain poster images to avoid unnecessary media work.
2. `HeroWallTile.tsx` retries muted inline playback on metadata/canplay, pause, page visibility return, and bfcache `pageshow` so mobile browsers resume the decorative hero reels after load or tab restoration.

## Verification
1. `npm run build`
2. Browser mobile viewport `390x844`: `#home .hero-wall video` count is limited to 16, visible hero wall videos report `paused: false`, and `currentTime` advances after reload.
