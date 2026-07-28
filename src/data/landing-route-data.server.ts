import {
  getAllServiceIds,
  getRelatedServiceSummaries,
  getServicePageContent,
} from '@/data/service-pages';
import { SERVICE_TO_VERTICALS } from '@/data/service-vertical-links';
import { getVerticalPageContent } from '@/data/vertical-pages';
import { getResourcePageContent } from '@/data/resource-pages';
import type {
  ResourceLandingRouteData,
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
