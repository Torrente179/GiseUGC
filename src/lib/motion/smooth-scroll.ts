/**
 * Site-wide smooth scrolling — a Lenis singleton bridged to ScrollTrigger.
 *
 * Desktop (fine pointer, no reduced motion) only; mobile keeps native scroll.
 * Lenis drives the real window scroll, so ScrollTrigger pins work with their
 * default `pinType: fixed` and the existing position:fixed overlay scroll
 * locks (theater, lightbox) stay valid — they just `stop()`/`start()` us.
 */
import type Lenis from 'lenis';
import { loadGsap, shouldEnableRichMotion, ensureAutoRefresh } from '@/lib/motion/gsap-core';

let lenis: Lenis | null = null;
let initPromise: Promise<Lenis | null> | null = null;

export const initSmoothScroll = (): Promise<Lenis | null> => {
  initPromise ??= (async () => {
    if (!shouldEnableRichMotion()) return null;
    const [{ gsap, ScrollTrigger }, lenisModule] = await Promise.all([
      loadGsap(),
      import('lenis'),
    ]);
    if (lenis) return lenis;
    const LenisCtor = lenisModule.default;
    lenis = new LenisCtor({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(rafBridge);
    gsap.ticker.lagSmoothing(0);
    ensureAutoRefresh(ScrollTrigger);

    // Every fullscreen theater on the site (home portfolio, service and
    // vertical pages) flags html[data-theater='open'] while it owns the
    // viewport — pause smooth scrolling for all of them from one place.
    const theaterObserver = new MutationObserver(() => {
      if (document.documentElement.dataset.theater === 'open') {
        lenis?.stop();
      } else {
        lenis?.start();
      }
    });
    theaterObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theater'],
    });

    return lenis;
  })();
  return initPromise;
};

const rafBridge = (time: number) => {
  lenis?.raf(time * 1000);
};

export const getLenis = (): Lenis | null => lenis;

/** Pause smooth scrolling while a fullscreen overlay owns the viewport. */
export const stopSmoothScroll = (): void => {
  lenis?.stop();
};

export const startSmoothScroll = (): void => {
  lenis?.start();
};

type ScrollToYOptions = {
  immediate?: boolean;
};

/**
 * Scroll to an absolute Y. `immediate` jumps without animation and forces
 * Lenis to adopt the position even while stopped (overlay restorations).
 */
export const scrollToY = (y: number, { immediate = false }: ScrollToYOptions = {}): void => {
  if (lenis) {
    lenis.scrollTo(y, { immediate, force: immediate, lock: immediate });
    if (immediate) window.scrollTo(0, y);
    return;
  }
  window.scrollTo({ top: y, left: 0, behavior: immediate ? 'auto' : 'smooth' });
};
