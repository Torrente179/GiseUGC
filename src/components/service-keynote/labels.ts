import type { SiteLocale } from '@/lib/locale-path';

export type KeynoteLabels = {
  onThisPage: string;
  sectionsMenu: (current: string) => string;
  previousStep: string;
  nextStep: string;
  processRail: string;
  formatsList: string;
  fitToggle: string;
  alsoOfferedCount: (current: number, total: number) => string;
  explorePages: (count: number) => string;
  featuredCounter: (index: number, total: number) => string;
  seeMoreAria: (title: string) => string;
};

const pad = (value: number) => String(value).padStart(2, '0');

export const KEYNOTE_LABELS: Record<SiteLocale, KeynoteLabels> = {
  es: {
    onThisPage: 'En esta página',
    sectionsMenu: (current) => `Secciones, actual: ${current}`,
    previousStep: 'Paso anterior',
    nextStep: 'Siguiente paso',
    processRail: 'Pasos del proceso',
    formatsList: 'Formatos',
    fitToggle: '¿Es para ti?',
    alsoOfferedCount: (current, total) => `${pad(current)} / ${pad(total)}`,
    explorePages: (count) => `${count} páginas`,
    featuredCounter: (index, total) => `${pad(index)} / ${pad(total)}`,
    seeMoreAria: (title) => `Ver ${title}`,
  },
  en: {
    onThisPage: 'On this page',
    sectionsMenu: (current) => `Sections, current: ${current}`,
    previousStep: 'Previous step',
    nextStep: 'Next step',
    processRail: 'Process steps',
    formatsList: 'Formats',
    fitToggle: 'Is this for you?',
    alsoOfferedCount: (current, total) => `${pad(current)} / ${pad(total)}`,
    explorePages: (count) => `${count} pages`,
    featuredCounter: (index, total) => `${pad(index)} / ${pad(total)}`,
    seeMoreAria: (title) => `View ${title}`,
  },
};
