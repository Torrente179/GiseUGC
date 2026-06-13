import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Play } from 'lucide-react';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import HeroStoryStack from '@/components/HeroStoryStack';
import AdaptiveVideo from '@/components/media/AdaptiveVideo';
import { useConstellationScroll } from '@/hooks/use-constellation-scroll';
import { useMagnetic } from '@/hooks/use-magnetic';
import { shouldEnableRichMotion, whenIdle } from '@/lib/motion/gsap-core';
import { isMobileViewport, toggleContactDock } from '@/lib/contact-dock';
import { useIsMobile } from '@/hooks/use-mobile';
import { getLocaleFromPath } from '@/lib/locale-path';
import { LEGACY_REEL_CLIPS, getBestPosterSrc, type ReelClip } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';

// three.js reel constellation — its own chunk, mounted on idle, desktop only.
const ReelConstellation = lazy(() => import('@/components/three/ReelConstellation'));

// Full catalog — rotated daily so the hero cycles through the reels.
const ALL_CLIPS: ReelClip[] = [...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS];

// Deterministic daily shuffle (mirrors the Portfolio's seeded reshuffle).
const shuffleWithSeed = <T,>(items: T[], seed: number): T[] => {
  const arr = [...items];
  let s = seed % 233280;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const saveDataRequested = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(connection?.saveData);
};

const CONSTELLATION_CLIP_COUNT = 14;
const MOBILE_DECK_COUNT = 4;

const CATEGORY_LABELS: Record<ReelClip['category'], { es: string; en: string }> = {
  fashion: { es: 'moda', en: 'fashion' },
  beauty: { es: 'belleza', en: 'beauty' },
  tech: { es: 'tech', en: 'tech' },
  lifestyle: { es: 'lifestyle', en: 'lifestyle' },
};

