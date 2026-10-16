import { R2_MEDIA_BASE_URL } from '@/data/portfolio-clips';
import { FEED_MEDIA, FEED_MEDIA_VERSION, type FeedRendition } from '@/data/feed-renditions';

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
 *   • the next and previous reels are already loading before a swipe lands;
 *   • a reel's element moves between the in-page card and the full-screen
 *     feed, so opening it does not restart or reload the video;
 *   • iOS lets an element play with sound only once a tap has "blessed" it, so
 *     a tap blesses the whole pool and sound survives every swipe after it.
 */

export type FeedCodec = 'hevc' | 'avc';
/** The whole reel, or the 6 s silent loop of its opening that cards and the hero play. */
export type FeedKind = 'full' | 'preview';
export type FeedMedia = FeedRendition & { slug: string };

// Main@5.0 covers the 1440 × 2560 master; every HEVC-capable phone decodes it.
export const HEVC_TYPE = 'video/mp4; codecs="hvc1.1.6.L150.B0"';
/** Active reel + the next + the previous, and one spare for the hand-over. */
const POOL_SIZE = 4;
const WARM_LIMIT = 3;

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

const canPlayHevc = () => {
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

const warm = new Map<string, HTMLVideoElement>();

/**
 * Starts buffering a video that is about to play (the hero's next reel, the
 * next cut in a deck). Chrome shares a URL's buffered media between elements
 * of the same CORS mode, so the real player starts from data already here.
 */
export const warmFeedVideo = (url: string | null | undefined) => {
  if (!url || typeof document === 'undefined' || warm.has(url)) return;
  const video = document.createElement('video');
  video.crossOrigin = 'anonymous';
  video.muted = true;
  video.preload = 'auto';
  video.src = url;
  warm.set(url, video);
  while (warm.size > WARM_LIMIT) {
    const [oldest, element] = warm.entries().next().value as [string, HTMLVideoElement];
    element.removeAttribute('src');
    element.load();
    warm.delete(oldest);
  }
};

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
  return video;
};

/** The portfolio feed's reused <video> elements, keyed by master slug. */
export class FeedPlayerPool {
  private readonly assigned = new Map<string, HTMLVideoElement>();
  private readonly free: HTMLVideoElement[] = [];
  private blessed = false;

  /** The reel's element, loading. `null` when the reel has no feed files. */
  acquire(slug: string, preload: 'auto' | 'metadata' = 'auto'): HTMLVideoElement | null {
    const existing = this.assigned.get(slug);
    if (existing) {
      if (preload === 'auto') existing.preload = 'auto';
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
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.remove();
      if (this.free.length < POOL_SIZE) this.free.push(video);
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
    this.free.length = 0;
  }
}
