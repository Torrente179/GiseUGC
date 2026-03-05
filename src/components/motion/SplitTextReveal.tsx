import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { premiumEase } from '@/components/motion/variants';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

interface SplitTextRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
}

const SplitTextReveal = ({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  once = true,
  amount = 0.15,
}: SplitTextRevealProps) => {
  const shouldReduceMotion = usePrefersReducedMotion();
  const content = typeof text === 'string' ? text : String(text ?? '');
  const words = content.split(/\s+/).filter(Boolean);

  if (shouldReduceMotion || words.length === 0) {
    return <span className={className}>{content}</span>;
  }

  return (
    <motion.span
      key={content}
      className={cn('inline-block', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={cn('inline-block', wordClassName)}
            variants={{
              hidden: {
                y: '112%',
                opacity: 0,
              },
              visible: {
                y: '0%',
                opacity: 1,
                transition: {
                  duration: 0.58,
                  ease: premiumEase,
                },
              },
            }}
          >
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export default SplitTextReveal;
