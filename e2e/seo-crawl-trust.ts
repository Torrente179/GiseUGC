/**
 * Crawl-trust checks over raw prerendered HTML. No page JS is executed:
 * callers must feed in the HTTP response body as received.
 *
 * Targeted at the bugs this gate exists to catch:
 * - animated-zero proof numerals (0 marcas / 0% / empty .mf-value)
 * - duplicate H2s from dual viewport shells (#29)
 * - FAQPage / AggregateRating that do not match visible text
 * - broken hreflang / canonical
 * - GiseUGC leaking into crawlable HTML
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { FIVERR_AGGREGATE_RATING, SITE_PROOF } from '../src/data/site-proof';

export const SITE_ORIGIN = 'https://www.giselasaldarriaga.com';
export const DEFAULT_PRODUCTION_ORIGIN = SITE_ORIGIN;
export const GITHUB_REPO_URL = 'https://github.com/Torrente179/GiseUGC';

export const STAT_SELECTORS = {
  manifestoCard: '.mf-card',
  manifestoValue: '.mf-value',
  manifestoLabel: '.mf-label',
  heroRailItem: '.feed-hero__rail-item',
  heroRailValue: '.feed-hero__rail-value',
  reelPhoneAction: '.reel-phone__action',
} as const;

/** Placeholder copy that means the count-up never wrote the real numeral. */
const PLACEHOLDER_STAT_PHRASES =
  /\b0\s+marcas\b|\b0\s+vistas\b|\b0\s+brands\b|\b0\s+views\b|\b0%/iu;

const PLACEHOLDER_STAT_VALUE = /^(?:0\+?|0\.0|0%)$/u;

export type CheckName =
  | 'h1'
  | 'h2'
  | 'stats'
  | 'faq'
  | 'aggregateRating'
  | 'hreflang'
  | 'giseugc';

export type CheckFailure = {
  check: CheckName;
  url: string;
  detail: string;
};

export type PageSnapshot = {
  loc: string;
  fetchUrl: string;
  status: number;
  html: string;
  alternatesFromSitemap: Record<string, string>;
};

export type SitemapUrl = {
  loc: string;
  alternates: Record<string, string>;
};

export type GateReport = {
  target: string;
  pageCount: number;
  durationMs: number;
  failures: CheckFailure[];
  perCheck: Record<CheckName, { pass: number; fail: number; failedUrls: string[] }>;
};

export const CHECKS: CheckName[] = [
  'h1',
  'h2',
  'stats',
  'faq',
  'aggregateRating',
  'hreflang',
  'giseugc',
];

export const normalizeWs = (value: string): string => value.replace(/\s+/gu, ' ').trim();

export const decodeEntities = (value: string): string =>
  value
    .replace(/&nbsp;/giu, ' ')
    .replace(/&quot;/giu, '"')
    .replace(/&#x27;/giu, "'")
    .replace(/&apos;/giu, "'")
    .replace(/&amp;/giu, '&')
    .replace(/&lt;/giu, '<')
    .replace(/&gt;/giu, '>')
    .replace(/&#(\d+);/gu, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/giu, (_, hex: string) => String.fromCharCode(Number.parseInt(hex, 16)));

const INLINE_TAGS = 'a|b|strong|em|i|span|mark|u|small|code|sup|sub';

export const stripTags = (html: string): string =>
  decodeEntities(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, ' ')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, ' ')
      // Inline wrappers (links around "creadora UGC.") must not inject a space
      // before the following punctuation — that was a false FAQ mismatch.
      .replace(new RegExp(`</?(?:${INLINE_TAGS})\\b[^>]*>`, 'giu'), '')
      .replace(/<[^>]+>/gu, ' ')
      .replace(/\s+([.,;:!?])/gu, '$1'),
  );

export const normalizeText = (htmlOrText: string): string => normalizeWs(stripTags(htmlOrText));

export const normalizeUrl = (value: string): string => {
  const url = new URL(value);
  url.hash = '';
  if (url.pathname !== '/' && !url.pathname.endsWith('/')) {
    url.pathname = `${url.pathname}/`;
  }
  url.hostname = url.hostname.replace(/^www\./u, 'www.');
  if (url.hostname === 'giselasaldarriaga.com') url.hostname = 'www.giselasaldarriaga.com';
  url.search = '';
  return url.href;
};

