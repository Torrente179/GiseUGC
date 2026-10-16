import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '@/lib/locale-context';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { useMediaSession } from '@/components/media/MediaSessionProvider';
import { scrollToY } from '@/lib/motion/native-scroll';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { SITE_PROOF } from '@/data/site-proof';
import {
  FIVERR_PROFILE_URL,
  FIVERR_REVIEWS,
  FIVERR_SUMMARY,
  type FiverrReview,
} from '@/data/fiverr-reviews';
import '@/styles/testimonials.css';

/**
 * Testimonios: every 4- and 5-star review from Gisela's Fiverr profile
 * (src/data/fiverr-reviews.ts, built from a capture of the live profile),
 * shown the way Fiverr shows them: the client, their country, the stars, the
 * date, the service and the review in its own language, plus Gisela's reply
 * and the delivered video when the review has one. The video plays from
 * Fiverr's media CDN only when someone presses play. Styles:
 * src/styles/testimonials.css.
 */

type Filter = 'all' | 'video' | 'es' | 'en';

const PAGE = 9;
const LONG_TEXT = 260;
const AVATAR_SRC = '/uploads/gisela-avatar-160.webp';
const TONES = ['#14758f', '#9a6b3c', '#4f6a5a', '#7a5470', '#3f5f8a', '#a0574a', '#5b6b2f', '#6a4f8a'];

const toneOf = (user: string) => {
  let hash = 0;
  for (const char of user) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return TONES[hash % TONES.length];
};

const flagOf = (code: string) =>
  String.fromCodePoint(...[...code.toUpperCase()].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65));

/** Most telling first: the rating, then how much the client wrote. */
const ORDERED = [...FIVERR_REVIEWS].sort(
  (a, b) => b.rating - a.rating || b.text.length - a.text.length,
);

const FILTERS: Array<{ id: Filter; key: string; test: (review: FiverrReview) => boolean }> = [
  { id: 'all', key: 'testimonials.filterAll', test: () => true },
  { id: 'video', key: 'testimonials.filterVideo', test: (review) => Boolean(review.video) },
  { id: 'es', key: 'testimonials.filterEs', test: (review) => review.lang === 'es' },
  { id: 'en', key: 'testimonials.filterEn', test: (review) => review.lang === 'en' },
];

const Star = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" />
  </svg>
);

/**
 * Fiverr dates its reviews relatively ("5 months ago"), so the data keeps a
 * month and the card says how long ago that was, from the visitor's clock.
 * Computed after mount: the prerendered HTML can be days or months old.
 */
const useMonthNow = () => {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const today = new Date();
    setNow(today.getUTCFullYear() * 12 + today.getUTCMonth());
  }, []);
  return now;
};

/** 1 column on phones, 2 on tablets, 3 on desktop; items fill round-robin so "show more" only appends. */
const useColumnCount = () => {
  const [count, setCount] = useState(1);
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 1024px)');
    const medium = window.matchMedia('(min-width: 640px)');
    const sync = () => setCount(wide.matches ? 3 : medium.matches ? 2 : 1);
    sync();
    wide.addEventListener('change', sync);
    medium.addEventListener('change', sync);
    return () => {
      wide.removeEventListener('change', sync);
      medium.removeEventListener('change', sync);
    };
  }, []);
  return count;
};

type CardProps = {
  review: FiverrReview;
  locale: 'es' | 'en';
  countryName: (code: string) => string;
  ago: (month: string) => string;
  onPlay: (review: FiverrReview, opener: HTMLButtonElement) => void;
};

