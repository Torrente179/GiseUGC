import {
  getAllServiceIds,
  getRelatedServiceSummaries,
  getServicePageContent,
} from '@/data/service-pages';
import { SERVICE_HERO_REVIEW_ID } from '@/data/service-hero-reviews';
import { FIVERR_COUNTRY_NAMES, FIVERR_REVIEWS } from '@/data/fiverr-reviews';
import { getResourcePageContent } from '@/data/resource-pages';
import type {
  ResourceLandingRouteData,
  ServiceHeroReview,
  ServiceLandingRouteData,
} from '@/data/landing-route-types';
import type {
  ServicePageId,
  ResourcePageId,
  SiteLocale,
} from '@/lib/locale-path';

export const buildResourceLandingRouteData = (
  resourceId: ResourcePageId,
  locale: SiteLocale,
): ResourceLandingRouteData => {
  const page = getResourcePageContent(resourceId, locale);
  return {
    page,
    relatedServices: page.relatedServiceIds.map((id) => {
      const service = getServicePageContent(id, locale);
      return {
        id,
        heroEyebrow: service.heroEyebrow,
        navLabel: service.navLabel,
        metaDescription: service.metaDescription,
      };
    }),
  };
};

/**
 * The service's hero review, built here so a page ships one review instead of
 * the whole capture. Wrapping quotes and emoji are trimmed for the card; the
 * client's words are untouched.
 */
const buildHeroReview = (serviceId: ServicePageId, locale: SiteLocale): ServiceHeroReview | null => {
  const review = FIVERR_REVIEWS.find((item) => item.id === SERVICE_HERO_REVIEW_ID[serviceId]);
  if (!review) return null;
  const countryName = FIVERR_COUNTRY_NAMES[locale][review.country] ?? review.country;
  const text = review.text
    .replace(/\p{Extended_Pictographic}\uFE0F?/gu, '')
    .replace(/\s{2,}/gu, ' ')
    .trim()
    .replace(/^["“]+|["”]+$/gu, '');
  return {
    user: review.user,
    countryName,
    rating: review.rating,
    lang: review.lang,
    text,
    ...(review.avatar ? { avatar: review.avatar } : {}),
  };
};

export const buildServiceLandingRouteData = (
  serviceId: ServicePageId,
  locale: SiteLocale,
): ServiceLandingRouteData => {
  const page = getServicePageContent(serviceId, locale);
  return {
    page,
    relatedPages: getRelatedServiceSummaries(page.relatedServiceIds, locale),
    allOtherServices: getAllServiceIds()
      .filter((id) => id !== serviceId)
      .map((id) => ({
        id,
        navLabel: getServicePageContent(id, locale).navLabel,
      })),
    heroReview: buildHeroReview(serviceId, locale),
  };
};
