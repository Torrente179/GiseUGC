import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import PageSeo from '@/components/PageSeo';
import SiteFooter from '@/components/SiteFooter';
import {
  getHubChildren,
  getHubContactHref,
  getHubDocumentDescription,
  getHubDocumentTitle,
  getHubNavLabel,
} from '@/data/hub-pages';
import { getHomePath, getHubPath, type HubPageId, type SiteLocale } from '@/lib/locale-path';
import { useTranslation } from '@/lib/locale-context';

const SITE_URL = 'https://www.giselasaldarriaga.com';
const buildUrl = (pathname: string) => new URL(pathname, SITE_URL).toString();

type HubIndexPageProps = {
  hubId: HubPageId;
  locale: SiteLocale;
};

const HubIndexPage = ({ hubId, locale }: HubIndexPageProps) => {
  const { t } = useTranslation();
  const title = getHubDocumentTitle();
  const description = getHubDocumentDescription();
  const canonical = buildUrl(getHubPath(hubId, locale));
  const esPath = getHubPath(hubId, 'es');
  const enPath = getHubPath(hubId, 'en');
  const homePath = getHomePath(locale);
  const children = getHubChildren(hubId, locale);
  const hubLabel = getHubNavLabel(hubId, locale);
  const contactHref = getHubContactHref(locale);
  const homeLabel = locale === 'es' ? 'Inicio' : 'Home';
  const ctaLabel = t('navbar.hireMeCta', {
    defaultValue: locale === 'es' ? 'Contáctame' : 'Hire me',
  });

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: homeLabel,
            item: buildUrl(homePath),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: hubLabel,
            item: canonical,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title={title}
        description={description}
        canonical={canonical}
        locale={locale}
        alternates={{
          es: buildUrl(esPath),
          en: buildUrl(enPath),
          xDefault: buildUrl(esPath),
        }}
        structuredData={schema}
      />
      <Navbar compactMobile />

      <main>
        <section className="pt-28 md:pt-32 lg:pt-36 pb-24">
          <div className="container mx-auto px-6 md:px-12">
            <nav
              aria-label="Breadcrumb"
              className="mb-10 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground"
            >
              <Link to={homePath} className="transition-colors hover:text-primary">
                {homeLabel}
              </Link>
              <span aria-hidden="true">/</span>
              <span>{hubLabel}</span>
            </nav>

            <nav aria-label={hubLabel}>
              <ul className="grid gap-3 md:max-w-xl">
                {children.map((child) => (
                  <li key={child.href}>
                    <Link
                      to={child.href}
                      className="flex items-center justify-between border-b border-border/60 py-3 text-base text-foreground transition-colors hover:text-primary"
                    >
                      <span>{child.label}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="mt-12">
              <a href={contactHref} className="btn-primary-nordic btn-primary-nordic--sm">
                {ctaLabel}
              </a>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default HubIndexPage;
