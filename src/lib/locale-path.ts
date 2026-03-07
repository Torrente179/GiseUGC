export type SiteLocale = 'es' | 'en';

export const getLocaleFromPath = (pathname: string): SiteLocale =>
  pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es';

export const getCanonicalLocaleHref = (locale: SiteLocale, hash = ''): string => {
  const normalizedHash = hash.startsWith('#') ? hash : '';
  if (locale === 'en') {
    return `/en/${normalizedHash}`;
  }

  return `/${normalizedHash}`;
};
