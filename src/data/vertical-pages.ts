import type { VerticalPageId, ServicePageId, SiteLocale } from '@/lib/locale-path';
import { getHomePath, getResourcePath, getServicePath, getVerticalPath } from '@/lib/locale-path';

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
        'Creadora UGC para marcas de beauty. Grabo videos de skincare, maquillaje y suplementos para anuncios, reels y landing pages, en español e inglés.',
      breadcrumbLabel: 'UGC beauty',
      heroEyebrow: 'Belleza y cuidado personal',
      heroTitle: 'UGC para marcas de beauty: videos de skincare, maquillaje y suplementos',
      heroSummary:
        'Grabo videos UGC para marcas de skincare, maquillaje, suplementos y cuidado personal. Uso el producto en mi piel, cuento cómo se siente y te entrego los videos listos para anuncios, reels o la página de producto.',
      heroPoints: [
        'Skincare, maquillaje y suplementos',
        'Para anuncios, reels y landing pages',
        'Trabajo en remoto desde Medellín',
      ],
      primaryCtaLabel: 'Cuéntame tu proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Por qué usar UGC en belleza',
      sectionIntroText:
        `Antes de comprar un sérum o una base, la gente quiere verlos en una piel de verdad. Quiere saber qué textura tienen, cómo se aplican y cómo se ven después. Cuando alguien los usa en su rutina y los explica con sus propias palabras, el video se siente como la recomendación de una persona que de verdad usa el producto. Por eso el UGC funciona tan bien en belleza. Si quieres contratar una [creadora UGC de belleza en español e inglés](${getServicePath('bilingual-ugc-creator', 'es')}), mira primero [cómo contratar una creadora UGC bilingüe](${getResourcePath('how-to-hire-ugc-creator', 'es')}).`,
      deliverablesTitle: 'Qué videos hago para marcas de belleza',
      deliverables: [
        {
          title: 'Reseñas de producto',
          description: 'Muestro el producto y te cuento cómo es la textura, cómo se aplica y qué resultado me dio.',
        },
        {
          title: 'Rutinas y tutoriales',
          description: 'Uso el producto paso a paso dentro de una rutina real de skincare o maquillaje.',
        },
        {
          title: 'Anuncios para TikTok y Meta',
          description: 'Abro con el producto en pantalla, lo aplico frente a cámara y cierro con un llamado a la acción para comprar.',
        },
        {
          title: 'Testimonios',
          description: 'Cuento en primera persona mi experiencia con el producto, para que quien vea el video sepa qué esperar antes de comprarlo.',
        },
      ],
      bestFitTitle: 'Para quién es',
      bestFitItems: [
        'Marcas de skincare, maquillaje o suplementos de belleza que venden online y quieren mostrar el producto en una persona real.',
        'Equipos que pautan en TikTok Ads o Meta Ads y necesitan videos con un buen gancho y un cierre de venta claro.',
        'Marcas que le venden a público hispano y anglo y quieren los mismos videos en español y en inglés.',
      ],
      notFitTitle: 'No te conviene si',
      notFitItems: [
        'Necesitas una maquilladora profesional que muestre técnicas avanzadas.',
        'Buscas una sesión de estudio con set armado y equipo de producción.',
        'El video tiene que hacer afirmaciones clínicas que necesitan respaldo médico.',
      ],
      marketTitle: 'Dónde se usan estos videos',
      marketItems: [
        'Anuncios en TikTok y Meta para público de Estados Unidos, España y Latinoamérica.',
        'Páginas de producto y landing pages, para que el cliente vea el producto en uso antes de comprar.',
        'Publicaciones orgánicas en el Instagram y el TikTok de la marca.',
      ],
      processTitle: 'Cómo trabajamos',
      processSteps: [
        {
          title: '1. Producto y objetivo',
          description: 'Me cuentas qué producto es, a quién se lo vendes y qué quieres que haga la persona después de ver el video.',
        },
        {
          title: '2. Guion',
          description: 'Armo la estructura: un gancho al inicio, el producto en uso y un cierre con el beneficio principal.',
        },
        {
          title: '3. Grabación',
          description: 'Grabo aplicando el producto en mi piel, con luz natural y en formato vertical.',
        },
        {
          title: '4. Entrega',
          description: 'Te mando los videos editados, listos para pauta, landing page o feed. Incluyen 1 a 2 rondas de revisión.',
        },
      ],
      featuredTitle: 'Ejemplos de mi trabajo',
      featuredIntro: 'Aquí puedes ver cómo hablo a cámara y cómo presento un producto.',
      featuredExamples: [
        {
          clipId: 4,
          title: 'Reseña de suplemento de creatina (Curvella)',
          description: 'Cuento los beneficios del producto con mis palabras, en un video armado para usarse como anuncio.',
        },
        {
          clipId: 1013,
          title: 'Testimonio de un producto fitness',
          description: 'Cuento en primera persona mi experiencia con un producto fitness.',
        },
        {
          clipId: 1,
          title: 'Reseña de productos de Temu',
          description: 'Uso el producto frente a cámara y digo con sinceridad qué me pareció.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre UGC para belleza',
      faqs: [
        {
          question: '¿Tengo que enviarte el producto?',
          answer:
            'Sí, casi siempre, sobre todo si es skincare o maquillaje. Necesito tenerlo en la mano para mostrar la textura, cómo se aplica y cómo queda de verdad. Con suplementos a veces basta con el envase y un brief detallado.',
        },
        {
          question: '¿Haces tutoriales de maquillaje con técnicas avanzadas?',
          answer:
            'No. No hago tutoriales de maquillaje artístico. Lo que hago es mostrar tu producto de forma natural, como lo recomendaría alguien que lo usa todos los días.',
        },
        {
          question: '¿Estos videos sirven solo para anuncios?',
          answer:
            'No. También los puedes usar en la página de producto, en landing pages, en email marketing o en tus redes. Un buen video de producto te sirve por mucho tiempo y en varios canales.',
        },
        {
          question: '¿Trabajas con marcas fuera de Colombia?',
          answer:
            'Sí. Trabajo con marcas de Estados Unidos, España, Australia y Latinoamérica. Todo lo coordinamos en remoto y me envías el producto a Medellín.',
        },
      ],
      ctaTitle: '¿Necesitas videos para tu marca de belleza?',
      ctaText:
        'Escríbeme y cuéntame qué producto tienes, qué formato necesitas y dónde lo vas a usar. Te respondo con una propuesta.',
      relatedTitle: 'Servicios relacionados',
      relatedServiceIds: ['ugc-testimonials-reviews', 'ugc-lifestyle', 'ugc-ads-tiktok-meta'],
    },
    en: {
      navLabel: 'Beauty UGC',
      metaTitle: 'Beauty UGC creator | Gisela Saldarriaga',
      metaDescription:
        'Beauty UGC creator for skincare, makeup, and supplement brands. I make videos for ads, reels, and landing pages, in English and Spanish.',
      breadcrumbLabel: 'Beauty UGC',
      heroEyebrow: 'Beauty and personal care',
      heroTitle: 'UGC for beauty brands: skincare, makeup, and supplement videos',
      heroSummary:
        'I make UGC videos for skincare, makeup, supplement, and personal care brands. I use the product on my own skin, talk about how it feels, and send you videos ready for ads, reels, or your product page.',
      heroPoints: [
        'Skincare, makeup, and supplements',
        'For ads, reels, and landing pages',
        'Working remotely from Medellín',
      ],
      primaryCtaLabel: 'Tell me about your project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'Why use UGC for beauty',
      sectionIntroText:
        `Before someone buys a serum or a foundation, they want to see it on real skin. What’s the texture like? How do you apply it? How does it look afterward? When a real person uses it in their routine and talks about it in their own words, the video comes across as a recommendation from someone who actually uses the product. That’s why UGC works so well in beauty. If you want to hire a [bilingual beauty UGC creator](${getServicePath('bilingual-ugc-creator', 'en')}), start with [how to hire a bilingual UGC creator](${getResourcePath('how-to-hire-ugc-creator', 'en')}).`,
      deliverablesTitle: 'What I make for beauty brands',
      deliverables: [
        {
          title: 'Product reviews',
          description: 'I show the product and talk about the texture, how it goes on, and what results I got.',
        },
        {
          title: 'Routines and tutorials',
          description: 'I walk through a real skincare or makeup routine with your product in it, step by step.',
        },
        {
          title: 'TikTok and Meta ads',
          description: 'I open with the product on screen, apply it on camera, and close with a call to action to buy.',
        },
        {
          title: 'Testimonials',
          description: 'I talk about my own experience with the product, so viewers know what to expect before they buy.',
        },
      ],
      bestFitTitle: 'Who it’s for',
      bestFitItems: [
        'Skincare, makeup, or beauty supplement brands that sell online and want their product shown on a real person.',
        'Teams running TikTok Ads or Meta Ads who need videos with a strong hook and a clear push to buy.',
        'Brands selling to both Spanish and English speakers that want the same videos in both languages.',
      ],
      notFitTitle: 'This isn’t for you if',
      notFitItems: [
        'You need a professional makeup artist to show advanced techniques.',
        'You want a studio shoot with a built set and a production crew.',
        'Your video has to make clinical claims that need medical backing.',
      ],
      marketTitle: 'Where these videos get used',
      marketItems: [
        'TikTok and Meta ads for audiences in the US, Spain, and Latin America.',
        'Product pages and landing pages, so shoppers can see the product in use before they buy.',
        'Organic posts on the brand’s Instagram and TikTok.',
      ],
      processTitle: 'How we work together',
      processSteps: [
        {
          title: '1. Product and goal',
          description: 'You tell me about the product, who you sell it to, and what you want people to do after watching.',
        },
        {
          title: '2. Script',
          description: 'I put together the structure: a hook up front, the product in use, and a close on the main benefit.',
        },
        {
          title: '3. Filming',
          description: 'I film myself applying the product, in natural light and in vertical format.',
        },
        {
          title: '4. Delivery',
          description: 'I send you edited videos ready for ads, landing pages, or your feed. One to two revision rounds are included.',
        },
      ],
      featuredTitle: 'Examples of my work',
      featuredIntro: 'Here you can see how I talk to camera and present a product.',
      featuredExamples: [
        {
          clipId: 4,
          title: 'Creatine supplement review (Curvella)',
          description: 'I talk through the product’s benefits in my own words, in a video cut to run as an ad.',
        },
        {
          clipId: 1013,
          title: 'Fitness product testimonial',
          description: 'I share my own experience with a fitness product.',
        },
        {
          clipId: 1,
          title: 'Temu product review',
          description: 'I use the product on camera and give my honest take on it.',
        },
      ],
      faqTitle: 'Common questions about beauty UGC',
      faqs: [
        {
          question: 'Do I need to send you the product?',
          answer:
            'Almost always, yes, especially for skincare and makeup. I need it in hand to show the texture, how it goes on, and how it actually looks. For supplements, the packaging and a detailed brief are sometimes enough.',
        },
        {
          question: 'Can you do makeup tutorials with advanced techniques?',
          answer:
            'No. I don’t do artistic makeup tutorials. What I do is show your product in a natural way, the way someone who uses it every day would recommend it.',
        },
        {
          question: 'Are these videos only for ads?',
          answer:
            'No. You can also use them on product pages, landing pages, in email marketing, or on your social accounts. A good product video keeps working for a long time and across several channels.',
        },
        {
          question: 'Do you work with brands outside Colombia?',
          answer:
            'Yes. I work with brands in the US, Spain, Australia, and Latin America. We handle everything remotely, and you ship the product to me in Medellín.',
        },
      ],
      ctaTitle: 'Need videos for your beauty brand?',
      ctaText:
        'Message me with the product, the format you need, and where you’ll use it. I’ll get back to you with a plan.',
      relatedTitle: 'Related services',
      relatedServiceIds: ['ugc-testimonials-reviews', 'ugc-lifestyle', 'ugc-ads-tiktok-meta'],
    },
  },

  'fashion-ugc': {
    es: {
      navLabel: 'UGC para moda',
      metaTitle: 'Creadora UGC para marcas de moda | Gisela Saldarriaga',
      metaDescription:
        'Creadora UGC para marcas de moda y accesorios. Grabo try-ons, hauls y reseñas de outfits para anuncios, reels y tiendas online de ropa.',
      breadcrumbLabel: 'UGC moda',
      heroEyebrow: 'Moda y accesorios',
      heroTitle: 'UGC para marcas de moda: try-ons, hauls y reseñas de outfits',
      heroSummary:
        'Grabo videos UGC para marcas de ropa, accesorios, calzado y joyería. Me pruebo las prendas, muestro cómo quedan puestas y digo lo que pienso de verdad. Te entrego videos para anuncios, reels o la página de producto.',
      heroPoints: [
        'Ropa, accesorios, calzado y joyería',
        'Hauls, try-ons y reseñas de outfits',
        'Para TikTok Ads, Meta Ads y ecommerce',
      ],
      primaryCtaLabel: 'Cuéntame tu proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Por qué usar UGC en moda',
      sectionIntroText:
        `En moda, la gente quiere ver la ropa puesta en alguien real antes de comprarla. Una foto de estudio no te dice cómo cae la tela, si la talla viene pequeña o con qué combinarla. Un video donde me pruebo la prenda y doy mi opinión responde esas dudas mucho mejor que un catálogo. Si buscas una [creadora UGC de moda en español e inglés](${getServicePath('bilingual-ugc-creator', 'es')}), aquí tienes una [guía para contratar una creadora UGC](${getResourcePath('how-to-hire-ugc-creator', 'es')}).`,
      deliverablesTitle: 'Qué videos hago para marcas de moda',
      deliverables: [
        {
          title: 'Try-on y haul',
          description: 'Me pruebo las prendas, muestro cómo quedan y comento la calidad, la talla y el corte.',
        },
        {
          title: 'Reseñas de outfits',
          description: 'Explico para qué ocasión sirve cada prenda y cómo combinarla.',
        },
        {
          title: 'Anuncios con el look completo',
          description: 'Anuncios para pauta con un gancho visual al inicio, transiciones entre outfits y un llamado a comprar.',
        },
        {
          title: 'Contenido lifestyle de moda',
          description: 'Videos para tus redes donde la prenda aparece en mi día a día, sin tono de venta.',
        },
      ],
      bestFitTitle: 'Para quién es',
      bestFitItems: [
        'Marcas de ropa, accesorios o calzado que venden online y quieren mostrar sus prendas en una persona real.',
        'Equipos de ecommerce que necesitan videos para la página de producto que muestren cómo queda la prenda y qué calidad tiene.',
        'Marcas que buscan videos de moda para TikTok o Instagram que la gente vea hasta el final.',
      ],
      notFitTitle: 'No te conviene si',
      notFitItems: [
        'Necesitas varias modelos con distintos tipos de cuerpo para la misma campaña.',
        'Buscas una producción de moda con fotógrafo, estilista y set.',
        'Tu producto necesita una explicación técnica de los materiales o de cómo se fabrica.',
      ],
      marketTitle: 'Dónde se usan estos videos',
      marketItems: [
        'Anuncios en TikTok y Meta con formato de haul, try-on o reseña de outfit.',
        'Páginas de producto en Shopify u otras tiendas online, para que el cliente vea la prenda puesta.',
        'Reels de Instagram y videos de TikTok para el feed orgánico de la marca.',
      ],
      processTitle: 'Cómo trabajamos',
      processSteps: [
        {
          title: '1. Prendas y brief',
          description: 'Me envías las prendas y me dices qué quieres destacar: el corte, la calidad, lo fácil que es de combinar o el precio.',
        },
        {
          title: '2. Estructura',
          description: 'Decido en qué orden mostrar las prendas, cómo combinarlas y cuál es el mensaje principal.',
        },
        {
          title: '3. Grabación',
          description: 'Grabo probándome cada prenda, con distintos planos y transiciones entre looks, y comento qué me parece cada una.',
        },
        {
          title: '4. Entrega',
          description: 'Te mando los videos editados y listos para pauta o feed. Si quieres versiones con otro gancho u otro CTA, también te las hago. Incluyen 1 a 2 rondas de revisión.',
        },
      ],
      featuredTitle: 'Ejemplos de mi trabajo',
      featuredIntro: 'Uno es un try-on, otro es un video con una estética más cuidada y el último muestra cómo adapto el tono a cada marca.',
      featuredExamples: [
        {
          clipId: 1,
          title: 'Try-on de outfits de Temu',
          description: 'Me pruebo las prendas frente a cámara y comento la calidad de cada una.',
        },
        {
          clipId: 8,
          title: 'Video lifestyle con perfume',
          description: 'Un video con una estética más cuidada, donde el perfume es parte de la escena.',
        },
        {
          clipId: 6,
          title: 'Presentación de servicios',
          description: 'No es de moda, pero muestra cómo cambio el tono frente a cámara según lo que pide el brief.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre UGC para moda',
      faqs: [
        {
          question: '¿Tengo que enviarte las prendas?',
          answer:
            'Sí. Necesito tenerlas para probármelas y mostrar cómo quedan de verdad. El envío a Medellín lo coordinamos juntos.',
        },
        {
          question: '¿Puedes hacer hauls con muchas prendas?',
          answer:
            'Sí. Un haul de 4 a 8 prendas funciona muy bien. Si son más, lo dividimos en varios videos para que cada prenda tenga su tiempo en pantalla.',
        },
        {
          question: '¿Estos videos sirven para la página de producto?',
          answer:
            'Sí, y es uno de los mejores lugares para usarlos. Un video corto donde se ve cómo queda la prenda le ahorra al cliente tener que imaginárselo.',
        },
        {
          question: '¿Trabajas en inglés también?',
          answer:
            'Sí. Puedo grabar el mismo video en español y en inglés. En inglés trabajo con tu guion, de máximo 65 palabras por video, para que suene natural.',
        },
      ],
      ctaTitle: '¿Necesitas videos para tu marca de moda?',
      ctaText:
        'Escríbeme y cuéntame qué prendas quieres mostrar, dónde vas a usar los videos y si los necesitas en uno o en los dos idiomas.',
      relatedTitle: 'Servicios relacionados',
      relatedServiceIds: ['ugc-lifestyle', 'ugc-ads-tiktok-meta'],
    },
    en: {
      navLabel: 'Fashion UGC',
      metaTitle: 'Fashion UGC creator | Gisela Saldarriaga',
      metaDescription:
        'Fashion UGC creator for clothing and accessories brands. I film try-ons, hauls, and outfit reviews for ads, reels, and online stores.',
      breadcrumbLabel: 'Fashion UGC',
      heroEyebrow: 'Fashion and accessories',
      heroTitle: 'UGC for fashion brands: try-ons, hauls, and outfit reviews',
      heroSummary:
        'I make UGC videos for clothing, accessories, footwear, and jewelry brands. I try the pieces on, show how they fit, and say what I actually think. You get videos for ads, reels, or your product pages.',
      heroPoints: [
        'Clothing, accessories, and footwear',
        'Hauls, try-ons, and outfit reviews',
        'For TikTok Ads, Meta Ads, and ecommerce',
      ],
      primaryCtaLabel: 'Tell me about your project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'Why use UGC for fashion',
      sectionIntroText:
        `People want to see clothes on a real person before they buy. A studio photo won’t tell you how the fabric moves, whether the size runs small, or what to wear it with. A video of me trying it on and saying what I think answers those questions better than any catalog. If you need a [bilingual fashion UGC creator](${getServicePath('bilingual-ugc-creator', 'en')}), start with this [guide to hiring a UGC creator](${getResourcePath('how-to-hire-ugc-creator', 'en')}).`,
      deliverablesTitle: 'What I make for fashion brands',
      deliverables: [
        {
          title: 'Try-ons and hauls',
          description: 'I try on the pieces, show how they fit, and comment on the quality, sizing, and cut.',
        },
        {
          title: 'Outfit reviews',
          description: 'I explain what each piece works for and how to style it.',
        },
        {
          title: 'Full-look ads',
          description: 'Paid ads with a visual hook at the start, outfit transitions, and a call to shop.',
        },
        {
          title: 'Fashion lifestyle content',
          description: 'Videos for your social accounts where the piece shows up in my everyday life, without a sales pitch.',
        },
      ],
      bestFitTitle: 'Who it’s for',
      bestFitItems: [
        'DTC clothing, accessories, or footwear brands that sell online and want their pieces shown on a real person.',
        'Ecommerce teams that need product page videos showing how a piece fits and what the quality is like.',
        'Brands that want fashion videos for TikTok or Instagram that people watch all the way through.',
      ],
      notFitTitle: 'This isn’t for you if',
      notFitItems: [
        'You need several models with different body types for the same campaign.',
        'You want a fashion shoot with a photographer, a stylist, and a set.',
        'Your product needs a technical explanation of the materials or how it’s made.',
      ],
      marketTitle: 'Where these videos get used',
      marketItems: [
        'TikTok and Meta ads using haul, try-on, or outfit review formats.',
        'Product pages on Shopify or other online stores, so shoppers can see the piece being worn.',
        'Instagram Reels and TikTok videos for the brand’s organic feed.',
      ],
      processTitle: 'How we work together',
      processSteps: [
        {
          title: '1. Pieces and brief',
          description: 'You send me the pieces and tell me what to highlight: the cut, the quality, how easy they are to style, or the price.',
        },
        {
          title: '2. Structure',
          description: 'I plan which pieces to show first, how to style them, and what the main message is.',
        },
        {
          title: '3. Filming',
          description: 'I film myself trying on each piece, with different angles and transitions between looks, and say what I think of each one.',
        },
        {
          title: '4. Delivery',
          description: 'I send you edited videos ready for ads or your feed. If you want versions with a different hook or CTA, I can make those too. One to two revision rounds are included.',
        },
      ],
      featuredTitle: 'Examples of my work',
      featuredIntro: 'One is a try-on, one is a more styled lifestyle video, and the last one shows how I adjust my tone to each brand.',
      featuredExamples: [
        {
          clipId: 1,
          title: 'Temu outfit try-on',
          description: 'I try on the pieces on camera and talk about the quality of each one.',
        },
        {
          clipId: 8,
          title: 'Lifestyle video with a perfume',
          description: 'A more styled video where the perfume is part of the scene.',
        },
        {
          clipId: 6,
          title: 'Services presentation',
          description: 'Not a fashion video, but it shows how I change my tone on camera to fit the brief.',
        },
      ],
      faqTitle: 'Common questions about fashion UGC',
      faqs: [
        {
          question: 'Do I need to send you the clothes?',
          answer:
            'Yes. I need them in hand to try them on and show how they actually fit. We’ll sort out shipping to Medellín together.',
        },
        {
          question: 'Can you do hauls with a lot of pieces?',
          answer:
            'Yes. Hauls with 4 to 8 pieces work well. If you have more, we split them into several videos so each piece gets enough screen time.',
        },
        {
          question: 'Can I use these videos on my product pages?',
          answer:
            'Yes, and it’s one of the best places for them. A short video of the piece being worn saves shoppers from having to imagine it.',
        },
        {
          question: 'Do you also film in English?',
          answer:
            'Yes. I can film the same video in Spanish and in English. For English, I work from your script, up to 65 words per video, so it sounds natural.',
        },
      ],
      ctaTitle: 'Need videos for your fashion brand?',
      ctaText:
        'Message me with the pieces you want to show, where you’ll use the videos, and whether you need them in one language or both.',
      relatedTitle: 'Related services',
      relatedServiceIds: ['ugc-lifestyle', 'ugc-ads-tiktok-meta'],
    },
  },

  'tech-saas-ugc': {
    es: {
      navLabel: 'UGC para tech y SaaS',
      metaTitle: 'Creadora UGC para tech y SaaS | Gisela Saldarriaga',
      metaDescription:
        'Creadora UGC para marcas de tech, SaaS y apps. Grabo demos, reseñas y videos explicativos para anuncios, landing pages y onboarding.',
      breadcrumbLabel: 'UGC tech y SaaS',
      heroEyebrow: 'Tech, SaaS y apps',
      heroTitle: 'UGC para marcas tech y SaaS: demos y videos que explican tu producto',
      heroSummary:
        'Grabo videos UGC para empresas de tecnología, SaaS y apps. Hago demos, reseñas y videos explicativos donde muestro el producto funcionando y explico para qué sirve con palabras simples, para que la gente lo entienda rápido y quiera probarlo.',
      heroPoints: [
        'SaaS, apps, IA y servicios digitales',
        'Demos, reseñas y videos explicativos',
        'Para anuncios, landing pages y onboarding',
      ],
      primaryCtaLabel: 'Cuéntame tu proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Por qué usar UGC en tech y SaaS',
      sectionIntroText:
        `Con un producto tech, lo que más frena la compra es no entenderlo. Si en los primeros segundos la persona no sabe qué hace tu herramienta, sigue deslizando. En un video UGC, una persona real la explica, la muestra funcionando y la relaciona con un problema que tu cliente ya tiene. Se siente como la recomendación de alguien que ya la probó. Si necesitas una [creadora UGC bilingüe para tech y SaaS](${getServicePath('bilingual-ugc-creator', 'es')}), revisa antes [qué pedir al contratar una creadora UGC](${getResourcePath('how-to-hire-ugc-creator', 'es')}).`,
      deliverablesTitle: 'Qué videos hago para marcas tech y SaaS',
      deliverables: [
        {
          title: 'Demo de producto',
          description: 'Muestro el producto funcionando y explico paso a paso cómo se usa.',
        },
        {
          title: 'Reseña con experiencia real',
          description: 'Pruebo el producto y cuento cómo me fue, para que tu cliente confíe antes de registrarse.',
        },
        {
          title: 'Anuncios explicativos',
          description: 'Anuncios para TikTok y Meta que empiezan por un problema, presentan tu producto como la solución y cierran con un llamado a la acción claro.',
        },
        {
          title: 'Videos de onboarding',
          description: 'Videos de bienvenida o tutoriales cortos para que un usuario nuevo entienda el producto y empiece a usarlo.',
        },
      ],
      bestFitTitle: 'Para quién es',
      bestFitItems: [
        'Empresas de SaaS, apps o IA que necesitan explicarle su producto a gente que no es técnica.',
        'Equipos de marketing que necesitan anuncios UGC para conseguir usuarios en TikTok y Meta.',
        'Startups que quieren un video en su landing page para que la gente entienda el producto antes de irse.',
      ],
      notFitTitle: 'No te conviene si',
      notFitItems: [
        'Necesitas solo una grabación de pantalla, sin nadie frente a cámara.',
        'El producto necesita una demostración tan técnica que solo la puede hacer un ingeniero.',
        'Buscas un webinar o un curso largo, no un video de marketing.',
      ],
      marketTitle: 'Dónde se usan estos videos',
      marketItems: [
        'Anuncios en TikTok y Meta para conseguir usuarios para tu SaaS o tu app.',
        'Landing pages y páginas de producto, con un video que explica qué hace tu herramienta.',
        'Onboarding y secuencias de email, para que los usuarios nuevos empiecen a usar el producto más rápido.',
      ],
      processTitle: 'Cómo trabajamos',
      processSteps: [
        {
          title: '1. Producto y contexto',
          description: 'Me explicas qué hace tu producto, quién lo usa y cuál es el beneficio principal que quieres destacar.',
        },
        {
          title: '2. Guion',
          description: 'Escribo un guion corto: problema, solución, demo rápida y cierre con un llamado a la acción. Sin palabras técnicas que tu cliente no usaría.',
        },
        {
          title: '3. Grabación',
          description: 'Combino partes hablando a cámara con el producto en pantalla, funcionando.',
        },
        {
          title: '4. Entrega',
          description: 'Te mando los videos listos para anuncios, landing page o email, y versiones con otro gancho si las necesitas. Incluyen 1 a 2 rondas de revisión.',
        },
      ],
      featuredTitle: 'Ejemplos de mi trabajo',
      featuredIntro: 'Tres videos de productos de IA: una reseña con demo, una demo en vivo y un anuncio.',
      featuredExamples: [
        {
          clipId: 3,
          title: 'Reseña y demo de voicebot (Calvotia)',
          description: 'Empieza como testimonio y pasa a explicar qué hace el producto y para qué sirve.',
        },
        {
          clipId: 1008,
          title: 'Demo en vivo de un voicebot automotriz',
          description: 'Hablo con un bot de IA en tiempo real para mostrar cómo responde.',
        },
        {
          clipId: 1009,
          title: 'Anuncio de un voicebot para WhatsApp',
          description: 'Anuncio corto que presenta un producto de IA y cierra con un llamado a la acción directo.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre UGC para tech y SaaS',
      faqs: [
        {
          question: '¿Puedes explicar un producto técnico sin que suene complicado?',
          answer:
            'Sí. Tengo más de 9 años de experiencia en periodismo y medios, y ahí aprendí a explicar temas complejos con palabras simples. Hago lo mismo cuando armo una demo o explico un producto.',
        },
        {
          question: '¿Tengo que darte acceso a mi plataforma?',
          answer:
            'Depende del formato. Para una demo necesito ver el producto funcionando. Para una reseña puedo trabajar con capturas de pantalla, un brief detallado o un acceso temporal.',
        },
        {
          question: '¿Sirve para campañas de adquisición o solo para retención?',
          answer:
            'Para las dos cosas. Los videos explicativos funcionan muy bien con gente que todavía no conoce tu producto, y también en el onboarding, cuando necesitas que el usuario nuevo empiece a usarlo.',
        },
        {
          question: '¿Puedes hacer videos en inglés para mi audiencia estadounidense?',
          answer:
            'Sí, trabajo en español y en inglés. En inglés grabo a partir de tu guion, de máximo 65 palabras por video, para que suene natural.',
        },
      ],
      ctaTitle: '¿Necesitas videos para tu producto tech?',
      ctaText:
        'Escríbeme y cuéntame qué hace tu producto, quién lo usa y dónde vas a poner los videos. Te respondo con una propuesta.',
      relatedTitle: 'Servicios relacionados',
      relatedServiceIds: ['ugc-product-demo', 'ugc-ads-tiktok-meta', 'ugc-problem-solution'],
    },
    en: {
      navLabel: 'Tech and SaaS UGC',
      metaTitle: 'Tech and SaaS UGC creator | Gisela Saldarriaga',
      metaDescription:
        'Tech and SaaS UGC creator. I film demos, reviews, and explainer videos for tech, SaaS, and app brands to use in ads, landing pages, and onboarding.',
      breadcrumbLabel: 'Tech and SaaS UGC',
      heroEyebrow: 'Tech, SaaS, and apps',
      heroTitle: 'UGC for tech and SaaS brands: demos and videos that explain your product',
      heroSummary:
        'I make UGC videos for tech, SaaS, and app companies. Demos, reviews, and explainers where I show the product working and explain what it does in plain words, so people get it fast and want to try it.',
      heroPoints: [
        'SaaS, apps, AI, and digital services',
        'Demos, reviews, and explainer videos',
        'For ads, landing pages, and onboarding',
      ],
      primaryCtaLabel: 'Tell me about your project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'Why use UGC for tech and SaaS',
      sectionIntroText:
        `With tech products, the biggest thing stopping a sale is usually confusion. If someone can’t tell what your tool does in the first few seconds, they scroll past. In a UGC video, a real person explains it, shows it working, and ties it to a problem your customer already has. It comes across as a recommendation from someone who’s tried it. To [hire a bilingual SaaS UGC creator](${getServicePath('bilingual-ugc-creator', 'en')}), start with [what to ask before hiring a UGC creator](${getResourcePath('how-to-hire-ugc-creator', 'en')}).`,
      deliverablesTitle: 'What I make for tech and SaaS brands',
      deliverables: [
        {
          title: 'Product demos',
          description: 'I show the product working and walk through how to use it, step by step.',
        },
        {
          title: 'Reviews from real use',
          description: 'I try the product and talk about how it went, so your customers trust it before they sign up.',
        },
        {
          title: 'Explainer ads',
          description: 'TikTok and Meta ads that open with a problem, show your product as the fix, and end with a clear call to action.',
        },
        {
          title: 'Onboarding videos',
          description: 'Welcome videos or short tutorials that help new users understand the product and start using it.',
        },
      ],
      bestFitTitle: 'Who it’s for',
      bestFitItems: [
        'SaaS, app, or AI companies that need to explain their product to people who aren’t technical.',
        'Growth teams that need UGC ads to bring in users on TikTok and Meta.',
        'Startups that want a video on their landing page so visitors understand the product before they leave.',
      ],
      notFitTitle: 'This isn’t for you if',
      notFitItems: [
        'You only need a screen recording, with nobody on camera.',
        'The product needs a demo so technical that only an engineer could do it.',
        'You’re looking for a webinar or a long course, not a marketing video.',
      ],
      marketTitle: 'Where these videos get used',
      marketItems: [
        'TikTok and Meta ads to get new users for your SaaS or app.',
        'Landing pages and product pages, with a video that explains what your tool does.',
        'Onboarding and email sequences, so new users start using the product sooner.',
      ],
      processTitle: 'How we work together',
      processSteps: [
        {
          title: '1. Product and context',
          description: 'You walk me through what your product does, who uses it, and the main benefit you want to highlight.',
        },
        {
          title: '2. Script',
          description: 'I write a short script: problem, solution, quick demo, and a call to action. No jargon your customers wouldn’t use.',
        },
        {
          title: '3. Filming',
          description: 'I mix talking-to-camera shots with the product on screen, working.',
        },
        {
          title: '4. Delivery',
          description: 'I send you videos ready for ads, landing pages, or email, plus alternate hooks if you need them. One to two revision rounds are included.',
        },
      ],
      featuredTitle: 'Examples of my work',
      featuredIntro: 'Three videos for AI products: a review with a demo, a live demo, and an ad.',
      featuredExamples: [
        {
          clipId: 3,
          title: 'Voicebot review and demo (Calvotia)',
          description: 'It starts as a testimonial and moves into what the product does and who it’s for.',
        },
        {
          clipId: 1008,
          title: 'Live demo of an automotive voicebot',
          description: 'I talk to an AI bot in real time to show how it responds.',
        },
        {
          clipId: 1009,
          title: 'WhatsApp voicebot ad',
          description: 'A short ad that introduces an AI product and ends with a direct call to action.',
        },
      ],
      faqTitle: 'Common questions about tech and SaaS UGC',
      faqs: [
        {
          question: 'Can you explain a technical product without making it sound complicated?',
          answer:
            'Yes. I have over nine years of experience in journalism and media, where I learned to explain complex topics in simple words. I do the same thing when I put together a demo or explain a product.',
        },
        {
          question: 'Do I need to give you access to my platform?',
          answer:
            'It depends on the format. For a demo, I need to see the product working. For a review, I can work from screenshots, a detailed brief, or temporary access.',
        },
        {
          question: 'Does this work for acquisition campaigns or only for retention?',
          answer:
            'Both. Explainer videos work well with people who don’t know your product yet, and also in onboarding, when you need new users to start using it.',
        },
        {
          question: 'Can you produce videos in English for my US audience?',
          answer:
            'Yes, I work in Spanish and English. For English videos, I work from your script, up to 65 words per video, so it sounds natural.',
        },
      ],
      ctaTitle: 'Need videos for your tech product?',
      ctaText:
        'Message me with what your product does, who uses it, and where the videos will run. I’ll get back to you with a plan.',
      relatedTitle: 'Related services',
      relatedServiceIds: ['ugc-product-demo', 'ugc-ads-tiktok-meta', 'ugc-problem-solution'],
    },
  },

  'ecommerce-ugc': {
    es: {
      navLabel: 'UGC para ecommerce',
      metaTitle: 'Creadora UGC para ecommerce | Gisela Saldarriaga',
      metaDescription:
        'Creadora UGC para ecommerce. Grabo reseñas, unboxings, demos y anuncios para tiendas online que quieren mostrar su producto en uso real.',
      breadcrumbLabel: 'UGC ecommerce',
      heroEyebrow: 'Tiendas online',
      heroTitle: 'UGC para ecommerce: reseñas, unboxings y demos con tu producto',
      heroSummary:
        'Grabo videos UGC para tiendas online de cualquier categoría. Hago reseñas, unboxings, demos y anuncios donde abro el producto, lo uso frente a cámara y cuento qué me pareció. Sirven justo donde las fotos de catálogo se quedan cortas.',
      heroPoints: [
        'Cualquier producto físico',
        'Reseñas, unboxings y demos de uso',
        'Para anuncios y páginas de producto',
      ],
      primaryCtaLabel: 'Cuéntame tu proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Por qué usar UGC en ecommerce',
      sectionIntroText:
        'Cuando alguien compra online, no puede tocar el producto, probárselo ni verlo de cerca. Un video donde una persona real lo abre, lo usa y da su opinión es lo más parecido a tenerlo en la mano. Eso ayuda a que el cliente compre con menos dudas, porque le cree más a una persona que a una foto.',
      deliverablesTitle: 'Qué videos hago para tiendas online',
      deliverables: [
        {
          title: 'Reseñas de producto',
          description: 'Muestro el producto, lo pruebo y doy mi opinión sincera sobre la calidad y cómo se usa.',
        },
        {
          title: 'Unboxings',
          description: 'Abro el paquete frente a cámara, veo el producto por primera vez y reacciono como lo haría cualquier cliente.',
        },
        {
          title: 'Anuncios de venta directa',
          description: 'Anuncios para TikTok y Meta con un gancho fuerte, el producto en uso y un llamado claro a comprar.',
        },
        {
          title: 'Videos para páginas de producto',
          description: 'Videos cortos para poner en la página de producto, para que el cliente vea lo que va a recibir.',
        },
      ],
      bestFitTitle: 'Para quién es',
      bestFitItems: [
        'Tiendas online que venden productos físicos y necesitan videos con una persona real para sus anuncios o páginas de producto.',
        'Marcas que venden directo al cliente, pautan en TikTok Ads o Meta Ads y quieren anuncios con tono natural y un cierre de venta claro.',
        'Equipos de ecommerce que reciben muchas preguntas o devoluciones porque el cliente no tenía claro qué estaba comprando.',
      ],
      notFitTitle: 'No te conviene si',
      notFitItems: [
        'Tu producto necesita una demostración técnica que solo puede hacer un experto del sector.',
        'Necesitas fotos o videos de catálogo de muchos productos en una sola sesión de estudio.',
        'Buscas videos de muchas creadoras distintas para una misma campaña.',
      ],
      marketTitle: 'Dónde se usan estos videos',
      marketItems: [
        'Anuncios en TikTok y Meta para campañas de venta directa.',
        'Páginas de producto en Shopify, WooCommerce o cualquier otra plataforma.',
        'Email marketing y correos después de la compra, con el producto en uso.',
      ],
      processTitle: 'Cómo trabajamos',
      processSteps: [
        {
          title: '1. Producto y objetivo',
          description: 'Me cuentas qué vendes, dónde va a aparecer el video y qué quieres que haga la persona que lo ve.',
        },
        {
          title: '2. Estructura',
          description: 'Defino el orden: gancho al inicio, producto en uso, el beneficio a la vista y cierre con CTA.',
        },
        {
          title: '3. Grabación',
          description: 'Grabo con el producto en la mano. El unboxing, el uso y la reacción son reales, no actuados.',
        },
        {
          title: '4. Entrega',
          description: 'Te mando los videos listos para anuncios, página de producto, email o redes, y versiones distintas si las necesitas. Incluyen 1 a 2 rondas de revisión.',
        },
      ],
      featuredTitle: 'Ejemplos de mi trabajo',
      featuredIntro: 'Dos anuncios y una reseña de producto.',
      featuredExamples: [
        {
          clipId: 1001,
          title: 'Anuncio para una campaña de marketing',
          description: 'Anuncio corto con un gancho al inicio y buen ritmo, para que la gente no siga deslizando.',
        },
        {
          clipId: 4,
          title: 'Reseña de suplemento (Curvella)',
          description: 'Cuento los beneficios desde mi experiencia, en tono cercano.',
        },
        {
          clipId: 1003,
          title: 'Anuncio de rotulación de vehículos',
          description: 'Presento un servicio de rotulación de forma directa y cierro con un llamado a la acción.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre UGC para ecommerce',
      faqs: [
        {
          question: '¿Sirve para cualquier tipo de producto?',
          answer:
            'Sí, siempre que se pueda mostrar en uso frente a cámara. He grabado videos de suplementos, ropa, accesorios, gadgets, productos de belleza y servicios con algo físico que mostrar.',
        },
        {
          question: '¿Un video funciona mejor que las fotos en la página de producto?',
          answer:
            'Casi siempre ayuda, sobre todo con productos que hay que ver en uso para entenderlos. Un video corto de reseña o demo responde dudas que una foto no puede.',
        },
        {
          question: '¿Puedo usar el mismo video como anuncio y en mi tienda?',
          answer:
            'Sí. Muchas tiendas usan el mismo video en TikTok Ads, en la página de producto y en email marketing. Eso sí: el uso orgánico está incluido, pero para usarlo en pauta pagada necesitas una licencia aparte, que se cotiza por separado.',
        },
        {
          question: '¿Cuánto tardas en entregar?',
          answer:
            'Normalmente entrego en 3 a 5 días hábiles después de recibir el producto y confirmar el brief. Si son muchos videos, lo hablamos antes de empezar.',
        },
      ],
      ctaTitle: '¿Necesitas videos para tu tienda online?',
      ctaText:
        'Escríbeme y cuéntame qué producto vendes, dónde vas a usar los videos y cuántos necesitas. Te respondo con una propuesta.',
      relatedTitle: 'Servicios relacionados',
      relatedServiceIds: ['ugc-testimonials-reviews', 'ugc-ads-tiktok-meta', 'ugc-product-demo'],
    },
    en: {
      navLabel: 'Ecommerce UGC',
      metaTitle: 'Ecommerce UGC creator | Gisela Saldarriaga',
      metaDescription:
        'Ecommerce UGC creator. I film reviews, unboxings, product demos, and ads for online stores that want to show their product in real use.',
      breadcrumbLabel: 'Ecommerce UGC',
      heroEyebrow: 'Online stores',
      heroTitle: 'UGC for ecommerce: reviews, unboxings, and demos with your product',
      heroSummary:
        'I make UGC videos for online stores in any category. Reviews, unboxings, demos, and ads where I open the product, use it on camera, and say what I think. They work right where catalog photos fall short.',
      heroPoints: [
        'Any physical product',
        'Reviews, unboxings, and usage demos',
        'For ads and product pages',
      ],
      primaryCtaLabel: 'Tell me about your project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'Why use UGC for ecommerce',
      sectionIntroText:
        'Online shoppers can’t touch the product, try it on, or look at it up close. A video of a real person opening it, using it, and giving an honest opinion is the closest thing to holding it. It helps people buy with fewer doubts, because they tend to trust a person more than a photo.',
      deliverablesTitle: 'What I make for online stores',
      deliverables: [
        {
          title: 'Product reviews',
          description: 'I show the product, test it, and give my honest opinion on the quality and how it works.',
        },
        {
          title: 'Unboxings',
          description: 'I open the package on camera, see the product for the first time, and react the way any customer would.',
        },
        {
          title: 'Direct response ads',
          description: 'TikTok and Meta ads with a strong hook, the product in use, and a clear call to buy.',
        },
        {
          title: 'Product page videos',
          description: 'Short videos for your product pages, so shoppers can see what they’re getting.',
        },
      ],
      bestFitTitle: 'Who it’s for',
      bestFitItems: [
        'Online stores selling physical products that need videos with a real person for their ads or product pages.',
        'DTC brands running TikTok Ads or Meta Ads that want natural-sounding ads with a clear push to buy.',
        'Ecommerce teams getting a lot of questions or returns because customers weren’t sure what they were buying.',
      ],
      notFitTitle: 'This isn’t for you if',
      notFitItems: [
        'Your product needs a technical demo that only an industry expert can do.',
        'You need catalog photos or videos of many products in one studio session.',
        'You want videos from lots of different creators for the same campaign.',
      ],
      marketTitle: 'Where these videos get used',
      marketItems: [
        'TikTok and Meta ads for direct response campaigns.',
        'Product pages on Shopify, WooCommerce, or any other platform.',
        'Email marketing and post-purchase emails showing the product in use.',
      ],
      processTitle: 'How we work together',
      processSteps: [
        {
          title: '1. Product and goal',
          description: 'You tell me what you sell, where the video will go, and what you want viewers to do next.',
        },
        {
          title: '2. Structure',
          description: 'I plan the order: a hook up front, the product in use, the benefit on screen, and a CTA to close.',
        },
        {
          title: '3. Filming',
          description: 'I film with the product in hand. The unboxing, the use, and the reaction are real, not acted.',
        },
        {
          title: '4. Delivery',
          description: 'I send you videos ready for ads, product pages, email, or social, plus different versions if you need them. One to two revision rounds are included.',
        },
      ],
      featuredTitle: 'Examples of my work',
      featuredIntro: 'Two ads and one product review.',
      featuredExamples: [
        {
          clipId: 1001,
          title: 'Marketing campaign ad',
          description: 'A short ad with a hook up front and quick pacing so people don’t scroll past.',
        },
        {
          clipId: 4,
          title: 'Supplement review (Curvella)',
          description: 'I talk about the benefits from my own experience, in a casual tone.',
        },
        {
          clipId: 1003,
          title: 'Vehicle wrap ad',
          description: 'I present a vehicle wrap service in a direct way and close with a call to action.',
        },
      ],
      faqTitle: 'Common questions about ecommerce UGC',
      faqs: [
        {
          question: 'Does this work for any kind of product?',
          answer:
            'Yes, as long as it can be shown in use on camera. I’ve made videos for supplements, clothing, accessories, gadgets, beauty products, and services with something physical to show.',
        },
        {
          question: 'Does video work better than photos on a product page?',
          answer:
            'It usually helps, especially for products people need to see in use to understand. A short review or demo answers questions a photo can’t.',
        },
        {
          question: 'Can I use the same video as an ad and on my store?',
          answer:
            'Yes. Plenty of stores use the same video on TikTok Ads, on the product page, and in email marketing. One thing to know: organic use is included, but running it as a paid ad needs a separate license, which is quoted separately.',
        },
        {
          question: 'How long does delivery take?',
          answer:
            'Usually 3 to 5 business days after I get the product and we confirm the brief. If it’s a big order, we’ll talk about timing before I start.',
        },
      ],
      ctaTitle: 'Need videos for your online store?',
      ctaText:
        'Message me with what you sell, where you’ll use the videos, and how many you need. I’ll get back to you with a plan.',
      relatedTitle: 'Related services',
      relatedServiceIds: ['ugc-testimonials-reviews', 'ugc-ads-tiktok-meta', 'ugc-product-demo'],
    },
  },

  'lifestyle-wellness-ugc': {
    es: {
      navLabel: 'UGC lifestyle y bienestar',
      metaTitle: 'Creadora UGC lifestyle y bienestar | Gisela Saldarriaga',
      metaDescription:
        'Creadora UGC para marcas de lifestyle, bienestar y alimentación saludable. Grabo reseñas, videos orgánicos y anuncios con el producto en mi día a día.',
      breadcrumbLabel: 'UGC lifestyle y bienestar',
      heroEyebrow: 'Lifestyle y bienestar',
      heroTitle: 'UGC para marcas de lifestyle y bienestar: tu producto en el día a día',
      heroSummary:
        'Grabo videos UGC para marcas de bienestar, alimentación saludable, fitness, hogar y estilo de vida. El producto aparece en momentos normales de mi día, con tono natural, como cuando le recomiendas algo a una amiga.',
      heroPoints: [
        'Bienestar, fitness, hogar y alimentación',
        'El producto en momentos reales del día',
        'Para anuncios, reels y contenido orgánico',
      ],
      primaryCtaLabel: 'Cuéntame tu proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sectionIntroTitle: 'Por qué usar UGC en lifestyle y bienestar',
      sectionIntroText:
        `En bienestar y estilo de vida, la gente compra pensando en cómo quiere vivir. Cuando ve a una persona real usar el producto en su rutina, en su cocina o en su rato de cuidado personal, se imagina haciendo lo mismo. Eso es muy difícil de lograr con un video de estudio. Puedes [contratar UGC de bienestar bilingüe](${getServicePath('bilingual-ugc-creator', 'es')}) o seguir estos [pasos para contratar una creadora UGC](${getResourcePath('how-to-hire-ugc-creator', 'es')}).`,
      deliverablesTitle: 'Qué videos hago para marcas de lifestyle y bienestar',
      deliverables: [
        {
          title: 'Rutina diaria',
          description: 'El producto aparece de forma natural en mi rutina de bienestar, en la cocina o en mi cuidado personal.',
        },
        {
          title: 'Reseñas desde mi experiencia',
          description: 'Cuento cómo uso el producto, qué me gusta y por qué lo recomendaría.',
        },
        {
          title: 'Anuncios con tono lifestyle',
          description: 'Anuncios para TikTok y Meta que empiezan con un momento cotidiano y cierran con el beneficio y un llamado a la acción suave.',
        },
        {
          title: 'Videos para el feed orgánico',
          description: 'Videos para las redes de la marca, con una estética cuidada y sin tono de venta.',
        },
      ],
      bestFitTitle: 'Para quién es',
      bestFitItems: [
        'Marcas de bienestar, suplementos, alimentación saludable o fitness que quieren mostrar su producto con una persona real y en tono cercano.',
        'Marcas de hogar, aromas o cuidado personal que necesitan mostrar el producto en la vida diaria.',
        'Equipos que necesitan videos para el feed orgánico y también anuncios que no se sientan agresivos.',
      ],
      notFitTitle: 'No te conviene si',
      notFitItems: [
        'Tu producto necesita una demostración técnica o afirmaciones científicas comprobadas.',
        'Quieres grabar en varias locaciones, con viajes o con una producción grande en exteriores.',
        'Buscas una influencer que publique el video en sus redes para llegarle a su audiencia. Yo hago el video y lo publicas tú.',
      ],
      marketTitle: 'Dónde se usan estos videos',
      marketItems: [
        'El feed orgánico de la marca en Instagram y TikTok, para que tu comunidad vea el producto en uso.',
        'Anuncios en TikTok y Meta con formato lifestyle, que venden sin sentirse invasivos.',
        'Páginas de producto y landing pages, con el producto dentro de una escena cotidiana.',
      ],
      processTitle: 'Cómo trabajamos',
      processSteps: [
        {
          title: '1. Producto e idea',
          description: 'Me cuentas qué vendes, con qué estilo de vida quieres asociarlo y dónde vas a usar los videos.',
        },
        {
          title: '2. Momentos del día',
          description: 'Decido en qué momentos aparece el producto: en la mañana, en mi rutina, en la cocina o en mi cuidado personal.',
        },
        {
          title: '3. Grabación',
          description: 'Grabo en espacios reales, con luz natural y sin set armado. El producto se adapta al momento, y no al revés.',
        },
        {
          title: '4. Entrega',
          description: 'Te mando los videos listos para feed, anuncios, landing page o email, todos con la misma estética. Incluyen 1 a 2 rondas de revisión.',
        },
      ],
      featuredTitle: 'Ejemplos de mi trabajo',
      featuredIntro: 'Un video con una estética más cuidada, uno orgánico para una marca de bienestar y una reseña de restaurante.',
      featuredExamples: [
        {
          clipId: 8,
          title: 'Video lifestyle con perfume',
          description: 'Un video con una estética más cuidada, donde el perfume es parte de la escena.',
        },
        {
          clipId: 1002,
          title: 'Contenido orgánico para una marca en España',
          description: 'Video con tono natural para el feed orgánico de una marca de bienestar.',
        },
        {
          clipId: 1004,
          title: 'Reseña de un restaurante',
          description: 'Cuento cómo me fue en el restaurante y si lo recomiendo, como se lo contaría a una amiga.',
        },
      ],
      faqTitle: 'Preguntas frecuentes sobre UGC lifestyle y bienestar',
      faqs: [
        {
          question: '¿Qué diferencia hay entre el contenido lifestyle y los anuncios UGC?',
          answer:
            'El contenido lifestyle es para el feed orgánico: el producto aparece en un momento cotidiano, sin un gancho de venta agresivo. Los anuncios UGC son para pauta pagada y están armados para que la gente vea el video completo y compre. Puedo hacer los dos, según lo que necesites.',
        },
        {
          question: '¿Tengo que enviarte el producto?',
          answer:
            'Sí, en la mayoría de los casos. Necesito usarlo de verdad para que el video se vea real. El envío a Medellín lo coordinamos juntos.',
        },
        {
          question: '¿Trabajas con marcas de alimentos?',
          answer:
            'Sí. He hecho videos de suplementos y reseñas de restaurantes. Funciona muy bien con cualquier producto que se pueda mostrar mientras se prepara o se come.',
        },
        {
          question: '¿Este contenido también sirve para anuncios?',
          answer:
            'Se puede usar, pero si lo que buscas son videos para vender en pauta, te conviene más mi servicio de anuncios UGC. El contenido lifestyle funciona mejor en orgánico o para que más gente conozca tu marca.',
        },
      ],
      ctaTitle: '¿Necesitas videos para tu marca de lifestyle o bienestar?',
      ctaText:
        'Escríbeme y cuéntame qué producto tienes, qué tono buscas y dónde lo vas a publicar. Te respondo con una propuesta.',
      relatedTitle: 'Servicios relacionados',
      relatedServiceIds: ['ugc-lifestyle', 'ugc-testimonials-reviews', 'ugc-broll-footage'],
    },
    en: {
      navLabel: 'Lifestyle and wellness UGC',
      metaTitle: 'Lifestyle and wellness UGC creator | Gisela Saldarriaga',
      metaDescription:
        'Lifestyle and wellness UGC creator. I film reviews, organic content, and ads for wellness and healthy food brands, with your product in my everyday life.',
      breadcrumbLabel: 'Lifestyle and wellness UGC',
      heroEyebrow: 'Lifestyle and wellness',
      heroTitle: 'UGC for lifestyle and wellness brands: your product in everyday life',
      heroSummary:
        'I make UGC videos for wellness, healthy food, fitness, home, and lifestyle brands. Your product shows up in normal moments of my day, in a natural tone, the way you’d tell a friend about something you like.',
      heroPoints: [
        'Wellness, fitness, home, and food',
        'Your product in real moments of the day',
        'For ads, reels, and organic content',
      ],
      primaryCtaLabel: 'Tell me about your project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sectionIntroTitle: 'Why use UGC for lifestyle and wellness',
      sectionIntroText:
        `In wellness and lifestyle, people buy with the life they want in mind. When they see a real person using the product in their routine, in their kitchen, or while taking time for themselves, they can picture doing the same. That’s hard to get from a studio video. You can [hire a bilingual wellness UGC creator](${getServicePath('bilingual-ugc-creator', 'en')}) or follow these [steps to hire a UGC creator](${getResourcePath('how-to-hire-ugc-creator', 'en')}).`,
      deliverablesTitle: 'What I make for lifestyle and wellness brands',
      deliverables: [
        {
          title: 'Daily routine videos',
          description: 'Your product shows up naturally in my wellness routine, in the kitchen, or while I take care of myself.',
        },
        {
          title: 'Reviews from my own experience',
          description: 'I talk about how I use the product, what I like about it, and why I’d recommend it.',
        },
        {
          title: 'Lifestyle ads',
          description: 'TikTok and Meta ads that open on an everyday moment and close with the benefit and a soft call to action.',
        },
        {
          title: 'Organic feed videos',
          description: 'Videos for the brand’s social accounts that look good and don’t feel like a sales pitch.',
        },
      ],
      bestFitTitle: 'Who it’s for',
      bestFitItems: [
        'Wellness, supplement, healthy food, or fitness brands that want their product shown by a real person, in a friendly tone.',
        'Home, fragrance, or personal care brands that need to show the product in everyday life.',
        'Teams that need videos for their organic feed and also ads that don’t feel pushy.',
      ],
      notFitTitle: 'This isn’t for you if',
      notFitItems: [
        'Your product needs a technical demo or proven scientific claims.',
        'You want to film in several locations, with travel or a big outdoor production.',
        'You’re looking for an influencer to post the video to their own followers. I make the video, and you post it.',
      ],
      marketTitle: 'Where these videos get used',
      marketItems: [
        'The brand’s organic feed on Instagram and TikTok, so your community sees the product in use.',
        'TikTok and Meta ads in a lifestyle format that sell without feeling intrusive.',
        'Product pages and landing pages, showing the product in an everyday scene.',
      ],
      processTitle: 'How we work together',
      processSteps: [
        {
          title: '1. Product and idea',
          description: 'You tell me what you sell, what kind of lifestyle you want it tied to, and where you’ll use the videos.',
        },
        {
          title: '2. Moments of the day',
          description: 'I pick the moments where the product shows up: in the morning, during my routine, in the kitchen, or during self-care.',
        },
        {
          title: '3. Filming',
          description: 'I film in real spaces with natural light and no staged set. The product fits into the moment, not the other way around.',
        },
        {
          title: '4. Delivery',
          description: 'I send you videos ready for your feed, ads, landing pages, or email, all with the same look. One to two revision rounds are included.',
        },
      ],
      featuredTitle: 'Examples of my work',
      featuredIntro: 'A more styled lifestyle video, an organic video for a wellness brand, and a restaurant review.',
      featuredExamples: [
        {
          clipId: 8,
          title: 'Lifestyle video with a perfume',
          description: 'A more styled video where the perfume is part of the scene.',
        },
        {
          clipId: 1002,
          title: 'Organic content for a brand in Spain',
          description: 'A natural-feeling video for a wellness brand’s organic feed.',
        },
        {
          clipId: 1004,
          title: 'Restaurant review',
          description: 'I talk about how my visit went and whether I’d recommend the place, the way I’d tell a friend.',
        },
      ],
      faqTitle: 'Common questions about lifestyle and wellness UGC',
      faqs: [
        {
          question: 'What’s the difference between lifestyle content and UGC ads?',
          answer:
            'Lifestyle content is for your organic feed: the product shows up in an everyday moment, without a hard sales hook. UGC ads are made for paid placement, to keep people watching and get them to buy. I can do both, depending on what you need.',
        },
        {
          question: 'Do I need to send you the product?',
          answer:
            'Yes, in most cases. I need to actually use it so the video looks real. We’ll sort out shipping to Medellín together.',
        },
        {
          question: 'Do you work with food brands?',
          answer:
            'Yes. I’ve made supplement videos and restaurant reviews. It works well with any product you can show being prepared or eaten.',
        },
        {
          question: 'Can this content also be used for ads?',
          answer:
            'You can use it that way, but if you need videos to sell through paid ads, my UGC ads service is a better fit. Lifestyle content works best as organic content or to get your brand in front of more people.',
        },
      ],
      ctaTitle: 'Need videos for your lifestyle or wellness brand?',
      ctaText:
        'Message me with the product, the tone you’re going for, and where you’ll post. I’ll get back to you with a plan.',
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
