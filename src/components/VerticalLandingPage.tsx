import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { VerticalPageId, SiteLocale } from '@/lib/locale-path';
import { getHomePath, getHomeSectionHref, getVerticalPath, getServicePath } from '@/lib/locale-path';
import { getVerticalPageContent } from '@/data/vertical-pages';
import { getServicePageContent, getRelatedServiceSummaries } from '@/data/service-pages';
import { LEGACY_REEL_CLIPS } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import PageSeo from '@/components/PageSeo';
import TheaterVideo from '@/components/media/TheaterVideo';

const FloatingContactDock = lazy(() => import('@/components/FloatingContactDock'));
const ServicesMarqueeSection = lazy(() => import('@/components/ServicesMarquee'));

const SITE_URL = 'https://www.giselasaldarriaga.com';
const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/573043786101';
const SERVICE_POSTER_BASE_PATH = '/uploads/videos/service-posters';

const buildUrl = (pathname: string) => new URL(pathname, SITE_URL).toString();
const clipMap = new Map([...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS].map((clip) => [clip.id, clip]));
const formatDuration = (seconds?: number) => (seconds ? `${Math.round(seconds)}s` : null);
const getHighQualityServicePosterSrc = (mainSrc: string, fallbackSrc: string) => {
  const filename = mainSrc.split('/').pop();
  if (!filename) return fallbackSrc;
  const decodedFilename = decodeURIComponent(filename);
  const baseName = decodedFilename.replace(/\.[^.]+$/u, '');
  if (!baseName) return fallbackSrc;
  return `${SERVICE_POSTER_BASE_PATH}/${encodeURIComponent(baseName)}.jpg`;
};

type VerticalLandingPageProps = {
  verticalId: VerticalPageId;
  locale: SiteLocale;
};

const localeLabels = {
  es: {
    home: 'Inicio',
    verticals: 'Verticales',
    startProject: 'Empezar proyecto',
    openSample: 'Ver muestra',
    theWork: 'El trabajo',
    whatYouGet: 'Lo que recibes',
    isThisForYou: '¿Es para ti?',
    yes: 'Sí, si',
    no: 'No, si',
    howItWorks: 'Así funciona',
    faq: 'Preguntas',
    relatedServices: 'Servicios relacionados',
    previewClose: 'Cerrar vista previa',
    previewPrev: 'Clip anterior',
    previewNext: 'Siguiente clip',
  },
  en: {
    home: 'Home',
    verticals: 'Verticals',
    startProject: 'Start a project',
    openSample: 'View sample',
    theWork: 'The work',
    whatYouGet: 'What you get',
    isThisForYou: 'Is this for you?',
    yes: 'Yes, if',
    no: 'Not ideal if',
    howItWorks: 'How it works',
    faq: 'Questions',
    relatedServices: 'Related services',
    previewClose: 'Close preview',
    previewPrev: 'Previous clip',
    previewNext: 'Next clip',
  },
} as const;

/* ── Scroll-reveal hook (IntersectionObserver, CSS-only) ── */
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
      { rootMargin: '0px 0px -40px 0px', threshold: 0.06 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}

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

