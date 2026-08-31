import { describe, it, expect } from 'vitest';
import {
  normalizePathname,
  getLocaleFromPath,
  isHomePath,
  getLocalizedPathForCurrentRoute,
  getServicePageRouteEntries,
  getVerticalPageRouteEntries,
  getResourcePageRouteEntries,
  getLegalPageRouteEntries,
  getHubPageRouteEntries,
  getServicePageIdFromPath,
  getVerticalPageIdFromPath,
  getResourcePageIdFromPath,
  getLegalPageIdFromPath,
  getHubPageIdFromPath,
  type SiteLocale,
} from './locale-path';

describe('normalizePathname', () => {
  it('returns root for empty input', () => {
    expect(normalizePathname('')).toBe('/');
  });

  it('strips a trailing slash (except root)', () => {
    expect(normalizePathname('/servicios/ugc-lifestyle/')).toBe('/servicios/ugc-lifestyle');
    expect(normalizePathname('/')).toBe('/');
    expect(normalizePathname('/en/')).toBe('/en');
  });

  it('drops query and hash and adds a leading slash', () => {
    expect(normalizePathname('servicios/x?lng=en#a')).toBe('/servicios/x');
  });
});

describe('getLocaleFromPath', () => {
  it.each([
    ['/', 'es'],
    ['/servicios/', 'es'],
    ['/servicios/ugc-lifestyle/', 'es'],
    ['/en', 'en'],
    ['/en/', 'en'],
    ['/en/services/', 'en'],
    ['/en/services/bilingual-ugc-creator/', 'en'],
  ])('resolves %s to %s', (path, locale) => {
    expect(getLocaleFromPath(path)).toBe(locale);
  });

  it('does not treat /english-ish paths as the en locale', () => {
    // Guards against a naive `startsWith('/en')` that would misfire.
    expect(getLocaleFromPath('/enterprise')).toBe('es');
  });
});

describe('isHomePath', () => {
  it.each([
    ['/', true],
    ['/en', true],
    ['/en/', true],
    ['/servicios/', false],
    ['/servicios/ugc-lifestyle/', false],
    ['/en/services/', false],
    ['/en/services/bilingual-ugc-creator/', false],
  ])('treats %s as home=%s', (path, expected) => {
    expect(isHomePath(path)).toBe(expected);
  });
});

const allRouteEntries = [
  ...getHubPageRouteEntries(),
  ...getServicePageRouteEntries(),
  ...getVerticalPageRouteEntries(),
  ...getResourcePageRouteEntries(),
  ...getLegalPageRouteEntries(),
];

describe('route entries', () => {
  it('every hub route entry resolves back to its id and not a child page', () => {
    for (const entry of getHubPageRouteEntries()) {
      expect(getHubPageIdFromPath(entry.path)).toBe(entry.hubId);
      expect(getLocaleFromPath(entry.path)).toBe(entry.locale);
      expect(getServicePageIdFromPath(entry.path)).toBeNull();
      expect(getVerticalPageIdFromPath(entry.path)).toBeNull();
      expect(getResourcePageIdFromPath(entry.path)).toBeNull();
    }
  });

  it('every service route entry resolves back to its id', () => {
    for (const entry of getServicePageRouteEntries()) {
      expect(getServicePageIdFromPath(entry.path)).toBe(entry.serviceId);
      expect(getLocaleFromPath(entry.path)).toBe(entry.locale);
    }
  });

  it('every vertical route entry resolves back to its id', () => {
    for (const entry of getVerticalPageRouteEntries()) {
      expect(getVerticalPageIdFromPath(entry.path)).toBe(entry.verticalId);
      expect(getLocaleFromPath(entry.path)).toBe(entry.locale);
    }
  });

  it('every resource route entry resolves back to its id', () => {
    for (const entry of getResourcePageRouteEntries()) {
      expect(getResourcePageIdFromPath(entry.path)).toBe(entry.resourceId);
      expect(getLocaleFromPath(entry.path)).toBe(entry.locale);
    }
  });

  it('every legal route entry resolves back to its id', () => {
    for (const entry of getLegalPageRouteEntries()) {
      expect(getLegalPageIdFromPath(entry.path)).toBe(entry.pageId);
      expect(getLocaleFromPath(entry.path)).toBe(entry.locale);
    }
  });

  it('has no colliding normalized paths across all locales/sections', () => {
    const normalized = allRouteEntries.map((e) => normalizePathname(e.path));
    expect(new Set(normalized).size).toBe(normalized.length);
  });
});

describe('getLocalizedPathForCurrentRoute', () => {
  it('round-trips a hub path to its counterpart in the other locale', () => {
    expect(getLocalizedPathForCurrentRoute('/servicios/', 'en')).toBe('/en/services/');
    expect(getLocalizedPathForCurrentRoute('/en/verticals/', 'es')).toBe('/verticales/');
    expect(getLocalizedPathForCurrentRoute('/recursos/', 'en')).toBe('/en/resources/');
  });

  it('round-trips a path to its counterpart in the other locale', () => {
    for (const entry of getServicePageRouteEntries()) {
      const target: SiteLocale = entry.locale === 'es' ? 'en' : 'es';
      const counterpart = getLocalizedPathForCurrentRoute(entry.path, target);
      // The counterpart must resolve to the same service id in the target locale.
      expect(getServicePageIdFromPath(counterpart)).toBe(entry.serviceId);
      expect(getLocaleFromPath(counterpart)).toBe(target);
    }
  });

  it('falls back to the home path for an unknown route', () => {
    expect(normalizePathname(getLocalizedPathForCurrentRoute('/nope', 'en'))).toBe('/en');
    expect(normalizePathname(getLocalizedPathForCurrentRoute('/nope', 'es'))).toBe('/');
  });
});
