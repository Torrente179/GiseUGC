import { useCallback, useEffect, useRef, useState } from 'react';
import ResponsivePosterImage from '@/components/media/ResponsivePosterImage';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';
import { LEGACY_REEL_CLIPS, type ReelClip } from '@/data/portfolio-clips';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
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

const HERO_INTRO_STORAGE_KEY = 'gisela:gallery-hero-intro';
const HERO_INTRO_VERSION = 'contact-strip-v1';
const HERO_INTRO_LOAD_TIMEOUT_MS = 2600;
const HERO_INTRO_PLAY_TIMEOUT_MS = 2400;

type HeroIntroState = 'idle' | 'loading' | 'playing' | 'complete';

let hasPlayedHeroIntroInDocument = false;

const Hero = () => {
  const { locale } = useTranslation();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const [introState, setIntroState] = useState<HeroIntroState>('idle');
  const loadedIntroClipIds = useRef(new Set<number>());
  const ownsIntroRun = useRef(false);

  const completeIntro = useCallback(() => {
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
      // The in-document guard still prevents repeats when storage is unavailable.
    }

    // React Strict Mode re-runs effects on the same mounted instance. That
    // instance keeps ownership; a genuine remount in this tab does not replay.
    if (hasPlayedInSession && !ownsIntroRun.current) return undefined;

    ownsIntroRun.current = true;
    hasPlayedHeroIntroInDocument = true;
    try {
      window.sessionStorage.setItem(HERO_INTRO_STORAGE_KEY, HERO_INTRO_VERSION);
    } catch {
      // Storage can be unavailable in locked-down browser contexts.
    }

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
      completeIntro,
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

  const imageDescription = locale === 'es'
    ? 'Gisela Saldarriaga presentando una pieza UGC frente a cámara.'
    : 'Gisela Saldarriaga presenting a UGC piece on camera.';
  const selectedWorkAriaLabel = locale === 'es'
    ? 'Ir al trabajo seleccionado'
    : 'Go to selected work';
  const metadataAriaLabel = locale === 'es'
    ? 'Medellín, español e inglés, índice 001'
    : 'Medellin, Spanish and English, index 001';

  return (
    <section
      id="home"
      className="gallery-hero relative w-full overflow-hidden"
      aria-labelledby="gallery-hero-name"
    >
      <div className="gallery-hero__stage">
        <div className="gallery-hero__metadata" role="group" aria-label={metadataAriaLabel}>
          <span aria-hidden="true">MED / ES + EN</span>
          <span aria-hidden="true">001</span>
        </div>

        <h1 id="gallery-hero-name" className="gallery-hero__name">
          GISELA
        </h1>

        <figure className="gallery-hero__media">
          <figcaption className="sr-only">{imageDescription}</figcaption>
          <div className="gallery-hero__film" aria-hidden="true">
            <div className="gallery-hero__mat">
              <div className="gallery-hero__still">
                <ResponsivePosterImage
                  clip={HERO_CLIP}
                  alt=""
                  loading="eager"
                  decoding="sync"
                  sizes="(max-width: 767px) 44vw, (max-width: 1023px) 30vw, 25vw"
                  fetchpriority="high"
                  rootMargin="0px"
                />
                {(introState === 'loading' || introState === 'playing') && (
                  <div
                    className={`gallery-hero__intro${introState === 'playing' ? ' is-playing' : ''}`}
                    aria-hidden="true"
                    onAnimationEnd={(event) => {
                      if (event.target === event.currentTarget) completeIntro();
                    }}
                  >
                    {HERO_INTRO_CLIPS.map((clip) => (
                      <span className="gallery-hero__fragment" key={clip.id}>
                        <ResponsivePosterImage
                          clip={clip}
                          alt=""
                          loading="eager"
                          decoding="async"
                          sizes="(max-width: 767px) 14vw, (max-width: 1023px) 10vw, 8vw"
                          fetchpriority="low"
                          rootMargin="0px"
                          onLoad={() => handleIntroFragmentLoad(clip.id)}
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </figure>

        <div className="gallery-hero__index">
          <span className="gallery-hero__rule" aria-hidden="true" />
          <a
            href="#portfolio"
            className="gallery-hero__selected-work"
            aria-label={selectedWorkAriaLabel}
            onClick={handleHashLinkClick}
          >
            <span>Selected work</span>
            <span aria-hidden="true">↘</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
