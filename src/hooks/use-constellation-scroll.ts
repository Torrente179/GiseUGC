import { useEffect, type RefObject } from 'react';
import { ensureAutoRefresh, loadGsap, shouldEnableRichMotion } from '@/lib/motion/gsap-core';
import { constellationState, resetConstellationState } from '@/components/three/constellation-state';

/**
 * The hero fly-through rig (desktop only). Pins the hero stage for +160% of
 * viewport height and scrubs:
 *  - constellationState.progress (read by the three.js camera every frame)
 *  - the DOM identity overlay (drifts up and out during the first half)
 *  - the exit veil (the stage fades to ink as the camera clears the field,
 *    handing off into the Manifesto chapter)
 *
 * Works with or without the WebGL canvas — the DOM choreography is the same.
 */
export const useConstellationScroll = (
  sectionRef: RefObject<HTMLElement>,
  enabled: boolean,
) => {
  useEffect(() => {
    if (!enabled || !shouldEnableRichMotion()) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      const root = sectionRef.current;
      if (cancelled || !root) return;

      ensureAutoRefresh(ScrollTrigger);

      const ctx = gsap.context(() => {
        const stage = root.querySelector<HTMLElement>('[data-hero-viewport]');
        const identity = root.querySelector<HTMLElement>('[data-hero-identity]');
        const exitVeil = root.querySelector<HTMLElement>('[data-hero-exit]');
        if (!stage) return;

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: '+=160%',
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            onUpdate: (self) => {
              constellationState.progress = self.progress;
            },
          },
        });

        // Identity holds for a beat, then drifts up and dissolves while the
        // camera starts moving into the field.
        if (identity) {
          timeline.to(
            identity,
            { yPercent: -22, autoAlpha: 0, ease: 'power1.in', duration: 0.4 },
            0.1,
          );
        }

        // Final quarter: fade the stage to ink for the chapter hand-off.
        if (exitVeil) {
          timeline.to(exitVeil, { opacity: 1, duration: 0.25 }, 0.75);
        }

        // Keep the timeline's intrinsic duration at 1 even if no targets
        // were found, so progress maps cleanly onto the pin distance.
        timeline.to({}, { duration: 0.001 }, 1);
      }, root);

      revert = () => ctx.revert();
    });

    return () => {
      cancelled = true;
      revert?.();
      resetConstellationState();
    };
  }, [enabled, sectionRef]);
};
