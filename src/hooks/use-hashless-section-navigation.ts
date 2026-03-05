import { useCallback } from 'react';
import type { MouseEvent } from 'react';

const stripHashFromUrl = () => {
  if (!window.location.hash) {
    return;
  }

  const cleanPath = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, '', cleanPath);
};

export const clearUrlHash = () => {
  stripHashFromUrl();
};

/**
 * Custom easing function matching the site's premiumEase curve [0.22, 1, 0.36, 1].
 * Uses a cubic-bezier approximation for JS-powered smooth scroll.
 */
const premiumEaseScroll = (t: number): number => {
  // Approximation of cubic-bezier(0.22, 1, 0.36, 1) — fast start, long settle
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

let cancelActiveScroll: (() => void) | null = null;

/**
 * JS-powered smooth scroll with custom easing for a premium, consistent feel
 * across all browsers (native smooth scroll uses different easing per browser).
 */
const smoothScrollTo = (targetY: number, duration = 620) => {
  const startY = window.scrollY;
  const distance = targetY - startY;

  if (Math.abs(distance) < 1) return;

  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, targetY);
    return;
  }

  let startTime: number | null = null;
  let frameId: number | null = null;
  let cancelled = false;

  const stop = () => {
    cancelled = true;
    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
      frameId = null;
    }
    removeCancelListeners();
    if (cancelActiveScroll === stop) {
      cancelActiveScroll = null;
    }
  };

  const cancelEvents: Array<keyof WindowEventMap> = ['wheel', 'touchstart', 'keydown'];
  const handleUserCancel = () => stop();

  const removeCancelListeners = () => {
    cancelEvents.forEach((eventName) => {
      window.removeEventListener(eventName, handleUserCancel);
    });
  };

  cancelActiveScroll?.();
  cancelActiveScroll = stop;
  cancelEvents.forEach((eventName) => {
    window.addEventListener(eventName, handleUserCancel, { passive: true });
  });

  const step = (timestamp: number) => {
    if (cancelled) return;
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = premiumEaseScroll(progress);

    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      frameId = requestAnimationFrame(step);
      return;
    }

    stop();
  };

  frameId = requestAnimationFrame(step);
};

export const useHashlessSectionNavigation = () => {
  const navigateToSection = useCallback((targetId: string) => {
    if (!targetId) {
      return false;
    }

    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      return false;
    }

    const targetY = targetElement.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(targetY);
    stripHashFromUrl();
    return true;
  }, []);

  const handleHashLinkClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, onComplete?: () => void) => {
      const href = event.currentTarget.getAttribute('href');
      const targetId = href?.startsWith('#') ? href.slice(1) : '';
      const didNavigate = navigateToSection(targetId);

      if (didNavigate) {
        event.preventDefault();
      }

      onComplete?.();
    },
    [navigateToSection],
  );

  return {
    handleHashLinkClick,
    navigateToSection,
  };
};
