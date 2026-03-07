import type { Transition, Variants } from 'framer-motion';

/* ─── Named Easing Curves ─── */

/** Premium reveal easing — fast start, gentle settle (used for scroll reveals, text entrances) */
export const premiumEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Expo-out — very fast start, long coast (Apple-style content reveals) */
export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Quart-out — subtle, quieter movements */
export const easeOutQuart: [number, number, number, number] = [0.25, 1, 0.5, 1];

/** Cubic in-out — bidirectional (open/close, toggle states) */
export const easeInOutCubic: [number, number, number, number] = [0.65, 0, 0.35, 1];

/* ─── Timing Tokens (seconds, for Framer Motion) ─── */

/** Micro: taps, focus rings, icon rotations */
export const DURATION_MICRO = 0.15;
/** Fast: hovers, toggles, button states */
export const DURATION_FAST = 0.25;
/** Medium: section entrances, card reveals */
export const DURATION_MEDIUM = 0.6;
/** Slow: hero orchestration, page-load sequences */
export const DURATION_SLOW = 0.9;

/* ─── Named Spring Configs ─── */

/** Smooth spring — universal for hover/entrance (feels organic, not bouncy) */
export const springSmooth: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 26,
  mass: 0.8,
};

/** Snappy spring — taps, clicks, quick feedback */
export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 30,
  mass: 0.6,
};

/** Existing hover spring (well-tuned, keep) */
export const springHoverTransition: Transition = {
  type: 'spring',
  stiffness: 290,
  damping: 20,
  mass: 0.72,
};

/* ─── Variant Generators ─── */

/** Reveal-up: translate-Y + opacity (the workhorse) */
export const revealUp = (distance = 26, duration = DURATION_MEDIUM, delay = 0): Variants => ({
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

/** Simple opacity fade */
export const fadeIn = (duration = DURATION_MEDIUM, delay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration, delay, ease: easeOutQuart },
  },
});

/** Scale-in: scale + opacity (hero image, card emphasis) */
export const scaleIn = (from = 0.96, duration = DURATION_MEDIUM, delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    scale: from,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration, delay, ease: premiumEase },
  },
});

/** Reveal from left */
export const revealFromLeft = (distance = 30, duration = DURATION_MEDIUM, delay = 0): Variants => ({
  hidden: { opacity: 0, x: -distance },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration, delay, ease: premiumEase },
  },
});

/** Reveal from right */
export const revealFromRight = (distance = 30, duration = DURATION_MEDIUM, delay = 0): Variants => ({
  hidden: { opacity: 0, x: distance },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration, delay, ease: premiumEase },
  },
});

/** Blur-in: filter-blur + opacity (premium content reveal — the Apple signature) */
export const blurIn = (duration = 0.7, delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration, delay, ease: easeOutExpo },
  },
});

/** Blur-reveal-up: combines translate-Y + blur + opacity for premium section entrances */
export const blurRevealUp = (distance = 20, duration = 0.7, delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: distance,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration, delay, ease: easeOutExpo },
  },
});

/** Stagger container (unchanged API, widely used) */
export const staggerContainer = (staggerChildren = 0.12, delayChildren = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/** Hero orchestration container — longer delays for page-load sequence */
export const heroOrchestration = (delayChildren = 0.2): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren,
    },
  },
});

/** Micro-interaction hover presets */
export const hoverLift = {
  whileHover: { y: -6, scale: 1.015 },
  whileTap: { scale: 0.97 },
  transition: springSmooth,
};

export const hoverFloat = {
  whileHover: { y: -3, scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: springSnappy,
};
