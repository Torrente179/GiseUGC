# Site videos: original-quality files and a faster player

**Status:** Live on main
**Implemented:** 2026-10-14
**Scope:** every video on the site:
- the portfolio reels (phone card, full-screen feed, desktop phone);
- the hero phone;
- "Videos para cada paso";
- the services marquee;
- the service and vertical landing pages (cards, lead proof, theater);
- the service keynote's formats phone.

The user's requests, in order:
1. Phones loaded the reels slowly and they looked bad.
2. Add left/right arrows on the portfolio card.
3. Make the quality "almost original".
4. Apply the same treatment to every video on the site.

## What was wrong (measured)

Headless Chrome, 390 px at 3×, 20 Mbps / 70 ms, cache off:
- **Resolution:** the portfolio card played the **540p** rung.
  `AdaptiveVideo`'s preview mode capped hls.js to the player's CSS width and
  ignored pixel density.
  - iOS Safari opens a master playlist on its first variant (360p) and ramps
    up from there.
  - VMAF of that 540p rung against the master: **85.0**.
- **Startup:** the first frame came at **1.86 s**. Four requests ran in
  sequence (master → variant → init → segment). hls.js also fetched a 360p
  segment and threw it away when it switched up.
- **Card loops:** cards played 480p / 24 fps loops at ~1.3 Mbps.
- **CDN caching:** `.m3u8` playlists are never cached by Cloudflare
  (`cf-cache-status: DYNAMIC`), so each one was a full trip to R2 (~200–500 ms).
  MP4s are cacheable; a cold edge returns a MISS at ~450 ms.
- **Colour:** two masters are iPhone HDR (HLG): `IMG_5793.MOV` and
  `ugc-voiceover-bots-review.mp4`. The old pipeline converted them without
  tone-mapping, so they looked washed out.

## Quality: the original wherever possible

A re-encode can't beat the master, and a transparent one costs more bits than
the master itself. "Croma key plano cerrado" (a 12.6 Mbps iPhone HEVC master)
measured:

| File | Bitrate | VMAF |
|---|---|---|
| x265 CRF 22, 6 Mbps cap (first attempt) | 6.2 Mbps | 92.2 |
| x265 CRF 18–20 | ~16 Mbps | 98.0 |
| x264 CRF 17 | 19.6 Mbps | 98.5 |
| **The original stream** | **12.6 Mbps** | **100** |

`scripts/encode-feed.mjs` therefore does this for each of the 29 masters (26
reels plus the three clothing cuts):
- **SDR, upright, ≤ 1080 px on the short side:** the original video and audio
  streams, untouched, repackaged as fast-start MP4.
  - HEVC masters (7) keep `hevc.mp4` and also get an x264 CRF 17 `avc.mp4` for
    browsers without HEVC.
  - H.264 masters ship their own stream as `avc.mp4` only. It plays everywhere,
    and an HEVC copy couldn't add anything.
- **HDR, rotated or 4K:** encoded near-transparent (x265 CRF 18 / x264 CRF 17).
  - HDR goes through macOS `avconvert` (Apple's own HDR → SDR) first.
  - The 4K master (`Adds marketing`, 2160×3840) is delivered at
    **1440 × 2560**. That is the only master above 1080p.
- **`preview.{hevc,avc}.mp4`:** a 6 s silent loop of the opening at the same
  settings, for cards and the hero. A stream-copy cut would glitch at the loop
  point.
- **Posters:** frame 0, as WebP in `public/uploads/videos/feed/v1/` (≤ 1080 px
  and 360 px).
- **Metadata:** location metadata and chapters are stripped from every file.
- **Location:** R2 at `videos/feed/v1/<slug>/`.
- **Data:** `src/data/feed-renditions.ts` lists every master by slug with its
  size and whether it has an HEVC file. `--data-only` rewrites it from probes.
- **One quality for everyone:** the user ruled out lighter tiers and downgrades
  for slow phones or connections.

**Source ceilings.** The masters themselves set the limit:
- 1080 × 1920 for 15 of the newer clips;
- 720 × 1280 for the ten legacy clips;
- 480 × 848 for the clothing cuts and two WhatsApp clips.

## Playback

- **One resolver for the whole site.** `resolveFeedSource` in
  `src/lib/feed-media.ts` reads any site video URL (main, mobile or preview MP4,
  or HLS master) and returns the matching feed file. A preview URL gets the
  6 s loop; anything else gets the whole reel.
  - `AdaptiveVideo` calls it before HLS, so every player on the site switched
    at once. If a feed file fails, the old source plays instead.
- **The theater** (`createClipPlaybackCandidates`) gets a single candidate: the
  full-quality file. It needs no startup bridge or crossfade.
- **Codec choice:** HEVC only when the master is HEVC *and* the browser
  decodes it (`canPlayType`, Main@5.0). Everything else gets H.264.
- **Hero:** plays the reels' 6 s loops; it rotates every 3.5 s. Cards and the
  reel stack load the next loop ahead of time with `warmFeedVideo`
  (updated 2026-10-17, see `2026-10-17-mobile-video-memory.md`):
  - it fetches the whole loop once and keeps it as a `blob:` URL, which
    `AdaptiveVideo` plays at once on the next turn;
  - up to 64 MB of loops are kept; the oldest unused one goes first;
  - the old warm-up (a hidden `<video>` on the same URL) only helped Chrome.
    Safari never caches a video's range requests, so there it downloaded every
    loop twice.
- **Portfolio feed** (`FeedPlayerPool`, `FeedMedia`):
  - **Element pool:** up to 4 `<video>` elements are reused. The next reel and
    the previous one load their first frame. The next one buffers in full only
    once the reel on screen can play through (`FeedPoolSync`). A reel that
    leaves the screen drops what it had buffered.
  - **Full-screen hand-over:** opening the full-screen feed moves the playing
    element from the card into the overlay within one React commit, so it
    keeps playing. Closing moves it back.
  - **iOS sound:** iOS only allows sound on an element a tap has started.
    - The tap that opens the feed, or turns the sound on, calls `pool.bless()`,
      which play/pauses every pooled element inside that tap.
    - Sound then survives every later swipe.
    - The sound itself is switched on synchronously in the tap handler.
  - **Rewind:** a reel that leaves the screen is paused. When it comes back,
    it rewinds to its poster frame on re-attach (Chrome drops a seek made while
    the element is detached).
  - **Early loading:** loading starts one screen before the section arrives.
    The section holds one `preview` slot across the hand-over.
  - **Theater mode:** the full-screen feed takes the theater
    (`acquireTheater`), so every other video on the page pauses.
  - **Landscape reels** (two masters) play whole over a blurred fill.
- **Arrows:** glass ‹ › buttons on the phone card (`.rf-reel-nav`). They wrap
  around and nudge outwards twice the first time the card comes into view
  (none with reduced motion).

## Not verified

There is no Xcode on this Mac, so the iOS sound blessing is covered by unit
tests only, not by a Safari run.

## Cloudflare (not changed here)

- **Smart Tiered Cache** would cut cold-edge misses: a cold POP would fetch
  from an upper-tier POP instead of from R2. It is a free dashboard toggle:
  Caching → Tiered Cache.
- **HLS ladders** are no longer requested by the site. A Cache Rule for
  `.m3u8` would only matter if they come back.
