import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react';
import {
  getOriginalBestPosterSrc,
  getPosterVariantSrc,
  getPosterVariantSrcSet,
  type ReelClip,
} from '@/data/portfolio-clips';

type ResponsivePosterImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'srcSet' | 'width' | 'height'
> & {
  clip: ReelClip;
  fetchpriority?: 'high' | 'low' | 'auto';
  media?: string;
  rootMargin?: string;
};

const TRANSPARENT_PIXEL =
  'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

const ResponsivePosterImage = ({
  clip,
  alt = '',
  loading = 'lazy',
  decoding = 'async',
  sizes = '(max-width: 767px) 70vw, (max-width: 1279px) 28vw, 18vw',
  fetchpriority,
  media,
  rootMargin = '240px 0px',
  onError,
  ...props
}: ResponsivePosterImageProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [shouldLoad, setShouldLoad] = useState(loading === 'eager');
  const [useOriginalFallback, setUseOriginalFallback] = useState(false);

  useEffect(() => {
    if (shouldLoad) return undefined;
    const image = imageRef.current;
    if (!image || typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(image);
    return () => observer.disconnect();
  }, [rootMargin, shouldLoad]);

  const renderSources = shouldLoad && !useOriginalFallback;

  return (
    <picture className="contents">
      {renderSources && (
        <source
          type="image/avif"
          media={media}
          srcSet={getPosterVariantSrcSet(clip, 'avif')}
          sizes={sizes}
        />
      )}
      {renderSources && (
        <source
          type="image/webp"
          media={media}
          srcSet={getPosterVariantSrcSet(clip, 'webp')}
          sizes={sizes}
        />
      )}
      {renderSources && media && (
      <source
        type="image/jpeg"
        media={media}
        srcSet={getPosterVariantSrcSet(clip, 'jpg')}
        sizes={sizes}
      />
      )}
      <img
        {...props}
        ref={imageRef}
        {...(fetchpriority ? { fetchpriority } : {})}
        src={
          useOriginalFallback
            ? getOriginalBestPosterSrc(clip)
            : shouldLoad && !media
              ? getPosterVariantSrc(clip, 720, 'jpg')
              : TRANSPARENT_PIXEL
        }
        srcSet={
          shouldLoad && !media && !useOriginalFallback
            ? getPosterVariantSrcSet(clip, 'jpg')
            : undefined
        }
        sizes={sizes}
        alt={alt}
        width="720"
        height="1280"
        loading={loading}
        decoding={decoding}
        onError={(event) => {
          if (!useOriginalFallback) setUseOriginalFallback(true);
          onError?.(event);
        }}
      />
    </picture>
  );
};

export default ResponsivePosterImage;
