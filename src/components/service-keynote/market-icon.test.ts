import { describe, expect, it } from 'vitest';
import { getAllServiceIds, getServicePageContent } from '@/data/service-pages';
import { marketIconFor } from './market-icon';

const iconsFor = (lines: string[]) => lines.map((line, index) => marketIconFor(line, index));

describe('"Mercados y formatos" tile icons', () => {
  const ids = getAllServiceIds();

  it('opens every page on the globe: the first line is always where the brands are', () => {
    ids.forEach((id) => {
      (['es', 'en'] as const).forEach((locale) => {
        expect(iconsFor(getServicePageContent(id, locale).marketItems)[0]).toBe('globe');
      });
    });
  });

  it('never shows the same icon twice on one page', () => {
    ids.forEach((id) => {
      const icons = iconsFor(getServicePageContent(id, 'es').marketItems);
      expect(new Set(icons).size, `${id}: ${icons.join(', ')}`).toBe(icons.length);
    });
  });

  it('gives the Spanish and English page the same icons', () => {
    ids.forEach((id) => {
      expect(iconsFor(getServicePageContent(id, 'en').marketItems), id).toEqual(
        iconsFor(getServicePageContent(id, 'es').marketItems),
      );
    });
  });

  it('reads what a line is about', () => {
    expect(marketIconFor('Videos cortos en inglés hablando a cámara, con tu guion.', 1)).toBe('voice');
    expect(marketIconFor('Contenido para redes en español e inglés.', 1)).toBe('social');
    expect(marketIconFor('Público que todavía no conoce tu marca.', 2)).toBe('audience');
    expect(marketIconFor('Campañas de conversión en Meta Ads y TikTok Ads.', 1)).toBe('target');
    expect(marketIconFor('Videos para páginas de producto, landing pages y email marketing.', 2)).toBe('page');
    expect(marketIconFor('Algo sin pistas', 1)).toBe('video');
  });
});
