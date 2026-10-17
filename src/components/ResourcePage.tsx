import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { ResourcePageId, SiteLocale } from '@/lib/locale-path';
import { getHomePath, getHubPath, getResourcePath, getServicePath } from '@/lib/locale-path';
import type { ResourceLandingRouteData } from '@/data/landing-route-types';
import { CONTENT_DATES, formatLastUpdatedLabel } from '@/data/content-dates';
import { HUB_LABELS } from '@/data/hub-labels';
import { getAllResourceIds, getResourcePageContent, type ComparisonTable } from '@/data/resource-pages';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import PageSeo from '@/components/PageSeo';
import { RevealSection } from '@/components/motion/RevealSection';
import FloatingContactDock from '@/components/FloatingContactDock';
import DeferredServicesMarquee from '@/components/DeferredServicesMarquee';
import { InlineCopy, serializeRouteDataJson, visibleInlineCopy } from '@/lib/inline-copy-links';
import { ArrowRight } from 'lucide-react';
import { useActiveSection } from '@/hooks/use-active-section';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import '@/styles/templates.css';
import '@/styles/guide.css';

const SITE_URL = 'https://www.giselasaldarriaga.com';
const buildUrl = (pathname: string) => new URL(pathname, SITE_URL).toString();

type ResourcePageProps = {
  resourceId: ResourcePageId;
  locale: SiteLocale;
  routeData: ResourceLandingRouteData;
};

