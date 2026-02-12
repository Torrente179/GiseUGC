# 2026-02-12 - Title Reveal Reliability + Motion Polish

## Summary
Fixed intermittent missing animated titles and polished motion behavior for more stable, smoother sitewide interactions.

## Changes Made
1. Hardened split-title animation rendering
- Refactored `SplitTextReveal` to inherit animation state from parent motion containers instead of relying on an internal `whileInView` observer.
- This prevents edge cases where title words could remain hidden when viewport intersection timing failed.
- Added safer text normalization handling to avoid rendering issues from non-string values.

2. Kept section reveal behavior while improving reliability
- Updated title usage in Hero, Services, Portfolio, and Testimonials to use the new split-text API.
- Parent section motion wrappers now drive reveal timing consistently.

3. Motion consistency and accessibility polish
- Added app-level `MotionConfig` with `reducedMotion="user"` so reduced-motion preferences are respected globally.

4. Runtime smoothness cleanup
- Reworked static portfolio clip arrays to module-level constants, reducing per-render allocations and removing callback dependency instability.
- Replaced ambiguous Tailwind easing utility in collage cards with explicit `transitionTimingFunction` style to avoid build ambiguity and keep transitions consistent.

## Files Updated
- `src/App.tsx`
- `src/components/motion/SplitTextReveal.tsx`
- `src/components/Hero.tsx`
- `src/components/Services.tsx`
- `src/components/Portfolio.tsx`
- `src/components/Testimonials.tsx`
- `changes/2026-02-12-title-reveal-reliability-and-motion-polish.md`

## Validation
- `npm run build` passes successfully.
- `npm run lint` still reports pre-existing unrelated issues in shared UI files (`command.tsx`, `textarea.tsx`, and fast-refresh warnings).
