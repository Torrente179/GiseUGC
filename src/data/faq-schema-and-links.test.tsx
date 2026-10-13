import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { LocaleProvider } from '@/lib/locale-context';
import HubPage from '@/components/HubPage';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import VerticalLandingPage from '@/components/VerticalLandingPage';
import { getAllServiceIds, getServicePageContent } from './service-pages';
import { getAllVerticalIds, getVerticalPageContent } from './vertical-pages';
import { getHubPageContent } from './hub-pages';
import { buildServiceLandingRouteData, buildVerticalLandingRouteData } from './landing-route-data.server';
import { inlineCopyHrefs, visibleInlineCopy } from '@/lib/inline-copy-links';
import {
  getResourcePath,
  getServicePath,
  type SiteLocale,
  type VerticalPageId,
} from '@/lib/locale-path';

const root = resolve(process.cwd());
const read = (relative: string) => readFileSync(resolve(root, relative), 'utf8');

const visibleHtml = (html: string) =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, '')
    .replace(/&#x27;/giu, "'")
    .replace(/&amp;/giu, '&');

const decodeJsonLd = (raw: string) => raw.replace(/\\u003c/giu, '<');

const extractFaqPages = (html: string) => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/giu)];
  const pages: Array<Array<{ question: string; answer: string }>> = [];

  for (const block of blocks) {
    const data = JSON.parse(decodeJsonLd(block[1] ?? '')) as Record<string, unknown>;
    const graph = Array.isArray(data['@graph'])
      ? (data['@graph'] as Array<Record<string, unknown>>)
      : [data];
    for (const node of graph) {
      if (node['@type'] !== 'FAQPage') continue;
      const entities = (node.mainEntity as Array<Record<string, unknown>> | undefined) ?? [];
      pages.push(
        entities.map((entity) => ({
          question: String(entity.name ?? ''),
          answer: String((entity.acceptedAnswer as { text?: string } | undefined)?.text ?? ''),
        })),
      );
    }
  }

  return pages;
};

const countFaqPageTypes = (html: string) => (html.match(/"@type":"FAQPage"/gu) ?? []).length;

const renderService = (serviceId: ReturnType<typeof getAllServiceIds>[number], locale: SiteLocale) => {
  const page = getServicePageContent(serviceId, locale);
  const raw = renderToStaticMarkup(
    <StaticRouter location={page.path}>
      <LocaleProvider>
        <ServiceLandingPage
          serviceId={serviceId}
          locale={locale}
          routeData={buildServiceLandingRouteData(serviceId, locale)}
        />
      </LocaleProvider>
    </StaticRouter>,
  );
  return { raw, html: visibleHtml(raw), page };
};

const renderVertical = (verticalId: VerticalPageId, locale: SiteLocale) => {
  const page = getVerticalPageContent(verticalId, locale);
  const raw = renderToStaticMarkup(
    <StaticRouter location={page.path}>
      <LocaleProvider>
        <VerticalLandingPage
          verticalId={verticalId}
          locale={locale}
          routeData={buildVerticalLandingRouteData(verticalId, locale)}
        />
      </LocaleProvider>
    </StaticRouter>,
  );
  return { raw, html: visibleHtml(raw), page };
};

const renderHub = (hubId: 'services' | 'verticals', locale: SiteLocale) => {
  const page = getHubPageContent(hubId, locale);
  const raw = renderToStaticMarkup(
    <StaticRouter location={page.path}>
      <LocaleProvider>
        <HubPage hubId={hubId} locale={locale} />
      </LocaleProvider>
    </StaticRouter>,
  );
  return { raw, html: visibleHtml(raw), page };
};

const countTag = (html: string, tag: 'h1') => (html.match(new RegExp(`<${tag}\\b`, 'giu')) ?? []).length;

const extractJsonLdIds = (html: string): string[] => {
  const ids: string[] = [];
  for (const block of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/giu)) {
    const data = JSON.parse((block[1] ?? '').replace(/\\u003c/giu, '<')) as Record<string, unknown>;
    const graph = Array.isArray(data['@graph']) ? (data['@graph'] as Array<Record<string, unknown>>) : [data];
    for (const node of graph) {
      if (typeof node['@id'] === 'string') ids.push(node['@id']);
    }
  }
  return ids;
};

