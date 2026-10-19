# Videos are served only to the site

**Status:** Live on main
**Date:** 2026-10-19
**Scope:** every video file on `media.giselasaldarriaga.com` (Cloudflare over
R2), plus the startup clips the site serves itself from
`/uploads/videos/startups/`.

## The request

The user asked for protection against video theft: no downloads, and no screen
recording. Screen recording cannot be detected or blocked by a website. Only DRM
blacks it out, and only on some devices. The user chose to lock down downloads
without DRM.

## What already existed

`src/lib/video-download-guard.ts`: no right-click "Save video as…", no dragging a
video out, no iOS long-press menu, `controlsList="nodownload"`. Anyone with the
file's URL could still open or download it directly.

## What changed

- **Cloudflare WAF custom rule** on the zone, ref `gise_video_referer_lock`,
  managed by `scripts/cloudflare-video-lock.mjs` (`npm run video:lock`,
  `-- --off`, `-- --status`). It blocks (403) a request to the media host for a
  video extension (`mp4 m4v mov webm m4s m3u8 ts`) unless one of these is true:
  - the Referer starts with `https://www.giselasaldarriaga.com/` or
    `https://giselasaldarriaga.com/`;
  - the Referer is a local dev server (`http://localhost:`, `http://127.0.0.1:`);
  - Cloudflare has verified the client as a known crawler (`cf.client.bot`:
    Googlebot, Bingbot…), so video indexing keeps working.
  Posters and every other image stay open (link previews, image search).
  Vercel previews are not allowed: the free plan has no regex, and the
  prefix + `contains` test first used here let any site whose name starts with
  `gise-` through (flagged by the commit security review). Previews play no
  media-host video; production is where the site is tested.
- **`vercel.json`**: a request for `/uploads/videos/startups/*` whose Referer is
  not the site or one of its previews is redirected to `/`. The main site is on
  Vercel, not behind Cloudflare, so the WAF rule does not reach these files.
  The pattern is anchored (`^…$`). Vercel already matched the unanchored one
  against the whole header (a foreign Referer with the site's address in its
  path or query was redirected), so the anchors only make that explicit.
  07a8764 briefly dropped them on a false reading: the shell loop used for that
  check (`${r:+-H "Referer: $r"}` in zsh) sent no usable Referer at all.
  When checking by hand, pass `-H "Referer: …"` as two literal arguments.
- **Build checks send the site's Referer**: `scripts/generate-nuevos-r2-catalog.mjs`
  (runs in `prebuild`, on Vercel too) and the video sitemap probes in
  `src/lib/video-sitemap.ts`. Without that, the catalog would have seen every
  video as missing and dropped them all from the site on the next deploy.

## Why Referer works for playback

A page sends its address in the Referer header on every request, including
`<video>` loads, under the site's `strict-origin-when-cross-origin` policy
(the media host gets `https://www.giselasaldarriaga.com/`). Checked on
2026-10-19 with a local probe server: Chromium sent it on `fetch`, autoplay
and `preload=metadata` loads. Playwright WebKit sent it too, as a Mac and as an
iPhone, including on AVFoundation's `bytes=0-1` probe. The feed reels load
through hls.js, which sends it as well.

## Limits

- Any tool can fake the Referer header. This stops a pasted link, a download
  tool given the URL, and other sites embedding the files. It does not stop
  someone who copies the request with the header, or who films the screen.
- Direct video links shared outside the site (for example in WhatsApp) now
  return 403. Share the page instead.
- `curl` checks of video URLs need `-H "Referer: https://www.giselasaldarriaga.com/"`.

## Undo

`npm run video:lock -- --off` switches the Cloudflare rule off at once. Remove
the `/uploads/videos/startups/(.*)` redirect from `vercel.json` for the
startup clips.
