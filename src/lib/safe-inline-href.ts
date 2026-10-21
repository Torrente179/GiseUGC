/**
 * The one scheme check for copy links ("[label](href)" in the data modules).
 *
 * Copy is currently authored in the repo, but it is also serialized into
 * prerendered route data. Keep future data sources from turning a copy link
 * into a javascript:, data:, or protocol-relative navigation.
 *
 * Shared by the React renderer (src/lib/inline-copy-links.tsx) and the
 * build-time HTML renderers (scripts/lib/entry-html.mjs loads this file through
 * load-ts-module.mjs), so the two can never disagree. Keep it pure TS with no
 * imports.
 *
 * Returns the href when it is a site-root path, a plain #fragment, or an
 * https:// URL without credentials; null otherwise (the caller shows the label
 * as text).
 */
export const safeInlineHref = (href: string): string | null => {
  if (href.includes('\\') || [...href].some((char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) return null;
  if (href.startsWith('/') && !href.startsWith('//')) return href;
  if (href.startsWith('#') && /^#[a-z][a-z0-9_-]*$/iu.test(href)) return href;
  if (!href.startsWith('https://')) return null;
  try {
    const url = new URL(href);
    return url.protocol === 'https:' && url.hostname && !url.username && !url.password ? href : null;
  } catch {
    return null;
  }
};
