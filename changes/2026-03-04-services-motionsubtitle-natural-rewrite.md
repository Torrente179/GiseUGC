# 2026-03-04 - Services motionSubtitle Natural Rewrite

## Summary
Replaced the geo-targeting keyword list in `services.motionSubtitle` with natural, benefit-driven bilingual copy. The original text listed geographic market priorities ("primero Estados Unidos, luego Canadá…") which read as an SEO checklist, not creator copy.

## Changes Made
- **ES**: `"Contenido bilingüe en español e inglés que combina autenticidad con estrategia de conversión — desde el guion hasta la entrega final."`
- **EN**: `"Bilingual content in Spanish and English that blends authenticity with conversion strategy — from script to final delivery."`

Geographic market data remains in JSON-LD schema, `llms.txt`, meta tags, and FAQ answers where it belongs for SEO/GEO/AEO purposes.

## Files Updated
- `public/locales/es/translation.json`
- `public/locales/en/translation.json`
- `src/locales/es/translation.json`
- `src/locales/en/translation.json`

## Validation
- `npm run build` completed successfully.
