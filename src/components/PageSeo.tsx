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

// JSON.stringify happily emits "</script>" if any value contains it, which
// would close the tag early and turn the rest of the graph into markup.
// Escaping the angle bracket keeps the payload inert and still valid JSON.
const serializeJsonLd = (data: Record<string, unknown>) =>
  JSON.stringify(data).replace(/</g, '\\u003c');

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

    // Structured data is rendered as JSX below rather than injected here.
    // A useEffect never runs during SSR, so schema created in this hook was
    // invisible to every non-rendering crawler — including the AI search
    // bots that read the initial HTML response and do not execute JS.
  }, [alternates.en, alternates.es, alternates.xDefault, canonical, description, locale, title]);

  // Rendering the graph in the component tree puts it in the prerendered
  // markup, so it ships in the static HTML *and* stays correct across
  // client-side route changes. Placement in <body> is intentional and matches
  // scripts/prerender.mjs, which already relocates head schema there.
  return structuredData ? (
    <script
      type="application/ld+json"
      data-route-schema=""
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
    />
  ) : null;
};

export default PageSeo;
