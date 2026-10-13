/**
 * expand-boot-shells.mjs
 *
 * Phase 1 of SEO improvement plan: Expands the static boot shell content
 * inside service page <div id="root"> to include deliverables, best-fit/not-fit,
 * process steps, and market items — making this content visible to non-JS
 * crawlers and AI search fetchers (OAI-SearchBot, PerplexityBot, ClaudeBot)
 * that do simple HTTP fetches without rendering JavaScript.
 *
 * Also expands the <noscript> block with the same content.
 *
 * Source: all copy is read from src/data/service-pages.ts (getServicePageContent)
 * and src/lib/service-inner-argument.ts (buildServiceFicha labels, beat
 * headings) through scripts/lib/load-ts-module.mjs. Nothing is hand-copied.
 *
 * Run: node scripts/expand-boot-shells.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { loadTsModule, rootDir } from './lib/load-ts-module.mjs';
import { entryFileForPath } from './lib/entry-html.mjs';

const { getAllServiceIds, getServicePageContent } = await loadTsModule('src/data/service-pages.ts');
const { buildServiceFicha, getInnerBeats } = await loadTsModule('src/lib/service-inner-argument.ts');

// ---------------------------------------------------------------------------
// Service page boot shell expansion data (from src/data/service-pages.ts)
// ---------------------------------------------------------------------------

/**
 * Services whose boot shell also repeats the FAQ list (the GEO-priority
 * bilingual page). Structural choice only; the FAQ copy itself comes from data.
 */
const BOOT_FAQ_SERVICE_IDS = new Set(['bilingual-ugc-creator']);

const serviceBootData = getAllServiceIds().flatMap((serviceId) =>
  ['es', 'en'].map((locale) => {
    const page = getServicePageContent(serviceId, locale);
    const beats = getInnerBeats(locale);
    const beatKicker = (id) => beats.find((beat) => beat.id === id)?.kicker ?? '';
    return {
      ...page,
      file: entryFileForPath(page.path),
      fichaRows: buildServiceFicha(page),
      bootFaqs: BOOT_FAQ_SERVICE_IDS.has(serviceId) ? page.faqs : [],
      fitHeading: beatKicker('encaja'),
      faqHeading: beatKicker('faq'),
    };
  }),
);

// ---------------------------------------------------------------------------
// HTML generation helpers
// ---------------------------------------------------------------------------

const htmlFromInlineCopy = (text) => {
  const parts = [];
  let last = 0;
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match = re.exec(text);
  while (match) {
    if (match.index > last) parts.push(escapeHtml(text.slice(last, match.index)));
    parts.push(`<a href="${escapeHtml(match[2])}">${escapeHtml(match[1])}</a>`);
    last = match.index + match[0].length;
    match = re.exec(text);
  }
  if (last < text.length) parts.push(escapeHtml(text.slice(last)));
  return parts.join('');
};

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

