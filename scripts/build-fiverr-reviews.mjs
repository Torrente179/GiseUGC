#!/usr/bin/env node
/**
 * Turns a capture of Gisela's public Fiverr reviews (content/fiverr/reviews-*.json,
 * read from https://www.fiverr.com/gisela_sm with every review loaded) into
 * src/data/fiverr-reviews.ts, the data behind the Testimonios section.
 *
 *   • only the reviews the capture kept (4 stars and up, on the owner's call)
 *   • country names → ISO codes, so the page can name them in either language
 *   • "3 months ago" → an approximate YYYY-MM, so the page never shows a stale
 *     relative date; reviews with a delivery video use the exact upload date
 *     carried in the Fiverr asset id instead
 *   • the client's Fiverr profile photo, when they have one
 *   • the delivered video, when the review has one Fiverr still serves: the
 *     original upload (H.264, plus the HEVC original when the master is HEVC)
 *     and its size, so the card can frame it (portrait or landscape) before it
 *     loads
 *
 * Photos and videos are served from Gisela's R2 (media.giselasaldarriaga.com),
 * copied there by scripts/self-host-fiverr-media.mjs (capture.selfHosted), so
 * the page loads nothing from Fiverr.
 *
 * Usage: node scripts/build-fiverr-reviews.mjs [content/fiverr/reviews-2026-10-15.json]
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'src/data/fiverr-reviews.ts');
const MEDIA = 'https://media.giselasaldarriaga.com';

const COUNTRIES = {
  'United States': 'US', 'United Kingdom': 'GB', 'North Macedonia': 'MK', Mexico: 'MX', Spain: 'ES',
  Poland: 'PL', Ecuador: 'EC', Canada: 'CA', Argentina: 'AR', 'Costa Rica': 'CR', Panama: 'PA',
  Italy: 'IT', Australia: 'AU', Peru: 'PE', 'Puerto Rico': 'PR', Colombia: 'CO', Israel: 'IL',
  'Dominican Republic': 'DO', 'Saudi Arabia': 'SA', Haiti: 'HT', Bangladesh: 'BD', Vietnam: 'VN',
  Brazil: 'BR', Romania: 'RO', Japan: 'JP', Nicaragua: 'NI', Morocco: 'MA', Guatemala: 'GT',
  Ukraine: 'UA', Netherlands: 'NL', Singapore: 'SG', Georgia: 'GE', Nigeria: 'NG', India: 'IN',
  Malaysia: 'MY', France: 'FR', Turkey: 'TR', China: 'CN',
};

const SERVICES = {
  'Spokespersons Videos': 'spokesperson',
  'Social Media Videos': 'social',
  'Social Media Copywriting': 'copywriting',
  'Voice Over': 'voiceover',
};

const source = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, 'content/fiverr', readdirSync(path.join(ROOT, 'content/fiverr')).filter((f) => f.startsWith('reviews-')).sort().pop());
const capture = JSON.parse(readFileSync(source, 'utf8'));
const hosted = capture.selfHosted;
if (!hosted?.videoVersion) throw new Error('No selfHosted media in the capture: run scripts/self-host-fiverr-media.mjs --upload first');
const hostedAvatars = new Set(hosted.avatars);
/** Deliveries the owner chose not to show: the review stays, without its video. */
const removedVideos = new Set(capture.videosRemoved?.assets ?? []);

