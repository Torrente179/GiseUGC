import { useTranslation } from 'react-i18next';
import { Film, Lightbulb, Megaphone, PlayCircle, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { blurRevealUp, revealUp, staggerContainer } from '@/components/motion/variants';
import { MOTION_BUDGETS, useMotionProfile } from '@/components/motion/profile';

const Services = () => {
  const { t } = useTranslation();
  const motionProfile = useMotionProfile();
  const headerReveal = motionProfile.blurAllowed
    ? blurRevealUp(18, MOTION_BUDGETS.section)
    : revealUp(18, MOTION_BUDGETS.section);
  const bodyReveal = motionProfile.blurAllowed
    ? blurRevealUp(12, MOTION_BUDGETS.section, 0.04)
    : revealUp(12, MOTION_BUDGETS.section, 0.04);

  const serviceData = [
    {
      icon: <Megaphone className="h-8 w-8 text-primary/80" />,
      titleKey: 'services.service1.title',
      subtitleKey: 'services.service1.subtitle',
      descriptionKey: 'services.service1.description',
    },
    {
      icon: <Star className="h-8 w-8 text-primary/80" />,
      titleKey: 'services.service2.title',
      descriptionKey: 'services.service2.description',
    },
    {
      icon: <PlayCircle className="h-8 w-8 text-primary/80" />,
      titleKey: 'services.service3.title',
      subtitleKey: 'services.service3.subtitle',
      descriptionKey: 'services.service3.description',
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary/80" />,
      titleKey: 'services.service4.title',
      subtitleKey: 'services.service4.subtitle',
      descriptionKey: 'services.service4.description',
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary/80" />,
      titleKey: 'services.service5.title',
      subtitleKey: 'services.service5.subtitle',
      descriptionKey: 'services.service5.description',
    },
    {
      icon: <Film className="h-8 w-8 text-primary/80" />,
      titleKey: 'services.service6.title',
      subtitleKey: 'services.service6.subtitle',
      descriptionKey: 'services.service6.description',
    },
  ];

  return (
    <section id="services" className="studio-section bg-background pt-16 md:pt-20">
      <div className="studio-container">
        <motion.div
          className="studio-header mb-12"
          initial={motionProfile.sectionMode === 'none' ? undefined : 'hidden'}
          whileInView={motionProfile.sectionMode === 'none' ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.08, 0.02)}
        >
          <div className="text-center md:text-left">
            <motion.p className="section-label text-muted-foreground mb-4" variants={headerReveal}>
              {t('services.sectionSubtitle')}
            </motion.p>
            <h2 className="studio-title">
              {motionProfile.mobile ? t('services.sectionTitle') : <SplitTextReveal text={t('services.sectionTitle')} delay={0.04} />}
            </h2>
          </div>
          <motion.p
            className="studio-subtitle lg:justify-self-end text-center md:text-right max-w-lg"
            variants={bodyReveal}
          >
            {t('services.motionSubtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          className="studio-rule mb-16 md:mb-20"
          initial={motionProfile.sectionMode === 'none' ? undefined : { opacity: 0, scaleX: 0.7 }}
          whileInView={motionProfile.sectionMode === 'none' ? undefined : { opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: MOTION_BUDGETS.section }}
        />

        <motion.div
          className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3"
          initial={motionProfile.sectionMode === 'none' ? undefined : 'hidden'}
          whileInView={motionProfile.sectionMode === 'none' ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.2 }}
          variants={revealUp(16, MOTION_BUDGETS.section)}
        >
          {serviceData.map((service) => (
            <article
              key={service.titleKey}
              className="group rounded-[1.25rem] border border-border/70 bg-card/70 p-5 transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_18px_34px_-28px_hsl(var(--foreground)/0.45)] md:rounded-[1.5rem] md:p-8"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background text-primary transition-transform duration-200 group-hover:scale-105 md:mb-6 md:h-14 md:w-14 md:rounded-2xl">
                {service.icon}
              </div>
              <h3 className="text-lg md:text-2xl font-sans font-medium tracking-tight text-foreground mb-1 leading-tight">
                {t(service.titleKey)}
              </h3>
              {service.subtitleKey && (
                <p className="text-sm md:text-base text-muted-foreground/70 mb-3 md:mb-4 italic">
                  {t(service.subtitleKey)}
                </p>
              )}
              {!service.subtitleKey && <div className="mb-3 md:mb-4" />}
              <p className="strategic-body text-muted-foreground text-sm md:text-base line-clamp-3 md:line-clamp-none">
                {t(service.descriptionKey)}
              </p>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
