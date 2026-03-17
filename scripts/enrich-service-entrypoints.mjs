import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

const serviceFaqs = [
  {
    file: 'servicios/creadora-ugc-bilingue/index.html',
    canonical: 'https://www.giselasaldarriaga.com/servicios/creadora-ugc-bilingue/',
    locale: 'es',
    faqTitle: 'Preguntas frecuentes sobre UGC bilingüe',
    faqs: [
      {
        question: '¿Trabajas tanto en español como en inglés?',
        answer:
          'Sí. El español es mi idioma nativo y también trabajo en inglés para piezas breves y comerciales. Cuando el proyecto es en inglés, prefiero partir de un guion o una estructura clara para mantener naturalidad y precisión.',
      },
      {
        question: '¿Puedes grabar una misma pieza en dos idiomas?',
        answer:
          'Sí. Puedo producir versiones paralelas para campañas que necesitan consistencia de mensaje entre mercados sin dividir la producción entre dos creadoras.',
      },
      {
        question: '¿Qué tipo de marcas encajan mejor aquí?',
        answer:
          'Principalmente ecommerce, beauty, lifestyle, SaaS y tecnología que necesitan una creadora con presencia natural frente a cámara y criterio comercial.',
      },
      {
        question: '¿Esto sirve solo para ads?',
        answer:
          'No. También funciona para landings, páginas de producto, creativos orgánicos, demos, testimoniales y piezas de apoyo para equipos de ventas.',
      },
    ],
  },
  {
    file: 'en/services/bilingual-ugc-creator/index.html',
    canonical: 'https://www.giselasaldarriaga.com/en/services/bilingual-ugc-creator/',
    locale: 'en',
    faqTitle: 'FAQs about bilingual UGC work',
    faqs: [
      {
        question: 'Do you work in both Spanish and English?',
        answer:
          'Yes. Spanish is my native language, and I also work in English for short commercial pieces. For English projects, I prefer to start from a script or a clear structure to keep the delivery natural and precise.',
      },
      {
        question: 'Can you record the same concept in two languages?',
        answer:
          'Yes. I can produce paired Spanish and English versions for campaigns that need one consistent message across markets.',
      },
      {
        question: 'Which brands are usually the best fit?',
        answer:
          'Mostly ecommerce, beauty, lifestyle, SaaS, and tech teams that need a creator with natural on-camera presence and clear commercial instincts.',
      },
      {
        question: 'Is this only for paid ads?',
        answer:
          'No. It also works for landing pages, product pages, organic social, demos, reviews, and sales-support content.',
      },
    ],
  },
  {
    file: 'servicios/videos-de-portavoz/index.html',
    canonical: 'https://www.giselasaldarriaga.com/servicios/videos-de-portavoz/',
    locale: 'es',
    faqTitle: 'Preguntas frecuentes sobre videos de portavoz',
    faqs: [
      {
        question: '¿Cuál es la diferencia entre portavoz y UGC casual?',
        answer:
          'El portavoz suele tener una estructura más clara y una entrega más intencional frente a cámara. Sigue siendo cercano, pero está pensado para explicar mejor una oferta, un lanzamiento o un servicio.',
      },
      {
        question: '¿Sirve para páginas web además de anuncios?',
        answer:
          'Sí. Funciona muy bien en homepages, landings y páginas de producto cuando necesitas que alguien presente el valor en pocos segundos.',
      },
      {
        question: '¿Necesito enviar un guion?',
        answer:
          'No necesariamente. Puedes enviar un guion cerrado o solo los puntos clave. Lo importante es que el mensaje tenga prioridad y orden.',
      },
      {
        question: '¿Se puede combinar con demos o B-roll?',
        answer:
          'Sí. Muchas de las piezas más útiles mezclan speaking to camera con inserts, producto en uso o texto en pantalla para reforzar el mensaje.',
      },
    ],
  },
  {
    file: 'en/services/spokesperson-videos/index.html',
    canonical: 'https://www.giselasaldarriaga.com/en/services/spokesperson-videos/',
    locale: 'en',
    faqTitle: 'FAQs about spokesperson videos',
    faqs: [
      {
        question: 'What is the difference between spokesperson delivery and casual UGC?',
        answer:
          'Spokesperson work usually has clearer structure and more intentional on-camera delivery. It still feels human, but it is designed to explain the offer, launch, or service more clearly.',
      },
      {
        question: 'Can this be used on websites as well as ads?',
        answer:
          'Yes. It works particularly well on homepages, landing pages, and product pages when the offer needs a clear front-facing explanation.',
      },
      {
        question: 'Do I need to send a finished script?',
        answer:
          'Not necessarily. You can send a final script or just key points. What matters most is that the message is clear and prioritized.',
      },
      {
        question: 'Can it be combined with demos or B-roll?',
        answer:
          'Yes. Many of the strongest pieces combine direct-to-camera delivery with inserts, product usage, or on-screen text to reinforce the message.',
      },
    ],
  },
  {
    file: 'servicios/ugc-ads-tiktok-meta/index.html',
    canonical: 'https://www.giselasaldarriaga.com/servicios/ugc-ads-tiktok-meta/',
    locale: 'es',
    faqTitle: 'Preguntas frecuentes sobre UGC Ads',
    faqs: [
      {
        question: '¿Haces creativos específicamente para TikTok Ads y Meta Ads?',
        answer:
          'Sí. La estructura y el ritmo se piensan para paid social: hooks más rápidos, valor visible antes y espacio para que el equipo itere ofertas y versiones.',
      },
      {
        question: '¿Puedes producir varias variaciones dentro de un mismo lote?',
        answer:
          'Sí. Suele ser más útil trabajar por variaciones de hook, beneficio o CTA que por una sola pieza aislada.',
      },
      {
        question: '¿Esto también sirve para landing pages?',
        answer:
          'Sí. Muchos creativos de performance también funcionan muy bien como assets de apoyo en homepages, PDPs y landings.',
      },
      {
        question: '¿Qué necesitas para que esto funcione bien?',
        answer:
          'Idealmente una oferta clara, una idea de público, puntos de dolor o deseo, y cualquier señal previa de qué mensaje ya está funcionando o no.',
      },
    ],
  },
  {
    file: 'en/services/ugc-ads-tiktok-meta/index.html',
    canonical: 'https://www.giselasaldarriaga.com/en/services/ugc-ads-tiktok-meta/',
    locale: 'en',
    faqTitle: 'FAQs about UGC ads',
    faqs: [
      {
        question: 'Do you create assets specifically for TikTok Ads and Meta Ads?',
        answer:
          'Yes. The pacing and structure are built for paid social: faster hooks, earlier value delivery, and space for the team to iterate on offers and versions.',
      },
      {
        question: 'Can you produce multiple variations in one batch?',
        answer:
          'Yes. In most cases it is more useful to work through hook, benefit, or CTA variations than to make only one isolated asset.',
      },
      {
        question: 'Can these creatives also support landing pages?',
        answer:
          'Yes. Many performance creatives also work very well as support assets on homepages, PDPs, and landing pages.',
      },
      {
        question: 'What do you need for this to work well?',
        answer:
          'Ideally a clear offer, a defined audience, a sense of the buyer pain point or desire, and any signal about what messaging is already working or failing.',
      },
    ],
  },
];

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const bootNoScriptStyles = `      .boot-noscript h2,
      .boot-noscript h3 {
        font-family: 'DM Serif Display', serif;
        letter-spacing: -0.04em;
      }
      .boot-noscript dl {
        margin: 0;
      }
      .boot-noscript dt {
        margin-top: 16px;
        font-weight: 700;
      }
      .boot-noscript dd {
        margin: 8px 0 0;
        line-height: 1.8;
      }`;

