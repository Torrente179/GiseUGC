import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { LocaleProvider } from '@/lib/locale-context';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import { getAllServiceIds, getServicePageContent } from './service-pages';
import { buildServiceLandingRouteData } from './landing-route-data.server';
import { CONTENT_DATES, formatLastUpdatedLabel } from '@/data/content-dates';
import { FIVERR_PROFILE_URL } from '@/lib/contact-channels';
import { getServicePath, type SiteLocale } from '@/lib/locale-path';
import { buildServiceFicha } from '@/lib/service-inner-argument';

const root = resolve(process.cwd());

const visibleHtml = (html: string) =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, '')
    .replace(/&#x27;/giu, "'")
    .replace(/&amp;/giu, '&');

const countTag = (html: string, tag: 'h1' | 'h2') =>
  (html.match(new RegExp(`<${tag}\\b`, 'giu')) ?? []).length;

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

describe('service inner argument stays crawlable', () => {
  it('remaps existing copy into ficha without inventing a new service', () => {
    const page = getServicePageContent('ugc-ads-tiktok-meta', 'es');
    const ficha = buildServiceFicha(page);
    expect(ficha.map((row) => row.key)).toEqual(['what', 'ask', 'languages', 'fits', 'not']);
    expect(ficha[0]?.value).toBe(page.sectionIntroText);
    expect(ficha[1]?.value).toContain(page.deliverables[0]?.title ?? '');
    expect(ficha[2]?.value).toContain(page.marketItems[0] ?? '');
    expect(ficha[3]?.value).toContain(page.bestFitItems[0] ?? '');
    expect(ficha[4]?.value).toContain(page.notFitItems[0] ?? '');
  });

  it.each(getAllServiceIds().flatMap((id) => (['es', 'en'] as const).map((locale) => [id, locale] as const)))(
    '%s (%s) ships one H1, H2 beats, FAQ answers, and contact hrefs in first HTML',
    (serviceId, locale) => {
      const { html, raw, page } = renderService(serviceId, locale);

      expect(html.toLowerCase()).not.toContain('giseugc');
      expect(html).toContain(`<h1`);
      expect(countTag(html, 'h1')).toBe(1);
      expect(html).toContain(`<h1 class="stm-hero-title stm-hero-title--reveal">${page.heroTitle}</h1>`);
      expect(html).toContain(page.heroTitle);
      expect(html).toContain(`href="${page.path}"`);
      expect(html).toContain(`href="${page.alternatePath}"`);
      expect(html).toContain('hreflang="es"');
      expect(html).toContain('hreflang="en"');
      expect(html).not.toMatch(/<button[^>]*aria-pressed[^>]*>\s*<span class="relative">(es|en)<\/span>/u);
      expect(html).toContain(page.sectionIntroText);
      expect(html).toContain(page.deliverablesTitle);
      expect(html).toContain(page.processTitle);
      expect(html).toContain(page.faqTitle);
      expect(html).toContain(page.ctaTitle);
      for (const item of page.marketItems) expect(html).toContain(item);
      for (const item of page.deliverables) {
        expect(html).toContain(item.title);
        expect(html).toContain(item.description);
      }
      for (const faq of page.faqs) {
        expect(html).toContain(faq.question);
        expect(html).toContain(faq.answer);
      }
      expect(html).toContain(page.primaryCtaHref);
      expect(html).toContain(page.primaryCtaLabel);
      expect(html).toContain(formatLastUpdatedLabel(CONTENT_DATES.services, locale));
      expect(html).not.toMatch(/24 mar 2026|Mar 24, 2026/u);
      for (const relatedId of page.relatedServiceIds) {
        expect(html).toContain(getServicePath(relatedId, locale));
      }
      expect(html).toContain('id="ficha"');
      expect(html).toContain('id="recibes"');
      expect(html).toContain('id="como-corre"');
      expect(html).toContain('id="encaja"');
      expect(html).toContain('id="faq"');
      expect(html).toContain('id="empezar"');
      expect(raw).toContain('"@type":"FAQPage"');
      expect(raw).toContain('"@type":"Service"');
      expect(raw).toContain('"@type":"WebPageElement"');
      expect(raw).not.toContain('reviewBody');
    },
  );

  it('keeps 4.8/173 GEO proof on bilingüe only, with a query-free Fiverr href', () => {
    const { html: es, raw: esRaw } = renderService('bilingual-ugc-creator', 'es');
    const { html: en, raw: enRaw } = renderService('bilingual-ugc-creator', 'en');
    expect(es).toContain('Gisela Saldarriaga es creadora UGC bilingüe');
    expect(es).toContain('4.8/5 en 173 reseñas verificadas');
    expect(es).toContain('28+ campañas de marca');
    expect(es).toContain(`href="${FIVERR_PROFILE_URL}"`);
    expect(es).not.toContain('fiverr.com/gisela_sm?');
    expect(es).toContain('un tope de 65 palabras por video');
    expect(en).toContain('Gisela Saldarriaga is a bilingual UGC creator');
    expect(en).toContain('4.8/5 from 173 verified reviews');
    expect(en).toContain('65-word cap per video');
    expect(esRaw).not.toContain('[gisela_sm](');
    expect(enRaw).not.toContain('[gisela_sm](');
    expect(esRaw).toContain('"@type":"AggregateRating"');
    expect(enRaw).toContain('"@type":"AggregateRating"');
    expect(esRaw).not.toContain('reviewBody');

    const { html: ads, raw: adsRaw } = renderService('ugc-ads-tiktok-meta', 'es');
    expect(ads).not.toContain('4.8/5');
    expect(ads).not.toContain('173 reseñas');
    expect(adsRaw).not.toContain('AggregateRating');
  });
});

const bootFileFor = (path: string) => `${path.replace(/^\//u, '')}index.html`;

describe('service boot shells keep crawlable first HTML', () => {
  it.each(getAllServiceIds().flatMap((id) => (['es', 'en'] as const).map((locale) => [id, locale] as const)))(
    '%s (%s) boot shell has title, one H1, inner argument, and hreflang',
    (serviceId, locale) => {
      const page = getServicePageContent(serviceId, locale);
      const html = readFileSync(resolve(root, bootFileFor(page.path)), 'utf8');
      expect(html).toContain(`<title>${page.metaTitle}</title>`);
      expect(html).not.toMatch(/<title>Gisela Saldarriaga<\/title>/u);
      expect(html).toContain(`<h1 class="boot-title">${page.heroTitle}</h1>`);
      expect((html.match(/<h1\b/giu) ?? []).length).toBe(1);
      expect(html).toContain('class="boot-expanded"');
      expect(html).toContain('.boot-ficha {');
      expect(html).toContain(locale === 'es' ? '>Qué es<' : '>What it is<');
      expect(html).toContain(locale === 'es' ? '>Qué pides<' : '>What you ask for<');
      expect(html).toContain('hreflang="es"');
      expect(html).toContain('hreflang="en"');
      expect(html).toContain(`href="https://www.giselasaldarriaga.com${getServicePath(serviceId, 'es')}" hreflang="x-default"`);
      expect(html.toLowerCase()).not.toContain('giseugc');
      expect(html).not.toContain('reviewBody');
    },
  );

  it('bilingüe boot shells keep GEO + 65-word FAQ; ads pages do not get 4.8/173', () => {
    const es = readFileSync(resolve(root, 'servicios/creadora-ugc-bilingue/index.html'), 'utf8');
    const en = readFileSync(resolve(root, 'en/services/bilingual-ugc-creator/index.html'), 'utf8');
    const ads = readFileSync(resolve(root, 'servicios/ugc-ads-tiktok-meta/index.html'), 'utf8');
    expect(es).toContain('Gisela Saldarriaga es creadora UGC bilingüe');
    expect(es).toContain('href="https://www.fiverr.com/gisela_sm"');
    expect(es).not.toContain('fiverr.com/gisela_sm?');
    expect(es).toContain('un tope de 65 palabras por video');
    expect(en).toContain('65-word cap per video');
    expect(es).not.toContain('[gisela_sm](');
    expect(es).toContain('AggregateRating');
    expect(en).toContain('AggregateRating');
    expect(ads).not.toContain('4.8/5 en 173');
    expect(ads).not.toContain('4.8/5 from 173');
    expect(ads).not.toContain('AggregateRating');
  });
});

describe('service inner presentation locks', () => {
  it('keeps Empezar in the content column and darkens light-theme labels', () => {
    const css = readFileSync(resolve(root, 'src/styles/templates.css'), 'utf8');
    expect(css).toContain('overflow-x: clip');
    expect(css).toContain('padding: 6rem 2.25rem 5rem');
    expect(css).toContain('color: hsl(var(--foreground) / 0.84)');
    expect(css).toContain('color: hsl(var(--foreground) / 0.82)');
    expect(css).toContain('color: hsl(var(--foreground) / 0.74)');
    expect(css).toContain('padding-bottom: 6.5rem');
  });
});
