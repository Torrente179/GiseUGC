import type { VerticalPageId, ServicePageId, SiteLocale } from '@/lib/locale-path';
import { getHomePath, getVerticalPath } from '@/lib/locale-path';

export type VerticalFeature = {
  title: string;
  description: string;
};

export type VerticalFaq = {
  question: string;
  answer: string;
};

export type VerticalStep = {
  title: string;
  description: string;
};

export type VerticalFeaturedExample = {
  clipId: number;
  title: string;
  description: string;
};

export type VerticalPageContent = {
  id: VerticalPageId;
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
  deliverables: VerticalFeature[];
  bestFitTitle: string;
  bestFitItems: string[];
  notFitTitle: string;
  notFitItems: string[];
  marketTitle: string;
  marketItems: string[];
  processTitle: string;
  processSteps: VerticalStep[];
  featuredTitle: string;
  featuredIntro: string;
  featuredExamples: VerticalFeaturedExample[];
  faqTitle: string;
  faqs: VerticalFaq[];
  ctaTitle: string;
  ctaText: string;
  relatedTitle: string;
  relatedServiceIds: ServicePageId[];
};

type LocalizedVerticalPageMap = Record<VerticalPageId, Record<SiteLocale, Omit<VerticalPageContent, 'id' | 'locale' | 'path' | 'alternatePath' | 'relatedServiceIds'> & { relatedServiceIds: ServicePageId[] }>>;

