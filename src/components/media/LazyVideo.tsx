import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type TouchEvent,
  type VideoHTMLAttributes,
  type MouseEvent,
} from 'react';

type LazyVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'poster'> & {
  src: string;
  poster?: string;
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
      ...props
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLVideoElement | null>(null);
    const isInViewportRef = useRef(true);
    const [isInViewport, setIsInViewport] = useState(true);
    const [shouldLoad, setShouldLoad] = useState(!loadWhenVisible);
    const shouldAttachSource =
      shouldLoad &&
      (!unloadWhenOffscreen || isInViewport) &&
      (!unloadWhenForcedPause || !forcePause);

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
          if (unloadWhenOffscreen) {
            setIsInViewport((prev) =>
              prev === entry.isIntersecting ? prev : entry.isIntersecting,
            );
          }
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

    return (
      <video
        {...props}
        ref={assignRef}
        src={shouldAttachSource ? src : undefined}
        poster={shouldLoad ? poster : undefined}
        preload={shouldAttachSource ? preload : 'none'}
        autoPlay={autoPlay}
        onCanPlay={onCanPlay}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        onFocus={handleFocus}
      />
    );
  },
);

LazyVideo.displayName = 'LazyVideo';

export default LazyVideo;
