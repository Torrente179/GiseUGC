import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { LocaleProvider } from '@/lib/locale-context';
import ResourcePage from '@/components/ResourcePage';
import HubPage from '@/components/HubPage';
import PageEndStrip from '@/components/PageEndStrip';
import { buildResourceLandingRouteData } from '@/data/landing-route-data.server';
import {
  FIVERR_PRICING,
  FIVERR_PRICING_GIG_URLS,
  HIRE_BUDGET_FAQ,
  PRICING_GUIDE_HUB,
  getResourcePageContent,
} from '@/data/resource-pages';
import { getHubPageContent } from '@/data/hub-pages';
import { buildSitemapXml } from '@/lib/sitemap';
import { visibleInlineCopy } from '@/lib/inline-copy-links';
import { getResourcePath, type SiteLocale } from '@/lib/locale-path';

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

const renderPricing = (locale: SiteLocale) => {
  const page = getResourcePageContent('how-much-ugc-creator-charge', locale);
  const raw = renderToStaticMarkup(
    <StaticRouter location={page.path}>
      <LocaleProvider>
        <ResourcePage
          resourceId="how-much-ugc-creator-charge"
          locale={locale}
          routeData={buildResourceLandingRouteData('how-much-ugc-creator-charge', locale)}
        />
      </LocaleProvider>
    </StaticRouter>,
  );
  return { raw, html: visibleHtml(raw), page };
};

describe('FIVERR_PRICING is the only price source', () => {
  it('locks the verification date, package prices, and query-free gig URLs', () => {
    expect(FIVERR_PRICING.verifiedOn).toBe('2026-10-14');
    expect(FIVERR_PRICING.ugc.basic.price).toBe(40);
    expect(FIVERR_PRICING.ugc.standard.price).toBe(70);
    expect(FIVERR_PRICING.ugc.premium.price).toBe(120);
    expect(FIVERR_PRICING.ugc.rushMin).toBe(15);
    expect(FIVERR_PRICING.ugc.rushMax).toBe(20);
    expect(FIVERR_PRICING.spokesperson.words65.price).toBe(25);
    expect(FIVERR_PRICING.spokesperson.words130.price).toBe(40);
    expect(FIVERR_PRICING.spokesperson.words260.price).toBe(75);
    expect(FIVERR_PRICING.voiceover.price).toBe(20);
    expect(FIVERR_PRICING_GIG_URLS).toEqual([
      'https://www.fiverr.com/gisela_sm/create-spanish-ugc-videos',
      'https://www.fiverr.com/gisela_sm/spanish-video-spokesperson-on-green-and-white-backgrounds',
      'https://www.fiverr.com/gisela_sm/periodista-y-presentadora-de-tv-transforma-tus-ideas-en-narrativas-poderosas',
      'https://www.fiverr.com/gisela_sm/deliver-a-professional-female-voice-over-in-latin-spanish',
    ]);
    for (const url of FIVERR_PRICING_GIG_URLS) {
      expect(url).not.toContain('?');
      expect(url).not.toContain('source=');
    }
  });

  it('feeds meta, hub cards, hire FAQ, and pricing FAQ from the same $40', () => {
    const es = getResourcePageContent('how-much-ugc-creator-charge', 'es');
    const en = getResourcePageContent('how-much-ugc-creator-charge', 'en');
    expect(es.metaDescription).toContain(`$${FIVERR_PRICING.ugc.basic.price}`);
    expect(en.metaDescription).toContain(`$${FIVERR_PRICING.ugc.basic.price}`);
    expect(es.metaTitle).toBe('Cuánto cobra una creadora UGC | Gisela Saldarriaga');
    expect(en.metaTitle).toBe('How much does a UGC creator charge? | Gisela Saldarriaga');
    expect(PRICING_GUIDE_HUB.es.blurb).toContain(`$${FIVERR_PRICING.ugc.basic.price}`);
    expect(PRICING_GUIDE_HUB.en.blurb).toContain(`$${FIVERR_PRICING.ugc.basic.price}`);
    expect(HIRE_BUDGET_FAQ.es.answer).toContain(`$${FIVERR_PRICING.ugc.basic.price}`);
    expect(HIRE_BUDGET_FAQ.en.answer).toContain(`$${FIVERR_PRICING.ugc.basic.price}`);
    expect(es.faqs[0]?.answer).toContain(`$${FIVERR_PRICING.ugc.basic.price}`);
    expect(en.faqs[0]?.answer).toContain(`$${FIVERR_PRICING.ugc.basic.price}`);
  });
});

