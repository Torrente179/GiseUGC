import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type SyntheticEvent,
  type VideoHTMLAttributes,
} from 'react';
import { useMediaPlaybackSlot } from '@/hooks/use-media-playback-slot';
import type { MediaPlaybackPriority } from '@/lib/media-playback-scheduler';
import { useMediaSession } from '@/components/media/MediaSessionProvider';

type AdaptiveVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'poster'> & {
  src: string;
  hlsSrc?: string;
  poster?: string;
  rootMargin?: string;
  loadStrategy?: 'immediate' | 'visible';
  pauseOffscreen?: boolean;
  unloadWhenOffscreen?: boolean;
  forcePause?: boolean;
  playbackPriority?: MediaPlaybackPriority;
  requestPlaybackSlot?: boolean;
  activationQuery?: string;
};

const shouldUseNativeHls = (video: HTMLVideoElement) => {
  const canPlay =
    video.canPlayType('application/vnd.apple.mpegurl') !== '' ||
    video.canPlayType('application/x-mpegURL') !== '';
  if (!canPlay || typeof navigator === 'undefined') return false;

  const userAgent = navigator.userAgent;
  const isIos =
    /iPad|iPhone|iPod/u.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isDesktopSafari =
    /Safari/u.test(userAgent) &&
    !/Chrome|Chromium|CriOS|Edg|OPR|FxiOS/u.test(userAgent);

  return isIos || isDesktopSafari;
};

const attachFallbackSource = (video: HTMLVideoElement, src: string) => {
  if (video.getAttribute('src') === src) return;
  video.src = src;
  video.load();
};

type HlsLevelLike = { width?: number };
type HlsQualityControls = {
  levels?: HlsLevelLike[];
  startLevel: number;
  autoLevelCapping: number;
};

// The theater card is capped at 430 CSS px, so 1080p already exceeds what any
// phone can resolve. It is the floor rather than the ceiling: a 2× device would
// otherwise be sized down to the 720p rung and the reel would look soft.
const THEATER_TARGET_WIDTH = 1080;
const THEATER_FALLBACK_PLAYER_WIDTH = 430;

export const selectTheaterLevel = (
  levels: HlsLevelLike[],
  playerWidth: number,
  pixelRatio: number,
) => {
  const widths = levels.map((level) => level.width ?? 0);
  const maxWidth = Math.max(...widths, 0);
  const targetWidth = Math.min(
    maxWidth,
    Math.max(THEATER_TARGET_WIDTH, Math.round(playerWidth * pixelRatio)),
  );

  // `levels` arrives sorted by ascending bitrate and already filtered to codecs
  // this browser decodes, so the last rung inside the target is the cap and the
  // first rung at that resolution is its most efficient codec.
  const capIndex = widths.reduce(
    (best, width, index) => (width <= targetWidth ? index : best),
    0,
  );
  const startIndex = widths.indexOf(widths[capIndex]);

  return { capIndex, startIndex: startIndex === -1 ? capIndex : startIndex };
};

/**
 * Opening the theater is a deliberate, full-attention act, so it plays the
 * sharpest rung the device can resolve from the very first frame. Left on its
 * own hls.js starts from `abrEwmaDefaultEstimate` (500 kbps), which lands on the
 * 360p rung of every ladder and then ramps — the visible "starts sharp, drops
 * soft" handoff this exists to prevent.
 */
const applyTheaterQuality = (hls: HlsQualityControls, video: HTMLVideoElement) => {
  const levels = hls.levels ?? [];
  if (levels.length < 2) return;

  const playerWidth =
    video.clientWidth ||
    video.getBoundingClientRect().width ||
    THEATER_FALLBACK_PLAYER_WIDTH;
  const { capIndex, startIndex } = selectTheaterLevel(
    levels,
    playerWidth,
    window.devicePixelRatio || 1,
  );

  hls.autoLevelCapping = capIndex;
  hls.startLevel = startIndex;
};

