import { useEffect, useRef } from 'react';
import { useTranslation } from '@/lib/locale-context';
import PretextLineReveal from '@/components/motion/PretextLineReveal';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { formatProofValue, SITE_PROOF } from '@/data/site-proof';

/**
 * Chapter 2 — Manifesto. The studio statement and the proof numerals as one
 * editorial scene (absorbs the old HeroIntroduction + SocialProof sections).
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

const ManifestoChapter = () => {
  const { t } = useTranslation();
  const revealRef = useScrollReveal<HTMLDivElement>();

  const stats: Array<{
    labelKey: string;
    value?: number;
    suffix?: string;
    decimals?: number;
    display?: string;
  }> = [
    { value: SITE_PROOF.brandCampaigns, suffix: '+', labelKey: 'socialProof.brands' },
    { value: SITE_PROOF.fiverrReviewCount, labelKey: 'socialProof.reviews' },
    { value: SITE_PROOF.fiverrRating, decimals: 1, labelKey: 'socialProof.rating' },
    { display: SITE_PROOF.languages, labelKey: 'socialProof.languages' },
  ];

  return (
    <section className="relative bg-background">
      <div ref={revealRef} className="svc-reveal container mx-auto px-6 py-24 md:px-12 md:py-36">
        {/* ── Statement ── */}
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
          <h2 className="dc-statement max-w-[18ch]">
            <PretextLineReveal text={t('hero.introduction.title')} delay={0.05} stagger={0.09} className="block" />
          </h2>
          <p className="strategic-body max-w-[34rem] text-base font-normal leading-[1.7] text-foreground/70 md:text-lg lg:pb-2">
            {t('hero.introduction.description')}
          </p>
        </div>

        {/* ── Proof numerals ── */}
        <div
          className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent md:mt-24"
          aria-hidden="true"
        />

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-16 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.labelKey}>
              <div className="dc-numeral">
                {stat.display ? (
                  <span className="tabular-nums">{stat.display}</span>
                ) : (
                  <AnimatedCounter
                    end={stat.value ?? 0}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                  />
                )}
              </div>
              <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground md:text-[11px]">
                {t(stat.labelKey)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManifestoChapter;
