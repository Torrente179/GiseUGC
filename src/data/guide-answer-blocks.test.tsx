import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { LocaleProvider } from '@/lib/locale-context';
import ResourcePage from '@/components/ResourcePage';
import Index from '@/pages/Index';
import FAQ from '@/components/FAQ';
import { buildResourceLandingRouteData } from '@/data/landing-route-data.server';
import {
  FIVERR_PRICING,
  GUIDE_ANSWER_BLOCKS,
  getResourcePageContent,
} from '@/data/resource-pages';
import { SITE_PROOF } from '@/data/site-proof';
import {
  HOMEPAGE_FAQ_COST_QUESTION,
  HOMEPAGE_FAQ_GUIDE_SENTENCES,
  HOMEPAGE_FAQ_PROCESS_QUESTION,
  getHomepageFaqItems,
  getHomepageFaqSchemaItems,
} from '@/data/homepage-faq';
import { inlineCopyHrefs, visibleInlineCopy } from '@/lib/inline-copy-links';
import { getHomePath, getResourcePath, type SiteLocale } from '@/lib/locale-path';

const root = resolve(process.cwd());
const read = (relative: string) => readFileSync(resolve(root, relative), 'utf8');

const visibleHtml = (html: string) =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, '')
    .replace(/&#x27;/giu, "'")
    .replace(/&amp;/giu, '&');

const stripTags = (html: string) =>
  visibleHtml(html)
    .replace(/<[^>]+>/gu, '')
    .replace(/\s+/gu, ' ');

const decodeJsonLd = (raw: string) => raw.replace(/\\u003c/giu, '<');

const jsonLdScripts = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/giu)].map(
    (block) => decodeJsonLd(block[1] ?? ''),
  );

const extractFaqPages = (html: string) => {
  const pages: Array<Array<{ question: string; answer: string }>> = [];

  for (const raw of jsonLdScripts(html)) {
    const data = JSON.parse(raw) as Record<string, unknown>;
    const graph = Array.isArray(data['@graph'])
      ? (data['@graph'] as Array<Record<string, unknown>>)
      : [data];
    for (const node of graph) {
      if (node['@type'] !== 'FAQPage') continue;
      const entities = (node.mainEntity as Array<Record<string, unknown>> | undefined) ?? [];
      pages.push(
        entities.map((entity) => ({
          question: String(entity.name ?? ''),
          answer: String((entity.acceptedAnswer as { text?: string } | undefined)?.text ?? ''),
        })),
      );
    }
  }

  return pages;
};

const GUIDE_PAGES = [
  {
    id: 'how-to-hire-ugc-creator' as const,
    locale: 'es' as const,
    shell: 'recursos/como-contratar-creadora-ugc/index.html',
    phrases: [
      'Gisela Saldarriaga',
      '9 años de experiencia como periodista',
      'Mis paquetes UGC en Fiverr empiezan en $40',
    ],
    unique: 'Para contratar una creadora UGC, define qué videos necesitas',
    lead: 'Contratar una creadora UGC no es lo mismo que contratar a una influencer',
  },
  {
    id: 'how-to-hire-ugc-creator' as const,
    locale: 'en' as const,
    shell: 'en/resources/how-to-hire-ugc-creator/index.html',
    phrases: [
      'Gisela Saldarriaga',
      '9 years of experience as a journalist',
      'My UGC packages on Fiverr start at $40',
    ],
    unique: 'To hire a UGC creator, decide which videos you need',
    lead: 'Hiring a UGC creator isn’t the same as hiring an influencer',
  },
  {
    id: 'how-much-ugc-creator-charge' as const,
    locale: 'es' as const,
    shell: 'recursos/cuanto-cobra-creadora-ugc/index.html',
    phrases: [
      'Gisela Saldarriaga',
      '9 años de experiencia como periodista',
      'Mis paquetes UGC en Fiverr empiezan en $40',
    ],
    unique: 'un video de portavoz en español cuesta de $25 a $75 y una voz en off, $20',
    lead: 'Si quieres saber cuánto cuesta un video UGC antes de escribirme',
  },
  {
    id: 'how-much-ugc-creator-charge' as const,
    locale: 'en' as const,
    shell: 'en/resources/how-much-does-a-ugc-creator-charge/index.html',
    phrases: [
      'Gisela Saldarriaga',
      '9 years of experience as a journalist',
      'My UGC packages on Fiverr start at $40',
    ],
    unique: 'a Spanish spokesperson video costs $25 to $75, and a Spanish voiceover is $20',
    lead: 'If you want to know what a UGC video costs before you message me',
  },
] as const;

