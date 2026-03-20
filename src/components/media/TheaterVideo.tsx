import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TheaterVideoProps {
  sources: string[];
  poster: string;
  enableStartupFallback?: boolean;
  startupFallbackMs?: number;
  className?: string;
}

const DEFAULT_STARTUP_FALLBACK_MS = 400;

const TheaterVideo = memo(
  ({
    sources,
    poster,
    enableStartupFallback = false,
    startupFallbackMs = DEFAULT_STARTUP_FALLBACK_MS,
    className,
  }: TheaterVideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const startupTimeoutRef = useRef<number | null>(null);
    const hideTimeoutRef = useRef<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [activeSourceIndex, setActiveSourceIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [controlsVisible, setControlsVisible] = useState(true);
    const sourceKey = sources.join('|');
    const activeSource = sources[activeSourceIndex] ?? sources[0] ?? '';

    const clearStartupTimeout = useCallback(() => {
      if (startupTimeoutRef.current !== null) {
        window.clearTimeout(startupTimeoutRef.current);
        startupTimeoutRef.current = null;
      }
    }, []);

    /* ── Auto-hide controls ── */
    const scheduleHideControls = useCallback(() => {
      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = window.setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }, []);

    const showControls = useCallback(() => {
      setControlsVisible(true);
      scheduleHideControls();
    }, [scheduleHideControls]);

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
          setIsMuted(video.muted);
        } catch {
          if (!video.muted) {
            video.muted = true;
            setIsMuted(true);
          }
          try {
            await video.play();
            setIsMuted(video.muted);
          } catch {
            promoteFallbackSource();
          }
        }
      };

      void run();
    }, [promoteFallbackSource]);

    const scheduleStartupFallback = useCallback(() => {
      clearStartupTimeout();
      if (!enableStartupFallback) return;
      if (activeSourceIndex + 1 >= sources.length) return;
      startupTimeoutRef.current = window.setTimeout(() => {
        const video = videoRef.current;
        if (!video || !video.paused || video.readyState >= 2) return;
        promoteFallbackSource();
      }, startupFallbackMs);
    }, [
      activeSourceIndex,
      clearStartupTimeout,
      enableStartupFallback,
      promoteFallbackSource,
      sources.length,
      startupFallbackMs,
    ]);

    const handlePlay = () => {
      clearStartupTimeout();
      setIsPlaying(true);
      scheduleHideControls();
    };
    const handlePause = () => {
      setIsPlaying(false);
      setControlsVisible(true);
      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
    const handleWaiting = () => setIsPlaying(false);
    const handlePlaying = () => {
      clearStartupTimeout();
      setIsPlaying(true);
      const video = videoRef.current;
      if (video) setIsMuted(video.muted);
      scheduleHideControls();
    };

    const handleCanPlayThrough = useCallback(() => {
      clearStartupTimeout();
    }, [clearStartupTimeout]);

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
        setIsMuted(false);
        attemptPlay();
      } else {
        video.pause();
      }
    }, [attemptPlay]);

    const toggleMute = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      const video = videoRef.current;
      if (!video) return;
      const nextMuted = !video.muted;
      video.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted) {
        attemptPlay();
      }
    }, [attemptPlay]);

    const handleTimeUpdate = useCallback(
      (event: SyntheticEvent<HTMLVideoElement>) => {
        const video = event.currentTarget;
        if (!video.paused && !isPlaying) setIsPlaying(true);
        if (video.duration > 0) {
          setProgress((video.currentTime / video.duration) * 100);
        }
      },
      [isPlaying],
    );

    const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const video = videoRef.current;
      if (!video || !video.duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      video.currentTime = fraction * video.duration;
      setProgress(fraction * 100);
    }, []);

    useEffect(() => {
      setActiveSourceIndex(0);
    }, [sourceKey]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video || !activeSource) return;

      setIsPlaying(false);
      video.muted = false;
      setIsMuted(false);
      video.load();
      scheduleStartupFallback();
      attemptPlay();

      return () => {
        clearStartupTimeout();
      };
    }, [activeSource, attemptPlay, clearStartupTimeout, scheduleStartupFallback]);

    useEffect(() => {
      return () => {
        clearStartupTimeout();
        if (hideTimeoutRef.current !== null) {
          window.clearTimeout(hideTimeoutRef.current);
        }
      };
    }, [clearStartupTimeout]);

    return (
      <div
        className={cn('theater-floating relative overflow-hidden', className)}
        onMouseMove={showControls}
        onTouchStart={showControls}
      >
        <video
          ref={videoRef}
          className="w-full aspect-[9/16] object-cover"
          src={activeSource || undefined}
          poster={poster}
          preload="auto"
          autoPlay
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          onLoadedMetadata={(event) => {
            event.currentTarget.defaultPlaybackRate = 1;
            event.currentTarget.playbackRate = 1;
            setIsMuted(event.currentTarget.muted);
          }}
          onPlay={handlePlay}
          onPause={handlePause}
          onWaiting={handleWaiting}
          onPlaying={handlePlaying}
          onCanPlayThrough={handleCanPlayThrough}
          onError={handleError}
          onTimeUpdate={handleTimeUpdate}
        />

        {/* Center play button — visible when paused */}
        <button
          type="button"
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <span className="theater-play-btn flex h-14 w-14 items-center justify-center rounded-full">
            <Play className="ml-0.5 h-6 w-6 text-white/90" fill="currentColor" />
          </span>
        </button>

        {/* Frosted-glass pill control bar */}
        <div
          className={`theater-pill-controls absolute inset-x-3 bottom-3 z-20 flex items-center gap-2.5 rounded-full px-3 py-2 transition-all duration-300 ${
            controlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Play/Pause */}
          <button
            type="button"
            onClick={togglePlayback}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:text-white"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5" fill="currentColor" />
            ) : (
              <Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" />
            )}
          </button>

          {/* Progress scrubber */}
          <div
            className="theater-progress flex-1 h-1 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="theater-progress-fill h-full rounded-full transition-[width] duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Mute */}
          <button
            type="button"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:text-white"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    );
  },
);

TheaterVideo.displayName = 'TheaterVideo';

export default TheaterVideo;
