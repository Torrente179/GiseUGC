import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Eye, Star, Briefcase } from 'lucide-react';

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter = ({ end, suffix = '', duration = 2000 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
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

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.45 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const SocialProof = () => {
  const { t } = useTranslation();

  const stats = [
    {
      icon: <Briefcase className="h-5 w-5 text-primary" />,
      value: 50,
      suffix: '+',
      labelKey: 'socialProof.brands',
    },
    {
      icon: <Eye className="h-5 w-5 text-primary" />,
      value: 2,
      suffix: 'M+',
      labelKey: 'socialProof.views',
    },
    {
      icon: <Star className="h-5 w-5 text-primary" />,
      value: 100,
      suffix: '%',
      labelKey: 'socialProof.satisfaction',
    },
    {
      icon: <Users className="h-5 w-5 text-primary" />,
      value: 500,
      suffix: '+',
      labelKey: 'socialProof.contentPieces',
    },
  ];

  return (
    <section className="studio-section-tight -mt-6 md:-mt-10">
      <div className="studio-container">
        <div className="studio-panel p-3 md:p-4 lg:p-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border/70 bg-card/70 px-4 py-5 text-center md:px-5 md:py-6"
              >
                <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background/75">
                  {stat.icon}
                </div>
                <span className="block text-3xl md:text-[2.15rem] font-serif font-semibold tracking-[-0.03em] text-foreground">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </span>
                <span className="mt-1 block text-[11px] md:text-xs uppercase tracking-[0.13em] text-muted-foreground">
                  {t(stat.labelKey)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
