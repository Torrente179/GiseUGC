import type { ServicePageId } from '@/lib/locale-path';

export type HeroVariant = 'split-world' | 'stage' | 'lab';
export type IntroVariant = 'wide' | 'centered' | 'dark';
export type DeliverablesVariant = 'magazine' | 'bento' | 'dashboard';
export type FitPanelVariant = 'split-diagonal' | 'stacked' | 'tabs';
export type ProcessVariant = 'scroll-track' | 'centered-timeline' | 'row-blocks';
export type FeaturedWorkVariant = 'asymmetric' | 'phone-frames' | 'strip';
export type CtaVariant = 'default' | 'personal' | 'teal-gradient';

export type SectionId =
  | 'hero'
  | 'featuredWork'
  | 'editorialIntro'
  | 'deliverables'
  | 'fitPanel'
  | 'process'
  | 'faq'
  | 'featuredWorkGrid'
  | 'ctaCloser'
  | 'related';

export interface ServiceLayout {
  heroVariant: HeroVariant;
  introVariant: IntroVariant;
  deliverablesVariant: DeliverablesVariant;
  fitPanelVariant: FitPanelVariant;
  processVariant: ProcessVariant;
  featuredWorkVariant: FeaturedWorkVariant;
  ctaVariant: CtaVariant;
  sectionOrder: SectionId[];
}

export const SERVICE_LAYOUTS: Record<ServicePageId, ServiceLayout> = {
  /* ── "The Flagship" — Split-world duality ── */
  'bilingual-ugc-creator': {
    heroVariant: 'split-world',
    introVariant: 'wide',
    deliverablesVariant: 'magazine',
    fitPanelVariant: 'split-diagonal',
    processVariant: 'scroll-track',
    featuredWorkVariant: 'asymmetric',
    ctaVariant: 'default',
    sectionOrder: [
      'hero',
      'featuredWork',
      'editorialIntro',
      'deliverables',
      'process',
      'fitPanel',
      'faq',
      'featuredWorkGrid',
      'ctaCloser',
      'related',
    ],
  },

  /* ── "The Stage" — Centered, vertical axis ── */
  'spokesperson-videos': {
    heroVariant: 'stage',
    introVariant: 'centered',
    deliverablesVariant: 'bento',
    fitPanelVariant: 'stacked',
    processVariant: 'centered-timeline',
    featuredWorkVariant: 'phone-frames',
    ctaVariant: 'personal',
    sectionOrder: [
      'hero',
      'editorialIntro',
      'featuredWork',
      'deliverables',
      'process',
      'fitPanel',
      'faq',
      'featuredWorkGrid',
      'ctaCloser',
      'related',
    ],
  },

  /* ── "The Lab" — Dashboard, performance-driven ── */
  'ugc-ads-tiktok-meta': {
    heroVariant: 'lab',
    introVariant: 'dark',
    deliverablesVariant: 'dashboard',
    fitPanelVariant: 'tabs',
    processVariant: 'row-blocks',
    featuredWorkVariant: 'strip',
    ctaVariant: 'teal-gradient',
    sectionOrder: [
      'hero',
      'deliverables',
      'featuredWork',
      'editorialIntro',
      'process',
      'fitPanel',
      'faq',
      'featuredWorkGrid',
      'ctaCloser',
      'related',
    ],
  },
};