for (const entry of serviceFaqs) {
  const absolutePath = path.join(rootDir, entry.file);
  const source = fs.readFileSync(absolutePath, 'utf8');
  const schemaMatch = source.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

  if (!schemaMatch) {
    throw new Error(`Missing JSON-LD block in ${entry.file}`);
  }

  const schema = JSON.parse(schemaMatch[1]);
  const graph = Array.isArray(schema['@graph']) ? schema['@graph'] : [];
  const homeUrl = entry.locale === 'en' ? 'https://www.giselasaldarriaga.com/en/' : 'https://www.giselasaldarriaga.com/';

  for (const item of graph) {
    if (item['@type'] === 'WebPage') {
      item.isPartOf = { '@id': 'https://www.giselasaldarriaga.com/#website' };
      item.breadcrumb = { '@id': `${entry.canonical}#breadcrumb` };
      item.mainEntity = { '@id': `${entry.canonical}#service` };
    }

    if (item['@type'] === 'BreadcrumbList' && Array.isArray(item.itemListElement) && item.itemListElement[1]) {
      item.itemListElement[1].item = homeUrl;
    }
  }

  const filteredGraph = graph.filter((item) => item['@type'] !== 'FAQPage');
  filteredGraph.push({
    '@type': 'FAQPage',
    '@id': `${entry.canonical}#faq`,
    inLanguage: entry.locale,
    mainEntity: entry.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });

  const updatedSchema = {
    ...schema,
    '@graph': filteredGraph,
  };

  let updated = source.replace(schemaMatch[0], `<script type="application/ld+json">${JSON.stringify(updatedSchema)}</script>`);

  const faqMarkup = `
          <!-- SERVICE-FAQ-NOSCRIPT -->
          <h3>${escapeHtml(entry.faqTitle)}</h3>
          <dl>
            ${entry.faqs
              .map(
                (faq) => `
            <dt>${escapeHtml(faq.question)}</dt>
            <dd>${escapeHtml(faq.answer)}</dd>`,
              )
              .join('')}
          </dl>
          <!-- /SERVICE-FAQ-NOSCRIPT -->`;

  updated = updated.replace(
    /(?:\s*<!-- SERVICE-FAQ-NOSCRIPT -->[\s\S]*?<!-- \/SERVICE-FAQ-NOSCRIPT -->)?\s*<\/article>/,
    `${faqMarkup}
        </article>`,
  );

  updated = updated.replace(
    /\s*\.boot-noscript h2,\s*\n\s*\.boot-noscript h3 \{[\s\S]*?\n\s*@media \(max-width: 1023px\) \{/,
    `
${bootNoScriptStyles}
      @media (max-width: 1023px) {`,
  );

  fs.writeFileSync(absolutePath, updated);
}

console.log(`Enriched ${serviceFaqs.length} service entrypoints with FAQ schema`);