const AdaptiveVideo = forwardRef<HTMLVideoElement, AdaptiveVideoProps>(
  (
    {
      src,
      hlsSrc,
      poster,
      preload = 'metadata',
      autoPlay = false,
      muted = true,
      playsInline = true,
      loop = true,
      rootMargin = '160px 0px',
      loadStrategy = 'visible',
      pauseOffscreen = true,
      unloadWhenOffscreen = true,
      forcePause = false,
      playbackPriority = 'preview',
      requestPlaybackSlot = true,
      activationQuery,
      onCanPlay,
      onLoadedMetadata,
      ...props
    },
    forwardedRef,
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaSession = useMediaSession();
    const [isInViewport, setIsInViewport] = useState(loadStrategy === 'immediate');
    const [shouldLoad, setShouldLoad] = useState(loadStrategy === 'immediate');
    const [isActivationMatch, setIsActivationMatch] = useState(!activationQuery);
    const sessionForcePause =
      forcePause || (Boolean(mediaSession?.theaterActive) && playbackPriority !== 'theater');
    const sourceEligible =
      shouldLoad &&
      isActivationMatch &&
      (!unloadWhenOffscreen || isInViewport) &&
      !sessionForcePause;
    const wantsPlaybackSlot = autoPlay && sourceEligible && isInViewport;
    const hasPlaybackSlot = useMediaPlaybackSlot(
      wantsPlaybackSlot,
      playbackPriority,
      requestPlaybackSlot,
    );
    const shouldAttachSource =
      sourceEligible && (!autoPlay || !requestPlaybackSlot || hasPlaybackSlot);
    const shouldPlay = autoPlay && shouldAttachSource && isInViewport && hasPlaybackSlot;

    useImperativeHandle(forwardedRef, () => videoRef.current as HTMLVideoElement, []);

    useEffect(() => {
      if (!activationQuery) {
        setIsActivationMatch(true);
        return undefined;
      }

      const query = window.matchMedia(activationQuery);
      const sync = () => setIsActivationMatch(query.matches);
      sync();
      query.addEventListener('change', sync);
      return () => query.removeEventListener('change', sync);
    }, [activationQuery]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      video.muted = Boolean(muted);
      video.defaultMuted = Boolean(muted);
      video.playsInline = playsInline;
      if (muted) video.setAttribute('muted', '');
      if (playsInline) {
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
      }
    }, [muted, playsInline]);

    useEffect(() => {
      if (loadStrategy === 'immediate') return undefined;
      const video = videoRef.current;
      if (!video || typeof IntersectionObserver === 'undefined') {
        setShouldLoad(true);
        setIsInViewport(true);
        return undefined;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          const visible = entry?.isIntersecting ?? false;
          setIsInViewport(visible);
          if (visible) setShouldLoad(true);
        },
        { rootMargin },
      );

      observer.observe(video);
      return () => observer.disconnect();
    }, [loadStrategy, rootMargin]);

    useEffect(() => {
      if (!pauseOffscreen && !unloadWhenOffscreen) return undefined;
      if (loadStrategy === 'visible') return undefined;

      const video = videoRef.current;
      if (!video || typeof IntersectionObserver === 'undefined') return undefined;

      const observer = new IntersectionObserver(
        ([entry]) => {
          const visible = entry?.isIntersecting ?? true;
          setIsInViewport(visible);
          if (!visible) video.pause();
        },
        { rootMargin },
      );

      observer.observe(video);
      return () => observer.disconnect();
    }, [loadStrategy, pauseOffscreen, rootMargin, unloadWhenOffscreen]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return undefined;

      let cancelled = false;
      let hlsInstance: { destroy: () => void } | null = null;

      if (!shouldAttachSource) {
        video.pause();
        video.removeAttribute('src');
        video.load();
        return undefined;
      }

      const fallbackToMp4 = () => {
        if (cancelled) return;
        hlsInstance?.destroy();
        hlsInstance = null;
        attachFallbackSource(video, src);
      };

      if (!hlsSrc) {
        attachFallbackSource(video, src);
        return () => {
          cancelled = true;
        };
      }

      if (shouldUseNativeHls(video)) {
        // Safari/iOS play the .m3u8 directly. If that source errors (e.g. a
        // missing/404 master, or an incompletely uploaded ladder), fall back to
        // the progressive MP4 instead of leaving a broken video element.
        const handleNativeHlsError = () => {
          if (cancelled) return;
          if (video.getAttribute('src') !== hlsSrc) return;
          video.removeEventListener('error', handleNativeHlsError);
          attachFallbackSource(video, src);
        };
        video.addEventListener('error', handleNativeHlsError);
        attachFallbackSource(video, hlsSrc);
        return () => {
          cancelled = true;
          video.removeEventListener('error', handleNativeHlsError);
        };
      }

      void import('hls.js/light')
        .then(({ default: Hls }) => {
          if (cancelled) return;
          if (!Hls.isSupported()) {
            fallbackToMp4();
            return;
          }

          const isTheater = playbackPriority === 'theater';
          const hls = new Hls({
            // Ambient loops match CSS pixels. The theater picks its own level
            // band once the manifest is parsed, so hls.js must not also size it
            // down to the player box.
            capLevelToPlayerSize: !isTheater,
            ignoreDevicePixelRatio: true,
            startLevel: -1,
            // A theater start is deferred until the level band is applied, so
            // the first fragment requested is already the full rendition.
            autoStartLoad: !isTheater,
            // The default 500 kbps seed makes ABR treat every connection as
            // barely-2G on the first fragment and immediately step back down.
            abrEwmaDefaultEstimate: isTheater ? 4_000_000 : 5e5,
            maxBufferLength: isTheater ? 16 : 5,
            maxMaxBufferLength: isTheater ? 30 : 10,
          });
          hlsInstance = hls;
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) fallbackToMp4();
          });
          if (isTheater) {
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              applyTheaterQuality(hls, video);
              hls.startLoad();
            });
          }
          hls.loadSource(hlsSrc);
          hls.attachMedia(video);
        })
        .catch(fallbackToMp4);

      return () => {
        cancelled = true;
        hlsInstance?.destroy();
        hlsInstance = null;
      };
    }, [hlsSrc, playbackPriority, shouldAttachSource, src]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      if (!shouldPlay) {
        video.pause();
        return;
      }

      const play = () => {
        if (!videoRef.current || !shouldPlay) return;
        video.defaultPlaybackRate = 1;
        video.playbackRate = 1;
        video.play().catch(() => undefined);
      };

      const frame = window.requestAnimationFrame(play);
      return () => window.cancelAnimationFrame(frame);
    }, [shouldPlay]);

    const handleCanPlay = (event: SyntheticEvent<HTMLVideoElement>) => {
      if (shouldPlay) event.currentTarget.play().catch(() => undefined);
      onCanPlay?.(event);
    };

    const handleLoadedMetadata = (event: SyntheticEvent<HTMLVideoElement>) => {
      event.currentTarget.defaultPlaybackRate = 1;
      event.currentTarget.playbackRate = 1;
      if (shouldPlay) event.currentTarget.play().catch(() => undefined);
      onLoadedMetadata?.(event);
    };

    return (
      <video
        {...props}
        ref={videoRef}
        poster={isActivationMatch ? poster : undefined}
        crossOrigin="anonymous"
        preload={shouldAttachSource ? preload : 'none'}
        autoPlay={shouldPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        disablePictureInPicture
        disableRemotePlayback
        onCanPlay={handleCanPlay}
        onLoadedMetadata={handleLoadedMetadata}
      />
    );
  },
);

AdaptiveVideo.displayName = 'AdaptiveVideo';

export default AdaptiveVideo;
