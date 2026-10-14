import type { CSSProperties, ReactNode } from 'react';

type KnPhoneProps = {
  /** Screen content: stills, a video, a caption. The island is added on top. */
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * A phone drawn in CSS: the iPhone 17 Pro Max frame of `ReelPhone`
 * (`.reel-phone` in reel-phone.css has the measurements; keep the two in step).
 * Geometry follows `--w` (the device width), so the same markup serves the
 * Formats stage and the fan in the close.
 */
const KnPhone = ({ children, className = '', style }: KnPhoneProps) => (
  <div className={`kn-phone ${className}`.trim()} style={style}>
    <span className="kn-pb kn-pb--a" />
    <span className="kn-pb kn-pb--v1" />
    <span className="kn-pb kn-pb--v2" />
    <span className="kn-pb kn-pb--s" />
    <span className="kn-pb kn-pb--cam" />
    <span className="kn-glass">
      <span className="kn-scr">
        {children}
        <span className="kn-island" />
      </span>
    </span>
  </div>
);

export default KnPhone;
