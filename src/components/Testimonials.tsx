import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '@/lib/locale-context';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { useMediaSession } from '@/components/media/MediaSessionProvider';
import { scrollToY } from '@/lib/motion/native-scroll';
import { canPlayHevc } from '@/lib/feed-media';
import { releaseVideo } from '@/lib/video-lifecycle';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { SITE_PROOF } from '@/data/site-proof';
import {
  FIVERR_COUNTRY_NAMES,
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
 * date, the service and the review in its own language, plus Gisela's reply.
 *
 * Layout (the canvas's "R1 · Featured video + review wall"): one delivered
 * video featured with its client's review, a strip of every client video to
 * switch it, and the review wall beside it with its filters. Photos and videos
 * are on Gisela's R2 (scripts/self-host-fiverr-media.mjs); a video loads only
 * when someone presses play. Styles: src/styles/testimonials.css.
 */

type Filter = 'all' | 'video' | 'es' | 'en';

const PAGE = 8;
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

/** The reviews that come with the video Gisela delivered, in the same order. */
const VIDEO_REVIEWS = ORDERED.filter((review) => review.video);

const lengthOf = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

const FILTERS: Array<{ id: Filter; key: string; test: (review: FiverrReview) => boolean }> = [
  { id: 'all', key: 'testimonials.filterAll', test: () => true },
  { id: 'video', key: 'testimonials.filterVideo', test: (review) => Boolean(review.video) },
  { id: 'es', key: 'testimonials.filterEs', test: (review) => review.lang === 'es' },
  { id: 'en', key: 'testimonials.filterEn', test: (review) => review.lang === 'en' },
];

/** The client's Fiverr photo, or their initial on a colour when they have none. */
const Avatar = ({ review }: { review: FiverrReview }) =>
  review.avatar ? (
    <img
      className="fr-avatar fr-avatar--photo"
      src={review.avatar}
      alt=""
      width={40}
      height={40}
      loading="lazy"
      decoding="async"
    />
  ) : (
    <span className="fr-avatar" style={{ background: toneOf(review.user) }} aria-hidden="true">
      {review.user.charAt(0).toUpperCase()}
    </span>
  );

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

/** 1 lane on phones, 2 from 640 px (beside the featured video on desktop); cards fill round-robin so "show more" only appends. */
const useColumnCount = () => {
  const [count, setCount] = useState(1);
  useEffect(() => {
    const medium = window.matchMedia('(min-width: 640px)');
    const sync = () => setCount(medium.matches ? 2 : 1);
    sync();
    medium.addEventListener('change', sync);
    return () => medium.removeEventListener('change', sync);
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
        <Avatar review={review} />
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
          className="fr-card-video"
          aria-label={t('testimonials.playVideo', { user: review.user })}
          onClick={(event) => onPlay(review, event.currentTarget)}
        >
          <span className="fr-card-video-thumb">
            <img src={review.video.thumb} alt="" loading="lazy" decoding="async" />
            <span className="fr-card-video-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d="M8 5.6v12.8L18.4 12z" /></svg>
            </span>
          </span>
          <span className="fr-card-video-label">
            {t('testimonials.videoTag')}
            <span className="fr-card-video-length">{lengthOf(review.video.duration)}</span>
          </span>
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

type FeatureProps = {
  active: number;
  onPick: (index: number) => void;
  countryName: (code: string) => string;
  ago: (month: string) => string;
  onPlay: (review: FiverrReview, opener: HTMLButtonElement) => void;
};

/**
 * One delivered video with its client's review, and a strip of every client
 * video to switch it. The big frame opens the player; the strip only switches.
 */
const FeaturedVideo = ({ active, onPick, countryName, ago, onPlay }: FeatureProps) => {
  const { t } = useTranslation();
  const review = VIDEO_REVIEWS[active];
  const video = review.video!;
  const rating = review.rating % 1 ? review.rating.toFixed(1) : String(review.rating);
  const when = ago(review.date);

  return (
    <aside className="fr-feature" aria-label={t('testimonials.clientVideos', { count: VIDEO_REVIEWS.length })}>
      <div key={review.id} className="fr-feature-main">
        <button
          type="button"
          className="fr-feature-tile"
          aria-label={t('testimonials.playVideo', { user: review.user })}
          onClick={(event) => onPlay(review, event.currentTarget)}
        >
          <img src={video.poster} alt="" width={video.width} height={video.height} decoding="async" />
          <span className="fr-play fr-play--large" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" focusable="false"><path d="M8 5.6v12.8L18.4 12z" /></svg>
          </span>
          <span className="fr-video-tag">
            {t('testimonials.videoTag')} · {lengthOf(video.duration)}
          </span>
        </button>
        <div className="fr-feature-info">
          <div className="fr-head">
            <Avatar review={review} />
            <span className="fr-who">
              <span className="fr-name">{review.user}</span>
              <span className="fr-country">
                <span className="fr-flag" aria-hidden="true">{flagOf(review.country)}</span>
                {countryName(review.country)}
                {when ? <span className="fr-feature-when">· {when}</span> : null}
              </span>
            </span>
            <span className="fr-rating" aria-label={t('testimonials.ratingAria', { rating })}>
              <Star />
              {rating}
            </span>
          </div>
          <p className="fr-feature-quote" lang={review.lang}>{review.text}</p>
        </div>
      </div>

      <div className="fr-feature-strip-wrap">
        <p className="fr-feature-count">{t('testimonials.clientVideos', { count: VIDEO_REVIEWS.length })}</p>
        <div className="fr-feature-strip" role="group" aria-label={t('testimonials.clientVideos', { count: VIDEO_REVIEWS.length })}>
          {VIDEO_REVIEWS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="fr-thumb"
              aria-pressed={index === active}
              aria-label={t('testimonials.featureVideo', { user: item.user })}
              onClick={() => onPick(index)}
            >
              <img src={item.video!.thumb} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

type ReviewVideoFile = NonNullable<FiverrReview['video']>;

/**
 * A review's video: HEVC where the browser plays it, else the H.264 file. It
 * frees its stream as soon as the dialog closes, rather than whenever the
 * element is garbage-collected (src/lib/video-lifecycle.ts).
 */
const ReviewVideo = ({ video }: { video: ReviewVideoFile }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState(() => (video.hevc && canPlayHevc() ? video.hevc : video.src));

  useEffect(() => {
    const element = ref.current;
    return () => {
      if (element) releaseVideo(element);
    };
  }, []);

  return (
    <video
      ref={ref}
      className="fr-modal-video"
      src={src}
      poster={video.poster}
      controls
      controlsList="nodownload"
      autoPlay
      playsInline
      preload="auto"
      onError={() => {
        if (src !== video.src) setSrc(video.src);
      }}
    />
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
  const [featured, setFeatured] = useState(0);
  const [playing, setPlaying] = useState<FiverrReview | null>(null);

  const countryName = useCallback((code: string) => FIVERR_COUNTRY_NAMES[locale][code] ?? code, [locale]);
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

        <div className="fr-body">
          <FeaturedVideo active={featured} onPick={setFeatured} countryName={countryName} ago={ago} onPlay={openVideo} />

          <div className="fr-wall">
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
        </div>
      </div>

      {playing && typeof document !== 'undefined'
        ? createPortal(
            <div className="fr-modal" role="dialog" aria-modal="true" aria-label={t('testimonials.videoDialog', { user: playing.user })}>
              <button type="button" className="fr-modal-scrim" aria-label={t('testimonials.close')} onClick={closeVideo} />
              <div
                className="fr-modal-card"
                style={playing.video ? ({ '--fr-ratio': playing.video.width / playing.video.height } as CSSProperties) : undefined}
              >
                <button ref={closeRef} type="button" className="fr-modal-close" aria-label={t('testimonials.close')} onClick={closeVideo}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true" focusable="false">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
                {playing.video ? <ReviewVideo key={playing.id} video={playing.video} /> : null}
                <div className="fr-modal-meta">
                  <Avatar review={playing} />
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
