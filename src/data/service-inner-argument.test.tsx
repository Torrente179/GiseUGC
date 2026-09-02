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
import { buildMobileFicha, buildServiceFicha } from '@/lib/service-inner-argument';

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
      expect(raw).toContain('title-sequence-nav');
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
    const { html } = renderService('bilingual-ugc-creator', 'es');
    expect(html).toContain('svc-inner-close-shell');
    expect(html).toContain('svc-inner-close-top');
    expect(html).toContain('svc-close-explore');
    expect(html).not.toContain('st-container svc-inner-close-grid');

    const css = readFileSync(resolve(root, 'src/styles/templates.css'), 'utf8');
    expect(css).toContain('overflow-x: clip');
    expect(css).toContain('.svc-inner-close-shell');
    expect(css).toContain('.svc-close-explore-col');
    expect(css).toMatch(/\.svc-close-explore \{[\s\S]*?align-items: start/u);
    expect(css).toContain('align-items: start');
    expect(css).not.toMatch(/\.svc-inner-close-grid \{[\s\S]*?align-items: end/u);
    expect(css).toContain('color: hsl(var(--foreground) / 0.84)');
    expect(css).toContain('color: hsl(var(--foreground) / 0.82)');
    expect(css).toContain('color: hsl(var(--foreground) / 0.74)');
    expect(css).toContain('padding-bottom: 6.5rem');
  });

  it('ships mobile inner as a document in beats: list values, 01 type, slab CTA, no chip nav', () => {
    const { html } = renderService('ugc-ads-tiktok-meta', 'es');
    // The sticky chip nav stays gone. The ficha's own values are chips, which is
    // a different element (stm-ficha-chip) and the fix for the joined blobs.
    expect(html).not.toContain('stm-chips');
    expect(html).not.toContain('stm-ficha-card');
    expect(html).toContain('stm-ficha-row');
    expect(html).toContain('stm-ficha-chip');
    expect(html).toContain('stm-beat--recibes');
    expect(html).toContain('stm-beat-figure');
    expect(html).toContain('stm-sticky-bar--slab');
    expect(html).toContain('class="stm-stepper-num" aria-hidden="true">01<');
    expect(html).toContain('class="stm-stepper-num" aria-hidden="true">04<');

    const css = readFileSync(resolve(root, 'src/styles/templates.css'), 'utf8');
    expect(css).not.toContain('.stm-chip {');
    expect(css).toContain('.stm-sticky-bar--slab');
    // Process is a timeline rail, not stacked 2px rules.
    expect(css).toContain('border-left: 1px solid hsl(var(--foreground) / 0.18)');
    // Every beat owns a surface, and dark redeclares the whole set rather than
    // inheriting a rhythm built on light-theme lightness jumps.
    expect(css).toContain('.dark .stm-walk');
    expect(css).toContain('--stm-bg-ink: hsl(var(--ink-surface))');
    expect(css).toContain('body:has(.stm-sticky-bar--slab) .mtabbar');
  });

  it('keeps the mobile ficha as lists and drops the fit rows Encaja already carries', () => {
    const page = getServicePageContent('ugc-ads-tiktok-meta', 'es');
    const ficha = buildMobileFicha(page);
    expect(ficha.lead).toBe(page.sectionIntroText);
    expect(ficha.rows.map((row) => row.key)).toEqual(['ask', 'markets']);
    expect(ficha.rows[0]?.items).toEqual(page.deliverables.map((item) => item.title));
    expect(ficha.rows[1]?.items).toEqual(page.marketItems);
    // The duplication the ficha used to carry a screen above Encaja.
    const flat = JSON.stringify(ficha);
    expect(flat).not.toContain(page.bestFitItems[0] ?? '@@none@@');
    expect(flat).not.toContain(page.notFitItems[0] ?? '@@none@@');
  });
});
