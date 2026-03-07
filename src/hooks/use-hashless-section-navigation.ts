import { useCallback } from 'react';
import type { MouseEvent } from 'react';
import { getLenis } from '@/lib/smooth-scroll';

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

/**
 * Smooth scroll using Lenis when available (desktop), with JS-powered fallback.
 */
const smoothScrollTo = (targetElement: HTMLElement, duration = 900) => {
  // Use Lenis when available — physics-based, interruptible scrolling
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(targetElement, { duration: 1.2, offset: 0 });
    return;
  }

  // Fallback: JS-powered smooth scroll with custom easing
  const targetY = targetElement.getBoundingClientRect().top + window.scrollY;
  const startY = window.scrollY;
  const distance = targetY - startY;

  if (Math.abs(distance) < 1) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, targetY);
    return;
  }

  let startTime: number | null = null;

  const step = (timestamp: number) => {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = premiumEaseScroll(progress);

    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
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

    smoothScrollTo(targetElement);
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
