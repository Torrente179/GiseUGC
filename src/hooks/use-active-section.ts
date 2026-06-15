import { useEffect, useState } from 'react';

/**
 * Scroll-spy for the mobile tab bar. Returns whichever of the given section ids
 * currently sits under the viewport's "active line" (~42% down). Queries the
 * DOM fresh each tick so it works with lazily-mounted sections — no observer to
 * (re)attach when a deferred section appears. rAF-throttled; runs only when
 * enabled (mobile + on the home page).
 */
export const useActiveSection = (sectionIds: string[], enabled: boolean): string | null => {
  const [activeId, setActiveId] = useState<string | null>(enabled ? sectionIds[0] ?? null : null);

  useEffect(() => {
    if (!enabled) {
      setActiveId(null);
      return;
    }

    let raf = 0;
    const compute = () => {
      raf = 0;
      const line = window.innerHeight * 0.42;
      let current = sectionIds[0] ?? null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
      }
      setActiveId((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (raf === 0) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [enabled, sectionIds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  return activeId;
};
