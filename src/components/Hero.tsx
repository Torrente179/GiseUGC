import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowDownRight } from 'lucide-react';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import HeroStoryStack from '@/components/HeroStoryStack';
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
/** DOM poster collage: instant paint under the canvas + no-WebGL fallback. */
const FALLBACK_CARD_COUNT = 4;

const Hero = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const locale = typeof window === 'undefined' ? 'es' : getLocaleFromPath(window.location.pathname);

  const sectionRef = useRef<HTMLElement>(null);
  useConstellationScroll(sectionRef, !isMobile);
  const magneticPrimary = useMagnetic<HTMLAnchorElement>();
  const magneticSecondary = useMagnetic<HTMLAnchorElement>(0.18);

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

  const roleLabel = locale === 'es'
    ? 'Creadora UGC bilingüe · Medellín'
    : 'Bilingual UGC creator · Medellín';

  const handleContactCtaClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isMobileViewport()) {
      event.preventDefault();
      toggleContactDock();
      return;
    }
    handleHashLinkClick(event);
  };

  const identityBlock = (
    <div className="hero-cascade max-w-2xl">
      {/* ── Identity: the serif name is the brand; each line rises
          out of its own mask — transform-only, CSS-driven ── */}
      <h1 className="mb-3 md:mb-4 font-serif leading-[0.86] tracking-tight-serif text-foreground max-md:text-[2.85rem] md:text-[5.5rem] lg:text-[7rem] xl:text-[8.5rem]">
        <span className="hero-line-mask block">
          <span className="hero-line block">Gisela</span>
        </span>
        <span className="hero-line-mask block">
          <span className="hero-line hero-line-late block font-light italic">Saldarriaga</span>
        </span>
      </h1>

      <div className="hero-cascade-item mb-4 md:mb-6 flex items-center gap-2.5" style={{ '--cascade-i': 0 } as CSSProperties}>
        <span className="hero-byline-rule h-px w-7 bg-primary/90" aria-hidden="true" />
        <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-prestige text-foreground/60">
          {roleLabel}
        </span>
      </div>

      <p className="hero-cascade-item mb-7 md:mb-9 max-w-lg text-[0.95rem] md:text-xl font-light leading-relaxed md:leading-snug text-foreground/75 md:text-foreground/80" style={{ '--cascade-i': 1 } as CSSProperties}>
        {t('hero.subtitle')}
      </p>

      {/* ── One primary action; Contactar joins inline on desktop ── */}
      <div className="hero-cascade-item flex items-center gap-3" style={{ '--cascade-i': 2 } as CSSProperties}>
        <a
          ref={magneticPrimary}
          href="#portfolio"
          onClick={handleHashLinkClick}
          className="btn-primary-nordic btn-primary-nordic--lg max-md:w-full"
        >
          <ArrowDownRight className="h-3.5 w-3.5" />
          {t('hero.buttonPortfolio')}
        </a>
        <a
          ref={magneticSecondary}
          href="#contact"
          onClick={handleContactCtaClick}
          className="btn-surface-nordic btn-surface-nordic--lg max-md:hidden"
        >
          {t('hero.buttonContact')}
        </a>
      </div>

      {/* ── Footer strip: hairline rule, proof anchored left; on
          mobile a quiet Contactar pill balances the right side
          (pr clears the floating contact bubble) ── */}
      <div className="hero-cascade-item mt-6 md:mt-9 flex items-center justify-between gap-4 border-t border-foreground/15 pt-4 md:pt-5 md:justify-start max-md:pr-14" style={{ '--cascade-i': 3 } as CSSProperties}>
        <div>
          <div className="font-serif text-[1.45rem] md:text-2xl font-bold leading-none text-foreground whitespace-nowrap">
            {t('hero.proofValue')}
          </div>
          <div className="mt-1.5 text-[10px] font-bold uppercase tracking-prestige text-foreground/55">
            {t('hero.proofCaption')}
          </div>
        </div>
        <a
          href="#contact"
          onClick={handleContactCtaClick}
          className="md:hidden inline-flex h-11 shrink-0 items-center rounded-full border border-foreground/25 px-5 text-sm font-medium text-foreground/90 transition-colors duration-200 active:bg-foreground/10"
        >
          {t('hero.buttonContact')}
        </a>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} id="home" className="relative w-full bg-background max-md:overflow-hidden">
      {/* Hero viewport is always dark ("black theme"), independent of the
          global light/dark toggle. On desktop the scroll rig pins this stage
          and flies the constellation camera through the work. The outer div
          is a static pin shell — ScrollTrigger re-parents the stage into a
          .pin-spacer inside it, away from any edge React reconciles. */}
      <div>
      <div
        data-hero-viewport
        className="dark relative min-h-[100svh] w-full overflow-hidden bg-background text-foreground md:h-[100svh]"
      >
        {isMobile ? (
          /* ─── Mobile: app-native story stack (unchanged, approved) ─── */
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
          /* ─── Desktop: reel constellation ───
             DOM poster collage paints instantly (and remains as the
             no-WebGL / reduced-motion fallback); the 3D field fades in
             over it once the browser is idle. */
          <>
            <div className="dc-constellation-fallback" aria-hidden="true">
              {constellationClips.slice(0, FALLBACK_CARD_COUNT).map((clip, index) => (
                <img
                  key={clip.id}
                  src={getBestPosterSrc(clip)}
                  alt=""
                  loading={index < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  className={`dc-fc dc-fc-${index + 1}`}
                />
              ))}
            </div>
            {constellationOn && (
              <Suspense fallback={null}>
                <ReelConstellation clips={constellationClips} />
              </Suspense>
            )}
          </>
        )}

        {/* ─── Readability scrim (mobile keeps its tuned ramp) ─── */}
        {isMobile ? (
          <div className="hero-wall-scrim" aria-hidden="true" />
        ) : (
          <div className="dc-hero-scrim" aria-hidden="true" />
        )}

        {/* ─── Content (visible by default — no JS-gated reveal) ───
            Mobile: wrapper lets touches pass through to the story stack;
            the inner container re-enables them so CTAs stay tappable */}
        <div
          data-hero-identity
          className="relative z-10 flex min-h-[100svh] max-md:pointer-events-none max-md:flex-col max-md:pt-[calc(env(safe-area-inset-top,0px)+5.5rem)] md:h-full md:items-end"
        >
          {/* Spacer = story-card height + breathing room, so the text block
              can never collide with the reel card */}
          <div
            className="max-md:min-h-[calc(clamp(10.5rem,46vw,13rem)*1.7778+1.5rem)] max-md:flex-1 max-md:shrink-0 md:hidden"
            aria-hidden="true"
          />
          <div className="container mx-auto w-full shrink-0 px-6 pb-16 max-md:pointer-events-auto max-md:mt-auto max-md:pb-6 max-md:pt-0 md:px-12 md:pb-24 md:pt-28">
            {identityBlock}
          </div>
        </div>

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
