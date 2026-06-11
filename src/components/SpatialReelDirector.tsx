import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AutoplayPreviewVideo from '@/components/media/AutoplayPreviewVideo';
import { useReelTheater } from '@/components/reel-theater/reel-theater-context';
import { DIRECTOR_CHAPTERS, DIRECTOR_CLIPS } from '@/data/director-chapters';
import { getBestPosterSrc } from '@/data/portfolio-clips';

const SpatialReelDirectorThree = lazy(() => import('@/components/SpatialReelDirectorThree'));

type NavigatorConnection = {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  saveData?: boolean;
};

const canUseDirectorWebGL = () => {
  if (window.innerWidth < 1024) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
  if (
    connection?.saveData ||
    connection?.effectiveType === 'slow-2g' ||
    connection?.effectiveType === '2g' ||
    connection?.effectiveType === '3g'
  ) return false;
  const canvas = document.createElement('canvas');
  return Boolean(canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }));
};

const SpatialReelDirector = () => {
  const { t } = useTranslation();
  const { openReel } = useReelTheater();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [nearViewport, setNearViewport] = useState(false);
  const [webglEnabled, setWebglEnabled] = useState(false);
  const [fallbackPreviewEnabled, setFallbackPreviewEnabled] = useState(false);
  const activeClip = DIRECTOR_CLIPS[activeIndex];
  const activeChapter = DIRECTOR_CHAPTERS[activeIndex];
  const handleWebglFailure = useCallback(() => setWebglEnabled(false), []);

  useEffect(() => {
    const evaluate = () => {
      const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
      const constrained = Boolean(
        connection?.saveData ||
        connection?.effectiveType === 'slow-2g' ||
        connection?.effectiveType === '2g' ||
        connection?.effectiveType === '3g',
      );
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setFallbackPreviewEnabled(!constrained && !reducedMotion);
      setWebglEnabled(canUseDirectorWebGL());
    };
    evaluate();
    window.addEventListener('resize', evaluate);
    return () => window.removeEventListener('resize', evaluate);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      setNearViewport(true);
      return;
    }

    let observer: IntersectionObserver | null = null;
    const markNearViewport = () => {
      setNearViewport(true);
      observer?.disconnect();
      window.removeEventListener('scroll', evaluateDistance);
      window.removeEventListener('resize', evaluateDistance);
    };
    const evaluateDistance = () => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight + 900 && rect.bottom >= -900) {
        markNearViewport();
      }
    };

    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) markNearViewport();
      }, { rootMargin: '900px 0px' });
      observer.observe(section);
    }
    window.addEventListener('scroll', evaluateDistance, { passive: true });
    window.addEventListener('resize', evaluateDistance);
    evaluateDistance();

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', evaluateDistance);
      window.removeEventListener('resize', evaluateDistance);
    };
  }, []);

  const openActive = (trigger: HTMLElement) => {
    openReel(activeClip, { source: 'director', trigger });
  };

  return (
    <section
      ref={sectionRef}
      id="reel-director"
      className="reel-director dark"
      data-webgl={webglEnabled || undefined}
    >
      {webglEnabled ? (
        <div className="reel-director__sticky">
          <div className="reel-director__canvas" aria-hidden="true">
            {nearViewport ? (
              <Suspense fallback={<div className="reel-director__loading" />}>
                <SpatialReelDirectorThree
                  sectionRef={sectionRef}
                  onActiveChange={setActiveIndex}
                  onWebglFailure={handleWebglFailure}
                />
              </Suspense>
            ) : null}
          </div>

          <div className="reel-director__scrim" aria-hidden="true" />
          <div className="reel-director__copy">
            <div>
              <p className="reel-director__eyebrow">{t('director.eyebrow')}</p>
              <h2>{t('director.title')}</h2>
            </div>
            <div className="reel-director__chapter" key={activeChapter.clipId}>
              <div className="reel-director__counter">
                <span>{String(activeIndex + 1).padStart(2, '0')}</span>
                <span className="reel-director__counter-line" />
                <span>{String(DIRECTOR_CHAPTERS.length).padStart(2, '0')}</span>
              </div>
              <p className="reel-director__label">{t(activeChapter.labelKey)}</p>
              <p className="reel-director__statement">{t(activeChapter.statementKey)}</p>
              <button type="button" className="reel-director__play" onClick={(event) => openActive(event.currentTarget)}>
                <Play className="h-3.5 w-3.5 fill-current" />
                {t('director.play')}
              </button>
            </div>
          </div>
          <p className="reel-director__hint">{t('director.hint')}</p>
        </div>
      ) : (
        <div className="reel-director__fallback">
          <div className="reel-director__fallback-header">
            <p className="reel-director__eyebrow">{t('director.eyebrow')}</p>
            <h2>{t('director.title')}</h2>
            <p>{t('director.fallbackIntro')}</p>
          </div>
          <div className="reel-director__fallback-list">
            {DIRECTOR_CHAPTERS.map((chapter, index) => {
              const clip = DIRECTOR_CLIPS[index];
              const poster = getBestPosterSrc(clip);
              return (
                <button
                  key={chapter.clipId}
                  type="button"
                  className="reel-director__fallback-card"
                  onClick={(event) => {
                    openReel(clip, { source: 'director', trigger: event.currentTarget });
                  }}
                >
                  <div className="reel-director__fallback-media">
                    <img src={poster} alt="" />
                    {index === 0 && fallbackPreviewEnabled ? (
                      <AutoplayPreviewVideo
                        src={clip.previewSrc}
                        poster={poster}
                        className="absolute inset-0 h-full w-full object-cover"
                        playbackPriority="preview"
                        loadStrategy="visible"
                        rootMargin="160px 0px"
                      />
                    ) : null}
                    <span className="reel-director__fallback-play"><Play className="h-4 w-4 fill-current" /></span>
                  </div>
                  <span className="reel-director__fallback-index">{String(index + 1).padStart(2, '0')}</span>
                  <span>
                    <strong>{t(chapter.labelKey)}</strong>
                    <small>{t(chapter.statementKey)}</small>
                  </span>
                  <ArrowUpRight className="ml-auto h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default SpatialReelDirector;
