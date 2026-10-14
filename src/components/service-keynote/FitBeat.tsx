import { useState } from 'react';
import { SERVICE_IMAGERY } from '@/data/service-page-imagery';
import { sectionTitleClass } from './title-class';
import { Highlighted } from './Highlighted';
import KnStill from './KnStill';
import SegmentedControl from './SegmentedControl';
import type { KeynoteBeatProps } from './types';

type FitBeatProps = KeynoteBeatProps & { title: string };

/**
 * 4 · Fit: one wide photo, then who this is for and who it is not.
 * Desktop shows both columns; the phone swaps them with a two-option toggle
 * and keeps both lists in the DOM.
 */
const FitBeat = ({ page, locale, variant, kicker, titleId, title }: FitBeatProps) => {
  const isMobile = variant === 'mobile';
  const [shown, setShown] = useState(0);
  const idPrefix = `kn-fit-${variant}`;
  const photo = SERVICE_IMAGERY[page.id].fit;

  const columns = [
    { title: page.bestFitTitle, items: page.bestFitItems },
    { title: page.notFitTitle, items: page.notFitItems },
  ];

  return (
    <>
      <p className="kn-k">{kicker}</p>
      <h2 id={titleId} className={sectionTitleClass(title)}>
        {title}
      </h2>

      <div className="kn-plate">
        <KnStill
          use={photo}
          locale={locale}
          variant={variant}
          sizes={isMobile ? '350px' : '(min-width: 1440px) 1248px, 92vw'}
        />
      </div>

      {isMobile ? (
        <>
          <SegmentedControl
            className="kn-tog"
            ariaLabel={title}
            idPrefix={idPrefix}
            items={columns.map((column) => ({ id: column.title, label: column.title }))}
            value={shown}
            onChange={setShown}
          />
          {columns.map((column, index) => (
            <div
              key={column.title}
              id={`${idPrefix}-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`${idPrefix}-tab-${index}`}
              className="kn-list"
              hidden={index !== shown}
            >
              <h3 className="kn-vh section-label">{column.title}</h3>
              <ul>
                {column.items.map((item) => (
                  <li key={item}>
                    <Highlighted text={item} phrases={page.fitHighlights} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      ) : (
        <div className="kn-cmp">
          {columns.map((column, index) => (
            <div key={column.title} className={index === 0 ? 'kn-col' : 'kn-col kn-col--no'}>
              <h3 className="section-label">{column.title}</h3>
              <ul>
                {column.items.map((item) => (
                  <li key={item}>
                    <Highlighted text={item} phrases={page.fitHighlights} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default FitBeat;
