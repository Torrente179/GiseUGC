import type { ServicePageId, SiteLocale } from '@/lib/locale-path';

/**
 * Per-service tailoring for the keynote sections below the hero.
 *
 * Every phrase here must be an exact substring of the string it decorates
 * (title, intro, or a fit item). The renderers wrap exact matches and fall
 * back to plain text when one is missing, and a unit test fails the build when
 * copy is edited and a phrase stops matching. Nothing here adds a claim: it
 * only says which words of existing copy carry the weight.
 */
export type ServiceTailoring = {
  /** The phrase in `sectionIntroTitle` that takes the gradient. */
  sectionIntroTitleAccent: string;
  /** Phrases of `sectionIntroText` set in full ink; the rest stays muted. */
  sectionIntroHighlights: string[];
  /** Phrases of the fit items (both lists) set in full ink. */
  fitHighlights: string[];
};

/**
 * The clip each deliverable plays on the Formats phone, in deliverable order.
 * Shared by ES and EN. Each page prefers its own `featuredExamples` and never
 * repeats a clip; the fourth is the closest non-featured clip for the format.
 */
export const SERVICE_FORMAT_CLIP_IDS: Record<ServicePageId, [number, number, number, number]> = {
  'bilingual-ugc-creator': [1001, 1008, 4, 1006],
  'spokesperson-videos': [1005, 1010, 2, 1008],
  'ugc-ads-tiktok-meta': [1001, 1009, 1003, 4],
  'ugc-testimonials-reviews': [4, 1013, 1, 1004],
  'ugc-product-demo': [1008, 1011, 3, 7],
  'ugc-problem-solution': [1009, 1001, 5, 1012],
  'ugc-lifestyle': [8, 1002, 1, 10],
  'ugc-broll-footage': [10, 4, 1002, 1007],
};

