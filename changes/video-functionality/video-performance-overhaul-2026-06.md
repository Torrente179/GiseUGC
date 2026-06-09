# Video Performance Overhaul — Session Record (2026-06)

Full record of the performance + quality work on the video pipeline: what shipped,
what's configured at the edge, the root-cause findings, current state, and the
outstanding/proposed work that was discussed but **not** yet implemented.

Companion docs:
- Operational reference: `video-encoding-tracking-setup-guide.md`
- Runtime catalog history: `video-catalog-and-transcript-seo.md`
- CDN/edge runbook + gotchas: `cdn-cache-runbook.md`

---

## Goal

Fix "the site feels extremely slow" and raise video quality to a Netflix/Crunchyroll
feel — **without** changing design, animations, or cutting quality. Diagnosis showed
the real causes were in the delivery layer, not the React code.

---

## 1. What shipped (code + scripts) — deployed to `main`

Commits: `e3ffe96` (pipeline), `aeba6ef` (catalog enable), `4955b07` (nuevos HLS +
purge gotcha), `067dd41` (CORS doc).

- **`scripts/encode-hls.sh` — rewritten as a multi-codec CMAF ladder.**
  - One adaptive `main` ladder per clip (dropped the redundant `mobile`/`preview`
    HLS renditions — ABR already serves every device from one ladder).
  - Per resolution tier (`360/540/720/1080/1440/2160`, gated by native width so we
    never upscale), **three codecs**: AV1 (`libsvtav1`), HEVC (`libx265`, `hvc1`
    tag for Safari), H.264 (`libx264` high).
  - `master.m3u8` carries valid `CODECS=` per variant → Chrome/Firefox/Edge pick
    AV1, Safari/iOS pick HEVC, everything else H.264. Measured AV1 ≈ **41% smaller**
    than H.264 at equal quality.
  - AV1 uses target-bitrate VBR (SVT-AV1 rejects `-maxrate` outside CRF); HEVC/H.264
    use capped VBR. 2s fMP4 segments, 30fps, 2s GOP alignment, 128k AAC muxed.
- **`scripts/encode-videos.sh` — higher-quality MP4 fallbacks.**
  - Previews: **720p, CRF 22, bitrate-capped at 2500k** (so high-motion clips don't
    balloon a small loop), 6s, no audio. Land ~2 MB.
  - Mobile: 720p CRF 22, 128k AAC, `+faststart`.
  - Now scans the `nuevos/` subfolder (previously only the root → 16 clips were
    silently skipped). Added `--preview-only` / `--mobile-only` flags.
- **`src/data/portfolio-clips.ts`** — all 10 legacy clips now carry `hlsSrc` via the
  existing `r2HlsMaster()` helper.
- **`src/components/ServiceLandingPage.tsx`** — mobile services hero now uses the
  adaptive `main` ladder (`hlsSrc`); the desktop key-art clip already did.
- **`src/components/media/AdaptiveVideo.tsx`** — hardened the **native-HLS (Safari)
  path** to fall back to MP4 if a master errors/404s (previously only the hls.js
  path fell back; a missing master would have left Safari with a broken video).
- **New ops scripts:** `scripts/r2-upload-media.sh` (uploads previews/mobile/HLS with
  correct `Content-Type` + `Cache-Control`), `scripts/r2-set-cache-control.sh`
  (backfills posters/mains). Both read R2 creds from gitignored `.env`.

`hls.js` remains a lazy-loaded chunk (never in the main bundle). `tsc` + `npm run
build` pass.

---

## 2. Encoding — all 29 clips, from originals

- Source mix (probed): most `nuevos` clips are **1080p HEVC**, one is **4K**
  (`Adds marketing.MP4`), legacy `ugc-*` clips are mostly **720p** originals (their
  ceiling — re-encoding can't add detail that isn't in the source).
