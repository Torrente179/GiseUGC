import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const loaderSource = readFileSync(resolve(process.cwd(), 'public/gtm-loader.js'), 'utf8');

type DataLayerEntry = { [index: number]: unknown; 0?: unknown; 1?: unknown } | Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    gtag?: (...args: unknown[]) => void;
  }
}

const scriptSrcs = () =>
  Array.from(document.querySelectorAll('script'))
    .map((node) => node.getAttribute('src') ?? '')
    .filter(Boolean);

const dataLayer = () => (window.dataLayer ?? []) as DataLayerEntry[];

const runLoader = () => {
  window.dataLayer = [];
  Reflect.deleteProperty(window, 'gtag');
  document.querySelectorAll('script').forEach((node) => node.remove());
  new Function(loaderSource)();
};

describe('gtm-loader fires gtag page_view on load', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('requestIdleCallback', undefined);
    document.body.innerHTML = '';
    Object.defineProperty(document, 'readyState', {
      configurable: true,
      get: () => 'loading',
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    Reflect.deleteProperty(document, 'readyState');
    window.dataLayer = [];
    Reflect.deleteProperty(window, 'gtag');
    document.querySelectorAll('script').forEach((node) => node.remove());
  });

  it('calls gtag config and injects gtag.js without waiting for interaction', () => {
    runLoader();

    expect(scriptSrcs()).toContain('https://www.googletagmanager.com/gtag/js?id=G-3W6XVBLWXH');
    expect(scriptSrcs().some((src) => src.includes('gtm.js'))).toBe(false);

    const config = dataLayer().find((entry) => entry?.[0] === 'config');
    expect(config?.[1]).toBe('G-3W6XVBLWXH');
    expect(loaderSource).not.toMatch(/setTimeout\([^,]+,\s*30000\)/u);
  });

  it('keeps heavy GTM deferred until first interaction', () => {
    runLoader();
    expect(scriptSrcs().some((src) => src.includes('gtm.js?id=GTM-TX2WCCLT'))).toBe(false);

    document.dispatchEvent(new Event('touchstart'));

    expect(scriptSrcs()).toContain('https://www.googletagmanager.com/gtm.js?id=GTM-TX2WCCLT');
    expect(dataLayer().some((entry) => (entry as { event?: string }).event === 'gtm.js')).toBe(true);
  });

  it('loads GTM after a short idle once the window load event fires', () => {
    runLoader();
    window.dispatchEvent(new Event('load'));
    expect(scriptSrcs().some((src) => src.includes('gtm.js'))).toBe(false);

    vi.advanceTimersByTime(3499);
    expect(scriptSrcs().some((src) => src.includes('gtm.js'))).toBe(false);

    vi.advanceTimersByTime(1);
    expect(scriptSrcs()).toContain('https://www.googletagmanager.com/gtm.js?id=GTM-TX2WCCLT');
  });
});