const renderResource = (id: (typeof GUIDE_PAGES)[number]['id'], locale: SiteLocale) => {
  const page = getResourcePageContent(id, locale);
  const raw = renderToStaticMarkup(
    <StaticRouter location={page.path}>
      <LocaleProvider>
        <ResourcePage resourceId={id} locale={locale} routeData={buildResourceLandingRouteData(id, locale)} />
      </LocaleProvider>
    </StaticRouter>,
  );
  return { raw, html: visibleHtml(raw), page };
};

const renderHome = (locale: SiteLocale) => {
  const path = getHomePath(locale);
  const raw = renderToStaticMarkup(
    <StaticRouter location={path}>
      <LocaleProvider>
        <Index locale={locale} />
      </LocaleProvider>
    </StaticRouter>,
  );
  return { raw, html: visibleHtml(raw), path };
};

const renderFaq = (locale: SiteLocale) => {
  const path = getHomePath(locale);
  const raw = renderToStaticMarkup(
    <StaticRouter location={path}>
      <LocaleProvider>
        <FAQ />
      </LocaleProvider>
    </StaticRouter>,
  );
  return { raw, html: visibleHtml(raw) };
};

describe('guide answer-block prices and proof match the live constants', () => {
  it('locks FIVERR_PRICING and SITE_PROOF to the approved figures', () => {
    expect(FIVERR_PRICING.ugc.basic.price).toBe(40);
    expect(FIVERR_PRICING.ugc.premium.price).toBe(120);
    expect(FIVERR_PRICING.spokesperson.words65.price).toBe(25);
    expect(FIVERR_PRICING.spokesperson.words260.price).toBe(75);
    expect(FIVERR_PRICING.voiceover.price).toBe(20);
    expect(SITE_PROOF.fiverrRating).toBe(4.7);
    expect(SITE_PROOF.fiverrReviewCount).toBe(177);
  });

  it('interpolates those constants into every answer block', () => {
    const hireEs = GUIDE_ANSWER_BLOCKS['how-to-hire-ugc-creator'].es;
    const hireEn = GUIDE_ANSWER_BLOCKS['how-to-hire-ugc-creator'].en;
    const priceEs = GUIDE_ANSWER_BLOCKS['how-much-ugc-creator-charge'].es;
    const priceEn = GUIDE_ANSWER_BLOCKS['how-much-ugc-creator-charge'].en;

    expect(hireEs).toContain(`$${FIVERR_PRICING.ugc.basic.price}`);
    expect(hireEn).toContain(`$${FIVERR_PRICING.ugc.basic.price}`);
    expect(hireEs).toContain(`${SITE_PROOF.fiverrRating}/5 en ${SITE_PROOF.fiverrReviewCount} reseñas`);
    expect(hireEn).toContain(`${SITE_PROOF.fiverrRating}/5 from ${SITE_PROOF.fiverrReviewCount} reviews`);
    expect(priceEs).toContain(`$${FIVERR_PRICING.ugc.basic.price}`);
    expect(priceEs).toContain(`$${FIVERR_PRICING.ugc.premium.price}`);
    expect(priceEs).toContain(`$${FIVERR_PRICING.spokesperson.words65.price}`);
    expect(priceEs).toContain(`$${FIVERR_PRICING.spokesperson.words260.price}`);
    expect(priceEs).toContain(`$${FIVERR_PRICING.voiceover.price}`);
    expect(priceEn).toContain(`$${FIVERR_PRICING.ugc.basic.price}`);
    expect(priceEn).toContain(`$${FIVERR_PRICING.ugc.premium.price}`);
    expect(priceEn).toContain(`$${FIVERR_PRICING.spokesperson.words65.price}`);
    expect(priceEn).toContain(`$${FIVERR_PRICING.spokesperson.words260.price}`);
    expect(priceEn).toContain(`$${FIVERR_PRICING.voiceover.price}`);
  });
});