- Output: **29 multi-codec HLS ladders (~2.0 GB)** + 29 capped 720p previews
  (~54 MB) + 29 mobile MP4s. Variant counts confirm native gating (4K = 18 variants,
  1080p = 12, 720p = 9, 480p = 3).
- Local outputs live in gitignored `tmp/video-hls/` and `tmp/video-encodes/`.

**Is this max quality?** Yes, per source — we encode up to each clip's native
resolution. The remaining quality issue is a *startup* artifact (ABR ramp), not a
ceiling — see §6.

---

## 3. Delivery / Cloudflare — configured via API

Done with a scoped Cloudflare API token (Cache Rules / Transform Rules / Cache Purge):

- **CORS Transform Rule `media-videos-cors`** — sets `Access-Control-Allow-Origin: *`
  (+ `Allow-Methods`, `Allow-Headers`) on `/videos/*`. **LIVE and verified** (`ACAO: *`
  confirmed). This is what lets **hls.js (Chrome/Firefox/Edge) load HLS cross-origin**
  — without it those browsers silently fell back to MP4. Safari never needed it.
- **Cache ruleset consolidated** to a single rule `media-videos-immutable` (was two
  overlapping rules): eligible for cache, edge TTL override 1 year, browser TTL
  respect-origin.
- **Cache purged** (cleared stale negative-cached 404s from before the HLS upload).
- R2 objects carry `Cache-Control: public, max-age=31536000, immutable` + correct
  `Content-Type` (`.m3u8` → `application/vnd.apple.mpegurl`, segments → `video/mp4`).

---

## 4. Root-cause findings

1. **Edge cache was off** — every asset returned `cf-cache-status: DYNAMIC` with no
   `Cache-Control`. Fixed via Cache Rule + object headers.
2. **Adaptive HLS was dormant** — every master was 404; 100% of playback was
   single-bitrate MP4. Fixed by encoding + uploading the multi-codec ladders.
3. **No CORS** — blocked hls.js cross-origin. Fixed via the Transform Rule.
4. **Negative-cache gotcha** — Cloudflare had cached the pre-upload 404s for the
   playlists; required a one-time purge after upload. (Documented in the runbook.)
5. **⚠️ THE REMAINING BLOCKER — `public.r2.dev` routing.** `media.giselasaldarriaga.com`
   is a registered R2 custom domain (SSL + ownership **active**), but its DNS record
   is `CNAME → public.r2.dev` — R2's **public *development* URL, which Cloudflare
   never caches** (rate-limited, `DYNAMIC` by design). Traffic flows through the
   uncached dev path and shadows the cacheable custom-domain path. **No Cache Rule
   can override this.** This is why caching still reads `DYNAMIC` despite a correct,
   single, enabled cache rule (verified: dev mode off, cache level aggressive, no
   config rules, no worker routes, origin sends correct `Cache-Control`).

---

## 5. Current state

**Live & working now:**
- Adaptive **AV1/HEVC/H.264 HLS streams in every browser** (CORS fixed) — the core
  quality goal. HLS masters + segments serve `200`.
- Higher-quality 720p previews; Safari fallback hardening; lazy hls.js.

**Edge caching — RESOLVED (2026-06).** `cf-cache-status: HIT` across
master/segments/previews/posters; cached responses keep `access-control-allow-origin: *`.
The §4.5 `public.r2.dev` theory was wrong — that CNAME is the *normal* R2
custom-domain placeholder. Root cause was the R2 custom-domain ↔ cache binding in
a non-cacheable state; **fixed by removing + reconnecting the custom domain in
R2 → bucket → Settings → Custom Domains** (the zone Cache Rule then engaged). See
`cdn-cache-runbook.md` → "Status (2026-06): RESOLVED".

Everything from this overhaul is now live: edge caching, adaptive AV1/HEVC HLS in
all browsers, HLS opening at the top rendition (no 480p ramp), Spanish accents,
and the legible/frosted mobile services hero.

---

