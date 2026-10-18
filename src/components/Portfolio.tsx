import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react';
import { useTranslation } from '@/lib/locale-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { isMobileViewport, toggleContactDock } from '@/lib/contact-dock';
import AdaptiveVideo from '@/components/media/AdaptiveVideo';
import ReelPhone from '@/components/media/ReelPhone';
import { FeedMedia, FeedPosterPreload, FeedPoolSync } from '@/components/media/FeedMedia';
import ReelTheater, {
  Chevron,
  formatDuration,
  SoundIcon,
  useTheaterWide,
  WhatsAppGlyph,
} from '@/components/media/ReelTheater';
import { useMediaPlaybackSlot } from '@/hooks/use-media-playback-slot';
import { FeedPlayerPool, getClipFeedMedia } from '@/lib/feed-media';
import { getPosterVariantSrc, LEGACY_REEL_CLIPS, type ReelClip } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';
import { CONTACT_URLS } from '@/lib/contact-channels';
import '@/styles/reels-feed.css';

/**
 * "Reels que venden": the portfolio as the feed her ads actually live in.
 *
 * Desktop plays the reels inside the hero's iPhone (ReelPhone) as a vertical
 * feed with category tabs, next to a "now playing" spec card, a WhatsApp CTA
 * that names the reel, and "up next"; a click on the phone opens the theater,
 * the reel at full height with the same details beside it. Phones show one reel in a card inside
 * the page (swipe sideways for the next one), and a tap opens the full-screen
 * feed, swiped up and down like the app, with a close button. The page itself
 * never has to scroll through the feed. Reels play from the feed encodes
 * through a small pool of <video> elements (src/lib/feed-media.ts): the next
 * reel is buffering before the swipe, and opening the full-screen feed carries
 * the playing video over instead of reloading it. Styles and both themes:
 * src/styles/reels-feed.css.
 */

type Category = ReelClip['category'];
type Filter = 'all' | Category;

const FILTERS: Filter[] = ['all', 'fashion', 'beauty', 'tech', 'lifestyle'];
const AVATAR_SRC = '/uploads/gisela-avatar-160.webp';
const WHEEL_LOCK_MS = 650;
const DRAG_THRESHOLD_PX = 50;
const DAY_MS = 86_400_000;

