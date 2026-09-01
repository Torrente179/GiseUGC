import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { LocaleProvider } from '@/lib/locale-context';
import ManifestoChapter from '@/components/chapters/ManifestoChapter';
import { CONTENT_DATES, LLMS_LAST_UPDATED } from '@/data/content-dates';
import { getHubChildLinks } from '@/data/hub-child-links';
import HubPage from '@/components/HubPage';
import { getServicePageContent } from '@/data/service-pages';
import { getVerticalPageContent } from '@/data/vertical-pages';
import { getResourcePageContent } from '@/data/resource-pages';
import {
  getHubPageRouteEntries,
  getResourceIdsInOrder,
  getServiceIdsInOrder,
  getVerticalIdsInOrder,
  type SiteLocale,
} from '@/lib/locale-path';
import {
  FIVERR_RATING_DISTRIBUTION,
  SITE_PROOF,
} from '@/data/site-proof';

const root = resolve(process.cwd());
const read = (relative: string) => readFileSync(resolve(root, relative), 'utf8');

const extractJsonLd = (html: string) => {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/u);
  if (!match?.[1]) throw new Error('Missing JSON-LD script');
  return JSON.parse(match[1]) as { '@graph': Array<Record<string, unknown>> };
};

const renderManifesto = (path: string) =>
  renderToStaticMarkup(
    <StaticRouter location={path}>
      <LocaleProvider>
        <ManifestoChapter />
      </LocaleProvider>
    </StaticRouter>,
  );

describe('site proof figures stay internally consistent', () => {
  it('Fiverr star buckets add up to the advertised review count', () => {
    const total = FIVERR_RATING_DISTRIBUTION.reduce((sum, row) => sum + row.count, 0);
    expect(total).toBe(SITE_PROOF.fiverrReviewCount);
  });
});

describe('homepage prerender emits real proof, not zeros', () => {
  it('Spanish manifesto HTML includes 28+, 173, 4.8 and ES+EN', () => {
    const html = renderManifesto('/');
    expect(html).toContain('28+');
    expect(html).toContain('173');
    expect(html).toContain('4.8');
    expect(html).toContain('ES+EN');
    expect(html).not.toMatch(/>0\+<|>0%<|>0M\+/u);
    expect(html).toContain('Marcas');
    expect(html).toContain('Reseñas en Fiverr');
  });

  it('English manifesto HTML uses the same numerals', () => {
    const html = renderManifesto('/en/');
    expect(html).toContain('28+');
    expect(html).toContain('173');
    expect(html).toContain('4.8');
    expect(html).toContain('Fiverr reviews');
  });
});

describe('homepage schema matches visible Fiverr proof', () => {
  it.each(['index.html', 'en/index.html'])('%s has AggregateRating 4.8/173 and no invented reviews', (file) => {
    const graph = extractJsonLd(read(file));
    const business = graph['@graph'].find((node) => node['@type'] === 'ProfessionalService');
    expect(business).toBeTruthy();
    expect(business?.review).toBeUndefined();
    expect(JSON.stringify(business)).not.toContain('reviewBody');
    expect(business?.aggregateRating).toMatchObject({
      '@type': 'AggregateRating',
      ratingValue: String(SITE_PROOF.fiverrRating),
      reviewCount: String(SITE_PROOF.fiverrReviewCount),
      bestRating: '5',
      worstRating: '1',
    });
    const webpage = graph['@graph'].find((node) => node['@type'] === 'WebPage');
    expect(webpage?.dateModified).toBe(CONTENT_DATES.home);
  });

  it('does not hide a second copy of the page in .boot-seo', () => {
    expect(read('index.html')).not.toContain('boot-seo');
    expect(read('en/index.html')).not.toContain('boot-seo');
  });
});

