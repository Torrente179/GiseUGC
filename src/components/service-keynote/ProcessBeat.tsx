import { SERVICE_IMAGERY } from '@/data/service-page-imagery';
import { sectionTitleClass } from './title-class';
import { KEYNOTE_LABELS } from './labels';
import KnStill from './KnStill';
import type { KeynoteBeatProps } from './types';

const stripStepIndex = (title: string) => title.replace(/^\d+[.)]\s*/, '');

/**
 * 3 · Process: tall image cards with a step number and name over the still, the sentence below.
 * Desktop lays the four out as a grid inside the content width; phones keep the swipe rail.
 */
const ProcessBeat = ({ page, locale, variant, kicker, titleId }: KeynoteBeatProps) => {
  const isMobile = variant === 'mobile';
  const labels = KEYNOTE_LABELS[locale];
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
      </div>

      <ol className="kn-rail" aria-label={labels.processRail} tabIndex={isMobile ? 0 : undefined}>
        {page.processSteps.map((step, index) => {
          const still = imagery[index % imagery.length];
          return (
            <li key={step.title} className="kn-card">
              <div className="kn-ci">
                <KnStill use={still} locale={locale} sizes={isMobile ? '290px' : '(min-width: 1200px) 294px, 50vw'} />
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
