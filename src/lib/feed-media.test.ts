import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FEED_MEDIA } from '@/data/feed-renditions';
import {
  LEGACY_REEL_CLIPS,
  r2HlsMaster,
  r2MainVideo,
  r2MobileVideo,
  r2PreviewVideo,
} from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';

type FeedMediaModule = typeof import('@/lib/feed-media');

/** HEVC support is cached per page load, so each test gets a fresh module. */
const loadFeedMedia = async (hevc: boolean): Promise<FeedMediaModule> => {
  vi.resetModules();
  vi.spyOn(HTMLMediaElement.prototype, 'canPlayType').mockImplementation((type) =>
    hevc && type.includes('hvc1') ? 'probably' : '',
  );
  return import('@/lib/feed-media');
};

const BASE = 'https://media.giselasaldarriaga.com/videos/feed/v1';
const hevcSlug = Object.keys(FEED_MEDIA).find((slug) => FEED_MEDIA[slug].hevc)!;
const [slugA, slugB, slugC, slugD] = Object.keys(FEED_MEDIA);

describe('feed media', () => {
  let play: ReturnType<typeof vi.fn<() => Promise<void>>>;

  beforeEach(() => {
    play = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('has feed files for every reel and every clothing cut', async () => {
    const { getClipFeedMedia, getFeedMedia } = await loadFeedMedia(true);
    const reels = [...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS];
    expect(reels.filter((clip) => !getClipFeedMedia(clip)).map((clip) => clip.mainSrc)).toEqual([]);
    ['ugc-clothing-showcase-1', 'ugc-clothing-showcase-2', 'ugc-clothing-showcase-3'].forEach((slug) => {
      expect(getFeedMedia(slug)).not.toBeNull();
    });
  });

  it('delivers masters at their own size, 1440 on the short side at most', () => {
    Object.values(FEED_MEDIA).forEach(({ width, height }) => {
      expect(width % 2).toBe(0);
      expect(height % 2).toBe(0);
      expect(Math.min(width, height)).toBeLessThanOrEqual(1440);
    });
  });

  it('reads the master behind every URL form the site uses', async () => {
    const { parseMediaUrl } = await loadFeedMedia(true);
    expect(parseMediaUrl(r2MainVideo('ugc-lifestyle-review.mp4'))).toEqual({ slug: 'ugc-lifestyle-review', kind: 'full' });
    expect(parseMediaUrl(r2MobileVideo('ugc-lifestyle-review-2.mp4'))).toEqual({ slug: 'ugc-lifestyle-review-2', kind: 'full' });
    expect(parseMediaUrl(r2PreviewVideo('ugc-clothing-showcase-1.mp4'))).toEqual({ slug: 'ugc-clothing-showcase-1', kind: 'preview' });
    expect(parseMediaUrl(r2HlsMaster('ugc-voicebot-review.mp4'))).toEqual({ slug: 'ugc-voicebot-review', kind: 'full' });
    expect(parseMediaUrl(r2HlsMaster('ugc-voicebot-review.mp4', 'preview'))).toEqual({ slug: 'ugc-voicebot-review', kind: 'preview' });
    // Encoded accents and dotted WhatsApp names, as the R2 catalogue writes them.
    expect(parseMediaUrl('https://media.giselasaldarriaga.com/videos/main/Detr%C3%A1s%20de%20c%C3%A1maras.MP4')?.slug).toBe('detras-de-camaras');
    expect(
      parseMediaUrl('https://media.giselasaldarriaga.com/videos/previews/WhatsApp%20Video%202026-02-13%20at%2000.02.34-preview.mp4'),
    ).toEqual({ slug: 'whatsapp-video-2026-02-13-at-00-02-34', kind: 'preview' });
  });

  it('leaves videos it does not know alone', async () => {
    const { parseMediaUrl, resolveFeedSource } = await loadFeedMedia(true);
    expect(parseMediaUrl('/uploads/videos/startups/v1/12.mp4')).toBeNull();
    expect(parseMediaUrl(`${BASE}/croma-key/hevc.mp4`)).toBeNull();
    expect(resolveFeedSource(r2MainVideo('not-a-reel.mp4'))).toBeNull();
    expect(resolveFeedSource(undefined, undefined)).toBeNull();
  });

  it('serves the preview loop for previews and the whole reel otherwise', async () => {
    const { resolveFeedSource } = await loadFeedMedia(false);
    expect(resolveFeedSource(r2PreviewVideo('ugc-clothing-showcase-2.mp4'))?.src).toBe(
      `${BASE}/ugc-clothing-showcase-2/preview.avc.mp4`,
    );
    expect(resolveFeedSource(r2MobileVideo('ugc-brand-spokesperson.mp4'), r2HlsMaster('ugc-brand-spokesperson.mp4'))?.src).toBe(
      `${BASE}/ugc-brand-spokesperson/avc.mp4`,
    );
  });

  it('plays HEVC only for an HEVC master in a browser that decodes it', async () => {
    const withHevc = await loadFeedMedia(true);
    const hevcMedia = withHevc.getFeedMedia(hevcSlug)!;
    expect(withHevc.feedVideoSrc(hevcMedia)).toBe(`${BASE}/${hevcSlug}/hevc.mp4`);
    expect(withHevc.feedVideoSrc(withHevc.getFeedMedia('ugc-lifestyle-review')!)).toBe(`${BASE}/ugc-lifestyle-review/avc.mp4`);

    const withoutHevc = await loadFeedMedia(false);
    expect(withoutHevc.feedVideoSrc(withoutHevc.getFeedMedia(hevcSlug)!)).toBe(`${BASE}/${hevcSlug}/avc.mp4`);
  });

  it('points posters at the frame-0 stills shipped with the site', async () => {
    const { feedPosterSrc, getFeedMedia } = await loadFeedMedia(true);
    const media = getFeedMedia(slugA)!;
    expect(feedPosterSrc(media)).toBe(`/uploads/videos/feed/v1/${slugA}.webp`);
    expect(feedPosterSrc(media, 'small')).toBe(`/uploads/videos/feed/v1/${slugA}-sm.webp`);
  });

  it('gives the theater one candidate: the full-quality file, no startup bridge', async () => {
    await loadFeedMedia(false);
    const { createClipPlaybackCandidates } = await import('@/lib/media-assets');
    const candidates = createClipPlaybackCandidates(LEGACY_REEL_CLIPS[0], true);
    expect(candidates).toHaveLength(1);
    expect(candidates[0]).toMatchObject({ id: 'feed', quality: 'main', mp4: `${BASE}/ugc-lifestyle-review/avc.mp4` });
  });

  it('reuses elements: a released reel hands its element to the next one', async () => {
    const { FeedPlayerPool } = await loadFeedMedia(false);
    const pool = new FeedPlayerPool();
    const first = pool.acquire(slugA)!;
    expect(first.src).toBe(`${BASE}/${slugA}/avc.mp4`);
    expect(first.muted).toBe(true);
    expect(first.preload).toBe('auto');
    expect(pool.acquire(slugA)).toBe(first);

    pool.retain([slugB]);
    expect(pool.peek(slugA)).toBeNull();
    const second = pool.acquire(slugB, 'metadata')!;
    expect(second).toBe(first);
    expect(second.preload).toBe('metadata');
    expect(pool.acquire(slugB, 'auto')!.preload).toBe('auto');
    expect(new FeedPlayerPool().acquire('not-a-reel')).toBeNull();
  });

  it('blesses every element inside the tap but leaves the playing one alone', async () => {
    const { FeedPlayerPool } = await loadFeedMedia(false);
    const pool = new FeedPlayerPool();
    const onScreen = pool.acquire(slugA)!;
    pool.acquire(slugB);
    pool.acquire(slugC);

    pool.bless(slugA);
    const blessed = play.mock.contexts as HTMLVideoElement[];
    expect(blessed).toHaveLength(3);
    expect(blessed).not.toContain(onScreen);

    // The spare is already blessed, so a fourth reel can play with sound.
    expect(blessed).toContain(pool.acquire(slugD));

    pool.bless(slugA);
    expect(play).toHaveBeenCalledTimes(3);
  });

  it('keeps at most three videos warming', async () => {
    const { warmFeedVideo } = await loadFeedMedia(false);
    const load = vi.mocked(HTMLMediaElement.prototype.load);
    ['a', 'b', 'c', 'c', 'd'].forEach((name) => warmFeedVideo(`${BASE}/${name}.mp4`));
    // Four distinct URLs, one repeat: only the oldest is let go.
    expect(load).toHaveBeenCalledTimes(1);
  });
});
