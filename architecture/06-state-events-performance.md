# State Events Performance

## Local State

Most UI state stays inside components:

- `Navbar`: mobile menu open, swipe dismissal, scroll state
- `Portfolio`: active reel, rail position, theater state, drag/swipe state, and
  intent prewarm
- page factories: selected proof clip, viewport shell, and shared theater state
- `Testimonials`/`ServicesMarquee`: visibility and active-card state

## Cross-Component Event Bus

`src/lib/contact-dock.ts` is a small DOM event bus. It dispatches `ugc:contact-dock-action`, stores a pending body attribute, and lets `FloatingContactDock` consume open/toggle actions even if the dock mounts after the action was requested.

## Global Media Coordination

`MediaSessionProvider` is the only global playback state. It tracks theater
ownership so ambient players detach while a theater is active.

`media-playback-scheduler.ts` is a small external registry rather than React
application state. It grants one active ambient slot by priority and revokes it
when the page is hidden.

## Hashless Navigation

`useHashlessSectionNavigation` keeps home sections navigable without persistent
hash fragments. Scrolling is delegated to the browser through
`src/lib/motion/native-scroll.ts`; there is no virtual-scroll engine or global
animation ticker.

## Deferred Mounting

`useDeferredMount` uses IntersectionObserver, a global queue slot, and React `startTransition` to stage expensive lazy sections. It persists mounted section ids in a module-level Set for smoother returns.

## Motion Scheduling

Optional rich motion is gated by viewport, pointer type, reduced-motion
preference, intersection, document visibility, and idle time. The hero key light
uses a short-lived frame loop that stops after it settles and clears
`will-change`.

## Performance Debugging

`src/lib/perf-debug.ts` provides marks, measurements, long task observation, mobile media pressure snapshots, and optional debug behavior. `App.tsx` starts the mobile media pressure observer globally.
