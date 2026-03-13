## Summary
- Fixed a production runtime crash caused by `Navbar.tsx` referencing `i18n.resolvedLanguage` without an `i18n` binding.
- Restored the missing `i18n` object by destructuring it from `useTranslation()`.

## Impact
- React can mount again on the public homepage and English page.
- The static SEO shell remains in place, but the interactive app no longer fails before hydration.

## Verification
- `npm run build`
- Headless browser check against production confirms the previous `ReferenceError: i18n is not defined` is resolved after deploy.
