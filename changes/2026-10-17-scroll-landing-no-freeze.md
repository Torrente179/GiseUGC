# Landing on the home page no longer freezes or jumps

**Status:** Live on main
**Date:** 2026-10-17
**Scope:** every arrival that lands mid-page:
- Back / Forward / reload into a scrolled page;
- section links from another page (`/#services`, `/#portfolio`, `/#contact`,
  the phone tab bar on service pages);
- the in-page section links (tab bar, nav, CTAs).

Phone and desktop.

## The report

On an iPhone, after tapping a service and going back to the home page, the
screen stayed frozen for a couple of seconds before it would scroll or take a
tap.

## What was measured

Scripts drove the same paths:
- **WebKit** (Safari's engine), as an iPhone 15 Plus;
- **Chromium**, with the CPU slowed 3× to phone speed and a real touch swipe
  (CDP `Input.synthesizeScrollGesture`, 0.7 s after arriving).

The main thread was not the problem: one long frame of 105 ms on return. The
page was being moved by script while the visitor tried to scroll.

## Causes

1. **Back sent the page to the top.** Every document load is a React Router
   `POP` with nothing saved, so `App.tsx` called `scrollTo(0)` two frames after
   load. WebKit: restored to the Services section at 272 ms, thrown to y=0 at
   334 ms, and left there. Chromium restored it again at 517 ms, so the page
   jumped down, up and down.
2. **Section links parked the page at the top, then jumped.** `/#services` from
   a service page: the browser had already scrolled to the section (529 ms).
   The app sent it back to y=0, then polled every 80 ms: at least 8 times and
   up to 40 (0.64–3.2 s) until the section stopped moving, then jumped. A swipe
   made meanwhile was undone. Chromium, phone CPU: the finger took the page to
   399 px, then the script took it to the section.
3. **The in-page eased scroll ignored the finger.** For up to 1.08 s it set the
   scroll every frame. A swipe of 300 px moved the page 44 px.
4. **The Portfolio placeholder was a fixed 760 px.** The real section is
   686–1285 px, depending on the screen. Everything below it moved when it
   mounted: 73 px on an iPhone 15 Plus, 495 px on an iPad mini, 153 px on a
   1440 desktop. That is also why the section links had to wait.

## What changed

- **`src/lib/hash-section-scroll.ts`**, `pinElementInView`:
  - lands on a section at once (80 px under the nav);
  - then holds it every frame while deferred sections mount, for up to
    3.2 s;
  - lets go on the visitor's first `touchstart`, `wheel`, `pointerdown` or
    `keydown`;
  - never parks the page at the top.
  The old retry helpers are gone.
- **`App.tsx`:**
  - On a document's first render it leaves the scroll to the browser.
  - A hash lands with the pin, and clears the hash.
  - Back and reload hold the section the visitor was reading. On `pagehide`
    the page stores that section and its offset (`findScrollAnchor` →
    `sessionStorage`, per path), so the right content stays on screen while
    sections above it mount.
  - Restoring by `location.key` remains for in-document location changes.
- **`useHashlessSectionNavigation`:** the eased scroll stops on the visitor's
  touch, wheel, click or key. It also re-measures its target every frame, so it
  does not land short when a section above mounts on the way.
- **`Index.tsx`:** the Portfolio placeholder is now exactly as tall as the
  section:
  - phones: the 350:452 card at full width less 40 px, the two-line title,
    and 238 px of chips, padding and CTA;
  - desktop: the grid padding plus the phone at 2.092 × its width.

## Results

Production build (`vite preview`) against the live site, same scripts.

| | Live (before) | Fix |
|---|---|---|
| Back to home (WebKit) | at the top of the page | where you left: Services at 194 px on screen before and after |
| `/#services` from a service page (Chromium, phone CPU, swipe at 0.7 s) | at y=0 when the finger lands; the finger's 399 px then undone by a jump | already on the heading (2069); the swipe kept (2472), no script scroll after it |
| In-page Servicios tab, swipe 300 px up mid-scroll | page moves 44 px | page moves 259 px, the scroll stops |
| Back, swipe at 0.7 s (Chromium) | kept | kept, no script scroll after it |
| Portfolio placeholder vs section, 320–1920 px | −74 to +495 px | 0 px on phones, 1 px on desktop before the 1 px rounding fix (not re-measured) |

- `/#services` in WebKit lands 80 px under the nav and holds through the
  layout changes. In the run, the Portfolio first renders one frame at 900 px
  before its phone layout; the pin follows it, so the section stays put.
- The cross-document view transition is unchanged.

## Follow-up (2026-10-18): scrolling up after a mid-page landing

- **Problem:** after Back to a page left deep down (Testimonials), scrolling
  up jumped twice on an iPhone: 239 px at the manifesto and 180 px at
  services. Safari's scroll anchoring did not absorb it.
- **Cause:** sections off screen skip their rendering
  (`content-visibility: auto`, index.css) and stand in at 900 px plus their
  padding. They drew at their real height (manifesto 661 px, services 832 px)
  only when scrolled into view.
- **Also:** leaving from a section without an id (the method section,
  `ca-section`) stored no anchor at all, so Back fell back to the browser's
  pixel restore. That was off as well, because of the same stand-in heights.
- **Fix:**
  - The anchor is now the section being read, named by its id, or else by
    its first class and its place among those sections (`resolveScrollAnchor`).
    It is on screen, so it has been drawn and its offset is true.
  - When the pin finds its section, `revealSectionsAbove` sets
    `content-visibility: visible` on the sections above it. They draw at their
    real height while the pin holds the landing, so scrolling up has nothing
    left to resize. Sections below keep skipping their rendering.
- **Result** (production build, WebKit as an iPhone 15 Plus):
  - Back to the method section lands at -899 px on screen. It was at
    -900 px when the visitor left.
  - The manifesto and services draw at 661 and 832 px.
  - Scrolling up 250 px at a time moves the page exactly 250 px each step;
    the live site jumped twice.
  - The finger test (Chromium, phone CPU) is still respected on all three
    paths.

## Not changed

- Where the in-page eased scroll lands (the section's top, no nav offset).
- The view transition, and the deferred-mount queue.
