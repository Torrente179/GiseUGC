import type { ReactNode } from 'react';

type BeatHeadingProps = {
  id: string;
  className: string;
  /** Desktop emits the real H2. Mobile keeps the same classes on a p. */
  semantic: boolean;
  children: ReactNode;
};

/**
 * Both viewport shells stay in the DOM (CSS hides one). Only the desktop
 * shell may emit an H2, otherwise crawlers see every section title twice.
 * Same pattern as the service hero: one H1 on mobile (`svm-title`), desktop
 * title is a p (`svh-title`). No aria-hidden: on a phone this line is the
 * visible heading and the desktop H2 is `display: none`.
 */
const BeatHeading = ({ id, className, semantic, children }: BeatHeadingProps) =>
  semantic ? (
    <h2 id={id} className={className}>
      {children}
    </h2>
  ) : (
    <p id={id} className={className}>
      {children}
    </p>
  );

export default BeatHeading;
