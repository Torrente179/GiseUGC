import { SITE_PROOF } from '@/data/site-proof';
import { FIVERR_PROFILE_URL } from '@/lib/contact-channels';
import {
  getHomeSectionHref,
  getHubPath,
  getResourcePath,
  getServicePath,
  getVerticalPath,
  type HubPageId,
  type ResourcePageId,
  type ServicePageId,
  type SiteLocale,
  type VerticalPageId,
} from '@/lib/locale-path';

export type HubChildCopy = {
  href: string;
  title: string;
  blurb?: string;
};

export type HubSecondaryLink = {
  href: string;
  label: string;
};

export type HubPageContent = {
  id: HubPageId;
  locale: SiteLocale;
  path: string;
  alternatePath: string;
  breadcrumbLabel: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  lead: string;
  childrenTitle: string;
  children: HubChildCopy[];
  proof?: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryLinks: HubSecondaryLink[];
};

type HubChildDraft = {
  title: string;
  blurb?: string;
};

type LocalizedHubDraft = {
  breadcrumbLabel: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  lead: string;
  childrenTitle: string;
  primaryCtaLabel: string;
  children: HubChildDraft[];
  secondaryLinks: Array<{ hubId: HubPageId; label: string }>;
  proof?: string;
};

/** Hub display order only. Does not change PAGE_REGISTRY / sitemap child order. */
export const SERVICE_HUB_CHILD_ORDER = [
  'bilingual-ugc-creator',
  'ugc-ads-tiktok-meta',
  'spokesperson-videos',
  'ugc-testimonials-reviews',
  'ugc-product-demo',
  'ugc-problem-solution',
  'ugc-lifestyle',
  'ugc-broll-footage',
] as const satisfies readonly ServicePageId[];

export const VERTICAL_HUB_CHILD_ORDER = [
  'beauty-ugc',
  'ecommerce-ugc',
  'fashion-ugc',
  'tech-saas-ugc',
  'lifestyle-wellness-ugc',
] as const satisfies readonly VerticalPageId[];

export const RESOURCE_HUB_CHILD_ORDER = [
  'how-to-hire-ugc-creator',
  'ugc-ad-formats-guide',
  'ugc-vs-influencer-marketing',
  'what-is-ugc',
] as const satisfies readonly ResourcePageId[];

