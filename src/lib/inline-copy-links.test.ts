import { describe, expect, it } from 'vitest';
import { parseInlineCopy, visibleInlineCopy } from './inline-copy-links';

describe('parseInlineCopy', () => {
  it('returns the original sentence when there are no links', () => {
    expect(parseInlineCopy('Plain sentence.')).toEqual([{ type: 'text', value: 'Plain sentence.' }]);
  });

  it('splits a Fiverr handle link without keeping markdown in the visible text', () => {
    const segments = parseInlineCopy(
      'Trabaja en Fiverr como [gisela_sm](https://www.fiverr.com/gisela_sm): 4.8/5 en 173 reseñas verificadas.',
    );
    expect(segments).toEqual([
      { type: 'text', value: 'Trabaja en Fiverr como ' },
      { type: 'link', label: 'gisela_sm', href: 'https://www.fiverr.com/gisela_sm' },
      { type: 'text', value: ': 4.8/5 en 173 reseñas verificadas.' },
    ]);
    expect(segments.some((segment) => segment.type === 'link' && segment.href.includes('?'))).toBe(false);
    expect(visibleInlineCopy('Trabaja en Fiverr como [gisela_sm](https://www.fiverr.com/gisela_sm): 4.8/5.')).toBe(
      'Trabaja en Fiverr como gisela_sm: 4.8/5.',
    );
  });

  it('keeps an internal service-page path as a same-origin link', () => {
    const segments = parseInlineCopy('[Creadora UGC bilingüe](/servicios/creadora-ugc-bilingue/)');
    expect(segments).toEqual([
      { type: 'link', label: 'Creadora UGC bilingüe', href: '/servicios/creadora-ugc-bilingue/' },
    ]);
  });
});
