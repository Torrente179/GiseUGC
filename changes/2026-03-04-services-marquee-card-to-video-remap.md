# 2026-03-04 - Services Marquee Card-to-Video Remap

## Summary
Remapped specific Services marquee cards to the exact videos requested after transcript/content review, while keeping safe fallbacks to legacy assets.

## Requested Mappings Applied
1. `Producción Local + Global desde Medellín` (`card12`)
- Video: `Demo Voicebot para Automotriz` (`IMG_5793`)

2. `Demo y How-to de Producto` (`card5`)
- Video: `Reseña Voice over bots` (`ugc-voiceover-bots-review`)

3. `UGC para SaaS, AI y Tech` (`card9`)
- Video: `WhatsApp Bot para Ventas 24/7` (`IMG_8435`)

4. `Social Media Videos (Reels/TikTok)` (`card7`)
- Video: `Voicebot que Cierra Ventas` (`WhatsApp Video 2026-02-13 at 00.39.53`)

## Implementation Details
- Updated file: `src/components/ServicesMarquee.tsx`
- Added lookup helper using `NUEVOS_R2_READY_CLIPS` by main filename to avoid URL encoding/extension mismatch issues with spaces and `.MOV` sources.
- Kept fallback preview/poster assignment for each remapped card in case an expected clip is unavailable.

## Validation
- `npx eslint src/components/ServicesMarquee.tsx` passes.