const MONEY_LINKS: Record<
  string,
  Array<{ href: string; anchor: string }>
> = {
  'beauty-ugc:es': [
    { href: getServicePath('bilingual-ugc-creator', 'es'), anchor: 'creadora UGC de belleza en español e inglés' },
    { href: getResourcePath('how-to-hire-ugc-creator', 'es'), anchor: 'cómo contratar una creadora UGC bilingüe' },
  ],
  'beauty-ugc:en': [
    { href: getServicePath('bilingual-ugc-creator', 'en'), anchor: 'bilingual beauty UGC creator' },
    { href: getResourcePath('how-to-hire-ugc-creator', 'en'), anchor: 'how to hire a bilingual UGC creator' },
  ],
  'fashion-ugc:es': [
    { href: getServicePath('bilingual-ugc-creator', 'es'), anchor: 'creadora UGC de moda en español e inglés' },
    { href: getResourcePath('how-to-hire-ugc-creator', 'es'), anchor: 'guía para contratar una creadora UGC' },
  ],
  'fashion-ugc:en': [
    { href: getServicePath('bilingual-ugc-creator', 'en'), anchor: 'bilingual fashion UGC creator' },
    { href: getResourcePath('how-to-hire-ugc-creator', 'en'), anchor: 'guide to hiring a UGC creator' },
  ],
  'tech-saas-ugc:es': [
    { href: getServicePath('bilingual-ugc-creator', 'es'), anchor: 'creadora UGC bilingüe para tech y SaaS' },
    { href: getResourcePath('how-to-hire-ugc-creator', 'es'), anchor: 'qué pedir al contratar una creadora UGC' },
  ],
  'tech-saas-ugc:en': [
    { href: getServicePath('bilingual-ugc-creator', 'en'), anchor: 'hire a bilingual SaaS UGC creator' },
    { href: getResourcePath('how-to-hire-ugc-creator', 'en'), anchor: 'what to ask before hiring a UGC creator' },
  ],
  'lifestyle-wellness-ugc:es': [
    { href: getServicePath('bilingual-ugc-creator', 'es'), anchor: 'contratar UGC de bienestar bilingüe' },
    { href: getResourcePath('how-to-hire-ugc-creator', 'es'), anchor: 'pasos para contratar una creadora UGC' },
  ],
  'lifestyle-wellness-ugc:en': [
    { href: getServicePath('bilingual-ugc-creator', 'en'), anchor: 'hire a bilingual wellness UGC creator' },
    { href: getResourcePath('how-to-hire-ugc-creator', 'en'), anchor: 'steps to hire a UGC creator' },
  ],
  'verticals:es': [
    { href: getServicePath('bilingual-ugc-creator', 'es'), anchor: 'contratar una creadora UGC bilingüe' },
    { href: getResourcePath('how-to-hire-ugc-creator', 'es'), anchor: 'cómo contratar una creadora UGC' },
  ],
  'verticals:en': [
    { href: getServicePath('bilingual-ugc-creator', 'en'), anchor: 'hire a bilingual UGC creator' },
    { href: getResourcePath('how-to-hire-ugc-creator', 'en'), anchor: 'how to hire a UGC creator' },
  ],
  'services:es': [
    { href: getResourcePath('how-to-hire-ugc-creator', 'es'), anchor: 'cómo contratar una creadora UGC bilingüe' },
  ],
  'services:en': [
    { href: getResourcePath('how-to-hire-ugc-creator', 'en'), anchor: 'how to hire a bilingual UGC creator' },
  ],
};

const LINKED_VERTICALS = ['beauty-ugc', 'fashion-ugc', 'tech-saas-ugc', 'lifestyle-wellness-ugc'] as const;

const expectExactAnchor = (html: string, href: string, anchor: string) => {
  expect(html).toContain(`href="${href}"`);
  expect(html).toContain(`>${anchor}</`);
};

const bootFileFor = (path: string) => `${path.replace(/^\//u, '')}index.html`;

