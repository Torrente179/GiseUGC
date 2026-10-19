import type { ServiceLandingRouteData } from '@/data/landing-route-types';
import type { ResourcePageId, SiteLocale } from '@/lib/locale-path';

export type KeynoteVariant = 'mobile' | 'desktop';

export type KeynotePage = ServiceLandingRouteData['page'];

/** What every beat needs to render itself in one of the two responsive shells. */
export type KeynoteBeatProps = {
  page: KeynotePage;
  locale: SiteLocale;
  variant: KeynoteVariant;
  /** "2 · Formats": the beat number and name, as the schema and local nav spell it. */
  kicker: string;
  /** DOM id of the beat title, referenced by the section's `aria-labelledby`. */
  titleId: string;
};

export type KeynoteLabelProps = {
  alsoOffered: string;
  moreServices: string;
  resources: string;
  explore: string;
  isThisForYou: string;
};

export type KeynoteResourceLink = { id: ResourcePageId; label: string };
