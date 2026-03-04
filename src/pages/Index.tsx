import { lazy, Suspense, useEffect, useState, startTransition } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { useIsMobile } from '@/hooks/use-mobile';
import { clearUrlHash } from '@/hooks/use-hashless-section-navigation';
import SectionSkeleton from '@/components/motion/SectionSkeleton';

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
            <Suspense fallback={<SectionSkeleton id="portfolio" minHeightClass="min-h-[900px]" variant="cards" />}>
              <PortfolioSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton id="hero-introduction" minHeightClass="min-h-[420px]" variant="hero-intro" />}>
              <HeroIntroductionSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton id="mobile-rating-card" minHeightClass="min-h-[460px]" />}>
              <MobileFiverrRatingSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton id="testimonials" minHeightClass="min-h-[500px]" variant="testimonial" />}>
              <TestimonialsSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton id="mobile-contact-cta" minHeightClass="min-h-[120px]" />}>
              <MobileContactCtaSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton id="faq" minHeightClass="min-h-[640px]" />}>
              <FAQSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton id="services" minHeightClass="min-h-[520px]" variant="cards" />}>
              <ServicesMarqueeSection sectionId="services" />
            </Suspense>
            <Suspense fallback={<SectionSkeleton id="contact" minHeightClass="min-h-[640px]" variant="footer" />}>
              <FooterSection />
            </Suspense>
          </>
        ) : (
          <>
            <Suspense fallback={<SectionSkeleton minHeightClass="min-h-[300px]" />}>
              <SocialProofSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton id="portfolio" minHeightClass="min-h-[900px]" variant="cards" />}>
              <PortfolioSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton id="services" minHeightClass="min-h-[560px]" variant="cards" />}>
              <ServicesSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton id="desktop-rating-card" minHeightClass="min-h-[460px]" />}>
              <DesktopFiverrRatingSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton id="testimonials" minHeightClass="min-h-[500px]" variant="testimonial" />}>
              <TestimonialsSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton id="faq" minHeightClass="min-h-[640px]" />}>
              <FAQSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton minHeightClass="min-h-[520px]" variant="cards" />}>
              <ServicesMarqueeSection />
            </Suspense>
            <Suspense fallback={<SectionSkeleton id="contact" minHeightClass="min-h-[640px]" variant="footer" />}>
              <FooterSection />
            </Suspense>
          </>
        )
      ) : (
        isMobile ? (
          <>
            <SectionSkeleton id="portfolio" minHeightClass="min-h-[900px]" variant="cards" />
            <SectionSkeleton id="hero-introduction" minHeightClass="min-h-[420px]" variant="hero-intro" />
            <SectionSkeleton id="mobile-rating-card" minHeightClass="min-h-[460px]" />
            <SectionSkeleton id="testimonials" minHeightClass="min-h-[500px]" variant="testimonial" />
            <SectionSkeleton id="mobile-contact-cta" minHeightClass="min-h-[120px]" />
            <SectionSkeleton id="faq" minHeightClass="min-h-[640px]" />
            <SectionSkeleton id="services" minHeightClass="min-h-[520px]" variant="cards" />
            <SectionSkeleton id="contact" minHeightClass="min-h-[640px]" variant="footer" />
          </>
        ) : (
          <>
            <SectionSkeleton minHeightClass="min-h-[300px]" />
            <SectionSkeleton id="portfolio" minHeightClass="min-h-[900px]" variant="cards" />
            <SectionSkeleton id="services" minHeightClass="min-h-[560px]" variant="cards" />
            <SectionSkeleton id="desktop-rating-card" minHeightClass="min-h-[460px]" />
            <SectionSkeleton id="testimonials" minHeightClass="min-h-[500px]" variant="testimonial" />
            <SectionSkeleton id="faq" minHeightClass="min-h-[640px]" />
            <SectionSkeleton minHeightClass="min-h-[520px]" variant="cards" />
            <SectionSkeleton id="contact" minHeightClass="min-h-[640px]" variant="footer" />
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
