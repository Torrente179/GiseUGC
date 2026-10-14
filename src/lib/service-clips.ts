import { LEGACY_REEL_CLIPS, type ReelClip } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';

const clipsById = new Map<number, ReelClip>(
  [...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS].map((clip) => [clip.id, clip]),
);

/** Clip by catalog id, across the legacy reel and the newer uploads. */
export const getClipById = (id: number | undefined): ReelClip | undefined =>
  id === undefined ? undefined : clipsById.get(id);
