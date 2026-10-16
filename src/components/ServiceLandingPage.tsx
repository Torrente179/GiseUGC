import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type SyntheticEvent } from 'react';
import type { ServicePageId, SiteLocale, ResourcePageId } from '@/lib/locale-path';
import { getHomePath, getServicePath } from '@/lib/locale-path';
import type { ServiceLandingRouteData } from '@/data/landing-route-types';
import { LEGACY_REEL_CLIPS, servicePosterSrcFromMain } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import PageSeo from '@/components/PageSeo';
import MediaTheater from '@/components/media/MediaTheater';
import ResponsivePosterImage from '@/components/media/ResponsivePosterImage';
import { createClipPlaybackCandidates } from '@/lib/media-assets';
import { useMediaIntent } from '@/hooks/use-media-intent';
import FloatingContactDock from '@/components/FloatingContactDock';
import DeferredServicesMarquee from '@/components/DeferredServicesMarquee';
import ServicePageInner from '@/components/ServicePageInner';
import WantCta from '@/components/service-keynote/WantCta';
import { ServiceHeroDesktop, ServiceHeroMobile } from '@/components/service-hero/ServiceHero';
import { CONTENT_DATES } from '@/data/content-dates';
import { innerSectionSchema } from '@/lib/service-inner-argument';
import { serializeRouteDataJson } from '@/lib/inline-copy-links';
import { FIVERR_AGGREGATE_RATING } from '@/data/site-proof';
import '@/styles/templates.css';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const SITE_URL = 'https://www.giselasaldarriaga.com';

const buildUrl = (pathname: string) => new URL(pathname, SITE_URL).toString();
const clipMap = new Map([...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS].map((clip) => [clip.id, clip]));
const formatDuration = (seconds?: number) => (seconds ? `${Math.round(seconds)}s` : null);
const getHighQualityServicePosterSrc = servicePosterSrcFromMain;
const armProofRailSnap = (event: SyntheticEvent<HTMLDivElement>) => {
  event.currentTarget.dataset.snapReady = 'true';
};

/* ── Internal linking maps ── */
const RESOURCE_LINKS: Record<SiteLocale, { id: ResourcePageId; label: string }[]> = {
  es: [
    { id: 'what-is-ugc', label: 'Qué es UGC' },
    { id: 'how-to-hire-ugc-creator', label: 'Cómo contratar una creadora UGC' },
    { id: 'how-much-ugc-creator-charge', label: 'Cuánto cobra una creadora UGC' },
    { id: 'ugc-vs-influencer-marketing', label: 'UGC vs influencer marketing' },
    { id: 'ugc-ad-formats-guide', label: 'Formatos de UGC para ads' },
  ],
  en: [
    { id: 'what-is-ugc', label: 'What is UGC' },
    { id: 'how-to-hire-ugc-creator', label: 'How to hire a UGC creator' },
    { id: 'how-much-ugc-creator-charge', label: 'How much a UGC creator charges' },
    { id: 'ugc-vs-influencer-marketing', label: 'UGC vs influencer marketing' },
    { id: 'ugc-ad-formats-guide', label: 'UGC ad formats guide' },
  ],
};

type ServiceLandingPageProps = {
  serviceId: ServicePageId;
  locale: SiteLocale;
  routeData: ServiceLandingRouteData;
};

const localeLabels = {
  es: {
    home: 'Inicio',
    services: 'Servicios',
    openSample: 'Ver muestra',
    theWork: 'El trabajo',
    whatYouGet: 'Lo que recibes',
    isThisForYou: '¿Es para ti?',
    howItWorks: 'Así funciona',
    faq: 'Preguntas',
    alsoOffered: 'También ofrezco',
    moreServices: 'Más servicios',
    byIndustry: 'Por industria',
    resources: 'Recursos',
    explore: 'Seguir explorando',
    exploreKicker: 'Explorar',
    previewClose: 'Cerrar vista previa',
    previewPrev: 'Clip anterior',
    previewNext: 'Siguiente clip',
    show: 'Mostrar',
    reviewSource: 'reseña en Fiverr',
    fiverrReviews: 'reseñas en Fiverr',
    delivery: 'entrega en 3 a 5 días hábiles',
  },
  en: {
    home: 'Home',
    services: 'Services',
    openSample: 'View sample',
    theWork: 'The work',
    whatYouGet: 'What you get',
    isThisForYou: 'Is this for you?',
    howItWorks: 'How it works',
    faq: 'Questions',
    alsoOffered: 'Also offered',
    moreServices: 'More services',
    byIndustry: 'By industry',
    resources: 'Resources',
    explore: 'Keep exploring',
    exploreKicker: 'Explore',
    previewClose: 'Close preview',
    previewPrev: 'Previous clip',
    previewNext: 'Next clip',
    show: 'Show',
    reviewSource: 'review on Fiverr',
    fiverrReviews: 'reviews on Fiverr',
    delivery: 'delivered in 3 to 5 business days',
  },
} as const;

