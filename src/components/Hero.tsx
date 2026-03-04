import { useEffect, useRef, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { Diamond, Sparkles, Zap } from 'lucide-react';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import LiteSplitTextReveal from '@/components/motion/LiteSplitTextReveal';
import { isMobileViewport, toggleContactDock } from '@/lib/contact-dock';
import {
  premiumEase,
  easeOutExpo,
  scaleIn,
  blurRevealUp,
  springSmooth,
  springSnappy,
} from '@/components/motion/variants';

interface HeroProps {
  showIntroduction?: boolean;
}

/* ─── Orchestration variants ─── */

const heroContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

const heroLineVariants = {
  hidden: { opacity: 0, scaleX: 0.3 },
  visible: {
    opacity: 1,
    scaleX: 1,
    transition: { duration: 0.8, ease: premiumEase },
  },
};

const heroImageVariants = scaleIn(0.95, 0.9, 0);

const Hero = ({ showIntroduction = true }: HeroProps) => {
  const { t } = useTranslation();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const floatingCardRef = useRef<HTMLDivElement>(null);
  const cornerTagRef = useRef<HTMLDivElement>(null);

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

  /* ─── Parallax effect (desktop only, scroll-linked) ─── */
  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const floatingCard = floatingCardRef.current;
    const cornerTag = cornerTagRef.current;
    if (!section || !media || !floatingCard || !cornerTag) return;

    const motionReadyTimer = window.setTimeout(() => {
      section.dataset.motion = 'ready';
    }, 220);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

    if (prefersReducedMotion || !isDesktop) {
      media.style.transform = '';
      floatingCard.style.transform = '';
      cornerTag.style.transform = '';
      return () => {
        window.clearTimeout(motionReadyTimer);
        delete section.dataset.motion;
      };
    }

    let sectionTop = 0;
    let sectionHeight = 1;
    let viewportHeight = window.innerHeight;
    let frameId: number | null = null;

    const measure = () => {
      const rect = section.getBoundingClientRect();
      sectionTop = window.scrollY + rect.top;
      sectionHeight = rect.height;
      viewportHeight = window.innerHeight;
    };

    const updateParallax = () => {
      frameId = null;
      const start = sectionTop - viewportHeight;
      const end = sectionTop + sectionHeight;
      const progress = Math.max(0, Math.min(1, (window.scrollY - start) / (end - start)));

      const imageY = 46 - 92 * progress;
      const imageRotate = -1.4 + 2.8 * progress;
      const cardY = 22 - 48 * progress;
      const tagY = 14 - 34 * progress;

      media.style.transform = `translate3d(0, ${imageY.toFixed(2)}px, 0) rotate(${imageRotate.toFixed(2)}deg)`;
      floatingCard.style.transform = `translate3d(0, ${cardY.toFixed(2)}px, 0)`;
      cornerTag.style.transform = `translate3d(0, ${tagY.toFixed(2)}px, 0)`;
    };

    const queueParallaxUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateParallax);
    };

    measure();
    queueParallaxUpdate();

    window.addEventListener('scroll', queueParallaxUpdate, { passive: true });
    window.addEventListener('resize', () => { measure(); queueParallaxUpdate(); });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => { measure(); queueParallaxUpdate(); });
      resizeObserver.observe(section);
    }

    return () => {
      window.clearTimeout(motionReadyTimer);
      window.removeEventListener('scroll', queueParallaxUpdate);
      window.removeEventListener('resize', queueParallaxUpdate);
      resizeObserver?.disconnect();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      media.style.transform = '';
      floatingCard.style.transform = '';
      cornerTag.style.transform = '';
      delete section.dataset.motion;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="hero-section relative isolate min-h-[92svh] flex items-center pt-24 md:pt-28 pb-16 md:pb-20 overflow-hidden grain-overlay"
    >
      <div className="hero-ambient absolute inset-0" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="hero-shell grid lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] gap-12 lg:gap-16 items-center">
          {/* ─── Left Column: Orchestrated Text Content ─── */}
          <motion.div
            className="order-2 lg:order-1"
            initial="hidden"
            animate="visible"
            variants={shouldReduceMotion ? undefined : heroContainerVariants}
          >
            {/* Subtitle badge */}
            <motion.div
              className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-card/70 px-4 py-2 backdrop-blur-sm"
              variants={shouldReduceMotion ? undefined : heroItemVariants}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <p className="section-label font-outfit text-muted-foreground/95">{t('hero.subtitle')}</p>
            </motion.div>

            {/* Name */}
            <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] text-foreground mt-7 mb-3">
              <LiteSplitTextReveal text="Gisela" delay={0.3} stagger={0.09} />{' '}
              <LiteSplitTextReveal text="Saldarriaga" delay={0.4} stagger={0.09} className="text-accent luxury-accent align-baseline" />
            </h1>

            {/* Signature */}
            <motion.p
              className="section-label text-foreground/55 mb-8"
              variants={shouldReduceMotion ? undefined : heroItemVariants}
            >
              {t('hero.signature')}
            </motion.p>

            <motion.div
              className="w-44 h-px signature-line mb-8 origin-left"
              variants={shouldReduceMotion ? undefined : heroLineVariants}
            />

            {/* Description */}
            <motion.p
              className="strategic-body text-foreground/80 text-lg md:text-xl mb-10 max-w-xl"
              variants={shouldReduceMotion ? undefined : heroItemVariants}
            >
              {t('hero.description')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="hidden md:flex flex-col sm:flex-row gap-4 sm:gap-5"
              variants={shouldReduceMotion ? undefined : heroItemVariants}
            >
              <motion.a
                href="#portfolio"
                onClick={handleHashLinkClick}
                className="btn-primary-nordic btn-shimmer px-8 py-3.5"
                whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                transition={springSnappy}
              >
                {t('hero.buttonPortfolio')}
              </motion.a>
              <motion.a
                href="#contact"
                onClick={handleContactCtaClick}
                className="btn-primary-nordic btn-shimmer px-8 py-3.5"
                whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                transition={springSnappy}
              >
                {t('hero.buttonContact')}
              </motion.a>
            </motion.div>

            {/* Pills */}
            <motion.div
              className="mt-10 hidden md:flex md:flex-wrap gap-3"
              variants={shouldReduceMotion ? undefined : heroItemVariants}
            >
              {heroPills.map(({ icon: Icon, labelKey }) => (
                <motion.div
                  key={labelKey}
                  className="hero-chip group"
                  whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.03 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                  transition={springSmooth}
                >
                  <Icon className="h-3 w-3 text-accent/70 group-hover:text-accent transition-colors" />
                  <span>{t(labelKey)}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ─── Right Column: Hero Image ─── */}
          <motion.div
            ref={mediaRef}
            className="order-1 lg:order-2 flex justify-center lg:justify-end hero-parallax-media"
            initial="hidden"
            animate="visible"
            variants={shouldReduceMotion ? undefined : heroImageVariants}
          >
            <div className="relative w-full max-w-[25rem]">
              <div className="hero-frame-glow absolute -inset-6 pointer-events-none" />
              <div className="hero-image-shell relative overflow-hidden p-3.5 bg-card/95">
                <picture>
                  <source
                    type="image/webp"
                    srcSet="/uploads/gisela-hero-400.webp 400w, /uploads/gisela-hero-585.webp 585w, /uploads/gisela-hero-640.webp 640w, /uploads/gisela-hero-800.webp 800w, /uploads/gisela-hero-1200.webp 1200w"
                    sizes="(min-width: 1280px) 400px, (min-width: 1024px) 380px, (min-width: 768px) 43vw, 76vw"
                  />
                  <img
                    src="/uploads/gisela-hero-585.jpg"
                    alt={t('hero.imageAlt')}
                    className="w-full aspect-[4/5] object-cover rounded-[1.5rem]"
                    width={585}
                    height={731}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                </picture>
              </div>

              <div ref={floatingCardRef} className="hero-floating-card hero-parallax-floating-card">
                <p className="hero-floating-label">{t('hero.proofLabel')}</p>
                <p className="hero-floating-value">{t('hero.proofValue')}</p>
                <p className="hero-floating-caption">{t('hero.proofCaption')}</p>
              </div>

              <div ref={cornerTagRef} className="hero-corner-tag hero-parallax-corner-tag">
                <span>{t('hero.tagline')}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Introduction (desktop only, below hero) ─── */}
        {showIntroduction && (
          <motion.div
            className="mt-24 mb-16 pt-16 border-t border-border/40"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
            }}
          >
            <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
              <motion.div className="space-y-6" variants={blurRevealUp()}>
                <span className="section-label">{t('hero.introduction.eyebrow')}</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[0.95] tracking-tight-serif">
                  <LiteSplitTextReveal text={t('hero.introduction.title')} delay={0} stagger={0.07} />
                </h2>
              </motion.div>
              <motion.div className="lg:pt-20" variants={blurRevealUp(20, 0.8, 0.15)}>
                <p className="strategic-body text-foreground/60 text-lg md:text-xl max-w-2xl">
                  {t('hero.introduction.description')}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Hero;
