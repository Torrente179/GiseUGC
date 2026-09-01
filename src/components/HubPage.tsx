import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageSeo from '@/components/PageSeo';
import { CONTENT_DATES } from '@/data/content-dates';
import { getHubPageContent } from '@/data/hub-pages';
import { InlineCopy } from '@/lib/inline-copy-links';
import {
  getHomePath,
  getHubPath,
  type HubPageId,
  type SiteLocale,
} from '@/lib/locale-path';

const SITE_URL = 'https://www.giselasaldarriaga.com';
const buildUrl = (pathname: string) => new URL(pathname, SITE_URL).toString();

type HubPageProps = {
  hubId: HubPageId;
  locale: SiteLocale;
};

const chrome = {
  es: {
    home: 'Inicio',
    alternate: 'English',
    links: 'Enlaces',
  },
  en: {
    home: 'Home',
    alternate: 'Español',
    links: 'Links',
  },
} as const;

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
          es: esUrl,
          en: enUrl,
          xDefault: esUrl,
        }}
        structuredData={schema}
      />

      <main className="studio-container py-16 md:py-20">
        <h1 className="route-title-accent type-marketing-display max-w-[28ch] text-[1.75rem] font-semibold leading-[1.14] tracking-tight-marketing md:text-[2rem] lg:text-[2.25rem]">
          {page.heroTitle}
        </h1>
        <p className="mt-6 max-w-3xl text-base font-light leading-[1.9] text-foreground/78 md:text-[1.04rem]">
          {page.lead}
        </p>

        <section className="mt-12">
          <h2 className="section-label text-muted-foreground">{page.childrenTitle}</h2>
          <nav aria-label={labels.links} className="mt-6">
            <ul className="flex flex-col gap-5">
              {page.children.map((child) => (
                <li key={child.href}>
                  <Link
                    to={child.href}
                    className="font-sans text-sm font-semibold text-foreground underline-offset-4 hover:underline"
                  >
                    {child.title}
                  </Link>
                  {child.blurb ? (
                    <p className="mt-1 max-w-2xl font-sans text-sm font-light leading-[1.7] text-foreground/70">
                      {child.blurb}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        </section>

        {page.proof ? (
          <p className="mt-10 max-w-3xl font-sans text-sm font-light leading-[1.8] text-foreground/78 [&_a]:underline [&_a]:underline-offset-4">
            <InlineCopy text={page.proof} />
          </p>
        ) : null}

        <p className="mt-10 font-sans text-sm">
          <a href={page.primaryCtaHref} className="font-semibold underline-offset-4 hover:underline">
            {page.primaryCtaLabel}
          </a>
        </p>

        <p className="mt-4 font-sans text-sm text-muted-foreground">
          {page.secondaryLinks.map((link, index) => (
            <span key={link.href}>
              {index > 0 ? ' · ' : null}
              <Link to={link.href} className="underline-offset-4 hover:underline">
                {link.label}
              </Link>
            </span>
          ))}
        </p>

        <p className="mt-4 font-sans text-sm text-muted-foreground">
          <Link to={homePath} className="underline-offset-4 hover:underline">
            {labels.home}
          </Link>
          {' · '}
          <Link to={page.alternatePath} className="underline-offset-4 hover:underline">
            {labels.alternate}
          </Link>
        </p>
      </main>
    </div>
  );
};

export default HubPage;
