import { useEffect, useRef, type VideoHTMLAttributes } from 'react';

type HeroShowcaseVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  'autoPlay' | 'loop' | 'muted' | 'playsInline' | 'controls' | 'poster' | 'src'
> & {
  src: string;
  poster: string;
  /** Seconds of playback before freezing on the current frame. */
  playSeconds?: number;
};

/**
 * Decorative hero key-art video. Plays muted for a few seconds, then freezes
 * on the frame — no loop, no controls, not interactive. Quality-first: meant
 * to be fed a high-resolution source (e.g. the main clip), unlike the looping
 * low-res AutoplayPreviewVideo used for thumbnails.
 */
const HeroShowcaseVideo = ({
  src,
  poster,
  playSeconds = 4,
  preload = 'auto',
  ...props
}: HeroShowcaseVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    node.muted = true;
    node.defaultMuted = true;
    node.playsInline = true;
    node.setAttribute('muted', '');
    node.setAttribute('playsinline', '');
    node.setAttribute('webkit-playsinline', '');

    // Reduced motion: stay on the (high-quality) poster, never play.
    if (prefersReducedMotion) {
      node.pause();
      return;
    }

    let frozen = false;
    const freeze = () => {
      if (frozen) return;
      frozen = true;
      node.pause();
      node.removeEventListener('timeupdate', handleTimeUpdate);
    };
    const handleTimeUpdate = () => {
      if (node.currentTime >= playSeconds) freeze();
    };

    node.addEventListener('timeupdate', handleTimeUpdate);
    node.play().catch(() => undefined);

    return () => {
      node.removeEventListener('timeupdate', handleTimeUpdate);
      node.pause();
    };
  }, [playSeconds, src]);

  return (
    <video
      {...props}
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      playsInline
      autoPlay
      preload={preload}
      disablePictureInPicture
      disableRemotePlayback
    />
  );
};

export default HeroShowcaseVideo;
