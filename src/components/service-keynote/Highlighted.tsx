import { Fragment } from 'react';
import { segmentHighlights } from '@/lib/keynote-text';

type HighlightedProps = {
  text: string;
  phrases?: readonly string[];
};

/** Text with the given phrases in full ink (`<b>`); everything else is left to the muted parent. */
export const Highlighted = ({ text, phrases }: HighlightedProps) => (
  <>
    {segmentHighlights(text, phrases).map((segment, index) =>
      segment.strong ? <b key={index}>{segment.text}</b> : <Fragment key={index}>{segment.text}</Fragment>,
    )}
  </>
);

type AccentTitleProps = {
  title: string;
  accent?: string;
};

/** Title with one phrase on the gradient; the title stays whole when the phrase is missing. */
export const AccentTitle = ({ title, accent }: AccentTitleProps) => {
  const start = accent ? title.indexOf(accent) : -1;
  if (!accent || start === -1) return <>{title}</>;
  return (
    <>
      {title.slice(0, start)}
      <span className="kn-grad">{accent}</span>
      {title.slice(start + accent.length)}
    </>
  );
};
