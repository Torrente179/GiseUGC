/**
 * Crawl-facing social proof. Homepage HTML (including prerender), JSON-LD,
 * the Fiverr rating card, testimonials header, OG images, and llms files
 * must all tell this same story. Do not animate from zero in the first HTML
 * snapshot, and do not invent review copy to pad schema.
 *
 * Authority resync: any change to fiverrRating or fiverrReviewCount must
 * also trigger a resync of the off-site bios (Fiverr, LinkedIn, and the
 * directories paste pack). Those surfaces are owned by the Authority team.
 * Do not ship a rating/count change on-site without that resync.
 *
 * Brand campaigns: the 28+ claim already used in hero/footer/llms copy.
 * Rating / review count: Fiverr marketplace aggregate shown on the homepage
 * rating card. These are third-party marketplace reviews, not first-party
 * on-site reviews.
 */
export const SITE_PROOF = {
  brandCampaigns: 28,
  fiverrRating: 4.7,
  fiverrReviewCount: 177,
  languages: 'ES+EN',
} as const;

/**
 * Short proof line shared by per-page OG images and any on-page chip that
 * uses this exact wording. Built from SITE_PROOF so the numerals cannot
 * drift. ES and EN strings are locked; do not truncate or rewrite them
 * in the OG renderer.
 */
export const FIVERR_PROOF_LINE = {
  es: `${SITE_PROOF.fiverrRating}/5 · ${SITE_PROOF.fiverrReviewCount} reseñas en Fiverr`,
  en: `${SITE_PROOF.fiverrRating}/5 · ${SITE_PROOF.fiverrReviewCount} reviews on Fiverr`,
} as const;

export const FIVERR_PROOF_LINE_EXACT = {
  es: '4.7/5 · 177 reseñas en Fiverr',
  en: '4.7/5 · 177 reviews on Fiverr',
} as const;

/** Build-time / test gate: interpolated line must equal the locked wording. */
export const assertFiverrProofLine = () => {
  if (FIVERR_PROOF_LINE.es !== FIVERR_PROOF_LINE_EXACT.es) {
    throw new Error(
      `FIVERR_PROOF_LINE.es drifted from locked wording: ${FIVERR_PROOF_LINE.es}`,
    );
  }
  if (FIVERR_PROOF_LINE.en !== FIVERR_PROOF_LINE_EXACT.en) {
    throw new Error(
      `FIVERR_PROOF_LINE.en drifted from locked wording: ${FIVERR_PROOF_LINE.en}`,
    );
  }
};

/**
 * Single build-time switch for the OG proof line.
 * - exact: 4.7/5 · 177 from SITE_PROOF (checked before each build)
 * - none: role + Fiverr, no rating numerals
 * Default stays 'exact' until the owner picks the mode.
 */
export type OgProofLineMode = 'exact' | 'none';
export const OG_PROOF_LINE_MODE: OgProofLineMode = 'exact';

export const OG_PROOF_LINE_NONE = {
  es: 'Creadora UGC bilingüe · Fiverr',
  en: 'Bilingual UGC creator · Fiverr',
} as const;

export const getOgProofLine = (locale: 'es' | 'en'): string => {
  if (OG_PROOF_LINE_MODE === 'none') return OG_PROOF_LINE_NONE[locale];
  if (OG_PROOF_LINE_MODE !== 'exact') {
    throw new Error(`Unknown OG_PROOF_LINE_MODE: ${String(OG_PROOF_LINE_MODE)}`);
  }
  assertFiverrProofLine();
  return FIVERR_PROOF_LINE[locale];
};

export const assertOgProofLineConfig = () => {
  if (OG_PROOF_LINE_MODE === 'exact') {
    assertFiverrProofLine();
    return;
  }
  if (OG_PROOF_LINE_MODE === 'none') {
    if (OG_PROOF_LINE_NONE.es !== 'Creadora UGC bilingüe · Fiverr') {
      throw new Error('OG_PROOF_LINE_NONE.es drifted');
    }
    if (OG_PROOF_LINE_NONE.en !== 'Bilingual UGC creator · Fiverr') {
      throw new Error('OG_PROOF_LINE_NONE.en drifted');
    }
    return;
  }
  throw new Error(`Unknown OG_PROOF_LINE_MODE: ${String(OG_PROOF_LINE_MODE)}`);
};

/** Marketplace aggregate only. Never attach Review / reviewBody. */
export const FIVERR_AGGREGATE_RATING = {
  '@type': 'AggregateRating' as const,
  ratingValue: String(SITE_PROOF.fiverrRating),
  reviewCount: String(SITE_PROOF.fiverrReviewCount),
  bestRating: '5',
  worstRating: '1',
};

/** Seller-overall star buckets from https://www.fiverr.com/gisela_sm (not gig-level). */
export const FIVERR_RATING_DISTRIBUTION = [
  { stars: 5, count: 156 },
  { stars: 4, count: 12 },
  { stars: 3, count: 4 },
  { stars: 2, count: 0 },
  { stars: 1, count: 5 },
] as const;

export const formatProofValue = (value: number, suffix = '', decimals = 0): string => {
  const numeric = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString('en-US');
  return `${numeric}${suffix}`;
};
