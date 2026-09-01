import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { LocaleProvider } from '@/lib/locale-context';
import HubPage from '@/components/HubPage';
import { CONTENT_DATES } from '@/data/content-dates';
import {
  getHubPageContent,
  RESOURCE_HUB_CHILD_ORDER,
  SERVICE_HUB_CHILD_ORDER,
  VERTICAL_HUB_CHILD_ORDER,
} from '@/data/hub-pages';
import { SITE_PROOF } from '@/data/site-proof';
import { FIVERR_PROFILE_URL } from '@/lib/contact-channels';
import { inlineCopyHrefs, visibleInlineCopy } from '@/lib/inline-copy-links';
import {
  getHubPageRouteEntries,
  getResourcePath,
  getServicePath,
  getVerticalPath,
  type HubPageId,
  type SiteLocale,
} from '@/lib/locale-path';

const root = resolve(process.cwd());
const read = (relative: string) => readFileSync(resolve(root, relative), 'utf8');

const HUB_ENTRYPOINTS = [
  { file: 'servicios/index.html', locale: 'es' as SiteLocale, hubId: 'services' as const },
  { file: 'en/services/index.html', locale: 'en' as SiteLocale, hubId: 'services' as const },
  { file: 'verticales/index.html', locale: 'es' as SiteLocale, hubId: 'verticals' as const },
  { file: 'en/verticals/index.html', locale: 'en' as SiteLocale, hubId: 'verticals' as const },
  { file: 'recursos/index.html', locale: 'es' as SiteLocale, hubId: 'resources' as const },
  { file: 'en/resources/index.html', locale: 'en' as SiteLocale, hubId: 'resources' as const },
] as const;

const visibleHtml = (html: string) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, '');

const renderHub = (path: string, hubId: HubPageId, locale: SiteLocale) =>
  renderToStaticMarkup(
    <StaticRouter location={path}>
      <LocaleProvider>
        <HubPage hubId={hubId} locale={locale} />
      </LocaleProvider>
    </StaticRouter>,
  );

