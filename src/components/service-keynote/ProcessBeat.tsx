import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SERVICE_IMAGERY } from '@/data/service-page-imagery';
import { sectionTitleClass } from './title-class';
import { KEYNOTE_LABELS } from './labels';
import { useRail } from './hooks';
import KnStill from './KnStill';
import type { KeynoteBeatProps } from './types';

const stripStepIndex = (title: string) => title.replace(/^\d+[.)]\s*/, '');

/** 3 · Process: a rail of tall image cards, a step number and name over the still, the sentence below. */
const ProcessBeat = ({ page, locale, variant, kicker, titleId }: KeynoteBeatProps) => {
  const isMobile = variant === 'mobile';
  const labels = KEYNOTE_LABELS[locale];
  const railRef = useRef<HTMLOListElement>(null);
  const { canPrev, canNext, scrollByItem } = useRail(railRef, page.processSteps.length);
  const imagery = SERVICE_IMAGERY[page.id].process;

  return (
    <>
      <div className="kn-pr-head">
        <div>
          <p className="kn-k">{kicker}</p>
          <h2 id={titleId} className={sectionTitleClass(page.processTitle)}>
            {page.processTitle}
          </h2>
        </div>
        {isMobile ? null : (
          <div className="kn-arrows">
            <button
              type="button"
              className="kn-arr"
              aria-label={labels.previousStep}
              aria-disabled={!canPrev}
              onClick={() => canPrev && scrollByItem(-1)}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="kn-arr"
              aria-label={labels.nextStep}
              aria-disabled={!canNext}
              onClick={() => canNext && scrollByItem(1)}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <ol className="kn-rail" ref={railRef} aria-label={labels.processRail} tabIndex={0}>
        {page.processSteps.map((step, index) => {
          const still = imagery[index % imagery.length];
          return (
            <li key={step.title} className="kn-card">
              <div className="kn-ci">
                <KnStill use={still} locale={locale} sizes={isMobile ? '290px' : '(min-width: 1100px) 380px, 320px'} />
                <div className="kn-ct">
                  <p className="kn-k" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h3 className="section-label">{stripStepIndex(step.title)}</h3>
                </div>
              </div>
              <p>{step.description}</p>
            </li>
          );
        })}
      </ol>
    </>
  );
};

export default ProcessBeat;
