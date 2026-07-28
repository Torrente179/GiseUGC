import { useCallback } from 'react';
import type { MouseEvent } from 'react';

let activeScrollFrameId: number | null = null;

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

const cancelActiveScroll = () => {
  if (activeScrollFrameId === null) return;
  cancelAnimationFrame(activeScrollFrameId);
  activeScrollFrameId = null;
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
 * JS-powered smooth scroll using a premium easing curve (interruptible via rAF).
 */
const smoothScrollTo = (targetElement: HTMLElement, duration = 900) => {
  const targetY = targetElement.getBoundingClientRect().top + window.scrollY;
  const startY = window.scrollY;
  const distance = targetY - startY;
  const absoluteDistance = Math.abs(distance);

  if (absoluteDistance < 1) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, targetY);
    return;
  }

  cancelActiveScroll();
  const resolvedDuration = Math.min(1080, Math.max(700, Math.max(duration, absoluteDistance * 0.42)));
  let startTime: number | null = null;

  const step = (timestamp: number) => {
    if (startTime === null) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / resolvedDuration, 1);
    const eased = premiumEaseScroll(progress);

    window.scrollTo(0, startY + distance * eased);

    if (progress < 1) {
      activeScrollFrameId = requestAnimationFrame(step);
      return;
    }

    activeScrollFrameId = null;
  };

  activeScrollFrameId = requestAnimationFrame(step);
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
