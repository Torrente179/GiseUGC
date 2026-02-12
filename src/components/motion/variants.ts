import type { Transition, Variants } from 'framer-motion';

export const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const revealUp = (distance = 26, duration = 0.72, delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: distance,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      delay,
      ease: premiumEase,
    },
  },
});

export const staggerContainer = (staggerChildren = 0.12, delayChildren = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const springHoverTransition: Transition = {
  type: 'spring',
  stiffness: 290,
  damping: 20,
  mass: 0.72,
};
