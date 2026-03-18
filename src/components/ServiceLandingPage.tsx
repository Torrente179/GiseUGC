import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Play, X, Plus, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ServicePageId, SiteLocale } from '@/lib/locale-path';
import { getHomePath, getHomeSectionHref, getServicePath } from '@/lib/locale-path';
import { getServicePageContent, getRelatedServiceSummaries } from '@/data/service-pages';
import { LEGACY_REEL_CLIPS } from '@/data/portfolio-clips';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageSeo from '@/components/PageSeo';
import TheaterVideo from '@/components/media/TheaterVideo';

const FloatingContactDock = lazy(() => import('@/components/FloatingContactDock'));

const SITE_URL = 'https://www.giselasaldarriaga.com';
const SERVICE_HERO_BACKGROUND_SRC = '/uploads/services-hero-background.jpg';
const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/573043786101';
const fiverrUrl = import.meta.env.VITE_FIVERR_URL ?? 'https://www.fiverr.com/gisela_sm?source=gig_page';

const buildUrl = (pathname: string) => new URL(pathname, SITE_URL).toString();

const clipMap = new Map(LEGACY_REEL_CLIPS.map((clip) => [clip.id, clip]));

const formatDuration = (seconds?: number) => (seconds ? `${Math.round(seconds)}s` : null);

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
  const alternateLocale = locale === 'es' ? 'en' : 'es';
  const labels = localeLabels[locale];
  const relatedPages = getRelatedServiceSummaries(page.relatedServiceIds, locale);

  const canonical = buildUrl(page.path);
  const alternateCanonical = buildUrl(page.alternatePath);
  const homeCanonical = buildUrl(getHomePath(locale));

  const proofExamples = useMemo(
    () =>
      page.featuredExamples.flatMap((example) => {
        const clip = clipMap.get(example.clipId);
        return clip ? [{ example, clip }] : [];
      }),
    [page.featuredExamples],
  );

  /* ── Mobile deliverable expand state ── */
  const [expandedDeliverable, setExpandedDeliverable] = useState<number | null>(null);
  const toggleDeliverable = useCallback((index: number) => {
    setExpandedDeliverable((prev) => (prev === index ? null : index));
  }, []);
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
          {/* ═══════════════════════════════════════════
              1. CINEMATIC HERO — Full-bleed image
              ═══════════════════════════════════════════ */}
          <section className="svc-hero">
            {/* Background image */}
            <img
              className="svc-hero-media"
              src={SERVICE_HERO_BACKGROUND_SRC}
              alt=""
              loading="eager"
              decoding="async"
              fetchPriority="high"
              aria-hidden="true"
            />

            {/* Gradient overlay */}
            <div className="svc-hero-overlay" />

            {/* Content */}
            <div className="svc-hero-content">
              {/* Breadcrumb */}
              <nav className="svc-breadcrumb mb-8 md:mb-10 sr-only md:not-sr-only md:flex" aria-label="Breadcrumb">
                <a href={getHomePath(locale)}>{labels.home}</a>
                <span className="opacity-40">/</span>
                <a href={getHomeSectionHref(locale, 'services')}>{labels.services}</a>
                <span className="opacity-40">/</span>
                <span className="text-white/70">{page.breadcrumbLabel}</span>
              </nav>

              {/* Eyebrow */}
              <p className="svc-hero-tagline mb-5 md:mb-6">{page.heroEyebrow}</p>

              {/* H1 — SEO preserved, same text */}
              <h1 className="svc-hero-title max-w-[12ch] md:max-w-5xl">{page.heroTitle}</h1>

              {/* Summary */}
              <p className="svc-hero-summary sr-only mt-6 text-base md:not-sr-only md:text-lg">{page.heroSummary}</p>

              {/* Chips */}
              <div className="mt-6 sr-only md:not-sr-only md:mt-8 md:flex md:flex-wrap md:gap-2">
                {page.heroPoints.map((point) => (
                  <span key={point} className="svc-hero-chip">
                    {point}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
                <a href={page.primaryCtaHref} className="svc-hero-cta-primary">
                  {page.primaryCtaLabel}
                </a>
                <a href={page.secondaryCtaHref} className="svc-hero-cta-secondary">
                  {page.secondaryCtaLabel}
                </a>
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════
              2. PROOF GALLERY — Editorial numbered showcase
              ═══════════════════════════════════════════ */}
          {proofExamples.length > 0 && (
            <RevealSection className="pb-16 md:pb-24 lg:pb-28" id="examples">
              <div className="studio-container">
                <div className="mb-12 md:mb-16">
                  <p className="section-label mb-4">{page.featuredTitle}</p>
                  <h2 className="studio-title max-w-3xl">{page.featuredIntro}</h2>
                </div>

                {/* Lead featured example — cinematic card */}
                {proofExamples.length > 0 && (() => {
                  const { example: leadExample, clip: leadClip } = proofExamples[0];
                  const leadDuration = formatDuration(leadClip.durationSeconds);
                  return (
                    <button
                      key={leadExample.clipId}
                      type="button"
                      onClick={() => openProofClip(0)}
                      aria-label={`${labels.openSample}: ${leadExample.title}`}
                      className="svc-proof-lead group relative mb-4 block w-full overflow-hidden rounded-2xl border-0 bg-transparent p-0 text-left md:mb-5 md:rounded-3xl"
                    >
                      <div className="relative aspect-[16/10] md:aspect-[21/9]">
                        <img
                          src={leadClip.posterSrc}
                          alt={leadExample.title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          loading="eager"
                          decoding="async"
                        />
                        {/* Gradient overlay — always visible */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        {/* Number badge */}
                        <div className="absolute top-5 left-5 md:top-7 md:left-7">
                          <span className="text-[10px] font-bold uppercase tracking-prestige text-white/50">01</span>
                        </div>
                        {/* Play indicator */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-white/25">
                          <Play className="h-5 w-5 md:h-6 md:w-6 ml-0.5" />
                        </div>
                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 lg:p-10">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-prestige text-white/80 backdrop-blur-md">
                              {page.navLabel}
                            </span>
                            {leadDuration && (
                              <span className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-prestige text-white/60 backdrop-blur-md">
                                {leadDuration}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-medium leading-tight tracking-tight text-white">
                            {leadExample.title}
                          </h3>
                          <p className="mt-2 max-w-xl text-sm md:text-base leading-relaxed text-white/65">
                            {leadExample.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })()}

                {/* Secondary examples — numbered editorial cards */}
                {proofExamples.length > 1 && (
                  <div className={`grid gap-4 md:gap-5 ${
                    proofExamples.length <= 2
                      ? 'md:grid-cols-1 max-w-2xl'
                      : proofExamples.length === 3
                        ? 'md:grid-cols-2'
                        : 'md:grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {proofExamples.slice(1).map(({ example, clip }, index) => {
                      const duration = formatDuration(clip.durationSeconds);
                      return (
                        <button
                          key={example.clipId}
                          type="button"
                          onClick={() => openProofClip(index + 1)}
                          aria-label={`${labels.openSample}: ${example.title}`}
                          className="svc-proof-card group relative block w-full overflow-hidden rounded-2xl border-0 bg-transparent p-0 text-left"
                        >
                          <div className="relative aspect-[4/5] md:aspect-[5/4]">
                            <img
                              src={clip.posterSrc}
                              alt={example.title}
                              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                              loading="lazy"
                              decoding="async"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                            {/* Number */}
                            <div className="absolute top-4 left-4 md:top-5 md:left-5">
                              <span className="text-[10px] font-bold uppercase tracking-prestige text-white/45">
                                {String(index + 2).padStart(2, '0')}
                              </span>
                            </div>
                            {/* Play indicator */}
                            <div className="absolute top-4 right-4 md:top-5 md:right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/12 backdrop-blur-sm border border-white/15 text-white/70 transition-all duration-300 group-hover:bg-white/20 group-hover:text-white">
                              <Play className="h-3.5 w-3.5 ml-0.5" />
                            </div>
                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                {duration && (
                                  <span className="rounded-full border border-white/15 bg-white/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-prestige text-white/55 backdrop-blur-md">
                                    {duration}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-base md:text-lg font-serif font-medium leading-tight tracking-tight text-white">
                                {example.title}
                              </h3>
                              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/60">
                                {example.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </RevealSection>
          )}

          {/* ═══════════════════════════════════════════
              3. EDITORIAL INTRO — What this resolves
              ═══════════════════════════════════════════ */}
          <RevealSection className="border-t border-border/50 py-20 md:py-28 lg:py-32">
            <div className="studio-container">
              <div className="grid gap-14 lg:grid-cols-[minmax(0,0.56fr)_minmax(0,0.44fr)] lg:items-start lg:gap-20">
                {/* Left — problem statement */}
                <div>
                  <p className="section-label mb-7">{page.sectionIntroTitle}</p>
                  <p className="font-serif text-[clamp(1.45rem,2.6vw,2.3rem)] font-light leading-[1.45] tracking-tight text-foreground">
                    {page.sectionIntroText}
                  </p>
                </div>

                {/* Right — what I deliver, anchored with a left rule */}
                <div className="lg:border-l lg:border-border/40 lg:pl-12">
                  <p className="section-label mb-8">{page.marketTitle}</p>
                  <div className="space-y-0">
                    {page.marketItems.map((item, i) => (
                      <div
                        key={item}
                        className={`flex items-start gap-5 ${i > 0 ? 'border-t border-border/30 pt-5 mt-5' : ''}`}
                      >
                        <span className="shrink-0 pt-0.5 text-[11px] font-bold uppercase tracking-prestige text-accent/50">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-base font-light leading-[1.75] text-foreground/72">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>

          {/* ═══════════════════════════════════════════
              4. DELIVERABLES — Editorial line items
              ═══════════════════════════════════════════ */}
          <RevealSection className="pb-16 md:pb-24 lg:pb-28">
            <div className="studio-container">
              <div className="mb-10 md:mb-14">
                <p className="section-label mb-4">{page.deliverablesTitle}</p>
                <h2 className="studio-title max-w-3xl">{page.navLabel}</h2>
              </div>

              <div className="border-t border-border/50">
                {page.deliverables.map((item, index) => {
                  const isExpanded = expandedDeliverable === index;
                  return (
                    <div
                      key={item.title}
                      className={`svc-deliverable-row border-b border-border/40 ${isExpanded ? 'is-expanded' : ''}`}
                    >
                      {/* Desktop: grid layout, always visible */}
                      <div className="hidden md:grid md:grid-cols-[64px_minmax(0,0.38fr)_minmax(0,0.62fr)] md:items-baseline md:gap-6">
                        <span className="text-sm font-semibold uppercase tracking-prestige text-accent/65 pt-1">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="font-serif text-2xl font-medium tracking-tight text-foreground lg:text-[1.7rem]">
                          {item.title}
                        </h3>
                        <p className="text-sm font-light leading-[1.85] text-foreground/62 lg:text-base">
                          {item.description}
                        </p>
                      </div>

                      {/* Mobile: tap-to-expand */}
                      <button
                        type="button"
                        className="flex w-full items-start gap-4 text-left md:hidden"
                        onClick={() => toggleDeliverable(index)}
                        aria-expanded={isExpanded}
                      >
                        <span className="mt-0.5 text-sm font-semibold uppercase tracking-prestige text-accent/65">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1">
                          <h3 className="font-serif text-xl font-medium tracking-tight text-foreground">
                            {item.title}
                          </h3>
                          <div className="svc-deliverable-desc">
                            <p className="mt-3 text-sm font-light leading-[1.85] text-foreground/62">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/50 text-foreground/35 transition-transform duration-300 ${
                            isExpanded ? 'rotate-45' : ''
                          }`}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </RevealSection>

          {/* ═══════════════════════════════════════════
              5. BEST FIT / NOT FIT — Split editorial
              ═══════════════════════════════════════════ */}
          <RevealSection className="pb-16 md:pb-24 lg:pb-28">
            <div className="studio-container">
              <div className="overflow-hidden rounded-[2rem]">
                <div className="grid lg:grid-cols-2">
                  {/* Best Fit */}
                  <article className="svc-split-fit p-7 md:p-10 lg:p-12">
                    <p className="section-label mb-6">{page.bestFitTitle}</p>
                    <ul className="space-y-5">
                      {page.bestFitItems.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-[0.35rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="text-sm font-light leading-[1.75] text-foreground/75 md:text-base">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>

                  {/* Not Fit */}
                  <article className="svc-split-notfit p-7 md:p-10 lg:p-12">
                    <p className="section-label mb-6 !text-white/45">{page.notFitTitle}</p>
                    <ul className="space-y-5">
                      {page.notFitItems.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-[0.35rem] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/8 text-white/45">
                            <X className="h-3 w-3" />
                          </span>
                          <span className="text-sm font-light leading-[1.75] opacity-75 md:text-base">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </div>
            </div>
          </RevealSection>

          {/* ═══════════════════════════════════════════
              6. PROCESS — Timeline with scroll beam
              ═══════════════════════════════════════════ */}
          <RevealSection className="pb-16 md:pb-24 lg:pb-28">
            <div className="studio-container">
              <div className="mb-10 md:mb-14 max-w-3xl">
                <p className="section-label mb-4">{page.processTitle}</p>
                <h2 className="studio-title">{page.processTitle}</h2>
              </div>

              <div className="relative pl-14 md:pl-20">
                {/* Timeline line */}
                <div className="svc-timeline-line" aria-hidden="true" />

                <div className="space-y-10 md:space-y-14">
                  {page.processSteps.map((step, index) => (
                    <article key={step.title} className="relative">
                      {/* Dot */}
                      <div className="absolute -left-14 top-0 md:-left-20">
                        <div className="svc-timeline-dot">{index + 1}</div>
                      </div>

                      {/* Content */}
                      <div className="pt-1">
                        <h3 className="font-serif text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                          {step.title}
                        </h3>
                        <p className="mt-3 max-w-2xl text-sm font-light leading-[1.85] text-foreground/65 md:text-base">
                          {step.description}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>

          {/* ═══════════════════════════════════════════
              7. FAQ — Premium accordion
              ═══════════════════════════════════════════ */}
          <RevealSection className="pb-16 md:pb-24 lg:pb-28" id="faq">
            <div className="studio-container max-w-4xl">
              <div className="mb-10 md:mb-14 text-center">
                <p className="section-label mb-4">{page.faqTitle}</p>
                <h2 className="studio-title">{page.navLabel}</h2>
              </div>

              <div>
                {page.faqs.map((faq, index) => (
                  <details
                    key={faq.question}
                    className={`svc-faq-item group py-6 md:py-7 ${
                      index === 0 ? '' : 'border-t border-border/40'
                    }`}
                  >
                    <summary
                      className="font-sans flex cursor-pointer list-none items-start justify-between gap-5 text-base font-medium tracking-[-0.005em] leading-[1.45] text-foreground md:text-lg"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500 }}>{faq.question}</span>
                      <span className="svc-faq-toggle shrink-0 mt-0.5">
                        <Plus className="h-4 w-4" />
                      </span>
                    </summary>
                    <p
                      className="mt-4 max-w-3xl font-sans text-[0.95rem] font-normal leading-[1.8] text-foreground/68 md:text-base"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </RevealSection>

          {/* ═══════════════════════════════════════════
              8. FEATURED WORK — Numbered text grid
              ═══════════════════════════════════════════ */}
          {proofExamples.length > 0 && (
            <RevealSection className="pb-16 md:pb-24 lg:pb-28">
              <div className="studio-container">
                <p className="section-label mb-3">{labels.featuredWorkLabel}</p>
                <p className="mb-10 md:mb-14 font-sans text-sm font-light text-foreground/55 max-w-2xl">
                  {labels.featuredWorkSubtitle}
                </p>
                <div
                  className={`grid border-t border-border/40 divide-x divide-border/40 ${
                    proofExamples.length === 2
                      ? 'grid-cols-2'
                      : proofExamples.length >= 4
                        ? 'grid-cols-4'
                        : 'grid-cols-3'
                  }`}
                >
                  {proofExamples.map(({ example }, index) => (
                    <button
                      key={example.clipId}
                      type="button"
                      onClick={() => openProofClip(index)}
                      aria-label={`${labels.openSample}: ${example.title}`}
                      className="group flex w-full flex-col justify-between gap-6 border-0 border-b border-border/40 bg-transparent px-5 py-8 text-left transition-colors duration-200 hover:bg-accent/[0.03] md:px-7 md:py-9"
                    >
                      <div>
                        <span className="block text-xs font-semibold uppercase tracking-prestige text-foreground/30 mb-4">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="font-serif text-lg md:text-xl font-medium tracking-tight text-foreground leading-snug">
                          {example.title}
                        </h3>
                      </div>
                      <span className="text-foreground/30 transition-all duration-200 group-hover:translate-x-1 group-hover:text-foreground/60 text-xl leading-none">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </RevealSection>
          )}

          {/* ═══════════════════════════════════════════
              9. CTA CLOSER — Dark editorial sign-off
              ═══════════════════════════════════════════ */}
          <RevealSection className="svc-cta-closer py-20 md:py-28 lg:py-32">
            <div className="studio-container relative z-10 text-center">
              <p className="section-label mb-6 !text-white/40">{page.ctaTitle}</p>
              <p className="mx-auto max-w-3xl font-serif text-[clamp(1.4rem,3vw,2.6rem)] font-light leading-[1.45] tracking-tight text-white/90">
                {page.ctaText}
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/12 border border-white/20 px-8 py-3.5 text-[10px] font-bold uppercase tracking-prestige text-white backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:border-white/35 hover:-translate-y-[1px]"
                >
                  {labels.useWhatsApp}
                </a>
                <a
                  href={fiverrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 px-7 py-3.5 text-[10px] font-bold uppercase tracking-prestige text-white/65 transition-all duration-200 hover:text-white hover:border-white/30"
                >
                  {labels.useFiverr}
                </a>
              </div>

              {/* Signature flourish */}
              <div className="mt-12 md:mt-16">
                <div className="signature-line mx-auto mb-6 max-w-[200px] !bg-gradient-to-r !from-transparent !via-white/15 !to-transparent" />
                <span className="svc-signature">Gisela Saldarriaga</span>
              </div>
            </div>
          </RevealSection>

          {/* ═══════════════════════════════════════════
              10. RELATED SERVICES — Horizontal cards
              ═══════════════════════════════════════════ */}
          <RevealSection className="py-16 md:py-24 lg:py-28">
            <div className="studio-container">
              <div className="mb-10 md:mb-14">
                <p className="section-label mb-4">{page.relatedTitle}</p>
                <h2 className="studio-title">{page.relatedTitle}</h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {page.relatedServiceIds.map((relatedId, index) => {
                  const relatedPage = relatedPages[index];
                  if (!relatedPage) return null;

                  return (
                    <a
                      key={relatedId}
                      href={getServicePath(relatedId, locale)}
                      className="svc-related-card group block p-7 md:p-8"
                    >
                      <p className="section-label mb-3">{relatedPage.eyebrow}</p>
                      <h3 className="font-serif text-2xl font-medium tracking-tight text-foreground mb-3 md:text-[1.6rem]">
                        {relatedPage.title}
                      </h3>
                      <p className="text-sm font-light leading-[1.75] text-foreground/62 mb-5">
                        {relatedPage.summary}
                      </p>
                      <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-prestige text-primary transition-colors group-hover:text-accent">
                        {labels.relatedLink}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </RevealSection>
        </main>

        {activeProofItem && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
            onClick={closeProofTheater}
          >
            <div
              className="absolute inset-0 backdrop-blur-[6px] md:backdrop-blur-[10px]"
              style={{ backgroundColor: 'hsl(var(--theater-backdrop) / 0.74)' }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 20% 14%, hsl(var(--theater-backdrop-glow) / 0.14) 0%, transparent 48%), radial-gradient(circle at 82% 86%, hsl(var(--theater-backdrop-glow) / 0.1) 0%, transparent 56%)',
              }}
            />
            <div className="relative w-full max-w-[430px]">
              <button
                type="button"
                className="theater-control absolute left-0 top-1/2 -translate-x-[118%] -translate-y-1/2 z-[220] h-9 w-9 md:h-10 md:w-10"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  navigateProofTheater(-1);
                }}
                aria-label={labels.previewPrev}
              >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <button
                type="button"
                className="theater-control absolute right-0 top-1/2 translate-x-[118%] -translate-y-1/2 z-[220] h-9 w-9 md:h-10 md:w-10"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  navigateProofTheater(1);
                }}
                aria-label={labels.previewNext}
              >
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <div
                className="relative w-full overflow-hidden rounded-[1.45rem] border border-[hsl(var(--theater-edge)/0.88)] bg-black shadow-[0_34px_82px_-38px_rgba(0,0,0,0.78)]"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className="theater-control absolute right-3 top-3 z-30 h-9 w-9"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    closeProofTheater();
                  }}
                  aria-label={labels.previewClose}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="relative">
                  <TheaterVideo
                    sources={theaterSources}
                    poster={activeProofItem.clip.posterSrc}
                    enableStartupFallback={isMobileViewport}
                    startupFallbackMs={isMobileViewport ? 300 : 420}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
                    <div className="h-36 bg-gradient-to-t from-black/80 via-black/28 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-5 sm:pb-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="theater-meta-chip inline-flex max-w-[78%] items-center rounded-full px-2.5 py-1">
                          {page.navLabel}
                        </p>
                        {formatDuration(activeProofItem.clip.durationSeconds) && (
                          <p className="theater-meta-chip inline-flex items-center rounded-full px-2.5 py-1">
                            {formatDuration(activeProofItem.clip.durationSeconds)}
                          </p>
                        )}
                      </div>
                      <h4 className="theater-meta-title mt-2 max-w-[88%] text-base leading-snug sm:text-lg">
                        {activeProofItem.example.title}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
