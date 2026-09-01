/**
 * Writes the six hire-intent hub index shells.
 * Copy must stay in lockstep with src/data/hub-pages.ts (enforced in tests).
 * PageSeo only updates <title>/meta in a useEffect, so crawlers read these
 * committed head tags — not the React tree — until prerender replaces #root.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.giselasaldarriaga.com';
const ENTITY = 'Gisela Saldarriaga';
const datesSource = fs.readFileSync(path.join(rootDir, 'src/data/content-dates.ts'), 'utf8');
const DATE_MODIFIED = datesSource.match(/hubs: '(\d{4}-\d{2}-\d{2})'/u)?.[1];
if (!DATE_MODIFIED) throw new Error('Unable to read CONTENT_DATES.hubs');
const FIVERR = 'https://www.fiverr.com/gisela_sm';

const hubs = [
  {
    file: 'servicios/index.html',
    locale: 'es',
    path: '/servicios/',
    alternate: '/en/services/',
    home: '/',
    homeLabel: 'Inicio',
    alternateLabel: 'English',
    linksLabel: 'Enlaces',
    breadcrumbLabel: 'Servicios',
    metaTitle: 'Contrata creadora UGC bilingüe ES+EN | Gisela Saldarriaga',
    metaDescription:
      'Contrata a Gisela Saldarriaga: ads UGC, demos y portavoz en español e inglés. Producción en Medellín para US hispano, España, LatAm y briefs en inglés.',
    heroTitle: 'Contrata a Gisela Saldarriaga como tu creadora UGC bilingüe',
    lead:
      'Si tu marca necesita una creadora UGC bilingüe, no una agencia: ads, demos, reseñas y videos de portavoz en español e inglés, entregados a ti. Produzco desde Medellín para equipos en el mercado hispano de Estados Unidos, España y LatAm, y para briefs en inglés. El contenido es de la marca. No lo publico en mis redes, salvo un acuerdo de ambassador.',
    childrenTitle: 'Qué puedes contratar',
    contactLabel: 'Contáctame',
    contact: '/#contact',
    proof: `Llevo 28+ campañas de marca en beauty, moda, tech y lifestyle. Gisela Saldarriaga trabaja en Fiverr como [gisela_sm](${FIVERR}): 4.8/5 en 173 reseñas verificadas.`,
    secondary: [
      ['/verticales/', 'UGC por industria'],
      ['/recursos/', 'Guías para contratar'],
    ],
    children: [
      ['/servicios/creadora-ugc-bilingue/', 'Creadora UGC bilingüe', 'Una misma cara en español e inglés, sin partir el lote entre dos perfiles.'],
      ['/servicios/ugc-ads-tiktok-meta/', 'UGC Ads para TikTok y Meta', 'Creativos para pauta: hooks, beneficio y CTA listos para testear, no un video hero.'],
      ['/servicios/videos-de-portavoz/', 'Videos de portavoz', 'Cara y voz a cámara cuando la oferta necesita explicarse, no solo verse.'],
      ['/servicios/testimoniales-resenas-ugc/', 'Testimoniales y reseñas UGC', 'Social proof en video para ads, páginas de producto y retargeting.'],
      ['/servicios/demo-producto-ugc/', 'Demo de producto UGC', 'How-to y demos para que el producto se entienda rápido y se compre con menos dudas.'],
      ['/servicios/ugc-problema-solucion/', 'UGC problema-solución', 'El formato que arranca en el dolor y aterriza el producto como solución.'],
      ['/servicios/ugc-lifestyle/', 'UGC lifestyle', 'Piezas que se sienten nativas en el feed de tu marca, no en un set.'],
      ['/servicios/b-roll-footage-ugc/', 'B-roll y footage UGC', 'Tomas de producto y escenas sin voiceover para que tu equipo edite.'],
    ],
  },
  {
    file: 'en/services/index.html',
    locale: 'en',
    path: '/en/services/',
    alternate: '/servicios/',
    home: '/en/',
    homeLabel: 'Home',
    alternateLabel: 'Español',
    linksLabel: 'Links',
    breadcrumbLabel: 'Services',
    metaTitle: 'Hire a bilingual UGC creator, ES+EN | Gisela Saldarriaga',
    metaDescription:
      'Hire Gisela Saldarriaga for bilingual UGC ads, demos, and spokesperson videos. Produced in Medellín for US Hispanic, Spain, LatAm, and English briefs.',
    heroTitle: 'Hire Gisela Saldarriaga as your bilingual UGC creator',
    lead:
      'If you need a named bilingual UGC creator, not an agency: ads, demos, reviews, and spokesperson videos in Spanish and English, delivered to your brand. I produce from Medellín for teams selling to US Hispanic audiences, Spain, and LatAm, plus English briefs. The content belongs to the brand. I don’t post client work on my socials unless we agree on an ambassador deal.',
    childrenTitle: 'What you can hire',
    contactLabel: 'Contact me',
    contact: '/en/#contact',
    proof: `I’ve run 28+ brand campaigns in beauty, fashion, tech, and lifestyle. Gisela Saldarriaga works on Fiverr as [gisela_sm](${FIVERR}): 4.8/5 from 173 verified reviews.`,
    secondary: [
      ['/en/verticals/', 'UGC by industry'],
      ['/en/resources/', 'Guides to hire'],
    ],
    children: [
      ['/en/services/bilingual-ugc-creator/', 'Bilingual UGC creator', 'One face in Spanish and English, without splitting the batch across two profiles.'],
      ['/en/services/ugc-ads-tiktok-meta/', 'UGC Ads for TikTok and Meta', 'Paid creatives: hooks, benefit, and CTA ready to test, not a hero video.'],
      ['/en/services/spokesperson-videos/', 'Spokesperson videos', 'Face and voice on camera when the offer needs to be explained, not just seen.'],
      ['/en/services/ugc-testimonials-reviews/', 'UGC testimonials and reviews', 'Video social proof for ads, product pages, and retargeting.'],
      ['/en/services/ugc-product-demo/', 'UGC product demo', 'How-tos and demos so the product is understood quickly and bought with fewer doubts.'],
      ['/en/services/ugc-problem-solution/', 'Problem-solution UGC', 'The format that starts in the pain and lands the product as the solution.'],
      ['/en/services/lifestyle-ugc-organic-content/', 'Lifestyle UGC', 'Pieces that feel native in your brand’s feed, not on a set.'],
      ['/en/services/ugc-b-roll-footage/', 'UGC b-roll and footage', 'Product shots and scenes without voiceover so your team can edit.'],
    ],
  },
  {
    file: 'verticales/index.html',
    locale: 'es',
    path: '/verticales/',
    alternate: '/en/verticals/',
    home: '/',
    homeLabel: 'Inicio',
    alternateLabel: 'English',
    linksLabel: 'Enlaces',
    breadcrumbLabel: 'Verticales',
    metaTitle: 'Contrata UGC de beauty y ecommerce | Gisela Saldarriaga',
    metaDescription:
      'Contrata a Gisela Saldarriaga para UGC de beauty, ecommerce, moda, tech y bienestar. Creadora bilingüe en Medellín para marcas en US hispano, España y LatAm.',
    heroTitle: 'Contrata UGC por industria: beauty, ecommerce, moda, tech y bienestar',
    lead:
      'Si tu marca necesita una creadora UGC bilingüe por industria, no una agencia, empieza aquí. Produzco desde Medellín para equipos de beauty, ecommerce, moda, tech/SaaS y bienestar que venden en el mercado hispano de Estados Unidos, España, LatAm, o con un brief en inglés. El contenido se entrega a la marca.',
    childrenTitle: 'Por industria',
    contactLabel: 'Contáctame',
    contact: '/#contact',
    secondary: [
      ['/servicios/', 'Qué puedes contratar'],
      ['/recursos/', 'Guías para contratar'],
    ],
    children: [
      ['/verticales/ugc-beauty/', 'UGC para beauty', 'Skincare, maquillaje y cuidado personal con producto en uso real, para ads y páginas de producto.'],
      ['/verticales/ugc-ecommerce/', 'UGC para ecommerce', 'Persona real mostrando el producto para DTC, tienda online y páginas de conversión.'],
      ['/verticales/ugc-moda/', 'UGC para moda', 'Prendas en cuerpo real, con estilo cotidiano. No es un editorial de estudio.'],
      ['/verticales/ugc-tech-saas/', 'UGC para tech y SaaS', 'Software, apps y servicios explicados en claro, sin demo corporativa.'],
      ['/verticales/ugc-lifestyle-bienestar/', 'UGC para lifestyle y bienestar', 'Rutina, wellness y producto en un día real, con tono cercano frente a cámara.'],
    ],
  },
  {
    file: 'en/verticals/index.html',
    locale: 'en',
    path: '/en/verticals/',
    alternate: '/verticales/',
    home: '/en/',
    homeLabel: 'Home',
    alternateLabel: 'Español',
    linksLabel: 'Links',
    breadcrumbLabel: 'Verticals',
    metaTitle: 'Hire beauty and ecommerce UGC creator | Gisela Saldarriaga',
    metaDescription:
      'Hire Gisela Saldarriaga for beauty, ecommerce, fashion, tech, and wellness UGC. Bilingual creator in Medellín for US Hispanic, Spain, LatAm, and English briefs.',
    heroTitle: 'Hire a UGC creator by industry: beauty, ecommerce, fashion, tech, wellness',
    lead:
      'If your brand needs a bilingual UGC creator by industry, not an agency, start here. I produce from Medellín for beauty, ecommerce, fashion, tech/SaaS, and wellness teams selling to US Hispanic audiences, Spain, LatAm, or with an English brief. The content is delivered to the brand.',
    childrenTitle: 'By industry',
    contactLabel: 'Contact me',
    contact: '/en/#contact',
    secondary: [
      ['/en/services/', 'What you can hire'],
      ['/en/resources/', 'Guides to hire'],
    ],
    children: [
      ['/en/verticals/beauty-ugc-creator/', 'Beauty UGC', 'Skincare, makeup, and personal care with the product on real skin, for ads and product pages.'],
      ['/en/verticals/ecommerce-ugc-creator/', 'Ecommerce UGC', 'A real person on camera for DTC, online stores, and conversion pages.'],
      ['/en/verticals/fashion-ugc-creator/', 'Fashion UGC', 'Clothes on a real body, everyday style. Not a studio editorial.'],
      ['/en/verticals/tech-saas-ugc-creator/', 'Tech and SaaS UGC', 'Software, apps, and services explained clearly, without a corporate demo feel.'],
      ['/en/verticals/lifestyle-wellness-ugc-creator/', 'Lifestyle and wellness UGC', 'Routine, wellness, and product in a real day, spoken like a real person on camera.'],
    ],
  },
  {
    file: 'recursos/index.html',
    locale: 'es',
    path: '/recursos/',
    alternate: '/en/resources/',
    home: '/',
    homeLabel: 'Inicio',
    alternateLabel: 'English',
    linksLabel: 'Enlaces',
    breadcrumbLabel: 'Recursos',
    metaTitle: 'Cómo contratar creadora UGC bilingüe | Gisela Saldarriaga',
    metaDescription:
      'Guías para contratar una creadora UGC bilingüe: brief, formatos de ads y UGC vs influencer. Para marcas en US hispano, España y LatAm que van a producir.',
    heroTitle: 'Cómo contratar una creadora UGC bilingüe: guías para marcas',
    lead:
      'Estas cuatro guías son para equipos que van a contratar una creadora UGC, no para armar una agencia. Sirven si vendes al mercado hispano de Estados Unidos, a España o a LatAm, o si el brief va en inglés. Empieza por cómo contratar; el resto aclara formatos, la diferencia con influencer y qué es UGC.',
    childrenTitle: 'Guías para marcas',
    contactLabel: 'Contáctame',
    contact: '/#contact',
    secondary: [
      ['/servicios/', 'Qué puedes contratar'],
      ['/verticales/', 'UGC por industria'],
    ],
    children: [
      ['/recursos/como-contratar-creadora-ugc/', 'Cómo contratar creadora UGC', 'El proceso, el brief y qué pedir antes de firmar con una creadora.'],
      ['/recursos/formatos-ugc-ads/', 'Formatos de UGC para ads', 'Qué formato pedir (testimonial, demo, problema-solución, portavoz) según el objetivo de pauta.'],
      ['/recursos/ugc-vs-influencer-marketing/', 'UGC vs influencer marketing', 'Por qué contratar creadora (contenido para tu marca) no es comprar un post en redes ajenas.'],
      ['/recursos/que-es-ugc/', 'Qué es UGC', 'La base, en claro, para equipos que van a producir y pautar.'],
    ],
  },
  {
    file: 'en/resources/index.html',
    locale: 'en',
    path: '/en/resources/',
    alternate: '/recursos/',
    home: '/en/',
    homeLabel: 'Home',
    alternateLabel: 'Español',
    linksLabel: 'Links',
    breadcrumbLabel: 'Resources',
    metaTitle: 'How to hire a bilingual UGC creator | Gisela Saldarriaga',
    metaDescription:
      'Guides to hire a bilingual UGC creator: brief, ad formats, and UGC vs influencer. For US Hispanic, Spain, and LatAm brands ready to produce, not an agency.',
    heroTitle: 'How to hire a bilingual UGC creator: guides for brand teams',
    lead:
      'These four guides are for teams hiring a UGC creator, not building an agency. They help if you sell to US Hispanic audiences, Spain, or LatAm, or if the brief is in English. Start with how to hire; the rest covers ad formats, UGC vs influencer, and what UGC actually is.',
    childrenTitle: 'Guides for brand teams',
    contactLabel: 'Contact me',
    contact: '/en/#contact',
    secondary: [
      ['/en/services/', 'What you can hire'],
      ['/en/verticals/', 'UGC by industry'],
    ],
    children: [
      ['/en/resources/how-to-hire-ugc-creator/', 'How to hire a UGC creator', 'The process, the brief, and what to ask before you book a creator.'],
      ['/en/resources/ugc-ad-formats-guide/', 'UGC ad formats guide', 'Which format to request (testimonial, demo, problem-solution, spokesperson) for the paid-social job.'],
      ['/en/resources/ugc-vs-influencer-marketing/', 'UGC vs influencer marketing', 'Why hiring a creator (content for your brand) is not buying a post on someone else’s feed.'],
      ['/en/resources/what-is-ugc/', 'What is UGC', 'The basics, in plain language, for teams about to produce and run ads.'],
    ],
  },
];

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const renderChildren = (hub) =>
  hub.children
    .map(([href, title, blurb]) => {
      const blurbHtml = blurb ? `\n                <p>${escapeHtml(blurb)}</p>` : '';
      return `            <li>
              <a href="${escapeHtml(href)}">${escapeHtml(title)}</a>${blurbHtml}
            </li>`;
    })
    .join('\n');

const renderSecondary = (hub) =>
  hub.secondary
    .map(([href, label], index) => `${index > 0 ? ' · ' : ''}<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`)
    .join('');

const renderHub = (hub) => {
  const canonical = `${SITE}${hub.path}`;
  const esUrl = `${SITE}${hub.locale === 'es' ? hub.path : hub.alternate}`;
  const enUrl = `${SITE}${hub.locale === 'en' ? hub.path : hub.alternate}`;
  const homeUrl = `${SITE}${hub.home}`;
  const proofHtml = hub.proof
    ? `\n        <p>${escapeHtml(hub.proof).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')}</p>`
    : '';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: hub.metaTitle,
        description: hub.metaDescription,
        dateModified: DATE_MODIFIED,
        inLanguage: hub.locale,
        isPartOf: { '@id': `${homeUrl}#website` },
        breadcrumb: { '@id': `${canonical}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: hub.homeLabel, item: homeUrl },
          { '@type': 'ListItem', position: 2, name: hub.breadcrumbLabel, item: canonical },
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
    <title>${escapeHtml(hub.metaTitle)}</title>
    <meta name="description" content="${escapeHtml(hub.metaDescription)}" />
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
    <meta property="og:title" content="${escapeHtml(hub.metaTitle)}" />
    <meta property="og:description" content="${escapeHtml(hub.metaDescription)}" />
    <meta property="og:image" content="${SITE}/og-image-es-en-20260219.jpg?v=20260219" />
    <meta property="og:site_name" content="${ENTITY}" />
    <meta property="og:locale" content="${hub.locale === 'es' ? 'es_CO' : 'en_US'}" />
    <meta property="og:locale:alternate" content="${hub.locale === 'es' ? 'en_US' : 'es_CO'}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:title" content="${escapeHtml(hub.metaTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(hub.metaDescription)}" />
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
        <h1>${escapeHtml(hub.heroTitle)}</h1>
        <p>${escapeHtml(hub.lead)}</p>
        <section>
          <h2>${escapeHtml(hub.childrenTitle)}</h2>
          <nav aria-label="${escapeHtml(hub.linksLabel)}">
          <ul>
${renderChildren(hub)}
          </ul>
          </nav>
        </section>${proofHtml}
        <p><a href="${escapeHtml(hub.contact)}">${escapeHtml(hub.contactLabel)}</a></p>
        <p>${renderSecondary(hub)}</p>
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
