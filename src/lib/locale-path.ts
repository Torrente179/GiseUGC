export type SiteLocale = 'es' | 'en';
export type ServicePageId = 'bilingual-ugc-creator' | 'spokesperson-videos' | 'ugc-ads-tiktok-meta';

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

export const getServicePageIdFromPath = (pathname: string): ServicePageId | null => {
  const normalized = normalizePathname(pathname);
  const entries = Object.entries(SERVICE_PATHS) as Array<[ServicePageId, Record<SiteLocale, string>]>;

  for (const [serviceId, localeMap] of entries) {
    if (normalizePathname(localeMap.es) === normalized || normalizePathname(localeMap.en) === normalized) {
      return serviceId;
    }
  }

  return null;
};

export const getLocalizedPathForCurrentRoute = (
  pathname: string,
  targetLocale: SiteLocale,
  hash = '',
): string => {
  const serviceId = getServicePageIdFromPath(pathname);
  if (serviceId) {
    return `${getServicePath(serviceId, targetLocale)}${normalizeHash(hash)}`;
  }

  return getHomePath(targetLocale, hash);
};

export const getAllServicePaths = () => SERVICE_PATHS;

export const getServicePageRouteEntries = () => {
  const serviceIds = Object.keys(SERVICE_PATHS) as ServicePageId[];
  return serviceIds.flatMap((serviceId) => [
    { serviceId, locale: 'es' as SiteLocale, path: SERVICE_PATHS[serviceId].es },
    { serviceId, locale: 'en' as SiteLocale, path: SERVICE_PATHS[serviceId].en },
  ]);
};