const localeLabels = {
  es: {
    home: 'Inicio',
    resources: HUB_LABELS.resources.es,
    faq: 'Preguntas frecuentes',
    faqKicker: 'Preguntas',
    relatedServices: 'Servicios relacionados',
    otherGuides: 'Otras guías',
    keepReading: 'Seguir leyendo',
    inThisArticle: 'En este artículo',
    atAGlance: 'De un vistazo',
    startProject: 'Empezar proyecto',
  },
  en: {
    home: 'Home',
    resources: HUB_LABELS.resources.en,
    faq: 'Frequently asked questions',
    faqKicker: 'Questions',
    relatedServices: 'Related services',
    otherGuides: 'Other guides',
    keepReading: 'Keep reading',
    inThisArticle: 'In this article',
    atAGlance: 'At a glance',
    startProject: 'Start a project',
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


/* ════════════════════════════════════════════════════════════════════
   RESOURCE PAGE — guide template in the service pages' language
   (DM Sans, linen ground, glass panels, the close card). Styles:
   src/styles/guide.css.
   ════════════════════════════════════════════════════════════════════ */

/* Article dates. Visible "last updated" and JSON-LD dateModified both read
   CONTENT_DATES.resources so they cannot drift. datePublished is the original
   resource-page launch. Never stamp either from build time. */
const RESOURCE_DATE_PUBLISHED = '2026-03-24';
const RESOURCE_DATE_MODIFIED = CONTENT_DATES.resources;

const serializeRouteData = serializeRouteDataJson;

const ResourceTable = ({ table, caption }: { table: ComparisonTable; caption: string }) => (
  <div className="gd-table-wrap">
    <table className="gd-table">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          {table.headers.map((header) => (
            <th key={header} scope="col">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, rowIndex) => (
          <tr key={`${row[0]}-${row[1] ?? rowIndex}`}>
            {row.map((cell, cellIndex) =>
              cellIndex === 0 ? (
                <th key={`${rowIndex}-${cellIndex}`} scope="row" className="is-key">
                  <InlineCopy text={cell} />
                </th>
              ) : (
                <td key={`${rowIndex}-${cellIndex}`}>
                  <InlineCopy text={cell} />
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const pad = (value: number) => String(value).padStart(2, '0');

/* Copy arrows ("Escríbeme directo →") are drawn as the pill's icon instead. */
const ctaLabel = (label: string) => label.replace(/\s*→\s*$/u, '');

/* A contact CTA opens the contact panel in place (useHashlessSectionNavigation);
   "/#contact" would be a cross-document load to the homepage strip. */
const isContactHref = (href: string) => /#contact$/u.test(href);

const ResourcePage = ({
  resourceId,
  locale,
  routeData,
}: ResourcePageProps) => {
  const { page, relatedServices } = routeData;
  const labels = {
    ...localeLabels[locale],
    lastUpdated: formatLastUpdatedLabel(CONTENT_DATES.resources, locale),
  };
  const otherGuides = useMemo(
    () =>
      getAllResourceIds()
        .filter((id) => id !== resourceId)
        .map((id) => ({ id, label: getResourcePageContent(id, locale).navLabel })),
    [locale, resourceId],
  );

  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const chapters = useMemo(
    () => [
      ...page.sections.map((section) => ({ id: sectionId(section.title), label: tocLabel(section.title) })),
      ...(page.comparisonTable ? [{ id: sectionId(labels.atAGlance), label: labels.atAGlance }] : []),
      ...(page.faqs.length > 0 ? [{ id: 'faq', label: labels.faq }] : []),
    ],
    [labels.atAGlance, labels.faq, page.comparisonTable, page.faqs.length, page.sections],
  );
  const showToc = page.sections.length > 3;
  const activeChapter = useActiveSection(
    chapters.map((chapter) => chapter.id),
    showToc,
  );

  const contactLink = (href: string) =>
    isContactHref(href)
      ? { href: '#contact', onClick: handleHashLinkClick }
      : { href, ...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}) };

  const canonical = buildUrl(page.path);
  const homeCanonical = buildUrl(getHomePath(locale));

  /* ── Schema.org ── */
  const schema = useMemo(() => {
    const breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: labels.home, item: homeCanonical },
      { '@type': 'ListItem', position: 2, name: labels.resources, item: buildUrl(getHubPath('resources', locale)) },
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
            acceptedAnswer: { '@type': 'Answer', text: visibleInlineCopy(faq.answer) },
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
        <Navbar />

        <main className="gd">
          <RevealSection className="gd-hero">
            <div className="gd-wrap">
              <nav className="gd-crumbs" aria-label="Breadcrumb">
                <Link to={getHomePath(locale)}>{labels.home}</Link>
                <span aria-hidden="true">/</span>
                <Link to={getHubPath('resources', locale)}>{labels.resources}</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{page.breadcrumbLabel}</span>
              </nav>
              <div className="gd-hero-head">
                <p className="gd-pill">
                  <span className="gd-dot" aria-hidden="true" />
                  {page.heroEyebrow}
                </p>
                <h1 className="gd-h1 section-label">{page.heroTitle}</h1>
                <p className="gd-lead">{page.heroSummary}</p>
                {page.leadCtaLabel && page.leadCtaHref ? (
                  <a className="gd-want" {...contactLink(page.leadCtaHref)}>
                    {ctaLabel(page.leadCtaLabel)}
                    <i aria-hidden="true">
                      <ArrowRight />
                    </i>
                  </a>
                ) : null}
              </div>
              {page.heroPoints.length > 0 && (
                <ul className="gd-points">
                  {page.heroPoints.map((point, index) => (
                    <li key={point}>
                      <span className="gd-k">{pad(index + 1)}</span>
                      <span className="gd-point">{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </RevealSection>

          <div className={`gd-wrap gd-body${showToc ? ' gd-body--toc' : ''}`}>
            {showToc && (
              <nav className="gd-toc" aria-label={labels.inThisArticle}>
                <p className="gd-k">{labels.inThisArticle}</p>
                <ol>
                  {chapters.map((chapter, index) => (
                    <li key={chapter.id}>
                      <a
                        href={`#${chapter.id}`}
                        onClick={handleHashLinkClick}
                        aria-current={chapter.id === activeChapter ? 'true' : undefined}
                      >
                        <span>{pad(index + 1)}</span>
                        {chapter.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <article className="gd-article">
              {page.sections.map((section, index) => (
                <RevealSection key={section.title} className="gd-ch" id={sectionId(section.title)}>
                  <span className="gd-k gd-k--teal" aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  <h2 className="gd-h2 section-label">{tocLabel(section.title)}</h2>
                  {section.italicLead ? <p className="gd-say">{section.italicLead}</p> : null}
                  {(section.bodyBefore ?? []).map((paragraph, paragraphIndex) => (
                    <p key={`before-${paragraphIndex}`} className="gd-p">
                      <InlineCopy text={paragraph} />
                    </p>
                  ))}
                  {section.table ? <ResourceTable table={section.table} caption={section.title} /> : null}
                  {section.body.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex} className="gd-p">
                      <InlineCopy text={paragraph} />
                    </p>
                  ))}
                  {section.bullets && section.bullets.length > 0 ? (
                    <ul className="gd-list">
                      {section.bullets.map((item) => (
                        <li key={item}>
                          <InlineCopy text={item} />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </RevealSection>
              ))}

              {page.comparisonTable && (
                <RevealSection className="gd-ch" id={sectionId(labels.atAGlance)}>
                  <span className="gd-k gd-k--teal" aria-hidden="true">
                    {pad(page.sections.length + 1)}
                  </span>
                  <h2 className="gd-h2 section-label">{labels.atAGlance}</h2>
                  <ResourceTable table={page.comparisonTable} caption={labels.atAGlance} />
                </RevealSection>
              )}
            </article>
          </div>

          {page.faqs.length > 0 && (
            <RevealSection className="gd-faq" id="faq">
              <div className="gd-wrap">
                <p className="gd-k gd-k--center">{labels.faqKicker}</p>
                <h2 className="gd-h2 gd-h2--xl section-label">{labels.faq}</h2>
                <div className="gd-faq-list">
                  {page.faqs.map((faq, index) => (
                    <details key={faq.question} className="gd-q" {...(index === 0 ? { open: true } : {})}>
                      <summary>
                        <span>{faq.question}</span>
                        <i className="gd-q-mark" aria-hidden="true" />
                      </summary>
                      <p className="gd-p">
                        <InlineCopy text={faq.answer} />
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </RevealSection>
          )}

          <RevealSection className="gd-close">
            <div className="gd-orb gd-orb--a" aria-hidden="true" />
            <div className="gd-orb gd-orb--b" aria-hidden="true" />
            <div className="gd-wrap">
              <div className="gd-close-top">
                <p className="gd-pill">
                  <span className="gd-dot" aria-hidden="true" />
                  {labels.startProject}
                </p>
                <h2 className="gd-h2 gd-h2--xl section-label">{page.ctaTitle}</h2>
                <p className="gd-lead">
                  <InlineCopy text={page.ctaText} />
                </p>
                <div className="gd-close-actions">
                  <a className="gd-cta" {...contactLink(page.primaryCtaHref)}>
                    {page.primaryCtaLabel}
                    <i aria-hidden="true">
                      <ArrowRight />
                    </i>
                  </a>
                  <p className="gd-updated">{labels.lastUpdated}</p>
                </div>
              </div>

              {(relatedServices.length > 0 || otherGuides.length > 0) && (
                <nav className="gd-index" aria-label={labels.keepReading}>
                  {[
                    {
                      key: 'services',
                      label: labels.relatedServices,
                      items: relatedServices.map((service) => ({
                        key: service.id,
                        href: getServicePath(service.id, locale),
                        title: service.navLabel,
                      })),
                    },
                    {
                      key: 'guides',
                      label: labels.otherGuides,
                      items: otherGuides.map((guide) => ({
                        key: guide.id,
                        href: getResourcePath(guide.id, locale),
                        title: guide.label,
                      })),
                    },
                  ]
                    .filter((column) => column.items.length > 0)
                    .map((column, index) => (
                      <div key={column.key}>
                        <div className="gd-gh">
                          <p className="gd-k">
                            <b>{pad(index + 1)}</b>
                            {column.label}
                          </p>
                          <span className="gd-k">{pad(column.items.length)}</span>
                        </div>
                        {column.items.map((item) => (
                          <Link key={item.key} to={item.href} className="gd-row">
                            <span>{item.title}</span>
                            <ArrowRight aria-hidden="true" />
                          </Link>
                        ))}
                      </div>
                    ))}
                </nav>
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