const VerticalLandingPage = ({ verticalId, locale }: VerticalLandingPageProps) => {
  const page = getVerticalPageContent(verticalId, locale);
  const labels = localeLabels[locale];
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

  const theaterSources = useMemo(() => {
    const clip = activeProofItem?.clip;
    if (!clip) return [];
    const preferred = [clip.mainSrc, clip.mobileSrc, clip.previewSrc];
    return preferred.filter((s, i, a): s is string => !!s && a.indexOf(s) === i);
  }, [activeProofItem]);

  /* ── Viewport listener ── */
  useEffect(() => {
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

  /* ── Keyboard nav ── */
  useEffect(() => {
    if (!isProofTheaterOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); closeProofTheater(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); navigateProofTheater(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); navigateProofTheater(-1); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [closeProofTheater, isProofTheaterOpen, navigateProofTheater]);

  /* ── Body scroll lock ── */
  useEffect(() => {
    if (!isProofTheaterOpen) return;
    const scrollY = window.scrollY;
    const html = document.documentElement;
    const prev = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
      overscrollBehavior: document.body.style.overscrollBehavior,
    };
    const prevHtml = { overflow: html.style.overflow, overscrollBehavior: html.style.overscrollBehavior, scrollBehavior: html.style.scrollBehavior };
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    html.dataset.theater = 'open';
    return () => {
      delete html.dataset.theater;
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.left = prev.left;
      document.body.style.right = prev.right;
      document.body.style.width = prev.width;
      document.body.style.overflow = prev.overflow;
      document.body.style.overscrollBehavior = prev.overscrollBehavior;
      html.style.overflow = prevHtml.overflow;
      html.style.overscrollBehavior = prevHtml.overscrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollY);
      html.style.scrollBehavior = prevHtml.scrollBehavior;
    };
  }, [isProofTheaterOpen]);

  /* ── Schema.org ── */
  const schema = useMemo(() => {
    const breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: labels.home, item: homeCanonical },
      { '@type': 'ListItem', position: 2, name: labels.verticals, item: homeCanonical },
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
      uploadDate: clip.publishedAt ?? '2026-03-23',
      inLanguage: clip.language ?? locale,
      creator: { '@id': `${SITE_URL}/#person` },
    }));
    return {
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: page.metaTitle, description: page.metaDescription, dateModified: '2026-03-24', inLanguage: locale, isPartOf: { '@id': `${homeCanonical}#website` }, breadcrumb: { '@id': `${canonical}#breadcrumb` }, mainEntity: { '@id': `${canonical}#service` } },
        { '@type': 'BreadcrumbList', '@id': `${canonical}#breadcrumb`, itemListElement: breadcrumbItems },
        { '@type': 'Service', '@id': `${canonical}#service`, name: page.navLabel, serviceType: page.navLabel, description: page.metaDescription, url: canonical, provider: { '@type': 'ProfessionalService', '@id': `${SITE_URL}/#business`, name: 'Gisela Saldarriaga UGC Studio', url: `${SITE_URL}/`, telephone: '+57-304-378-6101', availableLanguage: ['es', 'en'] }, areaServed: [{ '@type': 'Country', name: 'United States' }, { '@type': 'Country', name: 'Spain' }, { '@type': 'Place', name: 'Latin America' }], availableLanguage: ['es', 'en'], audience: { '@type': 'Audience', audienceType: locale === 'es' ? 'Marcas globales' : 'Global brands' } },
        { '@type': 'FAQPage', '@id': `${canonical}#faq`, inLanguage: locale, mainEntity: page.faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
        ...videoObjects,
      ],
    };
  }, [canonical, homeCanonical, labels.home, labels.verticals, locale, page.breadcrumbLabel, page.faqs, page.metaDescription, page.metaTitle, page.navLabel, proofExamples]);

  const leadProof = proofExamples[0] ?? null;
  const handlePosterError = useCallback(
    (fallbackSrc: string) => (event: SyntheticEvent<HTMLImageElement>) => {
      const image = event.currentTarget;
      image.onerror = null;
      image.src = fallbackSrc;
    },
    [],
  );

  return (
    <>
      <PageSeo
        title={page.metaTitle}
        description={page.metaDescription}
        canonical={canonical}
        locale={locale}
        alternates={{
          es: buildUrl(getVerticalPath(verticalId, 'es')),
          en: buildUrl(getVerticalPath(verticalId, 'en')),
          xDefault: buildUrl(getVerticalPath(verticalId, 'es')),
        }}
        structuredData={schema}
      />

      <div className="min-h-screen bg-background">
        <Navbar compactMobile />

        <main>
          {isMobileViewport ? (
            <>
              {/* ╔══════════════════════════════════════════════════════════╗
                  ║  MOBILE — App-like experience (< 768px)                ║
                  ╚══════════════════════════════════════════════════════════╝ */}
              <div>

            {/* ── M1: APP HERO ── */}
            <section className="stm-hero">
              {leadProof ? (
                <button
                  type="button"
                  className="stm-hero-poster"
                  onClick={() => openProofClip(0)}
                  aria-label={`${labels.openSample}: ${leadProof.example.title}`}
                >
                  <img
                    src={getHighQualityServicePosterSrc(leadProof.clip.mainSrc, leadProof.clip.posterSrc)}
                    className="stm-hero-poster-img"
                    alt=""
                    aria-hidden="true"
                    decoding="async"
                    fetchPriority="high"
                    onError={handlePosterError(leadProof.clip.posterSrc)}
                  />
                  <div className="stm-hero-poster-overlay" />
                  <div className="st-play-btn">
                    <Play className="h-5 w-5 ml-0.5" />
                  </div>
                </button>
              ) : (
                <div className="stm-hero-poster stm-hero-poster--empty" />
              )}

              <div className="stm-hero-bottom">
                <p className="st-eyebrow st-eyebrow--light mb-2">{page.heroEyebrow}</p>
                <h1 className="stm-hero-title">{page.heroTitle}</h1>
                <p className="stm-hero-hook">{page.heroSummary}</p>
              </div>

              <nav className="sr-only" aria-label="Breadcrumb">
                <Link to={getHomePath(locale)}>{labels.home}</Link>
                <span>/</span>
                <span>{labels.verticals}</span>
                <span>/</span>
                <span>{page.breadcrumbLabel}</span>
              </nav>
            </section>

            {/* ── M2: SWIPEABLE PROOF GALLERY ── */}
            {proofExamples.length > 0 && (
              <section className="stm-reel">
                <p className="st-eyebrow px-5 mb-4">{labels.theWork}</p>
                <h2 className="sr-only">{page.featuredTitle}</h2>
                <div className="stm-reel-track scrollbar-hide">
                  {proofExamples.map(({ example, clip }, index) => {
                    const duration = formatDuration(clip.durationSeconds);
                    const posterSrc = getHighQualityServicePosterSrc(clip.mainSrc, clip.posterSrc);
                    return (
                      <button
                        key={example.clipId}
                        type="button"
                        onClick={() => openProofClip(index)}
                        aria-label={`${labels.openSample}: ${example.title}`}
                        className="stm-reel-card"
                      >
                        <div className="stm-reel-card-media">
                          <img
                            src={posterSrc}
                            className="stm-reel-card-img"
                            alt=""
                            aria-hidden="true"
                            decoding="async"
                            loading="lazy"
                            onError={handlePosterError(clip.posterSrc)}
                          />
                          <div className="stm-reel-card-gradient" />
                          <div className="st-play-btn st-play-btn--small">
                            <Play className="h-3.5 w-3.5 ml-0.5" />
                          </div>
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

            {/* ── M3: COMPACT INFO ACCORDION ── */}
            <section className="stm-info">
              <details className="stm-accordion">
                <summary className="stm-accordion-trigger">
                  <span>{labels.whatYouGet}</span>
                  <span className="stm-accordion-icon" aria-hidden="true" />
                </summary>
                <div className="stm-accordion-body">
                  <h2 className="sr-only">{page.deliverablesTitle}</h2>
                  {page.deliverables.map((item) => (
                    <div key={item.title} className="stm-spec-item">
                      <h3 className="stm-spec-name">{item.title}</h3>
                      <p className="stm-spec-desc">{item.description}</p>
                    </div>
                  ))}
                </div>
              </details>

              <details className="stm-accordion">
                <summary className="stm-accordion-trigger">
                  <span>{labels.howItWorks}</span>
                  <span className="stm-accordion-icon" aria-hidden="true" />
                </summary>
                <div className="stm-accordion-body">
                  <h2 className="sr-only">{page.processTitle}</h2>
                  {page.processSteps.map((step, i) => (
                    <div key={step.title} className="stm-step">
                      <span className="stm-step-num">{i + 1}</span>
                      <div>
                        <h3 className="stm-step-name">{step.title}</h3>
                        <p className="stm-spec-desc">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </details>

              <details className="stm-accordion">
                <summary className="stm-accordion-trigger">
                  <span>{labels.isThisForYou}</span>
                  <span className="stm-accordion-icon" aria-hidden="true" />
                </summary>
                <div className="stm-accordion-body">
                  <p className="stm-fit-heading stm-fit-heading--yes">{labels.yes}</p>
                  {page.bestFitItems.map((item) => (
                    <p key={item} className="stm-fit-item stm-fit-item--yes">{item}</p>
                  ))}
                  <p className="stm-fit-heading stm-fit-heading--no">{labels.no}</p>
                  {page.notFitItems.map((item) => (
                    <p key={item} className="stm-fit-item stm-fit-item--no">{item}</p>
                  ))}
                </div>
              </details>

              <details className="stm-accordion">
                <summary className="stm-accordion-trigger">
                  <span>{labels.faq}</span>
                  <span className="stm-accordion-icon" aria-hidden="true" />
                </summary>
                <div className="stm-accordion-body">
                  <h2 className="sr-only">{page.faqTitle}</h2>
                  {page.faqs.map((faq) => (
                    <details key={faq.question} className="stm-faq-item">
                      <summary className="stm-faq-q">{faq.question}</summary>
                      <p className="stm-faq-a">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </details>

              <div className="stm-quote-block">
                <p className="stm-quote">{page.sectionIntroText}</p>
              </div>
            </section>

            {/* ── M4: RELATED SERVICES ── */}
            {page.relatedServiceIds.length > 0 && (
              <section className="stm-related">
                <p className="st-eyebrow px-5 mb-3">{labels.relatedServices}</p>
                <div className="stm-all-services">
                  {page.relatedServiceIds.map((serviceId) => {
                    const servicePage = getServicePageContent(serviceId, locale);
                    return (
                      <Link key={serviceId} to={getServicePath(serviceId, locale)} className="stm-service-row">
                        <span className="stm-service-label">{servicePage.navLabel}</span>
                        <span className="stm-service-arrow">&rarr;</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── M5: MOBILE CTA ── */}
            <section className="stm-cta">
              <p className="stm-cta-text">{page.ctaText}</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="st-cta-primary st-cta-primary--lg stm-cta-btn">
                {labels.startProject}
              </a>
              <p className="mt-4 text-xs text-foreground/40">{locale === 'es' ? 'Última actualización: 24 mar 2026' : 'Last updated: Mar 24, 2026'}</p>
            </section>

            <div className="stm-sticky-bar">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="stm-sticky-btn">
                {labels.startProject}
              </a>
            </div>

              <Suspense fallback={null}>
                <ServicesMarqueeSection liteMobile />
              </Suspense>
              </div>
            </>
          ) : (
            <>
              {/* ╔══════════════════════════════════════════════════════════╗
                  ║  DESKTOP — Screen Test editorial layout (>= 768px)      ║
                  ╚══════════════════════════════════════════════════════════╝ */}
              <div>

            {/* ── D1: COLD OPEN ── */}
            <section className="st-hero">
              <div className="st-container">
                <nav className="st-breadcrumb" aria-label="Breadcrumb">
                  <Link to={getHomePath(locale)}>{labels.home}</Link>
                  <span aria-hidden="true">/</span>
                  <span>{labels.verticals}</span>
                  <span aria-hidden="true">/</span>
                  <span>{page.breadcrumbLabel}</span>
                </nav>
                <div className="st-hero-split">
                  <div className="st-hero-text">
                    <p className="st-eyebrow">{page.heroEyebrow}</p>
                    <h1 className="st-hero-title">{page.heroTitle}</h1>
                    <p className="st-hero-hook">{page.heroSummary}</p>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="st-cta-primary">{labels.startProject}</a>
                  </div>
                  {leadProof && (
                    <div className="st-hero-media">
                      <button type="button" className="st-letterbox group" onClick={() => openProofClip(0)} aria-label={`${labels.openSample}: ${leadProof.example.title}`}>
                        <img
                          src={getHighQualityServicePosterSrc(leadProof.clip.mainSrc, leadProof.clip.posterSrc)}
                          className="st-letterbox-img"
                          alt=""
                          aria-hidden="true"
                          decoding="async"
                          fetchPriority="high"
                          onError={handlePosterError(leadProof.clip.posterSrc)}
                        />
                        <div className="st-play-btn"><Play className="h-5 w-5 ml-0.5" /></div>
                        <div className="st-letterbox-caption">
                          <span className="st-chip">{page.navLabel}</span>
                          {formatDuration(leadProof.clip.durationSeconds) && <span className="st-chip">{formatDuration(leadProof.clip.durationSeconds)}</span>}
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ── D2: THE BRIEF ── */}
            <RevealSection className="st-section st-section--tight st-section--warm">
              <div className="st-container">
                <div className="st-brief-grid">
                  <div className="st-brief-statement">
                    <p className="st-pullquote">{page.sectionIntroText}</p>
                    <div className="st-market-strip">
                      {page.marketItems.map((item, i) => (
                        <span key={item}>{i > 0 && <span className="st-middot" aria-hidden="true">&middot;</span>}{item}</span>
                      ))}
                    </div>
                  </div>
                  <div className="st-spec-sheet">
                    <p className="st-eyebrow mb-6">{labels.whatYouGet}</p>
                    <h2 className="sr-only">{page.deliverablesTitle}</h2>
                    <div className="st-spec-list">
                      {page.deliverables.map((item) => (
                        <div key={item.title} className="st-spec-row">
                          <h3 className="st-spec-title">{item.title}</h3>
                          <p className="st-spec-desc">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>

            {/* ── D3: THE PROOF ── */}
            {proofExamples.length > 0 && (
              <RevealSection className="st-proof-wall" id="examples">
                <div className="st-container">
                  <p className="st-eyebrow mb-10">{labels.theWork}</p>
                  <h2 className="sr-only">{page.featuredTitle}</h2>
                  <div className="st-proof-gallery">
                    {proofExamples.map(({ example, clip }, index) => {
                      const duration = formatDuration(clip.durationSeconds);
                      const posterSrc = getHighQualityServicePosterSrc(clip.mainSrc, clip.posterSrc);
                      return (
                        <article key={example.clipId} className={`st-proof-column st-proof-column--${(index % 3) + 1}`}>
                          <button
                            type="button"
                            onClick={() => openProofClip(index)}
                            aria-label={`${labels.openSample}: ${example.title}`}
                            className="st-proof-column-trigger group"
                          >
                            <div className="st-proof-stage">
                              <img
                                src={posterSrc}
                                className="st-proof-stage-poster"
                                alt=""
                                aria-hidden="true"
                                decoding="async"
                                loading="lazy"
                                onError={handlePosterError(clip.posterSrc)}
                              />
                              <div className="st-proof-stage-overlay" />
                              <div className="st-play-btn st-play-btn--proof">
                                <Play className="h-4 w-4 ml-0.5" />
                              </div>
                            </div>

                            <div className="st-proof-copy">
                              <h3 className="st-proof-headline">{example.title}</h3>
                              <p className="st-proof-body">{example.description}</p>
                              <div className="st-proof-meta">
                                {duration && <span className="st-proof-meta-chip">{duration}</span>}
                                {clip.language && <span className="st-proof-meta-chip">{clip.language === 'es' ? 'Español' : 'English'}</span>}
                              </div>
                            </div>
                          </button>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </RevealSection>
            )}

            {/* ── D4: THE PROCESS ── */}
            <RevealSection className="st-section st-section--warm">
              <div className="st-container">
                <p className="st-eyebrow mb-4">{labels.howItWorks}</p>
                <h2 className="st-section-title mb-14">{page.processTitle}</h2>
                <div className="st-process-row">
                  {page.processSteps.map((step, index) => (
                    <article key={step.title} className="st-process-block">
                      <div className="st-process-accent" aria-hidden="true" />
                      <span className="st-process-num">{String(index + 1).padStart(2, '0')}</span>
                      <h3 className="st-process-step-title">{step.title}</h3>
                      <p className="st-process-step-desc">{step.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* ── D5: THE FILTER ── */}
            <RevealSection className="st-section st-section--wide">
              <div className="st-container">
                <p className="st-eyebrow mb-4">{labels.isThisForYou}</p>
                <h2 className="st-section-title mb-14">{page.navLabel}</h2>
                <div className="st-fit-grid">
                  <div className="st-fit-yes">
                    <p className="st-fit-label st-fit-label--yes">{labels.yes}</p>
                    <ul className="st-fit-list">
                      {page.bestFitItems.map((item) => (
                        <li key={item} className="st-fit-item"><span className="st-fit-dash st-fit-dash--teal" aria-hidden="true">&mdash;</span><span>{item}</span></li>
                      ))}
                    </ul>
                  </div>
                  <div className="st-fit-no">
                    <p className="st-fit-label st-fit-label--no">{labels.no}</p>
                    <ul className="st-fit-list">
                      {page.notFitItems.map((item) => (
                        <li key={item} className="st-fit-item st-fit-item--muted"><span className="st-fit-dash" aria-hidden="true">&mdash;</span><span>{item}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="st-faq" id="faq">
                  <p className="st-eyebrow mb-8">{labels.faq}</p>
                  <h2 className="sr-only">{page.faqTitle}</h2>
                  {page.faqs.map((faq, index) => (
                    <details key={faq.question} className={`st-faq-item ${index > 0 ? 'st-faq-item--bordered' : ''}`}>
                      <summary className="st-faq-question">{faq.question}</summary>
                      <p className="st-faq-answer">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </RevealSection>

            {/* ── D6: THE CLOSE ── */}
            <RevealSection className="st-close">
              <div className="st-container st-close-inner">
                <p className="st-close-text">{page.ctaText}</p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="st-cta-primary st-cta-primary--lg">{labels.startProject}</a>
                <p className="mt-6 text-xs text-foreground/40">{locale === 'es' ? 'Última actualización: 24 mar 2026' : 'Last updated: Mar 24, 2026'}</p>
                {relatedPages.length > 0 && (
                  <div className="st-related">
                    <p className="st-eyebrow mb-5">{labels.relatedServices}</p>
                    {page.relatedServiceIds.map((relatedId, index) => {
                      const rel = relatedPages[index];
                      if (!rel) return null;
                      return (
                        <Link key={relatedId} to={getServicePath(relatedId, locale)} className="st-related-row group">
                          <span className="st-related-title">{rel.title}</span>
                          <span className="st-related-arrow">&rarr;</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </RevealSection>

              <Suspense fallback={null}>
                <ServicesMarqueeSection liteMobile />
              </Suspense>
              </div>
            </>
          )}
        </main>

        {/* ── Theater overlay (shared) ── */}
        {activeProofItem && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4" onClick={closeProofTheater}>
            <div className="absolute inset-0 backdrop-blur-[6px] md:backdrop-blur-[10px]" style={{ backgroundColor: 'hsl(var(--theater-backdrop) / 0.74)' }} />
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 14%, hsl(var(--theater-backdrop-glow) / 0.14) 0%, transparent 48%), radial-gradient(circle at 82% 86%, hsl(var(--theater-backdrop-glow) / 0.1) 0%, transparent 56%)' }} />
            <div className="relative w-full max-w-[430px]">
              <button type="button" className="theater-control absolute left-0 top-1/2 -translate-x-[118%] -translate-y-1/2 z-[220] h-9 w-9 md:h-10 md:w-10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigateProofTheater(-1); }} aria-label={labels.previewPrev}><ChevronLeft className="h-4 w-4 md:h-5 md:w-5" /></button>
              <button type="button" className="theater-control absolute right-0 top-1/2 translate-x-[118%] -translate-y-1/2 z-[220] h-9 w-9 md:h-10 md:w-10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigateProofTheater(1); }} aria-label={labels.previewNext}><ChevronRight className="h-4 w-4 md:h-5 md:w-5" /></button>
              <div className="relative w-full overflow-hidden rounded-[1.45rem] border border-[hsl(var(--theater-edge)/0.88)] bg-black shadow-[0_34px_82px_-38px_rgba(0,0,0,0.78)]" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="theater-control absolute right-3 top-3 z-30 h-9 w-9" onClick={(e) => { e.preventDefault(); e.stopPropagation(); closeProofTheater(); }} aria-label={labels.previewClose}><X className="h-4 w-4" /></button>
                <div className="relative">
                  <TheaterVideo
                    sources={theaterSources}
                    poster={getHighQualityServicePosterSrc(activeProofItem.clip.mainSrc, activeProofItem.clip.posterSrc)}
                    enableStartupFallback={isMobileViewport}
                    startupFallbackMs={isMobileViewport ? 300 : 420}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
                    <div className="h-36 bg-gradient-to-t from-black/80 via-black/28 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-5 sm:pb-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="theater-meta-chip inline-flex max-w-[78%] items-center rounded-full px-2.5 py-1">{page.navLabel}</p>
                        {formatDuration(activeProofItem.clip.durationSeconds) && <p className="theater-meta-chip inline-flex items-center rounded-full px-2.5 py-1">{formatDuration(activeProofItem.clip.durationSeconds)}</p>}
                      </div>
                      <h4 className="theater-meta-title mt-2 max-w-[88%] text-base leading-snug sm:text-lg">{activeProofItem.example.title}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <SiteFooter />
        <Suspense fallback={null}><FloatingContactDock /></Suspense>
      </div>
    </>
  );
};

export default VerticalLandingPage;
