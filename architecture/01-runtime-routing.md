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

`/#contact` and `/en/#contact` target `id="contact"` on the rendered homepage
footer (`PageEndStrip` while `SHOW_SITE_FOOTER` is false).

## Scroll Behavior

Every document load is a React Router `POP` with nothing saved, so `App.tsx`
does not set the scroll on a document's first render. The browser restores it
on Back, Forward and reload. See `changes/2026-10-17-scroll-landing-no-freeze.md`.

- **Hash in the URL** (`/#services`, `/#contact`): `pinElementInView`
  (`src/lib/hash-section-scroll.ts`) lands on the section at once, 80 px below
  the top. It then holds it there every frame while deferred sections mount,
  for up to 3.2 s. It lets go on the visitor's first touch, wheel, click or
  key. The hash is cleared from the URL.
- **Back or reload into a scrolled page:** on `pagehide` the page stores the
  section on screen and its offset (`sessionStorage`, per path). On return the
  same pin holds that section while the page mounts again.
- **In-page section links** (`useHashlessSectionNavigation`): an eased JS
  scroll. It re-measures the target every frame, and the visitor's touch,
  wheel, click or key stops it.
- In-document location changes (rare: nearly every link is a document
  navigation) still restore positions saved by `location.key`.

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

## Hire-intent alias 301s

`/contratar`, `/hire`, and `/en/hire` (with and without a trailing slash)
are not registered routes. Production (`vercel.json`) 301s them onto the
existing how-to-hire guides:

- ES: `/recursos/como-contratar-creadora-ugc/`
- EN: `/en/resources/how-to-hire-ugc-creator/`

Those targets stay in `PAGE_REGISTRY` and the sitemap. The aliases do not.
Do not add React Router redirects or in-page links for the aliases; a
parallel PR owns FAQ schema and page links.

## Industry (vertical) 301s

The industry hub and its children are gone. Production (`vercel.json`) 301s
the old paths, in-locale, onto the services hub or the closest service.
Catch-alls cover both slash forms and sit after the explicit per-page 301s:

- `/verticales/:path*` and `/verticales/:path*/` → `/servicios/`
- `/en/verticals/:path*` and `/en/verticals/:path*/` → `/en/services/`