describe('pricing resource pages', () => {
  it.each(['es', 'en'] as const)(
    '%s has one H1, one FAQPage matching the visible answers, and no Offer markup',
    (locale) => {
      const { raw, html, page } = renderPricing(locale);
      expect((html.match(/<h1\b/gu) ?? []).length).toBe(1);
      expect(html).toContain(page.heroTitle);
      expect((raw.match(/"@type":"FAQPage"/gu) ?? []).length).toBe(1);
      const faqPages = extractFaqPages(raw);
      expect(faqPages).toHaveLength(1);
      expect(faqPages[0]).toEqual(
        page.faqs.map((faq) => ({
          question: faq.question,
          answer: visibleInlineCopy(faq.answer),
        })),
      );
      for (const faq of page.faqs) {
        expect(html).toContain(faq.question);
        expect(html).toContain(visibleInlineCopy(faq.answer));
      }
      expect(raw).not.toContain('"@type":"Offer"');
      expect(raw).not.toContain('"@type":"Product"');
      expect(raw).not.toContain('PriceSpecification');
      expect(raw.toLowerCase()).not.toContain('giseugc');
    },
  );

  it('links every price to its gig, with both spokesperson gigs and no ?source=', () => {
    for (const locale of ['es', 'en'] as const) {
      const { html } = renderPricing(locale);
      for (const url of FIVERR_PRICING_GIG_URLS) {
        expect(html).toContain(`href="${url}"`);
        expect(html).not.toContain(`${url}?`);
      }
      const spokespersonGreen = html.match(
        new RegExp(`href="${FIVERR_PRICING.gigs.spokespersonGreenWhite}"`, 'gu'),
      );
      const spokespersonJournalist = html.match(
        new RegExp(`href="${FIVERR_PRICING.gigs.spokespersonJournalist}"`, 'gu'),
      );
      expect((spokespersonGreen ?? []).length).toBeGreaterThanOrEqual(3);
      expect((spokespersonJournalist ?? []).length).toBeGreaterThanOrEqual(3);
      expect(html).not.toContain('$25 · $25');
      expect(html).not.toContain('$40 · $40');
      expect(html).not.toContain('$75 · $75');
      if (locale === 'es') {
        expect(html).toContain('$25 (');
        expect(html).toContain('gig fondo verde/blanco');
        expect(html).toContain('gig presentadora');
        expect(html).toContain('/#contact');
      } else {
        expect(html).toContain('$25 (');
        expect(html).toContain('green/white backdrop gig');
        expect(html).toContain('presenter gig');
        expect(html).toContain('/en/#contact');
      }
    }
  });

  it('renders one FAQ block whose visible text matches FAQPage', () => {
    for (const locale of ['es', 'en'] as const) {
      const { raw, html } = renderPricing(locale);
      const faqHeading = locale === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions';
      expect((html.match(new RegExp(faqHeading, 'gu')) ?? []).length).toBe(1);
      expect(html).not.toContain('<dl');
      expect(html).not.toContain('<dt');
      const faqPages = extractFaqPages(raw);
      expect(faqPages).toHaveLength(1);
    }
    const esShell = read('recursos/cuanto-cobra-creadora-ugc/index.html');
    const enShell = read('en/resources/how-much-does-a-ugc-creator-charge/index.html');
    expect(esShell).not.toMatch(/<dl[\s>]/u);
    expect(enShell).not.toMatch(/<dl[\s>]/u);
    expect((esShell.match(/Preguntas frecuentes/gu) ?? []).length).toBe(1);
    expect((enShell.match(/Frequently asked questions/gu) ?? []).length).toBe(1);
  });

  it('uses the approved titles, paths, and hire-guide budget FAQ', () => {
    expect(getResourcePath('how-much-ugc-creator-charge', 'es')).toBe('/recursos/cuanto-cobra-creadora-ugc/');
    expect(getResourcePath('how-much-ugc-creator-charge', 'en')).toBe(
      '/en/resources/how-much-does-a-ugc-creator-charge/',
    );
    const hireEs = getResourcePageContent('how-to-hire-ugc-creator', 'es');
    const hireEn = getResourcePageContent('how-to-hire-ugc-creator', 'en');
    expect(hireEs.faqs[0]).toEqual(HIRE_BUDGET_FAQ.es);
    expect(hireEn.faqs[0]).toEqual(HIRE_BUDGET_FAQ.en);
    expect(hireEs.sections.find((section) => section.title === 'Presupuesto y qué incluye')?.body[0]).toBe(
      HIRE_BUDGET_FAQ.es.answer,
    );
    expect(hireEn.sections.find((section) => section.title === 'Budget and what’s included')?.body[0]).toBe(
      HIRE_BUDGET_FAQ.en.answer,
    );
  });
});

describe('resource hubs list five guides including the pricing page', () => {
  it('ES and EN hubs say five and card-link the new guide', () => {
    for (const locale of ['es', 'en'] as const) {
      const page = getHubPageContent('resources', locale);
      expect(page.lead).toMatch(locale === 'es' ? /cinco guías/u : /five guides/u);
      expect(page.children.some((child) => child.href === getResourcePath('how-much-ugc-creator-charge', locale))).toBe(
        true,
      );
      expect(page.children.some((child) => child.title === PRICING_GUIDE_HUB[locale].title)).toBe(true);
      expect(page.children.some((child) => child.blurb === PRICING_GUIDE_HUB[locale].blurb)).toBe(true);

      const html = visibleHtml(
        renderToStaticMarkup(
          <StaticRouter location={page.path}>
            <LocaleProvider>
              <HubPage hubId="resources" locale={locale} />
            </LocaleProvider>
          </StaticRouter>,
        ),
      );
      expect(html).toContain(getResourcePath('how-much-ugc-creator-charge', locale));
      expect(html).toContain(PRICING_GUIDE_HUB[locale].title);
    }
  });
});

describe('sitemap and IndexNow include the pricing URLs', () => {
  it('lists both locale paths in the generated sitemap', () => {
    const xml = buildSitemapXml();
    expect(xml).toContain('https://www.giselasaldarriaga.com/recursos/cuanto-cobra-creadora-ugc/</loc>');
    expect(xml).toContain(
      'https://www.giselasaldarriaga.com/en/resources/how-much-does-a-ugc-creator-charge/</loc>',
    );
    expect(read('public/sitemap.xml')).toContain(
      'https://www.giselasaldarriaga.com/recursos/cuanto-cobra-creadora-ugc/</loc>',
    );
    expect(read('scripts/indexnow-ping.sh')).toContain('public/sitemap.xml');
  });
});

describe('homepage #contact target', () => {
  it('renders id=contact on the live page-end strip', () => {
    const html = renderToStaticMarkup(
      <StaticRouter location="/">
        <LocaleProvider>
          <PageEndStrip />
        </LocaleProvider>
      </StaticRouter>,
    );
    expect(html).toContain('id="contact"');
  });
});
