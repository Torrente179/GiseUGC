import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

const getPixelValue = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getLineHeight = (style: CSSStyleDeclaration) => {
  const lineHeight = getPixelValue(style.lineHeight);
  if (lineHeight !== null) return lineHeight;
  const fontSize = getPixelValue(style.fontSize) ?? 16;
  return fontSize * 1.2;
};

const getCanvasFont = (style: CSSStyleDeclaration) =>
  [
    style.fontStyle !== 'normal' ? style.fontStyle : '',
    style.fontVariant !== 'normal' ? style.fontVariant : '',
    style.fontWeight !== 'normal' ? style.fontWeight : '',
    style.fontStretch && style.fontStretch !== 'normal' ? style.fontStretch : '',
    style.fontSize,
    style.fontFamily,
  ]
    .filter(Boolean)
    .join(' ');

const haveSameLines = (previous: string[] | null, next: string[]) =>
  previous !== null &&
  previous.length === next.length &&
  previous.every((line, index) => line === next[index]);

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
  const frameRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [fontEpoch, setFontEpoch] = useState(0);
  const [lines, setLines] = useState<string[] | null>(null);
  const content = typeof text === 'string' ? text : String(text ?? '');

  const measureLines = useCallback(() => {
    const node = rootRef.current;
    if (!node || !content) {
      setLines(null);
      return;
    }

    const width = node.getBoundingClientRect().width;
    if (!Number.isFinite(width) || width <= 0) return;

    const style = window.getComputedStyle(node);
    const font = getCanvasFont(style);
    if (!font) {
      setLines(null);
      return;
    }

    try {
      const prepared = prepareWithSegments(content, font);
      const nextLines = layoutWithLines(prepared, width, getLineHeight(style)).lines.map((line) => line.text);
      setLines((previous) => (haveSameLines(previous, nextLines) ? previous : nextLines));
    } catch {
      setLines(null);
    }
  }, [content]);

  const scheduleMeasure = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      measureLines();
    });
  }, [measureLines]);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return undefined;

    scheduleMeasure();

    const node = rootRef.current;
    if (!node) return undefined;

    window.addEventListener('resize', scheduleMeasure);

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        window.removeEventListener('resize', scheduleMeasure);
        if (frameRef.current !== null) {
          window.cancelAnimationFrame(frameRef.current);
        }
      };
    }

    const observer = new ResizeObserver(() => {
      scheduleMeasure();
    });
    observer.observe(node);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', scheduleMeasure);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [fontEpoch, scheduleMeasure]);

  useEffect(() => {
    if (typeof document === 'undefined' || !('fonts' in document)) return undefined;

    let cancelled = false;
    const fontSet = document.fonts;
    const refreshAfterFonts = () => {
      if (!cancelled) {
        setFontEpoch((previous) => previous + 1);
      }
    };

    void fontSet.ready.then(refreshAfterFonts);

    if (typeof fontSet.addEventListener === 'function') {
      fontSet.addEventListener('loadingdone', refreshAfterFonts);
      return () => {
        cancelled = true;
        fontSet.removeEventListener('loadingdone', refreshAfterFonts);
      };
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isVisible && once) return undefined;

    const node = rootRef.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
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

  if (!content) {
    return <span className={className}>{content}</span>;
  }

  const renderedLines = lines && lines.length > 0 ? lines : [content];

  return (
    <span
      ref={rootRef}
      className={cn('pretext-line-reveal', className)}
      data-ready={lines && lines.length > 0 ? 'true' : 'false'}
      data-visible={isVisible ? 'true' : 'false'}
      aria-label={content}
      role="text"
    >
      {renderedLines.map((line, index) => (
        <span key={`${index}-${line}`} className="pretext-line-wrap" aria-hidden="true">
          <span
            className={cn('pretext-line', lineClassName)}
            style={{
              transitionDelay: `${delay + index * stagger}s`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
};

export default PretextLineReveal;
