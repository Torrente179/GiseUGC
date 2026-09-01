/**
 * Crawl-facing social proof. Homepage HTML (including prerender), JSON-LD,
 * the Fiverr rating card, testimonials header, and llms files must all tell
 * this same story. Do not animate from zero in the first HTML snapshot, and
 * do not invent review copy to pad schema.
 *
 * Brand campaigns: the 28+ claim already used in hero/footer/llms copy.
 * Rating / review count: Fiverr marketplace aggregate shown on the homepage
 * rating card. These are third-party marketplace reviews, not first-party
 * on-site reviews.
 */
export const SITE_PROOF = {
  brandCampaigns: 28,
  fiverrRating: 4.8,
  fiverrReviewCount: 173,
  languages: 'ES+EN',
} as const;

/** Marketplace aggregate only. Never attach Review / reviewBody. */
export const FIVERR_AGGREGATE_RATING = {
  '@type': 'AggregateRating' as const,
  ratingValue: String(SITE_PROOF.fiverrRating),
  reviewCount: String(SITE_PROOF.fiverrReviewCount),
  bestRating: '5',
  worstRating: '1',
};

export const FIVERR_RATING_DISTRIBUTION = [
  { stars: 5, count: 158 },
  { stars: 4, count: 9 },
  { stars: 3, count: 3 },
  { stars: 2, count: 0 },
  { stars: 1, count: 3 },
] as const;

export const formatProofValue = (value: number, suffix = '', decimals = 0): string => {
  const numeric = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString('en-US');
  return `${numeric}${suffix}`;
};
