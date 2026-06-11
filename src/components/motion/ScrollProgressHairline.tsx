import { useEffect, useRef } from 'react';
import { ensureAutoRefresh, loadGsap, shouldEnableRichMotion, whenIdle } from '@/lib/motion/gsap-core';

/**
 * A 1.5px brand-teal thread along the very top of the viewport that fills
 * with reading progress. Desktop only, idle-loaded.
 */
const ScrollProgressHairline = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldEnableRichMotion()) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const cancelIdle = whenIdle(async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      const el = ref.current;
      if (cancelled || !el) return;

      ensureAutoRefresh(ScrollTrigger);

      const tween = gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 120, end: 'max', scrub: 0.4 },
        },
      );

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => {
      cancelled = true;
      cancelIdle();
      cleanup?.();
    };
  }, []);

  return <div ref={ref} className="scroll-progress-hairline" aria-hidden="true" />;
};

export default ScrollProgressHairline;
