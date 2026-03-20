# Toolkit Marquee End Placement Sitewide

## Summary
Tracks the follow-up placement correction that makes the `El toolkit completo para anunciantes modernos` marquee the last content section before the footer across the homepage and dedicated service pages.

## Runtime touchpoints
- `src/pages/Index.tsx`
- `src/components/ServiceLandingPage.tsx`

## 2026-03-20 sitewide footer-adjacent placement pass

### What changed
1. Re-enabled the shared `Footer` mount on the homepage and on the shared service-page template, replacing the temporary hidden `#contact` anchor placeholder so the real footer owns the contact anchor again.
2. Kept the homepage marquee as the final content section and mounted `Footer` directly after it.
3. Moved the dedicated service-page marquee from the post-FAQ position to the actual page ending, after CTA/related-service content on both mobile and desktop, so it now sits immediately above the footer.

### Verification
1. `npx tsc --noEmit`
2. `npx eslint src/pages/Index.tsx src/components/ServiceLandingPage.tsx`

### SEO impact
- No route, metadata, schema, canonical, or localized copy changes.
- The adjustment is limited to layout composition and footer placement in the shared React templates.