export const publicLocFromFetchUrl = (fetchUrl: string, fetchOrigin: string): string => {
  const fetched = new URL(fetchUrl);
  const origin = new URL(fetchOrigin);
  if (fetched.origin === origin.origin && origin.origin !== new URL(SITE_ORIGIN).origin) {
    return normalizeUrl(`${SITE_ORIGIN}${fetched.pathname}`);
  }
  return normalizeUrl(fetchUrl);
};

export const toFetchUrl = (loc: string, fetchOrigin: string): string => {
  const publicUrl = new URL(loc);
  const origin = new URL(fetchOrigin.endsWith('/') ? fetchOrigin : `${fetchOrigin}/`);
  return new URL(`${publicUrl.pathname}${publicUrl.search}`, origin).href;
};

export const parseSitemapXml = (xml: string): SitemapUrl[] => {
  const locBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/giu)];
  return locBlocks.map((block) => {
    const body = block[1] ?? '';
    const loc = normalizeUrl((body.match(/<loc>\s*([^<\s]+)\s*<\/loc>/u)?.[1] ?? '').trim());
    const alternates: Record<string, string> = {};
    for (const link of body.matchAll(
      /<xhtml:link\b[^>]*\bhreflang="([^"]+)"[^>]*\bhref="([^"]+)"|<xhtml:link\b[^>]*\bhref="([^"]+)"[^>]*\bhreflang="([^"]+)"/giu,
    )) {
      const lang = (link[1] ?? link[4] ?? '').toLowerCase();
      const href = link[2] ?? link[3] ?? '';
      if (lang && href) alternates[lang] = normalizeUrl(href);
    }
    return { loc, alternates };
  }).filter((entry) => entry.loc);
};

export const loadSitemapXml = (fetchOrigin: string, fetchedSitemap?: string): string => {
  if (fetchedSitemap && fetchedSitemap.includes('<urlset')) return fetchedSitemap;
  const distSitemap = resolve(process.cwd(), 'dist/sitemap.xml');
  const publicSitemap = resolve(process.cwd(), 'public/sitemap.xml');
  if (fetchOrigin.includes('127.0.0.1') || fetchOrigin.includes('localhost')) {
    if (existsSync(distSitemap)) return readFileSync(distSitemap, 'utf8');
  }
  if (existsSync(publicSitemap)) return readFileSync(publicSitemap, 'utf8');
  throw new Error(`No sitemap.xml found for ${fetchOrigin}`);
};

export const parseJsonLdBlocks = (html: string): unknown[] => {
  const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/giu)];
  const parsed: unknown[] = [];
  for (const block of blocks) {
    const raw = (block[1] ?? '').replace(/\\u003c/giu, '<').replace(/\\u003e/giu, '>').trim();
    if (!raw) continue;
    try {
      parsed.push(JSON.parse(raw));
    } catch {
      parsed.push({ __parseError: true, raw });
    }
  }
  return parsed;
};

const walkJsonLd = (node: unknown, visit: (value: Record<string, unknown>) => void): void => {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((item) => walkJsonLd(item, visit));
    return;
  }
  const record = node as Record<string, unknown>;
  visit(record);
  if (record['@graph']) walkJsonLd(record['@graph'], visit);
  if (record.mainEntity) walkJsonLd(record.mainEntity, visit);
};

export const extractFaqItems = (html: string): Array<{ question: string; answer: string }> => {
  const items: Array<{ question: string; answer: string }> = [];
  for (const block of parseJsonLdBlocks(html)) {
    walkJsonLd(block, (node) => {
      if (node['@type'] !== 'FAQPage') return;
      const entities = Array.isArray(node.mainEntity) ? node.mainEntity : [];
      for (const entity of entities) {
        if (!entity || typeof entity !== 'object') continue;
        const question = String((entity as { name?: unknown }).name ?? '');
        const accepted = (entity as { acceptedAnswer?: { text?: unknown } }).acceptedAnswer;
        const answer = String(accepted?.text ?? '');
        items.push({ question, answer });
      }
    });
  }
  return items;
};