function generateBootShellExpansion(entry) {
  const {
    sectionIntroTitle,
    deliverablesTitle,
    deliverables,
    bestFitTitle,
    bestFitItems,
    notFitTitle,
    notFitItems,
    processTitle,
    processSteps,
    fichaRows,
    geoFact,
    bootFaqs: faqs,
  } = entry;

  return `
        <section class="boot-expanded" aria-label="${escapeHtml(entry.locale === 'es' ? 'Detalles del servicio' : 'Service details')}">
          <h2 class="boot-section-heading">${escapeHtml(sectionIntroTitle)}</h2>
          <dl class="boot-ficha">
            ${fichaRows
              .map(
                (row) => `<dt>${escapeHtml(row.label)}</dt>
            <dd>${escapeHtml(row.value)}</dd>`,
              )
              .join('\n            ')}
          </dl>
          ${geoFact ? `<p class="boot-section-text">${htmlFromInlineCopy(geoFact)}</p>` : ''}

          <h2 class="boot-section-heading">${escapeHtml(deliverablesTitle)}</h2>
          <dl class="boot-dl">
            ${deliverables
              .map(
                (d) => `<dt>${escapeHtml(d.title)}</dt>
            <dd>${escapeHtml(d.description)}</dd>`,
              )
              .join('\n            ')}
          </dl>

          <h2 class="boot-section-heading">${escapeHtml(processTitle)}</h2>
          <ol class="boot-process">
            ${processSteps
              .map((s) => `<li><strong>${escapeHtml(s.title)}</strong> ${escapeHtml(s.description)}</li>`)
              .join('\n            ')}
          </ol>

          <h2 class="boot-section-heading">${escapeHtml(entry.fitHeading)}</h2>
          <h3 class="boot-subsection-heading">${escapeHtml(bestFitTitle)}</h3>
          <ul class="boot-fit-list">
            ${bestFitItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n            ')}
          </ul>
          <h3 class="boot-subsection-heading">${escapeHtml(notFitTitle)}</h3>
          <ul class="boot-fit-list">
            ${notFitItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n            ')}
          </ul>
          ${
            faqs.length > 0
              ? `<h2 class="boot-section-heading">${escapeHtml(entry.faqHeading)}</h2>
          <dl class="boot-dl">
            ${faqs
              .map(
                (faq) => `<dt>${escapeHtml(faq.question)}</dt>
            <dd>${escapeHtml(faq.answer)}</dd>`,
              )
              .join('\n            ')}
          </dl>`
              : ''
          }
        </section>`;
}

function generateNoscriptExpansion(entry) {
  const {
    sectionIntroTitle,
    deliverablesTitle,
    deliverables,
    bestFitTitle,
    bestFitItems,
    notFitTitle,
    notFitItems,
    processTitle,
    processSteps,
    fichaRows,
    geoFact,
    bootFaqs: faqs,
  } = entry;

  return `
          <!-- SERVICE-EXPANDED-NOSCRIPT -->
          <h2>${escapeHtml(sectionIntroTitle)}</h2>
          <dl>
            ${fichaRows
              .map(
                (row) => `<dt>${escapeHtml(row.label)}</dt>
            <dd>${escapeHtml(row.value)}</dd>`,
              )
              .join('\n            ')}
          </dl>
          ${geoFact ? `<p>${htmlFromInlineCopy(geoFact)}</p>` : ''}
          <h2>${escapeHtml(deliverablesTitle)}</h2>
          <dl>
            ${deliverables
              .map(
                (d) => `<dt>${escapeHtml(d.title)}</dt>
            <dd>${escapeHtml(d.description)}</dd>`,
              )
              .join('\n            ')}
          </dl>
          <h2>${escapeHtml(processTitle)}</h2>
          <ol>
            ${processSteps
              .map((s) => `<li><strong>${escapeHtml(s.title)}</strong> ${escapeHtml(s.description)}</li>`)
              .join('\n            ')}
          </ol>
          <h2>${escapeHtml(entry.fitHeading)}</h2>
          <h3>${escapeHtml(bestFitTitle)}</h3>
          <ul>
            ${bestFitItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n            ')}
          </ul>
          <h3>${escapeHtml(notFitTitle)}</h3>
          <ul>
            ${notFitItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n            ')}
          </ul>
          ${
            faqs.length > 0
              ? `<h2>${escapeHtml(entry.faqHeading)}</h2>
          <dl>
            ${faqs
              .map(
                (faq) => `<dt>${escapeHtml(faq.question)}</dt>
            <dd>${escapeHtml(faq.answer)}</dd>`,
              )
              .join('\n            ')}
          </dl>`
              : ''
          }
          <!-- /SERVICE-EXPANDED-NOSCRIPT -->`;
}

/**
 * CSS for boot-expanded sections (inline in <style>).
 * Styled minimally so the content is readable before React replaces it.
 */
