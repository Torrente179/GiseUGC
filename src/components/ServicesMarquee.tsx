import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import LazyVideo from '@/components/media/LazyVideo';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';

interface ServiceVideoCard {
  titleKey: string;
  descriptionKey: string;
  videoSrc: string;
  poster: string;
}

interface ServicesMarqueeProps {
  sectionId?: string;
  liteMobile?: boolean;
}

const R2_MEDIA_BASE_URL = 'https://media.giselasaldarriaga.com';
const r2PreviewVideo = (filename: string) =>
  `${R2_MEDIA_BASE_URL}/videos/previews/${filename.replace(/\.mp4$/, '-preview.mp4')}`;
const r2Poster = (filename: string) => `${R2_MEDIA_BASE_URL}/videos/posters/${filename}`;
const MOBILE_BREAKPOINT_PX = 768;

const findNuevosClipByMainFilename = (filename: string) =>
  NUEVOS_R2_READY_CLIPS.find((clip) => {
    const encodedFilename = clip.mainSrc.split('/').pop() ?? '';
    try {
      return decodeURIComponent(encodedFilename) === filename;
    } catch {
      return encodedFilename === filename;
    }
  });

const nuevosAutomotrizVoiceDemoClip = findNuevosClipByMainFilename('IMG_5793.MOV');
const nuevosWhatsAppVentasClip = findNuevosClipByMainFilename('IMG_8435.MOV');
const nuevosVoicebotCierraVentasClip = findNuevosClipByMainFilename('WhatsApp Video 2026-02-13 at 00.39.53.mp4');

