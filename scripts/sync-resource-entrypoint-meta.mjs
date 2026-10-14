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
 * The article placeholder inside #root is rebuilt from the same data.
 * FAQ copy lives once, as headings + paragraphs inside #root. A second
 * FAQ <dl> in <noscript> used to ship next to the prerendered heading FAQ.
 *
 * Runs in prebuild via `npm run resource:entrypoints`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { loadTsModule, rootDir } from './lib/load-ts-module.mjs';
import {
  entryFileForPath,
  escapeText,
  renderInlineCopy,
  replaceRequired,
  visibleInlineCopy,
} from './lib/entry-html.mjs';

const { getAllResourceIds, getResourcePageContent } = await loadTsModule('src/data/resource-pages.ts');
const { CONTENT_DATES, formatLastUpdatedLabel } = await loadTsModule('src/data/content-dates.ts');
const { getHomePath } = await loadTsModule('src/lib/locale-path.ts');

/* Mirrors the chrome labels in ResourcePage.tsx. */
const LABELS = {
  es: { home: 'Inicio', resources: 'Recursos', faq: 'Preguntas frecuentes', atAGlance: 'De un vistazo' },
  en: { home: 'Home', resources: 'Resources', faq: 'Frequently asked questions', atAGlance: 'At a glance' },
};

const H2_STYLE = 'font-size:1.3rem;margin-top:2rem;margin-bottom:0.75rem';
const P_STYLE = 'line-height:1.7;margin-bottom:1rem';

const renderTable = ({ headers, rows }, { heading } = {}) =>
  [
    heading ? `        <h2 style="${H2_STYLE}">${escapeText(heading)}</h2>` : '',
    '        <table style="width:100%;border-collapse:collapse;margin-bottom:1rem;font-size:0.95rem">',
    '          <thead>',
    '            <tr style="border-bottom:2px solid #e5e2dd">',
    ...headers.map(
      (header) => `              <th style="text-align:left;padding:0.75rem 0.5rem;font-weight:700">${escapeText(header)}</th>`,
    ),
    '            </tr>',
    '          </thead>',
    '          <tbody>',
    ...rows.flatMap((row) => [
      '            <tr style="border-bottom:1px solid #f0eeea">',
      ...row.map((cell, index) =>
        index === 0
          ? `              <td style="padding:0.6rem 0.5rem;font-weight:600">${renderInlineCopy(cell)}</td>`
          : `              <td style="padding:0.6rem 0.5rem">${renderInlineCopy(cell)}</td>`,
      ),
      '            </tr>',
    ]),
    '          </tbody>',
    '        </table>',
  ]
    .filter(Boolean)
    .join('\n');

/** Everything from <div id="root"> through the FAQ </noscript>. */
const renderBody = (page, locale) => {
  const labels = LABELS[locale];
  const homePath = getHomePath(locale);
  const sections = page.sections.map((section) =>
    [
      `        <h2 style="${H2_STYLE}">${escapeText(section.title)}</h2>`,
      section.italicLead
        ? `        <p style="${P_STYLE}"><em>${escapeText(section.italicLead)}</em></p>`
        : '',
      ...(section.bodyBefore ?? []).map(
        (paragraph) => `        <p style="${P_STYLE}">${renderInlineCopy(paragraph)}</p>`,
      ),
      section.table ? renderTable(section.table) : '',
      ...section.body.map((paragraph) => `        <p style="${P_STYLE}">${renderInlineCopy(paragraph)}</p>`),
      section.bullets?.length
        ? [
            '        <ul style="line-height:1.7;margin-bottom:1rem;padding-left:1.25rem">',
            ...section.bullets.map((item) => `          <li>${renderInlineCopy(item)}</li>`),
            '        </ul>',
          ].join('\n')
        : '',
    ]
      .filter(Boolean)
      .join('\n'),
  );
  if (page.comparisonTable) sections.push(renderTable(page.comparisonTable, { heading: labels.atAGlance }));

  const faqs = page.faqs.flatMap((faq) => [
    `        <h3 style="${H2_STYLE}">${escapeText(visibleInlineCopy(faq.question))}</h3>`,
    `        <p style="${P_STYLE}">${escapeText(visibleInlineCopy(faq.answer))}</p>`,
  ]);

  return [
    '<div id="root">',
    '      <div style="max-width:56rem;margin:0 auto;padding:2rem 1.5rem">',
    '        <nav aria-label="Breadcrumb" style="font-size:0.85rem;margin-bottom:1.5rem">',
    `          <a href="${homePath}">${labels.home}</a> / <a href="${homePath}#services">${labels.resources}</a> / <span>${escapeText(page.breadcrumbLabel)}</span>`,
    '        </nav>',
    `        <h1 style="font-size:1.8rem;line-height:1.2;margin-bottom:1rem">${escapeText(page.heroTitle)}</h1>`,
    `        <p style="font-size:1.05rem;line-height:1.7;margin-bottom:1.5rem">${renderInlineCopy(page.heroSummary)}</p>`,
    page.leadCtaLabel && page.leadCtaHref
      ? `        <p style="${P_STYLE}"><a href="${escapeAttribute(page.leadCtaHref)}">${escapeText(page.leadCtaLabel)}</a></p>`
      : '',
    '',
    sections.join('\n\n'),
    page.faqs.length
      ? `\n        <h2 style="${H2_STYLE}">${escapeText(labels.faq)}</h2>\n${faqs.join('\n')}\n`
      : '',
    `        <p style="font-size:0.8rem;color:#888;margin-top:2rem">${escapeText(
      formatLastUpdatedLabel(CONTENT_DATES.resources, locale),
    )}</p>`,
    '      </div>',
    '    </div>',
    '    <noscript></noscript>',
  ].join('\n');
};

/* Resource id -> { locale: entrypoint path }, derived from the data's own paths. */
const ENTRYPOINTS = Object.fromEntries(
  getAllResourceIds().map((id) => [
    id,
    Object.fromEntries(
      ['es', 'en'].map((locale) => [locale, entryFileForPath(getResourcePageContent(id, locale).path)]),
    ),
  ]),
);

/** metaTitle/metaDescription per id+locale, read from the TypeScript data (not regex-scraped). */
const readMeta = () => {
  const meta = {};
  for (const id of Object.keys(ENTRYPOINTS)) {
    for (const locale of ['es', 'en']) {
      const page = getResourcePageContent(id, locale);
      meta[`${id}.${locale}`] = { title: page.metaTitle, description: page.metaDescription };
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
    tag.replace(/content="[^"]*"/u, () => `content="${escaped}"`),
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
      () => `<title>${escapeAttribute(title)}</title>`,
    );
    next = replaceMetaContent(next, /<meta\s+name="description"[^>]*>/u, description);
    next = replaceMetaContent(next, /<meta\s+property="og:title"[^>]*>/u, title);
    next = replaceMetaContent(next, /<meta\s+property="og:description"[^>]*>/u, description);
    next = replaceMetaContent(next, /<meta\s+name="twitter:title"[^>]*>/u, title);
    next = replaceMetaContent(next, /<meta\s+name="twitter:description"[^>]*>/u, description);
    next = replaceRequired(
      next,
      /<div id="root">[\s\S]*?<\/noscript>/u,
      () => renderBody(getResourcePageContent(id, locale), locale),
      `${relativePath}: #root article + FAQ noscript`,
    );

    if (next === source) continue;
    fs.writeFileSync(absolutePath, next);
    updated += 1;
  }
}

console.log(`Synced resource entrypoint metadata in ${updated} file(s)`);
