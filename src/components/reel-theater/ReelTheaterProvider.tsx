import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { track } from '@vercel/analytics/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TheaterVideo from '@/components/media/TheaterVideo';
import { ALL_REEL_CLIPS, getReelTitle } from '@/data/reel-catalog';
import { getBestPosterSrc, type ReelClip } from '@/data/portfolio-clips';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  ReelTheaterContext,
  type OpenReelOptions,
  type ReelTheaterContextValue,
} from '@/components/reel-theater/reel-theater-context';

const isQuickTimeSource = (src?: string) => Boolean(src && /\.mov(?:$|\?)/iu.test(src));

const unique = (values: Array<string | undefined>) =>
  values.filter((value, index, all): value is string => Boolean(value) && all.indexOf(value) === index);

export const ReelTheaterProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [activeClip, setActiveClip] = useState<ReelClip | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isVisible, setIsVisible] = useState(false);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isOpen = activeClip !== null;

  const openReel = useCallback((clip: ReelClip, options: OpenReelOptions = {}) => {
    restoreFocusRef.current = options.trigger ?? (document.activeElement as HTMLElement | null);
    setActiveClip(clip);
    setActiveIndex(Math.max(0, ALL_REEL_CLIPS.findIndex((candidate) => candidate.id === clip.id)));
    requestAnimationFrame(() => {
      setIsVisible(true);
      closeButtonRef.current?.focus({ preventScroll: true });
    });

    if (options.source === 'director') {
      track('Cinematic Reel Opened', {
        clipId: String(clip.id),
        category: clip.category,
      });
    }
  }, []);

  const closeReel = useCallback(() => {
    setIsVisible(false);
    window.setTimeout(() => {
      setActiveClip(null);
      setActiveIndex(-1);
      restoreFocusRef.current?.focus({ preventScroll: true });
    }, 220);
  }, []);

  const navigate = useCallback((direction: 1 | -1) => {
    setActiveIndex((currentIndex) => {
      if (currentIndex < 0) return currentIndex;
      const nextIndex = (currentIndex + direction + ALL_REEL_CLIPS.length) % ALL_REEL_CLIPS.length;
      setActiveClip(ALL_REEL_CLIPS[nextIndex] ?? null);
      return nextIndex;
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const previousBody = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.dataset.theater = 'open';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeReel();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigate(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigate(-1);
      } else if (event.key === 'Tab') {
        const focusable = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
          ) ?? [],
        ).filter((element) => element.offsetParent !== null);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      delete document.documentElement.dataset.theater;
      document.body.style.position = previousBody.position;
      document.body.style.top = previousBody.top;
      document.body.style.width = previousBody.width;
      document.body.style.overflow = previousBody.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [closeReel, isOpen, navigate]);

  const sources = useMemo(() => {
    if (!activeClip) return [];
    return unique(
      isQuickTimeSource(activeClip.mainSrc)
        ? [activeClip.mobileSrc, activeClip.mainSrc, activeClip.previewSrc]
        : [activeClip.mainSrc, activeClip.mobileSrc, activeClip.previewSrc],
    );
  }, [activeClip]);

  const hlsSources = useMemo(() => {
    if (!activeClip) return [];
    return unique(
      isQuickTimeSource(activeClip.mainSrc)
        ? [activeClip.mobileHlsSrc, activeClip.hlsSrc, activeClip.previewHlsSrc]
        : [activeClip.hlsSrc, activeClip.mobileHlsSrc, activeClip.previewHlsSrc],
    );
  }, [activeClip]);

  const value = useMemo<ReelTheaterContextValue>(
    () => ({ activeClip, isOpen, openReel, closeReel }),
    [activeClip, closeReel, isOpen, openReel],
  );

  return (
    <ReelTheaterContext.Provider value={value}>
      {children}
      {activeClip && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={dialogRef}
              className="reel-theater fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-4"
              role="dialog"
              aria-modal="true"
              aria-label={t('portfolio.reelPreviewLabel')}
              data-visible={isVisible || undefined}
              onClick={closeReel}
            >
              <div className="reel-theater__backdrop absolute inset-0" />
              <div className="relative w-full max-w-[430px]">
                <button
                  type="button"
                  className="theater-control absolute left-0 top-1/2 z-20 h-11 w-11 -translate-x-[118%] -translate-y-1/2 max-md:hidden"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(-1);
                  }}
                  aria-label={t('portfolio.reelPreviewPrev')}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="theater-control absolute right-0 top-1/2 z-20 h-11 w-11 translate-x-[118%] -translate-y-1/2 max-md:hidden"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(1);
                  }}
                  aria-label={t('portfolio.reelPreviewNext')}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div
                  className="reel-theater__card relative overflow-hidden rounded-[1.45rem] border border-white/20 bg-black shadow-[0_34px_82px_-38px_rgba(0,0,0,0.9)]"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    ref={closeButtonRef}
                    type="button"
                    className="theater-control absolute right-3 top-3 z-30 h-10 w-10"
                    onClick={closeReel}
                    aria-label={t('portfolio.reelPreviewClose')}
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <TheaterVideo
                    key={activeClip.id}
                    sources={sources}
                    hlsSources={hlsSources}
                    poster={getBestPosterSrc(activeClip)}
                    enableStartupFallback={isMobile}
                  />

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
                    <div className="h-36 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-5 sm:pb-5">
                      <p className="theater-meta-chip inline-flex rounded-full px-2.5 py-1">
                        {t(`portfolio.categories.${activeClip.category}`)}
                      </p>
                      <h4 className="theater-meta-title mt-2 max-w-[88%] text-base leading-snug sm:text-lg">
                        {getReelTitle(activeClip, t)}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-center gap-3 md:hidden">
                  <button type="button" className="theater-control h-11 w-11" onClick={() => navigate(-1)} aria-label={t('portfolio.reelPreviewPrev')}>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-[10px] font-semibold uppercase tracking-prestige text-white/55">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(ALL_REEL_CLIPS.length).padStart(2, '0')}
                  </span>
                  <button type="button" className="theater-control h-11 w-11" onClick={() => navigate(1)} aria-label={t('portfolio.reelPreviewNext')}>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </ReelTheaterContext.Provider>
  );
};
