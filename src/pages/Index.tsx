import { lazy, Suspense, useEffect, type ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { useIsMobile } from '@/hooks/use-mobile';
import { clearUrlHash } from '@/hooks/use-hashless-section-navigation';
import SectionSkeleton from '@/components/motion/SectionSkeleton';
import { useDeferredMount } from '@/hooks/use-deferred-mount';
import { mark, measure, startLongTaskObserver } from '@/lib/perf-debug';

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
const FooterSection = lazy(() => import('@/components/Footer'));
const FloatingContactDockSection = lazy(() => import('@/components/FloatingContactDock'));

type DeferredSectionProps = {
  enabled: boolean;
  mountId: string;
  rootMargin?: string;
  queueDelayMs?: number;
  skeleton: ReactNode;
  children: ReactNode;
};

type ImmediateSectionProps = {
  enabled: boolean;
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
    return <Suspense fallback={skeleton}>{children}</Suspense>;
  }

  return <div ref={placeholderRef}>{skeleton}</div>;
};

const ImmediateSection = ({ enabled, skeleton, children }: ImmediateSectionProps) => {
  if (!enabled) return null;
  return <Suspense fallback={skeleton}>{children}</Suspense>;
};

const Index = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    clearUrlHash();
    startLongTaskObserver();
    mark('index:mounted');
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero showIntroduction={!isMobile} />

      <DeferredSection
        enabled={isMobile}
        mountId="portfolio-mobile"
        rootMargin="1400px 0px"
        queueDelayMs={180}
        skeleton={<SectionSkeleton id="portfolio" minHeightClass="min-h-[900px]" variant="cards" />}
      >
        <PortfolioSection />
      </DeferredSection>
      <ImmediateSection
        enabled={isMobile}
        skeleton={<SectionSkeleton id="hero-introduction" minHeightClass="min-h-[420px]" variant="hero-intro" />}
      >
        <HeroIntroductionSection />
      </ImmediateSection>
      <ImmediateSection
        enabled={isMobile}
        skeleton={<SectionSkeleton id="mobile-rating-card" minHeightClass="min-h-[460px]" />}
      >
        <MobileFiverrRatingSection />
      </ImmediateSection>
      <DeferredSection
        enabled={isMobile}
        mountId="testimonials-mobile"
        rootMargin="850px 0px"
        queueDelayMs={220}
        skeleton={<SectionSkeleton id="testimonials" minHeightClass="min-h-[500px]" variant="testimonial" />}
      >
        <TestimonialsSection />
      </DeferredSection>
      <ImmediateSection
        enabled={isMobile}
        skeleton={<SectionSkeleton id="mobile-contact-cta" minHeightClass="min-h-[120px]" />}
      >
        <MobileContactCtaSection />
      </ImmediateSection>
      <ImmediateSection
        enabled={isMobile}
        skeleton={<SectionSkeleton id="faq" minHeightClass="min-h-[640px]" />}
      >
        <FAQSection />
      </ImmediateSection>
      <DeferredSection
        enabled={isMobile}
        mountId="services-marquee-mobile"
        rootMargin="1350px 0px"
        queueDelayMs={220}
        skeleton={<SectionSkeleton id="services" minHeightClass="min-h-[520px]" variant="cards" />}
      >
        <ServicesMarqueeSection sectionId="services" />
      </DeferredSection>
      <DeferredSection
        enabled={isMobile}
        mountId="footer-mobile"
        rootMargin="650px 0px"
        queueDelayMs={240}
        skeleton={<SectionSkeleton id="contact" minHeightClass="min-h-[640px]" variant="footer" />}
      >
        <FooterSection />
      </DeferredSection>

      <ImmediateSection
        enabled={!isMobile}
        skeleton={<SectionSkeleton minHeightClass="min-h-[300px]" />}
      >
        <SocialProofSection />
      </ImmediateSection>
      <DeferredSection
        enabled={!isMobile}
        mountId="portfolio-desktop"
        rootMargin="950px 0px"
        queueDelayMs={220}
        skeleton={<SectionSkeleton id="portfolio" minHeightClass="min-h-[900px]" variant="cards" />}
      >
        <PortfolioSection />
      </DeferredSection>
      <ImmediateSection
        enabled={!isMobile}
        skeleton={<SectionSkeleton id="services" minHeightClass="min-h-[560px]" variant="cards" />}
      >
        <ServicesSection />
      </ImmediateSection>
      <ImmediateSection
        enabled={!isMobile}
        skeleton={<SectionSkeleton id="desktop-rating-card" minHeightClass="min-h-[460px]" />}
      >
        <DesktopFiverrRatingSection />
      </ImmediateSection>
      <DeferredSection
        enabled={!isMobile}
        mountId="testimonials-desktop"
        rootMargin="800px 0px"
        queueDelayMs={220}
        skeleton={<SectionSkeleton id="testimonials" minHeightClass="min-h-[500px]" variant="testimonial" />}
      >
        <TestimonialsSection />
      </DeferredSection>
      <ImmediateSection
        enabled={!isMobile}
        skeleton={<SectionSkeleton id="faq" minHeightClass="min-h-[640px]" />}
      >
        <FAQSection />
      </ImmediateSection>
      <DeferredSection
        enabled={!isMobile}
        mountId="services-marquee-desktop"
        rootMargin="700px 0px"
        queueDelayMs={240}
        skeleton={<SectionSkeleton minHeightClass="min-h-[520px]" variant="cards" />}
      >
        <ServicesMarqueeSection />
      </DeferredSection>
      <DeferredSection
        enabled={!isMobile}
        mountId="footer-desktop"
        rootMargin="650px 0px"
        queueDelayMs={240}
        skeleton={<SectionSkeleton id="contact" minHeightClass="min-h-[640px]" variant="footer" />}
      >
        <FooterSection />
      </DeferredSection>

      <Suspense fallback={null}>
        <FloatingContactDockSection />
      </Suspense>
    </div>
  );
};

export default Index;
