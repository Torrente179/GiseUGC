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
