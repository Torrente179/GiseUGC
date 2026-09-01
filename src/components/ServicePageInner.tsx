import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { SiteLocale, ResourcePageId } from '@/lib/locale-path';
import { getServicePath, getVerticalPath, getResourcePath } from '@/lib/locale-path';
import type { ServiceLandingRouteData } from '@/data/landing-route-types';
import { RevealSection } from '@/components/motion/RevealSection';
import { InlineCopy } from '@/lib/inline-copy-links';
import { CONTENT_DATES, formatLastUpdatedLabel } from '@/data/content-dates';
import {
  beatDomId,
  buildServiceFicha,
  getInnerBeats,
  getMobileChipBeats,
  type InnerBeatId,
} from '@/lib/service-inner-argument';

const stripStepIndex = (title: string) => title.replace(/^\d+[.)]\s*/, '');

const useBeatSpy = (ids: string[], enabled: boolean) => {
  const [activeId, setActiveId] = useState(ids[0] ?? '');
  const idsKey = ids.join('|');

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !idsKey) return;
    const list = idsKey.split('|');
    const nodes = list
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const nextId = visible[0]?.target.id;
        if (nextId) setActiveId(nextId);
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.15, 0.4, 0.75] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [enabled, idsKey]);

  return activeId;
};

type ServicePageInnerProps = {
  page: ServiceLandingRouteData['page'];
  labels: {
    alsoOffered: string;
    moreServices: string;
    byIndustry: string;
    resources: string;
    explore: string;
    isThisForYou: string;
  };
  locale: SiteLocale;
  relevantVerticals: ServiceLandingRouteData['relevantVerticals'];
  resourceLinks: { id: ResourcePageId; label: string }[];
  relatedPages: ServiceLandingRouteData['relatedPages'];
  allOtherServices: ServiceLandingRouteData['allOtherServices'];
  reveal: boolean;
  variant: 'mobile' | 'desktop';
};

const buildExploreColumns = ({
  labels,
  locale,
  relevantVerticals,
  resourceLinks,
  allOtherServices,
}: Pick<
  ServicePageInnerProps,
  'labels' | 'locale' | 'relevantVerticals' | 'resourceLinks' | 'allOtherServices'
>) => {
  const columns = [
    relevantVerticals.length > 0 && {
      key: 'industry',
      label: labels.byIndustry,
      items: relevantVerticals.map((vertical) => ({
        key: vertical.id,
        href: getVerticalPath(vertical.id, locale),
        title: vertical.navLabel,
      })),
    },
    resourceLinks.length > 0 && {
      key: 'resources',
      label: labels.resources,
      items: resourceLinks.map((resource) => ({
        key: resource.id,
        href: getResourcePath(resource.id, locale),
        title: resource.label,
      })),
    },
    allOtherServices.length > 0 && {
      key: 'services',
      label: labels.moreServices,
      items: allOtherServices.map((service) => ({
        key: service.id,
        href: getServicePath(service.id, locale),
        title: service.navLabel,
      })),
    },
  ].filter((column): column is Exclude<typeof column, false> => Boolean(column));
  return columns;
};

const BeatShell = ({
  reveal,
  id,
  className,
  children,
}: {
  reveal: boolean;
  id: string;
  className: string;
  children: ReactNode;
}) => {
  if (reveal) {
    return (
      <RevealSection id={id} className={className}>
        {children}
      </RevealSection>
    );
  }
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
};

