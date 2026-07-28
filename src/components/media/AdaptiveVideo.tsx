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

          const hls = new Hls({
            // Ambient loops match CSS pixels; theater playback includes device
            // pixel ratio so high-density displays receive a genuinely sharp
            // rendition without forcing the highest level on every device.
            capLevelToPlayerSize: true,
            ignoreDevicePixelRatio: playbackPriority !== 'theater',
            startLevel: -1,
            maxBufferLength: playbackPriority === 'theater' ? 16 : 5,
            maxMaxBufferLength: playbackPriority === 'theater' ? 30 : 10,
          });
          hlsInstance = hls;
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) fallbackToMp4();
          });
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
