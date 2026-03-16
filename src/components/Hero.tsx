import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Diamond, Sparkles, Zap, ArrowDownRight, ChevronDown } from 'lucide-react';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import LiteSplitTextReveal from '@/components/motion/LiteSplitTextReveal';
import { isMobileViewport, toggleContactDock } from '@/lib/contact-dock';
import { premiumEase, easeOutExpo, springSnappy } from '@/components/motion/variants';
import { R2_MEDIA_BASE_URL } from '@/data/portfolio-clips';

const HERO_VIDEO_SRC = `${R2_MEDIA_BASE_URL}/videos/previews/ugc-brand-spokesperson-preview.mp4`;
const HERO_VIDEO_POSTER = `${R2_MEDIA_BASE_URL}/videos/posters/ugc-brand-spokesperson-poster.jpg`;

interface HeroProps {
  showIntroduction?: boolean;
}

const cinematicContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const cinematicItemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: easeOutExpo },
    transitionEnd: { filter: 'none' },
  },
};

const cinematicLineVariants = {
  hidden: { opacity: 0, scaleX: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 1.4, ease: premiumEase },
  },
};

const Hero = ({ showIntroduction = true }: HeroProps) => {
  const { t } = useTranslation();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const shouldReduceMotion = useReducedMotion();
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleImageLoad = useCallback(() => setHeroImageLoaded(true), []);

  // Desktop detection for video background (avoid loading video on mobile)
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Auto-play video when ready on desktop
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isDesktop) return;
    video.play().catch(() => {});
  }, [isDesktop, videoReady]);

  const heroPills = [
    { icon: Sparkles, labelKey: 'hero.pillStrategy' },
    { icon: Diamond, labelKey: 'hero.pillAesthetic' },
    { icon: Zap, labelKey: 'hero.pillConversion' },
  ];

  const handleContactCtaClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isMobileViewport()) {
      event.preventDefault();
      toggleContactDock();
      return;
    }
    handleHashLinkClick(event);
  };

  // Parallax effect for the background image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const yImage = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1.05, 1.15]);

  return (
    <section ref={containerRef} id="home" className="relative w-full overflow-hidden bg-black">
      {/* ─── 100vh Cinematic Window ─── */}
      <div className="relative min-h-[100svh] w-full flex flex-col justify-end">
        {/* Background Image Layer (poster / fallback / SEO) */}
        <motion.div
          className="absolute inset-0 z-0 origin-top overflow-hidden"
          style={shouldReduceMotion ? {} : { y: yImage, scale: scaleImage }}
        >
          <picture>
            <source
              type="image/webp"
              srcSet="/uploads/gisela-hero-400.webp 400w, /uploads/gisela-hero-585.webp 585w, /uploads/gisela-hero-800.webp 800w, /uploads/gisela-hero-1200.webp 1200w"
              sizes="100vw"
            />
            <img
              src="/uploads/gisela-hero-1200.jpg"
              alt={t('hero.imageAlt')}
              className={`w-full h-full object-cover object-[50%_15%] md:object-[50%_20%] lg:object-[50%_25%] transition-opacity duration-1000 ${heroImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onLoad={handleImageLoad}
            />
          </picture>
        </motion.div>

        {/* Video Background Layer (desktop only, fades in over photo) */}
        {isDesktop && (
          <motion.div
            className="absolute inset-0 z-[1] origin-top overflow-hidden"
            style={shouldReduceMotion ? {} : { y: yImage, scale: scaleImage }}
            initial={{ opacity: 0 }}
            animate={{ opacity: videoReady ? 1 : 0 }}
            transition={{ duration: 1.8, ease: premiumEase }}
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover object-[50%_25%]"
              muted
              loop
              playsInline
              preload="auto"
              poster={HERO_VIDEO_POSTER}
              onCanPlay={() => setVideoReady(true)}
            >
              <source src={HERO_VIDEO_SRC} type="video/mp4" />
            </video>
          </motion.div>
        )}

        {/* Animated Atmosphere Orbs */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
        </div>

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 z-10 cinematic-overlay mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none opacity-80" />

        {/* Content Layer */}
        <motion.div
          className="container relative z-20 mx-auto px-6 md:px-12 pb-14 md:pb-24 pt-28 md:pt-32 w-full"
          initial="hidden"
          animate="visible"
          variants={shouldReduceMotion ? undefined : cinematicContainerVariants}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12">
            {/* Left side: Typography */}
            <div className="max-w-4xl">
              <motion.div variants={shouldReduceMotion ? undefined : cinematicItemVariants}>
                <p className="font-sans text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-white/70 mb-4 cinematic-subtitle">
                  {t('hero.subtitle')}
                </p>
              </motion.div>

              <h1 className="cinematic-title text-white text-[14vw] sm:text-[5.5rem] md:text-[7rem] lg:text-[8.5rem] xl:text-[9.5rem] -ml-1 md:-ml-2 mb-6">
                <LiteSplitTextReveal text="Gisela" delay={0.2} stagger={0.06} className="block" />
                <LiteSplitTextReveal text="Saldarriaga" delay={0.4} stagger={0.06} className="block text-accent luxury-accent align-baseline" />
              </h1>

              <motion.div
                className="w-24 md:w-40 h-px bg-white/30 my-8 origin-left"
                variants={shouldReduceMotion ? undefined : cinematicLineVariants}
              />

              <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                <motion.p
                  className="font-outfit font-light text-base md:text-lg text-white/80 max-w-sm cinematic-subtitle"
                  variants={shouldReduceMotion ? undefined : cinematicItemVariants}
                >
                  {t('hero.description')}
                </motion.p>

                <motion.div
                  className="flex flex-row sm:flex-col gap-3"
                  variants={shouldReduceMotion ? undefined : cinematicItemVariants}
                >
                  <a
                    href="#portfolio"
                    onClick={handleHashLinkClick}
                    className="btn-shimmer inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-prestige transition-all hover:scale-[1.02] hover:shadow-[0_14px_34px_-8px_rgba(255,255,255,0.25)]"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    {t('hero.buttonPortfolio')}
                  </a>
                  <a
                    href="#contact"
                    onClick={handleContactCtaClick}
                    className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-white/30 text-white text-[10px] font-bold uppercase tracking-prestige transition-all hover:bg-white/10 hover:border-white/50"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    {t('hero.buttonContact')}
                  </a>
                </motion.div>
              </div>
            </div>

            {/* Right side: Floating UI metrics */}
            <motion.div
              className="lg:self-end ultra-glass-panel p-5 sm:p-6 w-full max-w-[280px]"
              variants={shouldReduceMotion ? undefined : cinematicItemVariants}
            >
              <div className="flex flex-col gap-5">
                <div>
                  <p className="font-sans text-[10px] font-bold uppercase tracking-prestige text-white/60">
                    {t('hero.proofLabel')}
                  </p>
                  <p className="mt-2 text-4xl font-serif font-bold tracking-tight text-white">
                    {t('hero.proofValue')}
                  </p>
                  <p className="mt-1 text-xs font-light text-white/70">
                    {t('hero.proofCaption')}
                  </p>
                </div>

                <div className="h-px w-full bg-white/10" />

                <div className="flex flex-wrap gap-2">
                  {heroPills.map(({ icon: Icon, labelKey }, i) => (
                    <div key={i} className="hero-chip-cinematic">
                      <Icon className="w-3 h-3 text-white/70" />
                      <span>{t(labelKey)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.8, ease: premiumEase }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-white/40" />
          </motion.div>
        </motion.div>
      </div>

      {/* ─── Introduction (desktop only, scrolls up naturally) ─── */}
      {showIntroduction && (
        <div className="bg-background relative z-30">
          <motion.div
            className="container mx-auto px-6 md:px-12 py-24 border-t border-border/40"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
            }}
          >
            <div className="grid lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)] gap-12 lg:gap-16 items-start">
              <motion.div className="space-y-6 max-w-[56rem]" variants={cinematicItemVariants}>
                <span className="section-label">{t('hero.introduction.eyebrow')}</span>
                <h2 className="max-w-[12ch] text-4xl md:text-5xl lg:text-[4.5rem] xl:text-[4.9rem] font-serif text-foreground leading-[0.94] tracking-tight-serif">
                  <LiteSplitTextReveal text={t('hero.introduction.title')} delay={0} stagger={0.07} />
                </h2>
              </motion.div>
              <motion.div className="lg:pt-14" variants={cinematicItemVariants}>
                <p className="strategic-body text-foreground/60 text-lg md:text-xl max-w-[34rem]">
                  {t('hero.introduction.description')}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Hero;
