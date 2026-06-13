import { useEffect, type RefObject } from 'react';
import { loadGsap, shouldEnableRichMotion, whenIdle } from '@/lib/motion/gsap-core';

/**
 * GSAP choreography for the "Muro de trabajo" hero wall (desktop only).
 *
 * Three layers compose into one living mosaic:
 *  1. Drift — each column's inner track loops on yPercent (seamless because the
 *     poster list is doubled), alternating up/down at different speeds.
 *  2. Parallax — the pointer lerps each column on x/y with a per-column depth
 *     factor (outer columns travel more) for real dimensionality.
 *  3. Entrance — columns rise + fade in on a stagger, then the drift takes over.
 *
 * Velocity-aware: vertical scroll briefly speeds the drift, then it eases back —
 * the wall feels like it has momentum without ever hijacking the scroll.
 *
 * Idle-loaded, paused offscreen/hidden, reverted on unmount. Reduced-motion or
 * small viewports never reach here — the columns simply render static.
 */
export const useHeroWall = (rootRef: RefObject<HTMLElement>, enabled: boolean) => {
  useEffect(() => {
    if (!enabled || !shouldEnableRichMotion()) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const cancelIdle = whenIdle(async () => {
      const { gsap } = await loadGsap();
      const root = rootRef.current;
      if (cancelled || !root) return;

      const wall = root.querySelector<HTMLElement>('[data-hero-wall]');
      const columns = Array.from(root.querySelectorAll<HTMLElement>('[data-wall-col]'));
      const tracks = columns.map((col) => col.querySelector<HTMLElement>('[data-wall-track]'));
      if (!wall || columns.length === 0) return;

      const ctx = gsap.context(() => {
        // ── Drift: seamless loop over the doubled poster list ──
        const baseDurations = [30, 24, 34, 26, 38];
        const driftTweens = tracks.map((track, i) => {
          if (!track) return null;
          const duration = baseDurations[i % baseDurations.length];
          const downward = i % 2 === 1;
          return gsap.fromTo(
            track,
            { yPercent: downward ? -50 : 0 },
            {
              yPercent: downward ? 0 : -50,
              duration,
              ease: 'none',
              repeat: -1,
            },
          );
        });

        // ── Entrance: columns rise and fade, then drift carries on ──
        gsap.from(columns, {
          autoAlpha: 0,
          yPercent: 8,
          duration: 1.15,
          ease: 'power3.out',
          stagger: 0.12,
        });

        // ── Pointer parallax: per-column depth, lerped ──
        const mid = (columns.length - 1) / 2;
        const setters = columns.map((col, i) => {
          const depth = 1 - Math.abs(i - mid) / (mid + 1); // center moves least
          const reach = 26 + (1 - depth) * 34;
          return {
            x: gsap.quickTo(col, 'x', { duration: 0.8, ease: 'power3' }),
            y: gsap.quickTo(col, 'y', { duration: 0.8, ease: 'power3' }),
            reach,
          };
        });

        let pointerRaf = 0;
        let px = 0;
        let py = 0;
        const onPointerMove = (event: PointerEvent) => {
          px = (event.clientX / window.innerWidth) * 2 - 1;
          py = (event.clientY / window.innerHeight) * 2 - 1;
          if (pointerRaf === 0) {
            pointerRaf = requestAnimationFrame(() => {
              pointerRaf = 0;
              setters.forEach((s) => {
                s.x(px * s.reach);
                s.y(py * s.reach * 0.6);
              });
            });
          }
        };
        window.addEventListener('pointermove', onPointerMove, { passive: true });

        // ── Velocity-aware drift: scrolling briefly accelerates the loop ──
        let lastScroll = window.scrollY;
        let velRaf = 0;
        const onScroll = () => {
          if (velRaf !== 0) return;
          velRaf = requestAnimationFrame(() => {
            velRaf = 0;
            const now = window.scrollY;
            const vel = Math.min(Math.abs(now - lastScroll) / 8, 4);
            lastScroll = now;
            driftTweens.forEach((tw) => {
              if (!tw) return;
              gsap.to(tw, { timeScale: 1 + vel, duration: 0.2, overwrite: true });
              gsap.to(tw, { timeScale: 1, duration: 1.1, delay: 0.2, overwrite: false });
            });
          });
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        // ── Pause the whole wall while it's offscreen or the tab is hidden ──
        const allTweens = driftTweens.filter(Boolean) as gsap.core.Tween[];
        const setPaused = (paused: boolean) => allTweens.forEach((tw) => tw.paused(paused));
        const io = new IntersectionObserver(
          ([entry]) => setPaused(!entry.isIntersecting || document.hidden),
          { rootMargin: '120px 0px' },
        );
        io.observe(wall);
        const onVisibility = () => setPaused(document.hidden);
        document.addEventListener('visibilitychange', onVisibility);

        cleanup = () => {
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('scroll', onScroll);
          document.removeEventListener('visibilitychange', onVisibility);
          if (pointerRaf) cancelAnimationFrame(pointerRaf);
          if (velRaf) cancelAnimationFrame(velRaf);
          io.disconnect();
        };
      }, root);

      const revertCtx = cleanup;
      cleanup = () => {
        revertCtx?.();
        ctx.revert();
      };
    });

    return () => {
      cancelled = true;
      cancelIdle();
      cleanup?.();
    };
  }, [rootRef, enabled]);
};
