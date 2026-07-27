import { type CSSProperties } from 'react';
import { getLocaleFromPath } from '@/lib/locale-path';

type EditorialFrame = {
  src: string;
  timecode: string;
  frame: string;
};

const EDITORIAL_FRAMES: EditorialFrame[] = [
  {
    src: '/uploads/gisela-title-sequence-01.webp',
    timecode: '00:00:00:20',
    frame: 'A / 01',
  },
  {
    src: '/uploads/gisela-title-sequence-02.webp',
    timecode: '00:00:08:05',
    frame: 'A / 02',
  },
  {
    src: '/uploads/gisela-title-sequence-03.webp',
    timecode: '00:00:31:17',
    frame: 'A / 03',
  },
];

const Hero = () => {
  const locale = typeof window === 'undefined' ? 'es' : getLocaleFromPath(window.location.pathname);
  const sequenceDescription = locale === 'es'
    ? 'Tres fotogramas de Gisela creando una reseña UGC de producto.'
    : 'Three frames of Gisela creating a UGC product review.';

  return (
    <section id="home" className="title-sequence-hero relative w-full overflow-hidden">
      <div className="title-sequence-hero__stage">
        <p className="title-sequence-hero__chapter" aria-hidden="true">
          Chapter 00
        </p>

        <h1 className="title-sequence-hero__name">
          <span className="title-sequence-hero__word">
            Gisel
            <span className="title-sequence-hero__letter-a">a</span>
          </span>
        </h1>

        <span className="title-sequence-hero__a-strokes" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>

        <figure className="title-sequence-hero__frames">
          <figcaption className="sr-only">{sequenceDescription}</figcaption>

          {EDITORIAL_FRAMES.map((frame, index) => (
            <div
              key={frame.src}
              className="title-sequence-frame"
              style={{ '--frame-delay': `${160 + index * 110}ms` } as CSSProperties}
              aria-hidden="true"
            >
              <span className="title-sequence-frame__tape" />
              <div className="title-sequence-frame__film">
                <div className="title-sequence-frame__sprockets" />
                <div className="title-sequence-frame__image">
                  <img
                    src={frame.src}
                    alt=""
                    width="720"
                    height="1280"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <div className="title-sequence-frame__markings">
                  <span>{frame.frame}</span>
                  <span>{frame.timecode}</span>
                </div>
              </div>
            </div>
          ))}
        </figure>

        <p className="title-sequence-hero__metadata">
          Medellín <span aria-hidden="true">·</span> ES / EN <span aria-hidden="true">·</span> UGC
        </p>
      </div>
    </section>
  );
};

export default Hero;
