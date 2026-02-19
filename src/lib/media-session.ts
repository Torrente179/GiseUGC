export type MediaSession = {
  issuedAt?: string;
  expiresAt: string;
  refreshAfterMs: number;
  mainVideoUrls: Record<string, string>;
};

const MEDIA_SESSION_ENDPOINT = '/api/media/session';
let cachedSession: MediaSession | null = null;
let pendingSessionRequest: Promise<MediaSession> | null = null;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const normalizeMediaPath = (path: string) => path.replace(/^\/+/, '');

const parseTimestamp = (value: string) => {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isSessionUsable = (session: MediaSession | null): session is MediaSession => {
  if (!session) return false;
  const expiresAtMs = parseTimestamp(session.expiresAt);
  if (expiresAtMs <= 0) return false;
  // Keep a safety window so refreshes happen before expiry.
  return expiresAtMs - Date.now() > 20_000;
};

export const mediaPathFromSourceUrl = (sourceUrl: string): string | null => {
  const marker = '/videos/';

  try {
    const parsed = new URL(sourceUrl);
    const markerIndex = parsed.pathname.indexOf(marker);
    if (markerIndex === -1) return null;
    return normalizeMediaPath(parsed.pathname.slice(markerIndex + 1));
  } catch {
    const markerIndex = sourceUrl.indexOf(marker);
    if (markerIndex === -1) return null;
    return normalizeMediaPath(sourceUrl.slice(markerIndex + 1));
  }
};

const parseMediaSessionResponse = (payload: unknown): MediaSession => {
  if (!isRecord(payload)) {
    throw new Error('Invalid media session payload');
  }

  const { issuedAt, expiresAt, refreshAfterMs, mainVideoUrls } = payload;

  if (typeof expiresAt !== 'string') {
    throw new Error('Media session missing expiresAt');
  }
  if (typeof refreshAfterMs !== 'number' || !Number.isFinite(refreshAfterMs) || refreshAfterMs <= 0) {
    throw new Error('Media session missing refreshAfterMs');
  }
  if (!isRecord(mainVideoUrls)) {
    throw new Error('Media session missing mainVideoUrls');
  }

  const urls: Record<string, string> = {};
  for (const [path, signedUrl] of Object.entries(mainVideoUrls)) {
    if (typeof signedUrl !== 'string') continue;
    urls[normalizeMediaPath(path)] = signedUrl;
  }

  return {
    issuedAt: typeof issuedAt === 'string' ? issuedAt : undefined,
    expiresAt,
    refreshAfterMs,
    mainVideoUrls: urls,
  };
};

export const getMediaSession = async (
  options: { forceRefresh?: boolean } = {},
): Promise<MediaSession> => {
  const { forceRefresh = false } = options;

  if (!forceRefresh && isSessionUsable(cachedSession)) {
    return cachedSession;
  }

  if (!forceRefresh && pendingSessionRequest) {
    return pendingSessionRequest;
  }

  pendingSessionRequest = fetch(MEDIA_SESSION_ENDPOINT, {
    method: 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Media session request failed with status ${response.status}`);
      }
      const payload = await response.json();
      const session = parseMediaSessionResponse(payload);
      cachedSession = session;
      return session;
    })
    .finally(() => {
      pendingSessionRequest = null;
    });

  return pendingSessionRequest;
};

export const refreshMediaSession = () => getMediaSession({ forceRefresh: true });

export const getSignedMediaUrl = (
  session: MediaSession | null,
  sourceUrl: string,
): string | null => {
  if (!session) return null;
  const path = mediaPathFromSourceUrl(sourceUrl);
  if (!path) return null;
  return session.mainVideoUrls[path] ?? null;
};

export const clearMediaSessionCache = () => {
  cachedSession = null;
  pendingSessionRequest = null;
};
