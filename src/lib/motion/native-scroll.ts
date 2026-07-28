/**
 * Native scrolling facade used by route restoration and overlay cleanup.
 * Browsers own the scroll pipeline; there is no global animation ticker.
 */
type ScrollToYOptions = {
  immediate?: boolean;
};

export const scrollToY = (
  y: number,
  { immediate = false }: ScrollToYOptions = {},
): void => {
  window.scrollTo({
    top: y,
    left: 0,
    behavior: immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
  });
};
