import { useEffect, useRef } from 'react';
import { loadGsap, shouldEnableRichMotion, whenIdle } from '@/lib/motion/gsap-core';

/**
 * Scroll-velocity skew — the element shears a hair in the scroll direction
 * and eases back when the scroll settles, so a media rail feels like it has
 * physical weight. Desktop only, idle-loaded.
 */
export const useVelocitySkew = <T extends HTMLElement>(maxSkewDeg = 1.3) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!shouldEnableRichMotion()) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const cancelIdle = whenIdle(async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      const el = ref.current;
      if (cancelled || !el) return;

      const proxy = { skew: 0 };
      const setSkew = gsap.quickSetter(el, 'skewY', 'deg');
      const clamp = gsap.utils.clamp(-maxSkewDeg, maxSkewDeg);

      const trigger = ScrollTrigger.create({
        onUpdate: (self) => {
          const skew = clamp(self.getVelocity() / -500);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.9,
              ease: 'power3',
              overwrite: true,
              onUpdate: () => setSkew(proxy.skew),
            });
          }
        },
      });

      cleanup = () => {
        trigger.kill();
        gsap.killTweensOf(proxy);
        gsap.set(el, { clearProps: 'skewY' });
      };
    });

    return () => {
      cancelled = true;
      cancelIdle();
      cleanup?.();
    };
  }, [maxSkewDeg]);

  return ref;
};
