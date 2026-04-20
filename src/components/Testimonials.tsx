import { useCallback, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import SplitTextReveal from '@/components/motion/SplitTextReveal';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
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
  shouldReduceMotion: boolean | null;
}

const MarqueeRow = ({
  items,
  direction = 'left',
  speed = 60,
  paused,
  onClickItem,
  globalIndexOffset,
  shouldReduceMotion,
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

/* ─── Main Component ─── */
const Testimonials = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const zoomedTestimonial = zoomedIndex === null ? null : TESTIMONIAL_IMAGES[zoomedIndex];

  // Keyboard navigation in zoom mode
  const handleZoomKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (zoomedIndex === null) return;
      if (e.key === 'ArrowRight') {
        setZoomedIndex((prev) => (prev !== null ? (prev + 1) % TESTIMONIAL_IMAGES.length : null));
      } else if (e.key === 'ArrowLeft') {
        setZoomedIndex((prev) =>
          prev !== null ? (prev - 1 + TESTIMONIAL_IMAGES.length) % TESTIMONIAL_IMAGES.length : null,
        );
      }
    },
    [zoomedIndex],
  );

  useEffect(() => {
    if (zoomedIndex !== null) {
      window.addEventListener('keydown', handleZoomKeyDown);
      return () => window.removeEventListener('keydown', handleZoomKeyDown);
    }
  }, [zoomedIndex, handleZoomKeyDown]);

  // Pause marquee on reduced motion preference
  const effectivePaused = isPaused || !!shouldReduceMotion;

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
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-3.5 w-3.5 text-amber-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground tabular-nums tracking-wide">
              5.0
              <span className="mx-1.5 text-border/60">·</span>
              {t('testimonials.reviewCount', { count: TESTIMONIAL_IMAGES.length })}
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
        ref={containerRef}
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
            speed={shouldReduceMotion ? 999999 : 55}
            paused={effectivePaused}
            onClickItem={setZoomedIndex}
            globalIndexOffset={0}
            shouldReduceMotion={shouldReduceMotion}
          />

          {/* Row 2 — scrolls right */}
          <MarqueeRow
            items={ROW_2}
            direction="right"
            speed={shouldReduceMotion ? 999999 : 65}
            paused={effectivePaused}
            onClickItem={setZoomedIndex}
            globalIndexOffset={7}
            shouldReduceMotion={shouldReduceMotion}
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

      {/* Zoom dialog */}
      <Dialog open={zoomedIndex !== null} onOpenChange={(isOpen) => !isOpen && setZoomedIndex(null)}>
        <DialogContent className="max-h-[95vh] max-w-[95vw] sm:max-w-2xl border-border/70 bg-card/95 backdrop-blur-md p-3 md:p-5">
          <DialogTitle className="sr-only">Testimonial image preview</DialogTitle>
          {zoomedTestimonial && (
            <div className="relative">
              <div className="flex max-h-[85vh] items-center justify-center overflow-auto">
                <img
                  src={zoomedTestimonial.src}
                  alt={zoomedTestimonial.alt}
                  width={zoomedTestimonial.width}
                  height={zoomedTestimonial.height}
                  className="h-auto max-h-[85vh] w-auto max-w-full rounded-lg object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>

              {/* Navigation inside dialog */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                <button
                  type="button"
                  onClick={() =>
                    setZoomedIndex((prev) =>
                      prev !== null ? (prev - 1 + TESTIMONIAL_IMAGES.length) % TESTIMONIAL_IMAGES.length : null,
                    )
                  }
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted/30"
                  aria-label={t('testimonials.ariaPrev')}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  <span className="hidden sm:inline">{t('testimonials.ariaPrev')}</span>
                </button>

                <span className="text-xs tabular-nums text-muted-foreground/60">
                  {(zoomedIndex ?? 0) + 1} / {TESTIMONIAL_IMAGES.length}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setZoomedIndex((prev) =>
                      prev !== null ? (prev + 1) % TESTIMONIAL_IMAGES.length : null,
                    )
                  }
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted/30"
                  aria-label={t('testimonials.ariaNext')}
                >
                  <span className="hidden sm:inline">{t('testimonials.ariaNext')}</span>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Testimonials;
