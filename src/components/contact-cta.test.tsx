import { act, fireEvent, render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FloatingContactDock from '@/components/FloatingContactDock';
import Navbar from '@/components/Navbar';
import { onContactDockAction, openContactDock } from '@/lib/contact-dock';
import { LocaleProvider } from '@/lib/locale-context';

/*
 * The navbar "Escríbeme" used to scroll to (or, off Home, load) `/#contact`:
 * the page-end strip, which has no contact channels while the full footer is
 * off, and where the floating dock steps back. It now opens the contact panel
 * in place on every route.
 */

const realMatchMedia = window.matchMedia;

const stubViewportWidth = (width: number) => {
  window.matchMedia = ((query: string) => {
    const max = query.match(/max-width:\s*(\d+)px/u);
    const min = query.match(/min-width:\s*(\d+)px/u);
    const matches = max ? width <= Number(max[1]) : min ? width >= Number(min[1]) : false;
    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    } as MediaQueryList;
  }) as typeof window.matchMedia;
};

const navbarCtaHref = (path: string) => {
  const html = renderToStaticMarkup(
    <StaticRouter location={path}>
      <LocaleProvider>
        <Navbar />
      </LocaleProvider>
    </StaticRouter>,
  );
  return html.match(/<a href="([^"]*)" class="site-nav-pill__cta"/u)?.[1];
};

const renderInRouter = (path: string, element: JSX.Element) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <LocaleProvider>{element}</LocaleProvider>
    </MemoryRouter>,
  );

beforeEach(() => {
  stubViewportWidth(1280);
});

afterEach(() => {
  window.matchMedia = realMatchMedia;
  document.body.removeAttribute('data-contact-dock-pending-action');
});

describe('navbar Escríbeme', () => {
  it('links to this page’s own #contact on every route, never a cross-document /#contact', () => {
    for (const path of ['/', '/en/', '/servicios/', '/servicios/creadora-ugc-bilingue/', '/en/verticals/beauty-ugc-creator/', '/politica-de-privacidad/']) {
      expect(navbarCtaHref(path), path).toBe('#contact');
    }
  });

  it('opens the contact panel when a contact surface is mounted', () => {
    const actions: string[] = [];
    const unsubscribe = onContactDockAction((action) => actions.push(action));
    const { container } = renderInRouter('/servicios/', <Navbar />);
    const cta = container.querySelector<HTMLAnchorElement>('.site-nav-pill__cta');
    expect(cta).not.toBeNull();

    const notPrevented = fireEvent.click(cta!);
    unsubscribe();

    expect(notPrevented).toBe(false);
    expect(actions).toEqual(['open']);
  });

  it('falls back to the page-end strip when no contact surface is mounted', () => {
    const strip = document.createElement('footer');
    strip.id = 'contact';
    document.body.append(strip);
    const { container } = renderInRouter('/politica-de-privacidad/', <Navbar />);

    fireEvent.click(container.querySelector('.site-nav-pill__cta')!);
    strip.remove();

    expect(document.body.hasAttribute('data-contact-dock-pending-action')).toBe(false);
  });
});

describe('desktop contact dock', () => {
  it('opens on request, even before its own entrance, and focuses WhatsApp', () => {
    renderInRouter('/servicios/', <FloatingContactDock />);
    const dock = document.querySelector<HTMLElement>('.cdock');
    expect(dock?.dataset.visible).toBe('false');

    act(() => openContactDock());

    expect(dock?.dataset.visible).toBe('true');
    expect(dock?.dataset.ghost).toBe('false');
    expect(document.querySelector<HTMLElement>('.cdock-panel')?.dataset.open).toBe('true');
    expect(document.activeElement?.classList.contains('cdock-row--primary')).toBe(true);
  });

  it('leaves the request to the mobile contact sheet on phones', () => {
    stubViewportWidth(390);
    vi.stubGlobal('innerWidth', 390);
    renderInRouter('/servicios/', <FloatingContactDock />);

    act(() => openContactDock());

    expect(document.querySelector('.cdock')).toBeNull();
    expect(document.body.getAttribute('data-contact-dock-pending-action')).toBe('open');
    vi.unstubAllGlobals();
  });
});
