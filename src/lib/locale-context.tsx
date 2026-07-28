import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type PropsWithChildren,
} from 'react';
import { useLocation } from 'react-router-dom';
import enTranslation from '@/locales/en/translation.json';
import esTranslation from '@/locales/es/translation.json';
import { getLocaleFromPath, type SiteLocale } from '@/lib/locale-path';

type TranslationOptions = {
  defaultValue?: string;
  returnObjects?: boolean;
  [key: string]: unknown;
};

type Translate = {
  (key: string, options: TranslationOptions & { returnObjects: true }): unknown;
  (key: string, options?: TranslationOptions): string;
};

const translations = {
  es: esTranslation,
  en: enTranslation,
} as const;

const resolvePath = (source: unknown, key: string): unknown =>
  key.split('.').reduce<unknown>((value, segment) => {
    if (!value || typeof value !== 'object') return undefined;
    return (value as Record<string, unknown>)[segment];
  }, source);

const interpolate = (template: string, options: TranslationOptions) =>
  template.replace(/\{\{\s*([\w-]+)\s*\}\}/gu, (match, name: string) => {
    const value = options[name];
    return value === undefined || value === null ? match : String(value);
  });

const LocaleContext = createContext<{ locale: SiteLocale; t: Translate } | null>(null);

export const LocaleProvider = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(() => {
    const dictionary = translations[locale];
    const t = ((key: string, options: TranslationOptions = {}) => {
      const resolved = resolvePath(dictionary, key);
      if (options.returnObjects && resolved !== undefined) return resolved;
      if (typeof resolved !== 'string') return options.defaultValue ?? key;
      return interpolate(resolved, options);
    }) as Translate;
    return { locale, t };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useTranslation = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useTranslation must be used within LocaleProvider');
  }
  return context;
};
