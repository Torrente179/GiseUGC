# Smooth Navigation & Scroll Restoration

**Date:** 2026-03-22

## Problems fixed

### 1. Scroll always jumped to top on every navigation

**Root cause:** `App.tsx` called `window.scrollTo({ top: 0 })` unconditionally on every route change, wiping out any scroll position regardless of how the user navigated.

**Fix:** Replaced with smart, navigation-type-aware scroll logic:
- **Browser back/forward (POP):** restores the exact saved scroll position using a module-level `Map<string, number>` keyed by React Router's `location.key`. A passive scroll listener tracks `latestScrollY` in real time so the outgoing page's position is captured before the route changes.
- **New navigation with a hash (e.g. `/#services` from a service page):** jumps to top first, then calls `scrollToSection()` which finds the target element by ID and smooth-scrolls to it via Lenis on desktop or `window.scrollTo` on mobile. Retries up to 15 times at 80 ms intervals so it works even for lazily-mounted sections.
- **Normal new navigation:** scrolls to top as before, but now through `jumpToY()` which uses Lenis's `immediate: true` option on desktop for an instant, glitch-free jump.

### 2. Hash navigation broken when coming from a service page

**Root cause:** Clicking "Services" (or any section link) in the navbar from a service page called `navigate("/#services")`. The old code then ran `window.scrollTo(top: 0)` and `clearUrlHash()`, discarding the hash entirely. The user always landed at the top of the homepage.

**Fix:** The new App.tsx checks `location.hash` (from React Router's location state, which is unaffected by `history.replaceState`) before deciding what to do. When a hash is present, it defers to `scrollToSection()` which locates the section element and smoothly scrolls there, then clears the hash from the URL cleanly.

### 3. Sections re-rendered as skeletons when returning to the homepage

**Root cause:** `useDeferredMount` used local React state (`useState(false)`). Every time `Index` unmounted (user navigated to a service page) and remounted (user came back), every deferred section reset to `shouldMount = false`, triggering the skeleton → lazy-load → fade-in cycle all over again.

**Fix:** Added a module-level `persistedMountedSections: Set<string>` that survives component unmount/remount. `useState` is now lazily initialised from this set:
```ts
useState(() => persistedMountedSections.has(mountId))
```
When a section first mounts, its `mountId` is added to the set. On all subsequent visits to the homepage, every section that was already shown initialises with `shouldMount = true` and renders immediately — no skeletons, no re-render cascade.

### 4. Instant page swaps with no transition

**Fix:** Wrapped `<Routes>` in Framer Motion's `<AnimatePresence mode="wait">` with a `motion.div` keyed by `location.pathname`. Pages fade out in 0.1 s and fade in in 0.2 s, replacing the hard cut with a subtle crossfade that makes transitions feel intentional rather than janky.

## Files changed

- `src/App.tsx` — scroll position tracking, `useNavigationType`, `jumpToY`, `scrollToSection` (with Lenis integration + retry logic), `AnimatePresence` page transitions
- `src/hooks/use-deferred-mount.tsx` — `persistedMountedSections` module-level cache, lazy `useState` initialiser
