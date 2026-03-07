import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { easeOutExpo } from '@/components/motion/variants';

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
  const shouldReduceMotion = useReducedMotion();
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
            style={{ willChange: 'transform, opacity' }}
            variants={{
              hidden: {
                y: '108%',
                opacity: 0,
              },
              visible: {
                y: '0%',
                opacity: 1,
                transition: {
                  duration: 0.68,
                  ease: easeOutExpo,
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
