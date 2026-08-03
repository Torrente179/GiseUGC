/**
 * Sync the static resource entrypoint <head> metadata to src/data/resource-pages.ts.
 *
 * Why this exists
 * ---------------
 * PageSeo sets document.title and the meta tags from a useEffect, so those
 * values only ever existed for clients that execute JavaScript. The hand-written
 * shells carried an older, accent-stripped copy — which is what non-rendering
 * crawlers (OAI-SearchBot, PerplexityBot, ClaudeBot) actually read. The result
 * was two different titles for the same URL, the crawler-visible one missing
 * every Spanish accent.
 *
 * This makes resource-pages.ts the single source of truth for both surfaces.
 * Idempotent: re-running with no data change rewrites nothing.
 *
 * Runs in prebuild via `npm run resource:entrypoints`.
 */
import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dataFile = path.join(rootDir, 'src/data/resource-pages.ts');

/* Resource id -> { locale: entrypoint path } */
const ENTRYPOINTS = {
  'what-is-ugc': {
    es: 'recursos/que-es-ugc/index.html',
    en: 'en/resources/what-is-ugc/index.html',
  },
  'how-to-hire-ugc-creator': {
    es: 'recursos/como-contratar-creadora-ugc/index.html',
    en: 'en/resources/how-to-hire-ugc-creator/index.html',
  },
  'ugc-vs-influencer-marketing': {
    es: 'recursos/ugc-vs-influencer-marketing/index.html',
    en: 'en/resources/ugc-vs-influencer-marketing/index.html',
  },
  'ugc-ad-formats-guide': {
    es: 'recursos/formatos-ugc-ads/index.html',
    en: 'en/resources/ugc-ad-formats-guide/index.html',
  },
};

const unquote = (value) =>
  value.replace(/\\'/g, "'").replace(/\\\\/g, '\\');

/** Pull metaTitle/metaDescription per id+locale straight out of the TS source. */
const readMeta = () => {
  const source = fs.readFileSync(dataFile, 'utf8');
  const meta = {};

  for (const id of Object.keys(ENTRYPOINTS)) {
    const start = source.indexOf(`  '${id}': {`);
    if (start === -1) throw new Error(`resource id not found in data: ${id}`);
    const segment = source.slice(start);

    for (const locale of ['es', 'en']) {
      const localeStart = segment.indexOf(`    ${locale}: {`);
      if (localeStart === -1) throw new Error(`locale ${locale} missing for ${id}`);
      const block = segment.slice(localeStart, localeStart + 4000);

      const title = block.match(/metaTitle: '((?:[^'\\]|\\.)*)'/u);
      const description = block.match(/metaDescription:\s*\n?\s*'((?:[^'\\]|\\.)*)'/u);
      if (!title || !description) {
        throw new Error(`metaTitle/metaDescription unreadable for ${id}.${locale}`);
      }

      meta[`${id}.${locale}`] = {
        title: unquote(title[1]),
        description: unquote(description[1]),
      };
    }
  }
  return meta;
};

const escapeAttribute = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const replaceMetaContent = (html, matcher, value) => {
  const escaped = escapeAttribute(value);
  return html.replace(matcher, (tag) =>
    tag.replace(/content="[^"]*"/u, `content="${escaped}"`),
  );
};

const meta = readMeta();
let updated = 0;

for (const [id, locales] of Object.entries(ENTRYPOINTS)) {
  for (const [locale, relativePath] of Object.entries(locales)) {
    const absolutePath = path.join(rootDir, relativePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`missing entrypoint: ${relativePath}`);
    }

    const { title, description } = meta[`${id}.${locale}`];
    const source = fs.readFileSync(absolutePath, 'utf8');
    let next = source;

    next = next.replace(
      /<title>[\s\S]*?<\/title>/u,
      `<title>${escapeAttribute(title)}</title>`,
    );
    next = replaceMetaContent(next, /<meta\s+name="description"[^>]*>/u, description);
    next = replaceMetaContent(next, /<meta\s+property="og:title"[^>]*>/u, title);
    next = replaceMetaContent(next, /<meta\s+property="og:description"[^>]*>/u, description);
    next = replaceMetaContent(next, /<meta\s+name="twitter:title"[^>]*>/u, title);
    next = replaceMetaContent(next, /<meta\s+name="twitter:description"[^>]*>/u, description);

    if (next === source) continue;
    fs.writeFileSync(absolutePath, next);
    updated += 1;
  }
}

console.log(`Synced resource entrypoint metadata in ${updated} file(s)`);
