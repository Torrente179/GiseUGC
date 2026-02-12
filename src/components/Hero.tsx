import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Diamond, Sparkles, Zap } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { revealUp, springHoverTransition, staggerContainer } from '@/components/motion/variants';

const Hero = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const heroImageY = useSpring(useTransform(scrollYProgress, [0, 1], [46, -46]), {
    stiffness: 110,
    damping: 24,
    mass: 0.7,
  });
  const heroImageRotate = useSpring(useTransform(scrollYProgress, [0, 1], [-1.4, 1.4]), {
    stiffness: 100,
    damping: 22,
    mass: 0.8,
  });
  const floatingCardY = useSpring(useTransform(scrollYProgress, [0, 1], [22, -26]), {
    stiffness: 120,
    damping: 24,
    mass: 0.65,
  });
  const cornerTagY = useSpring(useTransform(scrollYProgress, [0, 1], [14, -20]), {
    stiffness: 130,
    damping: 25,
    mass: 0.65,
  });

  const heroPills = [
    { icon: Sparkles, labelKey: 'hero.pillStrategy' },
    { icon: Diamond, labelKey: 'hero.pillAesthetic' },
    { icon: Zap, labelKey: 'hero.pillConversion' },
  ];

  return (
    <section
      ref={sectionRef}
      id="home"
      className="hero-section relative isolate min-h-[92svh] flex items-center pt-24 md:pt-28 pb-16 md:pb-20 overflow-hidden grain-overlay"
    >
      <div className="hero-ambient absolute inset-0" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="hero-shell grid lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] gap-12 lg:gap-16 items-center">
          <motion.div
            className="order-2 lg:order-1"
            variants={staggerContainer(0.12, 0.05)}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={revealUp(16, 0.58)}
              className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-card/70 px-4 py-2 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <p className="section-label font-outfit text-muted-foreground/95">{t('hero.subtitle')}</p>
            </motion.div>

            <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] text-foreground mt-7 mb-3">
              <SplitTextReveal text="Gisela" delay={0.1} />{' '}
              <span className="text-accent luxury-accent inline-block align-baseline">
                <SplitTextReveal text="Saldarriaga" delay={0.22} />
              </span>
            </h1>

            <motion.p className="section-label text-foreground/55 mb-8" variants={revealUp(14, 0.6)}>
              {t('hero.signature')}
            </motion.p>

            <motion.div className="w-44 h-px signature-line mb-8" variants={revealUp(10, 0.54)} />

            <motion.p
              className="strategic-body text-foreground/80 text-lg md:text-xl mb-10 max-w-xl"
              variants={revealUp(18, 0.66)}
            >
              {t('hero.description')}
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 sm:gap-5" variants={revealUp(16, 0.6)}>
              <motion.a
                href="#portfolio"
                className="btn-primary-nordic px-8 py-3.5"
                whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={springHoverTransition}
              >
                {t('hero.buttonPortfolio')}
              </motion.a>
              <motion.a
                href="#contact"
                className="btn-secondary-nordic px-8 py-3.5"
                whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={springHoverTransition}
              >
                {t('hero.buttonContact')}
              </motion.a>
            </motion.div>

            <motion.div className="mt-10 hidden md:flex md:flex-wrap gap-3" variants={revealUp(20, 0.66)}>
              {heroPills.map(({ icon: Icon, labelKey }) => (
                <motion.div
                  key={labelKey}
                  className="hero-chip group"
                  whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.025 }}
                  transition={springHoverTransition}
                >
                  <Icon className="h-3 w-3 text-accent/70 group-hover:text-accent transition-colors" />
                  <span>{t(labelKey)}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
            variants={revealUp(30, 0.8, 0.15)}
            initial="hidden"
            animate="visible"
            style={
              shouldReduceMotion
                ? undefined
                : {
                  y: heroImageY,
                  rotate: heroImageRotate,
                }
            }
          >
            <div className="relative w-full max-w-[25rem]">
              <div className="hero-frame-glow absolute -inset-6 pointer-events-none" />
              <div className="hero-image-shell relative overflow-hidden p-3.5 bg-card/95">
                <img
                  src="/uploads/E3AF5948-F6CB-4DEE-87AE-9383B816D3EC (1).jpg"
                  alt={t('hero.imageAlt')}
                  className="w-full aspect-[4/5] object-cover rounded-[1.5rem]"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>

              <motion.div
                className="hero-floating-card"
                style={
                  shouldReduceMotion
                    ? undefined
                    : {
                      y: floatingCardY,
                    }
                }
              >
                <p className="hero-floating-label">{t('hero.proofLabel')}</p>
                <p className="hero-floating-value">{t('hero.proofValue')}</p>
                <p className="hero-floating-caption">{t('hero.proofCaption')}</p>
              </motion.div>

              <motion.div
                className="hero-corner-tag"
                style={
                  shouldReduceMotion
                    ? undefined
                    : {
                      y: cornerTagY,
                    }
                }
              >
                <span>{t('hero.tagline')}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-24 mb-16 pt-16 border-t border-border/40"
          variants={staggerContainer(0.14, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.28 }}
        >
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
            <div className="space-y-6">
              <motion.span className="section-label" variants={revealUp(14, 0.6)}>
                {t('hero.introduction.eyebrow')}
              </motion.span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[0.95] tracking-tight-serif">
                <SplitTextReveal text={t('hero.introduction.title')} delay={0.08} />
              </h2>
            </div>
            <motion.div className="lg:pt-20" variants={revealUp(18, 0.66)}>
              <p className="strategic-body text-foreground/60 text-lg md:text-xl max-w-2xl">
                {t('hero.introduction.description')}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
