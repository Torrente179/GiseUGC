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
 * Source: content is pulled from the service-pages.ts runtime data via
 * a lightweight TypeScript-free extraction approach.
 *
 * Run: node scripts/expand-boot-shells.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

// ---------------------------------------------------------------------------
// Service page boot shell expansion data
// Mirrors the structure in src/data/service-pages.ts
// ---------------------------------------------------------------------------

const serviceBootData = [
  // ── bilingual-ugc-creator (ES) ──
  {
    file: 'servicios/creadora-ugc-bilingue/index.html',
    locale: 'es',
    sectionIntroTitle: 'Qué resuelve este servicio',
    sectionIntroText:
      'Esta página existe para equipos que no quieren dividir producción entre una versión en español y otra en inglés. Aquí el valor no es solo traducir: es mantener la intención comercial, el ritmo y la naturalidad en ambos idiomas sin perder coherencia de marca.',
    deliverablesTitle: 'Qué puedes pedir dentro de este servicio',
    deliverables: [
      { title: 'UGC ads bilingües', description: 'Creativos para TikTok Ads, Meta Ads y paid social con hooks, beneficio central y CTA adaptados al idioma objetivo.' },
      { title: 'Demos y how-to', description: 'Explicaciones de producto para ecommerce, apps, SaaS y servicios digitales con lenguaje claro y ritmo comercial.' },
      { title: 'Reviews y testimoniales', description: 'Piezas de confianza para reducir fricción, explicar resultados y apoyar decisiones de compra.' },
      { title: 'Assets para varios mercados', description: 'Versiones en español e inglés para campañas que apuntan a Estados Unidos, España y Latinoamérica desde una misma línea creativa.' },
    ],
    bestFitTitle: 'Mejor encaje',
    bestFitItems: [
      'Marcas que venden a audiencias hispanas en Estados Unidos y también quieren una versión en inglés limpia.',
      'Equipos de marketing que necesitan velocidad sin perder consistencia visual.',
      'Campañas que mezclan demos, spokesperson, reviews y creator-led ads dentro de un mismo sprint.',
    ],
    notFitTitle: 'No es la mejor opción si',
    notFitItems: [
      'Necesitas una producción tipo estudio con varias locaciones, actores o set complejo.',
      'Buscas doblaje o adaptación cultural profunda para varios países sin rehacer guión ni enfoque.',
      'El proyecto depende de claims imposibles de sostener con una voz natural frente a cámara.',
    ],
    processTitle: 'Cómo suelo trabajar este tipo de proyecto',
    processSteps: [
      { title: '1. Brief y ángulo', description: 'Alineamos objetivo, audiencia, hook, proof points y si habrá una o dos versiones por idioma.' },
      { title: '2. Guion o estructura', description: 'Puedo trabajar con tu script o ayudarte a ordenar el mensaje para que suene comercial sin verse forzado.' },
      { title: '3. Grabación y edición', description: 'Produzco las piezas con enfoque creator-led, cuidando claridad, presencia, energía y ritmo de retención.' },
      { title: '4. Entrega lista para probar', description: 'Recibes assets listos para pauta, orgánico o landings, con margen para iterar hooks y mensajes.' },
    ],
  },
  // ── bilingual-ugc-creator (EN) ──
  {
    file: 'en/services/bilingual-ugc-creator/index.html',
    locale: 'en',
    sectionIntroTitle: 'What this service solves',
    sectionIntroText:
      'This page is for teams that do not want one creator for Spanish and a different one for English. The value here is not just translation. It is keeping the commercial intent, pacing, and brand feel consistent across both versions.',
    deliverablesTitle: 'What you can request inside this service',
    deliverables: [
      { title: 'Bilingual UGC ads', description: 'TikTok ads, Meta ads, and paid social creatives with hooks, proof points, and CTAs adapted to the target language.' },
      { title: 'Product demos and how-to videos', description: 'Clear product explainers for ecommerce, apps, SaaS, and digital offers with a creator-led tone.' },
      { title: 'Reviews and testimonial-style videos', description: 'Trust-building assets that reduce friction and support the buying decision.' },
      { title: 'Cross-market asset batches', description: 'Spanish and English versions for campaigns targeting the US, Spain, and LatAm from one creative line.' },
    ],
    bestFitTitle: 'Best fit',
    bestFitItems: [
      'Brands speaking to Spanish-speaking buyers in the US and also needing clean English-facing creatives.',
      'Ecommerce, beauty, lifestyle, SaaS, and tech teams that need speed without losing creative consistency.',
      'Campaigns mixing demos, reviews, spokesperson delivery, and creator-led ads in one production sprint.',
    ],
    notFitTitle: 'Not the best fit if',
    notFitItems: [
      'You need a studio-scale production with multiple actors, complex sets, or location-heavy direction.',
      'You need deep localization across many countries without adjusting script structure or message.',
      'The project depends on claims that cannot sound natural or believable on camera.',
    ],
    processTitle: 'How this kind of project usually runs',
    processSteps: [
      { title: '1. Brief and angle', description: 'We align on the audience, hook, proof points, and whether the campaign needs one or two language versions.' },
      { title: '2. Script or structure', description: 'I can work from your script or help tighten the message so it sounds commercial without feeling forced.' },
      { title: '3. Production and edit', description: 'I produce creator-led assets with attention to clarity, energy, retention pacing, and believable delivery.' },
      { title: '4. Delivery built for testing', description: 'You receive assets ready for ads, landing pages, or organic posting, with room to iterate on hooks and messaging.' },
    ],
  },
  // ── spokesperson-videos (ES) ──
  {
    file: 'servicios/videos-de-portavoz/index.html',
    locale: 'es',
    sectionIntroTitle: 'Dónde suele funcionar mejor',
    sectionIntroText:
      'Cuando la oferta tiene fricción, necesita explicación o pierde fuerza en texto, un video de portavoz resuelve rápido: presenta el problema, ordena el beneficio y sostiene la atención con una entrega humana y segura.',
    deliverablesTitle: 'Entregables habituales',
    deliverables: [
      { title: 'Presentaciones de oferta', description: 'Piezas para explicar producto, servicio, promo o lanzamiento con una estructura clara y vendible.' },
      { title: 'Videos para landing y producto', description: 'Activos front-and-center para reforzar propuesta de valor, objeciones y CTA dentro de la página.' },
      { title: 'Ads con voz portavoz', description: 'Creativos con presencia directa a cámara cuando el formato testimonial o creator-led necesita más orden y autoridad.' },
      { title: 'Demo guiada', description: 'Explicaciones paso a paso con tono humano, útil para software, servicios y productos con uso específico.' },
    ],
    bestFitTitle: 'Mejor encaje',
    bestFitItems: [
      'Lanzamientos, promos y servicios que necesitan una explicación frontal y limpia.',
      'Marcas con oferta nueva, técnica o poco obvia que no se vende bien solo con B-roll o texto en pantalla.',
      'Equipos que quieren una pieza más estructurada que un UGC casual pero sin caer en una presentación rígida.',
    ],
    notFitTitle: 'No es la mejor opción si',
    notFitItems: [
      'La pieza depende solo de estética aspiracional y casi no necesita explicación.',
      'Buscas acting complejo o interpretación muy performática.',
      'No hay un mensaje, promesa o prueba que sostener frente a cámara.',
    ],
    processTitle: 'Proceso de trabajo',
    processSteps: [
      { title: '1. Mensaje central', description: 'Definimos qué tiene que entender la audiencia en los primeros segundos y qué objeción principal debe quedar resuelta.' },
      { title: '2. Guion directo a cámara', description: 'Ajustamos lenguaje, ritmo y bloques para que la entrega suene natural, no recitada.' },
      { title: '3. Producción', description: 'Grabo con foco en presencia, dicción, ritmo y expresividad útil para performance y claridad.' },
      { title: '4. Versiones y uso', description: 'Entrego assets listos para ads, homepage, product page o mensajes de captación.' },
    ],
  },
  // ── spokesperson-videos (EN) ──
  {
    file: 'en/services/spokesperson-videos/index.html',
    locale: 'en',
    sectionIntroTitle: 'Where this format works best',
    sectionIntroText:
      'When the offer has friction, needs context, or loses force in static copy, a spokesperson video helps quickly. It frames the problem, explains the benefit, and holds attention with a human, confident delivery.',
    deliverablesTitle: 'Typical deliverables',
    deliverables: [
      { title: 'Offer presentations', description: 'Assets that explain a product, service, launch, or promo with a clear and commercially useful structure.' },
      { title: 'Landing and product-page videos', description: 'Front-and-center assets that reinforce the value proposition, handle objections, and support the CTA.' },
      { title: 'Ads with spokesperson delivery', description: 'Direct-to-camera creatives when a testimonial or loose creator format needs more authority and structure.' },
      { title: 'Guided demos', description: 'Step-by-step explanations with a human tone, especially useful for software, services, and product education.' },
    ],
    bestFitTitle: 'Best fit',
    bestFitItems: [
      'Launches, promos, and services that need a clean front-facing explanation.',
      'Brands with a newer, more technical, or less obvious offer that will not sell well through B-roll alone.',
      'Teams that want something more structured than casual UGC without making it feel stiff or corporate.',
    ],
    notFitTitle: 'Not the best fit if',
    notFitItems: [
      'The piece depends almost entirely on aspirational visuals and barely needs explanation.',
      'You need complex acting or heavily stylized performance.',
      'There is no real message, promise, or proof to carry on camera.',
    ],
    processTitle: 'How the process works',
    processSteps: [
      { title: '1. Core message', description: 'We define what the viewer needs to understand in the first seconds and which objection the video should resolve.' },
      { title: '2. Direct-to-camera script', description: 'We shape the copy and pacing so the delivery sounds natural, not memorized.' },
      { title: '3. Production', description: 'I record with focus on presence, diction, pacing, and expression that actually helps performance.' },
      { title: '4. Versions and usage', description: 'You receive assets ready for ads, homepages, product pages, or outbound use.' },
    ],
  },
  // ── ugc-ads-tiktok-meta (ES) ──
  {
    file: 'servicios/ugc-ads-tiktok-meta/index.html',
    locale: 'es',
    sectionIntroTitle: 'Qué buscan normalmente los equipos de performance',
    sectionIntroText:
      'No solo "un video bonito". Lo que suele hacer falta aquí es una biblioteca pequeña pero útil de hooks, demo, pain-point, beneficios, social proof y CTA que se pueda poner a prueba rápido en paid social.',
    deliverablesTitle: 'Tipos de UGC Ads que suelo producir',
    deliverables: [
      { title: 'Hook + benefit + CTA', description: 'La base más directa para Meta y TikTok cuando necesitas un activo entendible en segundos.' },
      { title: 'Problem-solution creatives', description: 'Piezas que arrancan desde el dolor o la fricción real del usuario y aterrizan el producto como solución.' },
      { title: 'Demo-led ads', description: 'Creativos donde el producto en uso sostiene la historia y reduce objeciones mientras vende.' },
      { title: 'Review/testimonial ads', description: 'Anuncios donde la credibilidad del formato creator-led ayuda a mover la intención de compra.' },
    ],
    bestFitTitle: 'Mejor encaje',
    bestFitItems: [
      'Equipos que ya hacen paid social y necesitan más creativos con lógica de testeo, no solo una pieza hero.',
      'Marcas que venden por ecommerce o DTC y necesitan variaciones de hook, beneficio y formato.',
      'Productos que ganan cuando se ven en uso, se explican rápido o se comparan contra una fricción real.',
    ],
    notFitTitle: 'No es la mejor opción si',
    notFitItems: [
      'Buscas una sola pieza institucional o una campaña de branding puro sin hipótesis de rendimiento.',
      'No tienes claro producto, oferta o público al que va el creativo.',
      'Esperas que una sola versión resuelva todo sin iteración ni aprendizaje creativo.',
    ],
    processTitle: 'Cómo enfoco un lote de creativos',
    processSteps: [
      { title: '1. Hipótesis creativa', description: 'Definimos ángulo, promesa, objeción principal y nivel de awareness del público.' },
      { title: '2. Guion modular', description: 'Separo hook, body, prueba y CTA para que luego sea más fácil iterar variaciones.' },
      { title: '3. Producción creator-led', description: 'Grabo con foco en retención, naturalidad y visibilidad de producto, no solo en estética.' },
      { title: '4. Entrega orientada a test', description: 'El objetivo es que el equipo tenga piezas listas para probar, combinar y aprender rápido.' },
    ],
  },
  // ── ugc-ads-tiktok-meta (EN) ──
  {
    file: 'en/services/ugc-ads-tiktok-meta/index.html',
    locale: 'en',
    sectionIntroTitle: 'What performance teams usually need',
    sectionIntroText:
      'Not just "a nice video." What is usually needed here is a small but usable creative library of hooks, demos, pain-point angles, benefits, social proof, and CTAs that can be tested quickly in paid social.',
    deliverablesTitle: 'UGC ad formats I usually produce',
    deliverables: [
      { title: 'Hook + benefit + CTA', description: 'The clearest base format for Meta and TikTok when the offer needs to be understood in seconds.' },
      { title: 'Problem-solution creatives', description: 'Ads that start from a real user pain point and position the product as the answer.' },
      { title: 'Demo-led ads', description: 'Creatives where product usage carries the story and reduces objections while still selling.' },
      { title: 'Review/testimonial ads', description: 'Ads where the credibility of creator-led delivery helps move buying intent.' },
    ],
    bestFitTitle: 'Best fit',
    bestFitItems: [
      'Teams already running paid social and needing more creatives with testing logic, not just one hero asset.',
      'Ecommerce and DTC brands that need multiple hooks, benefits, and format variations.',
      'Products that sell better when they are seen in use, explained quickly, or framed against a real user pain point.',
    ],
    notFitTitle: 'Not the best fit if',
    notFitItems: [
      'You want one institutional brand film or a pure awareness campaign with no performance hypothesis.',
      'There is no clarity yet on product, offer, or audience.',
      'You expect one version to solve everything without iteration or creative learning.',
    ],
    processTitle: 'How I approach a creative batch',
    processSteps: [
      { title: '1. Creative hypothesis', description: 'We define the angle, promise, main objection, and the audience awareness level.' },
      { title: '2. Modular scripting', description: 'I separate the hook, body, proof, and CTA so it is easier to iterate later.' },
      { title: '3. Creator-led production', description: 'I record with focus on retention, natural delivery, and visible product context, not only aesthetics.' },
      { title: '4. Test-ready delivery', description: 'The goal is to leave the team with assets that can be tested, recombined, and learned from quickly.' },
    ],
  },
  // ── ugc-testimonials-reviews (ES) ──
  {
    file: 'servicios/testimoniales-resenas-ugc/index.html',
    locale: 'es',
    sectionIntroTitle: 'Por qué el social proof en video funciona mejor',
    sectionIntroText:
      'Una reseña escrita ayuda, pero un video testimonial donde alguien muestra el producto, cuenta su experiencia y habla con naturalidad genera mucha más confianza. Este servicio existe para marcas que entienden que el UGC social proof es lo que empuja la decisión de compra.',
    deliverablesTitle: 'Qué puedes pedir dentro de este servicio',
    deliverables: [
      { title: 'Reseña de producto lifestyle', description: 'Videos donde muestro el producto en uso real, cuento la experiencia y dejo que la naturalidad haga el trabajo de venta.' },
      { title: 'Testimonial de beneficio', description: 'Piezas enfocadas en un resultado específico: qué cambió, qué resolvió, por qué vale la pena.' },
      { title: 'Unboxing + primera impresión', description: 'Formato de descubrimiento que captura la reacción real y sirve como gancho para ads o contenido orgánico.' },
      { title: 'Review comparativo', description: 'Cuando el producto gana frente a una alternativa, el formato comparación ayuda a posicionar la decisión.' },
    ],
    bestFitTitle: 'Mejor encaje',
    bestFitItems: [
      'Marcas de ecommerce, beauty, suplementos o lifestyle que necesitan social proof en video para reforzar sus páginas de producto.',
      'Equipos de performance que saben que la confianza vende más que la estética y necesitan reseñas UGC creíbles.',
      'Productos con beneficios claros que se explican mejor con una persona real hablando frente a cámara.',
    ],
    notFitTitle: 'No es la mejor opción si',
    notFitItems: [
      'Lo que necesitas es un guion muy cerrado con claims que no se sostienen desde la experiencia natural.',
      'El producto no tiene un beneficio claro que se pueda contar en primera persona.',
      'Buscas testimoniales de múltiples personas o clientes reales grabados en distintas locaciones.',
    ],
    processTitle: 'Cómo trabajo un lote de reseñas',
    processSteps: [
      { title: '1. Producto y ángulo', description: 'Me cuentas qué quieres destacar, qué objeción quieres bajar y qué tono buscas: casual, entusiasta o informativo.' },
      { title: '2. Estructura de la reseña', description: 'Armo una guía ligera con puntos clave para que suene natural pero cubra lo que importa comercialmente.' },
      { title: '3. Grabación con producto', description: 'Grabo con el producto en mano, en uso real y con una entrega que se sienta genuina, no leída.' },
      { title: '4. Entrega lista para usar', description: 'Recibes las piezas listas para pauta, orgánico o integración en landing y páginas de producto.' },
    ],
  },
  // ── ugc-testimonials-reviews (EN) ──
  {
    file: 'en/services/ugc-testimonials-reviews/index.html',
    locale: 'en',
    sectionIntroTitle: 'Why video social proof outperforms text',
    sectionIntroText:
      'A written review helps, but a video where someone shows the product, shares their experience, and speaks naturally generates far more trust. This service is for brands that understand UGC testimonials are what push the buying decision over the line.',
    deliverablesTitle: 'What you can request inside this service',
    deliverables: [
      { title: 'Lifestyle product review', description: 'Videos where I show the product in real use, share the experience, and let natural delivery do the selling.' },
      { title: 'Benefit-focused testimonial', description: 'Pieces centered on a specific result: what changed, what it solved, why it is worth it.' },
      { title: 'Unboxing + first impression', description: 'A discovery format that captures real reaction and works as a hook for ads or organic content.' },
      { title: 'Comparison review', description: 'When the product wins against an alternative, a comparison format helps frame the buying decision.' },
    ],
    bestFitTitle: 'Best fit',
    bestFitItems: [
      'Ecommerce, beauty, supplement, and lifestyle brands that need UGC review videos to strengthen product pages.',
      'Performance teams that know trust sells better than aesthetics and need credible video testimonials.',
      'Products with clear benefits that land better when a real person explains them on camera.',
    ],
    notFitTitle: 'Not the best fit if',
    notFitItems: [
      'You need a tightly scripted piece with claims that cannot be backed by natural experience.',
      'The product does not have a clear benefit that can be told in first person.',
      'You need testimonials from multiple real customers filmed in separate locations.',
    ],
    processTitle: 'How I work a review batch',
    processSteps: [
      { title: '1. Product and angle', description: 'You tell me what to highlight, which objection to address, and the tone you want: casual, enthusiastic, or informative.' },
      { title: '2. Review structure', description: 'I build a light guide with key points so the delivery feels natural but covers what matters commercially.' },
      { title: '3. Recording with product', description: 'I record with the product in hand, in real use, with delivery that feels genuine and unscripted.' },
      { title: '4. Ready-to-use delivery', description: 'You receive assets ready for ads, organic posting, or integration into landing and product pages.' },
    ],
  },
  // ── ugc-product-demo (ES) ──
  {
    file: 'servicios/demo-producto-ugc/index.html',
    locale: 'es',
    sectionIntroTitle: 'Cuándo un demo UGC marca la diferencia',
    sectionIntroText:
      'Cuando el producto necesita algo de contexto para entenderse, un video demostración con tono humano y ritmo comercial suele ser lo que convierte visitas en decisiones de compra. Este servicio es para marcas que saben que mostrar el producto en uso vende más que describirlo.',
    deliverablesTitle: 'Formatos de demo que suelo producir',
    deliverables: [
      { title: 'Demo de app o software', description: 'Recorrido visual por la interfaz con explicación clara de funciones, valor y uso práctico.' },
      { title: 'Tutorial de producto físico', description: 'Demostración de uso, beneficios y diferenciadores con el producto en mano y frente a cámara.' },
      { title: 'How-to paso a paso', description: 'Videos que guían al usuario por un proceso específico con tono claro y ritmo de retención.' },
      { title: 'Demo comparativa', description: 'Cuando el producto gana frente a la alternativa, el formato comparación es el más útil para cerrar la venta.' },
    ],
    bestFitTitle: 'Mejor encaje',
    bestFitItems: [
      'Productos que necesitan algo de contexto para entenderse: software, apps, servicios digitales, gadgets, suplementos con uso específico.',
      'Equipos de ecommerce que necesitan videos de producto que expliquen y vendan al mismo tiempo.',
      'Marcas de SaaS o tech que quieren un demo con tono humano en vez de un screencast sin cara.',
    ],
    notFitTitle: 'No es la mejor opción si',
    notFitItems: [
      'El producto se entiende solo con verlo y no necesita explicación adicional.',
      'Necesitas un video largo de onboarding con múltiples flujos y pantallas.',
      'Buscas un tutorial técnico de documentación más que una pieza comercial.',
    ],
    processTitle: 'Cómo preparo un demo UGC',
    processSteps: [
      { title: '1. Producto y beneficio principal', description: 'Identificamos qué tiene que entender el espectador y qué problema resuelve el producto para él.' },
      { title: '2. Estructura del recorrido', description: 'Defino qué mostrar, en qué orden y cuánto tiempo dedicar a cada bloque para mantener ritmo.' },
      { title: '3. Grabación con producto', description: 'Grabo con el producto real, mostrando uso, interfaz o resultado con una entrega que se sienta natural y creíble.' },
      { title: '4. Entrega lista para uso dual', description: 'Recibes un asset que funciona como ad en TikTok/Meta y como video explicativo en tu landing o PDP.' },
    ],
  },
  // ── ugc-product-demo (EN) ──
  {
    file: 'en/services/ugc-product-demo/index.html',
    locale: 'en',
    sectionIntroTitle: 'When a UGC product demo makes the difference',
    sectionIntroText:
      'When the product needs context to be understood, a demo video with human delivery and commercial pacing is usually what converts visits into buying decisions. This service is for brands that know showing the product in use sells better than describing it.',
    deliverablesTitle: 'Demo formats I usually produce',
    deliverables: [
      { title: 'App or software demo', description: 'Visual walkthrough of the interface with clear explanation of features, value, and practical use.' },
      { title: 'Physical product tutorial', description: 'Usage demonstration with benefits and differentiators, product in hand, delivered on camera.' },
      { title: 'Step-by-step how-to', description: 'Videos that guide the user through a specific process with clear tone and retention pacing.' },
      { title: 'Comparison demo', description: 'When the product wins against the alternative, the comparison format is the most useful for closing the sale.' },
    ],
    bestFitTitle: 'Best fit',
    bestFitItems: [
      'Products that need context to be understood: software, apps, digital services, gadgets, supplements with specific usage.',
      'Ecommerce teams that need product videos that explain and sell at the same time.',
      'SaaS or tech brands that want a demo with a human face instead of a faceless screencast.',
    ],
    notFitTitle: 'Not the best fit if',
    notFitItems: [
      'The product is self-explanatory and does not need additional explanation.',
      'You need a long onboarding video with multiple flows and screens.',
      'You are looking for a technical documentation tutorial rather than a commercial piece.',
    ],
    processTitle: 'How I prepare a UGC demo',
    processSteps: [
      { title: '1. Product and core benefit', description: 'We identify what the viewer needs to understand and what problem the product solves for them.' },
      { title: '2. Walkthrough structure', description: 'I define what to show, in what order, and how much time to spend on each block to keep the pacing tight.' },
      { title: '3. Recording with product', description: 'I record with the real product, showing usage, interface, or results with delivery that feels natural and credible.' },
      { title: '4. Dual-use delivery', description: 'You receive an asset that works as a TikTok/Meta ad and as an explainer video on your landing page or PDP.' },
    ],
  },
  // ── ugc-problem-solution (ES) ──
  {
    file: 'servicios/ugc-problema-solucion/index.html',
    locale: 'es',
    sectionIntroTitle: 'Por qué este formato convierte tan bien',
    sectionIntroText:
      'El formato problema-solución replica cómo tomamos decisiones: primero sentimos el dolor, luego buscamos la salida. Un video problema solución UGC bien hecho hace que el espectador se identifique en los primeros segundos y esté listo para la solución cuando la presentas.',
    deliverablesTitle: 'Tipos de piezas problema-solución',
    deliverables: [
      { title: 'Hook de dolor + solución', description: 'Piezas cortas que abren con la frustración real del usuario y cierran con el producto como respuesta directa.' },
      { title: 'Antes/después', description: 'Formato visual que muestra el contraste entre el problema y el resultado con el producto.' },
      { title: 'Storytelling de experiencia', description: 'Narrativa breve en primera persona que conecta con el dolor y presenta la solución de forma orgánica.' },
      { title: 'Variaciones de hook', description: 'Múltiples aperturas para testear cuál engancha mejor a distintos segmentos de audiencia.' },
    ],
    bestFitTitle: 'Mejor encaje',
    bestFitItems: [
      'Productos que resuelven un problema real y específico que se puede mostrar en 30-60 segundos.',
      'Marcas de ecommerce, suplementos, apps o servicios con un dolor de usuario claro y medible.',
      'Equipos de performance que quieren piezas con estructura de retención probada para paid social.',
    ],
    notFitTitle: 'No es la mejor opción si',
    notFitItems: [
      'El producto es aspiracional y no tiene un pain-point claro que resolver.',
      'Lo que necesitas es puro branding sin intención de conversión directa.',
      'El beneficio no se puede demostrar o contar en menos de un minuto.',
    ],
    processTitle: 'Cómo construyo un video problema-solución',
    processSteps: [
      { title: '1. Pain-point y audiencia', description: 'Definimos el dolor específico, quién lo siente y cómo se expresa en lenguaje real.' },
      { title: '2. Estructura hook-pain-solution', description: 'Armo variaciones de apertura para testear y un cuerpo que conecta dolor con producto de forma creíble.' },
      { title: '3. Grabación con intención', description: 'Grabo con foco en que el espectador se sienta identificado rápido y reciba la solución con naturalidad.' },
      { title: '4. Entrega con variaciones', description: 'Recibes varias versiones de hook para testear cuál convierte mejor en tu público específico.' },
    ],
  },
  // ── ugc-problem-solution (EN) ──
  {
    file: 'en/services/ugc-problem-solution/index.html',
    locale: 'en',
    sectionIntroTitle: 'Why this format converts so well',
    sectionIntroText:
      'The problem-solution format mirrors how we make decisions: first we feel the pain, then we look for the way out. A well-made problem solution UGC video gets the viewer to identify with the frustration in the first seconds and be ready for the solution when you present it.',
    deliverablesTitle: 'Problem-solution content types',
    deliverables: [
      { title: 'Pain hook + solution', description: 'Short pieces that open with real user frustration and close with the product as the direct answer.' },
      { title: 'Before/after', description: 'Visual format that shows the contrast between the problem and the result with the product.' },
      { title: 'Experience storytelling', description: 'Brief first-person narrative that connects with the pain and presents the solution organically.' },
      { title: 'Hook variations', description: 'Multiple openings to test which one resonates best with different audience segments.' },
    ],
    bestFitTitle: 'Best fit',
    bestFitItems: [
      'Products that solve a real, specific problem that can be shown in 30 to 60 seconds.',
      'Ecommerce, supplement, app, or service brands with a clear, measurable user pain point.',
      'Performance teams that want assets with proven retention structure for paid social.',
    ],
    notFitTitle: 'Not the best fit if',
    notFitItems: [
      'The product is aspirational and does not have a clear pain point to resolve.',
      'What you need is pure branding without direct conversion intent.',
      'The benefit cannot be demonstrated or explained in under a minute.',
    ],
    processTitle: 'How I build a problem-solution video',
    processSteps: [
      { title: '1. Pain point and audience', description: 'We define the specific pain, who feels it, and how it sounds in real language.' },
      { title: '2. Hook-pain-solution structure', description: 'I build opening variations for testing and a body that connects pain to product credibly.' },
      { title: '3. Recording with intent', description: 'I record with focus on making the viewer feel seen fast and receive the solution naturally.' },
      { title: '4. Delivery with variations', description: 'You receive multiple hook versions to test which one converts best for your specific audience.' },
    ],
  },
  // ── ugc-lifestyle (ES) ──
  {
    file: 'servicios/ugc-lifestyle/index.html',
    locale: 'es',
    sectionIntroTitle: 'Qué hace diferente al contenido lifestyle UGC',
    sectionIntroText:
      'El contenido lifestyle UGC está pensado para el feed orgánico de tu marca. No lleva hook de venta ni CTA agresivo. El producto aparece dentro de un momento real, no dentro de un pitch. Funciona porque genera familiaridad, no presión.',
    deliverablesTitle: 'Tipos de contenido lifestyle',
    deliverables: [
      { title: 'Uso de producto en contexto real', description: 'Videos donde el producto aparece en mi rutina diaria, viaje, espacio personal o actividad cotidiana.' },
      { title: 'Try-on y estilismo', description: 'Piezas de moda, accesorios o beauty mostrando opciones, combinaciones y reacciones naturales.' },
      { title: 'Día en la vida', description: 'Formato narrativo ligero que integra el producto de forma orgánica dentro de mi día.' },
      { title: 'Aesthetic content', description: 'Piezas visualmente cuidadas con foco en mood, color y textura para feeds que priorizan imagen de marca.' },
    ],
    bestFitTitle: 'Mejor encaje',
    bestFitItems: [
      'Marcas de beauty, moda, wellness, lifestyle o food que necesitan contenido orgánico constante.',
      'Equipos que quieren alimentar su feed con piezas creator-led sin que se sienta como publicidad.',
      'Productos que se benefician de verse en uso natural, no solo en un estudio o con edición pesada.',
    ],
    notFitTitle: 'No es la mejor opción si',
    notFitItems: [
      'Necesitas piezas con estructura de ad: hook, beneficio, CTA y formato de retención.',
      'El producto necesita explicación técnica para entenderse.',
      'Buscas contenido con actors o múltiples personas en una locación controlada.',
    ],
    processTitle: 'Cómo produzco contenido lifestyle',
    processSteps: [
      { title: '1. Brief y dirección visual', description: 'Definimos tono, mood, contextos y qué sensación debe transmitir el contenido sobre tu marca.' },
      { title: '2. Shot list orgánico', description: 'Preparo escenas, momentos y ángulos que integren el producto de forma natural sin script rígido.' },
      { title: '3. Producción en contexto real', description: 'Grabo en mi espacio real, con luz natural y un flow que se sienta genuino y adaptable a tu feed.' },
      { title: '4. Entrega por paquete', description: 'Recibes un lote de piezas listas para orgánico, con variaciones de formato y estilo según brief.' },
    ],
  },
  // ── ugc-lifestyle (EN) ──
  {
    file: 'en/services/lifestyle-ugc-organic-content/index.html',
    locale: 'en',
    sectionIntroTitle: 'What makes lifestyle UGC different',
    sectionIntroText:
      'Lifestyle UGC content is designed for your organic brand feed. There is no sales hook or aggressive CTA. The product appears inside a real moment, not inside a pitch. It works because it builds familiarity, not pressure.',
    deliverablesTitle: 'Lifestyle content types',
    deliverables: [
      { title: 'Product in real context', description: 'Videos where the product shows up in my daily routine, travel, personal space, or everyday activity.' },
      { title: 'Try-on and styling', description: 'Fashion, accessories, or beauty pieces showing options, combinations, and natural reactions.' },
      { title: 'Day in the life', description: 'Light narrative format that integrates the product organically into my day.' },
      { title: 'Aesthetic content', description: 'Visually polished pieces with focus on mood, color, and texture for feeds that prioritize brand imagery.' },
    ],
    bestFitTitle: 'Best fit',
    bestFitItems: [
      'Beauty, fashion, wellness, lifestyle, or food brands that need consistent organic content.',
      'Teams that want to feed their channels with creator-led pieces that do not feel like advertising.',
      'Products that benefit from being seen in natural use, not just in a studio or with heavy editing.',
    ],
    notFitTitle: 'Not the best fit if',
    notFitItems: [
      'You need assets with ad structure: hook, benefit, CTA, and retention format.',
      'The product needs technical explanation to be understood.',
      'You want content with actors or multiple people in a controlled location.',
    ],
    processTitle: 'How I produce lifestyle content',
    processSteps: [
      { title: '1. Brief and visual direction', description: 'We define tone, mood, contexts, and what feeling the content should project about your brand.' },
      { title: '2. Organic shot list', description: 'I prepare scenes, moments, and angles that integrate the product naturally without a rigid script.' },
      { title: '3. Production in real context', description: 'I record in my real space, with natural light and a flow that feels genuine and adaptable to your feed.' },
      { title: '4. Batch delivery', description: 'You receive a set of pieces ready for organic use, with format and style variations based on the brief.' },
    ],
  },
  // ── ugc-broll-footage (ES) ──
  {
    file: 'servicios/b-roll-footage-ugc/index.html',
    locale: 'es',
    sectionIntroTitle: 'Qué es el b-roll UGC y para qué sirve',
    sectionIntroText:
      'El b-roll UGC son clips sueltos de producto en uso, detalles, texturas y momentos visuales que tu equipo puede usar como material de apoyo para editar ads, reels, landings o presentaciones internas. No llevan voiceover ni estructura narrativa: son materia prima visual con calidad creator-led.',
    deliverablesTitle: 'Tipos de b-roll que suelo entregar',
    deliverables: [
      { title: 'Producto en uso', description: 'Clips del producto en contexto real: manos, texturas, aplicación, resultados visibles.' },
      { title: 'Detalles y close-ups', description: 'Planos cortos de empaques, etiquetas, ingredientes, interfaz o elementos visuales del producto.' },
      { title: 'Ambientación y estilo', description: 'Clips de mood y setting que complementan la identidad visual de la marca sin necesidad de cara a cámara.' },
      { title: 'Transiciones y texturas', description: 'Material visual de apoyo para edición: vertidos, aplicaciones, swatches, movimientos de producto.' },
    ],
    bestFitTitle: 'Mejor encaje',
    bestFitItems: [
      'Equipos de contenido que necesitan material crudo para armar sus propias piezas.',
      'Marcas que ya tienen editor y necesitan clips de producto frescos y naturales.',
      'Proyectos que combinan b-roll con otro servicio como ads, lifestyle o testimoniales.',
    ],
    notFitTitle: 'No es la mejor opción si',
    notFitItems: [
      'Necesitas piezas terminadas con voiceover, estructura y CTA.',
      'Buscas contenido largo con narrativa editorial.',
      'El producto necesita contexto verbal para entenderse.',
    ],
    processTitle: 'Cómo preparo un paquete de b-roll',
    processSteps: [
      { title: '1. Producto y objetivo', description: 'Me cuentas qué producto quieres cubrir, para qué se va a usar el material y qué estilo visual buscan.' },
      { title: '2. Shot list', description: 'Preparo una lista de planos y ángulos que cubra lo que tu equipo va a necesitar para edición.' },
      { title: '3. Grabación con producto', description: 'Produzco los clips con atención a luz, textura, encuadre y calidad de material crudo.' },
      { title: '4. Entrega organizada', description: 'Recibes los clips nombrados, en formato vertical u horizontal según brief, listos para edición.' },
    ],
  },
  // ── ugc-broll-footage (EN) ──
  {
    file: 'en/services/ugc-b-roll-footage/index.html',
    locale: 'en',
    sectionIntroTitle: 'What UGC b-roll footage is and when to use it',
    sectionIntroText:
      'UGC b-roll footage is a set of standalone product clips, details, textures, and visual moments your team can use as support material to edit ads, reels, landing pages, or internal presentations. No voiceover, no narrative structure: raw visual material with creator-led quality.',
    deliverablesTitle: 'B-roll types I usually deliver',
    deliverables: [
      { title: 'Product in use', description: 'Clips of the product in real context: hands, textures, application, visible results.' },
      { title: 'Details and close-ups', description: 'Short shots of packaging, labels, ingredients, interface, or visual product elements.' },
      { title: 'Mood and styling', description: 'Setting and atmosphere clips that complement the brand visual identity without on-camera presence.' },
      { title: 'Transitions and textures', description: 'Visual support material for editing: pours, applications, swatches, product movement.' },
    ],
    bestFitTitle: 'Best fit',
    bestFitItems: [
      'Content teams that need raw material to assemble their own pieces.',
      'Brands that already have an editor and need fresh, natural product footage.',
      'Projects that combine b-roll with another service like ads, lifestyle, or testimonials.',
    ],
    notFitTitle: 'Not the best fit if',
    notFitItems: [
      'You need finished pieces with voiceover, structure, and CTA.',
      'You are looking for long-form content with editorial narrative.',
      'The product needs verbal context to be understood.',
    ],
    processTitle: 'How I prepare a b-roll package',
    processSteps: [
      { title: '1. Product and objective', description: 'You tell me which product to cover, what the material will be used for, and what visual style you want.' },
      { title: '2. Shot list', description: 'I prepare a list of shots and angles that covers what your team will need for editing.' },
      { title: '3. Recording with product', description: 'I produce the clips with attention to lighting, texture, framing, and raw material quality.' },
      { title: '4. Organized delivery', description: 'You receive clips named and formatted in vertical or horizontal orientation per the brief, ready for editing.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// HTML generation helpers
// ---------------------------------------------------------------------------

const FIVERR = 'https://www.fiverr.com/gisela_sm';

const MARKET_BY_FILE = {
  'servicios/creadora-ugc-bilingue/index.html': [
    'Estados Unidos hispano, España y Latinoamérica.',
    'Briefs en inglés para piezas cortas, directas y naturales frente a cámara.',
    'Vertical video para TikTok, Reels, Meta Ads, landing creatives y páginas de producto.',
  ],
  'en/services/bilingual-ugc-creator/index.html': [
    'Spanish-speaking audiences in the US, Spain, and Latin America.',
    'English briefs for short, direct, commercially useful speaking-to-camera assets.',
    'Vertical video for TikTok, Reels, Meta ads, landing creatives, and product pages.',
  ],
  'servicios/videos-de-portavoz/index.html': [
    'Más claridad cuando la oferta es nueva o necesita contexto.',
    'Mejor retención cuando el mensaje tiene estructura en vez de apoyarse solo en edición.',
    'Un activo reutilizable para homepages, landings, ads y outreach.',
  ],
  'en/services/spokesperson-videos/index.html': [
    'More clarity when the offer is new or needs context.',
    'Better retention when the message has structure instead of relying only on editing.',
    'A reusable asset for homepages, landing pages, ads, and outreach.',
  ],
  'servicios/ugc-ads-tiktok-meta/index.html': [
    'Material útil para probar distintos hooks y entradas.',
    'Explicación visual suficiente para vender sin depender solo del copy del anuncio.',
    'Assets que también pueden vivir en product pages o landing sections de performance.',
  ],
  'en/services/ugc-ads-tiktok-meta/index.html': [
    'Useful material for testing different hooks and opening angles.',
    'Enough visual explanation to sell without relying only on ad copy.',
    'Assets that can also live on product pages or performance landing sections.',
  ],
  'servicios/testimoniales-resenas-ugc/index.html': [
    'Marcas en Estados Unidos, España y Latinoamérica que venden en ecommerce o DTC.',
    'Video testimonial para Meta Ads, TikTok Ads y campañas de retargeting.',
    'Assets de apoyo para páginas de producto, landings de conversión y email marketing.',
  ],
  'en/services/ugc-testimonials-reviews/index.html': [
    'Brands in the US, Spain, and Latin America selling through ecommerce or DTC.',
    'Video testimonials for Meta Ads, TikTok Ads, and retargeting campaigns.',
    'Support assets for product pages, conversion landing pages, and email marketing.',
  ],
  'servicios/demo-producto-ugc/index.html': [
    'Campañas de consideración y mid-funnel donde el usuario ya sabe que existe el producto pero necesita entenderlo.',
    'Páginas de producto y landings donde un video demostración aclara dudas y baja la tasa de rebote.',
    'Ads educativos para TikTok y Meta que enseñan mientras venden.',
  ],
  'en/services/ugc-product-demo/index.html': [
    'Consideration and mid-funnel campaigns where the user knows the product exists but needs to understand it.',
    'Product pages and landing pages where a demo video clears doubts and lowers bounce rate.',
    'Educational ads for TikTok and Meta that teach while they sell.',
  ],
  'servicios/ugc-problema-solucion/index.html': [
    'Campañas de conversión y retargeting en Meta Ads y TikTok Ads.',
    'Audiencias frías que necesitan identificarse con el dolor antes de considerar el producto.',
    'Lotes de creativos para testeo donde cada pieza tiene una hipótesis clara de dolor y solución.',
  ],
  'en/services/ugc-problem-solution/index.html': [
    'Conversion and retargeting campaigns on Meta Ads and TikTok Ads.',
    'Cold audiences that need to feel the pain before considering the product.',
    'Creative testing batches where each piece has a clear pain-and-solution hypothesis.',
  ],
  'servicios/ugc-lifestyle/index.html': [
    'Marcas de Estados Unidos, España, Latinoamérica, Australia y Nueva Zelanda.',
    'Contenido orgánico para redes en español e inglés.',
    'Video vertical para Instagram Reels, TikTok orgánico y feeds de marca.',
  ],
  'en/services/lifestyle-ugc-organic-content/index.html': [
    'Brands in the US, Spain, Latin America, Australia, and New Zealand.',
    'Organic social content in Spanish and English.',
    'Vertical video for Instagram Reels, organic TikTok, and brand feeds.',
  ],
  'servicios/b-roll-footage-ugc/index.html': [
    'Marcas en Estados Unidos, España, Latinoamérica y Oceanía que editan internamente.',
    'B-roll para ads, orgánico, landings, emails y presentaciones de producto.',
    'Complemento frecuente para servicios de UGC lifestyle, ads o testimoniales.',
  ],
  'en/services/ugc-b-roll-footage/index.html': [
    'Brands in the US, Spain, Latin America, and Oceania that edit in-house.',
    'B-roll for ads, organic posts, landing pages, emails, and product presentations.',
    'A common add-on to lifestyle UGC, ad, or testimonial projects.',
  ],
};

const GEO_BY_FILE = {
  'servicios/creadora-ugc-bilingue/index.html':
    `Gisela Saldarriaga es creadora UGC bilingüe. Produce desde Medellín anuncios para TikTok y Meta, demos, reseñas y videos de portavoz en español e inglés para marcas en el mercado hispano de Estados Unidos, España y LatAm. Trabaja en Fiverr como [gisela_sm](${FIVERR}): 4.8/5 en 173 reseñas verificadas. Lleva 28+ campañas de marca. El contenido se entrega a la marca; no lo publica en sus redes salvo un acuerdo de ambassador.`,
  'en/services/bilingual-ugc-creator/index.html':
    `Gisela Saldarriaga is a bilingual UGC creator. She produces TikTok and Meta ads, demos, reviews, and spokesperson videos from Medellín, in Spanish and English, for US Hispanic, Spain, and LatAm brands. She works on Fiverr as [gisela_sm](${FIVERR}): 4.8/5 from 173 verified reviews. 28+ brand campaigns. Content is delivered to the brand; she does not post client work unless it is an ambassador deal.`,
};

const FAQ_BY_FILE = {
  'servicios/creadora-ugc-bilingue/index.html': [
    {
      question: '¿Trabajas tanto en español como en inglés?',
      answer:
        'Sí. El español es mi idioma nativo y también trabajo en inglés para piezas breves y comerciales. Cuando el proyecto es en inglés, prefiero partir de un guion o una estructura clara para mantener naturalidad y precisión.',
    },
    {
      question: '¿Puedes grabar una misma pieza en dos idiomas?',
      answer:
        'Sí. Es una de las razones por las que esta página existe. Puedo producir versiones paralelas para campañas que necesitan consistencia de mensaje entre mercados.',
    },
    {
      question: '¿Qué tipo de marcas encajan mejor aquí?',
      answer:
        'Cualquier marca que necesite una creadora con presencia natural frente a cámara y criterio comercial. He trabajado con marcas de muchas industrias.',
    },
    {
      question: '¿Esto sirve solo para ads?',
      answer:
        'No. También funciona para landings, páginas de producto, creativos orgánicos, demos, testimoniales y piezas de apoyo para equipos de ventas.',
    },
    {
      question: '¿Cómo trabajas el inglés?',
      answer: 'En inglés trabajo con guion y un tope de 65 palabras por video para que suene natural.',
    },
  ],
  'en/services/bilingual-ugc-creator/index.html': [
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
        "Any brand that needs a creator with natural on-camera presence and clear commercial instincts. I've worked across many industries.",
    },
    {
      question: 'Is this only for paid ads?',
      answer:
        'No. It also works for landing pages, product pages, organic social, demos, reviews, and sales-support content.',
    },
    {
      question: 'How do you work in English?',
      answer: 'For English I work from a script, with a 65-word cap per video so it stays natural.',
    },
  ],
};

const FICHA_LABELS = {
  es: { what: 'Qué es', ask: 'Qué pides', languages: 'Idiomas', fits: 'Sirve si', not: 'No sirve si' },
  en: { what: 'What it is', ask: 'What you ask for', languages: 'Languages', fits: 'Fits if', not: 'Does not fit if' },
};

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

const buildFichaRows = (entry) => {
  const labels = FICHA_LABELS[entry.locale];
  const marketItems = MARKET_BY_FILE[entry.file] ?? [];
  return [
    { label: labels.what, value: entry.sectionIntroText },
    { label: labels.ask, value: entry.deliverables.map((item) => item.title).join(', ') },
    { label: labels.languages, value: marketItems.join(' ') },
    { label: labels.fits, value: entry.bestFitItems.join(' ') },
    { label: labels.not, value: entry.notFitItems.join(' ') },
  ];
};

const fitHeading = (locale) => (locale === 'es' ? '¿Es para ti?' : 'Is this for you?');
const faqHeadingFallback = (locale) => (locale === 'es' ? 'Preguntas' : 'Questions');

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
  } = entry;
  const fichaRows = buildFichaRows(entry);
  const geoFact = GEO_BY_FILE[entry.file];
  const faqs = FAQ_BY_FILE[entry.file] ?? [];

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

          <h2 class="boot-section-heading">${escapeHtml(fitHeading(entry.locale))}</h2>
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
              ? `<h2 class="boot-section-heading">${escapeHtml(faqHeadingFallback(entry.locale))}</h2>
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
  } = entry;
  const fichaRows = buildFichaRows(entry);
  const geoFact = GEO_BY_FILE[entry.file];
  const faqs = FAQ_BY_FILE[entry.file] ?? [];

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
          <h2>${escapeHtml(fitHeading(entry.locale))}</h2>
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
              ? `<h2>${escapeHtml(faqHeadingFallback(entry.locale))}</h2>
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
      bootExpansionHtml.trim(),
    );
  } else {
    source = source.replace(
      /( {6}<\/section>\n {6}<noscript>)/,
      `${bootExpansionHtml}\n      </section>\n      <noscript>`,
    );
  }

  const noscriptExpansionHtml = generateNoscriptExpansion(entry);
  if (source.includes('SERVICE-EXPANDED-NOSCRIPT')) {
    source = source.replace(
      /<!-- SERVICE-EXPANDED-NOSCRIPT -->[\s\S]*?<!-- \/SERVICE-EXPANDED-NOSCRIPT -->/u,
      noscriptExpansionHtml.trim(),
    );
  } else {
    source = source.replace(
      /(\s*<!-- SERVICE-FAQ-NOSCRIPT -->)/,
      `${noscriptExpansionHtml}\n$1`,
    );
  }

  fs.writeFileSync(absolutePath, source);
  modified++;
}

console.log(`Expanded ${modified} service entrypoints with boot shell content`);
