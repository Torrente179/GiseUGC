# Runtime And Routing

## Boot Sequence

Production does not boot from one universal page module:

1. Each HTML route imports a route-family entry (`entry-home`, `entry-hub`,
   `entry-service`, `entry-vertical`, `entry-resource`, or `entry-legal`).
2. The entry reads embedded route data when the template needs it.
3. `bootstrapApp()` in `src/client-runtime.tsx` installs `BrowserRouter`,
   `LocaleProvider`, and `ThemeProvider`.
4. A root marked `data-prerendered="true"` uses `hydrateRoot()`; the
   non-prerendered development fallback uses `createRoot()`.
5. Motion is armed only after route styles settle and two animation frames have
   completed, so entrances cannot hide or delay the first visual content.

## App Route Resolution

`src/App.tsx` computes route entries once at module load:

- `getHubPageRouteEntries()`
- `getServicePageRouteEntries()`
- `getVerticalPageRouteEntries()`
- `getResourcePageRouteEntries()`
- `getLegalPageRouteEntries()`

On each location change it normalizes the pathname and searches these arrays. The matching route entry supplies both the page id and locale into the relevant page factory. Hub indexes (`/servicios/`, `/verticales/`, `/recursos/` and EN twins) mount `HubPage` from `src/entry-hub.tsx`; they must not hydrate through the service/vertical/resource prefix match.

## Document Navigation Policy

Every registered destination is its own optimized document. The client runtime
therefore converts same-origin cross-path anchor clicks into
`window.location.assign()`. Same-page and hash links remain native. This avoids
carrying the homepage, clip catalog, and unrelated route factories through a
client navigation.

Only the current route is mounted. Hidden home media is not preserved behind a
subroute.

## Scroll Behavior

`App.tsx` persists scroll positions by React Router `location.key`. On browser back/forward it restores the saved Y position after two animation frames. Hash navigation retries until lazy-mounted sections exist, then clears the hash from the URL.

## Locale Behavior

`getLocaleFromPath()` infers `en` only for `/en` and `/en/*`; everything else
is Spanish. `LocaleProvider` selects the bundled dictionary directly from that
pathname and updates `document.documentElement.lang`. There is no runtime
language detector or network translation backend.

## Static HTML Entrypoints

The folders under `en/`, `servicios/`, `verticales/`, `recursos/`,
`politica-de-privacidad/`, and `terminos-y-uso-de-contenido/` are static Vite
inputs. `vite.config.ts` derives its Rollup input map from
`getAllEntrypointPaths()` rather than maintaining a second hand-written list.
The prerender step turns those shells into complete route documents.
