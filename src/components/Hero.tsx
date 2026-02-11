import { useTranslation } from 'react-i18next';
import { Sparkles, Diamond, Zap } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const Hero = () => {
  const { t } = useTranslation();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.2,
      },
    },
  };

  return (
    <section
      id="home"
      className="hero-section relative isolate min-h-[92svh] flex items-center pt-24 md:pt-28 pb-16 md:pb-20 overflow-hidden grain-overlay"
    >
      <div className="hero-ambient absolute inset-0" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="hero-shell grid lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] gap-12 lg:gap-16 items-center">
          <motion.div
            className="order-2 lg:order-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-card/70 px-4 py-2 backdrop-blur-sm"
              variants={itemVariants}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <p className="section-label font-outfit text-muted-foreground/95">{t('hero.subtitle')}</p>
            </motion.div>

            <motion.h1
              className="hero-title text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] text-foreground mt-7 mb-3"
              variants={itemVariants}
            >
              Gisela <span className="text-accent luxury-accent">Saldarriaga</span>
            </motion.h1>

            <motion.p
              className="section-label text-foreground/55 mb-8"
              variants={itemVariants}
            >
              {t('hero.signature')}
            </motion.p>

            <motion.div
              className="w-44 h-px signature-line mb-8"
              variants={itemVariants}
            />

            <motion.p
              className="strategic-body text-foreground/80 text-lg md:text-xl mb-10 max-w-xl"
              variants={itemVariants}
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-5"
              variants={itemVariants}
            >
              <a href="#portfolio" className="btn-primary-nordic px-8 py-3.5 hover-grow btn-press">
                {t('hero.buttonPortfolio')}
              </a>
              <a href="#contact" className="btn-secondary-nordic px-8 py-3.5 hover-grow">
                {t('hero.buttonContact')}
              </a>
            </motion.div>

            <motion.div
              className="mt-10 hidden md:flex md:flex-wrap gap-3"
              variants={itemVariants}
            >
              <div className="hero-chip group">
                <Sparkles className="h-3 w-3 text-accent/70 group-hover:text-accent transition-colors" />
                <span>{t('hero.pillStrategy')}</span>
              </div>
              <div className="hero-chip group">
                <Diamond className="h-3 w-3 text-accent/70 group-hover:text-accent transition-colors" />
                <span>{t('hero.pillAesthetic')}</span>
              </div>
              <div className="hero-chip group">
                <Zap className="h-3 w-3 text-accent/70 group-hover:text-accent transition-colors" />
                <span>{t('hero.pillConversion')}</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="relative w-full max-w-[25rem]">
              <div className="hero-frame-glow absolute -inset-6 pointer-events-none" />
              <div className="hero-image-shell relative overflow-hidden p-3.5 bg-card/95">
                <img
                  src="/uploads/1bceae6e-5154-4d2e-b3fb-2957b86796a7.png"
                  alt={t('hero.imageAlt')}
                  className="w-full aspect-[4/5] object-cover rounded-[1.5rem]"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>

              <motion.div
                className="hero-floating-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              >
                <p className="hero-floating-label">{t('hero.proofLabel')}</p>
                <p className="hero-floating-value">{t('hero.proofValue')}</p>
                <p className="hero-floating-caption">{t('hero.proofCaption')}</p>
              </motion.div>

              <motion.div
                className="hero-corner-tag"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
              >
                <span>{t('hero.tagline')}</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Introduction Section */}
        <motion.div
          className="mt-24 mb-16 pt-16 border-t border-border/40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-start">
            <div className="space-y-6">
              <span className="section-label">{t('hero.introduction.eyebrow')}</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[0.95] tracking-tight-serif">
                {t('hero.introduction.title')}
              </h2>
            </div>
            <div className="lg:pt-20">
              <p className="strategic-body text-foreground/60 text-lg md:text-xl max-w-2xl">
                {t('hero.introduction.description')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
