import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Play, X, Plus, ArrowRight } from 'lucide-react';
import type { ServicePageId, SiteLocale } from '@/lib/locale-path';
import { getHomePath, getHomeSectionHref, getServicePath } from '@/lib/locale-path';
import { getServicePageContent, getRelatedServiceSummaries } from '@/data/service-pages';
import { LEGACY_REEL_CLIPS } from '@/data/portfolio-clips';
import VIDEO_LQIP from '@/data/video-lqip';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageSeo from '@/components/PageSeo';
import LazyVideo from '@/components/media/LazyVideo';

const FloatingContactDock = lazy(() => import('@/components/FloatingContactDock'));

const SITE_URL = 'https://www.giselasaldarriaga.com';
const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/573043786101';
const fiverrUrl = import.meta.env.VITE_FIVERR_URL ?? 'https://www.fiverr.com/gisela_sm?source=gig_page';

const buildUrl = (pathname: string) => new URL(pathname, SITE_URL).toString();

const clipMap = new Map(LEGACY_REEL_CLIPS.map((clip) => [clip.id, clip]));

const getVideoLqip = (src: string) => {
  const filename = src.split('/').pop() ?? '';
  const key = filename.replace(/-preview\.mp4$/, '').replace(/\.mp4$/, '');
  return VIDEO_LQIP[key] || undefined;
};

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
  },
  en: {
    home: 'Home',
    services: 'Services',
    openSample: 'View sample',
    useWhatsApp: 'WhatsApp',
    useFiverr: 'Fiverr',
    relatedLink: 'View service',
    scrollDown: 'Explore',
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

  const leadProof = proofExamples[0];

  /* ── Mobile deliverable expand state ── */
  const [expandedDeliverable, setExpandedDeliverable] = useState<number | null>(null);
  const toggleDeliverable = useCallback((index: number) => {
    setExpandedDeliverable((prev) => (prev === index ? null : index));
  }, []);

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
        <Navbar />

        <main>
          {/* ═══════════════════════════════════════════
              1. CINEMATIC HERO — Full-bleed video
              ═══════════════════════════════════════════ */}
          <section className="svc-hero">
            {/* Background video */}
            {leadProof && (
              <LazyVideo
                className="svc-hero-video"
                src={leadProof.clip.previewSrc}
                poster={leadProof.clip.posterSrc}
                lqip={getVideoLqip(leadProof.clip.previewSrc)}
                muted
                autoPlay
                loop
                playsInline
                preload="auto"
                pauseOffscreen
                aria-hidden="true"
              />
            )}

            {/* Gradient overlay */}
            <div className="svc-hero-overlay" />

            {/* Content */}
            <div className="svc-hero-content">
              {/* Breadcrumb */}
              <nav className="svc-breadcrumb mb-8 md:mb-10" aria-label="Breadcrumb">
                <a href={getHomePath(locale)}>{labels.home}</a>
                <span className="opacity-40">/</span>
                <a href={getHomeSectionHref(locale, 'services')}>{labels.services}</a>
                <span className="opacity-40">/</span>
                <span className="text-white/70">{page.breadcrumbLabel}</span>
              </nav>

              {/* Eyebrow */}
              <p className="svc-hero-tagline mb-5 md:mb-6">{page.heroEyebrow}</p>

              {/* H1 — SEO preserved, same text */}
              <h1 className="svc-hero-title max-w-5xl">{page.heroTitle}</h1>

              {/* Summary */}
              <p className="svc-hero-summary mt-6 text-base md:text-lg">{page.heroSummary}</p>

              {/* Chips */}
              <div className="mt-6 flex flex-wrap gap-2 md:mt-8">
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
              2. EDITORIAL INTRO — What this resolves
              ═══════════════════════════════════════════ */}
          <RevealSection className="py-16 md:py-24 lg:py-28">
            <div className="studio-container">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)] lg:items-start">
                <div>
                  <p className="section-label mb-5">{page.sectionIntroTitle}</p>
                  <p className="font-serif text-[clamp(1.35rem,2.5vw,2.2rem)] font-light leading-[1.5] tracking-tight text-foreground/85">
                    {page.sectionIntroText}
                  </p>
                </div>

                <div className="lg:pl-8">
                  <p className="section-label mb-5">{page.marketTitle}</p>
                  <div className="space-y-0">
                    {page.marketItems.map((item, i) => (
                      <div
                        key={item}
                        className="flex gap-4 border-b border-border/40 py-4 last:border-b-0"
                      >
                        <span className="mt-1 text-xs font-semibold uppercase tracking-prestige text-accent/70">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-sm font-light leading-[1.75] text-foreground/70 md:text-base">
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
              3. PROOF GALLERY — Bento mosaic
              ═══════════════════════════════════════════ */}
          {proofExamples.length > 0 && (
            <RevealSection className="pb-16 md:pb-24 lg:pb-28" id="examples">
              <div className="studio-container">
                <div className="mb-10 md:mb-14">
                  <p className="section-label mb-4">{page.featuredTitle}</p>
                  <h2 className="studio-title max-w-3xl">{page.featuredIntro}</h2>
                </div>

                {/* Bento grid — asymmetric */}
                <div className="grid gap-3 md:gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-[280px] md:auto-rows-[340px]">
                  {proofExamples.map(({ example, clip }, index) => {
                    const isLead = index === 0;
                    const duration = formatDuration(clip.durationSeconds);
                    return (
                      <a
                        key={example.clipId}
                        href={clip.mainSrc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`svc-bento-item group ${
                          isLead
                            ? 'md:col-span-2 md:row-span-2 md:auto-rows-auto'
                            : ''
                        }`}
                        style={isLead ? { gridRow: 'span 2' } : undefined}
                      >
                        <img
                          src={clip.posterSrc}
                          alt={example.title}
                          className="h-full w-full object-cover"
                          loading={index === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                        />

                        {/* Hover/always-on overlay */}
                        <div className="svc-bento-overlay">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-prestige text-white/90 backdrop-blur-md">
                              {page.navLabel}
                            </span>
                            {duration && (
                              <span className="rounded-full border border-white/15 bg-white/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-prestige text-white/75 backdrop-blur-md">
                                {duration}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-medium leading-tight tracking-tight text-white md:text-xl">
                            {example.title}
                          </h3>
                          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/70">
                            {example.description}
                          </p>
                          <span className="mt-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-prestige text-white/80">
                            <Play className="h-3.5 w-3.5" />
                            {labels.openSample}
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </RevealSection>
          )}

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
              8. CTA CLOSER — Dark editorial sign-off
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
              9. RELATED SERVICES — Horizontal cards
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

        <Footer />

        <Suspense fallback={null}>
          <FloatingContactDock />
        </Suspense>
      </div>
    </>
  );
};

export default ServiceLandingPage;
