import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdaptiveVideo from '@/components/media/AdaptiveVideo';
import { useMediaSession } from '@/components/media/MediaSessionProvider';
import type { PlaybackCandidate } from '@/lib/media-assets';

export interface TheaterVideoProps {
  candidates: PlaybackCandidate[];
  poster: string;
  enableStartupFallback?: boolean;
  startupFallbackMs?: number;
  className?: string;
}

const DEFAULT_STARTUP_FALLBACK_MS = 800;
const HANDOFF_FADE_MS = 260;

// The bridge is a full-resolution slice of the same clip, so crossfading into a
// still-ramping adaptive level reads as the reel losing quality. Safari and iOS
// play the master natively, where the start level is the player's to choose and
// not ours, so the wait is what keeps the downgrade off screen there. It stays
// shorter than the bridge loop — holding longer would trade a soft frame for a
// visible restart.
const HANDOFF_QUALITY_WAIT_MS = 1200;

const safePlay = async (video: HTMLVideoElement, preferAudio: boolean) => {
  video.defaultPlaybackRate = 1;
  video.playbackRate = 1;
  video.muted = !preferAudio;

  try {
    await video.play();
    return;
  } catch {
    video.muted = true;
    await video.play().catch(() => undefined);
  }
};

const teardown = (video: HTMLVideoElement | null) => {
  if (!video) return;
  video.pause();
  video.removeAttribute('src');
  video.load();
};

/**
 * Quality-first theater player.
 *
 * A fast-start 720p MP4 supplies the first frame (and audio when autoplay
 * policy permits) while the full adaptive master buffers in parallel. Once
 * the master is ready, playback is time-synchronised and crossfaded in one
 * short compositor-only transition. The bridge is then unloaded.
 */
