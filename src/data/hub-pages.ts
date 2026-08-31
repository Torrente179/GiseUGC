import {
  getHubPath,
  getHomePath,
  getResourceIdsInOrder,
  getResourcePath,
  getServiceIdsInOrder,
  getServicePath,
  getVerticalIdsInOrder,
  getVerticalPath,
  type HubPageId,
  type SiteLocale,
} from '@/lib/locale-path';
import { getResourcePageContent } from '@/data/resource-pages';
import { getServicePageContent } from '@/data/service-pages';
import { getVerticalPageContent } from '@/data/vertical-pages';

export type HubChildLink = {
  href: string;
  label: string;
};

const SITE_NAME = 'Gisela Saldarriaga';

const HUB_NAV_LABEL: Record<HubPageId, Record<SiteLocale, string>> = {
  services: { es: 'Servicios', en: 'Services' },
  verticals: { es: 'Verticales', en: 'Verticals' },
  resources: { es: 'Recursos', en: 'Resources' },
};

export const getHubNavLabel = (hubId: HubPageId, locale: SiteLocale): string =>
  HUB_NAV_LABEL[hubId][locale];

/** Empty-shell document title: site name only. Landing Content owns hub headlines. */
export const getHubDocumentTitle = (): string => SITE_NAME;

export const getHubDocumentDescription = (): string => SITE_NAME;

export const getHubContactHref = (locale: SiteLocale): string =>
  `${getHomePath(locale)}#contact`;

export const getHubChildren = (hubId: HubPageId, locale: SiteLocale): HubChildLink[] => {
  if (hubId === 'services') {
    return getServiceIdsInOrder().map((id) => ({
      href: getServicePath(id, locale),
      label: getServicePageContent(id, locale).navLabel,
    }));
  }
  if (hubId === 'verticals') {
    return getVerticalIdsInOrder().map((id) => ({
      href: getVerticalPath(id, locale),
      label: getVerticalPageContent(id, locale).navLabel,
    }));
  }
  return getResourceIdsInOrder().map((id) => ({
    href: getResourcePath(id, locale),
    label: getResourcePageContent(id, locale).navLabel,
  }));
};

export const getHubCanonicalPath = (hubId: HubPageId, locale: SiteLocale): string =>
  getHubPath(hubId, locale);
