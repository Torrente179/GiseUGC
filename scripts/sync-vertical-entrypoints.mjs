/**
 * Sync the static vertical entrypoints (verticales/<slug>/index.html and
 * en/verticals/<slug>/index.html) with src/data/vertical-pages.ts.
 *
 * Why: PageSeo only sets <title>/meta from a useEffect and prerender replaces
 * only #root, so the committed <head> (title, meta, og/twitter, JSON-LD) is
 * what ships and what non-rendering crawlers read. These shells used to be
 * hand-written and drifted from the data; now every copy field below is read
 * from the TypeScript data via scripts/lib/load-ts-module.mjs.
 *
 * Writes, per vertical × locale (only elements that already exist in the shell):
 * - <title>, meta description, og:/twitter: title + description (metaTitle /
 *   metaDescription), og:/twitter: image alt (heroTitle)
 * - JSON-LD: WebPage name/description/dateModified (CONTENT_DATES.verticals),
 *   BreadcrumbList current item, Service name (navLabel) / description.
 *   FAQPage is left to PageSeo (page.faqs) so the route emits it once
 * - Boot shell: breadcrumb, eyebrow, H1, summary, key points, CTAs, formats
 *   list (deliverable titles), noscript lead + list, noscript FAQ
 *
 * Idempotent. Runs in prebuild via `npm run vertical:entrypoints`.
 */
import { loadTsModule } from './lib/load-ts-module.mjs';
import {
  entryFileForPath,
  escapeText,
  findGraphNode,
  readEntry,
  replaceRequired,
  removeBootSignature,
  setBootAction,
  setBootBreadcrumbCurrent,
  setBootLabel,
  setBootPanelList,
  setBootPanelIntro,
  setBootPoints,
  setBootSummary,
  setBootTitle,
  setHeadMeta,
  setLastBreadcrumbName,
  setNoscriptLead,
  setNoscriptLeadList,
  setNoscriptLeadListTitle,
  updateJsonLd,
  withFileContext,
  writeEntryIfChanged,
} from './lib/entry-html.mjs';

const { getAllVerticalIds, getVerticalPageContent } = await loadTsModule('src/data/vertical-pages.ts');
const { CONTENT_DATES } = await loadTsModule('src/data/content-dates.ts');

const LOCALES = ['es', 'en'];

const syncSchema = (source, page) =>
  updateJsonLd(source, (schema) => {
    const webPage = findGraphNode(schema, 'WebPage');
    if (!webPage) throw new Error('Expected WebPage node in JSON-LD');
    webPage.name = page.metaTitle;
    webPage.description = page.metaDescription;
    webPage.dateModified = CONTENT_DATES.verticals;

    setLastBreadcrumbName(schema, page.breadcrumbLabel);

    const service = findGraphNode(schema, 'Service');
    if (service) {
      service.name = page.navLabel;
      service.description = page.metaDescription;
    }
  });

/** Noscript FAQ: the <h3> + <dl> pair inside the noscript article. */
const syncNoscriptFaq = (source, page) =>
  replaceRequired(
    source,
    /(<article class="boot-noscript">[\s\S]*?)<h3>[^<]*<\/h3>(\s*)<dl>[\s\S]*?<\/dl>/u,
    (_match, before, gap) => {
      const items = page.faqs
        .map(
          (faq) => `
            <dt>${escapeText(faq.question)}</dt>
            <dd>${escapeText(faq.answer)}</dd>`,
        )
        .join('');
      return `${before}<h3>${escapeText(page.faqTitle)}</h3>${gap}<dl>${items}
          </dl>`;
    },
    'noscript FAQ h3 + dl',
  );

const syncBootShell = (source, page) => {
  let next = setBootBreadcrumbCurrent(source, page.breadcrumbLabel);
  next = setBootLabel(next, page.heroEyebrow);
  next = setBootTitle(next, page.heroTitle);
  next = setBootSummary(next, page.heroSummary);
  next = setBootPoints(next, page.heroPoints);
  next = setBootAction(next, 'boot-primary', { href: page.primaryCtaHref, label: page.primaryCtaLabel });
  next = setBootAction(next, 'boot-secondary', { href: page.secondaryCtaHref, label: page.secondaryCtaLabel });
  const formatTitles = page.deliverables.map((item) => item.title);
  next = setBootPanelList(next, formatTitles);
  next = setBootPanelIntro(next, {
    title: page.sectionIntroTitle,
    text: page.sectionIntroText,
    listTitle: page.deliverablesTitle,
  });
  next = removeBootSignature(next);
  next = setNoscriptLead(next, { title: page.heroTitle, summary: page.heroSummary });
  next = setNoscriptLeadListTitle(next, page.deliverablesTitle);
  next = setNoscriptLeadList(next, formatTitles);
  next = syncNoscriptFaq(next, page);
  return next;
};

let total = 0;
let changed = 0;

for (const verticalId of getAllVerticalIds()) {
  for (const locale of LOCALES) {
    const page = getVerticalPageContent(verticalId, locale);
    const file = entryFileForPath(page.path);
    const source = readEntry(file);

    const updated = withFileContext(file, () => {
      let next = setHeadMeta(source, {
        title: page.metaTitle,
        description: page.metaDescription,
        imageAlt: page.heroTitle,
      });
      next = syncSchema(next, page);
      next = syncBootShell(next, page);
      return next;
    });

    total += 1;
    if (writeEntryIfChanged(file, source, updated)) changed += 1;
  }
}

console.log(`Synced ${total} vertical entrypoints from vertical-pages.ts (${changed} changed)`);
