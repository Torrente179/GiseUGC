import { useEffect, useRef, useState, type CSSProperties } from 'react';
import AutoplayPreviewVideo from '@/components/media/AutoplayPreviewVideo';
import ResponsivePosterImage from '@/components/media/ResponsivePosterImage';
import { useDailyRotation } from '@/hooks/use-daily-rotation';
import { useHeroKeyLight } from '@/hooks/use-hero-key-light';
import { LEGACY_REEL_CLIPS, getBestPosterSrc, type ReelClip } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';
import { useTranslation } from '@/lib/locale-context';

/** Full catalog — the three frames draw from it and re-deal every 24h. */
const ALL_CLIPS: ReelClip[] = [...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS];
const HERO_LEAD_CLIP_ID = 1007;
const HERO_LEAD_CLIP = ALL_CLIPS.find(({ id }) => id === HERO_LEAD_CLIP_ID) ?? ALL_CLIPS[0];
const ROTATING_FLANK_CLIPS = ALL_CLIPS.filter(({ id }) => id !== HERO_LEAD_CLIP.id);

/** Film furniture stays fixed while the clip behind it rotates — the markings
 *  are set dressing, not metadata about the take. */
const FRAME_MARKINGS = [
  { timecode: '00:00:00:20', frame: 'A / 01' },
  { timecode: '00:00:08:05', frame: 'A / 02' },
  { timecode: '00:00:31:17', frame: 'A / 03' },
];

/** Centre frame is the one that plays when we only get to play one. */
const LEAD_FRAME_INDEX = 1;

const Hero = () => {
  const { locale } = useTranslation();
  const sequenceDescription = locale === 'es'
    ? 'Tres fotogramas de Gisela creando una reseña UGC de producto.'
    : 'Three frames of Gisela creating a UGC product review.';

  const stageRef = useRef<HTMLDivElement>(null);
  const keyLightRef = useRef<HTMLDivElement>(null);

  const [reduceMotion, setReduceMotion] = useState(false);
  const [motionIntent, setMotionIntent] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (reduceMotion || motionIntent) return undefined;

    const activateMotion = () => setMotionIntent(true);
    const events: (keyof WindowEventMap)[] = [
      'pointermove',
      'pointerdown',
      'touchstart',
      'scroll',
      'keydown',
    ];
    events.forEach((eventName) => {
      window.addEventListener(eventName, activateMotion, { passive: true, once: true });
    });

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, activateMotion));
    };
  }, [motionIntent, reduceMotion]);

  useHeroKeyLight(keyLightRef, motionIntent);

  // Three clips, re-dealt on the UTC day boundary.
  const dailyFlanks = useDailyRotation(ROTATING_FLANK_CLIPS, 2);
  const dailyClips = [dailyFlanks[0], HERO_LEAD_CLIP, dailyFlanks[1]];

  return (
    <section id="home" className="title-sequence-hero relative w-full overflow-hidden">
      <div ref={stageRef} className="title-sequence-hero__stage">
        <p className="title-sequence-hero__chapter" aria-hidden="true">
          Chapter 00
        </p>

        <h1 className="title-sequence-hero__name">
          Gisela
        </h1>

        <figure className="title-sequence-hero__frames">
          <figcaption className="sr-only">{sequenceDescription}</figcaption>

          {FRAME_MARKINGS.map((markings, index) => {
            const clip = dailyClips[index];
            if (!clip) return null;
            const poster = getBestPosterSrc(clip);
            // Keep one lead decoder on every device. The flanking frames stay
            // visually rich as posters without competing for bandwidth,
            // decode time, or GPU compositing.
            const playsVideo =
              motionIntent && !reduceMotion && index === LEAD_FRAME_INDEX;

            return (
              <div
                key={clip.id}
                className="title-sequence-frame"
                style={{ '--frame-delay': `${160 + index * 110}ms` } as CSSProperties}
                aria-hidden="true"
              >
                <span className="title-sequence-frame__tape" />
                <div className="title-sequence-frame__film">
                  <div className="title-sequence-frame__sprockets" />
                  <div className="title-sequence-frame__image">
                    {playsVideo ? (
                      <AutoplayPreviewVideo
                        src={clip.previewSrc}
                        poster={poster}
                        preload="none"
                        requestPlaybackSlot
                        playbackPriority="hero"
                        rootMargin="0px"
                      />
                    ) : (
                      <ResponsivePosterImage
                        clip={clip}
                        alt=""
                        loading={index === LEAD_FRAME_INDEX ? 'eager' : 'lazy'}
                        decoding={index === LEAD_FRAME_INDEX ? 'sync' : 'async'}
                        sizes="(max-width: 767px) 200px, (max-width: 1279px) 28vw, 24vw"
                        fetchpriority={index === LEAD_FRAME_INDEX ? 'high' : 'low'}
                      />
                    )}
                  </div>
                  <div className="title-sequence-frame__markings">
                    <span>{markings.frame}</span>
                    <span>{markings.timecode}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </figure>

        {/* One light source, lerped toward the pointer by use-hero-key-light.
            Rakes the paper and the film frames; the wordmark keeps its solid
            fill. */}
        <div ref={keyLightRef} className="title-sequence-hero__keylight" aria-hidden="true" />

        <p className="title-sequence-hero__metadata">
          Medellín <span aria-hidden="true">·</span> ES / EN <span aria-hidden="true">·</span> UGC
        </p>
      </div>
    </section>
  );
};

export default Hero;
