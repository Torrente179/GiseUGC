import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CreatorAdvantageSection from '@/components/CreatorAdvantage';
import { useIsMobile } from '@/hooks/use-mobile';
import { clearUrlHash } from '@/hooks/use-hashless-section-navigation';
import SectionSkeleton from '@/components/motion/SectionSkeleton';
import FadeInOnMount from '@/components/motion/FadeInOnMount';
import { useDeferredMount } from '@/hooks/use-deferred-mount';
import { mark, measure, startLongTaskObserver } from '@/lib/perf-debug';
import PageSeo from '@/components/PageSeo';
import { getLocaleFromPath, getHomePath, type SiteLocale } from '@/lib/locale-path';
import Footer from '@/components/Footer';

const SocialProofSection = lazy(() => import('@/components/SocialProof'));
const ServicesSection = lazy(() => import('@/components/Services'));
const PortfolioSection = lazy(() => import('@/components/Portfolio'));
const HeroIntroductionSection = lazy(() => import('@/components/HeroIntroduction'));
const MobileFiverrRatingSection = lazy(() => import('@/components/MobileFiverrRatingSection'));
const MobileContactCtaSection = lazy(() => import('@/components/MobileContactCtaSection'));
const DesktopFiverrRatingSection = lazy(() => import('@/components/DesktopFiverrRatingSection'));
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
    return <Suspense fallback={skeleton}><FadeInOnMount>{children}</FadeInOnMount></Suspense>;
  }

  return <div ref={placeholderRef}>{skeleton}</div>;
};

const Index = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
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
      <Hero showIntroduction={!isMobile} />
      {isMobile ? <HeroIntroductionSection /> : <SocialProofSection />}

      <DeferredSection
        enabled={isMobile}
        mountId="portfolio-mobile"
        rootMargin="1100px 0px"
        queueDelayMs={260}
        skeleton={<SectionSkeleton id="portfolio" minHeightClass="min-h-[900px]" variant="cards" />}
      >
        <PortfolioSection />
      </DeferredSection>
      {isMobile ? <ServicesSection /> : null}
      {isMobile ? <CreatorAdvantageSection /> : null}
      <DeferredSection
        enabled={isMobile}
        mountId="mobile-rating-card"
        rootMargin="900px 0px"
        queueDelayMs={300}
        skeleton={<SectionSkeleton id="mobile-rating-card" minHeightClass="min-h-[460px]" />}
      >
        <MobileFiverrRatingSection />
      </DeferredSection>
      <DeferredSection
        enabled={isMobile}
        mountId="testimonials-mobile"
        rootMargin="850px 0px"
        queueDelayMs={300}
        skeleton={<SectionSkeleton id="testimonials" minHeightClass="min-h-[500px]" variant="testimonial" />}
      >
        <TestimonialsSection />
      </DeferredSection>
      <DeferredSection
        enabled={isMobile}
        mountId="mobile-contact-cta"
        rootMargin="800px 0px"
        queueDelayMs={300}
        skeleton={<SectionSkeleton id="mobile-contact-cta" minHeightClass="min-h-[120px]" />}
      >
        <MobileContactCtaSection />
      </DeferredSection>
      {isMobile ? <FAQSection /> : null}
      <DeferredSection
        enabled={isMobile}
        mountId="services-marquee-mobile"
        rootMargin="1250px 0px"
        queueDelayMs={280}
        skeleton={<SectionSkeleton id="services" minHeightClass="min-h-[520px]" variant="cards" />}
      >
        <ServicesMarqueeSection sectionId="services" />
      </DeferredSection>
      <DeferredSection
        enabled={!isMobile}
        mountId="portfolio-desktop"
        rootMargin="950px 0px"
        queueDelayMs={300}
        skeleton={<SectionSkeleton id="portfolio" minHeightClass="min-h-[900px]" variant="cards" />}
      >
        <PortfolioSection />
      </DeferredSection>
      {!isMobile ? <ServicesSection /> : null}
      {!isMobile ? <CreatorAdvantageSection /> : null}
      <DeferredSection
        enabled={!isMobile}
        mountId="desktop-rating-card"
        rootMargin="850px 0px"
        queueDelayMs={300}
        skeleton={<SectionSkeleton id="desktop-rating-card" minHeightClass="min-h-[460px]" />}
      >
        <DesktopFiverrRatingSection />
      </DeferredSection>
      <DeferredSection
        enabled={!isMobile}
        mountId="testimonials-desktop"
        rootMargin="800px 0px"
        queueDelayMs={320}
        skeleton={<SectionSkeleton id="testimonials" minHeightClass="min-h-[500px]" variant="testimonial" />}
      >
        <TestimonialsSection />
      </DeferredSection>
      {!isMobile ? <FAQSection /> : null}
      <DeferredSection
        enabled={!isMobile}
        mountId="services-marquee-desktop"
        rootMargin="700px 0px"
        queueDelayMs={320}
        skeleton={<SectionSkeleton minHeightClass="min-h-[520px]" variant="cards" />}
      >
        <ServicesMarqueeSection />
      </DeferredSection>
      <Footer />

      <Suspense fallback={null}>
        <FloatingContactDockSection />
      </Suspense>
    </div>
  );
};

export default Index;
