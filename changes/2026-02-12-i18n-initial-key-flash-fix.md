# 2026-02-12 - i18n Initial Key Flash Fix

## Summary
Resolved the transient flash of raw translation keys (e.g., `hero.proofLabel`, `portfolio.sectionTitle`) that appeared on initial page load in some browsers before locale resources finished loading.

## Root Cause
- The React app mounted before i18next completed async initialization and HTTP translation fetches.
- During that short window, `t(...)` returned key strings, causing visible placeholder text.
- Locale variants like `en-US` could trigger extra resolution overhead when only `en`/`es` translation files exist.

## Changes Made
1. Deferred app mount until i18n init resolves
- Exported `i18nInitPromise` from `src/i18n.ts`.
- Updated `src/main.tsx` to render the app only after i18n initialization completes.
- Added a guarded fallback path to still render if init fails.

2. Improved language normalization
- Enabled `nonExplicitSupportedLngs: true`.
- Set `load: 'languageOnly'` so locales like `en-US` resolve to `en`.

3. Reduced noisy debug output
- Changed i18n debug behavior to be opt-in with `VITE_I18N_DEBUG=true` instead of always on in development.

## Files Updated
- `src/i18n.ts`
- `src/main.tsx`
- `changes/2026-02-12-i18n-initial-key-flash-fix.md`

## Validation
- `npm run build` passes successfully.
