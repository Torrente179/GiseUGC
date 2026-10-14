import { InlineCopy } from '@/lib/inline-copy-links';
import { buildMobileFicha } from '@/lib/service-inner-argument';
import { sayTier, splitIntro } from '@/lib/keynote-text';
import { KEYNOTE_CUTOUTS, SERVICE_IMAGERY } from '@/data/service-page-imagery';
import { AccentTitle, Highlighted } from './Highlighted';
import { placeholderSrc, useNearViewport } from './hooks';
import { overviewTitleClass } from './title-class';
import type { KeynoteBeatProps } from './types';

/*
 * Class names below are spelled out in full (never `kn-say--${tier}`): every
 * selector keeps a literal in the source, so nothing is purged by accident.
 */
const SAY_A_CLASS = {
  lg: 'kn-say kn-say--a kn-say--lg',
  md: 'kn-say kn-say--a kn-say--md',
  sm: 'kn-say kn-say--a kn-say--sm',
} as const;

const SAY_B_CLASS = {
  lg: 'kn-say kn-say--b kn-say--lg',
  md: 'kn-say kn-say--b kn-say--md',
  sm: 'kn-say kn-say--b kn-say--sm',
} as const;

/** 1 · Overview: the statement, the figure in her light, the type highlight, the spec sheet. */
const OverviewBeat = ({ page, locale, variant, kicker, titleId }: KeynoteBeatProps) => {
  const isMobile = variant === 'mobile';
  const cutout = KEYNOTE_CUTOUTS[SERVICE_IMAGERY[page.id].cutout];
  const [firstHalf, secondHalf] = splitIntro(page.sectionIntroText);
  const ficha = buildMobileFicha(page);
  const [figureRef, figureNear] = useNearViewport<HTMLImageElement>();
  const askRow = ficha.rows.find((row) => row.key === 'ask');
  const marketsRow = ficha.rows.find((row) => row.key === 'markets');

  const figure = (
    <img
      ref={figureRef}
      className="kn-fig"
      src={figureNear ? cutout.src : placeholderSrc(cutout.width, cutout.height)}
      width={cutout.width}
      height={cutout.height}
      alt={cutout.alt[locale]}
      decoding="async"
    />
  );

  return (
    <>
      <p className="kn-k">{kicker}</p>
      <h2 id={titleId} className={overviewTitleClass(page.sectionIntroTitle)}>
        <AccentTitle title={page.sectionIntroTitle} accent={page.sectionIntroTitleAccent} />
      </h2>

      {isMobile ? (
        <>
          <div className="kn-stage">
            <div className="kn-spot" aria-hidden="true" />
            {figure}
          </div>
          <p className="kn-say">
            <Highlighted text={page.sectionIntroText} phrases={page.sectionIntroHighlights} />
          </p>
        </>
      ) : (
        <div className="kn-stage">
          <p className={SAY_A_CLASS[sayTier(firstHalf)]}>
            <Highlighted text={firstHalf} phrases={page.sectionIntroHighlights} />
          </p>
          <div className="kn-fig-wrap">
            <div className="kn-spot" aria-hidden="true" />
            {figure}
          </div>
          {secondHalf ? (
            <p className={SAY_B_CLASS[sayTier(secondHalf)]}>
              <Highlighted text={secondHalf} phrases={page.sectionIntroHighlights} />
            </p>
          ) : null}
        </div>
      )}

      <div className="kn-spec">
        {askRow ? (
          <div className="kn-row">
            <h3 className="kn-k section-label">{askRow.label}</h3>
            <ul className="kn-req">
              {askRow.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {marketsRow ? (
          <div className="kn-row">
            <h3 className="kn-k section-label">{marketsRow.label}</h3>
            <ul className="kn-mkt">
              {marketsRow.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {page.geoFact ? (
        <p className="kn-geo">
          <InlineCopy text={page.geoFact} />
        </p>
      ) : null}
    </>
  );
};

export default OverviewBeat;
