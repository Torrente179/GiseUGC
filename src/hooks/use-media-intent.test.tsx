import { renderHook, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useMediaIntent } from '@/hooks/use-media-intent';

// jsdom ships no matchMedia, and `usePrefersReducedMotion` calls it on mount.
const stubMatchMedia = (reducedMotion: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: reducedMotion && query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
};

const setReadyState = (value: DocumentReadyState) => {
  Object.defineProperty(document, 'readyState', {
    configurable: true,
    get: () => value,
  });
};

beforeEach(() => {
  stubMatchMedia(false);
});

afterEach(() => {
  setReadyState('complete');
});

describe('useMediaIntent', () => {
  it('waits for interaction by default, so ambient video stays off the load path', () => {
    setReadyState('complete');
    const { result } = renderHook(() => useMediaIntent());

    expect(result.current).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('pointermove'));
    });

    expect(result.current).toBe(true);
  });

  it('starts on its own when the document has already loaded', () => {
    setReadyState('complete');
    const { result } = renderHook(() => useMediaIntent({ autoStart: true }));

    // No pointer, no touch, no scroll — this is the service hero arriving ready.
    expect(result.current).toBe(true);
  });

  it('starts at load when the document is still loading, not before', () => {
    setReadyState('loading');
    const { result } = renderHook(() => useMediaIntent({ autoStart: true }));

    expect(result.current).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('load'));
    });

    expect(result.current).toBe(true);
  });

  it('stays off under reduced motion however it was asked to start', () => {
    setReadyState('complete');
    stubMatchMedia(true);

    const { result } = renderHook(() => useMediaIntent({ autoStart: true }));

    expect(result.current).toBe(false);
  });
});
