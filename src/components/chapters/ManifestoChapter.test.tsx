import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LocaleProvider } from '@/lib/locale-context';
import ManifestoChapter from './ManifestoChapter';

describe('ManifestoChapter prerender numerals', () => {
  it('bakes the locked 28+ campañas figure and does not emit zero counters', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <LocaleProvider>
          <ManifestoChapter />
        </LocaleProvider>
      </MemoryRouter>,
    );

    expect(container.textContent).toContain('28+');
    expect(container.textContent).toMatch(/Campañas/i);
    expect(container.textContent).not.toMatch(/0\+/);
    expect(container.textContent).not.toMatch(/0M\+/);
    expect(container.textContent).not.toMatch(/0%/);
    expect(container.textContent).not.toContain('50+');
  });
});
