# Testimonios: the real Fiverr reviews, with the delivered videos

**Status:** Live on main
**Implemented:** 2026-10-15
**Scope:** `Testimonials` (`#testimonials`, homepage), every breakpoint, light
and dark.

The section was a marquee of 14 screenshots of Fiverr reviews. The user asked
for the actual reviews from https://www.fiverr.com/gisela_sm, all of them,
shown like Fiverr's own card (client, country), with the delivered video
playable from the card. On their call, reviews under 4 stars are left out.

## Data

- **Capture:** `content/fiverr/reviews-2026-10-15.json`, read from the public
  profile with all 177 reviews loaded.
  - The built-in browser pane was blocked by Fiverr's bot protection (the
    review feed returned 403). The capture was made in the user's own Chrome
    after they cleared Fiverr's check.
- **Kept:** 168 reviews of 4 stars and up.
- **Not kept:** prices and durations.
- **Seller summary:** 4.7 from 177 reviews; communication 4.8, quality 4.8,
  value 4.7.
- **Generated data:** `scripts/build-fiverr-reviews.mjs` writes
  `src/data/fiverr-reviews.ts`:
  - ISO country codes (38 countries), so names render in either language via
    `Intl.DisplayNames`;
  - service;
  - language: es 63 · en 103 · it 2;
  - Gisela's reply where she wrote one;
  - an approximate month from Fiverr's "N months ago". Reviews with a video
    use the exact delivery date carried in the Fiverr asset id instead.
- **Videos:** 33 reviews had a file.
  - 4 return 404 on Fiverr's media CDN (gone on Fiverr's side).
  - 1 belongs to a 3-star review.
  - That leaves **28 reviews with a playable delivered video**.
  - Each plays Fiverr's HD rendition (1280×720, watermarked by Fiverr) from
    `fiverr-res.cloudinary.com`, only when someone presses play.
  - These are client deliveries, mostly not in the portfolio, so no original
    from her own library exists to swap in.

## What it is now

- **Header:** title, ★ 4.7 · 177 reseñas, the three sub-ratings, and "Ver mi
  perfil en Fiverr".
- **Filters:** Todas 168 · Con video 28 · En español 63 · En inglés 103.
- **Cards:** shown 9 at a time with "Ver más reseñas" and a live "9 de 168"
  count. They sit in 1/2/3 lanes, filled round-robin so loading more only
  appends.
- **Order:** rating first, then how much the client wrote.
- **Card contents:**
  - initial avatar, username, flag + country, stars;
  - service and a relative date ("hace 1 año"). The date is computed in the
    browser after mount, because the prerendered HTML can be months old;
  - an "En inglés" tag when the review is in the other language;
  - the review, clamped at 6 lines with "Ver más";
  - Gisela's reply;
  - the delivered video's poster with a play button.
- **Player:** portalled to `<body>` (`.studio-section` traps fixed overlays).
  - It takes the media theater, so other videos pause, and locks the page.
  - Escape or the scrim closes it, and focus returns to the card.
  - Full screen on phones.
- **Removed:** the screenshot marquee and its zoom viewer. The PNGs in
  `public/uploads/videos/testimonials/` are unused now.

## Updating

Capture the profile again into `content/fiverr/reviews-<date>.json` (same
shape), then run `node scripts/build-fiverr-reviews.mjs`. The script fails if
the number of matched videos differs from the capture's playable files.

## Verified

Headless Chrome against the dev server:
- **Layout:** 1440 (light and dark) and 390, Spanish and English. 9 cards,
  3 lanes on desktop and 1 on phones, no horizontal overflow.
- **Filters and "show more":** "Con video" gives 28, and "show more" goes from
  9 to 18.
- **Player:** a delivered video plays from Fiverr (1280×720, 4 s in after
  5 s), the body is locked, Escape closes it, and focus returns to the card.
- **Checks:** typecheck, ESLint, 404 tests.

## Fix: videos and posters were blocked in production (2026-10-16)

The production Content-Security-Policy (`vercel.json`) only allowed images and
media from the site's own domains, so the browser refused everything from
`fiverr-res.cloudinary.com`: posters didn't load and the videos couldn't play.
The dev server sends no CSP, which is why the local checks passed.
`https://fiverr-res.cloudinary.com` is now in `img-src` and `media-src` only,
with no script, connect or frame permissions.

## Client photos (2026-10-16)

