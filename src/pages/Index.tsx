import { lazy, Suspense, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { clearUrlHash } from '@/hooks/use-hashless-section-navigation';

const SocialProofSection = lazy(() => import('@/components/SocialProof'));
const ServicesSection = lazy(() => import('@/components/Services'));
const PortfolioSection = lazy(() => import('@/components/Portfolio'));
const TestimonialsSection = lazy(() => import('@/components/Testimonials'));
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

  useEffect(() => {
    clearUrlHash();
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShouldLoadBelowFold(true);
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      {shouldLoadBelowFold ? (
        <>
          <Suspense fallback={<SectionFallback minHeightClass="min-h-[300px]" />}>
            <SocialProofSection />
          </Suspense>
          <Suspense fallback={<SectionFallback id="services" minHeightClass="min-h-[560px]" />}>
            <ServicesSection />
          </Suspense>
          <Suspense fallback={<SectionFallback id="portfolio" minHeightClass="min-h-[900px]" />}>
            <PortfolioSection />
          </Suspense>
          <Suspense fallback={<SectionFallback id="testimonials" minHeightClass="min-h-[500px]" />}>
            <TestimonialsSection />
          </Suspense>
          <Suspense fallback={<SectionFallback minHeightClass="min-h-[520px]" />}>
            <ServicesMarqueeSection />
          </Suspense>
          <Suspense fallback={<SectionFallback id="contact" minHeightClass="min-h-[640px]" />}>
            <FooterSection />
          </Suspense>
          <Suspense fallback={null}>
            <FloatingContactDockSection />
          </Suspense>
        </>
      ) : (
        <>
          <SectionFallback minHeightClass="min-h-[300px]" />
          <SectionFallback id="services" minHeightClass="min-h-[560px]" />
          <SectionFallback id="portfolio" minHeightClass="min-h-[900px]" />
          <SectionFallback id="testimonials" minHeightClass="min-h-[500px]" />
          <SectionFallback minHeightClass="min-h-[520px]" />
          <SectionFallback id="contact" minHeightClass="min-h-[640px]" />
        </>
      )}
    </div>
  );
};

export default Index;
