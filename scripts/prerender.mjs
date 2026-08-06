import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import Beasties from 'beasties';
import { JSDOM } from 'jsdom';

const projectRoot = process.cwd();
const serverEntry = path.join(projectRoot, 'dist-ssr', 'entry-server.js');
const { render } = await import(pathToFileURL(serverEntry).href);

const collectHtmlFiles = async (directory, files = []) => {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectHtmlFiles(entryPath, files);
    if (entry.isFile() && entry.name === 'index.html') files.push(entryPath);
  }
  return files;
};

const distRoot = path.join(projectRoot, 'dist');
const htmlFiles = await collectHtmlFiles(distRoot);
const manifest = JSON.parse(
  await fs.readFile(path.join(distRoot, '.vite', 'manifest.json'), 'utf8'),
);
const sourceStyles = await fs.readFile(path.join(projectRoot, 'src', 'index.css'), 'utf8');
const sourceTemplateCriticalStyles = await fs.readFile(
  path.join(projectRoot, 'src', 'styles', 'template-critical.css'),
  'utf8',
);
const criticalTemplateStyles = sourceTemplateCriticalStyles
  .replace(/\/\*[\s\S]*?\*\//gu, '')
  .replace(/\s+/gu, ' ')
  .replace(/\s*([{}:;,])\s*/gu, '$1')
  .trim();
const criticalFontFaces =
  "@font-face{font-family:'Cormorant Hero';font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/cormorant-garamond-hero.woff2') format('woff2')}@font-face{font-family:'DM Sans';font-style:normal;font-weight:300 700;font-display:swap;src:url('/fonts/dm-sans-latin-var.woff2') format('woff2')}";
const darkTokenMatch = sourceStyles.match(/\.dark\s*\{([^}]+)\}/u);
if (!darkTokenMatch?.[1]) {
  throw new Error('Unable to extract the critical dark-theme token block');
}
const criticalDarkTokens = `.dark{${darkTokenMatch[1]
  .replace(/\/\*[\s\S]*?\*\//gu, '')
  .replace(/\s+/gu, ' ')
  .replace(/\s*([:;])\s*/gu, '$1')
  .trim()}}`;
const collectManifestCss = (moduleKey, visited = new Set()) => {
  if (!moduleKey || visited.has(moduleKey)) return [];
  visited.add(moduleKey);
  const entry = manifest[moduleKey];
  if (!entry) return [];
  return [
    ...(entry.css ?? []),
    ...(entry.imports ?? []).flatMap((importKey) => collectManifestCss(importKey, visited)),
  ];
};
const beasties = new Beasties({
  path: distRoot,
  publicPath: '/',
  // Keep the complete animation/interactivity sheet available immediately,
  // but below the lead image and critical fonts in the network scheduler.
  preload: 'swap-low',
  pruneSource: false,
  mergeStylesheets: true,
  reduceInlineStyles: true,
  fonts: false,
  compress: true,
  logLevel: 'silent',
});

