import { useEffect, type RefObject } from 'react';

/**
 * Pointer depth for the home hero. Children marked `data-depth="n"` drift up
 * to n px with the cursor (negative = against it), and `data-tilt="deg"` adds
 * a slight turn. One rAF loop that sleeps once the layers settle; it writes
 * `transform` only, so the entrance (`translate`/`scale`) and the scroll
 * timeline (on the parent tracks) compose with it instead of fighting it.
 * Off for touch and reduced motion.
 */
export const useHeroDepth = (rootRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-depth]')).map((el) => ({
      el,
      depth: Number(el.dataset.depth) || 0,
      tilt: Number(el.dataset.tilt) || 0,
    }));
    if (!layers.length) return undefined;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;

    const render = () => {
      x += (targetX - x) * 0.075;
      y += (targetY - y) * 0.075;
      for (const { el, depth, tilt } of layers) {
        const turn = tilt
          ? ` rotateY(${(x * tilt).toFixed(2)}deg) rotateX(${(-y * tilt * 0.5).toFixed(2)}deg)`
          : '';
        el.style.transform = `translate3d(${(x * depth).toFixed(2)}px, ${(y * depth * 0.6).toFixed(2)}px, 0)${turn}`;
      }
      frame = Math.abs(targetX - x) > 0.001 || Math.abs(targetY - y) > 0.001
        ? requestAnimationFrame(render)
        : 0;
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const handleMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      wake();
    };
    const handleLeave = () => {
      targetX = 0;
      targetY = 0;
      wake();
    };

    for (const { el } of layers) el.style.willChange = 'transform';
    root.addEventListener('pointermove', handleMove, { passive: true });
    root.addEventListener('pointerleave', handleLeave);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener('pointermove', handleMove);
      root.removeEventListener('pointerleave', handleLeave);
      for (const { el } of layers) {
        el.style.willChange = '';
        el.style.transform = '';
      }
    };
  }, [rootRef]);
};
