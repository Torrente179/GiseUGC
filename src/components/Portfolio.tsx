import { useRef, useState, useCallback, useEffect, useMemo, type TouchEvent, type SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { revealUp, springHoverTransition, staggerContainer } from '@/components/motion/variants';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import LazyVideo from '@/components/media/LazyVideo';

interface ReelClip {
  id: number;
  titleKey: string;
  category: 'fashion' | 'beauty' | 'tech' | 'lifestyle';
  mainSrc: string;
  mobileSrc: string;
  previewSrc: string;
  posterSrc: string;
}

interface CollageClip {
  id: number;
  labelKey: string;
  previewSrc: string;
  posterSrc: string;
  /* Corner position (spread out, paused state) */
  cornerClass: string;
  /* Hovered position (gathered together, playing state) */
  hoverClass: string;
}

type TheaterSwipeGesture = {
  x: number;
  y: number;
  timestamp: number;
  axis: 'pending' | 'vertical' | 'horizontal';
};

const THEATER_CLOSE_DURATION_MS = 320;
const THEATER_SWIPE_DISTANCE_THRESHOLD = 110;
const THEATER_SWIPE_VELOCITY_THRESHOLD = 0.45;
const THEATER_HORIZONTAL_SWIPE_DISTANCE_THRESHOLD = 72;
const THEATER_HORIZONTAL_SWIPE_VELOCITY_THRESHOLD = 0.35;
const THEATER_MAX_DRAG_DISTANCE = 260;
const REEL_CARD_TAP_SLOP_PX = 10;
const THEATER_WARM_PRELOAD_OFFSETS = [-1, 1] as const;
const THEATER_HINT_PRELOAD_OFFSETS = [-2, 2] as const;
const THEATER_VERTICAL_NAV_SWIPE_DISTANCE_THRESHOLD = 72;
const THEATER_VERTICAL_NAV_SWIPE_VELOCITY_THRESHOLD = 0.35;
const THEATER_FAST_FALLBACK_MS = 420;
const R2_MEDIA_BASE_URL = 'https://media.giselasaldarriaga.com';
const r2MainVideo = (filename: string) => `${R2_MEDIA_BASE_URL}/videos/main/${filename}`;
const r2MobileVideo = (filename: string) =>
  `${R2_MEDIA_BASE_URL}/videos/mobile/${filename.replace(/\.mp4$/, '-mobile.mp4')}`;
const r2PreviewVideo = (filename: string) =>
  `${R2_MEDIA_BASE_URL}/videos/previews/${filename.replace(/\.mp4$/, '-preview.mp4')}`;
const r2Poster = (filename: string) => `${R2_MEDIA_BASE_URL}/videos/posters/${filename}`;

const REEL_CLIPS: ReelClip[] = [
  {
    id: 1,
    titleKey: 'portfolio.items.item1',
    category: 'lifestyle',
    mainSrc: r2MainVideo('ugc-lifestyle-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-lifestyle-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-lifestyle-review.mp4'),
    posterSrc: r2Poster('ugc-lifestyle-review-poster.jpg'),
  },
  {
    id: 2,
    titleKey: 'portfolio.items.item2',
    category: 'fashion',
    mainSrc: r2MainVideo('ugc-brand-spokesperson.mp4'),
    mobileSrc: r2MobileVideo('ugc-brand-spokesperson.mp4'),
    previewSrc: r2PreviewVideo('ugc-brand-spokesperson.mp4'),
    posterSrc: r2Poster('ugc-brand-spokesperson-poster.jpg'),
  },
  {
    id: 3,
    titleKey: 'portfolio.items.item3',
    category: 'tech',
    mainSrc: r2MainVideo('ugc-voicebot-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-voicebot-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-voicebot-review.mp4'),
    posterSrc: r2Poster('ugc-voicebot-review-poster.jpg'),
  },
  {
    id: 4,
    titleKey: 'portfolio.items.item4',
    category: 'beauty',
    mainSrc: r2MainVideo('ugc-creatine-supplement-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-creatine-supplement-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-creatine-supplement-review.mp4'),
    posterSrc: r2Poster('ugc-creatine-supplement-review-poster.jpg'),
  },
  {
    id: 5,
    titleKey: 'portfolio.items.item5',
    category: 'lifestyle',
    mainSrc: r2MainVideo('ugc-business-promotion.mp4'),
    mobileSrc: r2MobileVideo('ugc-business-promotion.mp4'),
    previewSrc: r2PreviewVideo('ugc-business-promotion.mp4'),
    posterSrc: r2Poster('ugc-business-promotion-poster.jpg'),
  },
  {
    id: 6,
    titleKey: 'portfolio.items.item6',
    category: 'fashion',
    mainSrc: r2MainVideo('ugc-services-presentation.mp4'),
    mobileSrc: r2MobileVideo('ugc-services-presentation.mp4'),
    previewSrc: r2PreviewVideo('ugc-services-presentation.mp4'),
    posterSrc: r2Poster('ugc-services-presentation-poster.jpg'),
  },
  {
    id: 7,
    titleKey: 'portfolio.items.item7',
    category: 'tech',
    mainSrc: r2MainVideo('ugc-ai-services-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-ai-services-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-ai-services-review.mp4'),
    posterSrc: r2Poster('ugc-ai-services-review-poster.jpg'),
  },
  {
    id: 8,
    titleKey: 'portfolio.items.item8',
    category: 'lifestyle',
    mainSrc: r2MainVideo('ugc-lifestyle-review-2.mp4'),
    mobileSrc: r2MobileVideo('ugc-lifestyle-review-2.mp4'),
    previewSrc: r2PreviewVideo('ugc-lifestyle-review-2.mp4'),
    posterSrc: r2Poster('ugc-lifestyle-review-2-poster.jpg'),
  },
  {
    id: 9,
    titleKey: 'portfolio.items.item9',
    category: 'tech',
    mainSrc: r2MainVideo('ugc-voiceover-bots-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-voiceover-bots-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-voiceover-bots-review.mp4'),
    posterSrc: r2Poster('ugc-voiceover-bots-review-poster.jpg'),
  },
  {
    id: 10,
    titleKey: 'portfolio.items.item10',
    category: 'lifestyle',
    mainSrc: r2MainVideo('ugc-lifestyle-review-3.mp4'),
    mobileSrc: r2MobileVideo('ugc-lifestyle-review-3.mp4'),
    previewSrc: r2PreviewVideo('ugc-lifestyle-review-3.mp4'),
    posterSrc: r2Poster('ugc-lifestyle-review-3-poster.jpg'),
  },
];

const COLLAGE_CLIPS: CollageClip[] = [
  {
    id: 1,
    labelKey: 'portfolio.collageClip1',
    previewSrc: r2PreviewVideo('ugc-clothing-showcase-1.mp4'),
    posterSrc: r2Poster('ugc-clothing-showcase-1-poster.jpg'),
    /* Left card */
    cornerClass: 'top-[13%] left-[8%] w-[29%] -rotate-[6deg] z-30',
    hoverClass: 'top-[12%] left-[16%] w-[29%] -rotate-[2deg] z-40',
  },
  {
    id: 2,
    labelKey: 'portfolio.collageClip2',
    previewSrc: r2PreviewVideo('ugc-clothing-showcase-2.mp4'),
    posterSrc: r2Poster('ugc-clothing-showcase-2-poster.jpg'),
    /* Center card */
    cornerClass: 'top-[5%] left-[35%] w-[30%] rotate-0 z-50',
    hoverClass: 'top-[7%] left-[35%] w-[30%] rotate-0 z-50 scale-[1.03]',
  },
  {
    id: 3,
    labelKey: 'portfolio.collageClip3',
    previewSrc: r2PreviewVideo('ugc-clothing-showcase-3.mp4'),
    posterSrc: r2Poster('ugc-clothing-showcase-3-poster.jpg'),
    /* Right card */
    cornerClass: 'top-[13%] right-[8%] w-[29%] rotate-[6deg] z-30',
    hoverClass: 'top-[12%] right-[16%] w-[29%] rotate-[2deg] z-40',
  },
];

const TheaterVideo = ({ sources, poster }: { sources: string[]; poster: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const startupTimeoutRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSourceIndex, setActiveSourceIndex] = useState(0);
  const sourceKey = sources.join('|');
  const activeSource = sources[activeSourceIndex] ?? sources[0] ?? '';

  const clearStartupTimeout = useCallback(() => {
    if (startupTimeoutRef.current !== null) {
      window.clearTimeout(startupTimeoutRef.current);
      startupTimeoutRef.current = null;
    }
  }, []);

  const promoteFallbackSource = useCallback(() => {
    setActiveSourceIndex((previousIndex) => {
      if (previousIndex + 1 >= sources.length) return previousIndex;
      return previousIndex + 1;
    });
  }, [sources.length]);

  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultPlaybackRate = 1;
    video.playbackRate = 1;

    const run = async () => {
      try {
        await video.play();
      } catch {
        if (!video.muted) {
          video.muted = true;
        }
        try {
          await video.play();
        } catch {
          promoteFallbackSource();
        }
      }
    };

    void run();
  }, [promoteFallbackSource]);

  const scheduleStartupFallback = useCallback(() => {
    clearStartupTimeout();
    if (activeSourceIndex + 1 >= sources.length) return;
    startupTimeoutRef.current = window.setTimeout(() => {
      const video = videoRef.current;
      if (!video || !video.paused || video.readyState >= 2) return;
      promoteFallbackSource();
    }, THEATER_FAST_FALLBACK_MS);
  }, [activeSourceIndex, clearStartupTimeout, promoteFallbackSource, sources.length]);

  const handlePlay = () => {
    clearStartupTimeout();
    setIsPlaying(true);
  };
  const handlePause = () => setIsPlaying(false);
  const handleWaiting = () => setIsPlaying(false);
  const handlePlaying = () => {
    clearStartupTimeout();
    setIsPlaying(true);
  };

  const handleError = useCallback(() => {
    clearStartupTimeout();
    promoteFallbackSource();
  }, [clearStartupTimeout, promoteFallbackSource]);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.defaultPlaybackRate = 1;
    video.playbackRate = 1;
    if (video.paused) {
      video.muted = false;
      attemptPlay();
    } else {
      video.pause();
    }
  }, [attemptPlay]);

  const handleTimeUpdate = useCallback((e: SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (!video.paused && !isPlaying) setIsPlaying(true);
  }, [isPlaying]);

  useEffect(() => {
    setActiveSourceIndex(0);
  }, [sourceKey]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeSource) return;

    setIsPlaying(false);
    video.load();
    scheduleStartupFallback();
    attemptPlay();

    return () => {
      clearStartupTimeout();
    };
  }, [activeSource, attemptPlay, clearStartupTimeout, scheduleStartupFallback]);

  useEffect(() => {
    return () => clearStartupTimeout();
  }, [clearStartupTimeout]);

  return (
    <div className="relative overflow-hidden rounded-[1.25rem] border border-white/25 bg-black shadow-[0_20px_52px_-30px_hsl(var(--foreground)/0.9)]">
      <video
        ref={videoRef}
        className="w-full aspect-[9/16] object-cover"
        src={activeSource}
        poster={poster}
        preload="auto"
        autoPlay
        playsInline
        onLoadedMetadata={(event) => {
          event.currentTarget.defaultPlaybackRate = 1;
          event.currentTarget.playbackRate = 1;
        }}
        onPlay={handlePlay}
        onPause={handlePause}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onError={handleError}
        onTimeUpdate={handleTimeUpdate}
      />
      <button
        type="button"
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onClick={togglePlayback}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-lg">
          {isPlaying ? (
            <Pause className="h-6 w-6 text-foreground/80" fill="currentColor" />
          ) : (
            <Play className="h-6 w-6 text-foreground/80 ml-1" fill="currentColor" />
          )}
        </span>
      </button>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
};

