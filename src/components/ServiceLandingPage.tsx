import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ServicePageId, SiteLocale, ResourcePageId } from '@/lib/locale-path';
import { getHomePath, getHomeSectionHref, getServicePath, getVerticalPath, getResourcePath } from '@/lib/locale-path';
import type { ServiceLandingRouteData } from '@/data/landing-route-types';
import { getPosterVariantSrc, LEGACY_REEL_CLIPS, servicePosterSrcFromMain } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import PageSeo from '@/components/PageSeo';
import PretextLineReveal from '@/components/motion/PretextLineReveal';
import { RevealSection } from '@/components/motion/RevealSection';
import MediaTheater from '@/components/media/MediaTheater';
import AutoplayPreviewVideo from '@/components/media/AutoplayPreviewVideo';
import ResponsivePosterImage from '@/components/media/ResponsivePosterImage';
import { createClipPlaybackCandidates } from '@/lib/media-assets';
import { useMediaIntent } from '@/hooks/use-media-intent';
import FloatingContactDock from '@/components/FloatingContactDock';
import DeferredServicesMarquee from '@/components/DeferredServicesMarquee';
import { CONTENT_DATES } from '@/data/content-dates';
import '@/styles/templates.css';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const SITE_URL = 'https://www.giselasaldarriaga.com';
const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/573043786101';

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
    { id: 'ugc-vs-influencer-marketing', label: 'UGC vs influencer marketing' },
    { id: 'ugc-ad-formats-guide', label: 'Formatos de UGC para ads' },
  ],
  en: [
    { id: 'what-is-ugc', label: 'What is UGC' },
    { id: 'how-to-hire-ugc-creator', label: 'How to hire a UGC creator' },
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
    startProject: 'Empezar proyecto',
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
  },
  en: {
    home: 'Home',
    services: 'Services',
    startProject: 'Start a project',
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
  },
} as const;

const stripStepIndex = (title: string) => title.replace(/^\d+[.)]\s*/, '');

type ServicePageInnerProps = {
  page: ServiceLandingRouteData['page'];
  labels: (typeof localeLabels)[SiteLocale];
  locale: SiteLocale;
  relevantVerticals: ServiceLandingRouteData['relevantVerticals'];
  resourceLinks: { id: ResourcePageId; label: string }[];
  relatedPages: ServiceLandingRouteData['relatedPages'];
  allOtherServices: ServiceLandingRouteData['allOtherServices'];
  whatsappUrl: string;
  reveal: boolean;
  anchors: boolean;
  variant: 'mobile' | 'desktop';
};

type ServiceExploreProps = {
  variant: 'mobile' | 'desktop';
  labels: (typeof localeLabels)[SiteLocale];
  locale: SiteLocale;
  relevantVerticals: ServiceLandingRouteData['relevantVerticals'];
  resourceLinks: { id: ResourcePageId; label: string }[];
  allOtherServices: ServiceLandingRouteData['allOtherServices'];
};

