import { getReelClipById } from '@/data/reel-catalog';

export interface DirectorChapter {
  clipId: number;
  labelKey: string;
  statementKey: string;
}

export const DIRECTOR_CHAPTERS: DirectorChapter[] = [
  { clipId: 2, labelKey: 'director.chapters.presence.label', statementKey: 'director.chapters.presence.statement' },
  { clipId: 1007, labelKey: 'director.chapters.production.label', statementKey: 'director.chapters.production.statement' },
  { clipId: 7, labelKey: 'director.chapters.tech.label', statementKey: 'director.chapters.tech.statement' },
  { clipId: 1013, labelKey: 'director.chapters.proof.label', statementKey: 'director.chapters.proof.statement' },
  { clipId: 1, labelKey: 'director.chapters.lifestyle.label', statementKey: 'director.chapters.lifestyle.statement' },
  { clipId: 1001, labelKey: 'director.chapters.convert.label', statementKey: 'director.chapters.convert.statement' },
];

export const DIRECTOR_CLIPS = DIRECTOR_CHAPTERS.map((chapter) => {
  const clip = getReelClipById(chapter.clipId);
  if (!clip) {
    throw new Error(`Missing director clip ${chapter.clipId}`);
  }
  return clip;
});
