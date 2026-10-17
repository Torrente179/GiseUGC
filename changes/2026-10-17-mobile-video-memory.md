# Videos no longer pile up in memory on iPhone

**Status:** Live on main
**Date:** 2026-10-17
**Scope:** every `<video>` on the site: home hero, "Reels que venden"
(`#portfolio`) and its full-screen feed, the creator-advantage deck, the
service-page heroes, formats and theater, the services marquee and the Fiverr
review dialog. Video files and quality are unchanged.

## The report

On an iPhone 15 Plus, moving between videos, service pages and the rest of the
site loaded the phone heavily until the tab crashed.

## How it was measured

Playwright's WebKit build (the Safari engine), emulating an iPhone 15 Plus
(430 × 932, DPR 3, touch). A script walked the same path each run: the home
page, the creator-advantage deck, the portfolio card, the full-screen feed
with ten swipes, then six service pages, each with its stories, the theater
and four swipes. It recorded:

- the phys_footprint of WebKit's processes (the number iOS kills a tab on);
- every `<video>` holding a source, on the page or off it;
- the megabytes of video downloaded.

Production builds of `main` and of this change ran one after the other
(`vite preview`). A Mac does not kill tabs for memory, so the crash itself does
not reproduce there; the pressure does.

## Causes

1. **Unmounted videos kept their stream.** Removing a `<video>` from the page
   does not free its decoder or its buffer: only clearing its `src` does.
   Otherwise they last until garbage collection, which Safari defers because
   the memory is native. `AdaptiveVideo` never cleared it. The cards that swap
   videos remount it every few seconds: service-page stories every 6 s, the
   creator-advantage cuts every 4 s, the desktop hero every 3.5 s. The Fiverr
   review dialog did the same on every close.
2. **The warm-up downloaded every loop twice in Safari.** `warmFeedVideo`
   buffered the next loop in a hidden `<video>`, so the real player could
   start from Chrome's media cache. WebKit never caches a video's range
   requests: the hidden element downloaded the file and the real player then
   downloaded it again. The test case was a 3.7 MB loop: WebKit fetched it
   twice, Chrome once. So on iPhone every rotation cost double, and the second
   download competed with the video on screen.
3. **Three full reels buffering at once in the feed.** The pool kept the reel
   on screen and the next one on `preload=auto`. A reel left behind kept its
   whole buffer as "previous". Reels are 8–128 MB files at 8–30 Mbps
   (`adds-marketing` is 1440 × 2560 at 24 Mbps). So three large streams were
   held, and two of them downloaded while the one on screen was still
   starting.
4. **Leaving a page kept its videos.** Safari keeps recent pages in its
   back/forward cache, in the same process as the page you are on. Their
   videos keep their players.

## What changed

- **`src/lib/video-lifecycle.ts`** (new):
  - `releaseVideo` pauses a video, clears `src` and calls `load()`, which
    frees it now.
  - `installVideoPageLifecycle` (called in `bootstrapApp`) releases every
    video, on the page and pooled, on `pagehide`. It restores them, with their
    time and play state, on a `pageshow` from the back/forward cache.
- **`AdaptiveVideo`** releases its video on unmount.
- **Fiverr review dialog** (`Testimonials.tsx`, `ReviewVideo`): picks HEVC or
  H.264 with `canPlayHevc` and sets `src`, instead of `<source>` children. It
  falls back to H.264 on error and releases the video on close.
- **`warmFeedVideo`** fetches the whole 6 s loop once and keeps it as a
  `blob:` URL:
  - `AdaptiveVideo` plays a warmed loop from memory (`holdFeedPreview` /
    `releaseFeedPreview`). If the loop is still downloading it waits for it
    rather than stream the same file alongside;
  - after one turn of a rotating card, every later turn costs no download;
  - up to 64 MB of loops are kept, the oldest unused first out. A loop on
    screen is never revoked;
  - only `preview.*.mp4` loops are warmed, never whole reels, and nothing on
    Save-Data / 2G.
- **Feed pool** (`FeedPlayerPool`, `FeedPoolSync`):
  - the next reel loads its first frame. It buffers in full once the reel on
    screen fires `canplaythrough` (or after 4 s), so the reel on screen gets
    the connection to itself while it starts;
  - a reel that leaves the screen drops its buffer (`acquire(slug,
    'metadata')` on a detached `auto` element reloads it as metadata);
  - pooled elements are registered with the lifecycle, so `pagehide` reaches
    them too.

## Results

Same path, production builds, WebKit as an iPhone 15 Plus:

| | Before | After |
|---|---|---|
| Players holding a stream at once (max) | 10 | 3 |
| … of them off the page (max) | 9 | 2 |
| Players holding a stream after 20 s of service-page stories | 7 | 1 |
| Video downloaded over the whole path | 814 MB | 544 MB |
| Story / card turn to first frame (median of 15) | 782 ms | 97 ms |
| Feed swipe to first frame (median of 10–11) | 52 ms | 84 ms |
| Stalls while playing | 0 | 0 |

- Peak phys_footprint on the Mac stayed about the same (774 → 781 MB). It is
  reached in the full-screen feed, and it is mostly page layers: the GPU
  process alone is ~360 MB at home-page load, before any video.
- macOS frees paused off-page players cheaply. iOS keeps each one as a player
  with its buffers, which is what this change removes. That part could not be
  measured without an iPhone.
- Desktop (Chromium and WebKit at 1440 × 900): the hero plays its warmed loop
  from memory, and the service theater plays with sound.

## Not changed

- The files: same masters, same encodes, same resolution and bitrate.
- The single fast-start MP4 per reel (`2026-10-14-feed-video-delivery.md`).
- The playback scheduler's one-decoder-per-class rule.
