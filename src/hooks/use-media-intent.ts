import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

type MediaIntentOptions = {
  /**
   * Start without waiting for interaction, once the document has finished
   * loading. For media that *is* the page's subject rather than ambient
   * decoration — a service page's hero reel is the first thing the visitor
   * came to see, so making them scroll to start it reads as a broken video.
   */
  autoStart?: boolean;
};

/**
 * Ambient video is enhancement, not critical content. Keep the optimized
 * poster on the network-critical path, then activate the single preview
 * decoder on genuine interaction. A scrolling touch begins with `touchstart`,
 * so mobile motion still starts naturally without treating synthetic audit
 * scrolling as media intent.
 */
export const useMediaIntent = ({ autoStart = false }: MediaIntentOptions = {}) => {
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

    // Waiting for `load` rather than mounting straight into playback keeps the
    // poster, fonts and hero copy ahead of the reel on the critical path — the
    // whole point of the gate — while still starting on its own. Nothing is
    // deferred behind a frame: rAF never fires in a background tab, which would
    // strand the hero on its poster until the tab was looked at.
    if (autoStart) {
      if (document.readyState === 'complete') {
        activate();
      } else {
        window.addEventListener('load', activate, { once: true });
      }
    }

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, activate));
      window.removeEventListener('load', activate);
    };
  }, [autoStart, hasIntent, reducedMotion]);

  return hasIntent && !reducedMotion;
};
