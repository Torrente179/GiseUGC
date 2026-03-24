import { useCallback, useEffect, useRef, useState, type TouchEvent, type WheelEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { blurRevealUp, easeOutExpo, springHoverTransition, springSmooth, springSnappy, staggerContainer } from '@/components/motion/variants';

interface TestimonialImage {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
}

const TESTIMONIAL_IMAGES: TestimonialImage[] = [
  {
    id: 1,
    src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8667.PNG',
    alt: 'Original testimonial screenshot 1',
    width: 1284,
    height: 488,
  },
  {
    id: 2,
    src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8668.PNG',
    alt: 'Original testimonial screenshot 2',
    width: 1284,
    height: 791,
  },
  {
    id: 3,
    src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8669.PNG',
    alt: 'Original testimonial screenshot 3',
    width: 1284,
    height: 853,
  },
  {
    id: 4,
    src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8670.PNG',
    alt: 'Original testimonial screenshot 4',
    width: 1284,
    height: 689,
  },
  {
    id: 5,
    src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8671.PNG',
    alt: 'Original testimonial screenshot 5',
    width: 1284,
    height: 970,
  },
  {
    id: 6,
    src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8672.PNG',
    alt: 'Original testimonial screenshot 6',
    width: 1284,
    height: 945,
  },
  {
    id: 7,
    src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8673.PNG',
    alt: 'Original testimonial screenshot 7',
    width: 1284,
    height: 724,
  },
  {
    id: 8,
    src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8674.PNG',
    alt: 'Original testimonial screenshot 8',
    width: 1284,
    height: 838,
  },
  {
    id: 9,
    src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8675.PNG',
    alt: 'Original testimonial screenshot 9',
    width: 1284,
    height: 635,
  },
  {
    id: 10,
    src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8676.PNG',
    alt: 'Original testimonial screenshot 10',
    width: 1284,
    height: 718,
  },
  {
    id: 11,
    src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8677.PNG',
    alt: 'Original testimonial screenshot 11',
    width: 1284,
    height: 842,
  },
  {
    id: 12,
    src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8678.PNG',
    alt: 'Original testimonial screenshot 12',
    width: 1284,
    height: 707,
  },
  {
    id: 13,
    src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8679.PNG',
    alt: 'Original testimonial screenshot 13',
    width: 1284,
    height: 603,
  },
  {
    id: 14,
    src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8680.PNG',
    alt: 'Original testimonial screenshot 14',
    width: 1284,
    height: 1054,
  },
];

const Testimonials = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const thumbnailRailRef = useRef<HTMLDivElement | null>(null);
  const thumbnailButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const goTo = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  const nextTestimonial = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % TESTIMONIAL_IMAGES.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + TESTIMONIAL_IMAGES.length) % TESTIMONIAL_IMAGES.length);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextTestimonial();
    } else if (distance < -minSwipeDistance) {
      prevTestimonial();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const zoomedTestimonial = zoomedIndex === null ? null : TESTIMONIAL_IMAGES[zoomedIndex];

  const setThumbnailButtonRef = useCallback(
    (index: number) => (node: HTMLButtonElement | null) => {
      thumbnailButtonRefs.current[index] = node;
    },
    [],
  );

  const keepActiveThumbnailVisible = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      const rail = thumbnailRailRef.current;
      const activeButton = thumbnailButtonRefs.current[activeIndex];
      if (!rail || !activeButton) return;

      const railRect = rail.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      const edgeThreshold = 44;
      const nearLeftEdge = buttonRect.left < railRect.left + edgeThreshold;
      const nearRightEdge = buttonRect.right > railRect.right - edgeThreshold;

      if (!nearLeftEdge && !nearRightEdge) return;

      const centeredLeft = activeButton.offsetLeft - rail.clientWidth / 2 + activeButton.clientWidth / 2;
      rail.scrollTo({
        left: Math.max(0, centeredLeft),
        behavior,
      });
    },
    [activeIndex],
  );

  useEffect(() => {
    keepActiveThumbnailVisible('smooth');
  }, [activeIndex, keepActiveThumbnailVisible]);

  const scrollThumbnailRail = (direction: 'left' | 'right') => {
    const rail = thumbnailRailRef.current;
    if (!rail) return;
    const amount = Math.max(rail.clientWidth * 0.6, 160);
    rail.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const handleThumbnailWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    event.currentTarget.scrollLeft += event.deltaY;
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
    }),
  };

  const NavButton = ({ onClick, ariaLabel, children, className = '' }: {
    onClick: () => void;
    ariaLabel: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <motion.button
      onClick={onClick}
      className={`h-10 w-10 md:h-11 md:w-11 rounded-full border border-border/60 bg-card/90 backdrop-blur-sm flex items-center justify-center text-foreground/70 transition-colors hover:bg-card hover:border-primary/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      aria-label={ariaLabel}
      whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.05 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.93 }}
      transition={springSnappy}
    >
      {children}
    </motion.button>
  );

  return (
    <section id="testimonials" className="studio-section bg-background">
      <div className="studio-container">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10 md:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.12, 0.04)}
        >
          <div>
            <motion.p className="section-label text-muted-foreground mb-3" variants={blurRevealUp(14, 0.56)}>
              {t('testimonials.sectionSubtitle')}
            </motion.p>
            <h2 className="studio-title">
              <SplitTextReveal text={t('testimonials.sectionTitle')} delay={0.08} />
            </h2>
          </div>

          {/* Desktop: nav arrows + counter */}
          <motion.div className="hidden md:flex items-center gap-4" variants={blurRevealUp(18, 0.62)}>
            <span className="text-sm font-medium tabular-nums text-muted-foreground tracking-wide">
              {String(activeIndex + 1).padStart(2, '0')}
              <span className="mx-1 text-border">/</span>
              {String(TESTIMONIAL_IMAGES.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-2">
              <NavButton onClick={prevTestimonial} ariaLabel={t('testimonials.ariaPrev')}>
                <ChevronLeft className="h-4.5 w-4.5" />
              </NavButton>
              <NavButton onClick={nextTestimonial} ariaLabel={t('testimonials.ariaNext')}>
                <ChevronRight className="h-4.5 w-4.5" />
              </NavButton>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="studio-rule mb-8 md:mb-10"
          initial={{ opacity: 0, scaleX: 0.7 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.62 }}
        />

        {/* Main carousel */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.68 }}
        >
          {/* Image area */}
          <div
            className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-card border border-border/50"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative overflow-hidden min-h-[220px] md:min-h-[320px] lg:min-h-[360px]">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.article
                  key={activeIndex}
                  custom={direction}
                  variants={shouldReduceMotion ? undefined : slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 },
                    opacity: { duration: 0.2, ease: easeOutExpo },
                  }}
                  className="flex items-center justify-center w-full px-4 py-5 md:px-8 md:py-7 lg:px-10 lg:py-8"
                >
                  <button
                    type="button"
                    onClick={() => setZoomedIndex(activeIndex)}
                    className="mx-auto block w-full max-w-[720px] overflow-hidden rounded-xl bg-background/40 ring-1 ring-border/40 transition-all hover:ring-primary/30 hover:shadow-lg hover:shadow-primary/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-zoom-in"
                    aria-label={`Open testimonial image ${activeIndex + 1}`}
                  >
                    <img
                      src={TESTIMONIAL_IMAGES[activeIndex].src}
                      alt={TESTIMONIAL_IMAGES[activeIndex].alt}
                      width={TESTIMONIAL_IMAGES[activeIndex].width}
                      height={TESTIMONIAL_IMAGES[activeIndex].height}
                      className="mx-auto h-auto w-full object-contain max-h-[60vh] md:max-h-[44vh] lg:max-h-[42vh]"
                      loading="eager"
                      decoding="async"
                    />
                  </button>
                </motion.article>
              </AnimatePresence>
            </div>

            {/* Mobile nav overlay */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 md:hidden pointer-events-none">
              <button
                type="button"
                onClick={prevTestimonial}
                className="pointer-events-auto h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 flex items-center justify-center text-foreground/60 active:scale-95 transition-transform"
                aria-label={t('testimonials.ariaPrev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:hidden pointer-events-none">
              <button
                type="button"
                onClick={nextTestimonial}
                className="pointer-events-auto h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm border border-border/40 flex items-center justify-center text-foreground/60 active:scale-95 transition-transform"
                aria-label={t('testimonials.ariaNext')}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 md:mt-5 flex items-center gap-1.5 justify-center md:hidden">
            <span className="text-xs font-medium tabular-nums text-muted-foreground/70">
              {activeIndex + 1} / {TESTIMONIAL_IMAGES.length}
            </span>
          </div>
        </motion.div>

        {/* Thumbnail rail */}
        <div className="mt-4 md:mt-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollThumbnailRail('left')}
              className="hidden md:inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card text-foreground/50 transition-colors hover:border-primary/30 hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Scroll testimonials left"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <div
              ref={thumbnailRailRef}
              className="flex snap-x snap-mandatory gap-2 overflow-x-auto scrollbar-none pb-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onWheel={handleThumbnailWheel}
            >
              {TESTIMONIAL_IMAGES.map((testimonial, index) => (
                <motion.button
                  key={testimonial.id}
                  ref={setThumbnailButtonRef(index)}
                  onClick={() => goTo(index)}
                  className={`relative shrink-0 snap-start overflow-hidden rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    activeIndex === index
                      ? 'h-[4.25rem] w-[6.5rem] md:h-[5rem] md:w-[8rem] ring-2 ring-primary/50 border border-primary/20 shadow-sm shadow-primary/[0.06]'
                      : 'h-[4.25rem] w-[6.5rem] md:h-[5rem] md:w-[8rem] border border-border/40 opacity-50 hover:opacity-80 hover:border-border/70'
                  }`}
                  aria-label={t('testimonials.ariaGoTo', { index: index + 1 })}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                  transition={springHoverTransition}
                >
                  <img
                    src={testimonial.src}
                    alt=""
                    width={testimonial.width}
                    height={testimonial.height}
                    className="h-full w-full object-contain bg-background/30"
                    loading="lazy"
                    decoding="async"
                  />
                </motion.button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollThumbnailRail('right')}
              className="hidden md:inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card text-foreground/50 transition-colors hover:border-primary/30 hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Scroll testimonials right"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Zoom dialog */}
      <Dialog open={zoomedIndex !== null} onOpenChange={(isOpen) => !isOpen && setZoomedIndex(null)}>
        <DialogContent className="max-h-[95vh] max-w-[95vw] border-border/70 bg-card/95 p-3 md:p-4">
          <DialogTitle className="sr-only">Testimonial image preview</DialogTitle>
          {zoomedTestimonial && (
            <div className="flex max-h-[90vh] items-center justify-center overflow-auto">
              <img
                src={zoomedTestimonial.src}
                alt={zoomedTestimonial.alt}
                width={zoomedTestimonial.width}
                height={zoomedTestimonial.height}
                className="h-auto max-h-[90vh] w-auto max-w-[95vw] rounded-lg object-contain"
                loading="eager"
                decoding="async"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Testimonials;
