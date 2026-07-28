import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import TheaterVideo from '@/components/media/TheaterVideo';
import type { PlaybackCandidate } from '@/lib/media-assets';

type MediaTheaterProps = {
  candidates: PlaybackCandidate[];
  poster: string;
  category: string;
  title: string;
  duration?: string | null;
  closeLabel: string;
  previousLabel: string;
  nextLabel: string;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

const EXIT_DURATION_MS = 180;

const MediaTheater = ({
  candidates,
  poster,
  category,
  title,
  duration,
  closeLabel,
  previousLabel,
  nextLabel,
  onClose,
  onPrevious,
  onNext,
}: MediaTheaterProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  const requestClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(onClose, EXIT_DURATION_MS);
  }, [isClosing, onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClose();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNext();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrevious();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onNext, onPrevious, requestClose]);

  useEffect(() => {
    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    const previousBody = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      overscrollBehavior: body.style.overscrollBehavior,
    };
    const previousHtml = {
      overflow: html.style.overflow,
      overscrollBehavior: html.style.overscrollBehavior,
      scrollBehavior: html.style.scrollBehavior,
    };

    Object.assign(body.style, {
      position: 'fixed',
      top: `-${scrollY}px`,
      left: '0',
      right: '0',
      width: '100%',
      overflow: 'hidden',
      overscrollBehavior: 'none',
    });
    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    html.dataset.theater = 'open';

    return () => {
      delete html.dataset.theater;
      Object.assign(body.style, previousBody);
      html.style.overflow = previousHtml.overflow;
      html.style.overscrollBehavior = previousHtml.overscrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollY);
      html.style.scrollBehavior = previousHtml.scrollBehavior;
    };
  }, []);

  const stopPropagation = (event: React.MouseEvent) => event.stopPropagation();
  const handleNavigation = (
    event: React.MouseEvent<HTMLButtonElement>,
    callback: () => void,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    callback();
  };

  return (
    <div
      className={`media-theater fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4${isClosing ? ' is-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={requestClose}
    >
      <div className="media-theater-backdrop absolute inset-0 bg-[hsl(var(--theater-backdrop)/0.86)]" />
      <div
        className="media-theater-backdrop pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at 20% 14%, hsl(var(--theater-backdrop-glow) / 0.14) 0%, transparent 48%), radial-gradient(circle at 82% 86%, hsl(var(--theater-backdrop-glow) / 0.1) 0%, transparent 56%)' }}
      />
      <div className="media-theater-card relative w-full max-w-[430px]">
        <button
          type="button"
          className="theater-control absolute left-0 top-1/2 z-[220] h-9 w-9 -translate-x-[118%] -translate-y-1/2 md:h-10 md:w-10"
          onClick={(event) => handleNavigation(event, onPrevious)}
          aria-label={previousLabel}
        >
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
        </button>
        <button
          type="button"
          className="theater-control absolute right-0 top-1/2 z-[220] h-9 w-9 translate-x-[118%] -translate-y-1/2 md:h-10 md:w-10"
          onClick={(event) => handleNavigation(event, onNext)}
          aria-label={nextLabel}
        >
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
        </button>

        <div
          className="relative w-full overflow-hidden rounded-[1.45rem] border border-[hsl(var(--theater-edge)/0.88)] bg-black shadow-[0_34px_82px_-38px_rgba(0,0,0,0.78)]"
          onClick={stopPropagation}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="theater-control absolute right-3 top-3 z-30 h-9 w-9"
            onClick={(event) => handleNavigation(event, requestClose)}
            aria-label={closeLabel}
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative">
            <TheaterVideo
              candidates={candidates}
              poster={poster}
              enableStartupFallback
              startupFallbackMs={2500}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
              <div className="h-36 bg-gradient-to-t from-black/80 via-black/28 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-5 sm:pb-5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="theater-meta-chip inline-flex max-w-[78%] items-center rounded-full px-2.5 py-1">
                    {category}
                  </p>
                  {duration ? (
                    <p className="theater-meta-chip inline-flex items-center rounded-full px-2.5 py-1">
                      {duration}
                    </p>
                  ) : null}
                </div>
                <h4 className="theater-meta-title mt-2 max-w-[88%] text-base leading-snug sm:text-lg">
                  {title}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaTheater;
