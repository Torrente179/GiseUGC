import { lazy, Suspense, useEffect, useState, startTransition } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { useIsMobile } from '@/hooks/use-mobile';
import { clearUrlHash } from '@/hooks/use-hashless-section-navigation';

const SocialProofSection = lazy(() => import('@/components/SocialProof'));
const ServicesSection = lazy(() => import('@/components/Services'));
const PortfolioSection = lazy(() => import('@/components/Portfolio'));
const HeroIntroductionSection = lazy(() => import('@/components/HeroIntroduction'));
const MobileFiverrRatingSection = lazy(() => import('@/components/MobileFiverrRatingSection'));
const DesktopFiverrRatingSection = lazy(() => import('@/components/DesktopFiverrRatingSection'));
const TestimonialsSection = lazy(() => import('@/components/Testimonials'));
const FAQSection = lazy(() => import('@/components/FAQ'));
const ServicesMarqueeSection = lazy(() => import('@/components/ServicesMarquee'));
const FooterSection = lazy(() => import('@/components/Footer'));
const FloatingContactDockSection = lazy(() => import('@/components/FloatingContactDock'));

const SectionFallback = ({ id, minHeightClass }: { id?: string; minHeightClass?: string }) => (
  <section
    id={id}
    aria-hidden="true"
    className={minHeightClass ?? 'min-h-[240px]'}
  />
);

const Index = () => {
  const [shouldLoadBelowFold, setShouldLoadBelowFold] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    clearUrlHash();
  }, []);

  useEffect(() => {
    const load = () => {
      // Deprioritize below-the-fold mounting so tap/click interactions stay responsive.
      startTransition(() => {
        setShouldLoadBelowFold(true);
      });
    };

    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(load, { timeout: 1500 });
      return () => window.cancelIdleCallback(idleId);
    }

    // Safari <17 fallback
    const timeoutId = window.setTimeout(load, 300);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero showIntroduction={!isMobile} />
      {shouldLoadBelowFold ? (
        isMobile ? (
          <>
            <Suspense fallback={<SectionFallback id="portfolio" minHeightClass="min-h-[900px]" />}>
              <PortfolioSection />
            </Suspense>
            <Suspense fallback={<SectionFallback id="hero-introduction" minHeightClass="min-h-[420px]" />}>
              <HeroIntroductionSection />
            </Suspense>
            <Suspense fallback={<SectionFallback id="mobile-rating-card" minHeightClass="min-h-[460px]" />}>
              <MobileFiverrRatingSection />
            </Suspense>
            <Suspense fallback={<SectionFallback id="testimonials" minHeightClass="min-h-[500px]" />}>
              <TestimonialsSection />
            </Suspense>
            <Suspense fallback={<SectionFallback id="faq" minHeightClass="min-h-[640px]" />}>
              <FAQSection />
            </Suspense>
            <Suspense fallback={<SectionFallback id="services" minHeightClass="min-h-[520px]" />}>
              <ServicesMarqueeSection sectionId="services" />
            </Suspense>
            <Suspense fallback={<SectionFallback id="contact" minHeightClass="min-h-[640px]" />}>
              <FooterSection />
            </Suspense>
          </>
        ) : (
          <>
            <Suspense fallback={<SectionFallback minHeightClass="min-h-[300px]" />}>
              <SocialProofSection />
            </Suspense>
            <Suspense fallback={<SectionFallback id="portfolio" minHeightClass="min-h-[900px]" />}>
              <PortfolioSection />
            </Suspense>
            <Suspense fallback={<SectionFallback id="services" minHeightClass="min-h-[560px]" />}>
              <ServicesSection />
            </Suspense>
            <Suspense fallback={<SectionFallback id="desktop-rating-card" minHeightClass="min-h-[460px]" />}>
              <DesktopFiverrRatingSection />
            </Suspense>
            <Suspense fallback={<SectionFallback id="testimonials" minHeightClass="min-h-[500px]" />}>
              <TestimonialsSection />
            </Suspense>
            <Suspense fallback={<SectionFallback id="faq" minHeightClass="min-h-[640px]" />}>
              <FAQSection />
            </Suspense>
            <Suspense fallback={<SectionFallback minHeightClass="min-h-[520px]" />}>
              <ServicesMarqueeSection />
            </Suspense>
            <Suspense fallback={<SectionFallback id="contact" minHeightClass="min-h-[640px]" />}>
              <FooterSection />
            </Suspense>
          </>
        )
      ) : (
        isMobile ? (
          <>
            <SectionFallback id="portfolio" minHeightClass="min-h-[900px]" />
            <SectionFallback id="hero-introduction" minHeightClass="min-h-[420px]" />
            <SectionFallback id="mobile-rating-card" minHeightClass="min-h-[460px]" />
            <SectionFallback id="testimonials" minHeightClass="min-h-[500px]" />
            <SectionFallback id="faq" minHeightClass="min-h-[640px]" />
            <SectionFallback id="services" minHeightClass="min-h-[520px]" />
            <SectionFallback id="contact" minHeightClass="min-h-[640px]" />
          </>
        ) : (
          <>
            <SectionFallback minHeightClass="min-h-[300px]" />
            <SectionFallback id="portfolio" minHeightClass="min-h-[900px]" />
            <SectionFallback id="services" minHeightClass="min-h-[560px]" />
            <SectionFallback id="desktop-rating-card" minHeightClass="min-h-[460px]" />
            <SectionFallback id="testimonials" minHeightClass="min-h-[500px]" />
            <SectionFallback id="faq" minHeightClass="min-h-[640px]" />
            <SectionFallback minHeightClass="min-h-[520px]" />
            <SectionFallback id="contact" minHeightClass="min-h-[640px]" />
          </>
        )
      )}
      <Suspense fallback={null}>
        <FloatingContactDockSection />
      </Suspense>
    </div>
  );
};

export default Index;
