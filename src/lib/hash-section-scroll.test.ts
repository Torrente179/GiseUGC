import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  findScrollAnchor,
  pinElementInView,
  pinnedScrollY,
  readScrollAnchor,
  saveScrollAnchor,
  SCROLL_PIN_MAX_MS,
} from '@/lib/hash-section-scroll';

const rect = (top: number, height: number) =>
  ({ top, bottom: top + height, height, left: 0, right: 0, width: 0, x: 0, y: top, toJSON: () => ({}) }) as DOMRect;

describe('pinnedScrollY', () => {
  it('puts the element the offset below the top of the viewport', () => {
    expect(pinnedScrollY(500, 1000, 80, 8000, 900)).toBe(1420);
  });

  it('stops at the end of the page (a footer target) and at the top', () => {
    expect(pinnedScrollY(7800, 0, 80, 8000, 900)).toBe(7100);
    expect(pinnedScrollY(20, 0, 80, 8000, 900)).toBe(0);
  });
});

describe('pinElementInView', () => {
  let frames: FrameRequestCallback[];
  let now: number;
  let scrollY: number;
  let scrollTo: ReturnType<typeof vi.fn>;
  let elementTop: number;
  const target = document.createElement('section');

  const runFrame = (advanceMs = 16) => {
    now += advanceMs;
    const queued = frames;
    frames = [];
    queued.forEach((callback) => callback(now));
  };

  beforeEach(() => {
    frames = [];
    now = 0;
    scrollY = 0;
    elementTop = 2000; // page-absolute top of the target
    vi.spyOn(performance, 'now').mockImplementation(() => now);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback));
    vi.stubGlobal('cancelAnimationFrame', () => {
      frames = [];
    });
    Object.defineProperty(window, 'scrollY', { configurable: true, get: () => scrollY });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 900 });
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 9000 });
    scrollTo = vi.fn((options: ScrollToOptions) => {
      scrollY = options.top ?? scrollY;
    });
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
    target.getBoundingClientRect = () => rect(elementTop - scrollY, 600);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('lands at once, without parking the page at the top first', () => {
    scrollY = 1500;
    pinElementInView({ find: () => target, offset: 80 });
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollY).toBe(1920);
  });

  it('holds the section while content above it mounts and grows', () => {
    pinElementInView({ find: () => target, offset: 80 });
    expect(scrollY).toBe(1920);
    elementTop = 2300; // a deferred section above finished mounting
    runFrame();
    expect(scrollY).toBe(2220);
  });

  it('waits for a section that is not mounted yet', () => {
    let mounted = false;
    pinElementInView({ find: () => (mounted ? target : null), offset: 80 });
    expect(scrollTo).not.toHaveBeenCalled();
    mounted = true;
    runFrame();
    expect(scrollY).toBe(1920);
  });

  it.each(['touchstart', 'wheel', 'pointerdown', 'keydown'])('hands the scroll back on %s', (type) => {
    pinElementInView({ find: () => target, offset: 80 });
    window.dispatchEvent(new Event(type));
    elementTop = 2300;
    runFrame();
    expect(scrollY).toBe(1920);
    expect(frames).toHaveLength(0);
  });

  it('lets go after the settle window', () => {
    pinElementInView({ find: () => target, offset: 80 });
    runFrame(SCROLL_PIN_MAX_MS);
    elementTop = 2300;
    runFrame();
    expect(scrollY).toBe(1920);
  });

  it('can be released early by its caller (a new route)', () => {
    const release = pinElementInView({ find: () => target, offset: 80 });
    release();
    elementTop = 2300;
    runFrame();
    expect(scrollY).toBe(1920);
  });
});

describe('scroll anchor for Back', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.body.style.top = '';
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  const section = (id: string, top: number, height: number) => {
    const element = document.createElement('section');
    element.id = id;
    element.getBoundingClientRect = () => rect(top, height);
    document.body.appendChild(element);
    return element;
  };

  it('picks the section under the nav, with how far into it the visitor was', () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(2400);
    section('portfolio', -900, 800);
    section('services', -260, 1200);
    section('method', 940, 900);
    expect(findScrollAnchor()).toEqual({ id: 'services', offset: -260 });
  });

  it('has nothing to hold at the top of the page', () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0);
    section('home', 0, 900);
    expect(findScrollAnchor()).toBeNull();
  });

  it('still finds it while an open dialog has locked the page', () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0);
    document.body.style.top = '-2400px';
    section('services', -260, 1200);
    expect(findScrollAnchor()).toEqual({ id: 'services', offset: -260 });
  });

  it('skips a hidden duplicate of an id', () => {
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(2400);
    section('services', 0, 0);
    section('services', -260, 1200);
    expect(findScrollAnchor()).toBeNull();
  });

  it('remembers the anchor per page', () => {
    saveScrollAnchor('/', { id: 'services', offset: -260 });
    expect(readScrollAnchor('/')).toEqual({ id: 'services', offset: -260 });
    expect(readScrollAnchor('/en/')).toBeNull();
    saveScrollAnchor('/', null);
    expect(readScrollAnchor('/')).toBeNull();
  });

  it('ignores a stored value it cannot use', () => {
    sessionStorage.setItem('gisela:scroll-anchor:/', '{"id":3}');
    expect(readScrollAnchor('/')).toBeNull();
    sessionStorage.setItem('gisela:scroll-anchor:/', 'not json');
    expect(readScrollAnchor('/')).toBeNull();
  });
});
