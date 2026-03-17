# Hero Desktop Image Source Swap

- **Date**: 2026-03-17
- **Files modified**:
  - `src/components/Hero.tsx`
  - `public/uploads/gisela-hero-desktop-1600.webp`
  - `public/uploads/gisela-hero-desktop-2048.webp`
  - `public/uploads/gisela-hero-desktop-2048.jpg`
- **Issue**: The desktop hero was stretching a portrait-oriented source across large viewports, which forced an overly tight crop and made the image look zoomed in.
- **Fix**: Added optimized 16:9 desktop hero assets from the higher-resolution landscape photo and wired them into the hero `<picture>` with `media="(min-width: 1024px)"`, while keeping the existing portrait asset stack for smaller screens. Also corrected the fallback JPG path to an asset that actually exists.
