import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import AutoplayPreviewVideo from '@/components/media/AutoplayPreviewVideo';
import ResponsivePosterImage from '@/components/media/ResponsivePosterImage';
import { getPosterVariantSrc, LEGACY_REEL_CLIPS } from '@/data/portfolio-clips';
import { SITE_PROOF } from '@/data/site-proof';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { useHeroDepth } from '@/hooks/use-hero-depth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMediaIntent } from '@/hooks/use-media-intent';
import { openContactDock } from '@/lib/contact-dock';
import { useTranslation } from '@/lib/locale-context';

const HERO_REEL_CLIPS = LEGACY_REEL_CLIPS;
const HERO_INTRO_CLIP_COUNT = 3;
const HERO_INTRO_CLIPS = HERO_REEL_CLIPS.slice(0, HERO_INTRO_CLIP_COUNT);

const HERO_INTRO_STORAGE_KEY = 'gisela:portrait-phone-intro';
const HERO_INTRO_VERSION = 'phone-contact-strip-v1';
const HERO_INTRO_LOAD_TIMEOUT_MS = 2600;
const HERO_INTRO_PLAY_TIMEOUT_MS = 2500;
const HERO_REEL_INTERVAL_MS = 3500;

// The reel card only exists above the phone breakpoint; below it the proof
// rail takes its place, so nothing reel-related should run there.
const DESKTOP_HERO_QUERY = '(min-width: 768px)';

// Mirrors `--feed-figure-width` in index.css.
const HERO_FIGURE_SIZES = '(max-width: 767px) min(92vw, 327px), min(42.5vw, 54.4vh, 680px)';

type HeroIntroState = 'idle' | 'loading' | 'playing' | 'complete';

let hasPlayedHeroIntroInDocument = false;

/** One gentle stagger on load, set per element. */
const enterDelay = (ms: number) => ({ '--enter-delay': `${ms}ms` }) as CSSProperties;

/**
 * Home hero. Her name sits behind the cut-out portrait; scrolling lifts the
 * name and lowers her, so the whole word comes into view as the hero leaves.
 * The copy reads like a post caption. Desktop shows the reel card on the
 * right; phones show a proof rail instead.
 */