const TheaterVideo = memo(
  ({
    candidates,
    poster,
    enableStartupFallback = true,
    startupFallbackMs = DEFAULT_STARTUP_FALLBACK_MS,
    className,
  }: TheaterVideoProps) => {
    const acquireTheater = useMediaSession()?.acquireTheater;
    const primaryRef = useRef<HTMLVideoElement>(null);
    const bridgeRef = useRef<HTMLVideoElement>(null);
    const fallbackTimerRef = useRef<number | null>(null);
    const handoffTimerRef = useRef<number | null>(null);
    const qualityTimerRef = useRef<number | null>(null);
    const qualityWaivedRef = useRef(false);
    const syncAttemptedRef = useRef(false);
    const synchronizeRef = useRef<() => void>(() => undefined);

    const primaryCandidates = useMemo(
      () => candidates.filter((candidate) => candidate.quality !== 'startup'),
      [candidates],
    );
    const [activePrimaryIndex, setActivePrimaryIndex] = useState(0);
    const [primaryVisible, setPrimaryVisible] = useState(false);
    const [bridgeReleased, setBridgeReleased] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const activePrimary =
      primaryCandidates[activePrimaryIndex] ?? primaryCandidates[0] ?? candidates[0];
    const bridgeCandidate = useMemo(() => {
      if (!enableStartupFallback || !activePrimary) return undefined;
      return (
        candidates.find(
          (candidate) =>
            candidate.quality === 'startup' && candidate.mp4 !== activePrimary.mp4,
        ) ??
        candidates.find(
          (candidate) =>
            candidate.quality === 'mobile' && candidate.mp4 !== activePrimary.mp4,
        )
      );
    }, [activePrimary, candidates, enableStartupFallback]);

    const candidateKey = candidates
      .map(({ id, mp4, hls }) => `${id}:${mp4}|${hls ?? ''}`)
      .join('::');

    const clearTimers = useCallback(() => {
      if (fallbackTimerRef.current !== null) {
        window.clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      if (handoffTimerRef.current !== null) {
        window.clearTimeout(handoffTimerRef.current);
        handoffTimerRef.current = null;
      }
      if (qualityTimerRef.current !== null) {
        window.clearTimeout(qualityTimerRef.current);
        qualityTimerRef.current = null;
      }
    }, []);

    const waitForPrimaryQuality = useCallback(() => {
      if (qualityTimerRef.current !== null) return;
      qualityTimerRef.current = window.setTimeout(() => {
        qualityTimerRef.current = null;
        qualityWaivedRef.current = true;
        synchronizeRef.current();
      }, HANDOFF_QUALITY_WAIT_MS);
    }, []);

    const promoteFallback = useCallback(() => {
      setActivePrimaryIndex((index) =>
        index + 1 < primaryCandidates.length ? index + 1 : index,
      );
    }, [primaryCandidates.length]);

    const schedulePrimaryRecovery = useCallback(() => {
      if (fallbackTimerRef.current !== null) return;
      fallbackTimerRef.current = window.setTimeout(() => {
        fallbackTimerRef.current = null;
        const primary = primaryRef.current;
        if (!primary || primary.readyState < 2) promoteFallback();
      }, 1200);
    }, [promoteFallback]);

    const releaseBridge = useCallback(() => {
      const bridge = bridgeRef.current;
      if (bridge) {
        bridge.pause();
        bridge.removeAttribute('src');
        bridge.load();
      }
      setBridgeReleased(true);
    }, []);

    const completeHandoff = useCallback(() => {
      const primary = primaryRef.current;
      const bridge = bridgeRef.current;
      if (!primary || primaryVisible) return;

      const nextMuted = bridge?.muted ?? false;
      primary.muted = nextMuted;
      setIsMuted(nextMuted);
      if (bridge) bridge.muted = true;

      setPrimaryVisible(true);
      setIsPlaying(!primary.paused);
      handoffTimerRef.current = window.setTimeout(releaseBridge, HANDOFF_FADE_MS + 40);
    }, [primaryVisible, releaseBridge]);

    const synchronizePrimary = useCallback(() => {
      const primary = primaryRef.current;
      const bridge = bridgeRef.current;
      if (!primary || primaryVisible) return;

      // Hold the sharp bridge frame until the master has climbed to at least the
      // bridge's own resolution. Re-entered from `timeupdate`, so an adaptive
      // level switch mid-wait promotes as soon as it lands.
      if (
        bridge &&
        !bridgeReleased &&
        !qualityWaivedRef.current &&
        primary.videoWidth > 0 &&
        bridge.videoWidth > 0 &&
        primary.videoWidth < bridge.videoWidth
      ) {
        waitForPrimaryQuality();
        return;
      }

      if (
        bridge &&
        !bridgeReleased &&
        bridge.readyState >= 2 &&
        Number.isFinite(bridge.currentTime) &&
        Math.abs(primary.currentTime - bridge.currentTime) > 0.2 &&
        !syncAttemptedRef.current
      ) {
        syncAttemptedRef.current = true;
        try {
          primary.currentTime = bridge.currentTime;
          return;
        } catch {
          // Some streams are not seekable until their first media segment.
        }
      }

      completeHandoff();
    }, [bridgeReleased, completeHandoff, primaryVisible, waitForPrimaryQuality]);

    useEffect(() => {
      synchronizeRef.current = synchronizePrimary;
    }, [synchronizePrimary]);

    const activeVideo = useCallback(
      () =>
        primaryVisible || bridgeReleased || !bridgeCandidate
          ? primaryRef.current
          : bridgeRef.current,
      [bridgeCandidate, bridgeReleased, primaryVisible],
    );

    const togglePlayback = useCallback(() => {
      const video = activeVideo();
      if (!video) return;
      if (video.paused) {
        void safePlay(video, !isMuted).then(() => setIsPlaying(!video.paused));
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }, [activeVideo, isMuted]);

    const toggleMute = useCallback(() => {
      const video = activeVideo();
      if (!video) return;
      const nextMuted = !video.muted;
      video.muted = nextMuted;
      setIsMuted(nextMuted);

      const primary = primaryRef.current;
      const bridge = bridgeRef.current;
      if (primary && primary !== video) primary.muted = nextMuted;
      if (bridge && bridge !== video) bridge.muted = nextMuted;
      if (!nextMuted && video.paused) {
        void safePlay(video, true).then(() => setIsPlaying(!video.paused));
      }
    }, [activeVideo]);

    useEffect(() => acquireTheater?.(), [acquireTheater]);

    useEffect(() => {
      clearTimers();
      setActivePrimaryIndex(0);
      setPrimaryVisible(false);
      setBridgeReleased(false);
      setIsPlaying(false);
      setIsMuted(false);
      syncAttemptedRef.current = false;
      qualityWaivedRef.current = false;
    }, [candidateKey, clearTimers]);

    useEffect(() => {
      const bridge = bridgeRef.current;
      if (!bridge || !bridgeCandidate || bridgeReleased) return;

      void safePlay(bridge, true).then(() => {
        setIsMuted(bridge.muted);
        setIsPlaying(!bridge.paused);
      });

      return () => {
        bridge.pause();
      };
    }, [bridgeCandidate, bridgeReleased]);

    useEffect(() => {
      clearTimers();
      syncAttemptedRef.current = false;
      const primary = primaryRef.current;
      if (!primary || !activePrimary) return;

      // The master starts muted behind the bridge so browser autoplay policy
      // never delays high-quality buffering. Audio transfers at handoff.
      primary.muted = Boolean(bridgeCandidate && !bridgeReleased);
      void safePlay(primary, !bridgeCandidate || bridgeReleased);

      if (
        enableStartupFallback &&
        !bridgeCandidate &&
        activePrimaryIndex + 1 < primaryCandidates.length
      ) {
        fallbackTimerRef.current = window.setTimeout(() => {
          if (primary.readyState < 2) promoteFallback();
        }, startupFallbackMs);
      }

      return clearTimers;
    }, [
      activePrimary,
      activePrimaryIndex,
      bridgeCandidate,
      bridgeReleased,
      clearTimers,
      enableStartupFallback,
      primaryCandidates.length,
      promoteFallback,
      startupFallbackMs,
    ]);

    useEffect(
      () => () => {
        clearTimers();
        teardown(primaryRef.current);
        teardown(bridgeRef.current);
      },
      [clearTimers],
    );

    if (!activePrimary) {
      return (
        <div className={cn('relative aspect-[9/16] overflow-hidden bg-black', className)}>
          <img src={poster} alt="" className="h-full w-full object-cover" />
        </div>
      );
    }

    return (
      <div className={cn('relative aspect-[9/16] overflow-hidden bg-black', className)}>
        {bridgeCandidate && !bridgeReleased && (
          <video
            ref={bridgeRef}
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity ease-out',
              primaryVisible ? 'opacity-0' : 'opacity-100',
            )}
            style={{ transitionDuration: `${HANDOFF_FADE_MS}ms` }}
            src={bridgeCandidate.mp4}
            poster={poster}
            preload="auto"
            playsInline
            loop
            crossOrigin="anonymous"
            onPlay={() => {
              if (!primaryVisible) setIsPlaying(true);
            }}
            onPause={() => {
              if (!primaryVisible) setIsPlaying(false);
            }}
            onVolumeChange={(event) => {
              if (!primaryVisible) setIsMuted(event.currentTarget.muted);
            }}
            onError={releaseBridge}
          />
        )}

        <AdaptiveVideo
          ref={primaryRef}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity ease-out',
            primaryVisible || !bridgeCandidate ? 'opacity-100' : 'opacity-0',
          )}
          style={{ transitionDuration: `${HANDOFF_FADE_MS}ms` }}
          src={activePrimary.mp4}
          hlsSrc={activePrimary.hls}
          poster={poster}
          preload="auto"
          autoPlay
          muted={Boolean(bridgeCandidate && !primaryVisible)}
          playsInline
          loop={false}
          loadStrategy="immediate"
          playbackPriority="theater"
          requestPlaybackSlot
          pauseOffscreen={false}
          unloadWhenOffscreen={false}
          onLoadedMetadata={(event) => {
            event.currentTarget.defaultPlaybackRate = 1;
            event.currentTarget.playbackRate = 1;
          }}
          onCanPlay={synchronizePrimary}
          onPlaying={synchronizePrimary}
          onTimeUpdate={() => {
            if (!primaryVisible) synchronizePrimary();
          }}
          onSeeked={completeHandoff}
          onPlay={() => {
            if (primaryVisible || !bridgeCandidate) setIsPlaying(true);
          }}
          onPause={() => {
            if (primaryVisible || !bridgeCandidate) setIsPlaying(false);
          }}
          onWaiting={() => {
            if (primaryVisible || !bridgeCandidate) setIsPlaying(false);
          }}
          onVolumeChange={(event: SyntheticEvent<HTMLVideoElement>) => {
            if (primaryVisible || !bridgeCandidate) {
              setIsMuted(event.currentTarget.muted);
            }
          }}
          onError={schedulePrimaryRecovery}
        />

        <button
          type="button"
          className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 ${
            isPlaying ? 'pointer-events-none opacity-0' : 'opacity-100'
          }`}
          onClick={togglePlayback}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/55 bg-black/55 shadow-[0_10px_24px_-16px_rgba(0,0,0,0.88)]">
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white/95" fill="currentColor" />
            ) : (
              <Play className="ml-0.5 h-5 w-5 text-white/95" fill="currentColor" />
            )}
          </span>
        </button>
        <button
          type="button"
          className="absolute left-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/55 bg-black/60 text-white transition-colors hover:bg-black/75"
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
