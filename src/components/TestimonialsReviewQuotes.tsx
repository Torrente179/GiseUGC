import { FIVERR_REVIEWS } from '@/data/fiverr-reviews';
import type { SiteLocale } from '@/lib/locale-path';

/**
 * Crawl-facing review text for the homepage testimonials placeholder.
 * Videos and photos stay in the lazy Testimonials chunk. Do not add Review
 * JSON-LD here — homepage schema keeps the marketplace AggregateRating only.
 */
const formatRating = (rating: number) => (rating % 1 ? rating.toFixed(1) : String(rating));

const regionNamesFor = (locale: SiteLocale) => {
  try {
    return new Intl.DisplayNames([locale], { type: 'region' });
  } catch {
    return null;
  }
};

const TestimonialsReviewQuotes = ({ locale }: { locale: SiteLocale }) => {
  const regionNames = regionNamesFor(locale);
  const title = locale === 'en' ? 'Testimonials' : 'Testimonios';

  return (
    <div className="sr-only">
      <h2>{title}</h2>
      <ol>
        {FIVERR_REVIEWS.map((review) => {
          const country = review.country
            ? regionNames?.of(review.country) ?? review.country
            : '';
          return (
            <li key={review.id}>
              <p>
                {review.user}
                {country ? ` · ${country}` : ''}
                {` · ${formatRating(review.rating)}/5`}
              </p>
              <blockquote lang={review.lang}>{review.text}</blockquote>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default TestimonialsReviewQuotes;
