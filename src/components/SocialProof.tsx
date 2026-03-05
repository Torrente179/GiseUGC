import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Briefcase, Eye, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { blurRevealUp, revealUp, staggerContainer } from '@/components/motion/variants';
import { MOTION_BUDGETS, useMotionProfile } from '@/components/motion/profile';

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
  const motionProfile = useMotionProfile();
  const sectionReveal = motionProfile.blurAllowed
    ? blurRevealUp(18, MOTION_BUDGETS.section)
    : revealUp(18, MOTION_BUDGETS.section);

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
    <motion.section
      className="relative z-20 py-20 bg-secondary/35 border-y border-muted/30"
      initial={motionProfile.sectionMode === 'none' ? undefined : 'hidden'}
      whileInView={motionProfile.sectionMode === 'none' ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.32 }}
      variants={staggerContainer(0.06, 0.02)}
    >
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="relative overflow-hidden" variants={sectionReveal}>
          <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-y-12 lg:gap-0">
            {stats.map((stat, index) => (
              <div
                key={stat.labelKey}
                className="flex flex-col items-center px-4 relative"
              >
                {index !== 0 && (
                  <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-muted to-transparent" />
                )}

                <div className="mb-4 text-accent/40">
                  {stat.icon}
                </div>

                <span className="block text-4xl md:text-[3.25rem] font-serif font-bold tracking-tight-serif text-primary mb-2 leading-[0.9]">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </span>

                <span className="section-label text-muted-foreground">{t(stat.labelKey)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default SocialProof;
