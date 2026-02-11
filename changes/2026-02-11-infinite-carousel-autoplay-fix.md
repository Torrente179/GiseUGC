# 2026-02-11 - Infinite Carousel Auto-Scroll Fix

## Summary
Rewrote the ServicesMarquee carousel behavior to match the intended UX: continuous auto-scroll that only pauses when a card is clicked (not on hover), infinite seamless looping in both directions, and proper video playback on desktop (hover) and mobile (click).

## Changes Made

### Auto-Scroll Behavior
1. **Removed hover-pause** — auto-scroll no longer stops when the mouse hovers over the carousel.
2. **Card-click pause only** — scrolling pauses exclusively when a card is clicked and its description text is expanded.
3. **Resume on dismiss** — clicking the same card again (toggle off) or clicking anywhere else on the page resumes auto-scrolling.
4. **Click-outside handler** — added document-level click listener that closes the expanded card when clicking outside any carousel card.

### Infinite Loop
5. **Seamless left-scroll wrapping** — added boundary detection at `scrollLeft < 10` (with buffer) so scrolling left past the first card wraps seamlessly to the cloned set.
6. **Bidirectional infinite** — the triple-duplicated card set now wraps correctly in both directions (right auto-scroll + left manual scroll).

### User Interaction
7. **Drag tracking** — added `mousedown`/`mouseup` and `touchstart`/`touchend` listeners to temporarily pause auto-scroll during active user dragging, preventing the auto-scroll from fighting user input.
8. **Auto-scroll resumes after drag** — once the user releases, auto-scroll picks back up automatically.
9. **Removed snap-x** — removed `snap-x snap-mandatory` and `snap-center` classes that conflicted with continuous auto-scroll.
10. **Drag cursor** — added `cursor-grab` / `active:cursor-grabbing` for visual affordance.

### Video Playback
11. **Desktop: hover plays** — unchanged, `onMouseEnter` triggers video playback.
12. **Mobile: click plays** — clicking a card now also triggers video playback (essential since mobile has no hover).
13. **Video persists while expanded** — `handleVideoLeave` skips stopping the video if the card is currently expanded.
14. **Clean switch** — switching between expanded cards stops the previous card's video before starting the new one.

## Technical Details
- Used `useRef` for `isPausedRef` and `isDraggingRef` to avoid re-creating the animation effect when state changes.
- Separate `useEffect` syncs `isPausedRef` with `expandedCard` state.
- Click-outside handler uses `setTimeout(0)` to avoid catching the originating click event.
- Event listeners on `window` for mouseup/touchend to catch releases outside the container.

## Files Updated
- `src/components/ServicesMarquee.tsx`
- `changes/2026-02-11-infinite-carousel-autoplay-fix.md`
