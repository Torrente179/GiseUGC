import { useEffect, useRef } from 'react';
import { loadGsap, shouldEnableRichMotion, whenIdle } from '@/lib/motion/gsap-core';

/**
 * A 1.5px brand-teal thread along the very top of the viewport that fills
 * with reading progress. Desktop only, idle-loaded.
 *
 * Deferred home sections grow the document after mount, so a debounced
 * ResizeObserver on <body> keeps ScrollTrigger's "max" end honest.
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

      const tween = gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { start: 120, end: 'max', scrub: 0.4 },
        },
      );

      let refreshTimer = 0;
      const bodyObserver = new ResizeObserver(() => {
        window.clearTimeout(refreshTimer);
        refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 240);
      });
      bodyObserver.observe(document.body);

      cleanup = () => {
        window.clearTimeout(refreshTimer);
        bodyObserver.disconnect();
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