/* ════════════════════════════════════════════════════════════════════
   SCREEN TEST — Service Landing Page
   Mobile: App-like independent experience
   Desktop: A24 × Apple editorial layout
   ════════════════════════════════════════════════════════════════════ */

const serializeRouteData = serializeRouteDataJson;

const ServiceLandingPage = ({
  serviceId,
  locale,
  routeData,
}: ServiceLandingPageProps) => {
  const {
    page,
    relatedPages,
    relevantVerticals,
    allOtherServices,
    heroReview,
  } = routeData;
  const labels = localeLabels[locale];

  const canonical = buildUrl(page.path);
  const homeCanonical = buildUrl(getHomePath(locale));
  const resourceLinks = RESOURCE_LINKS[locale];

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
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  const activeProofItem = useMemo(
    () => (activeProofIndex === null ? null : proofExamples[activeProofIndex] ?? null),
    [activeProofIndex, proofExamples],
  );
  const isProofTheaterOpen = activeProofItem !== null;
  const mediaIntent = useMediaIntent({ autoStart: true });

  const openProofClip = useCallback(
    (index: number) => {
      if (index < 0 || index >= proofExamples.length) return;
      setActiveProofIndex(index);
    },
    [proofExamples.length],
  );
  const closeProofTheater = useCallback(() => setActiveProofIndex(null), []);
  const navigateProofTheater = useCallback(
    (direction: 1 | -1) => {
      if (proofExamples.length === 0) return;
      setActiveProofIndex((prev) => {
        if (prev === null) return prev;
        return (prev + direction + proofExamples.length) % proofExamples.length;
      });
    },
    [proofExamples.length],
  );

  const theaterCandidates = useMemo(
    () => createClipPlaybackCandidates(activeProofItem?.clip, isMobileViewport),
    [activeProofItem, isMobileViewport],
  );

  /* ── Viewport listener ── */
  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobileViewport(mq.matches);
    update();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  useEffect(() => {
    if (activeProofIndex !== null && activeProofIndex >= proofExamples.length) {
      setActiveProofIndex(null);
    }
  }, [activeProofIndex, proofExamples.length]);

  /* ── Schema.org (preserved) ── */
  const schema = useMemo(() => {
    const breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: labels.home, item: homeCanonical },
      { '@type': 'ListItem', position: 2, name: labels.services, item: homeCanonical },
      { '@type': 'ListItem', position: 3, name: page.breadcrumbLabel, item: canonical },
    ];
    const videoObjects = proofExamples.map(({ example, clip }) => ({
      '@type': 'VideoObject' as const,
      '@id': `${canonical}#video-${clip.id}`,
      name: example.title,
      description: example.description,
      thumbnailUrl: clip.posterSrc,
      contentUrl: clip.mainSrc,
      ...(clip.durationSeconds ? { duration: `PT${Math.round(clip.durationSeconds)}S` } : {}),
      uploadDate: clip.publishedAt ?? '2026-03-13',
      inLanguage: clip.language ?? locale,
      creator: { '@id': `${SITE_URL}/#person` },
    }));
    return {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: page.metaTitle, description: page.metaDescription, dateModified: CONTENT_DATES.services, inLanguage: locale, isPartOf: { '@id': `${homeCanonical}#website` }, breadcrumb: { '@id': `${canonical}#breadcrumb` }, mainEntity: { '@id': `${canonical}#service` }, hasPart: innerSectionSchema(canonical, locale) },
        { '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`, itemListElement: breadcrumbItems },
        { '@type': 'Service', '@id': `${canonical}#service`, name: page.navLabel, serviceType: page.navLabel, description: page.metaDescription, url: canonical, provider: { '@type': 'ProfessionalService', '@id': `${SITE_URL}/#business`, name: 'Gisela Saldarriaga UGC Studio', url: `${SITE_URL}/`, telephone: '+57-304-378-6101', availableLanguage: ['es', 'en'] }, areaServed: [{ '@type': 'Country', name: 'United States' }, { '@type': 'Country', name: 'Spain' }, { '@type': 'Place', name: 'Latin America' }], availableLanguage: ['es', 'en'], audience: { '@type': 'Audience', audienceType: locale === 'es' ? 'Marcas globales' : 'Global brands' }, ...(page.geoFact ? { aggregateRating: FIVERR_AGGREGATE_RATING } : {}) },
        { '@type': 'FAQPage', '@id': `${canonical}#faq`, inLanguage: locale, mainEntity: page.faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
        ...videoObjects,
      ],
    };
  }, [canonical, homeCanonical, labels.home, labels.services, locale, page.breadcrumbLabel, page.faqs, page.geoFact, page.metaDescription, page.metaTitle, page.navLabel, proofExamples]);

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
      <script
        id="route-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: serializeRouteData(routeData) }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <main>
          {/* Both route shells stay mounted so hydration never replaces the
              complete page at the mobile breakpoint. CSS exposes exactly one
              layout; hidden videos remain source-free through IO + scheduler. */}
          <div className="viewport-layout viewport-layout--mobile">
            {/* ╔══════════════════════════════════════════════════════════╗
                ║  MOBILE — App-like experience (< 768px)                ║
                ╚══════════════════════════════════════════════════════════╝ */}

            {/* ── M1: APP HERO — the page's examples as a feed card ("S1 · Phone stage") ── */}
            <ServiceHeroMobile
              page={page}
              locale={locale}
              labels={labels}
              examples={proofExamples}
              review={heroReview}
              mediaIntent={mediaIntent}
              theaterOpen={isProofTheaterOpen}
              onOpen={openProofClip}
            />

            {/* ── M2: SWIPEABLE PROOF GALLERY ── */}
            {proofExamples.length > 0 && (
              <section className="stm-reel">
                <p className="st-eyebrow px-5 mb-4">{labels.theWork}</p>
                <h2 className="sr-only">{page.featuredTitle}</h2>
                <div
                  className="stm-reel-track scrollbar-hide"
                  onPointerDown={armProofRailSnap}
                  onFocusCapture={armProofRailSnap}
                  onWheel={armProofRailSnap}
                >
                  {proofExamples.map(({ example, clip }, index) => {
                    const duration = formatDuration(clip.durationSeconds);
                    return (
                      <button
                        key={example.clipId}
                        type="button"
                        onClick={() => openProofClip(index)}
                        className="stm-reel-card"
                      >
                        <span className="sr-only">{labels.openSample}</span>
                        <div
                          className="stm-reel-card-media"
                          style={{ aspectRatio: '9 / 14' }}
                        >
                          <ResponsivePosterImage
                            clip={clip}
                            className="stm-reel-card-img"
                            alt=""
                            sizes="70vw"
                            loading="lazy"
                            media="(max-width: 767px)"
                          />
                          <div className="stm-reel-card-gradient" />
                          <div className="stm-reel-card-bottom">
                            <span className="stm-reel-card-name">{example.title}</span>
                            <div className="stm-reel-card-chips">
                              {duration && <span className="st-chip">{duration}</span>}
                              {clip.language && <span className="st-chip">{clip.language === 'es' ? 'ES' : 'EN'}</span>}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── INNER — statement, offer, process, fit, FAQ, close ── */}
            <ServicePageInner
              page={page}
              labels={labels}
              locale={locale}
              relevantVerticals={relevantVerticals}
              resourceLinks={resourceLinks}
              relatedPages={relatedPages}
              allOtherServices={allOtherServices}
              reveal={false}
              variant="mobile"
            />

          </div>

          <div className="viewport-layout viewport-layout--desktop">
            {/* ╔══════════════════════════════════════════════════════════╗
                ║  DESKTOP — Screen Test editorial layout (≥ 768px)       ║
                ╚══════════════════════════════════════════════════════════╝ */}

            {/* ── D1: HERO — copy, a real review and the glass panel of examples ("S2 · Glass proof panel") ── */}
            <ServiceHeroDesktop
              page={page}
              locale={locale}
              labels={labels}
              examples={proofExamples}
              review={heroReview}
              mediaIntent={mediaIntent}
              theaterOpen={isProofTheaterOpen}
              onOpen={openProofClip}
            />

            {/* ── INNER — statement, offer, process, fit, FAQ, close ── */}
            <ServicePageInner
              page={page}
              labels={labels}
              locale={locale}
              relevantVerticals={relevantVerticals}
              resourceLinks={resourceLinks}
              relatedPages={relatedPages}
              allOtherServices={allOtherServices}
              reveal
              variant="desktop"
            />

          </div>

          {/* Shared by both responsive shells to avoid duplicate animated DOM. */}
          <DeferredServicesMarquee liteMobile />
        </main>

        {activeProofItem && (
          <MediaTheater
            candidates={theaterCandidates}
            poster={getHighQualityServicePosterSrc(activeProofItem.clip.mainSrc, activeProofItem.clip.posterSrc)}
            category={page.navLabel}
            title={activeProofItem.example.title}
            duration={formatDuration(activeProofItem.clip.durationSeconds)}
            closeLabel={labels.previewClose}
            previousLabel={labels.previewPrev}
            nextLabel={labels.previewNext}
            onClose={closeProofTheater}
            onPrevious={() => navigateProofTheater(-1)}
            onNext={() => navigateProofTheater(1)}
            action={<WantCta page={page} locale={locale} className="svc-want svc-want--sm" />}
          />
        )}

        <SiteFooter />
        <FloatingContactDock />
      </div>
    </>
  );
};

export default ServiceLandingPage;
