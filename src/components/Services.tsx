import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Film, Globe, Lightbulb, Megaphone, Mic, PlayCircle, Sparkles, Star } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { revealUp, springSmooth, staggerContainer } from '@/components/motion/variants';
import { getLocaleFromPath, getServicePath, type ServicePageId } from '@/lib/locale-path';
import { useIsMobile } from '@/hooks/use-mobile';

const MotionLink = m.create(Link);

const Services = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const locale = typeof window === 'undefined' ? 'es' : getLocaleFromPath(window.location.pathname);
  const servicePageByCard: ServicePageId[] = [
    'ugc-ads-tiktok-meta',
    'ugc-testimonials-reviews',
    'ugc-product-demo',
    'ugc-problem-solution',
    'ugc-lifestyle',
    'ugc-broll-footage',
    'bilingual-ugc-creator',
    'spokesperson-videos',
  ];
  const exploreLabel = locale === 'es' ? 'Ver página' : 'View page';

  const serviceData = [
    {
      icon: <Megaphone className="h-6 w-6 text-primary/70" />,
      titleKey: 'services.service1.title',
      subtitleKey: 'services.service1.subtitle',
      descriptionKey: 'services.service1.description',
    },
    {
      icon: <Star className="h-6 w-6 text-primary/70" />,
      titleKey: 'services.service2.title',
      descriptionKey: 'services.service2.description',
    },
    {
      icon: <PlayCircle className="h-6 w-6 text-primary/70" />,
      titleKey: 'services.service3.title',
      subtitleKey: 'services.service3.subtitle',
      descriptionKey: 'services.service3.description',
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-primary/70" />,
      titleKey: 'services.service4.title',
      subtitleKey: 'services.service4.subtitle',
      descriptionKey: 'services.service4.description',
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary/70" />,
      titleKey: 'services.service5.title',
      subtitleKey: 'services.service5.subtitle',
      descriptionKey: 'services.service5.description',
    },
    {
      icon: <Film className="h-6 w-6 text-primary/70" />,
      titleKey: 'services.service6.title',
      subtitleKey: 'services.service6.subtitle',
      descriptionKey: 'services.service6.description',
    },
    {
      icon: <Globe className="h-6 w-6 text-primary/70" />,
      titleKey: 'services.service7.title',
      subtitleKey: 'services.service7.subtitle',
      descriptionKey: 'services.service7.description',
    },
    {
      icon: <Mic className="h-6 w-6 text-primary/70" />,
      titleKey: 'services.service8.title',
      subtitleKey: 'services.service8.subtitle',
      descriptionKey: 'services.service8.description',
    },
  ];

  return (
    <section id="services" className="studio-section bg-background pt-16 md:pt-20">
      <div className="studio-container">
        <m.div
          className="studio-header mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.12, 0.04)}
        >
          <div className="text-center md:text-left">
            <m.p className="section-label text-muted-foreground mb-4" variants={revealUp(14, 0.45)}>
              {t('services.sectionSubtitle')}
            </m.p>
            <h2 className="studio-title">
              <SplitTextReveal text={t('services.sectionTitle')} delay={0.08} />
            </h2>
          </div>
          <m.p
            className="studio-subtitle lg:justify-self-end text-center md:text-right max-w-lg"
            variants={revealUp(18, 0.5)}
          >
            {t('services.motionSubtitle')}
          </m.p>
        </m.div>

        <m.div
          className="studio-rule mb-16 md:mb-20"
          initial={{ opacity: 0, scaleX: 0.7 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.68 }}
        />

        <m.div
          className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4"
          {...(!isMobile ? {
            initial: 'hidden' as const,
            whileInView: 'visible' as const,
            viewport: { once: true, amount: 0.15 },
            variants: staggerContainer(0.05, 0.02),
          } : {})}
        >
          {serviceData.map((service, index) => (
            <MotionLink
              key={service.titleKey}
              to={getServicePath(servicePageByCard[index], locale)}
              className="group flex flex-col rounded-[1.25rem] md:rounded-[1.5rem] border border-border/60 bg-card p-5 md:p-8 transition-[border-color,box-shadow] duration-[350ms] hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
              style={{ transitionTimingFunction: 'var(--ease-out-expo)' }}
              variants={revealUp(18, 0.45)}
              {...(isMobile ? {
                initial: 'hidden' as const,
                whileInView: 'visible' as const,
                viewport: { once: true, amount: 0.2 },
              } : {})}
              whileHover={shouldReduceMotion ? undefined : { y: -3 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
              transition={springSmooth}
            >
              <div className="mb-5 md:mb-6 text-primary/70 transition-colors duration-300 group-hover:text-primary">
                {service.icon}
              </div>
              <h3 className="text-lg md:text-2xl font-serif font-medium tracking-tight text-foreground mb-1 leading-tight">
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
              <span className="mt-auto pt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                {exploreLabel}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </span>
            </MotionLink>
          ))}
        </m.div>
      </div>
    </section>
  );
};

export default Services;
