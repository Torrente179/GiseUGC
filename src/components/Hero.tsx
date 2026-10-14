import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import AutoplayPreviewVideo from '@/components/media/AutoplayPreviewVideo';
import ReelPhone from '@/components/media/ReelPhone';
import ResponsivePosterImage from '@/components/media/ResponsivePosterImage';
import { getPosterVariantSrc, LEGACY_REEL_CLIPS, type ReelClip } from '@/data/portfolio-clips';
import { SITE_PROOF } from '@/data/site-proof';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { useHeroDepth } from '@/hooks/use-hero-depth';
import { useMediaIntent } from '@/hooks/use-media-intent';
import { isMobileViewport, openContactDock, toggleContactDock } from '@/lib/contact-dock';
import { resolveFeedSource, warmFeedVideo } from '@/lib/feed-media';
import { useTranslation } from '@/lib/locale-context';

const HERO_REEL_CLIPS = LEGACY_REEL_CLIPS;
const HERO_INTRO_CLIP_COUNT = 3;
const HERO_INTRO_CLIPS = HERO_REEL_CLIPS.slice(0, HERO_INTRO_CLIP_COUNT);

const HERO_INTRO_STORAGE_KEY = 'gisela:portrait-phone-intro';
const HERO_INTRO_VERSION = 'phone-contact-strip-v1';
const HERO_INTRO_LOAD_TIMEOUT_MS = 2600;
const HERO_INTRO_PLAY_TIMEOUT_MS = 2500;
const HERO_REEL_INTERVAL_MS = 3500;

// Phones and portrait tablets get the compact composition (proof rail, no
// reel phone); mirrors the compact media query in index.css. Nothing
// reel-related runs there.
const COMPACT_HERO_QUERY = '(max-width: 767px), (orientation: portrait) and (max-width: 1100px)';

const useCompactHero = () => {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(COMPACT_HERO_QUERY);
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  return compact;
};

