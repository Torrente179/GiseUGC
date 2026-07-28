import type { ServicePageId, VerticalPageId } from '@/lib/locale-path';

/**
 * Internal-linking map: which vertical landing pages each service page surfaces.
 * Lives in the data layer (beside service/vertical content) rather than inside a
 * component so cross-links stay with the content they describe.
 */
export const SERVICE_TO_VERTICALS: Record<ServicePageId, VerticalPageId[]> = {
  'bilingual-ugc-creator': ['beauty-ugc', 'fashion-ugc', 'tech-saas-ugc', 'ecommerce-ugc', 'lifestyle-wellness-ugc'],
  'spokesperson-videos': ['tech-saas-ugc', 'ecommerce-ugc', 'lifestyle-wellness-ugc'],
  'ugc-ads-tiktok-meta': ['beauty-ugc', 'fashion-ugc', 'ecommerce-ugc', 'lifestyle-wellness-ugc'],
  'ugc-testimonials-reviews': ['beauty-ugc', 'lifestyle-wellness-ugc', 'ecommerce-ugc'],
  'ugc-product-demo': ['beauty-ugc', 'tech-saas-ugc', 'ecommerce-ugc'],
  'ugc-problem-solution': ['tech-saas-ugc', 'ecommerce-ugc', 'lifestyle-wellness-ugc'],
  'ugc-lifestyle': ['beauty-ugc', 'fashion-ugc', 'lifestyle-wellness-ugc'],
  'ugc-broll-footage': ['beauty-ugc', 'fashion-ugc', 'ecommerce-ugc', 'lifestyle-wellness-ugc'],
};