const HUB_DRAFTS: Record<HubPageId, Record<SiteLocale, LocalizedHubDraft>> = {
  services: {
    es: {
      breadcrumbLabel: 'Servicios',
      metaTitle: 'Contrata creadora UGC bilingüe ES+EN | Gisela Saldarriaga',
      metaDescription:
        'Contrata a Gisela Saldarriaga: ads UGC, demos y portavoz en español e inglés. Producción en Medellín para US hispano, España, LatAm y briefs en inglés.',
      heroTitle: 'Contrata a Gisela Saldarriaga como tu creadora UGC bilingüe',
      lead:
        'Si tu marca necesita una creadora UGC bilingüe, no una agencia: ads, demos, reseñas y videos de portavoz en español e inglés, entregados a ti. Produzco desde Medellín para equipos en el mercado hispano de Estados Unidos, España y LatAm, y para briefs en inglés. El contenido es de la marca. No lo publico en mis redes, salvo un acuerdo de ambassador.',
      childrenTitle: 'Qué puedes contratar',
      primaryCtaLabel: 'Contáctame',
      proof: `Llevo ${SITE_PROOF.brandCampaigns}+ campañas de marca en beauty, moda, tech y lifestyle. Gisela Saldarriaga trabaja en Fiverr como [gisela_sm](${FIVERR_PROFILE_URL}): ${SITE_PROOF.fiverrRating}/5 en ${SITE_PROOF.fiverrReviewCount} reseñas verificadas.`,
      secondaryLinks: [
        { hubId: 'verticals', label: 'UGC por industria' },
        { hubId: 'resources', label: 'Guías para contratar' },
      ],
      children: [
        {
          title: 'Creadora UGC bilingüe',
          blurb: 'Una misma cara en español e inglés, sin partir el lote entre dos perfiles.',
        },
        {
          title: 'UGC Ads para TikTok y Meta',
          blurb: 'Creativos para pauta: hooks, beneficio y CTA listos para testear, no un video hero.',
        },
        {
          title: 'Videos de portavoz',
          blurb: 'Cara y voz a cámara cuando la oferta necesita explicarse, no solo verse.',
        },
        {
          title: 'Testimoniales y reseñas UGC',
          blurb: 'Social proof en video para ads, páginas de producto y retargeting.',
        },
        {
          title: 'Demo de producto UGC',
          blurb: 'How-to y demos para que el producto se entienda rápido y se compre con menos dudas.',
        },
        {
          title: 'UGC problema-solución',
          blurb: 'El formato que arranca en el dolor y aterriza el producto como solución.',
        },
        {
          title: 'UGC lifestyle',
          blurb: 'Piezas que se sienten nativas en el feed de tu marca, no en un set.',
        },
        {
          title: 'B-roll y footage UGC',
          blurb: 'Tomas de producto y escenas sin voiceover para que tu equipo edite.',
        },
      ],
    },
    en: {
      breadcrumbLabel: 'Services',
      metaTitle: 'Hire a bilingual UGC creator, ES+EN | Gisela Saldarriaga',
      metaDescription:
        'Hire Gisela Saldarriaga for bilingual UGC ads, demos, and spokesperson videos. Produced in Medellín for US Hispanic, Spain, LatAm, and English briefs.',
      heroTitle: 'Hire Gisela Saldarriaga as your bilingual UGC creator',
      lead:
        'If you need a named bilingual UGC creator, not an agency: ads, demos, reviews, and spokesperson videos in Spanish and English, delivered to your brand. I produce from Medellín for teams selling to US Hispanic audiences, Spain, and LatAm, plus English briefs. The content belongs to the brand. I don’t post client work on my socials unless we agree on an ambassador deal.',
      childrenTitle: 'What you can hire',
      primaryCtaLabel: 'Contact me',
      proof: `I’ve run ${SITE_PROOF.brandCampaigns}+ brand campaigns in beauty, fashion, tech, and lifestyle. Gisela Saldarriaga works on Fiverr as [gisela_sm](${FIVERR_PROFILE_URL}): ${SITE_PROOF.fiverrRating}/5 from ${SITE_PROOF.fiverrReviewCount} verified reviews.`,
      secondaryLinks: [
        { hubId: 'verticals', label: 'UGC by industry' },
        { hubId: 'resources', label: 'Guides to hire' },
      ],
      children: [
        {
          title: 'Bilingual UGC creator',
          blurb: 'One face in Spanish and English, without splitting the batch across two profiles.',
        },
        {
          title: 'UGC Ads for TikTok and Meta',
          blurb: 'Paid creatives: hooks, benefit, and CTA ready to test, not a hero video.',
        },
        {
          title: 'Spokesperson videos',
          blurb: 'Face and voice on camera when the offer needs to be explained, not just seen.',
        },
        {
          title: 'UGC testimonials and reviews',
          blurb: 'Video social proof for ads, product pages, and retargeting.',
        },
        {
          title: 'UGC product demo',
          blurb: 'How-tos and demos so the product is understood quickly and bought with fewer doubts.',
        },
        {
          title: 'Problem-solution UGC',
          blurb: 'The format that starts in the pain and lands the product as the solution.',
        },
        {
          title: 'Lifestyle UGC',
          blurb: 'Pieces that feel native in your brand’s feed, not on a set.',
        },
        {
          title: 'UGC b-roll and footage',
          blurb: 'Product shots and scenes without voiceover so your team can edit.',
        },
      ],
    },
  },
  verticals: {
    es: {
      breadcrumbLabel: 'Verticales',
      metaTitle: 'Contrata UGC de beauty y ecommerce | Gisela Saldarriaga',
      metaDescription:
        'Contrata a Gisela Saldarriaga para UGC de beauty, ecommerce, moda, tech y bienestar. Creadora bilingüe en Medellín para marcas en US hispano, España y LatAm.',
      heroTitle: 'Contrata UGC por industria: beauty, ecommerce, moda, tech y bienestar',
      lead:
        'Si tu marca necesita una creadora UGC bilingüe por industria, no una agencia, empieza aquí. Produzco desde Medellín para equipos de beauty, ecommerce, moda, tech/SaaS y bienestar que venden en el mercado hispano de Estados Unidos, España, LatAm, o con un brief en inglés. El contenido se entrega a la marca.',
      childrenTitle: 'Por industria',
      primaryCtaLabel: 'Contáctame',
      secondaryLinks: [
        { hubId: 'services', label: 'Qué puedes contratar' },
        { hubId: 'resources', label: 'Guías para contratar' },
      ],
      children: [
        { title: 'UGC para beauty' },
        { title: 'UGC para ecommerce' },
        { title: 'UGC para moda' },
        { title: 'UGC para tech y SaaS' },
        { title: 'UGC para lifestyle y bienestar' },
      ],
    },
    en: {
      breadcrumbLabel: 'Verticals',
      metaTitle: 'Hire beauty and ecommerce UGC creator | Gisela Saldarriaga',
      metaDescription:
        'Hire Gisela Saldarriaga for beauty, ecommerce, fashion, tech, and wellness UGC. Bilingual creator in Medellín for US Hispanic, Spain, LatAm, and English briefs.',
      heroTitle: 'Hire a UGC creator by industry: beauty, ecommerce, fashion, tech, wellness',
      lead:
        'If your brand needs a bilingual UGC creator by industry, not an agency, start here. I produce from Medellín for beauty, ecommerce, fashion, tech/SaaS, and wellness teams selling to US Hispanic audiences, Spain, LatAm, or with an English brief. The content is delivered to the brand.',
      childrenTitle: 'By industry',
      primaryCtaLabel: 'Contact me',
      secondaryLinks: [
        { hubId: 'services', label: 'What you can hire' },
        { hubId: 'resources', label: 'Guides to hire' },
      ],
      children: [
        { title: 'Beauty UGC' },
        { title: 'Ecommerce UGC' },
        { title: 'Fashion UGC' },
        { title: 'Tech and SaaS UGC' },
        { title: 'Lifestyle and wellness UGC' },
      ],
    },
  },
  resources: {
    es: {
      breadcrumbLabel: 'Recursos',
      metaTitle: 'Cómo contratar creadora UGC bilingüe | Gisela Saldarriaga',
      metaDescription:
        'Guías para contratar una creadora UGC bilingüe: brief, formatos de ads y UGC vs influencer. Para marcas en US hispano, España y LatAm que van a producir.',
      heroTitle: 'Cómo contratar una creadora UGC bilingüe: guías para marcas',
      lead:
        'Guías para contratar una creadora UGC bilingüe: brief, formatos de ads y UGC vs influencer. Para marcas en US hispano, España y LatAm que van a producir.',
      childrenTitle: 'Guías para marcas',
      primaryCtaLabel: 'Contáctame',
      secondaryLinks: [
        { hubId: 'services', label: 'Qué puedes contratar' },
        { hubId: 'verticals', label: 'UGC por industria' },
      ],
      children: [
        { title: 'Cómo contratar creadora UGC' },
        { title: 'Formatos de UGC para ads' },
        { title: 'UGC vs influencer marketing' },
        { title: 'Qué es UGC' },
      ],
    },
    en: {
      breadcrumbLabel: 'Resources',
      metaTitle: 'How to hire a bilingual UGC creator | Gisela Saldarriaga',
      metaDescription:
        'Guides to hire a bilingual UGC creator: brief, ad formats, and UGC vs influencer. For US Hispanic, Spain, and LatAm brands ready to produce, not an agency.',
      heroTitle: 'How to hire a bilingual UGC creator: guides for brand teams',
      lead:
        'Guides to hire a bilingual UGC creator: brief, ad formats, and UGC vs influencer. For US Hispanic, Spain, and LatAm brands ready to produce, not an agency.',
      childrenTitle: 'Guides for brand teams',
      primaryCtaLabel: 'Contact me',
      secondaryLinks: [
        { hubId: 'services', label: 'What you can hire' },
        { hubId: 'verticals', label: 'UGC by industry' },
      ],
      children: [
        { title: 'How to hire a UGC creator' },
        { title: 'UGC ad formats guide' },
        { title: 'UGC vs influencer marketing' },
        { title: 'What is UGC' },
      ],
    },
  },
};