const monthsBefore = (iso, months) => {
  const [y, m] = iso.split('-').map(Number);
  const total = y * 12 + (m - 1) - months;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}`;
};

/** Fiverr's relative stamps: "3 weeks ago", "5 months ago", "1 year ago", "2 years ago". */
const approxMonth = (ago) => {
  const match = /(\d+)\s+(day|week|month|year)s?\s+ago/u.exec(ago);
  if (!match) return capture.capturedAt.slice(0, 7);
  const n = Number(match[1]);
  const months = { day: 0, week: Math.floor(n / 4), month: n, year: n * 12 }[match[2]];
  return monthsBefore(capture.capturedAt, match[2] === 'week' ? months : match[2] === 'day' ? 0 : months);
};

const langOf = (text) => {
  if (/\b(molto|lavoro|ottimo|gentile|brava|consigliata)\b/iu.test(text)) return 'it';
  const es = (text.match(/\b(muy|trabajo|gracias|excelente|es|la|el|que|con|su|una|como|siempre|profesional|recomend\w*)\b|[áéíóúñ¡¿]/giu) || []).length;
  const en = (text.match(/\b(the|and|very|great|work|with|her|she|job|thank|you|highly|good|amazing|professional)\b/giu) || []).length;
  return es > en ? 'es' : 'en';
};

const clean = (text) => text.replace(/\s*See less$/u, '').trim();

const videoFor = (row) => {
  const [, user, , , rating, , , text] = row;
  const file = capture.files.find(
    (f) => f.available && f.user === user && f.rating === rating && clean(text).startsWith(f.textStart),
  );
  if (!file) return null;
  const asset = file.asset.split('/')[0];
  // The asset id carries the delivery date, kept even when the video is not shown.
  const month = new Date(Number(asset.split('-').pop()) * 1000).toISOString().slice(0, 7);
  if (removedVideos.has(asset)) return { month, files: null };
  const files = hosted.videos[asset];
  if (!files) throw new Error(`Video ${asset} is not self-hosted yet`);
  const base = `${MEDIA}/videos/reviews/${hosted.videoVersion}/${asset}`;
  return {
    month,
    files: {
      src: `${base}/avc.mp4`,
      ...(files.hevc ? { hevc: `${base}/hevc.mp4` } : {}),
      poster: `${base}/poster.webp`,
      width: files.width,
      height: files.height,
    },
  };
};

const reviews = capture.reviews.map((row) => {
  const [order, user, country, , rating, ago, service, text, reply] = row;
  const code = COUNTRIES[country];
  if (!code) throw new Error(`No ISO code for "${country}"`);
  const video = videoFor(row);
  const body = clean(text);
  return {
    id: `${user}-${order}`,
    user,
    country: code,
    rating,
    date: video ? video.month : approxMonth(ago),
    service: SERVICES[service] ?? 'spokesperson',
    lang: langOf(body),
    text: body,
    ...(hostedAvatars.has(user) ? { avatar: `${MEDIA}/images/reviews/${hosted.photoVersion}/${user}.webp` } : {}),
    ...(reply ? { reply: clean(reply) } : {}),
    ...(video?.files ? { video: video.files } : {}),
  };
});

const withVideo = reviews.filter((r) => r.video).length;
const expected = capture.files.filter((f) => f.available && f.rating >= 4 && !removedVideos.has(f.asset.split('/')[0])).length;
if (withVideo !== expected) throw new Error(`Matched ${withVideo} videos, expected ${expected}`);

const { summary } = capture;
writeFileSync(
  OUT,
  `/**
 * AUTO-GENERATED FILE. DO NOT EDIT BY HAND.
 *
 * Generated by: scripts/build-fiverr-reviews.mjs
 * Source: ${path.relative(ROOT, source)} (${capture.source}, captured ${capture.capturedAt})
 * ${reviews.length} reviews (4 stars and up), ${withVideo} with the delivered video.
 */

export type FiverrService = 'spokesperson' | 'social' | 'copywriting' | 'voiceover';

export type FiverrReview = {
  id: string;
  /** Fiverr username, as the review shows it. */
  user: string;
  /** ISO 3166-1 alpha-2. */
  country: string;
  rating: number;
  /** YYYY-MM: the delivery date for reviews with a video, else approximate. */
  date: string;
  service: FiverrService;
  lang: 'es' | 'en' | 'it';
  text: string;
  /** The client's Fiverr profile photo (120 × 120 WebP), when they have one. */
  avatar?: string;
  /** Gisela's public reply on Fiverr. */
  reply?: string;
  /**
   * The delivered video, from the original upload: \`src\` is H.264 (plays
   * everywhere), \`hevc\` the HEVC original when the master is HEVC. Poster =
   * frame 0. Size is the delivered frame (4K masters at 1440 on the short side).
   */
  video?: { src: string; hevc?: string; poster: string; width: number; height: number };
};

export const FIVERR_PROFILE_URL = ${JSON.stringify(capture.source)};
export const FIVERR_REVIEWS_CAPTURED_AT = ${JSON.stringify(capture.capturedAt)};

/** Seller-level numbers from the profile at capture time. */
export const FIVERR_SUMMARY = ${JSON.stringify({ communication: summary.communication, quality: summary.quality, value: summary.value })} as const;

export const FIVERR_REVIEWS: readonly FiverrReview[] = ${JSON.stringify(reviews, null, 2)};
`,
);
console.log(`${reviews.length} reviews, ${withVideo} with video → ${path.relative(ROOT, OUT)}`);
