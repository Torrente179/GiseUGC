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
export type VerticalPageId =
  | 'beauty-ugc'
  | 'fashion-ugc'
  | 'tech-saas-ugc'
  | 'ecommerce-ugc'
  | 'lifestyle-wellness-ugc';
export type ResourcePageId =
  | 'what-is-ugc'
  | 'how-to-hire-ugc-creator'
  | 'ugc-vs-influencer-marketing'
  | 'ugc-ad-formats-guide';
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

const VERTICAL_PATHS: Record<VerticalPageId, Record<SiteLocale, string>> = {
  'beauty-ugc': {
    es: '/verticales/ugc-beauty/',
    en: '/en/verticals/beauty-ugc-creator/',
  },
  'fashion-ugc': {
    es: '/verticales/ugc-moda/',
    en: '/en/verticals/fashion-ugc-creator/',
  },
  'tech-saas-ugc': {
    es: '/verticales/ugc-tech-saas/',
    en: '/en/verticals/tech-saas-ugc-creator/',
  },
  'ecommerce-ugc': {
    es: '/verticales/ugc-ecommerce/',
    en: '/en/verticals/ecommerce-ugc-creator/',
  },
  'lifestyle-wellness-ugc': {
    es: '/verticales/ugc-lifestyle-bienestar/',
    en: '/en/verticals/lifestyle-wellness-ugc-creator/',
  },
};