// Her rendered width, from the frame geometry in index.css: the cut-out is
// 24.6% of a 16:9 frame at least 128% of the stage tall (desktop), and on
// phones 92% of the screen up to 330px.
const HERO_FIGURE_SIZES = '(max-width: 767px) min(92vw, 330px), max(56vh, 25vw, 480px)';
// The scene frame is ~1.78 × its height wide: well over the viewport.
const HERO_SCENE_SIZES = '(max-width: 767px) 380vw, max(130vw, 228vh)';

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
  const isMobile = useCompactHero();
  const heroRef = useRef<HTMLElement>(null);
  const [introState, setIntroState] = useState<HeroIntroState>('idle');
  const [isHeroActive, setIsHeroActive] = useState(true);
  const [reelIndex, setReelIndex] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const figureRef = useRef<HTMLImageElement>(null);
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
    if (window.matchMedia(COMPACT_HERO_QUERY).matches) return undefined;

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

  // The scene behind her has the place where she stood filled in, which only
  // reads as background once she is drawn over it. Show it after she loads.
  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return undefined;
    const reveal = () => setSceneReady(true);
    if (figure.complete) {
      reveal();
      return undefined;
    }
    figure.addEventListener('load', reveal, { once: true });
    figure.addEventListener('error', reveal, { once: true });
    return () => {
      figure.removeEventListener('load', reveal);
      figure.removeEventListener('error', reveal);
    };
  }, []);

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

  const activeReelClip = HERO_REEL_CLIPS[reelIndex] ?? HERO_REEL_CLIPS[0];
  const introIsRunning = introState === 'loading' || introState === 'playing';
  const reelIsPlaying = mediaIntent && !isMobile && isHeroActive && !introIsRunning;
  const nextReelClip = HERO_REEL_CLIPS[(reelIndex + 1) % HERO_REEL_CLIPS.length];

  // Each reel shows for 3.5 s, so the phone plays the reels' 6 s opening loops
  // and the next one is already buffering when the rotation lands on it.
  useEffect(() => {
    if (!reelIsPlaying || !nextReelClip) return;
    warmFeedVideo(resolveFeedSource(nextReelClip.previewSrc)?.src);
  }, [nextReelClip, reelIsPlaying]);
  const clipTitle = (clip: ReelClip) => (
    clip.titleKey ? t(clip.titleKey) : clip.localizedTitle?.[locale] ?? clip.title ?? ''
  );
  const handleContactClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isMobileViewport()) {
      event.preventDefault();
      toggleContactDock();
      return;
    }
    handleHashLinkClick(event);
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className={`feed-hero${sceneReady ? ' is-ready' : ''}`}
      aria-labelledby="feed-hero-title"
    >
      <div className="feed-hero__stage">
        {/* Her scene, lightly blurred, with her removed. It shares its frame
            geometry with the cut-out below, so she lands exactly where she
            stood. */}
        <div className="feed-hero__frame feed-hero__frame--scene" aria-hidden="true">
          <div className="feed-hero__frame-depth" data-depth="8">
            <img
              className="feed-hero__scene"
              src="/uploads/gisela-scene-2016.webp"
              srcSet="/uploads/gisela-scene-1344.webp 1344w, /uploads/gisela-scene-2016.webp 2016w"
              sizes={HERO_SCENE_SIZES}
              alt=""
              width="2016"
              height="1134"
              loading="eager"
              decoding="async"
            />
            {/* Upright tablets seat her lower than the photo's top edge. The
                scene mirrored above it fills that strip, where the bare
                ground would show as a band. Same file, so no second fetch. */}
            <img
              className="feed-hero__scene feed-hero__scene--mirror"
              src="/uploads/gisela-scene-2016.webp"
              srcSet="/uploads/gisela-scene-1344.webp 1344w, /uploads/gisela-scene-2016.webp 2016w"
              sizes={HERO_SCENE_SIZES}
              alt=""
              width="2016"
              height="1134"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
        <div className="feed-hero__shade" aria-hidden="true" />

        <div className="feed-hero__name-track" aria-hidden="true">
          <div data-depth="-14">
            <p className="feed-hero__name feed-hero-rise" style={enterDelay(60)}>
              Gisela
            </p>
          </div>
        </div>

        <div className="feed-hero__frame feed-hero__frame--figure">
          <div className="feed-hero__frame-depth" data-depth="8">
            <picture className="feed-hero__figure">
              {/* Cut from the 4032×2268 photo, where she spans 980×2072 px.
                  WebP only: AVIF compresses alpha lossily and steps the
                  outline. */}
              <source
                type="image/webp"
                srcSet="/uploads/gisela-cutout-520.webp 520w, /uploads/gisela-cutout-760.webp 760w, /uploads/gisela-cutout-980.webp 980w"
                sizes={HERO_FIGURE_SIZES}
              />
              <img
                ref={figureRef}
                src="/uploads/gisela-cutout-640.png"
                alt={t('hero.imageAlt')}
                width="980"
                height="2072"
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
              <ReelPhone
                className="feed-hero__phone"
                title={clipTitle(activeReelClip)}
                reelKey={activeReelClip.id}
                playing={reelIsPlaying}
                clipMs={HERO_REEL_INTERVAL_MS}
                onNavigate={handleHashLinkClick}
                onContact={handleContactClick}
              >
                <ResponsivePosterImage
                  clip={activeReelClip}
                  alt=""
                  className="feed-hero__phone-poster"
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 1037px) 12rem, (max-width: 1556px) 18.5vw, 18rem"
                  fetchpriority="low"
                  rootMargin="0px"
                />

                {mediaIntent && !isMobile && !introIsRunning && (
                  <AutoplayPreviewVideo
                    key={activeReelClip.id}
                    className="feed-hero__phone-video"
                    src={activeReelClip.previewSrc}
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
              </ReelPhone>
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
