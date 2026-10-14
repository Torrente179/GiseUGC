import type { ServicePageId, SiteLocale } from '@/lib/locale-path';

/**
 * Stills used by the keynote sections below the service-page hero.
 *
 * Everything here is an existing poster (public/uploads/videos/service-posters)
 * and its variants, or one of the three transparent cut-outs of Gisela. The
 * catalog describes what each frame shows so the alt text is honest in both
 * languages; each service then picks the frames that suit it.
 */

type Localized = Record<SiteLocale, string>;

export type KeynoteStillId =
  | 'closeup'
  | 'brick'
  | 'olive'
  | 'vestroom'
  | 'blazer'
  | 'studio'
  | 'bts'
  | 'tub'
  | 'garden'
  | 'croma-denim'
  | 'croma-vest'
  | 'croma-wide'
  | 'riverside'
  | 'plaza'
  | 'street'
  | 'rooftop'
  | 'kitchen'
  | 'hotel'
  | 'couch';

export type KeynoteStill = {
  /** File name (no extension) of the poster; variants are `<base>-<width>.<format>`. */
  base: string;
  width: number;
  height: number;
  alt: Localized;
};

export const KEYNOTE_STILLS: Record<KeynoteStillId, KeynoteStill> = {
  closeup: {
    base: 'Contenido Tik Tok',
    width: 1080,
    height: 1920,
    alt: {
      es: 'Gisela hablando directo a cámara en primer plano, con blusa de flores',
      en: 'Gisela talking straight to camera in a close-up, floral top',
    },
  },
  brick: {
    base: 'Adds marketing',
    width: 2160,
    height: 3840,
    alt: {
      es: 'Gisela explicando con las dos manos arriba, con una pared de ladrillo detrás',
      en: 'Gisela explaining with both hands raised, a brick wall behind her',
    },
  },
  olive: {
    base: 'ugc-clothing-showcase-1',
    width: 1080,
    height: 1936,
    alt: {
      es: 'Manos atando el cinturón de una blusa de lino verde oliva',
      en: 'Hands tying the belt of an olive linen top',
    },
  },
  vestroom: {
    base: 'WhatsApp Video 2026-02-19 at 14.09.00',
    width: 1080,
    height: 1920,
    alt: {
      es: 'Gisela en casa con chaleco beige, sonriendo y con las manos juntas',
      en: 'Gisela at home in a beige vest, smiling, hands together',
    },
  },
  blazer: {
    base: 'WhatsApp Video 2026-02-19 at 14.08.01',
    width: 1080,
    height: 1848,
    alt: {
      es: 'Gisela con blazer negro sobre fondo blanco, con los ojos cerrados y las manos abiertas',
      en: 'Gisela in a black blazer on white, eyes closed, hands open mid-thought',
    },
  },
  studio: {
    base: 'WhatsApp Video 2026-02-13 at 00.42.58',
    width: 1440,
    height: 940,
    alt: {
      es: 'Gisela presentando en un estudio blanco',
      en: 'Gisela presenting in a white studio',
    },
  },
  bts: {
    base: 'Detrás de cámaras',
    width: 1080,
    height: 1920,
    alt: {
      es: 'Detrás de cámaras: un set de pantalla verde visto junto al monitor de la cámara',
      en: 'Behind the scenes: a green-screen set seen past the camera monitor',
    },
  },
  tub: {
    base: 'ugc-creatine-supplement-review',
    width: 1080,
    height: 1920,
    alt: {
      es: 'Gisela mostrando a cámara un pote rosado de suplemento',
      en: 'Gisela holding a pink supplement tub to the camera',
    },
  },
  garden: {
    base: 'ugc-services-presentation',
    width: 1440,
    height: 816,
    alt: {
      es: 'Gisela en un patio con jardín, con las dos manos abiertas hacia la cámara',
      en: 'Gisela in a garden courtyard, both hands open toward the camera',
    },
  },
  'croma-denim': {
    base: 'Croma key plano cerrado',
    width: 1080,
    height: 1920,
    alt: {
      es: 'Gisela con chaqueta de jean frente a una pantalla verde, con los ojos cerrados y las manos juntas',
      en: 'Gisela in a denim jacket in front of a green screen, eyes closed, hands together',
    },
  },
  'croma-vest': {
    base: 'Croma key sobrepuesto',
    width: 1080,
    height: 1920,
    alt: {
      es: 'Gisela con chaleco beige frente a una pantalla verde, con una mano levantada',
      en: 'Gisela in a beige vest in front of a green screen, one hand raised',
    },
  },
  'croma-wide': {
    base: 'Croma Key',
    width: 1080,
    height: 1920,
    alt: {
      es: 'Gisela de cuerpo entero con chaleco beige frente a una pantalla verde',
      en: 'Gisela full length in a beige vest in front of a green screen',
    },
  },
  riverside: {
    base: 'DEEDCEA0-6288-4AB4-B5E5-39F8A50822E7',
    width: 1080,
    height: 1920,
    alt: {
      es: 'Gisela con chaleco beige y un río de ciudad detrás',
      en: 'Gisela in a beige vest with a city riverside behind her',
    },
  },
  plaza: {
    base: 'Reporte noticioso USA',
    width: 1080,
    height: 1920,
    alt: {
      es: 'Gisela con vestido estampado en una plaza al aire libre, con las manos abiertas como presentando',
      en: 'Gisela in a patterned dress in an outdoor plaza, hands open as if presenting',
    },
  },
  street: {
    base: 'IMG_5793',
    width: 1080,
    height: 1920,
    alt: {
      es: 'Gisela en una calle arbolada con un teléfono en la mano',
      en: 'Gisela on a tree-lined street, a phone in her hand',
    },
  },
  rooftop: {
    base: 'ugc-business-promotion',
    width: 1080,
    height: 1920,
    alt: {
      es: 'Gisela con chaleco beige en una terraza, con la ciudad detrás',
      en: 'Gisela in a beige vest on a rooftop, the city behind her',
    },
  },
  kitchen: {
    base: 'ugc-lifestyle-review-3',
    width: 1080,
    height: 1920,
    alt: {
      es: 'Gisela con camiseta negra sosteniendo una botella de agua en una cocina',
      en: 'Gisela in a black tee holding a water bottle in a kitchen',
    },
  },
  hotel: {
    base: 'ugc-lifestyle-review-2',
    width: 1080,
    height: 1920,
    alt: {
      es: 'Gisela con una blusa blanca en una habitación luminosa, hablando a cámara',
      en: 'Gisela in a white top in a bright room, speaking to camera',
    },
  },
  couch: {
    base: 'WhatsApp Video 2026-02-19 at 16.05.21',
    width: 1080,
    height: 1920,
    alt: {
      es: 'Gisela con blusa floral en un sofá, con un dedo sobre los labios',
      en: 'Gisela in a floral top on a couch, a finger to her lips',
    },
  },
};

