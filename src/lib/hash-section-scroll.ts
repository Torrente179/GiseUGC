/** Footer/contact lives at the end of the page. Before route layout settles,
 *  getBoundingClientRect() can still report a near-zero Y, or a mid-page Y
 *  that later grows as deferred home sections mount. */
export const HASH_SCROLL_UNSETTLED_Y = 120;
export const HASH_SCROLL_MIN_ATTEMPTS = 8;
export const HASH_SCROLL_MAX_ATTEMPTS = 40;
export const HASH_SCROLL_NAV_OFFSET = 80;
export const HASH_SCROLL_STABLE_PX = 40;

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
  previousY: number | null = null,
): boolean => {
  if (attempts >= HASH_SCROLL_MAX_ATTEMPTS) return false;
  if (attempts < HASH_SCROLL_MIN_ATTEMPTS) return true;
  if (hashTargetLooksUnsettled(measuredY, pageHeight, viewportHeight)) return true;
  return previousY === null || Math.abs(measuredY - previousY) > HASH_SCROLL_STABLE_PX;
};
