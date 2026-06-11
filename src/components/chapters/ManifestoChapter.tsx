import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import PretextLineReveal from '@/components/motion/PretextLineReveal';
import { blurRevealUp, staggerContainer } from '@/components/motion/variants';

/**
 * Chapter 2 — Manifesto. The studio statement and the proof numerals as one
 * editorial scene (absorbs the old HeroIntroduction + SocialProof sections).
 */

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter = ({ end, suffix = '', duration = 1800 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const ManifestoChapter = () => {
  const { t } = useTranslation();

  const stats = [
    { value: 50, suffix: '+', labelKey: 'socialProof.brands' },
    { value: 2, suffix: 'M+', labelKey: 'socialProof.views' },
    { value: 100, suffix: '%', labelKey: 'socialProof.satisfaction' },
    { value: 500, suffix: '+', labelKey: 'socialProof.contentPieces' },
  ];

  return (
    <section className="relative bg-background">
      <m.div
        className="container mx-auto px-6 py-24 md:px-12 md:py-36"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer(0.12, 0.05)}
      >
        {/* ── Statement ── */}
        <m.span className="dc-chapter-label mb-8 md:mb-12" variants={blurRevealUp(12, 0.5)}>
          {t('hero.introduction.eyebrow')}
        </m.span>

        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
          <h2 className="dc-statement max-w-[18ch]">
            <PretextLineReveal text={t('hero.introduction.title')} delay={0.05} stagger={0.09} className="block" />
          </h2>
          <m.p
            className="strategic-body max-w-[34rem] text-base font-normal leading-[1.7] text-foreground/70 md:text-lg lg:pb-2"
            variants={blurRevealUp(16, 0.6, 0.15)}
          >
            {t('hero.introduction.description')}
          </m.p>
        </div>

        {/* ── Proof numerals ── */}
        <m.div
          className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-border/50 to-transparent md:mt-24"
          variants={blurRevealUp(8, 0.5)}
          aria-hidden="true"
        />

        <m.div
          className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-16 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.1, 0.05)}
        >
          {stats.map((stat) => (
            <m.div key={stat.labelKey} variants={blurRevealUp(18, 0.62)}>
              <div className="dc-numeral">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground md:text-[11px]">
                {t(stat.labelKey)}
              </div>
            </m.div>
          ))}
        </m.div>
      </m.div>
    </section>
  );
};

export default ManifestoChapter;
