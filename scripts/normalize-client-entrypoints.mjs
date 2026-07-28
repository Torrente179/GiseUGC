import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirectories = new Set([
  '.git',
  'dist',
  'dist-ssr',
  'node_modules',
  'public',
]);

const collectHtmlFiles = (directory, files = []) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) collectHtmlFiles(entryPath, files);
    if (entry.isFile() && entry.name === 'index.html') files.push(entryPath);
  }
  return files;
};

const getClientEntry = (relativePath) => {
  if (relativePath === 'index.html' || relativePath === 'en/index.html') {
    return '/src/entry-home.tsx';
  }
  if (
    relativePath.startsWith('servicios/') ||
    relativePath.startsWith('en/services/')
  ) {
    return '/src/entry-service.tsx';
  }
  if (
    relativePath.startsWith('verticales/') ||
    relativePath.startsWith('en/verticals/')
  ) {
    return '/src/entry-vertical.tsx';
  }
  if (
    relativePath.startsWith('recursos/') ||
    relativePath.startsWith('en/resources/')
  ) {
    return '/src/entry-resource.tsx';
  }
  if (
    relativePath === 'politica-de-privacidad/index.html' ||
    relativePath === 'terminos-y-uso-de-contenido/index.html' ||
    relativePath === 'en/privacy-policy/index.html' ||
    relativePath === 'en/terms-and-content-use/index.html'
  ) {
    return '/src/entry-legal.tsx';
  }
  return '/src/main.tsx';
};

let updated = 0;
for (const htmlPath of collectHtmlFiles(projectRoot)) {
  const relativePath = path
    .relative(projectRoot, htmlPath)
    .split(path.sep)
    .join('/');
  const source = fs.readFileSync(htmlPath, 'utf8');
  const clientEntry = getClientEntry(relativePath);
  const normalized = source.replace(
    /(<script\s+type="module"\s+src=")\/src\/(?:main|entry-[a-z-]+)\.tsx("><\/script>)/u,
    `$1${clientEntry}$2`,
  );
  if (normalized === source) continue;
  fs.writeFileSync(htmlPath, normalized);
  updated += 1;
}

console.log(`Normalized route-specific client entrypoints in ${updated} file(s)`);
