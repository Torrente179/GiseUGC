/**
 * Video sitemap from the curated homepage VideoObject set only.
 * Values are copied from existing JSON-LD / clip URLs. Missing required
 * fields on a selected entry fail the build. Decorative clips are logged
 * as excluded, not invented.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LEGACY_REEL_CLIPS } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';
import {
  VIDEO_SITEMAP_BEST_PAGE,
  VIDEO_SITEMAP_CURATED_CLIP_IDS,
} from '@/data/video-sitemap-curated';
import { getServicePageContent } from '@/data/service-pages';
import { getVerticalPageContent } from '@/data/vertical-pages';
import { escapeXml, SITEMAP_ORIGIN } from '@/lib/sitemap';
import { SITE_LOCALES, getServiceIdsInOrder, getVerticalIdsInOrder } from '@/lib/locale-path';
import { parseHomeVideoObjects, VIDEO_SITE_ORIGIN, type PageVideoObject } from '@/lib/page-video-objects';

export const VIDEO_SITEMAP_RELATIVE = 'public/sitemap-video.xml';
export const OG_IMAGE_FALLBACK = `${SITEMAP_ORIGIN}/og-image-es-en-20260219.jpg`;

export type VideoSitemapEntry = {
  pageLoc: string;
  title: string;
  description: string;
  thumbnailLoc: string;
  contentLoc: string;
  uploadDate: string;
  durationSeconds?: number;
};

export type ExcludedVideo = {
  clipId?: number;
  contentUrl?: string;
  name?: string;
  reason: string;
};

const ALL_CLIPS = [...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS];
const CURATED = new Set<number>(VIDEO_SITEMAP_CURATED_CLIP_IDS);

const durationSecondsFromIso = (value?: string): number | undefined => {
  if (!value) return undefined;
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/u.exec(value);
  if (!match) return undefined;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  const total = hours * 3600 + minutes * 60 + seconds;
  return total > 0 ? total : undefined;
};

export { parseHomeVideoObjects };

export const assertSelectedVideoFields = (video: PageVideoObject, pagePath: string): void => {
  if (
    !video.name.trim() ||
    !video.description.trim() ||
    !video.thumbnailUrl.trim() ||
    !video.contentUrl.trim() ||
    !video.uploadDate?.trim()
  ) {
    throw new Error(
      `selected video missing required field on ${pagePath}: name=${video.name} thumbnail=${video.thumbnailUrl} content=${video.contentUrl} uploadDate=${video.uploadDate}`,
    );
  }
};

export const collectHomeVideoObjects = (root = process.cwd()): PageVideoObject[] => [
  ...parseHomeVideoObjects(readFileSync(resolve(root, 'index.html'), 'utf8'), '/', 'es'),
  ...parseHomeVideoObjects(readFileSync(resolve(root, 'en/index.html'), 'utf8'), '/en/', 'en'),
];

const clipIdForContentUrl = (contentUrl: string): number | undefined =>
  ALL_CLIPS.find((clip) => clip.mainSrc === contentUrl)?.id;

export const collectExcludedVideos = (root = process.cwd()): ExcludedVideo[] => {
  const excluded: ExcludedVideo[] = [];
  for (const clip of ALL_CLIPS) {
    if (CURATED.has(clip.id)) continue;
    excluded.push({
      clipId: clip.id,
      contentUrl: clip.mainSrc,
      name: clip.title,
      reason: 'decorativeCatalog',
    });
  }
  for (const locale of SITE_LOCALES) {
    for (const serviceId of getServiceIdsInOrder()) {
      const page = getServicePageContent(serviceId, locale);
      for (const example of page.featuredExamples) {
        if (CURATED.has(example.clipId)) continue;
        excluded.push({
          clipId: example.clipId,
          name: example.title,
          reason: `serviceVerticalProof:${page.path}`,
        });
      }
    }
    for (const verticalId of getVerticalIdsInOrder()) {
      const page = getVerticalPageContent(verticalId, locale);
      for (const example of page.featuredExamples) {
        if (CURATED.has(example.clipId)) continue;
        excluded.push({
          clipId: example.clipId,
          name: example.title,
          reason: `serviceVerticalProof:${page.path}`,
        });
      }
    }
  }
  void root;
  return excluded;
};

export const selectCuratedSitemapVideos = (root = process.cwd()): VideoSitemapEntry[] => {
  const homeVideos = collectHomeVideoObjects(root);
  const byLocalePath = {
    '/': homeVideos.filter((video) => video.pagePath === '/'),
    '/en/': homeVideos.filter((video) => video.pagePath === '/en/'),
  } as const;

  const entries: VideoSitemapEntry[] = [];
  for (const locale of SITE_LOCALES) {
    const pagePath = VIDEO_SITEMAP_BEST_PAGE[locale];
    const videos = byLocalePath[pagePath];
    if (videos.length !== VIDEO_SITEMAP_CURATED_CLIP_IDS.length) {
      throw new Error(
        `curated video sitemap expected ${VIDEO_SITEMAP_CURATED_CLIP_IDS.length} homepage VideoObjects on ${pagePath}, found ${videos.length}`,
      );
    }
    for (const video of videos) {
      const clipId = clipIdForContentUrl(video.contentUrl);
      if (!clipId || !VIDEO_SITEMAP_CURATED_CLIP_IDS.includes(clipId as (typeof VIDEO_SITEMAP_CURATED_CLIP_IDS)[number])) {
        throw new Error(`homepage VideoObject is not in the curated clip list: ${video.contentUrl}`);
      }
      assertSelectedVideoFields(video, pagePath);
      if (video.thumbnailUrl.includes('/og-image') || video.thumbnailUrl.includes('/og/')) {
        throw new Error(`video thumbnail must not be the OG image: ${video.thumbnailUrl}`);
      }
      const clip = ALL_CLIPS.find((item) => item.id === clipId);
      entries.push({
        pageLoc: `${VIDEO_SITE_ORIGIN}${pagePath}`,
        title: video.name,
        description: video.description,
        thumbnailLoc: video.thumbnailUrl,
        contentLoc: video.contentUrl,
        uploadDate: video.uploadDate,
        durationSeconds:
          durationSecondsFromIso(video.duration) ??
          (clip?.durationSeconds ? Math.round(clip.durationSeconds) : undefined),
      });
    }
  }

  const thumbsByPage = new Map<string, Set<string>>();
  for (const entry of entries) {
    const set = thumbsByPage.get(entry.pageLoc) ?? new Set<string>();
    if (set.has(entry.thumbnailLoc)) {
      throw new Error(`duplicate video thumbnail on ${entry.pageLoc}: ${entry.thumbnailLoc}`);
    }
    set.add(entry.thumbnailLoc);
    thumbsByPage.set(entry.pageLoc, set);
  }
  return entries;
};

export const buildVideoSitemapXml = (entries: VideoSitemapEntry[]): string => {
  const grouped = new Map<string, VideoSitemapEntry[]>();
  for (const entry of entries) {
    const list = grouped.get(entry.pageLoc) ?? [];
    list.push(entry);
    grouped.set(entry.pageLoc, list);
  }

  const blocks = [...grouped.entries()].map(([loc, videos]) => {
    const videoBlocks = videos
      .map((video) => {
        const duration =
          video.durationSeconds !== undefined
            ? `\n      <video:duration>${escapeXml(String(video.durationSeconds))}</video:duration>`
            : '';
        return `    <video:video>
      <video:thumbnail_loc>${escapeXml(video.thumbnailLoc)}</video:thumbnail_loc>
      <video:title>${escapeXml(video.title)}</video:title>
      <video:description>${escapeXml(video.description)}</video:description>
      <video:content_loc>${escapeXml(video.contentLoc)}</video:content_loc>
      <video:publication_date>${escapeXml(video.uploadDate)}</video:publication_date>${duration}
    </video:video>`;
      })
      .join('\n');
    return `  <url>
    <loc>${escapeXml(loc)}</loc>
${videoBlocks}
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${blocks.join('\n')}
</urlset>
`;
  if (!xml.startsWith('<?xml') || !xml.includes('xmlns:video=')) {
    throw new Error('video sitemap generation failed: empty or invalid XML');
  }
  return xml;
};

const probeUrl = async (
  url: string,
  userAgent = 'Googlebot',
  referer?: string,
): Promise<{ status: number; robotsTag: string | null }> => {
  const headers: Record<string, string> = { 'User-Agent': userAgent };
  if (referer) headers.Referer = referer;
  const head = await fetch(url, { method: 'HEAD', redirect: 'follow', headers });
  if (head.status !== 405) {
    return { status: head.status, robotsTag: head.headers.get('x-robots-tag') };
  }
  const ranged = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: { ...headers, Range: 'bytes=0-0' },
  });
  return {
    status: ranged.status === 206 ? 200 : ranged.status,
    robotsTag: ranged.headers.get('x-robots-tag'),
  };
};

export const assertVideoUrlsReachable = async (entries: VideoSitemapEntry[]): Promise<void> => {
  const urls = [...new Set(entries.flatMap((entry) => [entry.contentLoc, entry.thumbnailLoc]))];
  const failures: string[] = [];
  const probes: Array<{ ua: string; referer?: string }> = [
    { ua: 'Googlebot' },
    { ua: 'Googlebot', referer: 'https://www.google.com/' },
  ];
  for (const url of urls) {
    for (const probe of probes) {
      try {
        const { status, robotsTag } = await probeUrl(url, probe.ua, probe.referer);
        if (status !== 200) {
          failures.push(
            `${status} ${url} ua=${probe.ua} referer=${probe.referer ?? 'none'}`,
          );
        }
        if (robotsTag && /noindex|nofollow|none|unavailable_after/i.test(robotsTag)) {
          failures.push(`X-Robots-Tag ${robotsTag} ${url}`);
        }
      } catch (error) {
        failures.push(`network ${url} (${error instanceof Error ? error.message : 'error'})`);
      }
    }
  }
  if (failures.length > 0) {
    throw new Error(`video sitemap HEAD check failed:\n${failures.join('\n')}`);
  }
};

const r2RobotsBlocksGooglebot = (text: string): boolean => {
  const blocks = text.split(/(?=user-agent:)/i);
  return blocks.some((block) => {
    if (!/user-agent:\s*(\*|googlebot)\b/i.test(block)) return false;
    return /disallow:\s*\/\s*$/im.test(block) || /disallow:\s*\/videos/i.test(block);
  });
};

export const assertR2AllowsGooglebot = async (sampleUrl?: string): Promise<void> => {
  const robotsUrl = 'https://media.giselasaldarriaga.com/robots.txt';
  try {
    const response = await fetch(robotsUrl, { headers: { 'User-Agent': 'Googlebot' } });
    if (response.status !== 404 && response.status !== 403) {
      if (!response.ok) {
        throw new Error(`R2 robots.txt returned ${response.status}`);
      }
      const text = await response.text();
      if (r2RobotsBlocksGooglebot(text)) {
        throw new Error(`R2 robots.txt blocks Googlebot:\n${text}`);
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('R2')) throw error;
  }
  if (!sampleUrl) return;
  const { status, robotsTag } = await probeUrl(sampleUrl, 'Googlebot');
  if (status === 403 || status === 401) {
    throw new Error(`R2 hotlink or auth block for Googlebot: ${status} ${sampleUrl}`);
  }
  if (robotsTag && /noindex|nofollow|none/i.test(robotsTag)) {
    throw new Error(`R2 X-Robots-Tag blocks Googlebot on ${sampleUrl}: ${robotsTag}`);
  }
};

export const writeVideoSitemapFile = async (
  root = process.cwd(),
  options: { verifyUrls?: boolean } = {},
): Promise<{ xml: string; entries: VideoSitemapEntry[]; excluded: ExcludedVideo[] }> => {
  const entries = selectCuratedSitemapVideos(root);
  const excluded = collectExcludedVideos(root);
  const xml = buildVideoSitemapXml(entries);
  if (options.verifyUrls) {
    await assertVideoUrlsReachable(entries);
    await assertR2AllowsGooglebot(entries[0]?.contentLoc);
  }
  writeFileSync(resolve(root, VIDEO_SITEMAP_RELATIVE), xml, 'utf8');
  return { xml, entries, excluded };
};

export const videoSitemapPublicUrl = `${SITEMAP_ORIGIN}/sitemap-video.xml`;
