import { useEffect, useRef, type VideoHTMLAttributes } from 'react';

type AutoplayPreviewVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  'autoPlay' | 'loop' | 'muted' | 'playsInline' | 'poster' | 'src'
> & {
  src: string;
  poster: string;
  pauseOffscreen?: boolean;
  rootMargin?: string;
};

const AutoplayPreviewVideo = ({
  src,
  poster,
  pauseOffscreen = true,
  rootMargin = '120px 0px',
  preload = 'metadata',
  ...props
}: AutoplayPreviewVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewportRef = useRef(true);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;

    let cancelled = false;
    node.muted = true;
    node.defaultMuted = true;
    node.playsInline = true;
    node.setAttribute('muted', '');
    node.setAttribute('playsinline', '');
    node.setAttribute('webkit-playsinline', '');

    const play = () => {
      if (cancelled) return;
      if (pauseOffscreen && !inViewportRef.current) return;
      node.play().catch(() => undefined);
    };
    const resumePlayback = () => {
      window.requestAnimationFrame(play);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') resumePlayback();
    };

    play();
    node.addEventListener('loadedmetadata', resumePlayback);
    node.addEventListener('loadeddata', resumePlayback);
    node.addEventListener('canplay', resumePlayback);
    node.addEventListener('pause', resumePlayback);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', resumePlayback);

    let observer: IntersectionObserver | undefined;
    if (pauseOffscreen && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          const isVisible = entry?.isIntersecting ?? true;
          inViewportRef.current = isVisible;
          if (isVisible) {
            resumePlayback();
          } else {
            node.pause();
          }
        },
        { rootMargin },
      );
      observer.observe(node);
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      node.removeEventListener('loadedmetadata', resumePlayback);
      node.removeEventListener('loadeddata', resumePlayback);
      node.removeEventListener('canplay', resumePlayback);
      node.removeEventListener('pause', resumePlayback);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', resumePlayback);
      node.pause();
    };
  }, [pauseOffscreen, rootMargin, src]);

  return (
    <video
      {...props}
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload={preload}
      disablePictureInPicture
      disableRemotePlayback
    />
  );
};

export default AutoplayPreviewVideo;
