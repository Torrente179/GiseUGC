# Portfolio reels start at once: streams through Media Source

**Status:** Live on main
**Date:** 2026-10-17
**Scope:** every reel played by `FeedPlayerPool`: the home portfolio (phone card,
full-screen feed, desktop phone and theater) and the service-page theater.
Preview loops (`AdaptiveVideo`) are unchanged. They already play from memory
(`2026-10-17-mobile-video-memory.md`).

## The report

On an iPhone the portfolio reels took too long to start at their quality. The
user wanted them instant, with no quality downgrade.

## Cause

A plain `<video>` on iPhone loads nothing before it plays: WebKit's
`AutoPreloadingNotPermitted` caps `preload=auto` at metadata until a tap has
started that element. Safari also never reuses a video's download, so a hidden
warm-up does not help. So a reel could only start buffering the moment it was
shown, and the higher-bitrate reels then waited for AVFoundation to buffer
enough to start.

## What changed

- **`scripts/stream-feed.mjs`** (`npm run video:streams`):
  - repackages each feed MP4 (`tmp/video-feed`) into a fragmented MP4 with
    1 s fragments, plus a byte-range HLS playlist
    (`scripts/lib/fmp4-playlist.mjs`);
  - stream copy, never re-encoded. Checked: all 37 files hash identically to
    the feed MP4s (`ffmpeg -f streamhash`, audio and video);
  - fragments are cut every second, not at keyframes. Several masters have one
    keyframe for the whole clip, so keyframe cuts would make one segment of
    the whole file;
  - output goes to R2 at `videos/feed/v1/<slug>/s1/{hevc,avc}.{mp4,m3u8}` and
    to `src/data/feed-streams.ts`. Bump `STREAM_VERSION` if the packaging ever
    changes, since the files are cached as immutable;
  - a new master goes through `encode-feed.mjs --upload`, then
    `npm run video:streams -- --upload`. A reel without a stream plays its
    MP4;
  - the script uploads before it writes the data file. The media host
    (Cloudflare in front of R2) caches a 404 for 31 days
    (`cache-control: max-age=2678400`), keyed per requesting origin. A stream
    the site asks for before it exists stays a 404 for that origin for a
    month. Seen during this work, from a localhost test origin only: every
    stream URL returns 200 for requests from www.giselasaldarriaga.com.
- **`src/lib/feed-stream.ts`:** hls.js (`hls.js/light`) on the pooled element,
  through ManagedMediaSource on iPhone and MediaSource elsewhere.
  - Before a reel plays it loads 2 s (its head). Once it plays, it keeps 20 s
    ahead, capped at 40 MB.
  - The reel that plays owns the connection. While it has less than 4 s
    buffered ahead, the reels around it fetch nothing (`FeedPlayerPool`
    checks twice a second). Without this, at 20 Mbps, a 15 Mbps reel stalled
    for seconds while the next reel's head loaded beside it.
  - Holding sets the stream's buffer target to 0 rather than calling
    `stopLoad()`. A `stopLoad()` before the playlist arrives aborts it, and
    that reel never started (seen: swipes that never played).
  - What has played is kept, so the loop back to 0 does not refetch. Measured:
    ~1 s freeze per loop with a 6 s back buffer, ~0.1 s without.
  - HEVC where Media Source decodes it, H.264 otherwise.
  - `enableWorker: false`: the CSP has no `worker-src` for blob workers, and
    fMP4 needs no transmuxing.
- **`FeedPlayerPool`** (`feed-media.ts`):
  - the reel on screen, the next and the previous each get a stream. Their
    heads load ahead whatever iPhone's preload rule says, because the page
    does the fetching;
  - a reel that leaves the screen is cut back to its head;
  - a stream that fails, or a browser without Media Source (iOS before 17.1),
    plays the MP4 as before. A failed reel stays on its MP4 for the visit;
  - streams are suspended on `pagehide` and resumed from the back/forward
    cache by the pool itself (`markManagedVideo`, `onVideosResumed` in
    `video-lifecycle.ts`). A Media Source URL cannot be put back like a
    `src`.
- **`entry-home.tsx`** fetches hls.js 1.5 s after load, so the first reel's
  head can start loading as soon as the portfolio mounts.

## Results

Measured in Playwright's WebKit (the Safari engine) as an iPhone 15 Plus.
iPhone's preload rule was emulated (`preload=auto` acts as metadata until a
tap has started the element). The link was capped by a local proxy. Live
site against a production build of this change, same day, same reel order.

| | Live (MP4) | Streams |
|---|---|---|
| Card, first reel, 60 Mbps | 0.77 s | 0.07–0.22 s |
| Card, first reel, 20 Mbps | 0.79 s | 0.09–0.17 s |
| Swipe, typical reel, 60 Mbps | ~0.33 s | 0.24–0.43 s |
| Swipe to `adds-marketing` (24 Mbps), 60 Mbps | 1.96 s | ~0.35 s |
| Swipes, 20 Mbps | 2 of 6 never started in 20 s; others 0.26–3.7 s | 0.15–2.8 s, all started |

- Once a tap has opened the feed, iPhone lets the MP4 player preload too.
  So on a fast link, swipes to light reels sit at the same ~0.3 s, which is
  this test's floor. The gains are the first view (before any tap), heavy
  reels, and slower links.
- A reel whose bitrate is above the link (`adds-marketing` at 20 Mbps) still
  starts late and may stall. Only a lower bitrate would change that.
- Single-file test at 20 Mbps (no page around it): a reel with its 3 s head
  loaded started in 0.16 s. Cold, the stream started in 0.42 s (3 Mbps) and
  1.5 s (24 Mbps); the MP4 took 1.0 s and 7.6 s.
- Memory, same walk as `2026-10-17-mobile-video-memory.md`: at most 3 players
  hold a stream (2 off the page), as before. The full-screen feed's footprint
  was ~400–490 MB, against ~700–735 MB with the MP4 player, at the same
  steps.
- Desktop (1440 × 900, Chromium and WebKit): the hero plays from memory, and
  the service theater plays its stream with sound.

## Not changed

- The video: same files, same bytes per frame, same resolution and bitrate.
- Preview loops, the hero, the service hero and other `AdaptiveVideo` players.
- The MP4s stay on R2 as the fallback.
