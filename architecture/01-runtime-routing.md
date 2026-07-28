# Runtime And Routing

## Boot Sequence
`src/main.tsx` is intentionally small. It mounts `App` inside:
- `BrowserRouter` for client-side routing
- `ThemeProvider` from `next-themes`
- global `src/index.css`
- `src/i18n.ts` initialization

## App Route Resolution
`src/App.tsx` computes route entries once at module load:
- `getServicePageRouteEntries()`
- `getVerticalPageRouteEntries()`
- `getResourcePageRouteEntries()`
- `getLegalPageRouteEntries()`

On each location change it normalizes the pathname and searches these arrays. The matching route entry supplies both the page id and locale into the relevant page factory.

## Home Mount Strategy
Desktop keeps the homepage mounted while visiting subroutes and hides it with `display: none`. Mobile unmounts the homepage off-route so hidden video-heavy sections do not keep consuming media resources.

## Scroll Behavior
`App.tsx` persists scroll positions by React Router `location.key`. On browser back/forward it restores the saved Y position after two animation frames. Hash navigation retries until lazy-mounted sections exist, then clears the hash from the URL.

## Locale Behavior
`getLocaleFromPath()` infers `en` only for `/en` and `/en/*`; everything else is Spanish. `App.tsx` changes i18n language when the URL locale changes. `PageSeo` also sets `document.documentElement.lang`.

## Static HTML Entrypoints
The folders under `en/`, `servicios/`, `verticales/`, `recursos/`, `politica-de-privacidad/`, and `terminos-y-uso-de-contenido/` are not React route modules. They are static entry shells consumed by Vite's multi-page build.
