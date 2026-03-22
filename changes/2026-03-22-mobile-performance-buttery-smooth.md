# Mobile Performance: Buttery-Smooth Service Cards & Navigation

**Date:** 2026-03-22

## Problems fixed

### 1. Last 4 service cards slow to appear on mobile

**Root cause:** The 8-card service grid used a single `whileInView` stagger container. On mobile (2 columns × 4 rows), the parent triggered all 8 card animations at once with cumulative stagger delays: card 5 started at 0.39s, card 8 at 0.66s, finishing at ~1.24s. By the time the user scrolled to the bottom rows, those cards were still invisible (opacity 0, blurred, translated).

**Fix:** On mobile, each service card now has its own `whileInView` viewport trigger instead of relying on the parent container stagger. Cards animate independently as each row scrolls into view — the moment a card enters the viewport, it reveals with a fast `blurRevealUp(10, 0.36)` (reduced from 18px/0.58s on desktop). Desktop retains the original stagger behavior unchanged.

```tsx
// Mobile: per-card viewport trigger
<MotionLink
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={blurRevealUp(10, 0.36)}
/>

// Desktop: parent stagger container (unchanged)
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.25 }}
  variants={staggerContainer(0.09, 0.03)}
>
```

### 2. Homepage freezes for several seconds when returning from a service page (mobile)

**Root cause:** `Index` component used `useLocation()` from React Router. Every SPA navigation (home → service → home) changed the location context, triggering a full re-render of the entire Index component tree — even though Index is kept alive via `display: none/block`. This caused all children (Framer Motion elements, deferred sections, lazy components) to reconcile, blocking the main thread on mobile for noticeable time.

**Fix:** Removed `useLocation()` from Index. The only value it provided — `locale` — is now computed in `App.tsx` and passed as a prop. Index is wrapped in `React.memo`, so it only re-renders when the locale actually changes (language switch), not on every navigation. This eliminates the entire re-render cascade during same-language navigation.

```tsx
// App.tsx — compute locale once, pass to Index
const locale = getLocaleFromPath(location.pathname);
<Index locale={locale} />

// Index.tsx — memoized, skips re-render when locale unchanged
const Index = memo(({ locale }: { locale: SiteLocale }) => {
  // ...
});
```

### 3. Service page theater plays lower-quality video on mobile vs homepage

**Root cause:** `ServiceLandingPage.tsx` theater source priority on mobile was `[mobileSrc, mainSrc, previewSrc]`, preferring the smaller mobile encode. Meanwhile, `Portfolio.tsx` (homepage) uses `[mainSrc, mobileSrc]` on mobile (`shouldPreferMobileTheaterSource = false`), giving the full-quality experience. This mismatch was documented in `changes/ui/service-video-theater-parity.md` but the source order was set to mobile-first during initial implementation.

**Fix:** Aligned service page theater source priority to match portfolio — now `[mainSrc, mobileSrc, previewSrc]` on mobile. Both pages serve the highest-quality video first.

```tsx
// Before: mobile got lower-quality mobileSrc first
? [clip.mobileSrc, clip.mainSrc, clip.previewSrc]

// After: mainSrc first on all viewports (matches portfolio)
? [clip.mainSrc, clip.mobileSrc, clip.previewSrc]
```

## Files changed

- `src/components/Services.tsx` — per-card `whileInView` on mobile with reduced animation intensity; desktop stagger unchanged
- `src/pages/Index.tsx` — `React.memo` wrapper, accepts `locale` prop, removed `useLocation()` dependency
- `src/App.tsx` — computes `locale` in render body, passes to `Index`
- `src/components/ServiceLandingPage.tsx` — theater source priority on mobile changed to `mainSrc` first, matching portfolio parity
