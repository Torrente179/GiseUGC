# Homepage Composition

## Owner

`src/pages/Index.tsx` owns the homepage render order and performance policy.

## Render Order

1. `PageSeo`
2. `Navbar`
3. `ScrollProgressHairline`
4. `Hero` — editorial title sequence
5. `ManifestoChapter`
6. Deferred `Portfolio`
7. `Services`
8. `CreatorAdvantage`
9. Deferred `Testimonials`
10. `FAQ`
11. Deferred `ServicesMarquee`
12. `SiteFooter`
13. `FloatingContactDock`

## Deferred Sections

`DeferredSection` wraps lazy sections with `useDeferredMount`. The hook uses IntersectionObserver and a queue delay so expensive sections do not all hydrate at once. It also remembers mounted sections for the browser session, so returning to the page avoids repeating skeleton states.

Portfolio, testimonials, and the services marquee own separate JavaScript chunks.
Services, creator advantage, FAQ, and the footer remain complete in the
prerendered document.

## Responsive Behavior

The section narrative is shared across breakpoints. Individual sections may use
stable mobile and desktop shells selected by CSS or a hydrated viewport hook,
but the prerendered top-level sequence does not reorder itself after load.

The hero shows three optimized poster frames immediately. Only the lead frame
may become video, and only after genuine user intent and reduced-motion checks.

## Contact Flow

On desktop, contact CTAs use hashless smooth section navigation. On mobile, the hero contact CTA can open or toggle the floating contact dock through the custom event bus in `src/lib/contact-dock.ts`.
