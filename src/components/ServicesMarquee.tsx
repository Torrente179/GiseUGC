import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LazyVideo from '@/components/media/LazyVideo';

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
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const isPausedRef = useRef(false);
    const isDraggingRef = useRef(false);
    const offsetRef = useRef(0);
    const setWidthRef = useRef(0);
    const dragStartRef = useRef({ x: 0, offset: 0 });
    const hasDraggedRef = useRef(false);
    const animationFrameRef = useRef<number | null>(null);
    const lastFrameTimeRef = useRef<number | null>(null);
    const isInViewportRef = useRef(true);
    const isDocumentVisibleRef = useRef(typeof document === 'undefined' ? true : !document.hidden);

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
        if (expandedCard === index) return;
        const video = videoRefs.current[index];
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    };

    const handleCardClick = (index: number) => {
        // Ignore click if user was dragging
        if (hasDraggedRef.current) {
            hasDraggedRef.current = false;
            return;
        }

        const isClosing = expandedCard === index;

        if (!isClosing && expandedCard !== null) {
            const prevVideo = videoRefs.current[expandedCard];
            if (prevVideo) {
                prevVideo.pause();
                prevVideo.currentTime = 0;
            }
        }

        setExpandedCard(isClosing ? null : index);

        const video = videoRefs.current[index];
        if (video) {
            if (isClosing) {
                video.pause();
                video.currentTime = 0;
            } else {
                const p = video.play();
                if (p) p.catch(() => undefined);
            }
        }
    };

    // Sync pause state with expanded card
    useEffect(() => {
        isPausedRef.current = expandedCard !== null;
    }, [expandedCard]);

    // Click outside cards to dismiss expanded card and resume scrolling
    useEffect(() => {
        if (expandedCard === null) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('[data-carousel-card]')) {
                setExpandedCard(null);
            }
        };

        const timeoutId = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [expandedCard]);

    // Transform-based infinite scroll with viewport/visibility gating
    useEffect(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track) return;

        const AUTO_SCROLL_PX_PER_SECOND = 27;

        const applyTrackTransform = () => {
            track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
        };

        const wrapOffset = () => {
            const sw = setWidthRef.current;
            if (sw <= 0) return;
            if (offsetRef.current >= sw * 2) {
                offsetRef.current -= sw;
            } else if (offsetRef.current <= 0) {
                offsetRef.current += sw;
            }
        };

        const stopAnimation = () => {
            if (animationFrameRef.current !== null) {
                window.cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            lastFrameTimeRef.current = null;
        };

        const canAnimate = () => isInViewportRef.current && isDocumentVisibleRef.current;

        const animate = (timestamp: number) => {
            animationFrameRef.current = null;
            if (!canAnimate()) {
                stopAnimation();
                return;
            }

            const previousTimestamp = lastFrameTimeRef.current;
            const deltaSeconds =
                previousTimestamp === null
                    ? 1 / 60
                    : Math.min((timestamp - previousTimestamp) / 1000, 0.05);
            lastFrameTimeRef.current = timestamp;

            if (!isPausedRef.current && !isDraggingRef.current) {
                offsetRef.current += AUTO_SCROLL_PX_PER_SECOND * deltaSeconds;
                wrapOffset();
                applyTrackTransform();
            }

            animationFrameRef.current = window.requestAnimationFrame(animate);
        };

        const startAnimation = () => {
            if (animationFrameRef.current !== null || !canAnimate()) return;
            animationFrameRef.current = window.requestAnimationFrame(animate);
        };

        const measure = () => {
            const nextSetWidth = track.scrollWidth / 3;
            if (!Number.isFinite(nextSetWidth) || nextSetWidth <= 0) return;
            const previousSetWidth = setWidthRef.current;
            setWidthRef.current = nextSetWidth;

            if (previousSetWidth <= 0) {
                offsetRef.current = nextSetWidth;
            } else {
                const positionRatio = offsetRef.current / previousSetWidth;
                offsetRef.current = positionRatio * nextSetWidth;
            }

            wrapOffset();
            applyTrackTransform();
        };

        const removeDragListeners = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handlePointerUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handlePointerUp);
            window.removeEventListener('touchcancel', handlePointerUp);
        };

        const beginDrag = (clientX: number) => {
            isDraggingRef.current = true;
            hasDraggedRef.current = false;
            dragStartRef.current = { x: clientX, offset: offsetRef.current };
            startAnimation();
        };

        const updateDrag = (clientX: number) => {
            if (!isDraggingRef.current) return;
            const dx = dragStartRef.current.x - clientX;
            if (Math.abs(dx) > 5) hasDraggedRef.current = true;
            offsetRef.current = dragStartRef.current.offset + dx;
            wrapOffset();
            applyTrackTransform();
        };

        const handlePointerUp = () => {
            isDraggingRef.current = false;
            removeDragListeners();
            startAnimation();
        };

        const handleMouseDown = (event: MouseEvent) => {
            beginDrag(event.clientX);
            window.addEventListener('mousemove', handleMouseMove, { passive: true });
            window.addEventListener('mouseup', handlePointerUp, { passive: true });
        };

        const handleMouseMove = (event: MouseEvent) => {
            updateDrag(event.clientX);
        };

        const handleTouchStart = (event: TouchEvent) => {
            const touch = event.touches[0];
            if (!touch) return;
            beginDrag(touch.clientX);
            window.addEventListener('touchmove', handleTouchMove, { passive: true });
            window.addEventListener('touchend', handlePointerUp, { passive: true });
            window.addEventListener('touchcancel', handlePointerUp, { passive: true });
        };

        const handleTouchMove = (event: TouchEvent) => {
            const touch = event.touches[0];
            if (!touch) return;
            updateDrag(touch.clientX);
        };

        const handleVisibilityChange = () => {
            isDocumentVisibleRef.current = !document.hidden;
            if (isDocumentVisibleRef.current) {
                startAnimation();
            } else {
                stopAnimation();
            }
        };

        const initTimeout = window.setTimeout(() => {
            measure();
            startAnimation();
        }, 50);

        let resizeObserver: ResizeObserver | null = null;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObserver = new ResizeObserver(() => {
                measure();
                startAnimation();
            });
            resizeObserver.observe(container);
            resizeObserver.observe(track);
        } else {
            window.addEventListener('resize', measure);
        }

        let visibilityObserver: IntersectionObserver | null = null;
        if (typeof IntersectionObserver !== 'undefined') {
            visibilityObserver = new IntersectionObserver(
                ([entry]) => {
                    isInViewportRef.current = entry?.isIntersecting ?? true;
                    if (isInViewportRef.current) {
                        startAnimation();
                    } else {
                        stopAnimation();
                    }
                },
                { threshold: 0.05, rootMargin: '120px 0px' },
            );
            visibilityObserver.observe(container);
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);
        container.addEventListener('mousedown', handleMouseDown);
        container.addEventListener('touchstart', handleTouchStart, { passive: true });

        return () => {
            window.clearTimeout(initTimeout);
            stopAnimation();
            removeDragListeners();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            container.removeEventListener('mousedown', handleMouseDown);
            container.removeEventListener('touchstart', handleTouchStart);
            visibilityObserver?.disconnect();
            resizeObserver?.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        offsetRef.current += direction === 'left' ? -300 : 300;
        const track = trackRef.current;
        const setWidth = setWidthRef.current;
        if (!track || setWidth <= 0) return;
        if (offsetRef.current >= setWidth * 2) {
            offsetRef.current -= setWidth;
        } else if (offsetRef.current <= 0) {
            offsetRef.current += setWidth;
        }
        track.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
    };

    return (
        <div className="mt-16 md:mt-20 mb-12 md:mb-16 overflow-hidden">
            <div className="studio-container">
                <div className="px-4 mb-12 md:mb-20 text-center mx-auto">
                    <h3 className="text-3xl md:text-5xl lg:text-5xl font-serif font-bold tracking-tight-serif leading-[0.95] text-foreground max-w-5xl mx-auto">
                        El toolkit completo para anunciantes <span className="luxury-accent text-accent inline-block transform rotate-[-2deg] ml-2">modernos</span>
                    </h3>
                    <p className="strategic-body text-base md:text-xl text-muted-foreground mt-6 max-w-3xl mx-auto">
                        {t('services.motionSubtitle')}
                    </p>
                </div>
            </div>

            <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen group">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/40 via-transparent to-secondary/40 pointer-events-none" />
                <div className="absolute inset-y-0 left-0 w-10 md:w-24 z-20 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-10 md:w-24 z-20 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />

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
                    ref={containerRef}
                    className="relative z-10 overflow-hidden pt-10 md:pt-16 pb-10 select-none cursor-grab active:cursor-grabbing"
                    onDragStart={(e) => e.preventDefault()}
                >
                    <div
                        ref={trackRef}
                        className="flex w-max gap-6 lg:gap-8 px-4 md:px-20"
                        style={{ willChange: 'transform' }}
                    >
                        {marqueeCards.map((card, index) => {
                            const isExpanded = expandedCard === index;
                            return (
                                <div
                                    key={`${card.titleKey}-${index}`}
                                    data-carousel-card
                                    className="relative shrink-0 w-[200px] sm:w-[220px] lg:w-[240px] flex flex-col items-center cursor-pointer"
                                    onMouseEnter={() => handleVideoHover(index)}
                                    onMouseLeave={() => handleVideoLeave(index)}
                                    onClick={() => handleCardClick(index)}
                                >
                                    {/* Compact Vertical Frame */}
                                    <div className={`relative aspect-[9/14] w-full overflow-hidden rounded-2xl border border-border/60 shadow-lg bg-card transition-all duration-500 ease-out hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:border-primary/25 ${isExpanded ? '-translate-y-2' : ''}`}>
                                        <LazyVideo
                                            ref={(el) => { videoRefs.current[index] = el; }}
                                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                            src={card.videoSrc}
                                            poster={card.poster}
                                            muted
                                            loop
                                            playsInline
                                            preload="none"
                                            rootMargin="0px 0px"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-50" />
                                    </div>

                                    <div className="w-full mt-6 px-3 text-center">
                                        <h3 className="section-label text-foreground/80 mb-2">
                                            {t(card.titleKey)}
                                        </h3>

                                        <div className={`overflow-hidden transition-all duration-500 ease-out ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <p className="strategic-body text-sm text-muted-foreground pt-1">
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
