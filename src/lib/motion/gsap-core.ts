/**
 * Central GSAP loader — keeps gsap + ScrollTrigger off the critical path.
 * Every rich-motion consumer goes through `loadGsap()` so the library is
 * fetched once, registered once, and only on viewports that earn it.
 */
import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

export type GsapBundle = {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
};

let bundlePromise: Promise<GsapBundle> | null = null;

export const loadGsap = (): Promise<GsapBundle> => {
  bundlePromise ??= Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]).then(([gsapModule, scrollTriggerModule]) => {
    const gsap = gsapModule.gsap ?? gsapModule.default;
    const { ScrollTrigger } = scrollTriggerModule;
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
  });
  return bundlePromise;
};

/**
 * Deferred home sections grow the document after mount, which invalidates
 * ScrollTrigger's measurements (especially under pins). One debounced
 * ResizeObserver on <body> keeps every trigger honest — attach once.
 */
let autoRefreshAttached = false;
export const ensureAutoRefresh = (scrollTrigger: GsapBundle['ScrollTrigger']): void => {
  if (autoRefreshAttached || typeof document === 'undefined') return;
  autoRefreshAttached = true;
  let timer = 0;
  const observer = new ResizeObserver(() => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => scrollTrigger.refresh(), 240);
  });
  observer.observe(document.body);
};

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Rich motion = desktop-sized viewport with a fine pointer. */
export const isRichMotionViewport = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;

export const shouldEnableRichMotion = (): boolean =>
  isRichMotionViewport() && !prefersReducedMotion();

/** Defer work until the browser is idle (with a sane timeout fallback). */
export const whenIdle = (callback: () => void, timeout = 1800): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(() => callback(), { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 350);
  return () => window.clearTimeout(id);
};
