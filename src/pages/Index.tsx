import { lazy, memo, Suspense, useEffect, type ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ManifestoChapter from '@/components/chapters/ManifestoChapter';
import CreatorAdvantageSection from '@/components/CreatorAdvantage';
import ServicesSection from '@/components/Services';
import FAQSection from '@/components/FAQ';
import FloatingContactDockSection from '@/components/FloatingContactDock';
import { useIsMobile } from '@/hooks/use-mobile';
import { clearUrlHash } from '@/hooks/use-hashless-section-navigation';
import SectionSkeleton from '@/components/motion/SectionSkeleton';
import TestimonialsReviewQuotes from '@/components/TestimonialsReviewQuotes';
import FadeInOnMount from '@/components/motion/FadeInOnMount';
import { useDeferredMount } from '@/hooks/use-deferred-mount';
import ErrorBoundary from '@/components/ErrorBoundary';
import { mark, measure, startLongTaskObserver } from '@/lib/perf-debug';
import PageSeo from '@/components/PageSeo';
import ScrollProgressHairline from '@/components/motion/ScrollProgressHairline';
import { getHomePath, type SiteLocale } from '@/lib/locale-path';
import SiteFooter from '@/components/SiteFooter';

const PortfolioSection = lazy(() => import('@/components/Portfolio'));
const TestimonialsSection = lazy(() => import('@/components/Testimonials'));
const ServicesMarqueeSection = lazy(() => import('@/components/ServicesMarquee'));

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
        'Creadora UGC bilingüe en Medellín. Hago anuncios para TikTok y Meta, demos, reseñas y videos de portavoz para marcas de EE. UU., España y Latinoamérica.',
    },
    en: {
      title: 'Gisela Saldarriaga | Bilingual UGC creator and spokesperson',
      description:
        'Bilingual UGC creator in Medellín. I make TikTok and Meta ads, product demos, reviews, and spokesperson videos for brands in the US, Spain, and LatAm.',
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

      <main>
        {/* Chapter 1 — Reel Constellation */}
        <Hero />

        {/* Chapter 2 — Manifesto (statement + proof numerals) */}
        <ManifestoChapter />

        {/* Chapter 3 — Gallery (free-scroll reel rail). Deferred on both
            breakpoints — no pin anymore, so boot stays lean. */}
        <DeferredSection
          enabled
          mountId="portfolio"
          // Phones mount it ~1.5 screens ahead: the feed pool lives inside it
          // and buffers the first reel's opening (src/lib/feed-stream.ts), so
          // it has to exist before the card scrolls into view.
          rootMargin={isMobile ? '1400px 0px' : '520px 0px'}
          queueDelayMs={80}
          // As tall as the mounted section (src/styles/reels-feed.css), so
          // nothing below it moves when it mounts: services used to jump
          // 73px on an iPhone 15 Plus and 495px on an iPad mini. Phones:
          // the 350:452 card at full width less 40px, the two-line title,
          // and 238px of chips, padding and CTA. Desktop: the grid's padding
          // and the phone (2.092 × its width, clamp(17.5rem, 24vw, 21.5rem)).
          skeleton={
            <SectionSkeleton
              id="portfolio"
              minHeightClass="min-h-[calc(1.2914*(100vw_-_40px)_+_238px_+_1.8*clamp(48px,32px_+_4.4vw,60px))] md:min-h-[calc(225px_+_2.092*clamp(280px,24vw,344px))] min-[1200px]:min-h-[calc(193px_+_2.092*clamp(280px,24vw,344px))]"
              variant="cards"
            />
          }
        >
          <PortfolioSection />
        </DeferredSection>

        {/* Chapter 4 — Services (index redesign lands in session 2) */}
        <ErrorBoundary section="services" silent>
          <ServicesSection />
        </ErrorBoundary>

        {/* Chapter 5 — Method */}
        <CreatorAdvantageSection />

        {/* Chapter 6 — Proof */}
        <DeferredSection
          enabled
          mountId="testimonials"
          rootMargin="850px 0px"
          queueDelayMs={100}
          skeleton={
            <SectionSkeleton id="testimonials" minHeightClass="min-h-[500px]" variant="testimonial">
              <TestimonialsReviewQuotes locale={locale} />
            </SectionSkeleton>
          }
        >
          <TestimonialsSection />
        </DeferredSection>

        {/* Chapter 7 — FAQ */}
        <ErrorBoundary section="faq" silent>
          <FAQSection />
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
      </main>

      <SiteFooter />

      <ErrorBoundary section="floating-contact-dock" silent>
        <FloatingContactDockSection />
      </ErrorBoundary>
    </div>
  );
});

Index.displayName = 'Index';
export default Index;