export type KeynoteCutoutId = 'open' | 'vest' | 'denim';

export const KEYNOTE_CUTOUTS: Record<
  KeynoteCutoutId,
  { src: string; width: number; height: number; alt: Localized }
> = {
  open: {
    src: '/uploads/service-cutout-open.webp',
    width: 766,
    height: 1500,
    alt: {
      es: 'Gisela a mitad de una frase, con las dos manos abiertas, hablando a cámara',
      en: 'Gisela mid-sentence, both hands open, speaking to camera',
    },
  },
  vest: {
    src: '/uploads/service-cutout-vest.webp',
    width: 863,
    height: 1756,
    alt: {
      es: 'Gisela con chaleco beige, gesticulando con una mano mientras habla',
      en: 'Gisela in a beige vest, gesturing with one hand as she talks',
    },
  },
  denim: {
    src: '/uploads/service-cutout-denim.webp',
    width: 840,
    height: 1400,
    alt: {
      es: 'Gisela con chaqueta de jean, con los ojos cerrados y las manos juntas',
      en: 'Gisela in a denim jacket, eyes closed, hands together',
    },
  },
};

/** One frame placed in a frame: which still, where to anchor the crop, how far to zoom. */
export type KeynoteStillUse = {
  id: KeynoteStillId;
  /** CSS object-position, e.g. '50% 20%'. */
  position?: string;
  /** Same, for the phone shell, where the frame is closer to square than to wide. */
  mobilePosition?: string;
  /** Scale applied around `position`; 1 is plain `cover`. */
  zoom?: number;
};

export type ServiceImagery = {
  cutout: KeynoteCutoutId;
  fit: KeynoteStillUse;
  /** One per process step, in order. */
  process: [KeynoteStillUse, KeynoteStillUse, KeynoteStillUse, KeynoteStillUse];
};

