import type { SiteLocale } from '@/lib/locale-path';

/** The opening line of a message to Gisela, naming the service the visitor was reading about. */
export const serviceContactMessage = (locale: SiteLocale, serviceLabel: string): string =>
  locale === 'es'
    ? `Hola Gise, me interesa: ${serviceLabel}`
    : `Hi Gise, I'm interested in: ${serviceLabel}`;

/**
 * WhatsApp link with the message prefilled. The base comes from the shared
 * contact data (VITE_WHATSAPP_URL or the default wa.me link), so the number
 * stays in one place; a base that already carries `text=` is left alone.
 */
export const whatsappLinkWithText = (baseUrl: string, text: string): string => {
  if (/[?&]text=/u.test(baseUrl)) return baseUrl;
  return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}text=${encodeURIComponent(text)}`;
};
