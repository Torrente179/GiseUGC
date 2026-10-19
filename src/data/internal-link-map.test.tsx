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
import Index from '@/pages/Index';
import { HUB_LABELS } from '@/data/hub-labels';
import {
  buildResourceLandingRouteData,
  buildServiceLandingRouteData,
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
  type HubPageId,
  type SiteLocale,
} from '@/lib/locale-path';

/*
 * The internal link map: Home › hub › page. Every service and guide page
 * names its hub in the middle breadcrumb (visible trail and BreadcrumbList), every
 * page links to the hubs from the page-end strip, and no internal href points
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

  it('links every page to the hubs of its locale from the page-end strip', () => {
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

  it('opens the service close index with More services, then the Also offered tiles', () => {
    for (const page of childPages.filter((item) => item.family === 'services')) {
      const index = page.html.match(/<nav class="knc-index"[\s\S]*?<\/nav>/u)?.[0] ?? '';
      const labels = [...index.matchAll(/<p class="knc-label"><b>(\d\d)<\/b>([^<]+)<\/p>/gu)].map(
        (match) => `${match[1]} ${match[2]}`,
      );
      const more = page.locale === 'es' ? 'Más servicios' : 'More services';
      const also = page.locale === 'es' ? 'También ofrezco' : 'Also offered';
      expect(labels.slice(0, 2), page.path).toEqual([`01 ${more}`, `02 ${also}`]);
    }
  });

  it('301s every removed industry URL to a page that still exists', () => {
    // The five industry pages and their hub were removed on 2026-10-16.
    const removed = [
      '/verticales/', '/en/verticals/',
      '/verticales/ugc-beauty/', '/en/verticals/beauty-ugc-creator/',
      '/verticales/ugc-moda/', '/en/verticals/fashion-ugc-creator/',
      '/verticales/ugc-tech-saas/', '/en/verticals/tech-saas-ugc-creator/',
      '/verticales/ugc-ecommerce/', '/en/verticals/ecommerce-ugc-creator/',
      '/verticales/ugc-lifestyle-bienestar/', '/en/verticals/lifestyle-wellness-ugc-creator/',
    ];
    const redirects = (JSON.parse(read('vercel.json')) as { redirects: Array<{ source: string; destination: string; statusCode?: number }> }).redirects;
    const lastSpecificIndex = Math.max(
      ...removed.flatMap((path) => [path, path.replace(/\/$/u, '')]).map((source) => redirects.findIndex((item) => item.source === source)),
    );
    for (const path of removed) {
      expect(REGISTERED_PATHS.has(path), path).toBe(false);
      for (const source of [path, path.replace(/\/$/u, '')]) {
        const rule = redirects.find((item) => item.source === source);
        expect(rule?.statusCode, source).toBe(301);
        expect(REGISTERED_PATHS.has(rule?.destination ?? ''), `${source} → ${rule?.destination}`).toBe(true);
        expect(rule?.destination.startsWith('/en/'), source).toBe(source.startsWith('/en/'));
      }
    }

    const catchAlls = [
      { source: '/verticales/:path*', destination: '/servicios/' },
      { source: '/verticales/:path*/', destination: '/servicios/' },
      { source: '/en/verticals/:path*', destination: '/en/services/' },
      { source: '/en/verticals/:path*/', destination: '/en/services/' },
    ];
    for (const { source, destination } of catchAlls) {
      const index = redirects.findIndex((item) => item.source === source);
      expect(index, source).toBeGreaterThan(lastSpecificIndex);
      expect(redirects[index]?.statusCode, source).toBe(301);
      expect(redirects[index]?.destination, source).toBe(destination);
    }

    const matchRedirect = (pathname: string) => {
      const toRegex = (source: string) => {
        const withSplat = source.replace(/:path\*/g, '\0SPLAT\0');
        const escaped = withSplat.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`^${escaped.replace(/\0SPLAT\0/g, '[^/]+(?:/[^/]+)*')}$`);
      };
      return redirects.find((item) => toRegex(item.source).test(pathname));
    };

    const unknownChildren = [
      { path: '/verticales/foo', destination: '/servicios/' },
      { path: '/verticales/foo/', destination: '/servicios/' },
      { path: '/verticales/ugc-beauty/extra/', destination: '/servicios/' },
      { path: '/en/verticals/foo', destination: '/en/services/' },
      { path: '/en/verticals/foo/', destination: '/en/services/' },
      { path: '/en/verticals/tech-saas-ugc-creator/extra/', destination: '/en/services/' },
    ];
    for (const { path, destination } of unknownChildren) {
      const rule = matchRedirect(path);
      expect(rule?.statusCode, path).toBe(301);
      expect(rule?.destination, path).toBe(destination);
    }

    expect(matchRedirect('/verticales/ugc-beauty/')?.destination).toBe('/servicios/testimoniales-resenas-ugc/');
    expect(matchRedirect('/en/verticals/tech-saas-ugc-creator/')?.destination).toBe('/en/services/ugc-product-demo/');
  });

  it('keeps the committed service shells on the same trail', () => {
    for (const page of childPages.filter((item) => item.family === 'services')) {
      const shell = read(`${page.path.replace(/^\/|\/$/gu, '')}/index.html`);
      expect(shell, page.path).toContain(
        `{"@type":"ListItem","position":2,"name":"${HUB_LABELS[page.family][page.locale]}","item":"${SITE_URL}${getHubPath(page.family, page.locale)}"}`,
      );
    }
  });
});