describe('guide pages prerender the answer block under the H1, not in JSON-LD', () => {
  it.each(GUIDE_PAGES)('$shell contains the block above the lead and keeps one H1', (guide) => {
    const { raw, html, page } = renderResource(guide.id, guide.locale);
    expect(page.answerBlock).toBe(GUIDE_ANSWER_BLOCKS[guide.id][guide.locale]);
    expect((html.match(/<h1\b/gu) ?? []).length).toBe(1);

    const h1At = html.indexOf('<h1');
    const blockAt = html.indexOf(guide.unique);
    const leadAt = html.indexOf(guide.lead);
    expect(h1At).toBeGreaterThan(-1);
    expect(blockAt).toBeGreaterThan(h1At);
    expect(leadAt).toBeGreaterThan(blockAt);

    for (const phrase of guide.phrases) {
      expect(html).toContain(phrase);
    }
    expect(html).toContain(page.answerBlock ?? '');
    expect(html.toLowerCase()).not.toContain('giseugc');

    const jsonLd = jsonLdScripts(raw).join('\n');
    expect(jsonLd).not.toContain(guide.unique);
    expect(jsonLd).not.toContain(page.answerBlock ?? '');

    const shell = read(guide.shell);
    expect(shell).toContain(guide.unique);
    for (const phrase of guide.phrases) {
      expect(shell).toContain(phrase);
    }
    const shellJsonLd = jsonLdScripts(shell).join('\n');
    expect(shellJsonLd).not.toContain(guide.unique);
    expect(shellJsonLd).not.toContain(page.answerBlock ?? '');
  });
});

