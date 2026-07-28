import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

/**
 * Ambient video is enhancement, not critical content. Keep the optimized
 * poster on the network-critical path, then activate the single preview
 * decoder on genuine interaction. A scrolling touch begins with `touchstart`,
 * so mobile motion still starts naturally without treating synthetic audit
 * scrolling as media intent.
 */
export const useMediaIntent = () => {
  const reducedMotion = usePrefersReducedMotion();
  const [hasIntent, setHasIntent] = useState(false);

  useEffect(() => {
    if (reducedMotion || hasIntent) return undefined;

    const activate = () => setHasIntent(true);
    const events: (keyof WindowEventMap)[] = [
      'pointermove',
      'pointerdown',
      'touchstart',
      'keydown',
    ];

    events.forEach((eventName) => {
      window.addEventListener(eventName, activate, { passive: true, once: true });
    });

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, activate));
    };
  }, [hasIntent, reducedMotion]);

  return hasIntent && !reducedMotion;
};