const Hero = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const locale = typeof window === 'undefined' ? 'es' : getLocaleFromPath(window.location.pathname);
  const isEs = locale === 'es';

  const sectionRef = useRef<HTMLElement>(null);
  useConstellationScroll(sectionRef, !isMobile);
  const magneticPrimary = useMagnetic<HTMLAnchorElement>();

  // Constellation: desktop, fine pointer, no reduced motion, no save-data —
  // and only once the browser is idle so it never competes with the LCP.
  const [constellationOn, setConstellationOn] = useState(false);
  useEffect(() => {
    if (isMobile || !shouldEnableRichMotion() || saveDataRequested()) return;
    return whenIdle(() => setConstellationOn(true), 2200);
  }, [isMobile]);

  // Rotate the catalog by the UTC day bucket — fresh selection every 24h.
  const utcDayBucket = Math.floor(Date.now() / 86400000);
  const dailyClips = useMemo(() => shuffleWithSeed(ALL_CLIPS, utcDayBucket), [utcDayBucket]);
  const constellationClips = useMemo(
    () => dailyClips.slice(0, CONSTELLATION_CLIP_COUNT),
    [dailyClips],
  );
  const storyClips = useMemo(() => dailyClips.slice(0, MOBILE_DECK_COUNT), [dailyClips]);
  const ambientClip = dailyClips[MOBILE_DECK_COUNT % dailyClips.length] ?? dailyClips[0];
  // The poster's interleaved live card uses a clip the backdrop field doesn't.
  const focusClip = dailyClips[CONSTELLATION_CLIP_COUNT % dailyClips.length] ?? dailyClips[0];
  const ghostClip =
    dailyClips[(CONSTELLATION_CLIP_COUNT + 1) % dailyClips.length] ?? dailyClips[0];

  const year = new Date().getFullYear();
  const focusCategory = CATEGORY_LABELS[focusClip.category][isEs ? 'es' : 'en'];
  const pitch = isEs
    ? 'Contenido que se siente humano — y vende en social.'
    : 'Content that feels human — and sells on social.';
  const creditLines = [
    isEs ? 'Creadora UGC bilingüe — ES / EN' : 'Bilingual UGC creator — ES / EN',
    isEs ? 'Demos · testimonios · portavoz' : 'Demos · testimonials · spokesperson',
    `${t('hero.proofValue')} · ${t('hero.proofCaption')}`,
  ];

  const handleContactCtaClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isMobileViewport()) {
      event.preventDefault();
      toggleContactDock();
      return;
    }
    handleHashLinkClick(event);
  };

  return (
    <section ref={sectionRef} id="home" className="relative w-full bg-background max-md:overflow-hidden">
      {/* Static pin shell — ScrollTrigger re-parents the stage into a
          .pin-spacer inside it, away from any edge React reconciles. */}
      <div>
      <div
        data-hero-viewport
        className="dark relative min-h-[100svh] w-full overflow-hidden bg-background text-foreground md:h-[100svh]"
      >
        {isMobile ? (
          /* ─── Mobile: app-native story stack behind the poster type ─── */
          <div
            className="hero-stage max-md:!top-[calc(env(safe-area-inset-top,0px)+5rem)] max-md:right-0 max-md:bottom-0 max-md:left-0"
            aria-hidden="true"
          >
            <div className="hero-stage-bg">
              <img
                src={getBestPosterSrc(ambientClip)}
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                className="hero-stage-bg-video"
              />
            </div>
            <div className="hero-deck-wrap">
              <HeroStoryStack clips={storyClips} />
            </div>
          </div>
        ) : (
          /* ─── Desktop: deep reel field behind the poster ─── */
          constellationOn && (
            <Suspense fallback={null}>
              <ReelConstellation clips={constellationClips} />
            </Suspense>
          )
        )}

        {/* ─── Readability scrim ─── */}
        {isMobile ? (
          <div className="hero-wall-scrim" aria-hidden="true" />
        ) : (
          <div className="dc-hero-scrim" aria-hidden="true" />
        )}

        {isMobile ? (
          /* ════ Mobile poster: type-led, flow layout ════ */
          <div className="relative z-10 flex min-h-[100svh] max-md:pointer-events-none max-md:flex-col max-md:pt-[calc(env(safe-area-inset-top,0px)+5.5rem)]">
            <div
              className="max-md:min-h-[calc(clamp(10.5rem,46vw,13rem)*1.7778+1rem)] max-md:flex-1 max-md:shrink-0"
              aria-hidden="true"
            />
            <div
              data-hero-identity
              className="container mx-auto w-full shrink-0 px-6 pb-6 max-md:pointer-events-auto max-md:mt-auto"
            >
              <h1 className="dc-name-h1 mb-4">
                <span className="hero-line-mask block">
                  <span className="hero-line dc-name-a block text-[2.8rem]">Gisela</span>
                </span>
                <span className="hero-line-mask block">
                  <span className="hero-line hero-line-late dc-name-b block text-[2.3rem]">Saldarriaga</span>
                </span>
              </h1>

              <p className="hero-cascade-item dc-pitch mb-4 max-w-[20rem] text-[1.05rem]" style={{ '--cascade-i': 0 } as CSSProperties}>
                {pitch}
              </p>

              <div className="hero-cascade-item dc-credits mb-6" style={{ '--cascade-i': 1 } as CSSProperties}>
                {creditLines.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </div>

              <div className="hero-cascade-item flex items-center gap-3 max-md:pr-24" style={{ '--cascade-i': 2 } as CSSProperties}>
                <a
                  href="#portfolio"
                  onClick={handleHashLinkClick}
                  className="dc-cta-primary flex-1 justify-center"
                >
                  {t('hero.buttonPortfolio')}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  onClick={handleContactCtaClick}
                  className="dc-cta-ghost shrink-0"
                >
                  {t('hero.buttonContact')}
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* ════ Desktop poster: "Cartel de estudio" ════ */
          <div data-hero-identity className="absolute inset-0 z-10">
            {/* Corner metadata (clears the fixed navbar) */}
            <div className="hero-cascade-item dc-poster-meta left-12 top-[6.25rem]" style={{ '--cascade-i': 0 } as CSSProperties}>
              Gisela Saldarriaga — {isEs ? 'estudio UGC' : 'UGC studio'}
            </div>
            <div className="hero-cascade-item dc-poster-meta right-12 top-[6.25rem] text-right" style={{ '--cascade-i': 0 } as CSSProperties}>
              Medellín, CO — {year}
            </div>

            {/* The typographic event: name interleaved with the live reel */}
            <div className="dc-name absolute left-12 right-12 top-[16svh]">
              <h1 className="dc-name-h1">
                <span className="dc-name-a">
                  <span className="hero-line-mask block">
                    <span className="hero-line block">Gisela</span>
                  </span>
                </span>
                <span className="dc-name-b">
                  <span className="hero-line-mask block">
                    <span className="hero-line hero-line-late block">Saldarriaga</span>
                  </span>
                </span>
              </h1>

              <div className="dc-hero-card hero-cascade-item" style={{ '--cascade-i': 1 } as CSSProperties}>
                <AdaptiveVideo
                  className="absolute inset-0 h-full w-full object-cover"
                  src={focusClip.previewSrc}
                  hlsSrc={focusClip.previewHlsSrc}
                  poster={getBestPosterSrc(focusClip)}
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  loadStrategy="immediate"
                  rootMargin="0px"
                  pauseOffscreen
                  playbackPriority="hero"
                  aria-hidden="true"
                />
                <span className="dc-reel-chip dc-reel-chip--num">Nº 01</span>
                <span className="dc-hero-card-caption">reel · {focusCategory}</span>
              </div>

              <div className="dc-hero-ghost hero-cascade-item" style={{ '--cascade-i': 3 } as CSSProperties} aria-hidden="true">
                <img src={getBestPosterSrc(ghostClip)} alt="" loading="lazy" decoding="async" />
              </div>
            </div>

            {/* Credits block, lower left */}
            <div className="absolute bottom-12 left-12 max-w-[21rem]">
              <p className="hero-cascade-item dc-pitch mb-4" style={{ '--cascade-i': 2 } as CSSProperties}>
                {pitch}
              </p>
              <div className="hero-cascade-item dc-credits" style={{ '--cascade-i': 3 } as CSSProperties}>
                {creditLines.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </div>
            </div>

            {/* Action cluster, lower right (clears the floating contact dock) */}
            <div className="hero-cascade-item absolute bottom-28 right-12 flex flex-col items-end gap-3.5" style={{ '--cascade-i': 4 } as CSSProperties}>
              <a
                ref={magneticPrimary}
                href="#portfolio"
                onClick={handleHashLinkClick}
                className="dc-cta-primary"
              >
                {isEs ? 'Ver el trabajo' : 'See the work'}
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="#contact"
                onClick={handleContactCtaClick}
                className="dc-cta-ghost"
              >
                {t('hero.buttonContact')}
              </a>
            </div>

            {/* Scroll cue, bottom center */}
            <div className="hero-cascade-item dc-poster-meta bottom-9 left-[42%]" style={{ '--cascade-i': 4 } as CSSProperties}>
              <span className="inline-flex items-center gap-2">
                <Play className="h-3 w-3 rotate-90" aria-hidden="true" />
                {isEs ? 'desplázate' : 'scroll'}
              </span>
            </div>
          </div>
        )}

        {/* Inset poster frame (desktop) */}
        {!isMobile && <div className="dc-poster-frame" aria-hidden="true" />}

        {/* ─── Exit veil: stage fades to ink as the camera clears the field ─── */}
        {!isMobile && (
          <div
            data-hero-exit
            className="pointer-events-none absolute inset-0 z-20 bg-background opacity-0"
            aria-hidden="true"
          />
        )}
      </div>
      </div>
    </section>
  );
};

export default Hero;
