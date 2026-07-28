import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import type { VerticalPageId, SiteLocale } from '@/lib/locale-path';
import { getHomePath, getHomeSectionHref, getVerticalPath, getServicePath } from '@/lib/locale-path';
import type { VerticalLandingRouteData } from '@/data/landing-route-types';
import { getPosterVariantSrc, LEGACY_REEL_CLIPS, servicePosterSrcFromMain } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import PageSeo from '@/components/PageSeo';
import MediaTheater from '@/components/media/MediaTheater';
import AutoplayPreviewVideo from '@/components/media/AutoplayPreviewVideo';
import ResponsivePosterImage from '@/components/media/ResponsivePosterImage';
import { RevealSection } from '@/components/motion/RevealSection';
import { createClipPlaybackCandidates } from '@/lib/media-assets';
import { useMediaIntent } from '@/hooks/use-media-intent';
import FloatingContactDock from '@/components/FloatingContactDock';
import DeferredServicesMarquee from '@/components/DeferredServicesMarquee';
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

type VerticalLandingPageProps = {
  verticalId: VerticalPageId;
  locale: SiteLocale;
  routeData: VerticalLandingRouteData;
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


const serializeRouteData = (routeData: VerticalLandingRouteData) =>
  JSON.stringify(routeData).replace(/</g, '\\u003c');

const VerticalLandingPage = ({
  verticalId,
  locale,
  routeData,
}: VerticalLandingPageProps) => {
  const { page, relatedPages, relatedServices } = routeData;
  const labels = localeLabels[locale];

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
      <script
        id="route-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: serializeRouteData(routeData) }}
      />

      <div className="min-h-screen bg-background">
        <Navbar compactMobile />

        <main>
          {/* Responsive CSS selects one stable prerendered shell. Keeping the
              DOM shape constant prevents a full route replacement during
              hydration and device rotation. */}
          <div className="viewport-layout viewport-layout--mobile">
            {/* ╔══════════════════════════════════════════════════════════╗
                ║  MOBILE — App-like experience (< 768px)                ║
                ╚══════════════════════════════════════════════════════════╝ */}

            {/* ── M1: APP HERO ── */}
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

              <div className="stm-hero-bottom">
                <p className="st-eyebrow st-eyebrow--light mb-2">{page.heroEyebrow}</p>
                <h1 className="stm-hero-title stm-hero-title--reveal">
                  {page.heroTitle}
                </h1>
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
                  {relatedServices.map((service) => (
                    <Link
                      key={service.id}
                      to={getServicePath(service.id, locale)}
                      className="stm-service-row"
                    >
                      <span className="stm-service-label">{service.navLabel}</span>
                      <span className="stm-service-arrow">&rarr;</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── M5: MOBILE CTA ── */}
            <section className="stm-cta">
              <p className="stm-cta-text">{page.ctaText}</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="st-cta-primary st-cta-primary--lg stm-cta-btn">
                {labels.startProject}
              </a>
              <p className="mt-4 text-xs text-foreground/70">{locale === 'es' ? 'Última actualización: 24 mar 2026' : 'Last updated: Mar 24, 2026'}</p>
            </section>

            <div className="stm-sticky-bar">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="stm-sticky-btn">
                {labels.startProject}
              </a>
            </div>

          </div>

          <div className="viewport-layout viewport-layout--desktop">
            {/* ╔══════════════════════════════════════════════════════════╗
                ║  DESKTOP — Screen Test editorial layout (>= 768px)      ║
                ╚══════════════════════════════════════════════════════════╝ */}

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
                      <button
                        type="button"
                        className="st-letterbox group"
                        onClick={() => openProofClip(0)}
                        aria-label={`${page.navLabel}, ${formatDuration(leadProof.clip.durationSeconds)}. ${labels.openSample}: ${leadProof.example.title}`}
                      >
                        <ResponsivePosterImage
                          clip={leadProof.clip}
                          className="st-letterbox-img"
                          alt=""
                          decoding="async"
                          loading="eager"
                          fetchpriority="high"
                          sizes="(min-width: 768px) 44vw, 1px"
                          media="(min-width: 768px)"
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
                            className="st-proof-column-trigger group"
                          >
                            <span className="sr-only">{labels.openSample}</span>
                            <div className="st-proof-stage">
                              <ResponsivePosterImage
                                clip={clip}
                                className="st-proof-stage-poster"
                                alt=""
                                loading="lazy"
                                sizes="(min-width: 768px) 28vw, 1px"
                                media="(min-width: 768px)"
                                aria-hidden="true"
                                decoding="async"
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
                <p className="mt-6 text-xs text-foreground/70">{locale === 'es' ? 'Última actualización: 24 mar 2026' : 'Last updated: Mar 24, 2026'}</p>
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

          </div>

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

export default VerticalLandingPage;