const RESOURCE_PATHS: Record<ResourcePageId, Record<SiteLocale, string>> = {
  'what-is-ugc': {
    es: '/recursos/que-es-ugc/',
    en: '/en/resources/what-is-ugc/',
  },
  'how-to-hire-ugc-creator': {
    es: '/recursos/como-contratar-creadora-ugc/',
    en: '/en/resources/how-to-hire-ugc-creator/',
  },
  'ugc-vs-influencer-marketing': {
    es: '/recursos/ugc-vs-influencer-marketing/',
    en: '/en/resources/ugc-vs-influencer-marketing/',
  },
  'ugc-ad-formats-guide': {
    es: '/recursos/formatos-ugc-ads/',
    en: '/en/resources/ugc-ad-formats-guide/',
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
export const getVerticalPath = (verticalId: VerticalPageId, locale: SiteLocale): string => VERTICAL_PATHS[verticalId][locale];
export const getResourcePath = (resourceId: ResourcePageId, locale: SiteLocale): string => RESOURCE_PATHS[resourceId][locale];
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

export const getVerticalPageIdFromPath = (pathname: string): VerticalPageId | null =>
  getPageIdFromPath(pathname, VERTICAL_PATHS);

export const getResourcePageIdFromPath = (pathname: string): ResourcePageId | null =>
  getPageIdFromPath(pathname, RESOURCE_PATHS);

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

  const verticalId = getVerticalPageIdFromPath(pathname);
  if (verticalId) {
    return `${getVerticalPath(verticalId, targetLocale)}${normalizeHash(hash)}`;
  }

  const resourceId = getResourcePageIdFromPath(pathname);
  if (resourceId) {
    return `${getResourcePath(resourceId, targetLocale)}${normalizeHash(hash)}`;
  }

  const legalPageId = getLegalPageIdFromPath(pathname);
  if (legalPageId) {
    return `${getLegalPath(legalPageId, targetLocale)}${normalizeHash(hash)}`;
  }

  return getHomePath(targetLocale, hash);
};

export const getAllServicePaths = () => SERVICE_PATHS;
export const getAllVerticalPaths = () => VERTICAL_PATHS;
export const getAllResourcePaths = () => RESOURCE_PATHS;
export const getAllLegalPaths = () => LEGAL_PATHS;

export const getServicePageRouteEntries = () => {
  const serviceIds = Object.keys(SERVICE_PATHS) as ServicePageId[];
  return serviceIds.flatMap((serviceId) => [
    { serviceId, locale: 'es' as SiteLocale, path: SERVICE_PATHS[serviceId].es },
    { serviceId, locale: 'en' as SiteLocale, path: SERVICE_PATHS[serviceId].en },
  ]);
};

export const getVerticalPageRouteEntries = () => {
  const verticalIds = Object.keys(VERTICAL_PATHS) as VerticalPageId[];
  return verticalIds.flatMap((verticalId) => [
    { verticalId, locale: 'es' as SiteLocale, path: VERTICAL_PATHS[verticalId].es },
    { verticalId, locale: 'en' as SiteLocale, path: VERTICAL_PATHS[verticalId].en },
  ]);
};

export const getResourcePageRouteEntries = () => {
  const resourceIds = Object.keys(RESOURCE_PATHS) as ResourcePageId[];
  return resourceIds.flatMap((resourceId) => [
    { resourceId, locale: 'es' as SiteLocale, path: RESOURCE_PATHS[resourceId].es },
    { resourceId, locale: 'en' as SiteLocale, path: RESOURCE_PATHS[resourceId].en },
  ]);
};

export const getLegalPageRouteEntries = () => {
  const pageIds = Object.keys(LEGAL_PATHS) as LegalPageId[];
  return pageIds.flatMap((pageId) => [
    { pageId, locale: 'es' as SiteLocale, path: LEGAL_PATHS[pageId].es },
    { pageId, locale: 'en' as SiteLocale, path: LEGAL_PATHS[pageId].en },
  ]);
};

/* ════════════════════════════════════════════════════════════════════
   PAGE REGISTRY — single source of truth for "what pages exist"
   ────────────────────────────────────────────────────────────────────
   Every derived surface (Vite HTML inputs, sitemap.xml, llms.txt, the
   static boot shells, and in-app nav lists) is generated from or iterates
   over this registry so the page set can never drift between surfaces.
   This module stays pure TS (no React, no import.meta) so build tooling
   — vite.config.ts and the scripts/ generators — can import it directly.
   ════════════════════════════════════════════════════════════════════ */

export type PageFamily = 'home' | 'service' | 'vertical' | 'resource' | 'legal';

export type PageRegistryEntry = {
  family: PageFamily;
  /** Page id within its family. The single home page uses id 'home'. */
  id: string;
  /** Canonical editorial order within the family (insertion order of the path maps). */
  order: number;
  paths: Record<SiteLocale, string>;
};

const buildFamilyEntries = (
  family: PageFamily,
  paths: Record<string, Record<SiteLocale, string>>,
): PageRegistryEntry[] =>
  Object.entries(paths).map(([id, localePaths], order) => ({ family, id, order, paths: localePaths }));

export const PAGE_REGISTRY: PageRegistryEntry[] = [
  { family: 'home', id: 'home', order: 0, paths: HOME_PATHS },
  ...buildFamilyEntries('service', SERVICE_PATHS),
  ...buildFamilyEntries('vertical', VERTICAL_PATHS),
  ...buildFamilyEntries('resource', RESOURCE_PATHS),
  ...buildFamilyEntries('legal', LEGAL_PATHS),
];

export const SITE_LOCALES: readonly SiteLocale[] = ['es', 'en'] as const;

/** Map a canonical locale path to its static HTML entry file, relative to the project root. */
const entryFileForPath = (localePath: string): string => {
  const trimmed = localePath.replace(/^\/+|\/+$/g, '');
  return trimmed === '' ? 'index.html' : `${trimmed}/index.html`;
};

/** Stable, unique Rollup input key for a page + locale (used for chunk naming only). */
const entrypointKey = (entry: PageRegistryEntry, locale: SiteLocale): string =>
  `${entry.family}-${entry.id}-${locale}`;

/**
 * Vite `rollupOptions.input` map: key → root-relative HTML path, for every page in
 * both locales. Consumed by vite.config.ts so the 40+ MPA entrypoints are never
 * hand-listed.
 */
export const getAllEntrypointPaths = (): Record<string, string> => {
  const inputs: Record<string, string> = {};
  for (const entry of PAGE_REGISTRY) {
    for (const locale of SITE_LOCALES) {
      inputs[entrypointKey(entry, locale)] = entryFileForPath(entry.paths[locale]);
    }
  }
  return inputs;
};

const getFamilyIdsInOrder = (family: PageFamily): string[] =>
  PAGE_REGISTRY.filter((entry) => entry.family === family).map((entry) => entry.id);

/** Service ids in canonical registry order. Replaces hand-listed arrays in nav/footer. */
export const getServiceIdsInOrder = (): ServicePageId[] => getFamilyIdsInOrder('service') as ServicePageId[];
export const getVerticalIdsInOrder = (): VerticalPageId[] => getFamilyIdsInOrder('vertical') as VerticalPageId[];
export const getResourceIdsInOrder = (): ResourcePageId[] => getFamilyIdsInOrder('resource') as ResourcePageId[];
export const getLegalIdsInOrder = (): LegalPageId[] => getFamilyIdsInOrder('legal') as LegalPageId[];
