/**
 * Honest last-modified dates from git content history — not build time.
 * Sitemap lastmod, JSON-LD dateModified, visible "last updated" labels, and
 * llms Last-Updated should read from here so those surfaces cannot drift.
 *
 * Every family moved to 2026-10-13 with the site-wide copy rewrite (plain,
 * first-person voice in ES and EN). Bump a family when its visible copy changes.
 * Home (and therefore llms Last-Updated) moved to 2026-10-15 when llms.txt
 * dropped "active" from "28+ brand campaigns" to match the live site proof line.
 * Resources and hubs moved to 2026-10-14 with the bilingual Fiverr pricing guide.
 */
export const CONTENT_DATES = {
  home: '2026-10-15',
  hubs: '2026-10-14',
  services: '2026-10-13',
  verticals: '2026-10-13',
  resources: '2026-10-14',
  legal: '2026-10-13',
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