const Hero = () => {
  const { locale, t } = useTranslation();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const mediaIntent = useMediaIntent();
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLElement>(null);
  const [introState, setIntroState] = useState<HeroIntroState>('idle');
  const [isHeroActive, setIsHeroActive] = useState(true);
  const [reelIndex, setReelIndex] = useState(0);
  const loadedIntroClipIds = useRef(new Set<number>());
  const ownsIntroRun = useRef(false);

  useHeroDepth(heroRef);

  const completeIntro = useCallback((persistCompletion = false) => {
    if (persistCompletion) {
      try {
        window.sessionStorage.setItem(HERO_INTRO_STORAGE_KEY, HERO_INTRO_VERSION);
      } catch {
        // A private or locked-down browser can still use the in-document guard.
      }
    }

    setIntroState((currentState) => (
      currentState === 'loading' || currentState === 'playing'
        ? 'complete'
        : currentState
    ));
  }, []);

  useEffect(() => {
    if (HERO_INTRO_CLIPS.length !== HERO_INTRO_CLIP_COUNT) return undefined;
    if (!window.matchMedia(DESKTOP_HERO_QUERY).matches) return undefined;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return undefined;

    let hasPlayedInSession = hasPlayedHeroIntroInDocument;
    try {
      hasPlayedInSession = hasPlayedInSession
        || window.sessionStorage.getItem(HERO_INTRO_STORAGE_KEY) === HERO_INTRO_VERSION;
    } catch {
      // The in-document guard still prevents accidental repeats in this tab.
    }

    // Strict Mode re-runs effects on the same instance. That instance keeps
    // ownership, while a genuine remount in this document does not replay.
    if (hasPlayedInSession && !ownsIntroRun.current) return undefined;

    ownsIntroRun.current = true;
    hasPlayedHeroIntroInDocument = true;
    setIntroState((currentState) => (
      currentState === 'idle' ? 'loading' : currentState
    ));

    const handleMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) completeIntro();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') completeIntro();
    };

    motionQuery.addEventListener('change', handleMotionChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [completeIntro]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || typeof IntersectionObserver === 'undefined') {
      setIsHeroActive(document.visibilityState === 'visible');
      return undefined;
    }

    let intersects = true;
    const sync = () => {
      setIsHeroActive(intersects && document.visibilityState === 'visible');
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersects = Boolean(entry?.isIntersecting);
        sync();
      },
      { rootMargin: '120px 0px' },
    );

    observer.observe(hero);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  useEffect(() => {
    const introIsActive = introState === 'loading' || introState === 'playing';
    if (isMobile || !mediaIntent || !isHeroActive || introIsActive || HERO_REEL_CLIPS.length < 2) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setReelIndex((currentIndex) => (currentIndex + 1) % HERO_REEL_CLIPS.length);
    }, HERO_REEL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [introState, isHeroActive, isMobile, mediaIntent]);

  useEffect(() => {
    if (introState !== 'loading' && introState !== 'playing') return undefined;

    const timeout = window.setTimeout(
      () => completeIntro(),
      introState === 'loading'
        ? HERO_INTRO_LOAD_TIMEOUT_MS
        : HERO_INTRO_PLAY_TIMEOUT_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [completeIntro, introState]);

  const handleIntroFragmentLoad = useCallback((clipId: number) => {
    loadedIntroClipIds.current.add(clipId);
    if (loadedIntroClipIds.current.size !== HERO_INTRO_CLIPS.length) return;

    window.requestAnimationFrame(() => {
      setIntroState((currentState) => (
        currentState === 'loading' ? 'playing' : currentState
      ));
    });
  }, []);

  const phoneAriaLabel = locale === 'es'
    ? 'Ver el portafolio de videos UGC de Gisela'
    : "View Gisela's UGC video portfolio";
  const activeReelClip = HERO_REEL_CLIPS[reelIndex] ?? HERO_REEL_CLIPS[0];
  const formattedReelIndex = String(reelIndex + 1).padStart(2, '0');
  const formattedReelTotal = String(HERO_REEL_CLIPS.length).padStart(2, '0');
  const introIsRunning = introState === 'loading' || introState === 'playing';

  return (
    <section
      ref={heroRef}
      id="home"
      className="feed-hero"
      aria-labelledby="feed-hero-title"
    >
      <div className="feed-hero__stage">
        {/* Her own photo, blurred into a backdrop. Scrolling dims it. */}
        <div className="feed-hero__plate-track" aria-hidden="true">
          <picture className="feed-hero__plate feed-hero-fade" style={enterDelay(0)}>
            <source
              media="(max-width: 767px)"
              type="image/webp"
              srcSet="/uploads/gisela-hero-plate-mobile.webp"
            />
            <img
              src="/uploads/gisela-hero-plate-desktop.webp"
              alt=""
              width="960"
              height="540"
              loading="eager"
              decoding="async"
            />
          </picture>
          <span className="feed-hero__glow" />
        </div>
        <div className="feed-hero__fade" aria-hidden="true" />

        <div className="feed-hero__name-track" aria-hidden="true">
          <div data-depth="-14">
            <p className="feed-hero__name feed-hero-rise" style={enterDelay(60)}>
              Gisela
            </p>
          </div>
        </div>

        <div className="feed-hero__figure-track">
          <div className="feed-hero__figure-depth" data-depth="16">
            <picture className="feed-hero__figure feed-hero-settle" style={enterDelay(140)}>
              {/* Cut from the 4032×2268 original, where she spans 980×2070 px.
                  The stylesheet caps her rendered width on dense screens so
                  the browser never has to stretch past those pixels. */}
              <source
                type="image/avif"
                srcSet="/uploads/gisela-cutout-520.avif 520w, /uploads/gisela-cutout-760.avif 760w, /uploads/gisela-cutout-980.avif 980w"
                sizes={HERO_FIGURE_SIZES}
              />
              <source
                type="image/webp"
                srcSet="/uploads/gisela-cutout-520.webp 520w, /uploads/gisela-cutout-760.webp 760w, /uploads/gisela-cutout-980.webp 980w"
                sizes={HERO_FIGURE_SIZES}
              />
              <img
                src="/uploads/gisela-cutout-640.png"
                alt={t('hero.imageAlt')}
                width="980"
                height="2070"
                loading="eager"
                decoding="async"
                {...({ fetchpriority: 'high' } as Record<string, string>)}
              />
            </picture>
          </div>
        </div>

        <div className="feed-hero__scrim" aria-hidden="true" />

        <div className="feed-hero__layout">
          <div className="feed-hero__caption-depth" data-depth="9" data-tilt="2.5">
            <div className="feed-hero__caption feed-hero-rise" style={enterDelay(380)}>
              <p className="feed-hero__author">
                <img
                  className="feed-hero__avatar"
                  src="/uploads/gisela-avatar-160.webp"
                  alt=""
                  width="160"
                  height="160"
                  loading="eager"
                  decoding="async"
                />
                <span className="feed-hero__author-text">
                  <span className="feed-hero__author-name">Gisela Saldarriaga</span>
                  <span className="feed-hero__author-role">{t('hero.feed.role')}</span>
                </span>
              </p>

              <h1 id="feed-hero-title" className="feed-hero__title">
                <span className="feed-hero__greeting">{t('hero.feed.greeting')}</span>{' '}
                {t('hero.offerTitle')}
              </h1>

              <p className="feed-hero__lead">{t('hero.offerLead')}</p>

              <p className="feed-hero__sound">
                <svg
                  className="feed-hero__sound-mark"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
                <span className="feed-hero__sound-full">{t('hero.feed.sound')}</span>
                <span className="feed-hero__sound-short">{t('hero.feed.soundShort')}</span>
              </p>

              <div className="feed-hero__actions">
                <a href="#portfolio" className="feed-hero__cta" onClick={handleHashLinkClick}>
                  <span>{t('hero.buttonPortfolio')}</span>
                  <svg
                    className="feed-hero__cta-mark"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
                <a href="#services" className="feed-hero__ghost" onClick={handleHashLinkClick}>
                  <span className="feed-hero__ghost-full">{t('hero.feed.servicesButton')}</span>
                  <span className="feed-hero__ghost-short">{t('navbar.services')}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="feed-hero__reel-depth" data-depth="-8" data-tilt="3">
            <div className="feed-hero__reel feed-hero-rise" style={enterDelay(560)}>
              <a
                href="#portfolio"
                className="feed-hero__phone"
                aria-label={phoneAriaLabel}
                onClick={handleHashLinkClick}
              >
                <span className="feed-hero__phone-screen" aria-hidden="true">
                  <ResponsivePosterImage
                    clip={activeReelClip}
                    alt=""
                    className="feed-hero__phone-poster"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 1023px) 13vw, 11.7rem"
                    fetchpriority="low"
                    rootMargin="0px"
                  />

                  {mediaIntent && !isMobile && !introIsRunning && (
                    <AutoplayPreviewVideo
                      key={activeReelClip.id}
                      className="feed-hero__phone-video"
                      src={activeReelClip.mobileSrc}
                      hlsSrc={activeReelClip.mobileHlsSrc ?? activeReelClip.hlsSrc}
                      poster={getPosterVariantSrc(activeReelClip, 720, 'avif')}
                      preload="metadata"
                      playbackPriority="hero"
                      loadStrategy="immediate"
                      rootMargin="120px 0px"
                    />
                  )}

                  {introIsRunning && (
                    <span
                      className={`feed-hero__intro${introState === 'playing' ? ' is-playing' : ''}`}
                      onAnimationEnd={(event) => {
                        if (event.target === event.currentTarget) completeIntro(true);
                      }}
                    >
                      {HERO_INTRO_CLIPS.map((clip) => (
                        <span className="feed-hero__fragment" key={clip.id}>
                          <ResponsivePosterImage
                            clip={clip}
                            alt=""
                            loading="eager"
                            decoding="async"
                            sizes="6vw"
                            fetchpriority="low"
                            rootMargin="0px"
                            onLoad={() => handleIntroFragmentLoad(clip.id)}
                          />
                        </span>
                      ))}
                    </span>
                  )}

                  <span className="feed-hero__phone-shade" aria-hidden="true" />

                  <span className="feed-hero__phone-caption" aria-hidden="true">
                    <span className="feed-hero__phone-caption-label">
                      <svg
                        className="feed-hero__phone-caption-mark"
                        viewBox="0 0 12 14"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M11.2 6.13 1.6.29A1 1 0 0 0 .1 1.15v11.7a1 1 0 0 0 1.5.86l9.6-5.84a1 1 0 0 0 0-1.74Z" />
                      </svg>
                      <span>{t('hero.reelLabel')}</span>
                    </span>
                    <span>{formattedReelIndex} / {formattedReelTotal}</span>
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Phones only: the proof a feed puts beside the video. */}
        <nav className="feed-hero__rail feed-hero-rise" style={enterDelay(560)} aria-label={t('hero.feed.railLabel')}>
          <a
            href="#testimonials"
            className="feed-hero__rail-item"
            aria-label={t('hero.feed.ratingAria', { rating: SITE_PROOF.fiverrRating })}
            onClick={handleHashLinkClick}
          >
            <span className="feed-hero__rail-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" focusable="false">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </span>
            <span className="feed-hero__rail-value" aria-hidden="true">{SITE_PROOF.fiverrRating}</span>
          </a>
          <a
            href="#testimonials"
            className="feed-hero__rail-item"
            aria-label={t('hero.feed.reviewsAria', { count: SITE_PROOF.fiverrReviewCount })}
            onClick={handleHashLinkClick}
          >
            <span className="feed-hero__rail-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            <span className="feed-hero__rail-value" aria-hidden="true">{SITE_PROOF.fiverrReviewCount}</span>
          </a>
          <a
            href="#portfolio"
            className="feed-hero__rail-item"
            aria-label={t('hero.feed.brandsAria', { count: SITE_PROOF.brandCampaigns })}
            onClick={handleHashLinkClick}
          >
            <span className="feed-hero__rail-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <rect width="20" height="14" x="2" y="6" rx="2" />
              </svg>
            </span>
            <span className="feed-hero__rail-value" aria-hidden="true">{SITE_PROOF.brandCampaigns}+</span>
          </a>
          <button type="button" className="feed-hero__rail-item" onClick={openContactDock}>
            <span className="feed-hero__rail-icon feed-hero__rail-icon--action" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
            </span>
            <span className="feed-hero__rail-value">{t('hero.buttonContact')}</span>
          </button>
        </nav>

        {/* Reads like a video's scrubber; it fills as the hero scrolls away. */}
        <div className="feed-hero__progress" aria-hidden="true">
          <span className="feed-hero__progress-fill" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
