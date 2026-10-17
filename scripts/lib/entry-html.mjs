/**
 * Helpers for rewriting copy inside the committed static entry HTML files
 * (servicios/<slug>/index.html, verticales/<slug>/index.html, legal shells...).
 *
 * Every helper is a pure string -> string transform that rewrites one known
 * element in place and leaves the surrounding markup byte-for-byte alone, so
 * the sync scripts stay idempotent: running them twice yields no diff.
 *
 * Text is escaped for HTML (< >, ambiguous &, plus " in attributes). Non-ASCII
 * characters — accents, typographic apostrophes and quotes (’ “ ”) — are kept
 * as UTF-8, both in HTML and in JSON-LD.
 */
import fs from 'node:fs';
import path from 'node:path';
import { rootDir } from './load-ts-module.mjs';

export { rootDir };

export const SITE_URL = 'https://www.giselasaldarriaga.com';

/** '/servicios/ugc-lifestyle/' -> 'servicios/ugc-lifestyle/index.html' */
export const entryFileForPath = (localePath) => {
  const trimmed = localePath.replace(/^\/+|\/+$/gu, '');
  return trimmed === '' ? 'index.html' : `${trimmed}/index.html`;
};

/**
 * `&` is only escaped where it could start a character reference (followed by
 * a letter, digit or `#`). A bare "Terms & Content Use" stays readable and is
 * valid HTML5, and committed shells keep matching the raw data strings.
 */