The cards showed initials only. The capture now carries `avatars`: the Fiverr
profile photo (small rendition) of every reviewer who has one. That is 64
clients, covering 86 of the 168 reviews. The build script adds it as `avatar`,
and the card and player show it. Clients with no photo on Fiverr keep their
initial. The photos also come from `fiverr-res.cloudinary.com`, which the CSP
now allows.

## Self-hosted on R2 (2026-10-16)

The user asked for the review media on Gisela's own CDN, like the portfolio
videos. Nothing in Testimonios loads from Fiverr now, and
`https://fiverr-res.cloudinary.com` is out of the CSP again.

- **Script:** `scripts/self-host-fiverr-media.mjs [--upload]`.
  - Fetches each playable delivered video (Fiverr's HD rendition) and repackages
    it as fast-start MP4 with no re-encode.
  - Cuts a frame-0 WebP poster.
  - Makes a 120 × 120 WebP of every kept client's photo (59).
  - Uploads to R2: `videos/reviews/v1/<asset>.mp4` and `.webp`, and
    `images/reviews/v1/<user>.webp`.
  - Records sizes in the capture's `selfHosted` block.
- **Build script:** `build-fiverr-reviews.mjs` reads that block. It fails if a
  matched video isn't self-hosted.
- **Video shape:** each video carries its width and height.
  - 20 of the 28 are vertical (404×720).
  - The card tile uses the video's own ratio. Vertical ones are cropped to 4:5,
    so a reel doesn't make the card a page long.
  - The player sizes itself to the video, so vertical deliveries play
    full-height instead of inside a 16:9 box.
- **Quality caveat:** these were Fiverr's 720p renditions, with Fiverr's
  watermark burned in. The original uploads replaced them the same day (next
  section).
- **Verified:** headless Chrome at 1440 and 390 with the "Con video" filter.
  - All posters and photos load from `media.giselasaldarriaga.com`.
  - A vertical video plays at 0.561 and a landscape one at 1.778, with no
    overflow.
  - Zero requests to Fiverr.
  - typecheck, ESLint, 404 tests.

## The original uploads, not Fiverr's 720p (2026-10-16)

The user asked for maximum quality. Fiverr's "HD" rendition (`t_fiverr_hd`)
was a 720p copy (404×720 for the vertical ones) with Fiverr's watermark
burned in. The file as uploaded is still served (`fl_attachment`). For all
28 it is an iPhone HEVC master:
- 9 at 4K, 3 just under 4K, 16 at 1080p;
- 7.8–23 Mbps;
- no watermark.

The user approved the ~2.3 GB download.

- **What plays:** the HEVC original itself, repackaged as fast-start MP4
  with no re-encode, 4K and rotated ones included.
  - Browsers apply the rotation flag themselves.
  - A "transparent" 1440p re-encode of these grainy 4K masters came out at
    24–30 Mbps against the original's ~15. So the original is both sharper
    and smaller, and here it beats the portfolio rule of 4K → 1440.
- **Fallback:** browsers without HEVC get an H.264 file.
  - x264 CRF 17, from `scripts/lib/video-encoding.mjs`.
  - 4K is delivered at 1440 on the short side.
  - The player lists the HEVC file first with its codec type, so each
    browser picks the one it can play.
- **Posters:** frame 0 of the H.264 file, up to 1080 px wide (were 404 px).
- **R2:** `videos/reviews/v2/<asset>/{hevc,avc}.mp4` and `poster.webp`.
  - HEVC 2.1 GB, H.264 3.0 GB.
  - A video loads only when someone presses play.
  - The v1 720p files stay on R2, unused.
- **Shared module:** the encoder settings, probe and R2 upload moved into
  `scripts/lib/video-encoding.mjs`, shared with `scripts/encode-feed.mjs`.
  `encode-feed.mjs --data-only` reproduces `feed-renditions.ts` byte for
  byte after the move.

## Seven videos taken off (2026-10-16)

On the user's call, these reviews no longer show their video:
- josegaravito5 (4.3, "excelente video, Gracias por el trabajo…")
- jessien
- felixsegovia525 ("Excelente trabajo, muy profesional…")
- chmuhammad384
- boombiz
- corneliamatilda
- get1web

The reviews themselves stay.

- **How:** the capture lists them in `videosRemoved`, and both scripts skip
  them. Their delivery dates still come from the asset id.
- **Result:** "Con video" now shows 21 reviews.
- **R2:** their files are deleted (v1 and v2), and the CDN copies are purged.
