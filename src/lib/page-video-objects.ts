/**
 * VideoObject fields as pages already emit them. Sitemap and schema share
 * this module so titles, descriptions, posters, and content URLs cannot
 * drift. uploadDate is only returned when the clip itself has publishedAt —
 * the landing-page fallback dates stay in the React schema and are never
 * copied into the video sitemap.
 */
import { LEGACY_REEL_CLIPS, type ReelClip } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';
import { getServicePageContent } from '@/data/service-pages';
import {
  PAGE_REGISTRY,
  SITE_LOCALES,
  type PageFamily,
  type SiteLocale,
} from '@/lib/locale-path';

export const VIDEO_SITE_ORIGIN = 'https://www.giselasaldarriaga.com';

export type FeaturedExample = {
  clipId: number;
  title: string;
  description: string;
};

export type PageVideoObject = {
  family: PageFamily;
  locale: SiteLocale;
  pagePath: string;
  pageLoc: string;
  clipId?: number;
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  duration?: string;
  uploadDate?: string;
};

const clipMap = new Map<number, ReelClip>(
  [...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS].map((clip) => [clip.id, clip]),
);

export const resolveFeaturedProof = (examples: FeaturedExample[]) =>
  examples.flatMap((example) => {
    const clip = clipMap.get(example.clipId);
    return clip ? [{ example, clip }] : [];
  });

export const iso8601DurationFromSeconds = (seconds?: number): string | undefined => {
  if (seconds === undefined || !Number.isFinite(seconds) || seconds <= 0) return undefined;
  return `PT${Math.round(seconds)}S`;
};

export const buildFeaturedVideoObjects = (
  pagePath: string,
  locale: SiteLocale,
  family: PageFamily,
  examples: FeaturedExample[],
): PageVideoObject[] => {
  const pageLoc = `${VIDEO_SITE_ORIGIN}${pagePath}`;
  return resolveFeaturedProof(examples).map(({ example, clip }) => ({
    family,
    locale,
    pagePath,
    pageLoc,
    clipId: clip.id,
    name: example.title,
    description: example.description,
    thumbnailUrl: clip.posterSrc,
    contentUrl: clip.mainSrc,
    duration: iso8601DurationFromSeconds(clip.durationSeconds),
    uploadDate: clip.publishedAt,
  }));
};

export const parseHomeVideoObjects = (
  html: string,
  pagePath: string,
  locale: SiteLocale,
): PageVideoObject[] => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/giu)];
  const videos: PageVideoObject[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const record = node as Record<string, unknown>;
    if (record['@type'] === 'VideoObject') {
      videos.push({
        family: 'home',
        locale,
        pagePath,
        pageLoc: `${VIDEO_SITE_ORIGIN}${pagePath}`,
        name: String(record.name ?? ''),
        description: String(record.description ?? ''),
        thumbnailUrl: String(record.thumbnailUrl ?? ''),
        contentUrl: String(record.contentUrl ?? ''),
        duration: typeof record.duration === 'string' ? record.duration : undefined,
        uploadDate: typeof record.uploadDate === 'string' ? record.uploadDate : undefined,
      });
    }
    if (record['@graph']) walk(record['@graph']);
    if (record.hasPart) walk(record.hasPart);
    if (record.mainEntity) walk(record.mainEntity);
  };
  for (const block of blocks) {
    try {
      walk(JSON.parse((block[1] ?? '').replace(/\\u003c/giu, '<')));
    } catch {
      // Ignore non-JSON script blocks; homepage VideoObjects are valid JSON-LD.
    }
  }
  return videos;
};

export const collectRegistryVideoObjects = (): PageVideoObject[] => {
  const videos: PageVideoObject[] = [];
  for (const entry of PAGE_REGISTRY) {
    for (const locale of SITE_LOCALES) {
      const pagePath = entry.paths[locale];
      if (entry.family === 'service') {
        const page = getServicePageContent(entry.id as Parameters<typeof getServicePageContent>[0], locale);
        videos.push(...buildFeaturedVideoObjects(pagePath, locale, 'service', page.featuredExamples));
      }
    }
  }
  return videos;
};
