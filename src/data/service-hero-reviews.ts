import type { ServicePageId } from '@/lib/locale-path';

/**
 * The real Fiverr review beside each service page's hero, picked for what the
 * client says about that kind of work. Ids are FiverrReview ids
 * (src/data/fiverr-reviews.ts, `${user}-${order}`); a new capture can renumber
 * them, and service-hero-reviews.test.ts fails if one goes missing.
 */
export const SERVICE_HERO_REVIEW_ID: Record<ServicePageId, string> = {
  // Written in both English and Spanish.
  'bilingual-ugc-creator': 'randybarth-80',
  // "an outstanding job with our spokesperson video"
  'spokesperson-videos': 'germur-145',
  // "charisma for speaking to the camera … for any of your advertising requirements"
  'ugc-ads-tiktok-meta': 'willyramos-160',
  // "video testimonial service … authentic, polished customer stories that build trust"
  'ugc-testimonials-reviews': 'randyleedailey-93',
  // "perfectly showcases the product features"
  'ugc-product-demo': 'jackrybi-136',
  // "transformed our brief into a powerful and captivating narrative"
  'ugc-problem-solution': 'tophatmedia-45',
  // "una capacidad de comunicación atractiva y que transmite energía"
  'ugc-lifestyle': 'pumuky79-175',
  // "delivered high-quality work exactly as promised"
  'ugc-broll-footage': 'marioraw-54',
};
