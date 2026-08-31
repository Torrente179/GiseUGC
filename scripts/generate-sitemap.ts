import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PAGE_REGISTRY,
  SITE_LOCALES,
  type PageFamily,
  type PageRegistryEntry,
  type SiteLocale,
} from '../src/lib/locale-path.ts';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.giselasaldarriaga.com';
const today = new Date().toISOString().slice(0, 10);

const FAMILY_SOURCES: Record<PageFamily, string[]> = {
  home: [
    'index.html',
    'en/index.html',
    'src/pages/Index.tsx',
    'src/components/chapters/ManifestoChapter.tsx',
    'src/locales/es/translation.json',
    'src/locales/en/translation.json',
  ],
  hub: ['src/components/HubIndexPage.tsx', 'src/data/hub-pages.ts', 'src/lib/locale-path.ts'],
  service: ['src/data/service-pages.ts'],
  vertical: ['src/data/vertical-pages.ts'],
  resource: ['src/data/resource-pages.ts'],
  legal: ['src/data/legal-pages.ts'],
};

const PRIORITY: Record<PageFamily, number> = {
  home: 1,
  hub: 0.72,
  service: 0.8,
  vertical: 0.75,
  resource: 0.7,
  legal: 0.35,
};

const CHANGEFREQ: Record<PageFamily, 'weekly' | 'monthly'> = {
  home: 'weekly',
  hub: 'weekly',
  service: 'weekly',
  vertical: 'weekly',
  resource: 'monthly',
  legal: 'monthly',
};

const entryFileForPath = (localePath: string): string => {
  const trimmed = localePath.replace(/^\/+|\/+$/gu, '');
  return trimmed === '' ? 'index.html' : `${trimmed}/index.html`;
};

const isDirty = (files: string[]): boolean => {
  try {
    const output = execFileSync('git', ['status', '--porcelain', '--', ...files], {
      cwd: projectRoot,
      encoding: 'utf8',
    });
    return output.trim().length > 0;
  } catch {
    return false;
  }
};

const gitLastmod = (files: string[]): string => {
  const existing = files.filter((file) => fs.existsSync(path.join(projectRoot, file)));
  if (existing.length === 0) return today;
  if (isDirty(existing)) return today;
  try {
    const output = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...existing], {
      cwd: projectRoot,
      encoding: 'utf8',
    }).trim();
    return output || today;
  } catch {
    return today;
  }
};

const xmlEscape = (value: string) =>
  value.replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/"/gu, '&quot;');

const locFor = (pagePath: string) => `${SITE}${pagePath}`;

const priorityFor = (entry: PageRegistryEntry, locale: SiteLocale): string => {
  if (entry.family === 'home') return locale === 'es' ? '1.0' : '0.9';
  return PRIORITY[entry.family].toFixed(2);
};

const renderUrl = (entry: PageRegistryEntry, locale: SiteLocale, lastmod: string) => {
  const loc = locFor(entry.paths[locale]);
  const es = locFor(entry.paths.es);
  const en = locFor(entry.paths.en);
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${xmlEscape(es)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${xmlEscape(en)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(es)}" />
    <lastmod>${lastmod}</lastmod>
    <changefreq>${CHANGEFREQ[entry.family]}</changefreq>
    <priority>${priorityFor(entry, locale)}</priority>
  </url>`;
};

const blocks: string[] = [];
for (const entry of PAGE_REGISTRY) {
  for (const locale of SITE_LOCALES) {
    const lastmod = gitLastmod([
      ...FAMILY_SOURCES[entry.family],
      entryFileForPath(entry.paths[locale]),
    ]);
    blocks.push(renderUrl(entry, locale, lastmod));
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${blocks.join('\n')}
</urlset>
`;

const outPath = path.join(projectRoot, 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml);
console.log(`Wrote ${blocks.length} sitemap URLs to public/sitemap.xml`);
