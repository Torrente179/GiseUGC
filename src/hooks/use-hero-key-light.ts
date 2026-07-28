import { useEffect, type RefObject } from 'react';
import { shouldEnableRichMotion, whenIdle } from '@/lib/motion/gsap-core';

/**
 * "Key light" — one practical light source for the title-sequence hero.
 *
 * The pointer *is* the lamp. This hook publishes a single normalised light
 * position as two inherited custom properties on the element it is given:
 *
 *   --key-nx, --key-ny   ∈ roughly [-1, 1], 0 = centre of the viewport
 *
 * Everything downstream derives from that one pair, so the paper and the film
 * frames are raked by the same light rather than carrying separate effects.
 *
 * Deliberately GSAP-free: interpolating two unitless numbers needs one rAF and
 * a lerp, not a tween engine, and it keeps the hero's first interaction off the
 * gsap chunk entirely.
 *
 * Budget rules:
 * - idle-loaded, so it never competes with the entrance animations
 * - the rAF runs only while the value is still settling, then stops dead
 * - paused offscreen and while the tab is hidden
 * - `shouldEnableRichMotion()` gates on a desktop-sized viewport with a fine
 *   pointer and no reduced-motion preference. Touch, small screens and
 *   reduced motion never start it: the properties stay unset, CSS falls back
 *   to 0, and the light simply sits centred and static.
 */

/** Stop the loop once the remaining travel is sub-pixel in effect. */
const SETTLE_EPSILON = 0.0008;
/** Per-frame approach rate — low enough that the light lags the cursor. */
const LERP = 0.055;

export const useHeroKeyLight = (targetRef: RefObject<HTMLElement>, enabled = true) => {
  useEffect(() => {
    if (!enabled || !shouldEnableRichMotion()) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const cancelIdle = whenIdle(() => {
      const target = targetRef.current;
      if (cancelled || !target) return;

      let currentX = 0;
      let currentY = 0;
      let targetX = 0;
      let targetY = 0;
      let raf = 0;
      let inView = true;

      const canRun = () => inView && !document.hidden;

      const frame = () => {
        raf = 0;
        if (!canRun()) return;

        currentX += (targetX - currentX) * LERP;
        currentY += (targetY - currentY) * LERP;
        target.style.setProperty('--key-nx', currentX.toFixed(4));
        target.style.setProperty('--key-ny', currentY.toFixed(4));

        if (
          Math.abs(targetX - currentX) > SETTLE_EPSILON ||
          Math.abs(targetY - currentY) > SETTLE_EPSILON
        ) {
          raf = requestAnimationFrame(frame);
        }
      };

      const kick = () => {
        if (raf === 0 && canRun()) raf = requestAnimationFrame(frame);
      };

      const onPointerMove = (event: PointerEvent) => {
        targetX = (event.clientX / window.innerWidth) * 2 - 1;
        targetY = (event.clientY / window.innerHeight) * 2 - 1;
        kick();
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });

      const io = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          kick();
        },
        { rootMargin: '120px 0px' },
      );
      io.observe(target);

      const onVisibility = () => kick();
      document.addEventListener('visibilitychange', onVisibility);

      cleanup = () => {
        if (raf !== 0) cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('visibilitychange', onVisibility);
        io.disconnect();
        target.style.removeProperty('--key-nx');
        target.style.removeProperty('--key-ny');
      };
    });

    return () => {
      cancelled = true;
      cancelIdle();
      cleanup?.();
    };
  }, [targetRef, enabled]);
};
