// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { renderInlineCopy, safeInlineHref as buildSafeInlineHref } from '../../scripts/lib/entry-html.mjs';
import { safeInlineHref } from './safe-inline-href';

/*
 * The static entry HTML (boot shells, hub and guide shells) is written by the
 * scripts in scripts/, not by React. They must drop the same links the browser
 * renderer drops.
 */

describe('links in build-time entry HTML', () => {
  it('uses the same scheme check as the browser renderer', () => {
    expect(typeof buildSafeInlineHref).toBe('function');
    for (const href of ['/servicios/', '#faq', 'https://www.fiverr.com/gisela_sm', 'javascript:alert(1)', 'mailto:hola@example.com', 'http://example.com/', '#1-paso', '//other.example/', 'https://user@other.example/']) {
      expect(buildSafeInlineHref(href)).toBe(safeInlineHref(href));
    }
  });

  // A ")" would end the copy token early, so the payloads avoid parentheses.
  it.each(['javascript:alert`1`', 'data:text/html,hello', '//other.example/path', '/\\other.example/path', 'https://user@other.example/'])(
    'writes the label without a link for %s',
    (href) => {
      expect(renderInlineCopy(`Ver [Open](${href}) ahora`)).toBe('Ver Open ahora');
    },
  );

  it('keeps site routes and ordinary HTTPS links', () => {
    expect(renderInlineCopy('[Servicios](/servicios/)')).toBe('<a href="/servicios/">Servicios</a>');
    expect(renderInlineCopy('[Fiverr](https://www.fiverr.com/gisela_sm)')).toBe(
      '<a href="https://www.fiverr.com/gisela_sm">Fiverr</a>',
    );
  });
});