describe('sitemap lastmod and llms dates are honest', () => {
  it('maps each sitemap URL family to CONTENT_DATES', () => {
    const xml = read('public/sitemap.xml');
    const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gu)];
    expect(blocks.length).toBeGreaterThan(10);

    const lastmodFor = (loc: string) => {
      const normalized = loc.replace(/\/$/u, '');
      if (normalized === 'https://www.giselasaldarriaga.com' || normalized === 'https://www.giselasaldarriaga.com/en') {
        return CONTENT_DATES.home;
      }
      const hubUrls = new Set([
        'https://www.giselasaldarriaga.com/servicios/',
        'https://www.giselasaldarriaga.com/en/services/',
        'https://www.giselasaldarriaga.com/verticales/',
        'https://www.giselasaldarriaga.com/en/verticals/',
        'https://www.giselasaldarriaga.com/recursos/',
        'https://www.giselasaldarriaga.com/en/resources/',
      ]);
      if (hubUrls.has(loc)) return CONTENT_DATES.hubs;
      if (loc.includes('/servicios/') || loc.includes('/services/')) return CONTENT_DATES.services;
      if (loc.includes('/verticales/') || loc.includes('/verticals/')) return CONTENT_DATES.verticals;
      if (loc.includes('/recursos/') || loc.includes('/resources/')) return CONTENT_DATES.resources;
      return CONTENT_DATES.legal;
    };

    for (const block of blocks) {
      const loc = block[1].match(/<loc>([^<]+)<\/loc>/u)?.[1];
      const lastmod = block[1].match(/<lastmod>([^<]+)<\/lastmod>/u)?.[1];
      expect(loc).toBeTruthy();
      expect(lastmod).toBe(lastmodFor(loc!));
    }
  });

  it('keeps llms Last-Updated in lockstep with the homepage date', () => {
    for (const file of ['public/llms.txt', 'public/llms-full.txt']) {
      const text = read(file);
      expect(text).toContain(`Last-Updated: ${LLMS_LAST_UPDATED}`);
      expect(text).toContain(`${SITE_PROOF.brandCampaigns}+ active brand campaigns`);
      expect(text).toContain(`${SITE_PROOF.fiverrReviewCount} reviews on Fiverr`);
      expect(text).toContain(`${SITE_PROOF.fiverrRating}/5`);
      expect(text).not.toMatch(/50\+ active brand/u);
    }
  });
});

describe('IndexNow ping list includes resource URLs', () => {
  it('lists every resource path and has a committed key file', () => {
    const script = read('scripts/indexnow-ping.sh');
    expect(script).toContain('/recursos/que-es-ugc/');
    expect(script).toContain('/en/resources/what-is-ugc/');
    expect(script).toContain('/recursos/formatos-ugc-ads/');
    expect(script).toContain('llms-full.txt');
    expect(read('public/bc6e18cf87bf49fcc1ad22e759c161ac.txt').trim()).toBe(
      'bc6e18cf87bf49fcc1ad22e759c161ac',
    );
  });

  it('lists the six hub index URLs as their own entries', () => {
    const script = read('scripts/indexnow-ping.sh');
    for (const path of [
      '/servicios/',
      '/en/services/',
      '/verticales/',
      '/en/verticals/',
      '/recursos/',
      '/en/resources/',
    ]) {
      expect(script).toContain(`\n  "$SITE${path}"\n`);
    }
  });
});

describe('Fiverr URLs stay on the canonical profile', () => {
  it('does not append source=gig_page anywhere in crawl-facing files', () => {
    const files = [
      'src/lib/contact-channels.ts',
      'src/components/Navbar.tsx',
      'src/components/Footer.tsx',
      'src/components/FloatingContactDock.tsx',
      'index.html',
      'en/index.html',
      'servicios/index.html',
      'en/services/index.html',
      'public/llms.txt',
      'public/llms-full.txt',
    ];
    for (const file of files) {
      expect(read(file), file).not.toContain('source=gig_page');
      expect(read(file), file).not.toContain('fiverr.com/gisela_sm?');
    }
  });
});

