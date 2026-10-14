import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

export const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Which beat is under the reading line. Disabled shells observe nothing. */
export const useBeatSpy = (ids: string[], enabled: boolean) => {
  const [activeId, setActiveId] = useState(ids[0] ?? '');
  const idsKey = ids.join('|');

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !idsKey) return;
    const list = idsKey.split('|');
    const nodes = list
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const nextId = visible[0]?.target.id;
        if (nextId) setActiveId(nextId);
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.15, 0.4, 0.75] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [enabled, idsKey]);

  return activeId;
};

export type ThumbBox = { x: number; y: number; width: number; height: number };

/**
 * Measures the selected tab so the thumb can slide to it whatever the label
 * lengths and row wraps are. Until the first measurement the selected tab
 * paints its own pill, so server-rendered markup is already legible.
 */
export const useSegmentThumb = (rootRef: RefObject<HTMLElement>, activeIndex: number) => {
  const [box, setBox] = useState<ThumbBox | null>(null);

  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const tab = root.querySelectorAll<HTMLElement>('[role="tab"]')[activeIndex];
    if (!tab || tab.offsetWidth === 0) {
      setBox(null);
      return;
    }
    setBox((previous) => {
      const next = { x: tab.offsetLeft, y: tab.offsetTop, width: tab.offsetWidth, height: tab.offsetHeight };
      return previous &&
        previous.x === next.x &&
        previous.y === next.y &&
        previous.width === next.width &&
        previous.height === next.height
        ? previous
        : next;
    });
  }, [activeIndex, rootRef]);

  useIsomorphicLayoutEffect(() => {
    measure();
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [measure, rootRef]);

  return box;
};

/** Scroll state for a snap rail: which end is reachable, which card is first in view. */
export const useRail = (railRef: RefObject<HTMLElement>, itemCount: number) => {
  const [state, setState] = useState({ canPrev: false, canNext: itemCount > 1, index: 0 });

  const update = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const items = Array.from(el.children) as HTMLElement[];
    const step = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : el.clientWidth;
    const canPrev = el.scrollLeft > 4;
    const canNext = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    const index = step > 0 ? Math.min(itemCount - 1, Math.max(0, Math.round(el.scrollLeft / step))) : 0;
    setState((previous) =>
      previous.canPrev === canPrev && previous.canNext === canNext && previous.index === index
        ? previous
        : { canPrev, canNext, index },
    );
  }, [itemCount, railRef]);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return undefined;
    update();
    el.addEventListener('scroll', update, { passive: true });
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      observer?.disconnect();
    };
  }, [railRef, update]);

  const scrollByItem = useCallback(
    (direction: 1 | -1) => {
      const el = railRef.current;
      if (!el) return;
      const items = Array.from(el.children) as HTMLElement[];
      const step = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : el.clientWidth;
      const reduced =
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollBy({ left: direction * step, behavior: reduced ? 'auto' : 'smooth' });
    },
    [railRef],
  );

  return { ...state, scrollByItem };
};

/**
 * True once the element has come within `rootMargin` of the viewport, and stays
 * true. Lets below-the-fold imagery wait its turn: `loading="lazy"` alone still
 * fetches anything within a couple of screens on a fast link, which on a phone
 * competes with the hero poster for the same bytes. A shell that is not
 * displayed never intersects, so it never fetches at all.
 */
export const useNearViewport = <T extends Element>(rootMargin = '320px 0px') => {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (near) return undefined;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [near, rootMargin]);

  return [ref, near] as const;
};

/** A transparent image with the right proportions, so a waiting <img> still holds its box. */
export const placeholderSrc = (width: number, height: number) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'/%3E`;
