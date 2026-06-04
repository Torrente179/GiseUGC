import { useMemo, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import PretextLineReveal from '@/components/motion/PretextLineReveal';
import HeroWallTile from '@/components/HeroWallTile';
import { isMobileViewport, toggleContactDock } from '@/lib/contact-dock';
import { useIsMobile } from '@/hooks/use-mobile';
import { getLocaleFromPath } from '@/lib/locale-path';
import { LEGACY_REEL_CLIPS, type ReelClip } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';

interface HeroProps {
  showIntroduction?: boolean;
}

const N_COLS = 5;
const TILES_PER_COL = 4;
const COL_MODS = ['', 'hero-wall-down', 'hero-wall-slow', 'hero-wall-down hero-wall-slow', ''];
// Mobile shows 2 columns, tablet 3, desktop 5.
const COL_VIS = ['flex', 'flex', 'hidden sm:flex', 'hidden lg:flex', 'hidden lg:flex'];

// Full catalog — rotated daily so the wall cycles through every reel.
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

const introItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const Hero = ({ showIntroduction = true }: HeroProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const locale = typeof window === 'undefined' ? 'es' : getLocaleFromPath(window.location.pathname);

  // Rotate the whole catalog by the UTC day bucket — fresh selection every 24h.
  const utcDayBucket = Math.floor(Date.now() / 86400000);
  const dailyClips = useMemo(() => shuffleWithSeed(ALL_CLIPS, utcDayBucket), [utcDayBucket]);
  const columns = Array.from({ length: N_COLS }, (_, c) =>
    Array.from({ length: TILES_PER_COL }, (_, r) => dailyClips[(c * TILES_PER_COL + r) % dailyClips.length]),
  );

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
    <section id="home" className="relative w-full overflow-hidden bg-background max-md:overflow-hidden">
      {/* Hero viewport is always dark ("black theme"), independent of the global light/dark toggle */}
      <div className="dark relative min-h-[100svh] w-full bg-background text-foreground">
        {/* ─── Living wall of reels ─── */}
        <div
          className="hero-wall max-md:!top-[calc(env(safe-area-inset-top,0px)+5.5rem)] max-md:right-0 max-md:bottom-0 max-md:left-0"
          aria-hidden="true"
        >
          {columns.map((col, c) => {
            const playColumnVideos = !isMobile || c < 2;

            return (
              <div
                key={c}
                className={`${COL_VIS[c]} flex-1 flex-col gap-3 hero-wall-col-anim ${COL_MODS[c]}`}
              >
                {[...col, ...col].map((clip, i) => (
                  <div key={`${clip.id}-${i}`} className="hero-wall-tile">
                    <HeroWallTile clip={clip} playVideo={playColumnVideos} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* ─── Frosted haze + feathered scrim (theme-aware) ─── */}
        <div className="hero-wall-haze" aria-hidden="true" />
        <div className="hero-wall-scrim" aria-hidden="true" />

        {/* ─── Content (visible by default — no JS-gated reveal) ─── */}
        <div className="relative z-10 flex min-h-[100svh] max-md:flex-col max-md:pt-[calc(env(safe-area-inset-top,0px)+5.5rem)] md:items-end">
          <div className="max-md:min-h-[38svh] max-md:flex-1 max-md:shrink-0 md:hidden" aria-hidden="true" />
          <div className="container mx-auto w-full shrink-0 px-6 pb-16 max-md:mt-auto max-md:pb-24 max-md:pt-0 md:px-12 md:pb-24 md:pt-28">
            <div className="hero-enter max-w-2xl">
              <div className="mb-6 flex items-center gap-3">
                <img
                  src="/uploads/gisela-hero-585.jpg"
                  alt=""
                  width="40"
                  height="40"
                  loading="eager"
                  decoding="async"
                  className="h-10 w-10 shrink-0 rounded-full object-cover object-[50%_16%] ring-1 ring-foreground/15"
                />
                <span className="section-label text-foreground/70">{roleLabel}</span>
              </div>

              <h1 className="mb-6 max-md:mb-4 font-serif leading-[0.86] tracking-tight-serif text-foreground max-md:text-[2.85rem] md:text-[5.5rem] lg:text-[7rem] xl:text-[8.5rem]">
                <span className="block">Gisela</span>
                <span className="block font-light italic">Saldarriaga</span>
              </h1>

              <p className="mb-8 max-w-lg text-lg font-light leading-snug text-foreground/80 md:text-xl">
                {t('hero.subtitle')}
              </p>

              <div className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#portfolio"
                  onClick={handleHashLinkClick}
                  className="btn-primary-nordic btn-primary-nordic--lg w-full sm:w-auto"
                >
                  <ArrowDownRight className="h-3.5 w-3.5" />
                  {t('hero.buttonPortfolio')}
                </a>
                <a
                  href="#contact"
                  onClick={handleContactCtaClick}
                  className="btn-surface-nordic btn-surface-nordic--lg w-full sm:w-auto"
                >
                  <ArrowDownRight className="h-3.5 w-3.5" />
                  {t('hero.buttonContact')}
                </a>
              </div>

              <div className="flex items-center gap-3.5 text-foreground/65">
                <span className="font-serif text-2xl font-bold text-foreground">{t('hero.proofValue')}</span>
                <span className="h-4 w-px bg-foreground/25" />
                <span className="text-[10px] font-bold uppercase tracking-prestige">{t('hero.proofCaption')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Introduction (desktop only) ─── */}
      {showIntroduction && (
        <div className="relative z-30 bg-background">
          <m.div
            className="container mx-auto border-t border-border/40 px-6 py-24 md:px-12"
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
