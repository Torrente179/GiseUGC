import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail } from 'lucide-react';
import SiteFooter from '@/components/SiteFooter';
import Navbar from '@/components/Navbar';
import PageSeo from '@/components/PageSeo';
import PretextLineReveal from '@/components/motion/PretextLineReveal';
import { getLegalPageContent } from '@/data/legal-pages';
import { getHomePath, type LegalPageId, type SiteLocale } from '@/lib/locale-path';

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
    emailCta: 'Escribir a soporte',
    counterpart: 'Página relacionada',
    audience: 'Mercado principal',
    summary: 'Resumen',
    breadcrumbs: 'Breadcrumbs',
  },
  en: {
    home: 'Home',
    contents: 'Contents',
    contact: 'Legal contact',
    emailCta: 'Email support',
    counterpart: 'Related page',
    audience: 'Primary market',
    summary: 'Summary',
    breadcrumbs: 'Breadcrumbs',
  },
} as const;

const LegalPage = ({ pageId, locale }: LegalPageProps) => {
  const page = getLegalPageContent(pageId, locale);
  const labels = localeLabels[locale];
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
          dateModified: '2026-03-22',
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

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top_left,hsla(var(--primary)/0.16),transparent_45%),radial-gradient(circle_at_top_right,hsla(var(--accent)/0.14),transparent_40%)]" />

        <section className="studio-section pt-28 md:pt-32 lg:pt-36">
          <div className="studio-container">
            <nav
              aria-label={labels.breadcrumbs}
              className="mb-8 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground"
            >
              <Link to={getHomePath(locale)} className="transition-colors hover:text-primary">
                {labels.home}
              </Link>
              <span>/</span>
              <span className="text-foreground/70">{page.breadcrumbLabel}</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.64fr)_minmax(320px,0.36fr)] lg:gap-10">
              <div className="space-y-6">
                <p className="section-label text-muted-foreground">{page.eyebrow}</p>
                <h1 className="type-marketing-display max-w-[22ch] text-4xl font-semibold leading-[1.08] tracking-tight-marketing md:text-5xl lg:text-[4.5rem]">
                  <PretextLineReveal text={page.title} delay={0} stagger={0.1} className="block" />
                </h1>
                <p className="max-w-3xl text-base font-light leading-[1.9] text-foreground/78 md:text-[1.04rem]">
                  {page.intro}
                </p>
                <div className="rounded-[1.5rem] border border-border/70 bg-card/70 px-5 py-4 shadow-[0_24px_48px_-40px_hsl(var(--foreground)/0.55)] backdrop-blur-sm">
                  <p className="section-label mb-2 text-muted-foreground">{labels.audience}</p>
                  <p className="text-sm font-light leading-[1.85] text-foreground/78 md:text-[0.98rem]">
                    {page.audienceNote}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {page.summaryItems.map((item) => (
                    <span
                      key={item}
                      className="inline-flex rounded-full border border-border/70 bg-background/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/72 shadow-[0_10px_30px_-24px_hsl(var(--foreground)/0.5)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <aside className="studio-panel h-fit p-6 md:p-7 lg:sticky lg:top-28">
                <div className="space-y-6">
                  <div>
                    <p className="section-label mb-3 text-muted-foreground">{labels.contents}</p>
                    <nav aria-label={page.tocTitle}>
                      <ul className="space-y-3">
                        {page.sections.map((section) => (
                          <li key={section.id}>
                            <a
                              href={`#${section.id}`}
                              className="block text-sm font-medium leading-[1.55] text-foreground/76 transition-colors hover:text-primary"
                            >
                              {section.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>

                  <div className="rounded-[1.4rem] border border-border/70 bg-background/72 p-5">
                    <p className="section-label mb-3 text-muted-foreground">{labels.contact}</p>
                    <h2 className="type-marketing-display text-[1.65rem] font-semibold leading-[1.1] tracking-tight-marketing">
                      {page.contactTitle}
                    </h2>
                    <p className="mt-3 text-sm font-light leading-[1.85] text-foreground/75">
                      {page.contactBody}
                    </p>
                    <a
                      href={`mailto:${page.contactEmail}`}
                      className="btn-primary-nordic mt-5 inline-flex gap-2 px-5 py-3 text-foreground"
                    >
                      {labels.emailCta}
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="rounded-[1.4rem] border border-border/70 bg-background/52 p-5">
                    <p className="section-label mb-3 text-muted-foreground">{labels.counterpart}</p>
                    <Link
                      to={page.counterpartPath}
                      className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:text-foreground"
                    >
                      {page.counterpartLabel}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <p className="mt-4 text-xs font-light leading-[1.75] text-muted-foreground">
                      {page.updatedDateLabel}
                      <br />
                      {page.effectiveDateLabel}
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="studio-section-tight pb-8 md:pb-10">
          <div className="studio-container">
            <div className="space-y-6">
              {page.sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="studio-panel scroll-mt-28 p-6 md:p-8 lg:p-10"
                >
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,0.2fr)_minmax(0,0.8fr)] lg:gap-10">
                    <div className="lg:pt-1">
                      <p className="section-label mb-2 text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </p>
                      <div className="signature-line w-20" />
                    </div>

                    <div>
                      <h2 className="type-marketing-display text-3xl font-semibold leading-[1.08] tracking-tight-marketing md:text-[2.5rem]">
                        {section.title}
                      </h2>

                      {section.paragraphs?.length ? (
                        <div className="mt-5 space-y-4 text-sm font-light leading-[1.92] text-foreground/80 md:text-[1rem]">
                          {section.paragraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                        </div>
                      ) : null}

                      {section.bullets?.length ? (
                        <ul className="mt-5 space-y-3 pl-5 text-sm font-light leading-[1.85] text-foreground/80 marker:text-primary md:text-[0.98rem]">
                          {section.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      ) : null}

                      {section.note ? (
                        <div className="mt-6 rounded-[1.35rem] border border-primary/20 bg-primary/6 px-5 py-4 text-sm font-light leading-[1.8] text-foreground/78">
                          {section.note}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="studio-section-tight pb-16 md:pb-20">
          <div className="studio-container">
            <div className="studio-panel overflow-hidden p-6 md:p-8 lg:p-10">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(220px,0.3fr)] lg:items-end">
                <div>
                  <p className="section-label mb-3 text-muted-foreground">{labels.summary}</p>
                  <h2 className="type-marketing-display max-w-[20ch] text-3xl font-semibold leading-[1.1] tracking-tight-marketing md:text-[2.65rem]">
                    {page.contactTitle}
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm font-light leading-[1.9] text-foreground/76 md:text-[1rem]">
                    {page.disclaimer}
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <a
                    href={`mailto:${page.contactEmail}`}
                    className="btn-primary-nordic inline-flex gap-2 px-6 py-3.5 text-foreground"
                  >
                    {page.contactEmail}
                    <Mail className="h-4 w-4" />
                  </a>
                  <Link
                    to={page.counterpartPath}
                    className="btn-secondary-nordic inline-flex gap-2 px-6 py-3.5"
                  >
                    {page.counterpartLabel}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default LegalPage;
