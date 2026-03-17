# Hero Phone Frame, Video Cycling & Mobile Reel Strip
- **Date**: 2026-03-17
- **Files modified**: `src/components/Hero.tsx`, `src/index.css`

## Summary
Reworked the hero section to showcase UGC video work more prominently on desktop and improve the mobile hero experience. Multiple iterations on mobile led to a horizontal poster strip; desktop got a large phone frame with auto-cycling videos.

## Desktop changes

### Phone frame with auto-cycling videos
- Added a phone-frame mockup on the right side of the hero (desktop only, `hidden lg:flex`)
- Frame size iterated from 200x356 → 280x498 → **364x647px** (current), with proportional notch and border radius
- All 10 `LEGACY_REEL_CLIPS` from `portfolio-clips.ts` cycle automatically every 3 seconds
- Transition changed from fast vertical TikTok-style slide (caused anxiety) to **calm 1.2s crossfade** (`opacity` only, `easeInOut`)
- Next video preloaded via hidden `<video>` element for smooth transitions
- Clip counter overlay (e.g. "3/10") in top-right corner
- "UGC Reel" play indicator in bottom-left
- Phone frame is clickable — links to `#portfolio` section
- Phone nudged slightly right with negative margin (`lg:-mr-4 xl:-mr-8`)

### Phone frame CSS (index.css)
- `.hero-phone-frame`: 364x647px, 44px border-radius, 3px white/15% border, coastal-teal glow shadow
- `.hero-phone-notch`: 100x26px centered notch
- `.hero-phone-video`: absolute positioned, object-fit cover

## Mobile changes

### Horizontal scrollable reel strip
- Replaced original glass panel (pills + proof metrics) with a swipeable row of 5 poster thumbnails
- Each thumbnail: 72x128px, rounded-xl, 9:16 ratio, play icon overlay
- "See all" card at the end with proof value (+28)
- Tapping any thumbnail scrolls to portfolio section
- Hidden scrollbar via `.scrollbar-hide` utility (added to `@layer utilities`)
- Uses poster images only — no video playback on mobile for bandwidth

### Description hidden on mobile
- Long description paragraph made `sr-only` on mobile (still in DOM for SEO crawlers)
- Divider line hidden on mobile (`hidden md:block`)
- Keeps the hero clean: just name + subtitle + CTAs + reel strip

## Layout adjustments

### Subtitle moved below title
- "UGC bilingüe, demos y videos de portavoz..." moved from above the h1 to below it

### Title size reduced
- h1 reduced ~20%: `14vw/5.5/7/8.5/9.5rem` → `12vw/4.5/5.5/6.5/7.5rem`

### Background image position
- `object-position` adjusted to `50% 8%` / `50% 12%` / `50% 16%` to keep face visible below navbar

### Parallax zoom reduced
- Initial scale changed from 1.05 → 1 (no zoom on load)
- Max scroll scale reduced from 1.15 → 1.05
- Parallax Y travel reduced from 20% → 12%
- Note: hero image max resolution is 1200px — a higher-res source (1920px+) would improve sharpness on large displays

## Iterations that were tried and removed
1. **Video background** — Used R2 preview clips as full-screen hero background. Vertical 9:16 stretched to horizontal looked terrible. Removed.
2. **Atmospheric orbs only** — Subtle CSS orbs at 0.18 opacity with slightly different buttons. Changes were imperceptible. Pivoted to phone-frame approach.
3. **Stacked video peek (mobile)** — 3 poster images fanned like a card deck with play overlay. Looked out of place on mobile. Removed.
4. **Auto-playing inline video reel (mobile)** — 140x248px rounded card with cycling preview videos. Looked like a weird floating element. Removed.
5. **Phone pushed far right** — `lg:-mr-12 xl:-mr-20` was too aggressive. Reverted to `lg:-mr-4 xl:-mr-8`.

## Current runtime touchpoints
- `src/components/Hero.tsx`
- `src/index.css` (phone frame styles + scrollbar-hide utility)
- `src/data/portfolio-clips.ts` (LEGACY_REEL_CLIPS used for cycling)
