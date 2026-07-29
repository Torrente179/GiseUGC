import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MediaPlaybackPriority } from '@/lib/media-playback-scheduler';

type Scheduler = typeof import('@/lib/media-playback-scheduler');

/** The scheduler keeps module-level state, so each test gets a fresh copy. */
const loadScheduler = async (): Promise<Scheduler> => {
  vi.resetModules();
  return import('@/lib/media-playback-scheduler');
};

/** Registers an entry and exposes its latest grant decision. */
const addEntry = (
  scheduler: Scheduler,
  priority: MediaPlaybackPriority,
  active = true,
) => {
  const state = { granted: false };
  const registration = scheduler.registerMediaPlaybackEntry(
    (granted) => {
      state.granted = granted;
    },
    priority,
  );
  registration.update(active, priority);
  return { state, registration };
};

const grantedCount = (entries: { state: { granted: boolean } }[]) =>
  entries.filter(({ state }) => state.granted).length;

describe('media playback scheduler', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });
  });

  it('runs all three hero frames as one composition', async () => {
    const scheduler = await loadScheduler();
    const frames = [0, 1, 2].map(() => addEntry(scheduler, 'hero'));

    expect(grantedCount(frames)).toBe(3);
  });

  it('caps the hero at three decoders', async () => {
    const scheduler = await loadScheduler();
    const frames = [0, 1, 2, 3].map(() => addEntry(scheduler, 'hero'));

    expect(grantedCount(frames)).toBe(3);
    // The extra demand is the newest, so it is the one left unloaded.
    expect(frames[3].state.granted).toBe(false);
  });

  it('keeps card previews to a single decoder', async () => {
    const scheduler = await loadScheduler();
    const previews = [0, 1, 2].map(() => addEntry(scheduler, 'preview'));

    expect(grantedCount(previews)).toBe(1);
  });

  it('does not let a lower class borrow the hero allowance', async () => {
    const scheduler = await loadScheduler();
    const hero = addEntry(scheduler, 'hero');
    const previews = [0, 1].map(() => addEntry(scheduler, 'preview'));

    expect(hero.state.granted).toBe(true);
    expect(grantedCount(previews)).toBe(0);
  });

  it('gives a theater exclusive ownership over hero frames', async () => {
    const scheduler = await loadScheduler();
    const frames = [0, 1, 2].map(() => addEntry(scheduler, 'hero'));
    const theater = addEntry(scheduler, 'theater');

    expect(theater.state.granted).toBe(true);
    expect(grantedCount(frames)).toBe(0);
  });

  it('releases every decoder while the document is hidden', async () => {
    const scheduler = await loadScheduler();
    const frames = [0, 1, 2].map(() => addEntry(scheduler, 'hero'));
    expect(grantedCount(frames)).toBe(3);

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(grantedCount(frames)).toBe(0);
  });

  it('reclaims a slot when a granted entry unregisters', async () => {
    const scheduler = await loadScheduler();
    const frames = [0, 1, 2, 3].map(() => addEntry(scheduler, 'hero'));
    expect(frames[3].state.granted).toBe(false);

    frames[0].registration.unregister();

    expect(frames[3].state.granted).toBe(true);
    expect(grantedCount(frames.slice(1))).toBe(3);
  });

  it('drops the hero to one decoder on a metered connection', async () => {
    const navigatorWithConnection = navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    };
    const original = navigatorWithConnection.connection;
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { effectiveType: '4g', saveData: true },
    });

    try {
      const scheduler = await loadScheduler();
      const frames = [0, 1, 2].map(() => addEntry(scheduler, 'hero'));

      expect(grantedCount(frames)).toBe(1);
    } finally {
      Object.defineProperty(navigator, 'connection', {
        configurable: true,
        value: original,
      });
    }
  });
});