export const escapeText = (value) =>
  String(value).replace(/&(?=[A-Za-z0-9#])/gu, '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export const escapeAttr = (value) => escapeText(value).replaceAll('"', '&quot;');

/* Copy links and **bold** are written in the data (see src/lib/inline-copy-links.tsx). */
const INLINE_TOKEN_RE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/gu;

/** Escaped HTML with [label](href) as <a> and **bold** as <strong>. */
export const renderInlineCopy = (text) => {
  let html = '';
  let cursor = 0;
  for (const match of text.matchAll(INLINE_TOKEN_RE)) {
    html += escapeText(text.slice(cursor, match.index));
    if (match[3] !== undefined) {
      html += `<strong>${escapeText(match[3])}</strong>`;
    } else {
      html += `<a href="${escapeAttr(match[2])}">${escapeText(match[1])}</a>`;
    }
    cursor = match.index + match[0].length;
  }
  return html + escapeText(text.slice(cursor));
};

/** Visible text only (link labels kept, hrefs and ** dropped), like visibleInlineCopy(). */
export const visibleInlineCopy = (text) =>
  text.replace(INLINE_TOKEN_RE, (_all, label, _href, bold) => bold ?? label);

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');

/**
 * Replace the first match of `pattern`. Throws when the element is missing so a
 * structural change to an entry file fails the build instead of silently
 * shipping stale copy.
 */
export const replaceRequired = (html, pattern, replacer, label) => {
  if (!pattern.test(html)) {
    throw new Error(`Expected ${label} not found`);
  }
  return html.replace(pattern, replacer);
};

/** <title> */
export const setTitle = (html, title) =>
  replaceRequired(html, /<title>[\s\S]*?<\/title>/u, () => `<title>${escapeText(title)}</title>`, '<title>');

/**
 * <meta name|property="key" content="..."> — handles single- and multi-line tags.
 * Optional: a tag that does not exist is left alone (only sync what is there).
 */
export const setMeta = (html, attribute, key, value) => {
  const pattern = new RegExp(`<meta\\s+${attribute}="${escapeRegExp(key)}"[^>]*>`, 'u');
  return html.replace(pattern, (tag) => tag.replace(/content="[^"]*"/u, () => `content="${escapeAttr(value)}"`));
};

/** Title + description + their og:/twitter: twins, plus image alt text when given. */
export const setHeadMeta = (html, { title, description, imageAlt }) => {
  let next = setTitle(html, title);
  next = setMeta(next, 'name', 'description', description);
  next = setMeta(next, 'property', 'og:title', title);
  next = setMeta(next, 'property', 'og:description', description);
  next = setMeta(next, 'name', 'twitter:title', title);
  next = setMeta(next, 'name', 'twitter:description', description);
  if (imageAlt !== undefined) {
    next = setMeta(next, 'property', 'og:image:alt', imageAlt);
    next = setMeta(next, 'name', 'twitter:image:alt', imageAlt);
  }
  return next;
};

const JSON_LD_PATTERN = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/u;

/**
 * Serialize JSON-LD for an inline <script>. `<` is escaped so copy can never
 * close the script element early; everything else stays UTF-8.
 */
const serializeJsonLd = (schema, original) => {
  const isPretty = original.trim().includes('\n');
  if (!isPretty) return JSON.stringify(schema).replaceAll('<', '\\u003c');
  const indent = original.match(/^\n([ \t]*)/u)?.[1] ?? '      ';
  const closingIndent = original.match(/\n([ \t]*)$/u)?.[1] ?? '    ';
  const body = JSON.stringify(schema, null, 2)
    .replaceAll('<', '\\u003c')
    .split('\n')
    .map((line) => `${indent}${line}`)
    .join('\n');
  return `\n${body}\n${closingIndent}`;
};

/** Parse the first JSON-LD block, let `mutate` edit (or replace) it, and write it back. */
export const updateJsonLd = (html, mutate) => {
  const match = html.match(JSON_LD_PATTERN);
  if (!match) throw new Error('Expected JSON-LD block not found');
  const schema = JSON.parse(match[1]);
  const result = mutate(schema) ?? schema;
  return html.replace(
    match[0],
    () => `<script type="application/ld+json">${serializeJsonLd(result, match[1])}</script>`,
  );
};

export const findGraphNode = (schema, type) =>
  (Array.isArray(schema['@graph']) ? schema['@graph'] : []).find((node) => node['@type'] === type);

/** Set the current-page (last) breadcrumb item name. */
export const setLastBreadcrumbName = (schema, name) => {
  const list = findGraphNode(schema, 'BreadcrumbList');
  const last = Array.isArray(list?.itemListElement) ? list.itemListElement.at(-1) : undefined;
  if (last) last.name = name;
};

/**
 * Point the middle breadcrumb item at the family hub (/servicios/, /verticales/,
 * /recursos/ and EN twins), so the trail is Home › hub › page, matching the
 * visible breadcrumb that PageSeo's BreadcrumbList describes.
 */
export const setHubBreadcrumb = (schema, { name, item }) => {
  const list = findGraphNode(schema, 'BreadcrumbList');
  const elements = Array.isArray(list?.itemListElement) ? list.itemListElement : [];
  if (elements.length !== 3) throw new Error('Expected a three-level BreadcrumbList (home, hub, page)');
  elements[1].name = name;
  elements[1].item = item;
};

/**
 * Re-render list items inside an existing <ul>, keeping its layout: items on
 * one line stay on one line, items on their own lines keep their indentation.
 */
const renderListInner = (existingInner, itemsHtml) => {
  const itemIndent = existingInner.match(/\n([ \t]*)<li/u)?.[1];
  if (itemIndent === undefined) return itemsHtml.join('');
  const closingIndent = existingInner.match(/\n([ \t]*)$/u)?.[1] ?? '';
  return `${itemsHtml.map((item) => `\n${itemIndent}${item}`).join('')}\n${closingIndent}`;
};

const setListItems = (html, openTagPattern, items, itemOpenTag, label) => {
  const pattern = new RegExp(`(${openTagPattern.source})([\\s\\S]*?)(<\\/ul>)`, 'u');
  return replaceRequired(
    html,
    pattern,
    (_match, open, inner, close) =>
      `${open}${renderListInner(
        inner,
        items.map((item) => `${itemOpenTag}${escapeText(item)}</li>`),
      )}${close}`,
    label,
  );
};

const setLeafText = (html, openTagPattern, closeTag, text, label) => {
  const pattern = new RegExp(`(${openTagPattern.source})[^<]*(${escapeRegExp(closeTag)})`, 'u');
  return replaceRequired(html, pattern, (_match, open, close) => `${open}${escapeText(text)}${close}`, label);
};

/* ── Boot shell (#root placeholder markup shared by service/vertical/legal shells) ── */

export const setBootBreadcrumbCurrent = (html, label) =>
  replaceRequired(
    html,
    /(<span>)[^<]*(<\/span>\s*<\/nav>)/u,
    (_match, open, close) => `${open}${escapeText(label)}${close}`,
    'boot breadcrumb current item',
  );

/** Boot shell: the middle (hub) item of a Home / hub / page breadcrumb. */
export const setBootBreadcrumbHub = (html, label) =>
  replaceRequired(
    html,
    /(<nav class="boot-breadcrumbs"[^>]*>\s*<span>[^<]*<\/span>\s*<span>\/<\/span>\s*<span>)[^<]*(<\/span>)/u,
    (_match, open, close) => `${open}${escapeText(label)}${close}`,
    'boot breadcrumb hub item',
  );

export const setBootLabel = (html, text) => setLeafText(html, /<p class="boot-label">/u, '</p>', text, 'p.boot-label');

export const setBootTitle = (html, text) =>
  setLeafText(html, /<h1 class="boot-title">/u, '</h1>', text, 'h1.boot-title');

export const setBootSummary = (html, text) =>
  setLeafText(html, /<p class="boot-summary">/u, '</p>', text, 'p.boot-summary');

export const setBootPoints = (html, points) =>
  setListItems(html, /<ul class="boot-points"[^>]*>/u, points, '<li class="boot-point">', 'ul.boot-points');

/** Aside "formats" list (services/verticals). */
export const setBootPanelList = (html, items) =>
  setListItems(html, /<ul class="boot-list">/u, items, '<li>', 'ul.boot-list');

/** Aside <h2> + intro <p>, plus the label above its list when the panel has one. */
export const setBootPanelIntro = (html, { title, text, listTitle }) => {
  const next = replaceRequired(
    html,
    /(<aside class="boot-panel">\s*<h2>)[^<]*(<\/h2>\s*<p>)[^<]*(<\/p>)/u,
    (_match, open, middle, close) =>
      `${open}${escapeText(title)}${middle}${escapeText(visibleInlineCopy(text))}${close}`,
    'aside.boot-panel h2/p',
  );
  return listTitle === undefined
    ? next
    : setLeafText(next, /<p class="boot-list-title">/u, '</p>', listTitle, 'p.boot-list-title');
};

/** Line under the boot H1 (legal shells: the last-updated date). */
export const setBootSignature = (html, text) =>
  setLeafText(html, /<p class="boot-signature">/u, '</p>', text, 'p.boot-signature');

/**
 * Services and verticals render no tagline under the H1, so the placeholder
 * drops it instead of carrying copy with no source in the data.
 */
export const removeBootSignature = (html) => html.replace(/\n[ \t]*<p class="boot-signature">[^<]*<\/p>/u, '');

/** <a class="boot-primary|boot-secondary" href="...">label</a>; omit `label` to keep it. */
export const setBootAction = (html, className, { href, label }) =>
  replaceRequired(
    html,
    new RegExp(`<a class="${className}" href="([^"]*)">([^<]*)<\\/a>`, 'u'),
    (_match, currentHref, currentLabel) =>
      `<a class="${className}" href="${href === undefined ? currentHref : escapeAttr(href)}">${
        label === undefined ? currentLabel : escapeText(label)
      }</a>`,
    `a.${className}`,
  );

const NOSCRIPT_LEAD =
  /(<article class="boot-noscript">\s*<h2>)[^<]*(<\/h2>\s*<p>)[^<]*(<\/p>)/u;

/** First <h2> + <p> of the noscript article (services/verticals: hero title + summary). */
export const setNoscriptLead = (html, { title, summary }) =>
  replaceRequired(
    html,
    NOSCRIPT_LEAD,
    (_match, open, middle, close) => `${open}${escapeText(title)}${middle}${escapeText(summary)}${close}`,
    'noscript lead h2/p',
  );

/** The noscript lead's <h3> label (mirrors the aside list title). */
export const setNoscriptLeadListTitle = (html, text) =>
  replaceRequired(
    html,
    /(<article class="boot-noscript">\s*<h2>[^<]*<\/h2>\s*<p>[^<]*<\/p>\s*<h3>)[^<]*(<\/h3>)/u,
    (_match, open, close) => `${open}${escapeText(text)}${close}`,
    'noscript lead h3',
  );

/** The <ul> right after the noscript lead's <h3> (mirrors the aside list). */
export const setNoscriptLeadList = (html, items) =>
  setListItems(
    html,
    /<article class="boot-noscript">\s*<h2>[^<]*<\/h2>\s*<p>[^<]*<\/p>\s*<h3>[^<]*<\/h3>\s*<ul>/u,
    items,
    '<li>',
    'noscript lead list',
  );

export const readEntry = (relativeFile) => {
  const absolutePath = path.join(rootDir, relativeFile);
  if (!fs.existsSync(absolutePath)) throw new Error(`Missing entrypoint: ${relativeFile}`);
  return fs.readFileSync(absolutePath, 'utf8');
};

/** Write only when content changed. Returns true when the file was rewritten. */
export const writeEntryIfChanged = (relativeFile, previous, next) => {
  if (next === previous) return false;
  fs.writeFileSync(path.join(rootDir, relativeFile), next);
  return true;
};

/** Wrap a per-file transform so errors name the file. */
export const withFileContext = (relativeFile, transform) => {
  try {
    return transform();
  } catch (error) {
    throw new Error(`${relativeFile}: ${error.message}`, { cause: error });
  }
};
