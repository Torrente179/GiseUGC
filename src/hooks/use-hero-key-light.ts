import { useEffect, type RefObject } from 'react';
import { shouldEnableRichMotion, whenIdle } from '@/lib/motion/runtime';

/**
 * "Key light" — one practical light source for the title-sequence hero.
 *
 * The pointer *is* the lamp. This hook publishes a single normalised light
 * position as a compositor transform on the light layer itself. Moving the
 * already-rasterized gradient avoids repainting a viewport-sized gradient on
 * every pointer frame.
 *
 * Interpolating two unitless numbers needs one settling rAF and a lerp, so the
 * first interaction never coordinates with a global animation runtime.
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
/** Time constant keeps the same feel at 60 Hz, 90 Hz, and 120 Hz. */
const FOLLOW_TIME_CONSTANT_MS = 290;

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
      let previousTimestamp: number | null = null;

      const canRun = () => inView && !document.hidden;
      const stop = () => {
        if (raf !== 0) cancelAnimationFrame(raf);
        raf = 0;
        previousTimestamp = null;
        target.style.willChange = 'auto';
      };

      const frame = (timestamp: number) => {
        raf = 0;
        if (!canRun()) {
          target.style.willChange = 'auto';
          return;
        }

        const deltaMs =
          previousTimestamp === null
            ? 1000 / 60
            : Math.min(Math.max(timestamp - previousTimestamp, 0), 50);
        previousTimestamp = timestamp;
        const follow = 1 - Math.exp(-deltaMs / FOLLOW_TIME_CONSTANT_MS);

        currentX += (targetX - currentX) * follow;
        currentY += (targetY - currentY) * follow;
        target.style.transform = `translate3d(${(currentX * 26.25).toFixed(3)}%, ${(currentY * 24.7).toFixed(3)}%, 0)`;

        if (
          Math.abs(targetX - currentX) > SETTLE_EPSILON ||
          Math.abs(targetY - currentY) > SETTLE_EPSILON
        ) {
          raf = requestAnimationFrame(frame);
        } else {
          target.style.willChange = 'auto';
        }
      };

      const kick = () => {
        if (raf === 0 && canRun()) {
          target.style.willChange = 'transform';
          previousTimestamp = null;
          raf = requestAnimationFrame(frame);
        }
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
          if (inView) kick();
          else stop();
        },
        { rootMargin: '120px 0px' },
      );
      io.observe(target);

      const onVisibility = () => {
        if (document.hidden) stop();
        else kick();
      };
      document.addEventListener('visibilitychange', onVisibility);

      cleanup = () => {
        stop();
        window.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('visibilitychange', onVisibility);
        io.disconnect();
        target.style.removeProperty('transform');
        target.style.removeProperty('will-change');
      };
    });

    return () => {
      cancelled = true;
      cancelIdle();
      cleanup?.();
    };
  }, [targetRef, enabled]);
};
