import { useEffect, useRef } from 'react';
import { loadGsap, shouldEnableRichMotion } from '@/lib/motion/gsap-core';

/**
 * Magnetic pull on primary CTAs — the element leans toward the pointer and
 * settles back with a soft elastic release. Fine-pointer desktop only.
 *
 * The `is-magnetic` class removes `transform` from the element's CSS
 * transition list so GSAP's per-frame writes aren't re-eased by CSS.
 */
export const useMagnetic = <T extends HTMLElement>(strength = 0.24) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!shouldEnableRichMotion()) return;
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    loadGsap().then(({ gsap }) => {
      if (cancelled) return;

      el.classList.add('is-magnetic');

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        gsap.to(el, {
          x: (event.clientX - rect.left - rect.width / 2) * strength,
          y: (event.clientY - rect.top - rect.height / 2) * strength,
          duration: 0.45,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      };

      const onLeave = () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.45)',
          overwrite: 'auto',
        });
      };

      el.addEventListener('pointermove', onMove, { passive: true });
      el.addEventListener('pointerleave', onLeave);

      cleanup = () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
        el.classList.remove('is-magnetic');
        gsap.killTweensOf(el);
        gsap.set(el, { clearProps: 'x,y' });
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [strength]);

  return ref;
};
