import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { useTranslation } from '@/lib/locale-context';
import PretextLineReveal from '@/components/motion/PretextLineReveal';
import { useHashlessSectionNavigation } from '@/hooks/use-hashless-section-navigation';
import { isMobileViewport, toggleContactDock } from '@/lib/contact-dock';
import AdaptiveVideo from '@/components/media/AdaptiveVideo';
import { r2PreviewVideo } from '@/data/portfolio-clips';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import '@/styles/creator-advantage.css';

/**
 * "Videos para cada paso antes de la compra": one shoot, three cuts. The
 * cuts are glass-framed reels stacked in depth; the front one plays, the
 * stack rotates while the section is on screen, and a tap brings the next
 * one forward. Layout, the three slots and the motion model live in
 * src/styles/creator-advantage.css.
 *
 * All three cuts come from the same clothing shoot, so the stack shows what
 * the copy promises: one recording, an ad, a demo and a review.
 */

const CUT_INTERVAL_MS = 4000;

const CUTS = [
  { id: 'ad', file: 'ugc-clothing-showcase-2' },
  { id: 'demo', file: 'ugc-clothing-showcase-1' },
  { id: 'review', file: 'ugc-clothing-showcase-3' },
] as const;

const posterVariant = (file: string, width: 360 | 720, format: 'avif' | 'webp') =>
  `/uploads/videos/poster-variants/v1/${file}-${width}.${format}`;

