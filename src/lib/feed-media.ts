import { R2_MEDIA_BASE_URL } from '@/data/portfolio-clips';
import { FEED_MEDIA, FEED_MEDIA_VERSION, type FeedRendition } from '@/data/feed-renditions';
import { getConnectionProfile } from '@/lib/media-playback-scheduler';
import {
  onVideosSuspended,
  releaseVideo,
  trackOffPageVideo,
  untrackOffPageVideo,
} from '@/lib/video-lifecycle';

/**
 * The site's video files (encoded by scripts/encode-feed.mjs): one
 * progressive, fast-start MP4 per reel, at the master's own quality. The
 * original stream itself wherever the master allows it, near-transparent
 * otherwise. A single request reaches the first frame at full resolution, where
 * the HLS ladders took four sequential requests and opened on a 360–540p rung.
 * HEVC goes to every browser that decodes it in hardware (Safari / iOS, Chrome
 * on most phones and Macs) when the master is HEVC; H.264 to everything else.
 *
 * Every part of the site still names its videos by their R2 URLs (main, mobile,
 * preview, HLS). `resolveFeedSource` maps any of those to the matching file
 * here, which is how AdaptiveVideo upgrades every player at once.
 *
 * The portfolio feed adds a small pool of reused <video> elements:
 *   • the next reel is already loading before a swipe lands, and the previous
 *     one has its first frame;
 *   • a reel's element moves between the in-page card and the full-screen
 *     feed, so opening it does not restart or reload the video;
 *   • iOS lets an element play with sound only once a tap has "blessed" it, so
 *     a tap blesses the whole pool and sound survives every swipe after it.
 *
 * Phones hold little decoded video at once, so the pool keeps three players at
 * most and only one of them buffers a whole reel: the one on screen, then the
 * next once the one on screen can play through.
 */

export type FeedCodec = 'hevc' | 'avc';
/** The whole reel, or the 6 s silent loop of its opening that cards and the hero play. */
export type FeedKind = 'full' | 'preview';
export type FeedMedia = FeedRendition & { slug: string };

// Main@5.0 covers the 1440 × 2560 master; every HEVC-capable phone decodes it.
export const HEVC_TYPE = 'video/mp4; codecs="hvc1.1.6.L150.B0"';
/** Active reel + the next + the previous, and one spare for the hand-over. */
const POOL_SIZE = 4;
/**
 * Preview loops held in memory for the next turn of a rotating card (each is a
 * 6 s file of 3–20 MB). Four of the largest fit; the oldest unused one goes.
 */
const PREVIEW_CACHE_BYTES = 64 * 1024 * 1024;
const PREVIEW_PATH = /\/preview\.(?:hevc|avc)\.mp4$/u;

/** Same rule as `slugify` in scripts/encode-feed.mjs. */
export const slugifyMediaName = (name: string) =>
  name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-|-$/gu, '');

