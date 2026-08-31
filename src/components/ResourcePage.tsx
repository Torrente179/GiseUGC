import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { ResourcePageId, SiteLocale } from '@/lib/locale-path';
import { getHomePath, getResourcePath, getServicePath, getVerticalPath } from '@/lib/locale-path';
import type { ResourceLandingRouteData } from '@/data/landing-route-types';
import { CONTENT_DATES } from '@/data/content-dates';
import { getAllResourceIds, getResourcePageContent } from '@/data/resource-pages';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import PageSeo from '@/components/PageSeo';
import { RevealSection } from '@/components/motion/RevealSection';
import FloatingContactDock from '@/components/FloatingContactDock';
import DeferredServicesMarquee from '@/components/DeferredServicesMarquee';
import { InlineCopy } from '@/lib/inline-copy-links';
import '@/styles/templates.css';

const SITE_URL = 'https://www.giselasaldarriaga.com';
const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/573043786101';
const buildUrl = (pathname: string) => new URL(pathname, SITE_URL).toString();

type ResourcePageProps = {
  resourceId: ResourcePageId;
  locale: SiteLocale;
  routeData: ResourceLandingRouteData;
};

const localeLabels = {
  es: {
    home: 'Inicio',
    resources: 'Recursos',
    faq: 'Preguntas frecuentes',
    faqKicker: 'Preguntas',
    relatedServices: 'Servicios relacionados',
    relatedVerticals: 'Por industria',
    otherGuides: 'Otras guías',
    inThisArticle: 'En este artículo',
    atAGlance: 'De un vistazo',
    startProject: 'Empezar proyecto',
    lastUpdated: 'Última actualización: 29 jul 2026',
  },
  en: {
    home: 'Home',
    resources: 'Resources',
    faq: 'Frequently asked questions',
    faqKicker: 'Questions',
    relatedServices: 'Related services',
    relatedVerticals: 'By industry',
    otherGuides: 'Other guides',
    inThisArticle: 'In this article',
    atAGlance: 'At a glance',
    startProject: 'Start a project',
    lastUpdated: 'Last updated: Jul 29, 2026',
  },
} as const;

const sectionId = (title: string) =>
  title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72);

const tocLabel = (title: string) => title.replace(/^\d+\.\s*/, '');
const hasOwnNumber = (title: string) => /^\d+\.\s*/.test(title);


/* ════════════════════════════════════════════════════════════════════
   RESOURCE PAGE — Editorial article layout
   ════════════════════════════════════════════════════════════════════ */

/* Article dates. Kept beside the visible "last updated" label above so the
   two can never drift: a schema date that contradicts the date on the page is
   a trust signal you cannot cash. Update both together, and only on a real
   revision — never on a build. Current values match the last content commit
   to the resource entrypoints (git: 2026-07-29). */
const RESOURCE_DATE_PUBLISHED = '2026-03-24';
const RESOURCE_DATE_MODIFIED = CONTENT_DATES.resources;

const serializeRouteData = (routeData: ResourceLandingRouteData) =>
  JSON.stringify(routeData).replace(/</g, '\\u003c');

