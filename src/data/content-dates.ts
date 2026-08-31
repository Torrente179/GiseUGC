/**
 * Honest last-modified dates from git content history — not build time.
 * Sitemap lastmod, JSON-LD dateModified, and llms Last-Updated should read
 * from here so the three surfaces cannot drift.
 *
 * home      — this crawl-trust pass (proof, schema, llms)
 * services  — last service page content/template rebuild
 * verticals — last vertical entry HTML / template commit
 * resources — last resource entry HTML commit (matches on-page "last updated")
 * legal     — privacy / terms content commit
 */
export const CONTENT_DATES = {
  home: '2026-08-31',
  services: '2026-08-15',
  verticals: '2026-07-29',
  resources: '2026-07-29',
  legal: '2026-03-22',
} as const;

export type ContentFamily = keyof typeof CONTENT_DATES;

export const LLMS_LAST_UPDATED = CONTENT_DATES.home;
