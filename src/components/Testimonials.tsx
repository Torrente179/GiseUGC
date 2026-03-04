import { useCallback, useEffect, useRef, useState, type TouchEvent, type WheelEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { revealUp, springHoverTransition, staggerContainer } from '@/components/motion/variants';

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
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const thumbnailRailRef = useRef<HTMLDivElement | null>(null);
  const thumbnailButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % TESTIMONIAL_IMAGES.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + TESTIMONIAL_IMAGES.length) % TESTIMONIAL_IMAGES.length);
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

  return (
    <section id="testimonials" className="studio-section bg-background">
      <div className="studio-container">
        <motion.div
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10 md:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.12, 0.04)}
        >
          <div>
            <motion.p className="section-label text-muted-foreground mb-3" variants={revealUp(14, 0.56)}>
              {t('testimonials.sectionSubtitle')}
            </motion.p>
            <h2 className="studio-title">
              <SplitTextReveal text={t('testimonials.sectionTitle')} delay={0.08} />
            </h2>
          </div>

          <motion.div className="hidden md:flex items-center gap-3" variants={revealUp(18, 0.62)}>
            <motion.button
              onClick={prevTestimonial}
              className="h-11 w-11 rounded-full bg-card border border-primary/20 flex items-center justify-center shadow-sm"
              aria-label={t('testimonials.ariaPrev')}
              whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.06 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              transition={springHoverTransition}
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
            </motion.button>
            <motion.button
              onClick={nextTestimonial}
              className="h-11 w-11 rounded-full bg-card border border-primary/20 flex items-center justify-center shadow-sm"
              aria-label={t('testimonials.ariaNext')}
              whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.06 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              transition={springHoverTransition}
            >
              <ChevronRight className="h-5 w-5 text-primary" />
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="studio-rule mb-8 md:mb-10"
          initial={{ opacity: 0, scaleX: 0.7 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.62 }}
        />

        <motion.div
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.68 }}
        >
          <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {TESTIMONIAL_IMAGES.map((testimonial, index) => (
              <article key={testimonial.id} className="min-w-full">
                <div className="rounded-[1.5rem] border border-border/80 bg-card/70 p-3 md:p-4 lg:p-5">
                  <button
                    type="button"
                    onClick={() => setZoomedIndex(index)}
                    className="mx-auto block w-full max-w-[980px] overflow-hidden rounded-2xl border border-border/70 bg-background/55 transition-colors hover:border-primary/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:max-w-[760px] lg:max-w-[820px]"
                    aria-label={`Open testimonial image ${index + 1}`}
                  >
                    <img
                      src={testimonial.src}
                      alt={testimonial.alt}
                      width={testimonial.width}
                      height={testimonial.height}
                      className="mx-auto h-auto max-h-[70vh] w-full object-contain md:max-h-[44vh] lg:max-h-[42vh]"
                      loading={index === activeIndex ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </motion.div>

        <div className="mt-3 md:mt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollThumbnailRail('left')}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-card text-primary transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Scroll testimonials left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div
              ref={thumbnailRailRef}
              className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1"
              onWheel={handleThumbnailWheel}
            >
              {TESTIMONIAL_IMAGES.map((testimonial, index) => (
                <motion.button
                  key={testimonial.id}
                  ref={setThumbnailButtonRef(index)}
                  onClick={() => setActiveIndex(index)}
                  className={`relative h-16 w-24 shrink-0 snap-start overflow-hidden rounded-lg border bg-background/55 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:h-20 md:w-32 ${
                    activeIndex === index ? 'border-primary/70 ring-1 ring-primary/40' : 'border-border/65 hover:border-primary/30'
                  }`}
                  aria-label={t('testimonials.ariaGoTo', { index: index + 1 })}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                  transition={springHoverTransition}
                >
                  <img
                    src={testimonial.src}
                    alt=""
                    width={testimonial.width}
                    height={testimonial.height}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </motion.button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollThumbnailRail('right')}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-card text-primary transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Scroll testimonials right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

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
