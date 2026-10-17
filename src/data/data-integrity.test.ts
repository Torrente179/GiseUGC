import { describe, it, expect } from 'vitest';
import {
  LEGACY_REEL_CLIPS,
  FEATURED_REEL_CLIP_IDS,
} from './portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from './nuevos-r2-ready';
import { FIVERR_COUNTRY_NAMES, FIVERR_REVIEWS } from './fiverr-reviews';
import { getAllServiceIds, getServicePageContent } from './service-pages';
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

describe('Fiverr review countries', () => {
  // The names are rendered as generated, never with Intl at runtime: Safari
  // names some regions differently from the prerender (CN), which broke the
  // home page's hydration on iPhone.
  it('names every reviewer country in both languages', () => {
    const codes = [...new Set(FIVERR_REVIEWS.map((review) => review.country))];
    (['es', 'en'] as const).forEach((locale) => {
      const unnamed = codes.filter((code) => !FIVERR_COUNTRY_NAMES[locale][code] || FIVERR_COUNTRY_NAMES[locale][code] === code);
      expect(unnamed).toEqual([]);
    });
  });
});
