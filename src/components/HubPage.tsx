import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageSeo from '@/components/PageSeo';
import { CONTENT_DATES } from '@/data/content-dates';
import { getHubChildLinks } from '@/data/hub-child-links';
import {
  getHomePath,
  getHomeSectionHref,
  getHubPath,
  type HubPageId,
  type SiteLocale,
} from '@/lib/locale-path';

const SITE_URL = 'https://www.giselasaldarriaga.com';
const SITE_ENTITY_NAME = 'Gisela Saldarriaga';
const buildUrl = (pathname: string) => new URL(pathname, SITE_URL).toString();

type HubPageProps = {
  hubId: HubPageId;
  locale: SiteLocale;
};

const chrome = {
  es: {
    home: 'Inicio',
    contact: 'Contacto',
    alternate: 'English',
    links: 'Enlaces',
  },
  en: {
    home: 'Home',
    contact: 'Contact',
    alternate: 'Español',
    links: 'Links',
  },
} as const;

const HubPage = ({ hubId, locale }: HubPageProps) => {
  const labels = chrome[locale];
  const path = getHubPath(hubId, locale);
  const alternatePath = getHubPath(hubId, locale === 'es' ? 'en' : 'es');
  const canonical = buildUrl(path);
  const esUrl = buildUrl(getHubPath(hubId, 'es'));
  const enUrl = buildUrl(getHubPath(hubId, 'en'));
  const homePath = getHomePath(locale);
  const homeCanonical = buildUrl(homePath);
  const contactHref = getHomeSectionHref(locale, 'contact');
  const children = getHubChildLinks(hubId, locale);

  const schema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          url: canonical,
          name: SITE_ENTITY_NAME,
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
              name: SITE_ENTITY_NAME,
              item: canonical,
            },
          ],
        },
      ],
    }),
    [canonical, homeCanonical, labels.home, locale],
  );

  return (
    <div className="min-h-screen bg-background">
      <PageSeo
        title={SITE_ENTITY_NAME}
        description={SITE_ENTITY_NAME}
        canonical={canonical}
        locale={locale}
        alternates={{
          es: esUrl,
          en: enUrl,
          xDefault: esUrl,
        }}
        structuredData={schema}
      />

      <main className="studio-container py-16 md:py-20">
        <nav aria-label={labels.links}>
          <ul className="flex flex-col gap-3 font-sans text-sm text-foreground">
            {children.map((child) => (
              <li key={child.href}>
                <Link to={child.href} className="underline-offset-4 hover:underline">
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-10 font-sans text-sm">
          <a href={contactHref} className="underline-offset-4 hover:underline">
            {labels.contact}
          </a>
        </p>

        <p className="mt-4 font-sans text-sm text-muted-foreground">
          <Link to={homePath} className="underline-offset-4 hover:underline">
            {labels.home}
          </Link>
          {' · '}
          <Link to={alternatePath} className="underline-offset-4 hover:underline">
            {labels.alternate}
          </Link>
        </p>
      </main>
    </div>
  );
};

export default HubPage;