const PointIcon = ({ index }: { index: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {index === 0 ? <path d="M13 2 4 14h7l-1 8 9-12h-7z" /> : null}
    {index === 1 ? (
      <>
        <path d="M12 3 4 7.5v9L12 21l8-4.5v-9z" />
        <path d="M4 7.5 12 12l8-4.5" />
        <path d="M12 12v9" />
      </>
    ) : null}
    {index === 2 ? (
      <>
        <path d="M4 6h10" />
        <path d="M4 12h16" />
        <path d="M4 18h7" />
        <circle cx="18" cy="6" r="2" />
        <circle cx="15" cy="18" r="2" />
      </>
    ) : null}
  </svg>
);

const CreatorAdvantage = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = usePrefersReducedMotion();
  const { handleHashLinkClick } = useHashlessSectionNavigation();
  const sectionRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const [isSectionNearViewport, setIsSectionNearViewport] = useState(false);
  const [front, setFront] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);
  const revealRef = useScrollReveal<HTMLDivElement>();

  const handleContactCtaClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (isMobileViewport()) {
        event.preventDefault();
        toggleContactDock();
        return;
      }

      handleHashLinkClick(event);
    },
    [handleHashLinkClick],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === 'undefined') {
      setIsSectionNearViewport(document.visibilityState === 'visible');
      return undefined;
    }

    let intersects = false;
    const sync = () => {
      setIsSectionNearViewport(intersects && document.visibilityState === 'visible');
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        intersects = Boolean(entry?.isIntersecting);
        sync();
      },
      { rootMargin: '360px 0px' },
    );
    observer.observe(section);
    document.addEventListener('visibilitychange', sync);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  // `cycle` restarts the interval after a tap, so the next turn waits a full
  // interval instead of firing right after the manual one.
  const isRotating = !shouldReduceMotion && isSectionNearViewport && !paused;
  useEffect(() => {
    if (!isRotating) return undefined;
    const id = window.setInterval(() => setFront((current) => (current + 1) % CUTS.length), CUT_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [isRotating, cycle]);

  const showNext = useCallback(() => {
    setFront((current) => (current + 1) % CUTS.length);
    setCycle((current) => current + 1);
  }, []);

  // Pointer depth for fine pointers only; phones get the scroll-driven tilt
  // from the view timeline in the stylesheet.
  useEffect(() => {
    const section = sectionRef.current;
    const deck = deckRef.current;
    if (!section || !deck || shouldReduceMotion) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;

    let frame = 0;
    let pointer: { x: number; y: number } | null = null;
    const apply = () => {
      frame = 0;
      if (!pointer) return;
      const rect = section.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, ((pointer.x - rect.left) / rect.width) * 2 - 1));
      const ny = Math.max(-1, Math.min(1, ((pointer.y - rect.top) / rect.height) * 2 - 1));
      deck.style.setProperty('--ca-nx', nx.toFixed(3));
      deck.style.setProperty('--ca-ny', ny.toFixed(3));
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      pointer = null;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      deck.style.setProperty('--ca-nx', '0');
      deck.style.setProperty('--ca-ny', '0');
    };
    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('pointerleave', onLeave);
    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [shouldReduceMotion]);

  const points = ['portfolio.collagePoint1', 'portfolio.collagePoint2', 'portfolio.collagePoint3'];
  const frontCut = CUTS[front];

  return (
    <section ref={sectionRef} className="ca-section" aria-labelledby="creator-advantage-title">
      <div className="ca-wrap">
        <div className="ca-grid">
          <div ref={revealRef} className="ca-head svc-reveal">
            <h2 id="creator-advantage-title" className="ca-title">
              <PretextLineReveal
                text={t('portfolio.collageTitle')}
                delay={0.06}
                stagger={0.08}
                className="block"
              />
            </h2>
            <p className="ca-body">{t('portfolio.collageDescription')}</p>
          </div>

          <div
            className="ca-stage"
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') setPaused(true);
            }}
            onPointerLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <p className="ca-chip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="16" rx="3" />
                <path d="M7 4v16" />
                <path d="M17 4v16" />
              </svg>
              {t('portfolio.collageEyebrow')}
            </p>

            <div ref={deckRef} className="ca-deck">
              <div className="ca-aura" aria-hidden="true">
                <span className="ca-orb ca-orb--a" />
                <span className="ca-orb ca-orb--b" />
                <span className="ca-orb ca-orb--c" />
              </div>

              {CUTS.map((cut, index) => {
                const slot = (index - front + CUTS.length) % CUTS.length;
                const isFront = slot === 0;
                const label = t(`portfolio.collageCuts.${cut.id}.label`);
                return (
                  <div key={cut.id} className="ca-card" data-slot={slot} aria-hidden={!isFront}>
                    <div className="ca-card-body">
                      <div className="ca-media">
                        <picture>
                          <source
                            type="image/avif"
                            srcSet={`${posterVariant(cut.file, 360, 'avif')} 360w, ${posterVariant(cut.file, 720, 'avif')} 720w`}
                            sizes="(min-width: 1024px) 15rem, 56vw"
                          />
                          <img
                            src={posterVariant(cut.file, 720, 'webp')}
                            srcSet={`${posterVariant(cut.file, 360, 'webp')} 360w, ${posterVariant(cut.file, 720, 'webp')} 720w`}
                            sizes="(min-width: 1024px) 15rem, 56vw"
                            alt={isFront ? t(`portfolio.collageCuts.${cut.id}.caption`) : ''}
                            loading="lazy"
                            decoding="async"
                          />
                        </picture>
                        {isFront && !shouldReduceMotion ? (
                          <AdaptiveVideo
                            key={cut.id}
                            src={r2PreviewVideo(`${cut.file}.mp4`)}
                            poster={posterVariant(cut.file, 720, 'webp')}
                            muted
                            loop
                            autoPlay
                            playsInline
                            preload="metadata"
                            playbackPriority="preview"
                            rootMargin="180px 0px"
                            aria-hidden="true"
                          />
                        ) : null}
                      </div>
                      <span className="ca-tag">
                        <span className="ca-tag-num">{index + 1}</span>
                        {label}
                      </span>
                    </div>
                  </div>
                );
              })}

              <button type="button" className="ca-next" onClick={showNext} aria-label={t('portfolio.collageNextCut')} />
            </div>

            <div className="ca-caption-row">
              <p className="ca-caption">{t(`portfolio.collageCuts.${frontCut.id}.caption`)}</p>
              <span className="ca-dots" aria-hidden="true">
                {CUTS.map((cut, index) => (
                  <span key={cut.id} className="ca-dot" data-active={index === front} />
                ))}
              </span>
            </div>
          </div>

          <ul className="ca-points">
            {points.map((key, index) => (
              <li key={key} className="ca-point">
                <span className="ca-point-icon">
                  <PointIcon index={index} />
                </span>
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>

          <a href="#contact" onClick={handleContactCtaClick} className="ca-cta">
            {t('portfolio.collageCta')}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CreatorAdvantage;
