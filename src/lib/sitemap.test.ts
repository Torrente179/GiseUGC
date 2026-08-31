import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { CONTENT_DATES } from '@/data/content-dates';
import { PAGE_REGISTRY, SITE_LOCALES } from '@/lib/locale-path';
import { buildSitemapXml, getSitemapLocs, lastmodForFamily, SITEMAP_ORIGIN } from '@/lib/sitemap';

const readSitemap = () => readFileSync(resolve(process.cwd(), 'public/sitemap.xml'), 'utf8');

describe('sitemap generator', () => {
  it('builds well-formed XML without throwing', () => {
    const xml = buildSitemapXml();
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    expect(() => new DOMParser().parseFromString(xml, 'application/xml')).not.toThrow();
    const parsed = new DOMParser().parseFromString(xml, 'application/xml');
    expect(parsed.querySelector('parsererror')).toBeNull();
  });

  it('lists only PAGE_REGISTRY URLs, in registry order, both locales', () => {
    const xml = buildSitemapXml();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => match[1]);
    const expected = PAGE_REGISTRY.flatMap((entry) =>
      SITE_LOCALES.map((locale) => `${SITEMAP_ORIGIN}${entry.paths[locale]}`),
    );
    expect(locs).toEqual(expected);
    expect(getSitemapLocs()).toEqual(expected);
  });

  it('stamps lastmod from CONTENT_DATES per family', () => {
    expect(lastmodForFamily('home')).toBe(CONTENT_DATES.home);
    expect(lastmodForFamily('hub')).toBe(CONTENT_DATES.hubs);
    expect(lastmodForFamily('service')).toBe(CONTENT_DATES.services);
    expect(lastmodForFamily('vertical')).toBe(CONTENT_DATES.verticals);
    expect(lastmodForFamily('resource')).toBe(CONTENT_DATES.resources);
    expect(lastmodForFamily('legal')).toBe(CONTENT_DATES.legal);
  });

  it('keeps the committed public/sitemap.xml identical to the generator', () => {
    expect(readSitemap()).toBe(buildSitemapXml());
  });
});
