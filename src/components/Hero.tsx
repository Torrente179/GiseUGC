import { useCallback, useEffect, useRef, useState } from 'react';
import AutoplayPreviewVideo from '@/components/media/AutoplayPreviewVideo';
import ResponsivePosterImage from '@/components/media/ResponsivePosterImage';
import {
  getPosterVariantSrc,
  LEGACY_REEL_CLIPS,
} from '@/data/portfolio-clips';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { useMediaIntent } from '@/hooks/use-media-intent';
import { useTranslation } from '@/lib/locale-context';

const HERO_REEL_CLIPS = LEGACY_REEL_CLIPS;
const HERO_INTRO_CLIP_COUNT = 3;
const HERO_INTRO_CLIPS = HERO_REEL_CLIPS.slice(0, HERO_INTRO_CLIP_COUNT);

const HERO_INTRO_STORAGE_KEY = 'gisela:portrait-phone-intro';
const HERO_INTRO_VERSION = 'phone-contact-strip-v1';
const HERO_INTRO_LOAD_TIMEOUT_MS = 2600;
const HERO_INTRO_PLAY_TIMEOUT_MS = 2500;
const HERO_REEL_INTERVAL_MS = 3500;

type HeroIntroState = 'idle' | 'loading' | 'playing' | 'complete';

let hasPlayedHeroIntroInDocument = false;

const Hero = () => {
  const { locale, t } = useTranslation();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const mediaIntent = useMediaIntent();
  const heroRef = useRef<HTMLElement>(null);
  const [introState, setIntroState] = useState<HeroIntroState>('idle');
  const [isHeroActive, setIsHeroActive] = useState(true);
  const [reelIndex, setReelIndex] = useState(0);
  const loadedIntroClipIds = useRef(new Set<number>());
  const ownsIntroRun = useRef(false);

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
    if (!mediaIntent || !isHeroActive || introIsActive || HERO_REEL_CLIPS.length < 2) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setReelIndex((currentIndex) => (currentIndex + 1) % HERO_REEL_CLIPS.length);
    }, HERO_REEL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [introState, isHeroActive, mediaIntent]);

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

  return (
    <section
      ref={heroRef}
      id="home"
      className="portrait-hero"
      aria-labelledby="portrait-hero-title"
    >
      <div className="portrait-hero__stage">
        <picture className="portrait-hero__picture" data-hero-lead>
          <source
            media="(max-width: 767px)"
            type="image/webp"
            srcSet="/uploads/gisela-hero-mobile-768.webp 768w, /uploads/gisela-hero-mobile-992.webp 992w"
            sizes="100vw"
          />
          <source
            media="(max-width: 767px)"
            type="image/jpeg"
            srcSet="/uploads/gisela-hero-mobile-992.jpg 992w"
            sizes="100vw"
          />
          <source
            media="(min-width: 1024px)"
            type="image/webp"
            srcSet="/uploads/gisela-hero-desktop-1600.webp 1600w, /uploads/gisela-hero-desktop-2048.webp 2048w"
            sizes="100vw"
          />
          <source
            media="(min-width: 1024px)"
            type="image/jpeg"
            srcSet="/uploads/gisela-hero-desktop-2048.jpg 2048w"
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcSet="/uploads/gisela-hero-400.webp 400w, /uploads/gisela-hero-585.webp 585w, /uploads/gisela-hero-800.webp 800w, /uploads/gisela-hero-1200.webp 1200w"
            sizes="100vw"
          />
          <img
            src="/uploads/gisela-hero-585.jpg"
            alt={t('hero.imageAlt')}
            width="2048"
            height="1152"
            loading="eager"
            decoding="async"
            {...({ fetchpriority: 'high' } as Record<string, string>)}
          />
        </picture>

        <div className="portrait-hero__scrim" aria-hidden="true" />

        <div className="portrait-hero__layout">
          <div className="portrait-hero__copy">
            {/* Her name signs the work; the offer is what carries the frame. */}
            <p className="portrait-hero__signature">
              <span className="portrait-hero__name">Gisela Saldarriaga</span>
              <span className="portrait-hero__signature-rule" aria-hidden="true" />
              <span className="portrait-hero__signature-meta">{t('hero.signatureMeta')}</span>
            </p>

            <h1 id="portrait-hero-title" className="portrait-hero__title">
              {t('hero.offerTitle')}
            </h1>

            <p className="portrait-hero__description">{t('hero.offerLead')}</p>

            <div className="portrait-hero__actions">
              <a
                href="#portfolio"
                className="portrait-hero__cta"
                onClick={handleHashLinkClick}
              >
                <span>{t('hero.buttonPortfolio')}</span>
                <svg
                  className="portrait-hero__cta-mark"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M7 7 17 17" />
                  <path d="M17 11v6h-6" />
                </svg>
              </a>
              <span className="portrait-hero__actions-note">
                {t('hero.reelNote', { count: HERO_REEL_CLIPS.length })}
              </span>
            </div>
          </div>

          <div className="portrait-hero__phone-wrap">
            <a
              href="#portfolio"
              className="portrait-hero__phone"
              aria-label={phoneAriaLabel}
              onClick={handleHashLinkClick}
            >
              <span className="portrait-hero__phone-screen" aria-hidden="true">
                <ResponsivePosterImage
                  clip={activeReelClip}
                  alt=""
                  className="portrait-hero__phone-poster"
                  loading="eager"
                  decoding="async"
                  sizes="(max-width: 767px) 31vw, (max-width: 1023px) 20vw, 19vw"
                  fetchpriority="low"
                  rootMargin="0px"
                />

                {mediaIntent && introState !== 'loading' && introState !== 'playing' && (
                  <AutoplayPreviewVideo
                    key={activeReelClip.id}
                    className="portrait-hero__phone-video"
                    src={activeReelClip.mobileSrc}
                    hlsSrc={activeReelClip.mobileHlsSrc ?? activeReelClip.hlsSrc}
                    poster={getPosterVariantSrc(activeReelClip, 720, 'avif')}
                    preload="metadata"
                    playbackPriority="hero"
                    loadStrategy="immediate"
                    rootMargin="120px 0px"
                  />
                )}

                {(introState === 'loading' || introState === 'playing') && (
                  <span
                    className={`portrait-hero__intro${introState === 'playing' ? ' is-playing' : ''}`}
                    onAnimationEnd={(event) => {
                      if (event.target === event.currentTarget) completeIntro(true);
                    }}
                  >
                    {HERO_INTRO_CLIPS.map((clip) => (
                      <span className="portrait-hero__fragment" key={clip.id}>
                        <ResponsivePosterImage
                          clip={clip}
                          alt=""
                          loading="eager"
                          decoding="async"
                          sizes="(max-width: 767px) 10vw, (max-width: 1023px) 7vw, 6vw"
                          fetchpriority="low"
                          rootMargin="0px"
                          onLoad={() => handleIntroFragmentLoad(clip.id)}
                        />
                      </span>
                    ))}
                  </span>
                )}

                <span className="portrait-hero__phone-shade" aria-hidden="true" />

                {/* The counter rides inside the card: below it, it lands on the
                    planted wall behind her and stops being readable. */}
                <span className="portrait-hero__phone-caption" aria-hidden="true">
                  <span className="portrait-hero__phone-caption-label">
                    <svg
                      className="portrait-hero__phone-caption-mark"
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
    </section>
  );
};

export default Hero;
