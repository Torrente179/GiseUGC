import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type APIRequestContext } from '@playwright/test';
import {
  buildReport,
  checkPage,
  formatReport,
  loadSitemapXml,
  normalizeUrl,
  parseSitemapXml,
  toFetchUrl,
  type PageSnapshot,
  type SitemapUrl,
} from './seo-crawl-trust';

const PRODUCTION_ORIGIN = 'https://www.giselasaldarriaga.com';

const bypassHeaders = (): Record<string, string> => {
  const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  if (!secret) return {};
  return {
    'x-vercel-protection-bypass': secret,
    'x-vercel-set-bypass-cookie': 'samesitenone',
  };
};

const fetchOriginOf = (baseURL: string | undefined): string => {
  if (baseURL) return new URL(baseURL).origin;
  if (existsSync(resolve(process.cwd(), 'dist/index.html'))) return 'http://127.0.0.1:4173';
  return PRODUCTION_ORIGIN;
};

const getText = async (
  request: APIRequestContext,
  url: string,
): Promise<{ status: number; body: string }> => {
  const response = await request.get(url, {
    headers: {
      Accept: 'text/html,application/xml;q=0.9,*/*;q=0.8',
      ...bypassHeaders(),
    },
    maxRedirects: 5,
  });
  return { status: response.status(), body: await response.text() };
};

test.describe.configure({ mode: 'serial' });

test('sitemap pages keep crawl-trust in raw HTML', async ({ request, baseURL }) => {
  const started = Date.now();
  const fetchOrigin = fetchOriginOf(baseURL);
  let sitemapXml = '';
  try {
    const sitemapResponse = await getText(request, toFetchUrl(`${PRODUCTION_ORIGIN}/sitemap.xml`, fetchOrigin));
    if (sitemapResponse.status === 200) sitemapXml = sitemapResponse.body;
  } catch {
    sitemapXml = '';
  }
  const urls: SitemapUrl[] = parseSitemapXml(loadSitemapXml(fetchOrigin, sitemapXml));
  expect(urls.length, 'sitemap should list the bilingual route set').toBeGreaterThan(0);

  const sitemapLocs = new Set(urls.map((entry) => entry.loc));
  const snapshots: PageSnapshot[] = [];
  const hreflangStatusByPublicUrl = new Map<string, number>();

  for (const entry of urls) {
    const fetchUrl = toFetchUrl(entry.loc, fetchOrigin);
    const { status, body } = await getText(request, fetchUrl);
    snapshots.push({
      loc: entry.loc,
      fetchUrl,
      status,
      html: body,
      alternatesFromSitemap: entry.alternates,
    });
    hreflangStatusByPublicUrl.set(entry.loc, status);
  }

  for (const snapshot of snapshots) {
    const hrefs = new Set(Object.values(snapshot.alternatesFromSitemap).map((href) => normalizeUrl(href)));
    for (const href of hrefs) {
      if (hreflangStatusByPublicUrl.has(href)) continue;
      const { status } = await getText(request, toFetchUrl(href, fetchOrigin));
      hreflangStatusByPublicUrl.set(href, status);
    }
  }

  const failures = snapshots.flatMap((snapshot) =>
    checkPage(snapshot, sitemapLocs, hreflangStatusByPublicUrl),
  );
  const report = buildReport(fetchOrigin, snapshots, failures, Date.now() - started);
  console.log(`\n${formatReport(report)}\n`);

  expect(failures, formatReport(report)).toEqual([]);
});
