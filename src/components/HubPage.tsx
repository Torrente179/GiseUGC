import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import PageSeo from '@/components/PageSeo';
import FloatingContactDock from '@/components/FloatingContactDock';
import { RevealSection } from '@/components/motion/RevealSection';
import { CONTENT_DATES } from '@/data/content-dates';
import { getHubPageContent } from '@/data/hub-pages';
import { FIVERR_AGGREGATE_RATING } from '@/data/site-proof';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { InlineCopy } from '@/lib/inline-copy-links';
import {
  getHomePath,
  getHubPath,
  type HubPageId,
  type SiteLocale,
} from '@/lib/locale-path';
import '@/styles/templates.css';
import '@/styles/guide.css';

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
    startProject: 'Empezar proyecto',
  },
  en: {
    home: 'Home',
    links: 'Links',
    siblings: 'Other sections',
    startProject: 'Start a project',
  },
} as const;

const pad = (value: number) => String(value).padStart(2, '0');

/* A contact CTA opens the contact panel in place (useHashlessSectionNavigation);
   "/#contact" would be a cross-document load to the homepage strip. */
const isContactHref = (href: string) => /#contact$/u.test(href);

/**
 * Hub index (/servicios/, /recursos/ and EN twins). Same chrome as the pages it
 * lists — navbar, breadcrumb, page-end strip, contact dock — and the guide
 * template's hero, index rows and close card (src/styles/guide.css), so a hub
 * reads as the parent of its child pages rather than a separate site.
 */
const HubPage = ({ hubId, locale }: HubPageProps) => {
  const labels = chrome[locale];
  const page = getHubPageContent(hubId, locale);
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const ctaLink = isContactHref(page.primaryCtaHref)
    ? { href: '#contact', onClick: handleHashLinkClick }
    : { href: page.primaryCtaHref };
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

        <main className="gd">
          <RevealSection className="gd-hero">
            <div className="gd-wrap">
              <nav className="gd-crumbs" aria-label="Breadcrumb">
                <Link to={homePath}>{labels.home}</Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{page.breadcrumbLabel}</span>
              </nav>
              <div className="gd-hero-head">
                <p className="gd-pill">
                  <span className="gd-dot" aria-hidden="true" />
                  {page.breadcrumbLabel}
                </p>
                <h1 className="gd-h1 section-label">{page.heroTitle}</h1>
                <p className="gd-lead">
                  <InlineCopy text={page.lead} />
                </p>
              </div>
            </div>
          </RevealSection>

          <RevealSection className="gd-hub">
            <div className="gd-wrap">
              <nav aria-label={labels.links}>
                <div className="gd-gh">
                  <h2 className="gd-k section-label">{page.childrenTitle}</h2>
                  <span className="gd-k">{pad(page.children.length)}</span>
                </div>
                <ul className="gd-hub-list">
                  {page.children.map((child, index) => (
                    <li key={child.href}>
                      <Link to={child.href} className="gd-row gd-row--hub">
                        <span className="gd-k gd-k--teal" aria-hidden="true">
                          {pad(index + 1)}
                        </span>
                        <span className="gd-row-copy">
                          <span className="gd-row-title">{child.title}</span>
                          {child.blurb ? <span className="gd-row-blurb">{child.blurb}</span> : null}
                        </span>
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </RevealSection>

          <RevealSection className="gd-close">
            <div className="gd-orb gd-orb--a" aria-hidden="true" />
            <div className="gd-orb gd-orb--b" aria-hidden="true" />
            <div className="gd-wrap">
              <div className="gd-close-top">
                <p className="gd-pill">
                  <span className="gd-dot" aria-hidden="true" />
                  {labels.startProject}
                </p>
                {page.proof ? (
                  <p className="gd-say gd-proof">
                    <InlineCopy text={page.proof} />
                  </p>
                ) : null}
                <div className="gd-close-actions">
                  <a className="gd-cta" {...ctaLink}>
                    {page.primaryCtaLabel}
                    <i aria-hidden="true">
                      <ArrowRight />
                    </i>
                  </a>
                </div>
              </div>

              {page.secondaryLinks.length > 0 && (
                <nav className="gd-index gd-index--single" aria-label={labels.siblings}>
                  <div>
                    <div className="gd-gh">
                      <p className="gd-k">{labels.siblings}</p>
                      <span className="gd-k">{pad(page.secondaryLinks.length)}</span>
                    </div>
                    {page.secondaryLinks.map((link) => (
                      <Link key={link.href} to={link.href} className="gd-row">
                        <span>{link.label}</span>
                        <ArrowRight aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </nav>
              )}
            </div>
          </RevealSection>
        </main>

        <SiteFooter />
        <FloatingContactDock />
      </div>
    </>
  );
};

export default HubPage;
