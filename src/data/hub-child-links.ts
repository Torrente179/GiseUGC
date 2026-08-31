import {
  getResourceIdsInOrder,
  getResourcePath,
  getServiceIdsInOrder,
  getServicePath,
  getVerticalIdsInOrder,
  getVerticalPath,
  type HubPageId,
  type ResourcePageId,
  type ServicePageId,
  type SiteLocale,
  type VerticalPageId,
} from '@/lib/locale-path';

/**
 * Child-link labels for the empty hub shells. These must stay in lockstep with
 * each money page's `navLabel` (enforced in crawl-trust tests). Kept here so
 * the hub hydrator does not pull service/vertical/resource page copy.
 */
const SERVICE_NAV_LABELS: Record<ServicePageId, Record<SiteLocale, string>> = {
  'bilingual-ugc-creator': { es: 'Creadora UGC bilingüe', en: 'Bilingual UGC creator' },
  'spokesperson-videos': { es: 'Videos de portavoz', en: 'Spokesperson videos' },
  'ugc-ads-tiktok-meta': { es: 'UGC Ads para TikTok y Meta', en: 'UGC ads for TikTok and Meta' },
  'ugc-testimonials-reviews': { es: 'Testimoniales y reseñas UGC', en: 'UGC testimonials and reviews' },
  'ugc-product-demo': { es: 'Demos de producto UGC', en: 'UGC product demos' },
  'ugc-problem-solution': { es: 'UGC problema-solución', en: 'Problem-solution UGC' },
  'ugc-lifestyle': { es: 'UGC lifestyle', en: 'Lifestyle UGC' },
  'ugc-broll-footage': { es: 'B-roll UGC', en: 'UGC b-roll' },
};

const VERTICAL_NAV_LABELS: Record<VerticalPageId, Record<SiteLocale, string>> = {
  'beauty-ugc': { es: 'UGC para beauty', en: 'Beauty UGC' },
  'fashion-ugc': { es: 'UGC para moda', en: 'Fashion UGC' },
  'tech-saas-ugc': { es: 'UGC para tech y SaaS', en: 'Tech and SaaS UGC' },
  'ecommerce-ugc': { es: 'UGC para ecommerce', en: 'Ecommerce UGC' },
  'lifestyle-wellness-ugc': { es: 'UGC lifestyle y bienestar', en: 'Lifestyle and wellness UGC' },
};

const RESOURCE_NAV_LABELS: Record<ResourcePageId, Record<SiteLocale, string>> = {
  'what-is-ugc': { es: 'Qué es UGC', en: 'What is UGC' },
  'how-to-hire-ugc-creator': { es: 'Cómo contratar creadora UGC', en: 'How to hire a UGC creator' },
  'ugc-vs-influencer-marketing': { es: 'UGC vs influencer marketing', en: 'UGC vs influencer marketing' },
  'ugc-ad-formats-guide': { es: 'Formatos de UGC para ads', en: 'UGC ad formats guide' },
};

export type HubChildLink = {
  href: string;
  label: string;
};

export const getHubChildLinks = (hubId: HubPageId, locale: SiteLocale): HubChildLink[] => {
  if (hubId === 'services') {
    return getServiceIdsInOrder().map((id) => ({
      href: getServicePath(id, locale),
      label: SERVICE_NAV_LABELS[id][locale],
    }));
  }

  if (hubId === 'verticals') {
    return getVerticalIdsInOrder().map((id) => ({
      href: getVerticalPath(id, locale),
      label: VERTICAL_NAV_LABELS[id][locale],
    }));
  }

  return getResourceIdsInOrder().map((id) => ({
    href: getResourcePath(id, locale),
    label: RESOURCE_NAV_LABELS[id][locale],
  }));
};