const R2_VIDEO_PATH =
  /\/videos\/(?:(main|mobile|previews)\/([^/?#]+?)(?:-mobile|-preview)?\.[a-z0-9]+|hls\/([^/?#]+)\/(main|mobile|preview)\/master\.m3u8)(?:[?#]|$)/iu;

/** The master a site video URL belongs to, and which cut of it the URL asked for. */
export const parseMediaUrl = (url: string | undefined): { slug: string; kind: FeedKind } | null => {
  if (!url) return null;
  let path = url;
  try {
    path = decodeURIComponent(url);
  } catch {
    // Leave a malformed escape as it is; the pattern simply won't match it.
  }
  const match = R2_VIDEO_PATH.exec(path);
  if (!match) return null;
  const [, folder, file, hlsBase, hlsRendition] = match;
  const name = file ?? hlsBase;
  if (!name) return null;
  const preview = folder === 'previews' || hlsRendition === 'preview';
  return { slug: slugifyMediaName(name), kind: preview ? 'preview' : 'full' };
};

export const getFeedMedia = (slug: string | undefined): FeedMedia | null => {
  if (!slug) return null;
  const rendition = FEED_MEDIA[slug];
  return rendition ? { ...rendition, slug } : null;
};

/** A reel's files, found through its master URL. */
export const getClipFeedMedia = (clip: { mainSrc: string }) => getFeedMedia(parseMediaUrl(clip.mainSrc)?.slug);

/** Landscape reels play whole, over a blurred fill, instead of as a sliver. */
export const isLandscapeRendition = (media: FeedRendition) => media.width > media.height;

let hevcSupport: boolean | null = null;

/** Whether this browser decodes `HEVC_TYPE` (cached per page). */
export const canPlayHevc = () => {
  if (hevcSupport !== null) return hevcSupport;
  if (typeof document === 'undefined') return false;
  hevcSupport = document.createElement('video').canPlayType(HEVC_TYPE) !== '';
  return hevcSupport;
};

export const getFeedCodec = (media: FeedRendition): FeedCodec => (media.hevc && canPlayHevc() ? 'hevc' : 'avc');

export const feedVideoSrc = (media: FeedMedia, kind: FeedKind = 'full', codec: FeedCodec = getFeedCodec(media)) =>
  `${R2_MEDIA_BASE_URL}/videos/feed/${FEED_MEDIA_VERSION}/${media.slug}/${kind === 'preview' ? 'preview.' : ''}${codec}.mp4`;

/** Frame 0 of the master, so the hand-over from poster to video is invisible. */
export const feedPosterSrc = (media: FeedMedia, size: 'full' | 'small' = 'full') =>
  `/uploads/videos/feed/${FEED_MEDIA_VERSION}/${media.slug}${size === 'small' ? '-sm' : ''}.webp`;

/**
 * The feed file for any site video URL (main, mobile, preview MP4 or HLS
 * master), or `null` for a video without feed files. Client-only: the codec
 * depends on the browser.
 */
export const resolveFeedSource = (src?: string, hlsSrc?: string) => {
  const parsed = parseMediaUrl(src) ?? parseMediaUrl(hlsSrc);
  const media = getFeedMedia(parsed?.slug);
  if (!parsed || !media) return null;
  return { media, kind: parsed.kind, src: feedVideoSrc(media, parsed.kind) };
};

type PreviewEntry = {
  /** The loop as a blob: URL once it has downloaded. */
  objectUrl?: string;
  bytes: number;
  pending?: Promise<void>;
  /** Players showing it right now; an entry in use is never revoked. */
  users: number;
  usedAt: number;
};

const previews = new Map<string, PreviewEntry>();

const trimPreviews = (budget = PREVIEW_CACHE_BYTES) => {
  let total = 0;
  previews.forEach((entry) => {
    total += entry.bytes;
  });
  const oldestFirst = [...previews.entries()].sort(([, a], [, b]) => a.usedAt - b.usedAt);
  for (const [url, entry] of oldestFirst) {
    if (total <= budget) break;
    if (entry.users > 0 || !entry.objectUrl) continue;
    URL.revokeObjectURL(entry.objectUrl);
    previews.delete(url);
    total -= entry.bytes;
  }
};

/**
 * Downloads the preview loop a rotating card shows next (the hero's next reel,
 * the next cut in a deck, the next story), once, and keeps it in memory so the
 * turn plays at once and every later turn costs nothing.
 *
 * Safari never caches the range requests a <video> makes, so the old warm-up,
 * a hidden <video> buffering the same URL, downloaded every loop twice there
 * and gave the real player nothing (measured in WebKit). A whole-file fetch is
 * one download that every browser can play from.
 */
export const warmFeedVideo = (url: string | null | undefined) => {
  if (!url || !PREVIEW_PATH.test(url) || typeof window === 'undefined' || typeof fetch === 'undefined') return;
  const existing = previews.get(url);
  if (existing) {
    existing.usedAt = performance.now();
    return;
  }
  if (getConnectionProfile().constrained) return;
  const entry: PreviewEntry = { bytes: 0, users: 0, usedAt: performance.now() };
  previews.set(url, entry);
  entry.pending = fetch(url, { mode: 'cors', credentials: 'omit' })
    .then((response) => (response.ok ? response.blob() : Promise.reject(new Error(String(response.status)))))
    .then((blob) => {
      if (previews.get(url) !== entry) return;
      entry.objectUrl = URL.createObjectURL(blob);
      entry.bytes = blob.size;
      trimPreviews();
    })
    .catch(() => {
      if (previews.get(url) === entry) previews.delete(url);
    })
    .finally(() => {
      entry.pending = undefined;
    });
};

/**
 * The downloaded loop for a preview URL, held for one player until
 * `releaseFeedPreview`. `null` if it has not been warmed.
 */
export const holdFeedPreview = (url: string) => {
  const entry = previews.get(url);
  if (!entry?.objectUrl) return null;
  entry.users += 1;
  entry.usedAt = performance.now();
  return entry.objectUrl;
};

export const releaseFeedPreview = (url: string) => {
  const entry = previews.get(url);
  if (!entry) return;
  entry.users = Math.max(0, entry.users - 1);
  trimPreviews();
};

/** Settles when a warm-up of this URL that is still downloading is done. */
export const pendingFeedPreview = (url: string) => previews.get(url)?.pending ?? null;

if (typeof window !== 'undefined') {
  // A page going into the back/forward cache keeps only the loops on screen.
  onVideosSuspended(() => trimPreviews(0));
}

const createVideo = () => {
  const video = document.createElement('video');
  video.className = 'rf-media-video';
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute('muted', '');
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.disablePictureInPicture = true;
  video.setAttribute('disableremoteplayback', '');
  video.addEventListener('loadeddata', () => {
    video.dataset.ready = 'true';
  });
  video.addEventListener('emptied', () => {
    delete video.dataset.ready;
  });
  trackOffPageVideo(video);
  return video;
};

/** The portfolio feed's reused <video> elements, keyed by master slug. */
export class FeedPlayerPool {
  private readonly assigned = new Map<string, HTMLVideoElement>();
  private readonly free: HTMLVideoElement[] = [];
  private blessed = false;

  /**
   * The reel's element, loading. `null` when the reel has no feed files.
   * `metadata` loads the first frame only. Asked of a reel that has left the
   * screen, it also drops what that reel had buffered, so the element going
   * back to "previous" does not hold a whole reel in memory.
   */
  acquire(slug: string, preload: 'auto' | 'metadata' = 'auto'): HTMLVideoElement | null {
    const existing = this.assigned.get(slug);
    if (existing) {
      if (preload === 'auto') {
        existing.preload = 'auto';
      } else if (existing.preload === 'auto' && !existing.isConnected) {
        const src = existing.getAttribute('src');
        releaseVideo(existing);
        existing.preload = 'metadata';
        if (src) existing.src = src;
      }
      return existing;
    }
    const media = getFeedMedia(slug);
    if (!media || typeof document === 'undefined') return null;

    const video = this.free.pop() ?? createVideo();
    video.preload = preload;
    video.muted = true;
    video.src = feedVideoSrc(media);
    this.assigned.set(slug, video);
    return video;
  }

  peek(slug: string) {
    return this.assigned.get(slug) ?? null;
  }

  /** Keeps these reels loaded and returns every other element to the pool. */
  retain(slugs: Iterable<string>) {
    const keep = new Set(slugs);
    this.assigned.forEach((video, slug) => {
      if (keep.has(slug)) return;
      this.assigned.delete(slug);
      releaseVideo(video);
      video.remove();
      if (this.free.length < POOL_SIZE) this.free.push(video);
      else untrackOffPageVideo(video);
    });
  }

  /**
   * Call inside a tap. iOS only plays an element with sound once a gesture has
   * started it, element by element, so every element the feed will use gets a
   * play() → pause() here. The element on screen is left playing.
   */
  bless(playingSlug?: string) {
    if (this.blessed || typeof document === 'undefined') return;
    this.blessed = true;
    while (this.assigned.size + this.free.length < POOL_SIZE) this.free.push(createVideo());
    const onScreen = playingSlug === undefined ? null : this.assigned.get(playingSlug) ?? null;
    [...this.assigned.values(), ...this.free].forEach((video) => {
      if (video === onScreen) return;
      const attempt = video.play();
      video.pause();
      attempt?.catch(() => undefined);
    });
  }

  destroy() {
    this.retain([]);
    this.free.forEach(untrackOffPageVideo);
    this.free.length = 0;
  }
}
