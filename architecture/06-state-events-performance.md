# State Events Performance

## Local State
Most UI state stays inside components:
- `Navbar`: mobile menu open, swipe dismissal, scroll state
- `Portfolio`: active reel, theater state, drag/swipe state, prewarm state
- page factories: active proof clip index, viewport state, theater state
- `Contact`: form state, validation errors, cooldown timer

## Cross-Component Event Bus
`src/lib/contact-dock.ts` is a small DOM event bus. It dispatches `ugc:contact-dock-action`, stores a pending body attribute, and lets `FloatingContactDock` consume open/toggle actions even if the dock mounts after the action was requested.

## Hashless Navigation
`useHashlessSectionNavigation` intercepts in-page anchor clicks, smooth-scrolls with a JS easing curve, then strips the URL hash with `history.replaceState`. This keeps home sections navigable without leaving hash fragments behind.

## Deferred Mounting
`useDeferredMount` uses IntersectionObserver, a global queue slot, and React `startTransition` to stage expensive lazy sections. It persists mounted section ids in a module-level Set for smoother returns.

## Performance Debugging
`src/lib/perf-debug.ts` provides marks, measurements, long task observation, mobile media pressure snapshots, and optional debug behavior. `App.tsx` starts the mobile media pressure observer globally.
