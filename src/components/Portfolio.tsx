import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Maximize, Play, VolumeX, X } from 'lucide-react';

interface PortfolioItem {
  id: number;
  titleKey: string;
  category: 'fashion' | 'beauty' | 'tech' | 'lifestyle';
  thumbnail: string;
  type: 'image' | 'video';
}

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
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [collagePlaying, setCollagePlaying] = useState(false);
  const [activeReelPreview, setActiveReelPreview] = useState<ReelClip | null>(null);

  const reelTrackRef = useRef<HTMLDivElement>(null);
  const collageVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const categoryKeys = [
    { id: 'all', nameKey: 'portfolio.categories.all' },
    { id: 'fashion', nameKey: 'portfolio.categories.fashion' },
    { id: 'beauty', nameKey: 'portfolio.categories.beauty' },
    { id: 'tech', nameKey: 'portfolio.categories.tech' },
    { id: 'lifestyle', nameKey: 'portfolio.categories.lifestyle' }
  ];

  const reelClips: ReelClip[] = [
    {
      id: 1,
      titleKey: 'portfolio.items.item1',
      category: 'fashion',
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      poster: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 2,
      titleKey: 'portfolio.items.item2',
      category: 'beauty',
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      poster: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 3,
      titleKey: 'portfolio.items.item3',
      category: 'tech',
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      poster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 4,
      titleKey: 'portfolio.items.item4',
      category: 'lifestyle',
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      poster: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 5,
      titleKey: 'portfolio.items.item5',
      category: 'beauty',
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      poster: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 6,
      titleKey: 'portfolio.items.item6',
      category: 'fashion',
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      poster: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 7,
      titleKey: 'portfolio.items.item7',
      category: 'tech',
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      poster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 8,
      titleKey: 'portfolio.items.item8',
      category: 'lifestyle',
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      poster: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80'
    }
  ];

  const collageClips: CollageClip[] = [
    {
      id: 1,
      labelKey: 'portfolio.items.item2',
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      poster: 'https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=900&q=80',
      className: 'top-7 left-10 w-[44%] -rotate-[5deg]'
    },
    {
      id: 2,
      labelKey: 'portfolio.items.item6',
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      poster: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
      className: 'top-1 right-14 w-[38%] rotate-[2deg]'
    },
    {
      id: 3,
      labelKey: 'portfolio.items.item3',
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      poster: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80',
      className: 'top-[34%] left-[35%] w-[36%] z-20'
    },
    {
      id: 4,
      labelKey: 'portfolio.items.item8',
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      poster: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
      className: 'bottom-7 right-14 w-[34%] rotate-[3deg]'
    },
    {
      id: 5,
      labelKey: 'portfolio.items.item4',
      videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      poster: 'https://images.unsplash.com/photo-1514996550219-62672472d03b?auto=format&fit=crop&w=900&q=80',
      className: 'bottom-4 left-[8%] w-[30%] -rotate-1'
    }
  ];

  const portfolioItemData: PortfolioItem[] = [
    {
      id: 1,
      titleKey: 'portfolio.items.item1',
      category: 'fashion',
      thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'image'
    },
    {
      id: 2,
      titleKey: 'portfolio.items.item2',
      category: 'beauty',
      thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'video'
    },
    {
      id: 3,
      titleKey: 'portfolio.items.item3',
      category: 'tech',
      thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'image'
    },
    {
      id: 4,
      titleKey: 'portfolio.items.item4',
      category: 'lifestyle',
      thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'image'
    },
    {
      id: 5,
      titleKey: 'portfolio.items.item5',
      category: 'beauty',
      thumbnail: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'video'
    },
    {
      id: 6,
      titleKey: 'portfolio.items.item6',
      category: 'fashion',
      thumbnail: 'https://images.unsplash.com/photo-1520999166575-37d109989923?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'image'
    },
    {
      id: 7,
      titleKey: 'portfolio.items.item7',
      category: 'tech',
      thumbnail: 'https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'video'
    },
    {
      id: 8,
      titleKey: 'portfolio.items.item8',
      category: 'lifestyle',
      thumbnail: 'https://images.unsplash.com/photo-1498575732665-aac7705c2c7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      type: 'video'
    }
  ];

  const filteredItems = activeFilter === 'all'
    ? portfolioItemData
    : portfolioItemData.filter((item) => item.category === activeFilter);

  const closeModal = () => {
    setSelectedItem(null);
  };

  const scrollReel = (direction: 'prev' | 'next') => {
    if (!reelTrackRef.current) return;

    reelTrackRef.current.scrollBy({
      left: direction === 'next' ? 340 : -340,
      behavior: 'smooth'
    });
  };

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

    if (clipId === 4) return '-translate-x-8 -translate-y-6 scale-[1.04]';
    if (clipId === 5) return 'translate-x-8 -translate-y-5 scale-[1.04]';
    if (clipId === 3) return '-translate-y-2 scale-[1.03]';

    return 'scale-[1.02]';
  };

  return (
    <section id="portfolio" className="section-padding bg-secondary/20">

      <div className="container relative z-10 mx-auto">
        <div className="text-center mb-12">
          <p className="section-label text-muted-foreground mb-3">{t('portfolio.sectionSubtitle')}</p>
          <h2 className="text-3xl md:text-4xl font-serif font-normal tracking-[-0.04em] mb-6">{t('portfolio.sectionTitle')}</h2>
          <div className="w-24 h-1 signature-line mx-auto" />
        </div>

        <div className="cafe-panel p-4 md:p-6 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-card" />
          <div className="relative z-10">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div>
                <p className="section-label text-xs text-primary/70 mb-2">
                  {t('portfolio.reelSubtitle')}
                </p>
                <h3 className="text-xl md:text-2xl font-serif font-normal tracking-[-0.03em] text-foreground">
                  {t('portfolio.reelTitle')}
                </h3>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  aria-label={t('portfolio.reelAriaPrev')}
                  className="h-10 w-10 rounded-full border border-primary/25 bg-card/90 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => scrollReel('prev')}
                >
                  <ArrowLeft className="h-5 w-5 mx-auto" />
                </button>
                <button
                  type="button"
                  aria-label={t('portfolio.reelAriaNext')}
                  className="h-10 w-10 rounded-full border border-primary/25 bg-card/90 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => scrollReel('next')}
                >
                  <ArrowRight className="h-5 w-5 mx-auto" />
                </button>
              </div>
            </div>

            <div
              ref={reelTrackRef}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {reelClips.map((clip) => (
                <button
                  type="button"
                  key={clip.id}
                  className="group relative shrink-0 snap-start w-[180px] sm:w-[200px] md:w-[220px] aspect-[9/16] rounded-2xl overflow-hidden border border-border shadow-sm text-left hover:border-primary/45 transition-colors"
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

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 text-white">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/75 mb-1">
                        {t(`portfolio.categories.${clip.category}`)}
                      </p>
                      <p className="text-sm font-medium leading-tight">{t(clip.titleKey)}</p>
                    </div>

                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/25 backdrop-blur-md">
                      <VolumeX className="h-4 w-4" />
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-sm text-muted-foreground mt-4">{t('portfolio.reelDescription')}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16">
          <div>
            <p className="section-label text-sm text-muted-foreground mb-4">
              {t('portfolio.collageEyebrow')}
            </p>
            <h3 className="text-3xl md:text-4xl font-serif font-normal tracking-[-0.04em] leading-tight mb-5">
              {t('portfolio.collageTitle')}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t('portfolio.collageDescription')}
            </p>

            <ul className="space-y-3 text-foreground/85 mb-8">
              <li className="flex gap-3">
                <span className="mt-[0.5rem] h-2 w-2 rounded-full bg-primary" />
                <span>{t('portfolio.collagePoint1')}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[0.5rem] h-2 w-2 rounded-full bg-primary" />
                <span>{t('portfolio.collagePoint2')}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[0.5rem] h-2 w-2 rounded-full bg-primary" />
                <span>{t('portfolio.collagePoint3')}</span>
              </li>
            </ul>

            <a
              href="#contact"
              className="btn-primary-nordic px-7 py-3 hover-grow btn-press"
            >
              {t('portfolio.collageCta')}
            </a>
          </div>

          <div
            className="cafe-panel relative h-[460px] p-6 md:p-8 overflow-hidden cursor-pointer"
            onMouseEnter={handleCollageActivate}
            onMouseLeave={handleCollageDeactivate}
            onFocus={handleCollageActivate}
            onBlur={(event) => {
              const nextTarget = event.relatedTarget as Node | null;
              if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
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
                  className={`absolute inset-0 bg-black/35 backdrop-blur-[1px] transition-opacity duration-300 ${
                    collagePlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                />

                <span
                  className={`absolute inset-0 m-auto flex h-11 w-11 items-center justify-center rounded-full bg-card/90 text-primary transition-opacity duration-300 ${
                    collagePlaying ? 'opacity-0' : 'opacity-100'
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

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categoryKeys.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-6 py-2 rounded-full text-sm transition-all ${
                activeFilter === category.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'cafe-chip hover:bg-secondary'
              }`}
            >
              {t(category.nameKey)}
            </button>
          ))}
        </div>

        <div className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6">
          {filteredItems.map((item, index) => {
            const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
              const element = event.currentTarget;
              const rect = element.getBoundingClientRect();
              const x = (event.clientX - rect.left - rect.width / 2) / 15;
              const y = (event.clientY - rect.top - rect.height / 2) / 15;
              element.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.02)`;
            };

            const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
              event.currentTarget.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
            };

            const aspectRatios = ['4/3', '1/1', '3/4', '16/9'];
            const aspectRatio = aspectRatios[index % aspectRatios.length];

            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-border shadow-sm cursor-pointer break-inside-avoid mb-6 transition-all duration-300 ease-out bg-card/75"
                onClick={() => setSelectedItem(item)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="w-full overflow-hidden" style={{ aspectRatio }}>
                  <img
                    src={item.thumbnail}
                    alt={t(item.titleKey)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/28 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                  <h3 className="text-white font-medium mb-1">{t(item.titleKey)}</h3>
                  <p className="text-white/75 text-sm capitalize">{t(`portfolio.categories.${item.category}`)}</p>

                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {item.type === 'video' ? (
                      <div className="w-14 h-14 bg-card/90 rounded-full flex items-center justify-center">
                        <Play className="h-6 w-6 text-primary fill-primary" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 bg-card/90 rounded-full flex items-center justify-center">
                        <Maximize className="h-6 w-6 text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-foreground/55 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full bg-card rounded-2xl overflow-hidden animate-scale border border-primary/20"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="aspect-w-16 aspect-h-9 w-full bg-foreground/15">
              <img
                src={selectedItem.thumbnail}
                alt={t(selectedItem.titleKey)}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-serif font-normal tracking-[-0.03em] text-primary">{t(selectedItem.titleKey)}</h3>
              <p className="text-muted-foreground capitalize">{t(`portfolio.categories.${selectedItem.category}`)}</p>
            </div>
            <button
              className="absolute top-4 right-4 w-10 h-10 bg-card/90 rounded-full border border-border flex items-center justify-center hover:bg-card"
              onClick={closeModal}
            >
              <X className="h-5 w-5 text-primary" />
            </button>
          </div>
        </div>
      )}

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

            <p className="section-label text-xs text-muted-foreground mb-1">
              {t('portfolio.reelPreviewLabel')}
            </p>
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