describe('service and vertical pages emit one FAQPage that matches the visible FAQ', () => {
  it.each(getAllServiceIds().flatMap((id) => (['es', 'en'] as const).map((locale) => [id, locale] as const)))(
    '%s (%s) has exactly one FAQPage and schema Q/A equals visible Q/A',
    (serviceId, locale) => {
      const { raw, html, page } = renderService(serviceId, locale);
      expect(countFaqPageTypes(raw)).toBe(1);
      const faqPages = extractFaqPages(raw);
      expect(faqPages).toHaveLength(1);
      expect(faqPages[0]).toEqual(page.faqs);
      for (const faq of page.faqs) {
        expect(html).toContain(faq.question);
        expect(html).toContain(faq.answer);
      }
      expect(raw.toLowerCase()).not.toContain('giseugc');
    },
  );

  it.each(getAllVerticalIds().flatMap((id) => (['es', 'en'] as const).map((locale) => [id, locale] as const)))(
    '%s (%s) has exactly one FAQPage and schema Q/A equals visible Q/A',
    (verticalId, locale) => {
      const { raw, html, page } = renderVertical(verticalId, locale);
      expect(countFaqPageTypes(raw)).toBe(1);
      const faqPages = extractFaqPages(raw);
      expect(faqPages).toHaveLength(1);
      expect(faqPages[0]).toEqual(page.faqs);
      for (const faq of page.faqs) {
        expect(html).toContain(faq.question);
        expect(html).toContain(faq.answer);
      }
      expect(raw.toLowerCase()).not.toContain('giseugc');
    },
  );

  it('keeps tech-saas schema Q3/Q4 on the visible wording', () => {
    const es = renderVertical('tech-saas-ugc', 'es');
    const en = renderVertical('tech-saas-ugc', 'en');
    expect(es.page.faqs[2]?.question).toBe('¿Sirve para campañas de adquisición o solo para retención?');
    expect(es.page.faqs[3]?.question).toBe('¿Puedes hacer videos en inglés para mi audiencia estadounidense?');
    expect(en.page.faqs[2]?.question).toBe('Does this work for acquisition campaigns or only for retention?');
    expect(en.page.faqs[3]?.question).toBe('Can you produce videos in English for my US audience?');
    expect(extractFaqPages(es.raw)[0]?.[2]?.question).toBe(es.page.faqs[2]?.question);
    expect(extractFaqPages(es.raw)[0]?.[3]?.question).toBe(es.page.faqs[3]?.question);
    expect(extractFaqPages(en.raw)[0]?.[2]?.question).toBe(en.page.faqs[2]?.question);
    expect(extractFaqPages(en.raw)[0]?.[3]?.question).toBe(en.page.faqs[3]?.question);
  });

  it('restores Spanish vertical FAQ opening marks and accents in source', () => {
    for (const verticalId of getAllVerticalIds()) {
      const page = getVerticalPageContent(verticalId, 'es');
      for (const faq of page.faqs) {
        expect(faq.question.startsWith('¿')).toBe(true);
        expect(faq.question.endsWith('?')).toBe(true);
      }
    }
    const fashion = getVerticalPageContent('fashion-ugc', 'es');
    expect(fashion.faqs[3]?.question).toBe('¿Trabajas en inglés también?');
    const tech = getVerticalPageContent('tech-saas-ugc', 'es');
    expect(tech.faqs[2]?.question).toContain('campañas de adquisición');
    expect(tech.faqs[2]?.question).toContain('retención');
  });
});

describe('vertical pages ship exactly one H1', () => {
  it.each(getAllVerticalIds().flatMap((id) => (['es', 'en'] as const).map((locale) => [id, locale] as const)))(
    '%s (%s) keeps the desktop hero as the only H1 and demotes the mobile title',
    (verticalId, locale) => {
      const { html, page } = renderVertical(verticalId, locale);
      expect(countTag(html, 'h1')).toBe(1);
      expect(html).toContain(`<h1 class="st-hero-title">${page.heroTitle}</h1>`);
      expect(html).toContain(`<p class="stm-hero-title stm-hero-title--reveal">${page.heroTitle}</p>`);
      expect(html).not.toContain('<h1 class="stm-hero-title');
      expect(html.toLowerCase()).not.toContain('giseugc');
    },
  );
});

