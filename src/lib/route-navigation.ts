/**
 * Imperative counterpart to the anchor interception in `client-runtime.tsx`.
 *
 * Every registered path is its own prerendered document carrying route-specific
 * data, metadata, critical CSS, and a hydrator that registers only that one
 * route family. A client-side router push to a different family therefore
 * renders nothing at all — and a push to the other locale of the same family
 * would render it against the previous document's embedded route data. Both
 * cases have to leave the document.
 *
 * Use this for programmatic destinations. Plain `<a href>` clicks are already
 * intercepted by the runtime and need no handler.
 */
export const navigateToRoute = (href: string) => {
  window.location.assign(new URL(href, window.location.href).href);
};
