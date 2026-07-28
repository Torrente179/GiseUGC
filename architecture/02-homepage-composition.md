# Homepage Composition

## Owner
`src/pages/Index.tsx` owns the homepage render order and performance policy.

## Render Order
1. `PageSeo`
2. `Navbar`
3. `Hero`
4. Mobile: `HeroIntroduction`; desktop: `SocialProof`
5. Deferred portfolio
6. Services
7. Creator advantage
8. Optional Fiverr rating sections, currently disabled by `SHOW_FIVERR_RATING = false`
9. Testimonials
10. Mobile contact CTA
11. FAQ
12. Services marquee
13. `SiteFooter`
14. Lazy `FloatingContactDock`

## Deferred Sections
`DeferredSection` wraps lazy sections with `useDeferredMount`. The hook uses IntersectionObserver and a queue delay so expensive sections do not all hydrate at once. It also remembers mounted sections for the browser session, so returning to the page avoids repeating skeleton states.

## Mobile/Desktop Divergence
The homepage intentionally changes ordering by viewport. Mobile moves portfolio higher and defers costly sections with larger margins. Desktop keeps the hero introduction and social proof in a more editorial order.

## Contact Flow
On desktop, contact CTAs use hashless smooth section navigation. On mobile, the hero contact CTA can open or toggle the floating contact dock through the custom event bus in `src/lib/contact-dock.ts`.