const bootExpandedStyles = `      .boot-expanded {
        max-width: 840px;
        margin: 48px auto 0;
        padding: 0 24px;
      }
      .boot-section-heading {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-weight: 700;
        font-size: 1.8rem;
        letter-spacing: -0.04em;
        margin: 0 0 12px;
      }
      .boot-section-text {
        line-height: 1.8;
        color: rgba(47,42,36,0.72);
        margin: 0 0 28px;
      }
      .boot-subsection-heading {
        font-family: 'DM Sans', system-ui, sans-serif;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #9f9366;
        margin: 24px 0 12px;
      }
      .boot-ficha {
        margin: 0 0 20px;
      }
      .boot-ficha dt {
        font-family: 'DM Sans', system-ui, sans-serif;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #9f9366;
        margin-top: 16px;
      }
      .boot-ficha dd {
        margin: 6px 0 0;
        line-height: 1.8;
        color: rgba(47,42,36,0.78);
      }
      .boot-dl dt {
        font-weight: 600;
        margin-top: 14px;
      }
      .boot-dl dd {
        margin: 6px 0 0;
        line-height: 1.8;
        color: rgba(47,42,36,0.72);
      }
      .boot-fit-list {
        margin: 0 0 20px;
        padding-left: 18px;
        line-height: 1.85;
        color: rgba(47,42,36,0.74);
      }
      .boot-fit-list li + li { margin-top: 6px; }
      .boot-process {
        margin: 0 0 20px;
        padding-left: 18px;
        line-height: 1.85;
        color: rgba(47,42,36,0.74);
      }
      .boot-process li + li { margin-top: 10px; }
      .boot-process strong {
        color: #2f2a24;
      }`;

// ---------------------------------------------------------------------------
// Main processing loop
// ---------------------------------------------------------------------------

let modified = 0;

for (const entry of serviceBootData) {
  const absolutePath = path.join(rootDir, entry.file);

  if (!fs.existsSync(absolutePath)) {
    console.warn(`  SKIP: ${entry.file} not found`);
    continue;
  }

  let source = fs.readFileSync(absolutePath, 'utf8');

  // 1. Inject boot-expanded styles (before @media breakpoint rule)
  if (!source.includes('.boot-expanded {')) {
    source = source.replace(
      /\s*@media \(max-width: 1023px\) \{/,
      `\n${bootExpandedStyles}\n      @media (max-width: 1023px) {`,
    );
  } else if (!source.includes('.boot-ficha {')) {
    source = source.replace(
      '      .boot-dl {',
      `      .boot-ficha {
        margin: 0 0 20px;
      }
      .boot-ficha dt {
        font-family: 'DM Sans', system-ui, sans-serif;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #9f9366;
        margin-top: 16px;
      }
      .boot-ficha dd {
        margin: 6px 0 0;
        line-height: 1.8;
        color: rgba(47,42,36,0.78);
      }
      .boot-dl {`,
    );
  }

  const bootExpansionHtml = generateBootShellExpansion(entry);
  if (source.includes('class="boot-expanded"')) {
    source = source.replace(
      /<section class="boot-expanded"[\s\S]*?<\/section>(?=\s*<\/section>\s*<noscript>)/u,
      () => bootExpansionHtml.trim(),
    );
  } else {
    source = source.replace(
      /( {6}<\/section>\n {6}<noscript>)/,
      () => `${bootExpansionHtml}\n      </section>\n      <noscript>`,
    );
  }

  const noscriptExpansionHtml = generateNoscriptExpansion(entry);
  if (source.includes('SERVICE-EXPANDED-NOSCRIPT')) {
    source = source.replace(
      /<!-- SERVICE-EXPANDED-NOSCRIPT -->[\s\S]*?<!-- \/SERVICE-EXPANDED-NOSCRIPT -->/u,
      () => noscriptExpansionHtml.trim(),
    );
  } else {
    source = source.replace(
      /(\s*<!-- SERVICE-FAQ-NOSCRIPT -->)/,
      (_match, marker) => `${noscriptExpansionHtml}\n${marker}`,
    );
  }

  fs.writeFileSync(absolutePath, source);
  modified++;
}

console.log(`Expanded ${modified} service entrypoints with boot shell content`);
