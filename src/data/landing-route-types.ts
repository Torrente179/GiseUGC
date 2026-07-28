import type { ServicePageContent, RelatedServiceSummary } from '@/data/service-pages';
import type { VerticalPageContent } from '@/data/vertical-pages';
import type { ResourcePageContent } from '@/data/resource-pages';
import type { ServicePageId, VerticalPageId } from '@/lib/locale-path';

export type ServiceNavLink = {
  id: ServicePageId;
  navLabel: string;
};

export type VerticalNavLink = {
  id: VerticalPageId;
  navLabel: string;
};

export type ServiceLandingRouteData = {
  page: ServicePageContent;
  relatedPages: RelatedServiceSummary[];
  allOtherServices: ServiceNavLink[];
  relevantVerticals: VerticalNavLink[];
};

export type VerticalLandingRouteData = {
  page: VerticalPageContent;
  relatedPages: RelatedServiceSummary[];
  relatedServices: ServiceNavLink[];
};

export type RelatedRouteCard<T extends string> = {
  id: T;
  heroEyebrow: string;
  navLabel: string;
  metaDescription: string;
};

export type ResourceLandingRouteData = {
  page: ResourcePageContent;
  relatedServices: RelatedRouteCard<ServicePageId>[];
  relatedVerticals: RelatedRouteCard<VerticalPageId>[];
};