const ReviewCard = ({ review, locale, countryName, ago, onPlay }: CardProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const long = review.text.length > LONG_TEXT;
  const rating = review.rating % 1 ? review.rating.toFixed(1) : String(review.rating);

  return (
    <article className="fr-card">
      <header className="fr-head">
        <span className="fr-avatar" style={{ background: toneOf(review.user) }} aria-hidden="true">
          {review.user.charAt(0).toUpperCase()}
        </span>
        <span className="fr-who">
          <span className="fr-name">{review.user}</span>
          <span className="fr-country">
            <span className="fr-flag" aria-hidden="true">{flagOf(review.country)}</span>
            {countryName(review.country)}
          </span>
        </span>
        <span className="fr-rating" aria-label={t('testimonials.ratingAria', { rating })}>
          <Star />
          {rating}
        </span>
      </header>

      <p className="fr-meta">
        {t(`testimonials.services.${review.service}`)}
        {ago(review.date) ? ` · ${ago(review.date)}` : null}
        {review.lang !== locale ? <span className="fr-lang">{t(`testimonials.inLang.${review.lang}`)}</span> : null}
      </p>

      <p className="fr-text" data-clamped={long && !expanded ? 'true' : undefined} lang={review.lang}>
        {review.text}
      </p>
      {long ? (
        <button type="button" className="fr-more" aria-expanded={expanded} onClick={() => setExpanded((open) => !open)}>
          {t(expanded ? 'testimonials.readLess' : 'testimonials.readMore')}
        </button>
      ) : null}

      {review.video ? (
        <button
          type="button"
          className="fr-video"
          aria-label={t('testimonials.playVideo', { user: review.user })}
          onClick={(event) => onPlay(review, event.currentTarget)}
        >
          <img src={review.video.poster} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" />
          <span className="fr-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d="M8 5.6v12.8L18.4 12z" /></svg>
          </span>
          <span className="fr-video-tag">{t('testimonials.videoTag')}</span>
        </button>
      ) : null}

      {review.reply ? (
        <div className="fr-reply">
          <img src={AVATAR_SRC} alt="" width={160} height={160} />
          <p>
            <span className="fr-reply-label">{t('testimonials.reply')}</span>
            {review.reply}
          </p>
        </div>
      ) : null}
    </article>
  );
};

