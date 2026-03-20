import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ServicePageId, SiteLocale } from '@/lib/locale-path';
import { getHomePath, getServicePath } from '@/lib/locale-path';
import { getServicePageContent, getRelatedServiceSummaries } from '@/data/service-pages';
import { LEGACY_REEL_CLIPS } from '@/data/portfolio-clips';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageSeo from '@/components/PageSeo';

import { SERVICE_LAYOUTS } from '@/components/service/layouts';
import ServiceHero from '@/components/service/ServiceHero';
import ServiceEditorialIntro from '@/components/service/ServiceEditorialIntro';
import ServiceDeliverables from '@/components/service/ServiceDeliverables';
import ServiceFitPanel from '@/components/service/ServiceFitPanel';
import ServiceProcess from '@/components/service/ServiceProcess';
import ServiceFaq from '@/components/service/ServiceFaq';
import ServiceFeaturedWork, { ServiceFeaturedWorkGrid } from '@/components/service/ServiceFeaturedWork';
import ServiceCtaCloser from '@/components/service/ServiceCtaCloser';
import ServiceRelated from '@/components/service/ServiceRelated';
import ServiceProofTheater from '@/components/service/ServiceProofTheater';

const FloatingContactDock = lazy(() => import('@/components/FloatingContactDock'));

const SITE_URL = 'https://www.giselasaldarriaga.com';
const buildUrl = (pathname: string) => new URL(pathname, SITE_URL).toString();

const clipMap = new Map(LEGACY_REEL_CLIPS.map((clip) => [clip.id, clip]));

type ServiceLandingPageProps = {
  serviceId: ServicePageId;
  locale: SiteLocale;
};

const localeLabels = {
  es: {
    home: 'Inicio',
    services: 'Servicios',
    openSample: 'Ver muestra',
    useWhatsApp: 'WhatsApp',
    useFiverr: 'Fiverr',
    relatedLink: 'Ver servicio',
    scrollDown: 'Explorar',
    featuredWorkLabel: 'Trabajo Destacado',
    featuredWorkSubtitle: 'Una selección breve entre demos, piezas de portavoz y reviews recientes.',
    previewClose: 'Cerrar vista previa',
    previewPrev: 'Clip anterior',
    previewNext: 'Siguiente clip',
  },
  en: {
    home: 'Home',
    services: 'Services',
    openSample: 'View sample',
    useWhatsApp: 'WhatsApp',
    useFiverr: 'Fiverr',
    relatedLink: 'View service',
    scrollDown: 'Explore',
    featuredWorkLabel: 'Featured Work',
    featuredWorkSubtitle: 'A brief selection from demos, spokesperson pieces, and recent reviews.',
    previewClose: 'Close preview',
    previewPrev: 'Previous clip',
    previewNext: 'Next clip',
  },
} as const;

