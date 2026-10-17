# Service pages play videos in the home page's player

**Status:** Live on main
**Date:** 2026-10-16
**Scope:** the 16 service pages (`/servicios/*`, `/en/services/*`), the
home page's portfolio (`#portfolio`), all breakpoints, light and dark.

## The report

The user said that opening a video on a service page showed a different modal
from the home page's, and that the video could not be paused.

## Cause

The service pages still used the old `MediaTheater` (a card with
`TheaterVideo` inside). Its play/pause button got `pointer-events: none` while
the video played, so a click went through to the bare `<video>`, which had no
handler. There was nothing to click that paused. The home page had moved to
its own theater in `Portfolio.tsx` on 2026-10-14
(`2026-10-14-portfolio-reels-feed.md`), so the two pages had different players.

## What changed

- **One player:** the home theater (`.rt`, desktop and every iPad, ≥ 700px)
  and the full-screen feed (`.rf-mob--overlay`, phones) moved out of
  `Portfolio.tsx` into `src/components/media/ReelTheater.tsx`. The home page
  and the service pages both render it. The caller keeps the feed pool, the
  playback slot and the sound toggle. The theater handles the rest: tap to
  pause, ✕ and Escape, the body lock with scroll restore, focus return, arrow
  keys, wheel and swipe, and the dark-theme ambient light.
- **Service pages:** the hero (desktop glass panel and phone card) and the
  phone "El trabajo" rail open `ReelTheater` on the page's
  `featuredExamples`. They play from the same feed files
  (`src/lib/feed-media.ts`), at the master's own quality. All 56 examples per locale
  have feed files (checked 2026-10-16). Differences from the home page:
  - no category tabs;
  - the phone feed's top pill reads "El trabajo" / "The work";
  - the CTA is "Quiero este servicio" with the service's WhatsApp message;
  - the Fiverr 4.7 and 177 show only on the bilingual page, the one that
    carries the AggregateRating (`showRating={Boolean(page.geoFact)}`, the
    same rule as the hero). Other pages show the heart, 28+ and sound.
- **Tap to pause on phones:** the home page's phone feed had no pause either.
  A transparent `.rf-mob-tap` button now sits inside the active slide, inside
  the scroller, so a swipe that starts on it still scrolls the feed. Paused
  shows the theater's `.rt-paused` badge and hides the "Desliza" hint. This
  applies to the home page too.
- **Removed:** `MediaTheater.tsx` and `TheaterVideo.tsx` (nothing else used
  them). Their CSS in `index.css` (`.media-theater*`, `.theater-control`,
  `.dc-theater-*`, `html[data-theater]`) is now unused. It was left in place
  because other sessions edit that file.
- The download guard is document-wide (`src/lib/video-download-guard.ts`), so
  the pooled feed players are covered as before.

## Verified

Claude in Chrome, against a dev server with its own dep cache. The service
pages need `#route-data`, so the page was mounted in same-origin iframes with
route data from `buildServiceLandingRouteData`, at exactly 1440×900 and
390×844:

- **Desktop 1440:**
  - Light: bilingual ES. The hero opens the theater with sound on a 1080×1920
    stream, and focus goes to ✕. A click pauses (frame held for 2 s, badge
    shown) and a second click plays with sound.
  - ↓ moves to 02/08.
  - Escape and ✕ both close. Scroll goes back to 150 px and focus returns to
    the hero frame.
  - Dark: TikTok/Meta EN, where the rating and review count are hidden, and
    pause works.
- **Phone 390:**
  - Light: bilingual ES. The "El trabajo" card opens the feed full screen with
    sound. A tap pauses and plays it. A wheel swipe goes to 02/08 with sound.
    ✕ restores scroll to 852 px and focus to the card, and no audio is left
    playing.
  - Dark: lifestyle ES. The hero card opens the feed on the reel it showed, and
    the tap pauses it.
- **Home, regression:**
  - 1440: the theater has its tabs, rating and pause. A tab filters the reels,
    and Escape restores the scroll.
  - 390: the feed opens, a tap pauses, scrolling reaches 04/26, and a tab
    resets the feed to 01. ✕ restores the scroll, focus and the card's reel.
- `npm run typecheck` and `npm test` (393 passed). ESLint: 2
  `only-export-components` warnings in `ReelTheater.tsx`, the same kind as
  14 already in the repo.
