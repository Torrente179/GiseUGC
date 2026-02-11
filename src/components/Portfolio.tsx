import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, VolumeX, X } from 'lucide-react';

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

  const [collagePlaying, setCollagePlaying] = useState(false);
  const [activeReelPreview, setActiveReelPreview] = useState<ReelClip | null>(null);

  const collageVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

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

  const setCollagePlayback = async (shouldPlay: boolean) => {
    setCollagePlaying(shouldPlay);

    await Promise.all(
      collageVideoRefs.current.map(async (video) => {
        if (!video) return;

        if (shouldPlay) {
          const maybePromise = video.play();
          if (maybePromise) {
            await maybePromise.catch(() => undefined);
          }
          return;
        }

        video.pause();
        video.currentTime = 0;
      })
    );
  };

  const handleCollageActivate = () => {
    void setCollagePlayback(true);
  };

  const handleCollageDeactivate = () => {
    void setCollagePlayback(false);
  };

  const getCollageMotionClass = (clipId: number) => {
    if (!collagePlaying) return '';

    if (clipId === 4) return '-translate-x-11 -translate-y-6 scale-[1.05]';
    if (clipId === 5) return 'translate-x-11 -translate-y-6 scale-[1.05]';
    if (clipId === 3) return '-translate-y-2 scale-[1.03]';

    return 'scale-[1.02]';
  };

  return (
    <section id="portfolio" className="studio-section bg-secondary/14">
      <div className="studio-container">
        <div className="studio-header">
          <div>
            <p className="section-label text-muted-foreground mb-3">{t('portfolio.sectionSubtitle')}</p>
            <h2 className="studio-title">{t('portfolio.sectionTitle')}</h2>
          </div>
          <p className="studio-subtitle lg:justify-self-end">{t('portfolio.reelDescription')}</p>
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

            <div className="relative z-10 mx-auto max-w-[1920px] px-3 sm:px-6 md:px-10 lg:px-12 py-4 md:py-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {reelClips.map((clip) => (
                  <button
                    type="button"
                    key={clip.id}
                    className="group relative w-full aspect-[9/16] rounded-2xl overflow-hidden border border-border shadow-sm text-left hover:border-primary/40 transition-colors"
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
            className="studio-panel relative h-[430px] p-6 md:p-8 overflow-hidden cursor-pointer"
            onMouseEnter={handleCollageActivate}
            onMouseLeave={handleCollageDeactivate}
            onFocus={handleCollageActivate}
            onBlur={(event) => {
              const nextTarget = event.relatedTarget as Node | null;
              if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
                handleCollageDeactivate();
              }
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleCollageActivate();
              }
              if (event.key === 'Escape') {
                handleCollageDeactivate();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={t('portfolio.collageTitle')}
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
                  preload="metadata"
                  aria-label={t(clip.labelKey)}
                />

                <div
                  className={`absolute inset-0 bg-black/35 backdrop-blur-[1px] transition-opacity duration-300 ${collagePlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                />

                <span
                  className={`absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full bg-card/90 text-primary transition-opacity duration-300 ${collagePlaying ? 'opacity-0' : 'opacity-100'
                    }`}
                >
                  <Play className="h-5 w-5 fill-current" />
                </span>
              </div>
            ))}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center px-4 py-2 rounded-full bg-card/95 border border-border backdrop-blur-sm text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {collagePlaying ? t('portfolio.collageHintPlaying') : t('portfolio.collageHintIdle')}
            </div>
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
