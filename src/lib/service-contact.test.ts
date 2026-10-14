import { describe, expect, it } from 'vitest';
import { getAllServiceIds, getServicePageContent } from '@/data/service-pages';
import { CONTACT_URLS } from '@/lib/contact-channels';
import { serviceContactMessage, whatsappLinkWithText } from '@/lib/service-contact';

describe('service contact message', () => {
  it('names the service in the language of the page', () => {
    expect(serviceContactMessage('en', 'UGC ads for TikTok and Meta')).toBe(
      "Hi Gise, I'm interested in: UGC ads for TikTok and Meta",
    );
    expect(serviceContactMessage('es', 'UGC Ads para TikTok y Meta')).toBe(
      'Hola Gise, me interesa: UGC Ads para TikTok y Meta',
    );
  });

  it('prefills WhatsApp from the shared base link and keeps it encoded', () => {
    const href = whatsappLinkWithText(CONTACT_URLS.whatsapp, serviceContactMessage('es', 'Demos de producto UGC'));
    expect(href.startsWith(CONTACT_URLS.whatsapp)).toBe(true);
    const url = new URL(href);
    expect(url.searchParams.get('text')).toBe('Hola Gise, me interesa: Demos de producto UGC');
    expect(href).not.toContain(' ');
  });

  it('appends to a base that already has a query, and leaves an existing text alone', () => {
    expect(whatsappLinkWithText('https://api.whatsapp.com/send?phone=573043786101', 'Hola')).toBe(
      'https://api.whatsapp.com/send?phone=573043786101&text=Hola',
    );
    expect(whatsappLinkWithText('https://wa.me/1?text=Hi', 'Other')).toBe('https://wa.me/1?text=Hi');
  });

  it.each(getAllServiceIds().flatMap((id) => (['es', 'en'] as const).map((locale) => [id, locale] as const)))(
    '%s (%s): the message carries the page label',
    (serviceId, locale) => {
      const page = getServicePageContent(serviceId, locale);
      expect(serviceContactMessage(locale, page.navLabel)).toContain(page.navLabel);
    },
  );
});
