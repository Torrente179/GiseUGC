import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { LocaleProvider } from '@/lib/locale-context';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import ResourcePage from '@/components/ResourcePage';
import { getServicePageContent } from './service-pages';
import { getResourcePageContent } from './resource-pages';
import {
  buildResourceLandingRouteData,
  buildServiceLandingRouteData,
} from './landing-route-data.server';
import { SITE_PROOF } from './site-proof';
import { FIVERR_PROFILE_URL } from '@/lib/contact-channels';
import { getServicePath } from '@/lib/locale-path';
import { inlineCopyHrefs, visibleInlineCopy } from '@/lib/inline-copy-links';

const FIVERR_HREF = `href="${FIVERR_PROFILE_URL}"`;

const FACT_ES =
  'Gisela Saldarriaga es creadora UGC bilingüe. Produce desde Medellín anuncios para TikTok y Meta, demos, reseñas y videos de portavoz en español e inglés para marcas en el mercado hispano de Estados Unidos, España y LatAm. Trabaja en Fiverr como gisela_sm: 4.8/5 en 173 reseñas verificadas. Lleva 28+ campañas de marca. El contenido se entrega a la marca; no lo publica en sus redes salvo un acuerdo de ambassador.';

const FACT_EN =
  'Gisela Saldarriaga is a bilingual UGC creator. She produces TikTok and Meta ads, demos, reviews, and spokesperson videos from Medellín, in Spanish and English, for US Hispanic, Spain, and LatAm brands. She works on Fiverr as gisela_sm: 4.8/5 from 173 verified reviews. 28+ brand campaigns. Content is delivered to the brand; she does not post client work unless it is an ambassador deal.';

const renderAt = (path: string, node: React.ReactNode) =>
  renderToStaticMarkup(
    <StaticRouter location={path}>
      <LocaleProvider>{node}</LocaleProvider>
    </StaticRouter>,
  );

const visibleHtml = (html: string) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, '');

const assertCrawlableFiverrLink = (html: string) => {
  expect(html).toContain(FIVERR_HREF);
  expect(html).toContain('>gisela_sm</a>');
};

describe('GEO copy on bilingual service pages', () => {
  it('ES page ships the fact block after markets, with a query-free Fiverr link and 65-word English FAQ', () => {
    const page = getServicePageContent('bilingual-ugc-creator', 'es');
    expect(visibleInlineCopy(page.geoFact ?? '')).toBe(FACT_ES);
    expect(inlineCopyHrefs(page.geoFact ?? '')).toEqual([FIVERR_PROFILE_URL]);
    expect(page.faqs.find((faq) => faq.question === '¿Cómo trabajas el inglés?')?.answer).toBe(
      'En inglés trabajo con guion y un tope de 65 palabras por video para que suene natural.',
    );
    expect(page.geoFact).toContain(`${SITE_PROOF.fiverrRating}/5`);
    expect(page.geoFact).toContain(String(SITE_PROOF.fiverrReviewCount));
    expect(page.geoFact).toContain(`${SITE_PROOF.brandCampaigns}+`);

    const html = visibleHtml(
      renderAt(
        page.path,
        <ServiceLandingPage
          serviceId="bilingual-ugc-creator"
          locale="es"
          routeData={buildServiceLandingRouteData('bilingual-ugc-creator', 'es')}
        />,
      ),
    );
    const introAt = html.indexOf('Qué resuelve este servicio');
    const factAt = html.indexOf('Gisela Saldarriaga es creadora UGC bilingüe');
    const requestAt = html.indexOf('Qué puedes pedir dentro de este servicio');
    expect(introAt).toBeGreaterThan(-1);
    expect(factAt).toBeGreaterThan(introAt);
    expect(requestAt).toBeGreaterThan(factAt);
    expect(html).toContain('4.8/5 en 173 reseñas verificadas');
    expect(html).toContain('28+ campañas de marca');
    assertCrawlableFiverrLink(html);
    expect(html).toContain('¿Cómo trabajas el inglés?');
    expect(html).toContain('un tope de 65 palabras por video');
  });

  it('EN page ships the fact block after markets, with a query-free Fiverr link and 65-word English FAQ', () => {
    const page = getServicePageContent('bilingual-ugc-creator', 'en');
    expect(visibleInlineCopy(page.geoFact ?? '')).toBe(FACT_EN);
    expect(inlineCopyHrefs(page.geoFact ?? '')).toEqual([FIVERR_PROFILE_URL]);
    expect(page.faqs.find((faq) => faq.question === 'How do you work in English?')?.answer).toBe(
      'For English I work from a script, with a 65-word cap per video so it stays natural.',
    );

    const html = visibleHtml(
      renderAt(
        page.path,
        <ServiceLandingPage
          serviceId="bilingual-ugc-creator"
          locale="en"
          routeData={buildServiceLandingRouteData('bilingual-ugc-creator', 'en')}
        />,
      ),
    );
    const introAt = html.indexOf('What this service solves');
    const factAt = html.indexOf('Gisela Saldarriaga is a bilingual UGC creator');
    const requestAt = html.indexOf('What you can request inside this service');
    expect(introAt).toBeGreaterThan(-1);
    expect(factAt).toBeGreaterThan(introAt);
    expect(requestAt).toBeGreaterThan(factAt);
    expect(html).toContain('4.8/5 from 173 verified reviews');
    expect(html).toContain('28+ brand campaigns');
    assertCrawlableFiverrLink(html);
    expect(html).toContain('How do you work in English?');
    expect(html).toContain('65-word cap per video');
  });
});

