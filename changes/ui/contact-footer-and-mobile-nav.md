# Contact, Footer, and Mobile Nav Iteration

## Summary
This consolidates the February work on contact entry points, footer structure, and mobile navigation behavior. Those notes all converged on the current contact system: app-first deep links, a persistent floating dock, real social/profile wiring, simplified footer layout, and clearer mobile menu interactions.

## Current runtime touchpoints
- `src/components/FloatingContactDock.tsx`
- `src/components/Navbar.tsx`
- `src/components/Footer.tsx`
- `src/components/Contact.tsx`
- `src/index.css`
- `public/uploads/whatsapp.png`
- `public/uploads/TikTok-Icon-Logo.wine.svg`
- `public/uploads/fiverr-logo-56.webp`
- `src/locales/es/translation.json`
- `src/locales/en/translation.json`

## Consolidated outcomes
1. The social/contact stack was standardized around real profile URLs, WhatsApp and Telegram deep links, TikTok asset cleanup, and a usable Fiverr destination.
2. The floating dock iterated through visibility, contrast, liquid-glass styling, swipe-up close behavior, and menu-aware hiding until it reached the current persistent mobile pattern.
3. Footer work removed the contact form, redistributed contact content, restored missing icons, corrected dark-theme contrast, and stabilized breakpoint-specific placement of social actions.
4. Desktop and mobile contact affordances were aligned so the same services feel reachable from navbar, dock, and footer without duplicating incompatible behaviors.

## Notes on superseded details
- These notes were mostly UI polish on the same components, so keeping them separate no longer added historical value.
- Later CTA and rating placement changes are tracked in `changes/ui/homepage-ux-conversion-and-motion.md`.

## Legacy notes absorbed
- `2026-02-12-contact-bubbles-swap-x-for-tiktok.md`
- `2026-02-12-fiverr-profile-link-and-mobile-footer-social-placement.md`
- `2026-02-12-footer-distribution-fiverr-ratings.md`
- `2026-02-12-mobile-contact-toggle-persistence-and-contrast.md`
- `2026-02-12-mobile-contact-toggle-threads-and-x.md`
- `2026-02-12-mobile-deep-links-app-first.md`
- `2026-02-12-mobile-dock-hide-only-when-menu-open.md`
- `2026-02-12-mobile-footer-icons-outside-fiverr-card.md`
- `2026-02-12-mobile-hamburger-contact-bubbles.md`
- `2026-02-12-mobile-toggle-visibility-pop.md`
- `2026-02-12-remove-contact-form-and-footer-simplification.md`
- `2026-02-12-social-bubbles-expansion-and-fiverr-png.md`
- `2026-02-12-tiktok-svg-icon-and-label-confirmation.md`
- `2026-02-12-toggle-icon-restore-and-desktop-liquid-glass.md`
- `2026-02-12-whatsapp-png-and-liquid-glass-refinement.md`
- `2026-02-17-floating-dock-bottom-fade-and-mobile-footer-icon-sizing.md`
- `2026-02-17-footer-add-missing-contact-icons.md`
- `2026-02-17-footer-social-placement-and-fiverr-cta-hide.md`
- `2026-02-17-mobile-hamburger-swipe-up-close.md`
- `2026-02-18-footer-dark-contrast-fix.md`

## 2026-03-17 premium footer simplification

### Runtime touchpoints in this pass
- `src/components/Footer.tsx`
- `src/components/Contact.tsx`
- `src/components/Services.tsx`
- `tmp/mobile-regression/latest.md`
- `src/locales/es/translation.json`
- `src/locales/en/translation.json`
- `public/locales/es/translation.json`
- `public/locales/en/translation.json`

### What changed
1. The footer was reduced from an oversized editorial block into a restrained closing section: brand mark, short headline, one supporting line, WhatsApp primary CTA, Fiverr secondary CTA, service links, and the final trust/copyright row.
2. Mobile behavior became the deciding constraint instead of an afterthought. CTA buttons now read as full-width actions, the headline measure is tighter but not excessively tall, and the small-screen layout no longer feels like a second landing-page hero.
3. Visual noise was intentionally removed. The proof chips, extra studio/profile columns, Telegram line, and the wider social cluster were cut because they diluted the premium feel instead of strengthening it.
4. Footer copy in both languages was shortened so the component closes the page with confidence rather than repeating the sales pitch already handled higher in the page.
5. A follow-up mobile correction tightened the footer further after live review: the headline was shortened again, mobile font sizes and paddings were reduced, CTA labels were simplified, and the service links were converted from a tall stacked list into a denser wrapped utility row.
6. The nearby contact and service-card headings were aligned to the serif display system so these conversion touchpoints feel consistent with the premium typography direction used across the homepage.

### SEO guardrail
1. The footer keeps `id="contact"` so existing page anchors and contact-entry behavior remain intact.
2. The three localized service links remain plain crawlable anchors, preserving the footer’s role in internal linking and localized service discoverability.
3. This pass did not change metadata, structured data, canonicals, hreflang, robots, sitemap, or the homepage/service-page SEO architecture documented in the SEO change logs.

### Verification
1. `npx eslint src/components/Footer.tsx`
2. `npm run build`
3. `npm run check:mobile-regression`

## Mobile Regression Checklist

Generated at: `2026-03-17T14:04:56.767Z`

### Automated checks
- ✅ Targeted lint
- ✅ Production build

### Manual device checks (iPhone Safari)
- [ ] Horizontal drag moves carousel left/right without jumping back to start.
- [ ] Vertical page scroll works naturally when swiping over carousel area.
- [ ] Tapping a card pauses/expands that card without resetting track position.
- [ ] Tapping outside card closes expanded state and auto-scroll resumes smoothly.
- [ ] Offscreen -> back onscreen transition resumes movement without visible snap.

### Notes
- Device/OS:
- Browser version:
- Repro video/screenshot path (if any):
- Additional observations:
