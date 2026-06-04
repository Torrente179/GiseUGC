import type { ReelClip } from '@/data/portfolio-clips';
import { getBestPosterSrc, posterThumbSrc } from '@/data/portfolio-clips';
import AutoplayPreviewVideo from '@/components/media/AutoplayPreviewVideo';

type HeroWallTileProps = {
  clip: ReelClip;
  /** On mobile only the lead tile per column should decode video (iOS limit). */
  playVideo: boolean;
};

const HeroWallTile = ({ clip, playVideo }: HeroWallTileProps) => {
  const poster = getBestPosterSrc(clip);

  if (!playVideo) {
    return (
      <img
        src={posterThumbSrc(clip.posterSrc)}
        alt=""
        width={360}
        height={640}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = poster;
        }}
      />
    );
  }

  return (
    <AutoplayPreviewVideo
      src={clip.previewSrc}
      hlsSrc={clip.previewHlsSrc}
      poster={poster}
      className="h-full w-full object-cover"
      preload="metadata"
      playbackPriority="background"
      rootMargin="64px 0px"
    />
  );
};

export default HeroWallTile;
