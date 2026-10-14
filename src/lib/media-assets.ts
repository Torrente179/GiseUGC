import { feedVideoSrc, getClipFeedMedia } from '@/lib/feed-media';

export type ResponsivePosterSource = {
  src: string;
  width: number;
  type: 'image/avif' | 'image/webp' | 'image/jpeg';
};

export type ResponsivePoster = {
  fallback: string;
  sources: ResponsivePosterSource[];
  width: number;
  height: number;
  placeholder?: string;
};

export type PreviewAsset = {
  src: string;
  hls?: string;
  codec?: string;
  bytes?: number;
  durationSeconds?: number;
};

export type PlaybackCandidate = {
  id: string;
  mp4: string;
  hls?: string;
  codec?: string;
  width?: number;
  height?: number;
  quality?: 'startup' | 'mobile' | 'main' | 'fallback';
};

export type PlaybackCandidateInput = Omit<PlaybackCandidate, 'id'> & {
  id?: string;
};

/**
 * Validates and de-duplicates whole playback candidates. MP4 and HLS are kept
 * together as one record so filtering an absent source can never shift one
 * array out of alignment with the other.
 */
export const createPlaybackCandidates = (
  inputs: PlaybackCandidateInput[],
): PlaybackCandidate[] => {
  const seen = new Set<string>();

  return inputs.flatMap((candidate, index) => {
    if (!candidate.mp4 || seen.has(candidate.mp4)) return [];
    seen.add(candidate.mp4);
    return [{
      ...candidate,
      id: candidate.id ?? `${candidate.quality ?? 'playback'}-${index}-${candidate.mp4}`,
    }];
  });
};

type ClipPlaybackSources = {
  id?: number;
  mainSrc?: string;
  hlsSrc?: string;
  mobileSrc?: string;
  mobileHlsSrc?: string;
  previewSrc?: string;
  previewHlsSrc?: string;
  startupSrc?: string;
};

const isQuickTimeSource = (src?: string) => Boolean(src && /\.mov(?:$|\?)/iu.test(src));
export const getStartupVideoSrc = (clipId: number) =>
  `/uploads/videos/startups/v1/${clipId}.mp4`;

export const createClipPlaybackCandidates = (
  clip: ClipPlaybackSources | null | undefined,
  _preferMobile: boolean,
): PlaybackCandidate[] => {
  if (!clip) return [];

  // A reel with feed files plays its one full-quality, fast-start MP4: there is
  // no ladder to climb, so no startup bridge to hand over from either.
  const feed = clip.mainSrc ? getClipFeedMedia({ mainSrc: clip.mainSrc }) : null;
  if (feed) {
    return createPlaybackCandidates([
      { id: 'feed', mp4: feedVideoSrc(feed), width: feed.width, height: feed.height, quality: 'main' },
    ]);
  }

  const main: PlaybackCandidateInput = {
    id: 'main',
    mp4: clip.mainSrc ?? '',
    hls: clip.hlsSrc,
    quality: 'main',
  };
  const mobile: PlaybackCandidateInput = {
    id: 'mobile',
    mp4: clip.mobileSrc ?? '',
    hls: clip.mobileHlsSrc,
    quality: 'mobile',
  };
  const startup: PlaybackCandidateInput = {
    id: 'startup',
    mp4: clip.startupSrc ?? (clip.id ? getStartupVideoSrc(clip.id) : clip.previewSrc ?? ''),
    quality: 'startup',
  };
  const previewFallback: PlaybackCandidateInput = {
    id: 'preview-fallback',
    mp4: clip.previewSrc ?? '',
    hls: clip.previewHlsSrc,
    quality: 'fallback',
  };

  return createPlaybackCandidates(
    isQuickTimeSource(clip.mainSrc) && !clip.hlsSrc
      ? [mobile, main, startup, previewFallback]
      : [main, mobile, startup, previewFallback],
  );
};
