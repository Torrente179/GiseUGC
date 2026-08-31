/**
 * Sitemap is a static file at /sitemap.xml (public/ → dist/). Production
 * never renders it through React. This module is the only writer so lastmod
 * stays on CONTENT_DATES and the URL set cannot drift from PAGE_REGISTRY.
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CONTENT_DATES, type ContentFamily } from '../data/content-dates';
import {
  PAGE_REGISTRY,
  SITE_LOCALES,
  type PageFamily,
  type SiteLocale,
} from './locale-path';

export const SITEMAP_ORIGIN = 'https://www.giselasaldarriaga.com';

const FAMILY_TO_DATES: Record<PageFamily, ContentFamily> = {
  home: 'home',
  hub: 'hubs',
  service: 'services',
  vertical: 'verticals',
  resource: 'resources',
  legal: 'legal',
};

const FAMILY_SITEMAP_META: Record<
  PageFamily,
  { changefreq: 'weekly' | 'monthly'; priority: (locale: SiteLocale) => string }
> = {
  home: { changefreq: 'weekly', priority: (locale) => (locale === 'es' ? '1.0' : '0.9') },
  hub: { changefreq: 'weekly', priority: () => '0.5' },
  service: { changefreq: 'weekly', priority: () => '0.8' },
  vertical: { changefreq: 'weekly', priority: () => '0.75' },
  resource: { changefreq: 'monthly', priority: () => '0.70' },
  legal: { changefreq: 'monthly', priority: () => '0.35' },
};

const absoluteUrl = (path: string) => `${SITEMAP_ORIGIN}${path}`;

const escapeXml = (value: string) =>
  value
    .replace(/&/gu, '&amp;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;')
    .replace(/"/gu, '&quot;');

export const lastmodForFamily = (family: PageFamily) => CONTENT_DATES[FAMILY_TO_DATES[family]];

export const getSitemapLocs = (): string[] =>
  PAGE_REGISTRY.flatMap((entry) => SITE_LOCALES.map((locale) => absoluteUrl(entry.paths[locale])));

export const buildSitemapXml = (): string => {
  const blocks = PAGE_REGISTRY.flatMap((entry) => {
    const es = absoluteUrl(entry.paths.es);
    const en = absoluteUrl(entry.paths.en);
    const lastmod = lastmodForFamily(entry.family);
    const meta = FAMILY_SITEMAP_META[entry.family];
    return SITE_LOCALES.map((locale) => {
      const loc = absoluteUrl(entry.paths[locale]);
      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${escapeXml(es)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${escapeXml(en)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(es)}" />
    <lastmod>${lastmod}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority(locale)}</priority>
  </url>`;
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${blocks.join('\n')}
</urlset>
`;

  if (!xml.startsWith('<?xml') || !xml.includes('<urlset') || blocks.length === 0) {
    throw new Error('sitemap generation failed: empty or invalid XML');
  }

  return xml;
};

export const writeSitemapFile = (root = process.cwd()): string => {
  const xml = buildSitemapXml();
  writeFileSync(resolve(root, 'public/sitemap.xml'), xml, 'utf8');
  return xml;
};
