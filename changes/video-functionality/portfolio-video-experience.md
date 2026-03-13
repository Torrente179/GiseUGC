# Portfolio and Video Experience

## Summary
This condenses the portfolio, theater, and playback work that led into the current R2-backed video system. The period covered reel-card cleanup, theater redesign, mobile swipe/navigation behavior, performance tuning, prewarm strategy, R2 routing, and the first version of the encoding workflow.

## Current runtime touchpoints
- `src/components/Portfolio.tsx`
- `src/components/ServicesMarquee.tsx`
- `src/components/media/LazyVideo.tsx`
- `src/data/portfolio-clips.ts`
- `src/index.css`
- `scripts/encode-videos.sh`
- `changes/video-functionality/video-encoding-tracking-setup-guide.md`

## Consolidated outcomes
1. The portfolio moved from popup-style experiments and mixed reel treatments into the current theater/reel structure with a dedicated full-library experience.
2. Mobile theater behavior was heavily tuned: swipe physics, vertical navigation, side-arrow behavior, scroll lock, fast-start preload, and scroll-jump cleanup all landed here.
3. The playback pipeline was stabilized around preview loops for cards and higher-quality theater playback, with explicit fixes for playback speed drift and reel-card readability.
4. R2 adoption started here, including the `/videos/` path normalization, preview/main/mobile/poster separation, and the first encoding instructions that the guide now preserves.
5. Prewarm logic went through several same-day experiments before settling on the final main-first theater policy, viewport-gated startup warming, and aggressive intent-based preloading captured by the current runtime code.

## Notes on superseded details
- The interim mobile-first source policy notes were superseded by the later main-first policy that current runtime code uses.
- Older path examples that predated the `/videos/` prefix are historical only.
- Later catalog-generation and transcript-title work is tracked in `changes/video-functionality/video-catalog-and-transcript-seo.md`.

## Legacy notes absorbed
- `2026-02-11-carousel-motion-and-video-popups.md`
- `2026-02-11-fixed-reel-and-full-bleed-toolkit-restoration.md`
- `2026-02-11-mobile-theater-redesign-and-swipe-physics.md`
- `2026-02-11-remove-portfolio-image-grid.md`
- `2026-02-11-theater-side-arrows-scroll-lock.md`
- `2026-02-11-ugc-fullwidth-video-sync.md`
- `2026-02-12-collage-clothing-gifs-liquid-glass.md`
- `2026-02-12-portfolio-real-videos.md`
- `2026-02-12-portfolio-reel-card-text-readability.md`
- `2026-02-12-portfolio-reel-ios-smooth-scroll.md`
- `2026-02-12-video-quality-theater-fixes.md`
- `2026-02-15-mobile-video-performance-optimization.md`
- `2026-02-17-mobile-reel-fast-path-optimization.md`
- `2026-02-17-mobile-reel-instant-switch-prebuffer.md`
- `2026-02-17-mobile-theater-source-priority-switch.md`
- `2026-02-17-mobile-theater-vertical-navigation.md`
- `2026-02-17-mobile-video-smoothness-hotfix.md`
- `2026-02-17-mobile-video-smoothness-pass.md`
- `2026-02-17-r2-video-routing-previews-main-posters.md`
- `2026-02-17-r2-videos-prefix-hotfix.md`
- `2026-02-17-theater-instant-swipe-preload-and-hint-removal.md`
- `2026-02-17-theater-main-mobile-fallback-and-fast-start.md`
- `2026-02-17-theater-snappy-preload-tuning.md`
- `2026-02-17-video-encoding-pipeline-for-r2.md`
- `2026-02-17-video-playback-speed-stability-fix.md`
- `2026-02-18-theater-close-scroll-jump-fix.md`
- `2026-02-19-blazing-fast-video-loading.md`
- `2026-02-19-mobile-theater-source-priority-fix.md`
- `2026-02-19-portfolio-prewarm-viewport-gating.md`
- `2026-02-19-theater-reel-skin-modernization.md`
