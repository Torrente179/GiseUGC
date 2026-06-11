import { useEffect, type RefObject } from 'react';
import { loadGsap, shouldEnableRichMotion, whenIdle } from '@/lib/motion/gsap-core';

/**
 * Scroll choreography for the home hero (desktop only, idle-loaded).
 *
 * The hero viewport is sticky inside a taller pin zone, so the light page
 * surface ("curtain") physically slides over the dark stage. This hook adds
 * the cinematic grade on top: the stage recedes (scale + rounded corners +
 * dim) while identity and reel deck counter-drift for depth.
 */
export const useHeroMotion = (rootRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!shouldEnableRichMotion()) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    const cancelIdle = whenIdle(async () => {
      const { gsap } = await loadGsap();
      const root = rootRef.current;
      if (cancelled || !root) return;

      const ctx = gsap.context(() => {
        const stage = root.querySelector<HTMLElement>('[data-hero-viewport]');
        const dim = root.querySelector<HTMLElement>('[data-hero-dim]');
        const identity = root.querySelector<HTMLElement>('[data-hero-identity]');
        const deck = root.querySelector<HTMLElement>('[data-hero-deck]');
        const curtain = root.querySelector<HTMLElement>('[data-hero-curtain]');
        if (!stage || !curtain) return;

        const coverScene = {
          trigger: curtain,
          start: 'top bottom',
          end: 'top 30%',
          scrub: 0.6,
        } as const;

        gsap
          .timeline({ scrollTrigger: { ...coverScene } })
          .to(stage, { scale: 0.955, borderRadius: '2.25rem', ease: 'none' }, 0)
          .to(dim, { opacity: 0.45, ease: 'none' }, 0);

        if (identity) {
          gsap.to(identity, {
            yPercent: -7,
            ease: 'none',
            scrollTrigger: { ...coverScene },
          });
        }
        if (deck) {
          gsap.to(deck, {
            yPercent: 4,
            scale: 1.02,
            ease: 'none',
            scrollTrigger: { ...coverScene },
          });
        }
      }, root);

      revert = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      cancelIdle();
      revert?.();
    };
  }, [rootRef]);
};
