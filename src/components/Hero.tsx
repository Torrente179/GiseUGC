import { lazy, Suspense, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import PretextLineReveal from '@/components/motion/PretextLineReveal';
import HeroReelDeck from '@/components/HeroReelDeck';
import HeroStoryStack from '@/components/HeroStoryStack';
import { useHeroMotion } from '@/hooks/use-hero-motion';
import { useMagnetic } from '@/hooks/use-magnetic';
import { shouldEnableRichMotion, whenIdle } from '@/lib/motion/gsap-core';
import { isMobileViewport, toggleContactDock } from '@/lib/contact-dock';
import { useIsMobile } from '@/hooks/use-mobile';
import { getLocaleFromPath } from '@/lib/locale-path';
import { LEGACY_REEL_CLIPS, getBestPosterSrc, type ReelClip } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';

// three.js silk backdrop — its own chunk, mounted on idle, desktop only.
const HeroAtmosphere = lazy(() => import('@/components/three/HeroAtmosphere'));

interface HeroProps {
  showIntroduction?: boolean;
}

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

const introItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const Hero = ({ showIntroduction = true }: HeroProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const locale = typeof window === 'undefined' ? 'es' : getLocaleFromPath(window.location.pathname);

  const sectionRef = useRef<HTMLElement>(null);
  useHeroMotion(sectionRef);
  const magneticPrimary = useMagnetic<HTMLAnchorElement>();
  const magneticSecondary = useMagnetic<HTMLAnchorElement>(0.18);

  // Silk atmosphere: desktop, fine pointer, no reduced motion, no save-data —
  // and only once the browser is idle so it never competes with the LCP.
  const [atmosphereOn, setAtmosphereOn] = useState(false);
  useEffect(() => {
    if (isMobile || !shouldEnableRichMotion() || saveDataRequested()) return;
    return whenIdle(() => setAtmosphereOn(true), 2400);
  }, [isMobile]);

  // Rotate the catalog by the UTC day bucket — fresh selection every 24h.
  const utcDayBucket = Math.floor(Date.now() / 86400000);
  const dailyClips = useMemo(() => shuffleWithSeed(ALL_CLIPS, utcDayBucket), [utcDayBucket]);
  // Rotating "ramillete" of reel cards — the focus auto-cycles through the deck.
  // Only the focused card decodes video, so it stays light on every device.
  const deckCount = isMobile ? 4 : 6;
  const deckClips = useMemo(() => dailyClips.slice(0, deckCount), [dailyClips, deckCount]);
  const ambientClip = dailyClips[deckCount % dailyClips.length] ?? dailyClips[0];

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

  return (
    <section ref={sectionRef} id="home" className="relative w-full bg-background max-md:overflow-hidden">
      {/* Pin zone: on desktop the dark stage stays pinned while the light
          surface ("curtain") slides over it — 50svh of cinematic handoff */}
      <div className={showIntroduction ? 'md:h-[150svh]' : undefined}>
        {/* Hero viewport is always dark ("black theme"), independent of the global light/dark toggle */}
        <div
          data-hero-viewport
          className="dark relative min-h-[100svh] w-full overflow-hidden bg-background text-foreground md:sticky md:top-0 md:h-[100svh]"
        >
          {/* ─── Curated reel showcase (a few large reels, all playing) ─── */}
          <div
            className="hero-stage max-md:!top-[calc(env(safe-area-inset-top,0px)+5rem)] max-md:right-0 max-md:bottom-0 max-md:left-0"
            aria-hidden="true"
          >
            {/* Backdrop: blurred poster paints instantly; on capable desktops
                the WebGL silk fades in over it as the living atmosphere */}
            <div className="hero-stage-bg">
              <img
                src={getBestPosterSrc(ambientClip)}
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                className="hero-stage-bg-video"
              />
              {atmosphereOn && (
                <Suspense fallback={null}>
                  <HeroAtmosphere />
                </Suspense>
              )}
            </div>
            {/* Reels: desktop fans a 3D "ramillete"; mobile gets an app-native
                story stack (centered card, edge peek, segmented progress) */}
            <div className="hero-deck-wrap" data-hero-deck>
              {isMobile ? (
                <HeroStoryStack clips={deckClips} />
              ) : (
                <HeroReelDeck clips={deckClips} fan={3} />
              )}
            </div>
          </div>

          {/* ─── Frosted haze + feathered scrim (theme-aware) ─── */}
          <div className="hero-wall-haze" aria-hidden="true" />
          <div className="hero-wall-scrim" aria-hidden="true" />

          {/* ─── Content (visible by default — no JS-gated reveal) ───
              Mobile: wrapper lets touches pass through to the story stack;
              the inner container re-enables them so CTAs stay tappable */}
          <div className="relative z-10 flex min-h-[100svh] max-md:pointer-events-none max-md:flex-col max-md:pt-[calc(env(safe-area-inset-top,0px)+5.5rem)] md:h-full md:items-end">
            {/* Spacer = story-card height + breathing room, so the text block
                can never collide with the reel card */}
            <div
              className="max-md:min-h-[calc(clamp(10.5rem,46vw,13rem)*1.7778+1.5rem)] max-md:flex-1 max-md:shrink-0 md:hidden"
              aria-hidden="true"
            />
            <div
              data-hero-identity
              className="container mx-auto w-full shrink-0 px-6 pb-16 max-md:pointer-events-auto max-md:mt-auto max-md:pb-6 max-md:pt-0 md:px-12 md:pb-24 md:pt-28"
            >
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
            </div>
          </div>

          {/* ─── Recede grade: GSAP dims the stage while the curtain covers it ─── */}
          <div data-hero-dim className="pointer-events-none absolute inset-0 z-20 bg-black opacity-0" aria-hidden="true" />
        </div>
      </div>

      {/* ─── Introduction (desktop only) — doubles as the "curtain" surface
          that slides over the pinned dark stage ─── */}
      {showIntroduction && (
        <div
          data-hero-curtain
          className="relative z-30 bg-background md:-mt-[50svh] md:rounded-t-[2.75rem] md:shadow-[0_-32px_70px_-48px_rgba(0,0,0,0.55)]"
        >
          <m.div
            className="container mx-auto border-t border-border/40 px-6 py-24 md:border-t-0 md:px-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }}
          >
            <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 xl:gap-20">
              <m.div className="max-w-[50rem] space-y-6" variants={introItem}>
                <span className="section-label">{t('hero.introduction.eyebrow')}</span>
                <h2 className="type-marketing-display max-w-[22ch] text-[1.65rem] leading-[1.14] tracking-tight-marketing sm:text-[1.85rem] md:text-[2rem] lg:text-[2.1rem]">
                  <PretextLineReveal text={t('hero.introduction.title')} delay={0} stagger={0.1} className="block" />
                </h2>
              </m.div>
              <m.div className="lg:pt-14 xl:pt-16" variants={introItem}>
                <p className="strategic-body max-w-[35rem] text-[1.18rem] font-normal leading-[1.58] text-foreground/72 md:text-[1.3rem]">
                  {t('hero.introduction.description')}
                </p>
              </m.div>
            </div>
          </m.div>
        </div>
      )}
    </section>
  );
};

export default Hero;
