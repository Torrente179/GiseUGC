# Smooth Navigation & Scroll Restoration

**Date:** 2026-03-22

## Problems fixed

### 1. Scroll always jumped to top on every navigation

**Root cause:** `App.tsx` called `window.scrollTo({ top: 0 })` unconditionally on every route change, wiping out any scroll position regardless of how the user navigated.

**Fix:** Replaced with smart, navigation-type-aware scroll logic:
- **Browser back/forward (POP):** restores the exact saved scroll position using a module-level `Map<string, number>` keyed by React Router's `location.key`. A passive scroll listener tracks `latestScrollY` in real time so the outgoing page's position is captured before the route changes.
- **New navigation with a hash (e.g. `/#services` from a service page):** jumps to top first, then calls `scrollToSection()` which finds the target element by ID and smooth-scrolls to it via Lenis on desktop or `window.scrollTo` on mobile. Retries up to 15 times at 80 ms intervals so it works even for lazily-mounted sections.
- **Normal new navigation:** scrolls to top via Lenis `immediate: true` on desktop or `window.scrollTo` on mobile.

### 2. Hash navigation broken when coming from a service page

**Root cause:** Clicking any section link (e.g. "Services") in the navbar from a service page called `navigate("/#services")`. The old code then ran `window.scrollTo(top: 0)` and `clearUrlHash()`, discarding the hash entirely. Users always landed at the top of the homepage.

**Fix:** `App.tsx` reads `location.hash` from React Router's location state (unaffected by `history.replaceState` calls). When a hash is present, it defers to `scrollToSection()` which locates the section and smoothly scrolls there via Lenis, then clears the hash from the URL.

### 3. Homepage rebuilt from scratch on every return — the core performance issue

**Root cause (first pass):** `useDeferredMount` used `useState(false)` as local state. Every unmount/remount cycle reset all sections to skeleton state.

**Partial fix (first pass):** Added module-level `persistedMountedSections` Set. Sections that had been shown before initialised with `shouldMount = true` on remount.

**Root cause (deeper):** Even with the Set, the entire `Index` component tree still unmounted and remounted on every navigation. This reset all `useState` in every child component — Hero video restarted from frame 0, Framer Motion entrance animations re-triggered for every section, `useEffect` hooks ran again, scroll-reveal observers reset. The `AnimatePresence mode="wait"` added in the first pass made this *worse* by *guaranteeing* the old page fully unmounted before the new one mounted.

**Real fix:** `Index` is now kept mounted for the entire browser session and **never unmounts**. When the user navigates to a service page, `Index` is hidden with `display: none` (CSS) via a wrapper div in `App.tsx`. React state is fully preserved — video position, animation states, deferred section mounts, scroll offsets — so returning to the homepage is instant: no re-evaluation, no skeleton flash, no video restart, no animation replay.

```tsx
// Index is always in the tree; CSS controls visibility
<div style={{ display: onHome ? 'block' : 'none' }} aria-hidden={!onHome ? true : undefined}>
  <Index />
</div>
```

`AnimatePresence` was removed entirely since it caused forced unmounting.

### 4. Service pages appeared abruptly (no transition)

Without `AnimatePresence`, service pages mounted instantly with no visual transition. Added a lightweight CSS fade-in (`.page-enter`, 0.2 s, `ease-out-expo`) applied to the service page wrapper div in `App.tsx`. Reuses the existing `fade-in-mount` keyframe. Disabled under `prefers-reduced-motion`.

### 5. Manual route matching replaces `<Routes>/<Route>`

Since `Index` is always rendered regardless of route, the standard `<Routes>` component is no longer used. Route matching is now done with a simple `Array.find` against `serviceRouteEntries` using `normalizePathname`. This is simpler and removes the React Router overhead of re-evaluating the route tree on every navigation.

## Files changed

- `src/App.tsx` — full rewrite: keep-alive Index pattern, manual route matching, scroll position tracking, `jumpToY` / `scrollToSection` with Lenis integration, removed `AnimatePresence`/`motion`/`Routes`/`Route`
- `src/hooks/use-deferred-mount.tsx` — `persistedMountedSections` module-level cache, lazy `useState` initialiser
- `src/index.css` — `.page-enter` CSS animation for service page appearance
