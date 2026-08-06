import ResponsivePosterImage from '@/components/media/ResponsivePosterImage';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { useTranslation } from '@/lib/locale-context';

const HERO_CLIP_ID = 1015;
const HERO_CLIP = NUEVOS_R2_READY_CLIPS.find(({ id }) => id === HERO_CLIP_ID)
  ?? NUEVOS_R2_READY_CLIPS[0];

const Hero = () => {
  const { locale } = useTranslation();
  const { handleHashLinkClick } = useHashlessSectionNavigation();

  const imageDescription = locale === 'es'
    ? 'Gisela Saldarriaga presentando una pieza UGC frente a cámara.'
    : 'Gisela Saldarriaga presenting a UGC piece on camera.';
  const selectedWorkAriaLabel = locale === 'es'
    ? 'Ir al trabajo seleccionado'
    : 'Go to selected work';
  const metadataAriaLabel = locale === 'es'
    ? 'Medellín, español e inglés, índice 001'
    : 'Medellin, Spanish and English, index 001';

  return (
    <section
      id="home"
      className="gallery-hero relative w-full overflow-hidden"
      aria-labelledby="gallery-hero-name"
    >
      <div className="gallery-hero__stage">
        <div className="gallery-hero__metadata" role="group" aria-label={metadataAriaLabel}>
          <span aria-hidden="true">MED / ES + EN</span>
          <span aria-hidden="true">001</span>
        </div>

        <h1 id="gallery-hero-name" className="gallery-hero__name">
          GISELA
        </h1>

        <figure className="gallery-hero__media">
          <figcaption className="sr-only">{imageDescription}</figcaption>
          <div className="gallery-hero__film" aria-hidden="true">
            <div className="gallery-hero__mat">
              <div className="gallery-hero__still">
                <ResponsivePosterImage
                  clip={HERO_CLIP}
                  alt=""
                  loading="eager"
                  decoding="sync"
                  sizes="(max-width: 767px) 44vw, (max-width: 1023px) 30vw, 25vw"
                  fetchpriority="high"
                  rootMargin="0px"
                />
              </div>
            </div>
          </div>
        </figure>

        <div className="gallery-hero__index">
          <span className="gallery-hero__rule" aria-hidden="true" />
          <a
            href="#portfolio"
            className="gallery-hero__selected-work"
            aria-label={selectedWorkAriaLabel}
            onClick={handleHashLinkClick}
          >
            <span>Selected work</span>
            <span aria-hidden="true">↘</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
