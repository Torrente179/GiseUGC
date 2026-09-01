import type { ServicePageContent } from '@/data/service-pages';
import type { SiteLocale } from '@/lib/locale-path';

export type InnerBeatId = 'ficha' | 'recibes' | 'como-corre' | 'encaja' | 'faq' | 'empezar';

export type InnerBeat = {
  id: InnerBeatId;
  num: string;
  kicker: string;
  chip: string;
  spine: string;
};

export type FichaRow = {
  key: 'what' | 'ask' | 'languages' | 'fits' | 'not';
  label: string;
  value: string;
};

const BEATS: Record<SiteLocale, InnerBeat[]> = {
  es: [
    { id: 'ficha', num: '1', kicker: 'Ficha', chip: 'Ficha', spine: 'Ficha' },
    { id: 'recibes', num: '2', kicker: 'Recibes', chip: 'Recibes', spine: 'Recibes' },
    { id: 'como-corre', num: '3', kicker: 'Cómo corre', chip: 'Cómo', spine: 'Cómo corre' },
    { id: 'encaja', num: '4', kicker: 'Encaja', chip: 'Encaja', spine: 'Encaja' },
    { id: 'faq', num: '5', kicker: 'Preguntas', chip: 'Preguntas', spine: 'Preguntas' },
    { id: 'empezar', num: '6', kicker: 'Empezar', chip: 'Empezar', spine: 'Empezar' },
  ],
  en: [
    { id: 'ficha', num: '1', kicker: 'Spec', chip: 'Spec', spine: 'Spec' },
    { id: 'recibes', num: '2', kicker: 'You get', chip: 'You get', spine: 'You get' },
    { id: 'como-corre', num: '3', kicker: 'How it runs', chip: 'How', spine: 'How it runs' },
    { id: 'encaja', num: '4', kicker: 'Fit', chip: 'Fit', spine: 'Fit' },
    { id: 'faq', num: '5', kicker: 'Questions', chip: 'Questions', spine: 'Questions' },
    { id: 'empezar', num: '6', kicker: 'Start', chip: 'Start', spine: 'Start' },
  ],
};

const FICHA_LABELS: Record<SiteLocale, Record<FichaRow['key'], string>> = {
  es: {
    what: 'Qué es',
    ask: 'Qué pides',
    languages: 'Idiomas',
    fits: 'Sirve si',
    not: 'No sirve si',
  },
  en: {
    what: 'What it is',
    ask: 'What you ask for',
    languages: 'Languages',
    fits: 'Fits if',
    not: 'Does not fit if',
  },
};

export const getInnerBeats = (locale: SiteLocale): InnerBeat[] => BEATS[locale];

export const getMobileChipBeats = (locale: SiteLocale): InnerBeat[] =>
  BEATS[locale].filter((beat) => beat.id !== 'empezar');

export const beatDomId = (id: InnerBeatId, variant: 'mobile' | 'desktop'): string =>
  variant === 'mobile' ? `${id}-m` : id;

/** Remap existing service-page fields into the locked ficha rows. Does not invent copy. */
export const buildServiceFicha = (page: ServicePageContent): FichaRow[] => {
  const labels = FICHA_LABELS[page.locale];
  return [
    { key: 'what', label: labels.what, value: page.sectionIntroText },
    { key: 'ask', label: labels.ask, value: page.deliverables.map((item) => item.title).join(', ') },
    { key: 'languages', label: labels.languages, value: page.marketItems.join(' ') },
    { key: 'fits', label: labels.fits, value: page.bestFitItems.join(' ') },
    { key: 'not', label: labels.not, value: page.notFitItems.join(' ') },
  ];
};

export const innerSectionSchema = (canonical: string, locale: SiteLocale) =>
  getInnerBeats(locale).map((beat) => ({
    '@type': 'WebPageElement' as const,
    name: `${beat.num} · ${beat.kicker}`,
    url: `${canonical}#${beat.id}`,
  }));
