# Service Pages Toolkit Marquee

## Summary
Tracks the rollout of the homepage `El toolkit completo para anunciantes modernos` marquee onto every dedicated service page, preserving the same post-FAQ placement logic on both mobile and desktop.

## Runtime touchpoints
- `src/components/ServiceLandingPage.tsx`

## 2026-03-20 homepage toolkit rollout on service pages

### What changed
1. Added the shared `ServicesMarquee` component to the mobile service-page flow immediately after the accordion/info block that contains the service FAQ.
2. Added the same shared `ServicesMarquee` component to the desktop service-page flow immediately after the FAQ section and before the closing CTA/related-services block.
3. Kept the implementation shared and lazy-loaded so all dedicated service routes inherit the homepage section without duplicating markup or drift between pages.

### Verification
1. `npm run build`

### SEO impact
- No route, metadata, schema, canonical, or localized service-copy changes.
- The change is a UI composition update inside the shared React service-page template.
