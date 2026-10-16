import { describe, expect, it } from 'vitest';
import { FIVERR_REVIEWS } from '@/data/fiverr-reviews';
import { getAllServiceIds } from '@/data/service-pages';
import { SERVICE_HERO_REVIEW_ID } from '@/data/service-hero-reviews';
import { buildServiceLandingRouteData } from '@/data/landing-route-data.server';

describe('service hero reviews', () => {
  it.each(getAllServiceIds())('%s: a real 5-star review, in both languages', (serviceId) => {
    const review = FIVERR_REVIEWS.find((item) => item.id === SERVICE_HERO_REVIEW_ID[serviceId]);
    expect(review, SERVICE_HERO_REVIEW_ID[serviceId]).toBeDefined();
    expect(review!.rating).toBe(5);

    for (const locale of ['es', 'en'] as const) {
      const { heroReview } = buildServiceLandingRouteData(serviceId, locale);
      expect(heroReview?.user).toBe(review!.user);
      expect(heroReview?.countryName).toBeTruthy();
      // Quotes and emoji are trimmed for the card; the words stay the client's.
      expect(heroReview?.text).not.toMatch(/^["“]|\p{Extended_Pictographic}/u);
    }
  });
});
