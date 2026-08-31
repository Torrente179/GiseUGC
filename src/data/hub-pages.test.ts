import { describe, it, expect } from 'vitest';
import { getHubChildren, getHubContactHref, getHubDocumentTitle } from './hub-pages';

describe('hub shells', () => {
  it('uses the site name as the empty-shell document title', () => {
    expect(getHubDocumentTitle()).toBe('Gisela Saldarriaga');
  });

  it('points CTAs at the localized contact hash', () => {
    expect(getHubContactHref('es')).toBe('/#contact');
    expect(getHubContactHref('en')).toBe('/en/#contact');
  });

  it('lists existing child landings for each hub', () => {
    expect(getHubChildren('services', 'es').some((child) => child.href === '/servicios/creadora-ugc-bilingue/')).toBe(true);
    expect(getHubChildren('services', 'en').some((child) => child.href === '/en/services/bilingual-ugc-creator/')).toBe(true);
    expect(getHubChildren('verticals', 'es').some((child) => child.href === '/verticales/ugc-beauty/')).toBe(true);
    expect(getHubChildren('resources', 'en').some((child) => child.href === '/en/resources/what-is-ugc/')).toBe(true);
  });
});