export const extractAggregateRatings = (html: string): Array<Record<string, string>> => {
  const ratings: Array<Record<string, string>> = [];
  for (const block of parseJsonLdBlocks(html)) {
    walkJsonLd(block, (node) => {
      const type = node['@type'];
      const isRating =
        type === 'AggregateRating' ||
        (typeof node.ratingValue !== 'undefined' && typeof node.reviewCount !== 'undefined' && node.bestRating);
      if (!isRating && type !== 'AggregateRating') {
        if (node.aggregateRating && typeof node.aggregateRating === 'object') {
          walkJsonLd(node.aggregateRating, (inner) => {
            if (inner['@type'] === 'AggregateRating' || inner.ratingValue) {
              ratings.push({
                ratingValue: String(inner.ratingValue ?? ''),
                reviewCount: String(inner.reviewCount ?? ''),
                bestRating: String(inner.bestRating ?? ''),
                worstRating: String(inner.worstRating ?? ''),
              });
            }
          });
        }
        return;
      }
      if (type === 'AggregateRating' || (node.ratingValue && node.reviewCount)) {
        ratings.push({
          ratingValue: String(node.ratingValue ?? ''),
          reviewCount: String(node.reviewCount ?? ''),
          bestRating: String(node.bestRating ?? ''),
          worstRating: String(node.worstRating ?? ''),
        });
      }
    });
  }
  return ratings;
};

const headingTexts = (document: Document, tag: 'h1' | 'h2'): string[] =>
  [...document.querySelectorAll(tag)].map((node) => normalizeText(node.innerHTML));

const visiblePageText = (document: Document): string => {
  const clone = document.documentElement.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('script, style').forEach((node) => node.remove());
  return normalizeText(clone.innerHTML);
};

const isPlaceholderStatValue = (value: string): boolean => PLACEHOLDER_STAT_VALUE.test(value);

const isPlaceholderStatPhrase = (text: string): boolean => PLACEHOLDER_STAT_PHRASES.test(text);

const collectStatFailures = (document: Document): string[] => {
  const details: string[] = [];

  for (const card of document.querySelectorAll(STAT_SELECTORS.manifestoCard)) {
    const value = normalizeText(card.querySelector(STAT_SELECTORS.manifestoValue)?.textContent ?? '');
    const label = normalizeText(card.querySelector(STAT_SELECTORS.manifestoLabel)?.textContent ?? '');
    const combined = normalizeWs(`${value} ${label}`);
    if (!value) {
      details.push(`empty manifesto .mf-value for "${label || '(unlabelled)'}"`);
      continue;
    }
    if (isPlaceholderStatValue(value) || isPlaceholderStatPhrase(value) || isPlaceholderStatPhrase(combined)) {
      details.push(`placeholder manifesto stat "${value}" / "${label}"`);
    }
  }

  for (const item of document.querySelectorAll(STAT_SELECTORS.heroRailItem)) {
    if (item.tagName === 'BUTTON') continue;
    const value = normalizeText(item.querySelector(STAT_SELECTORS.heroRailValue)?.textContent ?? '');
    const aria = normalizeText(item.getAttribute('aria-label') ?? '');
    if (!value) {
      details.push(`empty hero rail .feed-hero__rail-value${aria ? ` (${aria})` : ''}`);
      continue;
    }
    if (isPlaceholderStatValue(value) || isPlaceholderStatPhrase(value) || isPlaceholderStatPhrase(aria)) {
      details.push(`placeholder hero rail stat "${value}"${aria ? ` / "${aria}"` : ''}`);
    }
  }

  for (const action of document.querySelectorAll(STAT_SELECTORS.reelPhoneAction)) {
    const value = normalizeText(action.querySelector('span')?.textContent ?? '');
    const aria = normalizeText(action.getAttribute('aria-label') ?? '');
    const looksLikeProof =
      /\b(marcas|brands|reseñas|reviews|vistas|views)\b/iu.test(aria) || isPlaceholderStatValue(value);
    if (!looksLikeProof) continue;
    if (!value) {
      details.push(`empty reel-phone proof chip${aria ? ` (${aria})` : ''}`);
      continue;
    }
    if (isPlaceholderStatValue(value) || isPlaceholderStatPhrase(aria) || isPlaceholderStatPhrase(value)) {
      details.push(`placeholder reel-phone stat "${value}"${aria ? ` / "${aria}"` : ''}`);
    }
  }

  return details;
};

