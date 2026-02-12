import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from '@/locales/en/translation.json';
import esTranslation from '@/locales/es/translation.json';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    supportedLngs: ['en', 'es'],
    fallbackLng: 'es', // Default to Spanish
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation },
    },
    debug: import.meta.env.DEV, // Enable debug output in development
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
      cookieOptions: { path: '/', sameSite: 'strict' },
    },
    react: {
      useSuspense: false, // Keep false for simplicity for now
    },
  });

export default i18n;
