import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface LiteSplitTextRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  threshold?: number;
}

const LiteSplitTextReveal = ({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  once = true,
  threshold = 0.15,
}: LiteSplitTextRevealProps) => {
  const rootRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const content = typeof text === 'string' ? text : String(text ?? '');
  const words = useMemo(() => content.split(/\s+/).filter(Boolean), [content]);

  useEffect(() => {
    if (isVisible && once) return;
    const node = rootRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
          return;
        }

        if (!once) {
          setIsVisible(false);
        }
      },
      { threshold },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible, once, threshold]);

  if (words.length === 0) {
    return <span className={className}>{content}</span>;
  }

  return (
    <span
      ref={rootRef}
      className={cn('inline-block lite-split-root', className)}
      data-visible={isVisible ? 'true' : 'false'}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="lite-split-word-wrap">
          <span
            className={cn('lite-split-word', wordClassName)}
            style={{
              transitionDelay: `${delay + index * stagger}s`,
            }}
          >
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </span>
  );
};

export default LiteSplitTextReveal;
