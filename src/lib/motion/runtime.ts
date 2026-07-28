export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Rich pointer-following motion is reserved for devices that can sustain it. */
export const isRichMotionViewport = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;

export const shouldEnableRichMotion = (): boolean =>
  isRichMotionViewport() && !prefersReducedMotion();

/** Defer optional pointer motion until the browser has finished critical work. */
export const whenIdle = (callback: () => void, timeout = 1800): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(() => callback(), { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 350);
  return () => window.clearTimeout(id);
};