describe('GEO copy on how-to-hire resource pages', () => {
  it('ES hire guide names gisela_sm 4.8/173 and adds an evaluable profile before the CTA', () => {
    const page = getResourcePageContent('how-to-hire-ugc-creator', 'es');
    const findSection = page.sections.find((section) => section.title === 'Dónde encontrar creadoras UGC profesionales');
    const profile = page.sections.find((section) => section.title === 'Un perfil que puedes evaluar ahora');
    const findCopy = findSection?.body.join('\n') ?? '';
    const profileCopy = profile?.body.join('\n') ?? '';

    expect(visibleInlineCopy(findCopy)).toContain('gisela_sm (4.8/5, 173 reseñas)');
    expect(inlineCopyHrefs(findCopy)).toEqual([FIVERR_PROFILE_URL]);
    expect(visibleInlineCopy(profileCopy)).toContain(FACT_ES);
    expect(profileCopy).toContain(`[Creadora UGC bilingüe](${getServicePath('bilingual-ugc-creator', 'es')})`);
    expect(page.sections.at(-1)?.title).toBe('Un perfil que puedes evaluar ahora');

    const html = visibleHtml(
      renderAt(
        page.path,
        <ResourcePage
          resourceId="how-to-hire-ugc-creator"
          locale="es"
          routeData={buildResourceLandingRouteData('how-to-hire-ugc-creator', 'es')}
        />,
      ),
    );
    const billoAt = html.indexOf('Billo, Insense o JoinBrands');
    const fiverrAt = html.indexOf('Fiverr es un canal directo con reseñas verificadas');
    const profileAt = html.indexOf('id="un-perfil-que-puedes-evaluar-ahora"');
    const ctaAt = html.indexOf('¿Buscas una creadora UGC?');
    expect(billoAt).toBeGreaterThan(-1);
    expect(fiverrAt).toBeGreaterThan(billoAt);
    expect(profileAt).toBeGreaterThan(fiverrAt);
    expect(ctaAt).toBeGreaterThan(profileAt);
    expect(html).toContain('(4.8/5, 173 reseñas)');
    expect(html).toContain('Gisela Saldarriaga es creadora UGC bilingüe');
    expect(html).toContain(`href="${getServicePath('bilingual-ugc-creator', 'es')}"`);
    assertCrawlableFiverrLink(html);
  });

  it('EN hire guide names gisela_sm 4.8/173 and adds an evaluable profile before the CTA', () => {
    const page = getResourcePageContent('how-to-hire-ugc-creator', 'en');
    const findSection = page.sections.find((section) => section.title === 'Where to find professional UGC creators');
    const profile = page.sections.find((section) => section.title === 'A profile you can evaluate now');
    const findCopy = findSection?.body.join('\n') ?? '';
    const profileCopy = profile?.body.join('\n') ?? '';

    expect(visibleInlineCopy(findCopy)).toContain('gisela_sm (4.8/5, 173 reviews)');
    expect(inlineCopyHrefs(findCopy)).toEqual([FIVERR_PROFILE_URL]);
    expect(visibleInlineCopy(profileCopy)).toContain(FACT_EN);
    expect(profileCopy).toContain(`[Bilingual UGC creator](${getServicePath('bilingual-ugc-creator', 'en')})`);
    expect(page.sections.at(-1)?.title).toBe('A profile you can evaluate now');

    const html = visibleHtml(
      renderAt(
        page.path,
        <ResourcePage
          resourceId="how-to-hire-ugc-creator"
          locale="en"
          routeData={buildResourceLandingRouteData('how-to-hire-ugc-creator', 'en')}
        />,
      ),
    );
    const billoAt = html.indexOf('Billo, Insense or JoinBrands');
    const fiverrAt = html.indexOf('Fiverr is a direct channel with verified reviews');
    const profileAt = html.indexOf('id="a-profile-you-can-evaluate-now"');
    const ctaAt = html.indexOf('Looking for a UGC creator?');
    expect(billoAt).toBeGreaterThan(-1);
    expect(fiverrAt).toBeGreaterThan(billoAt);
    expect(profileAt).toBeGreaterThan(fiverrAt);
    expect(ctaAt).toBeGreaterThan(profileAt);
    expect(html).toContain('(4.8/5, 173 reviews)');
    expect(html).toContain(`href="${getServicePath('bilingual-ugc-creator', 'en')}"`);
    assertCrawlableFiverrLink(html);
  });
});