const resolveChildHref = (hubId: HubPageId, locale: SiteLocale, index: number): string => {
  if (hubId === 'services') {
    return getServicePath(SERVICE_HUB_CHILD_ORDER[index], locale);
  }
  if (hubId === 'verticals') {
    return getVerticalPath(VERTICAL_HUB_CHILD_ORDER[index], locale);
  }
  return getResourcePath(RESOURCE_HUB_CHILD_ORDER[index], locale);
};

export const getHubPageContent = (hubId: HubPageId, locale: SiteLocale): HubPageContent => {
  const draft = HUB_DRAFTS[hubId][locale];
  const path = getHubPath(hubId, locale);
  const alternatePath = getHubPath(hubId, locale === 'es' ? 'en' : 'es');

  return {
    id: hubId,
    locale,
    path,
    alternatePath,
    breadcrumbLabel: draft.breadcrumbLabel,
    metaTitle: draft.metaTitle,
    metaDescription: draft.metaDescription,
    heroTitle: draft.heroTitle,
    lead: draft.lead,
    childrenTitle: draft.childrenTitle,
    children: draft.children.map((child, index) => ({
      href: resolveChildHref(hubId, locale, index),
      title: child.title,
      blurb: child.blurb,
    })),
    proof: draft.proof,
    primaryCtaLabel: draft.primaryCtaLabel,
    primaryCtaHref: getHomeSectionHref(locale, 'contact'),
    secondaryLinks: draft.secondaryLinks.map((link) => ({
      href: getHubPath(link.hubId, locale),
      label: link.label,
    })),
  };
};

export const getHubChildLinks = (hubId: HubPageId, locale: SiteLocale) =>
  getHubPageContent(hubId, locale).children.map((child) => ({
    href: child.href,
    label: child.title,
  }));
