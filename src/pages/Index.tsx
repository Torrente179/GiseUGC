import { lazy, memo, Suspense, useEffect, type ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ManifestoChapter from '@/components/chapters/ManifestoChapter';
import CreatorAdvantageSection from '@/components/CreatorAdvantage';
import { useIsMobile } from '@/hooks/use-mobile';
import { clearUrlHash } from '@/hooks/use-hashless-section-navigation';
import SectionSkeleton from '@/components/motion/SectionSkeleton';
import FadeInOnMount from '@/components/motion/FadeInOnMount';
import { useDeferredMount } from '@/hooks/use-deferred-mount';
import ErrorBoundary from '@/components/ErrorBoundary';
import { mark, measure, startLongTaskObserver } from '@/lib/perf-debug';
import PageSeo from '@/components/PageSeo';
import ScrollProgressHairline from '@/components/motion/ScrollProgressHairline';
import { getHomePath, type SiteLocale } from '@/lib/locale-path';
import SiteFooter from '@/components/SiteFooter';

const ServicesSection = lazy(() => import('@/components/Services'));
const PortfolioSection = lazy(() => import('@/components/Portfolio'));
const TestimonialsSection = lazy(() => import('@/components/Testimonials'));
const FAQSection = lazy(() => import('@/components/FAQ'));
const ServicesMarqueeSection = lazy(() => import('@/components/ServicesMarquee'));
const FloatingContactDockSection = lazy(() => import('@/components/FloatingContactDock'));

type DeferredSectionProps = {
  enabled: boolean;
  mountId: string;
  rootMargin?: string;
  queueDelayMs?: number;
  skeleton: ReactNode;
  children: ReactNode;
};

const DeferredSection = ({
  enabled,
  mountId,
  rootMargin = '700px 0px',
  queueDelayMs = 300,
  skeleton,
  children,
}: DeferredSectionProps) => {
  const { shouldMount, placeholderRef } = useDeferredMount({
    enabled,
    mountId,
    rootMargin,
    queueDelayMs,
  });

  useEffect(() => {
    if (!enabled || !shouldMount) return;
    const renderMark = `${mountId}:rendered`;
    mark(renderMark);
    measure(`${mountId}:mounted`, renderMark, `${mountId}:mounted-to-rendered`);
  }, [enabled, mountId, shouldMount]);

  if (!enabled) return null;

  if (shouldMount) {
    // A failure in one deferred section degrades silently (and is logged in
    // ErrorBoundary.componentDidCatch) instead of taking down the whole page.
    return (
      <Suspense fallback={skeleton}>
        <ErrorBoundary section={mountId} silent>
          <FadeInOnMount>{children}</FadeInOnMount>
        </ErrorBoundary>
      </Suspense>
    );
  }

  return <div ref={placeholderRef}>{skeleton}</div>;
};

const Index = memo(({ locale }: { locale: SiteLocale }) => {
  const isMobile = useIsMobile();
  const homeSeoByLocale: Record<
    SiteLocale,
    {
      title: string;
      description: string;
    }
  > = {
    es: {
      title: 'Gisela Saldarriaga | Creadora UGC bilingüe y videos de portavoz',
      description:
        'Creadora UGC bilingüe en Medellín para TikTok Ads, Meta Ads, demos de producto y videos de portavoz. Trabajo con marcas de Estados Unidos, España y Latinoamérica.',
    },
    en: {
      title: 'Gisela Saldarriaga | Bilingual UGC creator and spokesperson',
      description:
        'Bilingual UGC creator in Medellin for TikTok ads, Meta ads, product demos, reviews, and spokesperson videos for brands in the US, Spain, and LatAm.',
    },
  };
  const homeSeo = homeSeoByLocale[locale];
  const siteUrl = 'https://www.giselasaldarriaga.com';
  const buildUrl = (pathname: string) => new URL(pathname, siteUrl).toString();

  useEffect(() => {
    clearUrlHash();
    startLongTaskObserver();
    mark('index:mounted');
  }, []);

  return (
    <div className="min-h-screen">
      <PageSeo
        title={homeSeo.title}
        description={homeSeo.description}
        canonical={buildUrl(getHomePath(locale))}
        locale={locale}
        alternates={{
          es: buildUrl(getHomePath('es')),
          en: buildUrl(getHomePath('en')),
          xDefault: buildUrl(getHomePath('es')),
        }}
      />
      <Navbar />
      <ScrollProgressHairline />

      {/* Chapter 1 — Reel Constellation */}
      <Hero />

      {/* Chapter 2 — Manifesto (statement + proof numerals) */}
      <ManifestoChapter />

      {/* Chapter 3 — Gallery (free-scroll reel rail). Deferred on both
          breakpoints — no pin anymore, so boot stays lean. */}
      <DeferredSection
        enabled
        mountId="portfolio"
        rootMargin={isMobile ? '1100px 0px' : '950px 0px'}
        queueDelayMs={80}
        skeleton={<SectionSkeleton id="portfolio" minHeightClass="min-h-[760px]" variant="cards" />}
      >
        <PortfolioSection />
      </DeferredSection>

      {/* Chapter 4 — Services (index redesign lands in session 2) */}
      <ErrorBoundary section="services" silent>
        <Suspense fallback={<SectionSkeleton id="services" minHeightClass="min-h-[520px]" variant="cards" />}>
          <ServicesSection />
        </Suspense>
      </ErrorBoundary>

      {/* Chapter 5 — Method */}
      <CreatorAdvantageSection />

      {/* Chapter 6 — Proof */}
      <DeferredSection
        enabled
        mountId="testimonials"
        rootMargin="850px 0px"
        queueDelayMs={100}
        skeleton={<SectionSkeleton id="testimonials" minHeightClass="min-h-[500px]" variant="testimonial" />}
      >
        <TestimonialsSection />
      </DeferredSection>

      {/* Chapter 7 — FAQ */}
      <ErrorBoundary section="faq" silent>
        <Suspense fallback={<SectionSkeleton id="faq" minHeightClass="min-h-[480px]" />}>
          <FAQSection />
        </Suspense>
      </ErrorBoundary>

      {/* Toolkit marquee → finale (full Finale chapter lands in session 2) */}
      <DeferredSection
        enabled
        mountId="services-marquee"
        rootMargin="1250px 0px"
        queueDelayMs={120}
        skeleton={<SectionSkeleton minHeightClass="min-h-[520px]" variant="cards" />}
      >
        <ServicesMarqueeSection sectionId={isMobile ? 'services-marquee' : undefined} />
      </DeferredSection>

      <SiteFooter />

      <ErrorBoundary section="floating-contact-dock" silent>
        <Suspense fallback={null}>
          <FloatingContactDockSection />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
});

Index.displayName = 'Index';
export default Index;
