import { useState } from 'react';
import { useTranslation } from '@/lib/locale-context';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getServicePath, type ServicePageId } from '@/lib/locale-path';
import { LEGACY_REEL_CLIPS } from '@/data/portfolio-clips';
import ResponsivePosterImage from '@/components/media/ResponsivePosterImage';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

/**
 * Chapter 03 — Servicios. An editorial index: numbered serif rows instead of
 * an icon-card grid. Hovering a row (desktop) tilts in a reel preview.
 */
const Services = () => {
  const { t, locale } = useTranslation();
  const isEs = locale === 'es';
  const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(null);
  const revealRef = useScrollReveal<HTMLDivElement>();

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
        <div ref={revealRef} className="svc-reveal mb-10 md:mb-14 flex flex-row items-end justify-between gap-6">
          <div>
            <span className="dc-chapter-label">
              {isEs ? 'Capítulo 03 — servicios' : 'Chapter 03 — services'}
            </span>
            <h2 className="mt-3 font-serif text-[2.4rem] md:text-[3.2rem] font-semibold tracking-tight-serif leading-[1]">
              {isEs ? 'Lo que ' : 'What I '}
              <span className="italic text-primary">{isEs ? 'produzco' : 'produce'}</span>
            </h2>
          </div>
          <p className="dc-index-meta hidden max-w-[16rem] !text-muted-foreground/70 md:block">
            {isEs ? '8 formatos · cada uno con su página' : '8 formats · each with its own page'}
          </p>
        </div>

        <div className="border-t border-border/70">
          {rows.map((row, index) => (
            <Link
              key={row.pageId}
              to={getServicePath(row.pageId, locale)}
              className="dc-index-row group"
              onPointerEnter={() => setActivePreviewIndex(index)}
              onPointerLeave={() => setActivePreviewIndex((active) => active === index ? null : active)}
              onFocus={() => setActivePreviewIndex(index)}
              onBlur={() => setActivePreviewIndex((active) => active === index ? null : active)}
            >
              <span className="dc-index-num">{String(index + 1).padStart(2, '0')}</span>
              <span className="dc-index-title">{t(row.titleKey)}</span>
              {row.metaKey && (
                <span className="dc-index-meta hidden max-w-[15rem] md:block">{t(row.metaKey)}</span>
              )}
              <span className="dc-index-preview hidden md:block" aria-hidden="true">
                {activePreviewIndex === index ? (
                  <ResponsivePosterImage
                    clip={LEGACY_REEL_CLIPS[index % LEGACY_REEL_CLIPS.length]}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    sizes="77px"
                  />
                ) : null}
              </span>
              <span className="dc-index-arrow" aria-hidden="true">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