/* ── Scroll-reveal hook ── */
function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      node?.classList.add('is-visible');
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.classList.add('is-visible');
          observer.unobserve(node);
        }
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ── Section wrapper with reveal ── */
function RevealSection({
  children,
  className = '',
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useScrollReveal<HTMLElement>();
  return (
    <section ref={ref} id={id} className={`svc-reveal ${className}`}>
      {children}
    </section>
  );
}

const ServiceLandingPage = ({ serviceId, locale }: ServiceLandingPageProps) => {
  const page = getServicePageContent(serviceId, locale);
  const labels = localeLabels[locale];
  const layout = SERVICE_LAYOUTS[serviceId];
  const relatedPages = getRelatedServiceSummaries(page.relatedServiceIds, locale);

  const canonical = buildUrl(page.path);
  const homeCanonical = buildUrl(getHomePath(locale));

  const proofExamples = useMemo(
    () =>
      page.featuredExamples.flatMap((example) => {
        const clip = clipMap.get(example.clipId);
        return clip ? [{ example, clip }] : [];
      }),
    [page.featuredExamples],
  );

  /* ── Theater state ── */
  const [activeProofIndex, setActiveProofIndex] = useState<number | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px)').matches;
  });

  const activeProofItem = useMemo(
    () => (activeProofIndex === null ? null : proofExamples[activeProofIndex] ?? null),
    [activeProofIndex, proofExamples],
  );
  const isProofTheaterOpen = activeProofItem !== null;

  const openProofClip = useCallback(
    (index: number) => {
      if (index < 0 || index >= proofExamples.length) return;
      setActiveProofIndex(index);
    },
    [proofExamples.length],
  );

  const closeProofTheater = useCallback(() => {
    setActiveProofIndex(null);
  }, []);

  const navigateProofTheater = useCallback(
    (direction: 1 | -1) => {
      if (proofExamples.length === 0) return;
      setActiveProofIndex((previousIndex) => {
        if (previousIndex === null) return previousIndex;
        return (previousIndex + direction + proofExamples.length) % proofExamples.length;
      });
    },
    [proofExamples.length],
  );

  const theaterSources = useMemo(() => {
    const clip = activeProofItem?.clip;
    if (!clip) return [];

    const preferredSources = isMobileViewport
      ? [clip.mobileSrc, clip.mainSrc, clip.previewSrc]
      : [clip.mainSrc, clip.mobileSrc, clip.previewSrc];

    return preferredSources.filter((source, index, sources): source is string => {
      if (!source) return false;
      return sources.indexOf(source) === index;
    });
  }, [activeProofItem, isMobileViewport]);

  useEffect(() => {
    if (activeProofIndex === null) return;
    if (activeProofIndex >= proofExamples.length) {
      setActiveProofIndex(null);
    }
  }, [activeProofIndex, proofExamples.length]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateViewport = () => {
      setIsMobileViewport(mediaQuery.matches);
    };

    updateViewport();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateViewport);
      return () => mediaQuery.removeEventListener('change', updateViewport);
    }

    mediaQuery.addListener(updateViewport);
    return () => mediaQuery.removeListener(updateViewport);
  }, []);

  useEffect(() => {
    if (!isProofTheaterOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeProofTheater();
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        navigateProofTheater(1);
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        navigateProofTheater(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeProofTheater, isProofTheaterOpen, navigateProofTheater]);

  useEffect(() => {
    if (!isProofTheaterOpen) return;

    const scrollY = window.scrollY;
    const htmlElement = document.documentElement;
    const previousStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
      overscrollBehavior: document.body.style.overscrollBehavior,
    };
    const previousHtmlStyles = {
      overflow: htmlElement.style.overflow,
      overscrollBehavior: htmlElement.style.overscrollBehavior,
      scrollBehavior: htmlElement.style.scrollBehavior,
    };

    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    htmlElement.style.overflow = 'hidden';
    htmlElement.style.overscrollBehavior = 'none';
    htmlElement.dataset.theater = 'open';

    return () => {
      delete htmlElement.dataset.theater;
      document.body.style.position = previousStyles.position;
      document.body.style.top = previousStyles.top;
      document.body.style.left = previousStyles.left;
      document.body.style.right = previousStyles.right;
      document.body.style.width = previousStyles.width;
      document.body.style.overflow = previousStyles.overflow;
      document.body.style.overscrollBehavior = previousStyles.overscrollBehavior;
      htmlElement.style.overflow = previousHtmlStyles.overflow;
      htmlElement.style.overscrollBehavior = previousHtmlStyles.overscrollBehavior;
      htmlElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollY);
      htmlElement.style.scrollBehavior = previousHtmlStyles.scrollBehavior;
    };
  }, [isProofTheaterOpen]);

  /* ── Schema (SEO) ── */
  const schema = useMemo(() => {
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: labels.home,
        item: homeCanonical,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: labels.services,
        item: homeCanonical,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: page.breadcrumbLabel,
        item: canonical,
      },
    ];

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          url: canonical,
          name: page.metaTitle,
          description: page.metaDescription,
          dateModified: '2026-03-13',
          inLanguage: locale,
          isPartOf: {
            '@id': `${homeCanonical}#website`,
          },
          breadcrumb: {
            '@id': `${canonical}#breadcrumb`,
          },
          mainEntity: {
            '@id': `${canonical}#service`,
          },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonical}#breadcrumb`,
          itemListElement: breadcrumbItems,
        },
        {
          '@type': 'Service',
          '@id': `${canonical}#service`,
          name: page.navLabel,
          serviceType: page.navLabel,
          description: page.metaDescription,
          url: canonical,
          provider: {
            '@type': 'ProfessionalService',
            '@id': `${SITE_URL}/#business`,
            name: 'Gisela Saldarriaga UGC Studio',
            url: `${SITE_URL}/`,
            telephone: '+57-304-378-6101',
            availableLanguage: ['es', 'en'],
          },
          areaServed: [
            { '@type': 'Country', name: 'United States' },
            { '@type': 'Country', name: 'Spain' },
            { '@type': 'Place', name: 'Latin America' },
          ],
          availableLanguage: ['es', 'en'],
          audience: {
            '@type': 'Audience',
            audienceType:
              locale === 'es'
                ? 'Marcas de ecommerce, beauty, lifestyle, SaaS y tecnología'
                : 'Ecommerce, beauty, lifestyle, SaaS, and tech brands',
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${canonical}#faq`,
          inLanguage: locale,
          mainEntity: page.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        },
      ],
    };
  }, [
    canonical,
    homeCanonical,
    labels.home,
    labels.services,
    locale,
    page.breadcrumbLabel,
    page.faqs,
    page.metaDescription,
    page.metaTitle,
    page.navLabel,
  ]);

  /* ── Section renderer ── */
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'hero':
        return (
          <ServiceHero
            key="hero"
            variant={layout.heroVariant}
            locale={locale}
            labels={labels}
            breadcrumbLabel={page.breadcrumbLabel}
            heroEyebrow={page.heroEyebrow}
            heroTitle={page.heroTitle}
            heroSummary={page.heroSummary}
            heroPoints={page.heroPoints}
            primaryCtaLabel={page.primaryCtaLabel}
            primaryCtaHref={page.primaryCtaHref}
            secondaryCtaLabel={page.secondaryCtaLabel}
            secondaryCtaHref={page.secondaryCtaHref}
          />
        );

      case 'featuredWork':
        return proofExamples.length > 0 ? (
          <RevealSection key="featuredWork" className="py-16 md:py-24 lg:py-28" id="examples">
            <ServiceFeaturedWork
              variant={layout.featuredWorkVariant}
              proofExamples={proofExamples}
              labels={labels}
              navLabel={page.navLabel}
              featuredTitle={page.featuredTitle}
              featuredIntro={page.featuredIntro}
              onOpenClip={openProofClip}
            />
          </RevealSection>
        ) : null;

      case 'editorialIntro':
        return (
          <RevealSection key="editorialIntro" className="border-t border-border/50 py-20 md:py-28 lg:py-32">
            <ServiceEditorialIntro
              variant={layout.introVariant}
              sectionIntroTitle={page.sectionIntroTitle}
              sectionIntroText={page.sectionIntroText}
              marketTitle={page.marketTitle}
              marketItems={page.marketItems}
            />
          </RevealSection>
        );

      case 'deliverables':
        return (
          <RevealSection key="deliverables" className="pb-16 md:pb-24 lg:pb-28">
            <ServiceDeliverables
              variant={layout.deliverablesVariant}
              deliverablesTitle={page.deliverablesTitle}
              navLabel={page.navLabel}
              deliverables={page.deliverables}
            />
          </RevealSection>
        );

      case 'fitPanel':
        return (
          <RevealSection key="fitPanel" className="pb-16 md:pb-24 lg:pb-28">
            <ServiceFitPanel
              variant={layout.fitPanelVariant}
              bestFitTitle={page.bestFitTitle}
              bestFitItems={page.bestFitItems}
              notFitTitle={page.notFitTitle}
              notFitItems={page.notFitItems}
            />
          </RevealSection>
        );

      case 'process':
        return (
          <RevealSection key="process" className="pb-16 md:pb-24 lg:pb-28">
            <ServiceProcess
              variant={layout.processVariant}
              processTitle={page.processTitle}
              processSteps={page.processSteps}
            />
          </RevealSection>
        );

      case 'faq':
        return (
          <RevealSection key="faq" className="pb-16 md:pb-24 lg:pb-28" id="faq">
            <ServiceFaq
              faqTitle={page.faqTitle}
              navLabel={page.navLabel}
              faqs={page.faqs}
            />
          </RevealSection>
        );

      case 'featuredWorkGrid':
        return proofExamples.length > 0 ? (
          <RevealSection key="featuredWorkGrid" className="pb-16 md:pb-24 lg:pb-28">
            <ServiceFeaturedWorkGrid
              proofExamples={proofExamples}
              labels={labels}
              onOpenClip={openProofClip}
            />
          </RevealSection>
        ) : null;

      case 'ctaCloser':
        return (
          <RevealSection key="ctaCloser" className="svc-cta-closer py-20 md:py-28 lg:py-32">
            <ServiceCtaCloser
              variant={layout.ctaVariant}
              ctaTitle={page.ctaTitle}
              ctaText={page.ctaText}
              labels={labels}
            />
          </RevealSection>
        );

      case 'related':
        return (
          <RevealSection key="related" className="py-16 md:py-24 lg:py-28">
            <ServiceRelated
              relatedTitle={page.relatedTitle}
              relatedServiceIds={page.relatedServiceIds}
              relatedPages={relatedPages}
              labels={labels}
              locale={locale}
            />
          </RevealSection>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <PageSeo
        title={page.metaTitle}
        description={page.metaDescription}
        canonical={canonical}
        locale={locale}
        alternates={{
          es: buildUrl(getServicePath(serviceId, 'es')),
          en: buildUrl(getServicePath(serviceId, 'en')),
          xDefault: buildUrl(getServicePath(serviceId, 'es')),
        }}
        structuredData={schema}
      />

      <div className="min-h-screen bg-background">
        <Navbar compactMobile />

        <main>
          {layout.sectionOrder.map(renderSection)}
        </main>

        {activeProofItem && (
          <ServiceProofTheater
            activeProofItem={activeProofItem}
            theaterSources={theaterSources}
            isMobileViewport={isMobileViewport}
            labels={labels}
            navLabel={page.navLabel}
            onClose={closeProofTheater}
            onNavigate={navigateProofTheater}
          />
        )}

        <Footer />

        <Suspense fallback={null}>
          <FloatingContactDock />
        </Suspense>
      </div>
    </>
  );
};

export default ServiceLandingPage;
