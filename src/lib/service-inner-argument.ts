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
    { id: 'ficha', num: '1', kicker: 'Resumen', chip: 'Resumen', spine: 'Resumen' },
    { id: 'recibes', num: '2', kicker: 'Formatos', chip: 'Formatos', spine: 'Formatos' },
    { id: 'como-corre', num: '3', kicker: 'Proceso', chip: 'Proceso', spine: 'Proceso' },
    { id: 'encaja', num: '4', kicker: 'Para quién', chip: 'Para quién', spine: 'Para quién' },
    { id: 'faq', num: '5', kicker: 'Preguntas', chip: 'Preguntas', spine: 'Preguntas' },
    { id: 'empezar', num: '6', kicker: 'Empezar', chip: 'Empezar', spine: 'Empezar' },
  ],
  en: [
    { id: 'ficha', num: '1', kicker: 'Overview', chip: 'Overview', spine: 'Overview' },
    { id: 'recibes', num: '2', kicker: 'Formats', chip: 'Formats', spine: 'Formats' },
    { id: 'como-corre', num: '3', kicker: 'Process', chip: 'Process', spine: 'Process' },
    { id: 'encaja', num: '4', kicker: 'Fit', chip: 'Fit', spine: 'Fit' },
    { id: 'faq', num: '5', kicker: 'Questions', chip: 'Questions', spine: 'Questions' },
    { id: 'empezar', num: '6', kicker: 'Get started', chip: 'Start', spine: 'Get started' },
  ],
};

const FICHA_LABELS: Record<SiteLocale, Record<FichaRow['key'], string>> = {
  es: {
    what: 'Qué es',
    ask: 'Qué puedes pedir',
    languages: 'Mercados',
    fits: 'Te conviene si',
    not: 'No te conviene si',
  },
  en: {
    what: 'What it is',
    ask: 'What you can request',
    languages: 'Markets',
    fits: 'For you if',
    not: 'Not for you if',
  },
};

/**
 * Mobile ficha. The desktop `buildServiceFicha` joins list fields into one
 * string per row, which on a phone renders as three paragraph blobs — the
 * single heaviest thing to read in the section. Here the lists stay lists, and
 * the fit rows are dropped because the Encaja beat already carries them in
 * full: the ficha was repeating that copy verbatim a screen earlier.
 */
export type MobileFichaRow = {
  key: 'ask' | 'markets';
  label: string;
  kind: 'chips' | 'lines';
  items: string[];
};

export type MobileFicha = {
  lead: string;
  rows: MobileFichaRow[];
};

const MOBILE_FICHA_LABELS: Record<SiteLocale, Record<MobileFichaRow['key'], string>> = {
  es: {
    ask: 'Qué puedes pedir',
    markets: 'Mercados y formatos',
  },
  en: {
    ask: 'What you can request',
    markets: 'Markets and formats',
  },
};

export const buildMobileFicha = (page: ServicePageContent): MobileFicha => {
  const labels = MOBILE_FICHA_LABELS[page.locale];
  return {
    lead: page.sectionIntroText,
    rows: [
      {
        key: 'ask',
        label: labels.ask,
        kind: 'chips',
        items: page.deliverables.map((item) => item.title),
      },
      { key: 'markets', label: labels.markets, kind: 'lines', items: page.marketItems },
    ],
  };
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
