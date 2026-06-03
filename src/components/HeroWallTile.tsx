import { useEffect, useRef } from 'react';
import type { ReelClip } from '@/data/portfolio-clips';

type HeroWallTileProps = {
  clip: ReelClip;
  /** On mobile only the lead tile per column should decode video (iOS limit). */
  playVideo: boolean;
};

const HeroWallTile = ({ clip, playVideo }: HeroWallTileProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!playVideo) return;
    const node = videoRef.current;
    if (!node) return;

    let cancelled = false;
    node.muted = true;
    node.defaultMuted = true;
    node.playsInline = true;

    const play = () => {
      if (cancelled || document.visibilityState === 'hidden') return;
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
    node.addEventListener('loadeddata', play);
    node.addEventListener('canplay', resumePlayback);
    node.addEventListener('pause', resumePlayback);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', resumePlayback);

    return () => {
      cancelled = true;
      node.removeEventListener('loadedmetadata', resumePlayback);
      node.removeEventListener('loadeddata', play);
      node.removeEventListener('canplay', resumePlayback);
      node.removeEventListener('pause', resumePlayback);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', resumePlayback);
    };
  }, [playVideo, clip.previewSrc]);

  if (!playVideo) {
    return (
      <img
        src={clip.posterSrc}
        alt=""
        width={360}
        height={640}
        loading="eager"
        decoding="async"
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={clip.previewSrc}
      poster={clip.posterSrc}
      className="h-full w-full object-cover"
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
    />
  );
};

export default HeroWallTile;
