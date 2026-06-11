import { useRef, type MouseEvent } from 'react';
import { track } from '@vercel/analytics/react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import PretextLineReveal from '@/components/motion/PretextLineReveal';
import CinematicHeroStage from '@/components/CinematicHeroStage';
import HeroStoryStack from '@/components/HeroStoryStack';
import { isMobileViewport, toggleContactDock } from '@/lib/contact-dock';
import { useIsMobile } from '@/hooks/use-mobile';
import { getLocaleFromPath } from '@/lib/locale-path';
import { DIRECTOR_CLIPS } from '@/data/director-chapters';
import { getBestPosterSrc } from '@/data/portfolio-clips';

interface HeroProps {
  showIntroduction?: boolean;
}

const introItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

const Hero = ({ showIntroduction = true }: HeroProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const locale = typeof window === 'undefined' ? 'es' : getLocaleFromPath(window.location.pathname);
  const copyRef = useRef<HTMLDivElement>(null);
  const mobileClips = DIRECTOR_CLIPS.slice(0, 4);
  const ambientClip = DIRECTOR_CLIPS[0];

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('[data-hero-reveal]', {
        y: 24,
        opacity: 0,
        duration: 0.95,
        stagger: 0.09,
        ease: 'power4.out',
        delay: 0.12,
      });
    });
    return () => media.revert();
  }, { scope: copyRef });

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
        {/* Curated campaign edit. Desktop uses GSAP-directed frames; mobile
            preserves a decoder-light story stack. */}
        <div
          className="hero-stage max-md:!top-[calc(env(safe-area-inset-top,0px)+5rem)] max-md:right-0 max-md:bottom-0 max-md:left-0"
          aria-hidden="true"
        >
          {isMobile ? (
            <>
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
              <div className="hero-deck-wrap"><HeroStoryStack clips={mobileClips} /></div>
            </>
          ) : <CinematicHeroStage />}
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
            <div ref={copyRef} className="hero-enter max-w-2xl">
              {/* ── Identity: the serif name is the brand; the role reads as
                  a refined byline beneath it (no avatar — she is already on
                  screen in the reels) ── */}
              <h1 data-hero-reveal className="mb-3 md:mb-4 font-serif leading-[0.86] tracking-tight-serif text-foreground max-md:text-[2.85rem] md:text-[5.5rem] lg:text-[7rem] xl:text-[8.5rem]">
                <span className="block">Gisela</span>
                <span className="block font-light italic">Saldarriaga</span>
              </h1>

              <div data-hero-reveal className="mb-4 md:mb-6 flex items-center gap-2.5">
                <span className="h-px w-7 bg-primary/90" aria-hidden="true" />
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-prestige text-foreground/60">
                  {roleLabel}
                </span>
              </div>

              <p data-hero-reveal className="mb-7 md:mb-9 max-w-lg text-[0.95rem] md:text-xl font-light leading-relaxed md:leading-snug text-foreground/75 md:text-foreground/80">
                {t('hero.subtitle')}
              </p>

              {/* ── One primary action; Contactar joins inline on desktop ── */}
              <div data-hero-reveal className="flex items-center gap-3">
                <a
                  href="#reel-director"
                  onClick={(event) => handleHashLinkClick(event, () => track('Hero Explore Click'))}
                  className="btn-primary-nordic btn-primary-nordic--lg max-md:w-full"
                >
                  <ArrowDownRight className="h-3.5 w-3.5" />
                  {t('hero.buttonPortfolio')}
                </a>
                <a
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
              <div data-hero-reveal className="mt-6 md:mt-9 flex items-center justify-between gap-4 border-t border-foreground/15 pt-4 md:pt-5 md:justify-start max-md:pr-14">
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
