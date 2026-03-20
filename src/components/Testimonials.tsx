import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
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
  { id: 1, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8667.PNG', alt: 'Original testimonial screenshot 1', width: 1284, height: 488 },
  { id: 2, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8668.PNG', alt: 'Original testimonial screenshot 2', width: 1284, height: 791 },
  { id: 3, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8669.PNG', alt: 'Original testimonial screenshot 3', width: 1284, height: 853 },
  { id: 4, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8670.PNG', alt: 'Original testimonial screenshot 4', width: 1284, height: 689 },
  { id: 5, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8671.PNG', alt: 'Original testimonial screenshot 5', width: 1284, height: 970 },
  { id: 6, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8672.PNG', alt: 'Original testimonial screenshot 6', width: 1284, height: 945 },
  { id: 7, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8673.PNG', alt: 'Original testimonial screenshot 7', width: 1284, height: 724 },
  { id: 8, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8674.PNG', alt: 'Original testimonial screenshot 8', width: 1284, height: 838 },
  { id: 9, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8675.PNG', alt: 'Original testimonial screenshot 9', width: 1284, height: 635 },
  { id: 10, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8676.PNG', alt: 'Original testimonial screenshot 10', width: 1284, height: 718 },
  { id: 11, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8677.PNG', alt: 'Original testimonial screenshot 11', width: 1284, height: 842 },
  { id: 12, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8678.PNG', alt: 'Original testimonial screenshot 12', width: 1284, height: 707 },
  { id: 13, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8679.PNG', alt: 'Original testimonial screenshot 13', width: 1284, height: 603 },
  { id: 14, src: '/uploads/videos/testimonials/drive-download-20260304T151957Z-1-001/IMG_8680.PNG', alt: 'Original testimonial screenshot 14', width: 1284, height: 1054 },
];

const INITIAL_VISIBLE = 8;

const Testimonials = () => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const zoomedTestimonial = zoomedIndex === null ? null : TESTIMONIAL_IMAGES[zoomedIndex];
  const visibleImages = showAll ? TESTIMONIAL_IMAGES : TESTIMONIAL_IMAGES.slice(0, INITIAL_VISIBLE);

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
        </motion.div>

        <motion.div
          className="studio-rule mb-8 md:mb-10"
          initial={{ opacity: 0, scaleX: 0.7 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.62 }}
        />

        {/* Masonry wall — CSS columns for true masonry without JS */}
        <div className="columns-2 md:columns-3 gap-3 md:gap-4">
          {visibleImages.map((testimonial, index) => (
            <motion.button
              key={testimonial.id}
              type="button"
              onClick={() => setZoomedIndex(index)}
              className="group mb-3 md:mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-border/60 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Open testimonial image ${index + 1}`}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: index * 0.04 }}
            >
              <img
                src={testimonial.src}
                alt={testimonial.alt}
                width={testimonial.width}
                height={testimonial.height}
                className="w-full h-auto object-contain"
                loading={index < 6 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </motion.button>
          ))}
        </div>

        {/* Show all / show less toggle */}
        {TESTIMONIAL_IMAGES.length > INITIAL_VISIBLE && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/60 px-6 py-2.5 text-[10px] font-bold uppercase tracking-prestige text-foreground/60 transition-all duration-200 hover:border-primary/30 hover:text-foreground/80"
            >
              {showAll
                ? t('testimonials.showLess', { defaultValue: 'Show less' })
                : t('testimonials.showAll', { defaultValue: `Show all ${TESTIMONIAL_IMAGES.length}` })}
            </button>
          </div>
        )}
      </div>

      {/* Zoom dialog — preserved from original */}
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
