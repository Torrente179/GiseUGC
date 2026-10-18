import type HlsType from 'hls.js/light';
import { FEED_MEDIA_VERSION } from '@/data/feed-renditions';
import { FEED_STREAM_VERSION, FEED_STREAMS } from '@/data/feed-streams';
import { R2_MEDIA_BASE_URL } from '@/data/portfolio-clips';

/**
 * The feed's reels as streams (scripts/stream-feed.mjs): the feed MP4s'
 * bit-identical audio and video in 1 s fragments, played through Media
 * Source with hls.js (ManagedMediaSource on iPhone).
 *
 * A plain <video> on iPhone loads nothing until it plays, and Safari never
 * reuses a video download, so a reel could only start buffering the moment it
 * was shown. Through Media Source the page does the loading itself:
 *   • a reel about to be shown (the next, the previous, the first reel while
 *     the section is a screen away) loads its first seconds and waits, and
 *     only while the reel that plays has enough buffered ahead;
 *   • the reel that plays buffers ahead of the playhead and keeps what it has
 *     played, so its loop back to 0 does not stall on a refetch (measured: a
 *     1 s freeze per loop with a 6 s back buffer, ~0.1 s without). Memory
 *     stays bounded all the same: ManagedMediaSource lets iOS evict under
 *     pressure, and a reel that leaves the screen is cut back to its head
 *     (FeedPlayerPool.acquire).
 *
 * Measured in WebKit at 20 Mbps: a reel whose head was loaded starts in
 * ~0.16 s, where the same file as a plain <video> took 1.2 s (3 Mbps reel) to
 * 7.6 s (24 Mbps reel).
 */

type Hls = InstanceType<typeof HlsType>;
export type HlsConstructor = typeof HlsType;
export type StreamCodec = 'hevc' | 'avc';

/** Loaded ahead for a reel that is about to be shown. */
const HEAD_SECONDS = 2;
/**
 * The reel that plays owns the connection until it has this much buffered
 * ahead: the reels around it stop loading meanwhile (FeedPlayerPool). At
 * 20 Mbps, a 15 Mbps reel stalled for seconds when the next reel's head
 * loaded at the same time.
 */
const HUNGRY_SECONDS = 4;
/** Kept ahead of the playhead while a reel plays. */
const PLAYING_SECONDS = 20;
/** Cap on what one reel holds ahead, whatever its bitrate. */
const MAX_BUFFER_BYTES = 40 * 1000 * 1000;

const HEVC_STREAM_TYPE = 'video/mp4; codecs="hvc1.1.6.L150.B0"';

type MediaSourceLike = { isTypeSupported: (type: string) => boolean };

const mediaSource = (): MediaSourceLike | null => {
  if (typeof window === 'undefined') return null;
  const scope = window as Window & { ManagedMediaSource?: MediaSourceLike; MediaSource?: MediaSourceLike };
  return scope.ManagedMediaSource ?? scope.MediaSource ?? null;
};

/** Reels whose stream failed this visit: they play their MP4 instead. */
const failed = new Set<string>();

/** The codec to stream this reel in, or `null` to play its MP4. */
export const streamCodecFor = (slug: string): StreamCodec | null => {
  const codecs = FEED_STREAMS[slug];
  const source = mediaSource();
  if (!codecs || !source || failed.has(slug)) return null;
  if (codecs.includes('hevc') && source.isTypeSupported(HEVC_STREAM_TYPE)) return 'hevc';
  return codecs.includes('avc') ? 'avc' : null;
};

export const markStreamFailed = (slug: string) => {
  failed.add(slug);
};

export const feedStreamSrc = (slug: string, codec: StreamCodec) =>
  `${R2_MEDIA_BASE_URL}/videos/feed/${FEED_MEDIA_VERSION}/${slug}/${FEED_STREAM_VERSION}/${codec}.m3u8`;

let hlsModule: Promise<HlsConstructor | null> | null = null;

/** hls.js, once per page; `null` where Media Source is missing. */
export const loadHls = () => {
  hlsModule ??= import('hls.js/light')
    .then(({ default: Hls }) => (Hls.isSupported() ? Hls : null))
    .catch(() => null);
  return hlsModule;
};

/** One reel's stream on one pooled <video>. */
export class FeedStream {
  private readonly hls: Hls;
  /** Holding for the reel that plays: fetches nothing more meanwhile. */
  private held = false;
  /** Has played: buffers PLAYING_SECONDS ahead from then on. */
  private started = false;

  constructor(
    Hls: HlsConstructor,
    private readonly video: HTMLVideoElement,
    src: string,
    onFailure: () => void,
  ) {
    this.hls = new Hls({
      // The site's CSP has no worker-src for blob: workers, and fMP4 needs
      // no transmuxing, so the main thread does the little there is.
      enableWorker: false,
      startPosition: 0,
      autoStartLoad: true,
      maxBufferLength: HEAD_SECONDS,
      maxMaxBufferLength: HEAD_SECONDS,
      maxBufferSize: MAX_BUFFER_BYTES,
      capLevelToPlayerSize: false,
      testBandwidth: false,
    });
    this.hls.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) onFailure();
    });
    video.addEventListener('playing', this.bufferAhead);
    this.hls.loadSource(src);
    this.hls.attachMedia(video);
  }

  /**
   * What the stream buffers ahead: nothing while held, its head before it
   * plays, PLAYING_SECONDS once it has. hls.js reads these on every tick.
   * (Holding by buffer target, not stopLoad(): a stopLoad() before the
   * playlist arrives aborts it, and that reel never loads again.)
   */
  private applyTarget() {
    const seconds = this.held ? 0 : this.started ? PLAYING_SECONDS : HEAD_SECONDS;
    this.hls.config.maxBufferLength = seconds;
    this.hls.config.maxMaxBufferLength = seconds;
  }

  private readonly bufferAhead = () => {
    this.started = true;
    this.applyTarget();
  };

  /** Playing, or meant to be (a stalled reel still counts). */
  get playing() {
    return !this.video.paused;
  }

  /** Playing with less than HUNGRY_SECONDS ahead, and more still to load. */
  get hungry() {
    if (!this.playing) return false;
    const { buffered, currentTime, duration } = this.video;
    for (let i = 0; i < buffered.length; i += 1) {
      // The first frame of some reels sits at 0.1 s, so allow a small hole.
      if (buffered.start(i) - 0.25 > currentTime || buffered.end(i) < currentTime) continue;
      const end = buffered.end(i);
      return end - currentTime < HUNGRY_SECONDS && !(duration - end < 0.25);
    }
    return true;
  }

  /** Lets the stream load, or holds it while another reel needs the connection. */
  setLoading(loading: boolean) {
    if (loading === !this.held) return;
    this.held = !loading;
    this.applyTarget();
  }

  destroy() {
    this.video.removeEventListener('playing', this.bufferAhead);
    this.hls.destroy();
  }
}
