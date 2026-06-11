import { createContext, useContext } from 'react';
import type { ReelClip } from '@/data/portfolio-clips';

export type ReelOpenSource = 'portfolio' | 'director' | 'hero';

export type OpenReelOptions = {
  source?: ReelOpenSource;
  trigger?: HTMLElement | null;
};

export type ReelTheaterContextValue = {
  activeClip: ReelClip | null;
  isOpen: boolean;
  openReel: (clip: ReelClip, options?: OpenReelOptions) => void;
  closeReel: () => void;
};

export const ReelTheaterContext = createContext<ReelTheaterContextValue | null>(null);

export const useReelTheater = () => {
  const value = useContext(ReelTheaterContext);
  if (!value) throw new Error('useReelTheater must be used within ReelTheaterProvider');
  return value;
};