describe('pricing guide leads drop the name clause and the $40 sentence', () => {
  it('ES and EN leads start at the next clause and no longer name the $40 start', () => {
    const es = getResourcePageContent('how-much-ugc-creator-charge', 'es');
    const en = getResourcePageContent('how-much-ugc-creator-charge', 'en');
    expect(es.heroSummary.startsWith('Si quieres saber cuánto cuesta un video UGC antes de escribirme')).toBe(true);
    expect(en.heroSummary.startsWith('If you want to know what a UGC video costs before you message me')).toBe(true);
    expect(es.heroSummary).not.toMatch(/^Soy Gisela Saldarriaga/u);
    expect(en.heroSummary).not.toMatch(/^I'm Gisela Saldarriaga/u);
    expect(es.heroSummary).not.toContain(
      `Mis paquetes UGC en Fiverr empiezan en $${FIVERR_PRICING.ugc.basic.price} por un video en español.`,
    );
    expect(en.heroSummary).not.toContain(
      `My UGC packages on Fiverr start at $${FIVERR_PRICING.ugc.basic.price} for one video in Spanish.`,
    );
    expect(es.heroSummary).toContain('Los proyectos personalizados o directos se cotizan');
    expect(en.heroSummary).toContain('Custom and direct projects are quoted');
    expect(es.metaDescription).not.toContain('Soy Gisela Saldarriaga, creadora UGC bilingüe en Medellín');
    expect(en.metaDescription).not.toContain("I'm Gisela Saldarriaga, a bilingual UGC creator based in Medellín");
  });
});

describe('homepage FAQ guide links stay in visible answers and FAQPage schema', () => {
  it.each(['es', 'en'] as const)(
    '%s visible answers and acceptedAnswer.text match for the four linked questions',
    (locale) => {
      const items = getHomepageFaqItems(locale);
      const process = items.find((item) => item.question === HOMEPAGE_FAQ_PROCESS_QUESTION[locale]);
      const cost = items.find((item) => item.question === HOMEPAGE_FAQ_COST_QUESTION[locale]);
      expect(process).toBeTruthy();
      expect(cost).toBeTruthy();

      expect(process?.answer.endsWith(HOMEPAGE_FAQ_GUIDE_SENTENCES[locale].process)).toBe(true);
      expect(cost?.answer.endsWith(HOMEPAGE_FAQ_GUIDE_SENTENCES[locale].cost)).toBe(true);
      expect(cost?.answer).toContain(`$${FIVERR_PRICING.ugc.basic.price}`);

      const hireHref = getResourcePath('how-to-hire-ugc-creator', locale);
      const priceHref = getResourcePath('how-much-ugc-creator-charge', locale);
      expect(inlineCopyHrefs(process?.answer ?? '')).toEqual([hireHref]);
      expect(inlineCopyHrefs(cost?.answer ?? '')).toEqual([priceHref]);

      const { html: faqHtml } = renderFaq(locale);
      const { raw: homeRaw, html: homeHtml } = renderHome(locale);
      const visible = stripTags(faqHtml);
      expect(visible).toContain(visibleInlineCopy(process?.answer ?? ''));
      expect(visible).toContain(visibleInlineCopy(cost?.answer ?? ''));
      expect(faqHtml).toContain(`href="${hireHref}"`);
      expect(faqHtml).toContain(`href="${priceHref}"`);
      expect(homeHtml).toContain(`href="${hireHref}"`);
      expect(homeHtml).toContain(`href="${priceHref}"`);

      const faqPages = extractFaqPages(homeRaw);
      expect(faqPages).toHaveLength(1);
      const schema = faqPages[0] ?? [];
      const schemaItems = getHomepageFaqSchemaItems(locale);
      expect(schema).toEqual(
        schemaItems.map((item) => ({
          question: item.question,
          answer: visibleInlineCopy(item.answer),
        })),
      );

      const schemaProcess = schema.find((item) => item.question === HOMEPAGE_FAQ_PROCESS_QUESTION[locale]);
      const schemaCost = schema.find((item) => item.question === HOMEPAGE_FAQ_COST_QUESTION[locale]);
      expect(schemaProcess?.answer).toBe(visibleInlineCopy(process?.answer ?? ''));
      expect(schemaCost?.answer).toBe(visibleInlineCopy(cost?.answer ?? ''));
      expect(schemaProcess?.answer).toContain(visibleInlineCopy(HOMEPAGE_FAQ_GUIDE_SENTENCES[locale].process));
      expect(schemaCost?.answer).toContain(visibleInlineCopy(HOMEPAGE_FAQ_GUIDE_SENTENCES[locale].cost));
      expect(homeRaw.toLowerCase()).not.toContain('giseugc');
    },
  );

  it('boot homepage FAQPage matches the same four answers', () => {
    for (const locale of ['es', 'en'] as const) {
      const file = locale === 'es' ? 'index.html' : 'en/index.html';
      const faqPages = extractFaqPages(read(file));
      expect(faqPages).toHaveLength(1);
      const schema = faqPages[0] ?? [];
      const process = getHomepageFaqItems(locale).find(
        (item) => item.question === HOMEPAGE_FAQ_PROCESS_QUESTION[locale],
      );
      const cost = getHomepageFaqItems(locale).find((item) => item.question === HOMEPAGE_FAQ_COST_QUESTION[locale]);
      expect(schema.find((item) => item.question === HOMEPAGE_FAQ_PROCESS_QUESTION[locale])?.answer).toBe(
        visibleInlineCopy(process?.answer ?? ''),
      );
      expect(schema.find((item) => item.question === HOMEPAGE_FAQ_COST_QUESTION[locale])?.answer).toBe(
        visibleInlineCopy(cost?.answer ?? ''),
      );
    }
  });
});
