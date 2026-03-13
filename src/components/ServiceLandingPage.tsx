import { Suspense, lazy, useMemo } from 'react';
import type { ServicePageId, SiteLocale } from '@/lib/locale-path';
import { getHomePath, getHomeSectionHref, getServicePath } from '@/lib/locale-path';
import { getServicePageContent, getRelatedServiceSummaries } from '@/data/service-pages';
import { LEGACY_REEL_CLIPS } from '@/data/portfolio-clips';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageSeo from '@/components/PageSeo';

const FloatingContactDock = lazy(() => import('@/components/FloatingContactDock'));

const SITE_URL = 'https://www.giselasaldarriaga.com';
const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/573043786101';
const fiverrUrl = import.meta.env.VITE_FIVERR_URL ?? 'https://www.fiverr.com/gisela_sm?source=gig_page';

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
  }, [canonical, homeCanonical, labels.home, labels.services, locale, page.breadcrumbLabel, page.faqs, page.metaDescription, page.metaTitle, page.navLabel]);

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

        <main className="pt-28 md:pt-32 pb-16 md:pb-24">
          <section className="studio-section pt-8 md:pt-12 pb-8 md:pb-10">
            <div className="studio-container">
              <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/45">
                <a href={getHomePath(locale)} className="hover:text-primary transition-colors">{labels.home}</a>
                <span>/</span>
                <a href={getHomeSectionHref(locale, 'services')} className="hover:text-primary transition-colors">{labels.services}</a>
                <span>/</span>
                <span className="text-foreground/75">{page.breadcrumbLabel}</span>
              </nav>

              <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
                <div>
                  <p className="section-label mb-4">{page.heroEyebrow}</p>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[0.92] tracking-tight-serif text-foreground max-w-4xl">
                    {page.heroTitle}
                  </h1>
                  <p className="strategic-body mt-6 max-w-3xl text-lg md:text-xl text-foreground/72">
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
                    <a href={page.secondaryCtaHref} className="rounded-full border border-border/80 bg-card/70 px-6 py-3 text-sm font-semibold text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary">
                      {page.secondaryCtaLabel}
                    </a>
                  </div>
                </div>

                <aside className="rounded-[1.75rem] border border-border/70 bg-card/60 p-6 md:p-8 shadow-[0_28px_90px_-48px_rgba(47,42,36,0.45)] backdrop-blur-md">
                  <p className="section-label mb-4">{page.sectionIntroTitle}</p>
                  <p className="strategic-body text-foreground/68">{page.sectionIntroText}</p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    {page.marketItems.map((item) => (
                      <div key={item} className="rounded-2xl border border-border/60 bg-background/70 px-4 py-4 text-sm text-foreground/72">
                        {item}
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            </div>
          </section>

          <section className="studio-section pt-0 pb-8 md:pb-10">
            <div className="studio-container">
              <div className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-[1.5rem] border border-border/70 bg-card/55 p-6 md:p-8">
                  <p className="section-label mb-4">{page.bestFitTitle}</p>
                  <ul className="space-y-4 text-foreground/74">
                    {page.bestFitItems.map((item) => (
                      <li key={item} className="rounded-2xl border border-border/60 bg-background/70 px-4 py-4 text-sm md:text-base">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
                <article className="rounded-[1.5rem] border border-border/70 bg-card/55 p-6 md:p-8">
                  <p className="section-label mb-4">{page.notFitTitle}</p>
                  <ul className="space-y-4 text-foreground/74">
                    {page.notFitItems.map((item) => (
                      <li key={item} className="rounded-2xl border border-border/60 bg-background/70 px-4 py-4 text-sm md:text-base">
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </section>

          <section className="studio-section pt-0 pb-8 md:pb-10">
            <div className="studio-container">
              <div className="studio-header mb-10">
                <div>
                  <p className="section-label mb-4">{page.deliverablesTitle}</p>
                  <h2 className="studio-title">{page.navLabel}</h2>
                </div>
                <p className="studio-subtitle lg:justify-self-end max-w-2xl">{page.metaDescription}</p>
              </div>
              <div className="studio-rule mb-12" />
              <div className="grid gap-5 md:grid-cols-2">
                {page.deliverables.map((item) => (
                  <article key={item.title} className="rounded-[1.5rem] border border-border/70 bg-card/55 p-6 md:p-8">
                    <h3 className="text-2xl font-medium tracking-tight text-foreground mb-3">{item.title}</h3>
                    <p className="strategic-body text-foreground/68">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="studio-section pt-0 pb-8 md:pb-10">
            <div className="studio-container">
              <div className="grid gap-5 md:grid-cols-4">
                {page.processSteps.map((step) => (
                  <article key={step.title} className="rounded-[1.5rem] border border-border/70 bg-card/55 p-6 md:p-7">
                    <p className="section-label mb-4">{page.processTitle}</p>
                    <h3 className="text-xl font-medium tracking-tight text-foreground mb-3">{step.title}</h3>
                    <p className="strategic-body text-foreground/68 text-sm md:text-base">{step.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="studio-section pt-0 pb-8 md:pb-10" id="examples">
            <div className="studio-container">
              <div className="studio-header mb-10">
                <div>
                  <p className="section-label mb-4">{page.featuredTitle}</p>
                  <h2 className="studio-title">{page.featuredIntro}</h2>
                </div>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                {page.featuredExamples.map((example) => {
                  const clip = clipMap.get(example.clipId);
                  if (!clip) return null;

                  return (
                    <article key={example.clipId} className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-card/60 shadow-[0_24px_80px_-54px_rgba(47,42,36,0.46)]">
                      <div className="aspect-[4/5] overflow-hidden bg-secondary/25">
                        <img
                          src={clip.posterSrc}
                          alt={example.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="p-6 md:p-7">
                        <h3 className="text-2xl font-medium tracking-tight text-foreground mb-3">{example.title}</h3>
                        <p className="strategic-body text-foreground/68 mb-5">{example.description}</p>
                        <a
                          href={clip.mainSrc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.18em] text-primary hover:text-accent transition-colors"
                        >
                          {labels.openSample}
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="studio-section pt-0 pb-8 md:pb-10" id="faq">
            <div className="studio-container max-w-5xl">
              <div className="mb-10 text-center">
                <p className="section-label mb-4">{page.faqTitle}</p>
                <h2 className="studio-title">{page.navLabel}</h2>
              </div>
              <div className="space-y-4">
                {page.faqs.map((faq) => (
                  <details key={faq.question} className="rounded-[1.4rem] border border-border/70 bg-card/55 p-5 md:p-6">
                    <summary className="cursor-pointer list-none text-lg font-medium tracking-tight text-foreground">{faq.question}</summary>
                    <p className="strategic-body mt-4 text-foreground/68">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section className="studio-section pt-0 pb-8 md:pb-10">
            <div className="studio-container">
              <div className="rounded-[1.8rem] border border-border/70 bg-card/60 p-7 md:p-10 text-center shadow-[0_28px_90px_-50px_rgba(47,42,36,0.48)]">
                <p className="section-label mb-4">{page.ctaTitle}</p>
                <p className="strategic-body mx-auto max-w-3xl text-foreground/68">{page.ctaText}</p>
                <div className="mt-7 flex flex-wrap justify-center gap-4">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary-nordic btn-shimmer px-7 py-3">
                    {labels.useWhatsApp}
                  </a>
                  <a href={fiverrUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border/80 bg-background/75 px-6 py-3 text-sm font-semibold text-foreground/75 transition-colors hover:border-primary/40 hover:text-primary">
                    {labels.useFiverr}
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="studio-section pt-0 pb-6 md:pb-8">
            <div className="studio-container">
              <div className="studio-header mb-10">
                <div>
                  <p className="section-label mb-4">{page.relatedTitle}</p>
                  <h2 className="studio-title">{page.relatedTitle}</h2>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {page.relatedServiceIds.map((relatedId, index) => {
                  const relatedPage = relatedPages[index];
                  return (
                    <article key={relatedId} className="rounded-[1.5rem] border border-border/70 bg-card/55 p-6 md:p-8">
                      <p className="section-label mb-3">{relatedPage.eyebrow}</p>
                      <h3 className="text-2xl font-medium tracking-tight text-foreground mb-3">{relatedPage.title}</h3>
                      <p className="strategic-body text-foreground/68 mb-5">{relatedPage.summary}</p>
                      <a href={getServicePath(relatedId, locale)} className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.18em] text-primary hover:text-accent transition-colors">
                        {labels.relatedLink}
                      </a>
                    </article>
                  );
                })}
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
