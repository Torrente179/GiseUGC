import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import type { ReelClip } from '@/data/portfolio-clips';
import {
  feedPosterSrc,
  getClipFeedMedia,
  isLandscapeRendition,
  type FeedPlayerPool,
} from '@/lib/feed-media';

type FeedMediaProps = {
  pool: FeedPlayerPool;
  clip: ReelClip;
  /** The reel on screen: its video is mounted here and reports progress. */
  active: boolean;
  /** Includes the page-wide playback slot, which the caller holds. */
  playing: boolean;
  muted: boolean;
  loop: boolean;
  posterSize?: 'full' | 'small';
  /** For a reel without a feed encode: its poster, and the old player. */
  fallbackPoster: string;
  fallbackVideo?: ReactNode;
  onEnded?: () => void;
  onProgress?: (ratio: number) => void;
  /** The browser refused sound; the reel carries on muted. */
  onSoundBlocked?: () => void;
};

/**
 * One reel's media: the frame-0 poster, and while the reel is active, its
 * pooled <video> (see src/lib/feed-media.ts). Landscape reels play whole over a
 * blurred fill of themselves.
 */
export const FeedMedia = ({
  pool,
  clip,
  active,
  playing,
  muted,
  loop,
  posterSize = 'full',
  fallbackPoster,
  fallbackVideo,
  onEnded,
  onProgress,
  onSoundBlocked,
}: FeedMediaProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ onEnded, onProgress, onSoundBlocked });
  const media = getClipFeedMedia(clip);
  const slug = media?.slug;

  useLayoutEffect(() => {
    callbacks.current = { onEnded, onProgress, onSoundBlocked };
  });

  // Mount the element. A layout effect, so the card → full-screen hand-over
  // (detach there, attach here) happens inside one commit: the element arrives
  // still playing and carries on. An element that was parked instead (paused
  // when its reel left the screen) starts again from its poster frame. The
  // rewind happens here, on arrival: Chrome drops a seek made while detached.
  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!active || !host || !slug) return undefined;
    const video = pool.acquire(slug, 'auto');
    if (!video) return undefined;
    if (video.paused && video.currentTime > 0) video.currentTime = 0;
    host.appendChild(video);
    return () => {
      if (video.parentNode === host) host.removeChild(video);
      window.setTimeout(() => {
        if (!video.isConnected) video.pause();
      }, 0);
    };
  }, [active, pool, slug]);

  useEffect(() => {
    if (!active || !slug) return;
    const video = pool.peek(slug);
    if (!video) return;
    video.loop = loop;
    if (video.muted !== muted) video.muted = muted;
    if (!playing) {
      video.pause();
      return;
    }
    video.play().catch((error: unknown) => {
      if ((error as DOMException)?.name !== 'NotAllowedError' || video.muted) return;
      video.muted = true;
      callbacks.current.onSoundBlocked?.();
      void video.play().catch(() => undefined);
    });
  }, [active, loop, muted, playing, pool, slug]);

  useEffect(() => {
    if (!active || !slug) return undefined;
    const video = pool.peek(slug);
    if (!video) return undefined;
    const handleTime = () => {
      if (video.duration) callbacks.current.onProgress?.(video.currentTime / video.duration);
    };
    const handleEnded = () => callbacks.current.onEnded?.();
    handleTime();
    video.addEventListener('timeupdate', handleTime);
    video.addEventListener('ended', handleEnded);
    return () => {
      video.removeEventListener('timeupdate', handleTime);
      video.removeEventListener('ended', handleEnded);
    };
  }, [active, pool, slug]);

  const landscape = media ? isLandscapeRendition(media) : false;

  return (
    <div className="rf-media" data-fit={landscape ? 'contain' : 'cover'}>
      {media && landscape ? (
        <img className="rf-media-fill" src={feedPosterSrc(media, 'small')} alt="" decoding="async" />
      ) : null}
      <img
        className="rf-media-poster"
        src={media ? feedPosterSrc(media, posterSize) : fallbackPoster}
        alt=""
        decoding="async"
      />
      {media ? <div ref={hostRef} className="rf-media-host" /> : active ? fallbackVideo : null}
    </div>
  );
};

/**
 * Keeps the pool on the reels around the active one: the next starts buffering,
 * the previous loads its first frame, everything else goes back to the pool.
 * Render it before the reels: its layout effect then runs first, so the
 * elements it frees are the ones the reels pick up in the same commit.
 */
export const FeedPoolSync = ({
  pool,
  next,
  previous,
  keep,
}: {
  pool: FeedPlayerPool;
  next?: string;
  previous?: string;
  /** Every reel slug that stays loaded; empty releases the pool. */
  keep: readonly string[];
}) => {
  useLayoutEffect(() => {
    pool.retain(keep);
    if (next !== undefined && keep.includes(next)) pool.acquire(next, 'auto');
    if (previous !== undefined && keep.includes(previous)) pool.acquire(previous, 'metadata');
  }, [keep, next, pool, previous]);
  return null;
};

/** Puts a reel's poster in the cache, so swiping to it paints at once. */
export const FeedPosterPreload = ({ clip, fallback }: { clip: ReelClip; fallback: string }) => {
  const media = getClipFeedMedia(clip);
  return (
    <img
      className="rf-media-preload"
      src={media ? feedPosterSrc(media) : fallback}
      alt=""
      aria-hidden="true"
      decoding="async"
    />
  );
};
