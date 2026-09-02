import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { describe, expect, it } from 'vitest';
import { LocaleProvider } from '@/lib/locale-context';
import Navbar from './Navbar';

const renderNav = (path: string) =>
  renderToStaticMarkup(
    <StaticRouter location={path}>
      <LocaleProvider>
        <Navbar />
      </LocaleProvider>
    </StaticRouter>,
  );

describe('cinematic hero overlay navbar', () => {
  it('applies title-sequence-nav on Home at rest', () => {
    expect(renderNav('/')).toContain('title-sequence-nav');
  });

  it('applies title-sequence-nav on ES and EN service landings at rest', () => {
    expect(renderNav('/servicios/creadora-ugc-bilingue/')).toContain('title-sequence-nav');
    expect(renderNav('/en/services/bilingual-ugc-creator/')).toContain('title-sequence-nav');
    expect(renderNav('/servicios/videos-de-portavoz/')).toContain('title-sequence-nav');
  });

  it('does not overlay resource, vertical, or hub routes at rest', () => {
    expect(renderNav('/recursos/que-es-ugc/')).not.toContain('title-sequence-nav');
    expect(renderNav('/verticales/ugc-beauty/')).not.toContain('title-sequence-nav');
    expect(renderNav('/servicios/')).not.toContain('title-sequence-nav');
  });
});
