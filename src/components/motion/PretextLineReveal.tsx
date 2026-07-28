import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface PretextLineRevealProps {
  text: string;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  threshold?: number;
}

/**
 * A layout-stable text reveal.
 *
 * The former implementation measured every line on a canvas, observed every
 * resize and repeated the work when fonts settled. That was expensive and
 * could visibly reflow headings. Native inline wrapping already knows where
 * lines belong, so this version masks individual words and lets CSS lay them
 * out without a measurement dependency.
 */
const PretextLineReveal = ({
  text,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.08,
  once = true,
  threshold = 0.15,
}: PretextLineRevealProps) => {
  const rootRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const content = typeof text === 'string' ? text : String(text ?? '');
  const words = useMemo(() => content.trim().split(/\s+/).filter(Boolean), [content]);

  useEffect(() => {
    if (isVisible && once) return undefined;

    const node = rootRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, once, threshold]);

  if (!content) {
    return <span className={className}>{content}</span>;
  }

  return (
    <span
      ref={rootRef}
      className={cn('pretext-line-reveal', className)}
      data-ready="true"
      data-visible={isVisible ? 'true' : 'false'}
      aria-label={content}
      role="text"
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="pretext-word-wrap" aria-hidden="true">
          <span
            className={cn('pretext-line', lineClassName)}
            style={{
              transitionDelay: `${delay + Math.min(index, 7) * stagger * 0.45}s`,
            }}
          >
            {word}
          </span>
          {index < words.length - 1 ? '\u00a0' : null}
        </span>
      ))}
    </span>
  );
};

export default PretextLineReveal;
