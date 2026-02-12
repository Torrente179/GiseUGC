import { useTranslation } from 'react-i18next';
import { Film, Lightbulb, Megaphone, PlayCircle, Sparkles, Star } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { revealUp, springHoverTransition, staggerContainer } from '@/components/motion/variants';

const Services = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

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
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.12, 0.04)}
        >
          <div className="text-center md:text-left">
            <motion.p className="section-label text-muted-foreground mb-4" variants={revealUp(14, 0.56)}>
              {t('services.sectionSubtitle')}
            </motion.p>
            <h2 className="studio-title">
              <SplitTextReveal text={t('services.sectionTitle')} delay={0.08} />
            </h2>
          </div>
          <motion.p
            className="studio-subtitle lg:justify-self-end text-center md:text-right max-w-lg"
            variants={revealUp(18, 0.62)}
          >
            {t('services.motionSubtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          className="studio-rule mb-16 md:mb-20"
          initial={{ opacity: 0, scaleX: 0.7 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.68 }}
        />

        <motion.div
          className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer(0.09, 0.03)}
        >
          {serviceData.map((service) => (
            <motion.article
              key={service.titleKey}
              className="group rounded-[1.25rem] md:rounded-[1.5rem] border border-border/70 bg-card/50 p-5 md:p-8 backdrop-blur-md transition-all duration-500 hover:border-primary/30 hover:shadow-xl"
              variants={revealUp(18, 0.58)}
              whileHover={shouldReduceMotion ? undefined : { y: -8, scale: 1.015 }}
              transition={springHoverTransition}
            >
              <motion.div
                className="mb-4 md:mb-6 inline-flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl border border-border/60 bg-background/80 text-primary transition-transform duration-500 group-hover:scale-110"
                whileHover={shouldReduceMotion ? undefined : { rotate: -6, scale: 1.08 }}
                transition={springHoverTransition}
              >
                {service.icon}
              </motion.div>
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
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
