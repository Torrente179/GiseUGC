import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { LocaleProvider } from '@/lib/locale-context';
import ManifestoChapter from '@/components/chapters/ManifestoChapter';
import { CONTENT_DATES, LLMS_LAST_UPDATED } from '@/data/content-dates';
import {
  FIVERR_RATING_DISTRIBUTION,
  SITE_PROOF,
} from '@/data/site-proof';

const root = resolve(process.cwd());
const read = (relative: string) => readFileSync(resolve(root, relative), 'utf8');

const extractJsonLd = (html: string) => {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/u);
  if (!match?.[1]) throw new Error('Missing JSON-LD script');
  return JSON.parse(match[1]) as { '@graph': Array<Record<string, unknown>> };
};

const renderManifesto = (path: string) =>
  renderToStaticMarkup(
    <StaticRouter location={path}>
      <LocaleProvider>
        <ManifestoChapter />
      </LocaleProvider>
    </StaticRouter>,
  );

describe('site proof figures stay internally consistent', () => {
  it('Fiverr star buckets add up to the advertised review count', () => {
    const total = FIVERR_RATING_DISTRIBUTION.reduce((sum, row) => sum + row.count, 0);
    expect(total).toBe(SITE_PROOF.fiverrReviewCount);
  });
});

describe('homepage prerender emits real proof, not zeros', () => {
  it('Spanish manifesto HTML includes 28+, 173, 4.8 and ES+EN', () => {
    const html = renderManifesto('/');
    expect(html).toContain('28+');
    expect(html).toContain('173');
    expect(html).toContain('4.8');
    expect(html).toContain('ES+EN');
    expect(html).not.toMatch(/>0\+<|>0%<|>0M\+/u);
    expect(html).toContain('Marcas');
    expect(html).toContain('Reseñas en Fiverr');
  });

  it('English manifesto HTML uses the same numerals', () => {
    const html = renderManifesto('/en/');
    expect(html).toContain('28+');
    expect(html).toContain('173');
    expect(html).toContain('4.8');
    expect(html).toContain('Fiverr reviews');
  });
});

describe('homepage schema matches visible Fiverr proof', () => {
  it.each(['index.html', 'en/index.html'])('%s has AggregateRating 4.8/173 and no invented reviews', (file) => {
    const graph = extractJsonLd(read(file));
    const business = graph['@graph'].find((node) => node['@type'] === 'ProfessionalService');
    expect(business).toBeTruthy();
    expect(business?.review).toBeUndefined();
    expect(JSON.stringify(business)).not.toContain('reviewBody');
    expect(business?.aggregateRating).toMatchObject({
      '@type': 'AggregateRating',
      ratingValue: String(SITE_PROOF.fiverrRating),
      reviewCount: String(SITE_PROOF.fiverrReviewCount),
      bestRating: '5',
      worstRating: '1',
    });
    const webpage = graph['@graph'].find((node) => node['@type'] === 'WebPage');
    expect(webpage?.dateModified).toBe(CONTENT_DATES.home);
  });

  it('does not hide a second copy of the page in .boot-seo', () => {
    expect(read('index.html')).not.toContain('boot-seo');
    expect(read('en/index.html')).not.toContain('boot-seo');
  });
});

describe('sitemap lastmod and llms dates are honest', () => {
  it('maps each sitemap URL family to CONTENT_DATES', () => {
    const xml = read('public/sitemap.xml');
    const blocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gu)];
    expect(blocks.length).toBeGreaterThan(10);

    const lastmodFor = (loc: string) => {
      const normalized = loc.replace(/\/$/u, '');
      if (normalized === 'https://www.giselasaldarriaga.com' || normalized === 'https://www.giselasaldarriaga.com/en') {
        return CONTENT_DATES.home;
      }
      if (loc.includes('/servicios/') || loc.includes('/services/')) return CONTENT_DATES.services;
      if (loc.includes('/verticales/') || loc.includes('/verticals/')) return CONTENT_DATES.verticals;
      if (loc.includes('/recursos/') || loc.includes('/resources/')) return CONTENT_DATES.resources;
      return CONTENT_DATES.legal;
    };

    for (const block of blocks) {
      const loc = block[1].match(/<loc>([^<]+)<\/loc>/u)?.[1];
      const lastmod = block[1].match(/<lastmod>([^<]+)<\/lastmod>/u)?.[1];
      expect(loc).toBeTruthy();
      expect(lastmod).toBe(lastmodFor(loc!));
    }
  });

  it('keeps llms Last-Updated in lockstep with the homepage date', () => {
    for (const file of ['public/llms.txt', 'public/llms-full.txt']) {
      const text = read(file);
      expect(text).toContain(`Last-Updated: ${LLMS_LAST_UPDATED}`);
      expect(text).toContain(`${SITE_PROOF.brandCampaigns}+ active brand campaigns`);
      expect(text).toContain(`${SITE_PROOF.fiverrReviewCount} reviews on Fiverr`);
      expect(text).toContain(`${SITE_PROOF.fiverrRating}/5`);
      expect(text).not.toMatch(/50\+ active brand/u);
    }
  });
});

describe('IndexNow ping list includes resource URLs', () => {
  it('lists every resource path and has a committed key file', () => {
    const script = read('scripts/indexnow-ping.sh');
    expect(script).toContain('/recursos/que-es-ugc/');
    expect(script).toContain('/en/resources/what-is-ugc/');
    expect(script).toContain('/recursos/formatos-ugc-ads/');
    expect(script).toContain('llms-full.txt');
    expect(read('public/bc6e18cf87bf49fcc1ad22e759c161ac.txt').trim()).toBe(
      'bc6e18cf87bf49fcc1ad22e759c161ac',
    );
  });
});
