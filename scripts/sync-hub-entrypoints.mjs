/**
 * Writes the six hire-intent hub index shells.
 * All copy comes from src/data/hub-pages.ts (getHubPageContent), loaded through
 * scripts/lib/load-ts-module.mjs, so the shells cannot drift from the data
 * (also enforced in src/data/hub-pages.test.tsx).
 * PageSeo only updates <title>/meta in a useEffect, so crawlers read these
 * committed head tags — not the React tree — until prerender replaces #root.
 *
 * Idempotent. Runs in prebuild via `npm run hub:entrypoints`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadTsModule, rootDir } from './lib/load-ts-module.mjs';
import { entryFileForPath } from './lib/entry-html.mjs';

const { getHubPageContent } = await loadTsModule('src/data/hub-pages.ts');
const { getHubIdsInOrder, getHomePath } = await loadTsModule('src/lib/locale-path.ts');
const { CONTENT_DATES } = await loadTsModule('src/data/content-dates.ts');
const { FIVERR_AGGREGATE_RATING } = await loadTsModule('src/data/site-proof.ts');

const SITE = 'https://www.giselasaldarriaga.com';
const ogManifestPath = path.join(rootDir, 'src/data/og-image-manifest.json');
const ogManifest = fs.existsSync(ogManifestPath)
  ? JSON.parse(fs.readFileSync(ogManifestPath, 'utf8'))
  : {};
const ogImageUrl = (localePath) =>
  ogManifest[localePath]?.url ?? `${SITE}/og-image-es-en-20260219.jpg?v=20260219`;
const ENTITY = 'Gisela Saldarriaga';
const DATE_MODIFIED = CONTENT_DATES.hubs;

/** Shell chrome labels; mirror the `chrome` map in src/components/HubPage.tsx (UI labels, not page copy). */
const CHROME_LABELS = {
  es: { home: 'Inicio', alternate: 'English', links: 'Enlaces' },
  en: { home: 'Home', alternate: 'Español', links: 'Links' },
};

const hubs = getHubIdsInOrder().flatMap((hubId) =>
  ['es', 'en'].map((locale) => {
    const page = getHubPageContent(hubId, locale);
    const chrome = CHROME_LABELS[locale];
    return {
      file: entryFileForPath(page.path),
      locale,
      path: page.path,
      alternate: page.alternatePath,
      home: getHomePath(locale),
      homeLabel: chrome.home,
      alternateLabel: chrome.alternate,
      linksLabel: chrome.links,
      breadcrumbLabel: page.breadcrumbLabel,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      heroTitle: page.heroTitle,
      lead: page.lead,
      childrenTitle: page.childrenTitle,
      contactLabel: page.primaryCtaLabel,
      contact: page.primaryCtaHref,
      proof: page.proof,
      secondary: page.secondaryLinks.map((link) => [link.href, link.label]),
      children: page.children.map((child) => [child.href, child.title, child.blurb]),
    };
  }),
);

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

const renderInlineCopy = (value) =>
  escapeHtml(value).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');

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
      ...(hub.proof
        ? [
            {
              '@type': 'ProfessionalService',
              '@id': `${SITE}/#business`,
              name: 'Gisela Saldarriaga UGC Studio',
              url: `${SITE}/`,
              aggregateRating: FIVERR_AGGREGATE_RATING,
            },
          ]
        : []),
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
        let storedTheme = null;
        try { storedTheme = localStorage.getItem(storageKey); } catch (_) {}
        const activeTheme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'light';
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
    <meta property="og:image" content="${ogImageUrl(hub.path)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(hub.heroTitle)}" />
    <meta property="og:site_name" content="${ENTITY}" />
    <meta property="og:locale" content="${hub.locale === 'es' ? 'es_CO' : 'en_US'}" />
    <meta property="og:locale:alternate" content="${hub.locale === 'es' ? 'en_US' : 'es_CO'}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:title" content="${escapeHtml(hub.metaTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(hub.metaDescription)}" />
    <meta name="twitter:image" content="${ogImageUrl(hub.path)}" />
    <script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>
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
        <p>${renderInlineCopy(hub.lead)}</p>
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
