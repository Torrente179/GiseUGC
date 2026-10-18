# Home page scrolling no longer waits for JavaScript on iPhone

**Status:** Live on main
**Date:** 2026-10-18
**Scope:** the home page on phones (services marquee), and every page that
holds feed streams when a link leaves it.

## The report

After the scroll-landing fix (`2026-10-17-scroll-landing-no-freeze.md`), the
user still found the home page frozen on an iPhone when coming back from a
service page. It took a couple of seconds before they could scroll or tap
another service.

## What was measured (live site)

- **Server:** the home HTML returns in ~0.25 s, an edge cache hit, 29 KB
  compressed.
- **WebKit as an iPhone, fast link:** first frame 0.28 s after the tap. The
  page transition ends at 0.8 s. Main-thread stalls total 0.14–0.37 s.
- **Chromium at 4× CPU:** 180 ms of blocking in the first 5 s after arriving.
  The longest frame is 195 ms.
- So no single task holds the main thread for seconds.
- **The listener that makes it matter:** the home page's services marquee (the
  full version; service pages use the lite one) put `touchmove`, `touchend` and
  `touchcancel` on `window`, non-passive. The DevTools listener audit of the
  live home page shows all three.
  - On iPhone that makes the whole page a synchronous touch region: every
    swipe, anywhere, waits for the main thread to run that handler before
    Safari will scroll.
  - Right after arriving, the main thread is busiest: sections mounting, the
    feed's streams starting, the marquee's own animation loop. So swipes
    stalled.

## What changed

- **`ServicesMarquee`:** the touch listeners are on the rail itself. A
  touch's moves and end go to the element it started on, so the drag is
  unchanged. Only a swipe that starts on the rail waits for the handler, and
  the rest of the page scrolls on Safari's side without JavaScript.
  - Listener audit after the change: `window` has one passive `touchstart`,
    and nothing else.
  - Checked in Chromium with touch emulation, before and after. A sideways
    swipe on the rail drags the cards (~400 px) and leaves the page still. A
    vertical swipe that starts on the rail scrolls the page.
  - `ServicesMarquee.test.tsx` fails if a touch listener goes back on
    `window`.
- **Feed streams leave with the tap** (`releaseStreamsForNavigation` in
  `video-lifecycle.ts`, called by the link interceptor in
  `client-runtime.tsx`).
  - A link tap that leaves the page releases its Media Source players before
    the browser decides whether to keep the page for Back. Safari may decline
    to cache a page with live Media Source, which would turn Back into a full
    reload.
  - They come back on a back/forward restore. The pool's `suspend()` keeps
    what it saved when `pagehide` calls it a second time.

## Not verified

- No iPhone or iOS Simulator is available on this machine. The listener's
  effect on iOS scrolling is WebKit's documented behaviour for non-passive
  touch listeners, not something measured here. Chromium's synthetic
  gestures wait for the main thread in both versions, so they could not show
  the difference.
- Whether iOS Safari keeps the home page for Back with and without streams
  could not be tested (Playwright's WebKit has no back/forward cache).
- The page transition (`@view-transition`, 80 ms delay + 420 ms) still holds
  each arrival for about half a second, as designed. Whether to shorten or
  drop it on phones is a design choice for the user.
