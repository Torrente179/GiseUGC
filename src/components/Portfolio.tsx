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
import { getPosterVariantSrc, LEGACY_REEL_CLIPS, type ReelClip } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';
import { CONTACT_URLS } from '@/lib/contact-channels';
import { SITE_PROOF } from '@/data/site-proof';
import '@/styles/reels-feed.css';

/**
 * "Reels que venden": the portfolio as the feed her ads actually live in.
 *
 * Desktop plays the reels inside the hero's iPhone (ReelPhone) as a vertical
 * feed with category tabs, next to a "now playing" spec card, a WhatsApp CTA
 * that names the reel, and "up next". Phones get the feed itself, full screen,
 * swiped up and down like the app. Only the active reel mounts a video; every
 * other slide is a poster. Styles and both themes: src/styles/reels-feed.css.
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

const formatDuration = (seconds?: number) => {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = String(Math.round(seconds % 60)).padStart(2, '0');
  return `${m}:${s}`;
};

const WhatsAppGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M20.5 11.7a8.6 8.6 0 0 1-12.7 7.6L3.5 20.5l1.3-4.1a8.6 8.6 0 1 1 15.7-4.7z" />
    <path
      d="M9.2 8.4c.3-.4.6-.4.9-.4h.4c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5.6 1 1.4 1.8 2.4 2.3.2.1.4.1.5 0l.6-.6c.2-.1.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.4c0 .3-.1.6-.5.9-.6.3-1.3.5-2.1.3-2.3-.6-4.3-2.6-4.9-4.9-.2-.8 0-1.5.3-2.1z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

const SoundIcon = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M11 5 6 9H3v6h3l5 4z" />
    {on ? <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /> : <path d="m22 9-6 6M16 9l6 6" />}
  </svg>
);

const Chevron = ({ up }: { up: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d={up ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'} />
  </svg>
);

const Portfolio = () => {
  const { t, locale } = useTranslation();
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const { handleHashLinkClick } = useHashlessSectionNavigation();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const wheelLockRef = useRef(0);
  const dragRef = useRef<{ y: number; moved: boolean } | null>(null);
  const swallowClickRef = useRef(false);

  const [dayBucket] = useState(() => Math.floor(Date.now() / DAY_MS));
  const [filter, setFilter] = useState<Filter>('all');
  const [index, setIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [touched, setTouched] = useState(false);
  const [inView, setInView] = useState(false);
  const [armed, setArmed] = useState(false);
  const [seen, setSeen] = useState(false);
  const [ambient, setAmbient] = useState<{ a: string; b: string; showA: boolean }>({ a: '', b: '', showA: true });

  const clips = useMemo(() => shuffleWithSeed(ALL_REEL_CLIPS, dayBucket), [dayBucket]);
  const list = useMemo(
    () => (filter === 'all' ? clips : clips.filter((clip) => clip.category === filter)),
    [clips, filter],
  );
  const activeIndex = Math.min(index, Math.max(list.length - 1, 0));
  const clip = list[activeIndex];

  const titleOf = useCallback(
    (item: ReelClip) => (item.titleKey ? t(item.titleKey) : item.localizedTitle?.[locale] ?? item.title ?? ''),
    [locale, t],
  );
  const languageOf = (item: ReelClip) =>
    t(item.language === 'en' ? 'portfolio.feed.languageEn' : 'portfolio.feed.languageEs');
  const categoryOf = (item: ReelClip) => t(`portfolio.categories.${item.category}`);

  const go = useCallback(
    (step: number, wrap = false) => {
      setTouched(true);
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
    scrollerRef.current?.scrollTo({ top: 0 });
  };

  // In view: drives playback, the progress bar and the title's swash. On
  // phones it also arms the inner scroller once the feed fills the screen.
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
        setArmed(Boolean(entry && entry.intersectionRatio >= 0.95));
      },
      { threshold: [0, 0.25, 0.5, 0.95, 1] },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [isMobile]);

  // Dark-theme ambient light: crossfade between two blurred, tiny posters.
  useEffect(() => {
    if (!clip) return;
    const src = getPosterVariantSrc(clip, 180, 'webp');
    setAmbient((current) =>
      current.showA ? { a: current.a, b: src, showA: false } : { a: src, b: current.b, showA: true },
    );
  }, [clip]);

  // Sound follows the toggle across reels; turning it on is a user gesture,
  // so the browser lets the active reel play with audio.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !soundOn;
    if (soundOn) void video.play().catch(() => undefined);
  }, [soundOn, clip]);

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
  const isLiked = Boolean(liked[clip.id]);
  const separator = CONTACT_URLS.whatsapp.includes('?') ? '&' : '?';
  const whatsappHref = `${CONTACT_URLS.whatsapp}${separator}text=${encodeURIComponent(
    t('portfolio.feed.whatsappText', { title }),
  )}`;
  const playing = inView && !reducedMotion;
  const handleEnded = () => {
    if (!reducedMotion) go(1, true);
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

  if (isMobile) {
    return (
      <section
        id="portfolio"
        ref={sectionRef}
        className="rf-mob"
        data-armed={armed}
        aria-labelledby="portfolio-title"
        aria-roledescription="carousel"
      >
        <h2 id="portfolio-title" className="sr-only">
          {t('portfolio.feed.titleLead')} {t('portfolio.feed.titleAccent')}
        </h2>

        <div
          ref={scrollerRef}
          className="rf-mob-scroller"
          onScroll={(event) => {
            const el = event.currentTarget;
            const next = Math.round(el.scrollTop / Math.max(el.clientHeight, 1));
            if (next !== activeIndex) {
              setIndex(next);
              setTouched(true);
            }
          }}
        >
          {list.map((item, i) => (
            <div key={item.id} className="rf-mob-slide" aria-hidden={i !== activeIndex}>
              {Math.abs(i - activeIndex) <= 2 ? (
                <img src={getPosterVariantSrc(item, 720, 'webp')} alt="" loading="lazy" decoding="async" />
              ) : null}
              {i === activeIndex ? video : null}
            </div>
          ))}
        </div>

        <div className="rf-mob-shade" aria-hidden="true" />

        <p className="rf-mob-top" aria-hidden="true">
          <img src={AVATAR_SRC} alt="" width={160} height={160} />
          <span>{t('portfolio.feed.titleLead')} {t('portfolio.feed.titleAccent')}</span>
          <span>
            {String(activeIndex + 1).padStart(2, '0')}/{String(list.length).padStart(2, '0')}
          </span>
        </p>

        {tabs}

        <div className="rf-mob-rail">
          <button
            type="button"
            className="rf-mob-act rf-mob-act--sound"
            aria-pressed={soundOn}
            aria-label={t(soundOn ? 'portfolio.feed.soundOff' : 'portfolio.feed.soundOn')}
            onClick={() => setSoundOn((on) => !on)}
          >
            <span className="rf-mob-disc"><SoundIcon on={soundOn} /></span>
          </button>
          <button
            type="button"
            className="rf-mob-act"
            aria-pressed={isLiked}
            aria-label={t('portfolio.feed.like')}
            onClick={() => setLiked((current) => ({ ...current, [clip.id]: !current[clip.id] }))}
          >
            <svg className="rf-heart" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span>{SITE_PROOF.fiverrRating}</span>
          </button>
          <a
            href="#testimonials"
            className="rf-mob-act"
            onClick={handleHashLinkClick}
            aria-label={t('hero.feed.reviewsAria', { count: SITE_PROOF.fiverrReviewCount })}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
            <span>{SITE_PROOF.fiverrReviewCount}</span>
          </a>
          <span className="rf-mob-act" aria-label={t('hero.feed.brandsAria', { count: SITE_PROOF.brandCampaigns })}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
            <span>{SITE_PROOF.brandCampaigns}+</span>
          </span>
        </div>

        <div className="rf-mob-caption" key={clip.id}>
          <p className="rf-mob-name">Gisela Saldarriaga</p>
          <p className="rf-mob-title">
            {title} · {categoryOf(clip)} · {formatDuration(clip.durationSeconds)}
          </p>
          <p className="rf-mob-sound-line">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
            {t('hero.feed.soundShort')}
          </p>
          <a className="rf-mob-cta" href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <span className="rf-wa"><WhatsAppGlyph /></span>
            {t('portfolio.feed.ctaShort')}
          </a>
        </div>

        <div className="rf-mob-progress" aria-hidden="true"><span ref={progressRef} /></div>

        <div className="rf-mob-hint" data-hidden={touched} aria-hidden="true">
          <Chevron up />
          {t('portfolio.feed.swipe')}
        </div>
      </section>
    );
  }

  const upNext = Array.from({ length: Math.min(4, list.length - 1) }, (_, k) => (activeIndex + k + 1) % list.length);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="rf-desk"
      data-seen={seen}
      aria-labelledby="portfolio-title"
    >
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
                    <img src={getPosterVariantSrc(item, 720, 'webp')} alt="" decoding="async" />
                    {i === activeIndex ? video : null}
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
              <Chevron up />
            </button>
            <button
              type="button"
              className="rf-ctrl"
              aria-label={t('portfolio.feed.next')}
              onClick={() => go(1, true)}
            >
              <Chevron up={false} />
            </button>
            <button
              type="button"
              className="rf-ctrl"
              aria-pressed={soundOn}
              aria-label={t(soundOn ? 'portfolio.feed.soundOff' : 'portfolio.feed.soundOn')}
              onClick={() => setSoundOn((on) => !on)}
            >
              <SoundIcon on={soundOn} />
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
                    onClick={() => {
                      setTouched(true);
                      setIndex(i);
                    }}
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
    </section>
  );
};

export default Portfolio;
