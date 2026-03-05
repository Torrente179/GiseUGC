import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import LiteSplitTextReveal from '@/components/motion/LiteSplitTextReveal';
import { blurRevealUp, revealUp, staggerContainer } from '@/components/motion/variants';
import { MOTION_BUDGETS, useMotionProfile } from '@/components/motion/profile';

const HeroIntroduction = () => {
  const { t } = useTranslation();
  const motionProfile = useMotionProfile();
  const introVariants = motionProfile.blurAllowed
    ? blurRevealUp(18, MOTION_BUDGETS.section)
    : revealUp(18, MOTION_BUDGETS.section);
  const detailVariants = motionProfile.blurAllowed
    ? blurRevealUp(14, MOTION_BUDGETS.section, 0.04)
    : revealUp(14, MOTION_BUDGETS.section, 0.04);

  return (
    <section id="hero-introduction" className="studio-section bg-background pt-10 pb-10">
      <div className="studio-container">
        <motion.div
          className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 md:gap-10 items-start"
          initial={motionProfile.sectionMode === 'none' ? undefined : 'hidden'}
          whileInView={motionProfile.sectionMode === 'none' ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.08, 0.02)}
        >
          <motion.div className="space-y-4" variants={introVariants}>
            <span className="section-label">{t('hero.introduction.eyebrow')}</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-foreground leading-[0.95] tracking-tight-serif">
              {motionProfile.mobile ? (
                t('hero.introduction.title')
              ) : (
                <LiteSplitTextReveal text={t('hero.introduction.title')} delay={0} stagger={0.06} />
              )}
            </h2>
          </motion.div>
          <motion.div className="md:pt-9" variants={detailVariants}>
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
