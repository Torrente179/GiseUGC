export type SiteLocale = 'es' | 'en';
export type ServicePageId =
  | 'bilingual-ugc-creator'
  | 'spokesperson-videos'
  | 'ugc-ads-tiktok-meta'
  | 'ugc-testimonials-reviews'
  | 'ugc-product-demo'
  | 'ugc-problem-solution'
  | 'ugc-lifestyle'
  | 'ugc-broll-footage';
export type LegalPageId = 'privacy-policy' | 'terms-content-use';

const HOME_PATHS: Record<SiteLocale, string> = {
  es: '/',
  en: '/en/',
};

const SERVICE_PATHS: Record<ServicePageId, Record<SiteLocale, string>> = {
  'bilingual-ugc-creator': {
    es: '/servicios/creadora-ugc-bilingue/',
    en: '/en/services/bilingual-ugc-creator/',
  },
  'spokesperson-videos': {
    es: '/servicios/videos-de-portavoz/',
    en: '/en/services/spokesperson-videos/',
  },
  'ugc-ads-tiktok-meta': {
    es: '/servicios/ugc-ads-tiktok-meta/',
    en: '/en/services/ugc-ads-tiktok-meta/',
  },
  'ugc-testimonials-reviews': {
    es: '/servicios/testimoniales-resenas-ugc/',
    en: '/en/services/ugc-testimonials-reviews/',
  },
  'ugc-product-demo': {
    es: '/servicios/demo-producto-ugc/',
    en: '/en/services/ugc-product-demo/',
  },
  'ugc-problem-solution': {
    es: '/servicios/ugc-problema-solucion/',
    en: '/en/services/ugc-problem-solution/',
  },
  'ugc-lifestyle': {
    es: '/servicios/ugc-lifestyle/',
    en: '/en/services/lifestyle-ugc-organic-content/',
  },
  'ugc-broll-footage': {
    es: '/servicios/b-roll-footage-ugc/',
    en: '/en/services/ugc-b-roll-footage/',
  },
};

const LEGAL_PATHS: Record<LegalPageId, Record<SiteLocale, string>> = {
  'privacy-policy': {
    es: '/politica-de-privacidad/',
    en: '/en/privacy-policy/',
  },
  'terms-content-use': {
    es: '/terminos-y-uso-de-contenido/',
    en: '/en/terms-and-content-use/',
  },
};

const normalizeHash = (hash = '') => {
  if (!hash) return '';
  return hash.startsWith('#') ? hash : `#${hash}`;
};

export const normalizePathname = (pathname: string) => {
  if (!pathname) return '/';
  const withoutQuery = pathname.split('?')[0]?.split('#')[0] ?? '/';
  const prefixed = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;

  if (prefixed !== '/' && prefixed.endsWith('/')) {
    return prefixed.slice(0, -1);
  }

  return prefixed;
};

export const getLocaleFromPath = (pathname: string): SiteLocale =>
  normalizePathname(pathname) === '/en' || normalizePathname(pathname).startsWith('/en/') ? 'en' : 'es';

export const isHomePath = (pathname: string) => {
  const normalized = normalizePathname(pathname);
  return normalized === '/' || normalized === '/en';
};

export const getHomePath = (locale: SiteLocale, hash = ''): string => `${HOME_PATHS[locale]}${normalizeHash(hash)}`;

export const getCanonicalLocaleHref = (locale: SiteLocale, hash = ''): string => getHomePath(locale, hash);

export const getHomeSectionHref = (locale: SiteLocale, sectionId: string) => getHomePath(locale, `#${sectionId}`);

export const getServicePath = (serviceId: ServicePageId, locale: SiteLocale): string => SERVICE_PATHS[serviceId][locale];
export const getLegalPath = (pageId: LegalPageId, locale: SiteLocale): string => LEGAL_PATHS[pageId][locale];

const getPageIdFromPath = <TPageId extends string>(
  pathname: string,
  paths: Record<TPageId, Record<SiteLocale, string>>,
): TPageId | null => {
  const normalized = normalizePathname(pathname);
  const entries = Object.entries(paths) as Array<[TPageId, Record<SiteLocale, string>]>;

  for (const [pageId, localeMap] of entries) {
    if (normalizePathname(localeMap.es) === normalized || normalizePathname(localeMap.en) === normalized) {
      return pageId;
    }
  }

  return null;
};

export const getServicePageIdFromPath = (pathname: string): ServicePageId | null =>
  getPageIdFromPath(pathname, SERVICE_PATHS);

export const getLegalPageIdFromPath = (pathname: string): LegalPageId | null =>
  getPageIdFromPath(pathname, LEGAL_PATHS);

export const getLocalizedPathForCurrentRoute = (
  pathname: string,
  targetLocale: SiteLocale,
  hash = '',
): string => {
  const serviceId = getServicePageIdFromPath(pathname);
  if (serviceId) {
    return `${getServicePath(serviceId, targetLocale)}${normalizeHash(hash)}`;
  }

  const legalPageId = getLegalPageIdFromPath(pathname);
  if (legalPageId) {
    return `${getLegalPath(legalPageId, targetLocale)}${normalizeHash(hash)}`;
  }

  return getHomePath(targetLocale, hash);
};

export const getAllServicePaths = () => SERVICE_PATHS;
export const getAllLegalPaths = () => LEGAL_PATHS;

export const getServicePageRouteEntries = () => {
  const serviceIds = Object.keys(SERVICE_PATHS) as ServicePageId[];
  return serviceIds.flatMap((serviceId) => [
    { serviceId, locale: 'es' as SiteLocale, path: SERVICE_PATHS[serviceId].es },
    { serviceId, locale: 'en' as SiteLocale, path: SERVICE_PATHS[serviceId].en },
  ]);
};

export const getLegalPageRouteEntries = () => {
  const pageIds = Object.keys(LEGAL_PATHS) as LegalPageId[];
  return pageIds.flatMap((pageId) => [
    { pageId, locale: 'es' as SiteLocale, path: LEGAL_PATHS[pageId].es },
    { pageId, locale: 'en' as SiteLocale, path: LEGAL_PATHS[pageId].en },
  ]);
};
