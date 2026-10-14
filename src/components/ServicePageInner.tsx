import type { ReactNode } from 'react';
import type { SiteLocale, ResourcePageId } from '@/lib/locale-path';
import type { ServiceLandingRouteData } from '@/data/landing-route-types';
import { RevealSection } from '@/components/motion/RevealSection';
import { CONTENT_DATES, formatLastUpdatedLabel } from '@/data/content-dates';
import {
  beatDomId,
  getInnerBeats,
  type InnerBeatId,
} from '@/lib/service-inner-argument';
import CloseBeat from '@/components/service-keynote/CloseBeat';
import FitBeat from '@/components/service-keynote/FitBeat';
import FormatsBeat from '@/components/service-keynote/FormatsBeat';
import LocalNav from '@/components/service-keynote/LocalNav';
import OverviewBeat from '@/components/service-keynote/OverviewBeat';
import ProcessBeat from '@/components/service-keynote/ProcessBeat';
import QuestionsBeat from '@/components/service-keynote/QuestionsBeat';
import { useBeatSpy } from '@/components/service-keynote/hooks';
import '@/styles/service-keynote.css';

/*
 * Everything below the service hero. Six beats keep their ids (ficha,
 * recibes, como-corre, encaja, faq, empezar), so the page schema, the local
 * nav, and the deep links stay as they were; what changed is how each beat is
 * drawn. The styles live in service-keynote.css as plain CSS with literal
 * class names, so Tailwind's purge has nothing to drop.
 */

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

const BeatShell = ({
  reveal,
  id,
  className,
  labelledBy,
  children,
}: {
  reveal: boolean;
  id: string;
  className: string;
  labelledBy: string;
  children: ReactNode;
}) => {
  if (reveal) {
    return (
      <RevealSection id={id} className={className} labelledBy={labelledBy}>
        {children}
      </RevealSection>
    );
  }
  return (
    <section id={id} className={className} aria-labelledby={labelledBy}>
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
  const isMobile = variant === 'mobile';
  const idFor = (id: InnerBeatId) => beatDomId(id, variant);
  const activeId = useBeatSpy(
    beats.map((beat) => idFor(beat.id)),
    true,
  );

  const beatProps = (id: InnerBeatId) => {
    const beat = beats.find((item) => item.id === id);
    return {
      page,
      locale,
      variant,
      kicker: beat ? `${beat.num} · ${beat.kicker}` : '',
      titleId: `${idFor(id)}-title`,
    };
  };
  const shell = (id: InnerBeatId, className: string, children: ReactNode) => (
    <BeatShell
      reveal={reveal}
      id={idFor(id)}
      className={`kn-beat ${className}`}
      labelledBy={`${idFor(id)}-title`}
    >
      {children}
    </BeatShell>
  );

  return (
    <div className={isMobile ? 'kn kn--m' : 'kn kn--d'}>
      <div className="kn-handoff" aria-hidden="true" />
      <div className="kn-ease" aria-hidden="true" />

      <LocalNav
        page={page}
        locale={locale}
        variant={variant}
        beats={beats.filter((beat) => beat.id !== 'empezar')}
        idFor={idFor}
        activeId={activeId}
      />

      {shell('ficha', 'kn-ov', <OverviewBeat {...beatProps('ficha')} />)}
      {shell('recibes', 'kn-fm', <FormatsBeat {...beatProps('recibes')} />)}
      {shell('como-corre', 'kn-pr', <ProcessBeat {...beatProps('como-corre')} />)}
      {shell('encaja', 'kn-fit', <FitBeat {...beatProps('encaja')} title={labels.isThisForYou} />)}
      {shell('faq', 'kn-qa', <QuestionsBeat {...beatProps('faq')} />)}
      <div className="kn-band" aria-hidden="true" />
      {shell(
        'empezar',
        'kn-close',
        <CloseBeat
          {...beatProps('empezar')}
          labels={labels}
          updated={updated}
          relevantVerticals={relevantVerticals}
          resourceLinks={resourceLinks}
          relatedPages={relatedPages}
          allOtherServices={allOtherServices}
        />,
      )}
    </div>
  );
};

export default ServicePageInner;
