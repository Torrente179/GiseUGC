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
  // --- Testimonials / Reviews ---
  {
    file: 'servicios/testimoniales-resenas-ugc/index.html',
    canonical: 'https://www.giselasaldarriaga.com/servicios/testimoniales-resenas-ugc/',
    locale: 'es',
    faqTitle: 'Preguntas frecuentes sobre reseñas UGC',
    faqs: [
      {
        question: '¿Cuál es la diferencia entre una reseña UGC y un anuncio?',
        answer:
          'La reseña UGC tiene formato de experiencia real: se siente como la opinión de alguien que probó el producto. Un anuncio puede ser más directo y vendedor. Lo interesante es que muchas reseñas UGC funcionan muy bien como anuncios justamente porque generan más confianza.',
      },
      {
        question: '¿Necesito enviarte el producto?',
        answer:
          'Depende del tipo de reseña. Para productos físicos suelo necesitar el producto en mano. Para servicios digitales, apps o SaaS puedo trabajar con acceso o con un brief detallado.',
      },
      {
        question: '¿Puedo usar los testimoniales tanto en ads como en mi web?',
        answer:
          'Sí. De hecho esa es una de las ventajas principales: un buen video testimonial de producto funciona en Meta Ads, TikTok, páginas de producto, landings y hasta en secuencias de email.',
      },
      {
        question: '¿Qué tan largo debe ser un video testimonial?',
        answer:
          'Para ads suelo recomendar entre 30 y 60 segundos. Para páginas de producto o landings puede ser un poco más largo si el beneficio lo justifica. Lo importante es que cada segundo tenga valor.',
      },
    ],
  },
  {
    file: 'en/services/ugc-testimonials-reviews/index.html',
    canonical: 'https://www.giselasaldarriaga.com/en/services/ugc-testimonials-reviews/',
    locale: 'en',
    faqTitle: 'FAQs about UGC testimonials',
    faqs: [
      {
        question: 'What is the difference between a UGC review and an ad?',
        answer:
          'A UGC review feels like a real experience: someone who tried the product sharing their honest take. An ad can be more direct and sales-driven. The interesting part is that many UGC review videos actually perform well as ads precisely because they generate more trust.',
      },
      {
        question: 'Do I need to send you the product?',
        answer:
          'It depends on the format. For physical products I usually need the item in hand. For digital services, apps, or SaaS I can work with access or a detailed brief.',
      },
      {
        question: 'Can I use the testimonials in both ads and on my website?',
        answer:
          'Yes. That is one of the main advantages: a strong product review video works across Meta Ads, TikTok, product pages, landing pages, and even email sequences.',
      },
      {
        question: 'How long should a testimonial video be?',
        answer:
          'For ads I usually recommend 30 to 60 seconds. For product pages or landing pages it can run a bit longer if the benefit justifies it. The key is that every second adds value.',
      },
    ],
  },
  // --- Product Demo ---
  {
    file: 'servicios/demo-producto-ugc/index.html',
    canonical: 'https://www.giselasaldarriaga.com/servicios/demo-producto-ugc/',
    locale: 'es',
    faqTitle: 'Preguntas frecuentes sobre demos UGC',
    faqs: [
      {
        question: '¿Qué tipo de productos funcionan mejor con una demo UGC?',
        answer:
          'Productos que necesitan algo de contexto para entenderse: software, apps, servicios digitales, gadgets, suplementos con uso específico. Si el usuario necesita ver cómo funciona antes de comprar, un video demostración de producto suele ser lo que marca la diferencia.',
      },
      {
        question: '¿Puedes explicar productos técnicos sin sonar aburrida?',
        answer:
          'Sí. Tengo más de 9 años de experiencia en periodismo y medios, lo que me entrenó para tomar temas complejos y hacerlos claros y atractivos. Eso se traduce directamente en cómo armo un tutorial UGC.',
      },
      {
        question: '¿Las demos sirven solo para ads o también para la web?',
        answer:
          'Para ambos. De hecho muchos equipos usan la misma pieza como ad en TikTok o Meta y como video explicativo en su landing page o página de producto. El formato funciona en cualquier lugar donde necesites que alguien entienda tu producto rápido.',
      },
      {
        question: '¿Qué necesitas para grabar una demo?',
        answer:
          'Acceso al producto o servicio, claridad sobre el beneficio principal y una idea de quién va a ver el video. Con eso puedo armar una estructura que fluya bien y cubra lo que importa.',
      },
    ],
  },
  {
    file: 'en/services/ugc-product-demo/index.html',
    canonical: 'https://www.giselasaldarriaga.com/en/services/ugc-product-demo/',
    locale: 'en',
    faqTitle: 'FAQs about UGC product demos',
    faqs: [
      {
        question: 'What types of products work best with a UGC product demo?',
        answer:
          'Products that need some context to be understood: software, apps, digital services, gadgets, supplements with specific usage. If the user needs to see how it works before buying, a product demo video is usually what makes the difference.',
      },
      {
        question: 'Can you explain technical products without sounding dry?',
        answer:
          'Yes. I have over nine years of experience in journalism and media, which trained me to take complex topics and make them clear and engaging. That translates directly into how I build a product tutorial.',
      },
      {
        question: 'Are demos only useful for ads or also for websites?',
        answer:
          'Both. Many teams use the same piece as a TikTok or Meta ad and as an explainer video on their landing page or product page. The format works wherever you need someone to understand your product quickly.',
      },
      {
        question: 'What do you need to record a demo?',
        answer:
          'Access to the product or service, clarity on the main benefit, and a sense of who will watch the video. With that I can build a structure that flows well and covers what matters.',
      },
    ],
  },
  // --- Problem-Solution ---
  {
    file: 'servicios/ugc-problema-solucion/index.html',
    canonical: 'https://www.giselasaldarriaga.com/servicios/ugc-problema-solucion/',
    locale: 'es',
    faqTitle: 'Preguntas frecuentes sobre UGC problema–solución',
    faqs: [
      {
        question: '¿Por qué el formato problema–solución convierte tan bien?',
        answer:
          'Porque replica cómo tomamos decisiones: primero sentimos el dolor, luego buscamos la salida. Un video problema solución UGC bien hecho hace que el espectador se identifique en los primeros segundos y esté listo para la solución cuando la presentas.',
      },
      {
        question: '¿Cuántas variaciones de hook recomiendas?',
        answer:
          'Como mínimo dos o tres por pieza. El hook es donde se decide si el anuncio vive o muere, así que tener opciones para testear es lo más rentable que puedes hacer con tu presupuesto creativo.',
      },
      {
        question: '¿Este formato sirve para cualquier producto?',
        answer:
          'Funciona mejor cuando el producto resuelve un problema real y específico. Si el dolor es claro y la solución se puede mostrar en 30-60 segundos, el formato hook problema solución va a funcionar.',
      },
      {
        question: '¿Puedes escribir los guiones o necesito enviarlos?',
        answer:
          'Puedo escribirlos yo. Con más de 9 años en periodismo y medios, estoy acostumbrada a estructurar mensajes que enganchan y mantienen la atención. Solo necesito la información del producto y la audiencia.',
      },
    ],
  },
  {
    file: 'en/services/ugc-problem-solution/index.html',
    canonical: 'https://www.giselasaldarriaga.com/en/services/ugc-problem-solution/',
    locale: 'en',
    faqTitle: 'FAQs about problem-solution UGC',
    faqs: [
      {
        question: 'Why does the problem-solution format convert so well?',
        answer:
          'Because it mirrors how we make decisions: first we feel the pain, then we look for the way out. A well-made problem solution UGC video gets the viewer to identify with the frustration in the first seconds and be ready for the solution when you present it.',
      },
      {
        question: 'How many hook variations do you recommend?',
        answer:
          'At least two or three per piece. The hook is where the ad lives or dies, so having options to test is the most cost-effective thing you can do with your creative budget.',
      },
      {
        question: 'Does this format work for any product?',
        answer:
          'It works best when the product solves a real, specific problem. If the pain is clear and the solution can be shown in 30 to 60 seconds, the hook-pain-solution structure will deliver.',
      },
      {
        question: 'Can you write the scripts or do I need to provide them?',
        answer:
          'I can write them. With over nine years in journalism and media, I am used to structuring messages that grab and hold attention. I just need the product information and audience details.',
      },
    ],
  },
  // --- Lifestyle ---
  {
    file: 'servicios/ugc-lifestyle/index.html',
    canonical: 'https://www.giselasaldarriaga.com/servicios/ugc-lifestyle/',
    locale: 'es',
    faqTitle: 'Preguntas frecuentes sobre UGC lifestyle',
    faqs: [
      {
        question: '¿Cuál es la diferencia entre contenido lifestyle y UGC ads?',
        answer:
          'El contenido lifestyle UGC está pensado para el feed orgánico de tu marca. No lleva hook de venta ni CTA agresivo. El producto aparece dentro de un momento real, no dentro de un pitch. Los UGC ads, en cambio, están diseñados para pauta pagada con estructura de retención y conversión.',
      },
      {
        question: '¿Puedo usar este contenido también como anuncio?',
        answer:
          'Técnicamente sí, pero no está optimizado para eso. Si necesitas piezas para ads, el servicio de UGC ads va a darte mejores resultados porque está pensado con estructura de hook, beneficio y CTA.',
      },
      {
        question: '¿Cuántas piezas se entregan por proyecto?',
        answer:
          'Depende del brief. Normalmente trabajamos paquetes de 3 a 6 piezas por producto, pero puedo adaptar el volumen según lo que necesites para tu calendario de contenido.',
      },
      {
        question: '¿Trabajas con marcas fuera de Latinoamérica?',
        answer:
          'Sí. Produzco contenido orgánico para marcas en Estados Unidos, España, Australia y Nueva Zelanda. Todo se coordina de forma remota y el envío de producto se resuelve fácil.',
      },
    ],
  },
  {
    file: 'en/services/lifestyle-ugc-organic-content/index.html',
    canonical: 'https://www.giselasaldarriaga.com/en/services/lifestyle-ugc-organic-content/',
    locale: 'en',
    faqTitle: 'FAQs about lifestyle UGC content',
    faqs: [
      {
        question: 'What is the difference between lifestyle content and UGC ads?',
        answer:
          'Lifestyle UGC content is designed for your organic brand feed. There is no sales hook or aggressive CTA. The product appears inside a real moment, not inside a pitch. UGC ads, on the other hand, are structured for paid placement with retention hooks and conversion framing.',
      },
      {
        question: 'Can I also run this content as an ad?',
        answer:
          'Technically yes, but it is not optimized for that. If you need ad-ready pieces, the UGC ads service will give you better results because it is built with hook, benefit, and CTA structure in mind.',
      },
      {
        question: 'How many pieces are delivered per project?',
        answer:
          'It depends on the brief. Typical projects include 3 to 6 pieces per product, but I can adjust the volume based on what your content calendar needs.',
      },
      {
        question: 'Do you work with brands outside Latin America?',
        answer:
          'Yes. I produce organic UGC content for brands in the US, Spain, Australia, and New Zealand. Everything is coordinated remotely and product shipping is straightforward.',
      },
    ],
  },
  // --- B-Roll ---
  {
    file: 'servicios/b-roll-footage-ugc/index.html',
    canonical: 'https://www.giselasaldarriaga.com/servicios/b-roll-footage-ugc/',
    locale: 'es',
    faqTitle: 'Preguntas frecuentes sobre b-roll UGC',
    faqs: [
      {
        question: '¿El b-roll incluye voiceover o edición final?',
        answer:
          'No. Este servicio entrega clips sueltos sin voiceover ni estructura narrativa. La idea es que tu equipo tenga material crudo de calidad para editar a su manera. Si necesitas piezas terminadas, los servicios de UGC lifestyle o ads son mejor opción.',
      },
      {
        question: '¿Cuántos clips incluye un paquete?',
        answer:
          'Depende del brief y del producto. Un paquete típico tiene entre 8 y 15 clips, pero se ajusta según las necesidades. Lo definimos antes de grabar para que recibas exactamente lo que tu equipo va a usar.',
      },
      {
        question: '¿Puedo combinar b-roll con otro servicio?',
        answer:
          'Sí, y es una de las formas más comunes de trabajarlo. Muchos clientes piden un paquete de b-roll como complemento de un proyecto de UGC lifestyle, ads o testimoniales. Así aprovechamos la sesión para sacar más material.',
      },
      {
        question: '¿En qué formato se entregan los clips?',
        answer:
          'Normalmente en MP4 vertical (9:16), pero si tu equipo necesita horizontal o ambos formatos, lo coordinamos antes de la grabación. Los archivos se entregan nombrados y organizados para facilitar la edición.',
      },
    ],
  },
  {
    file: 'en/services/ugc-b-roll-footage/index.html',
    canonical: 'https://www.giselasaldarriaga.com/en/services/ugc-b-roll-footage/',
    locale: 'en',
    faqTitle: 'FAQs about UGC b-roll footage',
    faqs: [
      {
        question: 'Does the b-roll include voiceover or final editing?',
        answer:
          'No. This service delivers standalone clips without voiceover or narrative structure. The idea is that your team gets quality raw UGC footage to edit their way. If you need finished pieces, the lifestyle UGC or ads services are a better fit.',
      },
      {
        question: 'How many clips are included in a package?',
        answer:
          'It depends on the brief and the product. A typical package has 8 to 15 clips, but it adjusts to your needs. We define this before shooting so you receive exactly what your team will actually use.',
      },
      {
        question: 'Can I combine b-roll with another service?',
        answer:
          'Yes, and that is one of the most common ways to use it. Many clients add a b-roll package on top of a lifestyle UGC, ads, or testimonial project. That way we make the most of the session and get more material out of it.',
      },
      {
        question: 'What format are the clips delivered in?',
        answer:
          'Usually MP4 vertical (9:16), but if your team needs horizontal or both orientations, we coordinate before the shoot. Files are delivered named and organized to make editing easier.',
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
