import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { m } from 'framer-motion';
import { revealUp, staggerContainer } from '@/components/motion/variants';
import { getLocaleFromPath, getServicePath, type ServicePageId } from '@/lib/locale-path';
import { useIsMobile } from '@/hooks/use-mobile';
import { LEGACY_REEL_CLIPS, getBestPosterSrc } from '@/data/portfolio-clips';

const MotionLink = m.create(Link);

/**
 * Chapter 03 — Servicios. An editorial index: numbered serif rows instead of
 * an icon-card grid. Hovering a row (desktop) tilts in a reel preview.
 */
const Services = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const locale = typeof window === 'undefined' ? 'es' : getLocaleFromPath(window.location.pathname);
  const isEs = locale === 'es';

  const rows: Array<{
    pageId: ServicePageId;
    titleKey: string;
    metaKey?: string;
  }> = [
    { pageId: 'ugc-ads-tiktok-meta', titleKey: 'services.service1.title', metaKey: 'services.service1.subtitle' },
    { pageId: 'ugc-testimonials-reviews', titleKey: 'services.service2.title' },
    { pageId: 'ugc-product-demo', titleKey: 'services.service3.title', metaKey: 'services.service3.subtitle' },
    { pageId: 'ugc-problem-solution', titleKey: 'services.service4.title', metaKey: 'services.service4.subtitle' },
    { pageId: 'ugc-lifestyle', titleKey: 'services.service5.title', metaKey: 'services.service5.subtitle' },
    { pageId: 'ugc-broll-footage', titleKey: 'services.service6.title', metaKey: 'services.service6.subtitle' },
    { pageId: 'bilingual-ugc-creator', titleKey: 'services.service7.title', metaKey: 'services.service7.subtitle' },
    { pageId: 'spokesperson-videos', titleKey: 'services.service8.title', metaKey: 'services.service8.subtitle' },
  ];

  return (
    <section id="services" className="studio-section bg-background pt-16 md:pt-20">
      <div className="studio-container">
        <m.div
          className="mb-10 md:mb-14 flex flex-row items-end justify-between gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.12, 0.04)}
        >
          <div>
            <m.span className="dc-chapter-label" variants={revealUp(12, 0.45)}>
              {isEs ? 'Capítulo 03 — servicios' : 'Chapter 03 — services'}
            </m.span>
            <m.h2
              className="mt-3 font-serif text-[2.4rem] md:text-[3.2rem] font-semibold tracking-tight-serif leading-[1]"
              variants={revealUp(16, 0.55)}
            >
              {isEs ? 'Lo que ' : 'What I '}
              <span className="italic text-primary">{isEs ? 'produzco' : 'produce'}</span>
            </m.h2>
          </div>
          <m.p
            className="dc-index-meta hidden max-w-[16rem] !text-muted-foreground/70 md:block"
            variants={revealUp(16, 0.6)}
          >
            {isEs ? '8 formatos · cada uno con su página' : '8 formats · each with its own page'}
          </m.p>
        </m.div>

        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer(0.05, 0.02)}
          className="border-t border-border/70"
        >
          {rows.map((row, index) => (
            <MotionLink
              key={row.pageId}
              to={getServicePath(row.pageId, locale)}
              className="dc-index-row group"
              variants={revealUp(16, 0.45)}
            >
              <span className="dc-index-num">{String(index + 1).padStart(2, '0')}</span>
              <span className="dc-index-title">{t(row.titleKey)}</span>
              {!isMobile && row.metaKey && (
                <span className="dc-index-meta max-w-[15rem]">{t(row.metaKey)}</span>
              )}
              {!isMobile && (
                <span className="dc-index-preview" aria-hidden="true">
                  <img
                    src={getBestPosterSrc(LEGACY_REEL_CLIPS[index % LEGACY_REEL_CLIPS.length])}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              )}
              <span className="dc-index-arrow" aria-hidden="true">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </MotionLink>
          ))}
        </m.div>
      </div>
    </section>
  );
};

export default Services;
