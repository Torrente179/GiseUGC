import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Play, VolumeX, X } from 'lucide-react';

interface ReelClip {
  id: number;
  titleKey: string;
  category: 'fashion' | 'beauty' | 'tech' | 'lifestyle';
  videoSrc: string;
  poster: string;
}

interface CollageClip {
  id: number;
  labelKey: string;
  videoSrc: string;
  poster: string;
  className: string;
}

const Portfolio = () => {
  const { t } = useTranslation();

  const [activeReelPreview, setActiveReelPreview] = useState<ReelClip | null>(null);

  const collageVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const reelScrollRef = useRef<HTMLDivElement>(null);

  const scrollReels = (direction: 'left' | 'right') => {
    const container = reelScrollRef.current;
    if (!container) return;
    const cardWidth = container.querySelector('button')?.offsetWidth ?? 200;
    const gap = 12;
    const scrollAmount = cardWidth + gap;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const reelClips: ReelClip[] = [
    {
      id: 1,
      titleKey: 'portfolio.items.item1',
      category: 'fashion',
      videoSrc: 'https://assets.mixkit.co/videos/42308/42308-720.mp4',
      poster: 'https://assets.mixkit.co/videos/42308/42308-thumb-720-0.jpg',
    },
    {
      id: 2,
      titleKey: 'portfolio.items.item2',
      category: 'beauty',
      videoSrc: 'https://assets.mixkit.co/videos/50423/50423-720.mp4',
      poster: 'https://assets.mixkit.co/videos/50423/50423-thumb-720-0.jpg',
    },
    {
      id: 3,
      titleKey: 'portfolio.items.item3',
      category: 'tech',
      videoSrc: 'https://assets.mixkit.co/videos/39774/39774-720.mp4',
      poster: 'https://assets.mixkit.co/videos/39774/39774-thumb-720-0.jpg',
    },
    {
      id: 4,
      titleKey: 'portfolio.items.item4',
      category: 'lifestyle',
      videoSrc: 'https://assets.mixkit.co/videos/34487/34487-720.mp4',
      poster: 'https://assets.mixkit.co/videos/34487/34487-thumb-720-0.jpg',
    },
    {
      id: 5,
      titleKey: 'portfolio.items.item5',
      category: 'beauty',
      videoSrc: 'https://assets.mixkit.co/videos/50417/50417-720.mp4',
      poster: 'https://assets.mixkit.co/videos/50417/50417-thumb-720-0.jpg',
    },
    {
      id: 6,
      titleKey: 'portfolio.items.item6',
      category: 'fashion',
      videoSrc: 'https://assets.mixkit.co/videos/42293/42293-720.mp4',
      poster: 'https://assets.mixkit.co/videos/42293/42293-thumb-720-0.jpg',
    },
    {
      id: 7,
      titleKey: 'portfolio.items.item7',
      category: 'tech',
      videoSrc: 'https://assets.mixkit.co/videos/47002/47002-720.mp4',
      poster: 'https://assets.mixkit.co/videos/47002/47002-thumb-720-2.jpg',
    },
    {
      id: 8,
      titleKey: 'portfolio.items.item8',
      category: 'lifestyle',
      videoSrc: 'https://assets.mixkit.co/videos/49647/49647-720.mp4',
      poster: 'https://assets.mixkit.co/videos/49647/49647-thumb-720-0.jpg',
    },
    {
      id: 9,
      titleKey: 'portfolio.items.item9',
      category: 'lifestyle',
      videoSrc: 'https://assets.mixkit.co/videos/34487/34487-720.mp4',
      poster: 'https://assets.mixkit.co/videos/34487/34487-thumb-720-0.jpg',
    },
    {
      id: 10,
      titleKey: 'portfolio.items.item10',
      category: 'beauty',
      videoSrc: 'https://assets.mixkit.co/videos/50417/50417-720.mp4',
      poster: 'https://assets.mixkit.co/videos/50417/50417-thumb-720-0.jpg',
    },
  ];

  const collageClips: CollageClip[] = [
    {
      id: 1,
      labelKey: 'portfolio.items.item2',
      videoSrc: 'https://assets.mixkit.co/videos/50406/50406-720.mp4',
      poster: 'https://assets.mixkit.co/videos/50406/50406-thumb-720-0.jpg',
      className: 'top-8 left-10 w-[42%] -rotate-[3deg]',
    },
    {
      id: 2,
      labelKey: 'portfolio.items.item6',
      videoSrc: 'https://assets.mixkit.co/videos/50426/50426-720.mp4',
      poster: 'https://assets.mixkit.co/videos/50426/50426-thumb-720-0.jpg',
      className: 'top-3 right-12 w-[36%] rotate-[1deg]',
    },
    {
      id: 3,
      labelKey: 'portfolio.items.item3',
      videoSrc: 'https://assets.mixkit.co/videos/51253/51253-720.mp4',
      poster: 'https://assets.mixkit.co/videos/51253/51253-thumb-720-0.jpg',
      className: 'top-[33%] left-[34%] w-[34%] z-20',
    },
    {
      id: 4,
      labelKey: 'portfolio.items.item8',
      videoSrc: 'https://assets.mixkit.co/videos/42316/42316-720.mp4',
      poster: 'https://assets.mixkit.co/videos/42316/42316-thumb-720-0.jpg',
      className: 'bottom-8 right-14 w-[32%] rotate-[2deg]',
    },
    {
      id: 5,
      labelKey: 'portfolio.items.item4',
      videoSrc: 'https://assets.mixkit.co/videos/51168/51168-720.mp4',
      poster: 'https://assets.mixkit.co/videos/51168/51168-thumb-720-0.jpg',
      className: 'bottom-6 left-[10%] w-[30%] -rotate-[1deg]',
    },
  ];

  useEffect(() => {
    // Ensure all collage videos are playing
    collageVideoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch(() => undefined);
      }
    });
  }, []);

  const getCollageMotionClass = (clipId: number) => {
    // Constant motion effect
    if (clipId === 4) return '-translate-x-11 -translate-y-6 scale-[1.05]';
    if (clipId === 5) return 'translate-x-11 -translate-y-6 scale-[1.05]';
    if (clipId === 3) return '-translate-y-2 scale-[1.03]';

    return 'scale-[1.02]';
  };

  return (
    <section id="portfolio" className="studio-section bg-secondary/5 pt-32 pb-24">
      <div className="studio-container">
        <div className="studio-header mb-16 md:mb-24 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-8 bg-accent/40" />
              <p className="section-label text-accent/80 tracking-[0.3em] font-medium">{t('portfolio.sectionSubtitle')}</p>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif text-foreground tracking-[-0.03em] leading-[0.95]">
              {t('portfolio.sectionTitle')}
              <span className="luxury-accent block mt-4 lg:mt-0 lg:ml-4 text-accent">{t('portfolio.sectionTitleAccent')}</span>
            </h2>
          </div>
          <div className="lg:max-w-xs text-center lg:text-right">
            <p className="text-foreground/40 text-lg md:text-xl font-light leading-relaxed italic">
              {t('portfolio.reelDescription')}
            </p>
          </div>
        </div>

        <div className="studio-rule mb-10 md:mb-12" />

        <div className="mb-12 md:mb-14">
          <div className="mb-5 md:mb-6">
            <p className="section-label text-xs text-muted-foreground mb-2">{t('portfolio.reelSubtitle')}</p>
            <h3 className="text-xl md:text-[1.9rem] font-serif font-normal tracking-[-0.03em] text-foreground leading-tight">
              {t('portfolio.reelTitle')}
            </h3>
          </div>

          <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-background to-secondary/60" />
            <div className="absolute inset-y-0 left-0 w-8 sm:w-12 md:w-20 z-20 bg-gradient-to-r from-background via-background/95 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-8 sm:w-12 md:w-20 z-20 bg-gradient-to-l from-background via-background/95 to-transparent" />

            {/* Mobile navigation arrows */}
            <button
              type="button"
              className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-foreground/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-foreground/80 transition-colors"
              onClick={() => scrollReels('left')}
              aria-label={t('portfolio.reelAriaPrev')}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-foreground/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-foreground/80 transition-colors"
              onClick={() => scrollReels('right')}
              aria-label={t('portfolio.reelAriaNext')}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="relative z-10 mx-auto px-3 sm:px-6 md:px-10 lg:px-12 py-4 md:py-6">
              <div
                ref={reelScrollRef}
                className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory md:snap-none"
              >
                {reelClips.map((clip) => (
                  <button
                    type="button"
                    key={clip.id}
                    className="group relative shrink-0 w-[70vw] sm:w-[55vw] md:w-[180px] lg:w-[200px] aspect-[9/16] rounded-2xl overflow-hidden border border-border shadow-sm text-left hover:border-primary/40 transition-colors snap-center"
                    onClick={() => setActiveReelPreview(clip)}
                    aria-label={t(clip.titleKey)}
                  >
                    <video
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={clip.videoSrc}
                      poster={clip.poster}
                      muted
                      autoPlay
                      loop
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/24 to-transparent" />

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 text-white">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/75 mb-1">
                          {t(`portfolio.categories.${clip.category}`)}
                        </p>
                        <p className="text-sm font-medium leading-tight">{t(clip.titleKey)}</p>
                      </div>

                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/24 backdrop-blur-md">
                        <VolumeX className="h-4 w-4" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] gap-8 lg:gap-10 items-center mb-14 md:mb-16">
          <div>
            <p className="section-label text-sm text-muted-foreground mb-4">{t('portfolio.collageEyebrow')}</p>
            <h3 className="text-3xl md:text-[2.4rem] font-serif font-normal tracking-[-0.04em] leading-tight mb-5">
              {t('portfolio.collageTitle')}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">{t('portfolio.collageDescription')}</p>

            <ul className="space-y-3 text-foreground/85 mb-8">
              <li className="flex gap-3">
                <span className="mt-[0.5rem] h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{t('portfolio.collagePoint1')}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[0.5rem] h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{t('portfolio.collagePoint2')}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[0.5rem] h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{t('portfolio.collagePoint3')}</span>
              </li>
            </ul>

            <a href="#contact" className="btn-primary-nordic px-7 py-3 hover-grow btn-press">
              {t('portfolio.collageCta')}
            </a>
          </div>

          <div
            className="studio-panel relative h-[430px] p-6 md:p-8 overflow-hidden"
            role="presentation"
          >
            <div className="absolute inset-0 bg-card" />
            <div className="absolute inset-x-0 top-0 h-44 bg-secondary blur-2xl opacity-60" />

            {collageClips.map((clip, index) => (
              <div
                key={clip.id}
                className={`absolute ${clip.className} rounded-2xl border border-border shadow-lg overflow-hidden transition-all duration-700 ease-out ${getCollageMotionClass(clip.id)}`}
              >
                <video
                  ref={(element) => {
                    collageVideoRefs.current[index] = element;
                  }}
                  className="h-full w-full object-cover"
                  src={clip.videoSrc}
                  poster={clip.poster}
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="metadata"
                  aria-label={t(clip.labelKey)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeReelPreview && (
        <div
          className="fixed inset-0 z-50 bg-foreground/55 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveReelPreview(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-3 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-3 h-8 w-8 rounded-full border border-border bg-card/90 flex items-center justify-center hover:bg-secondary"
              onClick={() => setActiveReelPreview(null)}
              aria-label={t('portfolio.reelPreviewClose')}
            >
              <X className="h-4 w-4 text-foreground" />
            </button>

            <p className="section-label text-xs text-muted-foreground mb-1">{t('portfolio.reelPreviewLabel')}</p>
            <h4 className="text-lg font-serif font-normal tracking-[-0.03em] pr-10 mb-3">{t(activeReelPreview.titleKey)}</h4>

            <div className="rounded-xl overflow-hidden bg-black">
              <video
                className="w-full aspect-[9/16] object-contain"
                src={activeReelPreview.videoSrc}
                poster={activeReelPreview.poster}
                controls
                autoPlay
                playsInline
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
