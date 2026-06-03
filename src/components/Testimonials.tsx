import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { X } from 'lucide-react';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { blurRevealUp, staggerContainer } from '@/components/motion/variants';

interface TestimonialImage {
  id: number;
  src: string;
  alt: string;
  width: number;
  height: number;
}

const TESTIMONIAL_IMAGES: TestimonialImage[] = [
  { id: 1, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8667.PNG', alt: 'Client testimonial – vmachado05, 5.0 stars', width: 1284, height: 488 },
  { id: 2, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8668.PNG', alt: 'Client testimonial – screenshot 2', width: 1284, height: 791 },
  { id: 3, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8669.PNG', alt: 'Client testimonial – screenshot 3', width: 1284, height: 853 },
  { id: 4, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8670.PNG', alt: 'Client testimonial – screenshot 4', width: 1284, height: 689 },
  { id: 5, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8671.PNG', alt: 'Client testimonial – tophatmedia, 5.0 stars', width: 1284, height: 970 },
  { id: 6, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8672.PNG', alt: 'Client testimonial – screenshot 6', width: 1284, height: 945 },
  { id: 7, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8673.PNG', alt: 'Client testimonial – screenshot 7', width: 1284, height: 724 },
  { id: 8, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8674.PNG', alt: 'Client testimonial – screenshot 8', width: 1284, height: 838 },
  { id: 9, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8675.PNG', alt: 'Client testimonial – screenshot 9', width: 1284, height: 635 },
  { id: 10, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8676.PNG', alt: 'Client testimonial – screenshot 10', width: 1284, height: 718 },
  { id: 11, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8677.PNG', alt: 'Client testimonial – screenshot 11', width: 1284, height: 842 },
  { id: 12, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8678.PNG', alt: 'Client testimonial – screenshot 12', width: 1284, height: 707 },
  { id: 13, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8679.PNG', alt: 'Client testimonial – screenshot 13', width: 1284, height: 603 },
  { id: 14, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8680.PNG', alt: 'Client testimonial – screenshot 14', width: 1284, height: 1054 },
];

const FIVERR_AGGREGATE_RATING = 4.8;
const FIVERR_REVIEW_COUNT = 173;

// Split into two rows for the marquee
const ROW_1 = TESTIMONIAL_IMAGES.slice(0, 7);
const ROW_2 = TESTIMONIAL_IMAGES.slice(7, 14);

/* ─── Marquee Row ─── */
interface MarqueeRowProps {
  items: TestimonialImage[];
  direction?: 'left' | 'right';
  speed?: number; // seconds for one full cycle
  paused: boolean;
  onClickItem: (index: number) => void;
  globalIndexOffset: number;
}

const MarqueeRow = ({
  items,
  direction = 'left',
  speed = 60,
  paused,
  onClickItem,
  globalIndexOffset,
}: MarqueeRowProps) => {
  // Triple the items for seamless loop
  const tripled = [...items, ...items, ...items];

  return (
    <div
      className="marquee-row relative flex overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
      }}
    >
      <div
        className={`marquee-track flex gap-3 md:gap-4 ${paused ? 'marquee-paused' : ''}`}
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {tripled.map((item, i) => {
          const originalIndex = (i % items.length) + globalIndexOffset;
          return (
            <button
              key={`${item.id}-${i}`}
              type="button"
              onClick={() => onClickItem(originalIndex)}
              className="testimonial-card group relative shrink-0 overflow-hidden rounded-xl md:rounded-2xl border border-border/30 bg-card/80 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/[0.04] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-zoom-in"
              style={{
                width: 'clamp(260px, 28vw, 380px)',
              }}
              aria-label={`View ${item.alt}`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Lightbox carousel ───
   A self-contained, full-screen viewer. Deliberately NOT a Radix Dialog:
   the page sets `body { overflow-x: hidden }`, which makes <body> a scroll
   container and breaks react-remove-scroll's scroll lock (the page jumps /
   freezes on close). We lock scroll ourselves with the position:fixed pattern,
   which is immune to that and restores the exact scroll position. */
interface LightboxProps {
  images: TestimonialImage[];
  startIndex: number;
  onClose: () => void;
  reduceMotion: boolean;
  labels: {
    prev: string;
    next: string;
    close: string;
    dialog: string;
    hint: string;
  };
}

const Lightbox = ({ images, startIndex, onClose, reduceMotion, labels }: LightboxProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    startIndex,
    skipSnaps: false,
    duration: reduceMotion ? 0 : 24,
  });
  const [selected, setSelected] = useState(startIndex);
  const rootRef = useRef<HTMLDivElement>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Keep the active-slide highlight in sync with embla.
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Keyboard: arrows navigate, Escape closes, Tab is trapped inside the viewer.
  useEffect(() => {
    const node = rootRef.current;
    node?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === 'Tab' && node) {
        const focusable = node.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, scrollNext, scrollPrev]);

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.42, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  return (
    <m.div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={labels.dialog}
      tabIndex={-1}
      className="fixed inset-0 z-[10000] flex flex-col bg-black/85 backdrop-blur-xl outline-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.28 }}
      onMouseDown={(e) => {
        // Backdrop click closes; clicks bubbling up from cards/buttons don't.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top bar: counter + close */}
      <div className="flex shrink-0 items-center justify-between px-4 py-4 md:px-8 md:py-5">
        <span className="text-sm font-medium tabular-nums text-white/55 tracking-wide">
          {selected + 1}
          <span className="mx-1.5 text-white/25">/</span>
          {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={labels.close}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Carousel */}
      <div className="relative flex min-h-0 flex-1 items-center">
        <div className="h-full w-full overflow-hidden" ref={emblaRef}>
          <div className="flex h-full touch-pan-y">
            {images.map((item, i) => {
              const isActive = i === selected;
              return (
                <div
                  key={item.id}
                  className="flex min-w-0 flex-[0_0_90%] items-center justify-center px-2 sm:flex-[0_0_74%] sm:px-3 lg:flex-[0_0_60%]"
                >
                  <m.figure
                    className="relative max-h-full overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl shadow-black/40"
                    animate={{
                      scale: isActive ? 1 : 0.9,
                      opacity: isActive ? 1 : 0.35,
                    }}
                    transition={transition}
                  >
                    <div className="max-h-[78vh] overflow-y-auto overscroll-contain">
                      <img
                        src={item.src}
                        alt={item.alt}
                        width={item.width}
                        height={item.height}
                        className="block h-auto w-full select-none object-contain"
                        loading="eager"
                        decoding="async"
                        draggable={false}
                      />
                    </div>
                  </m.figure>
                </div>
              );
            })}
          </div>
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={scrollPrev}
          aria-label={labels.prev}
          className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/85 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:left-6 md:h-12 md:w-12"
        >
          <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label={labels.next}
          className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/85 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:right-6 md:h-12 md:w-12"
        >
          <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Bottom: dot strip + hint */}
      <div className="flex shrink-0 flex-col items-center gap-3 px-4 py-5 md:py-6">
        <div className="flex max-w-full items-center gap-1.5 overflow-x-auto">
          {images.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`${labels.dialog} ${i + 1}`}
              aria-current={i === selected}
              className={`h-1.5 shrink-0 rounded-full transition-all duration-300 ${
                i === selected ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
        <p className="text-xs tracking-wide text-white/40">{labels.hint}</p>
      </div>
    </m.div>
  );
};

/* ─── Main Component ─── */
const Testimonials = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const reduceMotion = !!shouldReduceMotion;
  const isOpen = zoomedIndex !== null;

  // Pause the marquee on hover, reduced motion, or while the viewer is open.
  const effectivePaused = isPaused || reduceMotion || isOpen;

  // Lock body scroll while the viewer is open. Managed here (not inside the
  // viewer's unmount) so the lock releases the instant the viewer closes —
  // never waiting on an exit animation. Uses position:fixed + restore, which
  // is immune to `body { overflow-x: hidden }` (that breaks library scroll
  // locks and was the original "scrolling crashes on close" bug).
  useEffect(() => {
    if (!isOpen) return;
    const { body } = document;
    const scrollY = window.scrollY;
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    if (scrollbarGap > 0) body.style.paddingRight = `${scrollbarGap}px`;
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  return (
    <section id="testimonials" className="studio-section bg-background overflow-hidden">
      <div className="studio-container">
        {/* Header */}
        <m.div
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8 md:mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer(0.12, 0.04)}
        >
          <div>
            <m.p className="section-label text-muted-foreground mb-3" variants={blurRevealUp(14, 0.56)}>
              {t('testimonials.sectionSubtitle')}
            </m.p>
            <h2 className="studio-title">
              <SplitTextReveal text={t('testimonials.sectionTitle')} delay={0.08} />
            </h2>
          </div>

          {/* Proof badge */}
          <m.div
            className="flex items-center gap-3"
            variants={blurRevealUp(18, 0.62)}
          >
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => {
                const fillPercent = Math.max(0, Math.min(100, (FIVERR_AGGREGATE_RATING - i) * 100));

                return (
                  <span key={i} className="relative inline-flex h-3.5 w-3.5 text-amber-500" aria-hidden="true">
                    <svg className="absolute inset-0 h-3.5 w-3.5 text-amber-500/25" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercent}%` }}>
                      <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                  </span>
                );
              })}
            </div>
            <span className="text-sm font-medium text-muted-foreground tabular-nums tracking-wide">
              {FIVERR_AGGREGATE_RATING.toFixed(1)}
              <span className="mx-1.5 text-border/60">·</span>
              {t('testimonials.reviewCount', { count: FIVERR_REVIEW_COUNT })}
            </span>
          </m.div>
        </m.div>

        <m.div
          className="studio-rule mb-6 md:mb-8"
          initial={{ opacity: 0, scaleX: 0.7 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.62 }}
        />
      </div>

      {/* Marquee area — full bleed */}
      <m.div
        className="relative"
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.68 }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <div className="flex flex-col gap-3 md:gap-4 py-1">
          {/* Row 1 — scrolls left */}
          <MarqueeRow
            items={ROW_1}
            direction="left"
            speed={reduceMotion ? 999999 : 55}
            paused={effectivePaused}
            onClickItem={setZoomedIndex}
            globalIndexOffset={0}
          />

          {/* Row 2 — scrolls right */}
          <MarqueeRow
            items={ROW_2}
            direction="right"
            speed={reduceMotion ? 999999 : 65}
            paused={effectivePaused}
            onClickItem={setZoomedIndex}
            globalIndexOffset={7}
          />
        </div>

        {/* Hover hint — desktop only */}
        <div className="hidden md:flex items-center justify-center mt-4">
          <p className="text-xs text-muted-foreground/50 tracking-wide transition-opacity duration-300"
            style={{ opacity: isPaused ? 1 : 0 }}
          >
            {t('testimonials.hoverHint')}
          </p>
        </div>
      </m.div>

      {/* Zoom viewer */}
      <AnimatePresence>
        {zoomedIndex !== null && (
          <Lightbox
            key="testimonial-lightbox"
            images={TESTIMONIAL_IMAGES}
            startIndex={zoomedIndex}
            onClose={() => setZoomedIndex(null)}
            reduceMotion={reduceMotion}
            labels={{
              prev: t('testimonials.ariaPrev'),
              next: t('testimonials.ariaNext'),
              close: t('testimonials.ariaClose'),
              dialog: t('testimonials.ariaDialog'),
              hint: t('testimonials.swipeHint'),
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Testimonials;
