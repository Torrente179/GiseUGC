import { useEffect } from 'react';

type AlternateLinks = {
  es: string;
  en: string;
  xDefault?: string;
};

type PageSeoProps = {
  title: string;
  description: string;
  canonical: string;
  locale: 'es' | 'en';
  alternates: AlternateLinks;
  structuredData?: Record<string, unknown>;
};

const OG_IMAGE = 'https://www.giselasaldarriaga.com/og-image-es-en-20260219.jpg?v=20260219';

const upsertMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const upsertLink = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
};

const PageSeo = ({ title, description, canonical, locale, alternates, structuredData }: PageSeoProps) => {
  useEffect(() => {
    document.title = title;
    document.documentElement.lang = locale;

    upsertMeta('meta[name="description"]', 'name', 'description', description);
    upsertMeta('meta[name="robots"]', 'name', 'robots', 'index,follow');

    upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', OG_IMAGE);
    upsertMeta('meta[property="og:image:url"]', 'property', 'og:image:url', OG_IMAGE);
    upsertMeta('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', OG_IMAGE);
    upsertMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', title);
    upsertMeta('meta[property="og:locale"]', 'property', 'og:locale', locale === 'es' ? 'es_CO' : 'en_US');
    upsertMeta(
      'meta[property="og:locale:alternate"]',
      'property',
      'og:locale:alternate',
      locale === 'es' ? 'en_US' : 'es_CO',
    );

    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonical);
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', OG_IMAGE);
    upsertMeta('meta[name="twitter:image:src"]', 'name', 'twitter:image:src', OG_IMAGE);
    upsertMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', title);

    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonical });
    upsertLink('link[rel="alternate"][hreflang="es"]', {
      rel: 'alternate',
      href: alternates.es,
      hreflang: 'es',
    });
    upsertLink('link[rel="alternate"][hreflang="en"]', {
      rel: 'alternate',
      href: alternates.en,
      hreflang: 'en',
    });
    upsertLink('link[rel="alternate"][hreflang="x-default"]', {
      rel: 'alternate',
      href: alternates.xDefault ?? alternates.es,
      hreflang: 'x-default',
    });

    if (structuredData) {
      let script = document.head.querySelector('#dynamic-route-schema') as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'dynamic-route-schema';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    return () => {
      const script = document.head.querySelector('#dynamic-route-schema');
      if (script) {
        script.remove();
      }
    };
  }, [alternates.en, alternates.es, alternates.xDefault, canonical, description, locale, structuredData, title]);

  return null;
};

export default PageSeo;