const giseugcHits = (html: string): string[] => {
  const withoutRepo = html
    .replace(/https?:\/\/github\.com\/Torrente179\/GiseUGC/giu, '')
    .replace(/github\.com\/Torrente179\/GiseUGC/giu, '');
  return withoutRepo.match(/giseugc/giu) ?? [];
};

export const expectedAggregateRating = () => ({
  ratingValue: String(SITE_PROOF.fiverrRating),
  reviewCount: String(SITE_PROOF.fiverrReviewCount),
  bestRating: FIVERR_AGGREGATE_RATING.bestRating,
  worstRating: FIVERR_AGGREGATE_RATING.worstRating,
});

export const checkPage = (
  snapshot: PageSnapshot,
  sitemapLocs: Set<string>,
  hreflangStatuses: Map<string, number>,
): CheckFailure[] => {
  const failures: CheckFailure[] = [];
  const fail = (check: CheckName, detail: string) => {
    failures.push({ check, url: snapshot.loc, detail });
  };

  if (snapshot.status !== 200) {
    fail('hreflang', `page fetch returned ${snapshot.status} for ${snapshot.fetchUrl}`);
    return failures;
  }

  const dom = new JSDOM(snapshot.html, { url: snapshot.loc, runScripts: undefined });
  const { document } = dom.window;

  const h1s = headingTexts(document, 'h1');
  if (h1s.length !== 1) {
    fail('h1', `expected exactly one <h1>, found ${h1s.length}${h1s.length ? `: ${h1s.map((text) => JSON.stringify(text)).join('; ')}` : ''}`);
  }

  const h2s = headingTexts(document, 'h2');
  const seenH2 = new Map<string, number>();
  for (const text of h2s) {
    if (!text) continue;
    seenH2.set(text, (seenH2.get(text) ?? 0) + 1);
  }
  const duplicateH2s = [...seenH2.entries()].filter(([, count]) => count > 1);
  if (duplicateH2s.length > 0) {
    fail(
      'h2',
      `repeated <h2> text: ${duplicateH2s
        .map(([text, count]) => `${JSON.stringify(text)} ×${count}`)
        .join('; ')}`,
    );
  }

  for (const detail of collectStatFailures(document)) {
    fail('stats', detail);
  }

  const visible = visiblePageText(document);
  for (const faq of extractFaqItems(snapshot.html)) {
    const question = normalizeText(faq.question);
    const answer = normalizeText(faq.answer);
    if (question && !visible.includes(question)) {
      fail('faq', `FAQPage question not in visible text: ${JSON.stringify(question)}`);
    }
    if (answer && !visible.includes(answer)) {
      fail('faq', `FAQPage acceptedAnswer not in visible text: ${JSON.stringify(answer.slice(0, 180))}`);
    }
  }

  const expected = expectedAggregateRating();
  for (const rating of extractAggregateRatings(snapshot.html)) {
    if (rating.ratingValue !== expected.ratingValue || rating.reviewCount !== expected.reviewCount) {
      fail(
        'aggregateRating',
        `AggregateRating ${rating.ratingValue}/${rating.reviewCount} does not match site-proof.ts ${expected.ratingValue}/${expected.reviewCount}`,
      );
    }
    if (rating.bestRating && rating.bestRating !== expected.bestRating) {
      fail('aggregateRating', `AggregateRating bestRating ${rating.bestRating} !== ${expected.bestRating}`);
    }
    if (rating.worstRating && rating.worstRating !== expected.worstRating) {
      fail('aggregateRating', `AggregateRating worstRating ${rating.worstRating} !== ${expected.worstRating}`);
    }
  }

  const canonicalHref = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const canonical = canonicalHref ? normalizeUrl(canonicalHref) : '';
  if (canonical !== snapshot.loc) {
    fail('hreflang', `canonical ${canonical || '(missing)'} !== page URL ${snapshot.loc}`);
  }

  const hreflang: Record<string, string> = {};
  for (const link of document.querySelectorAll('link[rel="alternate"][hreflang]')) {
    const lang = (link.getAttribute('hreflang') ?? '').toLowerCase();
    const href = link.getAttribute('href');
    if (!lang || !href) continue;
    hreflang[lang] = normalizeUrl(href);
  }

  const locale = new URL(snapshot.loc).pathname.startsWith('/en/') ? 'en' : 'es';
  const twinLocale = locale === 'es' ? 'en' : 'es';
  if (!hreflang[locale]) {
    fail('hreflang', `missing self-language hreflang="${locale}"`);
  } else if (hreflang[locale] !== snapshot.loc) {
    fail('hreflang', `hreflang="${locale}" ${hreflang[locale]} is not self-referencing (${snapshot.loc})`);
  }
  if (!hreflang[twinLocale]) {
    fail('hreflang', `missing reciprocal hreflang="${twinLocale}"`);
  }
  const sitemapTwin = snapshot.alternatesFromSitemap[twinLocale];
  if (sitemapTwin && hreflang[twinLocale] && hreflang[twinLocale] !== sitemapTwin) {
    fail('hreflang', `hreflang="${twinLocale}" ${hreflang[twinLocale]} !== sitemap twin ${sitemapTwin}`);
  }
  if (!hreflang['x-default']) {
    fail('hreflang', 'missing hreflang="x-default" (site uses x-default → ES)');
  } else {
    const expectedDefault = snapshot.alternatesFromSitemap['x-default'] || snapshot.alternatesFromSitemap.es;
    if (expectedDefault && hreflang['x-default'] !== expectedDefault) {
      fail('hreflang', `hreflang="x-default" ${hreflang['x-default']} !== ${expectedDefault}`);
    }
  }

  for (const [lang, href] of Object.entries(hreflang)) {
    if (!sitemapLocs.has(href)) {
      fail('hreflang', `hreflang="${lang}" target ${href} is not in the sitemap`);
    }
    const status = hreflangStatuses.get(href);
    if (status !== undefined && status !== 200) {
      fail('hreflang', `hreflang="${lang}" target ${href} returned ${status}`);
    }
  }

  const hits = giseugcHits(snapshot.html);
  if (hits.length > 0) {
    fail('giseugc', `found ${hits.length} GiseUGC occurrence(s) outside ${GITHUB_REPO_URL}`);
  }

  return failures;
};

