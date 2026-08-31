import { describe, expect, it } from 'vitest';
import { CONTENT_DATES, formatLastUpdatedLabel } from '@/data/content-dates';

describe('formatLastUpdatedLabel', () => {
  it('keeps the existing ES/EN copy shape', () => {
    expect(formatLastUpdatedLabel('2026-03-24', 'es')).toBe('Última actualización: 24 mar 2026');
    expect(formatLastUpdatedLabel('2026-03-24', 'en')).toBe('Last updated: Mar 24, 2026');
    expect(formatLastUpdatedLabel('2026-07-29', 'es')).toBe('Última actualización: 29 jul 2026');
    expect(formatLastUpdatedLabel('2026-07-29', 'en')).toBe('Last updated: Jul 29, 2026');
  });

  it('formats the current family dates used on money pages', () => {
    expect(formatLastUpdatedLabel(CONTENT_DATES.services, 'es')).toBe('Última actualización: 31 ago 2026');
    expect(formatLastUpdatedLabel(CONTENT_DATES.services, 'en')).toBe('Last updated: Aug 31, 2026');
    expect(formatLastUpdatedLabel(CONTENT_DATES.resources, 'es')).toBe('Última actualización: 31 ago 2026');
    expect(formatLastUpdatedLabel(CONTENT_DATES.verticals, 'es')).toBe('Última actualización: 29 jul 2026');
  });

  it('rejects non-ISO dates instead of inventing a label', () => {
    expect(() => formatLastUpdatedLabel('August 31', 'es')).toThrow(/YYYY-MM-DD/u);
  });
});
