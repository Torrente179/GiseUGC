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
    node.muted = true;
    node.defaultMuted = true;
    const play = () => {
      node.play().catch(() => undefined);
    };
    play();
    node.addEventListener('loadeddata', play);
    return () => node.removeEventListener('loadeddata', play);
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
