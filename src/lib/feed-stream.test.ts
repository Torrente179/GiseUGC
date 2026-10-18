import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FEED_MEDIA } from '@/data/feed-renditions';
import { FEED_STREAMS } from '@/data/feed-streams';

type Listener = (event: string, data: { fatal: boolean }) => void;

const instances: FakeHls[] = [];

class FakeHls {
  static Events = { ERROR: 'hlsError' };
  static isSupported = () => true;
  config: Record<string, number | boolean>;
  source = '';
  media: HTMLVideoElement | null = null;
  destroyed = false;
  private listeners: Listener[] = [];
  constructor(config: Record<string, number | boolean>) {
    this.config = { ...config };
    instances.push(this);
  }
  on(_event: string, listener: Listener) {
    this.listeners.push(listener);
  }
  loadSource(source: string) {
    this.source = source;
  }
  attachMedia(media: HTMLVideoElement) {
    this.media = media;
  }
  destroy() {
    this.destroyed = true;
  }
  /** Buffers ahead (hls.js caps maxBufferLength by maxMaxBufferLength). */
  get loading() {
    return Number(this.config.maxMaxBufferLength) > 0;
  }
  fail() {
    this.listeners.forEach((listener) => listener('hlsError', { fatal: true }));
  }
}

vi.mock('hls.js/light', () => ({ default: FakeHls }));

const BASE = 'https://media.giselasaldarriaga.com/videos/feed/v1';
const hevcSlug = Object.keys(FEED_MEDIA).find((slug) => FEED_MEDIA[slug].hevc)!;
const avcSlug = Object.keys(FEED_MEDIA).find((slug) => !FEED_MEDIA[slug].hevc)!;

const withMediaSource = (hevc: boolean) => {
  vi.stubGlobal('ManagedMediaSource', { isTypeSupported: (type: string) => hevc || !type.includes('hvc1') });
};

const load = async () => {
  vi.resetModules();
  instances.length = 0;
  return {
    stream: await import('@/lib/feed-stream'),
    media: await import('@/lib/feed-media'),
  };
};

/** The pool attaches streams once hls.js has loaded. */
const settle = async (stream: typeof import('@/lib/feed-stream')) => {
  await stream.loadHls();
  await Promise.resolve();
};

describe('feed streams', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('has a stream for every reel with feed files', () => {
    expect(Object.keys(FEED_MEDIA).filter((slug) => !FEED_STREAMS[slug])).toEqual([]);
    Object.entries(FEED_STREAMS).forEach(([slug, codecs]) => {
      expect(codecs).toContain('avc');
      expect(codecs.includes('hevc')).toBe(FEED_MEDIA[slug].hevc);
    });
  });

  it('streams HEVC where Media Source decodes it, H.264 otherwise, nothing without Media Source', async () => {
    const { stream } = await load();
    expect(stream.streamCodecFor(hevcSlug)).toBeNull();

    withMediaSource(true);
    expect(stream.streamCodecFor(hevcSlug)).toBe('hevc');
    expect(stream.streamCodecFor(avcSlug)).toBe('avc');
    expect(stream.streamCodecFor('not-a-reel')).toBeNull();
    expect(stream.feedStreamSrc(hevcSlug, 'hevc')).toBe(`${BASE}/${hevcSlug}/s1/hevc.m3u8`);

    withMediaSource(false);
    expect(stream.streamCodecFor(hevcSlug)).toBe('avc');

    stream.markStreamFailed(hevcSlug);
    expect(stream.streamCodecFor(hevcSlug)).toBeNull();
  });

  it('gives pooled reels a stream that loads only their first seconds until they play', async () => {
    withMediaSource(true);
    const { stream, media } = await load();
    const pool = new media.FeedPlayerPool();
    const video = pool.acquire(hevcSlug)!;
    await settle(stream);

    expect(video.hasAttribute('src')).toBe(false);
    expect(instances).toHaveLength(1);
    const [hls] = instances;
    expect(hls.source).toBe(`${BASE}/${hevcSlug}/s1/hevc.m3u8`);
    expect(hls.media).toBe(video);
    expect(hls.config.maxBufferLength).toBe(2);
    expect(hls.config.enableWorker).toBe(false);

    video.dispatchEvent(new Event('playing'));
    expect(hls.config.maxBufferLength).toBe(20);

    pool.retain([]);
    expect(hls.destroyed).toBe(true);
  });

  it('holds the reels around the one playing while it is short of buffer', async () => {
    vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] });
    withMediaSource(true);
    const { stream, media } = await load();
    const pool = new media.FeedPlayerPool();
    const watched = pool.acquire(hevcSlug)!;
    pool.acquire(avcSlug, 'metadata');
    await settle(stream);
    const [onScreen, next] = instances;

    // Playing with nothing buffered ahead: the next reel waits.
    Object.defineProperty(watched, 'paused', { configurable: true, get: () => false });
    vi.advanceTimersByTime(500);
    expect(onScreen.loading).toBe(true);
    expect(next.loading).toBe(false);

    // Paused again (nothing to protect): the next reel loads its head.
    Object.defineProperty(watched, 'paused', { configurable: true, get: () => true });
    vi.advanceTimersByTime(500);
    expect(next.loading).toBe(true);

    pool.destroy();
    vi.useRealTimers();
  });

  it('plays the MP4 when a stream fails, and for the rest of the visit', async () => {
    withMediaSource(true);
    const { stream, media } = await load();
    const pool = new media.FeedPlayerPool();
    const video = pool.acquire(avcSlug)!;
    await settle(stream);

    instances[0].fail();
    expect(instances[0].destroyed).toBe(true);
    expect(video.getAttribute('src')).toBe(`${BASE}/${avcSlug}/avc.mp4`);

    pool.retain([]);
    pool.acquire(avcSlug);
    expect(instances).toHaveLength(1);
  });

  it('drops a stream that left the screen back to its first seconds', async () => {
    withMediaSource(true);
    const { stream, media } = await load();
    const pool = new media.FeedPlayerPool();
    const video = pool.acquire(avcSlug, 'auto')!;
    await settle(stream);
    video.dispatchEvent(new Event('playing'));

    pool.acquire(avcSlug, 'metadata');
    expect(instances[0].destroyed).toBe(true);
    expect(instances).toHaveLength(2);
    expect(instances[1].config.maxBufferLength).toBe(2);
  });

  it('lets streams go on pagehide and picks them up on a back/forward restore', async () => {
    withMediaSource(true);
    const { stream, media } = await load();
    const { installVideoPageLifecycle } = await import('@/lib/video-lifecycle');
    installVideoPageLifecycle();
    const pool = new media.FeedPlayerPool();
    pool.acquire(avcSlug);
    await settle(stream);

    const pageEvent = (type: string, persisted: boolean) => {
      const event = new Event(type);
      Object.defineProperty(event, 'persisted', { value: persisted });
      window.dispatchEvent(event);
    };
    pageEvent('pagehide', true);
    expect(instances[0].destroyed).toBe(true);
    pageEvent('pageshow', true);
    expect(instances).toHaveLength(2);
    expect(instances[1].destroyed).toBe(false);
  });
});