describe('hire-intent hub copy', () => {
  it('uses only existing child routes, in the drafted order', () => {
    for (const locale of ['es', 'en'] as SiteLocale[]) {
      expect(getHubPageContent('services', locale).children.map((child) => child.href)).toEqual(
        SERVICE_HUB_CHILD_ORDER.map((id) => getServicePath(id, locale)),
      );
      expect(getHubPageContent('verticals', locale).children.map((child) => child.href)).toEqual(
        VERTICAL_HUB_CHILD_ORDER.map((id) => getVerticalPath(id, locale)),
      );
      expect(getHubPageContent('resources', locale).children.map((child) => child.href)).toEqual(
        RESOURCE_HUB_CHILD_ORDER.map((id) => getResourcePath(id, locale)),
      );
    }
  });

  it('keeps the Fiverr proof line on the services hub only, with a query-free profile URL', () => {
    const es = getHubPageContent('services', 'es');
    const en = getHubPageContent('services', 'en');
    expect(visibleInlineCopy(es.proof ?? '')).toContain(`${SITE_PROOF.brandCampaigns}+`);
    expect(visibleInlineCopy(es.proof ?? '')).toContain(`${SITE_PROOF.fiverrRating}/5`);
    expect(visibleInlineCopy(es.proof ?? '')).toContain(String(SITE_PROOF.fiverrReviewCount));
    expect(inlineCopyHrefs(es.proof ?? '')).toEqual([FIVERR_PROFILE_URL]);
    expect(inlineCopyHrefs(en.proof ?? '')).toEqual([FIVERR_PROFILE_URL]);
    expect(getHubPageContent('verticals', 'es').proof).toBeUndefined();
    expect(getHubPageContent('verticals', 'en').proof).toBeUndefined();
    expect(getHubPageContent('resources', 'es').proof).toBeUndefined();
    expect(getHubPageContent('resources', 'en').proof).toBeUndefined();
  });

  it('SSR markup includes the real H1, title copy, child lists, and contact CTAs', () => {
    for (const entry of getHubPageRouteEntries()) {
      const page = getHubPageContent(entry.hubId, entry.locale);
      const html = visibleHtml(renderHub(entry.path, entry.hubId, entry.locale));
      expect(html).toContain(`<h1`);
      expect(html).toContain(page.heroTitle);
      expect(html).toContain(page.lead);
      expect(html).toContain(page.primaryCtaHref);
      expect(html).toContain(page.primaryCtaLabel);
      for (const child of page.children) {
        expect(html).toContain(child.href);
        expect(html).toContain(child.title);
        expect(child.blurb).toBeTruthy();
        expect(html).toContain(child.blurb!);
      }
      for (const link of page.secondaryLinks) {
        expect(html).toContain(link.href);
        expect(html).toContain(link.label);
      }
      expect(JSON.stringify(html)).not.toMatch(/GiseUGC/iu);
    }
  });

  it('does not copy the resource meta into the resource hub lead', () => {
    for (const locale of ['es', 'en'] as SiteLocale[]) {
      const page = getHubPageContent('resources', locale);
      expect(page.lead).not.toBe(page.metaDescription);
      expect(page.lead).toMatch(/cuatro guías|four guides/u);
    }
  });

  it('puts 4.8/173 only on /servicios/ and /en/services/', () => {
    for (const entry of getHubPageRouteEntries()) {
      const html = visibleHtml(renderHub(entry.path, entry.hubId, entry.locale));
      if (entry.hubId === 'services') {
        expect(html).toContain('4.8/5');
        expect(html).toContain('173');
        expect(html).toContain(`href="${FIVERR_PROFILE_URL}"`);
        expect(html).toContain('>gisela_sm</a>');
        expect(html).not.toContain('fiverr.com/gisela_sm?');
      } else {
        expect(html).not.toContain('4.8');
        expect(html).not.toContain(FIVERR_PROFILE_URL);
      }
    }
  });

  it('WebPage schema name is the hire-intent title, not the bare entity name', () => {
    for (const entry of getHubPageRouteEntries()) {
      const page = getHubPageContent(entry.hubId, entry.locale);
      const html = renderHub(entry.path, entry.hubId, entry.locale);
      const match = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/u);
      expect(match?.[1]).toBeTruthy();
      const graph = JSON.parse(match![1]) as { '@graph': Array<Record<string, unknown>> };
      const webpage = graph['@graph'].find((node) => node['@type'] === 'WebPage');
      expect(webpage?.name).toBe(page.metaTitle);
      expect(webpage?.description).toBe(page.metaDescription);
      expect(webpage?.dateModified).toBe(CONTENT_DATES.hubs);
      expect(webpage?.name).not.toBe('Gisela Saldarriaga');
      const rating = graph['@graph'].find((node) => {
        const typed = node['@type'];
        return typed === 'ProfessionalService' || typed === 'Service';
      });
      if (entry.hubId === 'services') {
        expect(rating?.aggregateRating).toEqual({
          '@type': 'AggregateRating',
          ratingValue: String(SITE_PROOF.fiverrRating),
          reviewCount: String(SITE_PROOF.fiverrReviewCount),
          bestRating: '5',
          worstRating: '1',
        });
      } else {
        expect(rating).toBeUndefined();
        expect(JSON.stringify(graph)).not.toContain('AggregateRating');
      }
    }
  });

  it('committed hub shells already carry the new title and H1 for non-JS crawlers', () => {
    for (const hub of HUB_ENTRYPOINTS) {
      const page = getHubPageContent(hub.hubId, hub.locale);
      const html = read(hub.file);
      expect(html).toContain(`<title>${page.metaTitle}</title>`);
      expect(html).toContain(`content="${page.metaDescription}"`);
      expect(html).toContain(`<h1>${page.heroTitle}</h1>`);
      expect(html).toContain(page.lead);
      expect(html).toContain('/src/entry-hub.tsx');
      expect(html).toContain(`"name":"${page.metaTitle}"`);
      expect(html).toContain(`"dateModified":"${CONTENT_DATES.hubs}"`);
      expect(html).not.toMatch(/<title>Gisela Saldarriaga<\/title>/u);
      for (const child of page.children) {
        expect(html).toContain(`href="${child.href}"`);
        expect(html).toContain(child.title);
        expect(child.blurb).toBeTruthy();
        expect(html).toContain(child.blurb!);
      }
      if (hub.hubId === 'services') {
        expect(html).toContain('4.8/5');
        expect(html).toContain(`href="${FIVERR_PROFILE_URL}"`);
      } else {
        expect(html).not.toContain('4.8');
        expect(html).not.toContain(FIVERR_PROFILE_URL);
      }
    }
  });
});