const ResourcePage = ({
  resourceId,
  locale,
  routeData,
}: ResourcePageProps) => {
  const { page, relatedServices, relatedVerticals } = routeData;
  const labels = localeLabels[locale];
  const otherGuides = useMemo(
    () =>
      getAllResourceIds()
        .filter((id) => id !== resourceId)
        .map((id) => ({ id, label: getResourcePageContent(id, locale).navLabel })),
    [locale, resourceId],
  );

  const canonical = buildUrl(page.path);
  const homeCanonical = buildUrl(getHomePath(locale));

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
          dateModified: RESOURCE_DATE_MODIFIED,
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
          datePublished: RESOURCE_DATE_PUBLISHED,
          dateModified: RESOURCE_DATE_MODIFIED,
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
      <script
        id="route-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: serializeRouteData(routeData) }}
      />

      <div className="min-h-screen bg-background">
        <Navbar compactMobile />

        <main className="rsc-page">
          <RevealSection className="rsc-hero">
            <div className="st-container">
              <nav className="st-breadcrumb" aria-label="Breadcrumb">
                <Link to={getHomePath(locale)}>{labels.home}</Link>
                <span aria-hidden="true">/</span>
                <span>{labels.resources}</span>
                <span aria-hidden="true">/</span>
                <span>{page.breadcrumbLabel}</span>
              </nav>
              <p className="st-eyebrow">{page.heroEyebrow}</p>
              <h1 className="rsc-hero-title font-serif">{page.heroTitle}</h1>
              <p className="rsc-hero-lead">{page.heroSummary}</p>
              {page.heroPoints.length > 0 && (
                <>
                  <div className="rsc-rule" aria-hidden="true" />
                  <ul className="rsc-points">
                    {page.heroPoints.map((point, index) => (
                      <li key={point}>
                        <span className="rsc-points-num">{String(index + 1).padStart(2, '0')}</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </RevealSection>

          <RevealSection className="rsc-article">
            <div className={`st-container rsc-article-grid${page.sections.length > 3 ? ' rsc-article-grid--toc' : ''}`}>
              {page.sections.length > 3 && (
                <aside className="rsc-toc" aria-label={labels.inThisArticle}>
                  <p className="st-eyebrow">{labels.inThisArticle}</p>
                  <ol>
                    {page.sections.map((section, index) => (
                      <li key={section.title}>
                        <a href={`#${sectionId(section.title)}`}>
                          <span>{String(index + 1).padStart(2, '0')}</span>
                          {tocLabel(section.title)}
                        </a>
                      </li>
                    ))}
                    {page.comparisonTable && (
                      <li>
                        <a href={`#${sectionId(labels.atAGlance)}`}>
                          <span>{String(page.sections.length + 1).padStart(2, '0')}</span>
                          {labels.atAGlance}
                        </a>
                      </li>
                    )}
                    {page.faqs.length > 0 && (
                      <li>
                        <a href="#faq">
                          <span>
                            {String(page.sections.length + (page.comparisonTable ? 2 : 1)).padStart(2, '0')}
                          </span>
                          {labels.faq}
                        </a>
                      </li>
                    )}
                  </ol>
                </aside>
              )}

              <article>
                {page.sections.map((section, index) => (
                  <section key={section.title} className="rsc-chapter" id={sectionId(section.title)}>
                    {!hasOwnNumber(section.title) && (
                      <span className="rsc-chapter-num" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                    <h2 className="rsc-chapter-title font-serif">{section.title}</h2>
                    {section.body.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>
                        <InlineCopy text={paragraph} />
                      </p>
                    ))}
                  </section>
                ))}

                {page.comparisonTable && (
                  <section className="rsc-chapter" id={sectionId(labels.atAGlance)}>
                    <span className="rsc-chapter-num" aria-hidden="true">
                      {String(page.sections.length + 1).padStart(2, '0')}
                    </span>
                    <h2 className="rsc-chapter-title font-serif">{labels.atAGlance}</h2>
                    <div className="rsc-table-wrap">
                      <table className="rsc-table">
                        <caption className="sr-only">{labels.atAGlance}</caption>
                        <thead>
                          <tr>
                            {page.comparisonTable.headers.map((header) => (
                              <th key={header} scope="col">{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {page.comparisonTable.rows.map((row) => (
                            <tr key={row[0]}>
                              {row.map((cell, cellIndex) =>
                                cellIndex === 0 ? (
                                  <th key={`${row[0]}-${cellIndex}`} scope="row" className="is-key">
                                    {cell}
                                  </th>
                                ) : (
                                  <td key={`${row[0]}-${cellIndex}`}>{cell}</td>
                                ),
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}
              </article>
            </div>
          </RevealSection>

          {page.faqs.length > 0 && (
            <RevealSection className="rsc-block" id="faq">
              <div className="st-container">
                <div className="rsc-faq-layout">
                  <div>
                    <p className="st-eyebrow">{labels.faqKicker}</p>
                    <h2 className="rsc-block-title font-serif">{labels.faq}</h2>
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
            </RevealSection>
          )}

          {(relatedServices.length > 0 || relatedVerticals.length > 0) && (
            <RevealSection className="rsc-block">
              <div className="st-container rsc-related">
                {relatedServices.length > 0 && (
                  <div>
                    <p className="st-eyebrow">{labels.relatedServices}</p>
                    {relatedServices.map((service) => (
                      <Link key={service.id} to={getServicePath(service.id, locale)} className="st-related-row group">
                        <span className="st-related-title">{service.navLabel}</span>
                        <span className="st-related-arrow">→</span>
                      </Link>
                    ))}
                  </div>
                )}
                {relatedVerticals.length > 0 && (
                  <div>
                    <p className="st-eyebrow">{labels.relatedVerticals}</p>
                    {relatedVerticals.map((vertical) => (
                      <Link key={vertical.id} to={getVerticalPath(vertical.id, locale)} className="st-related-row group">
                        <span className="st-related-title">{vertical.navLabel}</span>
                        <span className="st-related-arrow">→</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </RevealSection>
          )}

          <RevealSection className="svc-inner-close">
            <div className="st-container svc-inner-close-grid">
              <div>
                <h2 className="svc-inner-close-title font-serif">{page.ctaTitle}</h2>
                <p className="svc-inner-close-text">{page.ctaText}</p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="st-cta-primary st-cta-primary--lg">
                  {page.primaryCtaLabel}
                </a>
                <p className="svc-inner-updated">{labels.lastUpdated}</p>
              </div>
              {otherGuides.length > 0 && (
                <div>
                  <p className="st-eyebrow mb-5">{labels.otherGuides}</p>
                  {otherGuides.map((guide) => (
                    <Link key={guide.id} to={getResourcePath(guide.id, locale)} className="st-related-row group">
                      <span className="st-related-title">{guide.label}</span>
                      <span className="st-related-arrow">→</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </RevealSection>

          <DeferredServicesMarquee liteMobile />
        </main>

        <SiteFooter />
        <FloatingContactDock />
      </div>
    </>
  );
};

export default ResourcePage;