const ServicePageInner = ({
  page,
  labels,
  locale,
  relevantVerticals,
  resourceLinks,
  relatedPages,
  allOtherServices,
  reveal,
  variant,
}: ServicePageInnerProps) => {
  const updated = formatLastUpdatedLabel(CONTENT_DATES.services, locale);
  const beats = getInnerBeats(locale);
  const chipBeats = getMobileChipBeats(locale);
  const ficha = buildServiceFicha(page);
  const exploreColumns = buildExploreColumns({
    labels,
    locale,
    relevantVerticals,
    resourceLinks,
    allOtherServices,
  });
  const isMobile = variant === 'mobile';
  const idFor = (id: InnerBeatId) => beatDomId(id, variant);
  const spyIds = (isMobile ? chipBeats : beats).map((beat) => idFor(beat.id));
  const activeId = useBeatSpy(spyIds, true);
  const kickerFor = (id: InnerBeatId) => {
    const beat = beats.find((item) => item.id === id);
    return beat ? `${beat.num} · ${beat.kicker}` : '';
  };

  return (
    <div className={isMobile ? 'stm-walk' : 'svc-walk'}>
      {isMobile ? (
        <nav className="stm-chips" aria-label={locale === 'es' ? 'Secciones' : 'Sections'}>
          <div className="stm-chips-track">
            {chipBeats.map((beat) => {
              const href = `#${idFor(beat.id)}`;
              const isActive = activeId === idFor(beat.id);
              return (
                <a
                  key={beat.id}
                  href={href}
                  className={`stm-chip${isActive ? ' is-active' : ''}`}
                  aria-current={isActive ? 'location' : undefined}
                >
                  {beat.chip}
                </a>
              );
            })}
          </div>
        </nav>
      ) : (
        <nav className="svc-spine" aria-label={locale === 'es' ? 'Índice de la página' : 'Page index'}>
          <ol className="svc-spine-list">
            {beats.map((beat) => {
              const href = `#${idFor(beat.id)}`;
              const isActive = activeId === idFor(beat.id);
              return (
                <li key={beat.id}>
                  <a href={href} className={`svc-spine-link${isActive ? ' is-active' : ''}`}>
                    <span className="svc-spine-num">{beat.num}.</span>
                    <span>{beat.spine}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <div className={isMobile ? 'stm-walk-main' : 'svc-walk-main'}>
        <BeatShell
          reveal={reveal}
          id={idFor('ficha')}
          className={isMobile ? 'stm-beat' : 'svc-inner-block svc-inner-block--open svc-beat'}
        >
          <div className={isMobile ? 'stm-beat-inner' : 'st-container'}>
            <p className="st-eyebrow svc-inner-kicker">{kickerFor('ficha')}</p>
            <h2 className={isMobile ? 'stm-beat-title' : 'svc-inner-heading font-serif'}>
              {page.sectionIntroTitle}
            </h2>
            {isMobile ? (
              <div className="stm-ficha">
                {ficha.map((row) => (
                  <article key={row.key} className="stm-ficha-card">
                    <p className="stm-ficha-label">{row.label}</p>
                    <p className="stm-ficha-value">{row.value}</p>
                  </article>
                ))}
              </div>
            ) : (
              <dl className="svc-ficha">
                {ficha.map((row) => (
                  <div key={row.key} className="svc-ficha-row">
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {page.geoFact ? (
              <p className={isMobile ? 'stm-geo' : 'svc-inner-lead svc-ficha-geo'}>
                <InlineCopy text={page.geoFact} />
              </p>
            ) : null}
          </div>
        </BeatShell>

        <BeatShell
          reveal={reveal}
          id={idFor('recibes')}
          className={isMobile ? 'stm-beat' : 'svc-inner-block svc-beat'}
        >
          <div className={isMobile ? 'stm-beat-inner' : 'st-container'}>
            <p className="st-eyebrow svc-inner-kicker">{kickerFor('recibes')}</p>
            <h2 className={isMobile ? 'stm-beat-title' : 'svc-inner-heading font-serif'}>
              {page.deliverablesTitle}
            </h2>
            <div className={isMobile ? 'stm-formatos' : 'svc-formatos'}>
              {page.deliverables.map((item) => (
                <article key={item.title} className={isMobile ? 'stm-formato-card' : 'svc-formato'}>
                  <h3 className={isMobile ? 'stm-formato-title' : 'svc-formato-title'}>{item.title}</h3>
                  <p className={isMobile ? 'stm-formato-desc' : 'svc-formato-desc'}>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </BeatShell>

        <BeatShell
          reveal={reveal}
          id={idFor('como-corre')}
          className={isMobile ? 'stm-beat' : 'svc-inner-block svc-beat'}
        >
          <div className={isMobile ? 'stm-beat-inner' : 'st-container'}>
            <p className="st-eyebrow svc-inner-kicker">{kickerFor('como-corre')}</p>
            <h2 className={isMobile ? 'stm-beat-title' : 'svc-inner-heading font-serif'}>
              {page.processTitle}
            </h2>
            <ol className={isMobile ? 'stm-stepper' : 'svc-process-row'}>
              {page.processSteps.map((step, index) => (
                <li key={step.title} className={isMobile ? 'stm-stepper-item' : 'svc-process-cell'}>
                  {isMobile ? (
                    <span className="stm-stepper-num" aria-hidden="true">
                      {index + 1}
                    </span>
                  ) : (
                    <span className="svc-process-cell-num" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  )}
                  <div>
                    <h3 className={isMobile ? 'stm-stepper-title' : 'svc-process-cell-title'}>
                      {stripStepIndex(step.title)}
                    </h3>
                    <p className={isMobile ? 'stm-stepper-desc' : 'svc-process-cell-desc'}>
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </BeatShell>

        <BeatShell
          reveal={reveal}
          id={idFor('encaja')}
          className={isMobile ? 'stm-beat' : 'svc-inner-block svc-beat'}
        >
          <div className={isMobile ? 'stm-beat-inner' : 'st-container'}>
            <p className="st-eyebrow svc-inner-kicker">{kickerFor('encaja')}</p>
            <h2 className={isMobile ? 'stm-beat-title' : 'svc-inner-heading font-serif'}>
              {labels.isThisForYou}
            </h2>
            <div className={isMobile ? 'stm-fit' : 'svc-fit-grid'}>
              <div className={isMobile ? 'stm-fit-panel' : 'svc-fit-col'}>
                <h3 className={isMobile ? 'stm-fit-label' : 'svc-fit-label'}>{page.bestFitTitle}</h3>
                <ul>
                  {page.bestFitItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={isMobile ? 'stm-fit-panel stm-fit-panel--no' : 'svc-fit-col svc-fit-col--no'}>
                <h3 className={isMobile ? 'stm-fit-label' : 'svc-fit-label'}>{page.notFitTitle}</h3>
                <ul>
                  {page.notFitItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </BeatShell>

        <BeatShell
          reveal={reveal}
          id={idFor('faq')}
          className={isMobile ? 'stm-beat' : 'svc-inner-block svc-beat'}
        >
          <div className={isMobile ? 'stm-beat-inner' : 'st-container'}>
            <p className="st-eyebrow svc-inner-kicker">{kickerFor('faq')}</p>
            <h2 className={isMobile ? 'stm-beat-title' : 'svc-inner-heading font-serif'}>{page.faqTitle}</h2>
            <div className={isMobile ? 'stm-faq-cards' : 'svc-faq-list'}>
              {page.faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  className={isMobile ? 'stm-faq-card' : 'svc-faq-item'}
                  {...(index === 0 ? { open: true } : {})}
                >
                  <summary className={isMobile ? 'stm-faq-card-q' : undefined}>
                    <span>{faq.question}</span>
                    <span className={isMobile ? 'stm-faq-card-mark' : 'svc-faq-mark'} aria-hidden="true" />
                  </summary>
                  <p className={isMobile ? 'stm-faq-card-a' : undefined}>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </BeatShell>

        <BeatShell
          reveal={reveal}
          id={idFor('empezar')}
          className={isMobile ? 'stm-beat stm-beat--close' : 'svc-inner-close svc-beat'}
        >
          <div className={isMobile ? 'stm-beat-inner stm-close' : 'svc-inner-close-shell'}>
            <div className={isMobile ? 'stm-close-stack' : 'svc-inner-close-top'}>
              <div>
                <p className="st-eyebrow svc-inner-kicker">{kickerFor('empezar')}</p>
                <h2 className={isMobile ? 'stm-close-title' : 'svc-inner-close-title font-serif'}>
                  {page.ctaTitle}
                </h2>
                <p className={isMobile ? 'stm-close-text' : 'svc-inner-close-text'}>{page.ctaText}</p>
                <a href={page.primaryCtaHref} className={isMobile ? 'stm-close-cta' : 'st-cta-primary st-cta-primary--lg'}>
                  {page.primaryCtaLabel}
                </a>
                <p className={isMobile ? 'stm-close-updated' : 'svc-inner-updated'}>{updated}</p>
              </div>
              {relatedPages.length > 0 && (
                <div>
                  <p className={isMobile ? 'stm-close-sublabel' : 'st-eyebrow mb-5'}>{labels.alsoOffered}</p>
                  {page.relatedServiceIds.map((relatedId, index) => {
                    const rel = relatedPages[index];
                    if (!rel) return null;
                    return (
                      <Link
                        key={relatedId}
                        to={getServicePath(relatedId, locale)}
                        className={isMobile ? 'stm-close-link' : 'st-related-row group'}
                      >
                        <span className={isMobile ? undefined : 'st-related-title'}>{rel.title}</span>
                        <span className={isMobile ? 'stm-close-arrow' : 'st-related-arrow'} aria-hidden="true">
                          →
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            {exploreColumns.length > 0 && (
              <nav className={isMobile ? 'stm-close-explore' : 'svc-close-explore'} aria-label={labels.explore}>
                {exploreColumns.map((column) => (
                  <div key={column.key} className={isMobile ? 'stm-close-explore-block' : 'svc-close-explore-col'}>
                    <p className={isMobile ? 'stm-close-sublabel' : 'svc-explore-index'}>{column.label}</p>
                    {column.items.map((item) => (
                      <Link
                        key={item.key}
                        to={item.href}
                        className={isMobile ? 'stm-close-link' : 'st-related-row group'}
                      >
                        <span className={isMobile ? undefined : 'st-related-title'}>{item.title}</span>
                        <span className={isMobile ? 'stm-close-arrow' : 'st-related-arrow'} aria-hidden="true">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>
            )}
          </div>
        </BeatShell>
      </div>
    </div>
  );
};

export default ServicePageInner;
