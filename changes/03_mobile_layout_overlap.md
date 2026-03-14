# Mobile Hero & Navbar Layout Fixes
- **Date**: 2026-03-14
- **Files modified**: `src/components/Hero.tsx`, `src/components/Navbar.tsx`
- **Issue**: On mobile devices, the cinematic hero content was too tall for a strict `100svh` container, causing the massive text, subtitle, buttons, and floating glass card to overlap each other. Furthermore, the top Navbar had a frosted background on load that abruptly cut into the cinematic background image.
- **Fix**: 
  - Substituted the fixed `h-[100svh]` wrapper with `min-h-[100svh]`, allowing mobile viewports to gracefully adapt and space out overlapping content if needed.
  - Reduced responsive spacing constraints (`gap` and `padding` values in the bottom container) when on screens smaller than `lg`.
  - Updated the default unscrolled state of the `Navbar` to be completely transparent without a frosted backdrop (`bg-transparent shadow-none`), ensuring a seamless architectural layout integration.
