import { startTransition, useEffect, useRef, useState, type RefObject } from 'react';
import { mark, measure } from '@/lib/perf-debug';

type UseDeferredMountOptions = {
  enabled?: boolean;
  rootMargin?: string;
  queueDelayMs?: number;
  mountId: string;
};

type DeferredMountState = {
  shouldMount: boolean;
  placeholderRef: RefObject<HTMLDivElement>;
};

let nextQueueSlotAt = 0;

// Sections that have been mounted at least once survive SPA navigation.
// When the user returns to a page, sections render immediately instead of
// cycling through skeleton → lazy-load → reveal.
const persistedMountedSections = new Set<string>();

export const useDeferredMount = ({
  enabled = true,
  rootMargin = '700px 0px',
  queueDelayMs = 300,
  mountId,
}: UseDeferredMountOptions): DeferredMountState => {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const scheduledRef = useRef(false);
  // Initialise as already-mounted when the section was previously shown in
  // this browser session (survives SPA navigations away and back).
  const [shouldMount, setShouldMount] = useState(() => persistedMountedSections.has(mountId));

  useEffect(() => {
    if (!enabled) {
      setShouldMount(false);
      scheduledRef.current = false;
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    if (shouldMount) return;

    const node = placeholderRef.current;
    if (!node) return;

    const scheduleMount = () => {
      if (scheduledRef.current) return;
      scheduledRef.current = true;

      const now = performance.now();
      const delay = Math.max(0, nextQueueSlotAt - now);
      nextQueueSlotAt = Math.max(nextQueueSlotAt, now) + queueDelayMs;

      const queuedMark = `${mountId}:queued`;
      const mountedMark = `${mountId}:mounted`;

      mark(queuedMark);

      timeoutRef.current = window.setTimeout(() => {
        startTransition(() => {
          setShouldMount(true);
        });
        persistedMountedSections.add(mountId);
        mark(mountedMark);
        measure(queuedMark, mountedMark, `${mountId}:deferred-mount`);
        timeoutRef.current = null;
      }, delay);
    };

    if (typeof window.IntersectionObserver === 'undefined') {
      scheduleMount();
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        scheduleMount();
      },
      { rootMargin },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [enabled, mountId, queueDelayMs, rootMargin, shouldMount]);

  return { shouldMount, placeholderRef };
};