const useIsMobileViewport = () => {
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT_PX;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`);
    const update = () => setIsMobileViewport(mq.matches);
    update();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  return isMobileViewport;
};

const ServicesMarquee = ({ sectionId, liteMobile = false }: ServicesMarqueeProps) => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const isMobileViewport = useIsMobileViewport();
  const isLiteMobileMode = liteMobile && isMobileViewport;

  const serviceVideoCards: ServiceVideoCard[] = useMemo(
    () => [
      {
        titleKey: 'services.marqueeCards.card1.title',
        descriptionKey: 'services.marqueeCards.card1.description',
        videoSrc: r2PreviewVideo('ugc-lifestyle-review.mp4'),
        poster: r2Poster('ugc-lifestyle-review-poster.jpg'),
      },
      {
        titleKey: 'services.marqueeCards.card2.title',
        descriptionKey: 'services.marqueeCards.card2.description',
        videoSrc: r2PreviewVideo('ugc-brand-spokesperson.mp4'),
        poster: r2Poster('ugc-brand-spokesperson-poster.jpg'),
      },
      {
        titleKey: 'services.marqueeCards.card3.title',
        descriptionKey: 'services.marqueeCards.card3.description',
        videoSrc: r2PreviewVideo('ugc-voicebot-review.mp4'),
        poster: r2Poster('ugc-voicebot-review-poster.jpg'),
      },
      {
        titleKey: 'services.marqueeCards.card4.title',
        descriptionKey: 'services.marqueeCards.card4.description',
        videoSrc: r2PreviewVideo('ugc-creatine-supplement-review.mp4'),
        poster: r2Poster('ugc-creatine-supplement-review-poster.jpg'),
      },
      {
        titleKey: 'services.marqueeCards.card5.title',
        descriptionKey: 'services.marqueeCards.card5.description',
        videoSrc: r2PreviewVideo('ugc-voiceover-bots-review.mp4'),
        poster: r2Poster('ugc-voiceover-bots-review-poster.jpg'),
      },
      {
        titleKey: 'services.marqueeCards.card6.title',
        descriptionKey: 'services.marqueeCards.card6.description',
        videoSrc: r2PreviewVideo('ugc-services-presentation.mp4'),
        poster: r2Poster('ugc-services-presentation-poster.jpg'),
      },
      {
        titleKey: 'services.marqueeCards.card7.title',
        descriptionKey: 'services.marqueeCards.card7.description',
        videoSrc: nuevosVoicebotCierraVentasClip?.previewSrc ?? r2PreviewVideo('ugc-ai-services-review.mp4'),
        poster: nuevosVoicebotCierraVentasClip?.posterSrc ?? r2Poster('ugc-ai-services-review-poster.jpg'),
      },
      {
        titleKey: 'services.marqueeCards.card8.title',
        descriptionKey: 'services.marqueeCards.card8.description',
        videoSrc: r2PreviewVideo('ugc-lifestyle-review-2.mp4'),
        poster: r2Poster('ugc-lifestyle-review-2-poster.jpg'),
      },
      {
        titleKey: 'services.marqueeCards.card9.title',
        descriptionKey: 'services.marqueeCards.card9.description',
        videoSrc: nuevosWhatsAppVentasClip?.previewSrc ?? r2PreviewVideo('ugc-voiceover-bots-review.mp4'),
        poster: nuevosWhatsAppVentasClip?.posterSrc ?? r2Poster('ugc-voiceover-bots-review-poster.jpg'),
      },
      {
        titleKey: 'services.marqueeCards.card10.title',
        descriptionKey: 'services.marqueeCards.card10.description',
        videoSrc: r2PreviewVideo('ugc-lifestyle-review-3.mp4'),
        poster: r2Poster('ugc-lifestyle-review-3-poster.jpg'),
      },
      {
        titleKey: 'services.marqueeCards.card11.title',
        descriptionKey: 'services.marqueeCards.card11.description',
        videoSrc: r2PreviewVideo('ugc-clothing-showcase-1.mp4'),
        poster: r2Poster('ugc-clothing-showcase-1-poster.jpg'),
      },
      {
        titleKey: 'services.marqueeCards.card12.title',
        descriptionKey: 'services.marqueeCards.card12.description',
        videoSrc: nuevosAutomotrizVoiceDemoClip?.previewSrc ?? r2PreviewVideo('ugc-clothing-showcase-2.mp4'),
        poster: nuevosAutomotrizVoiceDemoClip?.posterSrc ?? r2Poster('ugc-clothing-showcase-2-poster.jpg'),
      },
    ],
    [],
  );

  const scroll = (direction: 'left' | 'right') => {
    const node = scrollRef.current;
    if (!node) return;
    const distance = Math.min(760, Math.max(320, node.clientWidth * 0.72));
    node.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  const renderCard = (card: ServiceVideoCard, index: number, lite = false) => {
    const isActive = activeCard === index;

    return (
      <article
        key={`${card.titleKey}-${lite ? 'lite' : 'full'}-${index}`}
        className={lite ? 'shrink-0 w-[190px] snap-start' : 'relative shrink-0 w-[200px] sm:w-[220px] lg:w-[240px] snap-start'}
      >
        <button
          type="button"
          className="group block w-full cursor-pointer text-left"
          onClick={() => setActiveCard((current) => (current === index ? null : index))}
          onMouseEnter={() => {
            if (!isMobileViewport) setActiveCard(index);
          }}
          onMouseLeave={() => {
            if (!isMobileViewport) setActiveCard((current) => (current === index ? null : current));
          }}
        >
          <div
            className={`relative aspect-[9/14] w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_18px_42px_-34px_hsl(var(--foreground)/0.72)] transition-[border-color,box-shadow,transform] duration-300 ease-out group-hover:-translate-y-1 group-hover:border-primary/25 ${
              isActive ? '-translate-y-1 border-primary/30 shadow-[0_22px_48px_-34px_hsl(var(--foreground)/0.8)]' : ''
            }`}
          >
            {isActive && !lite ? (
              <LazyVideo
                className="h-full w-full object-cover"
                src={card.videoSrc}
                poster={card.poster}
                autoPlay
                muted
                loop
                playsInline
                loadWhenVisible={false}
                preload="metadata"
              />
            ) : (
              <img
                src={card.poster}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/38 via-transparent to-transparent opacity-55" />
            <span className="absolute bottom-3 left-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/42 text-white">
              <Play className="h-3.5 w-3.5 translate-x-[1px]" fill="currentColor" />
            </span>
          </div>

          <div className="w-full mt-5 px-2 text-center">
            <h3 className="section-label text-foreground/80 mb-2">{t(card.titleKey)}</h3>
            {!lite && (
              <p
                className={`strategic-body text-sm text-muted-foreground transition-[opacity,max-height] duration-300 ${
                  isActive ? 'max-h-28 opacity-100' : 'max-h-0 overflow-hidden opacity-0'
                }`}
              >
                {t(card.descriptionKey)}
              </p>
            )}
          </div>
        </button>
      </article>
    );
  };

  if (isLiteMobileMode) {
    return (
      <div id={sectionId} className="mt-16 mb-12 overflow-hidden">
        <div className="studio-container">
          <div className="px-4 mb-10 text-center mx-auto">
            <h3 className="text-3xl font-serif font-bold tracking-tight-serif leading-[0.95] text-foreground max-w-5xl mx-auto">
              El toolkit completo para anunciantes <span className="luxury-accent text-accent inline-block transform rotate-[-2deg] ml-2">modernos</span>
            </h3>
            <p className="strategic-body text-base text-muted-foreground mt-6 max-w-3xl mx-auto">
              {t('services.motionSubtitle')}
            </p>
          </div>
        </div>

        <div className="px-4">
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            {serviceVideoCards.map((card, index) => renderCard(card, index, true))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={sectionId} className="mt-16 md:mt-20 mb-12 md:mb-16 overflow-hidden">
      <div className="studio-container">
        <div className="px-4 mb-12 md:mb-16 text-center mx-auto">
          <h3 className="text-3xl md:text-5xl lg:text-5xl font-serif font-bold tracking-tight-serif leading-[0.95] text-foreground max-w-5xl mx-auto">
            El toolkit completo para anunciantes <span className="luxury-accent text-accent inline-block transform rotate-[-2deg] ml-2">modernos</span>
          </h3>
          <p className="strategic-body text-base md:text-xl text-muted-foreground mt-6 max-w-3xl mx-auto">
            {t('services.motionSubtitle')}
          </p>
        </div>
      </div>

      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen group">
        <div className="absolute inset-y-0 left-0 w-10 md:w-24 z-20 bg-gradient-to-r from-background via-background/88 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-10 md:w-24 z-20 bg-gradient-to-l from-background via-background/88 to-transparent pointer-events-none" />

        <div className="absolute inset-y-0 left-4 md:left-12 z-30 hidden items-center md:flex">
          <button
            onClick={() => scroll('left')}
            className="h-12 w-12 rounded-full bg-card border border-border/60 flex items-center justify-center text-primary shadow-[0_18px_38px_-28px_hsl(var(--foreground)/0.8)] transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-4 md:right-12 z-30 hidden items-center md:flex">
          <button
            onClick={() => scroll('right')}
            className="h-12 w-12 rounded-full bg-card border border-border/60 flex items-center justify-center text-primary shadow-[0_18px_38px_-28px_hsl(var(--foreground)/0.8)] transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="relative z-10 flex gap-6 lg:gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide px-4 md:px-20 pt-8 md:pt-12 pb-10"
        >
          {serviceVideoCards.map((card, index) => renderCard(card, index))}
        </div>
      </div>
    </div>
  );
};

export default ServicesMarquee;
