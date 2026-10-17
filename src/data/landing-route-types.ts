import type { ServicePageContent, RelatedServiceSummary } from '@/data/service-pages';
import type { ResourcePageContent } from '@/data/resource-pages';
import type { ServicePageId } from '@/lib/locale-path';

export type ServiceNavLink = {
  id: ServicePageId;
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
  heroReview: ServiceHeroReview | null;
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
};
