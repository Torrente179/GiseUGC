import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { LocaleProvider } from '@/lib/locale-context';
import HubPage from '@/components/HubPage';
import ResourcePage from '@/components/ResourcePage';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import VerticalLandingPage from '@/components/VerticalLandingPage';
import Index from '@/pages/Index';
import { HUB_LABELS } from '@/data/hub-labels';
import {
  buildResourceLandingRouteData,
  buildServiceLandingRouteData,
  buildVerticalLandingRouteData,
} from '@/data/landing-route-data.server';
import {
  PAGE_REGISTRY,
  SITE_LOCALES,
  getHomePath,
  getHubIdsInOrder,
  getHubPath,
  getResourceIdsInOrder,
  getResourcePath,
  getServiceIdsInOrder,
  getServicePath,
  getVerticalIdsInOrder,
  getVerticalPath,
  type HubPageId,
  type SiteLocale,
} from '@/lib/locale-path';

/*
 * The internal link map: Home › hub › page. Every service, industry and guide page
 * names its hub in the middle breadcrumb (visible trail and BreadcrumbList), every
 * page links to the three hubs from the page-end strip, and no internal href points
 * at a URL the page registry does not serve.
 */

const SITE_URL = 'https://www.giselasaldarriaga.com';
const root = resolve(process.cwd());
const read = (relative: string) => readFileSync(resolve(root, relative), 'utf8');

const REGISTERED_PATHS = new Set(PAGE_REGISTRY.flatMap((entry) => SITE_LOCALES.map((locale) => entry.paths[locale])));

const render = (path: string, element: ReactElement) =>
  renderToStaticMarkup(
    <StaticRouter location={path}>
      <LocaleProvider>{element}</LocaleProvider>
    </StaticRouter>,
  );

type ChildPage = { family: HubPageId; path: string; locale: SiteLocale; html: string };

const childPages: ChildPage[] = SITE_LOCALES.flatMap((locale) => [
  ...getServiceIdsInOrder().map((id) => {
    const path = getServicePath(id, locale);
    return {
      family: 'services' as const,
      path,
      locale,
      html: render(path, <ServiceLandingPage serviceId={id} locale={locale} routeData={buildServiceLandingRouteData(id, locale)} />),
    };
  }),
  ...getVerticalIdsInOrder().map((id) => {
    const path = getVerticalPath(id, locale);
    return {
      family: 'verticals' as const,
      path,
      locale,
      html: render(path, <VerticalLandingPage verticalId={id} locale={locale} routeData={buildVerticalLandingRouteData(id, locale)} />),
    };
  }),
  ...getResourceIdsInOrder().map((id) => {
    const path = getResourcePath(id, locale);
    return {
      family: 'resources' as const,
      path,
      locale,
      html: render(path, <ResourcePage resourceId={id} locale={locale} routeData={buildResourceLandingRouteData(id, locale)} />),
    };
  }),
]);

const hubPages = SITE_LOCALES.flatMap((locale) =>
  getHubIdsInOrder().map((hubId) => {
    const path = getHubPath(hubId, locale);
    return { hubId, path, locale, html: render(path, <HubPage hubId={hubId} locale={locale} />) };
  }),
);

const routeBreadcrumb = (html: string) => {
  const match = html.match(/<script type="application\/ld\+json" data-route-schema="">([\s\S]*?)<\/script>/u);
  if (!match?.[1]) throw new Error('Missing PageSeo JSON-LD');
  const data = JSON.parse(match[1].replace(/\\u003c/gu, '<')) as { '@graph': Array<Record<string, unknown>> };
  const list = data['@graph'].find((node) => node['@type'] === 'BreadcrumbList');
  return (list?.itemListElement ?? []) as Array<{ position: number; name: string; item: string }>;
};

const breadcrumbNavs = (html: string) =>
  [...html.matchAll(/<nav[^>]*aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/gu)].map((match) => match[1] ?? '');

const internalHrefs = (html: string) =>
  [...html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gu, '').matchAll(/<a\b[^>]*\bhref="(\/[^"]*)"/gu)].map(
    (match) => match[1] ?? '',
  );

describe('internal link map', () => {
  it('puts the family hub in the middle of every child page BreadcrumbList', () => {
    for (const page of childPages) {
      const items = routeBreadcrumb(page.html);
      expect(items.map((item) => item.item), page.path).toEqual([
        `${SITE_URL}${getHomePath(page.locale)}`,
        `${SITE_URL}${getHubPath(page.family, page.locale)}`,
        `${SITE_URL}${page.path}`,
      ]);
      expect(items[1]?.name, page.path).toBe(HUB_LABELS[page.family][page.locale]);
    }
  });

  it('links the visible breadcrumb hub item to the hub, not a homepage section', () => {
    for (const page of childPages) {
      const hubHref = `href="${getHubPath(page.family, page.locale)}"`;
      const navs = breadcrumbNavs(page.html);
      expect(navs.length, page.path).toBeGreaterThan(0);
      for (const nav of navs) {
        expect(nav, page.path).toContain(hubHref);
        expect(nav, page.path).not.toContain('#services');
      }
    }
  });

  it('gives hubs the site navbar, a breadcrumb and the page-end strip', () => {
    for (const hub of hubPages) {
      expect(hub.html, hub.path).toContain('site-nav');
      const [nav] = breadcrumbNavs(hub.html);
      expect(nav, hub.path).toContain(`href="${getHomePath(hub.locale)}"`);
      expect(nav, hub.path).toContain(HUB_LABELS[hub.hubId][hub.locale]);
      expect(hub.html, hub.path).toContain('page-end-strip');
    }
  });

  it('links every page to the three hubs of its locale from the page-end strip', () => {
    const home = SITE_LOCALES.map((locale) => ({
      path: getHomePath(locale),
      locale,
      html: render(getHomePath(locale), <Index locale={locale} />),
    }));
    for (const page of [...home, ...childPages, ...hubPages]) {
      const strip = page.html.match(/<footer[^>]*class="page-end-strip[\s\S]*?<\/footer>/u)?.[0] ?? '';
      expect(strip, page.path).not.toBe('');
      for (const hubId of getHubIdsInOrder()) {
        expect(strip, page.path).toContain(`href="${getHubPath(hubId, page.locale)}"`);
      }
    }
  });

  it('only links to registered pages, in the page locale', () => {
    for (const page of [...childPages, ...hubPages]) {
      for (const href of internalHrefs(page.html)) {
        const path = href.split('#')[0] ?? '';
        expect(REGISTERED_PATHS.has(path), `${page.path} → ${href}`).toBe(true);
      }
    }
  });

  it('keeps the committed service and vertical shells on the same trail', () => {
    for (const page of childPages.filter((item) => item.family !== 'resources')) {
      const shell = read(`${page.path.replace(/^\/|\/$/gu, '')}/index.html`);
      expect(shell, page.path).toContain(
        `{"@type":"ListItem","position":2,"name":"${HUB_LABELS[page.family][page.locale]}","item":"${SITE_URL}${getHubPath(page.family, page.locale)}"}`,
      );
    }
  });
});
