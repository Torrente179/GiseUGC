const CLOUDFLARE_API_BASE_URL = 'https://api.cloudflare.com/client/v4';

const ensureTrailingSlashRemoved = (value) => value.replace(/\/+$/, '');

const toQueryString = (params = {}) => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    query.set(key, String(value));
  }
  const encoded = query.toString();
  return encoded ? `?${encoded}` : '';
};

const assertEnv = (name, value) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
};

export const createCloudflareClient = ({
  apiToken = process.env.CF_API_TOKEN,
  zoneId = process.env.CF_ZONE_ID,
} = {}) => {
  assertEnv('CF_API_TOKEN', apiToken);
  assertEnv('CF_ZONE_ID', zoneId);

  const request = async (path, { method = 'GET', body, query, headers = {} } = {}) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${ensureTrailingSlashRemoved(CLOUDFLARE_API_BASE_URL)}${normalizedPath}${toQueryString(query)}`;

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.success) {
      const errors = Array.isArray(payload?.errors)
        ? payload.errors.map((item) => item.message).join('; ')
        : `HTTP ${response.status}`;
      throw new Error(`Cloudflare API request failed (${method} ${normalizedPath}): ${errors}`);
    }

    return payload.result;
  };

  const getRateLimitEntrypoint = () =>
    request(`/zones/${zoneId}/rulesets/phases/http_ratelimit/entrypoint`);

  const putRateLimitEntrypoint = (rules, description = 'GiseUGC anti-cost spike rate limits') =>
    request(`/zones/${zoneId}/rulesets/phases/http_ratelimit/entrypoint`, {
      method: 'PUT',
      body: {
        description,
        rules,
      },
    });

  const putCustomFirewallEntrypoint = (rules, description = 'GiseUGC custom firewall rules') =>
    request(`/zones/${zoneId}/rulesets/phases/http_request_firewall_custom/entrypoint`, {
      method: 'PUT',
      body: {
        description,
        rules,
      },
    });

  const getSecurityLevel = () =>
    request(`/zones/${zoneId}/settings/security_level`);

  const setSecurityLevel = (value) =>
    request(`/zones/${zoneId}/settings/security_level`, {
      method: 'PATCH',
      body: { value },
    });

  const getDashboardAnalytics = ({ since, until }) =>
    request(`/zones/${zoneId}/analytics/dashboard`, {
      query: {
        since,
        until,
        continuous: 'false',
      },
    });

  return {
    zoneId,
    request,
    getDashboardAnalytics,
    getRateLimitEntrypoint,
    putRateLimitEntrypoint,
    putCustomFirewallEntrypoint,
    getSecurityLevel,
    setSecurityLevel,
  };
};
