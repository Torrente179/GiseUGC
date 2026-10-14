/**
 * Per-page Open Graph metadata. Browser-safe: paths, H1s, proof lines, and
 * HTML tag rewriting. Image rasterization lives in og-image-render.ts.
 */
import { getOgProofLine } from '@/data/site-proof';
import { getHubPageContent } from '@/data/hub-pages';
import { getLegalPageContent } from '@/data/legal-pages';
import { getResourcePageContent } from '@/data/resource-pages';
import { getServicePageContent } from '@/data/service-pages';
import { getVerticalPageContent } from '@/data/vertical-pages';
import esHome from '@/locales/es/translation.json';
import enHome from '@/locales/en/translation.json';
import {
  getHubPageIdFromPath,
  getLegalPageIdFromPath,
  getLocaleFromPath,
  getResourcePageIdFromPath,
  getServicePageIdFromPath,
  getVerticalPageIdFromPath,
  isHomePath,
  PAGE_REGISTRY,
  SITE_LOCALES,
  type SiteLocale,
} from '@/lib/locale-path';
import ogImageManifest from '@/data/og-image-manifest.json';

export const OG_SITE_ORIGIN = 'https://www.giselasaldarriaga.com';
export const OG_FALLBACK_PATH = '/og-image-es-en-20260219.jpg';
export const OG_FALLBACK_URL = `${OG_SITE_ORIGIN}${OG_FALLBACK_PATH}?v=20260219`;
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_STYLE_VERSION = '20261013b';

export type OgImageMeta = {
  path: string;
  url: string;
  width: number;
  height: number;
  alt: string;
  fallback: boolean;
};

export type OgRouteCopy = {
  locale: SiteLocale;
  localePath: string;
  h1: string;
  proof: string;
  slug: string;
};

export const htmlFileForLocalePath = (localePath: string): string => {
  const trimmed = localePath.replace(/^\/+|\/+$/gu, '');
  return trimmed === '' ? 'index.html' : `${trimmed}/index.html`;
};

export const ogSlugForLocalePath = (localePath: string, locale: SiteLocale): string => {
  const trimmed = localePath.replace(/^\/+|\/+$/gu, '');
  const withoutLocale = trimmed === 'en' || trimmed === '' ? 'home' : trimmed.replace(/^en\//u, '');
  const slug = withoutLocale.replace(/\//gu, '-');
  return `${locale}-${slug}`;
};

export const getOgRouteCopy = (localePath: string, locale: SiteLocale = getLocaleFromPath(localePath)): OgRouteCopy => {
  const proof = getOgProofLine(locale);
  let h1 = '';

  if (isHomePath(localePath)) {
    h1 = locale === 'es' ? esHome.hero.offerTitle : enHome.hero.offerTitle;
  } else {
    const hubId = getHubPageIdFromPath(localePath);
    const serviceId = getServicePageIdFromPath(localePath);
    const verticalId = getVerticalPageIdFromPath(localePath);
    const resourceId = getResourcePageIdFromPath(localePath);
    const legalId = getLegalPageIdFromPath(localePath);
    if (hubId) h1 = getHubPageContent(hubId, locale).heroTitle;
    else if (serviceId) h1 = getServicePageContent(serviceId, locale).heroTitle;
    else if (verticalId) h1 = getVerticalPageContent(verticalId, locale).heroTitle;
    else if (resourceId) h1 = getResourcePageContent(resourceId, locale).heroTitle;
    else if (legalId) h1 = getLegalPageContent(legalId, locale).title;
  }

  return {
    locale,
    localePath,
    h1,
    proof,
    slug: ogSlugForLocalePath(localePath, locale),
  };
};

export const getAllOgRouteCopy = (): OgRouteCopy[] =>
  PAGE_REGISTRY.flatMap((entry) => SITE_LOCALES.map((locale) => getOgRouteCopy(entry.paths[locale], locale)));

export const fallbackOgImageMeta = (alt: string): OgImageMeta => ({
  path: OG_FALLBACK_PATH,
  url: OG_FALLBACK_URL,
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
  alt,
  fallback: true,
});

const manifestMap = ogImageManifest as Record<string, OgImageMeta>;

export const getOgImageMeta = (localePath: string, alt?: string): OgImageMeta => {
  const copy = getOgRouteCopy(localePath);
  const fromManifest = manifestMap[copy.localePath];
  if (fromManifest) return fromManifest;
  if (!copy.h1.trim()) return fallbackOgImageMeta(alt ?? 'Gisela Saldarriaga');
  throw new Error(
    `Missing OG image for ${copy.localePath}. Fallback is only for routes without an H1 — regenerate the OG manifest.`,
  );
};

export const getOgImageMetaForCanonical = (canonical: string, alt?: string): OgImageMeta => {
  const url = new URL(canonical);
  const pathname = url.pathname.endsWith('/') || url.pathname === '/' ? url.pathname : `${url.pathname}/`;
  const normalized = pathname === '/en/' || pathname === '/' ? pathname : pathname;
  return getOgImageMeta(normalized === '/en' ? '/en/' : normalized, alt);
};

const escapeAttribute = (value: string) =>
  value.replace(/&/gu, '&amp;').replace(/"/gu, '&quot;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;');

const upsertMetaTag = (
  html: string,
  attribute: 'property' | 'name',
  key: string,
  content: string,
) => {
  const escaped = escapeAttribute(content);
  const pattern = new RegExp(
    `<meta\\s+${attribute}="${key.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}"[^>]*>`,
    'u',
  );
  const tag = `<meta ${attribute}="${key}" content="${escaped}" />`;
  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }
  const imageAnchor = html.match(/<meta property="og:image"[^>]*>/u);
  if (imageAnchor) {
    return html.replace(imageAnchor[0], `${imageAnchor[0]}\n    ${tag}`);
  }
  const twitterCard = html.match(/<meta name="twitter:card"[^>]*>/u);
  if (twitterCard) {
    return html.replace(twitterCard[0], `${twitterCard[0]}\n    ${tag}`);
  }
  return html.replace('</head>', `    ${tag}\n  </head>`);
};

export const applyOgImageTagsToHtml = (html: string, meta: OgImageMeta): string => {
  let next = html;
  next = upsertMetaTag(next, 'property', 'og:image', meta.url);
  if (/<meta property="og:image:url"/u.test(next)) {
    next = upsertMetaTag(next, 'property', 'og:image:url', meta.url);
  }
  if (/<meta property="og:image:secure_url"/u.test(next)) {
    next = upsertMetaTag(next, 'property', 'og:image:secure_url', meta.url);
  }
  next = upsertMetaTag(next, 'property', 'og:image:type', 'image/jpeg');
  next = upsertMetaTag(next, 'property', 'og:image:width', String(meta.width));
  next = upsertMetaTag(next, 'property', 'og:image:height', String(meta.height));
  next = upsertMetaTag(next, 'property', 'og:image:alt', meta.alt);
  next = upsertMetaTag(next, 'name', 'twitter:card', 'summary_large_image');
  next = upsertMetaTag(next, 'name', 'twitter:image', meta.url);
  if (/<meta name="twitter:image:src"/u.test(next)) {
    next = upsertMetaTag(next, 'name', 'twitter:image:src', meta.url);
  }
  if (/<meta name="twitter:image:alt"/u.test(next) || meta.alt) {
    next = upsertMetaTag(next, 'name', 'twitter:image:alt', meta.alt);
  }
  next = next.replace(
    /<link rel="image_src" href="[^"]*" \/>/u,
    `<link rel="image_src" href="${escapeAttribute(meta.url)}" />`,
  );
  return next;
};
