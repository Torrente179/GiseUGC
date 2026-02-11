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
      icon: <Briefcase className="h-4 w-4" />,
      value: 50,
      suffix: '+',
      labelKey: 'socialProof.brands',
    },
    {
      icon: <Eye className="h-4 w-4" />,
      value: 2,
      suffix: 'M+',
      labelKey: 'socialProof.views',
    },
    {
      icon: <Star className="h-4 w-4" />,
      value: 100,
      suffix: '%',
      labelKey: 'socialProof.satisfaction',
    },
    {
      icon: <Users className="h-4 w-4" />,
      value: 500,
      suffix: '+',
      labelKey: 'socialProof.contentPieces',
    },
  ];

  return (
    <section className="relative z-20 -mt-10 md:-mt-14 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/35 backdrop-blur-2xl shadow-[0_32px_80px_-40px_rgba(0,0,0,0.12)] group">
          {/* Subtle background luxury textures */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/10 via-transparent to-black/5 opacity-40" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="grid grid-cols-2 lg:grid-cols-4 items-center py-10 md:py-14">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center px-4 relative group/item"
              >
                {/* Vertical separator for desktop */}
                {index !== 0 && (
                  <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-border/40 to-transparent" />
                )}

                {/* Horizontal separator for mobile (only between rows) */}
                {index === 2 && (
                  <div className="lg:hidden absolute -top-5 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
                )}

                <div className="mb-4 text-primary/30 group-hover/item:text-primary/70 transition-colors duration-500">
                  {stat.icon}
                </div>

                <span className="block text-4xl md:text-[3.25rem] font-serif font-normal tracking-[-0.04em] text-foreground mb-2 leading-none">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </span>

                <span className="block text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-muted-foreground/80 font-medium">
                  {t(stat.labelKey)}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom highlight line */}
          <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        </div>
      </div>
    </section>
  );
};


export default SocialProof;
