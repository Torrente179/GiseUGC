# 2026-03-05 - Premium Motion & Mobile Polish

## Summary
Refactored the site motion system toward a more restrained, product-grade feel: cinematic only where it adds value, quieter everywhere else, and materially simpler on mobile.

## Changes Made
1. Shared motion policy
- Added a shared motion profile contract in `src/components/motion/profile.ts`.
- Added a non-Framer reduced-motion hook in `src/hooks/use-prefers-reduced-motion.ts`.
- Routed hero, navbar, dock, portfolio, marquee, and section components through the shared motion policy.

2. Above-the-fold simplification
- Reworked `Hero.tsx` to be static-first, CSS-driven, and desktop-cinematic only.
- Removed Framer Motion from `Navbar.tsx` and simplified mobile menu transitions for immediate response.
- Shortened custom anchor scrolling and added cancellation on user input in `src/hooks/use-hashless-section-navigation.ts`.

3. Below-the-fold restraint
- Reduced section motion density in `Services.tsx`, `SocialProof.tsx`, `FAQ.tsx`, `Footer.tsx`, `HeroIntroduction.tsx`, and `Testimonials.tsx`.
- Kept the testimonial carousel spring movement while removing surrounding motion choreography.
- Simplified the floating dock to a utility surface with no delayed entrance or breathing animation.

4. Mobile interaction cleanup
- Reduced deferred mounting in `src/pages/Index.tsx` so only heavy sections stay staged.
- Removed mobile auto-scroll from `ServicesMarquee.tsx` and trimmed hover-era theatrics.
- Simplified `Portfolio.tsx` theater behavior so mobile keeps vertical next/previous plus explicit close, with no swipe-to-dismiss.
- Tightened mobile video warmup behavior and added stable test selectors for key interactions.

5. Verification and smoke coverage
- Added Playwright smoke coverage via `playwright.config.ts` and `tests/smoke.spec.ts`.
- Added `test:smoke` script to `package.json`.
- Fixed existing lint errors in `src/components/ui/command.tsx` and `src/components/ui/textarea.tsx` that blocked a clean lint pass.

## Validation
- `npm run lint`
- `npm run build`
- `npm run test:smoke`
- `npm run check:mobile-regression`
