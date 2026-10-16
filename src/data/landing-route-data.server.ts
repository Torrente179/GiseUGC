import {
  getAllServiceIds,
  getRelatedServiceSummaries,
  getServicePageContent,
} from '@/data/service-pages';
import { SERVICE_TO_VERTICALS } from '@/data/service-vertical-links';
import { SERVICE_HERO_REVIEW_ID } from '@/data/service-hero-reviews';
import { FIVERR_REVIEWS } from '@/data/fiverr-reviews';
import { getVerticalPageContent } from '@/data/vertical-pages';
import { getResourcePageContent } from '@/data/resource-pages';
import type {
  ResourceLandingRouteData,
  ServiceHeroReview,
  ServiceLandingRouteData,
  VerticalLandingRouteData,
} from '@/data/landing-route-types';
import type {
  ServicePageId,
  ResourcePageId,
  SiteLocale,
  VerticalPageId,
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
    relatedVerticals: page.relatedVerticalIds.map((id) => {
      const vertical = getVerticalPageContent(id, locale);
      return {
        id,
        heroEyebrow: vertical.heroEyebrow,
        navLabel: vertical.navLabel,
        metaDescription: vertical.metaDescription,
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
  let countryName = review.country;
  try {
    countryName = new Intl.DisplayNames([locale], { type: 'region' }).of(review.country) ?? review.country;
  } catch {
    // Keep the ISO code.
  }
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
    relevantVerticals: SERVICE_TO_VERTICALS[serviceId].map((id) => ({
      id,
      navLabel: getVerticalPageContent(id, locale).navLabel,
    })),
    heroReview: buildHeroReview(serviceId, locale),
  };
};

export const buildVerticalLandingRouteData = (
  verticalId: VerticalPageId,
  locale: SiteLocale,
): VerticalLandingRouteData => {
  const page = getVerticalPageContent(verticalId, locale);
  return {
    page,
    relatedPages: getRelatedServiceSummaries(page.relatedServiceIds, locale),
    relatedServices: page.relatedServiceIds.map((id) => ({
      id,
      navLabel: getServicePageContent(id, locale).navLabel,
    })),
  };
};
