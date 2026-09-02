# Contact, Footer, and Mobile Nav Iteration

## Summary
This consolidates the February work on contact entry points, footer structure, and mobile navigation behavior. Those notes all converged on the current contact system: app-first deep links, a persistent floating dock, real social/profile wiring, simplified footer layout, and clearer mobile menu interactions.

## Current runtime touchpoints
- `src/components/SiteFooter.tsx`
- `src/components/PageEndStrip.tsx`
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
7. Another live mobile correction fixed the CTA icons: the oversized WhatsApp and Fiverr marks inside the buttons were replaced with clearer icon holders, the WhatsApp icon backing was strengthened for contrast against the blue CTA, and Telegram was promoted into a full-width tertiary button instead of a mismatched small chip.

### SEO guardrail
1. The footer keeps `id="contact"` so existing page anchors and contact-entry behavior remain intact.
2. The three localized service links remain plain crawlable anchors, preserving the footer’s role in internal linking and localized service discoverability.
3. This pass did not change metadata, structured data, canonicals, hreflang, robots, sitemap, or the homepage/service-page SEO architecture documented in the SEO change logs.

### Verification
1. `npx eslint src/components/Footer.tsx`
2. `npm run build`
3. `npm run check:mobile-regression`

## 2026-03-18 mobile theme toggle ghost-click hardening

### Runtime touchpoints in this pass
- `src/components/ThemeToggle.tsx`
- `src/components/Navbar.tsx`
- `tmp/mobile-regression/latest.md`

### What changed
1. The mobile theme toggle was hardened against Safari-style ghost clicks after refresh by moving touch activation onto `pointerdown`, preventing the follow-up synthetic click, and keeping desktop mouse/keyboard activation on the normal click path.
2. A short re-entry lock was added around the theme transition window so repeated touch/click events cannot flip the theme back and forth while the previous toggle is still settling.
3. The toggle now updates `color-scheme` and the `theme-color` meta tag immediately alongside the class flip so the browser chrome stays in sync during the transition instead of waiting for the next theme-provider repaint.

### Verification
1. `npx eslint src/components/ThemeToggle.tsx src/components/Navbar.tsx`
2. `npm run check:mobile-regression`

## 2026-03-20 "End Credits" footer redesign — dark, dual-path, CSS-only

### Runtime touchpoints in this pass
- `src/components/Footer.tsx`
- `src/index.css`

### Direction
Design name: "End Credits." Dark deep-ebony background — the footer is the final frame of the page, not a second hero. Two completely separate render paths: `hidden md:block` for desktop editorial grid, `md:hidden` for mobile app-like stack.

### What changed
1. Replaced the previous motion-heavy beige-card footer with a dark (`deep-ebony` bg) dual-path "End Credits" layout.
2. **Removed all Framer Motion** from the footer — no `motion.div`, `blurRevealUp`, `springSmooth`, `whileInView`, `whileHover`, `whileTap`. Pure CSS transitions only.
3. **Removed 3 Lucide icons** — `ArrowRight`, `ArrowUpRight`, `Send` no longer imported by Footer.
4. **Removed the beige card container** — no more `bg-[#F7F2E9]`, rounded card with shadow, backdrop-blur. Just dark bg with clean text.
5. **Collapsed 3 equally-weighted CTAs into 1** — single WhatsApp button. Fiverr/Telegram become quiet inline text links (mobile) or nav-column entries (desktop).
6. **Added Instagram, TikTok, LinkedIn** — previously only in FloatingContactDock, now also in the footer Connect column (desktop) and social pill row (mobile).

### Desktop layout (`hidden md:block`)
- 3-column grid: brand statement + CTA left (1.1fr), services middle (0.38fr), connect right (0.32fr)
- Bottom bar: location left, copyright right, separated by thin `pure-linen/0.08` border
- CSS classes: `.ft-desktop`, `.ft-container`, `.ft-grid`, `.ft-brand`, `.ft-statement`, `.ft-desc`, `.ft-cta`, `.ft-nav-col`, `.ft-nav-label`, `.ft-nav-link`, `.ft-bar`, `.ft-bar-text`

### Mobile layout (`md:hidden`)
- App-like stack: logo → serif statement → full-width WhatsApp CTA → Fiverr · Telegram secondary → service link rows with arrows → social pills (Instagram, TikTok, LinkedIn) → location + copyright
- CSS classes: `.ftm-mobile`, `.ftm-top`, `.ftm-statement`, `.ftm-cta`, `.ftm-secondary-links`, `.ftm-dot`, `.ftm-services`, `.ftm-service-link`, `.ftm-service-arrow`, `.ftm-social-row`, `.ftm-social-pill`, `.ftm-bottom`, `.ftm-bottom-text`, `.ftm-bottom-copyright`

