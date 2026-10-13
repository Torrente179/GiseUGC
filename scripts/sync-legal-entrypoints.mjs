/**
 * Sync the static legal entrypoints (politica-de-privacidad, terminos-y-uso-de-contenido
 * and their /en/ twins) with src/data/legal-pages.ts.
 *
 * Why: PageSeo only sets <title>/meta from a useEffect and prerender replaces
 * only #root, so the committed <head> (title, meta, og/twitter, JSON-LD) is
 * what ships and what non-rendering crawlers read. These shells were
 * hand-written and drifted from the data; every field below is now read from
 * the TypeScript data via scripts/lib/load-ts-module.mjs.
 *
 * Writes, per legal page × locale (only elements that already exist in the shell):
 * - <title>, meta description, og:/twitter: title + description (metaTitle /
 *   metaDescription), og:/twitter: image alt (title)
 * - JSON-LD: WebPage name/description/dateModified (CONTENT_DATES.legal),
 *   BreadcrumbList current item (breadcrumbLabel)
 * - Boot shell: breadcrumb, eyebrow, H1 (title), summary (intro), summary
 *   points (summaryItems), support mailto (contactEmail), counterpart link
 *   (counterpartLabel / counterpartPath), date line under the H1
 *   (updatedDateLabel), aside panel (tocTitle, audienceNote, section titles)
 *
 * Not synced (no field in legal-pages.ts): the primary CTA label and the
 * noscript summary. Both sit inside #root, which prerender replaces.
 *
 * Idempotent. Runs in prebuild via `npm run legal:entrypoints`.
 */
import { loadTsModule } from './lib/load-ts-module.mjs';
import {
  entryFileForPath,
  findGraphNode,
  readEntry,
  setBootAction,
  setBootBreadcrumbCurrent,
  setBootLabel,
  setBootPanelIntro,
  setBootPanelList,
  setBootPoints,
  setBootSignature,
  setBootSummary,
  setBootTitle,
  setHeadMeta,
  setLastBreadcrumbName,
  updateJsonLd,
  withFileContext,
  writeEntryIfChanged,
} from './lib/entry-html.mjs';

const { getLegalPageContent } = await loadTsModule('src/data/legal-pages.ts');
const { getLegalIdsInOrder } = await loadTsModule('src/lib/locale-path.ts');
const { CONTENT_DATES } = await loadTsModule('src/data/content-dates.ts');

const LOCALES = ['es', 'en'];

let total = 0;
let changed = 0;

for (const pageId of getLegalIdsInOrder()) {
  for (const locale of LOCALES) {
    const page = getLegalPageContent(pageId, locale);
    const file = entryFileForPath(page.path);
    const source = readEntry(file);

    const updated = withFileContext(file, () => {
      let next = setHeadMeta(source, {
        title: page.metaTitle,
        description: page.metaDescription,
        imageAlt: page.title,
      });

      next = updateJsonLd(next, (schema) => {
        const webPage = findGraphNode(schema, 'WebPage');
        if (!webPage) throw new Error('Expected WebPage node in JSON-LD');
        webPage.name = page.metaTitle;
        webPage.description = page.metaDescription;
        webPage.dateModified = CONTENT_DATES.legal;
        setLastBreadcrumbName(schema, page.breadcrumbLabel);
      });

      next = setBootBreadcrumbCurrent(next, page.breadcrumbLabel);
      next = setBootLabel(next, page.eyebrow);
      next = setBootTitle(next, page.title);
      next = setBootSummary(next, page.intro);
      next = setBootSignature(next, page.updatedDateLabel);
      next = setBootPoints(next, page.summaryItems);
      next = setBootAction(next, 'boot-primary', { href: `mailto:${page.contactEmail}` });
      next = setBootAction(next, 'boot-secondary', { href: page.counterpartPath, label: page.counterpartLabel });
      next = setBootPanelIntro(next, { title: page.tocTitle, text: page.audienceNote });
      next = setBootPanelList(
        next,
        page.sections.map((section) => section.title.replace(/^\d+\.\s*/u, '')),
      );
      return next;
    });

    total += 1;
    if (writeEntryIfChanged(file, source, updated)) changed += 1;
  }
}

console.log(`Synced ${total} legal entrypoints from legal-pages.ts (${changed} changed)`);
