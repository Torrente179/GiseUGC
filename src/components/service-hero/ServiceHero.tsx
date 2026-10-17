import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { FeaturedExample, ServicePageContent } from '@/data/service-pages';
import type { ServiceHeroReview } from '@/data/landing-route-types';
import { getPosterVariantSrc, type ReelClip } from '@/data/portfolio-clips';
import { SITE_PROOF } from '@/data/site-proof';
import { getHomePath, getHubPath, type SiteLocale } from '@/lib/locale-path';
import { resolveFeedSource, warmFeedVideo } from '@/lib/feed-media';
import PretextLineReveal from '@/components/motion/PretextLineReveal';
import AutoplayPreviewVideo from '@/components/media/AutoplayPreviewVideo';
import ResponsivePosterImage from '@/components/media/ResponsivePosterImage';
import WantCta from '@/components/service-keynote/WantCta';
import '@/styles/service-hero.css';

/**
 * The service page hero, picked on the design canvas: "S2 · Glass proof panel"
 * on desktop and "S1 · Phone stage" on phones. Both play the page's own
 * examples (featuredExamples, mapped per service from the video transcripts);
 * the player with sound is the home page's (ReelTheater). Styles:
 * src/styles/service-hero.css.
 */

export type HeroExample = { example: FeaturedExample; clip: ReelClip };

export type HeroLabels = {
  home: string;
  services: string;
  theWork: string;
  openSample: string;
  show: string;
  reviewSource: string;
  fiverrReviews: string;
  delivery: string;
};

type HeroProps = {
  page: ServicePageContent;
  locale: SiteLocale;
  labels: HeroLabels;
  examples: HeroExample[];
  review: ServiceHeroReview | null;
  mediaIntent: boolean;
  theaterOpen: boolean;
  onOpen: (index: number) => void;
};

/**
 * The Fiverr totals (4.7 · 177) are shown only where the page carries the
 * matching AggregateRating, the bilingual page (page.geoFact); other service
 * pages must not grow a rating (changes/seo/seo-crawl-trust.md).
 */
const showsRating = (page: ServicePageContent) => Boolean(page.geoFact);

/** How long each example stays on the phone card: the length of its preview loop. */
const STORY_MS = 6000;

const lengthOf = (seconds?: number) => {
  if (!seconds) return '';
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

const Star = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" />
  </svg>
);

const Play = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M8 5.6v12.8L18.4 12z" />
  </svg>
);

const proofLine = (labels: HeroLabels) =>
  `${SITE_PROOF.fiverrRating.toFixed(1)} · ${SITE_PROOF.fiverrReviewCount} ${labels.fiverrReviews}`;

/* ── Desktop: copy, a real review, and the glass panel with the examples ── */

