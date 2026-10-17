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

/**
 * Visible text with inline wrappers (<b>, accent <span>, <picture>) removed and
 * every other tag turned into a space, so copy split around a figure or
 * highlighted mid-sentence still reads as the original string.
 */
const plainText = (html: string) =>
  visibleHtml(html)
    .replace(/<\/?(?:b|span|i|em|strong|picture|source)\b[^>]*>/giu, '')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();

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
  const html = visibleHtml(raw);
  return { raw, html, text: plainText(raw), page };
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
      const { html, raw, text, page } = renderService(serviceId, locale);

      expect(html.toLowerCase()).not.toContain('giseugc');
      expect(html).toContain(`<h1`);
      expect(countTag(html, 'h1')).toBe(1);
      expect(html).toContain(`<h1 class="svm-title">${page.heroTitle}</h1>`);
      expect(html).toContain(page.heroTitle);
      expect(html).toContain(`href="${page.path}"`);
      expect(html).toContain(`href="${page.alternatePath}"`);
      expect(html).toContain('hreflang="es"');
      expect(html).toContain('hreflang="en"');
      expect(html).not.toMatch(/<button[^>]*aria-pressed[^>]*>\s*<span class="relative">(es|en)<\/span>/u);
      // The intro is set around a figure and the title carries a gradient accent,
      // so both are checked as text, not as one unbroken string of markup.
      expect(text).toContain(page.sectionIntroText);
      expect(text).toContain(page.sectionIntroTitle);
      expect(html).toContain(page.deliverablesTitle);
      expect(html).toContain(page.processTitle);
      expect(html).toContain(page.faqTitle);
      expect(html).toContain(page.ctaTitle);
      for (const item of page.marketItems) expect(html).toContain(item);
      for (const item of page.deliverables) {
        expect(html).toContain(item.title);
        expect(html).toContain(item.description);
      }
      for (const item of [...page.bestFitItems, ...page.notFitItems]) expect(text).toContain(item);
      for (const faq of page.faqs) {
        expect(html).toContain(faq.question);
        expect(html).toContain(faq.answer);
      }
      // The CTA opens the contact choice with scripts; without them it links to the page's own contact block.
      expect(html).toContain(`href="${page.path}#contact"`);
      expect(html).toContain('https://wa.me/573043786101');
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

  it('keeps 4.7/177 GEO proof on bilingüe only, with a query-free Fiverr href', () => {
    const { html: es, raw: esRaw } = renderService('bilingual-ugc-creator', 'es');
    const { html: en, raw: enRaw } = renderService('bilingual-ugc-creator', 'en');
    expect(es).toContain('Gisela Saldarriaga es creadora UGC bilingüe');
    expect(es).toContain('4.7/5 en 177 reseñas verificadas');
    expect(es).toContain('28+ campañas de marca');
    expect(es).toContain(`href="${FIVERR_PROFILE_URL}"`);
    expect(es).not.toContain('fiverr.com/gisela_sm?');
    expect(es).toContain('un tope de 65 palabras por video');
    expect(en).toContain('Gisela Saldarriaga is a bilingual UGC creator');
    expect(en).toContain('4.7/5 from 177 verified reviews');
    expect(en).toContain('65-word cap per video');
    expect(esRaw).not.toContain('[gisela_sm](');
    expect(enRaw).not.toContain('[gisela_sm](');
    expect(esRaw).toContain('"@type":"AggregateRating"');
    expect(enRaw).toContain('"@type":"AggregateRating"');
    expect(esRaw).not.toContain('reviewBody');

    const { html: ads, raw: adsRaw } = renderService('ugc-ads-tiktok-meta', 'es');
    expect(ads).not.toContain('4.7/5');
    expect(ads).not.toContain('4.8/5');
    expect(ads).not.toContain('177 reseñas');
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
      expect(html).toContain(locale === 'es' ? '>Qué puedes pedir<' : '>What you can request<');
      expect(html).toContain('hreflang="es"');
      expect(html).toContain('hreflang="en"');
      expect(html).toContain(`href="https://www.giselasaldarriaga.com${getServicePath(serviceId, 'es')}" hreflang="x-default"`);
      expect(html.toLowerCase()).not.toContain('giseugc');
      expect(html).not.toContain('reviewBody');
    },
  );

  it('bilingüe boot shells keep GEO + 65-word FAQ; ads pages do not get 4.7/177', () => {
    const es = readFileSync(resolve(root, 'servicios/creadora-ugc-bilingue/index.html'), 'utf8');
    const en = readFileSync(resolve(root, 'en/services/bilingual-ugc-creator/index.html'), 'utf8');
    const ads = readFileSync(resolve(root, 'servicios/ugc-ads-tiktok-meta/index.html'), 'utf8');
    expect(es).toContain('Gisela Saldarriaga es creadora UGC bilingüe');
    expect(es).toContain('href="https://www.fiverr.com/gisela_sm"');
    expect(es).not.toContain('fiverr.com/gisela_sm?');
    expect(es).toContain('4.7/5 en 177 reseñas verificadas');
    expect(en).toContain('4.7/5 from 177 verified reviews');
    expect(es).toContain('un tope de 65 palabras por video');
    expect(en).toContain('65-word cap per video');
    expect(es).not.toContain('[gisela_sm](');
    expect(es).toContain('AggregateRating');
    expect(en).toContain('AggregateRating');
    expect(ads).not.toContain('4.7/5 en 177');
    expect(ads).not.toContain('4.7/5 from 177');
    expect(ads).not.toContain('4.8/5 en 173');
    expect(ads).not.toContain('4.8/5 from 173');
    expect(ads).not.toContain('AggregateRating');
  });
});