const VERTICAL_PAGE_CONTENT: LocalizedVerticalPageMap = {
  'beauty-ugc': {
    es: {
      navLabel: 'UGC para beauty',
      metaTitle: 'Creadora UGC para marcas de beauty | Gisela Saldarriaga',
      metaDescription:
        'Creadora UGC especializada en beauty: videos de skincare, maquillaje, suplementos y rutinas para ads, reels y landings de marcas de belleza.',
      breadcrumbLabel: 'UGC beauty',
      heroEyebrow: 'Vertical beauty',
      heroTitle: 'UGC para marcas de beauty que necesitan contenido real y comercial',
      heroSummary:
        'Produzco videos UGC para marcas de skincare, maquillaje, suplementos de belleza y cuidado personal. Piezas pensadas para ads, reels y landing pages que muestran el producto en uso real con tono cercano y credibilidad frente a camara.',
      heroPoints: [
        'Skincare, maquillaje y suplementos',
        'Ads, reels y contenido para landings',
        'Produccion remota desde Medellin',
      ],
      primaryCtaLabel: 'Hablar del proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver portafolio',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Por que el UGC funciona tan bien en beauty',
      sectionIntroText:
        'En beauty la decision de compra pasa por la confianza visual. El usuario necesita ver el producto en una piel real, en una rutina real, con alguien que lo explique sin sonar a infomercial. Un video UGC bien hecho genera esa confianza porque se siente como una recomendacion, no como un anuncio. Eso es lo que convierte.',
      deliverablesTitle: 'Formatos que mejor funcionan en beauty',
      deliverables: [
        {
          title: 'Reviews de producto',
          description: 'Videos donde muestro el producto, explico la textura, la aplicacion y los resultados con tono natural y cercano.',
        },
        {
          title: 'Rutinas y how-to',
          description: 'Demos de uso paso a paso que posicionan el producto dentro de una rutina real de skincare o maquillaje.',
        },
        {
          title: 'Ads con hook visual',
          description: 'Creativos para TikTok y Meta con apertura de producto, aplicacion visible y CTA enfocado en conversion.',
        },
        {
          title: 'Testimoniales de experiencia',
          description: 'Piezas de confianza donde comparto la experiencia con el producto para reducir friccion en la compra.',
        },
      ],
      bestFitTitle: 'Mejor encaje',
      bestFitItems: [
        'Marcas de skincare, maquillaje o suplementos de belleza que venden online y necesitan contenido con cara real.',
        'Equipos que quieren creativos para TikTok Ads o Meta Ads con tono natural y estructura de conversion.',
        'Marcas que necesitan contenido bilingue para vender en mercados hispanos y anglosajones.',
      ],
      notFitTitle: 'No es la mejor opcion si',
      notFitItems: [
        'El producto necesita demostracion profesional de maquillaje con tecnicas avanzadas de aplicacion.',
        'Buscas contenido tipo editorial con produccion de estudio y set complejo.',
        'Necesitas claims clinicos que requieran evidencia medica verificada.',
      ],
      marketTitle: 'Donde suele usarse este contenido',
      marketItems: [
        'TikTok Ads y Meta Ads para marcas de beauty con audiencias en Estados Unidos, Espana y LatAm.',
        'Paginas de producto y landings donde el video reduce dudas y acelera la conversion.',
        'Contenido organico para feeds de marca en Instagram y TikTok.',
      ],
      processTitle: 'Como trabajo un proyecto de UGC beauty',
      processSteps: [
        {
          title: '1. Producto y angulo',
          description: 'Me cuentas el producto, la audiencia y que accion quieres que tome el usuario despues de ver el video.',
        },
        {
          title: '2. Guion o estructura',
          description: 'Armo una estructura que fluya: apertura con hook, demostracion en uso real y cierre con beneficio claro.',
        },
        {
          title: '3. Grabacion',
          description: 'Grabo mostrando el producto en mi piel, con luz natural y encuadres pensados para vertical y movil.',
        },
        {
          title: '4. Entrega lista para usar',
          description: 'Recibes los videos listos para subir a pauta, landing o feed. Con margen para iterar si necesitas variaciones.',
        },
      ],
      featuredTitle: 'Ejemplos de UGC beauty',
      featuredIntro: 'Estas piezas muestran como se ve un video UGC de beauty con presencia real y tono comercial.',
      featuredExamples: [
        {
          clipId: 4,
          title: 'Review de suplemento de creatina (Curvella)',
          description: 'Video de producto con beneficios claros, tono cercano y estructura pensada para conversion en ads.',
        },
        {
          clipId: 1013,
          title: 'Testimonial fitness con experiencia personal',
          description: 'Pieza donde comparto mi experiencia real con un producto de bienestar fisico para generar confianza.',
        },
        {
          clipId: 1,
          title: 'Review lifestyle de producto (Temu)',
          description: 'Review con tono natural y cercano donde muestro el producto en un contexto de uso real.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre UGC para beauty',
      faqs: [
        {
          question: 'Necesito enviarte el producto fisico?',
          answer:
            'En la mayoria de casos si, especialmente para skincare y maquillaje. Necesito el producto en mano para mostrar textura, aplicacion y resultado real. Para suplementos puedo trabajar con el envase y un brief detallado.',
        },
        {
          question: 'Puedes hacer videos de maquillaje con tecnicas avanzadas?',
          answer:
            'Mi fuerte es el contenido UGC natural y comercial, no tutoriales de maquillaje artistico. Si lo que necesitas es alguien que muestre tu producto con presencia real y tono de recomendacion, eso es justo lo que hago.',
        },
        {
          question: 'Funcionan estos videos solo para ads?',
          answer:
            'No. Tambien funcionan para paginas de producto, landings, email marketing y contenido organico. Un buen video de beauty UGC tiene vida util larga porque genera confianza en cualquier punto del funnel.',
        },
        {
          question: 'Trabajas con marcas fuera de Colombia?',
          answer:
            'Si. Produzco contenido para marcas en Estados Unidos, Espana, Australia y Latinoamerica. Todo se coordina de forma remota y el envio de producto funciona bien.',
        },
      ],
      ctaTitle: 'Si tu marca de beauty necesita contenido UGC que convierta, hablemos',
      ctaText:
        'Cuentame el producto, el formato que necesitas y donde lo vas a usar. Te digo como estructurarlo para que funcione.',
      relatedTitle: 'Servicios relacionados',
      relatedServiceIds: ['ugc-testimonials-reviews', 'ugc-lifestyle', 'ugc-ads-tiktok-meta'],
    },
    en: {
      navLabel: 'Beauty UGC',
      metaTitle: 'Beauty UGC creator | Gisela Saldarriaga',
      metaDescription:
        'UGC creator for beauty brands: skincare, makeup, and beauty supplement videos for ads, reels, and landing pages with natural on-camera presence.',
      breadcrumbLabel: 'Beauty UGC',
      heroEyebrow: 'Beauty vertical',
      heroTitle: 'UGC for beauty brands that need real, conversion-ready content',
      heroSummary:
        'I produce UGC videos for skincare, makeup, beauty supplements, and personal care brands. Each piece is built for ads, reels, and landing pages - showing the product in real use with a natural tone and on-camera credibility.',
      heroPoints: [
        'Skincare, makeup and supplements',
        'Built for ads, reels and landings',
        'Remote production from Medellin',
      ],
      primaryCtaLabel: 'Start a project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'View portfolio',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'Why UGC works so well in beauty',
      sectionIntroText:
        'In beauty, the purchase decision runs on visual trust. The buyer needs to see the product on real skin, in a real routine, explained by someone who does not sound like an infomercial. A well-made UGC video builds that trust because it feels like a recommendation, not an ad. That is what converts.',
      deliverablesTitle: 'Formats that work best in beauty',
      deliverables: [
        {
          title: 'Product reviews',
          description: 'Videos where I show the product, explain the texture, application, and results with a natural, relatable tone.',
        },
        {
          title: 'Routines and how-tos',
          description: 'Step-by-step usage demos that position the product inside a real skincare or makeup routine.',
        },
        {
          title: 'Ads with visual hooks',
          description: 'Creatives for TikTok and Meta with product opening, visible application, and conversion-focused CTA.',
        },
        {
          title: 'Experience testimonials',
          description: 'Trust-building pieces where I share my experience with the product to reduce purchase friction.',
        },
      ],
      bestFitTitle: 'Best fit',
      bestFitItems: [
        'Skincare, makeup, or beauty supplement brands selling online that need content with a real face.',
        'Teams that want TikTok Ads or Meta Ads creatives with a natural tone and conversion structure.',
        'Brands that need bilingual content to sell across Spanish and English-speaking markets.',
      ],
      notFitTitle: 'Not the best fit if',
      notFitItems: [
        'The product needs professional makeup demonstration with advanced application techniques.',
        'You are looking for editorial-style content with studio production and a full set.',
        'You need clinical claims that require verified medical evidence.',
      ],
      marketTitle: 'Where this content is typically used',
      marketItems: [
        'TikTok Ads and Meta Ads for beauty brands targeting US, Spain, and LatAm audiences.',
        'Product pages and landing pages where video reduces doubt and accelerates conversion.',
        'Organic feed content for brand Instagram and TikTok accounts.',
      ],
      processTitle: 'How I work a beauty UGC project',
      processSteps: [
        {
          title: '1. Product and angle',
          description: 'Tell me the product, the audience, and what action you want the viewer to take after watching.',
        },
        {
          title: '2. Script or structure',
          description: 'I build a flow: hook opening, real-use demonstration, and a close with a clear benefit.',
        },
        {
          title: '3. Recording',
          description: 'I shoot showing the product on my skin, with natural light and framing designed for vertical and mobile.',
        },
        {
          title: '4. Delivery ready to use',
          description: 'You receive videos ready for ads, landing pages, or feed. With room to iterate if you need variations.',
        },
      ],
      featuredTitle: 'Beauty UGC examples',
      featuredIntro: 'These pieces show what beauty UGC looks like with real presence and a commercial tone.',
      featuredExamples: [
        {
          clipId: 4,
          title: 'Creatine supplement review (Curvella)',
          description: 'Product video with clear benefits, relatable tone, and a structure built for ad conversion.',
        },
        {
          clipId: 1013,
          title: 'Fitness testimonial with personal experience',
          description: 'Piece sharing my real experience with a physical wellness product to build trust.',
        },
        {
          clipId: 1,
          title: 'Lifestyle product review (Temu)',
          description: 'Review with a natural, relatable tone showing the product in a real-use context.',
        },
      ],
      faqTitle: 'FAQs about beauty UGC',
      faqs: [
        {
          question: 'Do I need to send you the physical product?',
          answer:
            'In most cases yes, especially for skincare and makeup. I need the product in hand to show texture, application, and real results. For supplements I can work with the packaging and a detailed brief.',
        },
        {
          question: 'Can you do makeup videos with advanced techniques?',
          answer:
            'My strength is natural, commercial UGC content, not artistic makeup tutorials. If what you need is someone who shows your product with real presence and a recommendation tone, that is exactly what I do.',
        },
        {
          question: 'Do these videos only work for ads?',
          answer:
            'No. They also work for product pages, landing pages, email marketing, and organic content. A good beauty UGC video has a long shelf life because it builds trust at any point in the funnel.',
        },
        {
          question: 'Do you work with brands outside Colombia?',
          answer:
            'Yes. I produce content for brands in the US, Spain, Australia, and Latin America. Everything is coordinated remotely and product shipping works well.',
        },
      ],
      ctaTitle: 'If your beauty brand needs UGC that converts, let us talk',
      ctaText:
        'Tell me the product, the format you need, and where you plan to use it. I will tell you how to structure it so it works.',
      relatedTitle: 'Related services',
      relatedServiceIds: ['ugc-testimonials-reviews', 'ugc-lifestyle', 'ugc-ads-tiktok-meta'],
    },
  },

  'fashion-ugc': {
    es: {
      navLabel: 'UGC para moda',
      metaTitle: 'Creadora UGC para marcas de moda | Gisela Saldarriaga',
      metaDescription:
        'Creadora UGC para marcas de moda y accesorios: reviews de outfits, hauls, try-ons y videos para ads, reels y ecommerce de ropa.',
      breadcrumbLabel: 'UGC moda',
      heroEyebrow: 'Vertical moda',
      heroTitle: 'UGC para marcas de moda que necesitan contenido con estilo real',
      heroSummary:
        'Creo videos UGC para marcas de ropa, accesorios, calzado y joyeria. Hauls, try-ons, reviews de outfits y piezas para ads con tono natural y presencia real frente a camara. Contenido que vende porque se ve autentico.',
      heroPoints: [
        'Ropa, accesorios, calzado y joyeria',
        'Hauls, try-ons y reviews de outfits',
        'Para TikTok Ads, Meta Ads y ecommerce',
      ],
      primaryCtaLabel: 'Hablar del proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver portafolio',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Por que el UGC es clave en moda',
      sectionIntroText:
        'En moda la gente compra lo que ve puesto en alguien real. Las fotos de estudio ya no alcanzan para convencer, especialmente en redes. Un video UGC donde alguien se prueba la ropa, muestra como queda y da su opinion honesta genera mas confianza que cualquier catalogo. Ese es el contenido que mueve la compra.',
      deliverablesTitle: 'Formatos que mejor funcionan en moda',
      deliverables: [
        {
          title: 'Try-on y haul',
          description: 'Videos donde pruebo las prendas, muestro como quedan y doy mi opinion real sobre calidad, fit y estilo.',
        },
        {
          title: 'Reviews de outfits',
          description: 'Piezas detalladas que explican por que funciona cada prenda, para que ocasion y como combinarla.',
        },
        {
          title: 'Ads con look completo',
          description: 'Creativos para paid social con hook visual fuerte, transiciones de outfit y CTA de compra.',
        },
        {
          title: 'Contenido lifestyle de moda',
          description: 'Piezas organicas donde el producto aparece en un contexto de vida real, sin formato de venta directa.',
        },
      ],
      bestFitTitle: 'Mejor encaje',
      bestFitItems: [
        'Marcas DTC de ropa, accesorios o calzado que venden online y necesitan contenido con persona real.',
        'Equipos de ecommerce que quieren videos para paginas de producto que muestren fit y calidad real.',
        'Marcas que buscan creativos de moda para TikTok o Instagram con tono natural y estructura de retencion.',
      ],
      notFitTitle: 'No es la mejor opcion si',
      notFitItems: [
        'Necesitas modelos profesionales con distintos body types para una campana de inclusividad.',
        'Buscas produccion tipo editorial de moda con fotografo, estilista y set completo.',
        'El producto requiere demostracion tecnica de materiales o procesos de fabricacion.',
      ],
      marketTitle: 'Donde suele usarse este contenido',
      marketItems: [
        'TikTok Ads y Meta Ads con formatos de haul, try-on y outfit review que retienen atencion.',
        'Paginas de producto en Shopify o ecommerce donde un video real sube la tasa de conversion.',
        'Feed organico de marca para Instagram Reels y TikTok.',
      ],
      processTitle: 'Como trabajo un proyecto de moda',
      processSteps: [
        {
          title: '1. Producto y brief',
          description: 'Me envias las prendas y me cuentas que quieres destacar: fit, calidad, versatilidad o precio.',
        },
        {
          title: '2. Estructura del contenido',
          description: 'Armo la secuencia: que prendas mostrar primero, como combinarlas y cual es el mensaje central.',
        },
        {
          title: '3. Grabacion con prendas reales',
          description: 'Grabo probandome las prendas con encuadres variados, transiciones limpias y comentarios naturales.',
        },
        {
          title: '4. Entrega lista para pauta o feed',
          description: 'Recibes los videos editados y listos. Si necesitas variaciones de hook o CTA, puedo entregarlas.',
        },
      ],
      featuredTitle: 'Ejemplos de UGC para moda',
      featuredIntro: 'Estas piezas muestran como se ve un video UGC de moda con presencia real.',
      featuredExamples: [
        {
          clipId: 1,
          title: 'Review de outfits Temu con try-on',
          description: 'Review detallado de prendas con prueba en camara, comentarios de calidad y tono natural.',
        },
        {
          clipId: 8,
          title: 'Pieza lifestyle con perfume',
          description: 'Video con tono aspiracional y estetica cuidada que posiciona el producto en un momento de estilo.',
        },
        {
          clipId: 6,
          title: 'Presentacion profesional de servicios',
          description: 'Pieza que muestra versatilidad frente a camara y capacidad de adaptar tono segun el brief.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre UGC para moda',
      faqs: [
        {
          question: 'Necesito enviarte las prendas?',
          answer:
            'Si. Para que el contenido se vea real y autentico necesito tener las prendas en mano, probarmelas y mostrar como quedan de verdad. Coordino envio a Medellin con la marca.',
        },
        {
          question: 'Puedes hacer hauls con muchas prendas?',
          answer:
            'Si. Los hauls de 4 a 8 prendas funcionan muy bien. Si necesitas un volumen mayor, lo estructuramos en lotes para que cada pieza tenga suficiente tiempo en pantalla.',
        },
        {
          question: 'El contenido sirve para la pagina de producto?',
          answer:
            'Si. De hecho ese es uno de los usos mas efectivos. Un video corto de try-on en una PDP puede subir la conversion mas que cualquier foto de catalogo.',
        },
        {
          question: 'Trabajas en ingles tambien?',
          answer:
            'Si. Puedo producir versiones en espanol e ingles del mismo contenido para marcas que venden en varios mercados.',
        },
      ],
      ctaTitle: 'Si tu marca de moda necesita contenido que venda, hablemos',
      ctaText:
        'Cuentame que prendas quieres mostrar, donde vas a usar el contenido y si necesitas una o dos versiones por idioma.',
      relatedTitle: 'Servicios relacionados',
      relatedServiceIds: ['ugc-lifestyle', 'ugc-ads-tiktok-meta'],
    },
    en: {
      navLabel: 'Fashion UGC',
      metaTitle: 'Fashion UGC creator | Gisela Saldarriaga',
      metaDescription:
        'UGC creator for fashion brands: outfit reviews, hauls, try-ons, and creator-led videos for ads, reels, and ecommerce product pages.',
      breadcrumbLabel: 'Fashion UGC',
      heroEyebrow: 'Fashion vertical',
      heroTitle: 'UGC for fashion brands that need real, style-forward content',
      heroSummary:
        'I create UGC videos for clothing, accessories, footwear, and jewelry brands. Hauls, try-ons, outfit reviews, and ad-ready pieces with natural tone and real on-camera presence. Content that sells because it looks authentic.',
      heroPoints: [
        'Clothing, accessories and footwear',
        'Hauls, try-ons and outfit reviews',
        'For TikTok Ads, Meta Ads and ecommerce',
      ],
      primaryCtaLabel: 'Start a project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'View portfolio',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'Why UGC is essential in fashion',
      sectionIntroText:
        'In fashion, people buy what they see on someone real. Studio photos are no longer enough to convince, especially on social. A UGC video where someone tries on the clothes, shows how they fit, and gives an honest opinion builds more trust than any catalog. That is the content that drives the purchase.',
      deliverablesTitle: 'Formats that work best in fashion',
      deliverables: [
        {
          title: 'Try-on and haul',
          description: 'Videos where I try on the pieces, show how they fit, and share my honest take on quality, fit, and style.',
        },
        {
          title: 'Outfit reviews',
          description: 'Detailed pieces explaining why each garment works, for what occasion, and how to style it.',
        },
        {
          title: 'Ads with full look',
          description: 'Paid social creatives with a strong visual hook, outfit transitions, and a purchase CTA.',
        },
        {
          title: 'Fashion lifestyle content',
          description: 'Organic pieces where the product appears in a real-life context, without a hard-sell format.',
        },
      ],
      bestFitTitle: 'Best fit',
      bestFitItems: [
        'DTC clothing, accessories, or footwear brands selling online that need content with a real person.',
        'Ecommerce teams that want product-page videos showing real fit and quality.',
        'Brands looking for fashion creatives for TikTok or Instagram with a natural tone and retention structure.',
      ],
      notFitTitle: 'Not the best fit if',
      notFitItems: [
        'You need professional models with various body types for an inclusivity campaign.',
        'You are looking for editorial fashion production with photographer, stylist, and a full set.',
        'The product requires technical demonstration of materials or manufacturing processes.',
      ],
      marketTitle: 'Where this content is typically used',
      marketItems: [
        'TikTok Ads and Meta Ads with haul, try-on, and outfit review formats that retain attention.',
        'Product pages on Shopify or ecommerce where a real video lifts conversion rates.',
        'Organic brand feed for Instagram Reels and TikTok.',
      ],
      processTitle: 'How I work a fashion project',
      processSteps: [
        {
          title: '1. Product and brief',
          description: 'You send the garments and tell me what to highlight: fit, quality, versatility, or price.',
        },
        {
          title: '2. Content structure',
          description: 'I plan the sequence: which pieces to show first, how to style them, and what the central message is.',
        },
        {
          title: '3. Recording with real garments',
          description: 'I shoot trying on the pieces with varied framing, clean transitions, and natural commentary.',
        },
        {
          title: '4. Delivery ready for ads or feed',
          description: 'You receive edited videos ready to go. If you need hook or CTA variations, I can deliver those too.',
        },
      ],
      featuredTitle: 'Fashion UGC examples',
      featuredIntro: 'These pieces show what fashion UGC looks like with real presence.',
      featuredExamples: [
        {
          clipId: 1,
          title: 'Temu outfit review with try-on',
          description: 'Detailed garment review with on-camera try-on, quality commentary, and natural tone.',
        },
        {
          clipId: 8,
          title: 'Lifestyle piece with perfume',
          description: 'Video with aspirational tone and polished aesthetic positioning the product in a style moment.',
        },
        {
          clipId: 6,
          title: 'Professional services presentation',
          description: 'Piece showing on-camera versatility and the ability to adapt tone to match the brief.',
        },
      ],
      faqTitle: 'FAQs about fashion UGC',
      faqs: [
        {
          question: 'Do I need to send you the garments?',
          answer:
            'Yes. For the content to look real and authentic I need the pieces in hand, to try them on and show how they actually fit. I coordinate shipping to Medellin with the brand.',
        },
        {
          question: 'Can you do hauls with many pieces?',
          answer:
            'Yes. Hauls with 4 to 8 pieces work very well. If you need a larger volume, we structure it in batches so each piece gets enough screen time.',
        },
        {
          question: 'Does this content work for product pages?',
          answer:
            'Yes. In fact that is one of the most effective uses. A short try-on video on a PDP can lift conversion more than any catalog photo.',
        },
        {
          question: 'Do you also work in English?',
          answer:
            'Yes. I can produce Spanish and English versions of the same content for brands selling across multiple markets.',
        },
      ],
      ctaTitle: 'If your fashion brand needs content that sells, let us talk',
      ctaText:
        'Tell me which pieces you want to showcase, where you plan to use the content, and whether you need one or two language versions.',
      relatedTitle: 'Related services',
      relatedServiceIds: ['ugc-lifestyle', 'ugc-ads-tiktok-meta'],
    },
  },

  'tech-saas-ugc': {
    es: {
      navLabel: 'UGC para tech y SaaS',
      metaTitle: 'Creadora UGC para tech y SaaS | Gisela Saldarriaga',
      metaDescription:
        'Creadora UGC para marcas de tech, SaaS y apps: demos, reviews y videos explicativos para ads, landings y onboarding con claridad comercial.',
      breadcrumbLabel: 'UGC tech y SaaS',
      heroEyebrow: 'Vertical tech y SaaS',
      heroTitle: 'UGC para marcas tech y SaaS que necesitan explicar su producto con claridad',
      heroSummary:
        'Produzco videos UGC para empresas de tecnologia, SaaS y apps. Demos, reviews y piezas explicativas con presencia real frente a camara y un tono que traduce lo complejo en algo que la audiencia entienda rapido y quiera probar.',
      heroPoints: [
        'SaaS, apps, AI y servicios digitales',
        'Demos, reviews y videos explicativos',
        'Para ads, landings y onboarding',
      ],
      primaryCtaLabel: 'Hablar del proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver portafolio',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Por que el UGC funciona en tech y SaaS',
      sectionIntroText:
        'En tech la barrera de compra casi siempre es la comprension. Si el usuario no entiende que hace tu producto en los primeros segundos, no convierte. Un video UGC con alguien real que lo explique, lo muestre funcionando y lo conecte con un dolor concreto acorta ese camino. No es un screencast: es una persona de confianza que te dice por que vale la pena.',
      deliverablesTitle: 'Formatos que mejor funcionan en tech',
      deliverables: [
        {
          title: 'Demo de producto',
          description: 'Videos donde muestro el producto funcionando con explicacion clara, paso a paso y ritmo comercial.',
        },
        {
          title: 'Review con experiencia real',
          description: 'Piezas donde pruebo el producto y comparto mi experiencia real para generar confianza.',
        },
        {
          title: 'Ads explicativos',
          description: 'Creativos para TikTok y Meta que abren con un dolor, presentan la solucion y cierran con CTA claro.',
        },
        {
          title: 'Videos para onboarding',
          description: 'Piezas de bienvenida o educativas que ayudan al usuario nuevo a entender y activar el producto.',
        },
      ],
      bestFitTitle: 'Mejor encaje',
      bestFitItems: [
        'Empresas de SaaS, apps o AI que necesitan videos para explicar su producto a usuarios no tecnicos.',
        'Equipos de growth que quieren creativos UGC para campanas de adquisicion en TikTok y Meta.',
        'Startups que necesitan contenido para landings y product pages que reduzca la tasa de rebote.',
      ],
      notFitTitle: 'No es la mejor opcion si',
      notFitItems: [
        'Necesitas un screencast puro sin presencia humana frente a camara.',
        'El producto requiere demostracion tecnica muy profunda que solo un ingeniero puede explicar.',
        'Buscas contenido tipo webinar o curso largo, no una pieza de marketing.',
      ],
      marketTitle: 'Donde suele usarse este contenido',
      marketItems: [
        'TikTok Ads y Meta Ads para campanas de adquisicion de usuarios de SaaS y apps.',
        'Landing pages y paginas de producto donde un video explicativo sube la conversion.',
        'Secuencias de onboarding y email donde el video acelera la activacion del producto.',
      ],
      processTitle: 'Como trabajo un proyecto de tech UGC',
      processSteps: [
        {
          title: '1. Producto y contexto',
          description: 'Entiendo que hace tu producto, quien lo usa y cual es el beneficio principal que quieres destacar.',
        },
        {
          title: '2. Guion con estructura clara',
          description: 'Armo un guion que fluya: problema, solucion, demo rapida y cierre con accion. Sin jerga innecesaria.',
        },
        {
          title: '3. Grabacion con demostracion',
          description: 'Grabo combinando hablar a camara con mostrarte el producto en accion. Claro, directo y con ritmo.',
        },
        {
          title: '4. Entrega optimizada',
          description: 'Recibes los videos listos para ads, landing o email. Con versiones de hook si las necesitas.',
        },
      ],
      featuredTitle: 'Ejemplos de UGC tech',
      featuredIntro: 'Estas piezas muestran como se ve un video UGC de tech con claridad y presencia real.',
      featuredExamples: [
        {
          clipId: 3,
          title: 'Review-demo de voicebot (Calvotia)',
          description: 'Testimonial que evoluciona a explicacion de producto con beneficios claros y demostracion real.',
        },
        {
          clipId: 1008,
          title: 'Demo en vivo de VoiceBot automotriz',
          description: 'Conversacion real con un bot de IA que muestra el producto funcionando en tiempo real.',
        },
        {
          clipId: 1009,
          title: 'Ad de VoiceBot para WhatsApp',
          description: 'Pieza publicitaria que presenta un producto de AI con claridad comercial y CTA directo.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre UGC para tech y SaaS',
      faqs: [
        {
          question: 'Puedes explicar productos tecnicos sin que suene complicado?',
          answer:
            'Si. Tengo mas de 9 anos de experiencia en periodismo y medios, lo que me entreno para tomar temas complejos y hacerlos claros. Eso se traduce directamente en como armo demos y explicaciones de producto.',
        },
        {
          question: 'Necesito darte acceso a mi plataforma?',
          answer:
            'Depende del formato. Para una demo necesito ver el producto funcionando. Para un review puedo trabajar con screenshots, brief detallado o acceso temporal a la herramienta.',
        },
        {
          question: 'Sirve para campanas de adquisicion o solo para retencion?',
          answer:
            'Para ambas. Los videos explicativos funcionan muy bien en top-of-funnel cuando el usuario todavia no conoce tu producto, y tambien en onboarding y retencion cuando necesitas que lo active y use.',
        },
        {
          question: 'Puedes hacer videos en ingles para mi audiencia estadounidense?',
          answer:
            'Si. Trabajo en espanol e ingles. Para piezas en ingles prefiero partir de un guion claro para mantener la naturalidad y precision del mensaje.',
        },
      ],
      ctaTitle: 'Si tu empresa tech necesita contenido UGC que explique y convierta, hablemos',
      ctaText:
        'Cuentame que hace tu producto, quien lo usa y donde vas a poner los videos. Te digo como estructurarlo para que funcione.',
      relatedTitle: 'Servicios relacionados',
      relatedServiceIds: ['ugc-product-demo', 'ugc-ads-tiktok-meta', 'ugc-problem-solution'],
    },
    en: {
      navLabel: 'Tech and SaaS UGC',
      metaTitle: 'Tech and SaaS UGC creator | Gisela Saldarriaga',
      metaDescription:
        'UGC creator for tech, SaaS, and app brands: demos, reviews, and explainer videos for ads, landing pages, and onboarding with clear commercial delivery.',
      breadcrumbLabel: 'Tech and SaaS UGC',
      heroEyebrow: 'Tech and SaaS vertical',
      heroTitle: 'UGC for tech and SaaS brands that need to explain their product clearly',
      heroSummary:
        'I produce UGC videos for technology, SaaS, and app companies. Demos, reviews, and explainer pieces with real on-camera presence and a tone that translates complexity into something the audience understands quickly and wants to try.',
      heroPoints: [
        'SaaS, apps, AI and digital services',
        'Demos, reviews and explainer videos',
        'For ads, landings and onboarding',
      ],
      primaryCtaLabel: 'Start a project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'View portfolio',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'Why UGC works in tech and SaaS',
      sectionIntroText:
        'In tech, the purchase barrier is almost always comprehension. If the user does not understand what your product does in the first few seconds, they will not convert. A UGC video with a real person who explains it, shows it working, and connects it to a specific pain point shortens that path. It is not a screencast - it is a trusted person telling you why it is worth trying.',
      deliverablesTitle: 'Formats that work best in tech',
      deliverables: [
        {
          title: 'Product demo',
          description: 'Videos showing the product working with clear explanation, step by step, and commercial pacing.',
        },
        {
          title: 'Review with real experience',
          description: 'Pieces where I test the product and share my real experience to build trust.',
        },
        {
          title: 'Explainer ads',
          description: 'Creatives for TikTok and Meta that open with a pain point, present the solution, and close with a clear CTA.',
        },
        {
          title: 'Onboarding videos',
          description: 'Welcome or educational pieces that help new users understand and activate the product.',
        },
      ],
      bestFitTitle: 'Best fit',
      bestFitItems: [
        'SaaS, app, or AI companies that need videos to explain their product to non-technical users.',
        'Growth teams that want UGC creatives for TikTok and Meta acquisition campaigns.',
        'Startups that need landing page and product page content that reduces bounce rate.',
      ],
      notFitTitle: 'Not the best fit if',
      notFitItems: [
        'You need a pure screencast without any human on-camera presence.',
        'The product requires very deep technical demonstration that only an engineer can explain.',
        'You are looking for webinar-style or long-form course content, not a marketing piece.',
      ],
      marketTitle: 'Where this content is typically used',
      marketItems: [
        'TikTok Ads and Meta Ads for SaaS and app user acquisition campaigns.',
        'Landing pages and product pages where an explainer video lifts conversion.',
        'Onboarding and email sequences where video accelerates product activation.',
      ],
      processTitle: 'How I work a tech UGC project',
      processSteps: [
        {
          title: '1. Product and context',
          description: 'I learn what your product does, who uses it, and what main benefit you want to highlight.',
        },
        {
          title: '2. Script with clear structure',
          description: 'I build a script that flows: problem, solution, quick demo, and close with action. No unnecessary jargon.',
        },
        {
          title: '3. Recording with demonstration',
          description: 'I record combining talking to camera with showing the product in action. Clear, direct, and well-paced.',
        },
        {
          title: '4. Optimized delivery',
          description: 'You receive videos ready for ads, landing pages, or email. With hook variations if you need them.',
        },
      ],
      featuredTitle: 'Tech UGC examples',
      featuredIntro: 'These pieces show what tech UGC looks like with clarity and real presence.',
      featuredExamples: [
        {
          clipId: 3,
          title: 'Voicebot review-demo (Calvotia)',
          description: 'Testimonial that evolves into a product explanation with clear benefits and real demonstration.',
        },
        {
          clipId: 1008,
          title: 'Live automotive VoiceBot demo',
          description: 'Real conversation with an AI bot showing the product working in real time.',
        },
        {
          clipId: 1009,
          title: 'WhatsApp VoiceBot ad',
          description: 'Ad piece presenting an AI product with commercial clarity and a direct CTA.',
        },
      ],
      faqTitle: 'FAQs about tech and SaaS UGC',
      faqs: [
        {
          question: 'Can you explain technical products without making them sound complicated?',
          answer:
            'Yes. I have over nine years of experience in journalism and media, which trained me to take complex topics and make them clear. That translates directly into how I build demos and product explanations.',
        },
        {
          question: 'Do I need to give you access to my platform?',
          answer:
            'It depends on the format. For a demo I need to see the product working. For a review I can work with screenshots, a detailed brief, or temporary access to the tool.',
        },
        {
          question: 'Does this work for acquisition campaigns or only for retention?',
          answer:
            'Both. Explainer videos work very well at the top of funnel when the user does not know your product yet, and also in onboarding and retention when you need them to activate and use it.',
        },
        {
          question: 'Can you produce videos in English for my US audience?',
          answer:
            'Yes. I work in both Spanish and English. For English pieces I prefer to start from a clear script to keep the delivery natural and precise.',
        },
      ],
      ctaTitle: 'If your tech company needs UGC that explains and converts, let us talk',
      ctaText:
        'Tell me what your product does, who uses it, and where you plan to run the videos. I will tell you how to structure it for results.',
      relatedTitle: 'Related services',
      relatedServiceIds: ['ugc-product-demo', 'ugc-ads-tiktok-meta', 'ugc-problem-solution'],
    },
  },

  'ecommerce-ugc': {
    es: {
      navLabel: 'UGC para ecommerce',
      metaTitle: 'Creadora UGC para ecommerce | Gisela Saldarriaga',
      metaDescription:
        'Creadora UGC para marcas de ecommerce: reviews, unboxings, videos de producto y ads para tiendas online que necesitan contenido con persona real.',
      breadcrumbLabel: 'UGC ecommerce',
      heroEyebrow: 'Vertical ecommerce',
      heroTitle: 'UGC para ecommerce que necesita contenido con persona real para vender mas',
      heroSummary:
        'Creo videos UGC para tiendas online de cualquier categoria. Reviews, unboxings, demos de producto y piezas para ads que muestran el producto en uso real con cara, voz y tono de confianza. Contenido pensado para subir la conversion donde la foto de catalogo no alcanza.',
      heroPoints: [
        'Cualquier categoria de producto fisico',
        'Reviews, unboxings y demos de uso',
        'Para ads, PDPs y paginas de producto',
      ],
      primaryCtaLabel: 'Hablar del proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver portafolio',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Por que el UGC es clave para ecommerce',
      sectionIntroText:
        'En ecommerce el usuario no puede tocar el producto. No puede probarselo, no puede olerlo, no puede girarlo en sus manos. Un video UGC donde alguien real lo abre, lo usa y da su opinion honesta es lo mas cerca que llega de esa experiencia. Eso reduce la friccion, baja las devoluciones y sube la conversion. Es simple: la gente le cree mas a una persona que a una foto.',
      deliverablesTitle: 'Formatos que mejor funcionan en ecommerce',
      deliverables: [
        {
          title: 'Reviews de producto',
          description: 'Videos detallados donde muestro el producto, lo pruebo y doy mi opinion real sobre calidad y uso.',
        },
        {
          title: 'Unboxings',
          description: 'Piezas que capturan la experiencia de abrir el paquete, ver el producto por primera vez y reaccionar.',
        },
        {
          title: 'Ads de conversion directa',
          description: 'Creativos para TikTok y Meta con hook fuerte, producto en uso y CTA claro para compra.',
        },
        {
          title: 'Videos para paginas de producto',
          description: 'Piezas cortas pensadas para embedear en PDPs y subir la confianza del comprador.',
        },
      ],
      bestFitTitle: 'Mejor encaje',
      bestFitItems: [
        'Tiendas online que venden productos fisicos y necesitan contenido con persona real para sus ads o PDPs.',
        'Marcas DTC que quieren creativos para TikTok Ads o Meta Ads con tono natural y estructura de conversion.',
        'Equipos de ecommerce que necesitan videos para reducir devoluciones y subir la tasa de conversion.',
      ],
      notFitTitle: 'No es la mejor opcion si',
      notFitItems: [
        'El producto requiere demostracion tecnica especializada que solo un experto del sector puede hacer.',
        'Necesitas produccion de catalogo con muchos SKUs en una sola sesion de estudio.',
        'Buscas contenido generado por multiples creadores para una campana de UGC a escala.',
      ],
      marketTitle: 'Donde suele usarse este contenido',
      marketItems: [
        'TikTok Ads y Meta Ads para campanas de conversion directa de ecommerce.',
        'Paginas de producto (PDPs) en Shopify, WooCommerce o cualquier plataforma donde un video sube la conversion.',
        'Email marketing y secuencias post-compra con contenido de producto en uso real.',
      ],
      processTitle: 'Como trabajo un proyecto de ecommerce',
      processSteps: [
        {
          title: '1. Producto y objetivo',
          description: 'Me cuentas que vendes, donde aparece el video y que accion quieres que tome el usuario.',
        },
        {
          title: '2. Estructura del contenido',
          description: 'Defino la secuencia: apertura con hook, producto en uso, beneficio visible y cierre con CTA.',
        },
        {
          title: '3. Grabacion con producto real',
          description: 'Grabo con el producto en mano. Unboxing real, uso real, reaccion real. Sin actuar.',
        },
        {
          title: '4. Entrega para multiples canales',
          description: 'Recibes los videos listos para ads, PDP, email o feed. Puedo entregar variaciones si las necesitas.',
        },
      ],
      featuredTitle: 'Ejemplos de UGC ecommerce',
      featuredIntro: 'Estas piezas muestran como se ve un video UGC de ecommerce con producto real y tono comercial.',
      featuredExamples: [
        {
          clipId: 1001,
          title: 'Ad para campana de marketing',
          description: 'Pieza publicitaria con estructura de conversion, presencia clara y ritmo de retencion.',
        },
        {
          clipId: 4,
          title: 'Review de suplemento (Curvella)',
          description: 'Video de producto con beneficios, experiencia personal y tono cercano pensado para conversion.',
        },
        {
          clipId: 1003,
          title: 'Ad de vehicle wrap',
          description: 'Pieza publicitaria que muestra un servicio de producto con claridad comercial y CTA directo.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre UGC para ecommerce',
      faqs: [
        {
          question: 'Sirve para cualquier tipo de producto?',
          answer:
            'Si, siempre que sea un producto que se pueda mostrar en uso real frente a camara. He trabajado con suplementos, ropa, accesorios, gadgets, productos de belleza y servicios con componente fisico.',
        },
        {
          question: 'El video funciona mejor que las fotos en una PDP?',
          answer:
            'En la mayoria de casos si, especialmente para productos que necesitan contexto de uso. Un video corto de review o demo puede subir la conversion de la pagina de producto de forma significativa.',
        },
        {
          question: 'Puedo usar el mismo video como ad y en mi pagina?',
          answer:
            'Si. De hecho muchos equipos de ecommerce usan la misma pieza en TikTok Ads, en su PDP y en email marketing. Un buen video UGC tiene vida util en varios canales.',
        },
        {
          question: 'Cuanto tarda la entrega?',
          answer:
            'Depende del volumen, pero un lote tipico de 3 a 5 videos se entrega en 5 a 7 dias habiles despues de recibir el producto y aprobar la estructura.',
        },
      ],
      ctaTitle: 'Si tu tienda online necesita contenido con persona real, hablemos',
      ctaText:
        'Cuentame que producto vendes, donde vas a usar los videos y cuantas piezas necesitas. Te armo una propuesta que tenga sentido.',
      relatedTitle: 'Servicios relacionados',
      relatedServiceIds: ['ugc-testimonials-reviews', 'ugc-ads-tiktok-meta', 'ugc-product-demo'],
    },
    en: {
      navLabel: 'Ecommerce UGC',
      metaTitle: 'Ecommerce UGC creator | Gisela Saldarriaga',
      metaDescription:
        'UGC creator for ecommerce brands: reviews, unboxings, product videos, and ads for online stores that need content with a real person.',
      breadcrumbLabel: 'Ecommerce UGC',
      heroEyebrow: 'Ecommerce vertical',
      heroTitle: 'UGC for ecommerce that needs real-person content to sell more',
      heroSummary:
        'I create UGC videos for online stores across every category. Reviews, unboxings, product demos, and ad-ready pieces that show the product in real use with face, voice, and a trust-building tone. Content designed to lift conversion where catalog photos fall short.',
      heroPoints: [
        'Any physical product category',
        'Reviews, unboxings and usage demos',
        'For ads, PDPs and product pages',
      ],
      primaryCtaLabel: 'Start a project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'View portfolio',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'Why UGC is essential for ecommerce',
      sectionIntroText:
        'In ecommerce the user cannot touch the product. They cannot try it on, they cannot smell it, they cannot turn it in their hands. A UGC video where a real person opens it, uses it, and gives their honest opinion is the closest they get to that experience. That reduces friction, lowers returns, and lifts conversion. It is simple: people trust a person more than a photo.',
      deliverablesTitle: 'Formats that work best in ecommerce',
      deliverables: [
        {
          title: 'Product reviews',
          description: 'Detailed videos where I show the product, test it, and share my honest take on quality and usage.',
        },
        {
          title: 'Unboxings',
          description: 'Pieces that capture the experience of opening the package, seeing the product for the first time, and reacting.',
        },
        {
          title: 'Direct conversion ads',
          description: 'Creatives for TikTok and Meta with a strong hook, product in use, and a clear purchase CTA.',
        },
        {
          title: 'Product page videos',
          description: 'Short pieces designed to embed on PDPs and boost buyer confidence.',
        },
      ],
      bestFitTitle: 'Best fit',
      bestFitItems: [
        'Online stores selling physical products that need real-person content for their ads or PDPs.',
        'DTC brands that want TikTok Ads or Meta Ads creatives with natural tone and conversion structure.',
        'Ecommerce teams that need videos to reduce returns and lift conversion rates.',
      ],
      notFitTitle: 'Not the best fit if',
      notFitItems: [
        'The product requires specialized technical demonstration that only a sector expert can deliver.',
        'You need catalog-style production with many SKUs in a single studio session.',
        'You are looking for content from multiple creators for a scaled UGC campaign.',
      ],
      marketTitle: 'Where this content is typically used',
      marketItems: [
        'TikTok Ads and Meta Ads for direct conversion ecommerce campaigns.',
        'Product pages (PDPs) on Shopify, WooCommerce, or any platform where video lifts conversion.',
        'Email marketing and post-purchase sequences with real product-in-use content.',
      ],
      processTitle: 'How I work an ecommerce project',
      processSteps: [
        {
          title: '1. Product and goal',
          description: 'Tell me what you sell, where the video will appear, and what action you want the viewer to take.',
        },
        {
          title: '2. Content structure',
          description: 'I define the sequence: hook opening, product in use, visible benefit, and CTA close.',
        },
        {
          title: '3. Recording with real product',
          description: 'I shoot with the product in hand. Real unboxing, real usage, real reaction. No acting.',
        },
        {
          title: '4. Multi-channel delivery',
          description: 'You receive videos ready for ads, PDP, email, or feed. I can deliver variations if you need them.',
        },
      ],
      featuredTitle: 'Ecommerce UGC examples',
      featuredIntro: 'These pieces show what ecommerce UGC looks like with real product and commercial tone.',
      featuredExamples: [
        {
          clipId: 1001,
          title: 'Marketing campaign ad',
          description: 'Ad piece with conversion structure, clear presence, and retention pacing.',
        },
        {
          clipId: 4,
          title: 'Supplement review (Curvella)',
          description: 'Product video with benefits, personal experience, and relatable tone built for conversion.',
        },
        {
          clipId: 1003,
          title: 'Vehicle wrap ad',
          description: 'Ad piece showcasing a product service with commercial clarity and a direct CTA.',
        },
      ],
      faqTitle: 'FAQs about ecommerce UGC',
      faqs: [
        {
          question: 'Does this work for any type of product?',
          answer:
            'Yes, as long as it is a product that can be shown in real use on camera. I have worked with supplements, clothing, accessories, gadgets, beauty products, and services with a physical component.',
        },
        {
          question: 'Does video perform better than photos on a PDP?',
          answer:
            'In most cases yes, especially for products that need usage context. A short review or demo video can significantly lift product page conversion.',
        },
        {
          question: 'Can I use the same video as an ad and on my website?',
          answer:
            'Yes. Many ecommerce teams use the same piece on TikTok Ads, on their PDP, and in email marketing. A good UGC video has a long shelf life across multiple channels.',
        },
        {
          question: 'How long does delivery take?',
          answer:
            'It depends on volume, but a typical batch of 3 to 5 videos is delivered in 5 to 7 business days after receiving the product and approving the structure.',
        },
      ],
      ctaTitle: 'If your online store needs real-person content, let us talk',
      ctaText:
        'Tell me what product you sell, where you plan to use the videos, and how many pieces you need. I will put together a proposal that makes sense.',
      relatedTitle: 'Related services',
      relatedServiceIds: ['ugc-testimonials-reviews', 'ugc-ads-tiktok-meta', 'ugc-product-demo'],
    },
  },

  'lifestyle-wellness-ugc': {
    es: {
      navLabel: 'UGC lifestyle y bienestar',
      metaTitle: 'Creadora UGC lifestyle y bienestar | Gisela Saldarriaga',
      metaDescription:
        'Creadora UGC para marcas de lifestyle, bienestar y alimentacion saludable: reviews, contenido organico y ads con tono natural para conectar con tu audiencia.',
      breadcrumbLabel: 'UGC lifestyle y bienestar',
      heroEyebrow: 'Vertical lifestyle y bienestar',
      heroTitle: 'UGC para marcas de lifestyle y bienestar que quieren contenido autentico',
      heroSummary:
        'Produzco videos UGC para marcas de bienestar, alimentacion saludable, fitness, hogar y estilo de vida. Piezas con tono natural que integran el producto en momentos reales del dia a dia. Contenido que se siente como una recomendacion entre amigas, no como un anuncio.',
      heroPoints: [
        'Bienestar, fitness, hogar y alimentacion',
        'Tono natural y momentos reales',
        'Para ads, reels y contenido organico',
      ],
      primaryCtaLabel: 'Hablar del proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver portafolio',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Por que el UGC lifestyle conecta mejor',
      sectionIntroText:
        'En lifestyle y bienestar la gente no compra productos: compra versiones de la vida que quiere tener. Un video UGC donde alguien real usa el producto en su rutina, en su cocina, en su momento de cuidado personal, genera una conexion emocional que ningun contenido de estudio puede replicar. El formato creator-led funciona porque transmite aspiracion alcanzable, no publicidad.',
      deliverablesTitle: 'Formatos que mejor funcionan en lifestyle',
      deliverables: [
        {
          title: 'Contenido de rutina diaria',
          description: 'Videos donde el producto aparece naturalmente dentro de mi rutina de bienestar, cocina o cuidado personal.',
        },
        {
          title: 'Reviews con experiencia personal',
          description: 'Piezas donde comparto como uso el producto, que me gusta y por que lo recomendaria con honestidad.',
        },
        {
          title: 'Ads con tono lifestyle',
          description: 'Creativos para TikTok y Meta que abren con un momento real y cierran con beneficio y CTA suave.',
        },
        {
          title: 'Contenido para feed organico',
          description: 'Piezas pensadas para el feed de marca: sin formato de venta directa, con estetica cuidada y tono natural.',
        },
      ],
      bestFitTitle: 'Mejor encaje',
      bestFitItems: [
        'Marcas de bienestar, suplementos, alimentacion saludable o fitness que quieren contenido con cara real y tono cercano.',
        'Marcas de hogar, aromas o productos de cuidado personal que necesitan mostrar el producto en un contexto de vida real.',
        'Equipos que buscan contenido para feed organico y tambien para ads con tono lifestyle no agresivo.',
      ],
      notFitTitle: 'No es la mejor opcion si',
      notFitItems: [
        'El producto necesita demostracion tecnica o claims cientificos verificados.',
        'Buscas contenido con multiples locaciones, viajes o produccion compleja en exterior.',
        'Necesitas un influencer con audiencia propia para amplificar el contenido de forma organica.',
      ],
      marketTitle: 'Donde suele usarse este contenido',
      marketItems: [
        'Feed organico de marca en Instagram y TikTok para construir comunidad y confianza.',
        'TikTok Ads y Meta Ads con formatos de lifestyle que convierten sin sentirse intrusivos.',
        'Paginas de producto y landings donde el video muestra el producto en un contexto aspiracional.',
      ],
      processTitle: 'Como trabajo un proyecto de lifestyle',
      processSteps: [
        {
          title: '1. Producto y vision',
          description: 'Me cuentas que vendes, que estilo de vida quieres asociar al producto y donde vas a usar el contenido.',
        },
        {
          title: '2. Momentos y estructura',
          description: 'Defino en que momentos del dia integrar el producto: manana, rutina, cocina, cuidado personal.',
        },
        {
          title: '3. Grabacion natural',
          description: 'Grabo en ambientes reales con luz natural, sin set armado. El producto se integra al momento, no al reves.',
        },
        {
          title: '4. Entrega para multiples usos',
          description: 'Recibes las piezas listas para feed, ads, landing o email. Con estetica consistente.',
        },
      ],
      featuredTitle: 'Ejemplos de UGC lifestyle y bienestar',
      featuredIntro: 'Estas piezas muestran como se ve un video UGC lifestyle con tono natural y producto integrado.',
      featuredExamples: [
        {
          clipId: 8,
          title: 'Pieza lifestyle con perfume',
          description: 'Video con tono aspiracional y estetica cuidada que posiciona el producto en un momento de estilo.',
        },
        {
          clipId: 1002,
          title: 'Contenido organico para marca en Espana',
          description: 'Pieza con tono natural pensada para feed organico de una marca de bienestar.',
        },
        {
          clipId: 1004,
          title: 'Review de experiencia en restaurante',
          description: 'Video de experiencia gastronomica con tono cercano y recomendacion honesta.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre UGC lifestyle y bienestar',
      faqs: [
        {
          question: 'Cual es la diferencia entre contenido lifestyle y UGC ads?',
          answer:
            'El contenido lifestyle esta pensado para el feed organico: el producto aparece en un momento real, sin hook de venta agresivo. Los UGC ads tienen estructura de retencion y conversion para pauta pagada. Puedo hacer ambos formatos segun lo que necesites.',
        },
        {
          question: 'Necesitas que te envie el producto?',
          answer:
            'Si, en la mayoria de los casos. Para que el contenido sea autentico necesito usar el producto de verdad. Coordino envio a Medellin con la marca.',
        },
        {
          question: 'Trabajas con marcas de alimentos?',
          answer:
            'Si. He trabajado con marcas de suplementos, snacks saludables y productos organicos. El formato funciona muy bien cuando el producto se puede mostrar en un contexto de preparacion o consumo real.',
        },
        {
          question: 'El contenido sirve tambien para ads?',
          answer:
            'Tecnicamente si, pero si lo que necesitas son piezas optimizadas para conversion, el servicio de UGC ads va a darte mejores resultados. El contenido lifestyle funciona mejor como pieza organica o de awareness.',
        },
      ],
      ctaTitle: 'Si tu marca de lifestyle necesita contenido autentico, hablemos',
      ctaText:
        'Cuentame el producto, el tono que buscas y donde vas a publicar. Te digo como integrarlo en un contenido que se sienta real.',
      relatedTitle: 'Servicios relacionados',
      relatedServiceIds: ['ugc-lifestyle', 'ugc-testimonials-reviews', 'ugc-broll-footage'],
    },
    en: {
      navLabel: 'Lifestyle and wellness UGC',
      metaTitle: 'Lifestyle and wellness UGC creator | Gisela Saldarriaga',
      metaDescription:
        'UGC creator for lifestyle, wellness, and healthy living brands: reviews, organic content, and ads with natural tone to connect with your audience.',
      breadcrumbLabel: 'Lifestyle and wellness UGC',
      heroEyebrow: 'Lifestyle and wellness vertical',
      heroTitle: 'UGC for lifestyle and wellness brands that want authentic content',
      heroSummary:
        'I produce UGC videos for wellness, healthy food, fitness, home, and lifestyle brands. Pieces with a natural tone that integrate the product into real everyday moments. Content that feels like a recommendation between friends, not an ad.',
      heroPoints: [
        'Wellness, fitness, home and food',
        'Natural tone and real moments',
        'For ads, reels and organic content',
      ],
      primaryCtaLabel: 'Start a project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'View portfolio',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'Why lifestyle UGC connects better',
      sectionIntroText:
        'In lifestyle and wellness, people do not buy products - they buy versions of the life they want to have. A UGC video where a real person uses the product in their routine, in their kitchen, in their self-care moment, creates an emotional connection that no studio content can replicate. The creator-led format works because it conveys attainable aspiration, not advertising.',
      deliverablesTitle: 'Formats that work best in lifestyle',
      deliverables: [
        {
          title: 'Daily routine content',
          description: 'Videos where the product appears naturally within my wellness, cooking, or self-care routine.',
        },
        {
          title: 'Reviews with personal experience',
          description: 'Pieces where I share how I use the product, what I like about it, and why I would honestly recommend it.',
        },
        {
          title: 'Ads with lifestyle tone',
          description: 'Creatives for TikTok and Meta that open with a real moment and close with benefit and a soft CTA.',
        },
        {
          title: 'Organic feed content',
          description: 'Pieces designed for brand feeds: no hard-sell format, polished aesthetic, and natural tone.',
        },
      ],
      bestFitTitle: 'Best fit',
      bestFitItems: [
        'Wellness, supplement, healthy food, or fitness brands that want content with a real face and relatable tone.',
        'Home, fragrance, or personal care brands that need to show the product in a real-life context.',
        'Teams looking for content for organic feed and also for ads with a non-aggressive lifestyle tone.',
      ],
      notFitTitle: 'Not the best fit if',
      notFitItems: [
        'The product needs technical demonstration or verified scientific claims.',
        'You are looking for content with multiple locations, travel, or complex outdoor production.',
        'You need an influencer with their own audience to amplify the content organically.',
      ],
      marketTitle: 'Where this content is typically used',
      marketItems: [
        'Organic brand feed on Instagram and TikTok to build community and trust.',
        'TikTok Ads and Meta Ads with lifestyle formats that convert without feeling intrusive.',
        'Product pages and landing pages where video shows the product in an aspirational context.',
      ],
      processTitle: 'How I work a lifestyle project',
      processSteps: [
        {
          title: '1. Product and vision',
          description: 'Tell me what you sell, what lifestyle you want to associate with the product, and where you plan to use the content.',
        },
        {
          title: '2. Moments and structure',
          description: 'I define which moments of the day to integrate the product: morning, routine, cooking, self-care.',
        },
        {
          title: '3. Natural recording',
          description: 'I shoot in real environments with natural light, no staged set. The product fits into the moment, not the other way around.',
        },
        {
          title: '4. Multi-use delivery',
          description: 'You receive pieces ready for feed, ads, landing pages, or email. With consistent aesthetic.',
        },
      ],
      featuredTitle: 'Lifestyle and wellness UGC examples',
      featuredIntro: 'These pieces show what lifestyle UGC looks like with natural tone and integrated product.',
      featuredExamples: [
        {
          clipId: 8,
          title: 'Lifestyle piece with perfume',
          description: 'Video with aspirational tone and polished aesthetic positioning the product in a style moment.',
        },
        {
          clipId: 1002,
          title: 'Organic content for Spain-based brand',
          description: 'Piece with natural tone designed for the organic feed of a wellness brand.',
        },
        {
          clipId: 1004,
          title: 'Restaurant experience review',
          description: 'Gastronomy experience video with a relatable tone and honest recommendation.',
        },
      ],
      faqTitle: 'FAQs about lifestyle and wellness UGC',
      faqs: [
        {
          question: 'What is the difference between lifestyle content and UGC ads?',
          answer:
            'Lifestyle content is designed for organic feed: the product appears in a real moment, without an aggressive sales hook. UGC ads have retention and conversion structure for paid placement. I can produce both formats depending on what you need.',
        },
        {
          question: 'Do you need me to send the product?',
          answer:
            'Yes, in most cases. For the content to be authentic I need to actually use the product. I coordinate shipping to Medellin with the brand.',
        },
        {
          question: 'Do you work with food brands?',
          answer:
            'Yes. I have worked with supplement, healthy snack, and organic product brands. The format works very well when the product can be shown in a real preparation or consumption context.',
        },
        {
          question: 'Can the content also be used as ads?',
          answer:
            'Technically yes, but if what you need are pieces optimized for conversion, the UGC ads service will give you better results. Lifestyle content works best as organic or awareness content.',
        },
      ],
      ctaTitle: 'If your lifestyle brand needs authentic content, let us talk',
      ctaText:
        'Tell me the product, the tone you are looking for, and where you plan to publish. I will tell you how to integrate it into content that feels real.',
      relatedTitle: 'Related services',
      relatedServiceIds: ['ugc-lifestyle', 'ugc-testimonials-reviews', 'ugc-broll-footage'],
    },
  },
};

export const getVerticalPageContent = (verticalId: VerticalPageId, locale: SiteLocale): VerticalPageContent => {
  const localized = VERTICAL_PAGE_CONTENT[verticalId][locale];

  return {
    ...localized,
    id: verticalId,
    locale,
    path: getVerticalPath(verticalId, locale),
    alternatePath: getVerticalPath(verticalId, locale === 'es' ? 'en' : 'es'),
  };
};

export const getVerticalPageRouteEntries = () => {
  const verticalIds = Object.keys(VERTICAL_PAGE_CONTENT) as VerticalPageId[];
  return verticalIds.flatMap((verticalId) => [
    { verticalId, locale: 'es' as SiteLocale, path: getVerticalPath(verticalId, 'es') },
    { verticalId, locale: 'en' as SiteLocale, path: getVerticalPath(verticalId, 'en') },
  ]);
};

export const getAllVerticalIds = (): VerticalPageId[] =>
  Object.keys(VERTICAL_PAGE_CONTENT) as VerticalPageId[];
