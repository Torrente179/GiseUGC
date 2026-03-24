import { Suspense, lazy, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { SiteLocale } from '@/lib/locale-path';
import { getHomePath, getHomeSectionHref, getServicePath, getVerticalPath } from '@/lib/locale-path';
import { getResourcePageContent, getResourcePath, type ResourcePageId } from '@/data/resource-pages';
import { getServicePageContent } from '@/data/service-pages';
import { getVerticalPageContent } from '@/data/vertical-pages';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageSeo from '@/components/PageSeo';

const FloatingContactDock = lazy(() => import('@/components/FloatingContactDock'));
const ServicesMarqueeSection = lazy(() => import('@/components/ServicesMarquee'));

const SITE_URL = 'https://www.giselasaldarriaga.com';
const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/573043786101';
const buildUrl = (pathname: string) => new URL(pathname, SITE_URL).toString();

type ResourcePageProps = {
  resourceId: ResourcePageId;
  locale: SiteLocale;
};

const localeLabels = {
  es: {
    home: 'Inicio',
    resources: 'Recursos',
    faq: 'Preguntas frecuentes',
    relatedServices: 'Servicios relacionados',
    relatedVerticals: 'Verticales relacionadas',
    startProject: 'Empezar proyecto',
    lastUpdated: 'Última actualización: 24 mar 2026',
    readMore: 'Leer más',
  },
  en: {
    home: 'Home',
    resources: 'Resources',
    faq: 'Frequently asked questions',
    relatedServices: 'Related services',
    relatedVerticals: 'Related verticals',
    startProject: 'Start a project',
    lastUpdated: 'Last updated: Mar 24, 2026',
    readMore: 'Read more',
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

/* ════════════════════════════════════════════════════════════════════
   RESOURCE PAGE — Editorial article layout
   ════════════════════════════════════════════════════════════════════ */

const ResourcePage = ({ resourceId, locale }: ResourcePageProps) => {
  const page = getResourcePageContent(resourceId, locale);
  const labels = localeLabels[locale];

  const canonical = buildUrl(page.path);
  const homeCanonical = buildUrl(getHomePath(locale));

  const relatedServices = useMemo(
    () =>
      page.relatedServiceIds.map((serviceId) => ({
        id: serviceId,
        content: getServicePageContent(serviceId, locale),
      })),
    [page.relatedServiceIds, locale],
  );

  const relatedVerticals = useMemo(
    () =>
      page.relatedVerticalIds.map((verticalId) => ({
        id: verticalId,
        content: getVerticalPageContent(verticalId, locale),
      })),
    [page.relatedVerticalIds, locale],
  );

  /* ── Schema.org ── */
  const schema = useMemo(() => {
    const breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: labels.home, item: homeCanonical },
      { '@type': 'ListItem', position: 2, name: labels.resources, item: homeCanonical },
      { '@type': 'ListItem', position: 3, name: page.breadcrumbLabel, item: canonical },
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
          dateModified: '2026-03-24',
          inLanguage: locale,
          isPartOf: { '@id': `${homeCanonical}#website` },
          breadcrumb: { '@id': `${canonical}#breadcrumb` },
          mainEntity: { '@id': `${canonical}#article` },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonical}#breadcrumb`,
          itemListElement: breadcrumbItems,
        },
        {
          '@type': 'Article',
          '@id': `${canonical}#article`,
          headline: page.heroTitle,
          description: page.metaDescription,
          url: canonical,
          datePublished: '2026-03-24',
          dateModified: '2026-03-24',
          inLanguage: locale,
          author: {
            '@type': 'Person',
            '@id': `${SITE_URL}/#person`,
            name: 'Gisela Saldarriaga',
            url: SITE_URL,
            jobTitle: locale === 'es' ? 'Creadora UGC profesional' : 'Professional UGC Creator',
          },
          publisher: {
            '@type': 'ProfessionalService',
            '@id': `${SITE_URL}/#business`,
            name: 'Gisela Saldarriaga UGC Studio',
            url: `${SITE_URL}/`,
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${canonical}#faq`,
          inLanguage: locale,
          mainEntity: page.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        },
      ],
    };
  }, [canonical, homeCanonical, labels.home, labels.resources, locale, page]);

  return (
    <>
      <PageSeo
        title={page.metaTitle}
        description={page.metaDescription}
        canonical={canonical}
        locale={locale}
        alternates={{
          es: buildUrl(getResourcePath(resourceId, 'es')),
          en: buildUrl(getResourcePath(resourceId, 'en')),
          xDefault: buildUrl(getResourcePath(resourceId, 'es')),
        }}
        structuredData={schema}
      />

      <div className="min-h-screen bg-background">
        <Navbar compactMobile />

        <main>
          {/* ── HERO ── */}
          <RevealSection className="st-hero">
            <div className="st-container pt-28 pb-16 md:pt-36 md:pb-20 lg:pt-40 lg:pb-24">
              {/* Breadcrumb */}
              <nav className="st-breadcrumb mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center gap-1.5 text-xs text-foreground/50">
                  <li>
                    <Link to={getHomePath(locale)} className="hover:text-foreground/70 transition-colors">
                      {labels.home}
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <span className="text-foreground/40">{labels.resources}</span>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <span className="text-foreground/70">{page.breadcrumbLabel}</span>
                  </li>
                </ol>
              </nav>

              <p className="st-eyebrow mb-3">{page.heroEyebrow}</p>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl lg:leading-[1.12] max-w-3xl">
                {page.heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/70 md:text-lg">
                {page.heroSummary}
              </p>

              {page.heroPoints.length > 0 && (
                <ul className="mt-6 flex flex-col gap-2 text-sm text-foreground/60 md:flex-row md:gap-6">
                  {page.heroPoints.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/30" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="st-cta-primary"
                >
                  {page.primaryCtaLabel}
                </a>
                <Link to={page.secondaryCtaHref} className="st-cta-secondary">
                  {page.secondaryCtaLabel}
                </Link>
              </div>
            </div>
          </RevealSection>

          {/* ── CONTENT SECTIONS ── */}
          {page.sections.map((section, sectionIndex) => (
            <RevealSection key={section.title} className="st-section">
              <div className="st-container py-12 md:py-16 lg:py-20">
                <h2 className="text-2xl font-semibold leading-snug tracking-tight text-foreground md:text-3xl max-w-2xl">
                  {section.title}
                </h2>
                <div className="mt-5 max-w-2xl space-y-4">
                  {section.body.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-base leading-relaxed text-foreground/70"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Render comparison table after the last section if it exists */}
                {sectionIndex === page.sections.length - 1 && page.comparisonTable && (
                  <div className="mt-12 overflow-x-auto">
                    <table className="w-full min-w-[600px] border-collapse text-sm">
                      <thead>
                        <tr>
                          {page.comparisonTable.headers.map((header) => (
                            <th
                              key={header}
                              className="border-b border-foreground/10 px-4 py-3 text-left font-semibold text-foreground/90"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {page.comparisonTable.rows.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className={rowIndex % 2 === 0 ? 'bg-foreground/[0.02]' : ''}
                          >
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cellIndex}
                                className={`border-b border-foreground/5 px-4 py-3 text-foreground/70 ${cellIndex === 0 ? 'font-medium text-foreground/90' : ''}`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </RevealSection>
          ))}

          {/* ── COMPARISON TABLE (standalone, if no sections rendered it inline) ── */}
          {page.sections.length === 0 && page.comparisonTable && (
            <RevealSection className="st-section">
              <div className="st-container py-12 md:py-16">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse text-sm">
                    <thead>
                      <tr>
                        {page.comparisonTable.headers.map((header) => (
                          <th
                            key={header}
                            className="border-b border-foreground/10 px-4 py-3 text-left font-semibold text-foreground/90"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {page.comparisonTable.rows.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className={rowIndex % 2 === 0 ? 'bg-foreground/[0.02]' : ''}
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className={`border-b border-foreground/5 px-4 py-3 text-foreground/70 ${cellIndex === 0 ? 'font-medium text-foreground/90' : ''}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </RevealSection>
          )}

          {/* ── FAQ SECTION ── */}
          {page.faqs.length > 0 && (
            <RevealSection className="st-section" id="faq">
              <div className="st-container py-12 md:py-16 lg:py-20">
                <p className="st-eyebrow mb-8">{labels.faq}</p>
                <div className="st-faq">
                  {page.faqs.map((faq, index) => (
                    <details
                      key={faq.question}
                      className={`st-faq-item ${index > 0 ? 'st-faq-item--bordered' : ''}`}
                    >
                      <summary className="st-faq-question">{faq.question}</summary>
                      <p className="st-faq-answer">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            </RevealSection>
          )}

          {/* ── RELATED SERVICES ── */}
          {relatedServices.length > 0 && (
            <RevealSection className="st-section">
              <div className="st-container py-12 md:py-16">
                <p className="st-eyebrow mb-6">{labels.relatedServices}</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedServices.map(({ id, content }) => (
                    <Link
                      key={id}
                      to={getServicePath(id, locale)}
                      className="group rounded-xl border border-foreground/5 bg-foreground/[0.02] p-5 transition-colors hover:border-foreground/10 hover:bg-foreground/[0.04]"
                    >
                      <p className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-2">
                        {content.heroEyebrow}
                      </p>
                      <p className="text-sm font-semibold text-foreground/90 group-hover:text-foreground transition-colors">
                        {content.navLabel}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-foreground/50 line-clamp-2">
                        {content.metaDescription}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </RevealSection>
          )}

          {/* ── RELATED VERTICALS ── */}
          {relatedVerticals.length > 0 && (
            <RevealSection className="st-section">
              <div className="st-container py-12 md:py-16">
                <p className="st-eyebrow mb-6">{labels.relatedVerticals}</p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedVerticals.map(({ id, content }) => (
                    <Link
                      key={id}
                      to={getVerticalPath(id, locale)}
                      className="group rounded-xl border border-foreground/5 bg-foreground/[0.02] p-5 transition-colors hover:border-foreground/10 hover:bg-foreground/[0.04]"
                    >
                      <p className="text-xs font-medium uppercase tracking-wider text-foreground/40 mb-2">
                        {content.heroEyebrow}
                      </p>
                      <p className="text-sm font-semibold text-foreground/90 group-hover:text-foreground transition-colors">
                        {content.navLabel}
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-foreground/50 line-clamp-2">
                        {content.metaDescription}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </RevealSection>
          )}

          {/* ── CTA CLOSE ── */}
          <RevealSection className="st-close">
            <div className="st-container st-close-inner py-16 md:py-24 text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {page.ctaTitle}
              </h2>
              <p className="st-close-text mt-4 max-w-lg mx-auto">{page.ctaText}</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="st-cta-primary st-cta-primary--lg mt-8 inline-block"
              >
                {labels.startProject}
              </a>
              <p className="mt-6 text-xs text-foreground/40">{labels.lastUpdated}</p>
            </div>
          </RevealSection>

          {/* ── SERVICES MARQUEE ── */}
          <Suspense fallback={null}>
            <ServicesMarqueeSection liteMobile />
          </Suspense>
        </main>

        <Footer />
        <Suspense fallback={null}>
          <FloatingContactDock />
        </Suspense>
      </div>
    </>
  );
};

export default ResourcePage;