describe('service inner presentation locks', () => {
  it('draws the desktop shell as the keynote: tablists, rail, fit columns, close index', () => {
    const { html, text, page } = renderService('ugc-ads-tiktok-meta', 'en');
    const desktop = html.slice(html.indexOf('kn kn--d'));

    // No section nav: the hero leads straight into the overview. The beats keep their ids for deep links.
    expect(desktop).not.toContain('kn-lnav');
    for (const id of ['ficha', 'recibes', 'como-corre', 'encaja', 'faq']) {
      expect(desktop).toContain(`id="${id}"`);
    }
    expect(desktop).not.toContain('svc-spine');

    // Formats: a proper tablist, one tab per deliverable, every description in the HTML.
    expect(desktop).toContain('role="tablist"');
    expect((desktop.match(/role="tab"/gu) ?? []).length).toBe(page.deliverables.length);
    expect((desktop.match(/role="tabpanel"/gu) ?? []).length).toBe(page.deliverables.length);
    expect(desktop).toContain('aria-selected="true"');
    expect(desktop).toContain('class="kn-phone kn-phone--stage"');

    // Process: four image cards with their step numbers, laid out as a grid (no arrows, no scroll stop).
    expect((desktop.match(/class="kn-card"/gu) ?? []).length).toBe(page.processSteps.length);
    expect(desktop).toContain('<ol class="kn-rail" aria-label="Process steps">');
    expect(desktop).not.toContain('aria-label="Previous step"');
    expect(desktop).not.toContain('aria-label="Next step"');

    // Fit: both columns present, with key phrases in full ink.
    expect(desktop).toContain('class="kn-col kn-col--no"');
    expect(desktop).toContain('<b>more videos to test</b>');
    expect(text).toContain(page.notFitTitle);

    // Questions: native details, only the first open.
    expect((desktop.match(/<details open=""/gu) ?? []).length).toBe(1);
    expect((desktop.match(/<details/gu) ?? []).length).toBe(page.faqs.length);

    // Close: the fan of the page's three featured clips, the tiles, and four index columns.
    expect(desktop).toContain('knc-fan-phone--c');
    expect((desktop.match(/knc-fan-phone--[lcr]/gu) ?? []).length).toBe(3);
    expect(desktop).toContain('class="knc-tile"');
    expect(desktop).toContain('class="knc-index"');

    // Contact: the close CTA opens the Escríbeme choice. Until scripts run it is a link to this
    // page's own contact block, never to another path (the runtime would turn that into a page
    // load before the panel could open).
    expect((desktop.match(/aria-haspopup="dialog"/gu) ?? []).length).toBe(1);
    expect((desktop.match(new RegExp(`href="${page.path}#contact"`, 'gu')) ?? []).length).toBe(1);
  });

  it('ships the phone shell as an app: 2x2 formats, toggle, both fit lists, explore tabs', () => {
    const { html, page } = renderService('ugc-ads-tiktok-meta', 'es');
    const mobile = html.slice(html.indexOf('kn kn--m'), html.indexOf('kn kn--d'));

    expect(mobile).not.toContain('kn-lnav');
    for (const id of ['ficha-m', 'recibes-m', 'como-corre-m', 'encaja-m', 'faq-m']) {
      expect(mobile).toContain(`id="${id}"`);
    }
    expect(mobile).toContain('id="kn-fm-mobile-tab-0"');
    // Process keeps the swipe rail on phones: a focusable scroller, no arrow buttons.
    expect(mobile).toContain('<ol class="kn-rail" aria-label="Pasos del proceso" tabindex="0">');
    expect(mobile).not.toContain('aria-label="Paso anterior"');
    // Fit toggle: both lists stay in the DOM, the inactive one hidden.
    expect(mobile).toContain('class="kn-tog"');
    expect((mobile.match(/class="kn-list"/gu) ?? []).length).toBe(2);
    expect((mobile.match(/class="kn-list" hidden=""/gu) ?? []).length).toBe(1);
    // Explore: three tabs over three panels, all links in the DOM.
    expect(mobile).toContain('class="knc-seg"');
    expect((mobile.match(/class="knc-panel"/gu) ?? []).length).toBe(3);
    expect(mobile).toContain('class="knc-rail"');
    for (const relatedId of page.relatedServiceIds) {
      expect(mobile).toContain(getServicePath(relatedId, 'es'));
    }
    expect(mobile).not.toContain('stm-beat');
    expect(mobile).not.toContain('stm-chips');
  });

  it('lists a related service once: tiles in Also offered, never again under More services', () => {
    for (const serviceId of getAllServiceIds()) {
      const page = getServicePageContent(serviceId, 'en');
      const route = buildServiceLandingRouteData(serviceId, 'en');
      const { html } = renderService(serviceId, 'en');
      const desktop = html.slice(html.indexOf('kn kn--d'));
      const index = desktop.slice(desktop.indexOf('class="knc-index"'));
      for (const relatedId of page.relatedServiceIds) {
        const href = getServicePath(relatedId, 'en');
        expect((index.match(new RegExp(`href="${href}"`, 'gu')) ?? []).length).toBe(1);
      }
      for (const other of route.allOtherServices.filter((item) => !page.relatedServiceIds.includes(item.id))) {
        expect((index.match(new RegExp(`href="${getServicePath(other.id, 'en')}"`, 'gu')) ?? []).length).toBe(1);
      }
    }
  });

  it('keeps below-hero type on DM Sans and ships both themes from one stylesheet', () => {
    const { html } = renderService('bilingual-ugc-creator', 'es');
    const inner = html.slice(html.indexOf('kn kn--m'));
    expect(inner).not.toContain('font-serif');

    const css = readFileSync(resolve(root, 'src/styles/service-keynote.css'), 'utf8');
    expect(css).not.toMatch(/cormorant|font-serif|(?<!sans-)\bserif\b/iu);
    // Light is the default; dark redeclares the whole token set.
    expect(css).toContain('.dark .kn {');
    expect(css).toContain('--kn-ink: #2b2620');
    expect(css).toContain('--kn-ink: #f5f5f7');
    expect(css).toContain('--kn-body: #6a5c50');
    expect(css).toContain('--kn-page: linear-gradient(180deg, #121212 0, #121212 116px, #fdfcfb 116px)');
    // Targets and motion: 44px tap size, reduced motion honoured, no section nav.
    expect(css).toContain('min-height: 44px');
    expect(css).toContain('prefers-reduced-motion: reduce');
    expect(css).not.toContain('kn-lnav');
  });

  it('retired the old inner markup from the page component', () => {
    const source = readFileSync(resolve(root, 'src/components/ServicePageInner.tsx'), 'utf8');
    for (const retired of ['svc-spine', 'stm-beat', 'svc-ficha', 'stm-stepper', 'stm-close', 'LocalNav']) {
      expect(source).not.toContain(retired);
    }
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
