import { useMemo } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';

export type MotionProfile = {
  reduce: boolean;
  mobile: boolean;
  heroEnabled: boolean;
  blurAllowed: boolean;
  sectionMode: 'none' | 'section-only' | 'section-stagger';
};

export const MOTION_BUDGETS = {
  instant: 0.16,
  interactive: 0.22,
  section: 0.38,
  hero: 0.58,
} as const;

type MotionZone = 'hero' | 'section' | 'utility';

export const useMotionProfile = (zone: MotionZone = 'section'): MotionProfile => {
  const reduce = usePrefersReducedMotion();
  const mobile = useIsMobile();

  return useMemo(() => {
    if (reduce) {
      return {
        reduce: true,
        mobile,
        heroEnabled: false,
        blurAllowed: false,
        sectionMode: 'none' as const,
      };
    }

    if (zone === 'hero') {
      return {
        reduce: false,
        mobile,
        heroEnabled: !mobile,
        blurAllowed: !mobile,
        sectionMode: mobile ? 'none' : 'section-only',
      };
    }

    if (mobile) {
      return {
        reduce: false,
        mobile: true,
        heroEnabled: false,
        blurAllowed: false,
        sectionMode: 'section-only',
      };
    }

    return {
      reduce: false,
      mobile: false,
      heroEnabled: zone !== 'utility',
      blurAllowed: true,
      sectionMode: 'section-only',
    };
  }, [mobile, reduce, zone]);
};