export const ServiceHeroDesktop = ({ page, locale, labels, examples, review, mediaIntent, theaterOpen, onOpen }: HeroProps) => {
  const [active, setActive] = useState(0);
  const item = examples[active] ?? examples[0];

  return (
    <section className="svh">
      <div className="st-container svh-inner">
        <div className="svh-copy">
          <nav className="st-breadcrumb svh-breadcrumb" aria-label="Breadcrumb">
            <Link to={getHomePath(locale)}>{labels.home}</Link>
            <span aria-hidden="true">/</span>
            <Link to={getHubPath('services', locale)}>{labels.services}</Link>
            <span aria-hidden="true">/</span>
            <span>{page.breadcrumbLabel}</span>
          </nav>
          <p className="svh-eyebrow">{page.heroEyebrow}</p>
          <p className="svh-title">
            <PretextLineReveal text={page.heroTitle} delay={0} stagger={0.1} className="block" />
          </p>
          <p className="svh-summary">{page.heroSummary}</p>
          <div className="svh-actions">
            <WantCta page={page} locale={locale} className="svc-want svh-want" />
            <a className="svh-secondary" href={page.secondaryCtaHref}>{page.secondaryCtaLabel}</a>
          </div>

          {review ? (
            <figure className="svh-review">
              <div className="svh-review-head">
                {review.avatar ? (
                  <img className="svh-review-avatar" src={review.avatar} alt="" width={40} height={40} loading="lazy" decoding="async" />
                ) : (
                  <span className="svh-review-avatar svh-review-avatar--initial" aria-hidden="true">
                    {review.user.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="svh-review-who">
                  <span className="svh-review-name">{review.user}</span>
                  <span className="svh-review-meta">{review.countryName} · {labels.reviewSource}</span>
                </span>
                <span className="svh-review-stars" aria-label={`${review.rating}/5`}>
                  <Star size={13} /><Star size={13} /><Star size={13} /><Star size={13} /><Star size={13} />
                </span>
              </div>
              <blockquote className="svh-review-text" lang={review.lang}>{review.text}</blockquote>
              <figcaption className="svh-review-foot">
                {showsRating(page) ? (
                  <>
                    <span className="svh-star"><Star /></span>
                    <strong>{SITE_PROOF.fiverrRating.toFixed(1)}</strong>
                    <span>· {SITE_PROOF.fiverrReviewCount} {labels.fiverrReviews} · {labels.delivery}</span>
                  </>
                ) : (
                  <span className="svh-review-delivery">{labels.delivery}</span>
                )}
              </figcaption>
            </figure>
          ) : null}
        </div>

        {item ? (
          <div className="svh-panel" id="examples">
            <h2 className="sr-only">{page.featuredTitle}</h2>
            <button
              type="button"
              className="svh-frame"
              aria-label={`${labels.openSample}: ${item.example.title}`}
              onClick={() => onOpen(active)}
            >
              <span key={item.clip.id} className="svh-frame-swap">
                <ResponsivePosterImage
                  clip={item.clip}
                  className="svh-frame-media"
                  alt=""
                  sizes="(min-width: 1280px) 440px, 36vw"
                  loading="eager"
                  decoding="async"
                  fetchpriority={active === 0 ? 'high' : undefined}
                  media="(min-width: 768px)"
                />
                {mediaIntent && !theaterOpen ? (
                  <AutoplayPreviewVideo
                    src={item.clip.previewSrc}
                    poster={getPosterVariantSrc(item.clip, 1080, 'avif')}
                    className="svh-frame-media svh-frame-video"
                    aria-hidden="true"
                    preload="metadata"
                    playbackPriority="hero"
                    rootMargin="260px 0px"
                    activationQuery="(min-width: 768px)"
                  />
                ) : null}
              </span>
              <span className="svh-play" aria-hidden="true"><Play size={24} /></span>
              <span className="svh-tag">
                {item.example.title}
                {item.clip.durationSeconds ? <span className="svh-tag-length"> · {lengthOf(item.clip.durationSeconds)}</span> : null}
              </span>
            </button>

            {examples.length > 1 ? (
              <>
                <div className="svh-strip-head">
                  <span>{labels.theWork}</span>
                  <span>{active + 1} / {examples.length}</span>
                </div>
                <div className="svh-strip" role="group" aria-label={labels.theWork}>
                  {examples.map(({ example, clip }, index) => (
                    <button
                      key={clip.id}
                      type="button"
                      className="svh-thumb"
                      aria-pressed={index === active}
                      aria-label={`${labels.show}: ${example.title}`}
                      title={example.title}
                      onClick={() => setActive(index)}
                    >
                      <img src={getPosterVariantSrc(clip, 180, 'webp')} alt="" width={56} height={76} loading="lazy" decoding="async" />
                    </button>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
};

/* ── Phone: the examples as a feed card at the top, the pitch underneath ── */

export const ServiceHeroMobile = ({ page, locale, labels, examples, mediaIntent, theaterOpen, onOpen }: HeroProps) => {
  const [active, setActive] = useState(0);
  const count = examples.length;
  const item = examples[active] ?? examples[0];

  // Stories-style: each example plays its preview loop, then the next one.
  // Holds still while the player is open and for reduced motion.
  useEffect(() => {
    if (count < 2 || theaterOpen) return undefined;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % count), STORY_MS);
    return () => window.clearTimeout(timer);
  }, [active, count, theaterOpen]);

  // Buffer the next example's loop so the hand-over is instant.
  useEffect(() => {
    if (!mediaIntent || count < 2) return;
    const next = examples[(active + 1) % count];
    warmFeedVideo(resolveFeedSource(next?.clip.previewSrc)?.src);
  }, [active, count, examples, mediaIntent]);

  return (
    <section className="svm">
      {item ? (
        <div className="svm-card">
          <span key={item.clip.id} className="svm-card-swap" aria-hidden="true">
            <ResponsivePosterImage
              clip={item.clip}
              className="svm-card-media"
              alt=""
              sizes="100vw"
              loading="eager"
              decoding="async"
              fetchpriority={active === 0 ? 'high' : undefined}
              media="(max-width: 767px)"
            />
            {mediaIntent && !theaterOpen ? (
              <AutoplayPreviewVideo
                src={item.clip.previewSrc}
                poster={getPosterVariantSrc(item.clip, 720, 'avif')}
                className="svm-card-media svm-card-video"
                aria-hidden="true"
                preload="metadata"
                playbackPriority="hero"
                loadStrategy="immediate"
                rootMargin="220px 0px"
                activationQuery="(max-width: 767px)"
              />
            ) : null}
          </span>
          <button
            type="button"
            className="svm-card-open"
            aria-label={`${labels.openSample}: ${item.example.title}`}
            onClick={() => onOpen(active)}
          />
          {count > 1 ? (
            <div className="svm-bars" role="group" aria-label={labels.theWork}>
              {examples.map(({ example, clip }, index) => (
                <button
                  key={clip.id}
                  type="button"
                  className="svm-bar"
                  aria-pressed={index === active}
                  aria-label={`${labels.show}: ${example.title}`}
                  onClick={() => setActive(index)}
                >
                  <span
                    key={index === active ? `run-${active}` : 'idle'}
                    className={index === active ? 'svm-bar-fill is-running' : index < active ? 'svm-bar-fill is-done' : 'svm-bar-fill'}
                  />
                </button>
              ))}
            </div>
          ) : null}
          <Link className="svm-back" to={getHubPath('services', locale)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M15 5l-7 7 7 7" />
            </svg>
            {labels.services}
          </Link>
          <div className="svm-caption" aria-hidden="true">
            <span className="svm-caption-who">
              <span className="svm-caption-mark">g.</span>
              Gisela Saldarriaga
            </span>
            <span className="svm-caption-title">{item.example.title}</span>
            {item.clip.durationSeconds ? (
              <span className="svm-caption-length">
                <Play size={10} />
                {lengthOf(item.clip.durationSeconds)}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="svm-body">
        <p className="svm-eyebrow">{page.heroEyebrow}</p>
        <h1 className="svm-title">{page.heroTitle}</h1>
        <p className="svm-summary">{page.heroSummary}</p>
        <WantCta page={page} locale={locale} className="svc-want svc-want--block svm-want" />
        <div className="svm-chips">
          {showsRating(page) ? (
            <span className="svm-chip">
              <span className="svh-star"><Star size={12} /></span>
              {proofLine(labels)}
            </span>
          ) : null}
          {page.heroPoints.map((point) => (
            <span key={point} className="svm-chip">{point}</span>
          ))}
        </div>
      </div>

      <nav className="sr-only" aria-label="Breadcrumb">
        <Link to={getHomePath(locale)}>{labels.home}</Link>
        <span>/</span>
        <Link to={getHubPath('services', locale)}>{labels.services}</Link>
        <span>/</span>
        <span>{page.breadcrumbLabel}</span>
      </nav>
    </section>
  );
};
