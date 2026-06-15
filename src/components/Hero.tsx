import { useMemo, useRef, type CSSProperties, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import HeroStoryStack from '@/components/HeroStoryStack';
import { useHeroWall } from '@/hooks/use-hero-wall';
import { useMagnetic } from '@/hooks/use-magnetic';
import { isMobileViewport, toggleContactDock } from '@/lib/contact-dock';
import { useIsMobile } from '@/hooks/use-mobile';
import { getLocaleFromPath } from '@/lib/locale-path';
import { LEGACY_REEL_CLIPS, getBestPosterSrc, type ReelClip } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';

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

const WALL_COLUMNS = 5;
const MOBILE_DECK_COUNT = 4;

const Hero = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const locale = typeof window === 'undefined' ? 'es' : getLocaleFromPath(window.location.pathname);
  const isEs = locale === 'es';

  const sectionRef = useRef<HTMLElement>(null);
  useHeroWall(sectionRef, !isMobile);
  const magneticPrimary = useMagnetic<HTMLAnchorElement>();

  // Rotate the catalog by the UTC day bucket — fresh selection every 24h.
  const utcDayBucket = Math.floor(Date.now() / 86400000);
  const dailyClips = useMemo(() => shuffleWithSeed(ALL_CLIPS, utcDayBucket), [utcDayBucket]);
  const storyClips = useMemo(() => dailyClips.slice(0, MOBILE_DECK_COUNT), [dailyClips]);
  const ambientClip = dailyClips[MOBILE_DECK_COUNT % dailyClips.length] ?? dailyClips[0];

  // Deal the catalog column-by-column so each column holds a distinct vertical
  // strip of reels; each strip is doubled in markup for a seamless drift loop.
  const wallColumns = useMemo(() => {
    const cols: ReelClip[][] = Array.from({ length: WALL_COLUMNS }, () => []);
    dailyClips.forEach((clip, i) => cols[i % WALL_COLUMNS].push(clip));
    return cols.map((col) => (col.length >= 3 ? col : [...col, ...col].slice(0, 3)));
  }, [dailyClips]);

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

  // ── Name lockup (shared between mobile flow and desktop overlay) ──
  const nameLockup = (
    <h1 className="dc-name-h1 dc-name-stack">
      <span className="hero-line-mask block">
        <span className="hero-line dc-name-a block">Gisela</span>
      </span>
      <span className="hero-line-mask block">
        <span className="hero-line hero-line-late dc-name-b block">Saldarriaga</span>
      </span>
    </h1>
  );

  return (
    <section ref={sectionRef} id="home" className="relative w-full bg-background max-md:overflow-hidden">
      {/* Hero viewport is always dark ("black theme"), independent of the
          global light/dark toggle. */}
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
          /* ─── Desktop: full-bleed "Muro de trabajo" reel wall ─── */
          <div className="dc-wall" data-hero-wall aria-hidden="true">
            {wallColumns.map((col, ci) => (
              <div key={ci} className="dc-wall-col" data-wall-col>
                <div className="dc-wall-track" data-wall-track>
                  {[...col, ...col].map((clip, ti) => (
                    <img
                      key={`${clip.id}-${ti}`}
                      src={getBestPosterSrc(clip)}
                      alt=""
                      loading={ci < 3 && ti < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="dc-wall-tile"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Readability scrim ─── */}
        <div className={isMobile ? 'hero-wall-scrim' : 'dc-wall-scrim'} aria-hidden="true" />

        {isMobile ? (
          /* ════ Mobile: type-led flow layout ════ */
          <div className="relative z-10 flex min-h-[100svh] max-md:pointer-events-none max-md:flex-col max-md:pt-[calc(env(safe-area-inset-top,0px)+5.5rem)]">
            <div
              className="max-md:min-h-[calc(clamp(10.5rem,46vw,13rem)*1.7778+1rem)] max-md:flex-1 max-md:shrink-0"
              aria-hidden="true"
            />
            <div
              data-hero-identity
              className="hero-mobile-foot container mx-auto w-full shrink-0 px-6 pb-6 max-md:pointer-events-auto max-md:mt-auto"
            >
              {nameLockup}

              <p className="hero-cascade-item dc-pitch mb-4 mt-4 max-w-[20rem] text-[1.05rem]" style={{ '--cascade-i': 0 } as CSSProperties}>
                {pitch}
              </p>

              <div className="hero-cascade-item dc-credits mb-6" style={{ '--cascade-i': 1 } as CSSProperties}>
                {creditLines.map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </div>

              <div className="hero-cascade-item flex items-center gap-3 max-md:pr-24" style={{ '--cascade-i': 2 } as CSSProperties}>
                <a href="#portfolio" onClick={handleHashLinkClick} className="dc-cta-primary flex-1 justify-center">
                  {t('hero.buttonPortfolio')}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a href="#contact" onClick={handleContactCtaClick} className="dc-cta-ghost shrink-0">
                  {t('hero.buttonContact')}
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* ════ Desktop: name + CTAs over the wall ════ */
          <div data-hero-identity className="absolute inset-0 z-10">
            <div className="hero-cascade-item dc-poster-meta left-12 top-[6.25rem]" style={{ '--cascade-i': 0 } as CSSProperties}>
              {isEs ? 'El estudio · Medellín, CO' : 'The studio · Medellín, CO'}
            </div>
            <div className="hero-cascade-item dc-poster-meta right-12 top-[6.25rem] text-right" style={{ '--cascade-i': 0 } as CSSProperties}>
              {t('hero.proofValue')}
            </div>

            <div className="absolute bottom-12 left-12 right-12 flex items-end justify-between gap-8">
              <div className="max-w-[34rem]">
                {nameLockup}
                <p className="hero-cascade-item dc-pitch mb-4 mt-5 max-w-[24rem]" style={{ '--cascade-i': 1 } as CSSProperties}>
                  {pitch}
                </p>
                <div className="hero-cascade-item dc-credits mb-7" style={{ '--cascade-i': 2 } as CSSProperties}>
                  {creditLines.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </div>
                <div className="hero-cascade-item flex items-center gap-5" style={{ '--cascade-i': 3 } as CSSProperties}>
                  <a ref={magneticPrimary} href="#portfolio" onClick={handleHashLinkClick} className="dc-cta-primary">
                    {isEs ? 'Ver el trabajo' : 'See the work'}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <a href="#contact" onClick={handleContactCtaClick} className="dc-cta-ghost">
                    {t('hero.buttonContact')}
                  </a>
                </div>
              </div>

              <div className="hero-cascade-item dc-poster-meta mb-2 hidden shrink-0 lg:block" style={{ '--cascade-i': 4 } as CSSProperties}>
                {isEs ? 'desliza para ver el trabajo' : 'scroll to see the work'}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
