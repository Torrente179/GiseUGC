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
      onMouseEnter,
      onTouchStart,
      onFocus,
      onCanPlay,
      ...props
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLVideoElement | null>(null);
    const [shouldLoad, setShouldLoad] = useState(!loadWhenVisible);

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
      if (!shouldLoad || !autoPlay) return;
      const node = internalRef.current;
      if (!node) return;
      const playPromise = node.play();
      if (playPromise) {
        playPromise.catch(() => undefined);
      }
    }, [autoPlay, shouldLoad]);

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
        src={shouldLoad ? src : undefined}
        poster={shouldLoad ? poster : undefined}
        preload={shouldLoad ? preload : 'none'}
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
