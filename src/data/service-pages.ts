import type { ServicePageId, SiteLocale } from '@/lib/locale-path';
import { getHomePath, getServicePath } from '@/lib/locale-path';

export type ServiceFeature = {
  title: string;
  description: string;
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceStep = {
  title: string;
  description: string;
};

export type FeaturedExample = {
  clipId: number;
  title: string;
  description: string;
};

export type RelatedServiceSummary = {
  eyebrow: string;
  title: string;
  summary: string;
};

export type ServicePageContent = {
  id: ServicePageId;
  locale: SiteLocale;
  path: string;
  alternatePath: string;
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  breadcrumbLabel: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSummary: string;
  heroPoints: string[];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  sectionIntroTitle: string;
  sectionIntroText: string;
  deliverablesTitle: string;
  deliverables: ServiceFeature[];
  bestFitTitle: string;
  bestFitItems: string[];
  notFitTitle: string;
  notFitItems: string[];
  marketTitle: string;
  marketItems: string[];
  processTitle: string;
  processSteps: ServiceStep[];
  featuredTitle: string;
  featuredIntro: string;
  featuredExamples: FeaturedExample[];
  faqTitle: string;
  faqs: ServiceFaq[];
  ctaTitle: string;
  ctaText: string;
  relatedTitle: string;
  relatedServiceIds: ServicePageId[];
};

type LocalizedServicePageMap = Record<ServicePageId, Record<SiteLocale, Omit<ServicePageContent, 'id' | 'locale' | 'path' | 'alternatePath' | 'relatedServiceIds'> & { relatedServiceIds: ServicePageId[] }>>;

const SERVICE_PAGE_CONTENT: LocalizedServicePageMap = {
  'bilingual-ugc-creator': {
    es: {
      navLabel: 'Creadora UGC bilingüe',
      metaTitle: 'Creadora UGC bilingüe | Gisela Saldarriaga',
      metaDescription:
        'Creadora UGC bilingüe para marcas que necesitan anuncios, demos y reviews en español e inglés para Estados Unidos, España y Latinoamérica.',
      breadcrumbLabel: 'Creadora UGC bilingüe',
      heroEyebrow: 'Servicio principal',
      heroTitle: 'Creadora UGC bilingüe para marcas que venden en varios mercados',
      heroSummary:
        'Creo anuncios UGC, demos, reseñas y piezas directas a cámara en español e inglés para equipos que necesitan una misma creadora capaz de sostener tono, claridad comercial y presencia frente a cámara.',
      heroPoints: [
        'Español nativo + briefs en inglés',
        'Producción remota desde Medellín',
        'Pensado para paid social y landings',
      ],
      primaryCtaLabel: 'Ir al contacto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver portafolio',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Qué resuelve este servicio',
      sectionIntroText:
        'Esta página existe para equipos que no quieren dividir producción entre una versión en español y otra en inglés. Aquí el valor no es solo traducir: es mantener la intención comercial, el ritmo y la naturalidad en ambos idiomas sin perder coherencia de marca.',
      deliverablesTitle: 'Qué puedes pedir dentro de este servicio',
      deliverables: [
        {
          title: 'UGC ads bilingües',
          description: 'Creativos para TikTok Ads, Meta Ads y paid social con hooks, beneficio central y CTA adaptados al idioma objetivo.',
        },
        {
          title: 'Demos y how-to',
          description: 'Explicaciones de producto para ecommerce, apps, SaaS y servicios digitales con lenguaje claro y ritmo comercial.',
        },
        {
          title: 'Reviews y testimoniales',
          description: 'Piezas de confianza para reducir fricción, explicar resultados y apoyar decisiones de compra.',
        },
        {
          title: 'Assets para varios mercados',
          description: 'Versiones en español e inglés para campañas que apuntan a Estados Unidos, España y Latinoamérica desde una misma línea creativa.',
        },
      ],
      bestFitTitle: 'Mejor encaje',
      bestFitItems: [
        'Marcas que venden a audiencias hispanas en Estados Unidos y también quieren una versión en inglés limpia.',
        'Equipos de ecommerce, beauty, lifestyle, SaaS o tech que necesitan velocidad sin perder consistencia visual.',
        'Campañas que mezclan demos, spokesperson, reviews y creator-led ads dentro de un mismo sprint.',
      ],
      notFitTitle: 'No es la mejor opción si',
      notFitItems: [
        'Necesitas una producción tipo estudio con varias locaciones, actores o set complejo.',
        'Buscas doblaje o adaptación cultural profunda para varios países sin rehacer guión ni enfoque.',
        'El proyecto depende de claims imposibles de sostener con una voz natural frente a cámara.',
      ],
      marketTitle: 'Mercados y formatos que suelo cubrir',
      marketItems: [
        'Estados Unidos hispano, España y Latinoamérica.',
        'Briefs en inglés para piezas cortas, directas y naturales frente a cámara.',
        'Vertical video para TikTok, Reels, Meta Ads, landing creatives y páginas de producto.',
      ],
      processTitle: 'Cómo suelo trabajar este tipo de proyecto',
      processSteps: [
        {
          title: '1. Brief y ángulo',
          description: 'Alineamos objetivo, audiencia, hook, proof points y si habrá una o dos versiones por idioma.',
        },
        {
          title: '2. Guion o estructura',
          description: 'Puedo trabajar con tu script o ayudarte a ordenar el mensaje para que suene comercial sin verse forzado.',
        },
        {
          title: '3. Grabación y edición',
          description: 'Produzco las piezas con enfoque creator-led, cuidando claridad, presencia, energía y ritmo de retención.',
        },
        {
          title: '4. Entrega lista para probar',
          description: 'Recibes assets listos para pauta, orgánico o landings, con margen para iterar hooks y mensajes.',
        },
      ],
      featuredTitle: 'Ejemplos que sostienen bien este servicio',
      featuredIntro: 'Estas piezas muestran cómo se ve una voz creadora clara, comercial y adaptable entre categorías.',
      featuredExamples: [
        {
          clipId: 1,
          title: 'Review lifestyle de producto',
          description: 'Un formato natural y cercano que funciona bien cuando el objetivo es confianza + conversión.',
        },
        {
          clipId: 2,
          title: 'Portavoz de marca',
          description: 'Direct-to-camera con explicación limpia para presentar oferta, contexto y beneficio principal.',
        },
        {
          clipId: 7,
          title: 'Demo para servicios digitales',
          description: 'Un ejemplo útil para tech y SaaS cuando el reto es explicar valor rápido y sin fricción.',
        },
      ],
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
            'Sí. Es una de las razones por las que esta página existe. Puedo producir versiones paralelas para campañas que necesitan consistencia de mensaje entre mercados.',
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
      ctaTitle: 'Si necesitas una misma creadora para español e inglés, esta es la página correcta',
      ctaText:
        'Cuéntame el mercado, el tipo de producto y si necesitas assets para ads, demos o reseñas. Te diré la forma más útil de estructurarlo.',
      relatedTitle: 'Otras páginas útiles',
      relatedServiceIds: ['spokesperson-videos', 'ugc-ads-tiktok-meta'],
    },
    en: {
      navLabel: 'Bilingual UGC creator',
      metaTitle: 'Bilingual UGC creator | Gisela Saldarriaga',
      metaDescription:
        'Bilingual UGC creator for brands that need ads, demos, reviews, and creator-led videos in Spanish and English for the US, Spain, and LatAm.',
      breadcrumbLabel: 'Bilingual UGC creator',
      heroEyebrow: 'Core service',
      heroTitle: 'A bilingual UGC creator for brands selling across Spanish and English markets',
      heroSummary:
        'I create bilingual UGC ads, demos, reviews, and speaking-to-camera assets for teams that need one creator who can hold tone, clarity, and on-camera presence across both Spanish and English.',
      heroPoints: [
        'Native Spanish + English-ready briefs',
        'Remote production from Medellin',
        'Built for paid social and landing pages',
      ],
      primaryCtaLabel: 'Go to contact',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See portfolio',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'What this service solves',
      sectionIntroText:
        'This page is for teams that do not want one creator for Spanish and a different one for English. The value here is not just translation. It is keeping the commercial intent, pacing, and brand feel consistent across both versions.',
      deliverablesTitle: 'What you can request inside this service',
      deliverables: [
        {
          title: 'Bilingual UGC ads',
          description: 'TikTok ads, Meta ads, and paid social creatives with hooks, proof points, and CTAs adapted to the target language.',
        },
        {
          title: 'Product demos and how-to videos',
          description: 'Clear product explainers for ecommerce, apps, SaaS, and digital offers with a creator-led tone.',
        },
        {
          title: 'Reviews and testimonial-style videos',
          description: 'Trust-building assets that reduce friction and support the buying decision.',
        },
        {
          title: 'Cross-market asset batches',
          description: 'Spanish and English versions for campaigns targeting the US, Spain, and LatAm from one creative line.',
        },
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
      marketTitle: 'Markets and formats I usually cover',
      marketItems: [
        'Spanish-speaking audiences in the US, Spain, and Latin America.',
        'English briefs for short, direct, commercially useful speaking-to-camera assets.',
        'Vertical video for TikTok, Reels, Meta ads, landing creatives, and product pages.',
      ],
      processTitle: 'How this kind of project usually runs',
      processSteps: [
        {
          title: '1. Brief and angle',
          description: 'We align on the audience, hook, proof points, and whether the campaign needs one or two language versions.',
        },
        {
          title: '2. Script or structure',
          description: 'I can work from your script or help tighten the message so it sounds commercial without feeling forced.',
        },
        {
          title: '3. Production and edit',
          description: 'I produce creator-led assets with attention to clarity, energy, retention pacing, and believable delivery.',
        },
        {
          title: '4. Delivery built for testing',
          description: 'You receive assets ready for ads, landing pages, or organic posting, with room to iterate on hooks and messaging.',
        },
      ],
      featuredTitle: 'Examples that support this service well',
      featuredIntro: 'These pieces show what a clear, commercially useful creator voice looks like across categories.',
      featuredExamples: [
        {
          clipId: 1,
          title: 'Lifestyle product review',
          description: 'A natural, trust-first format that works when the goal is credibility and conversion together.',
        },
        {
          clipId: 2,
          title: 'Brand spokesperson delivery',
          description: 'Clean direct-to-camera structure for presenting the offer, context, and main benefit.',
        },
        {
          clipId: 7,
          title: 'Digital services demo',
          description: 'A strong reference for tech and SaaS when the job is to explain value quickly and clearly.',
        },
      ],
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
            'Yes. That is one of the main use cases for this page. I can produce paired Spanish and English versions for campaigns that need one consistent message across markets.',
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
      ctaTitle: 'If you need one creator to handle Spanish and English cleanly, start here',
      ctaText:
        'Send the market, product category, and whether you need ads, demos, reviews, or spokesperson delivery. I will tell you the cleanest structure for the batch.',
      relatedTitle: 'Related pages',
      relatedServiceIds: ['spokesperson-videos', 'ugc-ads-tiktok-meta'],
    },
  },
  'spokesperson-videos': {
    es: {
      navLabel: 'Videos de portavoz',
      metaTitle: 'Videos de portavoz para marcas | Gisela Saldarriaga',
      metaDescription:
        'Videos de portavoz y speaking to camera para explicar ofertas, lanzamientos, promociones y demos con claridad comercial y presencia natural.',
      breadcrumbLabel: 'Videos de portavoz',
      heroEyebrow: 'Speaking to camera',
      heroTitle: 'Videos de portavoz para marcas que necesitan explicar mejor su oferta',
      heroSummary:
        'Este servicio está diseñado para equipos que necesitan una cara y una voz claras frente a cámara para presentar beneficios, ordenar mensajes y hacer que la oferta se entienda rápido.',
      heroPoints: [
        'Presentación directa y creíble',
        'Guiones, promos y demos',
        'Útil para ads, landings y lanzamientos',
      ],
      primaryCtaLabel: 'Hablar del proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver ejemplos',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Dónde suele funcionar mejor',
      sectionIntroText:
        'Cuando la oferta tiene fricción, necesita explicación o pierde fuerza en texto, un video de portavoz resuelve rápido: presenta el problema, ordena el beneficio y sostiene la atención con una entrega humana y segura.',
      deliverablesTitle: 'Entregables habituales',
      deliverables: [
        {
          title: 'Presentaciones de oferta',
          description: 'Piezas para explicar producto, servicio, promo o lanzamiento con una estructura clara y vendible.',
        },
        {
          title: 'Videos para landing y producto',
          description: 'Activos front-and-center para reforzar propuesta de valor, objeciones y CTA dentro de la página.',
        },
        {
          title: 'Ads con voz portavoz',
          description: 'Creativos con presencia directa a cámara cuando el formato testimonial o creator-led necesita más orden y autoridad.',
        },
        {
          title: 'Demo guiada',
          description: 'Explicaciones paso a paso con tono humano, útil para software, servicios y productos con uso específico.',
        },
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
      marketTitle: 'Qué suele ganar la marca con este formato',
      marketItems: [
        'Más claridad cuando la oferta es nueva o necesita contexto.',
        'Mejor retención cuando el mensaje tiene estructura en vez de apoyarse solo en edición.',
        'Un activo reutilizable para homepages, landings, ads y outreach.',
      ],
      processTitle: 'Proceso de trabajo',
      processSteps: [
        {
          title: '1. Mensaje central',
          description: 'Definimos qué tiene que entender la audiencia en los primeros segundos y qué objeción principal debe quedar resuelta.',
        },
        {
          title: '2. Guion directo a cámara',
          description: 'Ajustamos lenguaje, ritmo y bloques para que la entrega suene natural, no recitada.',
        },
        {
          title: '3. Producción',
          description: 'Grabo con foco en presencia, dicción, ritmo y expresividad útil para performance y claridad.',
        },
        {
          title: '4. Versiones y uso',
          description: 'Entrego assets listos para ads, homepage, product page o mensajes de captación.',
        },
      ],
      featuredTitle: 'Ejemplos donde la voz portavoz tiene sentido',
      featuredIntro: 'Estas referencias funcionan bien cuando una cara y una explicación clara mejoran la comprensión de la oferta.',
      featuredExamples: [
        {
          clipId: 2,
          title: 'Portavoz de marca',
          description: 'El ejemplo más directo de presencia, orden y beneficio comunicado frente a cámara.',
        },
        {
          clipId: 6,
          title: 'Presentación de servicios',
          description: 'Útil para explicar una oferta cuando necesitas una sensación más clara y comercial que un reel casual.',
        },
        {
          clipId: 7,
          title: 'Review de servicios AI',
          description: 'Muestra cómo aterrizar una propuesta más técnica con una entrega comprensible y ágil.',
        },
      ],
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
            'Sí. De hecho funciona muy bien en homepages, landings y páginas de producto cuando necesitas que alguien presente el valor en pocos segundos.',
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
      ctaTitle: 'Si tu oferta necesita explicación, un portavoz claro suele convertir mejor que más edición',
      ctaText:
        'Envíame la oferta, el uso principal de la pieza y si irá en ads, homepage o landing. Con eso puedo orientarte rápido.',
      relatedTitle: 'También puede interesarte',
      relatedServiceIds: ['bilingual-ugc-creator', 'ugc-ads-tiktok-meta'],
    },
    en: {
      navLabel: 'Spokesperson videos',
      metaTitle: 'Spokesperson videos for brands | Gisela Saldarriaga',
      metaDescription:
        'Spokesperson and speaking-to-camera videos to explain offers, launches, promos, and demos with clearer delivery and commercial structure.',
      breadcrumbLabel: 'Spokesperson videos',
      heroEyebrow: 'Speaking to camera',
      heroTitle: 'Spokesperson videos for brands that need to explain the offer more clearly',
      heroSummary:
        'This service is built for teams that need a clear face and voice on camera to present benefits, structure the message, and make the offer easier to understand fast.',
      heroPoints: [
        'Clear, credible on-camera delivery',
        'Scripts, promos, and demos',
        'Useful for ads, landing pages, and launches',
      ],
      primaryCtaLabel: 'Discuss the project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See examples',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'Where this format works best',
      sectionIntroText:
        'When the offer has friction, needs context, or loses force in static copy, a spokesperson video helps quickly. It frames the problem, explains the benefit, and holds attention with a human, confident delivery.',
      deliverablesTitle: 'Typical deliverables',
      deliverables: [
        {
          title: 'Offer presentations',
          description: 'Assets that explain a product, service, launch, or promo with a clear and commercially useful structure.',
        },
        {
          title: 'Landing and product-page videos',
          description: 'Front-and-center assets that reinforce the value proposition, handle objections, and support the CTA.',
        },
        {
          title: 'Ads with spokesperson delivery',
          description: 'Direct-to-camera creatives when a testimonial or loose creator format needs more authority and structure.',
        },
        {
          title: 'Guided demos',
          description: 'Step-by-step explanations with a human tone, especially useful for software, services, and product education.',
        },
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
      marketTitle: 'What brands usually gain from this format',
      marketItems: [
        'More clarity when the offer is new or needs context.',
        'Better retention when the message has structure instead of relying only on editing.',
        'A reusable asset for homepages, landing pages, ads, and outreach.',
      ],
      processTitle: 'How the process works',
      processSteps: [
        {
          title: '1. Core message',
          description: 'We define what the viewer needs to understand in the first seconds and which objection the video should resolve.',
        },
        {
          title: '2. Direct-to-camera script',
          description: 'We shape the copy and pacing so the delivery sounds natural, not memorized.',
        },
        {
          title: '3. Production',
          description: 'I record with focus on presence, diction, pacing, and expression that actually helps performance.',
        },
        {
          title: '4. Versions and usage',
          description: 'You receive assets ready for ads, homepages, product pages, or outbound use.',
        },
      ],
      featuredTitle: 'Examples where spokesperson delivery makes sense',
      featuredIntro: 'These references work well when a face and a clear explanation improve how the offer is understood.',
      featuredExamples: [
        {
          clipId: 2,
          title: 'Brand spokesperson video',
          description: 'The clearest reference for presence, structure, and benefit-driven delivery on camera.',
        },
        {
          clipId: 6,
          title: 'Services presentation',
          description: 'Useful when you need a clearer, more commercially structured message than a casual reel can provide.',
        },
        {
          clipId: 7,
          title: 'AI services review',
          description: 'Shows how a more technical offer can be made understandable with direct, paced explanation.',
        },
      ],
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
      ctaTitle: 'If the offer needs explanation, a clear spokesperson format often converts better than more editing',
      ctaText:
        'Send the offer, the primary use case, and whether the piece is for ads, a homepage, or a landing page. That is enough to shape the right structure.',
      relatedTitle: 'You may also want',
      relatedServiceIds: ['bilingual-ugc-creator', 'ugc-ads-tiktok-meta'],
    },
  },
  'ugc-ads-tiktok-meta': {
    es: {
      navLabel: 'UGC Ads para TikTok y Meta',
      metaTitle: 'UGC Ads para TikTok y Meta | Gisela Saldarriaga',
      metaDescription:
        'UGC ads para TikTok y Meta con hooks, demos, problem-solution, reseñas y speaking to camera pensados para testear, retener y vender.',
      breadcrumbLabel: 'UGC Ads para TikTok y Meta',
      heroEyebrow: 'Paid social creatives',
      heroTitle: 'UGC Ads para TikTok y Meta con enfoque en hooks, claridad y conversión',
      heroSummary:
        'Esta página está pensada para marcas que necesitan creativos listos para paid social: piezas que entran rápido, muestran el producto sin perder naturalidad y dejan espacio para testear ángulos, ofertas y mensajes.',
      heroPoints: [
        'Hooks y primeros segundos fuertes',
        'Creativos para testear ofertas y ángulos',
        'Formato nativo para TikTok y Meta',
      ],
      primaryCtaLabel: 'Pedir creativos',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver muestras',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Qué buscan normalmente los equipos de performance',
      sectionIntroText:
        'No solo “un video bonito”. Lo que suele hacer falta aquí es una biblioteca pequeña pero útil de hooks, demo, pain-point, beneficios, social proof y CTA que se pueda poner a prueba rápido en paid social.',
      deliverablesTitle: 'Tipos de UGC Ads que suelo producir',
      deliverables: [
        {
          title: 'Hook + benefit + CTA',
          description: 'La base más directa para Meta y TikTok cuando necesitas un activo entendible en segundos.',
        },
        {
          title: 'Problem–solution creatives',
          description: 'Piezas que arrancan desde el dolor o la fricción real del usuario y aterrizan el producto como solución.',
        },
        {
          title: 'Demo-led ads',
          description: 'Creativos donde el producto en uso sostiene la historia y reduce objeciones mientras vende.',
        },
        {
          title: 'Review/testimonial ads',
          description: 'Anuncios donde la credibilidad del formato creator-led ayuda a mover la intención de compra.',
        },
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
      marketTitle: 'Lo que intento dejar listo para el equipo',
      marketItems: [
        'Material útil para probar distintos hooks y entradas.',
        'Explicación visual suficiente para vender sin depender solo del copy del anuncio.',
        'Assets que también pueden vivir en product pages o landing sections de performance.',
      ],
      processTitle: 'Cómo enfoco un lote de creativos',
      processSteps: [
        {
          title: '1. Hipótesis creativa',
          description: 'Definimos ángulo, promesa, objeción principal y nivel de awareness del público.',
        },
        {
          title: '2. Guion modular',
          description: 'Separo hook, body, prueba y CTA para que luego sea más fácil iterar variaciones.',
        },
        {
          title: '3. Producción creator-led',
          description: 'Grabo con foco en retención, naturalidad y visibilidad de producto, no solo en estética.',
        },
        {
          title: '4. Entrega orientada a test',
          description: 'El objetivo es que el equipo tenga piezas listas para probar, combinar y aprender rápido.',
        },
      ],
      featuredTitle: 'Piezas que encajan con esta intención',
      featuredIntro: 'Estas referencias muestran diferentes maneras de vender con creator-led performance content.',
      featuredExamples: [
        {
          clipId: 1,
          title: 'Review lifestyle para paid social',
          description: 'Un formato que mezcla naturalidad, producto visible y mensaje de compra sin verse rígido.',
        },
        {
          clipId: 4,
          title: 'Review / testimonial de suplemento',
          description: 'Útil cuando la conversión depende de confianza, beneficio claro y delivery creíble.',
        },
        {
          clipId: 7,
          title: 'Demo ágil para servicios AI',
          description: 'Un ejemplo de cómo explicar valor rápido cuando el producto necesita algo de contexto.',
        },
      ],
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
            'Sí. De hecho suele ser más útil trabajar por variaciones de hook, beneficio o CTA que por una sola pieza aislada.',
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
      ctaTitle: 'Si necesitas más material para testear en TikTok o Meta, esta es la página a usar',
      ctaText:
        'Envíame producto, categoría, oferta y qué tipo de creativo quieres probar. Con eso puedo orientarte en formatos y número de piezas.',
      relatedTitle: 'Sigue explorando',
      relatedServiceIds: ['bilingual-ugc-creator', 'spokesperson-videos'],
    },
    en: {
      navLabel: 'UGC ads for TikTok and Meta',
      metaTitle: 'UGC ads for TikTok and Meta | Gisela Saldarriaga',
      metaDescription:
        'UGC ads for TikTok and Meta with hooks, demos, problem-solution angles, reviews, and speaking-to-camera delivery built for testing and conversion.',
      breadcrumbLabel: 'UGC ads for TikTok and Meta',
      heroEyebrow: 'Paid social creatives',
      heroTitle: 'UGC ads for TikTok and Meta built around hooks, clarity, and conversion',
      heroSummary:
        'This page is for brands that need creatives ready for paid social: assets that open fast, show the product without losing natural delivery, and leave room to test angles, offers, and messaging.',
      heroPoints: [
        'Stronger hooks in the opening seconds',
        'Built for testing angles and offers',
        'Native-feeling format for TikTok and Meta',
      ],
      primaryCtaLabel: 'Request creatives',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See samples',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'What performance teams usually need',
      sectionIntroText:
        'Not just “a nice video.” What is usually needed here is a small but usable creative library of hooks, demos, pain-point angles, benefits, social proof, and CTAs that can be tested quickly in paid social.',
      deliverablesTitle: 'UGC ad formats I usually produce',
      deliverables: [
        {
          title: 'Hook + benefit + CTA',
          description: 'The clearest base format for Meta and TikTok when the offer needs to be understood in seconds.',
        },
        {
          title: 'Problem-solution creatives',
          description: 'Ads that start from a real user pain point and position the product as the answer.',
        },
        {
          title: 'Demo-led ads',
          description: 'Creatives where product usage carries the story and reduces objections while still selling.',
        },
        {
          title: 'Review/testimonial ads',
          description: 'Ads where the credibility of creator-led delivery helps move buying intent.',
        },
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
      marketTitle: 'What I try to leave the team with',
      marketItems: [
        'Useful material for testing different hooks and opening angles.',
        'Enough visual explanation to sell without relying only on ad copy.',
        'Assets that can also live on product pages or performance landing sections.',
      ],
      processTitle: 'How I approach a creative batch',
      processSteps: [
        {
          title: '1. Creative hypothesis',
          description: 'We define the angle, promise, main objection, and the audience awareness level.',
        },
        {
          title: '2. Modular scripting',
          description: 'I separate the hook, body, proof, and CTA so it is easier to iterate later.',
        },
        {
          title: '3. Creator-led production',
          description: 'I record with focus on retention, natural delivery, and visible product context, not only aesthetics.',
        },
        {
          title: '4. Test-ready delivery',
          description: 'The goal is to leave the team with assets that can be tested, recombined, and learned from quickly.',
        },
      ],
      featuredTitle: 'Examples that match this intent',
      featuredIntro: 'These references show different ways creator-led performance content can help sell.',
      featuredExamples: [
        {
          clipId: 1,
          title: 'Lifestyle review for paid social',
          description: 'A format that balances natural delivery, visible product use, and commercial clarity.',
        },
        {
          clipId: 4,
          title: 'Supplement review / testimonial',
          description: 'Useful when conversion depends on trust, clear benefit framing, and credible delivery.',
        },
        {
          clipId: 7,
          title: 'Fast AI services demo',
          description: 'An example of how to explain value quickly when the product needs some context.',
        },
      ],
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
      ctaTitle: 'If you need more testable creative for TikTok or Meta, start here',
      ctaText:
        'Send the product, category, offer, and what type of creative you want to test. That is enough to recommend formats and batch size.',
      relatedTitle: 'Keep exploring',
      relatedServiceIds: ['bilingual-ugc-creator', 'spokesperson-videos'],
    },
  },
  'ugc-testimonials-reviews': {
    es: {
      navLabel: 'Testimoniales y reseñas UGC',
      metaTitle: 'Reseñas UGC y video testimonial | Gisela',
      metaDescription:
        'Reseñas UGC y testimoniales en video para marcas que necesitan social proof auténtico, creíble y listo para ads, landings y producto.',
      breadcrumbLabel: 'Testimoniales y reseñas',
      heroEyebrow: 'Social proof',
      heroTitle: 'Testimoniales y reseñas UGC que generan confianza real antes de la compra',
      heroSummary:
        'Creo reseñas y testimoniales en video con tono natural y cercano para marcas que necesitan reducir fricción, mostrar resultados y darle una voz creíble a su producto.',
      heroPoints: [
        'Formato natural, no actuado',
        'Pensado para bajar objeciones',
        'Útil en ads, landings y PDPs',
      ],
      primaryCtaLabel: 'Pedir testimoniales',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver ejemplos',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Por qué el social proof en video funciona mejor',
      sectionIntroText:
        'Una reseña escrita ayuda, pero un video testimonial donde alguien muestra el producto, cuenta su experiencia y habla con naturalidad genera mucha más confianza. Este servicio existe para marcas que entienden que el UGC social proof es lo que empuja la decisión de compra.',
      deliverablesTitle: 'Qué puedes pedir dentro de este servicio',
      deliverables: [
        {
          title: 'Reseña de producto lifestyle',
          description: 'Videos donde muestro el producto en uso real, cuento la experiencia y dejo que la naturalidad haga el trabajo de venta.',
        },
        {
          title: 'Testimonial de beneficio',
          description: 'Piezas enfocadas en un resultado específico: qué cambió, qué resolvió, por qué vale la pena.',
        },
        {
          title: 'Unboxing + primera impresión',
          description: 'Formato de descubrimiento que captura la reacción real y sirve como gancho para ads o contenido orgánico.',
        },
        {
          title: 'Review comparativo',
          description: 'Cuando el producto gana frente a una alternativa, el formato comparación ayuda a posicionar la decisión.',
        },
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
      marketTitle: 'Dónde suelo entregar este tipo de contenido',
      marketItems: [
        'Marcas en Estados Unidos, España y Latinoamérica que venden en ecommerce o DTC.',
        'Video testimonial para Meta Ads, TikTok Ads y campañas de retargeting.',
        'Assets de apoyo para páginas de producto, landings de conversión y email marketing.',
      ],
      processTitle: 'Cómo trabajo un lote de reseñas',
      processSteps: [
        {
          title: '1. Producto y ángulo',
          description: 'Me cuentas qué quieres destacar, qué objeción quieres bajar y qué tono buscas: casual, entusiasta o informativo.',
        },
        {
          title: '2. Estructura de la reseña',
          description: 'Armo una guía ligera con puntos clave para que suene natural pero cubra lo que importa comercialmente.',
        },
        {
          title: '3. Grabación con producto',
          description: 'Grabo con el producto en mano, en uso real y con una entrega que se sienta genuina, no leída.',
        },
        {
          title: '4. Entrega lista para usar',
          description: 'Recibes las piezas listas para pauta, orgánico o integración en landing y páginas de producto.',
        },
      ],
      featuredTitle: 'Ejemplos de reseñas y testimoniales',
      featuredIntro: 'Estas piezas muestran cómo se ve un video testimonial natural, creíble y útil para la marca.',
      featuredExamples: [
        {
          clipId: 1,
          title: 'Review lifestyle de producto',
          description: 'Un formato cercano y natural donde el producto se muestra en contexto real de uso.',
        },
        {
          clipId: 4,
          title: 'Reseña de suplemento (creatina)',
          description: 'Ejemplo de cómo contar beneficios de un suplemento con credibilidad y sin sonar a infomercial.',
        },
        {
          clipId: 8,
          title: 'Review lifestyle con foco en experiencia',
          description: 'Una reseña donde la experiencia personal sostiene el mensaje y genera confianza.',
        },
      ],
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
      ctaTitle: 'Si tu producto necesita social proof en video, este es el servicio indicado',
      ctaText:
        'Cuéntame qué producto quieres reseñar, dónde se va a usar el video y qué beneficio quieres que quede claro. Con eso puedo proponerte formato y cantidad.',
      relatedTitle: 'También puede interesarte',
      relatedServiceIds: ['ugc-ads-tiktok-meta', 'ugc-lifestyle'],
    },
    en: {
      navLabel: 'UGC testimonials and reviews',
      metaTitle: 'UGC testimonials & review videos | Gisela',
      metaDescription:
        'UGC testimonials and product review videos that build real trust. Authentic social proof ready for ads, landing pages, and product pages.',
      breadcrumbLabel: 'Testimonials and reviews',
      heroEyebrow: 'Social proof',
      heroTitle: 'UGC testimonials and review videos that build trust before the buy',
      heroSummary:
        'I create UGC review videos and testimonial-style content with natural, believable delivery for brands that need to reduce friction, show results, and give their product a credible voice.',
      heroPoints: [
        'Natural format, not scripted acting',
        'Built to lower objections',
        'Works in ads, landing pages, and PDPs',
      ],
      primaryCtaLabel: 'Request testimonials',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See examples',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'Why video social proof outperforms text',
      sectionIntroText:
        'A written review helps, but a video where someone shows the product, shares their experience, and speaks naturally generates far more trust. This service is for brands that understand UGC testimonials are what push the buying decision over the line.',
      deliverablesTitle: 'What you can request inside this service',
      deliverables: [
        {
          title: 'Lifestyle product review',
          description: 'Videos where I show the product in real use, share the experience, and let natural delivery do the selling.',
        },
        {
          title: 'Benefit-focused testimonial',
          description: 'Pieces centered on a specific result: what changed, what it solved, why it is worth it.',
        },
        {
          title: 'Unboxing + first impression',
          description: 'A discovery format that captures real reaction and works as a hook for ads or organic content.',
        },
        {
          title: 'Comparison review',
          description: 'When the product wins against an alternative, a comparison format helps frame the buying decision.',
        },
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
      marketTitle: 'Where I usually deliver this kind of content',
      marketItems: [
        'Brands in the US, Spain, and Latin America selling through ecommerce or DTC.',
        'Video testimonials for Meta Ads, TikTok Ads, and retargeting campaigns.',
        'Support assets for product pages, conversion landing pages, and email marketing.',
      ],
      processTitle: 'How I work a review batch',
      processSteps: [
        {
          title: '1. Product and angle',
          description: 'You tell me what to highlight, which objection to address, and the tone you want: casual, enthusiastic, or informative.',
        },
        {
          title: '2. Review structure',
          description: 'I build a light guide with key points so the delivery feels natural but covers what matters commercially.',
        },
        {
          title: '3. Recording with product',
          description: 'I record with the product in hand, in real use, with delivery that feels genuine and unscripted.',
        },
        {
          title: '4. Ready-to-use delivery',
          description: 'You receive assets ready for ads, organic posting, or integration into landing and product pages.',
        },
      ],
      featuredTitle: 'Review and testimonial examples',
      featuredIntro: 'These pieces show what a natural, credible, and commercially useful video testimonial looks like.',
      featuredExamples: [
        {
          clipId: 1,
          title: 'Lifestyle product review',
          description: 'A natural, approachable format where the product is shown in real-life context.',
        },
        {
          clipId: 4,
          title: 'Supplement review (creatine)',
          description: 'An example of how to talk about supplement benefits with credibility and without sounding like an infomercial.',
        },
        {
          clipId: 8,
          title: 'Experience-led lifestyle review',
          description: 'A review where personal experience carries the message and builds trust.',
        },
      ],
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
      ctaTitle: 'If your product needs video social proof, this is the right service',
      ctaText:
        'Tell me which product you want reviewed, where the video will be used, and which benefit should come through clearly. That is enough to suggest format and batch size.',
      relatedTitle: 'You may also want',
      relatedServiceIds: ['ugc-ads-tiktok-meta', 'ugc-lifestyle'],
    },
  },
  'ugc-product-demo': {
    es: {
      navLabel: 'Demos de producto UGC',
      metaTitle: 'Demo de producto UGC y tutoriales | Gisela',
      metaDescription:
        'Demos de producto UGC y tutoriales en video para marcas que necesitan explicar su producto paso a paso con claridad y naturalidad.',
      breadcrumbLabel: 'Demos de producto',
      heroEyebrow: 'Educación de producto',
      heroTitle: 'Demos de producto UGC que explican, muestran y venden sin aburrir',
      heroSummary:
        'Creo demos, tutoriales y videos how-to con tono claro y cercano para marcas que necesitan que su producto se entienda rápido. Mi formación en periodismo me ayuda a explicar cosas complejas sin perder la atención.',
      heroPoints: [
        'Explicaciones claras, no manuales aburridos',
        'Ideal para tech, SaaS, apps y servicios',
        'Funciona en ads, landings y onboarding',
      ],
      primaryCtaLabel: 'Pedir demos',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver ejemplos',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Cuándo tiene sentido un demo UGC',
      sectionIntroText:
        'Cuando el producto necesita algo de contexto para que la gente lo entienda, un tutorial UGC bien hecho convierte mejor que cualquier carrusel o texto explicativo. No se trata de hacer un manual: se trata de mostrar el producto en uso real con una voz que transmita claridad y confianza.',
      deliverablesTitle: 'Tipos de demo que suelo producir',
      deliverables: [
        {
          title: 'Demo paso a paso',
          description: 'Video demostración de producto donde muestro el uso real con explicación ordenada y ritmo comercial.',
        },
        {
          title: 'Tutorial how-to',
          description: 'Formato educativo corto para funcionalidades, beneficios o casos de uso específicos del producto.',
        },
        {
          title: 'Review técnica con demo',
          description: 'Cuando el producto necesita credibilidad técnica además de la demostración visual.',
        },
        {
          title: 'Demo comparativa',
          description: 'Piezas que muestran por qué este producto resuelve mejor que la alternativa, con evidencia en uso.',
        },
      ],
      bestFitTitle: 'Mejor encaje',
      bestFitItems: [
        'Marcas de tech, SaaS, apps o servicios digitales que necesitan que el usuario entienda el valor antes de comprar.',
        'Productos con curva de aprendizaje donde un video tutorial reduce las dudas y acelera la conversión.',
        'Equipos que quieren contenido educativo con formato UGC para ads, landing pages u onboarding.',
      ],
      notFitTitle: 'No es la mejor opción si',
      notFitItems: [
        'El producto se entiende a primera vista y no necesita ningún tipo de explicación.',
        'Lo que buscas es un screencast técnico sin presencia humana frente a cámara.',
        'Necesitas un tutorial muy largo o un curso completo, no una pieza de marketing.',
      ],
      marketTitle: 'Dónde encaja mejor este formato',
      marketItems: [
        'Campañas de consideración y mid-funnel donde el usuario ya sabe que existe el producto pero necesita entenderlo.',
        'Páginas de producto y landings donde un video demostración aclara dudas y baja la tasa de rebote.',
        'Ads educativos para TikTok y Meta que enseñan mientras venden.',
      ],
      processTitle: 'Cómo armo un lote de demos',
      processSteps: [
        {
          title: '1. Producto y mensaje clave',
          description: 'Entiendo qué hace el producto, qué beneficio principal quieres destacar y quién es la audiencia.',
        },
        {
          title: '2. Guion o estructura de demo',
          description: 'Preparo una estructura que fluya: contexto rápido, demostración clara, beneficio visible y cierre.',
        },
        {
          title: '3. Grabación con producto en uso',
          description: 'Grabo mostrando el producto real, explicando con naturalidad y manteniendo ritmo para retención.',
        },
        {
          title: '4. Entrega para distintos canales',
          description: 'Recibes las piezas listas para ads, landing pages, producto, onboarding o contenido orgánico.',
        },
      ],
      featuredTitle: 'Ejemplos de demos y tutoriales',
      featuredIntro: 'Estas piezas muestran cómo explico productos y servicios con claridad y ritmo comercial.',
      featuredExamples: [
        {
          clipId: 3,
          title: 'Review de voicebot (demo tech)',
          description: 'Un ejemplo de cómo presentar un producto tecnológico con explicación clara y tono accesible.',
        },
        {
          clipId: 7,
          title: 'Demo de servicios AI',
          description: 'Muestra cómo aterrizar una propuesta técnica en pocos segundos sin perder al espectador.',
        },
        {
          clipId: 9,
          title: 'Review de bots con voiceover',
          description: 'Formato más corto para explicar herramientas digitales con voiceover y ritmo directo.',
        },
      ],
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
      ctaTitle: 'Si tu producto necesita explicarse para venderse, un demo UGC hace el trabajo',
      ctaText:
        'Cuéntame qué producto quieres mostrar, a quién va dirigido y dónde se va a usar el video. Con eso puedo proponerte estructura y formato.',
      relatedTitle: 'Sigue explorando',
      relatedServiceIds: ['ugc-testimonials-reviews', 'ugc-problem-solution'],
    },
    en: {
      navLabel: 'UGC product demos',
      metaTitle: 'UGC product demo & tutorial videos | Gisela',
      metaDescription:
        'UGC product demos and how-to videos that explain your product step by step with clarity, natural delivery, and commercial focus.',
      breadcrumbLabel: 'Product demos',
      heroEyebrow: 'Product education',
      heroTitle: 'UGC product demos that explain, show, and sell without boring anyone',
      heroSummary:
        'I create product demos, tutorials, and how-to videos with clear, approachable delivery for brands that need their product understood fast. My journalism background helps me break down complex products without losing attention.',
      heroPoints: [
        'Clear explanations, not boring manuals',
        'Great for tech, SaaS, apps, and services',
        'Works in ads, landing pages, and onboarding',
      ],
      primaryCtaLabel: 'Request demos',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See examples',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'When a UGC product demo makes sense',
      sectionIntroText:
        'When the product needs some context before people get it, a well-made product tutorial video converts better than any carousel or wall of text. This is not about building a manual. It is about showing the product in real use with a voice that communicates clarity and confidence.',
      deliverablesTitle: 'Demo formats I usually produce',
      deliverables: [
        {
          title: 'Step-by-step demo',
          description: 'A product demonstration video showing real use with structured explanation and commercial pacing.',
        },
        {
          title: 'How-to tutorial',
          description: 'Short educational format for specific features, benefits, or use cases.',
        },
        {
          title: 'Technical review with demo',
          description: 'When the product needs technical credibility on top of visual demonstration.',
        },
        {
          title: 'Comparison demo',
          description: 'Pieces that show why this product solves better than the alternative, with evidence in use.',
        },
      ],
      bestFitTitle: 'Best fit',
      bestFitItems: [
        'Tech, SaaS, app, and digital service brands that need the user to understand value before buying.',
        'Products with a learning curve where a how-to video reduces doubts and speeds up conversion.',
        'Teams that want educational content in UGC format for ads, landing pages, or onboarding.',
      ],
      notFitTitle: 'Not the best fit if',
      notFitItems: [
        'The product is self-explanatory at first glance and needs no context.',
        'You want a technical screencast with no human presence on camera.',
        'You need a long-form tutorial or full course, not a marketing asset.',
      ],
      marketTitle: 'Where this format fits best',
      marketItems: [
        'Consideration and mid-funnel campaigns where the user knows the product exists but needs to understand it.',
        'Product pages and landing pages where a demo video clears doubts and lowers bounce rate.',
        'Educational ads for TikTok and Meta that teach while they sell.',
      ],
      processTitle: 'How I approach a demo batch',
      processSteps: [
        {
          title: '1. Product and core message',
          description: 'I learn what the product does, which benefit to highlight, and who the audience is.',
        },
        {
          title: '2. Demo script or structure',
          description: 'I prepare a structure that flows: quick context, clear demonstration, visible benefit, and close.',
        },
        {
          title: '3. Recording with product in use',
          description: 'I record showing the real product, explaining naturally, and keeping pacing tight for retention.',
        },
        {
          title: '4. Multi-channel delivery',
          description: 'You receive assets ready for ads, landing pages, product pages, onboarding, or organic content.',
        },
      ],
      featuredTitle: 'Demo and tutorial examples',
      featuredIntro: 'These pieces show how I explain products and services with clarity and commercial pacing.',
      featuredExamples: [
        {
          clipId: 3,
          title: 'Voicebot review (tech demo)',
          description: 'An example of presenting a tech product with clear explanation and accessible tone.',
        },
        {
          clipId: 7,
          title: 'AI services demo',
          description: 'Shows how to land a technical proposition in seconds without losing the viewer.',
        },
        {
          clipId: 9,
          title: 'Bot review with voiceover',
          description: 'A shorter format for explaining digital tools with voiceover and direct pacing.',
        },
      ],
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
      ctaTitle: 'If your product needs explaining to sell, a UGC demo does the job',
      ctaText:
        'Tell me which product you want to showcase, who it is for, and where the video will live. That is enough to propose structure and format.',
      relatedTitle: 'Keep exploring',
      relatedServiceIds: ['ugc-testimonials-reviews', 'ugc-problem-solution'],
    },
  },
  'ugc-problem-solution': {
    es: {
      navLabel: 'UGC problema–solución',
      metaTitle: 'Video problema solución UGC | Gisela',
      metaDescription:
        'Videos UGC con formato problema–solución: hook, dolor, solución y CTA. El formato más orientado a conversión para paid social.',
      breadcrumbLabel: 'Problema–solución',
      heroEyebrow: 'Direct response',
      heroTitle: 'Videos UGC problema–solución que enganchan, conectan y convierten',
      heroSummary:
        'Creo creativos con el formato hook–problema–solución–CTA, el más efectivo para direct response. Entiendo la estructura narrativa porque llevo más de 9 años en medios, y eso se nota en cada guion.',
      heroPoints: [
        'El 80 % del rendimiento está en el hook',
        'Formato diseñado para conversión directa',
        'Estructura probada en paid social',
      ],
      primaryCtaLabel: 'Pedir creativos',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver muestras',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Por qué el formato problema–solución domina paid social',
      sectionIntroText:
        'El formato hook problema solución funciona porque refleja cómo decide la gente: siente una frustración, se identifica con el dolor y acepta la solución cuando llega en el momento justo. No es fórmula mágica, pero sí la estructura con mejores resultados consistentes en UGC para ads.',
      deliverablesTitle: 'Tipos de creativos que entrego',
      deliverables: [
        {
          title: 'Hook + dolor + solución + CTA',
          description: 'La estructura clásica de direct response UGC: enganchar, identificar el problema, presentar la solución y cerrar.',
        },
        {
          title: 'Variaciones de hook',
          description: 'Misma pieza con diferentes entradas para testear cuál engancha más a tu audiencia en los primeros 3 segundos.',
        },
        {
          title: 'Problema–solución con demo',
          description: 'Cuando la solución se entiende mejor mostrando el producto en uso junto con la narrativa de dolor.',
        },
        {
          title: 'Antes/después narrativo',
          description: 'Formato que contrasta la frustración con el resultado para hacer tangible la transformación.',
        },
      ],
      bestFitTitle: 'Mejor encaje',
      bestFitItems: [
        'Marcas de ecommerce y DTC que ya hacen paid social y necesitan creativos con estructura de conversión clara.',
        'Productos que resuelven un dolor específico y medible: tiempo, dinero, frustración, complejidad.',
        'Equipos de performance que entienden que el hook es donde se gana o se pierde el anuncio.',
      ],
      notFitTitle: 'No es la mejor opción si',
      notFitItems: [
        'El producto no resuelve un problema claro o el dolor es difícil de articular en video.',
        'Buscas contenido aspiracional o de branding sin una intención de conversión directa.',
        'No tienes una oferta definida o un CTA al que mandar al usuario.',
      ],
      marketTitle: 'Dónde brilla este formato',
      marketItems: [
        'Campañas de conversión y retargeting en Meta Ads y TikTok Ads.',
        'Audiencias frías que necesitan identificarse con el dolor antes de considerar el producto.',
        'Lotes de creativos para testeo donde cada pieza tiene una hipótesis clara de dolor y solución.',
      ],
      processTitle: 'Cómo construyo un creativo problema–solución',
      processSteps: [
        {
          title: '1. Dolor y audiencia',
          description: 'Identificamos el problema real que siente tu cliente ideal: qué le frustra, qué ha probado, por qué sigue sin solución.',
        },
        {
          title: '2. Hook y estructura',
          description: 'Escribo múltiples opciones de hook y armo la secuencia dolor–solución–prueba–CTA para máxima retención.',
        },
        {
          title: '3. Grabación con intención',
          description: 'Grabo cada bloque pensando en que el espectador no pueda dejar de ver: emoción real, ritmo y claridad.',
        },
        {
          title: '4. Entrega con variaciones',
          description: 'Recibes creativos listos para probar con diferentes hooks, para que el equipo aprenda rápido qué funciona.',
        },
      ],
      featuredTitle: 'Piezas con estructura de conversión',
      featuredIntro: 'Estas referencias muestran cómo funciona una narrativa de dolor y solución frente a cámara.',
      featuredExamples: [
        {
          clipId: 5,
          title: 'Promoción de negocio (hook + beneficio)',
          description: 'Una pieza donde el gancho comercial lleva la narrativa y el beneficio aterriza claro.',
        },
        {
          clipId: 4,
          title: 'Reseña de suplemento con dolor implícito',
          description: 'Formato donde el problema se siente desde la experiencia personal y la solución aparece natural.',
        },
        {
          clipId: 2,
          title: 'Portavoz de marca con estructura directa',
          description: 'Ejemplo de cómo la presencia frente a cámara refuerza una narrativa de problema y solución.',
        },
      ],
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
      ctaTitle: 'Si necesitas creativos que arranquen desde el dolor y cierren en la solución, empieza aquí',
      ctaText:
        'Cuéntame el producto, el dolor principal de tu audiencia y si ya tienes datos de qué hooks han funcionado. Con eso armo una propuesta de creativos con estructura de conversión.',
      relatedTitle: 'También puede interesarte',
      relatedServiceIds: ['ugc-ads-tiktok-meta', 'ugc-product-demo'],
    },
    en: {
      navLabel: 'Problem-solution UGC',
      metaTitle: 'Problem solution UGC videos | Gisela',
      metaDescription:
        'Problem solution UGC videos with hook, pain, solution, and CTA. The most conversion-driven format for direct response paid social.',
      breadcrumbLabel: 'Problem-solution',
      heroEyebrow: 'Direct response',
      heroTitle: 'Problem-solution UGC that hooks, hits the pain, and converts',
      heroSummary:
        'I create direct response UGC with the hook-pain-solution-CTA structure, the highest-converting format in paid social. Nine years in journalism trained me to build scripts that hold attention and drive action.',
      heroPoints: [
        '80% of ad performance lives in the hook',
        'Built for direct response conversion',
        'Proven structure for paid social',
      ],
      primaryCtaLabel: 'Request creatives',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See samples',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'Why problem-solution dominates paid social',
      sectionIntroText:
        'The hook-pain-solution format works because it mirrors how people decide: they feel a frustration, recognize the pain, and accept the solution when it arrives at the right moment. It is not magic, but it is consistently the best-performing structure in direct response UGC.',
      deliverablesTitle: 'Creative formats I deliver',
      deliverables: [
        {
          title: 'Hook + pain + solution + CTA',
          description: 'The classic direct response UGC structure: grab attention, name the problem, present the solution, close.',
        },
        {
          title: 'Hook variations',
          description: 'Same core piece with different openings to test which one stops the scroll in the first three seconds.',
        },
        {
          title: 'Problem-solution with demo',
          description: 'When the solution lands better by showing the product in use alongside the pain narrative.',
        },
        {
          title: 'Narrative before/after',
          description: 'A format that contrasts the frustration with the result to make the transformation tangible.',
        },
      ],
      bestFitTitle: 'Best fit',
      bestFitItems: [
        'Ecommerce and DTC brands already running paid social that need creatives with clear conversion structure.',
        'Products that solve a specific, measurable pain: time, money, frustration, complexity.',
        'Performance teams that understand the hook is where the ad wins or dies.',
      ],
      notFitTitle: 'Not the best fit if',
      notFitItems: [
        'The product does not solve a clear problem or the pain is hard to articulate on video.',
        'You want aspirational or pure branding content with no direct conversion intent.',
        'There is no defined offer or CTA to send the viewer toward.',
      ],
      marketTitle: 'Where this format shines',
      marketItems: [
        'Conversion and retargeting campaigns on Meta Ads and TikTok Ads.',
        'Cold audiences that need to feel the pain before considering the product.',
        'Creative testing batches where each piece has a clear pain-and-solution hypothesis.',
      ],
      processTitle: 'How I build a problem-solution creative',
      processSteps: [
        {
          title: '1. Pain and audience',
          description: 'We identify the real problem your ideal buyer feels: what frustrates them, what they have tried, why it is still unsolved.',
        },
        {
          title: '2. Hook and structure',
          description: 'I write multiple hook options and build the pain-solution-proof-CTA sequence for maximum retention.',
        },
        {
          title: '3. Recording with intent',
          description: 'I record each block so the viewer cannot look away: real emotion, pacing, and clarity.',
        },
        {
          title: '4. Delivery with variations',
          description: 'You receive creatives ready to test with different hooks so the team learns fast what works.',
        },
      ],
      featuredTitle: 'Conversion-structured examples',
      featuredIntro: 'These references show how a pain-and-solution narrative plays out on camera.',
      featuredExamples: [
        {
          clipId: 5,
          title: 'Business promotion (hook + benefit)',
          description: 'A piece where the commercial hook drives the narrative and the benefit lands clearly.',
        },
        {
          clipId: 4,
          title: 'Supplement review with implied pain',
          description: 'A format where the problem is felt through personal experience and the solution arrives naturally.',
        },
        {
          clipId: 2,
          title: 'Brand spokesperson with direct structure',
          description: 'An example of how on-camera presence reinforces a problem-and-solution narrative.',
        },
      ],
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
      ctaTitle: 'If you need creatives that start from the pain and close on the solution, start here',
      ctaText:
        'Send the product, your audience\'s main pain point, and whether you have data on which hooks have worked. That is enough to build a conversion-structured creative proposal.',
      relatedTitle: 'You may also want',
      relatedServiceIds: ['ugc-ads-tiktok-meta', 'ugc-product-demo'],
    },
  },
  'ugc-lifestyle': {
    es: {
      navLabel: 'UGC lifestyle',
      metaTitle: 'Contenido lifestyle UGC | Gisela Saldarriaga',
      metaDescription:
        'Contenido UGC orgánico estilo lifestyle para feeds, Reels y TikTok. Producto integrado en escenas reales con estética natural y cercana.',
      breadcrumbLabel: 'UGC lifestyle',
      heroEyebrow: 'Contenido orgánico',
      heroTitle: 'Contenido lifestyle UGC que se siente real en el feed de tu marca',
      heroSummary:
        'Creo contenido orgánico donde tu producto aparece integrado en momentos cotidianos, sin forzar la venta. El resultado son piezas naturales, estéticas y listas para Reels, TikTok orgánico o el feed de tu marca.',
      heroPoints: [
        'Producto dentro de escenas reales',
        'Pensado para orgánico, no para ads',
        'Estética natural y relatable',
      ],
      primaryCtaLabel: 'Pedir contenido',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver portafolio',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Para qué sirve este tipo de contenido',
      sectionIntroText:
        'No todo el contenido UGC tiene que ser un anuncio. Muchas marcas necesitan piezas que funcionen en su feed orgánico: contenido que se vea auténtico, que cuente una historia pequeña y que haga que el producto se sienta parte de la vida real, no de un pitch de ventas.',
      deliverablesTitle: 'Qué incluye este servicio',
      deliverables: [
        {
          title: 'Reviews lifestyle en formato corto',
          description: 'Reseñas naturales donde el producto aparece en contexto de uso real, sin guion rígido ni tono publicitario.',
        },
        {
          title: 'Escenas de uso cotidiano',
          description: 'Momentos del día a día — rutina, espacio de trabajo, skincare, cocina — donde el producto se integra de forma orgánica.',
        },
        {
          title: 'Piezas para Reels y TikTok orgánico',
          description: 'Contenido vertical pensado para retención y engagement en feeds orgánicos, no para pauta.',
        },
        {
          title: 'Contenido para el feed de marca',
          description: 'Assets que la marca puede publicar directamente en su cuenta manteniendo un tono creator-led y cercano.',
        },
      ],
      bestFitTitle: 'Mejor encaje',
      bestFitItems: [
        'Marcas de beauty, skincare, wellness o lifestyle que quieren un feed orgánico con voz de creadora real.',
        'Equipos que necesitan contenido para redes sociales sin depender exclusivamente de pauta pagada.',
        'Productos que se ven mejor en contexto que sobre fondo blanco — donde la historia importa tanto como el objeto.',
      ],
      notFitTitle: 'No es la mejor opción si',
      notFitItems: [
        'Necesitas un anuncio con hook agresivo, CTA directo y estructura de paid social.',
        'El producto requiere una explicación técnica o una demostración paso a paso para entenderse.',
        'Buscas tomas sueltas sin voiceover ni contexto narrativo — eso es más b-roll.',
      ],
      marketTitle: 'Mercados y formatos habituales',
      marketItems: [
        'Marcas de Estados Unidos, España, Latinoamérica, Australia y Nueva Zelanda.',
        'Contenido orgánico para redes en español e inglés.',
        'Video vertical para Instagram Reels, TikTok orgánico y feeds de marca.',
      ],
      processTitle: 'Cómo funciona un proyecto lifestyle',
      processSteps: [
        {
          title: '1. Brief y concepto',
          description: 'Definimos el producto, la estética, el tipo de escena y el tono que quieres para tu feed orgánico.',
        },
        {
          title: '2. Propuesta de escenas',
          description: 'Te presento ideas de momentos y contextos donde el producto se integra de forma natural y creíble.',
        },
        {
          title: '3. Grabación lifestyle',
          description: 'Produzco las piezas con iluminación natural, ritmo orgánico y la estética que encaje con tu marca.',
        },
        {
          title: '4. Entrega lista para publicar',
          description: 'Recibes los videos editados, con subtítulos si aplica, listos para subir directamente a tus redes.',
        },
      ],
      featuredTitle: 'Ejemplos de contenido lifestyle',
      featuredIntro: 'Estas piezas muestran cómo se ve un producto integrado en momentos reales, con tono natural y ritmo orgánico.',
      featuredExamples: [
        {
          clipId: 1,
          title: 'Review lifestyle de producto',
          description: 'Un formato cercano donde el producto aparece en contexto real, con opinión genuina y sin guion forzado.',
        },
        {
          clipId: 8,
          title: 'Review lifestyle — formato medio',
          description: 'Reseña natural con más detalle sobre la experiencia de uso, manteniendo el tono conversacional.',
        },
        {
          clipId: 10,
          title: 'Lifestyle short-form',
          description: 'Pieza corta y directa pensada para captar atención rápido en scroll orgánico.',
        },
      ],
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
      ctaTitle: 'Si tu marca necesita contenido orgánico que se sienta real, hablemos',
      ctaText:
        'Cuéntame qué producto quieres mostrar, qué tono busca tu marca y para qué plataforma lo necesitas. Te propongo escenas y formatos que funcionen.',
      relatedTitle: 'Servicios relacionados',
      relatedServiceIds: ['ugc-testimonials-reviews', 'ugc-broll-footage'],
    },
    en: {
      navLabel: 'Lifestyle UGC',
      metaTitle: 'Lifestyle UGC creator | Gisela Saldarriaga',
      metaDescription:
        'Organic lifestyle UGC content for brand feeds, Reels, and TikTok. Product naturally integrated into real-life scenes with authentic aesthetics.',
      breadcrumbLabel: 'Lifestyle UGC',
      heroEyebrow: 'Organic content',
      heroTitle: 'Lifestyle UGC content that feels native in your brand feed',
      heroSummary:
        'I create organic UGC content where your product shows up inside everyday moments — no hard sell, no ad structure. The result is natural, aesthetic, and ready for Reels, TikTok organic, or your brand feed.',
      heroPoints: [
        'Product inside real-life scenes',
        'Built for organic, not for ads',
        'Aesthetic, natural, relatable',
      ],
      primaryCtaLabel: 'Request content',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See portfolio',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'What this type of content is for',
      sectionIntroText:
        'Not all UGC needs to be an ad. Many brands need pieces that work on their organic feed — content that looks authentic, tells a small story, and makes the product feel like part of real life instead of a sales pitch.',
      deliverablesTitle: 'What this service includes',
      deliverables: [
        {
          title: 'Short-form lifestyle reviews',
          description: 'Natural product reviews filmed in real-use context, without rigid scripts or a commercial tone.',
        },
        {
          title: 'Everyday use scenes',
          description: 'Day-in-the-life moments — routines, workspace, skincare, kitchen — where the product fits in organically.',
        },
        {
          title: 'Reels and organic TikTok pieces',
          description: 'Vertical content designed for retention and engagement on organic feeds, not for paid placement.',
        },
        {
          title: 'Brand feed content',
          description: 'Assets the brand can publish directly on its own account, keeping a creator-led and approachable tone.',
        },
      ],
      bestFitTitle: 'Best fit',
      bestFitItems: [
        'Beauty, skincare, wellness, and lifestyle brands that want an organic feed with a real creator voice.',
        'Teams that need social media content without relying entirely on paid ads.',
        'Products that look better in context than on a white background — where the story matters as much as the object.',
      ],
      notFitTitle: 'Not the best fit if',
      notFitItems: [
        'You need an ad with an aggressive hook, direct CTA, and paid social structure.',
        'The product requires a technical explanation or step-by-step demo to make sense.',
        'You are looking for standalone shots without voiceover or narrative context — that is closer to b-roll.',
      ],
      marketTitle: 'Markets and formats I usually cover',
      marketItems: [
        'Brands in the US, Spain, Latin America, Australia, and New Zealand.',
        'Organic social content in Spanish and English.',
        'Vertical video for Instagram Reels, organic TikTok, and brand feeds.',
      ],
      processTitle: 'How a lifestyle project works',
      processSteps: [
        {
          title: '1. Brief and concept',
          description: 'We define the product, the aesthetic, the type of scene, and the tone you want for your organic feed.',
        },
        {
          title: '2. Scene proposal',
          description: 'I present ideas for moments and settings where the product fits naturally and believably.',
        },
        {
          title: '3. Lifestyle shoot',
          description: 'I produce the pieces with natural lighting, organic pacing, and the aesthetic that matches your brand.',
        },
        {
          title: '4. Publish-ready delivery',
          description: 'You receive edited videos, with subtitles if needed, ready to upload directly to your social channels.',
        },
      ],
      featuredTitle: 'Lifestyle content examples',
      featuredIntro: 'These pieces show what a product looks like when it is woven into real moments with a natural tone and organic pacing.',
      featuredExamples: [
        {
          clipId: 1,
          title: 'Lifestyle product review',
          description: 'A close, genuine format where the product appears in real context with an honest take and no forced script.',
        },
        {
          clipId: 8,
          title: 'Lifestyle review — mid-length',
          description: 'A natural review with more detail on the usage experience, keeping the conversational tone throughout.',
        },
        {
          clipId: 10,
          title: 'Lifestyle short-form',
          description: 'A short, punchy piece designed to grab attention quickly during organic scroll.',
        },
      ],
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
      ctaTitle: 'Si tu marca necesita contenido orgánico que se sienta real, hablemos',
      ctaText:
        'Cuéntame qué producto quieres mostrar, qué tono busca tu marca y para qué plataforma lo necesitas. Te propongo escenas y formatos que funcionen.',
      relatedTitle: 'Servicios relacionados',
      relatedServiceIds: ['ugc-testimonials-reviews', 'ugc-broll-footage'],
    },
  },
  'ugc-broll-footage': {
    es: {
      navLabel: 'B-roll UGC',
      metaTitle: 'B-roll UGC — paquete de tomas | Gisela',
      metaDescription:
        'Paquetes de b-roll UGC: close-ups, tomas de producto, texturas y escenas lifestyle sin voiceover. Tu equipo edita, yo grabo.',
      breadcrumbLabel: 'B-roll UGC',
      heroEyebrow: 'Assets para edición',
      heroTitle: 'Clips UGC para edición: b-roll, tomas de producto y escenas sin voiceover',
      heroSummary:
        'Grabo paquetes de tomas — close-ups, producto en uso, texturas, ambiente — para que tu equipo tenga material real de creadora y lo edite como necesite. Sin guion, sin voiceover, solo footage listo para cortar.',
      heroPoints: [
        'Paquetes de tomas sueltas',
        'Sin voiceover — tu equipo edita',
        'Complemento ideal para otros servicios',
      ],
      primaryCtaLabel: 'Pedir paquete',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver portafolio',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Para qué sirve el b-roll UGC',
      sectionIntroText:
        'A veces la marca no necesita una pieza terminada — necesita material. Tomas limpias, bien iluminadas, con estética de creadora, que su equipo interno o su editor puedan cortar, mezclar y adaptar a distintos formatos. Este servicio existe para eso: entregar materia prima de calidad sin imponer estructura ni narrativa.',
      deliverablesTitle: 'Qué incluye un paquete de b-roll',
      deliverables: [
        {
          title: 'Close-ups de producto',
          description: 'Tomas detalladas de texturas, empaques, aplicaciones y ángulos que destacan el producto visualmente.',
        },
        {
          title: 'Producto en uso',
          description: 'Escenas de manos, rutinas y momentos donde el producto se ve en acción sin necesidad de explicación verbal.',
        },
        {
          title: 'Tomas de ambiente y lifestyle',
          description: 'Escenas de contexto — espacio, iluminación, objetos complementarios — que dan profundidad visual a la edición final.',
        },
        {
          title: 'Footage vertical y horizontal',
          description: 'Según el brief, puedo entregar tomas en ambos formatos para que el equipo tenga flexibilidad en postproducción.',
        },
      ],
      bestFitTitle: 'Mejor encaje',
      bestFitItems: [
        'Marcas con equipo de edición interno que necesitan footage original con estética UGC, no stock genérico.',
        'Equipos que ya trabajan conmigo en otros servicios y quieren sumar tomas complementarias al paquete.',
        'Campañas que requieren mucho material visual para cortar distintas versiones de un mismo concepto.',
      ],
      notFitTitle: 'No es la mejor opción si',
      notFitItems: [
        'Necesitas una pieza terminada con voiceover, guion y estructura narrativa — eso es otro servicio.',
        'No tienes capacidad de edición interna y necesitas el video listo para publicar.',
        'Buscas una sola toma específica en lugar de un paquete de clips variados.',
      ],
      marketTitle: 'Mercados y usos habituales',
      marketItems: [
        'Marcas en Estados Unidos, España, Latinoamérica y Oceanía que editan internamente.',
        'B-roll para ads, orgánico, landings, emails y presentaciones de producto.',
        'Complemento frecuente para servicios de UGC lifestyle, ads o testimoniales.',
      ],
      processTitle: 'Cómo funciona un proyecto de b-roll',
      processSteps: [
        {
          title: '1. Brief de producto y estilo',
          description: 'Me cuentas qué producto es, qué tipo de tomas necesitas y qué estética busca tu marca.',
        },
        {
          title: '2. Lista de tomas',
          description: 'Preparo una propuesta con los tipos de clips: close-ups, en uso, ambiente, ángulos. Tú apruebas o ajustas.',
        },
        {
          title: '3. Grabación del paquete',
          description: 'Produzco todas las tomas con iluminación natural y cuidado visual, pensando en que sean fáciles de editar.',
        },
        {
          title: '4. Entrega de footage organizado',
          description: 'Recibes los clips individuales nombrados y listos para que tu equipo los corte, combine o adapte.',
        },
      ],
      featuredTitle: 'Referencias visuales de este tipo de trabajo',
      featuredIntro: 'Aunque el b-roll se entrega como material suelto, estos ejemplos muestran el tipo de tomas, iluminación y estética que puedes esperar.',
      featuredExamples: [
        {
          clipId: 10,
          title: 'Toma lifestyle corta',
          description: 'Ejemplo del tipo de escena y encuadre que funciona bien como clip suelto para edición posterior.',
        },
        {
          clipId: 8,
          title: 'Escena de producto en contexto',
          description: 'Referencia de iluminación y composición natural que se traslada directamente al tipo de b-roll que entrego.',
        },
        {
          clipId: 5,
          title: 'Toma con ritmo visual',
          description: 'Muestra de pacing y estética que un editor puede integrar fácilmente en una pieza más larga o un montaje.',
        },
      ],
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
      ctaTitle: 'Si tu equipo necesita footage UGC real para editar internamente, este es el servicio',
      ctaText:
        'Cuéntame qué producto quieres mostrar, cuántas tomas necesitas y cómo las va a usar tu equipo. Te armo una propuesta de paquete que tenga sentido.',
      relatedTitle: 'Servicios relacionados',
      relatedServiceIds: ['ugc-lifestyle', 'ugc-ads-tiktok-meta'],
    },
    en: {
      navLabel: 'UGC b-roll',
      metaTitle: 'UGC b-roll footage packages | Gisela',
      metaDescription:
        'Raw UGC footage packages: close-ups, product-in-use, textures, and lifestyle scenes without voiceover. Your team edits, I shoot.',
      breadcrumbLabel: 'UGC b-roll',
      heroEyebrow: 'Editing assets',
      heroTitle: 'Raw UGC footage for your team: b-roll, product shots, and no-voiceover clips',
      heroSummary:
        'I shoot footage packages — close-ups, product in use, textures, ambient scenes — so your team has real creator-shot material to edit however they need. No script, no voiceover, just clean footage ready to cut.',
      heroPoints: [
        'Standalone clip packages',
        'No voiceover — your team edits',
        'Perfect add-on to other services',
      ],
      primaryCtaLabel: 'Request package',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See portfolio',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'What UGC b-roll is for',
      sectionIntroText:
        'Sometimes the brand does not need a finished piece — it needs material. Clean, well-lit shots with a creator aesthetic that the internal team or editor can cut, remix, and adapt across formats. This service exists for that: delivering quality raw footage without imposing a structure or narrative.',
      deliverablesTitle: 'What a b-roll package includes',
      deliverables: [
        {
          title: 'Product close-ups',
          description: 'Detailed shots of textures, packaging, application, and angles that highlight the product visually.',
        },
        {
          title: 'Product-in-use footage',
          description: 'Hands, routines, and moments where the product is shown in action without needing verbal explanation.',
        },
        {
          title: 'Ambient and lifestyle shots',
          description: 'Context scenes — space, lighting, complementary objects — that add visual depth to the final edit.',
        },
        {
          title: 'Vertical and horizontal footage',
          description: 'Depending on the brief, I can deliver both orientations so your team has flexibility in post-production.',
        },
      ],
      bestFitTitle: 'Best fit',
      bestFitItems: [
        'Brands with an internal editing team that need original footage with a UGC aesthetic, not generic stock.',
        'Teams already working with me on other services who want to add supplementary shots to the package.',
        'Campaigns that require a high volume of visual material to cut multiple versions of the same concept.',
      ],
      notFitTitle: 'Not the best fit if',
      notFitItems: [
        'You need a finished piece with voiceover, script, and narrative structure — that is a different service.',
        'You do not have internal editing capacity and need the video ready to publish.',
        'You are looking for one specific shot rather than a varied clip package.',
      ],
      marketTitle: 'Markets and common uses',
      marketItems: [
        'Brands in the US, Spain, Latin America, and Oceania that edit in-house.',
        'B-roll for ads, organic posts, landing pages, emails, and product presentations.',
        'A common add-on to lifestyle UGC, ad, or testimonial projects.',
      ],
      processTitle: 'How a b-roll project works',
      processSteps: [
        {
          title: '1. Product and style brief',
          description: 'You tell me the product, the type of shots you need, and the aesthetic your brand is going for.',
        },
        {
          title: '2. Shot list',
          description: 'I put together a proposal with clip types: close-ups, in-use, ambient, angles. You approve or adjust.',
        },
        {
          title: '3. Package shoot',
          description: 'I produce all the shots with natural lighting and visual care, making sure they are easy to edit.',
        },
        {
          title: '4. Organized footage delivery',
          description: 'You receive individual clips, named and organized, ready for your team to cut, combine, or adapt.',
        },
      ],
      featuredTitle: 'Visual references for this type of work',
      featuredIntro: 'Although b-roll is delivered as standalone clips, these examples show the type of shots, lighting, and aesthetic you can expect.',
      featuredExamples: [
        {
          clipId: 10,
          title: 'Short lifestyle shot',
          description: 'An example of the scene type and framing that works well as a standalone clip for post-production.',
        },
        {
          clipId: 8,
          title: 'Product in context',
          description: 'A reference for the natural lighting and composition that translates directly into the b-roll I deliver.',
        },
        {
          clipId: 5,
          title: 'Visually paced shot',
          description: 'A sample of pacing and aesthetic that an editor can easily integrate into a longer piece or montage.',
        },
      ],
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
      ctaTitle: 'If your team needs real UGC footage to edit in-house, this is the service',
      ctaText:
        'Tell me the product, how many shots you need, and how your team plans to use them. I will put together a package proposal that makes sense.',
      relatedTitle: 'Related pages',
      relatedServiceIds: ['ugc-lifestyle', 'ugc-ads-tiktok-meta'],
    },
  },
};

export const getServicePageContent = (serviceId: ServicePageId, locale: SiteLocale): ServicePageContent => {
  const localized = SERVICE_PAGE_CONTENT[serviceId][locale];

  return {
    ...localized,
    id: serviceId,
    locale,
    path: getServicePath(serviceId, locale),
    alternatePath: getServicePath(serviceId, locale === 'es' ? 'en' : 'es'),
  };
};

export const getServicePageRouteEntries = () => {
  const serviceIds = Object.keys(SERVICE_PAGE_CONTENT) as ServicePageId[];
  return serviceIds.flatMap((serviceId) => [
    { serviceId, locale: 'es' as SiteLocale, path: getServicePath(serviceId, 'es') },
    { serviceId, locale: 'en' as SiteLocale, path: getServicePath(serviceId, 'en') },
  ]);
};

export const getRelatedServiceSummaries = (
  serviceIds: ServicePageId[],
  locale: SiteLocale,
): RelatedServiceSummary[] =>
  serviceIds.map((serviceId) => {
    const page = getServicePageContent(serviceId, locale);
    return {
      eyebrow: page.heroEyebrow,
      title: page.navLabel,
      summary: page.metaDescription,
    };
  });
