import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';
import Navbar from '@/components/Navbar';
import PageSeo from '@/components/PageSeo';
import { RevealSection } from '@/components/motion/RevealSection';
import { getLegalPageContent } from '@/data/legal-pages';
import { getHomePath, type LegalPageId, type SiteLocale } from '@/lib/locale-path';
import { CONTENT_DATES } from '@/data/content-dates';
import { useActiveSection } from '@/hooks/use-active-section';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import '@/styles/templates.css';
import '@/styles/guide.css';

const SITE_URL = 'https://www.giselasaldarriaga.com';
const buildUrl = (pathname: string) => new URL(pathname, SITE_URL).toString();

type LegalPageProps = {
  pageId: LegalPageId;
  locale: SiteLocale;
};

const localeLabels = {
  es: {
    home: 'Inicio',
    contents: 'Contenido',
    contact: 'Contacto legal',
    emailCta: 'Enviar un correo',
    counterpart: 'Página relacionada',
    audience: 'Mercado principal',
    breadcrumbs: 'Ruta de navegación',
  },
  en: {
    home: 'Home',
    contents: 'Contents',
    contact: 'Legal contact',
    emailCta: 'Send an email',
    counterpart: 'Related page',
    audience: 'Primary market',
    breadcrumbs: 'Breadcrumbs',
  },
} as const;

const pad = (value: number) => String(value).padStart(2, '0');

/* The chapter number is drawn on its own, so "1. Alcance" reads "Alcance". */
const sectionTitle = (title: string) => title.replace(/^\d+\.\s*/u, '');

/**
 * Privacy policy and terms (ES + EN) in the guide template's language: hero,
 * sticky contents panel, numbered chapters and the close card. Styles:
 * src/styles/guide.css.
 */
const LegalPage = ({ pageId, locale }: LegalPageProps) => {
  const page = getLegalPageContent(pageId, locale);
  const labels = localeLabels[locale];
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const activeSection = useActiveSection(
    page.sections.map((section) => section.id),
    true,
  );
  const canonical = buildUrl(page.path);
  const alternate = buildUrl(page.alternatePath);
  const homeCanonical = buildUrl(getHomePath(locale));

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
          dateModified: CONTENT_DATES.legal,
          inLanguage: locale,
          isPartOf: { '@id': `${buildUrl(getHomePath(locale))}#website` },
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
    ],
  );

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title={page.metaTitle}
        description={page.metaDescription}
        canonical={canonical}
        locale={locale}
        alternates={{
          es: buildUrl(locale === 'es' ? page.path : page.alternatePath),
          en: buildUrl(locale === 'en' ? page.path : page.alternatePath),
          xDefault: buildUrl(locale === 'es' ? page.path : page.alternatePath),
        }}
        structuredData={schema}
      />
      <Navbar />

      <main className="gd">
        <RevealSection className="gd-hero">
          <div className="gd-wrap">
            <nav className="gd-crumbs" aria-label={labels.breadcrumbs}>
              <Link to={getHomePath(locale)}>{labels.home}</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{page.breadcrumbLabel}</span>
            </nav>
            <div className="gd-hero-head">
              <p className="gd-pill">
                <span className="gd-dot" aria-hidden="true" />
                {page.eyebrow}
              </p>
              <h1 className="gd-h1 gd-h1--long section-label">{page.title}</h1>
              <p className="gd-lead">{page.intro}</p>
              <p className="gd-updated">
                {page.updatedDateLabel}
                <span aria-hidden="true"> · </span>
                {page.effectiveDateLabel}
              </p>
            </div>
            <ul className="gd-points gd-points--pairs">
              {page.summaryItems.map((item, index) => (
                <li key={item}>
                  <span className="gd-k">{pad(index + 1)}</span>
                  <span className="gd-point">{item}</span>
                </li>
              ))}
            </ul>
            <div className="gd-note gd-note--wide">
              <p className="gd-k gd-k--teal">{labels.audience}</p>
              <p className="gd-p">{page.audienceNote}</p>
            </div>
          </div>
        </RevealSection>

        <div className="gd-wrap gd-body gd-body--toc">
          <nav className="gd-toc" aria-label={page.tocTitle}>
            <p className="gd-k">{labels.contents}</p>
            <ol>
              {page.sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={handleHashLinkClick}
                    aria-current={section.id === activeSection ? 'true' : undefined}
                  >
                    <span>{pad(index + 1)}</span>
                    {sectionTitle(section.title)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="gd-article">
            {page.sections.map((section, index) => (
              <RevealSection key={section.id} className="gd-ch" id={section.id}>
                <span className="gd-k gd-k--teal" aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <h2 className="gd-h2 section-label">{sectionTitle(section.title)}</h2>
                {(section.paragraphs ?? []).map((paragraph) => (
                  <p key={paragraph} className="gd-p">
                    {paragraph}
                  </p>
                ))}
                {section.bullets?.length ? (
                  <ul className="gd-list">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
                {section.note ? (
                  <div className="gd-note">
                    <p className="gd-p">{section.note}</p>
                  </div>
                ) : null}
              </RevealSection>
            ))}
          </article>
        </div>

        <RevealSection className="gd-close">
          <div className="gd-orb gd-orb--a" aria-hidden="true" />
          <div className="gd-orb gd-orb--b" aria-hidden="true" />
          <div className="gd-wrap">
            <div className="gd-close-top">
              <p className="gd-pill">
                <span className="gd-dot" aria-hidden="true" />
                {labels.contact}
              </p>
              <h2 className="gd-h2 gd-h2--xl section-label">{page.contactTitle}</h2>
              <p className="gd-lead">{page.contactBody}</p>
              <div className="gd-close-actions">
                <a className="gd-cta" href={`mailto:${page.contactEmail}`}>
                  {labels.emailCta}
                  <i aria-hidden="true">
                    <Mail />
                  </i>
                </a>
                <p className="gd-updated">{page.contactEmail}</p>
              </div>
            </div>

            <nav className="gd-index gd-index--single" aria-label={labels.counterpart}>
              <div>
                <div className="gd-gh">
                  <p className="gd-k">{labels.counterpart}</p>
                  <span className="gd-k">01</span>
                </div>
                <Link to={page.counterpartPath} className="gd-row">
                  <span>{page.counterpartLabel}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </nav>

            <p className="gd-fine">{page.disclaimer}</p>
          </div>
        </RevealSection>
      </main>

      <SiteFooter />
    </div>
  );
};

export default LegalPage;
