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
    const shouldAttachSource =
      shouldLoad &&
      (!unloadWhenOffscreen || isInViewport) &&
      (!unloadWhenForcedPause || !forcePause);

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
      if (!shouldAttachSource || !autoPlay || forcePause) return;
      if (pauseOffscreen && !isInViewportRef.current) return;
      const node = internalRef.current;
      if (!node) return;
      normalizePlaybackRate(node);
      const playPromise = node.play();
      if (playPromise) {
        playPromise.catch(() => undefined);
      }
    }, [autoPlay, forcePause, pauseOffscreen, shouldAttachSource]);

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
          if (!pauseOffscreen || !autoPlay) return;
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
    }, [pauseOffscreen, autoPlay, forcePause, unloadWhenOffscreen]);

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
          transition: 'filter 0.4s ease, transform 0.4s ease',
        }
      : style
        ? { ...style, transition: 'filter 0.4s ease, transform 0.4s ease' }
        : { transition: 'filter 0.4s ease, transform 0.4s ease' };

    return (
      <video
        {...props}
        ref={assignRef}
        className={className}
        style={lqipStyle}
        src={shouldAttachSource ? src : undefined}
        poster={effectivePoster}
        preload={shouldAttachSource ? preload : 'none'}
        autoPlay={autoPlay}
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
