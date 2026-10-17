/**
 * Sync the static service entrypoints (servicios/<slug>/index.html and
 * en/services/<slug>/index.html) with src/data/service-pages.ts.
 *
 * PageSeo only sets <title>/meta from a useEffect and prerender replaces only
 * #root, so the committed <head> (title, meta, og/twitter, JSON-LD) is what
 * ships and what non-rendering crawlers read. All copy here comes from the
 * TypeScript data via scripts/lib/load-ts-module.mjs — no hand-copied strings.
 *
 * Writes, per service × locale:
 * - <title>, meta description, og:/twitter: title + description (metaTitle /
 *   metaDescription), og:/twitter: image alt (heroTitle)
 * - JSON-LD: WebPage name/description/dateModified, BreadcrumbList current
 *   item, Service name/description (+ AggregateRating only where the page
 *   carries the Fiverr GEO fact, same rule as ServiceLandingPage). FAQPage is
 *   stripped: it lives only in PageSeo (page.faqs), see the note below
 * - Boot shell: breadcrumb, eyebrow, H1, summary, key points, CTAs, formats
 *   list (deliverable titles), noscript lead, noscript FAQ
 *
 * Idempotent. Runs in prebuild via `npm run service:entrypoints`.
 */
import { loadTsModule } from './lib/load-ts-module.mjs';
import {
  SITE_URL,
  entryFileForPath,
  findGraphNode,
  readEntry,
  removeBootSignature,
  setBootAction,
  setBootBreadcrumbCurrent,
  setBootBreadcrumbHub,
  setBootLabel,
  setBootPanelList,
  setBootPanelIntro,
  setBootPoints,
  setBootSummary,
  setBootTitle,
  setHeadMeta,
  setHubBreadcrumb,
  setLastBreadcrumbName,
  setNoscriptLead,
  setNoscriptLeadList,
  setNoscriptLeadListTitle,
  updateJsonLd,
  withFileContext,
  writeEntryIfChanged,
} from './lib/entry-html.mjs';

const { getAllServiceIds, getServicePageContent } = await loadTsModule('src/data/service-pages.ts');
const { CONTENT_DATES } = await loadTsModule('src/data/content-dates.ts');
const { FIVERR_AGGREGATE_RATING } = await loadTsModule('src/data/site-proof.ts');
const { HUB_LABELS } = await loadTsModule('src/data/hub-labels.ts');
const { getHubPath } = await loadTsModule('src/lib/locale-path.ts');

const LOCALES = ['es', 'en'];

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const bootNoScriptStyles = `      .boot-noscript h2,
      .boot-noscript h3 {
        font-family: 'Cormorant Garamond', Georgia, serif;
        letter-spacing: -0.04em;
      }
      .boot-noscript dl {
        margin: 0;
      }
      .boot-noscript dt {
        margin-top: 16px;
        font-family: 'DM Sans', system-ui, sans-serif;
        font-weight: 600;
      }
      .boot-noscript dd {
        margin: 8px 0 0;
        font-family: 'DM Sans', system-ui, sans-serif;
        line-height: 1.8;
      }`;

const syncSchema = (source, page, canonical) =>
  updateJsonLd(source, (schema) => {
    const graph = Array.isArray(schema['@graph']) ? schema['@graph'] : [];
    for (const item of graph) {
      if (item['@type'] === 'WebPage') {
        item.name = page.metaTitle;
        item.description = page.metaDescription;
        item.dateModified = CONTENT_DATES.services;
        item.isPartOf = { '@id': `${SITE_URL}/#website` };
        item.breadcrumb = { '@id': `${canonical}#breadcrumb` };
        item.mainEntity = { '@id': `${canonical}#service` };
      }

      if (item['@type'] === 'Service') {
        item.name = page.navLabel;
        item.description = page.metaDescription;
        if (page.geoFact) {
          item.aggregateRating = { ...FIVERR_AGGREGATE_RATING };
        } else {
          delete item.aggregateRating;
        }
      }
    }
    setHubBreadcrumb(schema, {
      name: HUB_LABELS.services[page.locale],
      item: `${SITE_URL}${getHubPath('services', page.locale)}`,
    });
    setLastBreadcrumbName(schema, page.breadcrumbLabel);

    // FAQPage lives only in PageSeo (page.faqs). A second copy here made every
    // service route emit FAQPage twice after prerender. Keep the boot graph for
    // WebPage / BreadcrumbList / Service; leave FAQ to the React tree.
    const filteredGraph = graph.filter((item) => item['@type'] !== 'FAQPage');

    if (!findGraphNode({ '@graph': filteredGraph }, 'Service')) {
      throw new Error('Expected Service node in JSON-LD');
    }

    return { ...schema, '@graph': filteredGraph };
  });

const syncBootShell = (source, page) => {
  let next = setBootBreadcrumbCurrent(source, page.breadcrumbLabel);
  next = setBootBreadcrumbHub(next, HUB_LABELS.services[page.locale]);
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
  return next;
};

const syncNoscriptFaq = (source, page) => {
  const faqMarkup = `
          <!-- SERVICE-FAQ-NOSCRIPT -->
          <h3>${escapeHtml(page.faqTitle)}</h3>
          <dl>
            ${page.faqs
              .map(
                (faq) => `
            <dt>${escapeHtml(faq.question)}</dt>
            <dd>${escapeHtml(faq.answer)}</dd>`,
              )
              .join('')}
          </dl>
          <!-- /SERVICE-FAQ-NOSCRIPT -->`;

  let next = source.replace(
    /(?:\s*<!-- SERVICE-FAQ-NOSCRIPT -->[\s\S]*?<!-- \/SERVICE-FAQ-NOSCRIPT -->)?\s*<\/article>/,
    () => `${faqMarkup}
        </article>`,
  );

  next = next.replace(
    /      \.boot-noscript h2,\s*\n\s*\.boot-noscript h3 \{[\s\S]*?\.boot-noscript dd \{[\s\S]*?\n      \}/,
    () => bootNoScriptStyles,
  );
  return next;
};

let total = 0;
let changed = 0;

for (const serviceId of getAllServiceIds()) {
  for (const locale of LOCALES) {
    const page = getServicePageContent(serviceId, locale);
    const file = entryFileForPath(page.path);
    const canonical = `${SITE_URL}${page.path}`;
    const source = readEntry(file);

    const updated = withFileContext(file, () => {
      let next = setHeadMeta(source, {
        title: page.metaTitle,
        description: page.metaDescription,
        imageAlt: page.heroTitle,
      });
      next = syncSchema(next, page, canonical);
      next = syncBootShell(next, page);
      next = syncNoscriptFaq(next, page);
      return next;
    });

    total += 1;
    if (writeEntryIfChanged(file, source, updated)) changed += 1;
  }
}

console.log(`Synced ${total} service entrypoints from service-pages.ts (${changed} changed)`);
