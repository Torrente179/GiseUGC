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
    liteMobile?: boolean;
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
const TOUCH_GESTURE_SLOP_PX = 4;
const HORIZONTAL_AXIS_BIAS = 1.15;

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

const ServicesMarquee = ({ sectionId, liteMobile = false }: ServicesMarqueeProps) => {
    const { t } = useTranslation();
    const [expandedCard, setExpandedCard] = useState<number | null>(null);
    const [isMobileViewport, setIsMobileViewport] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth < MOBILE_BREAKPOINT_PX;
    });
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const isPausedRef = useRef(false);
    const isDraggingRef = useRef(false);
    const targetOffsetRef = useRef(0);
    const renderedOffsetRef = useRef(0);
    const releaseVelocityRef = useRef(0);
    const setWidthRef = useRef(0);
    const dragStartRef = useRef({ x: 0, y: 0, offset: 0 });
    const lastDragSampleRef = useRef({ x: 0, timestamp: 0 });
    const hasDraggedRef = useRef(false);
    const touchAxisRef = useRef<'pending' | 'horizontal' | 'vertical'>('pending');
    const isTouchTrackingRef = useRef(false);
    const isSectionVisibleRef = useRef(true);
    const isDocumentVisibleRef = useRef(true);
    const isMobileViewportRef = useRef(false);
    const viewportWidthRef = useRef(0);
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

    const isLiteMobileMode = liteMobile && isMobileViewport;
    const marqueeCards = isLiteMobileMode
        ? serviceVideoCards
        : [...serviceVideoCards, ...serviceVideoCards, ...serviceVideoCards];

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
        if (isLiteMobileMode) return;
        if (expandedCard !== null) return;
        videoRefs.current.forEach((video) => {
            playLoopingVideo(video);
        });
    }, [expandedCard, isLiteMobileMode, playLoopingVideo]);

    useEffect(() => {
        if (isLiteMobileMode) return;
        if (expandedCard === null) return;
        videoRefs.current.forEach((video, index) => {
            if (!video) return;
            if (index === expandedCard) {
                playLoopingVideo(video);
                return;
            }
            video.pause();
        });
    }, [expandedCard, isLiteMobileMode, playLoopingVideo]);

    const assignVideoRef = (index: number, element: HTMLVideoElement | null) => {
        if (isLiteMobileMode) return;
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
        if (expandedCard !== null) {
            releaseVelocityRef.current = 0;
        }
    }, [expandedCard]);

    // Click outside cards to dismiss expanded card and resume scrolling
    useEffect(() => {
        if (isLiteMobileMode) return;
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
    }, [expandedCard, isLiteMobileMode]);

    // Transform-based infinite scroll — no native scroll, full control
    useEffect(() => {
        if (isLiteMobileMode) return;
        const container = containerRef.current;
        const track = trackRef.current;
        if (!container || !track) return;

        const updateViewportMode = () => {
            isMobileViewportRef.current = window.innerWidth < MOBILE_BREAKPOINT_PX;
        };
        updateViewportMode();
        viewportWidthRef.current = window.innerWidth;

        const syncDocumentVisibility = () => {
            isDocumentVisibleRef.current = document.visibilityState === 'visible';
            if (isDocumentVisibleRef.current) {
                mark('services-marquee:document-visible');
            }
            syncAnimationLoop();
        };

        const normalizeOffsetWithinSet = (offset: number, setWidth: number) => {
            if (setWidth <= 0) return 0;
            const normalized = offset % setWidth;
            return normalized < 0 ? normalized + setWidth : normalized;
        };

        const stabilizeOffset = (offset: number, setWidth: number) => {
            if (setWidth <= 0) return 0;

            let nextOffset = offset;
            while (nextOffset >= setWidth * 2) {
                nextOffset -= setWidth;
            }
            while (nextOffset < 0) {
                nextOffset += setWidth;
            }

            return nextOffset;
        };

        const syncTrackTransform = (offset: number) => {
            track.style.transform = `translate3d(-${offset}px, 0, 0)`;
        };

        // Measure one set width. On resize, preserve relative position instead of hard-resetting.
        const measureTrack = (preserveOffset = true) => {
            const nextSetWidth = track.scrollWidth / 3;
            if (!Number.isFinite(nextSetWidth) || nextSetWidth <= 0) return;

            const previousSetWidth = setWidthRef.current;
            const shouldInitialize = !preserveOffset || previousSetWidth <= 0;

            if (shouldInitialize) {
                targetOffsetRef.current = nextSetWidth;
                renderedOffsetRef.current = nextSetWidth;
            } else {
                const previousNormalized = normalizeOffsetWithinSet(targetOffsetRef.current, previousSetWidth);
                const progress = previousSetWidth > 0 ? previousNormalized / previousSetWidth : 0;
                const nextOffset = nextSetWidth + progress * nextSetWidth;
                targetOffsetRef.current = nextOffset;
                renderedOffsetRef.current = nextOffset;
            }

            releaseVelocityRef.current = 0;
            setWidthRef.current = nextSetWidth;
            syncTrackTransform(renderedOffsetRef.current);
        };

        let resizeRafId: number | null = null;
        const handleResize = () => {
            if (resizeRafId !== null) return;
            resizeRafId = window.requestAnimationFrame(() => {
                resizeRafId = null;
                const nextViewportWidth = window.innerWidth;
                const viewportWidthChanged = Math.abs(nextViewportWidth - viewportWidthRef.current) >= 1;
                viewportWidthRef.current = nextViewportWidth;
                updateViewportMode();
                if (!viewportWidthChanged) return;
                measureTrack(true);
            });
        };

        const initTimeout = setTimeout(() => {
            measureTrack(false);
        }, 50);
        window.addEventListener('resize', handleResize);
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
                targetOffsetRef.current += autoScrollSpeed * (deltaMs / 1000);
            }

            if (!isDraggingRef.current && Math.abs(releaseVelocityRef.current) > 8) {
                targetOffsetRef.current += releaseVelocityRef.current * (deltaMs / 1000);
                const decay = Math.pow(0.88, deltaMs / 16.67);
                releaseVelocityRef.current *= decay;
                if (Math.abs(releaseVelocityRef.current) < 8) {
                    releaseVelocityRef.current = 0;
                }
            }

            targetOffsetRef.current = stabilizeOffset(targetOffsetRef.current, sw);
            renderedOffsetRef.current = stabilizeOffset(renderedOffsetRef.current, sw);

            const rawDelta = targetOffsetRef.current - renderedOffsetRef.current;
            const wrappedDelta =
                rawDelta > sw / 2
                    ? rawDelta - sw
                    : rawDelta < -sw / 2
                        ? rawDelta + sw
                        : rawDelta;
            const followStrength = isDraggingRef.current ? 1 : 1 - Math.exp(-deltaMs / 72);

            renderedOffsetRef.current = stabilizeOffset(
                renderedOffsetRef.current + wrappedDelta * followStrength,
                sw,
            );

            if (Math.abs(wrappedDelta) < 0.1) {
                renderedOffsetRef.current = stabilizeOffset(targetOffsetRef.current, sw);
            }

            syncTrackTransform(renderedOffsetRef.current);
            syncAnimationLoop();
        };

        const sampleReleaseVelocity = (clientX: number, multiplier = 1) => {
            const now = performance.now();
            const elapsed = Math.max(1, now - lastDragSampleRef.current.timestamp);
            const deltaX = clientX - lastDragSampleRef.current.x;
            const nextVelocity = (-deltaX * multiplier / elapsed) * 1000;

            releaseVelocityRef.current = Math.max(-560, Math.min(560, nextVelocity));
            lastDragSampleRef.current = { x: clientX, timestamp: now };
        };

        const settleInteraction = () => {
            isDraggingRef.current = false;
            if (Math.abs(releaseVelocityRef.current) < 24) {
                releaseVelocityRef.current = 0;
            }
        };

        // Mouse drag
        const handleMouseDown = (e: MouseEvent) => {
            isDraggingRef.current = true;
            hasDraggedRef.current = false;
            releaseVelocityRef.current = 0;
            dragStartRef.current = { x: e.clientX, y: 0, offset: targetOffsetRef.current };
            lastDragSampleRef.current = { x: e.clientX, timestamp: performance.now() };
            syncAnimationLoop();
        };
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;
            const dx = dragStartRef.current.x - e.clientX;
            if (Math.abs(dx) > 5) hasDraggedRef.current = true;
            sampleReleaseVelocity(e.clientX);
            targetOffsetRef.current = dragStartRef.current.offset + dx;
            renderedOffsetRef.current = targetOffsetRef.current;
            syncTrackTransform(renderedOffsetRef.current);
        };
        const handleMouseUp = () => {
            settleInteraction();
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
            releaseVelocityRef.current = 0;
            dragStartRef.current = { x: touch.clientX, y: touch.clientY, offset: targetOffsetRef.current };
            lastDragSampleRef.current = { x: touch.clientX, timestamp: performance.now() };
            syncAnimationLoop();
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (!isTouchTrackingRef.current) return;
            const touch = e.touches[0];
            if (!touch) return;

            const dx = dragStartRef.current.x - touch.clientX;
            const dy = dragStartRef.current.y - touch.clientY;
            if (Math.abs(dx) > TOUCH_GESTURE_SLOP_PX || Math.abs(dy) > TOUCH_GESTURE_SLOP_PX) {
                hasDraggedRef.current = true;
            }

            if (touchAxisRef.current === 'pending') {
                if (
                    Math.abs(dx) < TOUCH_AXIS_LOCK_THRESHOLD_PX &&
                    Math.abs(dy) < TOUCH_AXIS_LOCK_THRESHOLD_PX
                ) {
                    return;
                }
                touchAxisRef.current =
                    Math.abs(dx) > Math.abs(dy) * HORIZONTAL_AXIS_BIAS ? 'horizontal' : 'vertical';
                const sessionId = activeTouchSessionRef.current;
                if (sessionId !== null) {
                    mark(`services-marquee:touch:${sessionId}:axis-${touchAxisRef.current}`);
                }
            }

            if (touchAxisRef.current === 'vertical') {
                isTouchTrackingRef.current = false;
                isDraggingRef.current = false;
                hasDraggedRef.current = true;
                releaseVelocityRef.current = 0;
                return;
            }

            isDraggingRef.current = true;
            if (e.cancelable) {
                e.preventDefault();
            }

            const dragMultiplier = isMobileViewportRef.current ? MOBILE_TOUCH_DRAG_MULTIPLIER : 1;
            const dragDelta = dx * dragMultiplier;
            if (Math.abs(dragDelta) > 5) hasDraggedRef.current = true;
            sampleReleaseVelocity(touch.clientX, dragMultiplier);
            targetOffsetRef.current = dragStartRef.current.offset + dragDelta;
            renderedOffsetRef.current = targetOffsetRef.current;
            syncTrackTransform(renderedOffsetRef.current);
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
            settleInteraction();
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
            if (resizeRafId !== null) {
                window.cancelAnimationFrame(resizeRafId);
            }
            sectionObserver?.disconnect();
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', syncDocumentVisibility);
            container.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            container.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
        };
    }, [isLiteMobileMode]);

    const scroll = (direction: 'left' | 'right') => {
        if (isLiteMobileMode) return;
        releaseVelocityRef.current = 0;
        targetOffsetRef.current += direction === 'left' ? -280 : 280;
    };

    if (isLiteMobileMode) {
        return (
            <div id={sectionId} className="mt-16 mb-12 overflow-hidden">
                <div className="studio-container">
                    <div className="px-4 mb-10 text-center mx-auto">
                        <h3 className="type-brand-display text-3xl font-bold tracking-tight-serif leading-[0.95] max-w-5xl mx-auto">
                            El toolkit completo para anunciantes <span className="luxury-accent text-accent inline-block transform rotate-[-2deg] ml-2">modernos</span>
                        </h3>
                        <p className="strategic-body text-base text-muted-foreground mt-6 max-w-3xl mx-auto">
                            {t('services.motionSubtitle')}
                        </p>
                    </div>
                </div>

                <div className="px-4">
                    <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                        {serviceVideoCards.map((card, index) => (
                            <article
                                key={`${card.titleKey}-lite-${index}`}
                                className="shrink-0 w-[190px] snap-start"
                            >
                                <div className="relative aspect-[9/14] w-full overflow-hidden rounded-2xl border border-border/60 shadow-lg bg-card">
                                    <img
                                        src={card.poster}
                                        alt=""
                                        aria-hidden="true"
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-50" />
                                </div>
                                <h3 className="section-label text-foreground/80 mt-4 text-center px-2">
                                    {t(card.titleKey)}
                                </h3>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id={sectionId} className="mt-16 md:mt-20 mb-12 md:mb-16 overflow-hidden">
            <div className="studio-container">
                <div className="px-4 mb-12 md:mb-20 text-center mx-auto">
                    <h3 className="type-brand-display text-3xl md:text-5xl lg:text-5xl font-bold tracking-tight-serif leading-[0.95] max-w-5xl mx-auto">
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
                            const middleSetStart = serviceVideoCards.length;
                            const isPriorityWarmCard =
                                index >= middleSetStart - 2 &&
                                index <= middleSetStart + 8;
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
                                            loadWhenVisible={!isPriorityWarmCard}
                                            preload={isPriorityWarmCard ? 'metadata' : 'none'}
                                            rootMargin={isPriorityWarmCard ? '520px 0px' : '120px 0px'}
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
