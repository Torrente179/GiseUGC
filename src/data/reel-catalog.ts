import { LEGACY_REEL_CLIPS, type ReelClip } from '@/data/portfolio-clips';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';

export const ALL_REEL_CLIPS: ReelClip[] = [...LEGACY_REEL_CLIPS, ...NUEVOS_R2_READY_CLIPS];

export const getReelClipById = (clipId: number) =>
  ALL_REEL_CLIPS.find((clip) => clip.id === clipId) ?? null;

export const getReelTitle = (clip: ReelClip, translate: (key: string) => string) =>
  clip.titleKey ? translate(clip.titleKey) : clip.title ?? `Clip ${clip.id}`;
