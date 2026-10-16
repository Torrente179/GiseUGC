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
 *   • the delivered video, when the review has one Fiverr still serves: the HD
 *     rendition plays from Fiverr's own media CDN on demand, never on page load
 *
 * Usage: node scripts/build-fiverr-reviews.mjs [content/fiverr/reviews-2026-10-15.json]
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'src/data/fiverr-reviews.ts');
const CDN = 'https://fiverr-res.cloudinary.com/video/upload';

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
  const uploaded = Number(file.asset.split('/')[0].split('-').pop());
  return {
    src: `${CDN}/t_fiverr_hd/v1/video-attachments/delivery/asset/${file.asset}`,
    poster: `${CDN}/f_auto,q_auto,t_smartwm/t_delivery_large/v1/video-attachments/delivery/asset/${file.asset}.png`,
    month: new Date(uploaded * 1000).toISOString().slice(0, 7),
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
    ...(reply ? { reply: clean(reply) } : {}),
    ...(video ? { video: { src: video.src, poster: video.poster } } : {}),
  };
});

const withVideo = reviews.filter((r) => r.video).length;
const expected = capture.files.filter((f) => f.available && f.rating >= 4).length;
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
  /** Gisela's public reply on Fiverr. */
  reply?: string;
  /** The delivered video, served by Fiverr's media CDN (HD, watermarked by Fiverr). */
  video?: { src: string; poster: string };
};

export const FIVERR_PROFILE_URL = ${JSON.stringify(capture.source)};
export const FIVERR_REVIEWS_CAPTURED_AT = ${JSON.stringify(capture.capturedAt)};

/** Seller-level numbers from the profile at capture time. */
export const FIVERR_SUMMARY = ${JSON.stringify({ communication: summary.communication, quality: summary.quality, value: summary.value })} as const;

export const FIVERR_REVIEWS: readonly FiverrReview[] = ${JSON.stringify(reviews, null, 2)};
`,
);
console.log(`${reviews.length} reviews, ${withVideo} with video → ${path.relative(ROOT, OUT)}`);
