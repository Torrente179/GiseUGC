import esTranslation from '@/locales/es/translation.json';
import enTranslation from '@/locales/en/translation.json';
import { FIVERR_PRICING } from '@/data/resource-pages';
import { getResourcePath, type SiteLocale } from '@/lib/locale-path';
import { visibleInlineCopy } from '@/lib/inline-copy-links';

export type HomepageFaqItem = {
  question: string;
  answer: string;
};

const usd = (amount: number) => `$${amount}`;

export const HOMEPAGE_FAQ_PROCESS_QUESTION = {
  es: '¿Cómo es el proceso?',
  en: 'How does the process work?',
} as const;

export const HOMEPAGE_FAQ_COST_QUESTION = {
  es: '¿Cuánto cuesta?',
  en: 'How much does it cost?',
} as const;

/**
 * Sentences appended to the existing homepage FAQ answers.
 * Prices read from FIVERR_PRICING; paths from getResourcePath.
 */
export const HOMEPAGE_FAQ_GUIDE_SENTENCES = {
  es: {
    process: `Si es tu primera vez, lee mi guía sobre [cómo contratar una creadora UGC](${getResourcePath('how-to-hire-ugc-creator', 'es')}).`,
    cost: `Mis paquetes UGC en Fiverr empiezan en ${usd(FIVERR_PRICING.ugc.basic.price)}. Mis precios publicados en Fiverr están en [cuánto cobra una creadora UGC](${getResourcePath('how-much-ugc-creator-charge', 'es')}).`,
  },
  en: {
    process: `If it's your first time, read my guide on [how to hire a UGC creator](${getResourcePath('how-to-hire-ugc-creator', 'en')}).`,
    cost: `My UGC packages on Fiverr start at ${usd(FIVERR_PRICING.ugc.basic.price)}. My published Fiverr prices are in [how much a UGC creator charges](${getResourcePath('how-much-ugc-creator-charge', 'en')}).`,
  },
} as const;

const BASE_ITEMS: Record<SiteLocale, HomepageFaqItem[]> = {
  es: esTranslation.faq.items as HomepageFaqItem[],
  en: enTranslation.faq.items as HomepageFaqItem[],
};

const withGuideSentences = (locale: SiteLocale, items: HomepageFaqItem[]): HomepageFaqItem[] =>
  items.map((item) => {
    if (item.question === HOMEPAGE_FAQ_PROCESS_QUESTION[locale]) {
      return { ...item, answer: `${item.answer} ${HOMEPAGE_FAQ_GUIDE_SENTENCES[locale].process}` };
    }
    if (item.question === HOMEPAGE_FAQ_COST_QUESTION[locale]) {
      return { ...item, answer: `${item.answer} ${HOMEPAGE_FAQ_GUIDE_SENTENCES[locale].cost}` };
    }
    return item;
  });

export const getHomepageFaqItems = (locale: SiteLocale): HomepageFaqItem[] =>
  withGuideSentences(locale, BASE_ITEMS[locale]);

/**
 * Homepage FAQPage has historically been a subset of the visible FAQ.
 * Keep that set, add the two cost questions, and generate answers from the
 * same items the FAQ section renders so schema and visible text cannot drift.
 */
export const HOMEPAGE_FAQ_SCHEMA_QUESTIONS: Record<SiteLocale, readonly string[]> = {
  es: [
    '¿Qué es el UGC y cómo puede ayudar a mi marca?',
    '¿Qué tipos de videos haces?',
    '¿Cómo es el proceso?',
    '¿Cuánto cuesta?',
    '¿Con qué marcas sueles trabajar?',
    '¿Cuánto tardas en entregar?',
    '¿En qué idiomas trabajas?',
  ],
  en: [
    'What is UGC and how can it help my brand?',
    'What kinds of videos do you make?',
    'How does the process work?',
    'How much does it cost?',
    'What kinds of brands do you usually work with?',
    'How long does delivery take?',
    'What languages do you work in?',
  ],
};

export const getHomepageFaqSchemaItems = (locale: SiteLocale): HomepageFaqItem[] => {
  const byQuestion = new Map(getHomepageFaqItems(locale).map((item) => [item.question, item]));
  return HOMEPAGE_FAQ_SCHEMA_QUESTIONS[locale].map((question) => {
    const item = byQuestion.get(question);
    if (!item) {
      throw new Error(`Homepage FAQ schema question missing from visible items: ${question}`);
    }
    return item;
  });
};

export const buildHomepageFaqPage = (locale: SiteLocale, canonical: string) => ({
  '@type': 'FAQPage' as const,
  '@id': `${canonical}#faq`,
  url: `${canonical}#faq`,
  inLanguage: locale,
  mainEntity: getHomepageFaqSchemaItems(locale).map((item) => ({
    '@type': 'Question' as const,
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer' as const,
      text: visibleInlineCopy(item.answer),
    },
  })),
});

export const buildHomepageFaqGraph = (locale: SiteLocale, canonical: string) => ({
  '@context': 'https://schema.org',
  '@graph': [buildHomepageFaqPage(locale, canonical)],
});
