import type { ServicePageId, VerticalPageId, SiteLocale, ResourcePageId } from '@/lib/locale-path';
import { getHomePath, getResourcePath, getServicePath } from '@/lib/locale-path';
import { FIVERR_PROFILE_URL } from '@/lib/contact-channels';

export type { ResourcePageId } from '@/lib/locale-path';

export type ResourceSection = {
  title: string;
  body: string[];
};

export type ResourceFaq = {
  question: string;
  answer: string;
};

export type ComparisonTable = {
  headers: string[];
  rows: string[][];
};

export type ResourcePageContent = {
  id: ResourcePageId;
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
  sections: ResourceSection[];
  comparisonTable?: ComparisonTable;
  faqs: ResourceFaq[];
  ctaTitle: string;
  ctaText: string;
  relatedServiceIds: ServicePageId[];
  relatedVerticalIds: VerticalPageId[];
};

export { getResourcePath } from '@/lib/locale-path';

type LocalizedResourcePageMap = Record<
  ResourcePageId,
  Record<
    SiteLocale,
    Omit<ResourcePageContent, 'id' | 'locale' | 'path' | 'alternatePath'>
  >
>;

const RESOURCE_PAGE_CONTENT: LocalizedResourcePageMap = {
  /* ═══════════════════════════════════════════════════════════════
     1. QUE ES UGC / WHAT IS UGC
     ═══════════════════════════════════════════════════════════════ */
  'what-is-ugc': {
    es: {
      navLabel: 'Qué es UGC',
      metaTitle: 'Qué es UGC: guía completa de contenido generado por usuarios | Gisela Saldarriaga',
      metaDescription:
        'UGC es contenido creado por personas reales —no por la marca— que genera confianza, mejora conversiones y reduce costos de producción. Guía completa con ejemplos.',
      breadcrumbLabel: 'Qué es UGC',
      heroEyebrow: 'Recurso',
      heroTitle: 'Qué es UGC y por qué las marcas lo necesitan para vender más',
      heroSummary:
        'UGC (User-Generated Content) es contenido creado por personas reales —no por el equipo interno de la marca— que se usa en ads, redes sociales y landings para generar confianza y convertir. En esta guía te explico qué es, cómo funciona y por qué se ha convertido en la pieza central de las estrategias de paid media más efectivas.',
      heroPoints: [
        'Definición clara y directa de UGC',
        'Por qué convierte mejor que el contenido de marca',
        'Cómo empezar a usar UGC en tu estrategia',
      ],
      primaryCtaLabel: 'Hablar de mi proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver portafolio',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sections: [
        {
          title: 'Definición de UGC: contenido real creado por personas reales',
          body: [
            'UGC significa User-Generated Content, o contenido generado por usuarios. En su forma más básica, es cualquier pieza de contenido —video, foto, reseña, testimonio— creada por una persona que no pertenece al equipo de marketing de la marca.',
            'La clave no está en quién lo publica, sino en cómo se percibe. Un video UGC se siente como una recomendación entre amigos, no como un anuncio corporativo. Y esa diferencia es exactamente lo que lo hace funcionar.',
            'En mi trabajo como creadora UGC, produzco estos contenidos de manera profesional: con buena iluminación, guión estructurado y dirección creativa clara, pero manteniendo el tono natural y la estética orgánica que hace que el espectador confíe en lo que está viendo.',
          ],
        },
        {
          title: 'Tipos de contenido UGC que funcionan hoy',
          body: [
            'El UGC abarca varios formatos, cada uno con su lugar en el embudo de conversión. Los más comunes incluyen: videos testimoniales donde alguien comparte su experiencia real con un producto, demos de producto que muestran el unboxing o el uso paso a paso, ads nativos que parecen contenido orgánico pero tienen estructura de venta, y B-roll de estilo de vida que contextualiza el producto en situaciones cotidianas.',
            'Los videos de problema-solución son particularmente efectivos: la creadora identifica un dolor del público, presenta el producto como la respuesta y cierra con un CTA. Este formato funciona porque replica la conversación que tendrías con una amiga que te recomienda algo.',
            'También están los videos de portavoz (spokesperson), donde la creadora habla directamente a cámara representando la marca con un tono cercano pero profesional. A diferencia de un comercial, se siente como una persona real dando su opinión honesta.',
          ],
        },
        {
          title: 'Por qué el UGC convierte mejor que el contenido de marca tradicional',
          body: [
            'Los números son claros: los anuncios con formato UGC generan hasta un 4x más de clics que los creativos de marca tradicionales, según datos de Meta y TikTok. La razón es psicológica: confiamos más en las recomendaciones de personas similares a nosotros que en los mensajes corporativos.',
            'Cuando alguien ve un video UGC en su feed, no lo identifica inmediatamente como publicidad. Eso baja las defensas y permite que el mensaje llegue antes de que el espectador decida hacer scroll. En paid social, esos primeros 2-3 segundos son todo.',
            'Además, el UGC es más eficiente en costos. Una sesión de producción UGC puede generar múltiples creativos para diferentes plataformas y audiencias, mientras que una producción de marca tradicional suele entregar menos piezas a un costo significativamente mayor.',
            'Desde mi experiencia produciendo UGC para marcas en Estados Unidos, España y Latinoamérica, he visto cómo un solo video bien estructurado puede superar en rendimiento a creativos que costaron diez veces más de producir.',
          ],
        },
        {
          title: 'UGC orgánico vs UGC pagado: cuál necesitas',
          body: [
            'El UGC orgánico es el contenido que tus clientes crean espontáneamente: fotos etiquetando tu marca, reseñas en Amazon, videos de unboxing. Es valioso, pero no lo controlas. No puedes garantizar la calidad, el mensaje ni el timing.',
            'El UGC pagado —o UGC profesional— es contenido producido por creadores especializados que trabajan bajo un brief de la marca. Se ve orgánico, se siente real, pero tiene estructura comercial: hook, beneficio central, CTA.',
            'La mayoría de las marcas que tienen éxito con UGC usan ambos: aprovechan el contenido orgánico de sus clientes para social proof, y producen UGC profesional para sus campañas de paid media. Es la combinación más efectiva.',
          ],
        },
        {
          title: 'Cómo empezar a usar UGC en tu estrategia de marketing',
          body: [
            'El primer paso es definir tu objetivo. ¿Quieres reducir el CPA de tus ads? ¿Necesitas contenido para landings que conviertan? ¿Buscas llenar tu feed con contenido que se sienta auténtico? Cada objetivo requiere un tipo de UGC diferente.',
            'Después, identifica el formato. Para ads de conversión directa, los videos de problema-solución y los testimoniales suelen funcionar mejor. Para awareness, los demos y el contenido de estilo de vida son más efectivos. Para landings, los reviews y las comparativas generan confianza.',
            'Finalmente, elige a tu creador o creadora UGC. Busca a alguien que entienda tu producto, tu audiencia y las plataformas donde vas a publicar. No necesitas un influencer con millones de seguidores — necesitas a alguien que se comunique con naturalidad y sepa estructurar contenido que convierta.',
            'Si quieres explorar qué tipo de UGC funcionaría mejor para tu marca, puedo ayudarte a diseñar un plan de contenido basado en tus objetivos específicos.',
          ],
        },
        {
          title: 'UGC en 2026: tendencias y evolución del formato',
          body: [
            'El UGC ha evolucionado mucho desde sus inicios como fotos espontáneas de clientes. Hoy es una industria profesional con creadores especializados, briefings estructurados y métricas claras de rendimiento.',
            'Las tendencias actuales incluyen: UGC bilingüe para marcas que venden en múltiples mercados, contenido vertical optimizado para TikTok y Reels, videos más cortos (15-30 segundos) con hooks cada vez más creativos, y el uso de UGC no solo en ads sino también en email marketing, landing pages y presentaciones de ventas.',
            'La inteligencia artificial está cambiando la producción, pero no reemplazando a los creadores. Las herramientas de IA ayudan en la edición y el análisis de rendimiento, pero la autenticidad —que es el corazón del UGC— sigue dependiendo de personas reales frente a cámara.',
            'Como creadora que ha trabajado con marcas de beauty, moda, tech y ecommerce, puedo decirte que la demanda de UGC profesional sigue creciendo. Las marcas que empiezan ahora tienen una ventaja competitiva real.',
          ],
        },
      ],
      faqs: [
        {
          question: '¿Cuál es la diferencia entre UGC y contenido de marca?',
          answer: 'El contenido de marca se produce con el equipo interno o una agencia y tiene un acabado corporativo. El UGC se ve como si una persona real estuviera recomendando el producto de forma natural, aunque esté producido profesionalmente bajo un brief. La diferencia está en la percepción del espectador.',
        },
        {
          question: '¿Necesito una creadora UGC si ya tengo clientes que publican sobre mi marca?',
          answer: 'El contenido orgánico de clientes es valioso, pero no puedes controlar su calidad, mensaje ni formato. Una creadora UGC profesional produce contenido que se ve orgánico pero tiene estructura comercial: hook, beneficio y CTA. Son complementarios.',
        },
        {
          question: '¿Cuántos videos UGC necesito para empezar a ver resultados?',
          answer: 'Depende de tu presupuesto de ads y cuántas variaciones quieras testear. Un buen punto de partida son 3-5 creativos por campaña, con variaciones de hook y CTA. Esto te permite identificar qué mensajes y formatos resuenan con tu audiencia.',
        },
        {
          question: '¿El UGC funciona para todas las industrias?',
          answer: 'Funciona especialmente bien en beauty, moda, tech, ecommerce y bienestar. Cualquier producto que pueda mostrarse en uso real se beneficia del UGC. Es menos efectivo para productos muy técnicos que requieren demostraciones especializadas.',
        },
        {
          question: '¿Cuánto cuesta producir contenido UGC profesional?',
          answer: 'El costo varía según el formato, la cantidad de videos y la complejidad del brief. Un paquete básico puede empezar desde unos cientos de dólares por video. Lo importante es verlo como inversión: un buen video UGC puede generar retorno durante meses en tus campañas.',
        },
        {
          question: '¿Puedo usar contenido UGC en todas las plataformas?',
          answer: 'Sí. El UGC funciona en TikTok, Instagram, Facebook, YouTube Shorts, landing pages, email marketing y más. Lo ideal es adaptar el formato y la duración a cada plataforma, pero la pieza base puede reutilizarse en múltiples canales.',
        },
      ],
      ctaTitle: '¿Lista para empezar con UGC?',
      ctaText: 'Cuéntame sobre tu marca y diseñamos juntas un plan de contenido UGC que funcione para tus objetivos.',
      relatedServiceIds: ['bilingual-ugc-creator', 'ugc-ads-tiktok-meta', 'ugc-testimonials-reviews'],
      relatedVerticalIds: ['ecommerce-ugc', 'beauty-ugc'],
    },
    en: {
      navLabel: 'What is UGC',
      metaTitle: 'What is UGC: Complete Guide to User-Generated Content | Gisela Saldarriaga',
      metaDescription:
        'UGC is content created by real people — not by brands — that builds trust, improves conversions and reduces production costs. Complete guide with examples.',
      breadcrumbLabel: 'What is UGC',
      heroEyebrow: 'Resource',
      heroTitle: 'What is UGC and why brands need it to sell more',
      heroSummary:
        'UGC (User-Generated Content) is content created by real people — not by the brand\'s internal team — used in ads, social media and landing pages to build trust and convert. In this guide I explain what it is, how it works and why it has become the centerpiece of the most effective paid media strategies.',
      heroPoints: [
        'Clear, straightforward definition of UGC',
        'Why it converts better than brand content',
        'How to start using UGC in your strategy',
      ],
      primaryCtaLabel: 'Discuss my project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'View portfolio',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sections: [
        {
          title: 'UGC defined: real content created by real people',
          body: [
            'UGC stands for User-Generated Content. At its most basic, it is any piece of content — video, photo, review, testimonial — created by someone who is not part of the brand\'s marketing team.',
            'The key is not who posts it, but how it is perceived. A UGC video feels like a recommendation between friends, not a corporate ad. That difference is exactly what makes it work.',
            'In my work as a UGC creator, I produce these pieces professionally: with proper lighting, structured scripts and clear creative direction, while maintaining the natural tone and organic aesthetic that makes viewers trust what they are seeing.',
          ],
        },
        {
          title: 'Types of UGC content that work today',
          body: [
            'UGC spans several formats, each with its place in the conversion funnel. The most common include: testimonial videos where someone shares their real experience with a product, product demos showing unboxing or step-by-step usage, native ads that look like organic content but have a sales structure, and lifestyle B-roll that contextualizes the product in everyday situations.',
            'Problem-solution videos are particularly effective: the creator identifies a pain point, presents the product as the answer and closes with a CTA. This format works because it replicates the conversation you would have with a friend recommending something.',
            'There are also spokesperson videos, where the creator speaks directly to camera representing the brand with an approachable yet professional tone. Unlike a commercial, it feels like a real person giving their honest opinion.',
          ],
        },
        {
          title: 'Why UGC converts better than traditional brand content',
          body: [
            'The numbers are clear: UGC-style ads generate up to 4x more clicks than traditional brand creatives, according to data from Meta and TikTok. The reason is psychological: we trust recommendations from people similar to us more than corporate messages.',
            'When someone sees a UGC video in their feed, they do not immediately identify it as advertising. That lowers their defenses and allows the message to land before the viewer decides to scroll. In paid social, those first 2-3 seconds are everything.',
            'UGC is also more cost-efficient. A single UGC production session can generate multiple creatives for different platforms and audiences, while traditional brand production usually delivers fewer pieces at a significantly higher cost.',
            'From my experience producing UGC for brands in the United States, Spain and Latin America, I have seen how a single well-structured video can outperform creatives that cost ten times more to produce.',
          ],
        },
        {
          title: 'Organic UGC vs paid UGC: which do you need',
          body: [
            'Organic UGC is content your customers create spontaneously: photos tagging your brand, Amazon reviews, unboxing videos. It is valuable, but you cannot control it. You cannot guarantee the quality, messaging or timing.',
            'Paid UGC — or professional UGC — is content produced by specialized creators working under a brand brief. It looks organic, feels real, but has commercial structure: hook, core benefit, CTA.',
            'Most brands that succeed with UGC use both: they leverage organic customer content for social proof, and produce professional UGC for their paid media campaigns. It is the most effective combination.',
          ],
        },
        {
          title: 'How to start using UGC in your marketing strategy',
          body: [
            'The first step is defining your objective. Do you want to reduce your ad CPA? Need content for landing pages that convert? Looking to fill your feed with content that feels authentic? Each goal requires a different type of UGC.',
            'Then, identify the format. For direct conversion ads, problem-solution videos and testimonials tend to work best. For awareness, demos and lifestyle content are more effective. For landing pages, reviews and comparisons build trust.',
            'Finally, choose your UGC creator. Look for someone who understands your product, your audience and the platforms where you will publish. You do not need an influencer with millions of followers — you need someone who communicates naturally and knows how to structure content that converts.',
            'If you want to explore what type of UGC would work best for your brand, I can help you design a content plan based on your specific goals.',
          ],
        },
        {
          title: 'UGC in 2026: trends and evolution of the format',
          body: [
            'UGC has evolved significantly from its beginnings as spontaneous customer photos. Today it is a professional industry with specialized creators, structured briefs and clear performance metrics.',
            'Current trends include: bilingual UGC for brands selling in multiple markets, vertical content optimized for TikTok and Reels, shorter videos (15-30 seconds) with increasingly creative hooks, and using UGC not just in ads but also in email marketing, landing pages and sales presentations.',
            'Artificial intelligence is changing production, but not replacing creators. AI tools help with editing and performance analysis, but authenticity — the heart of UGC — still depends on real people on camera.',
            'As a creator who has worked with brands in beauty, fashion, tech and ecommerce, I can tell you that demand for professional UGC continues to grow. Brands that start now have a real competitive advantage.',
          ],
        },
      ],
      faqs: [
        {
          question: 'What is the difference between UGC and brand content?',
          answer: 'Brand content is produced with an internal team or agency and has a corporate finish. UGC looks like a real person naturally recommending a product, even when professionally produced under a brief. The difference lies in viewer perception.',
        },
        {
          question: 'Do I need a UGC creator if customers already post about my brand?',
          answer: 'Organic customer content is valuable, but you cannot control its quality, messaging or format. A professional UGC creator produces content that looks organic but has commercial structure: hook, benefit and CTA. They are complementary.',
        },
        {
          question: 'How many UGC videos do I need to start seeing results?',
          answer: 'It depends on your ad budget and how many variations you want to test. A good starting point is 3-5 creatives per campaign, with hook and CTA variations. This lets you identify which messages and formats resonate with your audience.',
        },
        {
          question: 'Does UGC work for all industries?',
          answer: 'It works especially well in beauty, fashion, tech, ecommerce and wellness. Any product that can be shown in real use benefits from UGC. It is less effective for highly technical products requiring specialized demonstrations.',
        },
        {
          question: 'How much does professional UGC content cost?',
          answer: 'Cost varies by format, number of videos and brief complexity. A basic package can start from a few hundred dollars per video. The important thing is viewing it as an investment: a good UGC video can generate returns for months in your campaigns.',
        },
        {
          question: 'Can I use UGC content on all platforms?',
          answer: 'Yes. UGC works on TikTok, Instagram, Facebook, YouTube Shorts, landing pages, email marketing and more. Ideally you adapt the format and duration for each platform, but the base piece can be repurposed across multiple channels.',
        },
      ],
      ctaTitle: 'Ready to start with UGC?',
      ctaText: 'Tell me about your brand and we will design a UGC content plan that works for your goals.',
      relatedServiceIds: ['bilingual-ugc-creator', 'ugc-ads-tiktok-meta', 'ugc-testimonials-reviews'],
      relatedVerticalIds: ['ecommerce-ugc', 'beauty-ugc'],
    },
  },

  /* ═══════════════════════════════════════════════════════════════
     2. CÓMO CONTRATAR CREADORA UGC / HOW TO HIRE UGC CREATOR
     ═══════════════════════════════════════════════════════════════ */
  'how-to-hire-ugc-creator': {
    es: {
      navLabel: 'Cómo contratar creadora UGC',
      metaTitle: 'Cómo contratar una creadora UGC: guía paso a paso | Gisela Saldarriaga',
      metaDescription:
        'Aprende a contratar una creadora UGC profesional: qué buscar, qué preguntar, cómo evaluar portafolios y qué esperar del proceso de trabajo. Guía práctica.',
      breadcrumbLabel: 'Cómo contratar creadora UGC',
      heroEyebrow: 'Recurso',
      heroTitle: 'Cómo contratar una creadora UGC que realmente funcione para tu marca',
      heroSummary:
        'Contratar una creadora UGC no es lo mismo que contratar una influencer o una productora de video. Necesitas a alguien que entienda paid media, sepa estructurar contenido que convierta y pueda representar tu marca con naturalidad. En esta guía te explico paso a paso cómo encontrar, evaluar y trabajar con la creadora correcta.',
      heroPoints: [
        'Qué buscar en una creadora UGC profesional',
        'Cómo evaluar portafolios y experiencia',
        'El proceso de trabajo desde el brief hasta la entrega',
      ],
      primaryCtaLabel: 'Hablar de mi proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver portafolio',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sections: [
        {
          title: 'Lo primero: define qué necesitas antes de buscar',
          body: [
            'Antes de salir a buscar una creadora UGC, necesitas tener claro qué quieres lograr. ¿Estás buscando ads para TikTok y Meta? ¿Necesitas contenido para tu landing page? ¿Quieres testimoniales que generen confianza? La respuesta a estas preguntas determina el tipo de creadora que necesitas.',
            'No todas las creadoras UGC hacen lo mismo. Algunas se especializan en ads directos a cámara, otras en demos de producto, otras en contenido de estilo de vida. Algunas trabajan con beauty, otras con tech, otras con ecommerce. Definir tu necesidad te ahorra tiempo y dinero.',
            'En mi caso, trabajo con marcas que necesitan contenido bilingüe (español e inglés) para múltiples formatos: desde ads tipo problema-solución hasta demos, testimoniales y videos de portavoz. Pero eso es porque mi perfil encaja con esas necesidades. Otra creadora puede ser mejor para otro tipo de proyecto.',
          ],
        },
        {
          title: 'Dónde encontrar creadoras UGC profesionales',
          body: [
            `Hay varias formas de encontrar creadoras UGC. Las plataformas especializadas como Billo, Insense o JoinBrands conectan marcas con creadores, pero la calidad varía mucho. Fiverr es un canal directo con reseñas verificadas. Gisela Saldarriaga está ahí como [gisela_sm](${FIVERR_PROFILE_URL}) (4.8/5, 173 reseñas). También puedes buscar en TikTok e Instagram usando hashtags como #ugccreator o #ugcenespanol.`,
            'Otra opción es buscar directamente en Google. Una creadora que tiene su propio sitio web con portafolio, testimonios de clientes y una propuesta de valor clara suele ser más profesional que alguien que solo tiene un perfil en redes.',
            'Las agencias UGC también son una opción, especialmente si necesitas volumen. Sin embargo, suelen ser más caras y el nivel de personalización es menor. Para marcas que quieren una relación directa y un tono muy específico, trabajar directo con la creadora suele funcionar mejor.',
            'Preguntar a otros marketers también funciona. El UGC es una comunidad relativamente pequeña y las buenas recomendaciones circulan.',
          ],
        },
        {
          title: 'Qué evaluar en el portafolio de una creadora UGC',
          body: [
            'El portafolio es lo más importante. No busques solo videos "bonitos" — busca contenido que parezca real, que tenga estructura comercial y que demuestre versatilidad. Una buena creadora puede adaptar su tono a diferentes marcas sin perder naturalidad.',
            'Fíjate en estos aspectos: calidad de audio (es tan importante como el video), iluminación natural y consistente, capacidad de hablar a cámara con confianza, variedad de formatos (ads, demos, testimoniales) y la capacidad de mantener la atención en los primeros segundos del video.',
            'También evalúa si la creadora tiene experiencia en tu vertical. No es obligatorio, pero alguien que ya ha trabajado con productos similares al tuyo entiende mejor los pain points de tu audiencia y puede crear contenido más relevante desde el primer video.',
            'Algo que muchas marcas pasan por alto: revisa si la creadora entiende de performance marketing. El UGC no es solo "hacer videos bonitos" — es crear piezas que funcionen dentro de una campaña de ads. Una creadora que entiende hooks, CTAs y estructuras de conversión va a darte mejores resultados.',
          ],
        },
        {
          title: 'El brief: cómo comunicar lo que necesitas',
          body: [
            'Un buen brief es la diferencia entre contenido que funciona y contenido que necesitas rehacer. No tiene que ser un documento de veinte páginas — pero sí necesita cubrir estos puntos: producto o servicio, audiencia objetivo, plataforma de destino, tono deseado, mensajes clave y CTA.',
            'Incluye ejemplos de contenido que te gusta y contenido que definitivamente no quieres. Esto le da a la creadora un marco visual y de tono que vale más que mil palabras de descripción.',
            'Cuando trabajo con marcas, siempre pido ver sus ads existentes (aunque no estén funcionando), su landing page y al menos una pieza de la competencia que les parezca buena. Eso me da contexto suficiente para proponer ángulos creativos que están alineados con la marca.',
            'Un error común es micro-gestionar el guión. Si contratas a una creadora profesional, déjala proponer su estructura. Ella conoce los formatos que funcionan en cada plataforma. Tú aportas el conocimiento del producto y del cliente; ella aporta la ejecución creativa.',
          ],
        },
        {
          title: 'Presupuesto y estructura de trabajo',
          body: [
            'Los precios de UGC varían mucho dependiendo de la experiencia de la creadora, la complejidad del brief y el volumen de contenido. Generalmente, los paquetes son más económicos que contratar video por video. Un paquete típico puede incluir 3-5 videos con variaciones de hook.',
            'Algunas creadoras cobran por video, otras por paquete mensual, y otras por proyecto. Pregunta siempre qué incluye: ¿cuántas revisiones? ¿formatos verticales y horizontales? ¿versiones cortas para Stories? ¿derechos de uso en paid media?',
            'Los derechos de uso son un tema importante. Asegúrate de que el acuerdo incluya licencia para usar el contenido en ads pagos. Algunas creadoras cobran extra por esto; otras lo incluyen en su tarifa base.',
            'Mi recomendación: empieza con un proyecto pequeño de prueba (2-3 videos) antes de comprometerte con un paquete grande. Así puedes evaluar la calidad, la comunicación y el fit con tu marca sin arriesgar un presupuesto alto.',
          ],
        },
        {
          title: 'Señales de alerta: cuándo NO contratar a alguien',
          body: [
            'No contrates a una creadora que no tenga portafolio. Si no puede mostrarte trabajo previo, no hay forma de evaluar su nivel. Tampoco contrates a alguien que promete resultados de ventas — la creadora produce contenido, pero los resultados dependen de tu estrategia de ads, tu producto y tu funnel.',
            'Evita a quien no hace preguntas sobre tu marca antes de aceptar el proyecto. Una buena creadora quiere entender tu negocio, tu audiencia y tus objetivos. Si acepta el trabajo sin preguntar nada, probablemente esté produciendo contenido genérico.',
            'Desconfía de tiempos de entrega irrealistas. Un video UGC bien hecho requiere preparación, grabación y edición. Si alguien te promete diez videos en dos días, la calidad va a sufrir.',
            'Finalmente, pon atención a la comunicación. Si la creadora no responde mensajes en tiempos razonables durante la negociación, probablemente la comunicación no va a mejorar durante el proyecto.',
          ],
        },
        {
          title: 'Un perfil que puedes evaluar ahora',
          body: [
            `Gisela Saldarriaga es creadora UGC bilingüe. Produce desde Medellín anuncios para TikTok y Meta, demos, reseñas y videos de portavoz en español e inglés para marcas en el mercado hispano de Estados Unidos, España y LatAm. Trabaja en Fiverr como [gisela_sm](${FIVERR_PROFILE_URL}): 4.8/5 en 173 reseñas verificadas. Lleva 28+ campañas de marca. El contenido se entrega a la marca; no lo publica en sus redes salvo un acuerdo de ambassador.`,
            `[Creadora UGC bilingüe](${getServicePath('bilingual-ugc-creator', 'es')})`,
          ],
        },
      ],
      faqs: [
        {
          question: '¿Qué diferencia hay entre una creadora UGC y una influencer?',
          answer: 'Una influencer cobra por publicar en sus propias redes y tiene audiencia propia. Una creadora UGC produce contenido para que la marca lo use en sus canales y ads. La creadora UGC no necesita tener seguidores — lo que importa es su habilidad para crear contenido que convierta.',
        },
        {
          question: '¿Cuánto tiempo toma recibir los videos desde que envío el brief?',
          answer: 'Generalmente entre 5 y 10 días hábiles, dependiendo de la complejidad. Esto incluye revisión del brief, propuesta creativa, grabación, edición y una ronda de revisiones. Proyectos urgentes pueden negociarse, pero con costo adicional.',
        },
        {
          question: '¿Puedo pedir cambios después de recibir los videos?',
          answer: 'Sí. La mayoría de creadoras profesionales incluyen al menos una ronda de revisiones en su tarifa. Cambios menores como ajustar un texto o un CTA suelen ser rápidos. Cambios mayores que requieran regrabar pueden tener costo adicional.',
        },
        {
          question: '¿Es mejor trabajar con una creadora local o remota?',
          answer: 'El UGC se produce de forma remota en la gran mayoría de los casos. La creadora graba desde su propio espacio con su setup. Lo importante es la calidad del equipo y la habilidad frente a cámara, no la ubicación. Esto te permite trabajar con la mejor creadora para tu marca, sin importar dónde esté.',
        },
        {
          question: '¿Necesito enviar mi producto a la creadora?',
          answer: 'Depende del tipo de contenido. Para demos y reviews donde se muestra el producto en uso, sí. Para ads tipo portavoz o problema-solución donde se habla del producto sin mostrarlo físicamente, generalmente no es necesario.',
        },
      ],
      ctaTitle: '¿Buscas una creadora UGC?',
      ctaText: 'Cuéntame qué necesitas y te ayudo a definir si mi perfil es el indicado para tu proyecto.',
      relatedServiceIds: ['bilingual-ugc-creator', 'spokesperson-videos', 'ugc-product-demo'],
      relatedVerticalIds: ['beauty-ugc', 'ecommerce-ugc', 'tech-saas-ugc'],
    },
    en: {
      navLabel: 'How to hire a UGC creator',
      metaTitle: 'How to Hire a UGC Creator: Step-by-Step Guide | Gisela Saldarriaga',
      metaDescription:
        'Learn how to hire a professional UGC creator: what to look for, what to ask, how to evaluate portfolios and what to expect from the process. Practical guide.',
      breadcrumbLabel: 'How to hire a UGC creator',
      heroEyebrow: 'Resource',
      heroTitle: 'How to hire a UGC creator that actually works for your brand',
      heroSummary:
        'Hiring a UGC creator is not the same as hiring an influencer or a video production house. You need someone who understands paid media, knows how to structure content that converts and can represent your brand naturally. In this guide I walk you through how to find, evaluate and work with the right creator step by step.',
      heroPoints: [
        'What to look for in a professional UGC creator',
        'How to evaluate portfolios and experience',
        'The workflow from brief to delivery',
      ],
      primaryCtaLabel: 'Discuss my project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'View portfolio',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sections: [
        {
          title: 'First things first: define what you need before searching',
          body: [
            'Before you start looking for a UGC creator, you need to be clear about what you want to achieve. Are you looking for TikTok and Meta ads? Need content for your landing page? Want testimonials that build trust? The answer to these questions determines the type of creator you need.',
            'Not all UGC creators do the same thing. Some specialize in direct-to-camera ads, others in product demos, others in lifestyle content. Some work with beauty, others with tech, others with ecommerce. Defining your need saves you time and money.',
            'In my case, I work with brands that need bilingual content (Spanish and English) across multiple formats: from problem-solution ads to demos, testimonials and spokesperson videos. But that is because my profile fits those needs. Another creator may be better for a different type of project.',
          ],
        },
        {
          title: 'Where to find professional UGC creators',
          body: [
            `There are several ways to find UGC creators. Specialized platforms like Billo, Insense or JoinBrands connect brands with creators, but quality varies widely. Fiverr is a direct channel with verified reviews. Gisela Saldarriaga is there as [gisela_sm](${FIVERR_PROFILE_URL}) (4.8/5, 173 reviews). You can also search on TikTok and Instagram using hashtags like #ugccreator or #ugclatina.`,
            'Another option is searching directly on Google. A creator who has their own website with a portfolio, client testimonials and a clear value proposition tends to be more professional than someone who only has a social media profile.',
            'UGC agencies are also an option, especially if you need volume. However, they tend to be more expensive and offer less personalization. For brands that want a direct relationship and a very specific tone, working directly with the creator usually works better.',
            'Asking other marketers also works. UGC is a relatively small community and good recommendations circulate.',
          ],
        },
        {
          title: 'What to evaluate in a UGC creator\'s portfolio',
          body: [
            'The portfolio is the most important thing. Do not just look for "pretty" videos — look for content that feels real, has commercial structure and demonstrates versatility. A good creator can adapt their tone to different brands without losing naturalness.',
            'Pay attention to these aspects: audio quality (it is as important as video), natural and consistent lighting, confidence speaking to camera, variety of formats (ads, demos, testimonials) and the ability to hold attention in the first few seconds of the video.',
            'Also evaluate whether the creator has experience in your vertical. It is not mandatory, but someone who has already worked with products similar to yours understands your audience\'s pain points better and can create more relevant content from the first video.',
            'Something many brands overlook: check whether the creator understands performance marketing. UGC is not just "making pretty videos" — it is creating pieces that work within an ad campaign. A creator who understands hooks, CTAs and conversion structures will give you better results.',
          ],
        },
        {
          title: 'The brief: how to communicate what you need',
          body: [
            'A good brief is the difference between content that works and content you need to redo. It does not have to be a twenty-page document — but it does need to cover these points: product or service, target audience, destination platform, desired tone, key messages and CTA.',
            'Include examples of content you like and content you definitely do not want. This gives the creator a visual and tonal framework worth more than a thousand words of description.',
            'When I work with brands, I always ask to see their existing ads (even if they are not performing), their landing page and at least one competitor piece they consider good. That gives me enough context to propose creative angles aligned with the brand.',
            'A common mistake is micro-managing the script. If you hire a professional creator, let her propose the structure. She knows which formats work on each platform. You bring the product and customer knowledge; she brings the creative execution.',
          ],
        },
        {
          title: 'Budget and work structure',
          body: [
            'UGC pricing varies widely depending on the creator\'s experience, brief complexity and content volume. Generally, packages are more cost-effective than hiring video by video. A typical package might include 3-5 videos with hook variations.',
            'Some creators charge per video, others monthly, and others per project. Always ask what is included: how many revisions? Vertical and horizontal formats? Short versions for Stories? Usage rights for paid media?',
            'Usage rights are an important topic. Make sure the agreement includes a license to use the content in paid ads. Some creators charge extra for this; others include it in their base rate.',
            'My recommendation: start with a small test project (2-3 videos) before committing to a large package. This lets you evaluate quality, communication and brand fit without risking a large budget.',
          ],
        },
        {
          title: 'Red flags: when NOT to hire someone',
          body: [
            'Do not hire a creator who has no portfolio. If they cannot show you previous work, there is no way to evaluate their level. Also do not hire someone who promises sales results — the creator produces content, but results depend on your ad strategy, product and funnel.',
            'Avoid anyone who does not ask questions about your brand before accepting the project. A good creator wants to understand your business, audience and goals. If they accept the work without asking anything, they are probably producing generic content.',
            'Be wary of unrealistic delivery timelines. A well-made UGC video requires preparation, filming and editing. If someone promises ten videos in two days, quality will suffer.',
            'Finally, pay attention to communication. If the creator does not respond to messages in reasonable timeframes during negotiation, communication is unlikely to improve during the project.',
          ],
        },
        {
          title: 'A profile you can evaluate now',
          body: [
            `Gisela Saldarriaga is a bilingual UGC creator. She produces TikTok and Meta ads, demos, reviews, and spokesperson videos from Medellín, in Spanish and English, for US Hispanic, Spain, and LatAm brands. She works on Fiverr as [gisela_sm](${FIVERR_PROFILE_URL}): 4.8/5 from 173 verified reviews. 28+ brand campaigns. Content is delivered to the brand; she does not post client work unless it is an ambassador deal.`,
            `[Bilingual UGC creator](${getServicePath('bilingual-ugc-creator', 'en')})`,
          ],
        },
      ],
      faqs: [
        {
          question: 'What is the difference between a UGC creator and an influencer?',
          answer: 'An influencer is paid to post on their own channels and has their own audience. A UGC creator produces content for the brand to use on its channels and ads. A UGC creator does not need followers — what matters is their ability to create content that converts.',
        },
        {
          question: 'How long does it take to receive videos after sending the brief?',
          answer: 'Generally between 5 and 10 business days, depending on complexity. This includes brief review, creative proposal, filming, editing and one round of revisions. Rush projects can be negotiated, but at additional cost.',
        },
        {
          question: 'Can I request changes after receiving the videos?',
          answer: 'Yes. Most professional creators include at least one round of revisions in their rate. Minor changes like adjusting text or a CTA are usually quick. Major changes requiring reshooting may carry additional cost.',
        },
        {
          question: 'Is it better to work with a local or remote creator?',
          answer: 'UGC is produced remotely in the vast majority of cases. The creator films from their own space with their setup. What matters is equipment quality and on-camera ability, not location. This allows you to work with the best creator for your brand, regardless of where they are.',
        },
        {
          question: 'Do I need to ship my product to the creator?',
          answer: 'It depends on the content type. For demos and reviews showing the product in use, yes. For spokesperson-style ads or problem-solution videos where the product is discussed without physically showing it, it is generally not necessary.',
        },
      ],
      ctaTitle: 'Looking for a UGC creator?',
      ctaText: 'Tell me what you need and I will help you determine if my profile is the right fit for your project.',
      relatedServiceIds: ['bilingual-ugc-creator', 'spokesperson-videos', 'ugc-product-demo'],
      relatedVerticalIds: ['beauty-ugc', 'ecommerce-ugc', 'tech-saas-ugc'],
    },
  },

  /* ═══════════════════════════════════════════════════════════════
     3. UGC VS INFLUENCER MARKETING
     ═══════════════════════════════════════════════════════════════ */
  'ugc-vs-influencer-marketing': {
    es: {
      navLabel: 'UGC vs influencer marketing',
      metaTitle: 'UGC vs influencer marketing: diferencias, ventajas y cuándo usar cada uno | Gisela Saldarriaga',
      metaDescription:
        'UGC e influencer marketing no son lo mismo. Compara costos, control creativo, escalabilidad y resultados para decidir cuál necesita tu marca.',
      breadcrumbLabel: 'UGC vs influencer marketing',
      heroEyebrow: 'Recurso',
      heroTitle: 'UGC vs influencer marketing: diferencias clave y cuándo usar cada estrategia',
      heroSummary:
        'UGC e influencer marketing sirven para cosas distintas, cuestan diferente y se miden de formas diferentes. No es que uno sea mejor que el otro — es que cada uno tiene su lugar en la estrategia. En esta guía comparo ambos en detalle para que puedas decidir qué necesita tu marca ahora mismo.',
      heroPoints: [
        'Comparación directa con tabla de diferencias',
        'Ventajas y limitaciones de cada modelo',
        'Cuándo combinar ambas estrategias',
      ],
      primaryCtaLabel: 'Hablar de mi proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver portafolio',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sections: [
        {
          title: 'La diferencia fundamental: propiedad vs alcance',
          body: [
            'La diferencia más importante entre UGC e influencer marketing es quién controla el contenido y dónde se publica. Con UGC, la marca es dueña del contenido: lo usa en sus ads, su landing, su email marketing. Con influencer marketing, pagas para que alguien publique en SUS redes y llegue a SU audiencia.',
            'Esta diferencia cambia todo: el costo, la escalabilidad, el control creativo y cómo mides resultados. No son estrategias competidoras — son herramientas diferentes para momentos diferentes del funnel.',
            'En mi trabajo como creadora UGC, produzco contenido que la marca usa en sus canales propios. No necesito tener millones de seguidores porque mi valor no está en mi audiencia — está en mi capacidad de crear videos que parezcan reales, tengan estructura comercial y funcionen en ads pagos.',
          ],
        },
        {
          title: 'Control creativo y consistencia de marca',
          body: [
            'Con UGC, la marca tiene control total. Defines el brief, apruebas el guión, pides revisiones. El resultado es contenido que se alinea perfectamente con tu mensaje y tu tono, pero se siente orgánico.',
            'Con influencers, el control es menor. Cada influencer tiene su estilo, su tono y sus propias opiniones sobre cómo presentar un producto. Algunos aceptan briefs detallados, pero muchos quieren mantener su voz auténtica — y eso a veces choca con lo que la marca necesita.',
            'La consistencia también es diferente. Una creadora UGC puede producir 10 videos con el mismo tono y estilo para diferentes productos de tu catálogo. Con 10 influencers diferentes, vas a tener 10 estilos diferentes. Eso puede ser bueno para awareness, pero complicado para consistencia de marca.',
          ],
        },
        {
          title: 'Costos: inversión real vs percepción',
          body: [
            'El costo de una campaña de influencer marketing depende del tamaño de la audiencia. Un micro-influencer (10-50k seguidores) puede cobrar entre $200-$1,000 por post. Un macro-influencer, entre $5,000-$50,000. Y un celebrity, mucho más.',
            'El UGC profesional generalmente cuesta entre $150-$500 por video, dependiendo de la complejidad y la creadora. Pero aquí viene lo clave: ese video puedes usarlo en ads pagos durante meses, optimizarlo, hacer variaciones de hook y CTA, y escalarlo a diferentes plataformas y audiencias.',
            'Un post de influencer, en cambio, tiene una vida útil limitada: el alcance orgánico dura unos días y después desaparece del feed. Para mantener resultados necesitas seguir pagando por nuevos posts.',
            'Dicho esto, el influencer marketing puede ser más eficiente cuando tu objetivo principal es awareness en un nicho específico. Si un influencer tiene exactamente la audiencia que buscas, ese acceso directo tiene valor.',
          ],
        },
        {
          title: 'Escalabilidad y testing',
          body: [
            'Una de las mayores ventajas del UGC es la facilidad para hacer testing. Puedes producir 5 variaciones de un mismo anuncio con diferentes hooks, CTAs y ángulos creativos, y dejar que la plataforma de ads determine cuál funciona mejor.',
            'Con influencer marketing, el testing es mucho más difícil. No puedes pedirle a un influencer que publique 5 versiones del mismo contenido. Y si un post no funciona, ya gastaste ese presupuesto.',
            'La escalabilidad también es diferente. Si un video UGC funciona bien en tus ads, puedes aumentar el presupuesto y llegar a más personas sin producir nuevo contenido. Con un post de influencer, el alcance está limitado a la audiencia de esa persona.',
            'Las marcas que tienen los mejores resultados en paid social suelen usar UGC como su motor de creativos: producen volumen, testean rápido y escalan lo que funciona.',
          ],
        },
        {
          title: 'Cuándo usar UGC y cuándo influencer marketing',
          body: [
            'Usa UGC cuando tu objetivo principal es conversión directa: bajar CPA en tus ads, mejorar la tasa de conversión de tu landing, o generar confianza en el punto de decisión de compra. El UGC funciona mejor en la parte baja del funnel.',
            'Usa influencer marketing cuando necesitas awareness rápido en un nicho específico. Si quieres que la comunidad de running sepa que tu marca existe, colaborar con un influencer de running que ya tiene esa audiencia es más directo que construirla desde cero con ads.',
            'La mejor estrategia suele combinar ambas: influencer marketing para generar awareness y social proof ("mira, X usa este producto"), y UGC para convertir ese awareness en ventas con ads optimizados.',
            'Desde mi perspectiva como creadora, muchas marcas que vienen a mí ya probaron influencer marketing y obtuvieron likes y comentarios, pero no ventas. Buscan UGC porque necesitan contenido que convierta, no solo que se vea.',
          ],
        },
        {
          title: 'El modelo híbrido: lo mejor de ambos mundos',
          body: [
            'Algunas marcas están usando un modelo híbrido que combina lo mejor de ambas estrategias. Trabajan con creadores UGC para producir el contenido y luego lo amplifican a través de whitelisting con cuentas de influencers — es decir, publican el UGC como ad a través de la cuenta del influencer.',
            'Otra variante es producir UGC profesional y complementarlo con contenido orgánico de micro-influencers. El UGC se usa en ads pagos, y el contenido de influencers sirve como social proof orgánico que refuerza la credibilidad.',
            'Si tu presupuesto es limitado, mi recomendación es empezar con UGC para tus ads y usar el presupuesto de influencers solo cuando ya tengas datos claros sobre qué mensajes y formatos funcionan. Así puedes briefear a los influencers con información real en lugar de suposiciones.',
          ],
        },
      ],
      comparisonTable: {
        headers: ['Aspecto', 'UGC', 'Influencer Marketing'],
        rows: [
          ['Propiedad del contenido', 'La marca es dueña', 'El influencer controla'],
          ['Dónde se publica', 'Canales de la marca y paid ads', 'Redes del influencer'],
          ['Control creativo', 'Alto — brief, guión, revisiones', 'Variable — depende del acuerdo'],
          ['Costo por pieza', '$150–$500 por video', '$200–$50,000+ por post'],
          ['Vida útil', 'Meses (en ads pagos)', 'Días (alcance orgánico)'],
          ['Escalabilidad', 'Alta — puedes escalar presupuesto de ads', 'Baja — limitado a audiencia del influencer'],
          ['Testing A/B', 'Fácil — múltiples variaciones', 'Difícil — un post por colaboración'],
          ['Mejor para', 'Conversión directa, paid social', 'Awareness, credibilidad de nicho'],
          ['Seguidores necesarios', 'No — importa la habilidad', 'Sí — es el activo principal'],
          ['Métricas clave', 'CTR, CPA, ROAS', 'Alcance, impresiones, engagement'],
        ],
      },
      faqs: [
        {
          question: '¿Puedo reutilizar contenido de influencers en mis ads?',
          answer: 'Depende del acuerdo. Muchos influencers cobran extra por licencia de paid media (whitelisting). Con UGC, los derechos de uso en ads suelen estar incluidos en la tarifa porque ese es el propósito principal del contenido.',
        },
        {
          question: '¿El UGC reemplaza al influencer marketing?',
          answer: 'No. Son estrategias complementarias. El UGC es mejor para conversión en paid media, y el influencer marketing es mejor para awareness en nichos específicos. Las mejores marcas usan ambas.',
        },
        {
          question: '¿Qué pasa si un influencer hace mal review de mi producto?',
          answer: 'Es un riesgo del influencer marketing: no controlas 100% el mensaje. Con UGC profesional, apruebas el contenido antes de publicarlo. El riesgo de mensajes no alineados es prácticamente cero.',
        },
        {
          question: '¿Cómo sé si necesito UGC o influencer marketing?',
          answer: 'Si tu prioridad es bajar el CPA de tus ads y convertir, necesitas UGC. Si tu prioridad es que un nicho específico conozca tu marca, necesitas influencers. Si puedes hacer ambas, hazlo.',
        },
        {
          question: '¿Se puede hacer UGC con un influencer?',
          answer: 'Sí. Algunos influencers también ofrecen servicios de UGC: producen contenido que la marca usa en sus canales sin publicarlo en las redes del influencer. Es más barato que una colaboración tradicional y te da más control.',
        },
        {
          question: '¿Cuál da mejor ROI?',
          answer: 'Depende del objetivo. Para conversión directa en paid social, el UGC suele tener mejor ROI porque el costo por pieza es menor y puedes optimizar con testing. Para awareness, el influencer marketing puede dar mejor ROI si eliges al influencer correcto.',
        },
      ],
      ctaTitle: '¿Necesitas contenido que convierta?',
      ctaText: 'Hablemos de cómo el UGC puede ayudar a tu marca a vender más sin depender de influencers.',
      relatedServiceIds: ['ugc-ads-tiktok-meta', 'bilingual-ugc-creator', 'ugc-testimonials-reviews'],
      relatedVerticalIds: ['ecommerce-ugc', 'fashion-ugc', 'beauty-ugc'],
    },
    en: {
      navLabel: 'UGC vs influencer marketing',
      metaTitle: 'UGC vs Influencer Marketing: Differences, Benefits & When to Use Each | Gisela Saldarriaga',
      metaDescription:
        'UGC and influencer marketing are not the same. Compare costs, creative control, scalability and results to decide which your brand needs.',
      breadcrumbLabel: 'UGC vs influencer marketing',
      heroEyebrow: 'Resource',
      heroTitle: 'UGC vs influencer marketing: key differences and when to use each strategy',
      heroSummary:
        'UGC and influencer marketing serve different purposes, cost differently and are measured in different ways. It is not that one is better than the other — each has its place in the strategy. In this guide I compare both in detail so you can decide what your brand needs right now.',
      heroPoints: [
        'Direct comparison with differences table',
        'Advantages and limitations of each model',
        'When to combine both strategies',
      ],
      primaryCtaLabel: 'Discuss my project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'View portfolio',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sections: [
        {
          title: 'The fundamental difference: ownership vs reach',
          body: [
            'The most important difference between UGC and influencer marketing is who controls the content and where it is published. With UGC, the brand owns the content: it uses it in its ads, landing pages, email marketing. With influencer marketing, you pay for someone to post on THEIR channels and reach THEIR audience.',
            'This difference changes everything: cost, scalability, creative control and how you measure results. They are not competing strategies — they are different tools for different moments in the funnel.',
            'In my work as a UGC creator, I produce content that the brand uses on its own channels. I do not need millions of followers because my value is not in my audience — it is in my ability to create videos that look real, have commercial structure and work in paid ads.',
          ],
        },
        {
          title: 'Creative control and brand consistency',
          body: [
            'With UGC, the brand has full control. You define the brief, approve the script, request revisions. The result is content that aligns perfectly with your message and tone, but feels organic.',
            'With influencers, control is lower. Each influencer has their style, tone and own opinions about how to present a product. Some accept detailed briefs, but many want to maintain their authentic voice — and that sometimes clashes with what the brand needs.',
            'Consistency is also different. A UGC creator can produce 10 videos with the same tone and style for different products in your catalog. With 10 different influencers, you will have 10 different styles. That can be good for awareness, but complicated for brand consistency.',
          ],
        },
        {
          title: 'Costs: real investment vs perception',
          body: [
            'The cost of an influencer marketing campaign depends on audience size. A micro-influencer (10-50k followers) may charge between $200-$1,000 per post. A macro-influencer, between $5,000-$50,000. And a celebrity, much more.',
            'Professional UGC generally costs between $150-$500 per video, depending on complexity and the creator. But here is the key: you can use that video in paid ads for months, optimize it, create hook and CTA variations, and scale it across different platforms and audiences.',
            'An influencer post, on the other hand, has a limited shelf life: organic reach lasts a few days and then disappears from the feed. To maintain results you need to keep paying for new posts.',
            'That said, influencer marketing can be more efficient when your primary goal is awareness in a specific niche. If an influencer has exactly the audience you are looking for, that direct access has value.',
          ],
        },
        {
          title: 'Scalability and testing',
          body: [
            'One of the biggest advantages of UGC is the ease of testing. You can produce 5 variations of the same ad with different hooks, CTAs and creative angles, and let the ad platform determine which one performs best.',
            'With influencer marketing, testing is much harder. You cannot ask an influencer to publish 5 versions of the same content. And if a post does not perform, you have already spent that budget.',
            'Scalability is also different. If a UGC video performs well in your ads, you can increase budget and reach more people without producing new content. With an influencer post, reach is limited to that person\'s audience.',
            'Brands that get the best results on paid social tend to use UGC as their creative engine: produce volume, test quickly and scale what works.',
          ],
        },
        {
          title: 'When to use UGC and when influencer marketing',
          body: [
            'Use UGC when your primary goal is direct conversion: lowering CPA on your ads, improving landing page conversion rates, or building trust at the purchase decision point. UGC works best at the bottom of the funnel.',
            'Use influencer marketing when you need fast awareness in a specific niche. If you want the running community to know your brand exists, collaborating with a running influencer who already has that audience is more direct than building it from scratch with ads.',
            'The best strategy usually combines both: influencer marketing to generate awareness and social proof ("look, X uses this product"), and UGC to convert that awareness into sales with optimized ads.',
            'From my perspective as a creator, many brands that come to me have already tried influencer marketing and got likes and comments, but not sales. They look for UGC because they need content that converts, not just content that looks good.',
          ],
        },
        {
          title: 'The hybrid model: the best of both worlds',
          body: [
            'Some brands are using a hybrid model that combines the best of both strategies. They work with UGC creators to produce content and then amplify it through whitelisting with influencer accounts — meaning they publish the UGC as an ad through the influencer\'s account.',
            'Another variant is producing professional UGC and complementing it with organic micro-influencer content. The UGC is used in paid ads, and influencer content serves as organic social proof that reinforces credibility.',
            'If your budget is limited, my recommendation is to start with UGC for your ads and only use the influencer budget once you have clear data on which messages and formats work. That way you can brief influencers with real information instead of assumptions.',
          ],
        },
      ],
      comparisonTable: {
        headers: ['Aspect', 'UGC', 'Influencer Marketing'],
        rows: [
          ['Content ownership', 'Brand owns it', 'Influencer controls it'],
          ['Where it is published', 'Brand channels and paid ads', 'Influencer\'s social media'],
          ['Creative control', 'High — brief, script, revisions', 'Variable — depends on agreement'],
          ['Cost per piece', '$150–$500 per video', '$200–$50,000+ per post'],
          ['Shelf life', 'Months (in paid ads)', 'Days (organic reach)'],
          ['Scalability', 'High — scale ad budget', 'Low — limited to influencer\'s audience'],
          ['A/B testing', 'Easy — multiple variations', 'Difficult — one post per collaboration'],
          ['Best for', 'Direct conversion, paid social', 'Awareness, niche credibility'],
          ['Followers needed', 'No — skill matters', 'Yes — it is the main asset'],
          ['Key metrics', 'CTR, CPA, ROAS', 'Reach, impressions, engagement'],
        ],
      },
      faqs: [
        {
          question: 'Can I reuse influencer content in my ads?',
          answer: 'It depends on the agreement. Many influencers charge extra for paid media licensing (whitelisting). With UGC, usage rights for ads are usually included in the rate because that is the primary purpose of the content.',
        },
        {
          question: 'Does UGC replace influencer marketing?',
          answer: 'No. They are complementary strategies. UGC is better for conversion in paid media, and influencer marketing is better for awareness in specific niches. The best brands use both.',
        },
        {
          question: 'What happens if an influencer gives a bad review of my product?',
          answer: 'That is a risk of influencer marketing: you do not control the message 100%. With professional UGC, you approve the content before it is published. The risk of misaligned messaging is practically zero.',
        },
        {
          question: 'How do I know if I need UGC or influencer marketing?',
          answer: 'If your priority is lowering ad CPA and converting, you need UGC. If your priority is getting a specific niche to know your brand, you need influencers. If you can do both, do both.',
        },
        {
          question: 'Can an influencer also do UGC?',
          answer: 'Yes. Some influencers also offer UGC services: they produce content the brand uses on its own channels without posting on the influencer\'s social media. It is cheaper than a traditional collaboration and gives you more control.',
        },
        {
          question: 'Which gives better ROI?',
          answer: 'It depends on the goal. For direct conversion on paid social, UGC usually has better ROI because cost per piece is lower and you can optimize with testing. For awareness, influencer marketing can deliver better ROI if you choose the right influencer.',
        },
      ],
      ctaTitle: 'Need content that converts?',
      ctaText: 'Let us talk about how UGC can help your brand sell more without depending on influencers.',
      relatedServiceIds: ['ugc-ads-tiktok-meta', 'bilingual-ugc-creator', 'ugc-testimonials-reviews'],
      relatedVerticalIds: ['ecommerce-ugc', 'fashion-ugc', 'beauty-ugc'],
    },
  },

  /* ═══════════════════════════════════════════════════════════════
     4. FORMATOS UGC ADS / UGC AD FORMATS GUIDE
     ═══════════════════════════════════════════════════════════════ */
  'ugc-ad-formats-guide': {
    es: {
      navLabel: 'Formatos de UGC para ads',
      metaTitle: 'Formatos de UGC para ads: guía completa de creativos que convierten | Gisela Saldarriaga',
      metaDescription:
        'Los 7 formatos de UGC que mejor funcionan en TikTok Ads, Meta Ads y paid social. Estructura, duración y ejemplos de cada formato para mejorar tu ROAS.',
      breadcrumbLabel: 'Formatos UGC para ads',
      heroEyebrow: 'Recurso',
      heroTitle: 'Formatos de UGC para ads: los creativos que realmente convierten en paid social',
      heroSummary:
        'No todos los videos UGC funcionan igual en ads. El formato importa tanto como el mensaje: un testimonial no se estructura igual que un problema-solución, y un demo no tiene el mismo ritmo que un ad directo a cámara. En esta guía te explico los formatos que mejor rinden en TikTok Ads y Meta Ads, con la estructura de cada uno.',
      heroPoints: [
        'Los 7 formatos UGC más efectivos para paid social',
        'Estructura y duración óptima de cada formato',
        'Cuándo usar cada uno según tu objetivo',
      ],
      primaryCtaLabel: 'Hablar de mi proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver portafolio',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sections: [
        {
          title: 'Por qué el formato define el rendimiento de tus ads UGC',
          body: [
            'Un error común es pensar que cualquier video "con cara real" funciona como ad UGC. La realidad es que el formato determina en gran medida el rendimiento. Un video testimonial tiene una estructura psicológica diferente a un problema-solución, y cada formato activa mecanismos distintos de atención y conversión.',
            'Los primeros 2-3 segundos del video determinan si el espectador se queda o hace scroll. Por eso el hook es tan importante. Pero el hook ideal varía según el formato: en un testimonial funciona la emoción, en un demo funciona la curiosidad, en un problema-solución funciona el reconocimiento del dolor.',
            'Después de más de cientos de videos UGC producidos para marcas en múltiples verticales, he identificado patrones claros: ciertos formatos funcionan mejor para ciertos objetivos, ciertos productos y ciertas audiencias. En esta guía comparto esos patrones.',
          ],
        },
        {
          title: '1. Problema-solución: el formato rey de la conversión',
          body: [
            'Estructura: hook con el problema → agitación del dolor → presentación del producto como solución → prueba/demo → CTA. Duración ideal: 30-60 segundos.',
            'Este es probablemente el formato más efectivo para conversión directa. Funciona porque replica un patrón psicológico poderoso: primero haces que el espectador se identifique con un problema que ya tiene, luego le muestras que hay una solución.',
            'El hook suele empezar con frases como "Si te pasa esto..." o "Estaba cansada de..." que enganchan porque la persona se ve reflejada. La clave es que el problema sea real y específico — no genérico.',
            'Funciona especialmente bien para: skincare, productos de bienestar, apps, herramientas de productividad y cualquier producto que resuelva una frustración concreta.',
          ],
        },
        {
          title: '2. Testimonial: confianza que convierte',
          body: [
            'Estructura: contexto personal → descubrimiento del producto → experiencia de uso → resultado → CTA. Duración ideal: 30-45 segundos.',
            'El testimonial funciona porque activa la prueba social: si alguien como yo ya lo probó y le funcionó, probablemente me funcione a mí también. Es el formato más cercano a una recomendación personal.',
            'La clave es la autenticidad. No se trata de leer un guión que suene a comercial — se trata de contar una experiencia real (o que se perciba como real) con emoción genuina. Por eso es importante que la creadora conecte con el producto.',
            'Es el formato ideal cuando ya tienes tráfico y necesitas reducir la fricción en el punto de decisión de compra. También funciona muy bien como retargeting para personas que ya visitaron tu sitio pero no compraron.',
          ],
        },
        {
          title: '3. Demo de producto: muéstralo en acción',
          body: [
            'Estructura: hook visual → unboxing o setup → uso paso a paso → resultado visible → CTA. Duración ideal: 15-45 segundos.',
            'El demo es visual por naturaleza. El espectador quiere ver el producto en uso real, no en un render 3D ni en una foto de estudio. Un buen demo de UGC muestra el producto en un contexto cotidiano: en la cocina, en el escritorio, en la rutina de skincare.',
            'El hook visual es fundamental. Empieza mostrando el producto de una forma que genere curiosidad: el packaging, la textura, el primer uso. En TikTok, los hooks visuales superan a los hooks hablados en demos.',
            'Este formato funciona mejor para: productos físicos con aspecto visual atractivo, beauty, gadgets, comida y cualquier cosa que se beneficie de verse "en acción".',
          ],
        },
        {
          title: '4. Portavoz (spokesperson): la marca con cara humana',
          body: [
            'Estructura: saludo + posicionamiento → mensaje principal → beneficios clave → CTA. Duración ideal: 15-30 segundos.',
            'El video de portavoz es la creadora hablando directamente a cámara representando la marca. No es un testimonial (no habla de su experiencia personal) sino que presenta la propuesta de valor del producto de forma directa y cercana.',
            'Funciona bien para: lanzamientos de producto, ofertas especiales, explicaciones de servicio y cualquier mensaje que necesite una "cara" que humanice la marca. Es particularmente efectivo cuando la creadora tiene presencia fuerte frente a cámara.',
            'La clave es el tono: suficientemente profesional para representar la marca, pero suficientemente natural para no sonar a comercial de televisión. Ese balance es lo que hace que un video de portavoz UGC funcione.',
          ],
        },
        {
          title: '5. Listicle / "3 razones por las que...": formato de retención',
          body: [
            'Estructura: hook con promesa numérica → razón 1 → razón 2 → razón 3 → CTA. Duración ideal: 30-60 segundos.',
            'Los listicles funcionan porque el cerebro ama las listas. Cuando dices "3 razones por las que...", el espectador quiere ver las tres. Esa estructura crea un compromiso de atención que reduce la tasa de scroll.',
            'La primera razón debe ser la más fuerte o la más sorprendente. Si la razón 1 es débil, el espectador no llega a la 2. La última razón debe conectar directamente con el CTA.',
            'Este formato es versátil: funciona para awareness ("3 cosas que no sabías sobre..."), consideración ("3 razones para probar...") y conversión ("3 razones por las que cambié a...").',
          ],
        },
        {
          title: '6. Before/after: la prueba visual definitiva',
          body: [
            'Estructura: situación "antes" → transición → resultado "después" → reacción → CTA. Duración ideal: 15-30 segundos.',
            'El before/after es el formato más poderoso para productos con resultados visibles. Es difícil de ignorar porque nuestro cerebro está programado para detectar cambios y transformaciones.',
            'Funciona mejor cuando la diferencia es obvia y visual: skincare, limpieza, organización, diseño, fitness. No funciona tan bien para productos donde el beneficio es intangible (como software de productividad).',
            'Un tip importante: la transición debe ser limpia y rápida. No alargues el "antes" — el espectador quiere ver el "después" rápido. Y el "después" debe ser genuinamente impresionante.',
          ],
        },
        {
          title: '7. B-roll de estilo de vida: contexto sin hablar',
          body: [
            'Estructura: secuencia de clips mostrando el producto en uso cotidiano, con texto en pantalla o voz en off. Duración ideal: 10-20 segundos.',
            'El B-roll de estilo de vida es el formato más "orgánico" — parece contenido natural, no un anuncio. Se usa mucho como complemento de otros formatos o como creativos independientes para awareness.',
            'Funciona bien como parte de una estrategia de testing: mientras tus ads principales son testimoniales o problema-solución, los B-roll sirven como creativos frescos que mantienen la variedad en tu ad account.',
            'También es el formato más eficiente de producir: una sola sesión de grabación puede generar múltiples clips reutilizables que funcionan en diferentes campañas y plataformas.',
          ],
        },
        {
          title: 'Cómo elegir el formato correcto para tu campaña',
          body: [
            'La elección del formato depende de tres factores: tu objetivo (awareness, consideración o conversión), tu producto (visual vs intangible, nuevo vs conocido) y tu audiencia (fría vs caliente).',
            'Para audiencias frías que no conocen tu marca, los formatos de problema-solución y listicle funcionan mejor porque no requieren conocimiento previo. Para audiencias de retargeting que ya te visitaron, los testimoniales y los demos son más efectivos porque la persona ya sabe quién eres.',
            'Mi recomendación es no apostar todo a un solo formato. Produce 2-3 formatos diferentes y deja que los datos te digan cuál funciona mejor con tu audiencia específica. He visto marcas que estaban convencidas de que necesitaban testimoniales y resultó que los problema-solución les funcionaban tres veces mejor.',
            'Si quieres explorar qué formatos serían más efectivos para tu marca, puedo ayudarte a diseñar una estrategia de creativos basada en tus objetivos y tu vertical.',
          ],
        },
      ],
      comparisonTable: {
        headers: ['Formato', 'Mejor para', 'Duración', 'Nivel de dificultad'],
        rows: [
          ['Problema-solución', 'Conversión directa', '30-60s', 'Medio'],
          ['Testimonial', 'Confianza / retargeting', '30-45s', 'Medio'],
          ['Demo de producto', 'Productos visuales', '15-45s', 'Bajo-medio'],
          ['Portavoz', 'Lanzamientos / ofertas', '15-30s', 'Medio-alto'],
          ['Listicle', 'Retención / awareness', '30-60s', 'Bajo'],
          ['Before/after', 'Resultados visibles', '15-30s', 'Bajo'],
          ['B-roll lifestyle', 'Awareness / variedad', '10-20s', 'Bajo'],
        ],
      },
      faqs: [
        {
          question: '¿Cuál es el formato UGC que mejor convierte en TikTok Ads?',
          answer: 'En TikTok, los formatos problema-solución y listicle suelen tener mejor rendimiento porque aprovechan el estilo nativo de la plataforma. El hook es especialmente importante: necesitas enganchar en los primeros 1-2 segundos.',
        },
        {
          question: '¿Meta Ads y TikTok Ads necesitan formatos diferentes?',
          answer: 'No necesariamente formatos diferentes, pero sí ajustes. TikTok favorece un tono más casual y ritmo más rápido. Meta (Instagram/Facebook) permite videos un poco más largos y tonos más variados. La pieza base puede ser la misma con ajustes de edición.',
        },
        {
          question: '¿Cuántas variaciones de hook debería testear por formato?',
          answer: 'Un mínimo de 2-3 variaciones de hook por formato. El hook es el factor que más impacta en el rendimiento. El mismo video con tres hooks diferentes puede tener resultados completamente distintos.',
        },
        {
          question: '¿Puedo mezclar varios formatos en una misma campaña?',
          answer: 'Sí, y de hecho es lo recomendable. Tener 2-3 formatos diferentes en la misma campaña te da más data para optimizar y evita la fatiga creativa. Las plataformas también optimizan mejor con variedad de creativos.',
        },
        {
          question: '¿Cuál es la duración ideal para un video UGC de ads?',
          answer: 'Para TikTok, entre 15-30 segundos es el sweet spot. Para Meta, puedes ir hasta 60 segundos si el contenido lo justifica. La regla general: no alargues el video solo por rellenarlo. Si el mensaje se puede dar en 20 segundos, que sean 20 segundos.',
        },
        {
          question: '¿Necesito producir todos los formatos a la vez?',
          answer: 'No. Empieza con 2-3 formatos que se alineen con tu objetivo principal. Una vez tengas datos de rendimiento, puedes expandir a otros formatos basándote en lo que funciona. Producir todo a la vez sin datos previos suele ser un desperdicio de presupuesto.',
        },
      ],
      ctaTitle: '¿Lista para producir ads UGC que conviertan?',
      ctaText: 'Cuéntame sobre tu marca y definimos juntas los formatos que mejor van a funcionar para tu campaña.',
      relatedServiceIds: ['ugc-ads-tiktok-meta', 'ugc-problem-solution', 'spokesperson-videos', 'ugc-product-demo'],
      relatedVerticalIds: ['ecommerce-ugc', 'beauty-ugc', 'tech-saas-ugc'],
    },
    en: {
      navLabel: 'UGC ad formats guide',
      metaTitle: 'UGC Ad Formats: Complete Guide to Creatives That Convert | Gisela Saldarriaga',
      metaDescription:
        'The 7 UGC formats that perform best on TikTok Ads, Meta Ads and paid social. Structure, duration and examples for each format to improve your ROAS.',
      breadcrumbLabel: 'UGC ad formats guide',
      heroEyebrow: 'Resource',
      heroTitle: 'UGC ad formats: the creatives that actually convert on paid social',
      heroSummary:
        'Not all UGC videos perform equally in ads. Format matters as much as the message: a testimonial is not structured like a problem-solution, and a demo does not have the same pacing as a direct-to-camera ad. In this guide I break down the formats that perform best on TikTok Ads and Meta Ads, with the structure of each one.',
      heroPoints: [
        'The 7 most effective UGC formats for paid social',
        'Optimal structure and duration for each format',
        'When to use each one based on your objective',
      ],
      primaryCtaLabel: 'Discuss my project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'View portfolio',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sections: [
        {
          title: 'Why format defines your UGC ad performance',
          body: [
            'A common mistake is thinking that any video "with a real face" works as a UGC ad. The reality is that format largely determines performance. A testimonial video has a different psychological structure than a problem-solution, and each format activates distinct attention and conversion mechanisms.',
            'The first 2-3 seconds of the video determine whether the viewer stays or scrolls. That is why the hook is so important. But the ideal hook varies by format: in a testimonial, emotion works; in a demo, curiosity works; in a problem-solution, pain recognition works.',
            'After producing hundreds of UGC videos for brands across multiple verticals, I have identified clear patterns: certain formats work better for certain objectives, certain products and certain audiences. In this guide I share those patterns.',
          ],
        },
        {
          title: '1. Problem-solution: the conversion king',
          body: [
            'Structure: hook with the problem → pain agitation → product presented as solution → proof/demo → CTA. Ideal duration: 30-60 seconds.',
            'This is probably the most effective format for direct conversion. It works because it replicates a powerful psychological pattern: first you make the viewer identify with a problem they already have, then you show them there is a solution.',
            'The hook usually starts with phrases like "If this happens to you..." or "I was tired of..." that hook because the person sees themselves reflected. The key is that the problem must be real and specific — not generic.',
            'Works especially well for: skincare, wellness products, apps, productivity tools and any product that solves a concrete frustration.',
          ],
        },
        {
          title: '2. Testimonial: trust that converts',
          body: [
            'Structure: personal context → product discovery → usage experience → result → CTA. Ideal duration: 30-45 seconds.',
            'The testimonial works because it activates social proof: if someone like me already tried it and it worked, it will probably work for me too. It is the format closest to a personal recommendation.',
            'The key is authenticity. It is not about reading a script that sounds like a commercial — it is about telling a real experience (or one perceived as real) with genuine emotion. That is why it is important for the creator to connect with the product.',
            'It is the ideal format when you already have traffic and need to reduce friction at the purchase decision point. It also works very well as retargeting for people who visited your site but did not buy.',
          ],
        },
        {
          title: '3. Product demo: show it in action',
          body: [
            'Structure: visual hook → unboxing or setup → step-by-step usage → visible result → CTA. Ideal duration: 15-45 seconds.',
            'The demo is visual by nature. The viewer wants to see the product in real use, not in a 3D render or studio photo. A good UGC demo shows the product in an everyday context: in the kitchen, on the desk, in the skincare routine.',
            'The visual hook is critical. Start by showing the product in a way that generates curiosity: the packaging, the texture, first use. On TikTok, visual hooks outperform spoken hooks in demos.',
            'This format works best for: physical products with visual appeal, beauty, gadgets, food and anything that benefits from being seen "in action."',
          ],
        },
        {
          title: '4. Spokesperson: the brand with a human face',
          body: [
            'Structure: greeting + positioning → main message → key benefits → CTA. Ideal duration: 15-30 seconds.',
            'The spokesperson video is the creator speaking directly to camera representing the brand. It is not a testimonial (she is not talking about her personal experience) but rather presenting the product\'s value proposition directly and approachably.',
            'Works well for: product launches, special offers, service explanations and any message that needs a "face" to humanize the brand. It is particularly effective when the creator has strong on-camera presence.',
            'The key is tone: professional enough to represent the brand, but natural enough not to sound like a TV commercial. That balance is what makes a UGC spokesperson video work.',
          ],
        },
        {
          title: '5. Listicle / "3 reasons why...": the retention format',
          body: [
            'Structure: hook with numerical promise → reason 1 → reason 2 → reason 3 → CTA. Ideal duration: 30-60 seconds.',
            'Listicles work because the brain loves lists. When you say "3 reasons why...", the viewer wants to see all three. That structure creates an attention commitment that reduces the scroll rate.',
            'The first reason should be the strongest or most surprising. If reason 1 is weak, the viewer will not reach reason 2. The last reason should connect directly with the CTA.',
            'This format is versatile: works for awareness ("3 things you didn\'t know about..."), consideration ("3 reasons to try...") and conversion ("3 reasons I switched to...").',
          ],
        },
        {
          title: '6. Before/after: the ultimate visual proof',
          body: [
            'Structure: "before" situation → transition → "after" result → reaction → CTA. Ideal duration: 15-30 seconds.',
            'The before/after is the most powerful format for products with visible results. It is hard to ignore because our brains are wired to detect changes and transformations.',
            'Works best when the difference is obvious and visual: skincare, cleaning, organization, design, fitness. It does not work as well for products where the benefit is intangible (like productivity software).',
            'An important tip: the transition should be clean and fast. Do not extend the "before" — the viewer wants to see the "after" quickly. And the "after" must be genuinely impressive.',
          ],
        },
        {
          title: '7. Lifestyle B-roll: context without speaking',
          body: [
            'Structure: sequence of clips showing the product in everyday use, with on-screen text or voiceover. Ideal duration: 10-20 seconds.',
            'Lifestyle B-roll is the most "organic" format — it looks like natural content, not an ad. It is used frequently as a complement to other formats or as standalone creatives for awareness.',
            'Works well as part of a testing strategy: while your main ads are testimonials or problem-solution, B-roll serves as fresh creatives that maintain variety in your ad account.',
            'It is also the most efficient format to produce: a single filming session can generate multiple reusable clips that work across different campaigns and platforms.',
          ],
        },
        {
          title: 'How to choose the right format for your campaign',
          body: [
            'Choosing the right format depends on three factors: your objective (awareness, consideration or conversion), your product (visual vs intangible, new vs established) and your audience (cold vs warm).',
            'For cold audiences who do not know your brand, problem-solution and listicle formats work best because they do not require prior knowledge. For retargeting audiences who already visited you, testimonials and demos are more effective because the person already knows who you are.',
            'My recommendation is not to bet everything on a single format. Produce 2-3 different formats and let the data tell you which works best with your specific audience. I have seen brands convinced they needed testimonials only to find that problem-solution performed three times better.',
            'If you want to explore which formats would be most effective for your brand, I can help you design a creative strategy based on your goals and vertical.',
          ],
        },
      ],
      comparisonTable: {
        headers: ['Format', 'Best for', 'Duration', 'Difficulty level'],
        rows: [
          ['Problem-solution', 'Direct conversion', '30-60s', 'Medium'],
          ['Testimonial', 'Trust / retargeting', '30-45s', 'Medium'],
          ['Product demo', 'Visual products', '15-45s', 'Low-medium'],
          ['Spokesperson', 'Launches / offers', '15-30s', 'Medium-high'],
          ['Listicle', 'Retention / awareness', '30-60s', 'Low'],
          ['Before/after', 'Visible results', '15-30s', 'Low'],
          ['Lifestyle B-roll', 'Awareness / variety', '10-20s', 'Low'],
        ],
      },
      faqs: [
        {
          question: 'Which UGC format converts best on TikTok Ads?',
          answer: 'On TikTok, problem-solution and listicle formats tend to perform best because they leverage the platform\'s native style. The hook is especially important: you need to engage within the first 1-2 seconds.',
        },
        {
          question: 'Do Meta Ads and TikTok Ads need different formats?',
          answer: 'Not necessarily different formats, but adjustments. TikTok favors a more casual tone and faster pacing. Meta (Instagram/Facebook) allows slightly longer videos and more varied tones. The base piece can be the same with editing adjustments.',
        },
        {
          question: 'How many hook variations should I test per format?',
          answer: 'A minimum of 2-3 hook variations per format. The hook is the factor that most impacts performance. The same video with three different hooks can have completely different results.',
        },
        {
          question: 'Can I mix multiple formats in the same campaign?',
          answer: 'Yes, and it is actually recommended. Having 2-3 different formats in the same campaign gives you more data to optimize and avoids creative fatigue. Platforms also optimize better with creative variety.',
        },
        {
          question: 'What is the ideal duration for a UGC ad video?',
          answer: 'For TikTok, 15-30 seconds is the sweet spot. For Meta, you can go up to 60 seconds if the content justifies it. The general rule: do not extend the video just to fill time. If the message can be delivered in 20 seconds, make it 20 seconds.',
        },
        {
          question: 'Do I need to produce all formats at once?',
          answer: 'No. Start with 2-3 formats aligned with your primary objective. Once you have performance data, you can expand to other formats based on what works. Producing everything at once without prior data is usually a waste of budget.',
        },
      ],
      ctaTitle: 'Ready to produce UGC ads that convert?',
      ctaText: 'Tell me about your brand and we will define together the formats that will work best for your campaign.',
      relatedServiceIds: ['ugc-ads-tiktok-meta', 'ugc-problem-solution', 'spokesperson-videos', 'ugc-product-demo'],
      relatedVerticalIds: ['ecommerce-ugc', 'beauty-ugc', 'tech-saas-ugc'],
    },
  },
};

/* ── Public API ── */

export const getResourcePageContent = (resourceId: ResourcePageId, locale: SiteLocale): ResourcePageContent => {
  const localized = RESOURCE_PAGE_CONTENT[resourceId][locale];

  return {
    ...localized,
    id: resourceId,
    locale,
    path: getResourcePath(resourceId, locale),
    alternatePath: getResourcePath(resourceId, locale === 'es' ? 'en' : 'es'),
  };
};

export const getAllResourceIds = (): ResourcePageId[] =>
  Object.keys(RESOURCE_PAGE_CONTENT) as ResourcePageId[];
