import type { SiteLocale } from '@/lib/locale-path';

export type KeynoteLabels = {
  processRail: string;
  formatsList: string;
  fitToggle: string;
  alsoOfferedCount: (current: number, total: number) => string;
  explorePages: (count: number) => string;
  featuredCounter: (index: number, total: number) => string;
  seeMoreAria: (title: string) => string;
  wantThisService: string;
};

const pad = (value: number) => String(value).padStart(2, '0');

export const KEYNOTE_LABELS: Record<SiteLocale, KeynoteLabels> = {
  es: {
    processRail: 'Pasos del proceso',
    formatsList: 'Formatos',
    fitToggle: '¿Es para ti?',
    alsoOfferedCount: (current, total) => `${pad(current)} / ${pad(total)}`,
    explorePages: (count) => `${count} páginas`,
    featuredCounter: (index, total) => `${pad(index)} / ${pad(total)}`,
    seeMoreAria: (title) => `Ver ${title}`,
    wantThisService: 'Quiero este servicio',
  },
  en: {
    processRail: 'Process steps',
    formatsList: 'Formats',
    fitToggle: 'Is this for you?',
    alsoOfferedCount: (current, total) => `${pad(current)} / ${pad(total)}`,
    explorePages: (count) => `${count} pages`,
    featuredCounter: (index, total) => `${pad(index)} / ${pad(total)}`,
    seeMoreAria: (title) => `View ${title}`,
    wantThisService: 'I want this service',
  },
};
