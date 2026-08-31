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
  getHubPath,
  getAllEntrypointPaths,
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
    ['/servicios/ugc-lifestyle/', 'es'],
    ['/en', 'en'],
    ['/en/', 'en'],
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
    ['/servicios/ugc-lifestyle/', false],
    ['/en/services/bilingual-ugc-creator/', false],
  ])('treats %s as home=%s', (path, expected) => {
    expect(isHomePath(path)).toBe(expected);
  });
});

const allRouteEntries = [
  ...getServicePageRouteEntries(),
  ...getVerticalPageRouteEntries(),
  ...getResourcePageRouteEntries(),
  ...getLegalPageRouteEntries(),
  ...getHubPageRouteEntries(),
];

describe('route entries', () => {
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

  it('every hub route entry resolves back to its id and is not a child landing', () => {
    for (const entry of getHubPageRouteEntries()) {
      expect(getHubPageIdFromPath(entry.path)).toBe(entry.hubId);
      expect(getLocaleFromPath(entry.path)).toBe(entry.locale);
      expect(getServicePageIdFromPath(entry.path)).toBeNull();
      expect(getVerticalPageIdFromPath(entry.path)).toBeNull();
      expect(getResourcePageIdFromPath(entry.path)).toBeNull();
    }
  });

  it('has no colliding normalized paths across all locales/sections', () => {
    const normalized = allRouteEntries.map((e) => normalizePathname(e.path));
    expect(new Set(normalized).size).toBe(normalized.length);
  });
});

describe('getLocalizedPathForCurrentRoute', () => {
  it('round-trips a path to its counterpart in the other locale', () => {
    for (const entry of getServicePageRouteEntries()) {
      const target: SiteLocale = entry.locale === 'es' ? 'en' : 'es';
      const counterpart = getLocalizedPathForCurrentRoute(entry.path, target);
      // The counterpart must resolve to the same service id in the target locale.
      expect(getServicePageIdFromPath(counterpart)).toBe(entry.serviceId);
      expect(getLocaleFromPath(counterpart)).toBe(target);
    }
  });

  it('round-trips hub indexes to the paired locale', () => {
    for (const entry of getHubPageRouteEntries()) {
      const target: SiteLocale = entry.locale === 'es' ? 'en' : 'es';
      const counterpart = getLocalizedPathForCurrentRoute(entry.path, target);
      expect(getHubPageIdFromPath(counterpart)).toBe(entry.hubId);
      expect(normalizePathname(counterpart)).toBe(normalizePathname(getHubPath(entry.hubId, target)));
    }
  });

  it('falls back to the home path for an unknown route', () => {
    expect(normalizePathname(getLocalizedPathForCurrentRoute('/nope', 'en'))).toBe('/en');
    expect(normalizePathname(getLocalizedPathForCurrentRoute('/nope', 'es'))).toBe('/');
  });
});

describe('hub entrypoints', () => {
  it('registers six hub HTML inputs and does not treat them as home', () => {
    const inputs = getAllEntrypointPaths();
    expect(inputs['hub-services-es']).toBe('servicios/index.html');
    expect(inputs['hub-services-en']).toBe('en/services/index.html');
    expect(inputs['hub-verticals-es']).toBe('verticales/index.html');
    expect(inputs['hub-verticals-en']).toBe('en/verticals/index.html');
    expect(inputs['hub-resources-es']).toBe('recursos/index.html');
    expect(inputs['hub-resources-en']).toBe('en/resources/index.html');
    expect(isHomePath('/servicios/')).toBe(false);
    expect(isHomePath('/en/services/')).toBe(false);
  });
});
