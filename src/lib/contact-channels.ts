/**
 * Single source of truth for Gisela's contact channels — URLs, i18n keys, and
 * brand metadata. Shared by the desktop floating dock and the mobile contact
 * sheet so the channel list never drifts between surfaces. (The brand glyph
 * component lives in ContactChannelGlyph.tsx to keep this a pure data module.)
 */

export const FIVERR_PROFILE_URL = 'https://www.fiverr.com/gisela_sm';

const canonicalizeFiverrUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith('fiverr.com')) return url;
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString().replace(/\/$/u, '');
  } catch {
    return FIVERR_PROFILE_URL;
  }
};

export const CONTACT_URLS = {
  whatsapp: import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/573043786101',
  telegram: import.meta.env.VITE_TELEGRAM_URL ?? 'https://t.me/+573043786101',
  fiverr: canonicalizeFiverrUrl(import.meta.env.VITE_FIVERR_URL ?? FIVERR_PROFILE_URL),
  instagram: import.meta.env.VITE_INSTAGRAM_URL ?? 'https://www.instagram.com/sm_gisela/',
  tiktok: import.meta.env.VITE_TIKTOK_URL ?? 'https://www.tiktok.com/@giselasaldarriaga',
  threads: import.meta.env.VITE_THREADS_URL ?? 'https://www.threads.com/@sm_gisela',
  linkedin: import.meta.env.VITE_LINKEDIN_URL ?? 'https://www.linkedin.com/in/gisela-saldarriaga-molina-0417b8199/',
  facebook: import.meta.env.VITE_FACEBOOK_URL ?? 'https://www.facebook.com/gisela.saldarriaga',
} as const;

export type ContactChannelId = keyof typeof CONTACT_URLS;

export type ContactChannel = {
  id: ContactChannelId;
  href: string;
  labelKey: string;
  ariaKey: string;
  /** Brand color for the channel chip background. */
  brand: string;
};

export const CONTACT_CHANNELS: ContactChannel[] = [
  { id: 'whatsapp', href: CONTACT_URLS.whatsapp, labelKey: 'floatingContact.whatsappLabel', ariaKey: 'floatingContact.whatsappAria', brand: '#25D366' },
  { id: 'telegram', href: CONTACT_URLS.telegram, labelKey: 'floatingContact.telegramLabel', ariaKey: 'floatingContact.telegramAria', brand: '#229ED9' },
  { id: 'fiverr', href: CONTACT_URLS.fiverr, labelKey: 'floatingContact.fiverrLabel', ariaKey: 'floatingContact.fiverrAria', brand: '#1DBF73' },
  { id: 'instagram', href: CONTACT_URLS.instagram, labelKey: 'floatingContact.instagramLabel', ariaKey: 'floatingContact.instagramAria', brand: '#E1306C' },
  { id: 'tiktok', href: CONTACT_URLS.tiktok, labelKey: 'floatingContact.tiktokLabel', ariaKey: 'floatingContact.tiktokAria', brand: '#111111' },
  { id: 'threads', href: CONTACT_URLS.threads, labelKey: 'floatingContact.threadsLabel', ariaKey: 'floatingContact.threadsAria', brand: '#111111' },
  { id: 'linkedin', href: CONTACT_URLS.linkedin, labelKey: 'floatingContact.linkedinLabel', ariaKey: 'floatingContact.linkedinAria', brand: '#0A66C2' },
  { id: 'facebook', href: CONTACT_URLS.facebook, labelKey: 'floatingContact.facebookLabel', ariaKey: 'floatingContact.facebookAria', brand: '#1877F2' },
];

/** Channels whose glyph is a full-color logo image (seat on linen, not brand). */
export const CHANNEL_LOGO_SRC: Partial<Record<ContactChannelId, string>> = {
  whatsapp: '/uploads/whatsapp.png',
  fiverr: '/uploads/fiverr-logo-56.webp',
  tiktok: '/uploads/TikTok-Icon-Logo.wine.svg',
};