describe('Person schema carries the studio mark as alternateName', () => {
  it.each(['index.html', 'en/index.html'])('%s Person has Gisela.UGC and Organization does not', (file) => {
    const graph = extractJsonLd(read(file));
    const person = graph['@graph'].find((node) => node['@type'] === 'Person');
    const business = graph['@graph'].find((node) => node['@type'] === 'ProfessionalService');
    expect(person?.alternateName).toBe('Gisela.UGC');
    expect(business?.alternateName).toBeUndefined();
    expect(JSON.stringify(person?.sameAs)).toContain('https://www.fiverr.com/gisela_sm');
    expect(JSON.stringify(person?.sameAs)).not.toContain('source=gig_page');
  });
});

const HUB_ENTRYPOINTS = [
  { file: 'servicios/index.html', locale: 'es' as SiteLocale, hubId: 'services' as const, contact: '/#contact' },
  { file: 'en/services/index.html', locale: 'en' as SiteLocale, hubId: 'services' as const, contact: '/en/#contact' },
  { file: 'verticales/index.html', locale: 'es' as SiteLocale, hubId: 'verticals' as const, contact: '/#contact' },
  { file: 'en/verticals/index.html', locale: 'en' as SiteLocale, hubId: 'verticals' as const, contact: '/en/#contact' },
  { file: 'recursos/index.html', locale: 'es' as SiteLocale, hubId: 'resources' as const, contact: '/#contact' },
  { file: 'en/resources/index.html', locale: 'en' as SiteLocale, hubId: 'resources' as const, contact: '/en/#contact' },
] as const;

const renderHub = (path: string, hubId: (typeof HUB_ENTRYPOINTS)[number]['hubId'], locale: SiteLocale) =>
  renderToStaticMarkup(
    <StaticRouter location={path}>
      <LocaleProvider>
        <HubPage hubId={hubId} locale={locale} />
      </LocaleProvider>
    </StaticRouter>,
  );

