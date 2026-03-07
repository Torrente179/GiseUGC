import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from '@/locales/en/translation.json';
import esTranslation from '@/locales/es/translation.json';

const syncDocumentLanguage = (lng?: string) => {
  if (typeof document === 'undefined' || !lng) return;
  document.documentElement.lang = lng;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'es'],
    fallbackLng: 'es',
    resources: {
      es: { translation: esTranslation },
      en: { translation: enTranslation },
    },
    debug: import.meta.env.DEV,
    detection: {
      order: ['path', 'htmlTag'],
      lookupFromPathIndex: 0,
      caches: [],
    },
    react: {
      useSuspense: false,
    },
  });

i18n.on('languageChanged', syncDocumentLanguage);
syncDocumentLanguage(i18n.resolvedLanguage ?? i18n.language);

export default i18n;
