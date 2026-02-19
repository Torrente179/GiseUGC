const PROTECTED_PREFIX = '/videos/main/';

interface Env {
  MEDIA_BUCKET: R2Bucket;
  MEDIA_SIGNING_SECRET: string;
}

const encoder = new TextEncoder();

const toHex = (bytes: ArrayBuffer) =>
  [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

const timingSafeEqual = (left: string, right: string) => {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
};

const signMediaPath = async (payload: string, secret: string) => {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(payload));
  return toHex(signature);
};

const deny = (status: number, message: string) =>
  new Response(message, {
    status,
    headers: {
      'Cache-Control': 'private, no-store',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });

const parseExpiry = (value: string | null) => {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
};

const getObjectResponseStatus = (request: Request, object: R2ObjectBody) => {
  if (!request.headers.has('range')) return 200;
  return object.range && (object.range as { offset?: number }).offset !== undefined ? 206 : 200;
};

const handleProtectedRequest = async (request: Request, env: Env, url: URL) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return deny(405, 'Method Not Allowed');
  }

  if (!url.pathname.startsWith(PROTECTED_PREFIX)) {
    return deny(404, 'Not Found');
  }

  const signature = url.searchParams.get('st') ?? '';
  const expiry = parseExpiry(url.searchParams.get('exp'));
  if (!signature || !expiry) {
    return deny(403, 'Missing media token');
  }
  if (Math.floor(Date.now() / 1000) > expiry) {
    return deny(403, 'Expired media token');
  }

  const mediaPath = url.pathname.replace(/^\/+/, '');
  const payload = `${mediaPath}:${expiry}`;
  const expectedSignature = await signMediaPath(payload, env.MEDIA_SIGNING_SECRET);
  if (!timingSafeEqual(signature, expectedSignature)) {
    return deny(403, 'Invalid media token');
  }

  const object = await env.MEDIA_BUCKET.get(mediaPath, {
    onlyIf: request.headers,
    range: request.headers,
  });
  if (!object) {
    return deny(404, 'Media not found');
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('accept-ranges', 'bytes');
  headers.set('cache-control', 'private, max-age=180');
  headers.set('x-content-type-options', 'nosniff');

  if (request.method === 'HEAD') {
    return new Response(null, { status: 200, headers });
  }

  return new Response(object.body, {
    status: getObjectResponseStatus(request, object),
    headers,
  });
};

export default {
  fetch(request: Request, env: Env): Promise<Response> | Response {
    const url = new URL(request.url);
    return handleProtectedRequest(request, env, url);
  },
};
