import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getHubPageRouteEntries,
  getResourceIdsInOrder,
  getResourcePath,
  getServiceIdsInOrder,
  getServicePath,
  getVerticalIdsInOrder,
  getVerticalPath,
  type HubPageId,
  type SiteLocale,
} from '../src/lib/locale-path.ts';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.giselasaldarriaga.com';

const HUB_LABEL: Record<HubPageId, Record<SiteLocale, string>> = {
  services: { es: 'Servicios', en: 'Services' },
  verticals: { es: 'Verticales', en: 'Verticals' },
  resources: { es: 'Recursos', en: 'Resources' },
};

const childHrefs = (hubId: HubPageId, locale: SiteLocale): string[] => {
  if (hubId === 'services') return getServiceIdsInOrder().map((id) => getServicePath(id, locale));
  if (hubId === 'verticals') return getVerticalIdsInOrder().map((id) => getVerticalPath(id, locale));
  return getResourceIdsInOrder().map((id) => getResourcePath(id, locale));
};

const escapeHtml = (value: string) =>
  value.replace(/&/gu, '&amp;').replace(/</gu, '&lt;').replace(/>/gu, '&gt;').replace(/"/gu, '&quot;');

const themeBootScript = `(function () {
        const root = document.documentElement;
        const storageKey = 'theme';
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        let storedTheme = null;

        try {
          storedTheme = localStorage.getItem(storageKey);
        } catch (_) {}

        const activeTheme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : systemTheme;
        const shouldUseDark = activeTheme === 'dark';

        root.classList.toggle('dark', shouldUseDark);
        root.style.colorScheme = activeTheme;
        if (themeColorMeta) {
          themeColorMeta.setAttribute('content', shouldUseDark ? '#0f121a' : '#fffefe');
        }
      })();`;

const renderHubHtml = ({
  locale,
  path: hubPath,
  alternatePath,
  hubId,
}: {
  locale: SiteLocale;
  path: string;
  alternatePath: string;
  hubId: HubPageId;
}) => {
  const canonical = `${SITE}${hubPath}`;
  const alternate = `${SITE}${alternatePath}`;
  const esCanonical = locale === 'es' ? canonical : alternate;
  const htmlLang = locale === 'es' ? 'es' : 'en';
  const ogLocale = locale === 'es' ? 'es_CO' : 'en_US';
  const ogLocaleAlt = locale === 'es' ? 'en_US' : 'es_CO';
  const title = 'Gisela Saldarriaga';
  const hubLabel = HUB_LABEL[hubId][locale];
  const homeHref = locale === 'es' ? '/' : '/en/';
  const homeLabel = locale === 'es' ? 'Inicio' : 'Home';
  const ctaHref = locale === 'es' ? '/#contact' : '/en/#contact';
  const ctaLabel = locale === 'es' ? 'Contáctame' : 'Hire me';
  const children = childHrefs(hubId, locale);
  const childList = children
    .map((href) => {
      const slug = href.replace(/\/$/u, '').split('/').pop() ?? href;
      return `            <li><a href="${escapeHtml(href)}">${escapeHtml(slug)}</a></li>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="${htmlLang}">
  <head>
    <script defer src="/gtm-loader.js"></script>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${title}" />
    <meta name="author" content="Gisela Saldarriaga" />
    <meta name="theme-color" content="#fffefe" />
    <script>
      ${themeBootScript}
    </script>
    <meta name="robots" content="index,follow" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" href="${esCanonical}" hreflang="es" />
    <link rel="alternate" href="${locale === 'es' ? alternate : canonical}" hreflang="en" />
    <link rel="alternate" href="${esCanonical}" hreflang="x-default" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${title}" />
    <meta property="og:image" content="https://www.giselasaldarriaga.com/og-image-es-en-20260219.jpg?v=20260219" />
    <meta property="og:site_name" content="Gisela Saldarriaga" />
    <meta property="og:locale" content="${ogLocale}" />
    <meta property="og:locale:alternate" content="${ogLocaleAlt}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${title}" />
    <meta name="twitter:image" content="https://www.giselasaldarriaga.com/og-image-es-en-20260219.jpg?v=20260219" />
    <link
      rel="preload"
      href="/fonts/dm-sans-latin-var.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
  </head>
  <body>
    <div id="root">
      <section>
        <nav aria-label="Breadcrumb">
          <a href="${homeHref}">${homeLabel}</a>
          <span>/</span>
          <span>${escapeHtml(hubLabel)}</span>
        </nav>
        <nav aria-label="${escapeHtml(hubLabel)}">
          <ul>
${childList}
          </ul>
        </nav>
        <p><a href="${ctaHref}">${escapeHtml(ctaLabel)}</a></p>
      </section>
    </div>
    <script type="module" src="/src/entry-hub.tsx"></script>
  </body>
</html>
`;
};

let written = 0;
for (const entry of getHubPageRouteEntries()) {
  const alternateLocale: SiteLocale = entry.locale === 'es' ? 'en' : 'es';
  const counterpart = getHubPageRouteEntries().find(
    (item) => item.hubId === entry.hubId && item.locale === alternateLocale,
  );
  if (!counterpart) throw new Error(`Missing ${alternateLocale} hub for ${entry.hubId}`);

  const relative = entry.path.replace(/^\/+|\/+$/gu, '');
  const filePath = path.join(projectRoot, relative, 'index.html');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const html = renderHubHtml({
    locale: entry.locale,
    path: entry.path,
    alternatePath: counterpart.path,
    hubId: entry.hubId,
  });
  fs.writeFileSync(filePath, html);
  written += 1;
}

console.log(`Wrote ${written} hub index entrypoint(s)`);
