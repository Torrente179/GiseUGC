import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type TouchEvent,
  type VideoHTMLAttributes,
  type MouseEvent,
  type SyntheticEvent,
} from 'react';
import { useMediaPlaybackSlot } from '@/hooks/use-media-playback-slot';
import type { MediaPlaybackPriority } from '@/lib/media-playback-scheduler';

type LazyVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'poster'> & {
  src: string;
  poster?: string;
  lqip?: string;
  rootMargin?: string;
  loadWhenVisible?: boolean;
  pauseOffscreen?: boolean;
  forcePause?: boolean;
  unloadWhenOffscreen?: boolean;
  unloadWhenForcedPause?: boolean;
  playbackPriority?: MediaPlaybackPriority;
  requestPlaybackSlot?: boolean;
};

const LazyVideo = forwardRef<HTMLVideoElement, LazyVideoProps>(
  (
    {
      src,
      poster,
      lqip,
      preload = 'metadata',
      autoPlay = false,
      rootMargin = '240px 0px',
      loadWhenVisible = true,
      pauseOffscreen = false,
      forcePause = false,
      unloadWhenOffscreen = false,
      unloadWhenForcedPause = false,
      playbackPriority = 'preview',
      requestPlaybackSlot = true,
      onMouseEnter,
      onTouchStart,
      onFocus,
      onCanPlay,
      onLoadedMetadata,
      style,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLVideoElement | null>(null);
    const isInViewportRef = useRef(true);
    const [isInViewport, setIsInViewport] = useState(true);
    const [shouldLoad, setShouldLoad] = useState(!loadWhenVisible);
    const [mediaReady, setMediaReady] = useState(false);
    const sourceEligible =
      shouldLoad &&
      (!unloadWhenOffscreen || isInViewport) &&
      (!unloadWhenForcedPause || !forcePause);
    const wantsPlaybackSlot = autoPlay && sourceEligible && !forcePause && isInViewport;
    const hasPlaybackSlot = useMediaPlaybackSlot(
      wantsPlaybackSlot,
      playbackPriority,
      requestPlaybackSlot,
    );
    const shouldAttachSource =
      sourceEligible && (!autoPlay || !requestPlaybackSlot || hasPlaybackSlot);
    const shouldPlay = autoPlay && shouldAttachSource && hasPlaybackSlot && !forcePause;

    useEffect(() => {
      return () => {
        const node = internalRef.current;
        if (node) {
          node.pause();
          node.removeAttribute('src');
          node.load();
        }
      };
    }, []);

    const normalizePlaybackRate = (node: HTMLVideoElement | null) => {
      if (!node) return;
      if (node.playbackRate !== 1) {
        node.playbackRate = 1;
      }
      if (node.defaultPlaybackRate !== 1) {
        node.defaultPlaybackRate = 1;
      }
    };

    useEffect(() => {
      if (!loadWhenVisible || shouldLoad) return;
      const node = internalRef.current;
      if (!node || typeof IntersectionObserver === 'undefined') {
        setShouldLoad(true);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry?.isIntersecting) return;
          setShouldLoad(true);
          observer.disconnect();
        },
        { rootMargin },
      );

      observer.observe(node);
      return () => observer.disconnect();
    }, [loadWhenVisible, rootMargin, shouldLoad]);

    useEffect(() => {
      if (!shouldAttachSource || !shouldPlay) return;
      if (pauseOffscreen && !isInViewportRef.current) return;
      const node = internalRef.current;
      if (!node) return;
      normalizePlaybackRate(node);
      const playPromise = node.play();
      if (playPromise) {
        playPromise.catch(() => undefined);
      }
    }, [pauseOffscreen, shouldAttachSource, shouldPlay]);

    useEffect(() => {
      const node = internalRef.current;
      if (!node) return;

      if (!shouldAttachSource) {
        node.pause();
        node.removeAttribute('src');
        node.load();
        setMediaReady(false);
        return;
      }

      if (!shouldPlay) {
        node.pause();
      }
    }, [shouldAttachSource, shouldPlay]);

    useEffect(() => {
      if (hasPlaybackSlot) return;
      internalRef.current?.pause();
    }, [hasPlaybackSlot]);

    useEffect(() => {
      if (!forcePause) return;
      internalRef.current?.pause();
    }, [forcePause]);

    useEffect(() => {
      if (!pauseOffscreen && !unloadWhenOffscreen) return;
      const node = internalRef.current;
      if (!node || typeof IntersectionObserver === 'undefined') return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          isInViewportRef.current = entry.isIntersecting;
          setIsInViewport((prev) => (prev === entry.isIntersecting ? prev : entry.isIntersecting));
          if (forcePause) {
            node.pause();
            return;
          }
          if (!pauseOffscreen || !shouldPlay) return;
          if (entry.isIntersecting) {
            node.play().catch(() => undefined);
          } else {
            node.pause();
          }
        },
        { rootMargin: '50px 0px' },
      );

      observer.observe(node);
      return () => observer.disconnect();
    }, [pauseOffscreen, forcePause, shouldPlay, unloadWhenOffscreen]);

    const assignRef = (node: HTMLVideoElement | null) => {
      internalRef.current = node;
      normalizePlaybackRate(node);
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const ensureLoaded = () => {
      if (!shouldLoad) {
        setShouldLoad(true);
      }
    };

    const handleMouseEnter = (event: MouseEvent<HTMLVideoElement>) => {
      ensureLoaded();
      onMouseEnter?.(event);
    };

    const handleTouchStart = (event: TouchEvent<HTMLVideoElement>) => {
      ensureLoaded();
      onTouchStart?.(event);
    };

    const handleFocus = (event: FocusEvent<HTMLVideoElement>) => {
      ensureLoaded();
      onFocus?.(event);
    };

    const handleLoadedMetadata = (event: SyntheticEvent<HTMLVideoElement>) => {
      normalizePlaybackRate(event.currentTarget);
      onLoadedMetadata?.(event);
    };

    const handleCanPlay = (event: SyntheticEvent<HTMLVideoElement>) => {
      if (!mediaReady) setMediaReady(true);
      onCanPlay?.(event);
    };

    const showLqip = !!lqip && !mediaReady;
    const effectivePoster = shouldLoad ? poster : (lqip || undefined);

    const lqipStyle: React.CSSProperties | undefined = showLqip
      ? {
          ...style,
          filter: 'blur(12px)',
          transform: 'scale(1.05)',
          opacity: 1,
          transition: 'filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }
      : {
          ...style,
          opacity: mediaReady || !lqip ? 1 : 0,
          transition: 'filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        };

    return (
      <video
        {...props}
        ref={assignRef}
        className={className}
        style={lqipStyle}
        src={shouldAttachSource ? src : undefined}
        poster={effectivePoster}
        preload={shouldAttachSource ? preload : 'none'}
        autoPlay={shouldPlay}
        disablePictureInPicture
        disableRemotePlayback
        onCanPlay={handleCanPlay}
        onLoadedMetadata={handleLoadedMetadata}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        onFocus={handleFocus}
      />
    );
  },
);

LazyVideo.displayName = 'LazyVideo';

export default LazyVideo;
