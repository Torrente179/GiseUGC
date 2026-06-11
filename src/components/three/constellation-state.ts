/**
 * Shared mutable state between the constellation's ScrollTrigger rig (which
 * writes scroll progress) and the three.js render loop (which reads it every
 * frame). A plain module singleton keeps the two decoupled — no React state,
 * no re-renders, no event traffic at 60fps.
 */
export const constellationState = {
  /** 0..1 — scroll progress through the pinned hero fly-through. */
  progress: 0,
};

export const resetConstellationState = (): void => {
  constellationState.progress = 0;
};
