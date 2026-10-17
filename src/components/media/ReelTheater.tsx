import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '@/lib/locale-context';
import { FeedMedia } from '@/components/media/FeedMedia';
import { useMediaSession } from '@/components/media/MediaSessionProvider';
import type { FeedPlayerPool } from '@/lib/feed-media';
import { getPosterVariantSrc, type ReelClip } from '@/data/portfolio-clips';
import { SITE_PROOF } from '@/data/site-proof';
import '@/styles/reels-feed.css';

/**
 * The site's video player with sound: the portfolio's theater, shared by the
 * home page ("Reels que venden") and the service pages (their examples).
 *
 * - `view="theater"` (desktop and every iPad): the reel at full height with
 *   the feed's action column beside it, ↑ ↓ at the edge, and a panel with the
 *   reel's details, the WhatsApp CTA and what plays next. The wheel, the arrow
 *   keys and a vertical swipe walk the reels. Styles: "Desktop theater" in
 *   reels-feed.css.
 * - `view="feed"` (phones): the full-screen feed, reels swiped up and down
 *   like the app. Styles: "Full screen: the feed itself" in reels-feed.css.
 *
 * In both, a tap on the video pauses and plays it, ✕ or Escape closes, the page
 * behind is locked (position: fixed, restored on close) and focus returns to
 * the opener. Portalled to <body>, so no section's containment traps it. The
 * caller holds the pool (src/lib/feed-media.ts), the playback slot and the
 * sound toggle, so a reel can carry over from a card without restarting.
 */

export type ReelTheaterItem = { clip: ReelClip; title: string };

type ReelTheaterProps = {
  view: 'theater' | 'feed';
  items: ReelTheaterItem[];
  index: number;
  onIndexChange: (index: number) => void;
  pool: FeedPlayerPool;
  /** The page-wide playback slot, which the caller holds. */
  playing: boolean;
  soundOn: boolean;
  onToggleSound: () => void;
  /** The browser refused sound; the reel carries on muted. */
  onSoundBlocked: () => void;
  onClose: () => void;
  /** The dialog's accessible name. */
  label: string;
  /** The phone feed's top pill, beside the avatar and the counter. */
  feedTitle: string;
  /** The WhatsApp link for the reel on screen. */
  ctaHref: string;
  ctaLabel: string;
  ctaShortLabel: string;
  /**
   * The Fiverr rating and review count on the action column. Only where the
   * page carries the matching AggregateRating (changes/seo/seo-crawl-trust.md).
   */
  showRating: boolean;
  /** The home feed's category tabs, over the top of the video. */
  tabs?: ReactNode;
  /** For a reel without feed files: the old player. */
  fallbackVideo?: ReactNode;
  /** Gets focus back on close; otherwise whatever had focus on open. */
  returnFocusRef?: RefObject<HTMLElement | null>;
};

const AVATAR_SRC = '/uploads/gisela-avatar-160.webp';
const WHEEL_LOCK_MS = 650;
const DRAG_THRESHOLD_PX = 50;

// The iPad mini held upright (744px) gets the phone layout on the page, but
// opens the theater like the other iPads, not the phone's full-screen feed.
const THEATER_QUERY = '(min-width: 700px)';

export const useTheaterWide = () => {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(THEATER_QUERY);
    const sync = () => setWide(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  return wide;
};

/**
 * The room's light: the playing reel's poster, blurred, crossfading between
 * two layers as the reel changes. Lit from the first frame the theater opens.
 */
const useAmbientPoster = (clip: ReelClip | undefined) => {
  const src = clip ? getPosterVariantSrc(clip, 180, 'webp') : '';
  const [ambient, setAmbient] = useState(() => ({ a: src, b: '', showA: true }));
  useEffect(() => {
    if (!src) return;
    setAmbient((current) => {
      if ((current.showA ? current.a : current.b) === src) return current;
      return current.showA ? { a: current.a, b: src, showA: false } : { a: src, b: current.b, showA: true };
    });
  }, [src]);
  return ambient;
};

export const formatDuration = (seconds?: number) => {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = String(Math.round(seconds % 60)).padStart(2, '0');
  return `${m}:${s}`;
};

export const WhatsAppGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M20.5 11.7a8.6 8.6 0 0 1-12.7 7.6L3.5 20.5l1.3-4.1a8.6 8.6 0 1 1 15.7-4.7z" />
    <path
      d="M9.2 8.4c.3-.4.6-.4.9-.4h.4c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5.6 1 1.4 1.8 2.4 2.3.2.1.4.1.5 0l.6-.6c.2-.1.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.4c0 .3-.1.6-.5.9-.6.3-1.3.5-2.1.3-2.3-.6-4.3-2.6-4.9-4.9-.2-.8 0-1.5.3-2.1z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

export const SoundIcon = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M11 5 6 9H3v6h3l5 4z" />
    {on ? <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /> : <path d="m22 9-6 6M16 9l6 6" />}
  </svg>
);

