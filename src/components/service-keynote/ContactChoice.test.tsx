import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { StaticRouter } from 'react-router-dom/server';
import { LocaleProvider } from '@/lib/locale-context';
import { CONTACT_URLS } from '@/lib/contact-channels';
import { getServicePageContent } from '@/data/service-pages';
import ContactChoice from './ContactChoice';

const renderChoice = (locale: 'es' | 'en') => {
  const page = getServicePageContent('ugc-ads-tiktok-meta', locale);
  render(
    <StaticRouter location={page.path}>
      <LocaleProvider>
        <ContactChoice page={page}>
          {(trigger) => (
            <a {...trigger} data-testid="trigger">
              {page.primaryCtaLabel}
            </a>
          )}
        </ContactChoice>
      </LocaleProvider>
    </StaticRouter>,
  );
  return page;
};

describe('ContactChoice', () => {
  it('is a plain link until opened, then offers WhatsApp (with the service named) and Telegram', () => {
    const page = renderChoice('en');
    const trigger = screen.getByTestId('trigger');
    expect(trigger).toHaveAttribute('href', `${page.path}#contact`);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    const links = within(dialog).getAllByRole('link');
    expect(links).toHaveLength(2);
    const whatsapp = new URL(links[0].getAttribute('href') ?? '');
    expect(links[0].getAttribute('href')?.startsWith(CONTACT_URLS.whatsapp)).toBe(true);
    expect(whatsapp.searchParams.get('text')).toBe("Hi Gise, I'm interested in: UGC ads for TikTok and Meta");
    expect(links[1]).toHaveAttribute('href', CONTACT_URLS.telegram);
    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
    }
  });

  it('writes the message in Spanish on the Spanish page', () => {
    renderChoice('es');
    fireEvent.click(screen.getByTestId('trigger'));
    const href = within(screen.getByRole('dialog')).getAllByRole('link')[0].getAttribute('href') ?? '';
    expect(new URL(href).searchParams.get('text')).toBe('Hola Gise, me interesa: UGC Ads para TikTok y Meta');
  });

  it('closes on Escape and returns focus to the trigger', () => {
    renderChoice('en');
    const trigger = screen.getByTestId('trigger');
    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(trigger).toHaveFocus();
  });
});
