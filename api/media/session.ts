import { createHmac } from 'node:crypto';

type RequestLike = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
};

type ResponseLike = {
  status: (statusCode: number) => ResponseLike;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
  end: (body?: string) => void;
};

const R2_MEDIA_BASE_URL =
  process.env.MEDIA_BASE_URL?.replace(/\/+$/, '') ?? 'https://media.giselasaldarriaga.com';
const MEDIA_SESSION_SECRET = process.env.MEDIA_SESSION_SECRET;
const MEDIA_SESSION_TTL_SECONDS = parsePositiveInt(process.env.MEDIA_SESSION_TTL_SECONDS, 900);
const MEDIA_SESSION_REFRESH_SECONDS = parsePositiveInt(
  process.env.MEDIA_SESSION_REFRESH_SECONDS,
  540,
);
const MEDIA_SESSION_ALLOWED_ORIGINS = parseAllowedOrigins(
  process.env.MEDIA_SESSION_ALLOWED_ORIGINS ??
    'https://www.giselasaldarriaga.com,https://giselasaldarriaga.com,http://localhost:8080,http://127.0.0.1:8080',
);

const MAIN_VIDEO_FILES = [
  'ugc-lifestyle-review.mp4',
  'ugc-brand-spokesperson.mp4',
  'ugc-voicebot-review.mp4',
  'ugc-creatine-supplement-review.mp4',
  'ugc-business-promotion.mp4',
  'ugc-services-presentation.mp4',
  'ugc-ai-services-review.mp4',
  'ugc-lifestyle-review-2.mp4',
  'ugc-voiceover-bots-review.mp4',
  'ugc-lifestyle-review-3.mp4',
] as const;

const PROTECTED_MEDIA_PATHS = MAIN_VIDEO_FILES.flatMap((filename) => [
  `videos/main/${filename}`,
  `videos/mobile/${filename.replace(/\.mp4$/, '-mobile.mp4')}`,
]);

const headerValue = (headers: RequestLike['headers'], name: string) => {
  const value = headers[name] ?? headers[name.toLowerCase()];
  if (Array.isArray(value)) return value[0];
  return value ?? '';
};

const responseJson = (res: ResponseLike, statusCode: number, payload: unknown) => {
  res.status(statusCode);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store, no-cache, max-age=0, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.json(payload);
};

const buildSignature = (mediaPath: string, expiresAtUnix: number, secret: string) =>
  createHmac('sha256', secret).update(`${mediaPath}:${expiresAtUnix}`).digest('hex');

const buildSignedUrl = (mediaPath: string, expiresAtUnix: number, secret: string) => {
  const signature = buildSignature(mediaPath, expiresAtUnix, secret);
  const separator = R2_MEDIA_BASE_URL.endsWith('/') ? '' : '/';
  return `${R2_MEDIA_BASE_URL}${separator}${mediaPath}?st=${signature}&exp=${expiresAtUnix}`;
};

const toOrigin = (rawUrl: string) => {
  if (!rawUrl) return null;
  try {
    return new URL(rawUrl).origin.toLowerCase();
  } catch {
    return null;
  }
};

const isTrustedOrigin = (req: RequestLike) => {
  if (MEDIA_SESSION_ALLOWED_ORIGINS.size === 0) return true;

  const originHeader = headerValue(req.headers, 'origin');
  const refererHeader = headerValue(req.headers, 'referer');
  const origin = toOrigin(originHeader);
  const refererOrigin = toOrigin(refererHeader);

  if (origin && !MEDIA_SESSION_ALLOWED_ORIGINS.has(origin)) return false;
  if (!origin && refererOrigin && !MEDIA_SESSION_ALLOWED_ORIGINS.has(refererOrigin)) return false;

  return true;
};

export default function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return responseJson(res, 405, { error: 'Method not allowed' });
  }

  if (!MEDIA_SESSION_SECRET) {
    return responseJson(res, 503, {
      error: 'Media session signing is not configured',
    });
  }

  if (!isTrustedOrigin(req)) {
    return responseJson(res, 403, { error: 'Forbidden origin' });
  }

  const nowUnix = Math.floor(Date.now() / 1000);
  const expiresAtUnix = nowUnix + MEDIA_SESSION_TTL_SECONDS;
  const expiresAt = new Date(expiresAtUnix * 1000).toISOString();

  const refreshAfterSeconds = Math.max(
    30,
    Math.min(MEDIA_SESSION_REFRESH_SECONDS, MEDIA_SESSION_TTL_SECONDS - 30),
  );

  const mainVideoUrls: Record<string, string> = {};
  for (const mediaPath of PROTECTED_MEDIA_PATHS) {
    mainVideoUrls[mediaPath] = buildSignedUrl(mediaPath, expiresAtUnix, MEDIA_SESSION_SECRET);
  }

  return responseJson(res, 200, {
    issuedAt: new Date(nowUnix * 1000).toISOString(),
    expiresAt,
    refreshAfterMs: refreshAfterSeconds * 1000,
    mainVideoUrls,
  });
}

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseAllowedOrigins(raw: string) {
  const origins = new Set<string>();
  for (const candidate of raw.split(',')) {
    const normalized = toOrigin(candidate.trim());
    if (normalized) origins.add(normalized);
  }
  return origins;
}
