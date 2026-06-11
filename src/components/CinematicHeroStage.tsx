import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import AutoplayPreviewVideo from '@/components/media/AutoplayPreviewVideo';
import { DIRECTOR_CLIPS } from '@/data/director-chapters';
import { getBestPosterSrc } from '@/data/portfolio-clips';

const ACTIVE_MS = 3900;

const CinematicHeroStage = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeClip = DIRECTOR_CLIPS[activeIndex];

  useEffect(() => {
    if (shouldReduceMotion) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % DIRECTOR_CLIPS.length);
    }, ACTIVE_MS);
    return () => window.clearInterval(timer);
  }, [shouldReduceMotion]);

  useGSAP(() => {
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const relative = (index - activeIndex + DIRECTOR_CLIPS.length) % DIRECTOR_CLIPS.length;
      const isActive = relative === 0;
      const side = relative <= 3 ? 1 : -1;
      const depth = Math.min(relative === 0 ? 0 : relative <= 3 ? relative : DIRECTOR_CLIPS.length - relative, 3);
      gsap.to(card, {
        xPercent: isActive ? -50 : -50 + side * (48 + depth * 18),
        yPercent: isActive ? -50 : -50 + depth * 2,
        z: isActive ? 0 : -150 * depth,
        rotationY: isActive ? 0 : side * -13 * depth,
        rotationZ: isActive ? 0 : side * 2.2 * depth,
        scale: isActive ? 1 : Math.max(0.63, 0.9 - depth * 0.11),
        opacity: depth > 2 ? 0.25 : isActive ? 1 : 0.72 - depth * 0.12,
        filter: isActive ? 'brightness(1) saturate(1)' : `brightness(${0.7 - depth * 0.1}) saturate(0.72)`,
        duration: shouldReduceMotion ? 0 : 1.15,
        ease: 'power4.out',
      });
    });
  }, { scope: rootRef, dependencies: [activeIndex, shouldReduceMotion] });

  useGSAP(() => {
    if (shouldReduceMotion) return;
    const root = rootRef.current;
    if (!root) return;
    const moveX = gsap.quickTo(root, '--hero-parallax-x', { duration: 0.8, ease: 'power3.out' });
    const moveY = gsap.quickTo(root, '--hero-parallax-y', { duration: 0.8, ease: 'power3.out' });
    const onPointerMove = (event: PointerEvent) => {
      moveX((event.clientX / window.innerWidth - 0.5) * 18);
      moveY((event.clientY / window.innerHeight - 0.5) * 12);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, { scope: rootRef, dependencies: [shouldReduceMotion] });

  return (
    <div ref={rootRef} className="cinematic-hero-stage" aria-hidden="true">
      <div className="cinematic-hero-stage__ambient">
        <img src={getBestPosterSrc(activeClip)} alt="" className="cinematic-hero-stage__ambient-image" />
      </div>

      <div className="cinematic-hero-stage__deck">
        {DIRECTOR_CLIPS.map((clip, index) => {
          const isActive = index === activeIndex;
          const poster = getBestPosterSrc(clip);
          return (
            <div
              key={clip.id}
              ref={(node) => { cardRefs.current[index] = node; }}
              className="cinematic-hero-stage__card"
            >
              <img src={poster} alt="" className="cinematic-hero-stage__face" />
              {isActive && !shouldReduceMotion ? (
                <AutoplayPreviewVideo
                  src={clip.previewSrc}
                  poster={poster}
                  className="cinematic-hero-stage__face cinematic-hero-stage__video"
                  playbackPriority="hero"
                  loadStrategy="immediate"
                  rootMargin="0px"
                  preload="metadata"
                />
              ) : null}
              <span className="cinematic-hero-stage__frame" />
            </div>
          );
        })}
      </div>

      <div className="cinematic-hero-stage__hud">
        <span>EDIT / {String(activeIndex + 1).padStart(2, '0')}</span>
        <span className="cinematic-hero-stage__hud-line" />
        <span>{String(DIRECTOR_CLIPS.length).padStart(2, '0')}</span>
      </div>
    </div>
  );
};

export default CinematicHeroStage;