const Testimonials = () => {
  const { t, locale } = useTranslation();
  const mediaSession = useMediaSession();
  const headerRevealRef = useScrollReveal<HTMLDivElement>();
  const columns = useColumnCount();
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const [filter, setFilter] = useState<Filter>('all');
  const [shown, setShown] = useState(PAGE);
  const [playing, setPlaying] = useState<FiverrReview | null>(null);

  const regionNames = useMemo(() => {
    try {
      return new Intl.DisplayNames([locale], { type: 'region' });
    } catch {
      return null;
    }
  }, [locale]);
  const countryName = useCallback((code: string) => regionNames?.of(code) ?? code, [regionNames]);
  const monthNow = useMonthNow();
  const relative = useMemo(() => new Intl.RelativeTimeFormat(locale, { numeric: 'always' }), [locale]);
  const ago = useCallback(
    (month: string) => {
      if (monthNow === null) return '';
      const [year, monthOfYear] = month.split('-').map(Number);
      const months = Math.max(0, monthNow - (year * 12 + monthOfYear - 1));
      return months < 12 ? relative.format(-Math.max(1, months), 'month') : relative.format(-Math.floor(months / 12), 'year');
    },
    [monthNow, relative],
  );

  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((item) => [item.id, ORDERED.filter(item.test).length])) as Record<Filter, number>,
    [],
  );
  const list = useMemo(() => ORDERED.filter(FILTERS.find((item) => item.id === filter)!.test), [filter]);
  const visible = list.slice(0, shown);
  const lanes = Array.from({ length: columns }, (_, lane) => visible.filter((_, index) => index % columns === lane));

  const pickFilter = (next: Filter) => {
    setFilter(next);
    setShown(PAGE);
  };

  const openVideo = useCallback((review: FiverrReview, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setPlaying(review);
  }, []);
  const closeVideo = useCallback(() => setPlaying(null), []);

  // The player has the page's attention: other videos pause, the page holds
  // still behind it (position: fixed, immune to body overflow-x), Escape
  // closes it and focus returns to the card that opened it.
  useEffect(() => {
    if (!playing) return undefined;
    const release = mediaSession?.acquireTheater();
    const { body } = document;
    const scrollY = window.scrollY;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width };
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    const opener = openerRef.current;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPlaying(null);
    };
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      release?.();
      document.removeEventListener('keydown', onKey);
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      scrollToY(scrollY, { immediate: true });
      opener?.focus({ preventScroll: true });
    };
  }, [mediaSession, playing]);

  const pageLocale = locale === 'en' ? 'en' : 'es';
  const playingRating = playing ? (playing.rating % 1 ? playing.rating.toFixed(1) : String(playing.rating)) : '';

  return (
    <section id="testimonials" className="studio-section fr-section" aria-labelledby="testimonials-title">
      <div className="studio-container">
        <div ref={headerRevealRef} className="svc-reveal fr-header">
          <div>
            <p className="section-label text-muted-foreground mb-3">{t('testimonials.sectionSubtitle')}</p>
            <h2 id="testimonials-title" className="studio-title">
              <SplitTextReveal text={t('testimonials.sectionTitle')} delay={0.08} />
            </h2>
          </div>

          <div className="fr-proof">
            <p className="fr-score">
              <span className="fr-score-star"><Star size={20} /></span>
              <span className="fr-score-value">{SITE_PROOF.fiverrRating.toFixed(1)}</span>
              <span className="fr-score-count">{t('testimonials.reviewCount', { count: SITE_PROOF.fiverrReviewCount })}</span>
            </p>
            <dl className="fr-subs">
              <div><dt>{t('testimonials.communication')}</dt><dd>{FIVERR_SUMMARY.communication.toFixed(1)}</dd></div>
              <div><dt>{t('testimonials.quality')}</dt><dd>{FIVERR_SUMMARY.quality.toFixed(1)}</dd></div>
              <div><dt>{t('testimonials.value')}</dt><dd>{FIVERR_SUMMARY.value.toFixed(1)}</dd></div>
            </dl>
            <a className="fr-profile" href={FIVERR_PROFILE_URL} target="_blank" rel="noopener noreferrer">
              {t('testimonials.viewProfile')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
          </div>
        </div>

        <div className="fr-filters" role="group" aria-label={t('testimonials.filtersLabel')}>
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="fr-chip"
              aria-pressed={filter === item.id}
              onClick={() => pickFilter(item.id)}
            >
              {t(item.key)}
              <span className="fr-chip-count">{counts[item.id]}</span>
            </button>
          ))}
        </div>

        <div className="fr-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {lanes.map((lane, laneIndex) => (
            <div key={laneIndex} className="fr-lane">
              {lane.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  locale={pageLocale}
                  countryName={countryName}
                  ago={ago}
                  onPlay={openVideo}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="fr-footer">
          <p className="fr-showing" aria-live="polite">
            {t('testimonials.showing', { shown: visible.length, total: list.length })}
          </p>
          {visible.length < list.length ? (
            <button type="button" className="fr-load" onClick={() => setShown((count) => count + PAGE)}>
              {t('testimonials.showMore')}
            </button>
          ) : null}
        </div>
      </div>

      {playing && typeof document !== 'undefined'
        ? createPortal(
            <div className="fr-modal" role="dialog" aria-modal="true" aria-label={t('testimonials.videoDialog', { user: playing.user })}>
              <button type="button" className="fr-modal-scrim" aria-label={t('testimonials.close')} onClick={closeVideo} />
              <div className="fr-modal-card">
                <button ref={closeRef} type="button" className="fr-modal-close" aria-label={t('testimonials.close')} onClick={closeVideo}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true" focusable="false">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
                <video
                  key={playing.id}
                  className="fr-modal-video"
                  src={playing.video?.src}
                  poster={playing.video?.poster}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                />
                <div className="fr-modal-meta">
                  <span className="fr-avatar" style={{ background: toneOf(playing.user) }} aria-hidden="true">
                    {playing.user.charAt(0).toUpperCase()}
                  </span>
                  <span className="fr-who">
                    <span className="fr-name">{playing.user}</span>
                    <span className="fr-country">
                      <span className="fr-flag" aria-hidden="true">{flagOf(playing.country)}</span>
                      {countryName(playing.country)}
                    </span>
                  </span>
                  <span className="fr-rating" aria-label={t('testimonials.ratingAria', { rating: playingRating })}>
                    <Star />
                    {playingRating}
                  </span>
                </div>
                <p className="fr-modal-quote" lang={playing.lang}>{playing.text}</p>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
};

export default Testimonials;