describe('PageSeo JSON-LD @ids are unique inside the route graph', () => {
  it.each(getAllVerticalIds().flatMap((id) => (['es', 'en'] as const).map((locale) => [id, locale] as const)))(
    '%s (%s) route schema has unique @ids',
    (verticalId, locale) => {
      const { raw } = renderVertical(verticalId, locale);
      const ids = extractJsonLdIds(raw);
      expect(ids.length).toBeGreaterThan(0);
      expect(new Set(ids).size).toBe(ids.length);
    },
  );

  it.each(getAllServiceIds().flatMap((id) => (['es', 'en'] as const).map((locale) => [id, locale] as const)))(
    '%s (%s) route schema has unique @ids',
    (serviceId, locale) => {
      const { raw } = renderService(serviceId, locale);
      const ids = extractJsonLdIds(raw);
      expect(ids.length).toBeGreaterThan(0);
      expect(new Set(ids).size).toBe(ids.length);
    },
  );

  it('boot-shell graphs reuse the same @ids as PageSeo, so collapsing them would drop fields', () => {
    const page = getVerticalPageContent('beauty-ugc', 'es');
    const { raw } = renderVertical('beauty-ugc', 'es');
    const routeIds = new Set(extractJsonLdIds(raw));
    const bootIds = extractJsonLdIds(read(bootFileFor(page.path)));
    const overlap = bootIds.filter((id) => routeIds.has(id));
    expect(bootIds.length).toBeGreaterThan(0);
    expect(overlap.sort()).toEqual([...new Set(bootIds)].sort());
    expect(routeIds.size).toBeGreaterThan(bootIds.length);
  });
});

describe('boot shells do not add a second FAQPage', () => {
  it.each(getAllServiceIds().flatMap((id) => (['es', 'en'] as const).map((locale) => [id, locale] as const)))(
    '%s (%s) boot shell has no FAQPage',
    (serviceId, locale) => {
      const page = getServicePageContent(serviceId, locale);
      const html = read(bootFileFor(page.path));
      expect(countFaqPageTypes(html)).toBe(0);
    },
  );

  it.each(getAllVerticalIds().flatMap((id) => (['es', 'en'] as const).map((locale) => [id, locale] as const)))(
    '%s (%s) boot shell has no FAQPage',
    (verticalId, locale) => {
      const page = getVerticalPageContent(verticalId, locale);
      const html = read(bootFileFor(page.path));
      expect(countFaqPageTypes(html)).toBe(0);
    },
  );
});

describe('money-page body links use the mapped anchors', () => {
  it.each(LINKED_VERTICALS.flatMap((id) => (['es', 'en'] as const).map((locale) => [id, locale] as const)))(
    '%s (%s) body copy links bilingüe and cómo-contratar with exact anchors',
    (verticalId, locale) => {
      const { html, page } = renderVertical(verticalId, locale);
      const expected = MONEY_LINKS[`${verticalId}:${locale}`];
      expect(expected).toBeTruthy();
      expect(inlineCopyHrefs(page.sectionIntroText)).toEqual(expected.map((link) => link.href));
      for (const link of expected) {
        expectExactAnchor(html, link.href, link.anchor);
        expect(visibleInlineCopy(page.sectionIntroText)).toContain(link.anchor);
      }
      expect(html.toLowerCase()).not.toContain('giseugc');
    },
  );

  it.each((['es', 'en'] as const).map((locale) => ['verticals', locale] as const))(
    'vertical hub (%s) links bilingüe and cómo-contratar with exact anchors',
    (_hubId, locale) => {
      const { html, page } = renderHub('verticals', locale);
      const expected = MONEY_LINKS[`verticals:${locale}`];
      expect(inlineCopyHrefs(page.lead)).toEqual(expected.map((link) => link.href));
      for (const link of expected) {
        expectExactAnchor(html, link.href, link.anchor);
        expect(visibleInlineCopy(page.lead)).toContain(link.anchor);
      }
    },
  );

  it.each((['es', 'en'] as const).map((locale) => ['services', locale] as const))(
    'services hub (%s) adds the cómo-contratar body link with the exact anchor',
    (_hubId, locale) => {
      const { html, page } = renderHub('services', locale);
      const expected = MONEY_LINKS[`services:${locale}`];
      expect(inlineCopyHrefs(page.lead)).toEqual(expected.map((link) => link.href));
      for (const link of expected) {
        expectExactAnchor(html, link.href, link.anchor);
        expect(visibleInlineCopy(page.lead)).toContain(link.anchor);
      }
    },
  );
});