export const SERVICE_TAILORING: Record<ServicePageId, Record<SiteLocale, ServiceTailoring>> = {
  'bilingual-ugc-creator': {
    es: {
      sectionIntroTitleAccent: 'UGC bilingüe',
      sectionIntroHighlights: [
        'te ahorras coordinar a dos creadoras distintas',
        'adapto el guion a cada idioma',
        'ninguna de las dos suena a traducción',
      ],
      fitHighlights: [
        'la versión en inglés',
        'el mismo estilo',
        'una sola persona',
        'producción de estudio con varios actores, locaciones o escenografía',
        'doblaje o una adaptación cultural',
        'promesas que nadie diría con naturalidad',
      ],
    },
    en: {
      sectionIntroTitleAccent: 'bilingual UGC',
      sectionIntroHighlights: [
        'you don’t have to coordinate two different creators',
        'adapt the script to each language',
        'neither one sounds translated',
      ],
      fitHighlights: [
        'also need an English version',
        'videos quickly',
        'one person film them all',
        'studio production with several actors, locations, or sets',
        'dubbing or cultural adaptation',
        'claims nobody could say naturally on camera',
      ],
    },
  },
  'spokesperson-videos': {
    es: {
      sectionIntroTitleAccent: 'video de portavoz',
      sectionIntroHighlights: [
        'no se entienden con una imagen y un texto',
        'una persona explicándola a cámara',
        'lo que tiene que hacer quien está mirando',
      ],
      fitHighlights: [
        'explicar de frente',
        'nueva o técnica',
        'más ordenado que un UGC casual',
        'casi no hay nada que explicar',
        'actuación compleja',
        'no tienes claro qué mensaje',
      ],
    },
    en: {
      sectionIntroTitleAccent: 'spokesperson video',
      sectionIntroHighlights: [
        'don’t make sense from an image and a caption',
        'a person explaining it on camera',
        'what the viewer should do next',
      ],
      fitHighlights: [
        'a clear, upfront explanation',
        'new or technical',
        'more structured than casual UGC',
        'barely anything to explain',
        'complex acting',
        'haven’t settled on the message',
      ],
    },
  },
  'ugc-ads-tiktok-meta': {
    es: {
      sectionIntroTitleAccent: 'UGC Ads',
      sectionIntroHighlights: [
        'un video bonito no alcanza',
        'varias opciones de hook, demo, beneficio y CTA',
        'quedarte con las que mejor funcionan',
      ],
      fitHighlights: [
        'más anuncios para probar',
        'variaciones de hook, beneficio y formato',
        'se ve en uso',
        'un video institucional o una campaña de marca',
        'el producto, la oferta o a quién le vas a hablar',
        'un solo video funcione',
      ],
    },
    en: {
      sectionIntroTitleAccent: 'UGC ads',
      sectionIntroHighlights: [
        'one nice-looking video won’t cut it.',
        'a few hooks, demos, benefits, and CTAs',
        'keeping the ones that work.',
      ],
      fitHighlights: [
        'more videos to test',
        'variations on hooks, benefits, and formats',
        'see it in use',
        'a corporate video or a brand campaign',
        'the product, the offer, or who you’re talking to',
        'one video to work',
      ],
    },
  },
  'ugc-testimonials-reviews': {
    es: {
      sectionIntroTitleAccent: 'reseña en video',
      sectionIntroHighlights: [
        'ver a alguien usando el producto y contando su experiencia da más confianza',
        'reseñas en video en sus anuncios y páginas de producto',
        'ayudan a que la gente se decida',
      ],
      fitHighlights: [
        'reseñas en video para tus páginas de producto',
        'la confianza vende más que un video bonito',
        'un beneficio claro',
        'promesas que no salen de una experiencia real',
        'no tiene un beneficio claro',
        'varios clientes reales grabados en distintos lugares',
      ],
    },
    en: {
      sectionIntroTitleAccent: 'video review',
      sectionIntroHighlights: [
        'watching someone use the product and talk about it builds more trust',
        'video reviews in their ads and on product pages',
        'help people make up their minds',
      ],
      fitHighlights: [
        'video reviews for your product pages',
        'trust sells better than a pretty video',
        'a clear benefit',
        'claims that don’t come from real use',
        'doesn’t have a clear benefit',
        'several real customers filmed in different places',
      ],
    },
  },
  'ugc-product-demo': {
    es: {
      sectionIntroTitleAccent: 'demo de producto',
      sectionIntroHighlights: [
        'verlo en uso ayuda más que un carrusel o un texto largo',
        'No hago manuales',
        'muestro el producto funcionando',
      ],
      fitHighlights: [
        'entender el producto antes de comprar',
        'curva de aprendizaje',
        'contenido educativo con formato UGC',
        'se entiende a primera vista',
        'una grabación de pantalla sin nadie frente a cámara',
        'un tutorial muy largo o un curso completo',
      ],
    },
    en: {
      sectionIntroTitleAccent: 'product demo',
      sectionIntroHighlights: [
        'seeing it in use helps more than a carousel or a long block of text',
        'I don’t make manuals.',
        'explain it the way I would to someone seeing it for the first time',
      ],
      fitHighlights: [
        'understand the product before they buy',
        'a learning curve',
        'educational content in UGC style',
        'makes sense at first glance',
        'a screen recording with nobody on camera',
        'a long tutorial or a full course',
      ],
    },
  },
  'ugc-problem-solution': {
    es: {
      sectionIntroTitleAccent: 'problema-solución',
      sectionIntroHighlights: [
        'sigue la forma en que la gente decide',
        'presta atención cuando aparece la solución',
        'una de las estructuras que más se usan en anuncios UGC',
      ],
      fitHighlights: [
        'anuncios con una estructura clara',
        'resuelve un problema concreto',
        'el hook es lo que decide si un anuncio funciona',
        'no resuelve un problema claro',
        'contenido de marca o aspiracional',
        'una oferta definida ni un CTA',
      ],
    },
    en: {
      sectionIntroTitleAccent: 'problem-solution',
      sectionIntroHighlights: [
        'follows how people make decisions',
        'pay attention when the solution shows up',
        'one of the most common structures in UGC ads',
      ],
      fitHighlights: [
        'ads with a clear structure',
        'fixes a specific problem',
        'the hook is what makes or breaks an ad',
        'doesn’t solve a clear problem',
        'brand or aspirational content',
        'a defined offer or a CTA',
      ],
    },
  },
  'ugc-lifestyle': {
    es: {
      sectionIntroTitleAccent: 'contenido lifestyle',
      sectionIntroHighlights: [
        'No todo el UGC tiene que ser un anuncio.',
        'cuenten una historia pequeña',
        'parte del día a día, no como un comercial',
      ],
      fitHighlights: [
        'la voz de una creadora real',
        'sin depender solo de la pauta',
        'se ve mejor en contexto',
        'un hook agresivo y un CTA directo',
        'una explicación técnica o una demo paso a paso',
        'tomas sueltas sin voz en off ni historia',
      ],
    },
    en: {
      sectionIntroTitleAccent: 'lifestyle content',
      sectionIntroHighlights: [
        'Not all UGC has to be an ad.',
        'tell a small story',
        'part of everyday life, not as a commercial',
      ],
      fitHighlights: [
        'a real creator’s voice',
        'without relying only on paid ads',
        'looks better in context',
        'an aggressive hook and a direct CTA',
        'a technical explanation or a step-by-step demo',
        'standalone shots with no voiceover or story',
      ],
    },
  },
  'ugc-broll-footage': {
    es: {
      sectionIntroTitleAccent: 'B-roll UGC',
      sectionIntroHighlights: [
        'no necesita un video terminado, sino material',
        'cortar y adaptar a distintos formatos',
        'sin imponer una estructura ni una historia',
      ],
      fitHighlights: [
        'material original con estética UGC',
        'sumar tomas extra',
        'mucho material',
        'un video terminado con voz en off, guion e historia',
        'No tienes quién edite',
        'una sola toma específica',
      ],
    },
    en: {
      sectionIntroTitleAccent: 'UGC b-roll',
      sectionIntroHighlights: [
        'doesn’t need a finished video, just material',
        'cut and adapt to different formats',
        'without forcing a structure or a story on it',
      ],
      fitHighlights: [
        'original footage with a UGC look',
        'add extra shots',
        'a lot of footage',
        'a finished video with voiceover, a script, and a story',
        'don’t have anyone to edit',
        'one specific shot',
      ],
    },
  },
};