### Shared classes
- `.ft-root`, `.ft-logo`, `.ft-logo-dot`

### SEO guardrail
1. The footer still owns `id="contact"` for in-page anchor behavior.
2. Service links remain plain crawlable anchors with the same locale-aware destinations.
3. H2 heading preserved for the footer statement text.
4. This pass did not change metadata, schema, canonicals, hreflang, robots, or sitemap behavior.

### Bundle impact
- Removed `framer-motion` and `lucide-react` imports from Footer → smaller chunk
- Footer no longer contributes to the Framer Motion dependency chain
- Added ~200 lines of `.ft-*` / `.ftm-*` CSS classes to `index.css`

### Verification
1. `npm run build` — passed, ✓ built in 4.12s, 0 errors
2. Visual verification at 375×812 (mobile) and 1440×900 (desktop) via Puppeteer
3. Homepage and service page footers confirmed rendering on both viewports

## Mobile Regression Checklist

Generated at: `2026-03-18T14:36:10.837Z`

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
- Additional observations: Theme toggle touch ghost-click mitigation shipped; direct iPhone Safari refresh verification still pending.

## 2026-03-23 legal links integrated into the footer meta rail

### Runtime touchpoints in this pass
- `src/components/Footer.tsx`
- `src/index.css`

### What changed
1. Reworked the desktop footer bottom row so the copyright line and legal links now read as one deliberate meta rail instead of three disconnected blocks.
2. Moved `Privacy Policy / Política de privacidad` and `Terms & Content Use / Términos y uso de contenido` directly beside the copyright line with tighter spacing, a subtle separator, and lighter uppercase styling.
3. Refined the mobile footer to keep the app-like architecture: the legal links now sit inside a compact pill-based legal card below the studio facts, closer to a mobile settings/legal module than a plain text row.
4. Left the route targets unchanged; this pass was only about footer placement, visual hierarchy, and making the legal links feel native to the closing UI.

### Verification
1. `npx eslint src/components/Footer.tsx`
2. `npm run build`

## 2026-06-03 temporary full footer gate + minimal page end strip

**Commits:** `7ba4e4a` (footer gate), `e5605a7` (page end strip + marquee label CSS)

### Problem
The full editorial footer was not ready to ship, but pages still needed a legal closing row and crawlable privacy/terms links after the toolkit marquee. Hiding the footer with `display: none` would remove those links from the DOM.

### What changed

#### `SiteFooter.tsx` (new wrapper)
1. `SHOW_SITE_FOOTER = false` — when false, render only `PageEndStrip`; when true, render full `Footer` (no strip). Used on homepage, service/vertical pages, legal, and resource routes via existing `SiteFooter` import sites.
2. Export `SHOW_SITE_FOOTER` so a single flag controls sitewide behavior.

#### `PageEndStrip.tsx` (new)
1. Minimal `role="contentinfo"` footer after main content: `GiselaSaldarriaga.com · {year}` plus a frosted pill rail for localized legal links (`getLegalPath` + `footer.privacyPolicy` / `footer.termsContentUse`).
2. Typography: `font-sans`, 10px meta line — intentionally not display serif.

#### Regression note: `#contact` anchor
1. Full `Footer.tsx` still owns `id="contact"` when `SHOW_SITE_FOOTER` is true.
2. While the flag is false, navbar hire CTA (`href="#contact"` / `navbar.hireMeCta`) may not scroll to a contact block until the full footer returns or `#contact` moves to another section.

### Files changed
- `src/components/SiteFooter.tsx`
- `src/components/PageEndStrip.tsx`
- `src/index.css` (`.page-end-strip`, `.page-end-legal-rail` if present)
- Page shells that import `SiteFooter` (unchanged import path)

### SEO guardrail
1. Legal links remain real `<Link>` routes in the DOM when the full footer is hidden.
2. No metadata, schema, or copy changes in this pass.

### Verification
1. `npm run build`
2. Confirm homepage ends with copyright + privacy/terms pills, not the large footer hero.
3. Before re-enabling full footer: restore or relocate `#contact` for navbar CTA behavior.

## 2026-09-02 service INNER hides the 4-icon tab bar

On service INNER pages only, `MobileAppShell` hides the global 4-icon tab bar because Pedir creativos is a full-bleed 0-radius slab. Home, vertical, and hub tab bars are unchanged. Source of truth for the inner: `changes/ui/service-page-showroom-redesign.md` (2026-09-02 document-mobile).
