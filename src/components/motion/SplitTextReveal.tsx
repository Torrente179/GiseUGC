import PretextLineReveal from '@/components/motion/PretextLineReveal';

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
  const content = typeof text === 'string' ? text : String(text ?? '');
  return (
    <PretextLineReveal
      text={content}
      className={className}
      lineClassName={wordClassName}
      delay={delay}
      stagger={stagger}
      once={once}
      threshold={amount}
    />
  );
};

export default SplitTextReveal;
