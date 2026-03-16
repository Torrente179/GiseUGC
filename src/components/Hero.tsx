import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Diamond, Sparkles, Zap, ArrowDownRight } from 'lucide-react';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import LiteSplitTextReveal from '@/components/motion/LiteSplitTextReveal';
import { isMobileViewport, toggleContactDock } from '@/lib/contact-dock';
import { premiumEase, easeOutExpo, springSnappy } from '@/components/motion/variants';

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
  const containerRef = useRef<HTMLElement>(null);

  const handleImageLoad = useCallback(() => setHeroImageLoaded(true), []);

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
  
  const yImage = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section ref={containerRef} id="home" className="relative w-full overflow-hidden bg-black">
      {/* ─── 100vh Cinematic Window ─── */}
      <div className="relative min-h-[100svh] w-full flex flex-col justify-end">
        {/* Background Image Layer */}
        <motion.div 
          className="absolute inset-0 z-0 origin-top overflow-hidden lg:flex lg:justify-center"
          style={shouldReduceMotion ? {} : { y: yImage, scale: scaleImage }}
        >
          <picture className="block h-full w-full lg:max-w-[84rem] xl:max-w-[90rem] 2xl:max-w-[94rem]">
            <source
              type="image/webp"
              srcSet="/uploads/gisela-hero-400.webp 400w, /uploads/gisela-hero-585.webp 585w, /uploads/gisela-hero-800.webp 800w, /uploads/gisela-hero-1200.webp 1200w"
              sizes="100vw"
            />
            <img
              src="/uploads/gisela-hero-1200.jpg"
              alt={t('hero.imageAlt')}
              className={`w-full h-full object-cover object-[50%_15%] md:object-[50%_20%] lg:object-[50%_30%] xl:object-[50%_34%] transition-opacity duration-1000 ${heroImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              onLoad={handleImageLoad}
            />
          </picture>
        </motion.div>

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 z-10 cinematic-overlay mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none opacity-80" />

        {/* Content Layer */}
        <motion.div 
          className="container relative z-20 mx-auto px-6 md:px-12 pb-8 md:pb-20 pt-28 md:pt-32 w-full"
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
                  className="flex flex-col gap-3"
                  variants={shouldReduceMotion ? undefined : cinematicItemVariants}
                >
                  <a
                    href="#portfolio"
                    onClick={handleHashLinkClick}
                    className="group inline-flex items-center gap-3 text-white text-xs font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
                  >
                    <span className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center transition-colors group-hover:bg-white group-hover:text-black">
                      <ArrowDownRight className="w-3 h-3" />
                    </span>
                    {t('hero.buttonPortfolio')}
                  </a>
                  <a
                    href="#contact"
                    onClick={handleContactCtaClick}
                    className="group inline-flex items-center gap-3 text-white text-xs font-bold uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
                  >
                    <span className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center transition-colors group-hover:bg-white group-hover:text-black">
                      <ArrowDownRight className="w-3 h-3" />
                    </span>
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