const shuffleWithSeed = <T,>(items: T[], seed: number): T[] => {
  const result = [...items];
  let state = seed >>> 0;
  const random = () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const ALL_REEL_CLIPS: ReelClip[] = [...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS];

const Portfolio = () => {
  const { t, locale } = useTranslation();
  // Mounted only after load (a deferred section), so it can start at the
  // real width: no desktop-sized first frame on phones.
  const isMobile = useIsMobile({ fromViewport: true });
  const theaterWide = useTheaterWide();
  const theaterView = !isMobile || theaterWide;
  const reducedMotion = usePrefersReducedMotion();
  const { handleHashLinkClick } = useHashlessSectionNavigation();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const wheelLockRef = useRef(0);
  const dragRef = useRef<{ y: number; moved: boolean } | null>(null);
  const swipeRef = useRef<number | null>(null);
  const swallowClickRef = useRef(false);
  const openerRef = useRef<HTMLButtonElement>(null);

  const [dayBucket] = useState(() => Math.floor(Date.now() / DAY_MS));
  const [filter, setFilter] = useState<Filter>('all');
  const [index, setIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [inView, setInView] = useState(false);
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);
  const [near, setNear] = useState(false);
  const [pool] = useState(() => new FeedPlayerPool());
  const [ambient, setAmbient] = useState<{ a: string; b: string; showA: boolean }>({ a: '', b: '', showA: true });

  const clips = useMemo(() => shuffleWithSeed(ALL_REEL_CLIPS, dayBucket), [dayBucket]);
  const list = useMemo(
    () => (filter === 'all' ? clips : clips.filter((clip) => clip.category === filter)),
    [clips, filter],
  );
  const activeIndex = Math.min(index, Math.max(list.length - 1, 0));
  const clip = list[activeIndex];
  const warm = near || open;
  const nextClip = list.length > 1 ? list[(activeIndex + 1) % list.length] : undefined;
  const previousClip = list.length > 2 ? list[(activeIndex - 1 + list.length) % list.length] : undefined;
  const activeSlug = clip ? getClipFeedMedia(clip)?.slug : undefined;
  const nextSlug = nextClip ? getClipFeedMedia(nextClip)?.slug : undefined;
  const previousSlug = previousClip ? getClipFeedMedia(previousClip)?.slug : undefined;
  const keepSlugs = useMemo(
    () => (warm ? [activeSlug, nextSlug, previousSlug].filter((slug): slug is string => Boolean(slug)) : []),
    [activeSlug, nextSlug, previousSlug, warm],
  );
  // One decoder slot for the section, held across the card → full-screen
  // hand-over so the reel never pauses in between.
  const slotGranted = useMediaPlaybackSlot(warm && (inView || open), 'preview');

  const titleOf = useCallback(
    (item: ReelClip) => (item.titleKey ? t(item.titleKey) : item.localizedTitle?.[locale] ?? item.title ?? ''),
    [locale, t],
  );
  const languageOf = (item: ReelClip) =>
    t(item.language === 'en' ? 'portfolio.feed.languageEn' : 'portfolio.feed.languageEs');
  const categoryOf = (item: ReelClip) => t(`portfolio.categories.${item.category}`);
  const theaterItems = useMemo(() => list.map((item) => ({ clip: item, title: titleOf(item) })), [list, titleOf]);

  const go = useCallback(
    (step: number, wrap = false) => {
      setIndex((current) => {
        const next = current + step;
        if (next < 0) return wrap ? list.length - 1 : 0;
        if (next >= list.length) return wrap ? 0 : list.length - 1;
        return next;
      });
    },
    [list.length],
  );

  const pickFilter = (next: Filter) => {
    setFilter(next);
    setIndex(0);
  };

  // In view: drives playback, the progress bar and the title's swash.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      setSeen(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        setInView(visible);
        if (entry && entry.intersectionRatio > 0.25) setSeen(true);
      },
      { threshold: [0, 0.25] },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [isMobile]);

  // A screen ahead: start loading the first reel before the section arrives,
  // and let the pool go once it is far behind.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setNear(Boolean(entry?.isIntersecting)), {
      rootMargin: '100% 0px',
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, [isMobile]);

  useEffect(() => () => pool.destroy(), [pool]);

  // Dark-theme ambient light: crossfade between two blurred, tiny posters.
  useEffect(() => {
    if (!clip) return;
    const src = getPosterVariantSrc(clip, 180, 'webp');
    setAmbient((current) =>
      current.showA ? { a: current.a, b: src, showA: false } : { a: src, b: current.b, showA: true },
    );
  }, [clip]);

  // Sound follows the toggle across reels. Turning it on (or opening the
  // full-screen feed) is a user gesture, so the browser usually allows audio;
  // when it doesn't, fall back to muted playback rather than a frozen frame.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !soundOn;
    if (!soundOn) return;
    video.play().catch(() => {
      video.muted = true;
      setSoundOn(false);
      void video.play().catch(() => undefined);
    });
  }, [soundOn, clip, open]);

  // Desktop: the wheel walks the feed while the pointer is on the phone, and
  // hands the scroll back to the page at either end.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || isMobile) return undefined;
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 8) return;
      const step = event.deltaY > 0 ? 1 : -1;
      const atEdge = (step < 0 && activeIndex === 0) || (step > 0 && activeIndex >= list.length - 1);
      if (atEdge) return;
      event.preventDefault();
      const now = performance.now();
      if (now - wheelLockRef.current < WHEEL_LOCK_MS) return;
      wheelLockRef.current = now;
      go(step);
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [activeIndex, go, isMobile, list.length]);

  const handleContact = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (isMobileViewport()) {
        event.preventDefault();
        toggleContactDock();
        return;
      }
      handleHashLinkClick(event);
    },
    [handleHashLinkClick],
  );

  if (!clip) return null;

  const title = titleOf(clip);
  const poster = getPosterVariantSrc(clip, 720, 'webp');
  const durationMs = Math.round((clip.durationSeconds ?? 20) * 1000);
  const separator = CONTACT_URLS.whatsapp.includes('?') ? '&' : '?';
  const whatsappHref = `${CONTACT_URLS.whatsapp}${separator}text=${encodeURIComponent(
    t('portfolio.feed.whatsappText', { title }),
  )}`;
  const playing = inView && !reducedMotion;
  const handleEnded = () => {
    if (!reducedMotion) go(1, true);
  };
  const setProgress = (ratio: number) => {
    progressRef.current?.style.setProperty('--rf-progress', String(ratio));
  };
  const muteAfterRefusal = () => setSoundOn(false);
  // Sound has to start inside the tap for iOS to allow it, so it is switched on
  // here, synchronously, and the tap blesses the rest of the pool with it.
  const unmuteNow = () => {
    pool.bless(activeSlug);
    const active = activeSlug ? pool.peek(activeSlug) : null;
    if (!active) return;
    active.muted = false;
    void active.play().catch(() => undefined);
  };
  const toggleSound = () => {
    if (!soundOn) unmuteNow();
    setSoundOn(!soundOn);
  };
  const posterOf = (item: ReelClip) => getPosterVariantSrc(item, 720, 'webp');
  const openFeed = () => {
    unmuteNow();
    setSoundOn(true);
    setOpen(true);
  };
  const closeFeed = () => {
    setSoundOn(false);
    setOpen(false);
  };

  const video = (
    <AdaptiveVideo
      key={clip.id}
      ref={videoRef}
      src={clip.mobileSrc}
      hlsSrc={clip.mobileHlsSrc ?? clip.hlsSrc}
      poster={poster}
      muted={!soundOn}
      autoPlay
      playsInline
      loop={isMobile}
      preload="metadata"
      playbackPriority="preview"
      rootMargin="200px 0px"
      onEnded={isMobile ? undefined : handleEnded}
      onTimeUpdate={(event) => {
        const target = event.currentTarget;
        if (progressRef.current && target.duration) {
          progressRef.current.style.setProperty('--rf-progress', String(target.currentTime / target.duration));
        }
      }}
    />
  );

  const tabs = (
    <div className="rf-tabs" role="tablist" aria-label={t('portfolio.feed.feedLabel')}>
      {FILTERS.map((id) => (
        <button
          key={id}
          type="button"
          role="tab"
          className="rf-tab"
          aria-selected={filter === id}
          onClick={() => pickFilter(id)}
        >
          {t(`portfolio.feed.tabs.${id}`)}
        </button>
      ))}
    </div>
  );

  const upNext = Array.from({ length: Math.min(4, list.length - 1) }, (_, k) => (activeIndex + k + 1) % list.length);

  // The reel with sound: the theater on desktop and every iPad, the
  // full-screen feed on phones (src/components/media/ReelTheater.tsx).
  const reelTheater = open ? (
    <ReelTheater
      view={theaterView ? 'theater' : 'feed'}
      items={theaterItems}
      index={activeIndex}
      onIndexChange={setIndex}
      pool={pool}
      playing={slotGranted}
      soundOn={soundOn}
      onToggleSound={toggleSound}
      onSoundBlocked={muteAfterRefusal}
      onClose={closeFeed}
      label={t('portfolio.feed.feedLabel')}
      feedTitle={`${t('portfolio.feed.titleLead')} ${t('portfolio.feed.titleAccent')}`}
      ctaHref={whatsappHref}
      ctaLabel={t('portfolio.feed.cta')}
      ctaShortLabel={t('portfolio.feed.ctaShort')}
      showRating
      tabs={tabs}
      fallbackVideo={video}
      returnFocusRef={openerRef}
    />
  ) : null;

  if (isMobile) {
    return (
      <section
        id="portfolio"
        ref={sectionRef}
        className="rf-inline"
        data-seen={seen}
        aria-labelledby="portfolio-title"
      >
        <FeedPoolSync pool={pool} keep={keepSlugs} active={activeSlug} next={nextSlug} previous={previousSlug} />
        <div className="rf-orbs" aria-hidden="true" />
        <div className="rf-amb" aria-hidden="true">
          {ambient.a ? <img src={ambient.a} alt="" data-on={ambient.showA} /> : null}
          {ambient.b ? <img src={ambient.b} alt="" data-on={!ambient.showA} /> : null}
        </div>
        <div className="rf-veil" aria-hidden="true" />

        <h2 id="portfolio-title" className="rf-title font-serif">
          <span className="rf-title-lead">{t('portfolio.feed.titleLead')}</span>
          <br />
          <span className="rf-title-accent">{t('portfolio.feed.titleAccent')}</span>
          <svg className="rf-swash" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path d="M3 15 C 60 5, 140 2, 297 11" fill="none" strokeWidth="3.4" strokeLinecap="round" pathLength={1} />
          </svg>
        </h2>

        <div className="rf-chips" role="tablist" aria-label={t('portfolio.feed.feedLabel')}>
          {FILTERS.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              className="rf-chip"
              aria-selected={filter === id}
              onClick={() => pickFilter(id)}
            >
              {t(`portfolio.feed.tabs.${id}`)}
            </button>
          ))}
        </div>

        <div
          className="rf-reel"
          onPointerDown={(event) => {
            swipeRef.current = event.clientX;
          }}
          onPointerUp={(event) => {
            const startX = swipeRef.current;
            swipeRef.current = null;
            if (startX === null) return;
            const dx = event.clientX - startX;
            if (Math.abs(dx) >= 40) {
              swallowClickRef.current = true;
              go(dx < 0 ? 1 : -1, true);
              window.setTimeout(() => {
                swallowClickRef.current = false;
              }, 0);
            }
          }}
        >
          <FeedMedia
            pool={pool}
            clip={clip}
            active={warm && !open}
            playing={slotGranted && inView && !reducedMotion}
            muted={!soundOn}
            loop
            fallbackPoster={poster}
            fallbackVideo={video}
            onProgress={setProgress}
            onSoundBlocked={muteAfterRefusal}
          />
          {warm
            ? [nextClip, previousClip].map((item) =>
                item ? <FeedPosterPreload key={item.id} clip={item} fallback={posterOf(item)} /> : null,
              )
            : null}
          <div className="rf-reel-shade" aria-hidden="true" />
          <p className="rf-reel-top" aria-hidden="true">
            <img src={AVATAR_SRC} alt="" width={160} height={160} />
            <span>Gisela Saldarriaga</span>
            <span>
              {String(activeIndex + 1).padStart(2, '0')}/{String(list.length).padStart(2, '0')}
            </span>
          </p>
          <span className="rf-reel-expand" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </span>
          <div className="rf-reel-caption" key={`caption-${clip.id}`}>
            <p className="rf-reel-title">{title}</p>
            <p className="rf-reel-meta">
              {categoryOf(clip)} · {formatDuration(clip.durationSeconds)} · {languageOf(clip)}
            </p>
          </div>
          <div className="rf-mob-progress rf-reel-progress" aria-hidden="true">
            {!open ? <span ref={progressRef} /> : <span />}
          </div>
          <button
            ref={openerRef}
            type="button"
            className="rf-reel-open"
            aria-label={`${title}. ${t('portfolio.feed.openFull')}`}
            aria-haspopup="dialog"
            onClick={() => {
              if (!swallowClickRef.current) openFeed();
            }}
          />
          <button
            type="button"
            className="rf-reel-nav rf-reel-nav--prev"
            aria-label={t('portfolio.feed.prev')}
            onClick={() => go(-1, true)}
          >
            <Chevron to="left" />
          </button>
          <button
            type="button"
            className="rf-reel-nav rf-reel-nav--next"
            aria-label={t('portfolio.feed.next')}
            onClick={() => go(1, true)}
          >
            <Chevron to="right" />
          </button>
        </div>

        <a className="rf-cta rf-cta--block" href={whatsappHref} target="_blank" rel="noopener noreferrer">
          <span className="rf-wa"><WhatsAppGlyph /></span>
          {t('portfolio.feed.cta')}
        </a>

        {reelTheater}
      </section>
    );
  }

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="rf-desk"
      data-seen={seen}
      aria-labelledby="portfolio-title"
    >
      <FeedPoolSync pool={pool} keep={keepSlugs} active={activeSlug} next={nextSlug} previous={previousSlug} />
      <div className="rf-orbs" aria-hidden="true" />
      <div className="rf-amb" aria-hidden="true">
        {ambient.a ? <img src={ambient.a} alt="" data-on={ambient.showA} /> : null}
        {ambient.b ? <img src={ambient.b} alt="" data-on={!ambient.showA} /> : null}
      </div>
      <div className="rf-veil" aria-hidden="true" />

      <div className="rf-grid">
        <div className="rf-copy">
          <h2 id="portfolio-title" className="rf-title font-serif">
            <span className="rf-title-lead">{t('portfolio.feed.titleLead')}</span>
            <br />
            <span className="rf-title-accent">{t('portfolio.feed.titleAccent')}</span>
            <svg className="rf-swash" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path d="M3 15 C 60 5, 140 2, 297 11" fill="none" strokeWidth="3" strokeLinecap="round" pathLength={1} />
            </svg>
          </h2>
          <p className="rf-sub">{t('portfolio.feed.sub')}</p>

          <div className="rf-card rf-swap" key={clip.id} aria-live="polite">
            <p className="rf-card-kicker">{t('portfolio.feed.nowPlaying')}</p>
            <p className="rf-card-title">{title}</p>
            <dl className="rf-specs">
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

          <a className="rf-cta" href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <span className="rf-wa"><WhatsAppGlyph /></span>
            {t('portfolio.feed.cta')}
          </a>
        </div>

        <div
          ref={stageRef}
          className="rf-stage"
          aria-roledescription="carousel"
          aria-label={t('portfolio.feed.feedLabel')}
          onPointerDown={(event) => {
            dragRef.current = { y: event.clientY, moved: false };
          }}
          onPointerUp={(event) => {
            const drag = dragRef.current;
            dragRef.current = null;
            if (!drag) return;
            const dy = event.clientY - drag.y;
            if (Math.abs(dy) >= DRAG_THRESHOLD_PX) {
              swallowClickRef.current = true;
              go(dy < 0 ? 1 : -1);
              window.setTimeout(() => {
                swallowClickRef.current = false;
              }, 0);
            }
          }}
          onClickCapture={(event) => {
            if (swallowClickRef.current) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
        >
          <ReelPhone
            className="rf-phone"
            title={title}
            reelKey={clip.id}
            playing={playing}
            clipMs={durationMs}
            onNavigate={handleHashLinkClick}
            onContact={handleContact}
            onOpen={openFeed}
            openLabel={`${title}. ${t('portfolio.feed.openFull')}`}
          >
            <div className="rf-track" style={{ '--rf-i': activeIndex } as CSSProperties}>
              {list.map((item, i) =>
                Math.abs(i - activeIndex) <= 1 ? (
                  <div
                    key={item.id}
                    className="rf-slide"
                    style={{ '--rf-n': i } as CSSProperties}
                    aria-hidden={i !== activeIndex}
                  >
                    <FeedMedia
                      pool={pool}
                      clip={item}
                      active={warm && i === activeIndex && !open}
                      playing={slotGranted && playing}
                      muted={!soundOn}
                      loop={false}
                      fallbackPoster={posterOf(item)}
                      fallbackVideo={video}
                      onEnded={handleEnded}
                      onProgress={setProgress}
                      onSoundBlocked={muteAfterRefusal}
                    />
                  </div>
                ) : null,
              )}
            </div>
            {tabs}
          </ReelPhone>

          <div className="rf-ctrls">
            <button
              type="button"
              className="rf-ctrl"
              aria-label={t('portfolio.feed.prev')}
              disabled={activeIndex === 0}
              onClick={() => go(-1)}
            >
              <Chevron to="up" />
            </button>
            <button
              type="button"
              className="rf-ctrl"
              aria-label={t('portfolio.feed.next')}
              onClick={() => go(1, true)}
            >
              <Chevron to="down" />
            </button>
            <button
              type="button"
              className="rf-ctrl"
              aria-pressed={soundOn}
              aria-label={t(soundOn ? 'portfolio.feed.soundOff' : 'portfolio.feed.soundOn')}
              onClick={toggleSound}
            >
              <SoundIcon on={soundOn} />
            </button>
            <button
              type="button"
              className="rf-ctrl"
              aria-label={t('portfolio.feed.openFull')}
              aria-haspopup="dialog"
              onClick={openFeed}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="rf-next">
          <div className="rf-next-head">
            <span>{t('portfolio.feed.upNext')}</span>
            <span>{t('portfolio.feed.count', { count: list.length })}</span>
          </div>
          <ul className="rf-next-list">
            {upNext.map((i) => {
              const item = list[i];
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className="rf-next-item"
                    onClick={() => setIndex(i)}
                  >
                    <img src={getPosterVariantSrc(item, 360, 'webp')} alt="" loading="lazy" decoding="async" />
                    <span className="rf-next-text">
                      <span className="rf-next-title">{titleOf(item)}</span>
                      <span className="rf-next-meta">
                        {categoryOf(item)} · {formatDuration(item.durationSeconds)}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {reelTheater}
    </section>
  );
};

export default Portfolio;
