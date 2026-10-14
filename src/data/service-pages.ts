import type { ServicePageId, SiteLocale } from '@/lib/locale-path';
import { getHomePath, getServicePath } from '@/lib/locale-path';
import { FIVERR_PROFILE_URL } from '@/lib/contact-channels';
import { SITE_PROOF } from '@/data/site-proof';
import { SERVICE_FORMAT_CLIP_IDS, SERVICE_TAILORING } from '@/data/service-page-tailoring';

export type ServiceFeature = {
  title: string;
  description: string;
  /** Clip shown on the Formats phone for this deliverable (same id in ES and EN). */
  clipId?: number;
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
  id: ServicePageId;
  /** Lead clip of that service; its poster is the tile image in the page close. */
  leadClipId?: number;
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
  /** Phrase of `sectionIntroTitle` that takes the gradient accent. */
  sectionIntroTitleAccent?: string;
  sectionIntroText: string;
  /** Phrases of `sectionIntroText` shown in full ink. */
  sectionIntroHighlights?: string[];
  deliverablesTitle: string;
  deliverables: ServiceFeature[];
  bestFitTitle: string;
  bestFitItems: string[];
  notFitTitle: string;
  notFitItems: string[];
  /** Phrases of the fit items (both lists) shown in full ink. */
  fitHighlights?: string[];
  marketTitle: string;
  marketItems: string[];
  geoFact?: string;
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
      metaTitle: 'Contrata una creadora UGC bilingüe | Gisela Saldarriaga',
      metaDescription:
        'Creadora UGC bilingüe en Medellín. Grabo anuncios, demos y reseñas en español e inglés para marcas de Estados Unidos, España y Latinoamérica.',
      breadcrumbLabel: 'Creadora UGC bilingüe',
      heroEyebrow: 'Servicio principal',
      heroTitle: 'Creadora UGC bilingüe para marcas que venden en español e inglés',
      heroSummary:
        'Grabo anuncios UGC, demos, reseñas y videos hablando a cámara en español e inglés. Si le vendes a público hispano y anglo, no tienes que contratar a dos creadoras: hago las dos versiones yo misma, con el mismo estilo.',
      heroPoints: [
        'Español nativo, inglés con tu guion',
        'Trabajo remoto desde Medellín',
        'Para anuncios, landing pages y redes',
      ],
      primaryCtaLabel: 'Escríbeme',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Para qué sirve el UGC bilingüe',
      sectionIntroText:
        'Si tu campaña sale en los dos idiomas, te ahorras coordinar a dos creadoras distintas. Yo grabo ambas versiones y adapto el guion a cada idioma en vez de traducirlo palabra por palabra, así ninguna de las dos suena a traducción.',
      deliverablesTitle: 'Qué puedes pedirme',
      deliverables: [
        {
          title: 'Anuncios UGC en dos idiomas',
          description: 'Videos para TikTok Ads y Meta Ads con el hook, el beneficio y el CTA adaptados a cada idioma.',
        },
        {
          title: 'Demos y tutoriales',
          description: 'Te muestro cómo se usa tu producto, app o servicio digital, paso a paso y con palabras simples.',
        },
        {
          title: 'Reseñas y testimoniales',
          description: 'Cuento mi experiencia con el producto para que tus clientes vean a una persona real usándolo.',
        },
        {
          title: 'Versiones para cada mercado',
          description: 'La misma idea grabada en español y en inglés para Estados Unidos, España y Latinoamérica.',
        },
      ],
      bestFitTitle: 'Te conviene si',
      bestFitItems: [
        'Le vendes a público hispano en Estados Unidos y también necesitas la versión en inglés.',
        'Tu equipo necesita videos rápido y quiere que todos tengan el mismo estilo.',
        'Tu campaña mezcla demos, reseñas y videos hablando a cámara, y prefieres que los grabe una sola persona.',
      ],
      notFitTitle: 'No te conviene si',
      notFitItems: [
        'Necesitas una producción de estudio con varios actores, locaciones o escenografía.',
        'Buscas doblaje o una adaptación cultural para muchos países sin tocar el guion.',
        'El video depende de promesas que nadie diría con naturalidad frente a cámara.',
      ],
      marketTitle: 'Mercados y formatos',
      marketItems: [
        'Público hispano en Estados Unidos, España y Latinoamérica.',
        'Videos cortos en inglés hablando a cámara, con tu guion.',
        'Video vertical para TikTok, Reels, Meta Ads, landing pages y páginas de producto.',
      ],
      geoFact:
        `Gisela Saldarriaga es creadora UGC bilingüe. Produce desde Medellín anuncios para TikTok y Meta, demos, reseñas y videos de portavoz en español e inglés para marcas en el mercado hispano de Estados Unidos, España y LatAm. Trabaja en Fiverr como [gisela_sm](${FIVERR_PROFILE_URL}): ${SITE_PROOF.fiverrRating}/5 en ${SITE_PROOF.fiverrReviewCount} reseñas verificadas. Lleva 28+ campañas de marca. El contenido se entrega a la marca; no lo publica en sus redes salvo un acuerdo de ambassador.`,
      processTitle: 'Cómo trabajamos',
      processSteps: [
        {
          title: '1. Brief',
          description: 'Me cuentas a quién le vendes, qué quieres decir y si necesitas un solo idioma o los dos.',
        },
        {
          title: '2. Guion',
          description: 'En español puedo escribirlo yo o ajustar el tuyo. En inglés trabajo con tu guion, de máximo 65 palabras por video.',
        },
        {
          title: '3. Grabación y edición',
          description: 'Grabo y edito cada versión cuidando que el mensaje se entienda y que el ritmo no se caiga.',
        },
        {
          title: '4. Entrega',
          description: 'Te mando los videos en 3 a 5 días hábiles después de recibir el producto y confirmar el brief. Incluye 1 a 2 rondas de revisión.',
        },
      ],
      featuredTitle: 'Ejemplos de mi trabajo',
      featuredIntro: 'Videos para industrias muy distintas, para que veas cómo ajusto el tono a cada marca.',
      featuredExamples: [
        {
          clipId: 1006,
          title: 'Reel para varias industrias',
          description: 'Un compilado con música, bienes raíces, agro y servicios legales en un solo video.',
        },
        {
          clipId: 6,
          title: 'Presentación como creadora',
          description: 'Me presento, muestro lo que hago y cierro con un llamado a la acción.',
        },
        {
          clipId: 1,
          title: 'Reseña de ropa de Temu',
          description: 'Me pruebo varios outfits y doy mi opinión con un tono cercano. Sirve para marcas que venden en redes.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre UGC bilingüe',
      faqs: [
        {
          question: '¿Trabajas en español y en inglés?',
          answer:
            'Sí. El español es mi idioma nativo, así que no necesito guion ni tengo límite de extensión. En inglés grabo videos cortos a partir de tu guion.',
        },
        {
          question: '¿Puedes grabar el mismo video en los dos idiomas?',
          answer:
            'Sí. Grabo una versión en español y otra en inglés con el mismo estilo, para que tu mensaje sea igual en cada mercado.',
        },
        {
          question: '¿Con qué tipo de marcas trabajas?',
          answer:
            'Con marcas que necesitan a alguien natural frente a cámara, de casi cualquier industria. He grabado para ecommerce y apps, pero también para bienes raíces y servicios legales.',
        },
        {
          question: '¿Sirve solo para anuncios?',
          answer:
            'No. También puedes usar los videos en landing pages, páginas de producto, redes o material para tu equipo de ventas. El uso orgánico viene incluido; para usarlos en pauta necesitas una licencia aparte, que te cotizo.',
        },
        {
          question: '¿Cómo trabajas en inglés?',
          answer:
            'En inglés trabajo con tu guion y un tope de 65 palabras por video, para que suene natural.',
        },
      ],
      ctaTitle: '¿Necesitas tu campaña en los dos idiomas?',
      ctaText:
        'Escríbeme y cuéntame qué vendes, en qué mercado y qué videos necesitas. Te respondo con una propuesta.',
      relatedTitle: 'Otros servicios',
      relatedServiceIds: ['spokesperson-videos', 'ugc-ads-tiktok-meta'],
    },
    en: {
      navLabel: 'Bilingual UGC creator',
      metaTitle: 'Hire a bilingual UGC creator (ES+EN) | Gisela Saldarriaga',
      metaDescription:
        'Bilingual UGC creator based in Medellín. I make ads, demos, and reviews in Spanish and English for brands in the US, Spain, and Latin America.',
      breadcrumbLabel: 'Bilingual UGC creator',
      heroEyebrow: 'Main service',
      heroTitle: 'Bilingual UGC creator for brands that sell in Spanish and English',
      heroSummary:
        'I make UGC ads, demos, reviews, and talking-to-camera videos in Spanish and English. If you sell to both audiences, you don’t need two creators. I record both versions myself, in the same style.',
      heroPoints: [
        'Native Spanish, English from your script',
        'Working remotely from Medellín',
        'For ads, landing pages, and social',
      ],
      primaryCtaLabel: 'Message me',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'What bilingual UGC is for',
      sectionIntroText:
        'If your campaign runs in both languages, you don’t have to coordinate two different creators. I record both versions and adapt the script to each language instead of translating it word for word, so neither one sounds translated.',
      deliverablesTitle: 'What you can ask me for',
      deliverables: [
        {
          title: 'Bilingual UGC ads',
          description: 'TikTok and Meta ads with the hook, benefit, and CTA adapted to each language.',
        },
        {
          title: 'Demos and how-to videos',
          description: 'I walk through how your product, app, or digital service works, step by step and in plain words.',
        },
        {
          title: 'Reviews and testimonials',
          description: 'I share my experience with the product so your customers see a real person using it.',
        },
        {
          title: 'Versions for each market',
          description: 'The same idea recorded in Spanish and English for the US, Spain, and Latin America.',
        },
      ],
      bestFitTitle: 'This is for you if',
      bestFitItems: [
        'You sell to Spanish speakers in the US and also need an English version.',
        'Your team needs videos quickly and wants them all to feel like they belong together.',
        'Your campaign mixes demos, reviews, and talking-to-camera videos, and you’d rather have one person film them all.',
      ],
      notFitTitle: 'This isn’t for you if',
      notFitItems: [
        'You need a studio production with several actors, locations, or sets.',
        'You need dubbing or cultural adaptation for many countries without changing the script.',
        'The video relies on claims nobody could say naturally on camera.',
      ],
      marketTitle: 'Markets and formats',
      marketItems: [
        'Spanish-speaking audiences in the US, Spain, and Latin America.',
        'Short English talking-to-camera videos, recorded from your script.',
        'Vertical video for TikTok, Reels, Meta ads, landing pages, and product pages.',
      ],
      geoFact:
        `Gisela Saldarriaga is a bilingual UGC creator. She produces TikTok and Meta ads, demos, reviews, and spokesperson videos from Medellín, in Spanish and English, for US Hispanic, Spain, and LatAm brands. She works on Fiverr as [gisela_sm](${FIVERR_PROFILE_URL}): ${SITE_PROOF.fiverrRating}/5 from ${SITE_PROOF.fiverrReviewCount} verified reviews. 28+ brand campaigns. Content is delivered to the brand; she does not post client work unless it is an ambassador deal.`,
      processTitle: 'How it works',
      processSteps: [
        {
          title: '1. Brief',
          description: 'You tell me who you sell to, what you want to say, and whether you need one language or both.',
        },
        {
          title: '2. Script',
          description: 'For Spanish, I can write the script or polish yours. For English, I work from your script, up to 65 words per video.',
        },
        {
          title: '3. Filming and editing',
          description: 'I film and edit each version, making sure the message is easy to follow and the pacing doesn’t drag.',
        },
        {
          title: '4. Delivery',
          description: 'You get the videos 3 to 5 business days after I receive the product and we confirm the brief. One to two rounds of revisions are included.',
        },
      ],
      featuredTitle: 'Examples of my work',
      featuredIntro: 'Videos for very different industries, so you can see how I adjust the tone to each brand.',
      featuredExamples: [
        {
          clipId: 1006,
          title: 'Reel across several industries',
          description: 'A compilation covering music, real estate, agriculture, and legal services in one video.',
        },
        {
          clipId: 6,
          title: 'Introducing myself as a creator',
          description: 'I introduce myself, show what I do, and close with a call to action.',
        },
        {
          clipId: 1,
          title: 'Temu clothing review',
          description: 'I try on a few outfits and give my honest take in a relaxed tone. Works well for brands that sell on social.',
        },
      ],
      faqTitle: 'Common questions about bilingual UGC',
      faqs: [
        {
          question: 'Do you work in both Spanish and English?',
          answer:
            'Yes. Spanish is my native language, so I don’t need a script and there’s no length limit. In English, I record short videos from your script.',
        },
        {
          question: 'Can you record the same video in both languages?',
          answer:
            'Yes. I record a Spanish version and an English version in the same style, so your message stays the same in every market.',
        },
        {
          question: 'What kinds of brands do you work with?',
          answer:
            'Brands from almost any industry that need someone natural on camera. I’ve filmed for ecommerce and apps, and also for real estate and legal services.',
        },
        {
          question: 'Is this only for ads?',
          answer:
            'No. You can also use the videos on landing pages, product pages, social media, or sales material. Organic use is included. Running them as paid ads needs a separate license, which I quote separately.',
        },
        {
          question: 'How do you work in English?',
          answer:
            'For English I work from your script, with a 65-word cap per video so it stays natural.',
        },
      ],
      ctaTitle: 'Need your campaign in both languages?',
      ctaText:
        'Message me with what you sell, where, and what kind of videos you need. I’ll get back to you with a plan.',
      relatedTitle: 'Other services',
      relatedServiceIds: ['spokesperson-videos', 'ugc-ads-tiktok-meta'],
    },
  },
  'spokesperson-videos': {
    es: {
      navLabel: 'Videos de portavoz',
      metaTitle: 'Videos de portavoz para marcas | Gisela Saldarriaga',
      metaDescription:
        'Videos de portavoz hablando a cámara para explicar tu oferta, un lanzamiento, una promoción o una demo. Grabo en español e inglés desde Medellín.',
      breadcrumbLabel: 'Videos de portavoz',
      heroEyebrow: 'Hablando a cámara',
      heroTitle: 'Videos de portavoz para marcas que necesitan explicar bien lo que venden',
      heroSummary:
        'Me pongo frente a cámara y explico tu producto o servicio con palabras simples. Sirve cuando tu oferta necesita contexto y con un texto en pantalla no alcanza.',
      heroPoints: [
        'Hablo directo a cámara',
        'Con tu guion o con puntos clave',
        'Para anuncios, landing pages y lanzamientos',
      ],
      primaryCtaLabel: 'Cuéntame tu proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Para qué sirve un video de portavoz',
      sectionIntroText:
        'Hay ofertas que no se entienden con una imagen y un texto. Ahí ayuda mucho una persona explicándola a cámara: presento el problema, cuento qué resuelve tu producto y cierro con lo que tiene que hacer quien está mirando.',
      deliverablesTitle: 'Qué puedes pedirme',
      deliverables: [
        {
          title: 'Presentación de tu oferta',
          description: 'Explico tu producto, servicio, promoción o lanzamiento en un video corto y ordenado.',
        },
        {
          title: 'Videos para tu web',
          description: 'Un video para tu página principal, una landing page o una página de producto que responda las dudas más comunes antes de la compra.',
        },
        {
          title: 'Anuncios de portavoz',
          description: 'Anuncios donde hablo directo a cámara, con más estructura que un UGC casual.',
        },
        {
          title: 'Demos guiadas',
          description: 'Te muestro paso a paso cómo se usa tu software, servicio o producto.',
        },
      ],
      bestFitTitle: 'Te conviene si',
      bestFitItems: [
        'Tienes un lanzamiento, una promoción o un servicio que hay que explicar de frente.',
        'Tu oferta es nueva o técnica y no se vende bien solo con B-roll o texto en pantalla.',
        'Quieres algo más ordenado que un UGC casual, pero sin que suene a presentación corporativa.',
      ],
      notFitTitle: 'No te conviene si',
      notFitItems: [
        'El video depende solo de la estética y casi no hay nada que explicar.',
        'Buscas actuación compleja o un personaje muy interpretado.',
        'Todavía no tienes claro qué mensaje quieres transmitir.',
      ],
      marketTitle: 'Mercados y formatos',
      marketItems: [
        'Marcas en Estados Unidos, España y Latinoamérica, en español o en inglés.',
        'Lanzamientos, promociones, explicaciones de servicio y demos.',
        'Videos que puedes usar en anuncios, en tu web y en mensajes a clientes potenciales.',
      ],
      processTitle: 'Cómo trabajamos',
      processSteps: [
        {
          title: '1. Mensaje principal',
          description: 'Definimos qué tiene que entender la gente en los primeros segundos y qué duda principal tiene que quedar resuelta.',
        },
        {
          title: '2. Guion',
          description: 'Ajustamos el texto para que suene a mí hablando y no a alguien leyendo. En inglés trabajo con tu guion, de máximo 65 palabras.',
        },
        {
          title: '3. Grabación',
          description: 'Grabo cuidando la dicción y el ritmo, para que el mensaje se entienda a la primera.',
        },
        {
          title: '4. Entrega',
          description: 'Te mando los videos listos para anuncios, tu página principal, páginas de producto o mensajes a clientes.',
        },
      ],
      featuredTitle: 'Ejemplos de mi trabajo',
      featuredIntro: 'Videos donde explico una oferta a cámara, de principio a fin.',
      featuredExamples: [
        {
          clipId: 2,
          title: 'Portavoz para Agenda Bot',
          description: 'Hablo directo a cámara: presento la empresa, el problema que resuelve y la solución, y cierro con un llamado a la acción.',
        },
        {
          clipId: 1010,
          title: 'Reporte de noticias internacionales',
          description: 'Presento elecciones, economía y cifras en formato de noticiero.',
        },
        {
          clipId: 1005,
          title: 'Portavoz para un programa financiero',
          description: 'Con pantalla verde, explico los beneficios de un programa de fondos con tono informativo y sentido de urgencia.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre videos de portavoz',
      faqs: [
        {
          question: '¿Qué diferencia hay entre un video de portavoz y un UGC casual?',
          answer:
            'El de portavoz tiene una estructura más clara y una forma de hablar más intencional. Sigue siendo cercano, pero el objetivo es explicar bien una oferta, un lanzamiento o un servicio.',
        },
        {
          question: '¿Sirve para mi página web además de para anuncios?',
          answer:
            'Sí. Funciona muy bien en la página principal, en landing pages y en páginas de producto, cuando necesitas que alguien explique tu oferta en pocos segundos.',
        },
        {
          question: '¿Tengo que mandarte un guion?',
          answer:
            'En español no hace falta: puedes mandarme un guion cerrado o solo los puntos clave y yo lo armo. En inglés sí necesito tu guion, de máximo 65 palabras.',
        },
        {
          question: '¿Se puede combinar con demos o B-roll?',
          answer:
            'Sí. Muchos videos mezclan partes hablando a cámara con tomas del producto en uso o texto en pantalla.',
        },
      ],
      ctaTitle: '¿Tu oferta necesita que alguien la explique?',
      ctaText:
        'Cuéntame qué vendes, para qué vas a usar el video y si va en anuncios, en tu página principal o en una landing page. Con eso te digo cómo lo armaría.',
      relatedTitle: 'Otros servicios',
      relatedServiceIds: ['bilingual-ugc-creator', 'ugc-ads-tiktok-meta'],
    },
    en: {
      navLabel: 'Spokesperson videos',
      metaTitle: 'Spokesperson videos for brands | Gisela Saldarriaga',
      metaDescription:
        'Spokesperson videos where I explain your offer, launch, promo, or demo on camera. Recorded in Spanish or English from Medellín.',
      breadcrumbLabel: 'Spokesperson videos',
      heroEyebrow: 'Talking to camera',
      heroTitle: 'Spokesperson videos for brands that need to explain what they sell',
      heroSummary:
        'I get on camera and explain your product or service in plain words. It helps when your offer needs some context and on-screen text alone won’t do it.',
      heroPoints: [
        'Straight to camera',
        'From your script or key points',
        'For ads, landing pages, and launches',
      ],
      primaryCtaLabel: 'Tell me about your project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'What a spokesperson video is for',
      sectionIntroText:
        'Some offers don’t make sense from an image and a caption. That’s where a person explaining it on camera helps: I lay out the problem, explain what your product solves, and finish with what the viewer should do next.',
      deliverablesTitle: 'What you can ask me for',
      deliverables: [
        {
          title: 'Offer walkthroughs',
          description: 'I explain your product, service, promo, or launch in a short, well-organized video.',
        },
        {
          title: 'Videos for your website',
          description: 'A video for your homepage, a landing page, or a product page that answers the usual questions before someone buys.',
        },
        {
          title: 'Spokesperson ads',
          description: 'Ads where I talk straight to camera, with more structure than casual UGC.',
        },
        {
          title: 'Guided demos',
          description: 'I show step by step how to use your software, service, or product.',
        },
      ],
      bestFitTitle: 'This is for you if',
      bestFitItems: [
        'You have a launch, promo, or service that needs a clear, upfront explanation.',
        'Your offer is new or technical and won’t sell on b-roll or on-screen text alone.',
        'You want something more structured than casual UGC that still doesn’t feel corporate.',
      ],
      notFitTitle: 'This isn’t for you if',
      notFitItems: [
        'The video is all about the visuals and there’s barely anything to explain.',
        'You need complex acting or a heavily performed character.',
        'You haven’t settled on the message you want to get across yet.',
      ],
      marketTitle: 'Markets and formats',
      marketItems: [
        'Brands in the US, Spain, and Latin America, in Spanish or English.',
        'Launches, promos, service explainers, and demos.',
        'Videos you can reuse in ads, on your website, and in outreach to potential customers.',
      ],
      processTitle: 'How it works',
      processSteps: [
        {
          title: '1. Main message',
          description: 'We decide what people need to understand in the first few seconds and which main question the video should answer.',
        },
        {
          title: '2. Script',
          description: 'We adjust the wording so it sounds like me talking, not someone reading. For English videos, I work from your script, up to 65 words.',
        },
        {
          title: '3. Filming',
          description: 'I film with attention to diction and pacing so the message lands the first time.',
        },
        {
          title: '4. Delivery',
          description: 'You get videos ready for ads, your homepage, product pages, or messages to potential customers.',
        },
      ],
      featuredTitle: 'Examples of my work',
      featuredIntro: 'Videos where I explain an offer on camera from start to finish.',
      featuredExamples: [
        {
          clipId: 2,
          title: 'Spokesperson for Agenda Bot',
          description: 'Straight to camera: I introduce the company, the problem it solves, and the solution, then close with a call to action.',
        },
        {
          clipId: 1010,
          title: 'International news report',
          description: 'Elections, the economy, and key figures, presented in a newscast format.',
        },
        {
          clipId: 1005,
          title: 'Spokesperson for a financial program',
          description: 'Shot on green screen, I explain the benefits of a fund program in an informative tone with a sense of urgency.',
        },
      ],
      faqTitle: 'Common questions about spokesperson videos',
      faqs: [
        {
          question: 'How is a spokesperson video different from casual UGC?',
          answer:
            'It has a clearer structure and more deliberate delivery. It still feels personal, but the goal is to explain an offer, launch, or service well.',
        },
        {
          question: 'Can I use it on my website, not just in ads?',
          answer:
            'Yes. It works really well on homepages, landing pages, and product pages when you need someone to explain the offer in a few seconds.',
        },
        {
          question: 'Do I need to send a script?',
          answer:
            'For Spanish, no. Send a finished script or just the key points and I’ll put it together. For English, yes: I work from your script, up to 65 words.',
        },
        {
          question: 'Can it be combined with demos or b-roll?',
          answer:
            'Yes. A lot of videos mix talking-to-camera parts with shots of the product in use or on-screen text.',
        },
      ],
      ctaTitle: 'Does your offer need someone to explain it?',
      ctaText:
        'Tell me what you sell, what the video is for, and whether it’s going in ads, on your homepage, or on a landing page. I’ll tell you how I’d put it together.',
      relatedTitle: 'Other services',
      relatedServiceIds: ['bilingual-ugc-creator', 'ugc-ads-tiktok-meta'],
    },
  },
  'ugc-ads-tiktok-meta': {
    es: {
      navLabel: 'UGC Ads para TikTok y Meta',
      metaTitle: 'UGC Ads para TikTok y Meta | Gisela Saldarriaga',
      metaDescription:
        'Grabo UGC Ads para TikTok y Meta: hooks, demos, reseñas y videos hablando a cámara, con variaciones para que pruebes cuál funciona mejor.',
      breadcrumbLabel: 'UGC Ads para TikTok y Meta',
      heroEyebrow: 'Anuncios pagados',
      heroTitle: 'UGC Ads para TikTok y Meta, con hooks y versiones para probar',
      heroSummary:
        'Grabo anuncios UGC para tus campañas en TikTok y Meta. Muestran tu producto en los primeros segundos, suenan naturales y vienen en varias versiones para que pruebes distintos hooks, ofertas y mensajes.',
      heroPoints: [
        'Hooks fuertes en los primeros segundos',
        'Varias versiones para probar',
        'Formato nativo de TikTok y Meta',
      ],
      primaryCtaLabel: 'Pedir anuncios',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Para qué sirven los UGC Ads',
      sectionIntroText:
        'Si ya inviertes en pauta, un video bonito no alcanza. Lo que sirve es tener varias opciones de hook, demo, beneficio y CTA para probarlas rápido y quedarte con las que mejor funcionan.',
      deliverablesTitle: 'Qué puedes pedirme',
      deliverables: [
        {
          title: 'Hook + beneficio + CTA',
          description: 'El formato más directo para Meta y TikTok, cuando tu oferta tiene que entenderse en segundos.',
        },
        {
          title: 'Problema-solución',
          description: 'Empiezo por un problema real de tu cliente y presento tu producto como la salida.',
        },
        {
          title: 'Anuncios con demo',
          description: 'El producto en uso cuenta la historia y responde las dudas mientras vende.',
        },
        {
          title: 'Anuncios de reseña',
          description: 'Hablo del producto como lo haría una clienta, y eso hace que la gente confíe más.',
        },
      ],
      bestFitTitle: 'Te conviene si',
      bestFitItems: [
        'Ya haces pauta y necesitas más anuncios para probar, no un solo video principal.',
        'Tienes una tienda online y necesitas variaciones de hook, beneficio y formato.',
        'Tu producto se vende mejor cuando se ve en uso o cuando se explica en pocos segundos.',
      ],
      notFitTitle: 'No te conviene si',
      notFitItems: [
        'Buscas un video institucional o una campaña de marca sin un objetivo de ventas.',
        'Todavía no tienes claro el producto, la oferta o a quién le vas a hablar.',
        'Esperas que un solo video funcione sin probar otras versiones.',
      ],
      marketTitle: 'Mercados y formatos',
      marketItems: [
        'Marcas en Estados Unidos, España y Latinoamérica, en español o en inglés.',
        'Video vertical para TikTok Ads, Meta Ads, Reels e historias.',
        'Los mismos videos te sirven después en páginas de producto y landing pages.',
      ],
      processTitle: 'Cómo trabajamos',
      processSteps: [
        {
          title: '1. Ángulo',
          description: 'Definimos el ángulo, la promesa, la duda principal de tu cliente y qué tanto conoce ya tu marca.',
        },
        {
          title: '2. Guion por partes',
          description: 'Separo el hook, el desarrollo, la prueba y el CTA, para que después sea fácil armar variaciones.',
        },
        {
          title: '3. Grabación',
          description: 'Grabo pensando en que la gente se quede mirando y en que el producto se vea bien, no solo en que el video quede bonito.',
        },
        {
          title: '4. Entrega',
          description: 'Te mando videos listos para subir y probar, con hooks alternativos para que tu equipo vea rápido qué funciona.',
        },
      ],
      featuredTitle: 'Ejemplos de mi trabajo',
      featuredIntro: 'Anuncios que venden de distintas formas: hook directo, pantalla verde y problema-solución.',
      featuredExamples: [
        {
          clipId: 1001,
          title: 'Anuncio para una agencia de marketing digital',
          description: 'Estructura clásica de anuncio: hook directo, qué ofrece la agencia y CTA. Hecho para pauta en redes.',
        },
        {
          clipId: 1003,
          title: 'Anuncio de rotulación de vehículos',
          description: 'Video corto con pantalla verde, mensaje claro y cierre en español. Listo para Meta Ads.',
        },
        {
          clipId: 1009,
          title: 'Anuncio para un bot de ventas por WhatsApp',
          description: 'Hook que nombra el problema, beneficios rápidos y CTA. Sirve para campañas de conversión en TikTok o Meta.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre UGC Ads',
      faqs: [
        {
          question: '¿Haces anuncios específicamente para TikTok Ads y Meta Ads?',
          answer:
            'Sí. Armo la estructura y el ritmo para pauta: hooks más rápidos, el beneficio desde el principio y versiones para que tu equipo pruebe ofertas.',
        },
        {
          question: '¿Puedes grabar varias versiones del mismo anuncio?',
          answer:
            'Sí, y te lo recomiendo. Probar varios hooks, beneficios o CTA te dice mucho más que un solo video.',
        },
        {
          question: '¿Puedo usar estos videos en landing pages?',
          answer:
            'Sí. Muchos anuncios funcionan bien en tu página principal, en páginas de producto y en landing pages. El uso orgánico viene incluido; para usarlos en pauta necesitas una licencia aparte, que te cotizo.',
        },
        {
          question: '¿Qué necesitas de mi parte?',
          answer:
            'Una oferta clara, una idea de a quién le vendes, qué le molesta o qué quiere tu cliente, y lo que ya sepas sobre qué mensajes te han funcionado.',
        },
      ],
      ctaTitle: '¿Necesitas más anuncios para probar en TikTok o Meta?',
      ctaText:
        'Escríbeme con tu producto, la categoría, la oferta y qué tipo de anuncio quieres probar. Te recomiendo formatos y cuántos videos te conviene hacer.',
      relatedTitle: 'Otros servicios',
      relatedServiceIds: ['bilingual-ugc-creator', 'spokesperson-videos'],
    },
    en: {
      navLabel: 'UGC ads for TikTok and Meta',
      metaTitle: 'UGC ads for TikTok and Meta | Gisela Saldarriaga',
      metaDescription:
        'I make UGC ads for TikTok and Meta: hooks, demos, reviews, and talking-to-camera videos, with variations so you can test what works.',
      breadcrumbLabel: 'UGC ads for TikTok and Meta',
      heroEyebrow: 'Paid ads',
      heroTitle: 'UGC ads for TikTok and Meta, with hooks and versions to test',
      heroSummary:
        'I make UGC ads for your TikTok and Meta campaigns. They show your product in the first few seconds, sound natural, and come in several versions so you can test different hooks, offers, and messages.',
      heroPoints: [
        'Strong hooks in the first few seconds',
        'Several versions to test',
        'Native TikTok and Meta format',
      ],
      primaryCtaLabel: 'Request ads',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'What UGC ads are for',
      sectionIntroText:
        'If you’re already spending on ads, one nice-looking video won’t cut it. What helps is having a few hooks, demos, benefits, and CTAs you can test fast, then keeping the ones that work.',
      deliverablesTitle: 'What you can ask me for',
      deliverables: [
        {
          title: 'Hook + benefit + CTA',
          description: 'The most direct format for Meta and TikTok, for when your offer has to click in a few seconds.',
        },
        {
          title: 'Problem-solution',
          description: 'I open with a real problem your customer has and bring in your product as the fix.',
        },
        {
          title: 'Demo ads',
          description: 'The product in use tells the story and answers questions while it sells.',
        },
        {
          title: 'Review ads',
          description: 'I talk about the product the way a customer would, which makes people trust it more.',
        },
      ],
      bestFitTitle: 'This is for you if',
      bestFitItems: [
        'You already run paid ads and need more videos to test, not just one hero video.',
        'You run an online store and need variations on hooks, benefits, and formats.',
        'Your product sells better when people see it in use or get it in a few seconds.',
      ],
      notFitTitle: 'This isn’t for you if',
      notFitItems: [
        'You want a corporate video or a brand campaign with no sales goal.',
        'You haven’t pinned down the product, the offer, or who you’re talking to.',
        'You expect one video to work without testing other versions.',
      ],
      marketTitle: 'Markets and formats',
      marketItems: [
        'Brands in the US, Spain, and Latin America, in Spanish or English.',
        'Vertical video for TikTok ads, Meta ads, Reels, and Stories.',
        'The same videos can go on your product pages and landing pages later.',
      ],
      processTitle: 'How it works',
      processSteps: [
        {
          title: '1. Angle',
          description: 'We pick the angle, the promise, your customer’s main objection, and how well they already know your brand.',
        },
        {
          title: '2. Script in parts',
          description: 'I split the hook, the middle, the proof, and the CTA so it’s easy to build variations later.',
        },
        {
          title: '3. Filming',
          description: 'I film so people keep watching and the product is clearly visible, not just so the video looks pretty.',
        },
        {
          title: '4. Delivery',
          description: 'You get videos ready to upload and test, with alternate hooks so your team can see quickly what works.',
        },
      ],
      featuredTitle: 'Examples of my work',
      featuredIntro: 'Ads that sell in different ways: a direct hook, green screen, and problem-solution.',
      featuredExamples: [
        {
          clipId: 1001,
          title: 'Ad for a digital marketing agency',
          description: 'Classic ad structure: a direct hook, what the agency offers, and a CTA. Made for paid social.',
        },
        {
          clipId: 1003,
          title: 'Vehicle wrap ad',
          description: 'A short green screen video with a clear message and a close in Spanish. Ready for Meta ads.',
        },
        {
          clipId: 1009,
          title: 'Ad for a WhatsApp sales bot',
          description: 'A hook that names the problem, quick benefits, and a CTA. Works for conversion campaigns on TikTok or Meta.',
        },
      ],
      faqTitle: 'Common questions about UGC ads',
      faqs: [
        {
          question: 'Do you make ads specifically for TikTok and Meta?',
          answer:
            'Yes. I build the structure and pacing for paid ads: faster hooks, the benefit up front, and versions your team can test.',
        },
        {
          question: 'Can you record several versions of the same ad?',
          answer:
            'Yes, and I’d recommend it. Testing a few hooks, benefits, or CTAs tells you a lot more than a single video.',
        },
        {
          question: 'Can I use these videos on landing pages?',
          answer:
            'Yes. Many ads work well on homepages, product pages, and landing pages. Organic use is included. Running them as paid ads needs a separate license, which I quote separately.',
        },
        {
          question: 'What do you need from me?',
          answer:
            'A clear offer, an idea of who you sell to, what your customer wants or struggles with, and anything you already know about which messages work.',
        },
      ],
      ctaTitle: 'Need more ads to test on TikTok or Meta?',
      ctaText:
        'Send me the product, the category, the offer, and what kind of ad you want to test. I’ll recommend formats and how many videos make sense.',
      relatedTitle: 'Other services',
      relatedServiceIds: ['bilingual-ugc-creator', 'spokesperson-videos'],
    },
  },
  'ugc-testimonials-reviews': {
    es: {
      navLabel: 'Testimoniales y reseñas UGC',
      metaTitle: 'Reseñas UGC y video testimonial | Gisela',
      metaDescription:
        'Reseñas UGC y testimoniales en video para tus anuncios, landing pages y páginas de producto. Uso tu producto y cuento cómo me fue.',
      breadcrumbLabel: 'Testimoniales y reseñas',
      heroEyebrow: 'Reseñas en video',
      heroTitle: 'Testimoniales y reseñas UGC para que tus clientes confíen antes de comprar',
      heroSummary:
        'Uso tu producto, grabo una reseña contando cómo me fue y hago que suene a conversación, no a comercial. Sirve para responder dudas y mostrar resultados antes de que alguien compre.',
      heroPoints: [
        'Natural, no actuado',
        'Responde dudas antes de la compra',
        'Para anuncios, landing pages y páginas de producto',
      ],
      primaryCtaLabel: 'Pedir reseñas',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Para qué sirve una reseña en video',
      sectionIntroText:
        'Una reseña escrita ayuda, pero ver a alguien usando el producto y contando su experiencia da más confianza. Por eso muchas marcas ponen reseñas en video en sus anuncios y páginas de producto: ayudan a que la gente se decida.',
      deliverablesTitle: 'Qué puedes pedirme',
      deliverables: [
        {
          title: 'Reseña de producto',
          description: 'Uso el producto en mi día a día y cuento cómo me fue, como se lo contaría a una amiga.',
        },
        {
          title: 'Testimonial de un beneficio',
          description: 'Me enfoco en un resultado concreto: qué cambió, qué problema resolvió y por qué vale la pena.',
        },
        {
          title: 'Unboxing y primera impresión',
          description: 'Abro el producto frente a cámara y muestro mi reacción. Sirve como hook para anuncios o para redes.',
        },
        {
          title: 'Reseña comparativa',
          description: 'Si tu producto sale ganando frente a otra opción, la comparación ayuda a que la gente se decida.',
        },
      ],
      bestFitTitle: 'Te conviene si',
      bestFitItems: [
        'Tienes una marca de ecommerce, belleza, suplementos o lifestyle y necesitas reseñas en video para tus páginas de producto.',
        'Manejas pauta y sabes que la confianza vende más que un video bonito.',
        'Tu producto tiene un beneficio claro que se entiende mejor cuando lo cuenta una persona.',
      ],
      notFitTitle: 'No te conviene si',
      notFitItems: [
        'Necesitas un guion cerrado con promesas que no salen de una experiencia real.',
        'Tu producto no tiene un beneficio claro que se pueda contar en primera persona.',
        'Buscas testimonios de varios clientes reales grabados en distintos lugares.',
      ],
      marketTitle: 'Mercados y formatos',
      marketItems: [
        'Marcas en Estados Unidos, España y Latinoamérica que venden online.',
        'Testimoniales en video para Meta Ads, TikTok Ads y campañas para gente que ya visitó tu tienda.',
        'Videos para páginas de producto, landing pages y email marketing.',
      ],
      processTitle: 'Cómo trabajamos',
      processSteps: [
        {
          title: '1. Producto y enfoque',
          description: 'Me cuentas qué quieres destacar, qué duda quieres responder y qué tono buscas: casual, entusiasta o informativo.',
        },
        {
          title: '2. Puntos clave',
          description: 'En español armo una guía corta con lo que no puede faltar, para que suene natural y cubra lo importante. En inglés trabajo con tu guion.',
        },
        {
          title: '3. Grabación con el producto',
          description: 'Grabo con el producto en la mano y usándolo de verdad frente a cámara.',
        },
        {
          title: '4. Entrega',
          description: 'Te mando los videos en 3 a 5 días hábiles después de recibir el producto y confirmar el brief, listos para pauta, redes o tu web.',
        },
      ],
      featuredTitle: 'Ejemplos de mi trabajo',
      featuredIntro: 'Reseñas de productos y servicios que usé, grabadas con un tono cercano.',
      featuredExamples: [
        {
          clipId: 4,
          title: 'Reseña del suplemento Curvella',
          description: 'Cuento mi experiencia con la creatina y los beneficios que noté, sin que suene a infomercial.',
        },
        {
          clipId: 1013,
          title: 'Testimonial de un método fitness',
          description: 'Reseña corta y directa del método Power Palp Abdomen. Buena opción cuando necesitas una reseña rápida para redes.',
        },
        {
          clipId: 1004,
          title: 'Reseña de un restaurante colombiano',
          description: 'Reseña de Parceros Street Food en Calgary: los platos, la experiencia y mi recomendación, con un tono espontáneo.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre reseñas UGC',
      faqs: [
        {
          question: '¿Qué diferencia hay entre una reseña UGC y un anuncio?',
          answer:
            'La reseña se siente como la opinión de alguien que probó el producto. El anuncio suele ser más directo y vendedor. Por eso muchas reseñas funcionan bien como anuncios: la gente les cree más.',
        },
        {
          question: '¿Tengo que enviarte el producto?',
          answer:
            'Si es un producto físico, sí, necesito tenerlo en la mano. Si es un servicio digital, una app o un SaaS, me basta con acceso o un brief detallado.',
        },
        {
          question: '¿Puedo usar los testimoniales en anuncios y en mi web?',
          answer:
            'Sí. El uso orgánico (tu web, tus redes, tus emails) viene incluido. Para usarlos en anuncios pagados necesitas una licencia aparte, que te cotizo según el proyecto.',
        },
        {
          question: '¿Cuánto debe durar un video testimonial?',
          answer:
            'Para anuncios suelo recomendar entre 30 y 60 segundos. En páginas de producto o landing pages puede durar un poco más si hay mucho que mostrar.',
        },
      ],
      ctaTitle: '¿Tu producto necesita reseñas en video?',
      ctaText:
        'Cuéntame qué producto quieres que reseñe, dónde vas a usar el video y qué beneficio tiene que quedar claro. Te propongo el formato y cuántos videos hacer.',
      relatedTitle: 'Otros servicios',
      relatedServiceIds: ['ugc-ads-tiktok-meta', 'ugc-lifestyle'],
    },
    en: {
      navLabel: 'UGC testimonials and reviews',
      metaTitle: 'UGC testimonials & review videos | Gisela',
      metaDescription:
        'UGC testimonials and product review videos for your ads, landing pages, and product pages. I use your product and talk about how it went.',
      breadcrumbLabel: 'Testimonials and reviews',
      heroEyebrow: 'Video reviews',
      heroTitle: 'UGC testimonials and review videos that help people trust you before they buy',
      heroSummary:
        'I use your product, film a review about how it went, and keep it sounding like a conversation instead of a commercial. It answers your customers’ questions and shows results before they buy.',
      heroPoints: [
        'Natural, not acted',
        'Answers questions before people buy',
        'For ads, landing pages, and product pages',
      ],
      primaryCtaLabel: 'Request reviews',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'What a video review is for',
      sectionIntroText:
        'A written review helps, but watching someone use the product and talk about it builds more trust. That’s why so many brands put video reviews in their ads and on product pages: they help people make up their minds.',
      deliverablesTitle: 'What you can ask me for',
      deliverables: [
        {
          title: 'Product review',
          description: 'I use the product in my everyday routine and talk about how it went, the way I’d tell a friend.',
        },
        {
          title: 'Single-benefit testimonial',
          description: 'I focus on one specific result: what changed, what it fixed, and why it’s worth it.',
        },
        {
          title: 'Unboxing and first impressions',
          description: 'I open the product on camera and show my reaction. Works as a hook for ads or social posts.',
        },
        {
          title: 'Comparison review',
          description: 'If your product beats an alternative, a side-by-side helps people decide.',
        },
      ],
      bestFitTitle: 'This is for you if',
      bestFitItems: [
        'You run an ecommerce, beauty, supplement, or lifestyle brand and need video reviews for your product pages.',
        'You run paid ads and know trust sells better than a pretty video.',
        'Your product has a clear benefit that comes across better when a person talks about it.',
      ],
      notFitTitle: 'This isn’t for you if',
      notFitItems: [
        'You need a tight script with claims that don’t come from real use.',
        'Your product doesn’t have a clear benefit someone could describe in first person.',
        'You need testimonials from several real customers filmed in different places.',
      ],
      marketTitle: 'Markets and formats',
      marketItems: [
        'Brands in the US, Spain, and Latin America that sell online.',
        'Video testimonials for Meta ads, TikTok ads, and retargeting campaigns.',
        'Videos for product pages, landing pages, and email marketing.',
      ],
      processTitle: 'How it works',
      processSteps: [
        {
          title: '1. Product and focus',
          description: 'You tell me what to highlight, which doubt to address, and the tone you want: casual, excited, or informative.',
        },
        {
          title: '2. Key points',
          description: 'For Spanish reviews, I put together a short outline so it sounds natural and covers what matters. For English, I work from your script.',
        },
        {
          title: '3. Filming with the product',
          description: 'I film with the product in hand and actually use it on camera.',
        },
        {
          title: '4. Delivery',
          description: 'You get the videos 3 to 5 business days after I receive the product and we confirm the brief, ready for ads, social, or your website.',
        },
      ],
      featuredTitle: 'Examples of my work',
      featuredIntro: 'Reviews of products and services I’ve used, filmed in a relaxed, personal tone.',
      featuredExamples: [
        {
          clipId: 4,
          title: 'Curvella supplement review',
          description: 'I talk about my experience with creatine and the benefits I noticed, without sounding like an infomercial.',
        },
        {
          clipId: 1013,
          title: 'Fitness method testimonial',
          description: 'A short, direct review of the Power Palp Abdomen method. Good when you need a quick review for social.',
        },
        {
          clipId: 1004,
          title: 'Colombian restaurant review',
          description: 'A review of Parceros Street Food in Calgary: the food, the experience, and my recommendation, in a casual tone.',
        },
      ],
      faqTitle: 'Common questions about UGC testimonials',
      faqs: [
        {
          question: 'What’s the difference between a UGC review and an ad?',
          answer:
            'A review feels like the opinion of someone who tried the product. An ad is usually more direct and salesy. That’s why many reviews work well as ads: people believe them more.',
        },
        {
          question: 'Do I need to send you the product?',
          answer:
            'For physical products, yes, I need it in hand. For digital services, apps, or SaaS, access or a detailed brief is enough.',
        },
        {
          question: 'Can I use the testimonials in ads and on my website?',
          answer:
            'Yes. Organic use (your website, social, and email) is included. Running them as paid ads needs a separate license, which I quote based on the project.',
        },
        {
          question: 'How long should a testimonial video be?',
          answer:
            'For ads, I usually recommend 30 to 60 seconds. On product pages or landing pages it can run a bit longer if there’s a lot to show.',
        },
      ],
      ctaTitle: 'Does your product need video reviews?',
      ctaText:
        'Tell me which product you want reviewed, where the video will be used, and which benefit needs to come across. I’ll suggest a format and how many videos to make.',
      relatedTitle: 'Other services',
      relatedServiceIds: ['ugc-ads-tiktok-meta', 'ugc-lifestyle'],
    },
  },
  'ugc-product-demo': {
    es: {
      navLabel: 'Demos de producto UGC',
      metaTitle: 'Demo de producto UGC y tutoriales | Gisela',
      metaDescription:
        'Demos de producto UGC y tutoriales en video. Te muestro paso a paso cómo se usa tu producto, app o servicio, con palabras simples.',
      breadcrumbLabel: 'Demos de producto',
      heroEyebrow: 'Demos y tutoriales',
      heroTitle: 'Demos de producto UGC que explican cómo funciona sin aburrir',
      heroSummary:
        'Grabo demos, tutoriales y videos de cómo se usa tu producto, con un tono claro y cercano. Vengo del periodismo, así que estoy acostumbrada a explicar cosas complicadas sin que la gente se pierda.',
      heroPoints: [
        'Explicaciones claras, no manuales',
        'Para tecnología, SaaS, apps y servicios',
        'Para anuncios, landing pages y nuevos usuarios',
      ],
      primaryCtaLabel: 'Pedir demos',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Para qué sirve una demo de producto',
      sectionIntroText:
        'Si tu producto necesita algo de contexto para entenderse, verlo en uso ayuda más que un carrusel o un texto largo. No hago manuales: muestro el producto funcionando y lo explico como se lo explicaría a alguien que lo ve por primera vez.',
      deliverablesTitle: 'Qué puedes pedirme',
      deliverables: [
        {
          title: 'Demo paso a paso',
          description: 'Muestro cómo se usa el producto de verdad, en orden y sin rodeos.',
        },
        {
          title: 'Tutorial corto',
          description: 'Un video breve sobre una función, un beneficio o un caso de uso concreto.',
        },
        {
          title: 'Reseña técnica con demo',
          description: 'Además de mostrar el producto, explico los detalles técnicos que le dan credibilidad.',
        },
        {
          title: 'Demo comparativa',
          description: 'Muestro en uso por qué tu producto resuelve el problema mejor que otra opción.',
        },
      ],
      bestFitTitle: 'Te conviene si',
      bestFitItems: [
        'Tienes una marca de tecnología, SaaS, apps o servicios digitales y tu cliente necesita entender el producto antes de comprar.',
        'Tu producto tiene curva de aprendizaje y un tutorial en video resuelve muchas dudas.',
        'Quieres contenido educativo con formato UGC para anuncios, landing pages o para enseñarles a nuevos usuarios.',
      ],
      notFitTitle: 'No te conviene si',
      notFitItems: [
        'Tu producto se entiende a primera vista y no necesita explicación.',
        'Buscas una grabación de pantalla sin nadie frente a cámara.',
        'Necesitas un tutorial muy largo o un curso completo, no un video de marketing.',
      ],
      marketTitle: 'Mercados y formatos',
      marketItems: [
        'Marcas en Estados Unidos, España y Latinoamérica, en español o en inglés.',
        'Campañas para gente que ya conoce tu producto pero todavía no entiende cómo funciona.',
        'Anuncios educativos para TikTok y Meta, páginas de producto y landing pages.',
      ],
      processTitle: 'Cómo trabajamos',
      processSteps: [
        {
          title: '1. Producto y mensaje',
          description: 'Entiendo qué hace tu producto, qué beneficio quieres destacar y quién lo va a ver.',
        },
        {
          title: '2. Estructura',
          description: 'Armo el orden del video: contexto rápido, demostración, beneficio y cierre. En inglés trabajo con tu guion.',
        },
        {
          title: '3. Grabación con el producto',
          description: 'Grabo usando el producto real y explicando con naturalidad, sin perder el ritmo.',
        },
        {
          title: '4. Entrega',
          description: 'Te mando los videos listos para anuncios, landing pages, páginas de producto o redes.',
        },
      ],
      featuredTitle: 'Ejemplos de mi trabajo',
      featuredIntro: 'Demos de software donde se ve el producto funcionando.',
      featuredExamples: [
        {
          clipId: 3,
          title: 'Reseña y demo de un voicebot (Calvotia)',
          description: 'Empieza como un testimonial en un café y pasa a explicar el producto y sus beneficios.',
        },
        {
          clipId: 1008,
          title: 'Demo en vivo de un voicebot para un concesionario',
          description: 'Una conversación real con un bot de Calvotia para un concesionario de autos. Se ve el producto funcionando en tiempo real.',
        },
        {
          clipId: 1011,
          title: 'Demo de un voicebot para una clínica dental',
          description: 'Demostración interactiva: agendar citas, consultar tarifas y pedir la dirección. El producto se explica solo.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre demos UGC',
      faqs: [
        {
          question: '¿Qué productos funcionan mejor con una demo UGC?',
          answer:
            'Los que necesitan algo de contexto para entenderse: software, apps, servicios digitales, gadgets o suplementos con un modo de uso específico. Si tu cliente necesita ver cómo funciona antes de comprar, una demo en video ayuda mucho.',
        },
        {
          question: '¿Puedes explicar productos técnicos sin que suene aburrido?',
          answer:
            'Sí. Tengo más de 9 años de experiencia en periodismo y medios, y ahí aprendí a tomar temas complicados y contarlos de forma simple. Eso es lo que hago en una demo.',
        },
        {
          question: '¿Las demos sirven solo para anuncios o también para mi web?',
          answer:
            'Para las dos cosas. Muchas marcas usan el mismo video como anuncio en TikTok o Meta y como explicación en su landing page o página de producto.',
        },
        {
          question: '¿Qué necesitas para grabar una demo?',
          answer:
            'Acceso al producto o servicio, el beneficio principal que quieres destacar y una idea de quién va a ver el video. Con eso armo la estructura.',
        },
      ],
      ctaTitle: '¿Tu producto necesita una explicación para venderse?',
      ctaText:
        'Cuéntame qué producto quieres mostrar, a quién va dirigido y dónde vas a usar el video. Te propongo la estructura y el formato.',
      relatedTitle: 'Otros servicios',
      relatedServiceIds: ['ugc-testimonials-reviews', 'ugc-problem-solution'],
    },
    en: {
      navLabel: 'UGC product demos',
      metaTitle: 'UGC product demo & tutorial videos | Gisela',
      metaDescription:
        'UGC product demos and how-to videos. I show how your product, app, or service works, step by step and in plain words.',
      breadcrumbLabel: 'Product demos',
      heroEyebrow: 'Demos and tutorials',
      heroTitle: 'UGC product demos that explain how it works without boring anyone',
      heroSummary:
        'I make product demos, tutorials, and how-to videos with clear, friendly delivery. I come from journalism, so I’m used to explaining complicated things without losing people.',
      heroPoints: [
        'Clear explanations, not manuals',
        'For tech, SaaS, apps, and services',
        'For ads, landing pages, and onboarding',
      ],
      primaryCtaLabel: 'Request demos',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'What a product demo is for',
      sectionIntroText:
        'If your product takes a bit of context to get, seeing it in use helps more than a carousel or a long block of text. I don’t make manuals. I show the product working and explain it the way I would to someone seeing it for the first time.',
      deliverablesTitle: 'What you can ask me for',
      deliverables: [
        {
          title: 'Step-by-step demo',
          description: 'I show how the product is actually used, in order and without detours.',
        },
        {
          title: 'Short tutorial',
          description: 'A brief video on one feature, benefit, or use case.',
        },
        {
          title: 'Technical review with demo',
          description: 'Along with showing the product, I explain the technical details that make it credible.',
        },
        {
          title: 'Comparison demo',
          description: 'I show, in use, why your product solves the problem better than the alternative.',
        },
      ],
      bestFitTitle: 'This is for you if',
      bestFitItems: [
        'You run a tech, SaaS, app, or digital service brand and customers need to understand the product before they buy.',
        'Your product has a learning curve and a video tutorial clears up a lot of questions.',
        'You want educational content in UGC style for ads, landing pages, or onboarding.',
      ],
      notFitTitle: 'This isn’t for you if',
      notFitItems: [
        'Your product makes sense at first glance and needs no explanation.',
        'You want a screen recording with nobody on camera.',
        'You need a long tutorial or a full course, not a marketing video.',
      ],
      marketTitle: 'Markets and formats',
      marketItems: [
        'Brands in the US, Spain, and Latin America, in Spanish or English.',
        'Campaigns for people who know your product exists but don’t yet understand how it works.',
        'Educational ads for TikTok and Meta, product pages, and landing pages.',
      ],
      processTitle: 'How it works',
      processSteps: [
        {
          title: '1. Product and message',
          description: 'I get to know what your product does, which benefit to highlight, and who’s going to watch.',
        },
        {
          title: '2. Structure',
          description: 'I plan the order of the video: quick context, the demo itself, the benefit, and the close. For English videos, I work from your script.',
        },
        {
          title: '3. Filming with the product',
          description: 'I film using the real product and explain it naturally, keeping the pace up.',
        },
        {
          title: '4. Delivery',
          description: 'You get videos ready for ads, landing pages, product pages, or social.',
        },
      ],
      featuredTitle: 'Examples of my work',
      featuredIntro: 'Software demos where you can see the product working.',
      featuredExamples: [
        {
          clipId: 3,
          title: 'Voicebot review and demo (Calvotia)',
          description: 'Starts as a testimonial in a café and moves into explaining the product and its benefits.',
        },
        {
          clipId: 1008,
          title: 'Live voicebot demo for a car dealership',
          description: 'A real conversation with a Calvotia bot built for a car dealership. You see the product working in real time.',
        },
        {
          clipId: 1011,
          title: 'Voicebot demo for a dental clinic',
          description: 'An interactive demo: booking appointments, checking prices, and asking for the address. The product explains itself.',
        },
      ],
      faqTitle: 'Common questions about UGC product demos',
      faqs: [
        {
          question: 'What kinds of products work best with a UGC demo?',
          answer:
            'Products that need some context to make sense: software, apps, digital services, gadgets, or supplements with a specific way of using them. If customers need to see how it works before buying, a demo video helps a lot.',
        },
        {
          question: 'Can you explain technical products without it getting dull?',
          answer:
            'Yes. I have more than nine years of experience in journalism and media, where I learned to take complicated topics and make them simple. That’s what a good demo needs.',
        },
        {
          question: 'Are demos only for ads, or for websites too?',
          answer:
            'Both. Many brands use the same video as a TikTok or Meta ad and as an explainer on their landing page or product page.',
        },
        {
          question: 'What do you need to film a demo?',
          answer:
            'Access to the product or service, the main benefit you want to highlight, and an idea of who will watch the video. That’s enough for me to plan the structure.',
        },
      ],
      ctaTitle: 'Does your product need explaining before people buy it?',
      ctaText:
        'Tell me which product you want to show, who it’s for, and where the video will be used. I’ll suggest a structure and format.',
      relatedTitle: 'Other services',
      relatedServiceIds: ['ugc-testimonials-reviews', 'ugc-problem-solution'],
    },
  },
  'ugc-problem-solution': {
    es: {
      navLabel: 'UGC problema-solución',
      metaTitle: 'Video problema solución UGC | Gisela',
      metaDescription:
        'Videos UGC problema-solución para anuncios en TikTok y Meta: un hook, el problema de tu cliente, tu producto como solución y un CTA claro.',
      breadcrumbLabel: 'Problema-solución',
      heroEyebrow: 'Formato de anuncio',
      heroTitle: 'Videos UGC problema-solución que empiezan por lo que le molesta a tu cliente',
      heroSummary:
        'Grabo anuncios con la estructura hook, problema, solución y CTA, una de las más usadas en pauta. Vengo del periodismo, así que sé ordenar un mensaje para que se entienda en pocos segundos.',
      heroPoints: [
        'Todo empieza por el hook',
        'Para campañas de conversión',
        'Varios hooks para probar',
      ],
      primaryCtaLabel: 'Pedir videos',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Para qué sirve el formato problema-solución',
      sectionIntroText:
        'Este formato funciona porque sigue la forma en que la gente decide: siente una molestia, se identifica con el problema y presta atención cuando aparece la solución. No es una fórmula mágica, pero es una de las estructuras que más se usan en anuncios UGC.',
      deliverablesTitle: 'Qué puedes pedirme',
      deliverables: [
        {
          title: 'Hook + problema + solución + CTA',
          description: 'La estructura clásica: llamo la atención, nombro el problema, presento tu producto y cierro con lo que tiene que hacer la persona.',
        },
        {
          title: 'Variaciones de hook',
          description: 'El mismo video con distintos inicios, para probar cuál detiene a tu público en los primeros 3 segundos.',
        },
        {
          title: 'Problema-solución con demo',
          description: 'Para cuando la solución se entiende mejor mostrando el producto en uso.',
        },
        {
          title: 'Antes y después',
          description: 'Contrasto la molestia del principio con el resultado, para que el cambio se vea.',
        },
      ],
      bestFitTitle: 'Te conviene si',
      bestFitItems: [
        'Tienes una marca de ecommerce o venta directa, ya haces pauta y necesitas anuncios con una estructura clara.',
        'Tu producto resuelve un problema concreto: ahorra tiempo o dinero, o simplifica algo complicado.',
        'Tu equipo sabe que el hook es lo que decide si un anuncio funciona.',
      ],
      notFitTitle: 'No te conviene si',
      notFitItems: [
        'Tu producto no resuelve un problema claro o el problema es difícil de mostrar en video.',
        'Buscas contenido de marca o aspiracional, sin un objetivo de venta directo.',
        'No tienes una oferta definida ni un CTA hacia dónde mandar a la gente.',
      ],
      marketTitle: 'Mercados y formatos',
      marketItems: [
        'Marcas en Estados Unidos, España y Latinoamérica, en español o en inglés.',
        'Campañas de conversión en Meta Ads y TikTok Ads, también para gente que ya visitó tu tienda.',
        'Público que todavía no conoce tu marca y necesita reconocerse en el problema antes de ver el producto.',
      ],
      processTitle: 'Cómo trabajamos',
      processSteps: [
        {
          title: '1. Problema y público',
          description: 'Buscamos el problema real de tu cliente ideal: qué le molesta, qué ya probó y por qué sigue sin resolverlo.',
        },
        {
          title: '2. Hook y estructura',
          description: 'En español escribo varias opciones de hook y armo el orden: problema, solución, prueba y CTA. En inglés trabajo con tu guion.',
        },
        {
          title: '3. Grabación',
          description: 'Grabo cada parte con emoción real y buen ritmo, para que la gente no se vaya a mitad del video.',
        },
        {
          title: '4. Entrega con variaciones',
          description: 'Te mando los videos con distintos hooks, listos para probar, para que tu equipo vea rápido cuál funciona.',
        },
      ],
      featuredTitle: 'Ejemplos de mi trabajo',
      featuredIntro: 'Anuncios donde nombro un problema a cámara y después presento la solución.',
      featuredExamples: [
        {
          clipId: 1009,
          title: 'Bot de WhatsApp: clientes sin respuesta → ventas automáticas',
          description: 'Hook que nombra el problema (“¿cuántos clientes no reciben respuesta?”), beneficios rápidos y CTA directo.',
        },
        {
          clipId: 5,
          title: 'Bienes raíces: no saber invertir → acompañamiento completo',
          description: '“¿Quieres invertir pero no sabes por dónde empezar?” El problema, la solución de una empresa con 30 años de experiencia y el CTA.',
        },
        {
          clipId: 1001,
          title: 'Marketing: tener redes bonitas no basta → equipo de ventas',
          description: '“¿Quieres vender más? Los anuncios no bastan.” Hook, problema, solución y CTA para una agencia digital.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre UGC problema-solución',
      faqs: [
        {
          question: '¿Por qué funciona tan bien el formato problema-solución?',
          answer:
            'Porque se parece a cómo tomamos decisiones: primero sentimos la molestia y después buscamos la salida. Si el video está bien hecho, la persona se identifica en los primeros segundos y está atenta cuando aparece la solución.',
        },
        {
          question: '¿Cuántas variaciones de hook me recomiendas?',
          answer:
            'Por lo menos dos o tres por video. El hook es lo que decide si alguien sigue mirando, así que tener opciones para probar es una buena forma de usar tu presupuesto.',
        },
        {
          question: '¿Este formato sirve para cualquier producto?',
          answer:
            'Funciona mejor cuando el producto resuelve un problema real y concreto. Si el problema es claro y la solución se puede mostrar en 30 a 60 segundos, es una buena opción.',
        },
        {
          question: '¿Puedes escribir los guiones o tengo que mandarlos?',
          answer:
            'En español los escribo yo. Tengo más de 9 años en periodismo y medios, y estoy acostumbrada a ordenar mensajes para que enganchen. Solo necesito información del producto y de tu público. En inglés trabajo con tu guion.',
        },
      ],
      ctaTitle: '¿Necesitas anuncios que empiecen por el problema de tu cliente?',
      ctaText:
        'Cuéntame qué vendes, cuál es el problema principal de tu público y si ya sabes qué hooks te han funcionado. Con eso te armo una propuesta de videos.',
      relatedTitle: 'Otros servicios',
      relatedServiceIds: ['ugc-ads-tiktok-meta', 'ugc-product-demo'],
    },
    en: {
      navLabel: 'Problem-solution UGC',
      metaTitle: 'Problem solution UGC videos | Gisela',
      metaDescription:
        'Problem solution UGC videos for TikTok and Meta ads: a hook, the problem your customer has, your product as the fix, and a clear CTA.',
      breadcrumbLabel: 'Problem-solution',
      heroEyebrow: 'Ad format',
      heroTitle: 'Problem-solution UGC videos that start with what bugs your customer',
      heroSummary:
        'I make ads with a hook, problem, solution, and CTA structure, one of the most common setups in paid social. My background is in journalism, so I know how to organize a message so it lands in a few seconds.',
      heroPoints: [
        'It all starts with the hook',
        'For conversion campaigns',
        'Several hooks to test',
      ],
      primaryCtaLabel: 'Request videos',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'What the problem-solution format is for',
      sectionIntroText:
        'This format works because it follows how people make decisions: they feel a frustration, recognize the problem, and pay attention when the solution shows up. It isn’t magic, but it’s one of the most common structures in UGC ads.',
      deliverablesTitle: 'What you can ask me for',
      deliverables: [
        {
          title: 'Hook + problem + solution + CTA',
          description: 'The classic structure: grab attention, name the problem, introduce your product, and tell people what to do next.',
        },
        {
          title: 'Hook variations',
          description: 'The same video with different openings, so you can test which one stops the scroll in the first 3 seconds.',
        },
        {
          title: 'Problem-solution with demo',
          description: 'For when the solution is easier to get by seeing the product in use.',
        },
        {
          title: 'Before and after',
          description: 'I contrast the frustration at the start with the result, so the change is easy to see.',
        },
      ],
      bestFitTitle: 'This is for you if',
      bestFitItems: [
        'You run an ecommerce or direct-to-consumer brand, already run paid ads, and need ads with a clear structure.',
        'Your product fixes a specific problem: it saves time or money, or makes something complicated simple.',
        'Your team knows the hook is what makes or breaks an ad.',
      ],
      notFitTitle: 'This isn’t for you if',
      notFitItems: [
        'Your product doesn’t solve a clear problem, or the problem is hard to show on video.',
        'You want brand or aspirational content with no direct sales goal.',
        'You don’t have a defined offer or a CTA to send people to.',
      ],
      marketTitle: 'Markets and formats',
      marketItems: [
        'Brands in the US, Spain, and Latin America, in Spanish or English.',
        'Conversion and retargeting campaigns on Meta and TikTok.',
        'Cold audiences who need to recognize the problem before they’ll look at the product.',
      ],
      processTitle: 'How it works',
      processSteps: [
        {
          title: '1. Problem and audience',
          description: 'We find the real problem your ideal customer has: what bothers them, what they’ve tried, and why it’s still not fixed.',
        },
        {
          title: '2. Hook and structure',
          description: 'For Spanish videos, I write several hook options and lay out the order: problem, solution, proof, and CTA. For English, I work from your script.',
        },
        {
          title: '3. Filming',
          description: 'I film each part with real emotion and good pacing so people don’t drop off halfway.',
        },
        {
          title: '4. Delivery with variations',
          description: 'You get videos with different hooks, ready to test, so your team can see quickly which one works.',
        },
      ],
      featuredTitle: 'Examples of my work',
      featuredIntro: 'Ads where I name a problem on camera and then present the solution.',
      featuredExamples: [
        {
          clipId: 1009,
          title: 'WhatsApp bot: unanswered customers → automated sales',
          description: 'A hook that names the problem (“how many customers don’t get a reply?”), quick benefits, and a direct CTA.',
        },
        {
          clipId: 5,
          title: 'Real estate: not knowing how to invest → full guidance',
          description: '“Want to invest but don’t know where to start?” The problem, a solution from a company with 30 years of experience, and the CTA.',
        },
        {
          clipId: 1001,
          title: 'Marketing: a pretty feed isn’t enough → sales team',
          description: '“Want to sell more? Ads aren’t enough.” Hook, problem, solution, and CTA for a digital agency.',
        },
      ],
      faqTitle: 'Common questions about problem-solution UGC',
      faqs: [
        {
          question: 'Why does the problem-solution format work so well?',
          answer:
            'Because it mirrors how we make decisions: first we feel the frustration, then we look for a way out. When the video is done well, viewers recognize themselves in the first few seconds and are paying attention when the solution shows up.',
        },
        {
          question: 'How many hook variations do you recommend?',
          answer:
            'At least two or three per video. The hook decides whether someone keeps watching, so having options to test is a smart use of your budget.',
        },
        {
          question: 'Does this format work for any product?',
          answer:
            'It works best when the product solves a real, specific problem. If the problem is clear and the solution can be shown in 30 to 60 seconds, it’s a good choice.',
        },
        {
          question: 'Can you write the scripts, or do I need to send them?',
          answer:
            'For Spanish videos, I write them. I have more than nine years in journalism and media, so I’m used to organizing a message so it grabs attention. I just need details on the product and your audience. For English videos, I work from your script.',
        },
      ],
      ctaTitle: 'Need ads that start with your customer’s problem?',
      ctaText:
        'Tell me what you sell, the main problem your audience has, and whether you know which hooks have worked before. I’ll put together a proposal from there.',
      relatedTitle: 'Other services',
      relatedServiceIds: ['ugc-ads-tiktok-meta', 'ugc-product-demo'],
    },
  },
  'ugc-lifestyle': {
    es: {
      navLabel: 'UGC lifestyle',
      metaTitle: 'Contenido lifestyle UGC | Gisela Saldarriaga',
      metaDescription:
        'Contenido lifestyle UGC para el feed de tu marca, Reels y TikTok. Muestro tu producto en momentos del día a día, sin que parezca un anuncio.',
      breadcrumbLabel: 'UGC lifestyle',
      heroEyebrow: 'Contenido orgánico',
      heroTitle: 'Contenido lifestyle UGC que se ve real en el feed de tu marca',
      heroSummary:
        'Grabo videos donde tu producto aparece en momentos cotidianos, sin forzar la venta. Te los mando listos para Reels, TikTok o el feed de tu marca.',
      heroPoints: [
        'Tu producto en escenas reales',
        'Para redes, no para anuncios',
        'Estética natural y cercana',
      ],
      primaryCtaLabel: 'Pedir videos',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Para qué sirve el contenido lifestyle',
      sectionIntroText:
        'No todo el UGC tiene que ser un anuncio. Muchas marcas necesitan videos para su feed que cuenten una historia pequeña y muestren el producto como parte del día a día, no como un comercial.',
      deliverablesTitle: 'Qué puedes pedirme',
      deliverables: [
        {
          title: 'Reseñas lifestyle cortas',
          description: 'Reseñas donde uso el producto en mi rutina, sin guion rígido ni tono de comercial.',
        },
        {
          title: 'Escenas del día a día',
          description: 'Momentos como la rutina de la mañana, el escritorio, el skincare o la cocina, con tu producto ahí de forma natural.',
        },
        {
          title: 'Videos para Reels y TikTok',
          description: 'Video vertical para tus publicaciones en redes, no para pauta.',
        },
        {
          title: 'Contenido para el feed de tu marca',
          description: 'Videos que puedes publicar directo en tu cuenta, con el tono cercano de una creadora.',
        },
      ],
      bestFitTitle: 'Te conviene si',
      bestFitItems: [
        'Tienes una marca de belleza, skincare, bienestar o lifestyle y quieres un feed con la voz de una creadora real.',
        'Necesitas contenido para redes sin depender solo de la pauta.',
        'Tu producto se ve mejor en contexto que sobre un fondo blanco.',
      ],
      notFitTitle: 'No te conviene si',
      notFitItems: [
        'Necesitas un anuncio con un hook agresivo y un CTA directo.',
        'Tu producto necesita una explicación técnica o una demo paso a paso.',
        'Buscas tomas sueltas sin voz en off ni historia. Para eso está el B-roll.',
      ],
      marketTitle: 'Mercados y formatos',
      marketItems: [
        'Marcas de Estados Unidos, España, Latinoamérica, Australia y Nueva Zelanda.',
        'Contenido para redes en español e inglés.',
        'Video vertical para Instagram Reels, TikTok y el feed de tu marca.',
      ],
      processTitle: 'Cómo trabajamos',
      processSteps: [
        {
          title: '1. Brief y concepto',
          description: 'Definimos el producto, la estética, el tipo de escena y el tono que quieres para tu feed.',
        },
        {
          title: '2. Propuesta de escenas',
          description: 'Te propongo momentos y lugares donde tu producto encaja de forma natural.',
        },
        {
          title: '3. Grabación',
          description: 'Grabo con luz natural, buen ritmo y una estética que va con tu marca.',
        },
        {
          title: '4. Entrega',
          description: 'Te mando los videos editados, con subtítulos si hacen falta, listos para subir a tus redes.',
        },
      ],
      featuredTitle: 'Ejemplos de mi trabajo',
      featuredIntro: 'Productos y lugares en momentos reales, con un tono natural.',
      featuredExamples: [
        {
          clipId: 8,
          title: 'Reseña de perfumes Chop X',
          description: '“Mi pequeño lujo diario”: fragancias en el día a día, con humor y personalidad.',
        },
        {
          clipId: 1002,
          title: 'Contenido orgánico desde España',
          description: 'Un relato de viaje sobre la cultura española en formato TikTok: mi opinión y una historia contada en primera persona.',
        },
        {
          clipId: 1,
          title: 'Me pruebo outfits de Temu',
          description: 'Me pruebo la ropa paso a paso y doy mi opinión sincera. Un formato lifestyle clásico para marcas de moda.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre UGC lifestyle',
      faqs: [
        {
          question: '¿Qué diferencia hay entre contenido lifestyle y UGC Ads?',
          answer:
            'El contenido lifestyle es para las redes orgánicas de tu marca. No lleva un hook de venta ni un CTA agresivo: el producto aparece en un momento real, no en un discurso de venta. Los UGC Ads, en cambio, se graban para pauta, con una estructura que busca retener y vender.',
        },
        {
          question: '¿Puedo usar este contenido como anuncio?',
          answer:
            'Se puede, pero no está hecho para eso. Si necesitas anuncios, el servicio de UGC Ads te va a funcionar mejor porque trabaja con hook, beneficio y CTA. Además, usarlo en pauta requiere una licencia aparte.',
        },
        {
          question: '¿Cuántos videos se entregan por proyecto?',
          answer:
            'Depende del brief. Normalmente son de 3 a 6 videos por producto, pero lo ajusto a lo que necesites para tu calendario de contenido.',
        },
        {
          question: '¿Trabajas con marcas fuera de Latinoamérica?',
          answer:
            'Sí. Hago contenido para marcas en Estados Unidos, España, Australia y Nueva Zelanda. Todo se coordina a distancia y el envío del producto es sencillo.',
        },
      ],
      ctaTitle: '¿Tu marca necesita contenido para redes que se vea real?',
      ctaText:
        'Cuéntame qué producto quieres mostrar, qué tono tiene tu marca y para qué red lo necesitas. Te propongo escenas y formatos.',
      relatedTitle: 'Otros servicios',
      relatedServiceIds: ['ugc-testimonials-reviews', 'ugc-broll-footage'],
    },
    en: {
      navLabel: 'Lifestyle UGC',
      metaTitle: 'Lifestyle UGC creator | Gisela Saldarriaga',
      metaDescription:
        'Lifestyle UGC content for your brand feed, Reels, and TikTok. I show your product in everyday moments, without it feeling like an ad.',
      breadcrumbLabel: 'Lifestyle UGC',
      heroEyebrow: 'Organic content',
      heroTitle: 'Lifestyle UGC content that looks real in your brand feed',
      heroSummary:
        'I film videos where your product shows up in everyday moments, no hard sell. You get them ready for Reels, TikTok, or your brand feed.',
      heroPoints: [
        'Your product in real-life scenes',
        'For organic posts, not ads',
        'A natural, relaxed look',
      ],
      primaryCtaLabel: 'Request videos',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'What lifestyle content is for',
      sectionIntroText:
        'Not all UGC has to be an ad. Plenty of brands need videos for their feed that tell a small story and show the product as part of everyday life, not as a commercial.',
      deliverablesTitle: 'What you can ask me for',
      deliverables: [
        {
          title: 'Short lifestyle reviews',
          description: 'Reviews where I use the product in my routine, with no rigid script or commercial tone.',
        },
        {
          title: 'Everyday scenes',
          description: 'Moments like a morning routine, a desk setup, skincare, or cooking, with your product there naturally.',
        },
        {
          title: 'Reels and TikTok videos',
          description: 'Vertical video for your social posts, not for paid ads.',
        },
        {
          title: 'Brand feed content',
          description: 'Videos you can post straight to your account, with a creator’s personal tone.',
        },
      ],
      bestFitTitle: 'This is for you if',
      bestFitItems: [
        'You run a beauty, skincare, wellness, or lifestyle brand and want a feed with a real creator’s voice.',
        'You need social content without relying only on paid ads.',
        'Your product looks better in context than on a white background.',
      ],
      notFitTitle: 'This isn’t for you if',
      notFitItems: [
        'You need an ad with an aggressive hook and a direct CTA.',
        'Your product needs a technical explanation or a step-by-step demo.',
        'You want standalone shots with no voiceover or story. That’s what b-roll is for.',
      ],
      marketTitle: 'Markets and formats',
      marketItems: [
        'Brands in the US, Spain, Latin America, Australia, and New Zealand.',
        'Social content in Spanish and English.',
        'Vertical video for Instagram Reels, TikTok, and brand feeds.',
      ],
      processTitle: 'How it works',
      processSteps: [
        {
          title: '1. Brief and concept',
          description: 'We settle on the product, the look, the kind of scene, and the tone you want for your feed.',
        },
        {
          title: '2. Scene ideas',
          description: 'I suggest moments and settings where your product fits in naturally.',
        },
        {
          title: '3. Filming',
          description: 'I film with natural light, good pacing, and a look that matches your brand.',
        },
        {
          title: '4. Delivery',
          description: 'You get edited videos, with subtitles if needed, ready to post.',
        },
      ],
      featuredTitle: 'Examples of my work',
      featuredIntro: 'Products and places in real moments, with a natural tone.',
      featuredExamples: [
        {
          clipId: 8,
          title: 'Chop X perfume review',
          description: '“My little daily luxury”: fragrances in everyday life, with humor and personality.',
        },
        {
          clipId: 1002,
          title: 'Organic content from Spain',
          description: 'A travel story about Spanish culture in TikTok format: my own opinions, told in first person.',
        },
        {
          clipId: 1,
          title: 'Temu outfit try-on',
          description: 'I try on the clothes one by one and give my honest opinion. A classic lifestyle format for fashion brands.',
        },
      ],
      faqTitle: 'Common questions about lifestyle UGC',
      faqs: [
        {
          question: 'What’s the difference between lifestyle content and UGC ads?',
          answer:
            'Lifestyle content is for your brand’s organic social. There’s no sales hook or pushy CTA: the product shows up in a real moment, not in a pitch. UGC ads are made for paid campaigns, with a structure meant to keep people watching and get them to buy.',
        },
        {
          question: 'Can I also run this content as an ad?',
          answer:
            'You can, but it isn’t made for that. If you need ads, my UGC ads service will work better because it’s built around a hook, a benefit, and a CTA. Also, using it in paid ads requires a separate license.',
        },
        {
          question: 'How many videos do I get per project?',
          answer:
            'It depends on the brief. Usually it’s 3 to 6 videos per product, but I can adjust that to fit your content calendar.',
        },
        {
          question: 'Do you work with brands outside Latin America?',
          answer:
            'Yes. I make content for brands in the US, Spain, Australia, and New Zealand. Everything is coordinated remotely and shipping the product is simple.',
        },
      ],
      ctaTitle: 'Does your brand need social content that looks real?',
      ctaText:
        'Tell me which product you want to show, your brand’s tone, and which platform it’s for. I’ll suggest scenes and formats.',
      relatedTitle: 'Other services',
      relatedServiceIds: ['ugc-testimonials-reviews', 'ugc-broll-footage'],
    },
  },
  'ugc-broll-footage': {
    es: {
      navLabel: 'B-roll UGC',
      metaTitle: 'B-roll UGC: paquete de tomas | Gisela',
      metaDescription:
        'Paquetes de B-roll UGC: primeros planos, producto en uso, texturas y escenas lifestyle sin voz en off. Yo grabo y tu equipo edita.',
      breadcrumbLabel: 'B-roll UGC',
      heroEyebrow: 'Material para editar',
      heroTitle: 'B-roll UGC para tu equipo: tomas de producto y clips sin voz en off',
      heroSummary:
        'Grabo paquetes de tomas (primeros planos, producto en uso, texturas y ambiente) para que tu equipo tenga material real de una creadora y lo edite como quiera. Sin guion ni voz en off, solo clips listos para cortar.',
      heroPoints: [
        'Paquetes de tomas sueltas',
        'Sin voz en off: tu equipo edita',
        'Se suma fácil a otros servicios',
      ],
      primaryCtaLabel: 'Pedir un paquete',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Para qué sirve el B-roll UGC',
      sectionIntroText:
        'A veces una marca no necesita un video terminado, sino material. Tomas limpias y bien iluminadas, con estética de creadora, que tu equipo o tu editor puedan cortar y adaptar a distintos formatos. Eso es lo que te entrego, sin imponer una estructura ni una historia.',
      deliverablesTitle: 'Qué puedes pedirme',
      deliverables: [
        {
          title: 'Primeros planos del producto',
          description: 'Tomas de cerca de texturas, empaques, aplicación y ángulos que lucen el producto.',
        },
        {
          title: 'Producto en uso',
          description: 'Manos, rutinas y momentos donde el producto se ve funcionando, sin necesidad de explicarlo.',
        },
        {
          title: 'Tomas de ambiente',
          description: 'Escenas de contexto (el espacio, la luz, los objetos alrededor) que le dan profundidad a la edición final.',
        },
        {
          title: 'Tomas verticales y horizontales',
          description: 'Según el brief, puedo entregar los dos formatos para que tu equipo tenga más opciones al editar.',
        },
      ],
      bestFitTitle: 'Te conviene si',
      bestFitItems: [
        'Tu marca tiene equipo de edición y necesita material original con estética UGC, no videos de stock.',
        'Ya trabajas conmigo en otro servicio y quieres sumar tomas extra.',
        'Tu campaña necesita mucho material para editar varias versiones de una misma idea.',
      ],
      notFitTitle: 'No te conviene si',
      notFitItems: [
        'Necesitas un video terminado con voz en off, guion e historia. Para eso están mis otros servicios.',
        'No tienes quién edite y necesitas el video listo para publicar.',
        'Buscas una sola toma específica y no un paquete de clips variados.',
      ],
      marketTitle: 'Mercados y formatos',
      marketItems: [
        'Marcas en Estados Unidos, España, Latinoamérica y Oceanía que editan internamente.',
        'B-roll para anuncios, redes, landing pages, emails y presentaciones de producto.',
        'Se pide mucho junto con UGC lifestyle, anuncios o testimoniales.',
      ],
      processTitle: 'Cómo trabajamos',
      processSteps: [
        {
          title: '1. Brief de producto y estilo',
          description: 'Me cuentas qué producto es, qué tomas necesitas y qué estética busca tu marca.',
        },
        {
          title: '2. Lista de tomas',
          description: 'Te propongo los tipos de clips: primeros planos, en uso, ambiente, ángulos. Tú apruebas o ajustas.',
        },
        {
          title: '3. Grabación',
          description: 'Grabo todas las tomas con luz natural, pensando en que sean fáciles de editar.',
        },
        {
          title: '4. Entrega',
          description: 'Te mando cada clip por separado, con nombre y ordenado, para que tu equipo los corte y combine.',
        },
      ],
      featuredTitle: 'Ejemplos de mi trabajo',
      featuredIntro: 'El B-roll se entrega como clips sueltos, pero estos ejemplos te muestran el tipo de tomas, luz y estética que puedes esperar.',
      featuredExamples: [
        {
          clipId: 10,
          title: 'Clip lifestyle corto (7s)',
          description: 'Una toma rápida con encuadre limpio, como los clips sueltos que le entrego a tu equipo.',
        },
        {
          clipId: 1002,
          title: 'Escenas de viaje y exteriores',
          description: 'Grabado en España, con varias locaciones, luz natural y movimiento. Sirve como material visual.',
        },
        {
          clipId: 1007,
          title: 'Detrás de cámaras en un noticiero',
          description: 'Tomas detrás de cámaras en un set de noticias, con la cuenta regresiva incluida.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre B-roll UGC',
      faqs: [
        {
          question: '¿El B-roll incluye voz en off o edición final?',
          answer:
            'No. Te entrego clips sueltos, sin voz en off ni historia armada, para que tu equipo los edite a su manera. Si necesitas videos terminados, te conviene más el servicio de UGC lifestyle o el de anuncios.',
        },
        {
          question: '¿Cuántos clips trae un paquete?',
          answer:
            'Depende del brief y del producto. Un paquete típico tiene entre 8 y 15 clips. Lo definimos antes de grabar para que recibas lo que tu equipo de verdad va a usar.',
        },
        {
          question: '¿Puedo combinar el B-roll con otro servicio?',
          answer:
            'Sí, y es de lo más común. Muchas marcas suman un paquete de B-roll a un proyecto de UGC lifestyle, anuncios o testimoniales. Así aprovechamos la misma sesión para sacar más material.',
        },
        {
          question: '¿En qué formato me entregas los clips?',
          answer:
            'Normalmente en MP4 vertical (9:16). Si tu equipo necesita horizontal o los dos, lo coordinamos antes de grabar. Los archivos llegan con nombre y ordenados para que editar sea más fácil.',
        },
      ],
      ctaTitle: '¿Tu equipo necesita material UGC para editar?',
      ctaText:
        'Cuéntame qué producto quieres mostrar, cuántas tomas necesitas y cómo las va a usar tu equipo. Te armo una propuesta de paquete.',
      relatedTitle: 'Otros servicios',
      relatedServiceIds: ['ugc-lifestyle', 'ugc-ads-tiktok-meta'],
    },
    en: {
      navLabel: 'UGC b-roll',
      metaTitle: 'UGC b-roll footage packages | Gisela',
      metaDescription:
        'UGC b-roll footage packages: close-ups, product in use, textures, and lifestyle scenes with no voiceover. I film, your team edits.',
      breadcrumbLabel: 'UGC b-roll',
      heroEyebrow: 'Footage for your editor',
      heroTitle: 'UGC b-roll footage for your team: product shots and clips with no voiceover',
      heroSummary:
        'I film footage packages (close-ups, product in use, textures, and ambient shots) so your team has real creator-shot material to edit however they want. No script, no voiceover, just clips ready to cut.',
      heroPoints: [
        'Packages of standalone clips',
        'No voiceover: your team edits',
        'Easy to add to other services',
      ],
      primaryCtaLabel: 'Request a package',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'What UGC b-roll is for',
      sectionIntroText:
        'Sometimes a brand doesn’t need a finished video, just material. Clean, well-lit shots with a creator look that your team or editor can cut and adapt to different formats. That’s what I deliver, without forcing a structure or a story on it.',
      deliverablesTitle: 'What you can ask me for',
      deliverables: [
        {
          title: 'Product close-ups',
          description: 'Close shots of textures, packaging, application, and angles that show off the product.',
        },
        {
          title: 'Product in use',
          description: 'Hands, routines, and moments where you see the product working, no explanation needed.',
        },
        {
          title: 'Ambient shots',
          description: 'Context shots (the space, the light, the objects around the product) that add depth to the final edit.',
        },
        {
          title: 'Vertical and horizontal footage',
          description: 'Depending on the brief, I can deliver both orientations so your team has more options in the edit.',
        },
      ],
      bestFitTitle: 'This is for you if',
      bestFitItems: [
        'Your brand has an in-house editing team and needs original footage with a UGC look, not stock.',
        'You already work with me on another service and want to add extra shots.',
        'Your campaign needs a lot of footage to cut several versions of the same idea.',
      ],
      notFitTitle: 'This isn’t for you if',
      notFitItems: [
        'You need a finished video with voiceover, a script, and a story. My other services cover that.',
        'You don’t have anyone to edit and need the video ready to post.',
        'You’re looking for one specific shot rather than a package of varied clips.',
      ],
      marketTitle: 'Markets and formats',
      marketItems: [
        'Brands in the US, Spain, Latin America, and Oceania that edit in-house.',
        'B-roll for ads, social posts, landing pages, emails, and product presentations.',
        'Often ordered together with lifestyle UGC, ads, or testimonials.',
      ],
      processTitle: 'How it works',
      processSteps: [
        {
          title: '1. Product and style brief',
          description: 'You tell me about the product, the shots you need, and the look your brand is going for.',
        },
        {
          title: '2. Shot list',
          description: 'I suggest the types of clips: close-ups, in use, ambient, angles. You approve or adjust.',
        },
        {
          title: '3. Filming',
          description: 'I film all the shots in natural light, keeping in mind that they need to be easy to edit.',
        },
        {
          title: '4. Delivery',
          description: 'You get each clip as a separate file, named and organized, ready for your team to cut and combine.',
        },
      ],
      featuredTitle: 'Examples of my work',
      featuredIntro: 'B-roll is delivered as loose clips, but these examples show the kind of shots, lighting, and look you can expect.',
      featuredExamples: [
        {
          clipId: 10,
          title: 'Short lifestyle clip (7s)',
          description: 'A quick shot with clean framing, like the standalone clips I hand over to your team.',
        },
        {
          clipId: 1002,
          title: 'Travel and outdoor scenes',
          description: 'Filmed in Spain across several locations, with natural light and movement. Useful as visual material.',
        },
        {
          clipId: 1007,
          title: 'Newsroom behind the scenes',
          description: 'Behind-the-scenes shots on a news set, countdown included.',
        },
      ],
      faqTitle: 'Common questions about UGC b-roll',
      faqs: [
        {
          question: 'Does the b-roll include voiceover or final editing?',
          answer:
            'No. You get loose clips with no voiceover or story, so your team can edit them their way. If you need finished videos, my lifestyle UGC or ads services are a better fit.',
        },
        {
          question: 'How many clips come in a package?',
          answer:
            'It depends on the brief and the product. A typical package has 8 to 15 clips. We agree on it before filming so you get what your team will actually use.',
        },
        {
          question: 'Can I combine b-roll with another service?',
          answer:
            'Yes, and it’s one of the most common setups. Many brands add a b-roll package to a lifestyle UGC, ads, or testimonial project, so we get more material out of the same session.',
        },
        {
          question: 'What format do you deliver the clips in?',
          answer:
            'Usually vertical MP4 (9:16). If your team needs horizontal or both, we sort that out before filming. Files come named and organized to make editing easier.',
        },
      ],
      ctaTitle: 'Does your team need UGC footage to edit?',
      ctaText:
        'Tell me which product you want to show, how many shots you need, and how your team plans to use them. I’ll put together a package proposal.',
      relatedTitle: 'Other services',
      relatedServiceIds: ['ugc-lifestyle', 'ugc-ads-tiktok-meta'],
    },
  },
};

export const getServicePageContent = (serviceId: ServicePageId, locale: SiteLocale): ServicePageContent => {
  const localized = SERVICE_PAGE_CONTENT[serviceId][locale];
  const tailoring = SERVICE_TAILORING[serviceId][locale];
  const clipIds = SERVICE_FORMAT_CLIP_IDS[serviceId];
  const fallbackClips = localized.featuredExamples;

  return {
    ...localized,
    ...tailoring,
    deliverables: localized.deliverables.map((item, index) => ({
      ...item,
      clipId: clipIds[index] ?? fallbackClips[index % Math.max(fallbackClips.length, 1)]?.clipId,
    })),
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

export const getAllServiceIds = (): ServicePageId[] =>
  Object.keys(SERVICE_PAGE_CONTENT) as ServicePageId[];

export const getRelatedServiceSummaries = (
  serviceIds: ServicePageId[],
  locale: SiteLocale,
): RelatedServiceSummary[] =>
  serviceIds.map((serviceId) => {
    const page = getServicePageContent(serviceId, locale);
    return {
      id: serviceId,
      leadClipId: page.featuredExamples[0]?.clipId,
      eyebrow: page.heroEyebrow,
      title: page.navLabel,
      summary: page.metaDescription,
    };
  });
