import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { LocaleProvider } from '@/lib/locale-context';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import { getAllServiceIds, getServicePageContent } from '@/data/service-pages';
import { buildServiceLandingRouteData } from '@/data/landing-route-data.server';
import { FEATURED_REEL_CLIP_IDS } from '@/data/portfolio-clips';
import { VIDEO_SITEMAP_CURATED_CLIP_IDS } from '@/data/video-sitemap-curated';
import {
  assertSelectedVideoFields,
  buildVideoSitemapXml,
  collectExcludedVideos,
  collectHomeVideoObjects,
  selectCuratedSitemapVideos,
  writeVideoSitemapFile,
} from '@/lib/video-sitemap';
import { PAGE_REGISTRY } from '@/lib/locale-path';

const root = process.cwd();

const extractVideoObjects = (html: string) => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/giu)];
  const videos: Array<Record<string, unknown>> = [];
  for (const block of blocks) {
    const data = JSON.parse((block[1] ?? '').replace(/\\u003c/giu, '<')) as Record<string, unknown>;
    const graph = Array.isArray(data['@graph']) ? data['@graph'] : [data];
    for (const node of graph as Array<Record<string, unknown>>) {
      if (node['@type'] === 'VideoObject') videos.push(node);
    }
  }
  return videos;
};

describe('curated video sitemap', () => {
  it('lists each homepage featured clip once per locale on the homepage twins', () => {
    const home = collectHomeVideoObjects(root);
    expect(home.filter((video) => video.locale === 'es')).toHaveLength(4);
    expect(home.filter((video) => video.locale === 'en')).toHaveLength(4);
    const entries = selectCuratedSitemapVideos(root);
    expect(entries).toHaveLength(8);
    expect(entries.filter((entry) => entry.pageLoc === 'https://www.giselasaldarriaga.com/')).toHaveLength(4);
    expect(entries.filter((entry) => entry.pageLoc === 'https://www.giselasaldarriaga.com/en/')).toHaveLength(4);
    const thumbsOnHome = entries.filter((entry) => entry.pageLoc.endsWith('.com/')).map((entry) => entry.thumbnailLoc);
    expect(new Set(thumbsOnHome).size).toBe(thumbsOnHome.length);
    for (const entry of entries) {
      expect(entry.title).toBeTruthy();
      expect(entry.description).toBeTruthy();
      expect(entry.thumbnailLoc).toMatch(/^https:\/\/media\.giselasaldarriaga\.com\//u);
      expect(entry.contentLoc).toMatch(/^https:\/\/media\.giselasaldarriaga\.com\//u);
      expect(entry.thumbnailLoc).not.toContain('og-image');
      expect(entry.uploadDate).toBe('2026-03-04');
      expect(entry.durationSeconds).toBeGreaterThan(0);
      expect(entry.title).not.toMatch(/\.\.\.|…/u);
    }
    expect(VIDEO_SITEMAP_CURATED_CLIP_IDS).toEqual([1, 2, 4, 7]);
    expect([...VIDEO_SITEMAP_CURATED_CLIP_IDS]).toEqual([...FEATURED_REEL_CLIP_IDS]);
  });

  it('fails the build when a selected entry is missing a required field', () => {
    expect(() =>
      assertSelectedVideoFields(
        {
          family: 'home',
          locale: 'es',
          pagePath: '/',
          pageLoc: 'https://www.giselasaldarriaga.com/',
          name: 'Resena',
          description: 'ok',
          thumbnailUrl: '',
          contentUrl: 'https://media.giselasaldarriaga.com/videos/main/x.mp4',
          uploadDate: '2026-03-04',
        },
        '/',
      ),
    ).toThrow(/missing required field/);
    expect(() =>
      assertSelectedVideoFields(
        {
          family: 'home',
          locale: 'es',
          pagePath: '/',
          pageLoc: 'https://www.giselasaldarriaga.com/',
          name: 'Resena',
          description: 'ok',
          thumbnailUrl: 'https://media.giselasaldarriaga.com/videos/posters/x.jpg',
          contentUrl: 'https://media.giselasaldarriaga.com/videos/main/x.mp4',
          uploadDate: '2026-03-04',
        },
        '/',
      ),
    ).not.toThrow();
  });

  it('excludes decorative catalog and extra service/vertical proof clips', () => {
    const excluded = collectExcludedVideos(root);
    expect(excluded.some((item) => item.reason === 'decorativeCatalog')).toBe(true);
    expect(excluded.some((item) => item.reason.startsWith('serviceVerticalProof'))).toBe(true);
    expect(excluded.some((item) => item.clipId === 9)).toBe(true);
  });

  it('writes escaped schema-shaped XML identical to the committed file', async () => {
    const { xml, entries } = await writeVideoSitemapFile(root, { verifyUrls: false });
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"');
    expect(xml).toContain('<video:thumbnail_loc>');
    expect(xml).toContain('<video:duration>');
    const parsed = new DOMParser().parseFromString(xml, 'application/xml');
    expect(parsed.querySelector('parsererror')).toBeNull();
    expect(readFileSync(resolve(root, 'public/sitemap-video.xml'), 'utf8')).toBe(xml);
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/gu)].map((match) => match[1]);
    const indexable = new Set(
      PAGE_REGISTRY.flatMap((entry) => [
        `https://www.giselasaldarriaga.com${entry.paths.es}`,
        `https://www.giselasaldarriaga.com${entry.paths.en}`,
      ]),
    );
    for (const loc of locs) {
      expect(indexable.has(loc)).toBe(true);
    }
    expect(entries).toHaveLength(8);
  });

  it('keeps VideoObject JSON-LD on service pages that show the clips', () => {
    for (const serviceId of getAllServiceIds()) {
      const page = getServicePageContent(serviceId, 'es');
      const raw = renderToStaticMarkup(
        <StaticRouter location={page.path}>
          <LocaleProvider>
            <ServiceLandingPage
              serviceId={serviceId}
              locale="es"
              routeData={buildServiceLandingRouteData(serviceId, 'es')}
            />
          </LocaleProvider>
        </StaticRouter>,
      );
      const videos = extractVideoObjects(raw);
      expect(videos.length).toBeGreaterThan(0);
      for (const node of videos) {
        expect(node.name).toBeTruthy();
        expect(node.thumbnailUrl).toBeTruthy();
        expect(node.uploadDate).toBeTruthy();
      }
    }
  });
});

describe('video sitemap XML escaping', () => {
  it('escapes title and description', () => {
    const xml = buildVideoSitemapXml([
      {
        pageLoc: 'https://www.giselasaldarriaga.com/',
        title: 'A & B <clip>',
        description: 'He said "hola"',
        thumbnailLoc: 'https://media.giselasaldarriaga.com/videos/posters/x.jpg',
        contentLoc: 'https://media.giselasaldarriaga.com/videos/main/x.mp4',
        uploadDate: '2026-03-04',
        durationSeconds: 10,
      },
    ]);
    expect(xml).toContain('A &amp; B &lt;clip&gt;');
    expect(xml).toContain('He said &quot;hola&quot;');
    expect(xml).toContain('<video:duration>10</video:duration>');
  });
});
