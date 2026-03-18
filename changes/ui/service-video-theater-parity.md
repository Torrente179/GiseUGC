## 2026-03-18 service-page video behavior parity with portfolio

### Runtime touchpoints
- `src/components/ServiceLandingPage.tsx`
- `src/components/media/TheaterVideo.tsx`

### What changed
1. Replaced service-page proof/featured video links that opened `clip.mainSrc` in a new tab with in-page click handlers.
2. Added a theater modal to service pages with the same interaction model as portfolio:
   - open selected clip
   - close with backdrop, close button, or `Escape`
   - navigate clips with arrows and keyboard left/right
   - lock page scroll while the theater is open
3. Added reusable `TheaterVideo` component:
   - autoplay retry + source fallback
   - startup fallback timer support
   - play/pause and mute controls
4. For service-page playback source selection, prioritized:
   - mobile viewport: `mobileSrc -> mainSrc -> previewSrc`
   - desktop viewport: `mainSrc -> mobileSrc -> previewSrc`

### Verification
1. `npx eslint src/components/ServiceLandingPage.tsx src/components/media/TheaterVideo.tsx`
2. `npm run build`

### SEO impact
- Interaction-only UI behavior update.
- No metadata, schema, canonical routes, or page copy changes.
