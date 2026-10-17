import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import PageSeo from '@/components/PageSeo';
import FloatingContactDock from '@/components/FloatingContactDock';
import { CONTENT_DATES } from '@/data/content-dates';
import { getHubPageContent } from '@/data/hub-pages';
import { FIVERR_AGGREGATE_RATING } from '@/data/site-proof';
import { InlineCopy } from '@/lib/inline-copy-links';
import {
  getHomePath,
  getHubPath,
  type HubPageId,
  type SiteLocale,
} from '@/lib/locale-path';
import '@/styles/templates.css';

const SITE_URL = 'https://www.giselasaldarriaga.com';
const buildUrl = (pathname: string) => new URL(pathname, SITE_URL).toString();

type HubPageProps = {
  hubId: HubPageId;
  locale: SiteLocale;
};

const chrome = {
  es: {
    home: 'Inicio',
    links: 'Enlaces',
    siblings: 'Otras secciones',
  },
  en: {
    home: 'Home',
    links: 'Links',
    siblings: 'Other sections',
  },
} as const;

/**
 * Hub index (/servicios/, /verticales/, /recursos/ and EN twins). Same chrome as
 * the pages it lists — navbar, breadcrumb, page-end strip, contact dock — and the
 * guide template's hero and arrow rows (src/styles/templates.css), so a hub reads
 * as the parent of its child pages rather than a separate site.
 */
const HubPage = ({ hubId, locale }: HubPageProps) => {
  const labels = chrome[locale];
  const page = getHubPageContent(hubId, locale);
  const canonical = buildUrl(page.path);
  const esUrl = buildUrl(getHubPath(hubId, 'es'));
  const enUrl = buildUrl(getHubPath(hubId, 'en'));
  const homePath = getHomePath(locale);
  const homeCanonical = buildUrl(homePath);

  const schema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          url: canonical,
          name: page.metaTitle,
          description: page.metaDescription,
          dateModified: CONTENT_DATES.hubs,
          inLanguage: locale,
          isPartOf: { '@id': `${homeCanonical}#website` },
          breadcrumb: { '@id': `${canonical}#breadcrumb` },
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonical}#breadcrumb`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: labels.home,
              item: homeCanonical,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: page.breadcrumbLabel,
              item: canonical,
            },
          ],
        },
        ...(page.proof
          ? [
              {
                '@type': 'ProfessionalService',
                '@id': `${SITE_URL}/#business`,
                name: 'Gisela Saldarriaga UGC Studio',
                url: `${SITE_URL}/`,
                aggregateRating: FIVERR_AGGREGATE_RATING,
              },
            ]
          : []),
      ],
    }),
    [
      canonical,
      homeCanonical,
      labels.home,
      locale,
      page.breadcrumbLabel,
      page.metaDescription,
      page.metaTitle,
      page.proof,
    ],
  );

  return (
    <>
      <PageSeo
        title={page.metaTitle}
        description={page.metaDescription}
        canonical={canonical}
        locale={locale}
        alternates={{
          es: esUrl,
          en: enUrl,
          xDefault: esUrl,
        }}
        structuredData={schema}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="rsc-page">
          <section className="rsc-hero">
            <div className="st-container">
              <nav className="st-breadcrumb" aria-label="Breadcrumb">
                <Link to={homePath}>{labels.home}</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{page.breadcrumbLabel}</span>
              </nav>
              <h1 className="route-title-accent type-marketing-display max-w-[28ch] text-[1.75rem] font-semibold leading-[1.14] tracking-tight-marketing md:text-[2rem] lg:text-[2.25rem]">
                {page.heroTitle}
              </h1>
              <p className="rsc-hero-lead hub-lead">
                <InlineCopy text={page.lead} />
              </p>
            </div>
          </section>

          <section className="rsc-block">
            <div className="st-container">
              <h2 className="st-eyebrow hub-children-title">{page.childrenTitle}</h2>
              <nav aria-label={labels.links} className="hub-children">
                {page.children.map((child) => (
                  <Link key={child.href} to={child.href} className="st-related-row group">
                    <span className="hub-child-copy">
                      <span className="st-related-title">{child.title}</span>
                      {child.blurb ? <span className="hub-child-blurb">{child.blurb}</span> : null}
                    </span>
                    <span className="st-related-arrow" aria-hidden="true">→</span>
                  </Link>
                ))}
              </nav>
            </div>
          </section>

          <section className="rsc-block">
            <div className="st-container hub-close">
              <div>
                {page.proof ? (
                  <p className="hub-proof">
                    <InlineCopy text={page.proof} />
                  </p>
                ) : null}
                <a href={page.primaryCtaHref} className="st-cta-primary">
                  {page.primaryCtaLabel}
                </a>
              </div>
              <nav aria-label={labels.siblings} className="hub-siblings">
                {page.secondaryLinks.map((link) => (
                  <Link key={link.href} to={link.href} className="st-related-row group">
                    <span className="st-related-title">{link.label}</span>
                    <span className="st-related-arrow" aria-hidden="true">→</span>
                  </Link>
                ))}
              </nav>
            </div>
          </section>
        </main>

        <SiteFooter />
        <FloatingContactDock />
      </div>
    </>
  );
};

export default HubPage;
