import Lenis from 'lenis';

let instance: Lenis | null = null;
let rafId: number | null = null;

export const getLenis = (): Lenis | null => instance;

export const initLenis = (): (() => void) | undefined => {
  if (instance) return;

  const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Skip on mobile (native momentum is superior on touch devices) and reduced motion
  if (!isDesktop || prefersReducedMotion) return;

  const lenis = new Lenis({
    lerp: 0.12,
    smoothWheel: true,
    wheelMultiplier: 0.92,
  });

  instance = lenis;

  const raf = (time: number) => {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);

  return () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    lenis.destroy();
    instance = null;
    rafId = null;
  };
};
