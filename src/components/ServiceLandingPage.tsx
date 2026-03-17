import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Check, Play, X } from 'lucide-react';
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
    openSample: 'Abrir muestra',
    useWhatsApp: 'WhatsApp',
    useFiverr: 'Fiverr',
    relatedLink: 'Ver página',
  },
  en: {
    home: 'Home',
    services: 'Services',
    openSample: 'Open sample',
    useWhatsApp: 'WhatsApp',
    useFiverr: 'Fiverr',
    relatedLink: 'View page',
  },
} as const;

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

  const [selectedProofId, setSelectedProofId] = useState<number | null>(
    page.featuredExamples[0]?.clipId ?? null,
  );

  useEffect(() => {
    setSelectedProofId(page.featuredExamples[0]?.clipId ?? null);
  }, [serviceId, locale, page.featuredExamples]);

  const selectedProof =
    proofExamples.find((item) => item.example.clipId === selectedProofId) ?? proofExamples[0];
  const leadProof = proofExamples[0];
  const supportingProofs = proofExamples.slice(1);
  const selectedDuration = formatDuration(selectedProof?.clip.durationSeconds);

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

        <main className="pt-28 pb-16 md:pt-32 md:pb-24">
          <section className="studio-section pt-8 pb-8 md:pt-12 md:pb-10">
            <div className="studio-container">
              <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/45">
                <a href={getHomePath(locale)} className="transition-colors hover:text-primary">
                  {labels.home}
                </a>
                <span>/</span>
                <a
                  href={getHomeSectionHref(locale, 'services')}
                  className="transition-colors hover:text-primary"
                >
                  {labels.services}
                </a>
                <span>/</span>
                <span className="text-foreground/75">{page.breadcrumbLabel}</span>
              </nav>

              <div className="grid gap-10 xl:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.72fr)] xl:items-start">
                <div className="max-w-4xl">
                  <p className="section-label mb-4">{page.heroEyebrow}</p>
                  <h1 className="max-w-4xl text-4xl leading-[0.92] tracking-tight-serif text-foreground sm:text-5xl lg:text-6xl">
                    {page.heroTitle}
                  </h1>
                  <p className="strategic-body mt-6 max-w-3xl text-lg text-foreground/72 md:text-xl">
                    {page.heroSummary}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {page.heroPoints.map((point) => (
                      <span
                        key={point}
                        className="rounded-full border border-border/70 bg-card/70 px-4 py-2 text-sm font-medium text-foreground/75"
                      >
                        {point}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <a href={page.primaryCtaHref} className="btn-primary-nordic btn-shimmer px-7 py-3">
                      {page.primaryCtaLabel}
                    </a>
                    <a
                      href={page.secondaryCtaHref}
                      className="rounded-full border border-border/80 bg-card/70 px-6 py-3 text-sm font-semibold text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {page.secondaryCtaLabel}
                    </a>
                  </div>
                </div>

                {selectedProof ? (
                  <div className="xl:pl-4">
                    <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-[#15110e] shadow-[0_34px_90px_-56px_rgba(30,23,17,0.75)]">
                      <div className="aspect-[4/5] w-full overflow-hidden">
                        <LazyVideo
                          className="h-full w-full object-cover"
                          src={selectedProof.clip.previewSrc}
                          poster={selectedProof.clip.posterSrc}
                          lqip={getVideoLqip(selectedProof.clip.previewSrc)}
                          muted
                          autoPlay
                          loop
                          playsInline
                          preload="auto"
                          pauseOffscreen
                          aria-hidden="true"
                        />
                      </div>

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#15110e] via-[#15110e]/16 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-7">
                        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
                          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 backdrop-blur-md">
                            {page.navLabel}
                          </span>
                          {selectedDuration && (
                            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 backdrop-blur-md">
                              {selectedDuration}
                            </span>
                          )}
                        </div>

                        <p className="max-w-md text-2xl font-medium leading-tight tracking-tight text-white md:text-[2rem]">
                          {selectedProof.example.title}
                        </p>
                        <p className="mt-3 max-w-lg text-sm leading-7 text-white/74 md:text-base">
                          {selectedProof.example.description}
                        </p>

                        <a
                          href={selectedProof.clip.mainSrc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-foreground transition-transform hover:-translate-y-[1px]"
                        >
                          <Play className="h-4 w-4" />
                          {labels.openSample}
                        </a>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {proofExamples.map(({ example, clip }) => {
                        const isActive = example.clipId === selectedProof.example.clipId;

                        return (
                          <button
                            type="button"
                            key={example.clipId}
                            onClick={() => setSelectedProofId(example.clipId)}
                            aria-pressed={isActive}
                            className={`overflow-hidden rounded-[1.4rem] border text-left transition-all ${isActive
                              ? 'border-primary/45 bg-card/85 shadow-[0_22px_48px_-42px_rgba(44,167,200,0.72)]'
                              : 'border-border/65 bg-card/60 hover:border-primary/25'
                              }`}
                          >
                            <div className="relative aspect-[4/5] overflow-hidden bg-secondary/20">
                              <img
                                src={clip.posterSrc}
                                alt={example.title}
                                className="h-full w-full object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#15110e]/35 via-transparent to-transparent" />
                            </div>
                            <div className="p-4">
                              <p className="text-sm font-semibold leading-tight text-foreground">
                                {example.title}
                              </p>
                              <p className="mt-2 line-clamp-2 text-xs leading-6 text-foreground/62">
                                {example.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <aside className="rounded-[1.75rem] border border-border/70 bg-card/60 p-6 shadow-[0_28px_90px_-48px_rgba(47,42,36,0.45)] backdrop-blur-md md:p-8">
                    <p className="section-label mb-4">{page.sectionIntroTitle}</p>
                    <p className="strategic-body text-foreground/68">{page.sectionIntroText}</p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                      {page.marketItems.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-border/60 bg-background/70 px-4 py-4 text-sm text-foreground/72"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </aside>
                )}
              </div>
            </div>
          </section>

          <section className="studio-section pt-0 pb-8 md:pb-10">
            <div className="studio-container">
              <div className="grid gap-8 border-y border-border/60 py-8 md:py-10 xl:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] xl:items-start">
                <div className="max-w-3xl">
                  <p className="section-label mb-4">{page.sectionIntroTitle}</p>
                  <p className="text-[clamp(1.2rem,2vw,1.85rem)] font-light leading-[1.65] text-foreground/82">
                    {page.sectionIntroText}
                  </p>
                </div>

                <div className="xl:pl-6">
                  <p className="section-label mb-4">{page.marketTitle}</p>
                  <div className="grid gap-3">
                    {page.marketItems.map((item) => (
                      <div
                        key={item}
                        className="flex gap-3 border-b border-border/55 pb-3 last:border-b-0 last:pb-0"
                      >
                        <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <p className="text-sm font-light leading-[1.8] text-foreground/72 md:text-base">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="studio-section pt-0 pb-8 md:pb-10" id="examples">
            <div className="studio-container">
              <div className="studio-header mb-10">
                <div>
                  <p className="section-label mb-4">{page.featuredTitle}</p>
                  <h2 className="studio-title max-w-3xl">{page.featuredIntro}</h2>
                </div>
                <p className="studio-subtitle max-w-xl lg:justify-self-end">{page.metaDescription}</p>
              </div>

              <div className="studio-rule mb-10" />

              <div className="grid gap-6 xl:grid-cols-[minmax(0,0.62fr)_minmax(320px,0.38fr)]">
                {leadProof && (
                  <article className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/60 shadow-[0_30px_80px_-52px_rgba(47,42,36,0.48)]">
                    <div className="grid h-full gap-0 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)]">
                      <div className="relative min-h-[320px] bg-secondary/15">
                        <img
                          src={leadProof.clip.posterSrc}
                          alt={leadProof.example.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#15110e]/30 via-transparent to-transparent" />
                        <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                          {page.navLabel}
                        </div>
                      </div>

                      <div className="flex flex-col justify-between p-7 md:p-8">
                        <div>
                          <p className="section-label mb-3">{page.heroEyebrow}</p>
                          <h3 className="text-3xl font-medium tracking-tight text-foreground">
                            {leadProof.example.title}
                          </h3>
                          <p className="strategic-body mt-4 text-foreground/68">
                            {leadProof.example.description}
                          </p>
                        </div>

                        <a
                          href={leadProof.clip.mainSrc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:text-accent"
                        >
                          <Play className="h-4 w-4" />
                          {labels.openSample}
                        </a>
                      </div>
                    </div>
                  </article>
                )}

                <div className="grid content-start gap-4">
                  {supportingProofs.map(({ example, clip }) => (
                    <article
                      key={example.clipId}
                      className="rounded-[1.6rem] border border-border/70 bg-card/55 p-5 transition-colors hover:border-primary/25 md:p-6"
                    >
                      <div className="flex gap-4">
                        <div className="relative hidden h-32 w-24 shrink-0 overflow-hidden rounded-[1.1rem] bg-secondary/20 sm:block">
                          <img
                            src={clip.posterSrc}
                            alt={example.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>

                        <div>
                          <p className="section-label mb-2">{page.navLabel}</p>
                          <h3 className="text-xl font-medium tracking-tight text-foreground">
                            {example.title}
                          </h3>
                          <p className="strategic-body mt-3 text-sm text-foreground/68 md:text-base">
                            {example.description}
                          </p>
                          <a
                            href={clip.mainSrc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:text-accent"
                          >
                            <Play className="h-4 w-4" />
                            {labels.openSample}
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="studio-section pt-0 pb-8 md:pb-10">
            <div className="studio-container">
              <div className="studio-header mb-8">
                <div>
                  <p className="section-label mb-4">{page.deliverablesTitle}</p>
                  <h2 className="studio-title">{page.navLabel}</h2>
                </div>
                <p className="studio-subtitle max-w-2xl lg:justify-self-end">{page.metaDescription}</p>
              </div>

              <div className="border-y border-border/60">
                {page.deliverables.map((item, index) => (
                  <article
                    key={item.title}
                    className={`grid gap-4 py-6 md:grid-cols-[72px_minmax(0,0.36fr)_minmax(0,0.64fr)] md:gap-6 ${index === 0 ? '' : 'border-t border-border/55'
                      }`}
                  >
                    <div className="text-sm font-semibold uppercase tracking-[0.18em] text-accent/80">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-2xl font-medium tracking-tight text-foreground">{item.title}</h3>
                    <p className="strategic-body text-foreground/68">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="studio-section pt-0 pb-8 md:pb-10">
            <div className="studio-container">
              <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/45">
                <div className="grid lg:grid-cols-2">
                  <article className="p-7 md:p-8 lg:border-r lg:border-border/60">
                    <p className="section-label mb-4">{page.bestFitTitle}</p>
                    <ul className="space-y-4">
                      {page.bestFitItems.map((item) => (
                        <li key={item} className="flex gap-3 text-foreground/74">
                          <span className="mt-[0.3rem] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          <span className="strategic-body text-sm md:text-base">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>

                  <article className="bg-foreground/[0.02] p-7 md:p-8">
                    <p className="section-label mb-4">{page.notFitTitle}</p>
                    <ul className="space-y-4">
                      {page.notFitItems.map((item) => (
                        <li key={item} className="flex gap-3 text-foreground/74">
                          <span className="mt-[0.3rem] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-foreground/12 bg-foreground/[0.04] text-foreground/55">
                            <X className="h-3.5 w-3.5" />
                          </span>
                          <span className="strategic-body text-sm md:text-base">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section className="studio-section pt-0 pb-8 md:pb-10">
            <div className="studio-container">
              <div className="studio-header mb-8">
                <div>
                  <p className="section-label mb-4">{page.processTitle}</p>
                  <h2 className="studio-title">{page.processTitle}</h2>
                </div>
                <p className="studio-subtitle max-w-xl lg:justify-self-end">{page.metaDescription}</p>
              </div>

              <div className="border-y border-border/60">
                {page.processSteps.map((step, index) => (
                  <article
                    key={step.title}
                    className={`grid gap-4 py-6 md:grid-cols-[88px_minmax(0,1fr)] md:gap-8 ${index === 0 ? '' : 'border-t border-border/55'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-card text-sm font-semibold text-foreground">
                        {index + 1}
                      </span>
                      <span className="hidden h-px flex-1 bg-border/50 md:block" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-medium tracking-tight text-foreground">{step.title}</h3>
                      <p className="strategic-body mt-3 max-w-3xl text-foreground/68">
                        {step.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="studio-section pt-0 pb-8 md:pb-10" id="faq">
            <div className="studio-container max-w-5xl">
              <div className="mb-10 text-center">
                <p className="section-label mb-4">{page.faqTitle}</p>
                <h2 className="studio-title">{page.navLabel}</h2>
              </div>

              <div className="border-y border-border/60">
                {page.faqs.map((faq, index) => (
                  <details
                    key={faq.question}
                    className={`group py-5 ${index === 0 ? '' : 'border-t border-border/60'}`}
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-medium tracking-tight text-foreground">
                      <span>{faq.question}</span>
                      <span className="mt-1 text-2xl font-light text-foreground/35">+</span>
                    </summary>
                    <p className="strategic-body mt-4 max-w-3xl text-foreground/68">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="studio-section pt-0 pb-8 md:pb-10">
            <div className="studio-container">
              <div className="rounded-[2rem] border border-border/70 bg-card/60 p-7 shadow-[0_28px_90px_-50px_rgba(47,42,36,0.48)] md:p-10">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,0.68fr)_auto] lg:items-end">
                  <div>
                    <p className="section-label mb-4">{page.ctaTitle}</p>
                    <p className="text-[clamp(1.25rem,2vw,1.9rem)] font-light leading-[1.6] text-foreground/82">
                      {page.ctaText}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 lg:justify-end">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary-nordic btn-shimmer px-7 py-3"
                    >
                      {labels.useWhatsApp}
                    </a>
                    <a
                      href={fiverrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-border/80 bg-background/75 px-6 py-3 text-sm font-semibold text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary"
                    >
                      {labels.useFiverr}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="studio-section pt-0 pb-6 md:pb-8">
            <div className="studio-container">
              <div className="border-t border-border/60 pt-8">
                <div className="studio-header mb-8">
                  <div>
                    <p className="section-label mb-4">{page.relatedTitle}</p>
                    <h2 className="studio-title">{page.relatedTitle}</h2>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {page.relatedServiceIds.map((relatedId, index) => {
                    const relatedPage = relatedPages[index];
                    if (!relatedPage) return null;

                    return (
                      <article key={relatedId} className="border-t border-border/60 pt-5">
                        <p className="section-label mb-3">{relatedPage.eyebrow}</p>
                        <h3 className="text-2xl font-medium tracking-tight text-foreground mb-3">
                          {relatedPage.title}
                        </h3>
                        <p className="strategic-body mb-5 text-foreground/68">{relatedPage.summary}</p>
                        <a
                          href={getServicePath(relatedId, locale)}
                          className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:text-accent"
                        >
                          {labels.relatedLink}
                        </a>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
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
