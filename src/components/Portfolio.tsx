import { useRef, useState, useCallback, useEffect, useMemo, type TouchEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '@/lib/locale-context';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { useIsMobile } from '@/hooks/use-mobile';
import { scrollToY } from '@/lib/motion/native-scroll';
import AdaptiveVideo from '@/components/media/AdaptiveVideo';
import TheaterVideo from '@/components/media/TheaterVideo';
import ResponsivePosterImage from '@/components/media/ResponsivePosterImage';
import { createClipPlaybackCandidates } from '@/lib/media-assets';
import {
  getBestPosterSrc,
  LEGACY_REEL_CLIPS,
  type ReelClip,
} from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';

type TheaterSwipeGesture = {
  x: number;
  y: number;
  timestamp: number;
  axis: 'pending' | 'vertical' | 'horizontal';
};

const THEATER_CLOSE_DURATION_MS = 320;
// One gesture model on every breakpoint: drag sideways to walk the reels,
// drag up or down to throw the viewer away.
const THEATER_NAV_SWIPE_DISTANCE_THRESHOLD = 64;
const THEATER_NAV_SWIPE_VELOCITY_THRESHOLD = 0.32;
const THEATER_DISMISS_SWIPE_DISTANCE_THRESHOLD = 96;
const THEATER_DISMISS_SWIPE_VELOCITY_THRESHOLD = 0.4;
const THEATER_AXIS_LOCK_SLOP_PX = 6;
const THEATER_MAX_DRAG_DISTANCE = 260;
const REEL_CARD_TAP_SLOP_PX = 10;
const THEATER_QUALITY_FALLBACK_MS = 2500;
const DAY_MS = 86_400_000;
const getUtcDayBucket = () => Math.floor(Date.now() / DAY_MS);

const shuffleWithSeed = <T,>(items: T[], seed: number): T[] => {
  const result = [...items];
  let state = seed >>> 0;
  const random = () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const ALL_REEL_CLIPS: ReelClip[] = [...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS];

const Portfolio = () => {
  const { t, locale: pageLocale } = useTranslation();
  const isMobile = useIsMobile();

  const [activeReelPreview, setActiveReelPreview] = useState<ReelClip | null>(null);
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [activeMobileReelIndex, setActiveMobileReelIndex] = useState(0);
  const isTheaterOpen = activeReelPreview !== null;
  const [theaterDrag, setTheaterDrag] = useState({ x: 0, y: 0 });
  const [isTheaterDragging, setIsTheaterDragging] = useState(false);
  const [isTheaterVisible, setIsTheaterVisible] = useState(false);
  const [isTheaterDismissing, setIsTheaterDismissing] = useState(false);
  const [theaterDismissDirection, setTheaterDismissDirection] = useState<1 | -1>(1);
  const [interactionPrewarmClip, setInteractionPrewarmClip] = useState<ReelClip | null>(null);
  const [utcDayBucket, setUtcDayBucket] = useState(() => getUtcDayBucket());

  const reelScrollRef = useRef<HTMLDivElement>(null);
  // Desktop "Gallery" chapter: a free-scroll horizontal rail the visitor drives.
  const galleryViewportRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const galleryCounterRef = useRef<HTMLSpanElement>(null);
  const reelScrollStepRef = useRef(212);
  const reelCardTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const reelCardDidDragRef = useRef(false);
  const theaterSwipeStartRef = useRef<TheaterSwipeGesture | null>(null);
  const theaterCloseTimerRef = useRef<number | null>(null);
  const theaterDragFrameRef = useRef<number | null>(null);
  const theaterPendingDragRef = useRef({ x: 0, y: 0 });
  const interactionPrewarmTimerRef = useRef<number | null>(null);
  const showcaseReelClips = useMemo(
    () => shuffleWithSeed(ALL_REEL_CLIPS, utcDayBucket),
    [utcDayBucket],
  );
  const getReelTitle = useCallback(
    (clip: ReelClip) => (clip.titleKey ? t(clip.titleKey) : clip.title ?? `Clip ${clip.id}`),
    [t],
  );

  // ── Card metadata (chips + title band) ──
  const isEs = pageLocale === 'es';
  const categoryLabel = useCallback(
    (category: ReelClip['category']) => {
      const labels: Record<ReelClip['category'], [string, string]> = {
        fashion: ['moda', 'fashion'],
        beauty: ['belleza', 'beauty'],
        tech: ['tech', 'tech'],
        lifestyle: ['lifestyle', 'lifestyle'],
      };
      return labels[category][isEs ? 0 : 1];
    },
    [isEs],
  );
  const formatClipMeta = useCallback(
    (clip: ReelClip) => {
      const parts: string[] = [];
      if (clip.durationSeconds) {
        const m = Math.floor(clip.durationSeconds / 60);
        const s = String(Math.round(clip.durationSeconds % 60)).padStart(2, '0');
        parts.push(`${m}:${s}`);
      }
      parts.push(
        clip.language === 'en' ? (isEs ? 'inglés' : 'English') : isEs ? 'español' : 'Spanish',
      );
      return parts.join(' · ');
    },
    [isEs],
  );

  // ── Gallery rail (desktop): a free-scroll horizontal strip the visitor
  // drives — drag with the mouse, the arrows, the trackpad, or a wheel over
  // the rail. Vertical page scroll passes straight through (no pin, no trap).
  // The live counter tracks the leftmost visible card via a rAF-throttled
  // scroll listener (textContent, no React state at 60fps).
  const showcaseCount = showcaseReelClips.length;
  useEffect(() => {
    if (isMobile) return;
    const viewport = galleryViewportRef.current;
    const track = galleryTrackRef.current;
    if (!viewport || !track) return;

    let raf = 0;
    const updateCounter = () => {
      raf = 0;
      const counter = galleryCounterRef.current;
      if (!counter || showcaseCount === 0) return;
      const max = Math.max(1, track.scrollWidth - viewport.clientWidth);
      const ratio = viewport.scrollLeft / max;
      const index = Math.min(showcaseCount - 1, Math.round(ratio * (showcaseCount - 1)));
      counter.textContent = String(index + 1).padStart(2, '0');
    };
    const onScroll = () => {
      if (raf === 0) raf = requestAnimationFrame(updateCounter);
    };
    viewport.addEventListener('scroll', onScroll, { passive: true });

    // Pointer drag-to-scroll for mouse users (trackpads already swipe natively).
    let dragging = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startLeft = viewport.scrollLeft;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - startX;
      if (Math.abs(dx) > 4) {
        moved = true;
        viewport.classList.add('is-dragging');
      }
      viewport.scrollLeft = startLeft - dx;
    };
    const endDrag = () => {
      dragging = false;
      viewport.classList.remove('is-dragging');
    };
    // Swallow the click that ends a drag so a card doesn't open the theater.
    const onClickCapture = (event: MouseEvent) => {
      if (moved) {
        event.preventDefault();
        event.stopPropagation();
        moved = false;
      }
    };
    viewport.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', endDrag);
    viewport.addEventListener('click', onClickCapture, true);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      viewport.removeEventListener('scroll', onScroll);
      viewport.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      viewport.removeEventListener('click', onClickCapture, true);
    };
  }, [isMobile, showcaseCount]);

  const scrollGalleryBy = useCallback((direction: 1 | -1) => {
    const viewport = galleryViewportRef.current;
    if (!viewport) return;
    const card = viewport.querySelector<HTMLElement>('[data-reel-card="true"]');
    const step = card ? card.offsetWidth + 24 : viewport.clientWidth * 0.8;
    viewport.scrollBy({ left: step * 2 * direction, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const now = Date.now();
    const nextUtcBoundary = (utcDayBucket + 1) * DAY_MS;
    const boundaryDelayMs = Math.max(nextUtcBoundary - now, 1000);
    const timeoutId = window.setTimeout(() => {
      setUtcDayBucket(getUtcDayBucket());
    }, boundaryDelayMs + 20);

    return () => window.clearTimeout(timeoutId);
  }, [utcDayBucket]);

  const clearTheaterCloseTimer = useCallback(() => {
    if (theaterCloseTimerRef.current !== null) {
      window.clearTimeout(theaterCloseTimerRef.current);
      theaterCloseTimerRef.current = null;
    }
  }, []);

  const clearInteractionPrewarm = useCallback(() => {
    if (interactionPrewarmTimerRef.current !== null) {
      window.clearTimeout(interactionPrewarmTimerRef.current);
      interactionPrewarmTimerRef.current = null;
    }
    setInteractionPrewarmClip(null);
  }, []);

  const scheduleInteractionPrewarm = useCallback(
    (clip: ReelClip) => {
      if (isMobile) return;
      setInteractionPrewarmClip((previousClip) => (previousClip?.id === clip.id ? previousClip : clip));
      if (interactionPrewarmTimerRef.current !== null) {
        window.clearTimeout(interactionPrewarmTimerRef.current);
      }
      interactionPrewarmTimerRef.current = window.setTimeout(() => {
        setInteractionPrewarmClip(null);
        interactionPrewarmTimerRef.current = null;
      }, 2800);
    },
    [isMobile],
  );

  const queueTheaterDrag = useCallback((dragX: number, dragY: number) => {
    const clamp = (value: number) =>
      Math.max(-THEATER_MAX_DRAG_DISTANCE, Math.min(THEATER_MAX_DRAG_DISTANCE, value));
    theaterPendingDragRef.current = { x: clamp(dragX), y: clamp(dragY) };

    if (theaterDragFrameRef.current !== null) return;
    theaterDragFrameRef.current = window.requestAnimationFrame(() => {
      setTheaterDrag(theaterPendingDragRef.current);
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
    setTheaterDrag({ x: 0, y: 0 });
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
      queueTheaterDrag(0, 0);
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
      scheduleInteractionPrewarm(clip);
      theaterSwipeStartRef.current = null;
      // Reset the entrance bookkeeping in the same urgent pass that mounts the
      // theater. It used to run inside startTransition, which let React commit
      // isTheaterVisible=false *after* the open effect's rAF had already set it
      // true — leaving the card stuck at opacity 0 behind a dimmed backdrop
      // whenever the main thread was busy enough to defer the transition past a
      // frame.
      setTheaterDismissDirection(1);
      setIsTheaterDismissing(false);
      setIsTheaterDragging(false);
      setIsTheaterVisible(false);
      setTheaterDrag({ x: 0, y: 0 });
      theaterPendingDragRef.current = { x: 0, y: 0 };
      // Critical: mount TheaterVideo immediately so video src is assigned ASAP
      setActiveReelPreview(clip);
      setActiveReelIndex(index);
    },
    [clearTheaterCloseTimer, scheduleInteractionPrewarm],
  );

  // Walks the order the visitor is actually looking at (the daily shuffle the
  // rail renders), not the canonical data order.
  const navigateReelPreview = useCallback(
    (direction: 1 | -1) => {
      if (activeReelIndex === null || showcaseReelClips.length === 0) return;
      const nextIndex =
        (activeReelIndex + direction + showcaseReelClips.length) % showcaseReelClips.length;
      const nextClip = showcaseReelClips[nextIndex];
      if (!nextClip) return;
      setActiveReelIndex(nextIndex);
      setActiveReelPreview(nextClip);
    },
    [activeReelIndex, showcaseReelClips],
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

  // Horizontal drag walks the reels, vertical drag throws the viewer away.
  // The card tracks the finger on the locked axis so the release is never a
  // surprise. `touch-action: none` on the stage stops the browser competing
  // for the gesture — React registers touchmove passively, so preventDefault()
  // here would do nothing.
  const handleTheaterTouchMove = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const swipeStart = theaterSwipeStartRef.current;
      if (!swipeStart || isTheaterDismissing) return;
      const touch = event.touches[0];
      if (!touch) return;

      const deltaX = touch.clientX - swipeStart.x;
      const deltaY = touch.clientY - swipeStart.y;

      if (swipeStart.axis === 'pending') {
        if (
          Math.abs(deltaX) < THEATER_AXIS_LOCK_SLOP_PX &&
          Math.abs(deltaY) < THEATER_AXIS_LOCK_SLOP_PX
        ) {
          return;
        }
        swipeStart.axis = Math.abs(deltaY) > Math.abs(deltaX) ? 'vertical' : 'horizontal';
      }

      const delta = swipeStart.axis === 'vertical' ? deltaY : deltaX;
      const resistance = 0.92 - Math.min(Math.abs(delta) / 900, 0.28);

      if (swipeStart.axis === 'vertical') {
        queueTheaterDrag(0, deltaY * resistance);
        return;
      }
      queueTheaterDrag(deltaX * resistance, 0);
    },
    [isTheaterDismissing, queueTheaterDrag],
  );

  const handleTheaterTouchEnd = useCallback(
    (event: TouchEvent<HTMLDivElement>) => {
      const swipeStart = theaterSwipeStartRef.current;
      theaterSwipeStartRef.current = null;
      setIsTheaterDragging(false);

      if (!swipeStart) return;

      const touch = event.changedTouches[0];
      if (!touch) {
        queueTheaterDrag(0, 0);
        return;
      }

      const deltaX = touch.clientX - swipeStart.x;
      const deltaY = touch.clientY - swipeStart.y;
      const elapsed = Math.max(1, performance.now() - swipeStart.timestamp);
      const velocityX = deltaX / elapsed;
      const velocityY = deltaY / elapsed;
      const axis =
        swipeStart.axis !== 'pending'
          ? swipeStart.axis
          : Math.abs(deltaY) > Math.abs(deltaX)
            ? 'vertical'
            : 'horizontal';

      if (axis === 'horizontal') {
        const crossed =
          Math.abs(deltaX) >= THEATER_NAV_SWIPE_DISTANCE_THRESHOLD ||
          Math.abs(velocityX) >= THEATER_NAV_SWIPE_VELOCITY_THRESHOLD;
        queueTheaterDrag(0, 0);
        if (crossed) navigateReelPreview(deltaX < 0 ? 1 : -1);
        return;
      }

      const crossed =
        Math.abs(deltaY) >= THEATER_DISMISS_SWIPE_DISTANCE_THRESHOLD ||
        Math.abs(velocityY) >= THEATER_DISMISS_SWIPE_VELOCITY_THRESHOLD;
      if (crossed) {
        dismissReelPreview(deltaY < 0 ? -1 : 1);
        return;
      }
      queueTheaterDrag(0, 0);
    },
    [dismissReelPreview, navigateReelPreview, queueTheaterDrag],
  );

  const resetTheaterSwipe = useCallback(() => {
    theaterSwipeStartRef.current = null;
    setIsTheaterDragging(false);
    queueTheaterDrag(0, 0);
  }, [queueTheaterDrag]);

  useEffect(() => {
    if (!activeReelPreview) {
      setIsTheaterVisible(false);
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      setIsTheaterVisible(true);
    });

    return () => window.cancelAnimationFrame(frameId);
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
    return () => {
      if (interactionPrewarmTimerRef.current !== null) {
        window.clearTimeout(interactionPrewarmTimerRef.current);
        interactionPrewarmTimerRef.current = null;
      }
    };
  }, []);

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
      scrollBehavior: htmlElement.style.scrollBehavior,
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
    htmlElement.dataset.theater = 'open';
    return () => {
      delete htmlElement.dataset.theater;
      document.body.style.position = previousStyles.position;
      document.body.style.top = previousStyles.top;
      document.body.style.left = previousStyles.left;
      document.body.style.right = previousStyles.right;
      document.body.style.width = previousStyles.width;
      document.body.style.overflow = previousStyles.overflow;
      document.body.style.overscrollBehavior = previousStyles.overscrollBehavior;
      htmlElement.style.overflow = previousHtmlStyles.overflow;
      htmlElement.style.overscrollBehavior = previousHtmlStyles.overscrollBehavior;
      htmlElement.style.scrollBehavior = 'auto';
      scrollToY(scrollY, { immediate: true });
      htmlElement.style.scrollBehavior = previousHtmlStyles.scrollBehavior;
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
      const clampedIndex = Math.max(0, Math.min(showcaseReelClips.length - 1, closestIndex));

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
  }, [isMobile, showcaseReelClips.length]);

  const handleReelCardTouchStart = useCallback(
    (event: TouchEvent<HTMLButtonElement>, clip: ReelClip) => {
      const touch = event.touches[0];
      if (!touch) return;
      reelCardTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
      reelCardDidDragRef.current = false;
      scheduleInteractionPrewarm(clip);
    },
    [scheduleInteractionPrewarm],
  );

  const handleReelCardTouchMove = useCallback((event: TouchEvent<HTMLButtonElement>) => {
    const start = reelCardTouchStartRef.current;
    const touch = event.touches[0];
    if (!start || !touch) return;

    if (
      Math.abs(touch.clientX - start.x) > REEL_CARD_TAP_SLOP_PX ||
      Math.abs(touch.clientY - start.y) > REEL_CARD_TAP_SLOP_PX
    ) {
      reelCardDidDragRef.current = true;
      clearInteractionPrewarm();
    }
  }, [clearInteractionPrewarm]);

  const handleReelCardTouchEnd = useCallback(() => {
    reelCardTouchStartRef.current = null;
  }, []);

  const handleReelCardClick = useCallback(
    (clip: ReelClip, index: number) => {
      if (reelCardDidDragRef.current) {
        reelCardDidDragRef.current = false;
        return;
      }
      scheduleInteractionPrewarm(clip);
      openReelPreview(clip, index);
    },
    [openReelPreview, scheduleInteractionPrewarm],
  );

  useEffect(() => {
    if (!isMobile) return;
    setInteractionPrewarmClip(null);
  }, [isMobile]);

  // Only the dismiss axis fades the backdrop — a sideways drag is navigation,
  // so the room it happens in should stay lit.
  const theaterDismissProgress = Math.min(
    Math.abs(theaterDrag.y) / THEATER_MAX_DRAG_DISTANCE,
    1,
  );
  const theaterNavProgress = Math.min(Math.abs(theaterDrag.x) / THEATER_MAX_DRAG_DISTANCE, 1);
  const theaterOverlayOpacity =
    (isTheaterVisible && !isTheaterDismissing ? 1 : 0) * (1 - theaterDismissProgress * 0.5);
  const theaterCardScale = 1 - theaterDismissProgress * 0.04 - theaterNavProgress * 0.02;
  const theaterCardRotation = theaterDrag.y * 0.0045 + theaterDrag.x * 0.016;

  const theaterCardTransform = isTheaterDismissing
    ? `translate3d(0, ${theaterDismissDirection * 112}vh, 0) scale(0.94) rotate(${theaterDismissDirection * 1.25}deg)`
    : isTheaterVisible
      ? `translate3d(${theaterDrag.x}px, ${theaterDrag.y}px, 0) scale(${theaterCardScale}) rotate(${theaterCardRotation}deg)`
      : 'translate3d(0, 18px, 0) scale(0.985)';

  const theaterCardTransition = isTheaterDragging
    ? 'transform 0ms linear, opacity 120ms linear'
    : isTheaterDismissing
      ? `transform ${THEATER_CLOSE_DURATION_MS}ms cubic-bezier(0.3, 0.72, 0.08, 1), opacity 220ms ease`
      : 'transform 360ms cubic-bezier(0.24, 0.92, 0.38, 1), opacity 240ms ease';

  const theaterCandidates = useMemo(
    () => createClipPlaybackCandidates(activeReelPreview, false),
    [activeReelPreview],
  );

  // Null during SSR/prerender, where the theater is never open anyway — so the
  // server and hydration trees stay identical.
  const theaterPortalTarget = typeof document === 'undefined' ? null : document.body;

  // ── Shared chapter header (mobile rail + desktop pinned gallery) ──
  const galleryHeader = (
    <div className="portfolio-content-enter mb-8 md:mb-10 flex flex-row items-end justify-between gap-6">
      <div>
        <h2 className="font-serif text-[2.4rem] md:text-[3.2rem] font-semibold tracking-tight-serif leading-[1]">
          <SplitTextReveal text={isEs ? 'Reels que' : 'Reels that'} delay={0.06} />{' '}
          <span className="italic text-primary">
            <SplitTextReveal text={isEs ? 'venden' : 'sell'} delay={0.2} />
          </span>
        </h2>
      </div>
      <div className="text-right shrink-0">
        {!isMobile && (
          <div className="font-serif text-2xl tabular-nums text-foreground leading-none">
            <span ref={galleryCounterRef}>01</span>
            <span className="text-muted-foreground/60"> / {String(showcaseReelClips.length).padStart(2, '0')}</span>
          </div>
        )}
        <div className="dc-index-meta mt-2 !text-muted-foreground/70">
          {isMobile ? (isEs ? 'desliza →' : 'swipe →') : isEs ? 'desplázate →' : 'scroll →'}
        </div>
      </div>
    </div>
  );

  // ── Shared reel card (mobile rail + desktop gallery track) ──
  const renderReelCard = (clip: ReelClip, index: number) => {
    const mobileCardDistance = Math.abs(activeMobileReelIndex - index);
    const isActiveMobileCard = isMobile && mobileCardDistance === 0;
    const shouldRenderPreview =
      !isTheaterOpen &&
      (isActiveMobileCard || (!isMobile && interactionPrewarmClip?.id === clip.id));

    return (
      <button
        type="button"
        key={clip.id}
        data-reel-card="true"
        className={
          isMobile
            ? 'portfolio-reel-card-motion group relative shrink-0 w-[70vw] sm:w-[55vw] aspect-[9/16] rounded-2xl overflow-hidden border border-border shadow-sm text-left hover:border-primary/40 transition-[transform,border-color] snap-center touch-manipulation'
            : 'portfolio-reel-card-motion dc-gallery-card group relative shrink-0 aspect-[9/16] overflow-hidden text-left touch-manipulation'
        }
        onMouseEnter={() => scheduleInteractionPrewarm(clip)}
        onMouseLeave={clearInteractionPrewarm}
        onPointerDown={() => scheduleInteractionPrewarm(clip)}
        onFocus={() => scheduleInteractionPrewarm(clip)}
        onBlur={clearInteractionPrewarm}
        onTouchStart={(event) => handleReelCardTouchStart(event, clip)}
        onTouchMove={handleReelCardTouchMove}
        onTouchEnd={handleReelCardTouchEnd}
        onTouchCancel={handleReelCardTouchEnd}
        onClick={() => handleReelCardClick(clip, index)}
        aria-label={getReelTitle(clip)}
      >
        {shouldRenderPreview ? (
          <AdaptiveVideo
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            src={clip.previewSrc}
            hlsSrc={clip.previewHlsSrc}
            poster={getBestPosterSrc(clip)}
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            loadStrategy="immediate"
            pauseOffscreen
            unloadWhenOffscreen
            playbackPriority="preview"
            aria-hidden="true"
          />
        ) : (
          <ResponsivePosterImage
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            clip={clip}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            aria-hidden="true"
          />
        )}
        <span className="dc-reel-chip dc-reel-chip--num" aria-hidden="true">
          Nº {String(index + 1).padStart(2, '0')}
        </span>
        <span className="dc-reel-chip dc-reel-chip--cat" aria-hidden="true">
          {categoryLabel(clip.category)}
        </span>
        <span className="dc-reel-play" aria-hidden="true">
          <Play className="h-5 w-5 fill-current" />
        </span>
        <span className="dc-reel-band" aria-hidden="true">
          <span className="dc-reel-title">{getReelTitle(clip)}</span>
          <span className="dc-reel-meta">{formatClipMeta(clip)}</span>
        </span>
      </button>
    );
  };

  return (
    <section
      id="portfolio"
      className="studio-section bg-secondary/5 pt-20 pb-16"
    >
      {isMobile ? (
      <div className="studio-container">
        {galleryHeader}

        <div className="studio-rule mb-10 md:mb-12" />

        <div className="portfolio-content-enter mb-12 md:mb-14">
          <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-background to-secondary/60" />
            <div className="absolute inset-y-0 left-0 w-6 sm:w-10 md:w-16 z-20 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-6 sm:w-10 md:w-16 z-20 bg-gradient-to-l from-background via-background/80 to-transparent" />

            <div className="relative z-10 mx-auto px-3 sm:px-6 md:px-10 lg:px-12 py-4 md:py-6">
              <div
                ref={reelScrollRef}
                className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-proximity md:snap-none overscroll-x-contain scroll-smooth"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {showcaseReelClips.map(renderReelCard)}
              </div>
              {/* Mobile: position counter instead of arrow chrome — swipe and
                  the peeking next card are the affordance */}
              <div className="md:hidden flex items-center justify-center gap-2.5 pt-1">
                <span className="section-label text-muted-foreground tabular-nums">
                  {String(activeMobileReelIndex + 1).padStart(2, '0')}
                </span>
                <span className="h-px w-7 bg-accent/40" />
                <span className="section-label text-muted-foreground/60 tabular-nums">
                  {String(showcaseReelClips.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
      ) : (
        /* ── Desktop Gallery: free-scroll horizontal rail ── */
        <div className="dc-gallery">
          <div className="studio-container w-full">
            {galleryHeader}
          </div>
          <div className="dc-gallery-shell">
            <button
              type="button"
              className="dc-gallery-arrow dc-gallery-arrow--prev"
              onClick={() => scrollGalleryBy(-1)}
              aria-label={isEs ? 'Reels anteriores' : 'Previous reels'}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="dc-gallery-arrow dc-gallery-arrow--next"
              onClick={() => scrollGalleryBy(1)}
              aria-label={isEs ? 'Más reels' : 'More reels'}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div ref={galleryViewportRef} className="dc-gallery-viewport">
              <div ref={galleryTrackRef} className="dc-gallery-track">
                {showcaseReelClips.map((clip, index) => (
                  <div key={clip.id} className="dc-track-item">
                    <span className="dc-ghost-num" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {renderReelCard(clip, index)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The theater is portaled to <body> on purpose: this section carries
          `content-visibility: auto`, which makes it a containing block for
          fixed descendants — rendered in place, `fixed inset-0` would anchor
          to the section box and the card would land wherever that box happens
          to sit, not centred in the viewport. */}
      {theaterPortalTarget && activeReelPreview
        ? createPortal(
            <div
              className="dc-theater-overlay fixed inset-0 z-[200] flex items-center justify-center"
              onClick={() => dismissReelPreview()}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: 'hsl(var(--theater-backdrop) / 0.86)',
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
                    'radial-gradient(circle at 20% 14%, hsl(var(--theater-backdrop-glow) / 0.14) 0%, transparent 48%), radial-gradient(circle at 82% 86%, hsl(var(--theater-backdrop-glow) / 0.1) 0%, transparent 56%)',
                }}
              />
              <div
                className="dc-theater-stage"
                onTouchStart={handleTheaterTouchStart}
                onTouchMove={handleTheaterTouchMove}
                onTouchEnd={handleTheaterTouchEnd}
                onTouchCancel={resetTheaterSwipe}
              >
                {/* Desktop keeps its arrows outside the frame; mobile puts them on
                    the card itself, where nothing can slide under the navbar. */}
                {!isMobile && (
                  <>
                    <button
                      type="button"
                      className="theater-control absolute left-0 top-1/2 -translate-x-[118%] -translate-y-1/2 z-[220] h-9 w-9 md:h-10 md:w-10"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        navigateReelPreview(-1);
                      }}
                      aria-label={t('portfolio.reelPreviewPrev')}
                    >
                      <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                    <button
                      type="button"
                      className="theater-control absolute right-0 top-1/2 translate-x-[118%] -translate-y-1/2 z-[220] h-9 w-9 md:h-10 md:w-10"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        navigateReelPreview(1);
                      }}
                      aria-label={t('portfolio.reelPreviewNext')}
                    >
                      <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </>
                )}
                <div
                  className="relative w-full overflow-hidden rounded-[1.45rem] border border-[hsl(var(--theater-edge)/0.88)] bg-black shadow-[0_34px_82px_-38px_rgba(0,0,0,0.78)]"
                  onClick={(event) => event.stopPropagation()}
                  style={{
                    transform: theaterCardTransform,
                    opacity: isTheaterDismissing ? 0 : isTheaterVisible ? 1 : 0,
                    transition: theaterCardTransition,
                  }}
                >
                  <button
                    type="button"
                    className="theater-control absolute right-3 top-3 z-40 h-10 w-10"
                    onClick={() => dismissReelPreview()}
                    aria-label={t('portfolio.reelPreviewClose')}
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {isMobile && (
                    <>
                      <button
                        type="button"
                        className="theater-control absolute left-2 top-1/2 z-40 h-10 w-10 -translate-y-1/2 opacity-75"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          navigateReelPreview(-1);
                        }}
                        aria-label={t('portfolio.reelPreviewPrev')}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="theater-control absolute right-2 top-1/2 z-40 h-10 w-10 -translate-y-1/2 opacity-75"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          navigateReelPreview(1);
                        }}
                        aria-label={t('portfolio.reelPreviewNext')}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}

                  <div className="relative">
                    <TheaterVideo
                      candidates={theaterCandidates}
                      poster={getBestPosterSrc(activeReelPreview)}
                      enableStartupFallback
                      startupFallbackMs={THEATER_QUALITY_FALLBACK_MS}
                    />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
                      <div className="h-36 bg-gradient-to-t from-black/80 via-black/28 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-5 sm:pb-5">
                        <p className="theater-meta-chip inline-flex max-w-[78%] items-center rounded-full px-2.5 py-1">
                          {t(`portfolio.categories.${activeReelPreview.category}`)}
                        </p>
                        <h4 className="theater-meta-title mt-2 max-w-[88%] text-base leading-snug sm:text-lg">
                          {getReelTitle(activeReelPreview)}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            theaterPortalTarget,
          )
        : null}
    </section>
  );
};

export default Portfolio;
