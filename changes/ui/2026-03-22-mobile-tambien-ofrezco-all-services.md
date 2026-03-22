# All services listed in "También ofrezco" and footer

## Direction
The mobile "También ofrezco" section on service pages previously showed only 2 related services. The footer (desktop and mobile) listed only 3 services. User requested both list **all** services the website offers, matching the app-like mobile design language.

## Runtime touchpoints
- `src/data/service-pages.ts`
- `src/components/ServiceLandingPage.tsx`
- `src/components/Footer.tsx`
- `src/locales/es/translation.json`
- `src/locales/en/translation.json`
- `src/index.css`

## What changed

### Service page "También ofrezco" (mobile)
1. Added `getAllServiceIds()` export to `service-pages.ts` — returns every `ServicePageId` from the content map.
2. Replaced the mobile M4 horizontal pill strip (`stm-related-strip` + `stm-related-pill`) with a vertical full-width list of all services except the current page. Each row shows the service `navLabel` and a `→` arrow.
3. Added `.stm-all-services`, `.stm-service-row`, `.stm-service-label`, `.stm-service-arrow` CSS classes following the existing `.stm-*` prefix convention.
4. Desktop "También ofrezco" remains unchanged — still shows only the 2 `relatedServiceIds` inside the dark closer section.

### Footer (desktop + mobile)
1. Expanded `servicePageIds` array in `Footer.tsx` from 3 to all 8 service page IDs.
2. Added the 5 missing `footer.services.*` i18n keys in both `es/translation.json` and `en/translation.json`.
3. Desktop footer services nav column now shows all 8 links.
4. Mobile footer uses the existing `.ftm-service-link` row-with-arrow pattern — now lists all 8.

## CSS classes added
- `.stm-all-services` — vertical flex container
- `.stm-service-row` — full-width row with top/bottom borders, flex space-between
- `.stm-service-label` — 15px medium-weight label
- `.stm-service-arrow` — subtle right arrow

## Verification
1. `npm run build` — passed, 0 errors
2. Visual verification at 375×812 on `/servicios/creadora-ugc-bilingue/` — 7 services listed (current excluded)
3. Confirmed on `/servicios/ugc-ads-tiktok-meta/` — correct 7 services listed (current excluded)
4. Footer verified on homepage — all 8 services in both desktop and mobile render paths
