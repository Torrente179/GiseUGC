import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ServiceVideoCard {
    titleKey: string;
    descriptionKey: string;
    videoSrc: string;
    poster: string;
}

const ServicesMarquee = () => {
    const { t } = useTranslation();
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const serviceVideoCards: ServiceVideoCard[] = [
        {
            titleKey: 'services.service1.title',
            descriptionKey: 'services.service1.description',
            videoSrc: 'https://assets.mixkit.co/videos/50423/50423-720.mp4',
            poster: 'https://assets.mixkit.co/videos/50423/50423-thumb-720-0.jpg',
        },
        {
            titleKey: 'services.service2.title',
            descriptionKey: 'services.service2.description',
            videoSrc: 'https://assets.mixkit.co/videos/50417/50417-720.mp4',
            poster: 'https://assets.mixkit.co/videos/50417/50417-thumb-720-0.jpg',
        },
        {
            titleKey: 'services.service3.title',
            descriptionKey: 'services.service3.description',
            videoSrc: 'https://assets.mixkit.co/videos/50406/50406-720.mp4',
            poster: 'https://assets.mixkit.co/videos/50406/50406-thumb-720-0.jpg',
        },
        {
            titleKey: 'services.service4.title',
            descriptionKey: 'services.service4.description',
            videoSrc: 'https://assets.mixkit.co/videos/42308/42308-720.mp4',
            poster: 'https://assets.mixkit.co/videos/42308/42308-thumb-720-0.jpg',
        },
        {
            titleKey: 'services.service5.title',
            descriptionKey: 'services.service5.description',
            videoSrc: 'https://assets.mixkit.co/videos/42293/42293-720.mp4',
            poster: 'https://assets.mixkit.co/videos/42293/42293-thumb-720-0.jpg',
        },
    ];

    const marqueeCards = [...serviceVideoCards, ...serviceVideoCards, ...serviceVideoCards];

    const handleVideoHover = (index: number) => {
        const video = videoRefs.current[index];
        if (video) {
            const p = video.play();
            if (p) p.catch(() => undefined);
        }
    };

    const handleVideoLeave = (index: number) => {
        const video = videoRefs.current[index];
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    };

    const handleCardClick = (index: number) => {
        setExpandedCard(expandedCard === index ? null : index);
    };

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = 300;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="mt-32 md:mt-44 mb-20 md:mb-28 overflow-hidden">
            <div className="studio-container">
                <div className="px-4 mb-12 md:mb-20 text-center mx-auto">
                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-serif font-normal tracking-[-0.04em] leading-tight text-foreground max-w-5xl mx-auto">
                        {t('services.motionTitle')}
                    </h3>
                    <p className="text-base md:text-xl text-muted-foreground mt-6 max-w-3xl mx-auto leading-relaxed">
                        {t('services.motionSubtitle')}
                    </p>
                </div>
            </div>

            <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen group">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/40 via-transparent to-secondary/40 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-20 md:w-60 z-20 bg-gradient-to-r from-background via-background/95 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 md:w-60 z-20 bg-gradient-to-l from-background via-background/95 to-transparent pointer-events-none" />

                {/* Navigation Arrows */}
                <div className="absolute inset-y-0 left-4 md:left-12 z-30 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => scroll('left')}
                        className="h-12 w-12 rounded-full bg-card/80 border border-border/50 flex items-center justify-center text-primary backdrop-blur-md shadow-lg hover:bg-primary hover:text-white transition-all hover:scale-110"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                </div>
                <div className="absolute inset-y-0 right-4 md:right-12 z-30 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => scroll('right')}
                        className="h-12 w-12 rounded-full bg-card/80 border border-border/50 flex items-center justify-center text-primary backdrop-blur-md shadow-lg hover:bg-primary hover:text-white transition-all hover:scale-110"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="relative z-10 flex overflow-x-auto scrollbar-hide snap-x snap-mandatory pt-10 md:pt-16 pb-20 no-scrollbar"
                >
                    <div className="service-marquee flex w-max gap-6 lg:gap-8 px-4 md:px-20">
                        {marqueeCards.map((card, index) => {
                            const isExpanded = expandedCard === index;
                            return (
                                <div
                                    key={`${card.titleKey}-${index}`}
                                    className="relative shrink-0 w-[200px] sm:w-[220px] lg:w-[240px] flex flex-col items-center cursor-pointer snap-center"
                                    onMouseEnter={() => handleVideoHover(index)}
                                    onMouseLeave={() => handleVideoLeave(index)}
                                    onClick={() => handleCardClick(index)}
                                >
                                    {/* Compact Vertical Frame */}
                                    <div className={`relative aspect-[9/14] w-full overflow-hidden rounded-2xl border border-border/60 shadow-lg bg-card transition-all duration-500 ease-out hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:border-primary/25 ${isExpanded ? '-translate-y-2' : ''}`}>
                                        <video
                                            ref={(el) => { videoRefs.current[index] = el; }}
                                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                            src={card.videoSrc}
                                            poster={card.poster}
                                            muted
                                            loop
                                            playsInline
                                            preload="metadata"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-50" />
                                    </div>

                                    {/* Title (always visible) + Description (on click) */}
                                    <div className="w-full mt-5 px-3 text-center">
                                        <h3 className="text-lg md:text-xl font-serif text-foreground leading-tight tracking-[-0.02em] mb-2">
                                            {t(card.titleKey)}
                                        </h3>

                                        <div className={`overflow-hidden transition-all duration-500 ease-out ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <p className="text-sm leading-relaxed text-muted-foreground pt-1">
                                                {t(card.descriptionKey)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesMarquee;
