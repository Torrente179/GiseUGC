/** Footer/contact lives at the end of the page. Before route layout settles,
 *  getBoundingClientRect() can still report a near-zero Y. */
export const HASH_SCROLL_UNSETTLED_Y = 120;
export const HASH_SCROLL_MIN_ATTEMPTS = 8;
export const HASH_SCROLL_MAX_ATTEMPTS = 25;
export const HASH_SCROLL_NAV_OFFSET = 80;

export const hashTargetLooksUnsettled = (
  measuredY: number,
  pageHeight: number,
  viewportHeight: number,
): boolean => measuredY < HASH_SCROLL_UNSETTLED_Y && pageHeight > viewportHeight * 2;

export const shouldRetryHashScroll = (
  measuredY: number,
  pageHeight: number,
  viewportHeight: number,
  attempts: number,
): boolean => {
  if (attempts >= HASH_SCROLL_MAX_ATTEMPTS) return false;
  if (attempts < HASH_SCROLL_MIN_ATTEMPTS) return true;
  return hashTargetLooksUnsettled(measuredY, pageHeight, viewportHeight);
};
