import { describe, expect, it } from 'vitest';
import {
  SERVICE_FORMAT_CLIP_IDS,
  SERVICE_TAILORING,
} from '@/data/service-page-tailoring';
import { KEYNOTE_CUTOUTS, KEYNOTE_STILLS, SERVICE_IMAGERY } from '@/data/service-page-imagery';
import { getAllServiceIds, getServicePageContent } from '@/data/service-pages';
import { getClipById } from '@/lib/service-clips';
import { segmentHighlights, splitIntro } from '@/lib/keynote-text';

const LOCALES = ['es', 'en'] as const;
const PAGES = getAllServiceIds().flatMap((id) => LOCALES.map((locale) => [id, locale] as const));

describe('keynote tailoring stays glued to the copy it decorates', () => {
  it.each(PAGES)('%s (%s): accent and highlights are exact substrings', (serviceId, locale) => {
    const page = getServicePageContent(serviceId, locale);
    expect(page.sectionIntroTitleAccent).toBeTruthy();
    expect(page.sectionIntroTitle).toContain(page.sectionIntroTitleAccent ?? '@@none@@');

    expect(page.sectionIntroHighlights?.length).toBeGreaterThanOrEqual(2);
    for (const phrase of page.sectionIntroHighlights ?? []) {
      expect(page.sectionIntroText, phrase).toContain(phrase);
    }

    const fitText = [...page.bestFitItems, ...page.notFitItems];
    expect(page.fitHighlights?.length).toBeGreaterThanOrEqual(4);
    for (const phrase of page.fitHighlights ?? []) {
      expect(
        fitText.some((item) => item.includes(phrase)),
        phrase,
      ).toBe(true);
    }
  });

  it.each(PAGES)('%s (%s): every highlight lands inside one half of the split intro', (serviceId, locale) => {
    const page = getServicePageContent(serviceId, locale);
    const halves = splitIntro(page.sectionIntroText);
    expect(halves.filter(Boolean).join(' ')).toBe(page.sectionIntroText);
    for (const phrase of page.sectionIntroHighlights ?? []) {
      expect(
        halves.some((half) => half.includes(phrase)),
        `${phrase} is cut by the split`,
      ).toBe(true);
    }
  });
});

describe('format clips', () => {
  it.each(getAllServiceIds())('%s: four distinct clips, shared by ES and EN, mostly the page\'s own', (serviceId) => {
    const ids = SERVICE_FORMAT_CLIP_IDS[serviceId];
    expect(ids).toHaveLength(4);
    expect(new Set(ids).size).toBe(4);
    for (const id of ids) expect(getClipById(id), `clip ${id}`).toBeDefined();

    const es = getServicePageContent(serviceId, 'es');
    const en = getServicePageContent(serviceId, 'en');
    expect(es.deliverables.map((item) => item.clipId)).toEqual(ids);
    expect(en.deliverables.map((item) => item.clipId)).toEqual(ids);

    const own = es.featuredExamples.map((example) => example.clipId);
    expect(ids.filter((id) => own.includes(id)).length).toBeGreaterThanOrEqual(3);
  });
});

describe('per-service imagery', () => {
  it('rotates the cut-outs so neighbouring services differ', () => {
    const order = getAllServiceIds().map((id) => SERVICE_IMAGERY[id].cutout);
    order.forEach((cutout, index) => {
      if (index > 0) expect(cutout).not.toBe(order[index - 1]);
    });
    for (const cutout of order) expect(KEYNOTE_CUTOUTS[cutout]).toBeDefined();
  });

  it.each(getAllServiceIds())('%s: one still per process step, all in the catalog', (serviceId) => {
    const imagery = SERVICE_IMAGERY[serviceId];
    const steps = getServicePageContent(serviceId, 'en').processSteps.length;
    expect(imagery.process).toHaveLength(steps);
    for (const use of [imagery.fit, ...imagery.process]) {
      expect(KEYNOTE_STILLS[use.id], use.id).toBeDefined();
      expect(KEYNOTE_STILLS[use.id].alt.es.length).toBeGreaterThan(10);
      expect(KEYNOTE_STILLS[use.id].alt.en.length).toBeGreaterThan(10);
    }
  });
});

describe('segmentHighlights', () => {
  it('wraps exact matches, longest phrase first, and ignores phrases that are missing', () => {
    const text = 'One nice video won’t cut it. Keep the ones that work.';
    const parts = segmentHighlights(text, ['nice video', 'One nice video won’t cut it.', 'not here']);
    expect(parts.map((part) => part.text).join('')).toBe(text);
    // The longer phrase wins over the shorter one it contains.
    expect(parts.filter((part) => part.strong).map((part) => part.text)).toEqual([
      'One nice video won’t cut it.',
    ]);

    const second = segmentHighlights(text, ['nice video', 'Keep the ones that work.']);
    expect(second.filter((part) => part.strong).map((part) => part.text)).toEqual([
      'nice video',
      'Keep the ones that work.',
    ]);
  });

  it('degrades to plain text when nothing matches', () => {
    expect(segmentHighlights('plain', ['missing'])).toEqual([{ text: 'plain', strong: false }]);
    expect(segmentHighlights('plain')).toEqual([{ text: 'plain', strong: false }]);
  });

  it('does not overlap: a longer phrase absorbs a shorter one inside it', () => {
    const parts = segmentHighlights('a b c d', ['b c', 'b']);
    expect(parts.filter((part) => part.strong).map((part) => part.text)).toEqual(['b c']);
  });
});
