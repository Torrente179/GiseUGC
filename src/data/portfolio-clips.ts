export type ReelClipLocale = 'es' | 'en';

export interface ReelClip {
  id: number;
  titleKey?: string;
  title?: string;
  category: 'fashion' | 'beauty' | 'tech' | 'lifestyle';
  mainSrc: string;
  mobileSrc: string;
  previewSrc: string;
  hlsSrc?: string;
  mobileHlsSrc?: string;
  previewHlsSrc?: string;
  posterSrc: string;
  highQualityPosterSrc?: string;
  language?: ReelClipLocale;
  durationSeconds?: number;
  publishedAt?: string;
  schemaDescription?: Partial<Record<ReelClipLocale, string>>;
}

export const R2_MEDIA_BASE_URL = 'https://media.giselasaldarriaga.com';

export const r2MainVideo = (filename: string) => `${R2_MEDIA_BASE_URL}/videos/main/${filename}`;

export const r2MobileVideo = (filename: string) =>
  `${R2_MEDIA_BASE_URL}/videos/mobile/${filename.replace(/\.mp4$/, '-mobile.mp4')}`;

export const r2PreviewVideo = (filename: string) =>
  `${R2_MEDIA_BASE_URL}/videos/previews/${filename.replace(/\.mp4$/, '-preview.mp4')}`;

export const r2Poster = (filename: string) => `${R2_MEDIA_BASE_URL}/videos/posters/${filename}`;

export const r2HlsMaster = (filename: string, rendition: 'main' | 'mobile' | 'preview' = 'main') => {
  const baseName = filename.split('/').pop()?.replace(/\.[^.]+$/u, '') ?? filename;
  return `${R2_MEDIA_BASE_URL}/videos/hls/${encodeURIComponent(baseName)}/${rendition}/master.m3u8`;
};

export const servicePosterSrcFromMain = (mainSrc: string, fallbackSrc: string) => {
  const filename = mainSrc.split('/').pop();
  if (!filename) return fallbackSrc;
  const decodedFilename = decodeURIComponent(filename);
  const baseName = decodedFilename.replace(/\.[^.]+$/u, '');
  if (!baseName) return fallbackSrc;
  return `/uploads/videos/service-posters/${encodeURIComponent(baseName)}.jpg`;
};

export const getBestPosterSrc = (clip: ReelClip) =>
  clip.highQualityPosterSrc ?? servicePosterSrcFromMain(clip.mainSrc, clip.posterSrc);

// Small locally-hosted 280w webp thumbs used by the Hero mobile 4-tile strip.
// Derived from the R2 poster URL so data stays single-sourced.
// Script: scripts/generate-poster-thumbs.sh
export const posterThumbSrc = (posterSrc: string): string => {
  const match = posterSrc.match(/\/([^/]+)-poster\.jpg$/);
  if (!match) return posterSrc;
  return `/uploads/videos/poster-thumbs/${match[1]}-poster-thumb.webp`;
};

export const FEATURED_REEL_CLIP_IDS = [1, 2, 4, 7] as const;

