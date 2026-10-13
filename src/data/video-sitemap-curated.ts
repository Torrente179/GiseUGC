/**
 * Curated video sitemap membership. Each distinct clip is listed once, on
 * its best page (Spanish URL plus the /en/ twin). Decorative catalog clips
 * stay out of the sitemap; VideoObject JSON-LD still renders wherever the
 * clip is shown on the page.
 *
 * Best page for these four is the homepage: they are the featured
 * VideoObject set already authored in index.html / en/index.html.
 */
export const VIDEO_SITEMAP_CURATED_CLIP_IDS = [1, 2, 4, 7] as const;

export const VIDEO_SITEMAP_BEST_PAGE = {
  es: '/',
  en: '/en/',
} as const;

export const VIDEO_SITEMAP_EXCLUDED_REASON = {
  decorativeCatalog: 'In the reel catalog but not a homepage featured VideoObject',
  serviceVerticalProof: 'Shown as service/vertical proof; JSON-LD stays on those pages',
} as const;
