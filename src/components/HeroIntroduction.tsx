import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import PretextLineReveal from '@/components/motion/PretextLineReveal';
import { blurRevealUp, staggerContainer } from '@/components/motion/variants';

const HeroIntroduction = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="hero-introduction" className="studio-section bg-background pt-10 pb-10">
      <div className="studio-container">
        <motion.div
          className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 md:gap-10 items-start"
          initial={shouldReduceMotion ? undefined : 'hidden'}
          whileInView={shouldReduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.14, 0.06)}
        >
          <motion.div className="space-y-4" variants={blurRevealUp(18, 0.62)}>
            <span className="section-label">{t('hero.introduction.eyebrow')}</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-foreground leading-[0.95] tracking-tight-serif text-balance">
              <PretextLineReveal text={t('hero.introduction.title')} delay={0} stagger={0.1} className="block" />
            </h2>
          </motion.div>
          <motion.div className="md:pt-9" variants={blurRevealUp(16, 0.68, 0.1)}>
            <p className="strategic-body text-foreground/60 text-base sm:text-lg">
              {t('hero.introduction.description')}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroIntroduction;
