import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Eye, Star, Briefcase } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="relative z-20 py-20 bg-secondary/35 border-y border-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="relative overflow-hidden group"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-y-12 lg:gap-0">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center px-4 relative group/item"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {/* Vertical separator for desktop */}
                {index !== 0 && (
                  <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-muted to-transparent" />
                )}

                <div className="mb-4 text-accent/40 group-hover/item:text-accent transition-colors duration-500">
                  {stat.icon}
                </div>

                <span className="block text-4xl md:text-[3.25rem] font-serif font-bold tracking-tight-serif text-primary mb-2 leading-[0.9]">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </span>

                <span className="section-label text-muted-foreground">
                  {t(stat.labelKey)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;