## 6. Outstanding playback/UX work — DISCUSSED, NOT yet implemented

These were reported by the user and diagnosed, but not built. They involve a
deliberate re-balance against the performance limiters, and should land **after**
caching is live (so extra streams come from the edge, not origin).

### 6a. Hero wall — only left/middle tiles play, right columns stay paused
- **Cause (confirmed in code):** the hero wall renders ~40 `<video>` tiles, all at
  the **same lowest priority `"background"`** (`HeroWallTile.tsx`). The scheduler
  (`media-playback-scheduler.ts`) grants only ~6–8 concurrent slots on desktop and
  breaks the priority tie by **registration order** (`createdAt`). React mounts
  columns left→right, so the **leftmost columns grab all slots** and the right
  columns are denied → paused on poster.
- **Fix:** raise the hero playback budget to cover on-screen tiles and/or give the
  hero a dedicated priority lane; keep mobile capped (mobile already decodes only
  the first 2 columns, posters for the rest).

### 6b. "Low quality then restarts to high quality" on the services showcase
- **Cause:** hls.js ABR starts conservative (`startLevel: -1`) and ramps up.
- **Fix:** for short background/hero **loops**, pin a single high rendition (no ABR);
  keep ABR for theater/full playback. Add high-quality first-frame posters and a high
  `abrEwmaDefaultEstimate` so it never starts at 360p.

### 6c. Portfolio click → instant audio
- **Goal:** clicking a portfolio clip plays unmuted immediately (no delay).
- **Fix:** intent-prewarm (hover/touch-start fetches the first segment) so `play()`
  fires unmuted inside the user gesture with no buffering wait. `TheaterVideo.tsx`
  already attempts unmuted-then-muted; prewarm removes the delay.
- Services marquee loops stay **muted** background (decorative) — confirm desired.

### 6d. "Preload everything on first load"
- **Fix without slowing first paint:** `preconnect` to the media domain; `preload`
  only above-the-fold (hero posters + first segments); `prefetch` the rest during
  `requestIdleCallback` into the HTTP cache. Edge cache + `immutable` keeps it warm.

### 6e. "No-loss" technique stack (the way to get all of the above without regressing speed)
- Caching + AV1 make bytes cheap (foundation).
- Viewport-matched decoder budget + posters for off-screen/duplicate tiles; optional
  **canvas multiplexing** (decode N unique clips once, paint to many tiles) for the
  wall.
- Pinned-rendition loops; idle-time prefetch; hover prewarm.
- Hard constraint that remains: low-end phones can't decode many simultaneous
  streams — handled by posters + fewer live tiles on mobile.

---

## 7. Remaining action items

1. **Fix `media.giselasaldarriaga.com` routing** (R2 dashboard): remove the custom
   domain + delete the `media → public.r2.dev` DNS record + **Connect Domain** so R2
   provisions the correct cacheable record. Optionally disable the Public Development
   URL (`r2.dev`). Then caching flips to `HIT`. *(Not done via API — repointing live
   production DNS on an inferred target risks taking all videos down; safer in R2's
   guided flow.)*
2. **Verify** `cf-cache-status: HIT` across master/segment/preview/poster after #1.
3. **Roll/delete the Cloudflare API token** — it appeared in chat during setup.
4. **Then** implement §6 (hero budget, pinned-rendition loops, idle prefetch, hover
   prewarm) as a measured re-balance.

## Verification commands

```bash
# CORS (should print: access-control-allow-origin: *)
curl -sI -H "Origin: https://www.giselasaldarriaga.com" \
  https://media.giselasaldarriaga.com/videos/hls/IMG_8435/main/master.m3u8 \
  | grep -i access-control-allow-origin

# Caching (after the DNS fix: MISS then HIT, GET 200 not 404)
curl -sI https://media.giselasaldarriaga.com/videos/hls/IMG_8435/main/master.m3u8 \
  | grep -iE 'http/|cf-cache-status|cache-control'
```