/**
 * The cut-outs rotate (denim, vest, open, denim, vest, open, denim, vest) so
 * neighbouring services never repeat. Process stills follow the four beats of
 * every service (brief, script, filming, delivery); the fit photo sets the
 * mood of the page.
 */
export const SERVICE_IMAGERY: Record<ServicePageId, ServiceImagery> = {
  'bilingual-ugc-creator': {
    cutout: 'denim',
    fit: { id: 'riverside', position: '50% 28%' },
    process: [
      { id: 'closeup', position: '50% 26%' },
      { id: 'studio', position: '72% 50%' },
      { id: 'croma-denim', position: '50% 20%' },
      { id: 'riverside', position: '50% 22%' },
    ],
  },
  'spokesperson-videos': {
    cutout: 'vest',
    fit: { id: 'studio', position: '50% 38%' },
    process: [
      { id: 'blazer', position: '50% 16%' },
      { id: 'plaza', position: '50% 24%' },
      { id: 'croma-vest', position: '50% 20%' },
      { id: 'garden', position: '50% 50%', zoom: 1.7 },
    ],
  },
  'ugc-ads-tiktok-meta': {
    cutout: 'open',
    fit: { id: 'garden', position: '50% 0%' },
    process: [
      { id: 'blazer', position: '50% 16%' },
      { id: 'studio', position: '72% 50%' },
      { id: 'bts', position: '40% 31%', zoom: 1.9 },
      { id: 'tub', position: '50% 26%' },
    ],
  },
  'ugc-testimonials-reviews': {
    cutout: 'denim',
    fit: { id: 'vestroom', position: '50% 20%' },
    process: [
      { id: 'tub', position: '50% 26%' },
      { id: 'couch', position: '50% 24%' },
      { id: 'olive', position: '50% 30%' },
      { id: 'vestroom', position: '50% 22%' },
    ],
  },
  'ugc-product-demo': {
    cutout: 'vest',
    fit: { id: 'street', position: '50% 30%' },
    process: [
      { id: 'street', position: '50% 30%' },
      { id: 'brick', position: '50% 24%' },
      { id: 'bts', position: '40% 31%', zoom: 1.9 },
      { id: 'hotel', position: '50% 24%' },
    ],
  },
  'ugc-problem-solution': {
    cutout: 'open',
    fit: { id: 'rooftop', position: '50% 38%' },
    process: [
      { id: 'couch', position: '50% 24%' },
      { id: 'brick', position: '50% 24%' },
      { id: 'croma-denim', position: '50% 20%' },
      { id: 'closeup', position: '50% 26%' },
    ],
  },
  'ugc-lifestyle': {
    cutout: 'denim',
    fit: { id: 'hotel', position: '50% 27%' },
    process: [
      { id: 'rooftop', position: '50% 26%' },
      { id: 'hotel', position: '50% 24%' },
      { id: 'kitchen', position: '50% 26%' },
      { id: 'couch', position: '50% 24%' },
    ],
  },
  'ugc-broll-footage': {
    cutout: 'vest',
    fit: { id: 'bts', position: '50% 41%', mobilePosition: '50% 22%' },
    process: [
      { id: 'olive', position: '50% 30%' },
      { id: 'hotel', position: '50% 24%' },
      { id: 'bts', position: '40% 31%', zoom: 1.9 },
      { id: 'kitchen', position: '50% 26%' },
    ],
  },
};

export type KeynoteStillFormat = 'avif' | 'webp' | 'jpg';
export type KeynoteStillWidth = 360 | 720 | 1080;

const STILL_WIDTHS: KeynoteStillWidth[] = [360, 720, 1080];

/** Variant URL, following the same NFC + percent-encoding rule as the poster helpers. */
export const keynoteStillSrc = (
  still: KeynoteStill,
  width: KeynoteStillWidth,
  format: KeynoteStillFormat,
) =>
  `/uploads/videos/poster-variants/v1/${encodeURIComponent(still.base.normalize('NFC'))}-${width}.${format}`;

export const keynoteStillSrcSet = (still: KeynoteStill, format: KeynoteStillFormat) =>
  STILL_WIDTHS.map((width) => `${keynoteStillSrc(still, width, format)} ${width}w`).join(', ');
