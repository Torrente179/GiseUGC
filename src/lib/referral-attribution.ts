const CHATGPT_HOSTS = ['chatgpt.com', 'chat.openai.com'] as const;

export type ChatGptReferralContext = {
  detectionMethod: 'utm_source' | 'referrer' | 'utm_source+referrer';
  landingPath: string;
  referrerHost: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmMedium: string | null;
  utmSource: string | null;
};

const parseHostname = (value: string): string | null => {
  if (!value) return null;

  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return null;
  }
};

const isChatGptHost = (hostname: string | null): boolean => {
  if (!hostname) return false;
  return CHATGPT_HOSTS.some((candidate) => hostname === candidate || hostname.endsWith(`.${candidate}`));
};

export const getChatGptReferralContext = (
  locationHref: string,
  documentReferrer: string,
): ChatGptReferralContext | null => {
  const locationUrl = new URL(locationHref);
  const referrerHost = parseHostname(documentReferrer);

  const utmSource = locationUrl.searchParams.get('utm_source')?.toLowerCase() ?? null;
  const utmMedium = locationUrl.searchParams.get('utm_medium')?.toLowerCase() ?? null;
  const utmCampaign = locationUrl.searchParams.get('utm_campaign') ?? null;
  const utmContent = locationUrl.searchParams.get('utm_content') ?? null;

  const matchedByUtm = utmSource === 'chatgpt.com';
  const matchedByReferrer = isChatGptHost(referrerHost);

  if (!matchedByUtm && !matchedByReferrer) {
    return null;
  }

  const detectionMethod = matchedByUtm && matchedByReferrer
    ? 'utm_source+referrer'
    : matchedByUtm
      ? 'utm_source'
      : 'referrer';

  return {
    detectionMethod,
    landingPath: `${locationUrl.pathname}${locationUrl.hash}`,
    referrerHost,
    utmCampaign,
    utmContent,
    utmMedium,
    utmSource,
  };
};