describe('hub index routes stay registered 200 documents with hire-intent copy', () => {
  it('sitemap lists both locales for each hub before that family\'s children', () => {
    const xml = read('public/sitemap.xml');
    expect(xml.indexOf('/servicios/</loc>')).toBeGreaterThan(-1);
    expect(xml.indexOf('/en/services/</loc>')).toBeGreaterThan(-1);
    expect(xml.indexOf('/servicios/</loc>')).toBeLessThan(xml.indexOf('/servicios/creadora-ugc-bilingue/'));
    expect(xml.indexOf('/verticales/</loc>')).toBeLessThan(xml.indexOf('/verticales/ugc-beauty/'));
    expect(xml.indexOf('/recursos/</loc>')).toBeLessThan(xml.indexOf('/recursos/que-es-ugc/'));
  });

  it('static shells hydrate via entry-hub, pair hreflang, and keep contact CTAs', () => {
    for (const hub of HUB_ENTRYPOINTS) {
      const html = read(hub.file);
      expect(html).toContain('/src/entry-hub.tsx');
      expect(html).not.toContain('entry-service');
      expect(html).not.toContain('entry-vertical');
      expect(html).not.toContain('entry-resource');
      expect(html).toContain('hreflang="es"');
      expect(html).toContain('hreflang="en"');
      expect(html).toMatch(/hreflang="x-default"/u);
      expect(html).toContain(hub.contact);
      expect(html.toLowerCase()).toContain('<h1');
      expect(html).not.toContain('AggregateRating');
      expect(html).not.toContain('FiverrRating');
      expect(html).not.toContain('reviewBody');

      const children = getHubChildLinks(hub.hubId, hub.locale);
      for (const child of children) {
        expect(html).toContain(`href="${child.href}"`);
        expect(html).toContain(child.label);
      }
    }
  });

  it('x-default on every hub shell is the Spanish hub URL', () => {
    const expected = {
      'servicios/index.html': 'https://www.giselasaldarriaga.com/servicios/',
      'en/services/index.html': 'https://www.giselasaldarriaga.com/servicios/',
      'verticales/index.html': 'https://www.giselasaldarriaga.com/verticales/',
      'en/verticals/index.html': 'https://www.giselasaldarriaga.com/verticales/',
      'recursos/index.html': 'https://www.giselasaldarriaga.com/recursos/',
      'en/resources/index.html': 'https://www.giselasaldarriaga.com/recursos/',
    } as const;

    for (const [file, url] of Object.entries(expected)) {
      expect(read(file)).toContain(`href="${url}" hreflang="x-default"`);
    }
  });

  it('React hub shells emit the same child links and contact CTAs', () => {
    for (const entry of getHubPageRouteEntries()) {
      const html = renderHub(entry.path, entry.hubId, entry.locale);
      const children = getHubChildLinks(entry.hubId, entry.locale);
      for (const child of children) {
        expect(html).toContain(child.href);
        expect(html).toContain(child.label);
      }
      expect(html).toContain(entry.locale === 'es' ? '/#contact' : '/en/#contact');
      expect(html.toLowerCase()).toContain('<h1');
      expect(html).not.toContain('reviewBody');
    }
  });

  it('every existing money page is linked from its hub and hubs invent no extra URLs', () => {
    for (const locale of ['es', 'en'] as SiteLocale[]) {
      const serviceHrefs = new Set(getHubChildLinks('services', locale).map((item) => item.href));
      const verticalHrefs = new Set(getHubChildLinks('verticals', locale).map((item) => item.href));
      const resourceHrefs = new Set(getHubChildLinks('resources', locale).map((item) => item.href));
      for (const id of getServiceIdsInOrder()) {
        expect(serviceHrefs.has(getServicePageContent(id, locale).path)).toBe(true);
      }
      for (const id of getVerticalIdsInOrder()) {
        expect(verticalHrefs.has(getVerticalPageContent(id, locale).path)).toBe(true);
      }
      for (const id of getResourceIdsInOrder()) {
        expect(resourceHrefs.has(getResourcePageContent(id, locale).path)).toBe(true);
      }
      expect(serviceHrefs.size).toBe(getServiceIdsInOrder().length);
      expect(verticalHrefs.size).toBe(getVerticalIdsInOrder().length);
      expect(resourceHrefs.size).toBe(getResourceIdsInOrder().length);
    }
  });

  it('does not hardcode a March 2026 last-updated on money-page templates', () => {
    expect(read('src/components/ServiceLandingPage.tsx')).not.toContain('24 mar 2026');
    expect(read('src/components/ServiceLandingPage.tsx')).not.toContain('Mar 24, 2026');
    expect(read('src/components/VerticalLandingPage.tsx')).not.toContain('24 mar 2026');
    expect(read('src/components/ResourcePage.tsx')).not.toContain('29 jul 2026');
    expect(read('src/components/ServiceLandingPage.tsx')).toContain('formatLastUpdatedLabel(CONTENT_DATES.services');
    expect(read('src/components/VerticalLandingPage.tsx')).toContain('formatLastUpdatedLabel(CONTENT_DATES.verticals');
    expect(read('src/components/ResourcePage.tsx')).toContain('formatLastUpdatedLabel(CONTENT_DATES.resources');
    expect(read('recursos/como-contratar-creadora-ugc/index.html')).not.toContain('24 mar 2026');
    expect(read('recursos/como-contratar-creadora-ugc/index.html')).toContain('31 ago 2026');
    expect(read('en/resources/how-to-hire-ugc-creator/index.html')).not.toContain('Mar 24, 2026');
    expect(read('en/resources/how-to-hire-ugc-creator/index.html')).toContain('Aug 31, 2026');
  });

  it('does not retarget bilingüe or cómo-contratar breadcrumbs onto hub indexes', () => {
    expect(read('src/components/ServiceLandingPage.tsx')).toContain("getHomeSectionHref(locale, 'services')");
    expect(read('src/components/ServiceLandingPage.tsx')).not.toContain('getHubPath');
    expect(read('src/components/ResourcePage.tsx')).not.toContain('getHubPath');
    expect(read('recursos/como-contratar-creadora-ugc/index.html')).not.toContain('href="/recursos/"');
    expect(read('servicios/creadora-ugc-bilingue/index.html')).not.toContain('href="/servicios/"');
  });
});