export const emptyPerCheck = (): GateReport['perCheck'] =>
  Object.fromEntries(CHECKS.map((check) => [check, { pass: 0, fail: 0, failedUrls: [] }])) as GateReport['perCheck'];

export const buildReport = (
  target: string,
  snapshots: PageSnapshot[],
  failures: CheckFailure[],
  durationMs: number,
): GateReport => {
  const perCheck = emptyPerCheck();
  const failedByUrl = new Map<string, Set<CheckName>>();
  for (const failure of failures) {
    const set = failedByUrl.get(failure.url) ?? new Set<CheckName>();
    set.add(failure.check);
    failedByUrl.set(failure.url, set);
  }
  for (const snapshot of snapshots) {
    const failedChecks = failedByUrl.get(snapshot.loc) ?? new Set<CheckName>();
    for (const check of CHECKS) {
      if (failedChecks.has(check)) {
        perCheck[check].fail += 1;
        if (!perCheck[check].failedUrls.includes(snapshot.loc)) {
          perCheck[check].failedUrls.push(snapshot.loc);
        }
      } else {
        perCheck[check].pass += 1;
      }
    }
  }
  return {
    target,
    pageCount: snapshots.length,
    durationMs,
    failures,
    perCheck,
  };
};

export const formatReport = (report: GateReport): string => {
  const lines = [
    '=== SEO crawl-trust summary ===',
    `target: ${report.target}`,
    `pages: ${report.pageCount}`,
    `duration: ${(report.durationMs / 1000).toFixed(1)}s`,
    '',
  ];
  for (const check of CHECKS) {
    const row = report.perCheck[check];
    const status = row.fail === 0 ? 'PASS' : 'FAIL';
    lines.push(`${status} ${check} (${row.pass}/${report.pageCount} pass)`);
    for (const url of row.failedUrls) {
      lines.push(`  ${url}`);
      for (const failure of report.failures.filter((item) => item.check === check && item.url === url)) {
        lines.push(`    - ${failure.detail}`);
      }
    }
  }
  if (report.failures.length === 0) {
    lines.push('', 'All crawl-trust checks passed.');
  } else {
    lines.push('', `${report.failures.length} failure(s) across ${new Set(report.failures.map((item) => item.url)).size} URL(s).`);
  }
  return lines.join('\n');
};
