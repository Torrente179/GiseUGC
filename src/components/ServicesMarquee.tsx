import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LazyVideo from '@/components/media/LazyVideo';
import { NUEVOS_R2_READY_CLIPS } from '@/data/nuevos-r2-ready';
import { mark, measure } from '@/lib/perf-debug';

interface ServiceVideoCard {
    titleKey: string;
    descriptionKey: string;
    videoSrc: string;
    poster: string;
}

interface ServicesMarqueeProps {
    sectionId?: string;
}

const R2_MEDIA_BASE_URL = 'https://media.giselasaldarriaga.com';
const r2PreviewVideo = (filename: string) =>
    `${R2_MEDIA_BASE_URL}/videos/previews/${filename.replace(/\.mp4$/, '-preview.mp4')}`;
const r2Poster = (filename: string) => `${R2_MEDIA_BASE_URL}/videos/posters/${filename}`;
const MOBILE_BREAKPOINT_PX = 768;
const AUTO_SCROLL_SPEED_DESKTOP_PX_PER_SECOND = 27;
const AUTO_SCROLL_SPEED_MOBILE_PX_PER_SECOND = 49;
const MOBILE_TOUCH_DRAG_MULTIPLIER = 1.45;
const MAX_FRAME_DELTA_MS = 64;
const TOUCH_AXIS_LOCK_THRESHOLD_PX = 6;

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

