import { describe, it, expect } from 'vitest';
import {
  LEGACY_REEL_CLIPS,
  FEATURED_REEL_CLIP_IDS,
} from './portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from './nuevos-r2-ready';
import { getAllServiceIds, getServicePageContent } from './service-pages';
import { getAllVerticalIds, getVerticalPageContent } from './vertical-pages';
import type { SiteLocale } from '@/lib/locale-path';

// The canonical merged clip set, mirroring Portfolio.tsx's ALL_REEL_CLIPS.
const ALL_CLIPS = [...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS];
const CLIP_IDS = new Set(ALL_CLIPS.map((c) => c.id));
const SERVICE_IDS = new Set(getAllServiceIds());
const LOCALES: SiteLocale[] = ['es', 'en'];

describe('reel clip catalog', () => {
  it('has no duplicate clip ids across legacy + generated sources', () => {
    const ids = ALL_CLIPS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every featured clip id exists in the catalog', () => {
    for (const id of FEATURED_REEL_CLIP_IDS) {
      expect(CLIP_IDS.has(id)).toBe(true);
    }
  });
});

describe('service pages reference real data', () => {
  for (const serviceId of getAllServiceIds()) {
    for (const locale of LOCALES) {
      it(`${serviceId} (${locale}): featured clips + related services resolve`, () => {
        const content = getServicePageContent(serviceId, locale);
        for (const example of content.featuredExamples) {
          expect(CLIP_IDS.has(example.clipId)).toBe(true);
        }
        for (const relatedId of content.relatedServiceIds) {
          expect(SERVICE_IDS.has(relatedId)).toBe(true);
        }
      });
    }
  }
});

describe('vertical pages reference real data', () => {
  for (const verticalId of getAllVerticalIds()) {
    for (const locale of LOCALES) {
      it(`${verticalId} (${locale}): featured clips + related services resolve`, () => {
        const content = getVerticalPageContent(verticalId, locale);
        for (const example of content.featuredExamples) {
          expect(CLIP_IDS.has(example.clipId)).toBe(true);
        }
        for (const relatedId of content.relatedServiceIds) {
          expect(SERVICE_IDS.has(relatedId)).toBe(true);
        }
      });
    }
  }
});
