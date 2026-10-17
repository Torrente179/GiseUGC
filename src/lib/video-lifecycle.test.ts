import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type LifecycleModule = typeof import('@/lib/video-lifecycle');

const loadLifecycle = async (): Promise<LifecycleModule> => {
  vi.resetModules();
  return import('@/lib/video-lifecycle');
};

const pageEvent = (type: 'pagehide' | 'pageshow', persisted: boolean) => {
  const event = new Event(type) as PageTransitionEvent;
  Object.defineProperty(event, 'persisted', { value: persisted });
  window.dispatchEvent(event);
};

describe('video lifecycle', () => {
  let play: ReturnType<typeof vi.fn<() => Promise<void>>>;

  beforeEach(() => {
    play = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play);
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => undefined);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('frees a video by taking its source away', async () => {
    const { releaseVideo } = await loadLifecycle();
    const video = document.createElement('video');
    video.src = 'https://example.com/a.mp4';
    releaseVideo(video);
    expect(video.hasAttribute('src')).toBe(false);
    expect(HTMLMediaElement.prototype.load).toHaveBeenCalledTimes(1);

    // Nothing to free: no reload.
    releaseVideo(video);
    expect(HTMLMediaElement.prototype.load).toHaveBeenCalledTimes(1);
  });

  it('empties every video on pagehide and refills them when the page comes back', async () => {
    const { installVideoPageLifecycle, onVideosSuspended, trackOffPageVideo } = await loadLifecycle();
    installVideoPageLifecycle();
    const hook = vi.fn();
    onVideosSuspended(hook);

    const onPage = document.createElement('video');
    onPage.src = 'https://example.com/on-page.mp4';
    onPage.preload = 'auto';
    document.body.appendChild(onPage);
    Object.defineProperty(onPage, 'paused', { configurable: true, get: () => false });
    const offPage = document.createElement('video');
    offPage.src = 'https://example.com/next.mp4';
    offPage.preload = 'metadata';
    trackOffPageVideo(offPage);
    const empty = document.createElement('video');
    document.body.appendChild(empty);

    pageEvent('pagehide', true);
    expect(onPage.hasAttribute('src')).toBe(false);
    expect(offPage.hasAttribute('src')).toBe(false);
    expect(hook).toHaveBeenCalledTimes(1);

    pageEvent('pageshow', true);
    expect(onPage.getAttribute('src')).toBe('https://example.com/on-page.mp4');
    expect(onPage.preload).toBe('auto');
    expect(offPage.getAttribute('src')).toBe('https://example.com/next.mp4');
    expect(empty.hasAttribute('src')).toBe(false);
    // Only the one that was playing starts again.
    expect(play.mock.contexts).toEqual([onPage]);
  });

  it('leaves a video alone that got a new source while the page was away', async () => {
    const { installVideoPageLifecycle } = await loadLifecycle();
    installVideoPageLifecycle();
    const video = document.createElement('video');
    video.src = 'https://example.com/old.mp4';
    document.body.appendChild(video);

    pageEvent('pagehide', true);
    video.src = 'https://example.com/new.mp4';
    pageEvent('pageshow', true);
    expect(video.getAttribute('src')).toBe('https://example.com/new.mp4');
  });
});