const ServicesMarquee = ({ sectionId }: ServicesMarqueeProps) => {
    const { t } = useTranslation();
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const isPausedRef = useRef(false);
    const isDraggingRef = useRef(false);
    const offsetRef = useRef(0);
    const setWidthRef = useRef(0);
    const dragStartRef = useRef({ x: 0, y: 0, offset: 0 });
    const hasDraggedRef = useRef(false);
    const touchAxisRef = useRef<'pending' | 'horizontal' | 'vertical'>('pending');
    const isTouchTrackingRef = useRef(false);
    const isSectionVisibleRef = useRef(true);
    const isDocumentVisibleRef = useRef(true);
    const isMobileViewportRef = useRef(false);
    const touchSessionCounterRef = useRef(0);
    const activeTouchSessionRef = useRef<number | null>(null);

    const serviceVideoCards: ServiceVideoCard[] = [
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
    ];

    const marqueeCards = [...serviceVideoCards, ...serviceVideoCards, ...serviceVideoCards];

    const playLoopingVideo = useCallback((video: HTMLVideoElement | null) => {
        if (!video) return;
        video.defaultPlaybackRate = 1;
        video.playbackRate = 1;
        const playPromise = video.play();
        if (playPromise) {
            playPromise.catch(() => undefined);
        }
    }, []);

    const handleCardClick = (index: number) => {
        // Ignore click if user was dragging
        if (hasDraggedRef.current) return;

        setExpandedCard((currentExpanded) => {
            const nextExpanded = currentExpanded === index ? null : index;
            if (nextExpanded !== null) {
                playLoopingVideo(videoRefs.current[nextExpanded]);
            }
            return nextExpanded;
        });
    };

    useEffect(() => {
        if (expandedCard !== null) return;
        videoRefs.current.forEach((video) => {
            playLoopingVideo(video);
        });
    }, [expandedCard, playLoopingVideo]);

    useEffect(() => {
        if (expandedCard === null) return;
        videoRefs.current.forEach((video, index) => {
            if (!video) return;
            if (index === expandedCard) {
                playLoopingVideo(video);
                return;
            }
            video.pause();
        });
    }, [expandedCard, playLoopingVideo]);

    const assignVideoRef = (index: number, element: HTMLVideoElement | null) => {
        videoRefs.current[index] = element;
        if (!element) {
            return;
        }
        const shouldPause = expandedCard !== null && expandedCard !== index;
        if (shouldPause) {
            element.pause();
            return;
        }
        playLoopingVideo(element);
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

    // Transform-based infinite scroll — no native scroll, full control
    useEffect(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track) return;

        const updateViewportMode = () => {
            isMobileViewportRef.current = window.innerWidth < MOBILE_BREAKPOINT_PX;
        };
        updateViewportMode();

        const syncDocumentVisibility = () => {
            isDocumentVisibleRef.current = document.visibilityState === 'visible';
            if (isDocumentVisibleRef.current) {
                mark('services-marquee:document-visible');
            }
            syncAnimationLoop();
        };

        // Measure one set width and start at the middle set
        const measure = () => {
            setWidthRef.current = track.scrollWidth / 3;
            offsetRef.current = setWidthRef.current;
            track.style.transform = `translateX(-${offsetRef.current}px)`;
        };
        const initTimeout = setTimeout(measure, 50);
        window.addEventListener('resize', updateViewportMode);
        window.addEventListener('resize', measure);
        document.addEventListener('visibilitychange', syncDocumentVisibility);

        let animationFrameId: number | null = null;
        let previousTimestamp: number | null = null;
        let sectionObserver: IntersectionObserver | null = null;

        const stopAnimationLoop = () => {
            if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            previousTimestamp = null;
        };

        const syncAnimationLoop = () => {
            const shouldRun = isSectionVisibleRef.current && isDocumentVisibleRef.current;
            if (!shouldRun) {
                stopAnimationLoop();
                return;
            }
            if (animationFrameId === null) {
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        const animate = (timestamp: number) => {
            animationFrameId = null;
            const sw = setWidthRef.current;
            if (sw <= 0) {
                syncAnimationLoop();
                return;
            }

            const rawDeltaMs = previousTimestamp === null ? 16.67 : timestamp - previousTimestamp;
            const deltaMs = Math.min(Math.max(rawDeltaMs, 0), MAX_FRAME_DELTA_MS);
            previousTimestamp = timestamp;

            // Auto-scroll when not paused and not dragging.
            if (!isPausedRef.current && !isDraggingRef.current) {
                const autoScrollSpeed = isMobileViewportRef.current
                    ? AUTO_SCROLL_SPEED_MOBILE_PX_PER_SECOND
                    : AUTO_SCROLL_SPEED_DESKTOP_PX_PER_SECOND;
                offsetRef.current += autoScrollSpeed * (deltaMs / 1000);
            }

            // Wrap boundaries — runs every frame regardless
            if (offsetRef.current >= sw * 2) {
                offsetRef.current -= sw;
            } else if (offsetRef.current <= 0) {
                offsetRef.current += sw;
            }

            track.style.transform = `translateX(-${offsetRef.current}px)`;
            syncAnimationLoop();
        };

        // Mouse drag
        const handleMouseDown = (e: MouseEvent) => {
            isDraggingRef.current = true;
            hasDraggedRef.current = false;
            dragStartRef.current = { x: e.clientX, y: 0, offset: offsetRef.current };
        };
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;
            const dx = dragStartRef.current.x - e.clientX;
            if (Math.abs(dx) > 5) hasDraggedRef.current = true;
            offsetRef.current = dragStartRef.current.offset + dx;
        };
        const handleMouseUp = () => {
            isDraggingRef.current = false;
        };

        // Touch drag
        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            if (!touch) return;
            touchSessionCounterRef.current += 1;
            const sessionId = touchSessionCounterRef.current;
            activeTouchSessionRef.current = sessionId;
            mark(`services-marquee:touch:${sessionId}:start`);

            isTouchTrackingRef.current = true;
            isDraggingRef.current = false;
            hasDraggedRef.current = false;
            touchAxisRef.current = 'pending';
            dragStartRef.current = { x: touch.clientX, y: touch.clientY, offset: offsetRef.current };
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (!isTouchTrackingRef.current) return;
            const touch = e.touches[0];
            if (!touch) return;

            const dx = dragStartRef.current.x - touch.clientX;
            const dy = dragStartRef.current.y - touch.clientY;

            if (touchAxisRef.current === 'pending') {
                if (
                    Math.abs(dx) < TOUCH_AXIS_LOCK_THRESHOLD_PX &&
                    Math.abs(dy) < TOUCH_AXIS_LOCK_THRESHOLD_PX
                ) {
                    return;
                }
                touchAxisRef.current = Math.abs(dx) >= Math.abs(dy) ? 'horizontal' : 'vertical';
                const sessionId = activeTouchSessionRef.current;
                if (sessionId !== null) {
                    mark(`services-marquee:touch:${sessionId}:axis-${touchAxisRef.current}`);
                }
            }

            if (touchAxisRef.current === 'vertical') {
                isTouchTrackingRef.current = false;
                isDraggingRef.current = false;
                return;
            }

            isDraggingRef.current = true;
            if (e.cancelable) {
                e.preventDefault();
            }

            const dragMultiplier = isMobileViewportRef.current ? MOBILE_TOUCH_DRAG_MULTIPLIER : 1;
            const dragDelta = dx * dragMultiplier;
            if (Math.abs(dragDelta) > 5) hasDraggedRef.current = true;
            offsetRef.current = dragStartRef.current.offset + dragDelta;
        };
        const handleTouchEnd = () => {
            const sessionId = activeTouchSessionRef.current;
            if (sessionId !== null) {
                const startMark = `services-marquee:touch:${sessionId}:start`;
                const endMark = `services-marquee:touch:${sessionId}:end`;
                mark(endMark);
                measure(startMark, endMark, `services-marquee:touch:${sessionId}:duration`);
            }
            activeTouchSessionRef.current = null;
            isTouchTrackingRef.current = false;
            isDraggingRef.current = false;
            touchAxisRef.current = 'pending';
        };

        if (typeof IntersectionObserver !== 'undefined') {
            sectionObserver = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];
                    isSectionVisibleRef.current = Boolean(entry?.isIntersecting);
                    syncAnimationLoop();
                },
                { rootMargin: '420px 0px' },
            );
            sectionObserver.observe(container);
        }

        syncDocumentVisibility();
        syncAnimationLoop();

        container.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
        window.addEventListener('touchcancel', handleTouchEnd);

        return () => {
            clearTimeout(initTimeout);
            stopAnimationLoop();
            sectionObserver?.disconnect();
            window.removeEventListener('resize', updateViewportMode);
            window.removeEventListener('resize', measure);
            document.removeEventListener('visibilitychange', syncDocumentVisibility);
            container.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            container.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        offsetRef.current += direction === 'left' ? -300 : 300;
    };

    return (
        <div id={sectionId} className="mt-16 md:mt-20 mb-12 md:mb-16 overflow-hidden">
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
                    style={{ touchAction: 'pan-y' }}
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
                                    onClick={() => handleCardClick(index)}
                                >
                                    {/* Compact Vertical Frame */}
                                    <div className={`relative aspect-[9/14] w-full overflow-hidden rounded-2xl border border-border/60 shadow-lg bg-card transition-all duration-500 ease-out hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:border-primary/25 ${isExpanded ? '-translate-y-2' : ''}`}>
                                        <LazyVideo
                                            ref={(el) => {
                                                assignVideoRef(index, el);
                                            }}
                                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                            src={card.videoSrc}
                                            poster={card.poster}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            pauseOffscreen
                                            forcePause={expandedCard !== null && expandedCard !== index}
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
