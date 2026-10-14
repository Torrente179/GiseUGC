import { OVERVIEW_TITLE_LIMITS, SECTION_TITLE_LIMITS, titleTier } from '@/lib/keynote-text';

/*
 * `section-label` opts the heading out of the site-wide h1-h6 rules in
 * index.css, which would otherwise out-rank these classes.
 * Spelled in full, never `kn-h--${tier}`, so every selector has a literal in source.
 */
const TITLE_CLASS = {
  xl: 'kn-h kn-h--xl section-label',
  lg: 'kn-h kn-h--lg section-label',
  md: 'kn-h kn-h--md section-label',
  sm: 'kn-h kn-h--sm section-label',
} as const;

/** The Overview statement: the largest type on the page. */
export const overviewTitleClass = (title: string) => TITLE_CLASS[titleTier(title, OVERVIEW_TITLE_LIMITS)];

/** Every other beat title. */
export const sectionTitleClass = (title: string) => TITLE_CLASS[titleTier(title, SECTION_TITLE_LIMITS)];
