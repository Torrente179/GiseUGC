import { useEffect, useRef } from 'react';

/**
 * A 1.5px brand-teal thread along the very top of the viewport that fills
 * with reading progress. Modern browsers use a compositor scroll timeline;
 * the fallback writes once per scroll frame and is completely idle otherwise.
 */
const ScrollProgressHairline = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || CSS.supports('animation-timeline: scroll()')) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      el.style.setProperty('--scroll-progress', String(Math.min(1, window.scrollY / scrollable)));
    };
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return <div ref={ref} className="scroll-progress-hairline" aria-hidden="true" />;
};

export default ScrollProgressHairline;
