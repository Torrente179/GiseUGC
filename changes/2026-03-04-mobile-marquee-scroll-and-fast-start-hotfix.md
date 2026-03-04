# 2026-03-04 - Mobile Marquee Scroll + Fast Start Hotfix

## Summary
Fixed two mobile regressions in the Services marquee:
1. Touch interactions could trigger unintended card toggles while trying to scroll/drag.
2. Loop previews could take multiple seconds to begin.

This pass focuses on responsiveness and startup smoothness without changing visual style, content, or media quality.

## Changes Made

### 1) Touch gesture reliability on mobile (`ServicesMarquee.tsx`)
- Added early gesture slop detection so movement marks the interaction as dragged sooner.
- Added horizontal-axis bias to reduce false horizontal locks when intent is vertical page scrolling.
- Marked vertical intent paths as dragged so click/tap toggle does not fire after a scroll gesture.
- Preserved horizontal drag behavior for marquee interaction.

### 2) Faster preview startup (`ServicesMarquee.tsx`)
- Added priority prewarm behavior for the initially visible middle-set cards:
  - `loadWhenVisible={false}`
  - `preload="metadata"`
  - larger `rootMargin` for earlier fetch
- Kept non-priority cards deferred to avoid unnecessary network/decode pressure.

### 3) Earlier Services mount on mobile (`Index.tsx`)
- Increased mobile Services marquee deferred-mount `rootMargin` and reduced queue delay to start mounting sooner before the section enters view.

## Files Updated
- `src/components/ServicesMarquee.tsx`
- `src/pages/Index.tsx`
- `changes/2026-03-04-mobile-marquee-scroll-and-fast-start-hotfix.md`

## Validation
- `npx eslint src/components/ServicesMarquee.tsx src/pages/Index.tsx`
- `npx vite build`