for (const htmlPath of htmlFiles) {
  const relative = path.relative(distRoot, htmlPath);
  const route = relative === 'index.html'
    ? '/'
    : `/${relative.replace(/index\.html$/u, '').replaceAll(path.sep, '/')}`;
  const markup = await render(route);
  const html = await fs.readFile(htmlPath, 'utf8');
  const dom = new JSDOM(html);
  const root = dom.window.document.getElementById('root');
  if (!root) throw new Error(`Missing #root in ${relative}`);
  root.innerHTML = markup;
  root.dataset.prerendered = 'true';

  const routeModule = route.includes('/servicios/') || route.includes('/services/')
    ? 'src/components/ServiceLandingPage.tsx'
    : route.includes('/verticales/') || route.includes('/verticals/')
      ? 'src/components/VerticalLandingPage.tsx'
      : route.includes('/recursos/') || route.includes('/resources/')
        ? 'src/components/ResourcePage.tsx'
        : null;
  const routeCssFiles = routeModule
    ? [...new Set(collectManifestCss(routeModule))]
    : [];
  const mainStylesheet = dom.window.document.head.querySelector(
    'link[rel="stylesheet"][href*="/assets/"]',
  );
  for (const cssFile of routeCssFiles) {
    if (dom.window.document.querySelector(`link[href="/${cssFile}"]`)) continue;
    const routeStylesheet = dom.window.document.createElement('link');
    routeStylesheet.rel = 'stylesheet';
    routeStylesheet.href = `/${cssFile}`;
    routeStylesheet.dataset.routeStyles = '';
    mainStylesheet?.insertAdjacentElement('afterend', routeStylesheet);
  }

  // Structured data is just as discoverable at the end of <body>, while
  // moving it out of <head> lets browsers discover the visual route markup
  // several kilobytes earlier in the response stream. This is especially
  // valuable on media-rich routes whose VideoObject graph is intentionally
  // comprehensive.
  for (const schema of dom.window.document.head.querySelectorAll(
    'script[type="application/ld+json"]',
  )) {
    dom.window.document.body.append(schema);
  }

  // Beasties is selector-based rather than viewport-aware. Limit its matching
  // surface to the fixed navigation and the first visible section so each
  // route gets only the CSS needed for an immediately styled first paint.
  // The full stylesheet remains available asynchronously for every rich
  // transition, interaction and below-the-fold section.
  const criticalRegions = [
    dom.window.document.querySelector('#root nav.fixed.top-0'),
    dom.window.document.querySelector('#root main section'),
    dom.window.document.querySelector(
      '#root main .viewport-layout--mobile section',
    ),
    dom.window.document.querySelector(
      '#root main .viewport-layout--desktop section',
    ),
  ].filter(Boolean);
  for (const region of criticalRegions) {
    region.setAttribute('data-beasties-container', '');
  }

  for (const script of dom.window.document.querySelectorAll('script[type="module"][src]')) {
    script.setAttribute('fetchpriority', 'low');
  }
  const bodyFontPreload = dom.window.document.querySelector(
    'link[rel="preload"][href="/fonts/dm-sans-latin-var.woff2"]',
  );
  bodyFontPreload?.setAttribute('fetchpriority', 'high');
  if (
    bodyFontPreload &&
    !dom.window.document.querySelector(
      'link[rel="preload"][href="/fonts/cormorant-garamond-hero.woff2"]',
    )
  ) {
    const brandFontPreload = dom.window.document.createElement('link');
    brandFontPreload.rel = 'preload';
    brandFontPreload.href = '/fonts/cormorant-garamond-hero.woff2';
    brandFontPreload.as = 'font';
    brandFontPreload.type = 'font/woff2';
    brandFontPreload.crossOrigin = 'anonymous';
    brandFontPreload.setAttribute('fetchpriority', 'high');
    bodyFontPreload.insertAdjacentElement('afterend', brandFontPreload);
  }
  dom.window.document
    .querySelector('link[rel="preload"][href="/fonts/cormorant-garamond-hero.woff2"]')
    ?.setAttribute('fetchpriority', 'high');

  // Put the hero still in the preload scanner's first headful of bytes.
  // Its srcset is already prerendered, so this accelerates the actual visual
  // candidate without fetching a duplicate or guessing a viewport size.
  if (route === '/' || route === '/en/') {
    const leadPicture = dom.window.document.querySelector('.gallery-hero__media picture');
    const leadAvif = [...(leadPicture?.querySelectorAll('source[type="image/avif"]') ?? [])]
      .find((source) => !source.hasAttribute('media'));
    const leadImage = leadPicture?.querySelector('img');
    if (leadAvif && leadImage) {
      const avifSrcset = leadAvif.getAttribute('srcset') ?? '';
      const firstAvifSrc = avifSrcset.split(',')[0]?.trim().split(/\s+/u)[0];
      const preload = dom.window.document.createElement('link');
      preload.rel = 'preload';
      preload.as = 'image';
      preload.type = 'image/avif';
      preload.href = firstAvifSrc ?? leadImage.getAttribute('src') ?? '';
      preload.setAttribute('imagesrcset', avifSrcset);
      preload.setAttribute('imagesizes', leadImage.getAttribute('sizes') ?? '100vw');
      preload.setAttribute('fetchpriority', 'high');
      const viewportMeta = dom.window.document.head.querySelector('meta[name="viewport"]');
      viewportMeta?.insertAdjacentElement('afterend', preload);
    }
  }

  const inlined = await beasties.process(dom.serialize());
  const routeCriticalStyles =
    routeModule === 'src/components/ServiceLandingPage.tsx' ||
    routeModule === 'src/components/VerticalLandingPage.tsx'
      ? `<style data-critical-template>${criticalTemplateStyles}</style>`
      : '';
  const withCriticalTheme = inlined.replace(
    '</head>',
    `<style data-critical-fonts>${criticalFontFaces}</style>${routeCriticalStyles}<style data-critical-theme>${criticalDarkTokens}</style></head>`,
  );
  await fs.writeFile(htmlPath, withCriticalTheme);
}

console.log(`Prerendered ${htmlFiles.length} registered route(s)`);
