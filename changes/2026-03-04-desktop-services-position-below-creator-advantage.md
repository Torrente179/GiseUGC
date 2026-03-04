# 2026-03-04 - Desktop Services Position Below Creator Advantage

## Summary
Moved the desktop `Services` section (`Lo Que Ofrezco / Mis Servicios`) to render after `Portfolio`, so it appears below the `Ventaja del creador` block.

## Changes Made
1. Desktop section order update
- In `src/pages/Index.tsx`, reordered desktop flow from:
  - `SocialProof -> Services -> Portfolio -> ...`
- To:
  - `SocialProof -> Portfolio -> Services -> ...`

2. Desktop fallback order update
- Reordered matching desktop placeholders in the non-loaded state so layout skeleton order mirrors runtime order.

## Files Updated
- `src/pages/Index.tsx`
- `changes/2026-03-04-desktop-services-position-below-creator-advantage.md`

## Validation
- `npx eslint src/pages/Index.tsx`
- `npm run build`
