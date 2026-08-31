import { describe, expect, it } from 'vitest';
import { getServicePageContent } from './service-pages';
import { getResourcePageContent } from './resource-pages';
import { SITE_PROOF } from './site-proof';
import { getServicePath } from '@/lib/locale-path';
import { inlineCopyHrefs, visibleInlineCopy } from '@/lib/inline-copy-links';

const FIVERR_PROFILE = 'https://www.fiverr.com/gisela_sm';

const FACT_ES =
  'Gisela Saldarriaga es creadora UGC bilingüe. Produce desde Medellín anuncios para TikTok y Meta, demos, reseñas y videos de portavoz en español e inglés para marcas en el mercado hispano de Estados Unidos, España y LatAm. Trabaja en Fiverr como gisela_sm: 4.8/5 en 173 reseñas verificadas. Lleva 28+ campañas de marca. El contenido se entrega a la marca; no lo publica en sus redes salvo un acuerdo de ambassador.';

const FACT_EN =
  'Gisela Saldarriaga is a bilingual UGC creator. She produces TikTok and Meta ads, demos, reviews, and spokesperson videos from Medellín, in Spanish and English, for US Hispanic, Spain, and LatAm brands. She works on Fiverr as gisela_sm: 4.8/5 from 173 verified reviews. 28+ brand campaigns. Content is delivered to the brand; she does not post client work unless it is an ambassador deal.';

const assertNoBannedHandle = (blob: string) => {
  expect(blob).not.toMatch(/GiseUGC/i);
};

const assertFiverrHref = (hrefs: string[]) => {
  expect(hrefs).toContain(FIVERR_PROFILE);
  expect(hrefs.every((href) => !href.includes('?'))).toBe(true);
};

describe('GEO copy on bilingual service pages', () => {
  it('ES page ships the fact block after markets, with a query-free Fiverr link and 65-word English FAQ', () => {
    const page = getServicePageContent('bilingual-ugc-creator', 'es');
    expect(visibleInlineCopy(page.geoFact ?? '')).toBe(FACT_ES);
    assertFiverrHref(inlineCopyHrefs(page.geoFact ?? ''));
    expect(page.faqs.some((faq) => faq.question === '¿Cómo trabajas el inglés?')).toBe(true);
    expect(
      page.faqs.find((faq) => faq.question === '¿Cómo trabajas el inglés?')?.answer,
    ).toBe('En inglés trabajo con guion y un tope de 65 palabras por video para que suene natural.');
    expect(page.geoFact).toContain(`${SITE_PROOF.fiverrRating}/5`);
    expect(page.geoFact).toContain(String(SITE_PROOF.fiverrReviewCount));
    expect(page.geoFact).toContain(`${SITE_PROOF.brandCampaigns}+`);
    assertNoBannedHandle(JSON.stringify(page));
  });

  it('EN page ships the fact block after markets, with a query-free Fiverr link and 65-word English FAQ', () => {
    const page = getServicePageContent('bilingual-ugc-creator', 'en');
    expect(visibleInlineCopy(page.geoFact ?? '')).toBe(FACT_EN);
    assertFiverrHref(inlineCopyHrefs(page.geoFact ?? ''));
    expect(page.faqs.some((faq) => faq.question === 'How do you work in English?')).toBe(true);
    expect(
      page.faqs.find((faq) => faq.question === 'How do you work in English?')?.answer,
    ).toBe('For English I work from a script, with a 65-word cap per video so it stays natural.');
    assertNoBannedHandle(JSON.stringify(page));
  });
});

describe('GEO copy on how-to-hire resource pages', () => {
  it('ES hire guide names gisela_sm 4.8/173 and adds an evaluable profile before the CTA', () => {
    const page = getResourcePageContent('how-to-hire-ugc-creator', 'es');
    const findSection = page.sections.find((section) => section.title === 'Dónde encontrar creadoras UGC profesionales');
    const profile = page.sections.find((section) => section.title === 'Un perfil que puedes evaluar ahora');
    const findCopy = findSection?.body.join('\n') ?? '';
    const profileCopy = profile?.body.join('\n') ?? '';

    expect(findCopy).toContain('Fiverr es un canal directo con reseñas verificadas.');
    expect(visibleInlineCopy(findCopy)).toContain('gisela_sm (4.8/5, 173 reseñas)');
    assertFiverrHref(inlineCopyHrefs(findCopy));
    expect(visibleInlineCopy(profileCopy)).toContain(FACT_ES);
    expect(profileCopy).toContain(`[Creadora UGC bilingüe](${getServicePath('bilingual-ugc-creator', 'es')})`);
    expect(page.sections.at(-1)?.title).toBe('Un perfil que puedes evaluar ahora');
    assertNoBannedHandle(JSON.stringify(page));
  });

  it('EN hire guide names gisela_sm 4.8/173 and adds an evaluable profile before the CTA', () => {
    const page = getResourcePageContent('how-to-hire-ugc-creator', 'en');
    const findSection = page.sections.find((section) => section.title === 'Where to find professional UGC creators');
    const profile = page.sections.find((section) => section.title === 'A profile you can evaluate now');
    const findCopy = findSection?.body.join('\n') ?? '';
    const profileCopy = profile?.body.join('\n') ?? '';

    expect(findCopy).toContain('Fiverr is a direct channel with verified reviews.');
    expect(visibleInlineCopy(findCopy)).toContain('gisela_sm (4.8/5, 173 reviews)');
    assertFiverrHref(inlineCopyHrefs(findCopy));
    expect(visibleInlineCopy(profileCopy)).toContain(FACT_EN);
    expect(profileCopy).toContain(`[Bilingual UGC creator](${getServicePath('bilingual-ugc-creator', 'en')})`);
    expect(page.sections.at(-1)?.title).toBe('A profile you can evaluate now');
    assertNoBannedHandle(JSON.stringify(page));
  });
});
