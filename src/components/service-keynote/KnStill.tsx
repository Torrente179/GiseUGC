import type { CSSProperties } from 'react';
import {
  KEYNOTE_STILLS,
  keynoteStillSrc,
  keynoteStillSrcSet,
  type KeynoteStillUse,
} from '@/data/service-page-imagery';
import type { SiteLocale } from '@/lib/locale-path';
import { placeholderSrc, useNearViewport } from './hooks';

type KnStillProps = {
  use: KeynoteStillUse;
  locale: SiteLocale;
  sizes: string;
  /** Hide the decorative copy from assistive tech when the frame is purely ornamental. */
  decorative?: boolean;
  /** Which shell the still sits in: the phone can crop differently from the wide desktop frame. */
  variant?: 'mobile' | 'desktop';
};

/** A poster-variant still, cropped by `object-position` and an optional zoom. */
const KnStill = ({ use, locale, sizes, decorative = false, variant = 'desktop' }: KnStillProps) => {
  const still = KEYNOTE_STILLS[use.id];
  const [imageRef, near] = useNearViewport<HTMLImageElement>();
  const position = (variant === 'mobile' ? use.mobilePosition : undefined) ?? use.position ?? '50% 30%';
  const style: CSSProperties = { objectPosition: position };
  if (use.zoom && use.zoom !== 1) {
    style.transform = `scale(${use.zoom})`;
    style.transformOrigin = position;
  }

  return (
    <picture className="kn-pic">
      {near ? <source type="image/avif" srcSet={keynoteStillSrcSet(still, 'avif')} sizes={sizes} /> : null}
      {near ? <source type="image/webp" srcSet={keynoteStillSrcSet(still, 'webp')} sizes={sizes} /> : null}
      <img
        ref={imageRef}
        src={near ? keynoteStillSrc(still, 720, 'jpg') : placeholderSrc(still.width, still.height)}
        srcSet={near ? keynoteStillSrcSet(still, 'jpg') : undefined}
        sizes={sizes}
        alt={decorative ? '' : still.alt[locale]}
        width={still.width}
        height={still.height}
        decoding="async"
        style={style}
      />
    </picture>
  );
};

export default KnStill;
