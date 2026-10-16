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
