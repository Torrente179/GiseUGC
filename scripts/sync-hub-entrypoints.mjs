/**
 * Writes the six empty-but-valid hub index shells.
 * Child hrefs/labels must match src/data/hub-child-links.ts.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.giselasaldarriaga.com';
const ENTITY = 'Gisela Saldarriaga';

const hubs = [
  {
    file: 'servicios/index.html',
    locale: 'es',
    path: '/servicios/',
    alternate: '/en/services/',
    home: '/',
    contact: '/#contact',
    contactLabel: 'Contacto',
    homeLabel: 'Inicio',
    alternateLabel: 'English',
    linksLabel: 'Enlaces',
    children: [
      ['/servicios/creadora-ugc-bilingue/', 'Creadora UGC bilingüe'],
      ['/servicios/videos-de-portavoz/', 'Videos de portavoz'],
      ['/servicios/ugc-ads-tiktok-meta/', 'UGC Ads para TikTok y Meta'],
      ['/servicios/testimoniales-resenas-ugc/', 'Testimoniales y reseñas UGC'],
      ['/servicios/demo-producto-ugc/', 'Demos de producto UGC'],
      ['/servicios/ugc-problema-solucion/', 'UGC problema-solución'],
      ['/servicios/ugc-lifestyle/', 'UGC lifestyle'],
      ['/servicios/b-roll-footage-ugc/', 'B-roll UGC'],
    ],
  },
  {
    file: 'en/services/index.html',
    locale: 'en',
    path: '/en/services/',
    alternate: '/servicios/',
    home: '/en/',
    contact: '/en/#contact',
    contactLabel: 'Contact',
    homeLabel: 'Home',
    alternateLabel: 'Español',
    linksLabel: 'Links',
    children: [
      ['/en/services/bilingual-ugc-creator/', 'Bilingual UGC creator'],
      ['/en/services/spokesperson-videos/', 'Spokesperson videos'],
      ['/en/services/ugc-ads-tiktok-meta/', 'UGC ads for TikTok and Meta'],
      ['/en/services/ugc-testimonials-reviews/', 'UGC testimonials and reviews'],
      ['/en/services/ugc-product-demo/', 'UGC product demos'],
      ['/en/services/ugc-problem-solution/', 'Problem-solution UGC'],
      ['/en/services/lifestyle-ugc-organic-content/', 'Lifestyle UGC'],
      ['/en/services/ugc-b-roll-footage/', 'UGC b-roll'],
    ],
  },
  {
    file: 'verticales/index.html',
    locale: 'es',
    path: '/verticales/',
    alternate: '/en/verticals/',
    home: '/',
    contact: '/#contact',
    contactLabel: 'Contacto',
    homeLabel: 'Inicio',
    alternateLabel: 'English',
    linksLabel: 'Enlaces',
    children: [
      ['/verticales/ugc-beauty/', 'UGC para beauty'],
      ['/verticales/ugc-moda/', 'UGC para moda'],
      ['/verticales/ugc-tech-saas/', 'UGC para tech y SaaS'],
      ['/verticales/ugc-ecommerce/', 'UGC para ecommerce'],
      ['/verticales/ugc-lifestyle-bienestar/', 'UGC lifestyle y bienestar'],
    ],
  },
  {
    file: 'en/verticals/index.html',
    locale: 'en',
    path: '/en/verticals/',
    alternate: '/verticales/',
    home: '/en/',
    contact: '/en/#contact',
    contactLabel: 'Contact',
    homeLabel: 'Home',
    alternateLabel: 'Español',
    linksLabel: 'Links',
    children: [
      ['/en/verticals/beauty-ugc-creator/', 'Beauty UGC'],
      ['/en/verticals/fashion-ugc-creator/', 'Fashion UGC'],
      ['/en/verticals/tech-saas-ugc-creator/', 'Tech and SaaS UGC'],
      ['/en/verticals/ecommerce-ugc-creator/', 'Ecommerce UGC'],
      ['/en/verticals/lifestyle-wellness-ugc-creator/', 'Lifestyle and wellness UGC'],
    ],
  },
  {
    file: 'recursos/index.html',
    locale: 'es',
    path: '/recursos/',
    alternate: '/en/resources/',
    home: '/',
    contact: '/#contact',
    contactLabel: 'Contacto',
    homeLabel: 'Inicio',
    alternateLabel: 'English',
    linksLabel: 'Enlaces',
    children: [
      ['/recursos/que-es-ugc/', 'Qué es UGC'],
      ['/recursos/como-contratar-creadora-ugc/', 'Cómo contratar creadora UGC'],
      ['/recursos/ugc-vs-influencer-marketing/', 'UGC vs influencer marketing'],
      ['/recursos/formatos-ugc-ads/', 'Formatos de UGC para ads'],
    ],
  },
  {
    file: 'en/resources/index.html',
    locale: 'en',
    path: '/en/resources/',
    alternate: '/recursos/',
    home: '/en/',
    contact: '/en/#contact',
    contactLabel: 'Contact',
    homeLabel: 'Home',
    alternateLabel: 'Español',
    linksLabel: 'Links',
    children: [
      ['/en/resources/what-is-ugc/', 'What is UGC'],
      ['/en/resources/how-to-hire-ugc-creator/', 'How to hire a UGC creator'],
      ['/en/resources/ugc-vs-influencer-marketing/', 'UGC vs influencer marketing'],
      ['/en/resources/ugc-ad-formats-guide/', 'UGC ad formats guide'],
    ],
  },
];

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const renderHub = (hub) => {
  const canonical = `${SITE}${hub.path}`;
  const esUrl = `${SITE}${hub.locale === 'es' ? hub.path : hub.alternate}`;
  const enUrl = `${SITE}${hub.locale === 'en' ? hub.path : hub.alternate}`;
  const homeUrl = `${SITE}${hub.home}`;
  const childItems = hub.children
    .map(
      ([href, label]) =>
        `            <li><a href="${escapeHtml(href)}">${escapeHtml(label)}</a></li>`,
    )
    .join('\n');
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: ENTITY,
        dateModified: '2026-08-31',
        inLanguage: hub.locale,
        isPartOf: { '@id': `${homeUrl}#website` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: hub.homeLabel, item: homeUrl },
          { '@type': 'ListItem', position: 2, name: ENTITY, item: canonical },
        ],
      },
    ],
  };

  return `<!DOCTYPE html>
<html lang="${hub.locale}">
  <head>
    <script defer src="/gtm-loader.js"></script>
<meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${ENTITY}</title>
    <meta name="description" content="${ENTITY}" />
    <meta name="author" content="${ENTITY}" />
    <meta name="theme-color" content="#fffefe" />
    <script>
      (function () {
        const root = document.documentElement;
        const storageKey = 'theme';
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        let storedTheme = null;
        try { storedTheme = localStorage.getItem(storageKey); } catch (_) {}
        const activeTheme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : systemTheme;
        const shouldUseDark = activeTheme === 'dark';
        root.classList.toggle('dark', shouldUseDark);
        root.style.colorScheme = activeTheme;
        if (themeColorMeta) { themeColorMeta.setAttribute('content', shouldUseDark ? '#0f121a' : '#fffefe'); }
      })();
    </script>
    <meta name="robots" content="index,follow" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" href="${esUrl}" hreflang="es" />
    <link rel="alternate" href="${enUrl}" hreflang="en" />
    <link rel="alternate" href="${esUrl}" hreflang="x-default" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${ENTITY}" />
    <meta property="og:description" content="${ENTITY}" />
    <meta property="og:image" content="${SITE}/og-image-es-en-20260219.jpg?v=20260219" />
    <meta property="og:site_name" content="${ENTITY}" />
    <meta property="og:locale" content="${hub.locale === 'es' ? 'es_CO' : 'en_US'}" />
    <meta property="og:locale:alternate" content="${hub.locale === 'es' ? 'en_US' : 'es_CO'}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:title" content="${ENTITY}" />
    <meta name="twitter:description" content="${ENTITY}" />
    <meta name="twitter:image" content="${SITE}/og-image-es-en-20260219.jpg?v=20260219" />
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
    <link
      rel="preload"
      href="/fonts/dm-sans-latin-var.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
  </head>
  <body>
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TX2WCCLT" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <div id="root">
      <main>
        <nav aria-label="${escapeHtml(hub.linksLabel)}">
          <ul>
${childItems}
          </ul>
        </nav>
        <p><a href="${escapeHtml(hub.contact)}">${escapeHtml(hub.contactLabel)}</a></p>
        <p><a href="${escapeHtml(hub.home)}">${escapeHtml(hub.homeLabel)}</a> · <a href="${escapeHtml(hub.alternate)}">${escapeHtml(hub.alternateLabel)}</a></p>
      </main>
    </div>
    <script type="module" src="/src/entry-hub.tsx"></script>
  </body>
</html>
`;
};

for (const hub of hubs) {
  const filePath = path.join(rootDir, hub.file);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, renderHub(hub));
}

console.log(`Wrote ${hubs.length} hub entrypoint shells`);
