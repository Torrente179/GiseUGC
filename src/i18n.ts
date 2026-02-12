import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import esTranslation from '@/locales/es/translation.json';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'es'],
    fallbackLng: 'es',
    partialBundledLanguages: true,
    resources: {
      es: { translation: esTranslation },
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    debug: import.meta.env.DEV,
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
      cookieOptions: { path: '/', sameSite: 'strict' },
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
