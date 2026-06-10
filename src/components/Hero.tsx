import { useMemo, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import PretextLineReveal from '@/components/motion/PretextLineReveal';
import AutoplayPreviewVideo from '@/components/media/AutoplayPreviewVideo';
import HeroReelDeck from '@/components/HeroReelDeck';
import HeroStoryStack from '@/components/HeroStoryStack';
import { isMobileViewport, toggleContactDock } from '@/lib/contact-dock';
import { useIsMobile } from '@/hooks/use-mobile';
import { getLocaleFromPath } from '@/lib/locale-path';
import { LEGACY_REEL_CLIPS, getBestPosterSrc, type ReelClip } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';

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

const introItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const Hero = ({ showIntroduction = true }: HeroProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const locale = typeof window === 'undefined' ? 'es' : getLocaleFromPath(window.location.pathname);

  // Rotate the catalog by the UTC day bucket — fresh selection every 24h.
  const utcDayBucket = Math.floor(Date.now() / 86400000);
  const dailyClips = useMemo(() => shuffleWithSeed(ALL_CLIPS, utcDayBucket), [utcDayBucket]);
  // Rotating "ramillete" of reel cards — the focus auto-cycles through the deck.
  // Only the focused card decodes video, so it stays light on every device.
  // A separate clip is the blurred atmospheric backdrop.
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
    <section id="home" className="relative w-full overflow-hidden bg-background max-md:overflow-hidden">
      {/* Hero viewport is always dark ("black theme"), independent of the global light/dark toggle */}
      <div className="dark relative min-h-[100svh] w-full bg-background text-foreground">
        {/* ─── Curated reel showcase (a few large reels, all playing) ─── */}
        <div
          className="hero-stage max-md:!top-[calc(env(safe-area-inset-top,0px)+5rem)] max-md:right-0 max-md:bottom-0 max-md:left-0"
          aria-hidden="true"
        >
          {/* Atmospheric blurred backdrop — poster-only on mobile so the story
              card keeps the playback budget's only decoder slot */}
          <div className="hero-stage-bg">
            {isMobile ? (
              <img
                src={getBestPosterSrc(ambientClip)}
                alt=""
                aria-hidden="true"
                loading="eager"
                decoding="async"
                className="hero-stage-bg-video"
              />
            ) : (
              <AutoplayPreviewVideo
                src={ambientClip.previewSrc}
                hlsSrc={ambientClip.hlsSrc}
                poster={getBestPosterSrc(ambientClip)}
                className="hero-stage-bg-video"
                preload="metadata"
                playbackPriority="background"
                loadStrategy="immediate"
                rootMargin="0px"
              />
            )}
          </div>
          {/* Reels: desktop fans a 3D "ramillete"; mobile gets an app-native
              story stack (centered card, edge peek, segmented progress) */}
          <div className="hero-deck-wrap">
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
        <div className="relative z-10 flex min-h-[100svh] max-md:pointer-events-none max-md:flex-col max-md:pt-[calc(env(safe-area-inset-top,0px)+5.5rem)] md:items-end">
          {/* Spacer = story-card height + breathing room, so the text block
              can never collide with the reel card */}
          <div
            className="max-md:min-h-[calc(clamp(10.5rem,46vw,13rem)*1.7778+1.5rem)] max-md:flex-1 max-md:shrink-0 md:hidden"
            aria-hidden="true"
          />
          <div className="container mx-auto w-full shrink-0 px-6 pb-16 max-md:pointer-events-auto max-md:mt-auto max-md:pb-6 max-md:pt-0 md:px-12 md:pb-24 md:pt-28">
            <div className="hero-enter max-w-2xl">
              <div className="mb-6 max-md:mb-3 flex items-center gap-3">
                {/* Desktop only — on mobile she's already on screen in the reel,
                    so the avatar would be a duplicate */}
                <img
                  src="/uploads/gisela-hero-585.jpg"
                  alt=""
                  width="40"
                  height="40"
                  loading="eager"
                  decoding="async"
                  className="h-10 w-10 max-md:hidden shrink-0 rounded-full object-cover object-[50%_16%] ring-1 ring-foreground/15"
                />
                <span className="section-label text-foreground/70">{roleLabel}</span>
              </div>

              <h1 className="mb-6 max-md:mb-4 font-serif leading-[0.86] tracking-tight-serif text-foreground max-md:text-[2.85rem] md:text-[5.5rem] lg:text-[7rem] xl:text-[8.5rem]">
                <span className="block">Gisela</span>
                <span className="block font-light italic">Saldarriaga</span>
              </h1>

              <p className="mb-8 max-md:mb-5 max-w-lg text-lg max-md:text-base font-light leading-snug text-foreground/80 md:text-xl">
                {t('hero.subtitle')}
              </p>

              <div className="mb-9 max-md:mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
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

              {/* pr clears the floating contact bubble on small screens */}
              <div className="flex items-center gap-3.5 text-foreground/65 max-md:pr-14">
                <span className="font-serif text-2xl font-bold text-foreground whitespace-nowrap">{t('hero.proofValue')}</span>
                <span className="h-4 w-px shrink-0 bg-foreground/25" />
                <span className="text-[10px] font-bold uppercase tracking-prestige max-md:leading-[1.5]">{t('hero.proofCaption')}</span>
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
