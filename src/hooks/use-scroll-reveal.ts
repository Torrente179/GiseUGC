import { useEffect, useRef } from 'react';

// Adds the `is-visible` class once the element scrolls into view, driving a
// CSS-only reveal. Falls back to immediately visible when IntersectionObserver
// is unavailable (SSR/old browsers). Shared by the landing-page templates.
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      node?.classList.add('is-visible');
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.classList.add('is-visible');
          observer.unobserve(node);
        }
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.06 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}
