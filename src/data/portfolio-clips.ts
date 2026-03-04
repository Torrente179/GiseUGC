export interface ReelClip {
  id: number;
  titleKey?: string;
  title?: string;
  category: 'fashion' | 'beauty' | 'tech' | 'lifestyle';
  mainSrc: string;
  mobileSrc: string;
  previewSrc: string;
  posterSrc: string;
}

export const R2_MEDIA_BASE_URL = 'https://media.giselasaldarriaga.com';

export const r2MainVideo = (filename: string) => `${R2_MEDIA_BASE_URL}/videos/main/${filename}`;

export const r2MobileVideo = (filename: string) =>
  `${R2_MEDIA_BASE_URL}/videos/mobile/${filename.replace(/\.mp4$/, '-mobile.mp4')}`;

export const r2PreviewVideo = (filename: string) =>
  `${R2_MEDIA_BASE_URL}/videos/previews/${filename.replace(/\.mp4$/, '-preview.mp4')}`;

export const r2Poster = (filename: string) => `${R2_MEDIA_BASE_URL}/videos/posters/${filename}`;

export const LEGACY_REEL_CLIPS: ReelClip[] = [
  {
    id: 1,
    titleKey: 'portfolio.items.item1',
    category: 'lifestyle',
    mainSrc: r2MainVideo('ugc-lifestyle-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-lifestyle-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-lifestyle-review.mp4'),
    posterSrc: r2Poster('ugc-lifestyle-review-poster.jpg'),
  },
  {
    id: 2,
    titleKey: 'portfolio.items.item2',
    category: 'fashion',
    mainSrc: r2MainVideo('ugc-brand-spokesperson.mp4'),
    mobileSrc: r2MobileVideo('ugc-brand-spokesperson.mp4'),
    previewSrc: r2PreviewVideo('ugc-brand-spokesperson.mp4'),
    posterSrc: r2Poster('ugc-brand-spokesperson-poster.jpg'),
  },
  {
    id: 3,
    titleKey: 'portfolio.items.item3',
    category: 'tech',
    mainSrc: r2MainVideo('ugc-voicebot-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-voicebot-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-voicebot-review.mp4'),
    posterSrc: r2Poster('ugc-voicebot-review-poster.jpg'),
  },
  {
    id: 4,
    titleKey: 'portfolio.items.item4',
    category: 'beauty',
    mainSrc: r2MainVideo('ugc-creatine-supplement-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-creatine-supplement-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-creatine-supplement-review.mp4'),
    posterSrc: r2Poster('ugc-creatine-supplement-review-poster.jpg'),
  },
  {
    id: 5,
    titleKey: 'portfolio.items.item5',
    category: 'lifestyle',
    mainSrc: r2MainVideo('ugc-business-promotion.mp4'),
    mobileSrc: r2MobileVideo('ugc-business-promotion.mp4'),
    previewSrc: r2PreviewVideo('ugc-business-promotion.mp4'),
    posterSrc: r2Poster('ugc-business-promotion-poster.jpg'),
  },
  {
    id: 6,
    titleKey: 'portfolio.items.item6',
    category: 'fashion',
    mainSrc: r2MainVideo('ugc-services-presentation.mp4'),
    mobileSrc: r2MobileVideo('ugc-services-presentation.mp4'),
    previewSrc: r2PreviewVideo('ugc-services-presentation.mp4'),
    posterSrc: r2Poster('ugc-services-presentation-poster.jpg'),
  },
  {
    id: 7,
    titleKey: 'portfolio.items.item7',
    category: 'tech',
    mainSrc: r2MainVideo('ugc-ai-services-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-ai-services-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-ai-services-review.mp4'),
    posterSrc: r2Poster('ugc-ai-services-review-poster.jpg'),
  },
  {
    id: 8,
    titleKey: 'portfolio.items.item8',
    category: 'lifestyle',
    mainSrc: r2MainVideo('ugc-lifestyle-review-2.mp4'),
    mobileSrc: r2MobileVideo('ugc-lifestyle-review-2.mp4'),
    previewSrc: r2PreviewVideo('ugc-lifestyle-review-2.mp4'),
    posterSrc: r2Poster('ugc-lifestyle-review-2-poster.jpg'),
  },
  {
    id: 9,
    titleKey: 'portfolio.items.item9',
    category: 'tech',
    mainSrc: r2MainVideo('ugc-voiceover-bots-review.mp4'),
    mobileSrc: r2MobileVideo('ugc-voiceover-bots-review.mp4'),
    previewSrc: r2PreviewVideo('ugc-voiceover-bots-review.mp4'),
    posterSrc: r2Poster('ugc-voiceover-bots-review-poster.jpg'),
  },
  {
    id: 10,
    titleKey: 'portfolio.items.item10',
    category: 'lifestyle',
    mainSrc: r2MainVideo('ugc-lifestyle-review-3.mp4'),
    mobileSrc: r2MobileVideo('ugc-lifestyle-review-3.mp4'),
    previewSrc: r2PreviewVideo('ugc-lifestyle-review-3.mp4'),
    posterSrc: r2Poster('ugc-lifestyle-review-3-poster.jpg'),
  },
];
