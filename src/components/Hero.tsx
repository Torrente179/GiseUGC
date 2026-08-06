import { useCallback, useEffect, useRef, useState } from 'react';
import AutoplayPreviewVideo from '@/components/media/AutoplayPreviewVideo';
import ResponsivePosterImage from '@/components/media/ResponsivePosterImage';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';
import {
  getPosterVariantSrc,
  LEGACY_REEL_CLIPS,
  type ReelClip,
} from '@/data/portfolio-clips';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { useMediaIntent } from '@/hooks/use-media-intent';
import { useTranslation } from '@/lib/locale-context';

const HERO_CLIP_ID = 1015;
const HERO_CLIP = NUEVOS_R2_READY_CLIPS.find(({ id }) => id === HERO_CLIP_ID)
  ?? NUEVOS_R2_READY_CLIPS[0];

const HERO_INTRO_CLIP_IDS = [5, 1006, 1001] as const;
const HERO_INTRO_CLIPS = HERO_INTRO_CLIP_IDS
  .map((id) => (
    LEGACY_REEL_CLIPS.find((clip) => clip.id === id)
    ?? NUEVOS_R2_READY_CLIPS.find((clip) => clip.id === id)
  ))
  .filter((clip): clip is ReelClip => Boolean(clip));

const HERO_INTRO_STORAGE_KEY = 'gisela:portrait-phone-intro';
const HERO_INTRO_VERSION = 'phone-contact-strip-v1';
const HERO_INTRO_LOAD_TIMEOUT_MS = 2600;
const HERO_INTRO_PLAY_TIMEOUT_MS = 2500;

type HeroIntroState = 'idle' | 'loading' | 'playing' | 'complete';

let hasPlayedHeroIntroInDocument = false;

const Hero = () => {
  const { locale, t } = useTranslation();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const mediaIntent = useMediaIntent();
  const [introState, setIntroState] = useState<HeroIntroState>('idle');
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
    if (HERO_INTRO_CLIPS.length !== HERO_INTRO_CLIP_IDS.length) return undefined;

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

  return (
    <section
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
            <p className="portrait-hero__eyebrow">
              <span>Medellín</span>
              <span aria-hidden="true">/</span>
              <span>ES + EN</span>
            </p>

            <h1 id="portrait-hero-title" className="portrait-hero__title">
              <span className="portrait-hero__given-name">Gisela</span>
              {' '}
              <span className="portrait-hero__surname">Saldarriaga</span>
            </h1>

            <p className="portrait-hero__subtitle">{t('hero.subtitle')}</p>
            <span className="portrait-hero__rule" aria-hidden="true" />
            <p className="portrait-hero__description">{t('hero.description')}</p>

            <a
              href="#portfolio"
              className="portrait-hero__cta"
              onClick={handleHashLinkClick}
            >
              <span>{t('hero.buttonPortfolio')}</span>
              <span className="portrait-hero__cta-mark" aria-hidden="true">↘</span>
            </a>
          </div>

          <div className="portrait-hero__phone-wrap">
            <a
              href="#portfolio"
              className="portrait-hero__phone"
              aria-label={phoneAriaLabel}
              onClick={handleHashLinkClick}
            >
              <span className="portrait-hero__phone-button portrait-hero__phone-button--volume" aria-hidden="true" />
              <span className="portrait-hero__phone-button portrait-hero__phone-button--power" aria-hidden="true" />

              <span className="portrait-hero__phone-screen" aria-hidden="true">
                <ResponsivePosterImage
                  clip={HERO_CLIP}
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
                    className="portrait-hero__phone-video"
                    src={HERO_CLIP.mobileSrc}
                    hlsSrc={HERO_CLIP.mobileHlsSrc ?? HERO_CLIP.hlsSrc}
                    poster={getPosterVariantSrc(HERO_CLIP, 720, 'avif')}
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

                <span className="portrait-hero__phone-speaker" aria-hidden="true" />
              </span>
            </a>
            <p className="portrait-hero__phone-caption" aria-hidden="true">
              <span>Selected reel</span>
              <span>01</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
