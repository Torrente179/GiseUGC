import { useEffect, useRef, type RefObject } from 'react';
import { useTranslation } from '@/lib/locale-context';
import PretextLineReveal from '@/components/motion/PretextLineReveal';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { formatProofValue, SITE_PROOF } from '@/data/site-proof';
import '@/styles/manifesto.css';

/**
 * Chapter 2 — "Hola, soy Gisela" + proof, as spatial glass: the statement on
 * one side, the four proof figures as frosted cards floating over the
 * palette's colour fields on the other. Styles and the motion model live in
 * src/styles/manifesto.css.
 *
 * Numerals render at their final value in the first HTML snapshot so
 * prerender / Googlebot never see 0 marcas / 0% satisfacción. The count-up
 * only overwrites the DOM after the figure is in view.
 */

interface CounterProps {
  end: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

const AnimatedCounter = ({ end, suffix = '', decimals = 0, duration = 1800 }: CounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);
  const display = formatProofValue(end, suffix, decimals);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      node.textContent = display;
      return undefined;
    }

    let animationFrame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          const startTime = performance.now();
          const animate = (timestamp: number) => {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            node.textContent = formatProofValue(easeOut * end, suffix, decimals);
            if (progress < 1) animationFrame = requestAnimationFrame(animate);
          };
          animationFrame = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (animationFrame !== 0) cancelAnimationFrame(animationFrame);
    };
  }, [decimals, display, duration, end, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
};

const clampUnit = (value: number) => Math.max(-1, Math.min(1, value));

/**
 * Pointer depth for fine pointers: writes the stage's --mf-nx/--mf-ny (-1…1)
 * and each card's local glint position. The registered-property transition
 * in manifesto.css eases the values, so this only samples once per frame.
 * Touch devices get the scroll-driven tilt and light sweep instead.
 */
const usePointerDepth = (
  sectionRef: RefObject<HTMLElement>,
  stageRef: RefObject<HTMLDivElement>,
) => {
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return undefined;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || reducedMotion.matches) return undefined;

    const cards = Array.from(stage.querySelectorAll<HTMLElement>('.mf-card'));
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;

    const apply = () => {
      frame = 0;
      if (!pointer) return;
      const { x, y } = pointer;
      // Read every rect before writing, so the writes can't force a re-layout
      // between reads.
      const sectionRect = section.getBoundingClientRect();
      const cardRects = cards.map((card) => card.getBoundingClientRect());
      const nx = clampUnit(((x - sectionRect.left) / sectionRect.width) * 2 - 1);
      const ny = clampUnit(((y - sectionRect.top) / sectionRect.height) * 2 - 1);
      stage.style.setProperty('--mf-nx', nx.toFixed(3));
      stage.style.setProperty('--mf-ny', ny.toFixed(3));
      cards.forEach((card, index) => {
        const rect = cardRects[index];
        card.style.setProperty('--mf-gx', `${(((x - rect.left) / rect.width) * 100).toFixed(1)}%`);
        card.style.setProperty('--mf-gy', `${(((y - rect.top) / rect.height) * 100).toFixed(1)}%`);
      });
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
      stage.style.setProperty('--mf-nx', '0');
      stage.style.setProperty('--mf-ny', '0');
      cards.forEach((card) => {
        card.style.removeProperty('--mf-gx');
        card.style.removeProperty('--mf-gy');
      });
    };

    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('pointerleave', onLeave);
    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sectionRef, stageRef]);
};

const ManifestoChapter = () => {
  const { t } = useTranslation();
  const revealRef = useScrollReveal<HTMLDivElement>();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  usePointerDepth(sectionRef, stageRef);

  const stats: Array<{
    labelKey: string;
    value?: number;
    suffix?: string;
    decimals?: number;
    display?: string;
    star?: boolean;
  }> = [
    { value: SITE_PROOF.brandCampaigns, suffix: '+', labelKey: 'socialProof.brands' },
    { value: SITE_PROOF.fiverrReviewCount, labelKey: 'socialProof.reviews' },
    { value: SITE_PROOF.fiverrRating, decimals: 1, labelKey: 'socialProof.rating', star: true },
    { display: SITE_PROOF.languages, labelKey: 'socialProof.languages' },
  ];

  return (
    <section ref={sectionRef} className="mf-chapter" aria-labelledby="manifesto-title">
      <div className="mf-wrap">
        <div className="mf-grid">
          <div ref={revealRef} className="mf-copy svc-reveal">
            <h2 id="manifesto-title" className="mf-title">
              <PretextLineReveal text={t('hero.introduction.title')} delay={0.05} stagger={0.09} className="block" />
            </h2>
            <p className="mf-body">{t('hero.introduction.description')}</p>
          </div>

          <div ref={stageRef} className="mf-stage">
            <div className="mf-aura" aria-hidden="true">
              <span className="mf-orb mf-orb--a" />
              <span className="mf-orb mf-orb--b" />
              <span className="mf-orb mf-orb--c" />
            </div>

            <dl className="mf-cards">
              {stats.map((stat) => (
                <div key={stat.labelKey} className="mf-card">
                  <dt className="mf-label">{t(stat.labelKey)}</dt>
                  <dd className="mf-value">
                    {stat.display ? (
                      <span className="tabular-nums">{stat.display}</span>
                    ) : (
                      <AnimatedCounter
                        end={stat.value ?? 0}
                        suffix={stat.suffix}
                        decimals={stat.decimals}
                      />
                    )}
                    {stat.star ? (
                      <svg className="mf-star" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
                      </svg>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManifestoChapter;