export const LEGACY_REEL_CLIPS: ReelClip[] = [
  {
    id: 1,
    titleKey: 'portfolio.items.item1',
    category: 'lifestyle',
    mainSrc: r2MainVideo('ugc-lifestyle-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-lifestyle-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-lifestyle-review.mp4'),
    posterSrc: r2Poster('ugc-lifestyle-review-poster.jpg'),
    language: 'es',
    durationSeconds: 72.93,
    schemaDescription: {
      es: 'Reseña lifestyle con tono cercano y demostración de producto pensada para TikTok, Reels y pauta.',
      en: 'A lifestyle product review with a warm, natural delivery built for TikTok, Reels, and paid social.',
    },
  },
  {
    id: 2,
    titleKey: 'portfolio.items.item2',
    category: 'fashion',
    mainSrc: r2MainVideo('ugc-brand-spokesperson.mp4'),
    mobileSrc: r2MobileVideo('ugc-brand-spokesperson.mp4'),
    previewSrc: r2PreviewVideo('ugc-brand-spokesperson.mp4'),
    posterSrc: r2Poster('ugc-brand-spokesperson-poster.jpg'),
    language: 'es',
    durationSeconds: 23.5,
    schemaDescription: {
      es: 'Pieza de portavoz orientada a comunicar beneficios y presencia de marca con una entrega clara frente a cámara.',
      en: 'A spokesperson-style piece built to communicate benefits and brand presence with a clear on-camera delivery.',
    },
  },
  {
    id: 3,
    titleKey: 'portfolio.items.item3',
    category: 'tech',
    mainSrc: r2MainVideo('ugc-voicebot-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-voicebot-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-voicebot-review.mp4'),
    posterSrc: r2Poster('ugc-voicebot-review-poster.jpg'),
    language: 'es',
    durationSeconds: 59.09,
  },
  {
    id: 4,
    titleKey: 'portfolio.items.item4',
    category: 'beauty',
    mainSrc: r2MainVideo('ugc-creatine-supplement-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-creatine-supplement-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-creatine-supplement-review.mp4'),
    posterSrc: r2Poster('ugc-creatine-supplement-review-poster.jpg'),
    language: 'es',
    durationSeconds: 41.45,
    schemaDescription: {
      es: 'Review de bienestar y suplemento con enfoque testimonial, beneficios visibles y una puesta en escena cercana.',
      en: 'A wellness-focused testimonial review built around clear benefits, believable delivery, and a close-to-camera feel.',
    },
  },
  {
    id: 5,
    titleKey: 'portfolio.items.item5',
    category: 'lifestyle',
    mainSrc: r2MainVideo('ugc-business-promotion.mp4'),
    mobileSrc: r2MobileVideo('ugc-business-promotion.mp4'),
    previewSrc: r2PreviewVideo('ugc-business-promotion.mp4'),
    posterSrc: r2Poster('ugc-business-promotion-poster.jpg'),
    language: 'es',
    durationSeconds: 42.24,
  },
  {
    id: 6,
    titleKey: 'portfolio.items.item6',
    category: 'fashion',
    mainSrc: r2MainVideo('ugc-services-presentation.mp4'),
    mobileSrc: r2MobileVideo('ugc-services-presentation.mp4'),
    previewSrc: r2PreviewVideo('ugc-services-presentation.mp4'),
    posterSrc: r2Poster('ugc-services-presentation-poster.jpg'),
    language: 'es',
    durationSeconds: 38.85,
  },
  {
    id: 7,
    titleKey: 'portfolio.items.item7',
    category: 'tech',
    mainSrc: r2MainVideo('ugc-ai-services-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-ai-services-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-ai-services-review.mp4'),
    posterSrc: r2Poster('ugc-ai-services-review-poster.jpg'),
    language: 'es',
    durationSeconds: 23.06,
    schemaDescription: {
      es: 'Demo y reseña para servicios de AI con explicación directa, ritmo ágil y enfoque en claridad comercial.',
      en: 'A creator-led AI services demo with direct explanation, brisk pacing, and a commercial focus on clarity.',
    },
  },
  {
    id: 8,
    titleKey: 'portfolio.items.item8',
    category: 'lifestyle',
    mainSrc: r2MainVideo('ugc-lifestyle-review-2.mp4'),
    mobileSrc: r2MobileVideo('ugc-lifestyle-review-2.mp4'),
    previewSrc: r2PreviewVideo('ugc-lifestyle-review-2.mp4'),
    posterSrc: r2Poster('ugc-lifestyle-review-2-poster.jpg'),
    language: 'es',
    durationSeconds: 40.05,
  },
  {
    id: 9,
    titleKey: 'portfolio.items.item9',
    category: 'tech',
    mainSrc: r2MainVideo('ugc-voiceover-bots-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-voiceover-bots-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-voiceover-bots-review.mp4'),
    posterSrc: r2Poster('ugc-voiceover-bots-review-poster.jpg'),
    language: 'es',
    durationSeconds: 27.61,
  },
  {
    id: 10,
    titleKey: 'portfolio.items.item10',
    category: 'lifestyle',
    mainSrc: r2MainVideo('ugc-lifestyle-review-3.mp4'),
    mobileSrc: r2MobileVideo('ugc-lifestyle-review-3.mp4'),
    previewSrc: r2PreviewVideo('ugc-lifestyle-review-3.mp4'),
    posterSrc: r2Poster('ugc-lifestyle-review-3-poster.jpg'),
    language: 'es',
    durationSeconds: 7.38,
  },
];
