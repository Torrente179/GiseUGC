import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '@/lib/locale-context';
import ServicesMarquee from './ServicesMarquee';

describe('services marquee touch handling', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  // A non-passive touchmove on window makes iOS run JavaScript before every
  // swipe anywhere on the page; the home page then froze whenever the main
  // thread was busy. Only the rail itself may wait for its drag handler.
  it('keeps its touch listeners on the rail, never on the window', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    }));
    const onWindow = vi.spyOn(window, 'addEventListener');
    const onElements = vi.spyOn(HTMLElement.prototype, 'addEventListener');

    render(
      <MemoryRouter initialEntries={['/']}>
        <LocaleProvider>
          <ServicesMarquee />
        </LocaleProvider>
      </MemoryRouter>,
    );

    const windowTouch = onWindow.mock.calls.filter(([type]) => String(type).startsWith('touch'));
    expect(windowTouch).toEqual([]);
    // The rail's drag handler (React's own root listeners are passive).
    const railMove = onElements.mock.calls.find(
      ([type, , options]) => type === 'touchmove' && (options as AddEventListenerOptions | undefined)?.passive === false,
    );
    expect(railMove).toBeDefined();
    expect((onElements.mock.contexts as Element[])[onElements.mock.calls.indexOf(railMove!)]).not.toBe(document.body);
  });
});
