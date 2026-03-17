# Hero Desktop Image Source Swap

- **Date**: 2026-03-17
- **Files modified**:
  - `src/components/Hero.tsx`
  - `public/uploads/gisela-hero-desktop-1600.webp`
  - `public/uploads/gisela-hero-desktop-2048.webp`
  - `public/uploads/gisela-hero-desktop-2048.jpg`
- **Issue**: The desktop hero was stretching a portrait-oriented source across large viewports, which forced an overly tight crop and made the image look zoomed in.
- **Fix**: Added optimized 16:9 desktop hero assets from the higher-resolution landscape photo and wired them into the hero `<picture>` with `media="(min-width: 1024px)"`, while keeping the existing portrait asset stack for smaller screens. Also corrected the fallback JPG path to an asset that actually exists.

## Mobile crop follow-up

- **Date**: 2026-03-17
- **Files modified**:
  - `src/components/Hero.tsx`
  - `public/uploads/gisela-hero-mobile-768.webp`
  - `public/uploads/gisela-hero-mobile-992.webp`
  - `public/uploads/gisela-hero-mobile-992.jpg`
- **Issue**: On small screens the hero still cropped too aggressively, shaving the top of the head and cutting too close to the left arm.
- **Fix**: Added a dedicated narrow mobile crop from the same high-resolution source and routed it through the hero `<picture>` only for screens below `768px`. The base mobile `object-position` was also shifted to `44% 0%` to keep a little more left-side room and top headroom across narrow devices.

## Mobile zoom-out refinement

- **Date**: 2026-03-17
- **Files modified**:
  - `public/uploads/gisela-hero-mobile-768.webp`
  - `public/uploads/gisela-hero-mobile-992.webp`
  - `public/uploads/gisela-hero-mobile-992.jpg`
- **Issue**: Mobile framing still felt too close to the face compared with desktop.
- **Fix**: Replaced the mobile assets with a wider crop from the same source image (kept the same file names and breakpoints) so the hero reads less zoomed-in on phones while preserving the current desktop framing logic.
