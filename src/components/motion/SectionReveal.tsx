import { type ReactNode } from 'react';
import { m, useReducedMotion, type Variants } from 'framer-motion';
import { easeOutExpo } from '@/components/motion/variants';

type RevealDirection = 'up' | 'left' | 'right' | 'scale';

interface SectionRevealProps {
  children: ReactNode;
  /** HTML id for scroll-to-section targeting */
  id?: string;
  /** Extra class names on the wrapping <section> */
  className?: string;
  /** Direction the content enters from */
  direction?: RevealDirection;
  /** Stagger delay between children (seconds) */
  stagger?: number;
  /** Initial delay before first child appears */
  delay?: number;
  /** Viewport intersection threshold to trigger */
  amount?: number;
  /** Include blur transition (the premium "emerging from soft focus" feel) */
  blur?: boolean;
  /** Distance in px for directional reveals */
  distance?: number;
  /** Duration for each child animation */
  duration?: number;
  /** Use a different HTML tag instead of section */
  as?: 'section' | 'div' | 'footer';
}

const getDirectionalVariants = (
  direction: RevealDirection,
  distance: number,
  duration: number,
  blur: boolean,
): Variants => {
  const blurHidden = blur ? { filter: 'blur(4px)' } : {};
  const blurVisible = blur ? { filter: 'blur(0px)' } : {};
  const transitionEnd: { filter?: string } = blur ? { filter: 'none' } : {};

  const baseHidden: Record<string, unknown> = { opacity: 0, ...blurHidden };
  const baseVisible: Record<string, unknown> = { opacity: 1, ...blurVisible };

  switch (direction) {
    case 'up':
      return {
        hidden: { ...baseHidden, y: distance },
        visible: {
          ...baseVisible,
          y: 0,
          transition: { duration, ease: easeOutExpo },
          transitionEnd,
        },
      };
    case 'left':
      return {
        hidden: { ...baseHidden, x: -distance },
        visible: {
          ...baseVisible,
          x: 0,
          transition: { duration, ease: easeOutExpo },
          transitionEnd,
        },
      };
    case 'right':
      return {
        hidden: { ...baseHidden, x: distance },
        visible: {
          ...baseVisible,
          x: 0,
          transition: { duration, ease: easeOutExpo },
          transitionEnd,
        },
      };
    case 'scale':
      return {
        hidden: { ...baseHidden, scale: 0.96 },
        visible: {
          ...baseVisible,
          scale: 1,
          transition: { duration, ease: easeOutExpo },
          transitionEnd,
        },
      };
  }
};

const SectionReveal = ({
  children,
  id,
  className,
  direction = 'up',
  stagger = 0.1,
  delay = 0.06,
  amount = 0.25,
  blur = true,
  distance = 24,
  duration = 0.75,
  as: Tag = 'section',
}: SectionRevealProps) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Component = Tag;
    return (
      <Component id={id} className={className}>
        {children}
      </Component>
    );
  }

  const MotionTag = Tag === 'footer' ? m.footer : Tag === 'div' ? m.div : m.section;

  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
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
      {children}
    </MotionTag>
  );
};

/** Wrap individual children inside a SectionReveal to animate them */
const SectionRevealItem = ({
  children,
  className,
  direction = 'up',
  blur = true,
  distance = 24,
  duration = 0.75,
}: {
  children: ReactNode;
  className?: string;
  direction?: RevealDirection;
  blur?: boolean;
  distance?: number;
  duration?: number;
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      variants={getDirectionalVariants(direction, distance, duration, blur)}
    >
      {children}
    </m.div>
  );
};

export { SectionReveal, SectionRevealItem };
export default SectionReveal;
