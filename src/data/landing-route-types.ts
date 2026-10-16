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

/** The Fiverr review beside a service hero (src/data/service-hero-reviews.ts), ready to print. */
export type ServiceHeroReview = {
  user: string;
  /** Country, named in the page's language. */
  countryName: string;
  rating: number;
  lang: 'es' | 'en' | 'it';
  text: string;
  avatar?: string;
};

export type ServiceLandingRouteData = {
  page: ServicePageContent;
  relatedPages: RelatedServiceSummary[];
  allOtherServices: ServiceNavLink[];
  relevantVerticals: VerticalNavLink[];
  heroReview: ServiceHeroReview | null;
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
