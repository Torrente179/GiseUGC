import type { VideoHTMLAttributes } from 'react';
import AdaptiveVideo from '@/components/media/AdaptiveVideo';
import type { MediaPlaybackPriority } from '@/lib/media-playback-scheduler';

type AutoplayPreviewVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  'autoPlay' | 'loop' | 'muted' | 'playsInline' | 'poster' | 'src'
> & {
  src: string;
  hlsSrc?: string;
  poster: string;
  pauseOffscreen?: boolean;
  rootMargin?: string;
  unloadWhenOffscreen?: boolean;
  playbackPriority?: MediaPlaybackPriority;
  requestPlaybackSlot?: boolean;
  loadStrategy?: 'immediate' | 'visible';
  forcePause?: boolean;
};

const AutoplayPreviewVideo = ({
  src,
  hlsSrc,
  poster,
  pauseOffscreen = true,
  rootMargin = '120px 0px',
  unloadWhenOffscreen = true,
  playbackPriority = 'preview',
  requestPlaybackSlot = true,
  loadStrategy = 'visible',
  forcePause = false,
  preload = 'metadata',
  ...props
}: AutoplayPreviewVideoProps) => {
  return (
    <AdaptiveVideo
      {...props}
      src={src}
      hlsSrc={hlsSrc}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload={preload}
      pauseOffscreen={pauseOffscreen}
      rootMargin={rootMargin}
      unloadWhenOffscreen={unloadWhenOffscreen}
      playbackPriority={playbackPriority}
      requestPlaybackSlot={requestPlaybackSlot}
      loadStrategy={loadStrategy}
      forcePause={forcePause}
    />
  );
};

export default AutoplayPreviewVideo;
