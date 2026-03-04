# 2026-03-04 - Footer ES Subtitle Restore

## Summary
Restored the Spanish footer subtitle to the CTA copy so the footer heading and subtitle are no longer duplicated.

## Changes Made
1. Spanish footer subtitle copy
- Kept `footer.brandName` as `Tu próxima campaña empieza aquí`.
- Updated `footer.description` to `Contáctame ahora para empezar tu próxima campaña.` in both locale files used by source and runtime bundles.

## Files Updated
- `src/locales/es/translation.json`
- `public/locales/es/translation.json`
- `changes/2026-03-04-footer-es-subtitle-restore.md`

## Validation
- Parsed both updated JSON locale files successfully.
