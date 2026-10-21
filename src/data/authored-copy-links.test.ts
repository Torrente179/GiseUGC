import { describe, expect, it } from 'vitest';
import { parseInlineCopy } from '@/lib/inline-copy-links';
import {
  SITE_LOCALES,
  getHubIdsInOrder,
  getLegalIdsInOrder,
  getResourceIdsInOrder,
  getServiceIdsInOrder,
} from '@/lib/locale-path';
import { safeInlineHref } from '@/lib/safe-inline-href';
import { getHomepageFaqItems } from './homepage-faq';
import { getHubPageContent } from './hub-pages';
import { getLegalPageContent } from './legal-pages';
import { getResourcePageContent } from './resource-pages';
import { getServicePageContent } from './service-pages';

/*
 * Copy links are written in the data modules, so a link the scheme check
 * rejects is an authoring mistake (mailto:, http://, a #fragment that starts
 * with a digit), not an attack. The renderers would quietly show it as plain
 * text in production; this test fails in CI instead.
 */

type FoundLink = { where: string; href: string };

const collectLinks = (value: unknown, where: string, found: FoundLink[], seen: WeakSet<object>) => {
  if (typeof value === 'string') {
    for (const segment of parseInlineCopy(value)) {
      if (segment.type === 'link') found.push({ where, href: segment.href });
    }
    return;
  }
  if (value === null || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  const record = value as Record<string, unknown>;
  if (record.type === 'link' && typeof record.href === 'string') {
    found.push({ where, href: record.href });
    return;
  }
  for (const [key, child] of Object.entries(record)) collectLinks(child, `${where}.${key}`, found, seen);
};

const sources: Array<[string, unknown]> = [
  // Every exported constant, including copy no page getter reaches yet.
  ...Object.entries(import.meta.glob(['./*.ts', '!./*.test.ts'], { eager: true })),
  ...SITE_LOCALES.flatMap((locale): Array<[string, unknown]> => [
    [`homepage FAQ (${locale})`, getHomepageFaqItems(locale)],
    ...getServiceIdsInOrder().map((id): [string, unknown] => [`service ${id} (${locale})`, getServicePageContent(id, locale)]),
    ...getResourceIdsInOrder().map((id): [string, unknown] => [`resource ${id} (${locale})`, getResourcePageContent(id, locale)]),
    ...getHubIdsInOrder().map((id): [string, unknown] => [`hub ${id} (${locale})`, getHubPageContent(id, locale)]),
    ...getLegalIdsInOrder().map((id): [string, unknown] => [`legal ${id} (${locale})`, getLegalPageContent(id, locale)]),
  ]),
];

const links = sources.flatMap(([where, value]) => {
  const found: FoundLink[] = [];
  collectLinks(value, where, found, new WeakSet());
  return found;
});

describe('authored copy links', () => {
  it('finds the links written in the data modules', () => {
    expect(links.length).toBeGreaterThan(20);
  });

  it('only uses hrefs the renderers keep as links', () => {
    expect(links.filter((link) => safeInlineHref(link.href) === null)).toEqual([]);
  });
});
