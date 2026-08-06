import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirectories = new Set(['.git', 'dist', 'node_modules', 'public']);

const collectHtmlFiles = (directory, files = []) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectHtmlFiles(entryPath, files);
    if (entry.isFile() && entry.name === 'index.html') files.push(entryPath);
  }
  return files;
};

const standardFontHints = `    <link
      rel="preload"
      href="/fonts/dm-sans-latin-var.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />`;
const homeFontHints = standardFontHints;
const homeEditorialFontHints = `    <link
      rel="preload"
      href="/fonts/cormorant-garamond-hero.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />
    <link
      rel="preload"
      href="/fonts/cormorant-garamond-latin-italic-var.woff2"
      as="font"
      type="font/woff2"
      crossorigin
    />`;

const googleFontBlock =
  /\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"\s*\/>\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin\s*\/>[\s\S]*?<noscript>[\s\S]*?fonts\.googleapis\.com[\s\S]*?<\/noscript>/u;
const googleFontPreconnects =
  /\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"\s*\/>\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin\s*\/>/u;
const editorialStylesheet =
  /\s*<link[^>]+href="\/fonts\/editorial-fonts\.css"[^>]*\/?>/gu;
const cormorantPreload =
  /\s*<link\s+rel="preload"\s+href="\/fonts\/cormorant-garamond-(?:hero|latin(?:-italic)?-var)\.woff2"[\s\S]*?\/>/gu;

let updated = 0;
for (const htmlPath of collectHtmlFiles(rootDir)) {
  const source = fs.readFileSync(htmlPath, 'utf8');
  const relativePath = path.relative(rootDir, htmlPath).split(path.sep).join('/');
  const isHomeEntrypoint = relativePath === 'index.html' || relativePath === 'en/index.html';
  const fontHints = isHomeEntrypoint ? homeFontHints : standardFontHints;
  let normalized = source
    .replace(googleFontBlock, `\n${fontHints}`)
    .replace(googleFontPreconnects, `\n${fontHints}`)
    .replace(editorialStylesheet, '')
    .replace(cormorantPreload, '');

  if (isHomeEntrypoint && !normalized.includes('/fonts/cormorant-garamond-hero.woff2')) {
    normalized = normalized.replace(
      /(<link\s+rel="preload"\s+href="\/fonts\/dm-sans-latin-var\.woff2"[\s\S]*?\/>)/u,
      `$1\n${homeEditorialFontHints}`,
    );
  }
  if (normalized === source) continue;
  fs.writeFileSync(htmlPath, normalized);
  updated += 1;
}

console.log(`Normalized self-hosted font hints in ${updated} entrypoint(s)`);
