/**
 * Honest last-modified dates from git content history — not build time.
 * Sitemap lastmod, JSON-LD dateModified, visible "last updated" labels, and
 * llms Last-Updated should read from here so those surfaces cannot drift.
 *
 * home      — this crawl-trust pass (proof, schema, llms)
 * hubs      — empty-but-valid /servicios|verticales|recursos index shells
 * services  — GEO copy on bilingual UGC + service inner template (2026-08-31)
 * verticals — last vertical entry HTML / template commit
 * resources — GEO copy on how-to-hire + resource template (2026-08-31)
 * legal     — privacy / terms content commit
 */
export const CONTENT_DATES = {
  home: '2026-08-31',
  hubs: '2026-08-31',
  services: '2026-08-31',
  verticals: '2026-07-29',
  resources: '2026-08-31',
  legal: '2026-03-22',
} as const;

export type ContentFamily = keyof typeof CONTENT_DATES;

export const LLMS_LAST_UPDATED = CONTENT_DATES.home;

const ES_MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'] as const;
const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

const parseIsoDate = (isoDate: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(isoDate);
  if (!match) {
    throw new Error(`CONTENT_DATES values must be YYYY-MM-DD, got ${isoDate}`);
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error(`Invalid calendar date ${isoDate}`);
  }
  return { year, month, day };
};

/** Visible on-page label. Same shape as the old hardcoded "24 mar 2026" / "Mar 24, 2026" copy. */
export const formatLastUpdatedLabel = (isoDate: string, locale: 'es' | 'en'): string => {
  const { year, month, day } = parseIsoDate(isoDate);
  if (locale === 'es') {
    return `Última actualización: ${day} ${ES_MONTHS[month - 1]} ${year}`;
  }
  return `Last updated: ${EN_MONTHS[month - 1]} ${day}, ${year}`;
};