const CHEVRON_PATHS = {
  up: 'm6 15 6-6 6 6',
  down: 'm6 9 6 6 6-6',
  left: 'm15 6-6 6 6 6',
  right: 'm9 6 6 6-6 6',
} as const;

export const Chevron = ({ to }: { to: keyof typeof CHEVRON_PATHS }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d={CHEVRON_PATHS[to]} />
  </svg>
);

const CloseGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" aria-hidden="true" focusable="false">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const PlayGlyph = () => (
  <svg viewBox="0 0 24 24" focusable="false"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
);

const SoundLineGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const HEART_PATH =
  'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z';
const REVIEWS_PATH = 'M7.9 20A9 9 0 1 0 4 16.1L2 22Z';
const BRANDS_PATH = 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z';

const ReelTheater = ({
  view,
  items,
  index,
  onIndexChange,
  pool,
  playing,
  soundOn,
  onToggleSound,
  onSoundBlocked,
  onClose,
  label,
  feedTitle,
  ctaHref,
  ctaLabel,
  ctaShortLabel,
  showRating,
  tabs,
  fallbackVideo,
  returnFocusRef,
}: ReelTheaterProps) => {
  const { t } = useTranslation();
  const mediaSession = useMediaSession();
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const wheelLockRef = useRef(0);
  const swipeRef = useRef<number | null>(null);
  const swallowClickRef = useRef(false);
  const closeHandlerRef = useRef(onClose);

  const [pausedId, setPausedId] = useState<number | null>(null);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [feedScrolled, setFeedScrolled] = useState(false);

  const count = items.length;
  const activeIndex = Math.min(Math.max(index, 0), Math.max(count - 1, 0));
  const item = items[activeIndex];
  const clip = item?.clip;
  const ambient = useAmbientPoster(clip);

  useLayoutEffect(() => {
    closeHandlerRef.current = onClose;
  });

  const go = useCallback(
    (step: number, wrap = false) => {
      const next = activeIndex + step;
      if (next < 0) onIndexChange(wrap ? count - 1 : 0);
      else if (next >= count) onIndexChange(wrap ? 0 : count - 1);
      else onIndexChange(next);
    },
    [activeIndex, count, onIndexChange],
  );

  // The theater has the page's attention: every other video pauses.
  useEffect(() => mediaSession?.acquireTheater(), [mediaSession]);

  // Lock the page behind it, take focus, close on Escape, and on close put the
  // page and the focus back where they were.
  useEffect(() => {
    const { body } = document;
    const scrollY = window.scrollY;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width };
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeHandlerRef.current();
    };
    document.addEventListener('keydown', onKey);
    const opener =
      returnFocusRef?.current ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      window.scrollTo(0, scrollY);
      opener?.focus({ preventScroll: true });
    };
    // Only on opening and closing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The feed opens on the reel the page was showing, and a new list (the home
  // feed's tabs) starts at its index. Otherwise the scroller drives the index.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller) scroller.scrollTop = activeIndex * scroller.clientHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, view]);

  // Theater: the up and down arrows walk the reels.
  useEffect(() => {
    if (view !== 'theater') return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      if (event.key === 'ArrowDown') go(1, true);
      else go(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go, view]);

  if (!item || !clip || typeof document === 'undefined') return null;

  const paused = pausedId === clip.id;
  const togglePause = () => setPausedId(paused ? null : clip.id);
  const isLiked = Boolean(liked[clip.id]);
  const toggleLike = () => setLiked((current) => ({ ...current, [clip.id]: !current[clip.id] }));
  const setProgress = (ratio: number) => {
    progressRef.current?.style.setProperty('--rf-progress', String(ratio));
  };
  const categoryOf = (reel: ReelClip) => t(`portfolio.categories.${reel.category}`);
  const languageOf = (reel: ReelClip) =>
    t(reel.language === 'en' ? 'portfolio.feed.languageEn' : 'portfolio.feed.languageEs');
  const posterOf = (reel: ReelClip) => getPosterVariantSrc(reel, 720, 'webp');
  const counter = `${String(activeIndex + 1).padStart(2, '0')}/${String(count).padStart(2, '0')}`;
  const closeLabel = t('floatingContact.close');
  const pauseLabel = t(paused ? 'portfolio.feed.play' : 'portfolio.feed.pause');
  const soundLabel = t(soundOn ? 'portfolio.feed.soundOff' : 'portfolio.feed.soundOn');
  const pausedBadge = paused ? (
    <span className="rt-paused" aria-hidden="true">
      <PlayGlyph />
    </span>
  ) : null;
  const cta = (
    <a className="rf-mob-cta" href={ctaHref} target="_blank" rel="noopener noreferrer">
      <span className="rf-wa"><WhatsAppGlyph /></span>
      {ctaShortLabel}
    </a>
  );

  if (view === 'feed') {
    return createPortal(
      <div className="rf-mob rf-mob--overlay" role="dialog" aria-modal="true" aria-label={label}>
        <div
          ref={scrollerRef}
          className="rf-mob-scroller"
          onScroll={(event) => {
            const el = event.currentTarget;
            const next = Math.round(el.scrollTop / Math.max(el.clientHeight, 1));
            if (next !== activeIndex && next >= 0 && next < count) {
              onIndexChange(next);
              setFeedScrolled(true);
            }
          }}
        >
          {items.map(({ clip: reel }, i) => (
            <div key={reel.id} className="rf-mob-slide" aria-hidden={i !== activeIndex}>
              {Math.abs(i - activeIndex) <= 2 ? (
                <FeedMedia
                  pool={pool}
                  clip={reel}
                  active={i === activeIndex}
                  playing={playing && !paused}
                  muted={!soundOn}
                  loop
                  posterSize={Math.abs(i - activeIndex) <= 1 ? 'full' : 'small'}
                  fallbackPoster={posterOf(reel)}
                  fallbackVideo={fallbackVideo}
                  onProgress={setProgress}
                  onSoundBlocked={onSoundBlocked}
                />
              ) : null}
              {/* Inside the scroller, so a swipe that starts on it still scrolls the feed. */}
              {i === activeIndex ? (
                <button
                  type="button"
                  className="rf-mob-tap"
                  aria-label={pauseLabel}
                  aria-pressed={paused}
                  onClick={togglePause}
                />
              ) : null}
            </div>
          ))}
        </div>

        <div className="rf-mob-shade" aria-hidden="true" />
        {pausedBadge}

        <p className="rf-mob-top" aria-hidden="true">
          <img src={AVATAR_SRC} alt="" width={160} height={160} />
          <span>{feedTitle}</span>
          <span>{counter}</span>
        </p>

        <button ref={closeRef} type="button" className="rf-mob-close" aria-label={closeLabel} onClick={onClose}>
          <CloseGlyph />
        </button>

        {tabs}

        <div className="rf-mob-rail">
          <button
            type="button"
            className="rf-mob-act rf-mob-act--sound"
            aria-pressed={soundOn}
            aria-label={soundLabel}
            onClick={onToggleSound}
          >
            <span className="rf-mob-disc"><SoundIcon on={soundOn} /></span>
          </button>
          <button
            type="button"
            className="rf-mob-act"
            aria-pressed={isLiked}
            aria-label={t('portfolio.feed.like')}
            onClick={toggleLike}
          >
            <svg className="rf-heart" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d={HEART_PATH} />
            </svg>
            {showRating ? <span>{SITE_PROOF.fiverrRating}</span> : null}
          </button>
          {showRating ? (
            <span className="rf-mob-act">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={REVIEWS_PATH} /></svg>
              <span>{SITE_PROOF.fiverrReviewCount}</span>
            </span>
          ) : null}
          <span className="rf-mob-act">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={BRANDS_PATH} /></svg>
            <span>{SITE_PROOF.brandCampaigns}+</span>
          </span>
        </div>

        <div className="rf-mob-caption" key={clip.id}>
          <p className="rf-mob-name">Gisela Saldarriaga</p>
          <p className="rf-mob-title">
            {item.title} · {categoryOf(clip)} · {formatDuration(clip.durationSeconds)}
          </p>
          <p className="rf-mob-sound-line">
            <SoundLineGlyph />
            {t('hero.feed.soundShort')}
          </p>
          {cta}
        </div>

        <div className="rf-mob-progress" aria-hidden="true"><span ref={progressRef} /></div>

        {count > 1 ? (
          <div className="rf-mob-hint" data-hidden={feedScrolled || paused} aria-hidden="true">
            <Chevron to="up" />
            {t('portfolio.feed.swipe')}
          </div>
        ) : null}
      </div>,
      document.body,
    );
  }

  const upNext = Array.from({ length: Math.min(4, count - 1) }, (_, k) => (activeIndex + k + 1) % count);

  return createPortal(
    <div className="rt" role="dialog" aria-modal="true" aria-label={label}>
      <div
        className="rt-stage"
        onWheel={(event) => {
          if (Math.abs(event.deltaY) < 8) return;
          const now = performance.now();
          if (now - wheelLockRef.current < WHEEL_LOCK_MS) return;
          wheelLockRef.current = now;
          if (event.deltaY > 0) go(1, true);
          else go(-1);
        }}
        onPointerDown={(event) => {
          swipeRef.current = event.pointerType === 'mouse' ? null : event.clientY;
        }}
        onPointerCancel={() => {
          swipeRef.current = null;
        }}
        onPointerUp={(event) => {
          const startY = swipeRef.current;
          swipeRef.current = null;
          if (startY === null) return;
          const dy = event.clientY - startY;
          if (Math.abs(dy) < DRAG_THRESHOLD_PX) return;
          swallowClickRef.current = true;
          if (dy < 0) go(1, true);
          else go(-1);
          window.setTimeout(() => {
            swallowClickRef.current = false;
          }, 0);
        }}
        onClickCapture={(event) => {
          if (swallowClickRef.current) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
      >
        <div className="rt-amb" aria-hidden="true">
          {ambient.a ? <img src={ambient.a} alt="" data-on={ambient.showA} /> : null}
          {ambient.b ? <img src={ambient.b} alt="" data-on={!ambient.showA} /> : null}
        </div>
        <div className="rt-veil" aria-hidden="true" />

        <button ref={closeRef} type="button" className="rf-ctrl rt-close" aria-label={closeLabel} onClick={onClose}>
          <CloseGlyph />
        </button>

        <div className="rt-frame">
          <div className="rt-video">
            <div className="rf-track" style={{ '--rf-i': activeIndex } as CSSProperties}>
              {items.map(({ clip: reel }, i) =>
                Math.abs(i - activeIndex) <= 1 ? (
                  <div
                    key={reel.id}
                    className="rf-slide"
                    style={{ '--rf-n': i } as CSSProperties}
                    aria-hidden={i !== activeIndex}
                  >
                    <FeedMedia
                      pool={pool}
                      clip={reel}
                      active={i === activeIndex}
                      playing={playing && !paused}
                      muted={!soundOn}
                      loop
                      fallbackPoster={posterOf(reel)}
                      fallbackVideo={fallbackVideo}
                      onProgress={setProgress}
                      onSoundBlocked={onSoundBlocked}
                    />
                  </div>
                ) : null,
              )}
            </div>
            <div className="rf-mob-shade" aria-hidden="true" />
            <button
              type="button"
              className="rt-tap"
              aria-label={pauseLabel}
              aria-pressed={paused}
              onClick={togglePause}
            />
            {pausedBadge}
            {tabs}
            <div className="rt-caption" key={clip.id}>
              <p className="rt-name">Gisela Saldarriaga</p>
              <p className="rt-line">
                {item.title} · {categoryOf(clip)} · {formatDuration(clip.durationSeconds)}
              </p>
              <p className="rt-sound">
                <SoundLineGlyph />
                {t('hero.feed.soundShort')}
              </p>
              {cta}
            </div>
            <div className="rf-mob-progress" aria-hidden="true"><span ref={progressRef} /></div>
          </div>

          <div className="rt-rail">
            <img className="rt-avatar" src={AVATAR_SRC} alt="" width={160} height={160} />
            <button
              type="button"
              className="rt-act rt-act--like"
              aria-pressed={isLiked}
              aria-label={t('portfolio.feed.like')}
              onClick={toggleLike}
            >
              <span className="rt-disc">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={HEART_PATH} /></svg>
              </span>
              {showRating ? <span>{SITE_PROOF.fiverrRating}</span> : null}
            </button>
            {showRating ? (
              <span className="rt-act">
                <span className="rt-disc">
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={REVIEWS_PATH} /></svg>
                </span>
                <span>{SITE_PROOF.fiverrReviewCount}</span>
              </span>
            ) : null}
            <span className="rt-act">
              <span className="rt-disc">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={BRANDS_PATH} /></svg>
              </span>
              <span>{SITE_PROOF.brandCampaigns}+</span>
            </span>
            <button
              type="button"
              className="rt-act rt-act--sound"
              aria-pressed={soundOn}
              aria-label={soundLabel}
              onClick={onToggleSound}
            >
              <span className="rt-disc"><SoundIcon on={soundOn} /></span>
            </button>
          </div>
        </div>

        {count > 1 ? (
          <div className="rt-ctrls">
            <button
              type="button"
              className="rf-ctrl"
              aria-label={t('portfolio.feed.prev')}
              disabled={activeIndex === 0}
              onClick={() => go(-1)}
            >
              <Chevron to="up" />
            </button>
            <button type="button" className="rf-ctrl" aria-label={t('portfolio.feed.next')} onClick={() => go(1, true)}>
              <Chevron to="down" />
            </button>
          </div>
        ) : null}
      </div>

      <aside className="rt-panel">
        <div className="rt-who">
          <img src={AVATAR_SRC} alt="" width={160} height={160} />
          <span>
            <span className="rt-who-name">Gisela Saldarriaga</span>
            <span className="rt-muted">{t('hero.feed.role')}</span>
          </span>
        </div>

        <div className="rt-now rf-swap" key={clip.id} aria-live="polite">
          <p className="rt-muted">
            {t('portfolio.feed.nowPlaying')} · {String(activeIndex + 1).padStart(2, '0')} / {count}
          </p>
          <p className="rt-now-title">{item.title}</p>
          <dl className="rt-specs">
            <div>
              <dt>{t('portfolio.feed.category')}</dt>
              <dd>{categoryOf(clip)}</dd>
            </div>
            <div>
              <dt>{t('portfolio.feed.length')}</dt>
              <dd>{formatDuration(clip.durationSeconds)}</dd>
            </div>
            <div>
              <dt>{t('portfolio.feed.language')}</dt>
              <dd>{languageOf(clip)}</dd>
            </div>
          </dl>
        </div>

        <a className="rf-cta" href={ctaHref} target="_blank" rel="noopener noreferrer">
          <span className="rf-wa"><WhatsAppGlyph /></span>
          {ctaLabel}
        </a>

        {upNext.length > 0 ? (
          <div className="rt-next">
            <p className="rt-next-head">
              <span>{t('portfolio.feed.upNext')}</span>
              <span className="rt-muted">{t('portfolio.feed.count', { count })}</span>
            </p>
            <ul className="rt-next-list">
              {upNext.map((i) => {
                const next = items[i];
                return (
                  <li key={next.clip.id}>
                    <button type="button" className="rt-next-item" onClick={() => onIndexChange(i)}>
                      <img src={getPosterVariantSrc(next.clip, 360, 'webp')} alt="" loading="lazy" decoding="async" />
                      <span className="rt-next-text">
                        <span className="rt-next-title">{next.title}</span>
                        <span className="rt-muted">
                          {categoryOf(next.clip)} · {formatDuration(next.clip.durationSeconds)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </aside>
    </div>,
    document.body,
  );
};

export default ReelTheater;
