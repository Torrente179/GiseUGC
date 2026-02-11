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
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [end, duration, hasAnimated]);

    return (
        <span ref={ref} className="tabular-nums">
            {count.toLocaleString()}{suffix}
        </span>
    );
};

const SocialProof = () => {
    const { t } = useTranslation();

    const stats = [
        {
            icon: <Briefcase className="w-8 h-8 text-brand-teal mb-3" />,
            value: 50,
            suffix: '+',
            labelKey: 'socialProof.brands'
        },
        {
            icon: <Eye className="w-8 h-8 text-primary mb-3" />,
            value: 2,
            suffix: 'M+',
            labelKey: 'socialProof.views'
        },
        {
            icon: <Star className="w-8 h-8 text-brand-gold mb-3" />,
            value: 100,
            suffix: '%',
            labelKey: 'socialProof.satisfaction'
        },
        {
            icon: <Users className="w-8 h-8 text-brand-olive mb-3" />,
            value: 500,
            suffix: '+',
            labelKey: 'socialProof.contentPieces'
        }
    ];

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/65 via-background to-secondary/65" />
            <div className="absolute left-[-18rem] top-[-8rem] h-[24rem] w-[24rem] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute right-[-14rem] bottom-[-8rem] h-[20rem] w-[20rem] rounded-full bg-brand-teal/15 blur-[110px]" />
            <div className="container relative z-10 mx-auto px-6 md:px-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="cafe-card flex flex-col items-center p-6 bg-card/75 hover-lift"
                        >
                            {stat.icon}
                            <span className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                            </span>
                            <span className="text-sm text-primary/80 uppercase tracking-[0.16em]">
                                {t(stat.labelKey)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
