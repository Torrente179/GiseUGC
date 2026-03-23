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
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
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

    const teardownVideo = useCallback((video: HTMLVideoElement | null) => {
      if (!video) return;
      video.pause();
      video.removeAttribute('src');
      video.load();
    }, []);

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
    };
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsPlaying(false);
    const handlePlaying = () => {
      clearStartupTimeout();
      setIsPlaying(true);
      const video = videoRef.current;
      if (video) setIsMuted(video.muted);
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

    const toggleMute = useCallback(() => {
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
      },
      [isPlaying],
    );

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
        video.pause();
      };
    }, [activeSource, attemptPlay, clearStartupTimeout, scheduleStartupFallback]);

    useEffect(() => {
      const video = videoRef.current;
      return () => {
        clearStartupTimeout();
        teardownVideo(video);
      };
    }, [clearStartupTimeout, teardownVideo]);

    return (
      <div className={cn('relative overflow-hidden bg-black', className)}>
        <video
          ref={videoRef}
          className="w-full aspect-[9/16] object-cover"
          src={activeSource || undefined}
          poster={poster}
          preload="metadata"
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
        <button
          type="button"
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/45 bg-black/40 backdrop-blur-sm shadow-[0_10px_24px_-16px_rgba(0,0,0,0.88)]">
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white/90" fill="currentColor" />
            ) : (
              <Play className="ml-0.5 h-5 w-5 text-white/90" fill="currentColor" />
            )}
          </span>
        </button>
        <button
          type="button"
          className="absolute left-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/55"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    );
  },
);

TheaterVideo.displayName = 'TheaterVideo';

export default TheaterVideo;
