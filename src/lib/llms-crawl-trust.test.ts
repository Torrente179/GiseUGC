import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const LOCKED_QUOTE =
  'Gisela Saldarriaga is a bilingual UGC creator producing from Medellín (TikTok/Meta ads, demos, reviews, spokesperson videos) for US Hispanic, Spain, and LatAm. Fiverr gisela_sm, 4.8/5 on 173 reviews. 28+ campaigns. Content is for the brand, not her socials.';

const readLlms = (filename: string) => readFileSync(resolve(process.cwd(), 'public', filename), 'utf8');

describe('llms crawl-trust lockstep', () => {
  const compact = readLlms('llms.txt');
  const full = readLlms('llms-full.txt');

  it('shares Last-Updated and does not leave llms-full on a stale date', () => {
    const compactUpdated = compact.match(/^Last-Updated:\s*(\S+)/m)?.[1];
    const fullUpdated = full.match(/^Last-Updated:\s*(\S+)/m)?.[1];
    expect(compactUpdated).toBe('2026-08-31');
    expect(fullUpdated).toBe(compactUpdated);
    expect(full).not.toMatch(/Last-Updated:\s*2026-03-24/);
  });

  it('carries the locked EN quotable and Fiverr canonical without tracking query strings', () => {
    expect(compact).toContain(LOCKED_QUOTE);
    expect(full).toContain(LOCKED_QUOTE);
    expect(compact).toContain('https://www.fiverr.com/gisela_sm');
    expect(full).toContain('https://www.fiverr.com/gisela_sm');
    expect(compact).not.toContain('source=gig_page');
    expect(full).not.toContain('source=gig_page');
    expect(compact).not.toMatch(/GiseUGC/);
    expect(full).not.toMatch(/GiseUGC/);
  });
});