const ServiceExplore = ({
  variant,
  labels,
  locale,
  relevantVerticals,
  resourceLinks,
  allOtherServices,
}: ServiceExploreProps) => {
  const columns = [
    relevantVerticals.length > 0 && {
      key: 'industry',
      label: labels.byIndustry,
      items: relevantVerticals.map((vertical) => ({
        key: vertical.id,
        href: getVerticalPath(vertical.id, locale),
        title: vertical.navLabel,
      })),
    },
    resourceLinks.length > 0 && {
      key: 'resources',
      label: labels.resources,
      items: resourceLinks.map((resource) => ({
        key: resource.id,
        href: getResourcePath(resource.id, locale),
        title: resource.label,
      })),
    },
    allOtherServices.length > 0 && {
      key: 'services',
      label: labels.moreServices,
      items: allOtherServices.map((service) => ({
        key: service.id,
        href: getServicePath(service.id, locale),
        title: service.navLabel,
      })),
    },
  ].filter((column): column is Exclude<typeof column, false> => Boolean(column));

  if (columns.length === 0) return null;

  if (variant === 'mobile') {
    return (
      <nav className="stm-explore" aria-label={labels.explore}>
        <h2 className="stm-explore-title">{labels.explore}</h2>
        {columns.map((column) => {
          const asRail = column.key !== 'services';
          return (
            <div key={column.key} className="stm-explore-block">
              <p className="stm-explore-sublabel">{column.label}</p>
              {asRail ? (
                <div className="stm-explore-rail scrollbar-hide">
                  {column.items.map((item) => (
                    <Link key={item.key} to={item.href} className="stm-explore-chip">
                      {item.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="stm-explore-group">
                  {column.items.map((item) => (
                    <Link key={item.key} to={item.href} className="stm-explore-row">
                      <span>{item.title}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="svc-explore" aria-label={labels.explore}>
      <div className="svc-explore-head">
        <p className="st-eyebrow svc-inner-kicker">{labels.exploreKicker}</p>
        <h2 className="svc-inner-heading font-serif">{labels.explore}</h2>
      </div>
      <div className="svc-explore-grid">
        {columns.map((column, index) => (
          <div key={column.key} className="svc-explore-col">
            <p className="svc-explore-index">
              <span>{String(index + 1).padStart(2, '0')}</span>
              {column.label}
            </p>
            {column.items.map((item) => (
              <Link key={item.key} to={item.href} className="st-related-row group">
                <span className="st-related-title">{item.title}</span>
                <span className="st-related-arrow">→</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
};

const ServicePageInner = ({
  page,
  labels,
  locale,
  relevantVerticals,
  resourceLinks,
  relatedPages,
  allOtherServices,
  whatsappUrl,
  reveal,
  anchors,
  variant,
}: ServicePageInnerProps) => {
  const Shell = reveal ? RevealSection : 'section';
  const updated = locale === 'es' ? 'Última actualización: 24 mar 2026' : 'Last updated: Mar 24, 2026';
  const hasExplore =
    relevantVerticals.length > 0 || resourceLinks.length > 0 || allOtherServices.length > 0;

  return (
    <div className="svc-inner">
      <Shell className="svc-inner-block svc-inner-block--open">
        <div className="st-container">
          <div className="svc-inner-statement">
            <h2 className="svc-inner-display font-serif">{page.sectionIntroTitle}</h2>
            <p className="svc-inner-lead">{page.sectionIntroText}</p>
          </div>
          <div className="svc-inner-rule" aria-hidden="true" />
          <p className="st-eyebrow svc-inner-kicker">{page.marketTitle}</p>
          <ul className="svc-inner-markets">
            {page.marketItems.map((item, index) => (
              <li key={item}>
                <span className="svc-inner-markets-num">{String(index + 1).padStart(2, '0')}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Shell>

      <Shell className="svc-inner-block">
        <div className="st-container">
          <p className="st-eyebrow svc-inner-kicker">{labels.whatYouGet}</p>
          <h2 className="svc-inner-heading font-serif">{page.deliverablesTitle}</h2>
          <div className="svc-offer">
            {page.deliverables.map((item, index) => (
              <article key={item.title} className="svc-offer-row">
                <span className="svc-offer-num">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="svc-offer-title font-serif">{item.title}</h3>
                <p className="svc-offer-desc">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </Shell>

      <Shell className="svc-inner-block">
        <div className="st-container">
          <div className="svc-process-layout">
            <div className="svc-process-head">
              <p className="st-eyebrow svc-inner-kicker">{labels.howItWorks}</p>
              <h2 className="svc-inner-heading font-serif">{page.processTitle}</h2>
            </div>
            <ol className="svc-process-list">
              {page.processSteps.map((step, index) => (
                <li key={step.title} className="svc-process-step">
                  <span className="svc-process-num" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="svc-process-title font-serif">{stripStepIndex(step.title)}</h3>
                    <p className="svc-process-desc">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Shell>

      <Shell className="svc-inner-block">
        <div className="st-container">
          <p className="st-eyebrow svc-inner-kicker">{labels.isThisForYou}</p>
          <h2 className="sr-only">{page.bestFitTitle}</h2>
          <div className="svc-fit-grid">
            <div className="svc-fit-col">
              <h3 className="svc-fit-label">{page.bestFitTitle}</h3>
              <ul>
                {page.bestFitItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="svc-fit-col svc-fit-col--no">
              <h3 className="svc-fit-label">{page.notFitTitle}</h3>
              <ul>
                {page.notFitItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Shell>

      <Shell className="svc-inner-block" id={anchors ? 'faq' : undefined}>
        <div className="st-container">
          <div className="svc-faq-layout">
            <div className="svc-faq-head">
              <p className="st-eyebrow svc-inner-kicker">{labels.faq}</p>
              <h2 className="svc-inner-heading font-serif">{page.faqTitle}</h2>
            </div>
            <div className="svc-faq-list">
              {page.faqs.map((faq, index) => (
                <details key={faq.question} className="svc-faq-item" {...(index === 0 ? { open: true } : {})}>
                  <summary>
                    <span>{faq.question}</span>
                    <span className="svc-faq-mark" aria-hidden="true" />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Shell>

      {hasExplore && variant === 'mobile' && (
        <ServiceExplore
          variant="mobile"
          labels={labels}
          locale={locale}
          relevantVerticals={relevantVerticals}
          resourceLinks={resourceLinks}
          allOtherServices={allOtherServices}
        />
      )}

      {hasExplore && variant === 'desktop' && (
        <Shell className="svc-inner-block">
          <div className="st-container">
            <ServiceExplore
              variant="desktop"
              labels={labels}
              locale={locale}
              relevantVerticals={relevantVerticals}
              resourceLinks={resourceLinks}
              allOtherServices={allOtherServices}
            />
          </div>
        </Shell>
      )}

      <Shell className="svc-inner-close">
        <div className="st-container svc-inner-close-grid">
          <div>
            <h2 className="svc-inner-close-title font-serif">{page.ctaTitle}</h2>
            <p className="svc-inner-close-text">{page.ctaText}</p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="st-cta-primary st-cta-primary--lg">
              {labels.startProject}
            </a>
            <p className="svc-inner-updated">{updated}</p>
          </div>
          {relatedPages.length > 0 && (
            <div>
              <p className="st-eyebrow mb-5">{labels.alsoOffered}</p>
              {page.relatedServiceIds.map((relatedId, index) => {
                const rel = relatedPages[index];
                if (!rel) return null;
                return (
                  <Link key={relatedId} to={getServicePath(relatedId, locale)} className="st-related-row group">
                    <span className="st-related-title">{rel.title}</span>
                    <span className="st-related-arrow">→</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </Shell>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════
   SCREEN TEST — Service Landing Page
   Mobile: App-like independent experience
   Desktop: A24 × Apple editorial layout
   ════════════════════════════════════════════════════════════════════ */

const serializeRouteData = (routeData: ServiceLandingRouteData) =>
  JSON.stringify(routeData).replace(/</g, '\\u003c');

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
  const mediaIntent = useMediaIntent();

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
        { '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: page.metaTitle, description: page.metaDescription, dateModified: CONTENT_DATES.services, inLanguage: locale, isPartOf: { '@id': `${homeCanonical}#website` }, breadcrumb: { '@id': `${canonical}#breadcrumb` }, mainEntity: { '@id': `${canonical}#service` } },
        { '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`, itemListElement: breadcrumbItems },
        { '@type': 'Service', '@id': `${canonical}#service`, name: page.navLabel, serviceType: page.navLabel, description: page.metaDescription, url: canonical, provider: { '@type': 'ProfessionalService', '@id': `${SITE_URL}/#business`, name: 'Gisela Saldarriaga UGC Studio', url: `${SITE_URL}/`, telephone: '+57-304-378-6101', availableLanguage: ['es', 'en'] }, areaServed: [{ '@type': 'Country', name: 'United States' }, { '@type': 'Country', name: 'Spain' }, { '@type': 'Place', name: 'Latin America' }], availableLanguage: ['es', 'en'], audience: { '@type': 'Audience', audienceType: locale === 'es' ? 'Marcas globales' : 'Global brands' } },
        { '@type': 'FAQPage', '@id': `${canonical}#faq`, inLanguage: locale, mainEntity: page.faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
        ...videoObjects,
      ],
    };
  }, [canonical, homeCanonical, labels.home, labels.services, locale, page.breadcrumbLabel, page.faqs, page.metaDescription, page.metaTitle, page.navLabel, proofExamples]);

  const leadProof = proofExamples[0] ?? null;
  const handlePosterError = useCallback(
    (fallbackSrc: string) => (event: SyntheticEvent<HTMLImageElement>) => {
      const image = event.currentTarget;
      image.onerror = null;
      image.src = fallbackSrc;
    },
    [],
  );

  /* ── Demo-card row (desktop) — hover preview + arrow scroll ── */
  const demoTrackRef = useRef<HTMLDivElement>(null);
  const [hoveredDemoIndex, setHoveredDemoIndex] = useState<number | null>(null);
  const [demoCanScrollLeft, setDemoCanScrollLeft] = useState(false);
  const [demoCanScrollRight, setDemoCanScrollRight] = useState(false);

  const updateDemoArrows = useCallback(() => {
    const el = demoTrackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setDemoCanScrollLeft(scrollLeft > 8);
    setDemoCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);
  }, []);

  const scrollDemoRow = useCallback((direction: 1 | -1) => {
    const el = demoTrackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.82, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isMobileViewport) return;
    const el = demoTrackRef.current;
    if (!el) return;
    updateDemoArrows();
    el.addEventListener('scroll', updateDemoArrows, { passive: true });
    window.addEventListener('resize', updateDemoArrows);
    return () => {
      el.removeEventListener('scroll', updateDemoArrows);
      window.removeEventListener('resize', updateDemoArrows);
    };
  }, [isMobileViewport, proofExamples.length, updateDemoArrows]);

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
        <Navbar compactMobile />

        <main>
          {/* Both route shells stay mounted so hydration never replaces the
              complete page at the mobile breakpoint. CSS exposes exactly one
              layout; hidden videos remain source-free through IO + scheduler. */}
          <div className="viewport-layout viewport-layout--mobile">
            {/* ╔══════════════════════════════════════════════════════════╗
                ║  MOBILE — App-like experience (< 768px)                ║
                ╚══════════════════════════════════════════════════════════╝ */}

            {/* ── M1: APP HERO — Full-viewport video poster ── */}
            <section className="stm-hero">
              {leadProof ? (
                <button
                  type="button"
                  className="stm-hero-poster"
                  onClick={() => openProofClip(0)}
                  aria-label={`${labels.openSample}: ${leadProof.example.title}`}
                >
                  {mediaIntent && !isProofTheaterOpen ? (
                    <AutoplayPreviewVideo
                      src={leadProof.clip.previewSrc}
                      poster={getPosterVariantSrc(leadProof.clip, 720, 'avif')}
                      className="stm-hero-poster-img"
                      aria-hidden="true"
                      preload="metadata"
                      playbackPriority="hero"
                      rootMargin="220px 0px"
                      activationQuery="(max-width: 767px)"
                    />
                  ) : (
                    <ResponsivePosterImage
                      clip={leadProof.clip}
                      className="stm-hero-poster-img"
                      alt=""
                      sizes="100vw"
                      loading="eager"
                      decoding="sync"
                      fetchpriority="high"
                      media="(max-width: 767px)"
                    />
                  )}
                  <div className="stm-hero-poster-overlay" />
                </button>
              ) : (
                <div className="stm-hero-poster stm-hero-poster--empty" />
              )}

              {/* Overlaid content at bottom */}
              <div className="stm-hero-bottom">
                <p className="st-eyebrow st-eyebrow--light mb-2">{page.heroEyebrow}</p>
                <h1 className="stm-hero-title stm-hero-title--reveal">
                  {page.heroTitle}
                </h1>
                <p className="stm-hero-hook">{page.heroSummary}</p>
              </div>

              {/* SEO breadcrumb — visually hidden on mobile */}
              <nav className="sr-only" aria-label="Breadcrumb">
                <Link to={getHomePath(locale)}>{labels.home}</Link>
                <span>/</span>
                <Link to={getHomeSectionHref(locale, 'services')}>{labels.services}</Link>
                <span>/</span>
                <span>{page.breadcrumbLabel}</span>
              </nav>
            </section>

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
              whatsappUrl={whatsappUrl}
              reveal={false}
              anchors={false}
              variant="mobile"
            />

            {/* ── STICKY WHATSAPP BAR ── */}
            <div className="stm-sticky-bar">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="stm-sticky-btn">
                {labels.startProject}
              </a>
            </div>

          </div>

          <div className="viewport-layout viewport-layout--desktop">
            {/* ╔══════════════════════════════════════════════════════════╗
                ║  DESKTOP — Screen Test editorial layout (≥ 768px)       ║
                ╚══════════════════════════════════════════════════════════╝ */}

            {/* ── D1: CINEMATIC HERO — featured clip as key-art on the right ── */}
            <section className="svc-cine-hero">
              {leadProof && (
                <div className="svc-cine-hero-bg" aria-hidden="true">
                  <ResponsivePosterImage
                    clip={leadProof.clip}
                    className="svc-cine-hero-bg-video"
                    alt=""
                    sizes="60vw"
                    loading="eager"
                    decoding="sync"
                    fetchpriority="high"
                    media="(min-width: 768px)"
                  />
                </div>
              )}
              <div className="svc-cine-hero-scrim" aria-hidden="true" />
              {leadProof && (
                <div className="svc-cine-hero-media" aria-hidden="true">
                  <span className="svc-cine-hero-media-clip">
                    {mediaIntent && !isProofTheaterOpen ? (
                      <AutoplayPreviewVideo
                        src={leadProof.clip.previewSrc}
                        poster={getPosterVariantSrc(leadProof.clip, 1080, 'avif')}
                        className="svc-cine-hero-media-video"
                        aria-hidden="true"
                        preload="metadata"
                        playbackPriority="hero"
                        rootMargin="260px 0px"
                        activationQuery="(min-width: 768px)"
                      />
                    ) : (
                      <ResponsivePosterImage
                        clip={leadProof.clip}
                        className="svc-cine-hero-media-video"
                        alt=""
                        sizes="60vw"
                        loading="eager"
                        decoding="sync"
                        fetchpriority="high"
                        media="(min-width: 768px)"
                      />
                    )}
                  </span>
                  <span className="svc-cine-hero-media-shade" aria-hidden="true" />
                </div>
              )}
              <div className="st-container svc-cine-hero-inner">
                <div className="svc-cine-hero-text">
                  <nav className="st-breadcrumb svc-cine-hero-breadcrumb" aria-label="Breadcrumb">
                    <Link to={getHomePath(locale)}>{labels.home}</Link>
                    <span aria-hidden="true">/</span>
                    <Link to={getHomeSectionHref(locale, 'services')}>{labels.services}</Link>
                    <span aria-hidden="true">/</span>
                    <span>{page.breadcrumbLabel}</span>
                  </nav>
                  <p className="st-eyebrow st-eyebrow--light">{page.heroEyebrow}</p>
                  <h1 className="svc-cine-hero-title">
                    <PretextLineReveal text={page.heroTitle} delay={0} stagger={0.1} className="block" />
                  </h1>
                  <p className="svc-cine-hero-hook">{page.heroSummary}</p>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="st-cta-primary">{labels.startProject}</a>
                </div>
              </div>

              {/* Demo cards rail — integrated at the bottom of the hero stage */}
              {proofExamples.length > 0 && (
              <div className="svc-cine-hero-rail" id="examples">
                <div className="st-container">
                  <div className="svc-cine-row-head">
                    <p className="st-eyebrow st-eyebrow--light">{labels.theWork}</p>
                    <h2 className="sr-only">{page.featuredTitle}</h2>
                    {(demoCanScrollLeft || demoCanScrollRight) && (
                      <div className="svc-cine-row-nav">
                        <button
                          type="button"
                          className="svc-cine-arrow"
                          onClick={() => scrollDemoRow(-1)}
                          disabled={!demoCanScrollLeft}
                          aria-label={labels.previewPrev}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          className="svc-cine-arrow"
                          onClick={() => scrollDemoRow(1)}
                          disabled={!demoCanScrollRight}
                          aria-label={labels.previewNext}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="svc-cine-track scrollbar-hide" ref={demoTrackRef}>
                  {proofExamples.map(({ example, clip }, index) => {
                    const duration = formatDuration(clip.durationSeconds);
                    const posterSrc = getHighQualityServicePosterSrc(clip.mainSrc, clip.posterSrc);
                    const isHovered = hoveredDemoIndex === index;
                    return (
                      <button
                        key={example.clipId}
                        type="button"
                        className="svc-cine-card group"
                        onClick={() => openProofClip(index)}
                        onMouseEnter={() => setHoveredDemoIndex(index)}
                        onMouseLeave={() => setHoveredDemoIndex((cur) => (cur === index ? null : cur))}
                        onFocus={() => setHoveredDemoIndex(index)}
                        onBlur={() => setHoveredDemoIndex((cur) => (cur === index ? null : cur))}
                      >
                        <span className="sr-only">{labels.openSample}</span>
                        <div className="svc-cine-card-media">
                          <ResponsivePosterImage
                            clip={clip}
                            className="svc-cine-card-poster"
                            alt=""
                            decoding="async"
                            loading="lazy"
                            sizes="(min-width: 768px) 28vw, 1px"
                            media="(min-width: 768px)"
                          />
                          {isHovered && (
                            <AutoplayPreviewVideo
                              src={clip.previewSrc}
                              hlsSrc={clip.previewHlsSrc}
                              poster={posterSrc}
                              className="svc-cine-card-video"
                              aria-hidden="true"
                              playbackPriority="preview"
                              rootMargin="180px 0px"
                              forcePause={isProofTheaterOpen}
                            />
                          )}
                          <div className="svc-cine-card-gradient" />
                          <div className="st-play-btn svc-cine-card-play">
                            <Play className="h-4 w-4 ml-0.5" />
                          </div>
                          <div className="svc-cine-card-bottom">
                            <span className="svc-cine-card-name">{example.title}</span>
                            <div className="svc-cine-card-chips">
                              {duration && <span className="st-chip">{duration}</span>}
                              {clip.language && <span className="st-chip">{clip.language === 'es' ? 'ES' : 'EN'}</span>}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              )}
            </section>

            {/* ── INNER — statement, offer, process, fit, FAQ, close ── */}
            <ServicePageInner
              page={page}
              labels={labels}
              locale={locale}
              relevantVerticals={relevantVerticals}
              resourceLinks={resourceLinks}
              relatedPages={relatedPages}
              allOtherServices={allOtherServices}
              whatsappUrl={whatsappUrl}
              reveal
              anchors
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
          />
        )}

        <SiteFooter />
        <FloatingContactDock />
      </div>
    </>
  );
};

export default ServiceLandingPage;
