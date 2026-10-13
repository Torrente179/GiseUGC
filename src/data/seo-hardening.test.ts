import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getResourcePath } from '@/lib/locale-path';
import { buildSitemapXml, getSitemapLocs } from '@/lib/sitemap';

const root = resolve(process.cwd());
const read = (relative: string) => readFileSync(resolve(root, relative), 'utf8');

const INDEXNOW_KEY = 'bc6e18cf87bf49fcc1ad22e759c161ac';
const YOUTUBE_CHANNEL = 'https://www.youtube.com/@GiselaSaldarriaga';
const FIVERR_PROFILE = 'https://www.fiverr.com/gisela_sm';

const ES_HIRE_GUIDE = getResourcePath('how-to-hire-ugc-creator', 'es');
const EN_HIRE_GUIDE = getResourcePath('how-to-hire-ugc-creator', 'en');

type VercelRedirect = {
  source: string;
  destination: string;
  permanent?: boolean;
  statusCode?: number;
  has?: unknown[];
};

const vercel = JSON.parse(read('vercel.json')) as { redirects: VercelRedirect[] };

const extractJsonLd = (html: string) => {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/u);
  if (!match?.[1]) throw new Error('Missing JSON-LD script');
  return JSON.parse(match[1]) as { '@graph': Array<Record<string, unknown>> };
};

const personSameAs = (file: string): string[] => {
  const person = extractJsonLd(read(file))['@graph'].find((node) => node['@type'] === 'Person');
  expect(Array.isArray(person?.sameAs)).toBe(true);
  return person?.sameAs as string[];
};

describe('hire-intent alias redirects', () => {
  const expected: Array<{ source: string; destination: string }> = [
    { source: '/contratar', destination: ES_HIRE_GUIDE },
    { source: '/contratar/', destination: ES_HIRE_GUIDE },
    { source: '/hire', destination: EN_HIRE_GUIDE },
    { source: '/hire/', destination: EN_HIRE_GUIDE },
    { source: '/en/hire', destination: EN_HIRE_GUIDE },
    { source: '/en/hire/', destination: EN_HIRE_GUIDE },
  ];

  it('maps /contratar and /hire aliases to the live how-to-hire guides as 301s', () => {
    expect(ES_HIRE_GUIDE).toBe('/recursos/como-contratar-creadora-ugc/');
    expect(EN_HIRE_GUIDE).toBe('/en/resources/how-to-hire-ugc-creator/');

    for (const { source, destination } of expected) {
      const found = vercel.redirects.find((redirect) => redirect.source === source);
      expect(found, source).toBeTruthy();
      expect(found?.destination).toBe(destination);
      expect(found?.statusCode).toBe(301);
    }
  });

  it('does not add the alias paths to the sitemap', () => {
    const xml = buildSitemapXml();
    const locs = getSitemapLocs();
    const banned = ['/contratar', '/hire', '/en/hire'];
    for (const alias of banned) {
      expect(xml).not.toContain(`${alias}</loc>`);
      expect(xml).not.toContain(`${alias}/</loc>`);
      expect(locs.some((loc) => loc.includes(alias))).toBe(false);
    }
    expect(read('public/sitemap.xml')).not.toMatch(/\/contratar|\/hire/u);
  });
});

describe('Person sameAs includes YouTube without rewriting existing profiles', () => {
  it.each(['index.html', 'en/index.html'])('%s Person sameAs keeps Fiverr clean and adds YouTube', (file) => {
    const sameAs = personSameAs(file);
    expect(sameAs).toContain(FIVERR_PROFILE);
    expect(sameAs).toContain(YOUTUBE_CHANNEL);
    expect(sameAs.some((url) => url.includes('source=gig_page') || url.includes('fiverr.com/gisela_sm?'))).toBe(
      false,
    );
    expect(sameAs.filter((url) => url === FIVERR_PROFILE)).toHaveLength(1);
    expect(sameAs.filter((url) => url === YOUTUBE_CHANNEL)).toHaveLength(1);
  });
});

describe('IndexNow key file', () => {
  it('is present in public/, named for the key, and contains only that key', () => {
    const relative = `public/${INDEXNOW_KEY}.txt`;
    expect(read(relative).trim()).toBe(INDEXNOW_KEY);

    const keyFiles = readdirSync(resolve(root, 'public')).filter(
      (name) => name.endsWith('.txt') && !['robots.txt', 'llms.txt', 'llms-full.txt'].includes(name),
    );
    expect(keyFiles).toEqual([`${INDEXNOW_KEY}.txt`]);
    expect(INDEXNOW_KEY).toMatch(/^[0-9a-f]{32}$/u);
  });

  it('is what the ping script submits, from sitemap URLs only, fail-soft on main', () => {
    const script = read('scripts/indexnow-ping.sh');
    expect(script).toContain('public/sitemap.xml');
    expect(script).not.toContain('sitemap-video.xml');
    expect(read('public/robots.txt')).toContain('Sitemap: https://www.giselasaldarriaga.com/sitemap-video.xml');
    expect(script).toContain('https://api.indexnow.org/indexnow');
    expect(script).toContain('www.giselasaldarriaga.com');
    expect(script).toContain('keyLocation');
    expect(script).toContain('llms-full.txt');
    expect(script).toContain('--soft');
    expect(read('.github/workflows/indexnow.yml')).toContain('branches: [main]');
    expect(read('.github/workflows/indexnow.yml')).toContain('indexnow-ping.sh --soft');
  });
});
