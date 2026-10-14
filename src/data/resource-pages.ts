import type { ServicePageId, VerticalPageId, SiteLocale, ResourcePageId } from '@/lib/locale-path';
import { getHomePath, getResourcePath, getServicePath } from '@/lib/locale-path';
import { FIVERR_PROFILE_URL } from '@/lib/contact-channels';
import { SITE_PROOF } from '@/data/site-proof';

export type { ResourcePageId } from '@/lib/locale-path';

export type ResourceSection = {
  title: string;
  body: string[];
  italicLead?: string;
  bodyBefore?: string[];
  bullets?: string[];
  table?: ComparisonTable;
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
  leadCtaLabel?: string;
  leadCtaHref?: string;
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

/**
 * Published Fiverr package prices, delivery days, and gig URLs.
 *
 * Authority resync: any change to FIVERR_PRICING must be followed by a
 * re-check on Fiverr and a ping to Authority, the same as the site-proof.ts
 * rule. Re-check Fiverr monthly, and any time a gig is edited. Update this
 * constant and the verification date together.
 */
export const FIVERR_PRICING = {
  verifiedOn: '2026-10-14',
  gigs: {
    ugc: 'https://www.fiverr.com/gisela_sm/create-spanish-ugc-videos',
    spokespersonGreenWhite:
      'https://www.fiverr.com/gisela_sm/spanish-video-spokesperson-on-green-and-white-backgrounds',
    spokespersonJournalist:
      'https://www.fiverr.com/gisela_sm/periodista-y-presentadora-de-tv-transforma-tus-ideas-en-narrativas-poderosas',
    voiceover: 'https://www.fiverr.com/gisela_sm/deliver-a-professional-female-voice-over-in-latin-spanish',
  },
  ugc: {
    basic: { price: 40, deliveryDays: 3 },
    standard: { price: 70, deliveryDays: 3 },
    premium: { price: 120, deliveryDays: 5 },
    rushMin: 15,
    rushMax: 20,
  },
  spokesperson: {
    words65: { price: 25, words: 65 },
    words130: { price: 40, wordsApprox: 130 },
    words260: { price: 75, words: 260 },
    deliveryMin: 1,
    deliveryMax: 2,
  },
  voiceover: {
    price: 20,
    words: 75,
    deliveryDays: 1,
  },
  fiverrRating: SITE_PROOF.fiverrRating,
  fiverrReviewCount: SITE_PROOF.fiverrReviewCount,
} as const;

export const FIVERR_PRICING_GIG_URLS = [
  FIVERR_PRICING.gigs.ugc,
  FIVERR_PRICING.gigs.spokespersonGreenWhite,
  FIVERR_PRICING.gigs.spokespersonJournalist,
  FIVERR_PRICING.gigs.voiceover,
] as const;

const usd = (amount: number) => `$${amount}`;
const mdLink = (label: string, href: string) => `[${label}](${href})`;
const mdPrice = (amount: number, href: string, prefix = '') => mdLink(`${prefix}${usd(amount)}`, href);

const dualSpokespersonPrice = (amount: number, locale: SiteLocale) => {
  const labels =
    locale === 'es'
      ? { greenWhite: 'gig fondo verde/blanco', journalist: 'gig presentadora' }
      : { greenWhite: 'green/white backdrop gig', journalist: 'presenter gig' };
  return `${usd(amount)} (${mdLink(labels.greenWhite, FIVERR_PRICING.gigs.spokespersonGreenWhite)} · ${mdLink(labels.journalist, FIVERR_PRICING.gigs.spokespersonJournalist)})`;
};

const verifiedParts = () => {
  const [year, month, day] = FIVERR_PRICING.verifiedOn.split('-');
  return { year, month, day };
};

const verifiedDateEs = () => {
  const { year, month, day } = verifiedParts();
  return `${Number(day)}/${month}/${year}`;
};

const verifiedDateEn = () => {
  const { year, month, day } = verifiedParts();
  return `${month}/${day}/${year}`;
};

const monthYearEs = () => `octubre de ${verifiedParts().year}`;
const monthYearEn = () => `October ${verifiedParts().year}`;
const monthEsShort = () => `octubre ${verifiedParts().year}`;
const monthEnShort = () => `October ${verifiedParts().year}`;

const rushRange = () => `+${usd(FIVERR_PRICING.ugc.rushMin)}–${FIVERR_PRICING.ugc.rushMax}`;
const spokespersonDelivery = () =>
  `${FIVERR_PRICING.spokesperson.deliveryMin}–${FIVERR_PRICING.spokesperson.deliveryMax}`;

export const PRICING_GUIDE_HUB = {
  es: {
    title: 'Cuánto cobra una creadora UGC',
    blurb: `Mis paquetes UGC en Fiverr empiezan en ${usd(FIVERR_PRICING.ugc.basic.price)}: qué incluye cada uno, qué cambia el precio y cuándo cotizar directo.`,
  },
  en: {
    title: 'How much a UGC creator charges',
    blurb: `My UGC packages on Fiverr start at ${usd(FIVERR_PRICING.ugc.basic.price)}: what each one includes, what changes the price, and when to get a direct quote.`,
  },
} as const;

export const HIRE_BUDGET_FAQ = {
  es: {
    question: '¿Cuánto cuesta contratar una creadora UGC?',
    answer: `Depende de la duración, del guion, de cuántos videos necesitas, del idioma y de si los vas a pautar. Mis paquetes UGC en Fiverr empiezan en ${usd(FIVERR_PRICING.ugc.basic.price)} por un video en español (precio de ${monthYearEs()}). Los proyectos personalizados o directos se cotizan, igual que las versiones en inglés y la licencia para anuncios pagados. Detalle en [cuánto cobra una creadora UGC](${getResourcePath('how-much-ugc-creator-charge', 'es')}).`,
  },
  en: {
    question: 'How much does it cost to hire a UGC creator?',
    answer: `It depends on video length, the script, how many videos you need, the language, and whether you'll run them as ads. My UGC packages on Fiverr start at ${usd(FIVERR_PRICING.ugc.basic.price)} for one video in Spanish (${monthYearEn()} price). Custom and direct projects are quoted, and so are English versions and a paid ads license. See the breakdown in [how much a UGC creator charges](${getResourcePath('how-much-ugc-creator-charge', 'en')}).`,
  },
} as const;

const PRICING_META = {
  es: `Mis paquetes UGC en Fiverr empiezan en ${usd(FIVERR_PRICING.ugc.basic.price)}. Precios de videos UGC, portavoz y voz en off en español, qué cambia el precio y cuándo cotizar directo.`,
  en: `My UGC packages on Fiverr start at ${usd(FIVERR_PRICING.ugc.basic.price)}. Prices for UGC, spokesperson and voiceover in Spanish, what changes the price, and when to get a direct quote.`,
} as const;

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
      metaTitle: 'Qué es UGC: contenido generado por usuarios y cómo se usa | Gisela Saldarriaga',
      metaDescription:
        'UGC son videos hechos por personas reales y no por la marca. Te explico qué es, qué formatos hay y cómo lo usan las marcas en anuncios y redes.',
      breadcrumbLabel: 'Qué es UGC',
      heroEyebrow: 'Guía',
      heroTitle: 'Qué es UGC y cómo lo usan las marcas',
      heroSummary:
        'UGC (User-Generated Content, o contenido generado por usuarios) son videos y fotos hechos por personas reales y no por el equipo de la marca. Las marcas los usan en anuncios, redes sociales y landing pages porque se ven como la recomendación de alguien normal. Aquí te explico qué es, qué tipos hay y cómo empezar a usarlo.',
      heroPoints: [
        'Qué es UGC, en pocas palabras',
        'Por qué tantas marcas lo usan en anuncios',
        'Cómo empezar a usarlo en tu marca',
      ],
      primaryCtaLabel: 'Cuéntame tu proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sections: [
        {
          title: 'Qué significa UGC',
          body: [
            'UGC viene del inglés User-Generated Content: contenido generado por usuarios. Es cualquier video, foto, reseña o testimonio hecho por una persona que no trabaja en el equipo de marketing de la marca.',
            'Lo que lo diferencia de un anuncio normal es cómo se ve. Un video UGC parece la recomendación de alguien que usa el producto, no un comercial de la empresa, y por eso la gente lo mira con menos desconfianza.',
            'Yo me dedico a hacer UGC para marcas. Grabo con buena luz y buen audio, trabajo con un brief y un guion, pero mantengo el tono de alguien hablándole a la cámara de su celular. Si el video se ve demasiado producido, deja de parecer UGC.',
          ],
        },
        {
          title: 'Tipos de videos UGC',
          body: [
            'Hay varios formatos y cada uno sirve para algo distinto. Los más comunes son los testimoniales, donde alguien cuenta cómo le fue con el producto; los demos, que muestran el unboxing o cómo se usa paso a paso; los anuncios que parecen contenido orgánico pero siguen una estructura de venta; y el B-roll de estilo de vida, que muestra el producto en la rutina diaria.',
            'Los videos de problema-solución se usan mucho en anuncios. Empiezan con un problema que tu cliente reconoce, muestran el producto como la respuesta y cierran con un llamado a la acción. Se parecen a cuando una amiga te cuenta qué le sirvió a ella.',
            'También están los videos de portavoz: la creadora habla directo a cámara en nombre de la marca. Se nota que es la marca la que habla, pero con el tono de una persona y no el de un comercial de televisión.',
          ],
        },
        {
          title: 'Por qué el UGC funciona en anuncios',
          body: [
            'Más que nada, por confianza. Solemos creerle más a alguien parecido a nosotros que a una marca hablando de sí misma, y un video UGC se ve así: una persona contando su experiencia.',
            'En el feed, un video UGC se parece a lo que la gente ya está viendo, así que no lo salta de inmediato como pasa con un anuncio evidente. Eso le da al mensaje la oportunidad de llegar antes de que la persona siga bajando.',
            'También suele salir más económico. En una sola sesión de grabación puedo sacar varios videos o versiones para distintas plataformas y públicos, algo que con una producción tradicional normalmente necesita más presupuesto.',
            'Eso no quiere decir que cualquier video UGC funcione. Trabajando con marcas de Estados Unidos, España y Latinoamérica, lo que más me ha servido es tener un gancho claro y un mensaje concreto, más que una producción muy pulida.',
          ],
        },
        {
          title: 'UGC orgánico vs UGC pagado',
          body: [
            'El UGC orgánico es el que tus clientes hacen por su cuenta: fotos donde etiquetan tu marca, reseñas en Amazon, videos de unboxing. Vale mucho, pero no lo controlas. No decides la calidad, lo que dicen ni cuándo lo publican.',
            'El UGC pagado (o profesional) lo hace una creadora a partir de un brief de la marca. Se ve natural, pero sigue la estructura de un anuncio: un gancho, el beneficio principal y un llamado a la acción.',
            'Muchas marcas usan los dos. Lo que publican sus clientes les sirve como prueba social en redes, y el UGC profesional lo usan en sus campañas pagadas.',
          ],
        },
        {
          title: 'Cómo empezar a usar UGC',
          body: [
            'Primero, ten claro para qué lo quieres. ¿Bajar el costo por adquisición (CPA) de tus anuncios? ¿Videos para tu landing page? ¿Que tu feed se vea menos corporativo? Cada objetivo pide un tipo de video distinto.',
            'Después elige el formato. Para anuncios de venta directa suelen funcionar bien los de problema-solución y los testimoniales. Para que te conozcan, los demos y el contenido de estilo de vida. Para landing pages, las reseñas y las comparaciones ayudan a que la gente confíe.',
            'Por último, elige a la creadora. Busca a alguien que entienda tu producto, tu público y las plataformas donde vas a publicar. Para UGC no hace falta que tenga muchos seguidores, porque el video lo publicas tú. Fíjate más en cómo habla frente a cámara y en si sabe armar un anuncio con gancho y cierre.',
            'Si no sabes qué tipo de UGC te conviene, escríbeme. Me cuentas qué vendes y qué quieres lograr, y te propongo con qué videos empezar.',
          ],
        },
        {
          title: 'Cómo se usa el UGC en 2026',
          body: [
            'El UGC empezó como fotos espontáneas de clientes. Hoy hay creadoras que se dedican a esto, briefs bien armados y marcas que miden cómo rinde cada video.',
            'Lo que más veo ahora: UGC bilingüe para marcas que venden en más de un mercado, videos verticales para TikTok y Reels, videos más cortos (de 15 a 30 segundos) y UGC usado fuera de los anuncios, en emails, landing pages y presentaciones de ventas.',
            'La inteligencia artificial ya ayuda a editar y a analizar resultados, pero no reemplaza a la persona frente a cámara. El UGC funciona porque se ve real, y eso todavía depende de que haya alguien real hablando.',
            'Si estás pensando en probar UGC, puedes empezar con pocos videos, ver qué le funciona a tu público y crecer a partir de ahí. No hace falta producir mucho de entrada.',
          ],
        },
      ],
      faqs: [
        {
          question: '¿Cuál es la diferencia entre UGC y contenido de marca?',
          answer: 'El contenido de marca lo hace el equipo interno o una agencia y se ve corporativo. El UGC se ve como una persona recomendando el producto, aunque detrás haya un brief y una creadora profesional. La diferencia está en cómo lo percibe quien lo ve.',
        },
        {
          question: '¿Necesito una creadora UGC si mis clientes ya publican sobre mi marca?',
          answer: 'Puede servirte, porque no cumplen la misma función. Lo que publican tus clientes es valioso, pero no controlas la calidad, el mensaje ni el formato. Con una creadora decides qué se dice y recibes videos con gancho, beneficio y llamado a la acción.',
        },
        {
          question: '¿Cuántos videos UGC necesito para empezar?',
          answer: 'Depende de tu presupuesto de anuncios y de cuántas versiones quieras probar. Para empezar, 3 a 5 videos por campaña con distintos ganchos y llamados a la acción suelen alcanzar. Con eso ya ves qué mensajes le funcionan a tu público.',
        },
        {
          question: '¿El UGC funciona en cualquier industria?',
          answer: 'Funciona bien en beauty, moda, tecnología, ecommerce y bienestar, y en general con cualquier producto que se pueda mostrar en uso. Cuesta más con productos muy técnicos que necesitan una demostración especializada.',
        },
        {
          question: '¿Cuánto cuesta un video UGC?',
          answer: 'Depende del formato, de cuántos videos necesitas y de qué tan complejo es el brief. Escríbeme con lo que tienes en mente y te paso una cotización. El uso orgánico va incluido y la licencia para anuncios pagados se cotiza aparte.',
        },
        {
          question: '¿Puedo usar UGC en todas las plataformas?',
          answer: 'Sí. Funciona en TikTok, Instagram, Facebook, YouTube Shorts, landing pages y email. Lo ideal es ajustar la duración y el formato a cada plataforma, pero el mismo video base se puede adaptar para varias.',
        },
      ],
      ctaTitle: '¿Quieres empezar con UGC?',
      ctaText: 'Cuéntame qué vendes y dónde, y te propongo qué videos grabar primero.',
      relatedServiceIds: ['bilingual-ugc-creator', 'ugc-ads-tiktok-meta', 'ugc-testimonials-reviews'],
      relatedVerticalIds: ['ecommerce-ugc', 'beauty-ugc'],
    },
    en: {
      navLabel: 'What is UGC',
      metaTitle: 'What is UGC? User-generated content and how brands use it | Gisela Saldarriaga',
      metaDescription:
        'UGC is content made by real people, not by the brand. Here’s what it is, the main formats, and how brands use it in ads and on social media.',
      breadcrumbLabel: 'What is UGC',
      heroEyebrow: 'Guide',
      heroTitle: 'What is UGC and how do brands use it?',
      heroSummary:
        'UGC (user-generated content) is video and photo content made by real people instead of the brand’s own team. Brands use it in ads, on social media, and on landing pages because it looks like a recommendation from a regular person. Below I explain what it is, the main types, and how to get started.',
      heroPoints: [
        'What UGC is, in plain terms',
        'Why so many brands use it in ads',
        'How to start using it for your brand',
      ],
      primaryCtaLabel: 'Tell me about your project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sections: [
        {
          title: 'What UGC means',
          body: [
            'UGC stands for user-generated content. It’s any video, photo, review, or testimonial made by someone who isn’t on the brand’s marketing team.',
            'What sets it apart from a regular ad is how it comes across. A UGC video looks like someone who uses the product telling you about it, not like a company commercial, so people watch it with less suspicion.',
            'Making UGC for brands is what I do. I film with good light and clean audio, I work from a brief and a script, and I keep the tone of someone talking into their phone. If a video looks too produced, it stops feeling like UGC.',
          ],
        },
        {
          title: 'Types of UGC videos',
          body: [
            'There are several formats, and each one does a different job. The most common are testimonials, where someone shares how the product worked for them; demos, which show the unboxing or how to use it step by step; ads that look like organic posts but follow a sales structure; and lifestyle B-roll that shows the product in everyday life.',
            'Problem-solution videos are used a lot in ads. They open with a problem your customer recognizes, show the product as the fix, and end with a call to action. It’s close to how a friend tells you about something that worked for her.',
            'Then there are spokesperson videos, where the creator talks straight to camera on behalf of the brand. It’s clearly the brand speaking, but in a person’s voice instead of a TV commercial’s.',
          ],
        },
        {
          title: 'Why UGC works in ads',
          body: [
            'Mostly, it comes down to trust. We tend to believe people like us more than a brand talking about itself, and a UGC video looks like just that: a person sharing their experience.',
            'In the feed, a UGC video looks like the posts people are already watching, so it doesn’t get skipped on sight the way an obvious ad does. That gives your message a chance to land before they keep scrolling.',
            'It also tends to cost less. In one filming session I can get several videos or versions for different platforms and audiences, which usually takes a bigger budget with a traditional production.',
            'That doesn’t mean any UGC video will work. Working with brands in the US, Spain, and Latin America, what has helped me most is a clear hook and a specific message, more than a very polished production.',
          ],
        },
        {
          title: 'Organic vs paid UGC',
          body: [
            'Organic UGC is what your customers make on their own: photos tagging your brand, Amazon reviews, unboxing videos. It’s great to have, but you don’t control it. You can’t decide the quality, what they say, or when they post.',
            'Paid (or professional) UGC is made by a creator from your brief. It looks natural, but it follows an ad structure: a hook, the main benefit, and a call to action.',
            'A lot of brands use both. Customer posts work as social proof on their profiles, and professional UGC goes into their paid campaigns.',
          ],
        },
        {
          title: 'How to start using UGC',
          body: [
            'First, decide what you want it for. Lower cost per acquisition (CPA) on your ads? Videos for your landing page? A feed that feels less corporate? Each goal calls for a different kind of video.',
            'Then pick the format. For direct-response ads, problem-solution videos and testimonials usually do well. For getting your name out there, demos and lifestyle content. For landing pages, reviews and comparisons help people trust you.',
            'Last, choose your creator. Look for someone who gets your product, your audience, and the platforms you’ll post on. Follower count doesn’t matter much here, since you’re the one posting the video. Pay more attention to how they come across on camera and whether they know how to put together an ad with a hook and a close.',
            'If you’re not sure which kind of UGC fits your brand, message me. Tell me what you sell and what you’re after, and I’ll suggest which videos to start with.',
          ],
        },
        {
          title: 'How UGC is used in 2026',
          body: [
            'UGC started out as casual customer photos. Now there are creators who do this full time, proper briefs, and brands tracking how each video performs.',
            'What I see most right now: bilingual UGC for brands selling in more than one market, vertical video for TikTok and Reels, shorter videos (15 to 30 seconds), and UGC used outside of ads, in emails, landing pages, and sales decks.',
            'AI already helps with editing and with reading results, but it doesn’t replace the person on camera. UGC works because it looks real, and that still depends on a real person talking.',
            'If you’re thinking about trying UGC, you can start with a few videos, see what works with your audience, and build from there. You don’t need to order a lot up front.',
          ],
        },
      ],
      faqs: [
        {
          question: 'What’s the difference between UGC and brand content?',
          answer: 'Brand content is made by an in-house team or an agency and looks corporate. UGC looks like a person recommending the product, even when there’s a brief and a professional creator behind it. The difference is in how viewers see it.',
        },
        {
          question: 'Do I need a UGC creator if customers already post about my brand?',
          answer: 'It can still help, because the two do different jobs. Customer posts are valuable, but you don’t control the quality, the message, or the format. With a creator, you decide what gets said and get videos with a hook, a benefit, and a call to action.',
        },
        {
          question: 'How many UGC videos do I need to start?',
          answer: 'It depends on your ad budget and how many versions you want to test. 3 to 5 videos per campaign, with different hooks and calls to action, is usually enough to start. That shows you which messages work with your audience.',
        },
        {
          question: 'Does UGC work for every industry?',
          answer: 'It works well for beauty, fashion, tech, ecommerce, and wellness, and in general for any product you can show being used. It’s harder with very technical products that need a specialist demo.',
        },
        {
          question: 'How much does a UGC video cost?',
          answer: 'It depends on the format, how many videos you need, and how complex the brief is. Message me with what you have in mind and I’ll send you a quote. Organic usage is included, and a license for paid ads is quoted separately.',
        },
        {
          question: 'Can I use UGC on every platform?',
          answer: 'Yes. It works on TikTok, Instagram, Facebook, YouTube Shorts, landing pages, and email. Ideally you adjust the length and format for each platform, but one base video can be adapted for several.',
        },
      ],
      ctaTitle: 'Want to get started with UGC?',
      ctaText: 'Tell me what you sell and where, and I’ll suggest which videos to film first.',
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
      metaTitle: 'Cómo contratar una creadora UGC bilingüe | Gisela Saldarriaga',
      metaDescription:
        'Qué revisar en el portafolio, qué preguntar, qué poner en el brief y qué esperar del proceso cuando vas a contratar una creadora UGC.',
      breadcrumbLabel: 'Cómo contratar creadora UGC',
      heroEyebrow: 'Guía',
      heroTitle: 'Cómo contratar una creadora UGC',
      heroSummary:
        'Contratar una creadora UGC no es lo mismo que contratar a una influencer o a una productora. Buscas a alguien que grabe videos para tus anuncios y tus redes, que sepa abrir con un gancho y cerrar con un llamado a la acción, y que hable de tu producto con naturalidad. Aquí te cuento cómo encontrarla, cómo evaluarla y cómo es el trabajo desde el brief hasta la entrega.',
      heroPoints: [
        'Qué buscar en una creadora UGC',
        'Cómo revisar su portafolio',
        'Cómo es el proceso, del brief a la entrega',
      ],
      primaryCtaLabel: 'Cuéntame tu proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sections: [
        {
          title: 'Define qué necesitas antes de buscar',
          body: [
            'Antes de buscar creadora, ten claro qué quieres conseguir. ¿Anuncios para TikTok y Meta? ¿Videos para tu landing page? ¿Testimoniales? Según lo que respondas, vas a necesitar un perfil u otro.',
            'No todas las creadoras UGC hacen lo mismo. Algunas se enfocan en anuncios hablando a cámara, otras en demos, otras en contenido de estilo de vida. Unas trabajan sobre todo con beauty y otras con tecnología o ecommerce. Si sabes qué necesitas, ahorras tiempo y dinero.',
            'Yo, por ejemplo, trabajo con marcas que necesitan videos en español e inglés: anuncios de problema-solución, demos, testimoniales y videos de portavoz. Si tu proyecto va por ahí, puedo ser una buena opción. Si buscas otra cosa, puede que otra creadora te sirva más.',
          ],
        },
        {
          title: 'Dónde encontrar creadoras UGC profesionales',
          body: [
            `Hay varios lugares donde buscar. Plataformas como Billo, Insense o JoinBrands conectan marcas con creadoras, aunque la calidad varía bastante. Fiverr es un canal directo con reseñas verificadas; yo estoy ahí como [gisela_sm](${FIVERR_PROFILE_URL}) (${SITE_PROOF.fiverrRating}/5, ${SITE_PROOF.fiverrReviewCount} reseñas). También puedes buscar en TikTok e Instagram con hashtags como #ugccreator o #ugcenespanol.`,
            'Google también sirve. Una creadora con sitio web propio, portafolio y testimonios de clientes suele tomarse el trabajo más en serio que alguien que solo tiene un perfil en redes.',
            'Las agencias de UGC te convienen si necesitas muchos videos. Eso sí, suelen cobrar más y el trato es menos personalizado. Si quieres hablar directo con quien graba y cuidar mucho el tono, trabajar con la creadora sin intermediarios suele dar mejores resultados.',
            'También sirve preguntarle a gente que trabaje en marketing. El mundo del UGC es pequeño y las buenas recomendaciones se mueven rápido.',
          ],
        },
        {
          title: 'Qué revisar en el portafolio de una creadora UGC',
          body: [
            'El portafolio es lo más importante. No te fijes solo en si los videos son bonitos. Fíjate en si se ven reales, si están armados como anuncios y si la creadora puede cambiar de tono según la marca sin perder naturalidad.',
            'Revisa estas cosas: el audio (importa tanto como la imagen), una luz pareja y natural, que hable a cámara con seguridad, que tenga distintos formatos (anuncios, demos, testimoniales) y que el arranque del video te dé ganas de seguir viendo.',
            'Mira también si ha trabajado en tu categoría. No es obligatorio, pero si ya hizo videos para productos parecidos al tuyo, entiende mejor qué le preocupa a tu cliente y le cuesta menos acertar desde el primer video.',
            'Algo que muchas marcas pasan por alto: pregúntale qué sabe de anuncios. Un video UGC tiene que funcionar dentro de una campaña, así que te conviene alguien que entienda de ganchos, llamados a la acción y cómo se arma un anuncio.',
          ],
        },
        {
          title: 'Cómo armar el brief',
          body: [
            'Con un buen brief te ahorras regrabaciones. No hace falta un documento de veinte páginas, pero sí que diga qué producto o servicio es, a quién le vendes, en qué plataforma va a salir el video, qué tono quieres, cuáles son los mensajes clave y cuál es el llamado a la acción.',
            'Incluye ejemplos de videos que te gustan y de videos que no quieres para nada. Con eso la creadora entiende el estilo mucho más rápido que con una descripción larga.',
            'Cuando trabajo con una marca, siempre pido ver sus anuncios actuales (aunque no estén funcionando), su landing page y por lo menos un video de la competencia que le guste. Con eso tengo contexto para proponer ideas que vayan con la marca.',
            'Un error común es controlar cada palabra del guion. Si contratas a una creadora con experiencia, deja que te proponga la estructura, que ella sabe qué funciona en cada plataforma. Tú aportas lo que sabes del producto y del cliente, y ella se encarga de la idea, la grabación y la edición.',
          ],
        },
        {
          title: 'Presupuesto y qué incluye',
          body: [
            HIRE_BUDGET_FAQ.es.answer,
            'Los precios de UGC cambian mucho según la experiencia de la creadora, lo complejo del brief y la cantidad de videos. En general, un paquete sale más barato que pagar video por video. Un paquete típico puede traer de 3 a 5 videos con distintos ganchos.',
            'Algunas creadoras cobran por video, otras por mes y otras por proyecto. Pregunta siempre qué incluye: ¿cuántas revisiones? ¿Formato vertical y horizontal? ¿Versiones cortas para Stories? ¿Derechos para usar los videos en anuncios pagados?',
            'Los derechos de uso son importantes. Asegúrate de que el acuerdo diga si puedes usar los videos en anuncios pagados. Algunas creadoras lo incluyen y otras lo cobran aparte. En mi caso, el uso orgánico va incluido y la licencia para anuncios pagados se cotiza por separado.',
            'Mi consejo: empieza con un proyecto pequeño de prueba (2 o 3 videos) antes de comprometerte con un paquete grande. Así ves la calidad, cómo es la comunicación y si te gusta trabajar con esa persona, sin arriesgar mucho presupuesto.',
          ],
        },
        {
          title: 'Señales de alerta',
          body: [
            'No contrates a alguien sin portafolio: si no te puede mostrar trabajos anteriores, no tienes cómo saber su nivel. Tampoco a alguien que te prometa ventas. La creadora hace los videos, pero los resultados dependen también de tu estrategia de anuncios, de tu producto y de tu embudo de venta.',
            'Desconfía de quien acepta el proyecto sin hacerte ninguna pregunta sobre tu marca. Una buena creadora quiere entender tu negocio, tu público y lo que buscas. Si no pregunta nada, lo más probable es que te entregue algo genérico.',
            'Ojo con los tiempos de entrega poco realistas. Un buen video UGC lleva preparación, grabación y edición. Si alguien te promete diez videos en dos días, se va a notar en la calidad. Como referencia, yo entrego en 3 a 5 días hábiles después de recibir el producto y confirmar el brief.',
            'Y fíjate en cómo se comunica. Si mientras negocian tarda mucho en responder, es difícil que eso mejore durante el proyecto.',
          ],
        },
        {
          title: 'Un perfil que puedes evaluar ahora',
          body: [
            `Gisela Saldarriaga es creadora UGC bilingüe. Produce desde Medellín anuncios para TikTok y Meta, demos, reseñas y videos de portavoz en español e inglés para marcas en el mercado hispano de Estados Unidos, España y LatAm. Trabaja en Fiverr como [gisela_sm](${FIVERR_PROFILE_URL}): ${SITE_PROOF.fiverrRating}/5 en ${SITE_PROOF.fiverrReviewCount} reseñas verificadas. Lleva 28+ campañas de marca. El contenido se entrega a la marca; no lo publica en sus redes salvo un acuerdo de ambassador.`,
            `[Creadora UGC bilingüe](${getServicePath('bilingual-ugc-creator', 'es')})`,
          ],
        },
      ],
      faqs: [
        {
          question: HIRE_BUDGET_FAQ.es.question,
          answer: HIRE_BUDGET_FAQ.es.answer,
        },
        {
          question: '¿Qué diferencia hay entre una creadora UGC y una influencer?',
          answer: 'La influencer cobra por publicar en sus redes, para su propia audiencia. La creadora UGC hace videos para que la marca los use en sus canales y en sus anuncios. Por eso a una creadora UGC no le hacen falta seguidores: lo que cuenta es que sepa hacer un buen video.',
        },
        {
          question: '¿Cuánto tarda la entrega desde que envío el brief?',
          answer: 'Conmigo, normalmente entre 3 y 5 días hábiles después de recibir el producto y confirmar el brief. En ese tiempo reviso el brief, grabo y edito. Si tienes una fecha límite apretada, dímelo desde el principio y vemos cómo organizarlo.',
        },
        {
          question: '¿Puedo pedir cambios después de recibir los videos?',
          answer: 'Sí. Cada proyecto incluye 1 a 2 rondas de revisión para ajustes de edición, ritmo o texto en pantalla. Si hace falta regrabar, eso se cotiza aparte.',
        },
        {
          question: '¿Es mejor una creadora local o remota?',
          answer: 'Casi todo el UGC se hace de forma remota: la creadora graba en su espacio y con su propio equipo. Importa más la calidad del video y cómo se desenvuelve frente a cámara que el lugar donde vive. Yo trabajo desde Medellín con marcas de Estados Unidos, España y Latinoamérica.',
        },
        {
          question: '¿Tengo que enviarle mi producto a la creadora?',
          answer: 'Depende del video. Para demos y reseñas donde se ve el producto en uso, sí. Para videos de portavoz o de problema-solución donde se habla del producto sin mostrarlo, normalmente no hace falta.',
        },
      ],
      ctaTitle: '¿Buscas una creadora UGC?',
      ctaText: 'Cuéntame qué vendes y qué videos necesitas. Si mi perfil no es el indicado para tu proyecto, te lo digo.',
      relatedServiceIds: ['bilingual-ugc-creator', 'spokesperson-videos', 'ugc-product-demo'],
      relatedVerticalIds: ['beauty-ugc', 'ecommerce-ugc', 'tech-saas-ugc'],
    },
    en: {
      navLabel: 'How to hire a UGC creator',
      metaTitle: 'How to hire a bilingual UGC creator | Gisela Saldarriaga',
      metaDescription:
        'What to look for in a portfolio, what to ask, what to put in the brief, and what to expect from the process when you hire a UGC creator.',
      breadcrumbLabel: 'How to hire a UGC creator',
      heroEyebrow: 'Guide',
      heroTitle: 'How to hire a UGC creator',
      heroSummary:
        'Hiring a UGC creator isn’t the same as hiring an influencer or a production company. You want someone who makes videos for your ads and social media, knows how to open with a hook and close with a call to action, and talks about your product naturally. Here’s how to find one, how to vet them, and what working together looks like from brief to delivery.',
      heroPoints: [
        'What to look for in a UGC creator',
        'How to review a portfolio',
        'What the process looks like, from brief to delivery',
      ],
      primaryCtaLabel: 'Tell me about your project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sections: [
        {
          title: 'Figure out what you need first',
          body: [
            'Before you start looking, get clear on what you want. TikTok and Meta ads? Videos for your landing page? Testimonials? Your answer decides what kind of creator you need.',
            'UGC creators don’t all do the same thing. Some focus on talking-to-camera ads, some on demos, some on lifestyle content. Some mostly work with beauty brands, others with tech or ecommerce. Knowing what you need saves you time and money.',
            'For example, I work with brands that need videos in Spanish and English: problem-solution ads, demos, testimonials, and spokesperson videos. If that sounds like your project, I could be a good fit. If you need something else, another creator might suit you better.',
          ],
        },
        {
          title: 'Where to find professional UGC creators',
          body: [
            `There are a few places to look. Platforms like Billo, Insense or JoinBrands connect brands with creators, though quality varies a lot. Fiverr is a direct channel with verified reviews; I’m on there as [gisela_sm](${FIVERR_PROFILE_URL}) (${SITE_PROOF.fiverrRating}/5, ${SITE_PROOF.fiverrReviewCount} reviews). You can also search TikTok and Instagram for hashtags like #ugccreator or #ugclatina.`,
            'Google works too. A creator with their own website, a portfolio, and client testimonials usually takes the work more seriously than someone with only a social media profile.',
            'UGC agencies make sense if you need a lot of videos. They usually cost more, though, and you get less personal attention. If you want to talk directly with the person filming and keep a close eye on tone, working with the creator directly tends to go better.',
            'Ask other people in marketing, too. The UGC world is small and good recommendations get passed around.',
          ],
        },
        {
          title: 'What to check in a UGC creator’s portfolio',
          body: [
            'The portfolio matters most. Don’t just check whether the videos look nice. Check whether they feel real, whether they’re put together like ads, and whether the creator can change tone from brand to brand and still sound natural.',
            'Look at the audio (it matters as much as the picture), even and natural lighting, how comfortable they are talking to camera, a range of formats (ads, demos, testimonials), and whether the first few seconds make you want to keep watching.',
            'See whether they’ve worked in your category. It’s not a must, but if they’ve made videos for products like yours, they’ll understand what your customers worry about and get it right sooner.',
            'Something a lot of brands skip: ask what they know about ads. A UGC video has to work inside a campaign, so you want someone who understands hooks, calls to action, and how an ad is put together.',
          ],
        },
        {
          title: 'How to write the brief',
          body: [
            'A good brief saves you reshoots. It doesn’t need to be twenty pages, but it should cover what the product or service is, who you sell to, which platform the video is for, the tone you want, your key messages, and the call to action.',
            'Include examples of videos you like and videos you definitely don’t want. That gets the style across much faster than a long description.',
            'When I work with a brand, I always ask to see their current ads (even ones that aren’t working), their landing page, and at least one competitor video they like. That gives me enough context to suggest ideas that fit the brand.',
            'A common mistake is controlling every word of the script. If you hire an experienced creator, let her suggest the structure, since she knows what works on each platform. You bring what you know about the product and the customer, and she handles the idea, the filming, and the edit.',
          ],
        },
        {
          title: 'Budget and what’s included',
          body: [
            HIRE_BUDGET_FAQ.en.answer,
            'UGC rates vary a lot depending on the creator’s experience, how complex the brief is, and how many videos you need. A package usually works out cheaper than paying per video. A typical package might be 3 to 5 videos with different hooks.',
            'Some creators charge per video, some monthly, and some per project. Always ask what’s included. How many revisions? Vertical and horizontal versions? Short cuts for Stories? Rights to use the videos in paid ads?',
            'Usage rights are important. Make sure the agreement says whether you can run the videos as paid ads. Some creators include it and others charge extra. In my case, organic usage is included and a paid ads license is quoted separately.',
            'My advice: start with a small test project (2 or 3 videos) before you commit to a big package. You get to see the quality, how communication goes, and whether you like working together, without risking much budget.',
          ],
        },
        {
          title: 'Red flags',
          body: [
            'Don’t hire someone with no portfolio. If they can’t show you past work, you have no way to judge their level. The same goes for anyone who promises sales. The creator makes the videos, but results also depend on your ad strategy, your product, and your funnel.',
            'Be careful with anyone who takes the project without asking a single question about your brand. A good creator wants to understand your business, your audience, and what you’re after. If they don’t ask anything, you’ll probably get something generic.',
            'Watch out for delivery times that sound too good. A solid UGC video takes prep, filming, and editing. If someone promises ten videos in two days, it’ll show in the quality. For reference, I deliver in 3 to 5 business days after I receive the product and we confirm the brief.',
            'And pay attention to how they communicate. If they take ages to reply while you’re still negotiating, it’s unlikely to get better once the project starts.',
          ],
        },
        {
          title: 'A profile you can evaluate now',
          body: [
            `Gisela Saldarriaga is a bilingual UGC creator. She produces TikTok and Meta ads, demos, reviews, and spokesperson videos from Medellín, in Spanish and English, for US Hispanic, Spain, and LatAm brands. She works on Fiverr as [gisela_sm](${FIVERR_PROFILE_URL}): ${SITE_PROOF.fiverrRating}/5 from ${SITE_PROOF.fiverrReviewCount} verified reviews. 28+ brand campaigns. Content is delivered to the brand; she does not post client work unless it is an ambassador deal.`,
            `[Bilingual UGC creator](${getServicePath('bilingual-ugc-creator', 'en')})`,
          ],
        },
      ],
      faqs: [
        {
          question: HIRE_BUDGET_FAQ.en.question,
          answer: HIRE_BUDGET_FAQ.en.answer,
        },
        {
          question: 'What’s the difference between a UGC creator and an influencer?',
          answer: 'An influencer gets paid to post on their own accounts, to their own audience. A UGC creator makes videos for the brand to use on its own channels and in its ads. That’s why a UGC creator doesn’t need followers. What counts is making a good video.',
        },
        {
          question: 'How long does delivery take after I send the brief?',
          answer: 'With me, usually 3 to 5 business days after I receive the product and we confirm the brief. That covers reviewing the brief, filming, and editing. If you have a tight deadline, tell me at the start and we’ll work it out.',
        },
        {
          question: 'Can I ask for changes after I get the videos?',
          answer: 'Yes. Every project includes 1 to 2 rounds of revisions for edits, pacing, or on-screen text. If something needs to be reshot, that’s quoted separately.',
        },
        {
          question: 'Is it better to hire a local or a remote creator?',
          answer: 'Almost all UGC is made remotely: the creator films in their own space with their own gear. Video quality and how they come across on camera matter more than where they live. I work from Medellín with brands in the US, Spain, and Latin America.',
        },
        {
          question: 'Do I need to ship my product to the creator?',
          answer: 'It depends on the video. For demos and reviews where the product is shown in use, yes. For spokesperson or problem-solution videos where the product is talked about but not shown, usually not.',
        },
      ],
      ctaTitle: 'Looking for a UGC creator?',
      ctaText: 'Tell me what you sell and what videos you need. If I’m not the right fit for your project, I’ll tell you.',
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
      metaTitle: 'UGC vs influencer marketing: diferencias y cuándo usar cada uno | Gisela Saldarriaga',
      metaDescription:
        'UGC e influencer marketing no son lo mismo. Comparo costos, control, uso en anuncios y resultados para que decidas qué le conviene a tu marca.',
      breadcrumbLabel: 'UGC vs influencer marketing',
      heroEyebrow: 'Guía',
      heroTitle: 'UGC vs influencer marketing: diferencias y cuándo usar cada uno',
      heroSummary:
        'El UGC y el influencer marketing sirven para cosas distintas, se pagan de forma distinta y se miden de forma distinta. Ninguno gana en todo; depende de lo que necesites ahora. Aquí comparo los dos para que puedas decidir qué le conviene a tu marca.',
      heroPoints: [
        'Una tabla con las diferencias principales',
        'Para qué sirve cada uno y dónde se queda corto',
        'Cuándo tiene sentido combinarlos',
      ],
      primaryCtaLabel: 'Cuéntame tu proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sections: [
        {
          title: 'La diferencia principal: quién se queda con el contenido',
          body: [
            'La diferencia más importante es quién se queda con el contenido y dónde se publica. Con UGC, la marca recibe los videos y los usa en sus propios canales: anuncios, landing page, emails. Con influencer marketing, le pagas a alguien para que publique en sus redes y le llegue a su audiencia.',
            'Eso cambia el costo, cuánto puedes escalar, cuánto control tienes y cómo mides los resultados. No compiten entre sí; sirven en momentos distintos del embudo.',
            'Como creadora UGC, hago videos que la marca usa en sus propios canales. No publico el contenido de mis clientes en mis cuentas, salvo que tengamos un acuerdo de embajadora de marca. Lo que te entrego son los videos, grabados y editados para que los uses en tus anuncios y tus redes.',
          ],
        },
        {
          title: 'Control creativo y consistencia',
          body: [
            'Con UGC, la marca tiene el control. Defines el brief, apruebas el guion y pides revisiones. El video dice lo que tú quieres, con el tono de tu marca, y aun así se ve natural.',
            'Con influencers hay menos control. Cada uno tiene su estilo y sus propias ideas sobre cómo mostrar un producto. Algunos aceptan briefs detallados, pero muchos prefieren hacerlo a su manera, y eso a veces choca con lo que la marca necesita.',
            'También cambia la consistencia. Una creadora UGC puede hacerte 10 videos con el mismo tono para distintos productos de tu catálogo. Con 10 influencers distintos vas a tener 10 estilos distintos. Eso puede servir para que te conozcan, pero hace más difícil que la marca se vea igual en todos lados.',
          ],
        },
        {
          title: 'Costos',
          body: [
            'Lo que cobra un influencer depende sobre todo del tamaño de su audiencia. Un micro-influencer cobra bastante menos que alguien con cientos de miles de seguidores, y con celebridades el precio sube mucho más.',
            'El UGC se paga por video, y el precio depende del formato, de lo complejo del brief y de la creadora. La ventaja es que puedes usar ese video en tus anuncios durante el tiempo que cubra la licencia, sacar versiones con otros ganchos y llamados a la acción, y usarlo en distintas plataformas.',
            'Un post de influencer dura menos. El alcance orgánico se concentra en los primeros días y después el post desaparece del feed. Si quieres seguir apareciendo, tienes que pagar por posts nuevos.',
            'Aun así, el influencer marketing puede rendir más cuando lo que buscas es que te conozcan en un nicho específico. Si un influencer tiene justo el público que quieres, ese acceso directo vale.',
          ],
        },
        {
          title: 'Pruebas y escalabilidad',
          body: [
            'Con UGC es fácil probar. Puedes hacer 5 versiones del mismo anuncio con distintos ganchos, llamados a la acción y ángulos, y dejar que la plataforma de anuncios te muestre cuál rinde más.',
            'Con influencers es mucho más difícil. No le puedes pedir a un influencer que publique 5 versiones del mismo post. Y si el post no funciona, ese presupuesto ya se gastó.',
            'Escalar también es distinto. Si un video UGC funciona en tus anuncios, le subes el presupuesto y llegas a más gente sin grabar nada nuevo. Con un post de influencer, el alcance se queda en la audiencia de esa persona.',
            'Por eso muchas marcas que pautan en redes usan el UGC como su fuente principal de anuncios: graban varios videos, prueban rápido y le suben el presupuesto a lo que funciona.',
          ],
        },
        {
          title: 'Cuándo usar UGC y cuándo influencers',
          body: [
            'Usa UGC cuando lo que buscas es vender: bajar el costo por adquisición de tus anuncios, que tu landing page convierta más o dar confianza justo cuando la persona está decidiendo si compra. Ahí, en la parte baja del embudo, es donde el UGC suele rendir más.',
            'Usa influencers cuando necesitas que un nicho específico te conozca rápido. Si quieres que la comunidad de running sepa que tu marca existe, trabajar con alguien de running que ya tiene esa audiencia es más directo que construirla desde cero con anuncios.',
            'Muchas veces lo que mejor funciona es combinarlos: influencers para que te conozcan y tener prueba social (“mira, ella usa esto”), y UGC en tus anuncios para convertir ese interés en ventas.',
            'Si ya trabajaste con influencers y te dejaron likes y comentarios pero pocas ventas, probar videos UGC en tus anuncios puede ser el siguiente paso.',
          ],
        },
        {
          title: 'Cómo combinar los dos',
          body: [
            'Algunas marcas mezclan los dos modelos. Trabajan con creadoras UGC para hacer los videos y después los pautan desde la cuenta de un influencer, lo que se conoce como whitelisting.',
            'Otra opción es usar UGC en los anuncios pagados y sumar posts orgánicos de micro-influencers como prueba social. Los videos UGC van en la pauta y los posts de los influencers muestran a gente real recomendando la marca.',
            'Si tu presupuesto es limitado, te recomiendo empezar con UGC para tus anuncios y dejar los influencers para cuando ya sepas qué mensajes y formatos te funcionan. Así les das un brief basado en datos reales y no en suposiciones.',
          ],
        },
      ],
      comparisonTable: {
        headers: ['Aspecto', 'UGC', 'Influencer marketing'],
        rows: [
          ['Quién se queda con el contenido', 'La marca recibe los videos', 'Queda en las redes del influencer'],
          ['Dónde se publica', 'Canales y anuncios de la marca', 'Redes del influencer'],
          ['Control creativo', 'Alto: brief, guion y revisiones', 'Variable, depende del acuerdo'],
          ['Costo', 'Se paga por video', 'Depende del tamaño de la audiencia'],
          ['Vida útil', 'Mientras lo uses en tus anuncios', 'Sobre todo los primeros días'],
          ['Escalabilidad', 'Alta: subes el presupuesto de anuncios', 'Baja: limitada a su audiencia'],
          ['Pruebas A/B', 'Fáciles: varias versiones del mismo video', 'Difíciles: un post por colaboración'],
          ['Mejor para', 'Vender con anuncios pagados', 'Que te conozcan en un nicho'],
          ['¿Hacen falta seguidores?', 'No, importa cómo graba', 'Sí, es lo que estás pagando'],
          ['Métricas clave', 'CTR, CPA, ROAS', 'Alcance, impresiones, interacción'],
        ],
      },
      faqs: [
        {
          question: '¿Puedo usar el contenido de un influencer en mis anuncios?',
          answer: 'Depende del acuerdo. Muchos influencers cobran aparte la licencia para anuncios pagados (whitelisting). Con UGC pasa algo parecido: en mi caso, el uso orgánico va incluido y la licencia para anuncios pagados se cotiza aparte. Lo importante es dejarlo claro antes de empezar.',
        },
        {
          question: '¿El UGC reemplaza al influencer marketing?',
          answer: 'No, se complementan. El UGC sirve más para vender con anuncios pagados y el influencer marketing para que te conozcan en un nicho. Muchas marcas usan los dos.',
        },
        {
          question: '¿Qué pasa si un influencer habla mal de mi producto?',
          answer: 'Es uno de los riesgos del influencer marketing: no controlas del todo lo que dice. Con UGC apruebas el guion y puedes pedir revisiones antes de usar el video, así que nada sale sin que lo hayas visto.',
        },
        {
          question: '¿Cómo sé si necesito UGC o influencers?',
          answer: 'Si tu prioridad es bajar el costo de tus anuncios y vender, empieza con UGC. Si lo que quieres es que un nicho específico conozca tu marca, empieza con influencers. Si te alcanza para los dos, puedes combinarlos.',
        },
        {
          question: '¿Un influencer puede hacer UGC?',
          answer: 'Sí. Algunos influencers también hacen UGC: graban videos para que la marca los use en sus canales, sin publicarlos en sus propias redes. Suele salir más barato que una colaboración normal y te da más control.',
        },
        {
          question: '¿Cuál da mejor retorno?',
          answer: 'Depende de lo que quieras lograr. Para vender con anuncios en redes, el UGC suele salir más rentable porque cada video cuesta menos y puedes ir probando versiones. Para que te conozcan, un influencer puede rendir más si eliges bien con quién trabajar.',
        },
      ],
      ctaTitle: '¿Estás decidiendo entre UGC e influencers?',
      ctaText: 'Cuéntame qué vendes y qué quieres lograr, y te digo con sinceridad si el UGC te conviene ahora.',
      relatedServiceIds: ['ugc-ads-tiktok-meta', 'bilingual-ugc-creator', 'ugc-testimonials-reviews'],
      relatedVerticalIds: ['ecommerce-ugc', 'fashion-ugc', 'beauty-ugc'],
    },
    en: {
      navLabel: 'UGC vs influencer marketing',
      metaTitle: 'UGC vs influencer marketing: differences and when to use each | Gisela Saldarriaga',
      metaDescription:
        'UGC and influencer marketing aren’t the same thing. I compare cost, control, ad usage, and results so you can decide what your brand needs.',
      breadcrumbLabel: 'UGC vs influencer marketing',
      heroEyebrow: 'Guide',
      heroTitle: 'UGC vs influencer marketing: the differences and when to use each',
      heroSummary:
        'UGC and influencer marketing do different jobs, get paid for differently, and get measured differently. Neither one wins across the board; it depends on what you need right now. Here I compare the two so you can decide what makes sense for your brand.',
      heroPoints: [
        'A table with the main differences',
        'What each one is good for, and where it falls short',
        'When it makes sense to combine them',
      ],
      primaryCtaLabel: 'Tell me about your project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sections: [
        {
          title: 'The main difference: who gets the content',
          body: [
            'The biggest difference is who ends up with the content and where it gets posted. With UGC, the brand gets the videos and uses them on its own channels: ads, landing pages, email. With influencer marketing, you pay someone to post on their accounts and reach their audience.',
            'That changes the cost, how far you can scale, how much control you have, and how you measure results. They don’t compete with each other; they’re useful at different stages of the funnel.',
            'As a UGC creator, I make videos that the brand runs on its own channels. I don’t post client content on my accounts unless we have a brand ambassador deal. What you get from me are the videos, filmed and edited for your ads and social media.',
          ],
        },
        {
          title: 'Creative control and consistency',
          body: [
            'With UGC, the brand is in control. You write the brief, approve the script, and ask for revisions. The video says what you want, in your brand’s tone, and still looks natural.',
            'With influencers, you have less control. Each one has their own style and their own ideas about how to show a product. Some are fine with a detailed brief, but many prefer to do it their way, and that can clash with what the brand needs.',
            'Consistency is different too. One UGC creator can make you 10 videos in the same tone for different products in your catalog. With 10 different influencers, you get 10 different styles. That can help people find out about you, but it makes it harder for your brand to look the same everywhere.',
          ],
        },
        {
          title: 'Cost',
          body: [
            'What an influencer charges depends mostly on audience size. A micro-influencer costs a lot less than someone with hundreds of thousands of followers, and celebrities cost a lot more than that.',
            'UGC is paid per video, and the price depends on the format, how complex the brief is, and the creator. The upside is that you can run that video in your ads for as long as the license covers, cut versions with other hooks and calls to action, and use it across platforms.',
            'An influencer post has a shorter life. Most of the organic reach happens in the first few days, and then the post drops out of the feed. To keep showing up, you have to pay for new posts.',
            'Still, influencer marketing can be the better deal when what you want is to get known in a specific niche. If an influencer already has the audience you’re after, that direct access is worth paying for.',
          ],
        },
        {
          title: 'Testing and scaling',
          body: [
            'UGC is easy to test. You can make 5 versions of the same ad with different hooks, calls to action, and angles, and let the ad platform show you which one does best.',
            'With influencers, testing is much harder. You can’t ask an influencer to post 5 versions of the same thing. And if the post flops, that budget is already spent.',
            'Scaling works differently too. If a UGC video does well in your ads, you raise the budget and reach more people without filming anything new. With an influencer post, reach stays within that person’s audience.',
            'That’s why a lot of brands running paid social use UGC as their main source of ads: they film several videos, test quickly, and put more budget behind what works.',
          ],
        },
        {
          title: 'When to use UGC and when to use influencers',
          body: [
            'Use UGC when the goal is sales: lowering cost per acquisition on your ads, getting your landing page to convert better, or building trust right when someone is deciding whether to buy. That’s the bottom of the funnel, and it’s where UGC usually does the most.',
            'Use influencers when you need a specific niche to find out about you quickly. If you want the running community to know your brand exists, working with a runner who already has that audience is more direct than building one from scratch with ads.',
            'Often the best setup is both: influencers to get known and earn social proof (“look, she uses this”), and UGC in your ads to turn that interest into sales.',
            'If you’ve already worked with influencers and got likes and comments but few sales, trying UGC videos in your ads could be the next step.',
          ],
        },
        {
          title: 'How to combine the two',
          body: [
            'Some brands mix both models. They work with UGC creators to make the videos and then run them as ads from an influencer’s account, which is called whitelisting.',
            'Another option is to use UGC in your paid ads and add organic posts from micro-influencers as social proof. The UGC videos go into the ads, and the influencer posts show real people recommending the brand.',
            'If your budget is tight, I’d start with UGC for your ads and save influencers for when you know which messages and formats work. That way you can brief them with real data instead of guesses.',
          ],
        },
      ],
      comparisonTable: {
        headers: ['Aspect', 'UGC', 'Influencer marketing'],
        rows: [
          ['Who gets the content', 'The brand receives the videos', 'It stays on the influencer’s accounts'],
          ['Where it’s posted', 'Brand channels and ads', 'Influencer’s accounts'],
          ['Creative control', 'High: brief, script, and revisions', 'Varies with the agreement'],
          ['Cost', 'Paid per video', 'Depends on audience size'],
          ['Shelf life', 'As long as you run it in ads', 'Mostly the first few days'],
          ['Scalability', 'High: raise your ad budget', 'Low: limited to their audience'],
          ['A/B testing', 'Easy: several versions of one video', 'Hard: one post per collaboration'],
          ['Best for', 'Sales through paid ads', 'Getting known in a niche'],
          ['Followers needed?', 'No, filming skill matters', 'Yes, that’s what you’re paying for'],
          ['Key metrics', 'CTR, CPA, ROAS', 'Reach, impressions, engagement'],
        ],
      },
      faqs: [
        {
          question: 'Can I use an influencer’s content in my ads?',
          answer: 'It depends on the agreement. Many influencers charge extra for a paid ads license (whitelisting). UGC works in a similar way: in my case, organic usage is included and a paid ads license is quoted separately. Either way, agree on it before you start.',
        },
        {
          question: 'Does UGC replace influencer marketing?',
          answer: 'No, they complement each other. UGC is more useful for selling through paid ads, and influencer marketing for getting known in a niche. Plenty of brands use both.',
        },
        {
          question: 'What if an influencer says something negative about my product?',
          answer: 'That’s one of the risks of influencer marketing: you don’t fully control what they say. With UGC, you approve the script and can ask for revisions before you use the video, so nothing goes out without you seeing it first.',
        },
        {
          question: 'How do I know if I need UGC or influencers?',
          answer: 'If your priority is lowering ad costs and making sales, start with UGC. If you want a specific niche to know your brand, start with influencers. If your budget covers both, you can combine them.',
        },
        {
          question: 'Can an influencer also do UGC?',
          answer: 'Yes. Some influencers also do UGC: they film videos for the brand to use on its own channels, without posting them on their own accounts. It’s usually cheaper than a regular collaboration and gives you more control.',
        },
        {
          question: 'Which one gives a better return?',
          answer: 'It depends on the goal. For selling through social ads, UGC usually comes out ahead because each video costs less and you can keep testing versions. For getting known, an influencer can do more if you pick the right person.',
        },
      ],
      ctaTitle: 'Deciding between UGC and influencers?',
      ctaText: 'Tell me what you sell and what you want to achieve, and I’ll give you an honest take on whether UGC makes sense for you right now.',
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
      metaTitle: 'Formatos de UGC ads para TikTok y Meta | Gisela Saldarriaga',
      metaDescription:
        'Los 7 formatos de UGC más comunes en TikTok Ads y Meta Ads: cómo se estructura cada uno, cuánto dura y para qué objetivo sirve.',
      breadcrumbLabel: 'Formatos UGC para ads',
      heroEyebrow: 'Guía',
      heroTitle: 'Formatos de UGC ads para TikTok y Meta',
      heroSummary:
        'No todos los videos UGC funcionan igual como anuncio. Un testimonial no se arma igual que un problema-solución, y un demo no tiene el mismo ritmo que un video hablando a cámara. Aquí te explico los formatos que más se usan en TikTok Ads y Meta Ads y cómo se estructura cada uno.',
      heroPoints: [
        'Los 7 formatos de UGC más usados en anuncios',
        'Estructura y duración de cada uno',
        'Cuál usar según tu objetivo',
      ],
      primaryCtaLabel: 'Cuéntame tu proyecto',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sections: [
        {
          title: 'Por qué importa el formato',
          body: [
            'Un error común es pensar que cualquier video con una persona real sirve como anuncio UGC. El formato cambia bastante el resultado. Un testimonial y un problema-solución están armados de forma distinta y llaman la atención por razones distintas.',
            'El arranque del video decide si la persona se queda o sigue bajando, por eso el gancho importa tanto. Pero el gancho cambia según el formato: en un testimonial suele funcionar la emoción, en un demo la curiosidad y en un problema-solución que la persona se reconozca en el problema.',
            'Haciendo videos para marcas de distintas categorías, he visto que algunos formatos sirven más para ciertos objetivos, productos y públicos. En esta guía te cuento lo que he aprendido.',
          ],
        },
        {
          title: '1. Problema-solución',
          body: [
            'Estructura: gancho con el problema → por qué molesta → el producto como solución → prueba o demo → llamado a la acción. Duración: 30-60 segundos.',
            'Es de los formatos más usados para venta directa. Primero la persona se identifica con un problema que ya tiene y después ve que hay una solución.',
            'El gancho suele empezar con frases como “Si te pasa esto...” o “Estaba cansada de...”, que enganchan porque quien mira se ve reflejado. El problema tiene que ser real y específico, no algo genérico.',
            'Funciona especialmente bien para skincare, productos de bienestar, apps, herramientas de productividad y cualquier producto que resuelva una molestia concreta.',
          ],
        },
        {
          title: '2. Testimonial',
          body: [
            'Estructura: contexto personal → cómo conoció el producto → cómo fue usarlo → resultado → llamado a la acción. Duración: 30-45 segundos.',
            'El testimonial funciona por prueba social: si a alguien como yo le sirvió, probablemente me sirva a mí. Es el formato que más se parece a una recomendación personal.',
            'Lo importante es que suene a una experiencia de verdad y no a un guion de comercial. Por eso prefiero usar el producto antes de grabar: así hablo de cómo me fue y no de una lista de beneficios.',
            'Es muy útil cuando ya tienes tráfico y la gente está a punto de decidir si compra. También funciona bien en retargeting, para quienes visitaron tu sitio y no compraron.',
          ],
        },
        {
          title: '3. Demo de producto',
          body: [
            'Estructura: gancho visual → unboxing o preparación → uso paso a paso → resultado visible → llamado a la acción. Duración: 15-45 segundos.',
            'El demo es visual. La gente quiere ver el producto en uso real, no en un render 3D ni en una foto de estudio. Un buen demo UGC lo muestra en un contexto cotidiano: en la cocina, en el escritorio, en la rutina de skincare.',
            'Lo primero que se ve importa mucho. Empieza mostrando algo que dé curiosidad: el empaque, la textura, la primera vez que se usa. En los demos, muchas veces conviene que el producto aparezca antes de decir cualquier cosa.',
            'Este formato sirve más para productos físicos que se ven bien en cámara: beauty, gadgets, comida y cualquier cosa que se entienda mejor viéndola en uso.',
          ],
        },
        {
          title: '4. Portavoz',
          body: [
            'Estructura: saludo y presentación → mensaje principal → beneficios clave → llamado a la acción. Duración: 15-30 segundos.',
            'En el video de portavoz, la creadora habla directo a cámara en nombre de la marca. No es un testimonial, porque no cuenta su experiencia personal: presenta el producto de forma directa y cercana.',
            'Sirve para lanzamientos, ofertas, explicar un servicio y cualquier mensaje que necesite una cara que hable por la marca. Funciona mejor cuando la creadora se siente cómoda frente a cámara.',
            'Lo difícil es el tono. Tiene que sonar lo bastante profesional para representar a la marca, pero con naturalidad, para que no parezca un comercial de televisión.',
          ],
        },
        {
          title: '5. Listicle o “3 razones por las que...”',
          body: [
            'Estructura: gancho con un número → razón 1 → razón 2 → razón 3 → llamado a la acción. Duración: 30-60 segundos.',
            'Las listas funcionan porque dejan claro desde el principio qué viene. Si dices “3 razones por las que...”, la persona sabe que son tres y tiene un motivo para quedarse hasta el final.',
            'La primera razón tiene que ser la más fuerte o la más sorprendente. Si la primera es débil, nadie llega a la segunda. La última debería llevar directo al llamado a la acción.',
            'Es un formato flexible: sirve para que te conozcan (“3 cosas que no sabías de...”), para que te consideren (“3 razones para probar...”) y para vender (“3 razones por las que me cambié a...”).',
          ],
        },
        {
          title: '6. Antes y después',
          body: [
            'Estructura: el “antes” → transición → el “después” → reacción → llamado a la acción. Duración: 15-30 segundos.',
            'Es el formato más directo para productos con resultados que se ven. El cambio está en pantalla y no hace falta explicarlo mucho.',
            'Funciona mejor cuando la diferencia es obvia: skincare, limpieza, organización, diseño, fitness. Funciona menos cuando el beneficio no se ve, como en un software de productividad.',
            'Un consejo: que la transición sea limpia y rápida. No alargues el “antes”, porque la gente quiere ver el “después”. Y el resultado tiene que ser real; si exageras, se nota.',
          ],
        },
        {
          title: '7. B-roll de estilo de vida',
          body: [
            'Estructura: varios clips del producto en uso diario, con texto en pantalla o voz en off. Duración: 10-20 segundos.',
            'Es el formato que más se parece a una publicación normal y menos a un anuncio. Se usa mucho para complementar otros formatos o como anuncio propio para que te conozcan.',
            'También sirve para tener variedad: mientras tus anuncios principales son testimoniales o problema-solución, el B-roll te da videos nuevos para rotar en tu cuenta publicitaria.',
            'Además es el más fácil de producir: de una sola grabación salen varios clips que puedes reutilizar en distintas campañas y plataformas.',
          ],
        },
        {
          title: 'Cómo elegir el formato para tu campaña',
          body: [
            'Depende de tres cosas: tu objetivo (que te conozcan, que te consideren o vender), tu producto (si se ve o no en cámara, si es nuevo o ya conocido) y tu público (si ya te conoce o no).',
            'Para público frío, que no conoce tu marca, suelen funcionar mejor el problema-solución y el listicle, porque no hace falta saber nada antes. Para retargeting, con gente que ya visitó tu sitio, los testimoniales y los demos tienen más sentido porque ya saben quién eres.',
            'Mi recomendación es no apostar todo a un solo formato. Graba 2 o 3 formatos distintos y deja que los resultados te digan cuál le funciona a tu público. A veces el formato que la marca daba por seguro no es el que mejor rinde.',
            'Si no sabes por cuál empezar, escríbeme. Me cuentas qué vendes y a quién, y te propongo qué formatos grabar primero.',
          ],
        },
      ],
      comparisonTable: {
        headers: ['Formato', 'Para qué sirve', 'Duración', 'Dificultad'],
        rows: [
          ['Problema-solución', 'Venta directa', '30-60s', 'Media'],
          ['Testimonial', 'Confianza / retargeting', '30-45s', 'Media'],
          ['Demo de producto', 'Productos visuales', '15-45s', 'Baja-media'],
          ['Portavoz', 'Lanzamientos / ofertas', '15-30s', 'Media-alta'],
          ['Listicle', 'Retención / awareness', '30-60s', 'Baja'],
          ['Antes y después', 'Resultados visibles', '15-30s', 'Baja'],
          ['B-roll de estilo de vida', 'Awareness / variedad', '10-20s', 'Baja'],
        ],
      },
      faqs: [
        {
          question: '¿Qué formato UGC funciona mejor en TikTok Ads?',
          answer: 'En TikTok suelen rendir bien el problema-solución y el listicle, porque se parecen a lo que la gente ya ve en la app. El gancho importa mucho: tienes que captar la atención en los primeros segundos.',
        },
        {
          question: '¿Meta Ads y TikTok Ads necesitan formatos distintos?',
          answer: 'No necesariamente, pero sí ajustes. TikTok va mejor con un tono más casual y un ritmo más rápido. En Meta (Instagram y Facebook) puedes usar videos un poco más largos y tonos más variados. El video base puede ser el mismo, con cambios en la edición.',
        },
        {
          question: '¿Cuántas versiones del gancho debería probar por formato?',
          answer: 'Por lo menos 2 o 3 por formato. El gancho es lo que decide si alguien se queda a ver el video, así que con el mismo video y otro gancho los resultados pueden cambiar bastante.',
        },
        {
          question: '¿Puedo mezclar varios formatos en una misma campaña?',
          answer: 'Sí, y te lo recomiendo. Tener 2 o 3 formatos en la misma campaña te da más datos para comparar y evita que la gente se canse de ver siempre el mismo anuncio.',
        },
        {
          question: '¿Cuánto debería durar un video UGC para anuncios?',
          answer: 'Para TikTok, entre 15 y 30 segundos suele ser lo ideal. En Meta puedes llegar a 60 segundos si el contenido lo pide. No alargues el video por rellenar: si el mensaje cabe en 20 segundos, que dure 20.',
        },
        {
          question: '¿Tengo que producir todos los formatos a la vez?',
          answer: 'No. Empieza con 2 o 3 que vayan con tu objetivo principal. Cuando tengas resultados, sumas otros formatos según lo que haya funcionado. Producir todo de una vez sin datos suele terminar en gastar más de la cuenta.',
        },
      ],
      ctaTitle: '¿Necesitas UGC ads para tu marca?',
      ctaText: 'Cuéntame qué vendes y en qué plataformas pautas, y te digo con qué formatos empezaría.',
      relatedServiceIds: ['ugc-ads-tiktok-meta', 'ugc-problem-solution', 'spokesperson-videos', 'ugc-product-demo'],
      relatedVerticalIds: ['ecommerce-ugc', 'beauty-ugc', 'tech-saas-ugc'],
    },
    en: {
      navLabel: 'UGC ad formats guide',
      metaTitle: 'UGC ad formats for TikTok and Meta | Gisela Saldarriaga',
      metaDescription:
        'The 7 most common UGC ad formats on TikTok Ads and Meta Ads: how each one is structured, how long it runs, and what it’s good for.',
      breadcrumbLabel: 'UGC ad formats guide',
      heroEyebrow: 'Guide',
      heroTitle: 'UGC ad formats for TikTok and Meta',
      heroSummary:
        'Not every UGC video works the same way as an ad. A testimonial isn’t built like a problem-solution video, and a demo doesn’t have the same pacing as a talking-to-camera ad. Here I go through the formats used most on TikTok Ads and Meta Ads and how each one is structured.',
      heroPoints: [
        'The 7 UGC formats used most in ads',
        'Structure and length of each one',
        'Which one to use for your goal',
      ],
      primaryCtaLabel: 'Tell me about your project',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sections: [
        {
          title: 'Why format matters',
          body: [
            'A common mistake is assuming any video with a real person in it works as a UGC ad. Format changes the result a lot. A testimonial and a problem-solution video are built differently and grab attention for different reasons.',
            'The opening decides whether someone keeps watching or scrolls past, which is why the hook matters so much. But the right hook depends on the format: emotion tends to work in a testimonial, curiosity in a demo, and recognizing the problem in a problem-solution video.',
            'Making videos for brands in different categories, I’ve noticed that some formats suit certain goals, products, and audiences better than others. This guide is what I’ve picked up along the way.',
          ],
        },
        {
          title: '1. Problem-solution',
          body: [
            'Structure: hook with the problem → why it’s annoying → the product as the fix → proof or demo → call to action. Length: 30-60 seconds.',
            'It’s one of the most used formats for direct sales. First the viewer recognizes a problem they already have, then they see there’s a fix.',
            'The hook usually opens with lines like “If this happens to you...” or “I was so tired of...”, which work because viewers see themselves in it. The problem has to be real and specific, not generic.',
            'It works especially well for skincare, wellness products, apps, productivity tools, and anything that fixes a specific frustration.',
          ],
        },
        {
          title: '2. Testimonial',
          body: [
            'Structure: personal context → how they found the product → what using it was like → result → call to action. Length: 30-45 seconds.',
            'Testimonials work through social proof: if it worked for someone like me, it’ll probably work for me. It’s the format closest to a personal recommendation.',
            'What matters is that it sounds like a real experience and not a commercial script. That’s why I like to use the product before I film, so I’m talking about how it went for me and not reading off a list of benefits.',
            'It’s most useful when you already have traffic and people are close to deciding. It also works well for retargeting people who visited your site and didn’t buy.',
          ],
        },
        {
          title: '3. Product demo',
          body: [
            'Structure: visual hook → unboxing or setup → step-by-step use → visible result → call to action. Length: 15-45 seconds.',
            'A demo is visual. People want to see the product actually being used, not a 3D render or a studio photo. A good UGC demo shows it in an everyday setting: in the kitchen, on a desk, in a skincare routine.',
            'What shows up first matters a lot. Open with something that makes people curious: the packaging, the texture, the first use. In demos, it often helps to show the product before saying anything.',
            'This format suits physical products that look good on camera: beauty, gadgets, food, and anything that’s easier to understand when you see it in use.',
          ],
        },
        {
          title: '4. Spokesperson',
          body: [
            'Structure: greeting and intro → main message → key benefits → call to action. Length: 15-30 seconds.',
            'In a spokesperson video, the creator talks straight to camera on behalf of the brand. It’s not a testimonial, because she isn’t sharing a personal experience. She’s presenting the product in a direct, friendly way.',
            'It works for launches, special offers, explaining a service, and any message that needs a face speaking for the brand. It works best when the creator is comfortable on camera.',
            'The tricky part is tone. It has to sound professional enough to represent the brand but natural enough that it doesn’t come off like a TV commercial.',
          ],
        },
        {
          title: '5. Listicle, or “3 reasons why...”',
          body: [
            'Structure: hook with a number → reason 1 → reason 2 → reason 3 → call to action. Length: 30-60 seconds.',
            'Lists work because they tell people up front what’s coming. If you say “3 reasons why...”, viewers know there are three and have a reason to stay until the end.',
            'Lead with the strongest or most surprising reason. If the first one is weak, nobody gets to the second. The last one should lead straight into the call to action.',
            'It’s a flexible format. It works for awareness (“3 things you didn’t know about...”), consideration (“3 reasons to try...”), and sales (“3 reasons I switched to...”).',
          ],
        },
        {
          title: '6. Before and after',
          body: [
            'Structure: the “before” → transition → the “after” → reaction → call to action. Length: 15-30 seconds.',
            'It’s the most direct format for products with results you can see. The change is right there on screen and doesn’t need much explaining.',
            'It works best when the difference is obvious: skincare, cleaning, organizing, design, fitness. It works less well when the benefit is invisible, like with productivity software.',
            'One tip: keep the transition clean and quick. Don’t drag out the “before,” because people want to see the “after.” And the result has to be real; if you exaggerate, people notice.',
          ],
        },
        {
          title: '7. Lifestyle B-roll',
          body: [
            'Structure: a few clips of the product in everyday use, with on-screen text or voiceover. Length: 10-20 seconds.',
            'It’s the format that looks most like a regular post and least like an ad. It’s often used alongside other formats or as a standalone ad for awareness.',
            'It’s also good for variety: while your main ads are testimonials or problem-solution videos, B-roll gives you fresh videos to rotate in your ad account.',
            'And it’s the easiest to produce: one shoot gives you several clips you can reuse across campaigns and platforms.',
          ],
        },
        {
          title: 'How to choose a format for your campaign',
          body: [
            'It comes down to three things: your goal (awareness, consideration, or sales), your product (whether it shows well on camera, whether it’s new or already known), and your audience (whether they know you yet).',
            'For cold audiences who don’t know your brand, problem-solution and listicle videos usually work better because they don’t need any background. For retargeting people who’ve already visited your site, testimonials and demos make more sense because they already know who you are.',
            'My advice is not to put everything on one format. Film 2 or 3 different ones and let the results show you what works with your audience. Sometimes the format a brand was sure about isn’t the one that performs best.',
            'If you’re not sure where to start, message me. Tell me what you sell and who you sell to, and I’ll suggest which formats to film first.',
          ],
        },
      ],
      comparisonTable: {
        headers: ['Format', 'Best for', 'Length', 'Difficulty'],
        rows: [
          ['Problem-solution', 'Direct sales', '30-60s', 'Medium'],
          ['Testimonial', 'Trust / retargeting', '30-45s', 'Medium'],
          ['Product demo', 'Visual products', '15-45s', 'Low-medium'],
          ['Spokesperson', 'Launches / offers', '15-30s', 'Medium-high'],
          ['Listicle', 'Retention / awareness', '30-60s', 'Low'],
          ['Before and after', 'Visible results', '15-30s', 'Low'],
          ['Lifestyle B-roll', 'Awareness / variety', '10-20s', 'Low'],
        ],
      },
      faqs: [
        {
          question: 'Which UGC format works best on TikTok Ads?',
          answer: 'On TikTok, problem-solution and listicle videos tend to do well because they look like what people already watch in the app. The hook matters a lot: you have to grab attention in the first few seconds.',
        },
        {
          question: 'Do Meta Ads and TikTok Ads need different formats?',
          answer: 'Not necessarily, but they need some adjustments. TikTok suits a more casual tone and faster pacing. On Meta (Instagram and Facebook) you can run slightly longer videos and a wider range of tones. The base video can be the same, with changes in the edit.',
        },
        {
          question: 'How many hook versions should I test per format?',
          answer: 'At least 2 or 3 per format. The hook decides whether someone stays to watch, so the same video with a different hook can get quite different results.',
        },
        {
          question: 'Can I mix several formats in one campaign?',
          answer: 'Yes, and I’d recommend it. Running 2 or 3 formats in the same campaign gives you more to compare and keeps people from getting tired of seeing the same ad.',
        },
        {
          question: 'How long should a UGC ad be?',
          answer: 'For TikTok, 15 to 30 seconds is usually right. On Meta you can go up to 60 seconds if the content needs it. Don’t stretch a video just to fill time: if the message fits in 20 seconds, keep it at 20.',
        },
        {
          question: 'Do I need to produce every format at once?',
          answer: 'No. Start with 2 or 3 that match your main goal. Once you have results, add other formats based on what worked. Producing everything at once with no data usually means spending more than you need to.',
        },
      ],
      ctaTitle: 'Need UGC ads for your brand?',
      ctaText: 'Tell me what you sell and where you run ads, and I’ll tell you which formats I’d start with.',
      relatedServiceIds: ['ugc-ads-tiktok-meta', 'ugc-problem-solution', 'spokesperson-videos', 'ugc-product-demo'],
      relatedVerticalIds: ['ecommerce-ugc', 'beauty-ugc', 'tech-saas-ugc'],
    },
  },

  /* ═══════════════════════════════════════════════════════════════
     5. CUÁNTO COBRA / HOW MUCH A UGC CREATOR CHARGES
     ═══════════════════════════════════════════════════════════════ */
  'how-much-ugc-creator-charge': {
    es: {
      navLabel: 'Cuánto cobra una creadora UGC',
      metaTitle: 'Cuánto cobra una creadora UGC | Gisela Saldarriaga',
      metaDescription: PRICING_META.es,
      breadcrumbLabel: 'Cuánto cobra una creadora UGC',
      heroEyebrow: 'Guía',
      heroTitle: 'Cuánto cobra una creadora UGC: mis precios en Fiverr',
      heroSummary:
        `Soy Gisela Saldarriaga, creadora UGC bilingüe en Medellín. Si quieres saber cuánto cuesta un video UGC antes de escribirme, aquí tienes mis precios publicados en Fiverr. Mis paquetes UGC en Fiverr empiezan en ${usd(FIVERR_PRICING.ugc.basic.price)} por un video en español. Los proyectos personalizados o directos se cotizan, y las versiones en inglés también. Abajo te explico qué incluye cada paquete y qué hace que el precio suba.`,
      heroPoints: [],
      leadCtaLabel: 'Escríbeme directo para cotizar tu proyecto →',
      leadCtaHref: getHomePath('es', '#contact'),
      primaryCtaLabel: 'Escríbeme directo con tu brief →',
      primaryCtaHref: getHomePath('es', '#contact'),
      secondaryCtaLabel: 'Ver mi trabajo',
      secondaryCtaHref: getHomePath('es', '#portfolio'),
      sections: [
        {
          title: 'Mis precios en Fiverr',
          italicLead: `Precios verificados en Fiverr el ${verifiedDateEs()}.`,
          bodyBefore: [
            `En dólares (USD). Son los precios de Fiverr a ${monthYearEs()} y pueden cambiar. El precio final se confirma en el checkout de Fiverr, incluida la tarifa de servicio al comprador y los impuestos que apliquen. Todos los servicios de esta tabla son en español. Las versiones en inglés se cotizan aparte.`,
          ],
          table: {
            headers: ['Servicio', 'Paquete', 'Qué incluye', 'Entrega en Fiverr — días naturales', 'Precio'],
            rows: [
              [
                'Video UGC en español',
                'Basic',
                '1 video vertical de 30 s: ideación, grabación y subtítulos',
                String(FIVERR_PRICING.ugc.basic.deliveryDays),
                mdPrice(FIVERR_PRICING.ugc.basic.price, FIVERR_PRICING.gigs.ugc),
              ],
              [
                'Video UGC en español',
                'Standard',
                '1 video de 60 s; suma el guion',
                String(FIVERR_PRICING.ugc.standard.deliveryDays),
                mdPrice(FIVERR_PRICING.ugc.standard.price, FIVERR_PRICING.gigs.ugc),
              ],
              [
                'Video UGC en español',
                'Premium',
                '2 videos de 60 s con efectos',
                String(FIVERR_PRICING.ugc.premium.deliveryDays),
                mdPrice(FIVERR_PRICING.ugc.premium.price, FIVERR_PRICING.gigs.ugc),
              ],
              [
                'Video UGC en español',
                'Entrega rápida (extra)',
                `${rushRange()}, según paquete`,
                '—',
                mdLink(rushRange(), FIVERR_PRICING.gigs.ugc),
              ],
              [
                'Video de portavoz en español',
                'Hasta 65 palabras',
                'Video a cámara',
                spokespersonDelivery(),
                dualSpokespersonPrice(FIVERR_PRICING.spokesperson.words65.price, 'es'),
              ],
              [
                'Video de portavoz en español',
                '~130 palabras',
                'Video a cámara',
                spokespersonDelivery(),
                dualSpokespersonPrice(FIVERR_PRICING.spokesperson.words130.price, 'es'),
              ],
              [
                'Video de portavoz en español',
                'Hasta 260 palabras',
                'Video a cámara',
                spokespersonDelivery(),
                dualSpokespersonPrice(FIVERR_PRICING.spokesperson.words260.price, 'es'),
              ],
              [
                'Voz en off en español',
                'Hasta 75 palabras',
                'Locución',
                String(FIVERR_PRICING.voiceover.deliveryDays),
                mdPrice(FIVERR_PRICING.voiceover.price, FIVERR_PRICING.gigs.voiceover),
              ],
            ],
          },
          body: [
            'En Fiverr, el plazo empieza a contar cuando envías los requisitos del pedido. En proyectos directos entrego en 3 a 5 días hábiles después de recibir el producto y confirmar el brief. La licencia para anuncios pagados no aparece en Fiverr: el uso orgánico va incluido y la licencia para anuncios pagados se cotiza por separado.',
          ],
        },
        {
          title: 'Qué cambia el precio',
          body: [],
          bullets: [
            `**Duración:** un video de 60 s cuesta más que uno de 30 s. En portavoz, el precio va por palabras del guion.`,
            '**Guion:** el paquete Standard suma el guion.',
            '**Cantidad de videos:** el Premium trae 2 videos de 60 s con efectos.',
            `**Entrega rápida para videos UGC en Fiverr:** ${rushRange()}, según paquete.`,
            '**Idioma:** estos precios son para videos en español. Las versiones en inglés se cotizan aparte.',
            '**Licencia para anuncios:** el uso orgánico va incluido y la licencia para anuncios pagados se cotiza por separado.',
          ],
        },
        {
          title: 'Fiverr o trabajar conmigo directamente',
          body: [
            `Fiverr te sirve si quieres un video puntual en español, con precio cerrado y el pago protegido por la plataforma. Allí trabajo como [gisela_sm](${FIVERR_PROFILE_URL}), con ${FIVERR_PRICING.fiverrRating}/5 en ${FIVERR_PRICING.fiverrReviewCount} reseñas (Fiverr, ${monthEsShort()}). Si necesitas un lote con varios ganchos, versiones en inglés o licencia para anuncios pagados, [escríbeme directo](${getHomePath('es', '#contact')}) y te cotizo el proyecto. En proyectos directos entrego en 3 a 5 días hábiles después de recibir el producto y confirmar el brief.`,
          ],
        },
      ],
      faqs: [
        {
          question: '¿Cuánto cobra Gisela Saldarriaga por un video UGC?',
          answer: `Mis paquetes UGC en Fiverr empiezan en ${usd(FIVERR_PRICING.ugc.basic.price)} por un video vertical en español de 30 segundos, con ideación, grabación y subtítulos. El Standard de ${usd(FIVERR_PRICING.ugc.standard.price)} es un video de 60 segundos e incluye el guion. El Premium de ${usd(FIVERR_PRICING.ugc.premium.price)} son dos videos de 60 segundos con efectos. Son precios de ${monthYearEs()} y pueden cambiar. Las versiones en inglés se cotizan aparte.`,
        },
        {
          question: '¿Cuánto cuesta un video de portavoz?',
          answer: `En Fiverr, los videos de portavoz en español se cobran según las palabras del guion: ${usd(FIVERR_PRICING.spokesperson.words65.price)} hasta ${FIVERR_PRICING.spokesperson.words65.words} palabras, ${usd(FIVERR_PRICING.spokesperson.words130.price)} por unas ${FIVERR_PRICING.spokesperson.words130.wordsApprox} y ${usd(FIVERR_PRICING.spokesperson.words260.price)} hasta ${FIVERR_PRICING.spokesperson.words260.words}. Son precios de ${monthYearEs()} en dólares. Si necesitas varios videos o versiones en inglés, te cotizo un proyecto directo.`,
        },
        {
          question: '¿El precio incluye usar los videos en anuncios pagados?',
          answer:
            'No. El uso orgánico va incluido y la licencia para anuncios pagados se cotiza por separado. Esa licencia no aparece en mis paquetes de Fiverr. Si piensas pautar los videos en TikTok o Meta, dímelo desde el principio y te cotizo la licencia junto con el proyecto.',
        },
        {
          question: '¿Cuánto tarda la entrega en Fiverr?',
          answer: `En Fiverr, cada paquete tiene su plazo en días naturales: ${FIVERR_PRICING.ugc.basic.deliveryDays} días para los videos UGC Basic y Standard, ${FIVERR_PRICING.ugc.premium.deliveryDays} para el Premium, ${FIVERR_PRICING.spokesperson.deliveryMin} a ${FIVERR_PRICING.spokesperson.deliveryMax} para portavoz y ${FIVERR_PRICING.voiceover.deliveryDays} para voz en off. El plazo empieza cuando envías los requisitos del pedido. En proyectos directos entrego en 3 a 5 días hábiles después de recibir el producto y confirmar el brief.`,
        },
        {
          question: '¿Es más barato contratarte por Fiverr o directamente?',
          answer: `Depende de lo que necesites. Mis paquetes UGC en Fiverr empiezan en ${usd(FIVERR_PRICING.ugc.basic.price)} y te sirven para uno o dos videos en español. Si buscas un lote con varios ganchos, videos en inglés o licencia para anuncios pagados, te conviene más un proyecto directo, que cotizo según el brief. En Fiverr tengo ${FIVERR_PRICING.fiverrRating}/5 en ${FIVERR_PRICING.fiverrReviewCount} reseñas (${monthEsShort()}).`,
        },
      ],
      ctaTitle: '¿Quieres cotizar tu proyecto?',
      ctaText: `Si ya sabes qué necesitas, mira cómo trabajo como [creadora UGC bilingüe](${getServicePath('bilingual-ugc-creator', 'es')}). Si es tu primera vez, empieza por [cómo contratar una creadora UGC](${getResourcePath('how-to-hire-ugc-creator', 'es')}).`,
      relatedServiceIds: ['bilingual-ugc-creator', 'spokesperson-videos', 'ugc-ads-tiktok-meta'],
      relatedVerticalIds: ['ecommerce-ugc', 'beauty-ugc'],
    },
    en: {
      navLabel: 'How much a UGC creator charges',
      metaTitle: 'How much does a UGC creator charge? | Gisela Saldarriaga',
      metaDescription: PRICING_META.en,
      breadcrumbLabel: 'How much a UGC creator charges',
      heroEyebrow: 'Guide',
      heroTitle: 'How much does a UGC creator charge? My Fiverr prices',
      heroSummary:
        `I'm Gisela Saldarriaga, a bilingual UGC creator based in Medellín. If you want to know what a UGC video costs before you message me, these are my published Fiverr prices. My UGC packages on Fiverr start at ${usd(FIVERR_PRICING.ugc.basic.price)} for one video in Spanish. Custom and direct projects are quoted, and so are English versions. Below, I explain what each package includes and what makes the price go up.`,
      heroPoints: [],
      leadCtaLabel: 'Message me directly for a quote →',
      leadCtaHref: getHomePath('en', '#contact'),
      primaryCtaLabel: 'Message me directly with your brief →',
      primaryCtaHref: getHomePath('en', '#contact'),
      secondaryCtaLabel: 'See my work',
      secondaryCtaHref: getHomePath('en', '#portfolio'),
      sections: [
        {
          title: 'My Fiverr prices',
          italicLead: `Prices verified on Fiverr on ${verifiedDateEn()}.`,
          bodyBefore: [
            `All prices are in US dollars and are Fiverr prices as of ${monthYearEn()}. They can change. The final price is confirmed at Fiverr checkout, including the buyer service fee and any applicable taxes. Every service in this table is in Spanish. English versions are quoted separately.`,
          ],
          table: {
            headers: ['Service', 'Package', "What's included", 'Fiverr delivery — calendar days', 'Price'],
            rows: [
              [
                'UGC video in Spanish',
                'Basic',
                '1 vertical 30s video: ideation, filming, subtitles',
                String(FIVERR_PRICING.ugc.basic.deliveryDays),
                mdPrice(FIVERR_PRICING.ugc.basic.price, FIVERR_PRICING.gigs.ugc),
              ],
              [
                'UGC video in Spanish',
                'Standard',
                '1 60s video; adds a script',
                String(FIVERR_PRICING.ugc.standard.deliveryDays),
                mdPrice(FIVERR_PRICING.ugc.standard.price, FIVERR_PRICING.gigs.ugc),
              ],
              [
                'UGC video in Spanish',
                'Premium',
                '2 60s videos with effects',
                String(FIVERR_PRICING.ugc.premium.deliveryDays),
                mdPrice(FIVERR_PRICING.ugc.premium.price, FIVERR_PRICING.gigs.ugc),
              ],
              [
                'UGC video in Spanish',
                'Rush delivery (add-on)',
                `${rushRange()}, depending on package`,
                '—',
                mdLink(rushRange(), FIVERR_PRICING.gigs.ugc),
              ],
              [
                'Spokesperson video in Spanish',
                'Up to 65 words',
                'On-camera delivery',
                spokespersonDelivery(),
                dualSpokespersonPrice(FIVERR_PRICING.spokesperson.words65.price, 'en'),
              ],
              [
                'Spokesperson video in Spanish',
                '~130 words',
                'On-camera delivery',
                spokespersonDelivery(),
                dualSpokespersonPrice(FIVERR_PRICING.spokesperson.words130.price, 'en'),
              ],
              [
                'Spokesperson video in Spanish',
                'Up to 260 words',
                'On-camera delivery',
                spokespersonDelivery(),
                dualSpokespersonPrice(FIVERR_PRICING.spokesperson.words260.price, 'en'),
              ],
              [
                'Voiceover in Spanish',
                'Up to 75 words',
                'Voice recording',
                String(FIVERR_PRICING.voiceover.deliveryDays),
                mdPrice(FIVERR_PRICING.voiceover.price, FIVERR_PRICING.gigs.voiceover),
              ],
            ],
          },
          body: [
            "On Fiverr, the countdown starts when you submit the order requirements. For direct projects, I deliver in 3 to 5 business days after the product arrives and we confirm the brief. The paid ads license isn't listed on Fiverr: organic usage is included and a paid ads license is quoted separately.",
          ],
        },
        {
          title: 'What changes the price',
          body: [],
          bullets: [
            '**Length:** a 60s video costs more than a 30s one. Spokesperson videos are priced by script word count.',
            '**Script:** the Standard package adds a script.',
            '**Number of videos:** Premium includes two 60s videos with effects.',
            `**Rush delivery for UGC videos on Fiverr:** ${rushRange()}, depending on the package.`,
            '**Language:** these prices are for Spanish videos. English versions are quoted separately.',
            '**Ads license:** organic usage is included and a paid ads license is quoted separately.',
          ],
        },
        {
          title: 'Fiverr vs. working with me directly',
          body: [
            `Fiverr works well if you want a one-off video in Spanish at a fixed price, with payment protected by the platform. I'm [gisela_sm](${FIVERR_PROFILE_URL}) there, with ${FIVERR_PRICING.fiverrRating}/5 from ${FIVERR_PRICING.fiverrReviewCount} reviews (Fiverr, ${monthEnShort()}). If you need a batch with several hooks, English versions, or a paid ads license, [message me directly](${getHomePath('en', '#contact')}) and I'll quote the project. For direct projects, I deliver in 3 to 5 business days after the product arrives and we confirm the brief.`,
          ],
        },
      ],
      faqs: [
        {
          question: 'How much does Gisela Saldarriaga charge for a UGC video?',
          answer: `My UGC packages on Fiverr start at ${usd(FIVERR_PRICING.ugc.basic.price)} for one vertical 30-second video in Spanish, with ideation, filming, and subtitles. The ${usd(FIVERR_PRICING.ugc.standard.price)} Standard package is one 60-second video and adds a script. The ${usd(FIVERR_PRICING.ugc.premium.price)} Premium package is two 60-second videos with effects. These are ${monthYearEn()} prices and can change. English versions are quoted separately.`,
        },
        {
          question: 'How much does a spokesperson video cost?',
          answer: `On Fiverr, spokesperson videos in Spanish are priced by script length: ${usd(FIVERR_PRICING.spokesperson.words65.price)} for up to ${FIVERR_PRICING.spokesperson.words65.words} words, ${usd(FIVERR_PRICING.spokesperson.words130.price)} for about ${FIVERR_PRICING.spokesperson.words130.wordsApprox} words, and ${usd(FIVERR_PRICING.spokesperson.words260.price)} for up to ${FIVERR_PRICING.spokesperson.words260.words} words. These are ${monthYearEn()} prices in US dollars. If you need several videos or English versions, I'll quote a direct project.`,
        },
        {
          question: 'Does the price include running the videos as paid ads?',
          answer:
            "No. Organic usage is included and a paid ads license is quoted separately. That license isn't part of my Fiverr packages. If you plan to run the videos on TikTok or Meta, tell me at the start and I'll quote the license together with the project.",
        },
        {
          question: 'How long does delivery take on Fiverr?',
          answer: `On Fiverr, each package has its own timeline in calendar days: ${FIVERR_PRICING.ugc.basic.deliveryDays} days for Basic and Standard UGC videos, ${FIVERR_PRICING.ugc.premium.deliveryDays} for Premium, ${FIVERR_PRICING.spokesperson.deliveryMin} to ${FIVERR_PRICING.spokesperson.deliveryMax} for spokesperson videos, and ${FIVERR_PRICING.voiceover.deliveryDays} for voiceover. The countdown starts when you submit the order requirements. For direct projects, I deliver in 3 to 5 business days after the product arrives and we confirm the brief.`,
        },
        {
          question: 'Is it cheaper to hire you on Fiverr or directly?',
          answer: `It depends on what you need. My UGC packages on Fiverr start at ${usd(FIVERR_PRICING.ugc.basic.price)} and work well for one or two videos in Spanish. If you want a batch with several hooks, English videos, or a paid ads license, a direct project is the better fit, and I quote it based on your brief. I'm rated ${FIVERR_PRICING.fiverrRating}/5 from ${FIVERR_PRICING.fiverrReviewCount} reviews on Fiverr (${monthEnShort()}).`,
        },
      ],
      ctaTitle: 'Want a quote for your project?',
      ctaText: `If you already know what you need, see how I work as a [bilingual UGC creator](${getServicePath('bilingual-ugc-creator', 'en')}). If it's your first time, start with [how to hire a UGC creator](${getResourcePath('how-to-hire-ugc-creator', 'en')}).`,
      relatedServiceIds: ['bilingual-ugc-creator', 'spokesperson-videos', 'ugc-ads-tiktok-meta'],
      relatedVerticalIds: ['ecommerce-ugc', 'beauty-ugc'],
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
