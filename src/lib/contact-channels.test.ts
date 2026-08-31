import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CONTACT_URLS, FIVERR_PROFILE_URL } from './contact-channels';

describe('Fiverr profile URL', () => {
  it('is the canonical profile without tracking query strings', () => {
    expect(FIVERR_PROFILE_URL).toBe('https://www.fiverr.com/gisela_sm');
    expect(CONTACT_URLS.fiverr).toBe('https://www.fiverr.com/gisela_sm');
    expect(CONTACT_URLS.fiverr).not.toContain('source=gig_page');
    expect(new URL(CONTACT_URLS.fiverr).search).toBe('');
  });
});

describe('gtm-loader page_view', () => {
  it('fires gtag config on load and keeps GTM deferred', () => {
    const source = readFileSync(resolve(process.cwd(), 'public/gtm-loader.js'), 'utf8');
    expect(source).toContain("gtag('config', GA_ID)");
    expect(source).toContain('loadGtag()');
    expect(source).toContain('loadGtm()');
    expect(source).toMatch(/loadGtag\(\);\s*\n\s*var kicked/);
    expect(source).not.toMatch(/function kick\(\)[\s\S]*loadGtag/);
  });
});
