import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { LocaleProvider } from '@/lib/locale-context';
import ResourcePage from '@/components/ResourcePage';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import VerticalLandingPage from '@/components/VerticalLandingPage';
import {
  buildResourceLandingRouteData,
  buildServiceLandingRouteData,
  buildVerticalLandingRouteData,
} from '@/data/landing-route-data.server';
import { serializeRouteDataJson } from '@/lib/inline-copy-links';
import {
  SITE_LOCALES,
  getResourceIdsInOrder,
  getResourcePath,
  getServiceIdsInOrder,
  getServicePath,
  getVerticalIdsInOrder,
  getVerticalPath,
} from '@/lib/locale-path';

/*
 * The browser hydrates these pages from #route-data, which serializeRouteDataJson
 * writes with every "[label](href)" string already split into {type,label,href}
 * segments. A component that treats such a field as a plain string crashes the
 * whole page on load (2026-10-16: every guide whose FAQ answers carry a link
 * showed the error boundary). Render each page from that same round-tripped data.
 */

const asBrowserReceivesIt = <T,>(data: T): T => JSON.parse(serializeRouteDataJson(data).replace(/\\u003c/gu, '<')) as T;

const render = (path: string, element: ReactElement) =>
  renderToStaticMarkup(
    <StaticRouter location={path}>
      <LocaleProvider>{element}</LocaleProvider>
    </StaticRouter>,
  );

describe('pages render from the route data the browser receives', () => {
  for (const locale of SITE_LOCALES) {
    for (const id of getResourceIdsInOrder()) {
      it(`resource ${id} (${locale})`, () => {
        const routeData = asBrowserReceivesIt(buildResourceLandingRouteData(id, locale));
        expect(() =>
          render(getResourcePath(id, locale), <ResourcePage resourceId={id} locale={locale} routeData={routeData} />),
        ).not.toThrow();
      });
    }
    for (const id of getServiceIdsInOrder()) {
      it(`service ${id} (${locale})`, () => {
        const routeData = asBrowserReceivesIt(buildServiceLandingRouteData(id, locale));
        expect(() =>
          render(getServicePath(id, locale), <ServiceLandingPage serviceId={id} locale={locale} routeData={routeData} />),
        ).not.toThrow();
      });
    }
    for (const id of getVerticalIdsInOrder()) {
      it(`vertical ${id} (${locale})`, () => {
        const routeData = asBrowserReceivesIt(buildVerticalLandingRouteData(id, locale));
        expect(() =>
          render(getVerticalPath(id, locale), <VerticalLandingPage verticalId={id} locale={locale} routeData={routeData} />),
        ).not.toThrow();
      });
    }
  }
});
