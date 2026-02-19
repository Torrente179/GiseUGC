import { useRef, useState, useCallback, useEffect, useMemo, memo, startTransition, type TouchEvent, type SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX, X } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { revealUp, springHoverTransition, staggerContainer } from '@/components/motion/variants';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import LazyVideo from '@/components/media/LazyVideo';
import VIDEO_LQIP from '@/data/video-lqip';

interface ReelClip {
  id: number;
  titleKey: string;
  category: 'fashion' | 'beauty' | 'tech' | 'lifestyle';
  mainSrc: string;
  mobileSrc: string;
  starterSrc: string;
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

type NavigatorConnection = {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  saveData?: boolean;
};

const THEATER_CLOSE_DURATION_MS = 320;
const THEATER_SWIPE_DISTANCE_THRESHOLD = 110;
const THEATER_SWIPE_VELOCITY_THRESHOLD = 0.45;
const THEATER_HORIZONTAL_SWIPE_DISTANCE_THRESHOLD = 72;
const THEATER_HORIZONTAL_SWIPE_VELOCITY_THRESHOLD = 0.35;
const THEATER_MAX_DRAG_DISTANCE = 260;
const REEL_CARD_TAP_SLOP_PX = 10;
const THEATER_VERTICAL_NAV_SWIPE_DISTANCE_THRESHOLD = 72;
const THEATER_VERTICAL_NAV_SWIPE_VELOCITY_THRESHOLD = 0.35;
const THEATER_FAST_FALLBACK_MS_SLOW = 250;
const THEATER_FAST_FALLBACK_MS_DEFAULT = 400;
const STARTUP_PREWARM_DELAY_DESKTOP_MS = 520;
const STARTUP_PREWARM_DELAY_MOBILE_MS = 400;
const PORTFOLIO_PREWARM_ROOT_MARGIN = '1200px 0px';
const THEATER_HD_CROSSFADE_MS = 150;
const THEATER_HD_READY_GUARD_MS = 2500;
const R2_MEDIA_BASE_URL = 'https://media.giselasaldarriaga.com';
const r2MainVideo = (filename: string) => `${R2_MEDIA_BASE_URL}/videos/main/${filename}`;
const r2MobileVideo = (filename: string) =>
  `${R2_MEDIA_BASE_URL}/videos/mobile/${filename.replace(/\.mp4$/, '-mobile.mp4')}`;
const r2StarterVideo = (filename: string) =>
  `${R2_MEDIA_BASE_URL}/videos/starter/${filename.replace(/\.mp4$/, '-starter.mp4')}`;
const r2PreviewVideo = (filename: string) =>
  `${R2_MEDIA_BASE_URL}/videos/previews/${filename.replace(/\.mp4$/, '-preview.mp4')}`;
const r2Poster = (filename: string) => `${R2_MEDIA_BASE_URL}/videos/posters/${filename}`;
const getLqip = (url: string) => {
  const filename = url.split('/').pop() ?? '';
  const key = filename.replace(/-preview\.mp4$/, '').replace(/-poster\.jpg$/, '').replace(/\.mp4$/, '');
  return VIDEO_LQIP[key] || undefined;
};

const REEL_CLIPS: ReelClip[] = [
  {
    id: 1,
    titleKey: 'portfolio.items.item1',
    category: 'lifestyle',
    mainSrc: r2MainVideo('ugc-lifestyle-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-lifestyle-review.mp4'),
    starterSrc: r2StarterVideo('ugc-lifestyle-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-lifestyle-review.mp4'),
    posterSrc: r2Poster('ugc-lifestyle-review-poster.jpg'),
  },
  {
    id: 2,
    titleKey: 'portfolio.items.item2',
    category: 'fashion',
    mainSrc: r2MainVideo('ugc-brand-spokesperson.mp4'),
    mobileSrc: r2MobileVideo('ugc-brand-spokesperson.mp4'),
    starterSrc: r2StarterVideo('ugc-brand-spokesperson.mp4'),
    previewSrc: r2PreviewVideo('ugc-brand-spokesperson.mp4'),
    posterSrc: r2Poster('ugc-brand-spokesperson-poster.jpg'),
  },
  {
    id: 3,
    titleKey: 'portfolio.items.item3',
    category: 'tech',
    mainSrc: r2MainVideo('ugc-voicebot-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-voicebot-review.mp4'),
    starterSrc: r2StarterVideo('ugc-voicebot-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-voicebot-review.mp4'),
    posterSrc: r2Poster('ugc-voicebot-review-poster.jpg'),
  },
  {
    id: 4,
    titleKey: 'portfolio.items.item4',
    category: 'beauty',
    mainSrc: r2MainVideo('ugc-creatine-supplement-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-creatine-supplement-review.mp4'),
    starterSrc: r2StarterVideo('ugc-creatine-supplement-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-creatine-supplement-review.mp4'),
    posterSrc: r2Poster('ugc-creatine-supplement-review-poster.jpg'),
  },
  {
    id: 5,
    titleKey: 'portfolio.items.item5',
    category: 'lifestyle',
    mainSrc: r2MainVideo('ugc-business-promotion.mp4'),
    mobileSrc: r2MobileVideo('ugc-business-promotion.mp4'),
    starterSrc: r2StarterVideo('ugc-business-promotion.mp4'),
    previewSrc: r2PreviewVideo('ugc-business-promotion.mp4'),
    posterSrc: r2Poster('ugc-business-promotion-poster.jpg'),
  },
  {
    id: 6,
    titleKey: 'portfolio.items.item6',
    category: 'fashion',
    mainSrc: r2MainVideo('ugc-services-presentation.mp4'),
    mobileSrc: r2MobileVideo('ugc-services-presentation.mp4'),
    starterSrc: r2StarterVideo('ugc-services-presentation.mp4'),
    previewSrc: r2PreviewVideo('ugc-services-presentation.mp4'),
    posterSrc: r2Poster('ugc-services-presentation-poster.jpg'),
  },
  {
    id: 7,
    titleKey: 'portfolio.items.item7',
    category: 'tech',
    mainSrc: r2MainVideo('ugc-ai-services-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-ai-services-review.mp4'),
    starterSrc: r2StarterVideo('ugc-ai-services-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-ai-services-review.mp4'),
    posterSrc: r2Poster('ugc-ai-services-review-poster.jpg'),
  },
  {
    id: 8,
    titleKey: 'portfolio.items.item8',
    category: 'lifestyle',
    mainSrc: r2MainVideo('ugc-lifestyle-review-2.mp4'),
    mobileSrc: r2MobileVideo('ugc-lifestyle-review-2.mp4'),
    starterSrc: r2StarterVideo('ugc-lifestyle-review-2.mp4'),
    previewSrc: r2PreviewVideo('ugc-lifestyle-review-2.mp4'),
    posterSrc: r2Poster('ugc-lifestyle-review-2-poster.jpg'),
  },
  {
    id: 9,
    titleKey: 'portfolio.items.item9',
    category: 'tech',
    mainSrc: r2MainVideo('ugc-voiceover-bots-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-voiceover-bots-review.mp4'),
    starterSrc: r2StarterVideo('ugc-voiceover-bots-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-voiceover-bots-review.mp4'),
    posterSrc: r2Poster('ugc-voiceover-bots-review-poster.jpg'),
  },
  {
    id: 10,
    titleKey: 'portfolio.items.item10',
    category: 'lifestyle',
    mainSrc: r2MainVideo('ugc-lifestyle-review-3.mp4'),
    mobileSrc: r2MobileVideo('ugc-lifestyle-review-3.mp4'),
    starterSrc: r2StarterVideo('ugc-lifestyle-review-3.mp4'),
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

const TheaterVideo = memo(({
  sources,
  starterSrc,
  useStarter,
  poster,
  enableStartupFallback,
  startupFallbackMs,
}: {
  sources: string[];
  starterSrc?: string;
  useStarter: boolean;
  poster: string;
  enableStartupFallback: boolean;
  startupFallbackMs: number;
}) => {
  const hdVideoRef = useRef<HTMLVideoElement>(null);
  const starterVideoRef = useRef<HTMLVideoElement>(null);
  const startupTimeoutRef = useRef<number | null>(null);
  const hdReadyGuardRef = useRef<number | null>(null);
  const starterTeardownTimeoutRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSourceIndex, setActiveSourceIndex] = useState(0);
  const [starterSource, setStarterSource] = useState('');
  const [isStarterVisible, setIsStarterVisible] = useState(false);
  const [isHdVisible, setIsHdVisible] = useState(true);
  const [starterFailed, setStarterFailed] = useState(false);
  const sourceKey = sources.join('|');
  const activeSource = sources[activeSourceIndex] ?? sources[0] ?? '';
  const shouldUseStarter = useStarter && Boolean(starterSrc) && !starterFailed;

  const clearStartupTimeout = useCallback(() => {
    if (startupTimeoutRef.current !== null) {
      window.clearTimeout(startupTimeoutRef.current);
      startupTimeoutRef.current = null;
    }
  }, []);

  const clearHdReadyGuard = useCallback(() => {
    if (hdReadyGuardRef.current !== null) {
      window.clearTimeout(hdReadyGuardRef.current);
      hdReadyGuardRef.current = null;
    }
  }, []);

  const clearStarterTeardownTimeout = useCallback(() => {
    if (starterTeardownTimeoutRef.current !== null) {
      window.clearTimeout(starterTeardownTimeoutRef.current);
      starterTeardownTimeoutRef.current = null;
    }
  }, []);

  const promoteFallbackSource = useCallback(() => {
    setActiveSourceIndex((previousIndex) => {
      if (previousIndex + 1 >= sources.length) return previousIndex;
      return previousIndex + 1;
    });
  }, [sources.length]);

  const attemptHdPlay = useCallback(async (preferAudio: boolean) => {
    const video = hdVideoRef.current;
    if (!video) return;

    video.defaultPlaybackRate = 1;
    video.playbackRate = 1;

    if (preferAudio) {
      video.muted = false;
      setIsMuted(false);
    }

    try {
      await video.play();
      setIsPlaying(true);
      setIsMuted(video.muted);
    } catch {
      if (!video.muted) {
        video.muted = true;
        setIsMuted(true);
      }
      try {
        await video.play();
        setIsPlaying(true);
        setIsMuted(video.muted);
      } catch {
        throw new Error('HD play failed');
      }
    }
  }, []);

  const scheduleStartupFallback = useCallback(() => {
    clearStartupTimeout();
    if (!enableStartupFallback) return;
    if (shouldUseStarter) return;
    if (activeSourceIndex + 1 >= sources.length) return;
    startupTimeoutRef.current = window.setTimeout(() => {
      const video = hdVideoRef.current;
      if (!video || !video.paused || video.readyState >= 2) return;
      promoteFallbackSource();
    }, startupFallbackMs);
  }, [
    activeSourceIndex,
    clearStartupTimeout,
    enableStartupFallback,
    promoteFallbackSource,
    shouldUseStarter,
    sources.length,
    startupFallbackMs,
  ]);

  const teardownStarterLayer = useCallback(() => {
    const starterVideo = starterVideoRef.current;
    if (starterVideo) {
      starterVideo.pause();
      starterVideo.removeAttribute('src');
      starterVideo.load();
    }
    setStarterSource('');
    setIsStarterVisible(false);
  }, []);

  const switchToHd = useCallback(() => {
    const hdVideo = hdVideoRef.current;
    if (!hdVideo || isHdVisible) return;

    const starterVideo = starterVideoRef.current;
    if (starterVideo) {
      const starterTime = Number.isFinite(starterVideo.currentTime) ? starterVideo.currentTime : 0;
      const hdDuration = Number.isFinite(hdVideo.duration) ? hdVideo.duration : 0;
      const clampedTime =
        hdDuration > 0 ? Math.min(starterTime, Math.max(0, hdDuration - 0.05)) : Math.max(0, starterTime);
      try {
        hdVideo.currentTime = clampedTime;
      } catch {
        // Some mobile browsers may block currentTime jumps before enough data is parsed.
      }
    }

    const run = async () => {
      try {
        await attemptHdPlay(true);
      } catch {
        const video = hdVideoRef.current;
        if (!video) return;
        video.muted = true;
        setIsMuted(true);
        try {
          await video.play();
          setIsPlaying(true);
        } catch {
          return;
        }
      }

      clearStartupTimeout();
      clearHdReadyGuard();
      clearStarterTeardownTimeout();
      setIsHdVisible(true);
      starterTeardownTimeoutRef.current = window.setTimeout(() => {
        teardownStarterLayer();
      }, THEATER_HD_CROSSFADE_MS + 40);
    };

    void run();
  }, [
    attemptHdPlay,
    clearHdReadyGuard,
    clearStartupTimeout,
    clearStarterTeardownTimeout,
    isHdVisible,
    teardownStarterLayer,
  ]);

  const handlePlay = () => {
    clearStartupTimeout();
    setIsPlaying(true);
  };
  const handlePause = () => setIsPlaying(false);
  const handleWaiting = () => setIsPlaying(false);
  const handlePlaying = () => {
    clearStartupTimeout();
    setIsPlaying(true);
    const video = hdVideoRef.current;
    if (video) setIsMuted(video.muted);
  };

  const handleError = useCallback(() => {
    clearStartupTimeout();
    clearHdReadyGuard();
    promoteFallbackSource();
  }, [clearHdReadyGuard, clearStartupTimeout, promoteFallbackSource]);

  const togglePlayback = useCallback(() => {
    const video = hdVideoRef.current;
    if (!video) return;
    video.defaultPlaybackRate = 1;
    video.playbackRate = 1;
    if (video.paused) {
      if (shouldUseStarter && !isHdVisible) {
        switchToHd();
        const starterVideo = starterVideoRef.current;
        if (starterVideo?.paused) {
          void starterVideo.play().catch(() => undefined);
        }
        return;
      }

      void attemptHdPlay(true).catch(() => {
        promoteFallbackSource();
      });
    } else {
      video.pause();
      starterVideoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [attemptHdPlay, isHdVisible, promoteFallbackSource, shouldUseStarter, switchToHd]);

  const toggleMute = useCallback(() => {
    const video = hdVideoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      void attemptHdPlay(true).catch(() => undefined);
    }
  }, [attemptHdPlay]);

  const handleHdLoadedData = useCallback((event: SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    if (video.readyState < 2) return;
    if (shouldUseStarter && !isHdVisible) {
      switchToHd();
      return;
    }
    clearStartupTimeout();
    void attemptHdPlay(true).catch(() => {
      promoteFallbackSource();
    });
  }, [attemptHdPlay, clearStartupTimeout, isHdVisible, promoteFallbackSource, shouldUseStarter, switchToHd]);

  const handleStarterError = useCallback(() => {
    setStarterFailed(true);
    teardownStarterLayer();
    setIsHdVisible(true);
    void attemptHdPlay(true).catch(() => {
      promoteFallbackSource();
    });
  }, [attemptHdPlay, promoteFallbackSource, teardownStarterLayer]);

  const handleTimeUpdate = useCallback((e: SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (!video.paused && !isPlaying) setIsPlaying(true);
  }, [isPlaying]);

  useEffect(() => {
    setStarterFailed(false);
    setActiveSourceIndex(0);
    if (useStarter && starterSrc) {
      setStarterSource(starterSrc);
      setIsStarterVisible(true);
      setIsHdVisible(false);
    } else {
      setStarterSource('');
      setIsStarterVisible(false);
      setIsHdVisible(true);
    }
  }, [sourceKey, starterSrc, useStarter]);

  useEffect(() => {
    const video = hdVideoRef.current;
    if (!video || !activeSource) return;

    clearHdReadyGuard();
    clearStarterTeardownTimeout();
    setIsPlaying(false);
    video.muted = false;
    setIsMuted(false);
    video.load();

    if (shouldUseStarter && starterSource) {
      clearStartupTimeout();
      hdReadyGuardRef.current = window.setTimeout(() => {
        // Keep starter visible while HD continues buffering. No-op guard avoids black frames.
      }, THEATER_HD_READY_GUARD_MS);
      const starterVideo = starterVideoRef.current;
      if (starterVideo) {
        starterVideo.defaultPlaybackRate = 1;
        starterVideo.playbackRate = 1;
        void starterVideo.play().catch(() => undefined);
        setIsPlaying(true);
      }
    } else {
      scheduleStartupFallback();
      void attemptHdPlay(true).catch(() => {
        promoteFallbackSource();
      });
    }

    return () => {
      clearStartupTimeout();
      clearHdReadyGuard();
      clearStarterTeardownTimeout();
    };
  }, [
    activeSource,
    attemptHdPlay,
    clearHdReadyGuard,
    clearStartupTimeout,
    clearStarterTeardownTimeout,
    promoteFallbackSource,
    scheduleStartupFallback,
    shouldUseStarter,
    starterSource,
  ]);

  useEffect(() => {
    return () => {
      clearStartupTimeout();
      clearHdReadyGuard();
      clearStarterTeardownTimeout();
    };
  }, [clearHdReadyGuard, clearStartupTimeout, clearStarterTeardownTimeout]);

  return (
    <div className="relative overflow-hidden bg-black">
      {shouldUseStarter && starterSource && (
        <video
          ref={starterVideoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ${isStarterVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDuration: `${THEATER_HD_CROSSFADE_MS}ms` }}
          src={starterSource}
          poster={poster}
          preload="auto"
          muted
          autoPlay
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          onPlay={() => {
            if (!isHdVisible) setIsPlaying(true);
          }}
          onError={handleStarterError}
          aria-hidden="true"
        />
      )}
      <video
        ref={hdVideoRef}
        className={`w-full aspect-[9/16] object-cover transition-opacity ${isHdVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDuration: `${THEATER_HD_CROSSFADE_MS}ms` }}
        src={activeSource}
        poster={poster}
        preload="auto"
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        onLoadedMetadata={(event) => {
          event.currentTarget.defaultPlaybackRate = 1;
          event.currentTarget.playbackRate = 1;
          setIsMuted(event.currentTarget.muted);
        }}
        onLoadedData={handleHdLoadedData}
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
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/45 bg-black/40 backdrop-blur-sm shadow-[0_10px_24px_-16px_rgba(0,0,0,0.88)]">
          {isPlaying ? (
            <Pause className="h-5 w-5 text-white/90" fill="currentColor" />
          ) : (
            <Play className="h-5 w-5 text-white/90 ml-0.5" fill="currentColor" />
          )}
        </span>
      </button>
      <button
        type="button"
        className="absolute top-3 left-3 z-20 h-9 w-9 rounded-full border border-white/40 bg-black/40 text-white backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-black/55"
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
});

TheaterVideo.displayName = 'TheaterVideo';

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
  const [theaterPrewarmDirection, setTheaterPrewarmDirection] = useState<1 | -1>(1);
  const [startupPrewarmEnabled, setStartupPrewarmEnabled] = useState(false);
  const [isPortfolioNearViewport, setIsPortfolioNearViewport] = useState(false);
  const [interactionPrewarmClip, setInteractionPrewarmClip] = useState<ReelClip | null>(null);
  const [theaterPreloadsReady, setTheaterPreloadsReady] = useState(false);

  const portfolioSectionRef = useRef<HTMLElement | null>(null);
  const collageVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const reelScrollRef = useRef<HTMLDivElement>(null);
  const reelScrollStepRef = useRef(212);
  const reelCardTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const reelCardDidDragRef = useRef(false);
  const theaterSwipeStartRef = useRef<TheaterSwipeGesture | null>(null);
  const theaterCloseTimerRef = useRef<number | null>(null);
  const theaterDragFrameRef = useRef<number | null>(null);
  const theaterPendingDragYRef = useRef(0);
  const interactionPrewarmTimerRef = useRef<number | null>(null);
  const linkPreloadRefs = useRef<HTMLLinkElement[]>([]);

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
      setInteractionPrewarmClip((previousClip) => (previousClip?.id === clip.id ? previousClip : clip));
      if (interactionPrewarmTimerRef.current !== null) {
        window.clearTimeout(interactionPrewarmTimerRef.current);
      }
      interactionPrewarmTimerRef.current = window.setTimeout(() => {
        setInteractionPrewarmClip(null);
        interactionPrewarmTimerRef.current = null;
      }, 2800);
    },
    [],
  );

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
      scheduleInteractionPrewarm(clip);
      theaterSwipeStartRef.current = null;
      // Critical: mount TheaterVideo immediately so video src is assigned ASAP
      setActiveReelPreview(clip);
      setActiveReelIndex(index);
      // Cosmetic state: defer so animation bookkeeping doesn't block video mount
      startTransition(() => {
        setTheaterDismissDirection(1);
        setTheaterPrewarmDirection(1);
        setIsTheaterDismissing(false);
        setIsTheaterDragging(false);
        setIsTheaterVisible(false);
        queueTheaterDrag(0);
      });
    },
    [clearTheaterCloseTimer, queueTheaterDrag, scheduleInteractionPrewarm],
  );

  const navigateReelPreview = useCallback(
    (direction: 1 | -1) => {
      if (activeReelIndex === null) return;
      setTheaterPrewarmDirection(direction);
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

  const connectionProfile = useMemo(() => {
    if (typeof navigator === 'undefined') {
      return { constrained: false, slow: false };
    }
    const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
    if (!connection) {
      return { constrained: false, slow: false };
    }
    const constrained =
      Boolean(connection.saveData) ||
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g';
    const slow = constrained || connection.effectiveType === '3g';
    return { constrained, slow };
  }, []);

  useEffect(() => {
    if (!activeReelPreview) {
      setIsTheaterVisible(false);
      setTheaterPreloadsReady(false);
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      setIsTheaterVisible(true);
    });

    const schedulePreloads = typeof requestIdleCallback === 'function'
      ? requestIdleCallback
      : (cb: () => void) => setTimeout(cb, 150);
    const cancelPreloads = typeof cancelIdleCallback === 'function'
      ? cancelIdleCallback
      : clearTimeout;

    const preloadId = schedulePreloads(() => {
      setTheaterPreloadsReady(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      cancelPreloads(preloadId);
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
    return () => {
      if (interactionPrewarmTimerRef.current !== null) {
        window.clearTimeout(interactionPrewarmTimerRef.current);
        interactionPrewarmTimerRef.current = null;
      }
    };
  }, []);

  const clearLinkPreloads = useCallback(() => {
    if (linkPreloadRefs.current.length === 0) return;
    linkPreloadRefs.current.forEach((link) => link.remove());
    linkPreloadRefs.current = [];
  }, []);

  // Keep intent prewarm starter-first so theater can render motion instantly,
  // then warm preferred HD source right after.
  useEffect(() => {
    clearLinkPreloads();
    if (!interactionPrewarmClip || connectionProfile.constrained) return;

    const preferredHdSrc = isMobile ? interactionPrewarmClip.mobileSrc : interactionPrewarmClip.mainSrc;
    const preloadSources = [interactionPrewarmClip.starterSrc, preferredHdSrc].filter(
      (source, index, list): source is string =>
        Boolean(source) && list.indexOf(source) === index,
    );

    preloadSources.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = src;
      document.head.appendChild(link);
      linkPreloadRefs.current.push(link);
    });

    return () => {
      clearLinkPreloads();
    };
  }, [clearLinkPreloads, connectionProfile.constrained, interactionPrewarmClip, isMobile]);

  useEffect(() => {
    return () => {
      clearLinkPreloads();
    };
  }, [clearLinkPreloads]);

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
      htmlElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollY);
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

  useEffect(() => {
    const section = portfolioSectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') {
      setIsPortfolioNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setIsPortfolioNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: PORTFOLIO_PREWARM_ROOT_MARGIN },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (startupPrewarmEnabled) return;
    if (connectionProfile.constrained) return;
    if (!isPortfolioNearViewport) return;

    const timeoutId = window.setTimeout(
      () => {
        setStartupPrewarmEnabled(true);
      },
      isMobile ? STARTUP_PREWARM_DELAY_MOBILE_MS : STARTUP_PREWARM_DELAY_DESKTOP_MS,
    );

    return () => window.clearTimeout(timeoutId);
  }, [connectionProfile.constrained, isMobile, isPortfolioNearViewport, startupPrewarmEnabled]);

  const theaterDragDistance = Math.abs(theaterDragY);
  const theaterDragProgress = Math.min(theaterDragDistance / THEATER_MAX_DRAG_DISTANCE, 1);
  const theaterOverlayOpacity =
    (isTheaterVisible && !isTheaterDismissing ? 1 : 0) * (1 - theaterDragProgress * 0.5);
  const theaterCardScale = 1 - theaterDragProgress * 0.04;
  const theaterCardRotation = theaterDragY * 0.0045;

  const theaterCardTransform = isTheaterDismissing
    ? `translate3d(0, ${theaterDismissDirection * 112}vh, 0) scale(0.94) rotate(${theaterDismissDirection * 1.25}deg)`
    : isTheaterVisible
      ? `translate3d(0, ${theaterDragY}px, 0) scale(${theaterCardScale}) rotate(${theaterCardRotation}deg)`
      : 'translate3d(0, 18px, 0) scale(0.985)';

  const theaterCardTransition = isTheaterDragging
    ? 'transform 0ms linear, opacity 120ms linear'
    : isTheaterDismissing
      ? `transform ${THEATER_CLOSE_DURATION_MS}ms cubic-bezier(0.3, 0.72, 0.08, 1), opacity 220ms ease`
      : 'transform 360ms cubic-bezier(0.24, 0.92, 0.38, 1), opacity 240ms ease';

  const shouldPreferMobileTheaterSource = isMobile;

  const getOrderedTheaterSources = useCallback((clip: ReelClip | null) => {
    if (!clip) return [];
    if (shouldPreferMobileTheaterSource) {
      return [clip.mobileSrc, clip.mainSrc];
    }
    return [clip.mainSrc, clip.mobileSrc];
  }, [shouldPreferMobileTheaterSource]);

  const likelyNextTheaterClip = useMemo(() => {
    if (activeReelIndex === null) return null;
    const index = (activeReelIndex + theaterPrewarmDirection + REEL_CLIPS.length) % REEL_CLIPS.length;
    return REEL_CLIPS[index] ?? null;
  }, [activeReelIndex, theaterPrewarmDirection]);

  const startupPreviewPreloadClips = useMemo(() => {
    if (!startupPrewarmEnabled) return [];
    const clipCount = connectionProfile.slow ? 1 : isMobile ? 2 : 3;
    return REEL_CLIPS.slice(0, clipCount);
  }, [connectionProfile.slow, isMobile, startupPrewarmEnabled]);

  const startupMainPreloadClips = useMemo(() => {
    if (!startupPrewarmEnabled) return [];
    const clipCount = connectionProfile.slow || isMobile ? 0 : 1;
    return REEL_CLIPS.slice(0, clipCount);
  }, [connectionProfile.slow, isMobile, startupPrewarmEnabled]);

  const startupMobilePreloadClips = useMemo(() => {
    if (!startupPrewarmEnabled) return [];
    const clipCount = connectionProfile.slow ? 0 : isMobile ? 2 : 0;
    return REEL_CLIPS.slice(0, clipCount);
  }, [connectionProfile.slow, isMobile, startupPrewarmEnabled]);

  const theaterStartupFallbackMs = useMemo(
    () => (connectionProfile.slow ? THEATER_FAST_FALLBACK_MS_SLOW : THEATER_FAST_FALLBACK_MS_DEFAULT),
    [connectionProfile.slow],
  );

  const theaterSources = useMemo(() => {
    return getOrderedTheaterSources(activeReelPreview);
  }, [activeReelPreview, getOrderedTheaterSources]);

  const currentTheaterPrewarmSources = useMemo(() => {
    if (!activeReelPreview) return [];
    const preferredHdSource = getOrderedTheaterSources(activeReelPreview)[0];
    return [activeReelPreview.starterSrc, preferredHdSource].filter(
      (source, index, list): source is string =>
        Boolean(source) && list.indexOf(source) === index,
    );
  }, [activeReelPreview, getOrderedTheaterSources]);

  const nextTheaterPrewarmSources = useMemo(() => {
    if (!likelyNextTheaterClip) return [];
    const preferredHdSource = getOrderedTheaterSources(likelyNextTheaterClip)[0];
    return [likelyNextTheaterClip.starterSrc, preferredHdSource].filter(
      (source, index, list): source is string =>
        Boolean(source) && list.indexOf(source) === index,
    );
  }, [getOrderedTheaterSources, likelyNextTheaterClip]);

  const interactionPrewarmSources = useMemo(() => {
    if (!interactionPrewarmClip) return [];
    const preferredHdSource = getOrderedTheaterSources(interactionPrewarmClip)[0];
    return [interactionPrewarmClip.starterSrc, preferredHdSource].filter(
      (source, index, list): source is string =>
        Boolean(source) && list.indexOf(source) === index,
    );
  }, [getOrderedTheaterSources, interactionPrewarmClip]);

  const instantPrewarmClip = useMemo(() => {
    if (!isPortfolioNearViewport || connectionProfile.slow) return null;
    const clipIndex = isMobile ? activeMobileReelIndex : 0;
    return REEL_CLIPS[clipIndex] ?? REEL_CLIPS[0] ?? null;
  }, [activeMobileReelIndex, connectionProfile.slow, isMobile, isPortfolioNearViewport]);

  const instantPrewarmSources = useMemo(() => {
    if (!instantPrewarmClip) return [];
    const preferredHdSource = getOrderedTheaterSources(instantPrewarmClip)[0];
    return [instantPrewarmClip.starterSrc, preferredHdSource].filter(
      (source, index, list): source is string =>
        Boolean(source) && list.indexOf(source) === index,
    );
  }, [getOrderedTheaterSources, instantPrewarmClip]);


  return (
    <section ref={portfolioSectionRef} id="portfolio" className="studio-section bg-secondary/5 pt-20 pb-16">
      {!isTheaterOpen && instantPrewarmSources.length > 0 && (
        <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
          {instantPrewarmSources.map((src, index) => (
            <video
              key={`instant-prewarm-${instantPrewarmClip?.id ?? 'fallback'}-${index}`}
              src={src}
              preload={index === 0 ? 'auto' : 'metadata'}
              muted
              playsInline
              disablePictureInPicture
              disableRemotePlayback
              tabIndex={-1}
            />
          ))}
        </div>
      )}
      {startupPrewarmEnabled && (
        <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
          {startupPreviewPreloadClips.map((clip, index) => (
            <video
              key={`startup-prewarm-preview-${clip.id}`}
              src={clip.previewSrc}
              preload={index === 0 ? 'auto' : 'metadata'}
              muted
              playsInline
              disablePictureInPicture
              disableRemotePlayback
              tabIndex={-1}
            />
          ))}
          {startupMainPreloadClips.map((clip) => (
            <video
              key={`startup-prewarm-main-${clip.id}`}
              src={clip.mainSrc}
              preload="metadata"
              muted
              playsInline
              disablePictureInPicture
              disableRemotePlayback
              tabIndex={-1}
            />
          ))}
          {startupMobilePreloadClips.map((clip) => (
            <video
              key={`startup-prewarm-mobile-${clip.id}`}
              src={clip.mobileSrc}
              preload="metadata"
              muted
              playsInline
              disablePictureInPicture
              disableRemotePlayback
              tabIndex={-1}
            />
          ))}
        </div>
      )}
      {interactionPrewarmClip && (
        <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
          {interactionPrewarmSources.map((src, index) => (
            <video
              key={`interaction-prewarm-${interactionPrewarmClip.id}-${index}`}
              src={src}
              preload={index === 0 ? 'auto' : 'metadata'}
              muted
              playsInline
              disablePictureInPicture
              disableRemotePlayback
              tabIndex={-1}
            />
          ))}
        </div>
      )}
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
                      aria-label={t(clip.titleKey)}
                      whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.02 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                      transition={springHoverTransition}
                    >
                      <LazyVideo
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={clip.previewSrc}
                        poster={clip.posterSrc}
                        lqip={getLqip(clip.previewSrc)}
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
                  lqip={getLqip(clip.previewSrc)}
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
                    lqip={getLqip(clip.previewSrc)}
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
            className="absolute inset-0 backdrop-blur-[6px] md:backdrop-blur-[10px]"
            style={{
              backgroundColor: 'hsl(var(--theater-backdrop) / 0.74)',
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
            className="relative w-full max-w-[430px]"
            onTouchStart={handleTheaterTouchStart}
            onTouchMove={handleTheaterTouchMove}
            onTouchEnd={handleTheaterTouchEnd}
            onTouchCancel={resetTheaterSwipe}
          >
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
                className="theater-control absolute right-3 top-3 z-30 h-9 w-9"
                onClick={() => dismissReelPreview()}
                aria-label={t('portfolio.reelPreviewClose')}
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative">
                {theaterPreloadsReady && (
                  <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
                    {currentTheaterPrewarmSources.map((src, index) => (
                      <video
                        key={`theater-preload-current-${activeReelPreview.id}-${index}`}
                        src={src}
                        preload={index === 0 ? 'auto' : 'metadata'}
                        muted
                        playsInline
                        disablePictureInPicture
                        disableRemotePlayback
                        tabIndex={-1}
                      />
                    ))}
                    {nextTheaterPrewarmSources.map((src, index) => (
                      <video
                        key={`theater-preload-next-${likelyNextTheaterClip?.id ?? 'none'}-${index}`}
                        src={src}
                        preload="metadata"
                        muted
                        playsInline
                        disablePictureInPicture
                        disableRemotePlayback
                        tabIndex={-1}
                      />
                    ))}
                  </div>
                )}

                <TheaterVideo
                  sources={theaterSources}
                  starterSrc={activeReelPreview.starterSrc}
                  useStarter={isMobile}
                  poster={activeReelPreview.posterSrc}
                  enableStartupFallback={isMobile}
                  startupFallbackMs={theaterStartupFallbackMs}
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
                  <div className="h-36 bg-gradient-to-t from-black/80 via-black/28 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-5 sm:pb-5">
                    <p className="theater-meta-chip inline-flex max-w-[78%] items-center rounded-full px-2.5 py-1">
                      {t(`portfolio.categories.${activeReelPreview.category}`)}
                    </p>
                    <h4 className="theater-meta-title mt-2 max-w-[88%] text-base leading-snug sm:text-lg">
                      {t(activeReelPreview.titleKey)}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
