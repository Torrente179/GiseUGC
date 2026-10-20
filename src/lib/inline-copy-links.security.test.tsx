import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { describe, expect, it } from 'vitest';
import { InlineCopy, inlineCopyHrefs, type InlineCopySegment } from './inline-copy-links';

const renderLink = (href: string) => {
  const segments: InlineCopySegment[] = [{ type: 'link', label: 'Open', href }];
  return renderToStaticMarkup(
    <StaticRouter location="/">
      <InlineCopy text={segments} />
    </StaticRouter>,
  );
};

describe('links in prerendered copy', () => {
  it.each(['javascript:alert(1)', 'data:text/html,hello', '//other.example/path', '/\\other.example/path', 'https://user@other.example/'])(
    'shows the label without navigating to %s',
    (href) => {
      expect(renderLink(href)).toBe('Open');
      expect(inlineCopyHrefs([{ type: 'link', label: 'Open', href }])).toEqual([]);
    },
  );

  it('keeps site routes and ordinary HTTPS links', () => {
    expect(renderLink('/servicios/')).toContain('href="/servicios/"');
    expect(renderLink('https://www.fiverr.com/gisela_sm')).toContain('rel="noopener noreferrer"');
  });
});
