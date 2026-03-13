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