const Portfolio = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const isMobile = useIsMobile();

  const [activeReelPreview, setActiveReelPreview] = useState<ReelClip | null>(null);
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [activeMobileReelIndex, setActiveMobileReelIndex] = useState(0);
  const isTheaterOpen = activeReelPreview !== null;
  const [collageHovered, setCollageHovered] = useState(false);
  const [theaterDragY, setTheaterDragY] = useState(0);
  const [isTheaterDragging, setIsTheaterDragging] = useState(false);
  const [isTheaterVisible, setIsTheaterVisible] = useState(false);
  const [isTheaterDismissing, setIsTheaterDismissing] = useState(false);
  const [theaterDismissDirection, setTheaterDismissDirection] = useState<1 | -1>(1);

  const collageVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const reelScrollRef = useRef<HTMLDivElement>(null);
  const reelScrollStepRef = useRef(212);
  const reelCardTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const reelCardDidDragRef = useRef(false);
  const theaterSwipeStartRef = useRef<TheaterSwipeGesture | null>(null);
  const theaterCloseTimerRef = useRef<number | null>(null);
  const theaterDragFrameRef = useRef<number | null>(null);
  const theaterPendingDragYRef = useRef(0);

  const clearTheaterCloseTimer = useCallback(() => {
    if (theaterCloseTimerRef.current !== null) {
      window.clearTimeout(theaterCloseTimerRef.current);
      theaterCloseTimerRef.current = null;
    }
  }, []);

  const queueTheaterDrag = useCallback((dragY: number) => {
    const clampedDrag = Math.max(-THEATER_MAX_DRAG_DISTANCE, Math.min(THEATER_MAX_DRAG_DISTANCE, dragY));
    theaterPendingDragYRef.current = clampedDrag;

    if (theaterDragFrameRef.current !== null) return;
    theaterDragFrameRef.current = window.requestAnimationFrame(() => {
      setTheaterDragY(theaterPendingDragYRef.current);
      theaterDragFrameRef.current = null;
    });
  }, []);

  const finalizeTheaterClose = useCallback(() => {
    clearTheaterCloseTimer();
    setActiveReelPreview(null);
    setActiveReelIndex(null);
    setIsTheaterDismissing(false);
    setIsTheaterVisible(false);
    setIsTheaterDragging(false);
    setTheaterDismissDirection(1);
    setTheaterDragY(0);
  }, [clearTheaterCloseTimer]);

  const dismissReelPreview = useCallback(
    (direction: 1 | -1 = 1) => {
      if (!activeReelPreview || isTheaterDismissing) return;
      clearTheaterCloseTimer();
      setIsTheaterDragging(false);
      theaterSwipeStartRef.current = null;
      setTheaterDismissDirection(direction);
      setIsTheaterDismissing(true);
      setIsTheaterVisible(false);
      queueTheaterDrag(0);
      theaterCloseTimerRef.current = window.setTimeout(finalizeTheaterClose, THEATER_CLOSE_DURATION_MS);
    },
    [
      activeReelPreview,
      clearTheaterCloseTimer,
      finalizeTheaterClose,
      isTheaterDismissing,
      queueTheaterDrag,
    ],
  );

  const openReelPreview = useCallback(
    (clip: ReelClip, index: number) => {
      clearTheaterCloseTimer();
      theaterSwipeStartRef.current = null;
      setTheaterDismissDirection(1);
      setIsTheaterDismissing(false);
      setIsTheaterDragging(false);
      setIsTheaterVisible(false);
      queueTheaterDrag(0);
      setActiveReelPreview(clip);
      setActiveReelIndex(index);
    },
    [clearTheaterCloseTimer, queueTheaterDrag],
  );

  const navigateReelPreview = useCallback(
    (direction: 1 | -1) => {
      if (activeReelIndex === null) return;
      const nextIndex = (activeReelIndex + direction + REEL_CLIPS.length) % REEL_CLIPS.length;
      const nextClip = REEL_CLIPS[nextIndex];
      if (!nextClip) return;
      setActiveReelIndex(nextIndex);
      setActiveReelPreview(nextClip);
    },
    [activeReelIndex],
  );

  const handleTheaterTouchStart = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      if (isTheaterDismissing) return;
      const touch = event.touches[0];
      if (!touch) return;

      theaterSwipeStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        timestamp: performance.now(),
        axis: 'pending',
      };
      setIsTheaterDragging(true);
    },
    [isTheaterDismissing],
  );

  const handleTheaterTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const swipeStart = theaterSwipeStartRef.current;
      if (!swipeStart || isTheaterDismissing) return;
      const touch = event.touches[0];
      if (!touch) return;

      const deltaX = touch.clientX - swipeStart.x;
      const deltaY = touch.clientY - swipeStart.y;

      if (swipeStart.axis === 'pending') {
        if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) return;
        swipeStart.axis = Math.abs(deltaY) >= Math.abs(deltaX) ? 'vertical' : 'horizontal';
      }

      if (swipeStart.axis === 'vertical') {
        event.preventDefault();
        if (isMobile) return;
        const resistance = 0.92 - Math.min(Math.abs(deltaY) / 900, 0.28);
        queueTheaterDrag(deltaY * resistance);
        return;
      }

      if (swipeStart.axis === 'horizontal') {
        event.preventDefault();
      }
    },
    [isMobile, isTheaterDismissing, queueTheaterDrag],
  );

  const handleTheaterTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const swipeStart = theaterSwipeStartRef.current;
      theaterSwipeStartRef.current = null;
      setIsTheaterDragging(false);
      if (!swipeStart) return;

      const touch = event.changedTouches[0];
      if (!touch) {
        queueTheaterDrag(0);
        return;
      }

      const deltaX = touch.clientX - swipeStart.x;
      const deltaY = touch.clientY - swipeStart.y;
      const elapsed = Math.max(1, performance.now() - swipeStart.timestamp);
      const velocityX = deltaX / elapsed;
      const velocityY = deltaY / elapsed;
      const isHorizontalSwipe =
        swipeStart.axis === 'horizontal' || Math.abs(deltaX) > Math.abs(deltaY) * 1.1;
      const isVerticalSwipe =
        swipeStart.axis === 'vertical' || Math.abs(deltaY) > Math.abs(deltaX) * 1.1;

      const crossedHorizontalThreshold =
        Math.abs(deltaX) >= THEATER_HORIZONTAL_SWIPE_DISTANCE_THRESHOLD ||
        Math.abs(velocityX) >= THEATER_HORIZONTAL_SWIPE_VELOCITY_THRESHOLD;
      const crossedVerticalDismissThreshold =
        Math.abs(deltaY) >= THEATER_SWIPE_DISTANCE_THRESHOLD ||
        Math.abs(velocityY) >= THEATER_SWIPE_VELOCITY_THRESHOLD;
      const crossedVerticalNavigateThreshold =
        Math.abs(deltaY) >= THEATER_VERTICAL_NAV_SWIPE_DISTANCE_THRESHOLD ||
        Math.abs(velocityY) >= THEATER_VERTICAL_NAV_SWIPE_VELOCITY_THRESHOLD;

      if (isMobile) {
        if (isVerticalSwipe && crossedVerticalNavigateThreshold) {
          queueTheaterDrag(0);
          navigateReelPreview(deltaY < 0 ? 1 : -1);
          return;
        }

        if (isHorizontalSwipe && crossedHorizontalThreshold) {
          dismissReelPreview(deltaX < 0 ? 1 : -1);
          return;
        }

        queueTheaterDrag(0);
        return;
      }

      if (isHorizontalSwipe && crossedHorizontalThreshold) {
        queueTheaterDrag(0);
        navigateReelPreview(deltaX < 0 ? 1 : -1);
        return;
      }

      if (isVerticalSwipe && crossedVerticalDismissThreshold) {
        dismissReelPreview(deltaY < 0 ? -1 : 1);
        return;
      }

      queueTheaterDrag(0);
    },
    [dismissReelPreview, isMobile, navigateReelPreview, queueTheaterDrag],
  );

  const resetTheaterSwipe = useCallback(() => {
    theaterSwipeStartRef.current = null;
    setIsTheaterDragging(false);
    queueTheaterDrag(0);
  }, [queueTheaterDrag]);

  useEffect(() => {
    if (!activeReelPreview) {
      setIsTheaterVisible(false);
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      setIsTheaterVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [activeReelPreview]);

  useEffect(() => {
    return () => {
      clearTheaterCloseTimer();
      if (theaterDragFrameRef.current !== null) {
        window.cancelAnimationFrame(theaterDragFrameRef.current);
        theaterDragFrameRef.current = null;
      }
    };
  }, [clearTheaterCloseTimer]);

  useEffect(() => {
    if (!activeReelPreview) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        dismissReelPreview();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigateReelPreview(1);
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigateReelPreview(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReelPreview, dismissReelPreview, navigateReelPreview]);

  useEffect(() => {
    if (!isTheaterOpen) return;

    const scrollY = window.scrollY;
    const htmlElement = document.documentElement;
    const previousStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
      overscrollBehavior: document.body.style.overscrollBehavior,
    };
    const previousHtmlStyles = {
      overflow: htmlElement.style.overflow,
      overscrollBehavior: htmlElement.style.overscrollBehavior,
    };

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    htmlElement.style.overflow = 'hidden';
    htmlElement.style.overscrollBehavior = 'none';

    return () => {
      document.body.style.position = previousStyles.position;
      document.body.style.top = previousStyles.top;
      document.body.style.left = previousStyles.left;
      document.body.style.right = previousStyles.right;
      document.body.style.width = previousStyles.width;
      document.body.style.overflow = previousStyles.overflow;
      document.body.style.overscrollBehavior = previousStyles.overscrollBehavior;
      htmlElement.style.overflow = previousHtmlStyles.overflow;
      htmlElement.style.overscrollBehavior = previousHtmlStyles.overscrollBehavior;
      window.scrollTo(0, scrollY);
    };
  }, [isTheaterOpen]);

  useEffect(() => {
    const container = reelScrollRef.current;
    if (!container) return;

    const measureReelStep = () => {
      const firstCard = container.querySelector<HTMLElement>('[data-reel-card="true"]');
      const cardWidth = firstCard?.clientWidth ?? 200;
      const containerStyles = window.getComputedStyle(container);
      const gap =
        Number.parseFloat(containerStyles.columnGap || containerStyles.gap || '0') ||
        Number.parseFloat(containerStyles.gap || '0') ||
        12;
      reelScrollStepRef.current = cardWidth + gap;
    };

    measureReelStep();
    window.addEventListener('resize', measureReelStep);

    if (typeof ResizeObserver === 'undefined') {
      return () => window.removeEventListener('resize', measureReelStep);
    }

    const resizeObserver = new ResizeObserver(measureReelStep);
    resizeObserver.observe(container);

    const firstCard = container.querySelector<HTMLElement>('[data-reel-card="true"]');
    if (firstCard) {
      resizeObserver.observe(firstCard);
    }

    return () => {
      window.removeEventListener('resize', measureReelStep);
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const container = reelScrollRef.current;
    if (!container) return;

    let frameId: number | null = null;

    const updateActiveCard = () => {
      frameId = null;
      const step = reelScrollStepRef.current;
      if (!Number.isFinite(step) || step <= 0) return;
      const closestIndex = Math.round(container.scrollLeft / step);
      const clampedIndex = Math.max(0, Math.min(REEL_CLIPS.length - 1, closestIndex));

      setActiveMobileReelIndex((previousIndex) =>
        previousIndex === clampedIndex ? previousIndex : clampedIndex,
      );
    };

    const queueActiveCardUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateActiveCard);
    };

    queueActiveCardUpdate();
    container.addEventListener('scroll', queueActiveCardUpdate, { passive: true });
    window.addEventListener('resize', queueActiveCardUpdate);

    return () => {
      container.removeEventListener('scroll', queueActiveCardUpdate);
      window.removeEventListener('resize', queueActiveCardUpdate);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [isMobile]);

  const scrollReels = (direction: 'left' | 'right') => {
    const container = reelScrollRef.current;
    if (!container) return;
    const scrollAmount = reelScrollStepRef.current;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const handleReelCardTouchStart = useCallback((event: TouchEvent<HTMLButtonElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    reelCardTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
    reelCardDidDragRef.current = false;
  }, []);

  const handleReelCardTouchMove = useCallback((event: TouchEvent<HTMLButtonElement>) => {
    const start = reelCardTouchStartRef.current;
    const touch = event.touches[0];
    if (!start || !touch) return;

    if (
      Math.abs(touch.clientX - start.x) > REEL_CARD_TAP_SLOP_PX ||
      Math.abs(touch.clientY - start.y) > REEL_CARD_TAP_SLOP_PX
    ) {
      reelCardDidDragRef.current = true;
    }
  }, []);

  const handleReelCardTouchEnd = useCallback(() => {
    reelCardTouchStartRef.current = null;
  }, []);

  const handleReelCardClick = useCallback(
    (clip: ReelClip, index: number) => {
      if (reelCardDidDragRef.current) {
        reelCardDidDragRef.current = false;
        return;
      }
      openReelPreview(clip, index);
    },
    [openReelPreview],
  );

  /* Play all collage videos */
  const playCollageVideos = useCallback(() => {
    collageVideoRefs.current.forEach((video) => {
      if (video) {
        video.defaultPlaybackRate = 1;
        video.playbackRate = 1;
        video.play().catch(() => undefined);
      }
    });
  }, []);

  /* Pause all collage videos */
  const pauseCollageVideos = useCallback(() => {
    collageVideoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, []);

  const handleCollageMouseEnter = useCallback(() => {
    setCollageHovered(true);
    playCollageVideos();
  }, [playCollageVideos]);

  const handleCollageMouseLeave = useCallback(() => {
    setCollageHovered(false);
    pauseCollageVideos();
  }, [pauseCollageVideos]);

  const theaterDragDistance = Math.abs(theaterDragY);
  const theaterDragProgress = Math.min(theaterDragDistance / THEATER_MAX_DRAG_DISTANCE, 1);
  const theaterOverlayOpacity =
    (isTheaterVisible && !isTheaterDismissing ? 1 : 0) * (1 - theaterDragProgress * 0.5);
  const theaterCardScale = 1 - theaterDragProgress * 0.07;
  const theaterCardRotation = theaterDragY * 0.012;

  const theaterCardTransform = isTheaterDismissing
    ? `translate3d(0, ${theaterDismissDirection * 120}vh, 0) scale(0.88) rotate(${theaterDismissDirection * 3.8}deg)`
    : isTheaterVisible
      ? `translate3d(0, ${theaterDragY}px, 0) scale(${theaterCardScale}) rotate(${theaterCardRotation}deg)`
      : 'translate3d(0, 36px, 0) scale(0.95)';

  const theaterCardTransition = isTheaterDragging
    ? 'transform 0ms linear, opacity 120ms linear'
    : isTheaterDismissing
      ? `transform ${THEATER_CLOSE_DURATION_MS}ms cubic-bezier(0.32,0.72,0,1), opacity 250ms ease`
      : 'transform 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease';

  const theaterWarmPreloadClips = useMemo(() => {
    if (activeReelIndex === null) return [];

    return THEATER_WARM_PRELOAD_OFFSETS.map((offset) => {
      const index = (activeReelIndex + offset + REEL_CLIPS.length) % REEL_CLIPS.length;
      return REEL_CLIPS[index];
    }).filter((clip, index, clips) => clips.findIndex((candidate) => candidate.id === clip.id) === index);
  }, [activeReelIndex]);

  const theaterHintPreloadClips = useMemo(() => {
    if (activeReelIndex === null) return [];

    return THEATER_HINT_PRELOAD_OFFSETS.map((offset) => {
      const index = (activeReelIndex + offset + REEL_CLIPS.length) % REEL_CLIPS.length;
      return REEL_CLIPS[index];
    }).filter((clip, index, clips) => clips.findIndex((candidate) => candidate.id === clip.id) === index);
  }, [activeReelIndex]);


  return (
    <section id="portfolio" className="studio-section bg-secondary/5 pt-20 pb-16">
      <div className="studio-container">
        <motion.div
          className="studio-header mb-10 md:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.32 }}
          variants={staggerContainer(0.12, 0.05)}
        >
          <div className="text-center md:text-left">
            <motion.div className="inline-flex items-center gap-2 mb-6" variants={revealUp(14, 0.56)}>
              <span className="h-px w-8 bg-accent/40" />
              <p className="section-label text-accent text-sm md:text-base">{t('portfolio.sectionSubtitle')}</p>
            </motion.div>
            <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif text-foreground tracking-tight-serif leading-[0.95]">
              <SplitTextReveal text={t('portfolio.sectionTitle')} delay={0.06} />
              <span className="luxury-accent block mt-4 lg:mt-0 lg:ml-4 text-accent">
                <SplitTextReveal text={t('portfolio.sectionTitleAccent')} delay={0.22} />
              </span>
            </h2>
          </div>
          <motion.div className="lg:max-w-xs text-center lg:text-right" variants={revealUp(20, 0.64)}>
            <p className="strategic-body text-foreground/45 text-lg md:text-xl italic">
              {t('portfolio.reelDescription')}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="studio-rule mb-10 md:mb-12"
          initial={{ opacity: 0, scaleX: 0.7 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.66 }}
        />

        <motion.div
          className="mb-12 md:mb-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={revealUp(20, 0.62)}
        >
          <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-background to-secondary/60" />
            <div className="absolute inset-y-0 left-0 w-6 sm:w-10 md:w-16 z-20 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-6 sm:w-10 md:w-16 z-20 bg-gradient-to-l from-background via-background/80 to-transparent" />

            {/* Mobile navigation arrows */}
            <button
              type="button"
              className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-foreground/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-foreground/80 transition-colors"
              onClick={() => scrollReels('left')}
              aria-label={t('portfolio.reelAriaPrev')}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-foreground/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-foreground/80 transition-colors"
              onClick={() => scrollReels('right')}
              aria-label={t('portfolio.reelAriaNext')}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="relative z-10 mx-auto px-3 sm:px-6 md:px-10 lg:px-12 py-4 md:py-6">
              <div
                ref={reelScrollRef}
                className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-proximity md:snap-none overscroll-x-contain scroll-smooth"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {REEL_CLIPS.map((clip, index) => {
                  const mobileCardDistance = Math.abs(activeMobileReelIndex - index);
                  const isActiveMobileCard = !isMobile || mobileCardDistance === 0;
                  const isWarmMobileCard = isMobile && mobileCardDistance <= 1;

                  return (
                    <motion.button
                      type="button"
                      key={clip.id}
                      data-reel-card="true"
                      className="group relative shrink-0 w-[70vw] sm:w-[55vw] md:w-[180px] lg:w-[200px] aspect-[9/16] rounded-2xl overflow-hidden border border-border shadow-sm text-left hover:border-primary/40 transition-colors snap-center touch-manipulation"
                      onTouchStart={handleReelCardTouchStart}
                      onTouchMove={handleReelCardTouchMove}
                      onTouchEnd={handleReelCardTouchEnd}
                      onTouchCancel={handleReelCardTouchEnd}
                      onClick={() => handleReelCardClick(clip, index)}
                      aria-label={t(clip.titleKey)}
                      whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.02 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                      transition={springHoverTransition}
                    >
                      <LazyVideo
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={clip.previewSrc}
                        poster={clip.posterSrc}
                        muted
                        autoPlay
                        loop
                        playsInline
                        preload={isWarmMobileCard ? 'auto' : 'none'}
                        rootMargin="100px 0px"
                        pauseOffscreen
                        forcePause={isTheaterOpen || !isActiveMobileCard}
                        aria-hidden="true"
                      />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] gap-8 lg:gap-10 items-center mb-14 md:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={staggerContainer(0.12, 0.05)}
        >
          <motion.div variants={staggerContainer(0.1, 0.04)}>
            <motion.p className="section-label text-muted-foreground mb-4" variants={revealUp(14, 0.56)}>
              {t('portfolio.collageEyebrow')}
            </motion.p>
            <h3 className="text-3xl md:text-[2.4rem] font-sans font-medium tracking-tight leading-tight mb-5">
              <SplitTextReveal text={t('portfolio.collageTitle')} delay={0.06} />
            </h3>
            <motion.p className="strategic-body text-muted-foreground mb-6" variants={revealUp(16, 0.62)}>
              {t('portfolio.collageDescription')}
            </motion.p>

            <motion.ul className="space-y-3 text-foreground/85 mb-8" variants={staggerContainer(0.08, 0.02)}>
              <motion.li className="flex gap-3" variants={revealUp(10, 0.5)}>
                <span className="mt-[0.5rem] h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{t('portfolio.collagePoint1')}</span>
              </motion.li>
              <motion.li className="flex gap-3" variants={revealUp(10, 0.5)}>
                <span className="mt-[0.5rem] h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{t('portfolio.collagePoint2')}</span>
              </motion.li>
              <motion.li className="flex gap-3" variants={revealUp(10, 0.5)}>
                <span className="mt-[0.5rem] h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{t('portfolio.collagePoint3')}</span>
              </motion.li>
            </motion.ul>

            <motion.a
              href="#contact"
              onClick={handleHashLinkClick}
              className="btn-primary-nordic px-7 py-3"
              whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              transition={springHoverTransition}
            >
              {t('portfolio.collageCta')}
            </motion.a>
          </motion.div>

          {/* Desktop: Absolute-positioned collage with hover interaction */}
          <motion.div
            className="hidden lg:block relative h-[530px] xl:h-[560px] w-full max-w-[720px] mx-auto rounded-[1.75rem] border border-border/60 overflow-hidden cursor-pointer shadow-[0_28px_60px_-48px_hsl(var(--foreground)/0.4)]"
            role="presentation"
            onMouseEnter={handleCollageMouseEnter}
            onMouseLeave={handleCollageMouseLeave}
            variants={revealUp(24, 0.72)}
            whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.012 }}
            transition={springHoverTransition}
          >
            {/* Sunset gradient background matching the reference */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, hsl(var(--coastal-teal)) 0%, hsl(var(--washed-khaki)) 38%, hsl(var(--warm-sand)) 72%, hsl(var(--pure-linen)) 100%)',
              }}
            />
            <div className="absolute inset-0 bg-card/20" />

            {COLLAGE_CLIPS.map((clip, index) => (
              <div
                key={clip.id}
                className={`absolute rounded-2xl border-[2.5px] border-white/90 shadow-xl overflow-hidden origin-center will-change-transform transition-[top,left,right,width,transform,opacity] duration-700 ${collageHovered ? clip.hoverClass : clip.cornerClass
                  }`}
                style={{
                  aspectRatio: '9/16',
                  transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                <LazyVideo
                  ref={(element) => {
                    collageVideoRefs.current[index] = element;
                  }}
                  className="h-full w-full object-cover"
                  src={clip.previewSrc}
                  poster={clip.posterSrc}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-label={t(clip.labelKey)}
                />

                {/* Individual play icon per card — fades on hover */}
                <div
                  className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${collageHovered ? 'opacity-0' : 'opacity-100'
                    }`}
                >
                  <div className="h-9 w-9 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-md">
                    <Play className="h-4 w-4 text-foreground/80 ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Mobile: Collage layout with always-on looping videos */}
          <motion.div
            className="lg:hidden relative w-full max-w-[440px] rounded-[1.25rem] border border-border/60 p-4 overflow-hidden shadow-lg mx-auto pointer-events-none select-none"
            role="presentation"
            variants={revealUp(20, 0.6)}
          >
            {/* Sunset gradient background for mobile too */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, hsl(var(--coastal-teal)) 0%, hsl(var(--washed-khaki)) 38%, hsl(var(--warm-sand)) 72%, hsl(var(--pure-linen)) 100%)',
              }}
            />
            <div className="absolute inset-0 bg-card/15" />

            <div className="relative z-10 w-full h-[320px] sm:h-[360px]">
              {COLLAGE_CLIPS.map((clip, index) => (
                <div
                  key={clip.id}
                  className={`absolute rounded-xl border-2 border-white/85 shadow-md overflow-hidden ${index === 0
                      ? 'top-[19%] left-[8%] w-[33%] -rotate-[7deg] z-20'
                      : index === 1
                        ? 'top-[6%] left-[34%] w-[32%] rotate-0 z-40'
                        : 'top-[19%] right-[8%] w-[33%] rotate-[7deg] z-20'
                    } pointer-events-none`}
                  style={{ aspectRatio: '9/14' }}
                >
                  <LazyVideo
                    className="h-full w-full object-cover pointer-events-none"
                    src={clip.previewSrc}
                    poster={clip.posterSrc}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                    disablePictureInPicture
                    disableRemotePlayback
                    rootMargin="120px 0px"
                    pauseOffscreen
                    forcePause={isTheaterOpen}
                    aria-label={t(clip.labelKey)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {activeReelPreview && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
          onClick={() => dismissReelPreview()}
        >
          <div
            className="absolute inset-0 bg-foreground/65 backdrop-blur-[14px]"
            style={{
              opacity: theaterOverlayOpacity,
              transition: isTheaterDragging ? 'opacity 80ms linear' : 'opacity 280ms ease',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: theaterOverlayOpacity,
              transition: isTheaterDragging ? 'opacity 80ms linear' : 'opacity 320ms ease',
              background:
                'radial-gradient(circle at 14% 12%, hsl(var(--accent) / 0.24) 0%, transparent 48%), radial-gradient(circle at 84% 88%, hsl(var(--primary) / 0.26) 0%, transparent 52%)',
            }}
          />
          <div
            className="relative w-full max-w-[430px]"
            onTouchStart={handleTheaterTouchStart}
            onTouchMove={handleTheaterTouchMove}
            onTouchEnd={handleTheaterTouchEnd}
            onTouchCancel={resetTheaterSwipe}
          >
            <button
              type="button"
              className="absolute left-0 top-1/2 -translate-x-[122%] -translate-y-1/2 z-[220] h-6 w-6 md:h-11 md:w-11 rounded-full border border-white/35 bg-black/55 text-white shadow-[0_12px_26px_-14px_rgba(0,0,0,0.9)] backdrop-blur-md flex items-center justify-center transition-colors hover:bg-black/70"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                navigateReelPreview(-1);
              }}
              aria-label={t('portfolio.reelPreviewPrev')}
            >
              <ChevronLeft className="h-3 w-3 md:h-5 md:w-5" />
            </button>
            <button
              type="button"
              className="absolute right-0 top-1/2 translate-x-[122%] -translate-y-1/2 z-[220] h-6 w-6 md:h-11 md:w-11 rounded-full border border-white/35 bg-black/55 text-white shadow-[0_12px_26px_-14px_rgba(0,0,0,0.9)] backdrop-blur-md flex items-center justify-center transition-colors hover:bg-black/70"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                navigateReelPreview(1);
              }}
              aria-label={t('portfolio.reelPreviewNext')}
            >
              <ChevronRight className="h-3 w-3 md:h-5 md:w-5" />
            </button>
            <div
              className="relative w-full overflow-hidden rounded-[2rem] border border-white/25 bg-card/80 p-[10px] shadow-[0_38px_92px_-42px_hsl(var(--foreground)/0.9)] backdrop-blur-2xl"
              onClick={(event) => event.stopPropagation()}
              style={{
                transform: theaterCardTransform,
                opacity: isTheaterDismissing ? 0 : isTheaterVisible ? 1 : 0,
                transition: theaterCardTransition,
              }}
            >
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/20" />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,hsl(var(--card)/0.42)_0%,hsl(var(--card)/0.08)_40%,transparent_100%)]" />

            <button
              type="button"
              className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full border border-border/80 bg-card/90 flex items-center justify-center text-foreground/90 hover:bg-secondary transition-colors"
              onClick={() => dismissReelPreview()}
              aria-label={t('portfolio.reelPreviewClose')}
            >
              <X className="h-4 w-4 text-foreground" />
            </button>

            <div className="relative rounded-[1.55rem] border border-border/70 bg-card/75 px-4 pb-4 pt-5 shadow-[inset_0_1px_0_hsl(var(--background)/0.45)]">
              <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
                {theaterWarmPreloadClips.map((clip) => (
                  <video
                    key={`theater-preload-mobile-warm-${clip.id}`}
                    src={clip.mobileSrc}
                    preload="auto"
                    muted
                    playsInline
                    tabIndex={-1}
                  />
                ))}
                {theaterWarmPreloadClips.map((clip) => (
                  <video
                    key={`theater-preload-main-warm-${clip.id}`}
                    src={clip.mainSrc}
                    preload="metadata"
                    muted
                    playsInline
                    tabIndex={-1}
                  />
                ))}
                {theaterHintPreloadClips.map((clip) => (
                  <video
                    key={`theater-preload-mobile-hint-${clip.id}`}
                    src={clip.mobileSrc}
                    preload="metadata"
                    muted
                    playsInline
                    tabIndex={-1}
                  />
                ))}
              </div>

              <div className="mb-2 pr-12">
                <p className="brand-logo text-[1.6rem] leading-[0.9] text-foreground">
                  Gise<span className="text-foreground font-medium">.UGC</span>
                </p>
                <p className="section-label mt-2 text-foreground/55">
                  {t(`portfolio.categories.${activeReelPreview.category}`)}
                </p>
              </div>

              <h4 className="text-xl font-serif font-normal tracking-[-0.03em] leading-tight text-foreground mb-3">
                {t(activeReelPreview.titleKey)}
              </h4>

              <TheaterVideo
                sources={[activeReelPreview.mainSrc, activeReelPreview.mobileSrc]}
                poster={activeReelPreview.posterSrc}
              />
            </div>
          </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
