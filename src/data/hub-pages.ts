import { SITE_PROOF } from '@/data/site-proof';
import { PRICING_GUIDE_HUB } from '@/data/resource-pages';
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
  'how-much-ugc-creator-charge',
  'ugc-ad-formats-guide',
  'ugc-vs-influencer-marketing',
  'what-is-ugc',
] as const satisfies readonly ResourcePageId[];

const HUB_DRAFTS: Record<HubPageId, Record<SiteLocale, LocalizedHubDraft>> = {
  services: {
    es: {
      breadcrumbLabel: 'Servicios',
      metaTitle: 'Servicios de contenido UGC en español e inglés | Gisela Saldarriaga',
      metaDescription:
        'Contrata a tu creadora UGC bilingüe en Medellín. Grabo anuncios, demos, reseñas y videos de portavoz en español e inglés para EE. UU., España y LatAm.',
      heroTitle: 'Contrata a Gisela Saldarriaga, creadora UGC bilingüe',
      lead:
        `Hago videos UGC en español e inglés: anuncios para TikTok y Meta, demos de producto, reseñas y videos hablando a cámara. Trabajas directo conmigo, sin agencia de por medio. Grabo desde Medellín para marcas de Estados Unidos (incluido el mercado hispano), España y Latinoamérica. Los videos son para tu marca y no los publico en mis redes, salvo que acordemos que sea embajadora. Si es tu primera vez, lee [cómo contratar una creadora UGC bilingüe](${getResourcePath('how-to-hire-ugc-creator', 'es')}).`,
      childrenTitle: 'Qué puedes contratar',
      primaryCtaLabel: 'Escríbeme',
      proof: `Llevo ${SITE_PROOF.brandCampaigns}+ campañas con marcas de beauty, moda, tech y lifestyle. En Fiverr me encuentras como [gisela_sm](${FIVERR_PROFILE_URL}), con ${SITE_PROOF.fiverrRating}/5 en ${SITE_PROOF.fiverrReviewCount} reseñas.`,
      secondaryLinks: [
        { hubId: 'verticals', label: 'UGC por industria' },
        { hubId: 'resources', label: 'Guías para contratar' },
      ],
      children: [
        {
          title: 'Creadora UGC bilingüe',
          blurb: 'Grabo las dos versiones yo misma, así no tienes que contratar a dos creadoras.',
        },
        {
          title: 'UGC Ads para TikTok y Meta',
          blurb: 'Anuncios cortos con hook, beneficio y CTA para probar en tu pauta.',
        },
        {
          title: 'Videos de portavoz',
          blurb: 'Hablo a cámara por tu marca cuando el producto necesita que alguien lo explique.',
        },
        {
          title: 'Testimoniales y reseñas UGC',
          blurb: 'Reseñas en video para tus anuncios, páginas de producto y retargeting.',
        },
        {
          title: 'Demos de producto UGC',
          blurb: 'Muestro cómo se usa tu producto, paso a paso, para que tus clientes lo entiendan rápido.',
        },
        {
          title: 'UGC problema-solución',
          blurb: 'Empiezo por el problema de tu cliente y muestro tu producto como la solución.',
        },
        {
          title: 'UGC lifestyle',
          blurb: 'Tu producto en escenas del día a día, grabadas en espacios reales y no en un set.',
        },
        {
          title: 'B-roll UGC',
          blurb: 'Tomas del producto y escenas sin voz en off para que tu equipo las edite.',
        },
      ],
    },
    en: {
      breadcrumbLabel: 'Services',
      metaTitle: 'UGC content services in Spanish and English | Gisela Saldarriaga',
      metaDescription:
        'Hire me as your bilingual UGC creator in Medellín. I make ads, demos, reviews, and spokesperson videos in Spanish and English for the US, Spain, and LatAm.',
      heroTitle: 'Hire Gisela Saldarriaga, a bilingual UGC creator',
      lead:
        `I make UGC videos in Spanish and English: ads for TikTok and Meta, product demos, reviews, and talking-to-camera videos. You work with me directly, with no agency in between. I film from Medellín for brands in the US (including the US Hispanic market), Spain, and Latin America. I make the videos for your brand and don’t post them on my own accounts unless we set up an ambassador deal. If it’s your first time, read [how to hire a bilingual UGC creator](${getResourcePath('how-to-hire-ugc-creator', 'en')}).`,
      childrenTitle: 'What you can hire me for',
      primaryCtaLabel: 'Message me',
      proof: `I’ve done ${SITE_PROOF.brandCampaigns}+ brand campaigns in beauty, fashion, tech, and lifestyle. On Fiverr I’m [gisela_sm](${FIVERR_PROFILE_URL}), rated ${SITE_PROOF.fiverrRating}/5 from ${SITE_PROOF.fiverrReviewCount} reviews.`,
      secondaryLinks: [
        { hubId: 'verticals', label: 'UGC by industry' },
        { hubId: 'resources', label: 'Hiring guides' },
      ],
      children: [
        {
          title: 'Bilingual UGC creator',
          blurb: 'I record both language versions myself, so you don’t need two creators.',
        },
        {
          title: 'UGC ads for TikTok and Meta',
          blurb: 'Short ads with a hook, the main benefit, and a CTA that you can test in your paid campaigns.',
        },
        {
          title: 'Spokesperson videos',
          blurb: 'I talk to camera for your brand when the product needs someone to explain it.',
        },
        {
          title: 'UGC testimonials and reviews',
          blurb: 'Video reviews for your ads, product pages, and retargeting.',
        },
        {
          title: 'UGC product demos',
          blurb: 'I show how your product works, step by step, so your customers get it quickly.',
        },
        {
          title: 'Problem-solution UGC',
          blurb: 'I start with your customer’s problem and then show your product as the fix.',
        },
        {
          title: 'Lifestyle UGC',
          blurb: 'Your product in everyday moments, filmed in real-life settings instead of on a set.',
        },
        {
          title: 'UGC b-roll and footage',
          blurb: 'Product shots and scenes without voiceover, for your team to edit.',
        },
      ],
    },
  },
  verticals: {
    es: {
      breadcrumbLabel: 'Industrias',
      metaTitle: 'Creadora UGC para beauty y ecommerce | Gisela Saldarriaga',
      metaDescription:
        'UGC en español e inglés para marcas de beauty, ecommerce, moda, tech y bienestar. Soy creadora en Medellín y grabo para EE. UU., España y LatAm.',
      heroTitle: 'UGC por industria: beauty, ecommerce, moda, tech y bienestar',
      lead:
        `Grabo UGC en español e inglés para marcas de beauty, ecommerce, moda, tech/SaaS y bienestar. Estoy en Medellín y trabajo con equipos de Estados Unidos (incluido el mercado hispano), España y Latinoamérica. Tratas directamente conmigo, sin agencia, y los videos se entregan a tu marca. Puedes [contratar una creadora UGC bilingüe](${getServicePath('bilingual-ugc-creator', 'es')}) o leer [cómo contratar una creadora UGC](${getResourcePath('how-to-hire-ugc-creator', 'es')}).`,
      childrenTitle: 'Por industria',
      primaryCtaLabel: 'Escríbeme',
      secondaryLinks: [
        { hubId: 'services', label: 'Qué puedes contratar' },
        { hubId: 'resources', label: 'Guías para contratar' },
      ],
      children: [
        {
          title: 'UGC para beauty',
          blurb: 'Skincare, maquillaje y cuidado personal aplicados en piel real, para anuncios y páginas de producto.',
        },
        {
          title: 'UGC para ecommerce',
          blurb: 'Una persona real mostrando tu producto, para tiendas online, marcas DTC y páginas de producto.',
        },
        {
          title: 'UGC para moda',
          blurb: 'Ropa puesta en un cuerpo real, con estilo del día a día y no de sesión de estudio.',
        },
        {
          title: 'UGC para tech y SaaS',
          blurb: 'Software, apps y servicios explicados en palabras sencillas, sin sonar a demo corporativa.',
        },
        {
          title: 'UGC para lifestyle y bienestar',
          blurb: 'Tu producto dentro de una rutina de todos los días, hablando a cámara con naturalidad.',
        },
      ],
    },
    en: {
      breadcrumbLabel: 'Industries',
      metaTitle: 'Beauty and ecommerce UGC creator | Gisela Saldarriaga',
      metaDescription:
        'UGC in Spanish and English for beauty, ecommerce, fashion, tech, and wellness brands. I’m a creator in Medellín and film for the US, Spain, and LatAm.',
      heroTitle: 'UGC by industry: beauty, ecommerce, fashion, tech, and wellness',
      lead:
        `I make UGC in Spanish and English for beauty, ecommerce, fashion, tech/SaaS, and wellness brands. I’m based in Medellín and work with teams in the US (including the US Hispanic market), Spain, and Latin America. You deal with me directly, no agency, and the videos are delivered to your brand. You can [hire a bilingual UGC creator](${getServicePath('bilingual-ugc-creator', 'en')}) or read [how to hire a UGC creator](${getResourcePath('how-to-hire-ugc-creator', 'en')}).`,
      childrenTitle: 'By industry',
      primaryCtaLabel: 'Message me',
      secondaryLinks: [
        { hubId: 'services', label: 'What you can hire me for' },
        { hubId: 'resources', label: 'Hiring guides' },
      ],
      children: [
        {
          title: 'Beauty UGC',
          blurb: 'Skincare, makeup, and personal care, tried on real skin for your ads and product pages.',
        },
        {
          title: 'Ecommerce UGC',
          blurb: 'A real person showing your product, for online stores, DTC brands, and product pages.',
        },
        {
          title: 'Fashion UGC',
          blurb: 'Clothes worn on a real body, styled for everyday life rather than a studio shoot.',
        },
        {
          title: 'Tech and SaaS UGC',
          blurb: 'Software, apps, and services explained in plain words, without sounding like a corporate demo.',
        },
        {
          title: 'Lifestyle and wellness UGC',
          blurb: 'Your product as part of an everyday routine, with me talking to camera in a relaxed way.',
        },
      ],
    },
  },
  resources: {
    es: {
      breadcrumbLabel: 'Recursos',
      metaTitle: 'Cómo contratar una creadora UGC bilingüe | Gisela Saldarriaga',
      metaDescription:
        'Guías para contratar una creadora UGC bilingüe: qué poner en el brief, qué formatos pedir para anuncios y en qué se diferencia el UGC de un influencer.',
      heroTitle: 'Cómo contratar una creadora UGC bilingüe: guías para marcas',
      lead:
        'Estas cinco guías son para marcas que van a contratar a una creadora UGC. Te sirven si le vendes al mercado hispano de Estados Unidos, a España o a Latinoamérica, o si tu brief está en inglés. Si es tu primera vez, empieza por cómo contratar. Las demás explican los formatos para anuncios, la diferencia entre UGC e influencer marketing y qué es el UGC.',
      childrenTitle: 'Guías para marcas',
      primaryCtaLabel: 'Escríbeme',
      secondaryLinks: [
        { hubId: 'services', label: 'Qué puedes contratar' },
        { hubId: 'verticals', label: 'UGC por industria' },
      ],
      children: [
        {
          title: 'Cómo contratar creadora UGC',
          blurb: 'Cómo funciona el proceso, qué poner en el brief y qué preguntar antes de cerrar el trato.',
        },
        {
          title: PRICING_GUIDE_HUB.es.title,
          blurb: PRICING_GUIDE_HUB.es.blurb,
        },
        {
          title: 'Formatos de UGC para ads',
          blurb: 'Testimonial, demo, problema-solución o portavoz: cuál pedir según lo que buscas con tu pauta.',
        },
        {
          title: 'UGC vs influencer marketing',
          blurb: 'Con una creadora UGC compras videos para tu marca. Con un influencer, pagas por un post en su cuenta.',
        },
        {
          title: 'Qué es UGC',
          blurb: 'Lo básico, en palabras sencillas, para equipos que van a producir videos y pautarlos.',
        },
      ],
    },
    en: {
      breadcrumbLabel: 'Resources',
      metaTitle: 'How to hire a bilingual UGC creator | Gisela Saldarriaga',
      metaDescription:
        'Guides for hiring a bilingual UGC creator: what to put in the brief, which ad formats to ask for, and how UGC differs from influencer marketing.',
      heroTitle: 'How to hire a bilingual UGC creator: guides for brands',
      lead:
        'These five guides are for brands about to hire a UGC creator. They’re useful if you sell to the US Hispanic market, Spain, or Latin America, or if your brief is in English. If it’s your first time, start with how to hire. The others cover ad formats, how UGC differs from influencer marketing, and what UGC is.',
      childrenTitle: 'Guides for brands',
      primaryCtaLabel: 'Message me',
      secondaryLinks: [
        { hubId: 'services', label: 'What you can hire me for' },
        { hubId: 'verticals', label: 'UGC by industry' },
      ],
      children: [
        {
          title: 'How to hire a UGC creator',
          blurb: 'How the process works, what goes in the brief, and what to ask before you book.',
        },
        {
          title: PRICING_GUIDE_HUB.en.title,
          blurb: PRICING_GUIDE_HUB.en.blurb,
        },
        {
          title: 'UGC ad formats guide',
          blurb: 'Testimonial, demo, problem-solution, or spokesperson: which one to ask for based on what your ads need to do.',
        },
        {
          title: 'UGC vs influencer marketing',
          blurb: 'With a UGC creator, you’re buying videos for your brand. With an influencer, you’re paying for a post on their account.',
        },
        {
          title: 'What is UGC',
          blurb: 'The basics in plain language, if you’re about to make videos and run them as ads.',
        },
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
