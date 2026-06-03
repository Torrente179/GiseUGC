import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Eye, Star, Users } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import { blurRevealUp, springSmooth, staggerContainer } from '@/components/motion/variants';

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
  const shouldReduceMotion = useReducedMotion();

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
    <m.section
      className="relative z-20 py-20 bg-secondary/35 border-y border-muted/30"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.32 }}
      variants={staggerContainer(0.1, 0.04)}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative overflow-hidden group">
          <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-y-12 lg:gap-0">
            {stats.map((stat, index) => (
              <m.div
                key={stat.labelKey}
                className="flex flex-col items-center px-4 relative group/item"
                variants={blurRevealUp(18, 0.62)}
                whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.03 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                transition={springSmooth}
              >
                {index !== 0 && (
                  <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-muted to-transparent" />
                )}

                <div className="mb-4 text-accent/40 group-hover/item:text-accent transition-colors duration-500">
                  {stat.icon}
                </div>

                <span className="type-marketing-display block text-3xl md:text-[2.5rem] font-semibold tracking-tight-marketing text-primary mb-2 leading-[1.05]">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </span>

                <span className="section-label text-muted-foreground">{t(stat.labelKey)}</span>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </m.section>
  );
};

export default SocialProof;
